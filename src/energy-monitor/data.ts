import type { HomeAssistant } from "../types";
import { numeric, readPath, timestamp } from "../energy-cards/data";
import { sourceHealth, strictIntervals } from "../energy-cards/smart-saving-data";
import { insightsDefaults, type MeterSource } from "../energy-insights/config";
import { readMeteredActuals, type MeterInterval } from "../energy-insights/data";
import type { LiveSource, MonitorKind, MonitorOptions } from "./config";

export interface Reading { value?: number; error?: string; updated?: number; absent?: boolean; }
export interface Sample { time: number; value?: number; }
export interface Span { start: number; end: number; value: number; }
export interface Series { points: Sample[]; spans: Span[]; error?: string; missingMs: number; }
export interface Counter { total?: number; spans: Span[]; error?: string; notes: string[]; }
export interface Comparison { intervals: Array<{ start: number; end: number; planned: number; actual: number }>; planned: number; actual: number; coveredMs: number; missingMs: number; error?: string; generated?: number; }

export function reading(hass: HomeAssistant | undefined, source: LiveSource, now: number, maxAge: number, kind: "power" | "soc" = "power"): Reading {
  if (source.absent) return { value: 0, absent: true };
  const entity = hass?.states[source.entity ?? ""];
  const health = sourceHealth(entity, now, maxAge);
  if (health) return { error: health };
  const raw = numeric(source.field ? readPath(entity!.attributes, source.field) : entity!.state);
  const unit = String(entity!.attributes.unit_of_measurement ?? "");
  const factor = kind === "soc" ? unit === "%" ? 1 : undefined : unit === "W" ? .001 : unit === "kW" ? 1 : undefined;
  if (raw === undefined || factor === undefined || kind === "soc" && (raw < 0 || raw > 100)) return { error: "Invalid data source or field mapping" };
  return { value: Object.is(raw * factor, -0) ? 0 : raw * factor, updated: timestamp(entity!.last_updated) };
}

export function flowReadings(hass: HomeAssistant | undefined, options: MonitorOptions, now = Date.now()) {
  const solar = reading(hass, options.solar, now, options.maxAgeMinutes);
  const grid = reading(hass, options.grid, now, options.maxAgeMinutes);
  const battery = reading(hass, options.battery, now, options.maxAgeMinutes);
  const ev = reading(hass, options.ev, now, options.maxAgeMinutes);
  const solarToEv = reading(hass, options.solarToEv, now, options.maxAgeMinutes);
  const batteryToEv = reading(hass, options.batteryToEv, now, options.maxAgeMinutes);
  for (const source of [solar, ev, solarToEv, batteryToEv]) {
    if (source.value !== undefined && source.value < 0) { source.value = undefined; source.error = "Invalid data source or field mapping"; }
  }
  if (grid.value && options.gridPositive === "export") grid.value *= -1;
  if (battery.value && options.batteryPositive === "discharge") battery.value *= -1;
  let home = reading(hass, options.home, now, options.maxAgeMinutes);
  if (options.deriveHome && options.homeBoundary === "excludes_battery_charging") {
    const value = solar.value !== undefined && grid.value !== undefined && battery.value !== undefined ? solar.value + grid.value - battery.value : undefined;
    home = value === undefined ? { error: "Source missing" } : value < -.01 ? { error: "Energy balance mismatch" } : { value: Math.max(0, value) };
  } else if (home.value !== undefined && home.value < 0) home = { error: "Invalid data source or field mapping" };
  const residual = solar.value !== undefined && grid.value !== undefined && battery.value !== undefined && home.value !== undefined
    ? solar.value + grid.value - battery.value - home.value : undefined;
  return { solar, grid, battery, home, ev, solarToEv, batteryToEv, residual,
    mismatch: residual !== undefined && Math.abs(residual) > Math.max(.1, Math.abs(home.value ?? 0) * .05) };
}

export function historyIds(kind: MonitorKind | "battery_activity" | "energy_plan_actual" | "electricity_cost_timeline", options: MonitorOptions): string[] {
  const sources = kind === "battery_activity" ? [options.battery, options.soc, options.chargeEnergy, options.dischargeEnergy]
    : kind === "energy_plan_actual" ? [options.actualEnergy]
      : kind === "electricity_cost_timeline" ? [options.importEnergy, options.exportEnergy, options.importRate, options.exportRate] : [];
  return [...new Set(sources.flatMap(source => source.entity ? [source.entity] : []))];
}

