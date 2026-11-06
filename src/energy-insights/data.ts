import type { HomeAssistant } from "../types";
import { numeric, readPath, timestamp } from "../energy-cards/data";
import type { EnergyInsightsOptions, InsightsSource } from "./config";

export type SourceResult<T> = { value: T; error?: never } | { error: string; value?: never };
export interface MeterInterval {
  start: number;
  end: number;
  imported: number;
  exported: number;
  rate: number;
  exportRate: number;
}
export interface Actuals {
  start: number;
  end: number;
  generated: number;
  home: number;
  solar: number;
  batteryCharge: number;
  batteryDischarge: number;
  imported: number;
  exported: number;
  importCost: number;
  exportCredit: number;
  buckets: Array<{ rate: number; quantity: number; cost: number }>;
  intervals: MeterInterval[];
  consumers: Array<{ id: string; energy: number; baseline?: number }>;
  remainder: number;
}
export interface PurchaseBlock {
  start: number;
  end: number;
  home: number;
  ev: number;
  battery: number;
  quantity: number;
  rate: number;
  cost: number;
  target?: number;
  reason: string;
  detail: string;
}
export interface PurchasePlan {
  start: number;
  end: number;
  generated: number;
  home: number;
  solar: number;
  batteryMin: number;
  reserve: number;
  efficiency: number;
  quantity: number;
  cost: number;
  blocks: PurchaseBlock[];
  consumers: Array<{ id: string; energy?: number; strategy?: string }>;
}

class SourceError extends Error {}
const fail = (field: string): never => { throw new SourceError(`Invalid data source or field mapping: ${field}`); };
const object = (value: unknown, field: string): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : fail(field);
function number(root: Record<string, unknown>, field: string, min = 0, max = 1000000000): number {
  const value = numeric(readPath(root, field));
  return value !== undefined && value >= min && value <= max ? value : fail(field);
}
function instant(root: Record<string, unknown>, field: string): number {
  const value = timestamp(readPath(root, field));
  return value !== undefined && Number.isFinite(new Date(value).getTime()) ? value : fail(field);
}
function text(root: Record<string, unknown>, field: string): string {
  const value = readPath(root, field);
  return typeof value === "string" ? value : fail(field);
}
function list(root: Record<string, unknown>, field: string): unknown[] {
  const value = root[field];
  return Array.isArray(value) && value.length <= 10000 ? value : fail(field);
}
function source<T>(hass: HomeAssistant | undefined, config: InsightsSource, options: EnergyInsightsOptions,
  now: number, parse: (root: Record<string, unknown>, start: number, end: number, generated: number) => T): SourceResult<T> {
  const entity = hass?.states[config.entity ?? ""];
  if (!entity || ["unknown", "unavailable"].includes(entity.state)) return { error: "Source missing" };
  try {
    const raw = object(readPath(entity.attributes, config.path), "snapshot");
    const root = { ...raw };
    for (const [field, path] of Object.entries(config.fields ?? {})) {
      if (!field.startsWith("interval_") && !field.startsWith("block_")) root[field] = readPath(raw, path);
    }
    for (const [key, prefix] of [["intervals", "interval_"], ["blocks", "block_"]] as const) {
      if (!Array.isArray(root[key])) continue;
      if (root[key].length > 10000) fail(key);
      root[key] = root[key].map(item => {
        const row = object(item, key), mapped = { ...row };
        for (const [field, path] of Object.entries(config.fields ?? {})) {
          if (field.startsWith(prefix)) mapped[field.slice(prefix.length)] = readPath(row, path);
        }
        return mapped;
      });
    }
    const start = instant(root, "start"), end = instant(root, "end"), generated = instant(root, "generated_at");
    if (end <= start) fail("window");
    const currency = options.currency || hass?.config?.currency;
    if (!currency || !/^[A-Z]{3}$/.test(currency)) return { error: "Currency not configured" };
    if (root.currency !== undefined && root.currency !== currency) fail("currency mismatch (no currency conversion)");
    if (generated > now + 60000 || now - generated > options.maxAgeMinutes * 60000) return { error: "Stale data source" };
    return { value: parse(root, start, end, generated) };
  } catch (error) {
    if (!(error instanceof SourceError)) throw error;
    return { error: error.message };
  }
}

