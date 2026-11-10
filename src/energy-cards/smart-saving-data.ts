import { parseBlocks, parseIntervals, parsePoints, readPath } from "./data";
import type { FieldMapping, HassEntity, TimeInterval, TimePoint } from "./types";

export const MAX_SOURCE_ITEMS = 10_000;

export function sourceAvailable(entity?: HassEntity): boolean {
  return !!entity && !["unknown", "unavailable"].includes(entity.state);
}

export function sourceHealth(entity: HassEntity | undefined, now: number, maxAgeMinutes: number): string | undefined {
  if (!entity) return "Source missing";
  if (!sourceAvailable(entity)) return "Unavailable";
  const updated = Date.parse(entity.last_updated ?? "");
  if (!Number.isFinite(updated) || updated > now + 60_000) return "Not specified";
  return now - updated > maxAgeMinutes * 60_000 ? "Stale data source" : undefined;
}

function rootCount(root: unknown, arrayOnly = false): number | undefined {
  if (Array.isArray(root)) return root.length <= MAX_SOURCE_ITEMS ? root.length : undefined;
  return !arrayOnly && root !== null && typeof root === "object" ? 1 : undefined;
}

function noOverlap(intervals: TimeInterval[]): boolean {
  return intervals.every((item, index) => !index || item.start >= intervals[index - 1].end);
}

export function strictIntervals(entity: HassEntity | undefined, mapping: FieldMapping, field?: string, override?: unknown) {
  const count = rootCount(readPath(override === undefined ? entity?.attributes : override, mapping.path));
  if (!sourceAvailable(entity) || count === undefined) return { valid: false, items: [] as TimeInterval[] };
  const items = parseIntervals(entity, mapping, field, override).sort((a, b) => a.start - b.start);
  const valid = items.length === count && noOverlap(items)
    && items.every(item => Number.isFinite(item.end) && Math.abs(item.start) <= 8.64e15 && Math.abs(item.end) <= 8.64e15);
  return { valid, items: valid ? items : [] };
}

export function strictBlocks(entity: HassEntity | undefined, mapping: FieldMapping) {
  const count = rootCount(readPath(entity?.attributes, mapping.path), true);
  const parsed = count !== undefined && sourceAvailable(entity) ? parseBlocks(entity, mapping) : undefined;
  const items = parsed?.blocks.sort((a, b) => a.start - b.start) ?? [];
  const valid = !!parsed && items.length === count && noOverlap(items)
    && items.every(item => Number.isFinite(item.end) && Math.abs(item.start) <= 8.64e15 && Math.abs(item.end) <= 8.64e15);
  return { valid, items: valid ? items : [] };
}

export function strictForecast(entity: HassEntity | undefined, mapping: FieldMapping) {
  const count = rootCount(readPath(entity?.attributes, mapping.path));
  const items = count !== undefined && sourceAvailable(entity) ? parsePoints(entity, mapping) : [];
  const valid = count !== undefined && sourceAvailable(entity) && items.length === count
    && items.every((point, index) => point.value >= 0 && point.value <= 100
      && Math.abs(point.time) <= 8.64e15 && (!index || point.time > items[index - 1].time));
  return { valid, items: valid ? items : [] };
}

export function coverageGaps(intervals: Pick<TimeInterval, "start" | "end">[], start: number, end: number) {
  const gaps: Array<{ start: number; end: number }> = [];
  let cursor = start;
  for (const interval of [...intervals].sort((a, b) => a.start - b.start)) {
    if (interval.end <= cursor || interval.start >= end) continue;
    if (interval.start > cursor) gaps.push({ start: cursor, end: interval.start });
    cursor = Math.min(end, interval.end);
  }
  if (cursor < end) gaps.push({ start: cursor, end });
  return gaps;
}

export function forecastSegments(points: TimePoint[], maxGapMinutes: number): TimePoint[][] {
  const segments: TimePoint[][] = [];
  for (const point of points) {
    const previous = segments.at(-1)?.at(-1);
    if (!previous || point.time - previous.time > maxGapMinutes * 60_000) segments.push([point]);
    else segments[segments.length - 1].push(point);
  }
  return segments;
}

export function visibleForecastSegments(points: TimePoint[], maxGapMinutes: number, start: number, end: number): TimePoint[][] {
  return forecastSegments(points, maxGapMinutes)
    .filter(segment => segment[0].time <= end && segment.at(-1)!.time >= start)
    .map(segment => {
      const first = Math.max(0, segment.findIndex(point => point.time >= start) - 1);
      const after = segment.findIndex(point => point.time > end);
      return segment.slice(first, after < 0 ? undefined : after + 1);
    });
}