export function historyRows(response: unknown, entityId: string): unknown[] {
  if (!response || typeof response !== "object") throw new Error("Invalid Recorder history response");
  const groups = Array.isArray(response) ? response : Object.values(response);
  if (groups.length > 8) throw new Error("Too many Recorder history groups");
  let count = 0, result: unknown[] | undefined;
  for (const [index, raw] of groups.entries()) {
    if (!Array.isArray(raw)) throw new Error("Invalid Recorder history group");
    count += raw.length;
    if (raw.length > 50000 || count > 100000) throw new Error("Recorder history exceeds the state limit");
    const key = Array.isArray(response) ? undefined : Object.keys(response)[index];
    const id = key ?? (raw[0] && typeof raw[0] === "object" ? raw[0].entity_id : undefined);
    if (id !== entityId) continue;
    if (result) throw new Error("Duplicate Recorder history group");
    if (raw.some(row => !row || typeof row !== "object" || row.entity_id !== undefined && row.entity_id !== id)) throw new Error("Invalid Recorder history row");
    result = raw;
  }
  return result ?? [];
}

export function sampleSeries(hass: HomeAssistant, source: LiveSource, response: unknown, start: number, end: number, gapMinutes: number, kind: "power" | "soc"): Series {
  const empty = (error: string): Series => ({ points: [], spans: [], error, missingMs: end - start });
  if (!source.entity) return empty("Source missing");
  const entity = hass.states[source.entity];
  if (!entity) return empty("Source missing");
  let rows: unknown[];
  try { rows = historyRows(response, source.entity); }
  catch (error) { return empty(error instanceof Error ? error.message : String(error)); }
  const points: Sample[] = [];
  const unit = String(entity.attributes.unit_of_measurement ?? "");
  const factor = kind === "power" ? unit === "W" ? .001 : unit === "kW" ? 1 : undefined : unit === "%" ? 1 : undefined;
  if (factor === undefined) return empty("Invalid data source or field mapping");
  for (const raw of rows) {
    const row = raw as Record<string, unknown>, attrs = (row.attributes ?? row.a ?? {}) as Record<string, unknown>;
    const time = timestamp(row.last_updated ?? row.last_changed ?? row.lu ?? row.lc);
    if (time === undefined || !Number.isFinite(time)) return empty("Invalid Recorder history timestamp");
    if (time > end) continue;
    if (attrs.unit_of_measurement !== undefined && attrs.unit_of_measurement !== unit) return empty("Recorder history unit changed");
    const state = row.state ?? row.s;
    const value = ["unavailable", "unknown"].includes(String(state)) ? undefined : numeric(source.field ? readPath(attrs, source.field) : state);
    points.push({ time, value: value === undefined || kind === "soc" && (value < 0 || value > 100) ? undefined : value * factor });
  }
  points.sort((a, b) => a.time - b.time);
  if (points.some((point, index) => index > 0 && point.time === points[index - 1].time && point.value !== points[index - 1].value)) return empty("Conflicting Recorder history timestamps");
  const unique = [...new Map(points.map(point => [point.time, point])).values()];
  const spans: Span[] = [];
  for (let i = 0; i < unique.length - 1; i++) {
    const point = unique[i], next = unique[i + 1];
    const left = Math.max(start, point.time), right = Math.min(end, next.time);
    if (point.value === undefined || next.value === undefined || next.time - point.time > gapMinutes * 60000 || right <= left) continue;
    spans.push({ start: left, end: right, value: point.value });
  }
  return { points: unique.filter(point => point.time >= start), spans,
    missingMs: Math.max(0, end - start - spans.reduce((sum, span) => sum + span.end - span.start, 0)) };
}

