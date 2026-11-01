import type {
  FieldMapping,
  HassEntity,
  PeriodAverage,
  PeriodConfig,
  ScheduleBlock,
  TimeInterval,
  TimePoint,
} from "./types";

export function readPath(value: unknown, path?: string): unknown {
  if (!path) return value;
  return path.split(".").reduce<unknown>((current, segment) => {
    if (current && typeof current === "object") {
      return (current as Record<string, unknown>)[segment];
    }
    return undefined;
  }, value);
}

export function numeric(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value.replace(",", "."));
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

export function timestamp(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value < 10_000_000_000 ? value * 1000 : value;
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function sourceList(entity: HassEntity, mapping: FieldMapping, overrideRoot?: unknown): unknown[] {
  const source = overrideRoot !== undefined ? overrideRoot : entity.attributes;
  const root = mapping.path ? readPath(source, mapping.path) : source;
  if (Array.isArray(root)) return root;
  if (root && typeof root === "object") return [root];
  return [];
}

function getField(item: unknown, field?: string): unknown {
  return field ? readPath(item, field) : undefined;
}

export function parseIntervals(
  entity: HassEntity | undefined,
  mapping: FieldMapping,
  valueField = mapping.valueField ?? mapping.priceField,
  overrideRoot?: unknown,
): TimeInterval[] {
  if (!entity) return [];
  return sourceList(entity, mapping, overrideRoot).flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const item = raw as Record<string, unknown>;
    const start = timestamp(getField(item, mapping.startField));
    const endValue = timestamp(getField(item, mapping.endField));
    const duration = numeric(getField(item, mapping.durationField));
    const end = endValue ?? (start !== undefined && duration !== undefined
      ? start + duration * 60_000
      : undefined);
    const value = numeric(getField(item, valueField));
    if (start === undefined || end === undefined || end <= start || value === undefined) return [];
    return [{ start, end, value, source: item }];
  });
}

export function parsePoints(
  entity: HassEntity | undefined,
  mapping: FieldMapping,
): TimePoint[] {
  if (!entity) return [];
  return sourceList(entity, mapping).flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const time = timestamp(getField(raw, mapping.startField));
    const value = numeric(getField(raw, mapping.valueField));
    return time !== undefined && value !== undefined ? [{ time, value }] : [];
  }).sort((a, b) => a.time - b.time);
}

export function clipIntervals(
  intervals: TimeInterval[],
  windowStart: number,
  windowEnd: number,
): TimeInterval[] {
  return intervals.flatMap((interval) => {
    const start = Math.max(interval.start, windowStart);
    const end = Math.min(interval.end, windowEnd);
    return end > start ? [{ ...interval, start, end }] : [];
  });
}

export function weightedAverage(intervals: TimeInterval[]): number | null {
  const duration = intervals.reduce((sum, item) => sum + item.end - item.start, 0);
  if (!duration) return null;
  return intervals.reduce((sum, item) => sum + item.value * (item.end - item.start), 0) / duration;
}

export function convertPrice(
  value: number,
  sourceUnit: "EUR/kWh" | "ct/kWh" = "EUR/kWh",
  displayUnit: "EUR/kWh" | "ct/kWh" = sourceUnit,
): number {
  if (sourceUnit === displayUnit) return value;
  return sourceUnit === "EUR/kWh" ? value * 100 : value / 100;
}

export function parseBlocks(
  entity: HassEntity | undefined,
  mapping: FieldMapping,
): { validSource: boolean; blocks: ScheduleBlock[] } {
  if (!entity) return { validSource: false, blocks: [] };
  const root = mapping.path ? readPath(entity.attributes, mapping.path) : entity.attributes;
  if (!Array.isArray(root)) return { validSource: false, blocks: [] };
  const blocks = root.flatMap((raw) => {
    if (!raw || typeof raw !== "object") return [];
    const start = timestamp(getField(raw, mapping.startField));
    const explicitEnd = timestamp(getField(raw, mapping.endField));
    const duration = numeric(getField(raw, mapping.durationField));
    const end = explicitEnd ?? (start !== undefined && duration !== undefined
      ? start + duration * 60_000
      : undefined);
    if (start === undefined || end === undefined || end <= start) return [];
    return [{
      start,
      end,
      value: numeric(getField(raw, mapping.valueField)) ?? 1,
      power: getField(raw, mapping.powerField) as string | number | undefined,
      energy: getField(raw, mapping.energyField) as string | number | undefined,
      status: String(getField(raw, mapping.statusField) ?? ""),
      source: raw as Record<string, unknown>,
    }];
  });
  return { validSource: root.length === 0 || blocks.length > 0, blocks };
}

function localDateKey(time: number): string {
  const date = new Date(time);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function localDayStart(time: number): number {
  const date = new Date(time);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function addLocalDay(time: number): number {
  const date = new Date(time);
  date.setDate(date.getDate() + 1);
  return date.getTime();
}

function localHour(day: number, hour: number): number {
  const date = new Date(day);
  if (hour === 24) {
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);
  } else {
    date.setHours(hour, 0, 0, 0);
  }
  return date.getTime();
}

export function buildPeriodAverages(
  intervals: TimeInterval[],
  windowStart: number,
  windowEnd: number,
  periods: PeriodConfig[],
): PeriodAverage[] {
  if (windowEnd <= windowStart) return [];
  const results: PeriodAverage[] = [];
  const firstDay = localDayStart(windowStart);
  const previousDay = new Date(firstDay);
  previousDay.setDate(previousDay.getDate() - 1);
  for (const period of periods.filter((item) => item.endHour <= item.startHour)) {
    const start = localHour(previousDay.getTime(), period.startHour);
    const end = localHour(firstDay, period.endHour);
    if (end > windowStart && start < windowEnd) {
      results.push(createPeriodAverage(intervals, windowStart, windowEnd, period, start, end));
    }
  }
  for (let day = firstDay; day < windowEnd; day = addLocalDay(day)) {
    for (const period of periods) {
      const start = localHour(day, period.startHour);
      const endDay = period.endHour <= period.startHour ? addLocalDay(day) : day;
      const end = localHour(endDay, period.endHour);
      results.push(createPeriodAverage(intervals, windowStart, windowEnd, period, start, end));
    }
  }
  return results;
}

function createPeriodAverage(
  intervals: TimeInterval[],
  windowStart: number,
  windowEnd: number,
  period: PeriodConfig,
  start: number,
  end: number,
): PeriodAverage {
  const visibleStart = Math.max(start, windowStart);
  const visibleEnd = Math.min(end, windowEnd);
  const relevant = clipIntervals(intervals, visibleStart, visibleEnd);
  const average = weightedAverage(relevant);
  const coveredMs = relevant.reduce((sum, item) => sum + item.end - item.start, 0);
  const expectedMs = Math.max(0, visibleEnd - visibleStart);
  return {
    name: period.name,
    date: localDateKey(start),
    average,
    minimum: relevant.length ? Math.min(...relevant.map((item) => item.value)) : null,
    maximum: relevant.length ? Math.max(...relevant.map((item) => item.value)) : null,
    coverage: average === null
      ? "missing"
      : coveredMs + 1_000 < expectedMs ? "partial" : "complete",
  };
}
