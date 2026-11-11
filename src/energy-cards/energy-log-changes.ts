import type { HassEntity } from "../types";
import { historyRows } from "../energy-monitor/data";
import { timestamp } from "./data";
import type { EnergyLogConfig, EnergyLogEntry, EnergyLogSource } from "./energy-log-config";

type State = Pick<HassEntity, "state" | "attributes" | "last_updated" | "last_changed">;
type States = Record<string, State>;

function value(state: State, field?: string): unknown {
  if (!field || ["unknown", "unavailable"].includes(state.state)) return state.state;
  return field.split(".").reduce<unknown>((current, key) =>
    current && typeof current === "object" ? Reflect.get(current, key) : undefined, state.attributes);
}

function stable(value: unknown): string {
  return JSON.stringify(value, (_key, item) => item && typeof item === "object" && !Array.isArray(item)
    ? Object.fromEntries(Object.keys(item).sort().map(key => [key, Reflect.get(item, key)])) : item);
}

function change(config: EnergyLogConfig, source: EnergyLogSource, before: State, after: State, time: number): EnergyLogEntry | undefined {
  const previous = value(before, source.field), next = value(after, source.field);
  if (previous === undefined || next === undefined || stable(previous) === stable(next)) return;
  const category = config.categories.find(category => category.id === source.category);
  if (!category) return;
  const text = (value: unknown) => {
    const full = typeof value === "string" ? value : stable(value);
    return full.length > 500 ? `${full.slice(0, 500)}...` : full;
  };
  return {
    id: `${source.id}:${time}:${stable(previous)}:${stable(next)}`,
    timestamp: time,
    category,
    title: source.name || String(after.attributes.friendly_name || source.entity),
    detail: `${text(previous)} \u2192 ${text(next)}`,
    description: source.field || "",
    source: source.entity,
  };
}

export function liveEntityChanges(config: EnergyLogConfig, before: States, after: States, start: number, end: number): EnergyLogEntry[] {
  return config.sources.flatMap(source => {
    if (source.adapter !== "changes") return [];
    const previous = before[source.entity], next = after[source.entity];
    if (!previous || !next) return [];
    const time = timestamp(next.last_updated ?? next.last_changed);
    if (time === undefined || !Number.isFinite(new Date(time).getTime()) || time < start || time > end) return [];
    const entry = change(config, source, previous, next, time);
    return entry ? [entry] : [];
  });
}

export function recordedEntityChanges(config: EnergyLogConfig, response: unknown, start: number, end: number) {
  const entries: EnergyLogEntry[] = [], errors: string[] = [];
  for (const source of config.sources.filter(source => source.adapter === "changes")) {
    try {
      const rows = historyRows(response, source.entity).map(raw => {
        const row = raw as Record<string, unknown>, state = row.state ?? row.s;
        const time = timestamp(row.last_updated ?? row.lu ?? row.last_changed ?? row.lc);
        const attributes = row.attributes ?? row.a ?? {};
        if (typeof state !== "string" || time === undefined || !Number.isFinite(new Date(time).getTime())
          || !attributes || typeof attributes !== "object" || Array.isArray(attributes)) {
          throw new Error(`${source.entity}: invalid Recorder state or timestamp.`);
        }
        return { time, state, attributes: attributes as Record<string, unknown> };
      }).sort((a, b) => a.time - b.time);
      if (rows.some(row => value(row, source.field) === undefined)) {
        errors.push(`${source.entity}: the selected attribute is missing from some recorded states; those gaps cannot be reconstructed.`);
      }
      for (let i = 1; i < rows.length; i++) {
        const next = rows[i];
        if (next.time < start || next.time > end) continue;
        const entry = change(config, source, rows[i - 1], next, next.time);
        if (entry) entries.push(entry);
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
  return { entries, errors };
}

export function mergeLogEntries(config: EnergyLogConfig, entries: EnergyLogEntry[], start = -Infinity): EnergyLogEntry[] {
  const direction = config.sortOrder === "oldest" ? 1 : -1;
  return [...new Map(entries.filter(entry => entry.timestamp >= start).map(entry => [entry.id, entry])).values()]
    .sort((a, b) => direction * (a.timestamp - b.timestamp))
    .slice(0, config.limit ?? 50);
}