export function counterHistory(hass: HomeAssistant, source: MeterSource, response: unknown, end: number): Counter {
  if (!source.entity) return { error: "Source missing", spans: [], notes: [] };
  const options = insightsDefaults();
  options.metered = { solar: { absent: true }, gridImport: source, gridExport: { absent: true },
    batteryCharge: { absent: true }, batteryDischarge: { absent: true }, importRate: {}, exportRate: {} };
  const result = readMeteredActuals(hass, options, response, end, true);
  if (!result.value) return { error: result.error, spans: [], notes: [] };
  const value = result.value;
  return {
    total: value.imported, error: value.coverage?.find(row => row.id === "gridImport")?.error,
    spans: value.intervals.filter(row => row.imported > 0 || row.exported === 0)
      .map(row => ({ start: row.start, end: row.end, value: row.imported })),
    notes: (value.approximations ?? []).filter(note => note.startsWith("gridImport:") || note.includes("held")),
  };
}

export function costHistory(hass: HomeAssistant, options: MonitorOptions, response: unknown, end: number) {
  const insights = insightsDefaults();
  insights.currency = options.currency;
  insights.fixedExportRate = options.fixedExportRate;
  insights.metered = {
    solar: { absent: true }, batteryCharge: { absent: true }, batteryDischarge: { absent: true },
    gridImport: options.importEnergy, gridExport: options.exportEnergy, importRate: options.importRate, exportRate: options.exportRate,
  };
  const result = readMeteredActuals(hass, insights, response, end);
  if (result.value && options.exportEnergy.absent) result.value.exportCredit = 0;
  return result;
}

export function costValue(interval: MeterInterval): number | undefined {
  if (interval.imported > 0) return interval.rate === undefined ? undefined : interval.imported * interval.rate;
  if (interval.exported > 0) return interval.exportRate === undefined ? undefined : -interval.exported * interval.exportRate;
  return 0;
}

export function compareBaseline(hass: HomeAssistant, options: MonitorOptions, measured: Counter, start: number, end: number): Comparison {
  const empty = (error: string): Comparison => ({ intervals: [], planned: 0, actual: 0, coveredMs: 0, missingMs: end - start, error });
  const source = options.baseline, entity = hass.states[source.entity ?? ""];
  if (!entity || ["unavailable", "unknown"].includes(entity.state)) return empty("Retained baseline missing");
  const generated = timestamp(readPath(entity.attributes, source.generatedField || "generated"));
  if (generated === undefined || generated > start) return empty("Baseline must predate the comparison period");
  const parsed = strictIntervals(entity, {
    path: source.path || "intervals", startField: source.startField || "start", endField: source.endField || "end",
  }, source.valueField || "energy");
  if (!parsed.valid || !parsed.items.length || parsed.items.some(item => item.value < 0 || item.start < generated)) return empty("Invalid retained baseline");
  if (measured.error || measured.total === undefined) return empty(measured.error || "Measured history missing");
  const intervals: Comparison["intervals"] = [];
  let actualIndex = 0;
  for (const plan of parsed.items) {
    while (actualIndex < measured.spans.length && measured.spans[actualIndex].end <= plan.start) actualIndex++;
    for (let i = actualIndex; i < measured.spans.length && measured.spans[i].start < plan.end; i++) {
      const actual = measured.spans[i], left = Math.max(start, plan.start, actual.start), right = Math.min(end, plan.end, actual.end);
      if (right <= left) continue;
      if (intervals.length >= 100000) return empty("Too many comparison intervals");
      intervals.push({ start: left, end: right,
        planned: plan.value * (source.unit === "Wh" ? .001 : 1) * (right - left) / (plan.end - plan.start),
        actual: actual.value * (right - left) / (actual.end - actual.start) });
    }
  }
  const coveredMs = intervals.reduce((sum, item) => sum + item.end - item.start, 0);
  return { intervals, generated, planned: intervals.reduce((sum, item) => sum + item.planned, 0),
    actual: intervals.reduce((sum, item) => sum + item.actual, 0), coveredMs, missingMs: Math.max(0, end - start - coveredMs) };
}

export function checkedSnapshot(snapshot: HomeAssistant, live: HomeAssistant, ids: string[]): HomeAssistant {
  const states = { ...snapshot.states };
  for (const id of ids) {
    const entity = live.states[id];
    if (!entity || ["unknown", "unavailable"].includes(entity.state) ||
      entity.attributes.unit_of_measurement !== states[id]?.attributes.unit_of_measurement) {
      const previous = entity ?? states[id];
      if (previous) states[id] = { ...previous, state: "unavailable" };
      else delete states[id];
    }
  }
  return { ...snapshot, states };
}