export function readActuals(hass: HomeAssistant | undefined, options: EnergyInsightsOptions, now = Date.now()): SourceResult<Actuals> {
  return source(hass, options.actualSource, options, now, (root, start, end, generated) => {
    if (end > now + 60000 || end > generated + 60000 || now - end > options.maxAgeMinutes * 60000) fail("actual window");
    const home = number(root, "home_kwh"), solar = number(root, "solar_kwh");
    const batteryCharge = number(root, "battery_charge_kwh"), batteryDischarge = number(root, "battery_discharge_kwh");
    const intervals = list(root, "intervals").map(raw => {
      const item = object(raw, "interval");
      return {
        start: instant(item, "start"), end: instant(item, "end"),
        imported: number(item, "import_kwh"), exported: number(item, "export_kwh"),
        rate: number(item, "rate", -1000000, 1000000),
        exportRate: number(item, "export_rate", -1000000, 1000000),
      };
    }).sort((a, b) => a.start - b.start);
    if (!intervals.length || intervals[0].start !== start || intervals.at(-1)!.end !== end ||
      intervals.some((item, index) => item.end <= item.start || index > 0 && item.start !== intervals[index - 1].end)) fail("incomplete or overlapping metered intervals");
    const consumers = options.consumers.map(consumer => {
      const energy = number(root, consumer.energyField);
      let baseline: number | undefined;
      if (consumer.baselineField) {
        if (instant(root, "baseline_start") !== start || instant(root, "baseline_end") !== end) fail("baseline window");
        baseline = number(root, consumer.baselineField);
      }
      return { id: consumer.id, energy, baseline };
    });
    const remainder = home - consumers.reduce((sum, item) => sum + item.energy, 0);
    if (remainder < -0.001) fail("consumer total exceeds household energy");
    const imported = intervals.reduce((sum, item) => sum + item.imported, 0);
    const exported = intervals.reduce((sum, item) => sum + item.exported, 0);
    if (Math.abs(solar + imported + batteryDischarge - home - batteryCharge - exported) > Math.max(.01, home * .01)) fail("household energy balance");
    const importCost = intervals.reduce((sum, item) => sum + item.imported * item.rate, 0);
    const exportCredit = intervals.reduce((sum, item) => sum + item.exported * item.exportRate, 0);
    const buckets = new Map<number, { rate: number; quantity: number; cost: number }>();
    for (const item of intervals) {
      if (!item.imported) continue;
      const bucket = buckets.get(item.rate) ?? { rate: item.rate, quantity: 0, cost: 0 };
      bucket.quantity += item.imported;
      bucket.cost += item.imported * item.rate;
      buckets.set(item.rate, bucket);
    }
    return { start, end, generated, home, solar, batteryCharge, batteryDischarge, imported, exported,
      importCost, exportCredit, buckets: [...buckets.values()].sort((a, b) => a.rate - b.rate),
      intervals, consumers, remainder: Math.max(0, remainder) };
  });
}

export function readPurchasePlan(hass: HomeAssistant | undefined, options: EnergyInsightsOptions, now = Date.now()): SourceResult<PurchasePlan> {
  return source(hass, options.planSource, options, now, (root, start, end, generated) => {
    if (end - start !== 86400000 || start < generated - 60000 || end <= now) fail("upcoming 24-hour window");
    const home = number(root, "home_kwh"), solar = number(root, "solar_kwh");
    const batteryMin = number(root, "battery_min", 0, 100), reserve = number(root, "battery_reserve", 0, 100);
    const efficiency = number(root, "charge_efficiency", Number.MIN_VALUE, 1);
    const blocks = list(root, "blocks").map(raw => {
      const item = object(raw, "block");
      const home = number(item, "home_kwh"), ev = number(item, "ev_kwh"), battery = number(item, "battery_kwh");
      const quantity = home + ev + battery, rate = number(item, "rate", -1000000, 1000000);
      return {
        start: instant(item, "start"), end: instant(item, "end"), home, ev, battery, quantity, rate,
        cost: quantity * rate, target: item.target === undefined || item.target === null ? undefined : number(item, "target", 0, 100),
        reason: text(item, "reason"), detail: text(item, "detail"),
      };
    }).sort((a, b) => a.start - b.start);
    if (blocks.some((item, index) => item.start < start || item.end > end || item.end <= item.start ||
      item.quantity <= 0 || index > 0 && item.start < blocks[index - 1].end)) fail("purchase block window or allocation");
    const consumers = options.consumers.map(consumer => ({
      id: consumer.id,
      energy: consumer.forecastField ? number(root, consumer.forecastField) : undefined,
      strategy: consumer.strategyField ? text(root, consumer.strategyField) : undefined,
    }));
    if (consumers.reduce((sum, item) => sum + (item.energy ?? 0), 0) > home + .001) fail("consumer forecasts exceed household forecast");
    return { start, end, generated, home, solar, batteryMin, reserve, efficiency, blocks, consumers,
      quantity: blocks.reduce((sum, item) => sum + item.quantity, 0),
      cost: blocks.reduce((sum, item) => sum + item.cost, 0) };
  });
}

/** Positive battery power is charging; positive grid power is import. */
export function livePower(hass: HomeAssistant | undefined, entityId?: string, now = Date.now(), maxAgeMinutes = 60): number | undefined {
  const entity = hass?.states[entityId ?? ""];
  if (!entity || ["unknown", "unavailable"].includes(entity.state)) return undefined;
  const updated = timestamp(entity.last_updated);
  if (updated === undefined || now - updated > maxAgeMinutes * 60000 || updated > now + 60000) return undefined;
  const value = numeric(entity.state), unit = entity.attributes.unit_of_measurement;
  return value === undefined ? undefined : unit === "kW" ? value * 1000 : unit === "W" ? value : undefined;
}

export function livePercentage(hass: HomeAssistant | undefined, entityId?: string, now = Date.now(), maxAgeMinutes = 60): number | undefined {
  const entity = hass?.states[entityId ?? ""];
  if (!entity || entity.attributes.unit_of_measurement !== "%") return undefined;
  const updated = timestamp(entity.last_updated), value = numeric(entity.state);
  return updated !== undefined && now - updated <= maxAgeMinutes * 60000 && updated <= now + 60000 &&
    value !== undefined && value >= 0 && value <= 100 ? value : undefined;
}
