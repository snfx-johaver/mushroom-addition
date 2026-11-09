import type { HomeAssistant } from "../types";
import { numeric, readPath, timestamp } from "../energy-cards/data";
import type { EnergyInsightsOptions, InsightsSource, MeterSource } from "./config";

export type SourceResult<T> = { value: T; error?: never } | { error: string; value?: never };
export interface MeterInterval {
  start: number;
  end: number;
  imported: number;
  exported: number;
  rate?: number;
  exportRate?: number;
  approximate?: boolean;
}
export interface Actuals {
  start: number;
  end: number;
  generated: number;
  home?: number;
  solar?: number;
  batteryCharge?: number;
  batteryDischarge?: number;
  imported?: number;
  exported?: number;
  importCost?: number;
  exportCredit?: number;
  exportRateConfigured: boolean;
  buckets: Array<{ rate: number; quantity: number; cost: number }>;
  intervals: MeterInterval[];
  consumers: Array<{ id: string; energy?: number; baseline?: number }>;
  remainder?: number;
  coverage?: Array<{ id: string; end?: number; lastUpdated?: number; error?: string; absent?: boolean }>;
  warnings?: string[];
  approximations?: string[];
}
export interface PurchaseBlock {
  start: number;
  end: number;
  home?: number;
  ev?: number;
  battery?: number;
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
  batteryMin?: number;
  reserve?: number;
  efficiency?: number;
  quantity: number;
  cost: number;
  blocks: PurchaseBlock[];
  consumers: Array<{ id: string; energy?: number; strategy?: string }>;
}

class SourceError extends Error {}
function fail(field: string): never { throw new SourceError(`Invalid data source or field mapping: ${field}`); }
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
  label: string, now: number,
  parse: (root: Record<string, unknown>, start: number, end: number, generated: number) => T): SourceResult<T> {
  const entity = hass?.states[config.entity ?? ""];
  if (!entity || ["unknown", "unavailable"].includes(entity.state)) {
    return { error: `Source missing: ${label} ${config.entity || "sensor"} is missing or unavailable; select its entity and map the ${config.path} fields` };
  }
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
  return source(hass, options.actualSource, options, "Measured snapshot source", now, (root, start, end, generated) => {
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
      const energy = consumer.energyField ? number(root, consumer.energyField) : undefined;
      let baseline: number | undefined;
      if (consumer.baselineField) {
        if (instant(root, "baseline_start") !== start || instant(root, "baseline_end") !== end) fail("baseline window");
        baseline = number(root, consumer.baselineField);
      }
      return { id: consumer.id, energy, baseline };
    });
    const remainder = home - consumers.reduce((sum, item) => sum + (item.energy ?? 0), 0);
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
      importCost, exportCredit, exportRateConfigured: true, buckets: [...buckets.values()].sort((a, b) => a.rate - b.rate),
      intervals, consumers, remainder: Math.max(0, remainder) };
  });
}

export const INSIGHTS_HISTORY_REFRESH_MS = 15 * 60 * 1000;
export const INSIGHTS_HISTORY_MAX_ENTITIES = 39;
export const INSIGHTS_HISTORY_MAX_STATES_PER_ENTITY = 50000;
export const INSIGHTS_HISTORY_MAX_STATES = 250000;
export const INSIGHTS_MAX_PRICED_INTERVALS = 100000;
export const INSIGHTS_HISTORY_LOOKBACK_MS = 60 * 60 * 1000;
export const INSIGHTS_APPROXIMATION_MESSAGES = {
  midnight: "Midnight uses the last recorded HA state; the physical timing of the first delta is uncertain.",
  tariffs: "Costs use held midnight states and time-proportional tariff allocations; uniform energy use is assumed within split intervals.",
  endpoint: "Counters are held until the common HA snapshot endpoint; unchanged values between reports are assumed, not simultaneous physical measurements.",
} as const;

export function meteredEntityIds(options: EnergyInsightsOptions): string[] {
  const { metered } = options;
  return [...new Set([
    metered.solar.entity, metered.gridImport.entity, metered.gridExport.entity,
    metered.batteryCharge.entity, metered.batteryDischarge.entity,
    metered.importRate.entity, metered.exportRate.entity,
    ...options.consumers.map(consumer => consumer.energySource?.entity),
  ].filter((entity): entity is string => Boolean(entity)))];
}

export function localDayStart(now: number, timeZone: string): number {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  });
  const parts = (value: number) => Object.fromEntries(
    formatter.formatToParts(new Date(value)).map(part => [part.type, part.value]),
  );
  const current = parts(now);
  const midnight = Date.UTC(Number(current.year), Number(current.month) - 1, Number(current.day));
  const offsetAt = (value: number): number => {
    const wholeSecond = Math.floor(value / 1000) * 1000;
    const local = parts(value);
    return Date.UTC(Number(local.year), Number(local.month) - 1, Number(local.day),
      Number(local.hour), Number(local.minute), Number(local.second)) - wholeSecond;
  };
  const firstGuess = midnight - offsetAt(now);
  return midnight - offsetAt(firstGuess);
}

function historyGroups(response: unknown): Map<string, unknown[]> {
  const groups = new Map<string, unknown[]>();
  const keys = Array.isArray(response) ? undefined : Object.keys(object(response, "history response"));
  if ((Array.isArray(response) ? response.length : keys!.length) > INSIGHTS_HISTORY_MAX_ENTITIES) fail("too many history groups");
  const entries = Array.isArray(response) ? response.map(rows => ["", rows] as const) :
    keys!.map(key => [key, (response as Record<string, unknown>)[key]] as const);
  let count = 0;
  for (const [key, rows] of entries) {
    if (!Array.isArray(rows)) fail("invalid history group");
    count += rows.length;
    if (count > INSIGHTS_HISTORY_MAX_STATES) fail(`Recorder history exceeds the ${INSIGHTS_HISTORY_MAX_STATES}-state total limit`);
    const id = key || (rows[0] && object(rows[0], "history row").entity_id);
    if (!id && !rows.length) continue;
    if (typeof id !== "string" || groups.has(id)) fail("invalid or duplicate history group");
    if (rows.some(raw => {
      const row = object(raw, id);
      return row.entity_id !== undefined && row.entity_id !== id;
    })) fail(`${id}: history contains another entity`);
    groups.set(id, rows);
  }
  return groups;
}

interface MeterPoint { time: number; value: number; }

function pointsFor(
  hass: HomeAssistant,
  sourceConfig: MeterSource,
  rows: unknown[],
  key: string,
  kind: "energy" | "rate",
  currency = hass.config?.currency,
): MeterPoint[] {
  const entity = hass.states[sourceConfig.entity ?? ""];
  if (!entity || ["unknown", "unavailable"].includes(entity.state)) fail(`${key}: selected sensor is missing or unavailable`);
  const unit = String(entity.attributes.unit_of_measurement ?? "").replace(/\s+/g, "").toLowerCase();
  const energyFactor = unit === "wh" ? .001 : unit === "mwh" ? 1000 : unit === "kwh" ? 1 : undefined;
  const rateFactor = ["ct/kwh", "c/kwh", "cent/kwh", "cents/kwh", "¢/kwh"].includes(unit) ? .01 :
    currency && (unit === `${currency.toLowerCase()}/kwh` ||
      currency === "EUR" && unit === "€/kwh" || currency === "USD" && unit === "$/kwh") ? 1 : undefined;
  if (kind === "energy" && energyFactor === undefined) fail(`${key}: use a cumulative Wh, kWh, or MWh sensor`);
  if (kind === "rate" && rateFactor === undefined) fail(`${key}: price unit must be ${currency ?? "the configured currency"}/kWh or cents/kWh`);
  const parsed = rows.map(raw => {
    const row = object(raw, key);
    const attrs = object(row.attributes ?? row.a ?? {}, key);
    if (["unknown", "unavailable"].includes(String(row.state ?? row.s))) fail(`${key}: history contains an invalid value (unknown or unavailable)`);
    const rawValue = sourceConfig.field ? readPath(attrs, sourceConfig.field) : row.state ?? row.s;
    const value = numeric(rawValue), time = timestamp(row.last_updated ?? row.last_changed ?? row.lu ?? row.lc);
    if (value === undefined || time === undefined) fail(`${key}: history contains an invalid value or timestamp`);
    if (kind === "energy" && value < 0) fail(`${key}: cumulative energy cannot be negative`);
    if (attrs.unit_of_measurement !== undefined &&
      String(attrs.unit_of_measurement).replace(/\s+/g, "").toLowerCase() !== unit) fail(`${key}: historical units changed`);
    const scaled = value * (kind === "energy" ? energyFactor! : rateFactor!);
    if (!Number.isFinite(scaled) || !Number.isFinite(new Date(time).getTime())) fail(`${key}: value or timestamp is out of range`);
    return { time, value: scaled };
  });
  const unique = new Map<number, MeterPoint>();
  for (const point of parsed) {
    if (unique.has(point.time) && unique.get(point.time)!.value !== point.value) fail(`${key}: conflicting readings at the same timestamp`);
    unique.set(point.time, point);
  }
  return [...unique.values()].sort((a, b) => a.time - b.time);
}

interface MeterDelta { start: number; end: number; quantity: number; approximate: boolean; }

function meterDeltas(points: MeterPoint[], start: number, end: number, key: string): MeterDelta[] {
  const baseline = points.filter(point => point.time <= start).at(-1);
  if (!baseline) fail(`${key}: Recorder history has no cumulative reading at the start of today`);
  const readings = points.filter(point => point.time > start && point.time <= end);
  const deltas: MeterDelta[] = [];
  let previous = baseline;
  for (const point of readings) {
    const quantity = point.value - previous.value;
    if (quantity < 0) fail(`${key}: cumulative meter reset or decreased; use a non-resetting meter`);
    if (point.time > previous.time && quantity > 0) {
      const left = Math.max(previous.time, start);
      deltas.push({ start: left, end: point.time,
        quantity,
        approximate: previous.time < start });
    }
    previous = point;
  }
  return deltas;
}

function priceDelta(points: MeterPoint[], delta: MeterDelta, key: string): Array<MeterDelta & { rate: number }> {
  const { start, end, quantity } = delta;
  let left = 0, right = points.length;
  while (left < right) {
    const middle = (left + right) >>> 1;
    if (points[middle].time <= start) left = middle + 1;
    else right = middle;
  }
  const baseline = points[left - 1];
  if (!baseline) fail(`${key}: no price reading covers a metered interval`);
  const segments: Array<{ start: number; end: number; rate: number }> = [];
  let cursor = start, rate = baseline.value;
  for (let index = left; index < points.length && points[index].time < end; index++) {
    if (points[index].value === rate) continue;
    segments.push({ start: cursor, end: points[index].time, rate });
    cursor = points[index].time;
    rate = points[index].value;
  }
  segments.push({ start: cursor, end, rate });
  let allocated = 0;
  return segments.map((segment, index) => {
    const portion = index === segments.length - 1 ? quantity - allocated :
      quantity * ((segment.end - segment.start) / (end - start));
    allocated += portion;
    return { ...segment, quantity: portion, approximate: delta.approximate || segments.length > 1 };
  });
}

/** Builds today's cumulative-meter accounting with explicit allocation assumptions; no history I/O. */
export function readMeteredActuals(
  hass: HomeAssistant | undefined,
  options: EnergyInsightsOptions,
  response: unknown,
  now = Date.now(),
): SourceResult<Actuals> {
  if (!hass) return { error: "Source missing: Home Assistant is not connected" };
  const currency = options.currency || hass.config?.currency;
  try {
    const entityIds = meteredEntityIds(options);
    if (entityIds.length > INSIGHTS_HISTORY_MAX_ENTITIES) fail("too many history entities");
    if (!entityIds.length && response == null) return { error: "Source missing: select a sensor or explicitly declare equipment Not installed" };
    const groups = historyGroups(response);
    const zone = hass.config?.time_zone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const start = localDayStart(now, zone);
    const coverage: NonNullable<Actuals["coverage"]> = [], warnings: string[] = [], approximations: string[] = [];
    const carriedSources: string[] = [];
    const attempt = <T>(id: string, read: () => T): T | undefined => {
      try { return read(); }
      catch (error) {
        if (!(error instanceof SourceError)) throw error;
        coverage.push({ id, error: error.message });
        warnings.push(error.message);
        return undefined;
      }
    };
    const points = (id: string, config: MeterSource, kind: "energy" | "rate") => {
      if (!config.entity) fail(`${id}: select a sensor or explicitly declare equipment Not installed`);
      const rows = groups.get(config.entity!) ?? [];
      if (rows.length > INSIGHTS_HISTORY_MAX_STATES_PER_ENTITY) {
        fail(`${id}: Recorder history exceeds the ${INSIGHTS_HISTORY_MAX_STATES_PER_ENTITY}-state limit`);
      }
      const relevant = rows.map(raw => {
        const row = object(raw, id);
        return { raw, time: timestamp(row.last_updated ?? row.last_changed ?? row.lu ?? row.lc) };
      })
        .sort((a, b) => (a.time ?? 0) - (b.time ?? 0));
      if (relevant.some(row => row.time === undefined)) fail(`${id}: history contains an invalid timestamp`);
      const boundary = relevant.filter(row => row.time! <= start).at(-1);
      const all = pointsFor(hass, config, [
        ...relevant.filter(row => row.time === boundary?.time).map(row => row.raw),
        ...relevant.filter(row => row.time! > start && row.time! <= now).map(row => row.raw),
      ], id, kind, currency);
      const entity = hass.states[config.entity!];
      const currentTime = timestamp(entity.last_updated ?? entity.last_changed);
      if (currentTime === undefined || currentTime > now) fail(`${id}: current state has an invalid or future timestamp`);
      const current = pointsFor(hass, config, [entity], id, kind, currency)[0];
      const latest = all.at(-1);
      // Recorder carries microseconds; HA's ISO serialization truncates to milliseconds.
      // The frontend state subscription can also lag behind newer Recorder changes.
      const sameObservation = all.find(point => Math.floor(point.time) === Math.floor(current.time));
      if (sameObservation && current.value !== sameObservation.value) {
        fail(`${id}: current state disagrees with Recorder history`);
      }
      if (latest && !sameObservation && current.time > start) all.push(current);
      all.sort((a, b) => a.time - b.time);
      // HA's captured current state is the endpoint, not its last change timestamp.
      // Do not synthesize a missing Recorder baseline from the current state.
      if (latest) all.push({ time: now, value: all.at(-1)!.value });
      return [...new Map(all.map(point => [point.time, point])).values()].sort((a, b) => a.time - b.time);
    };
    const energy = (id: string, config: MeterSource) => attempt(id, () => {
      if (config.absent) {
        coverage.push({ id, end: now, absent: true });
        return { total: 0, end: now, deltas: [] };
      }
      const readings = points(id, config, "energy");
      const deltas = meterDeltas(readings, start, now, id);
      const end = now;
      const entity = hass.states[config.entity!];
      const lastUpdated = timestamp(entity.last_updated ?? entity.last_changed)!;
      if (lastUpdated < now) carriedSources.push(id);
      if (deltas.some(item => item.approximate)) {
        approximations.push(`${id}: ${INSIGHTS_APPROXIMATION_MESSAGES.midnight}`);
      }
      coverage.push({ id, end, lastUpdated });
      return { total: deltas.reduce((sum, item) => sum + item.quantity, 0), end, deltas };
    });
    const solarMeter = energy("solar", options.metered.solar);
    const importMeter = energy("gridImport", options.metered.gridImport);
    const exportMeter = energy("gridExport", options.metered.gridExport);
    const chargeMeter = energy("batteryCharge", options.metered.batteryCharge);
    const dischargeMeter = energy("batteryDischarge", options.metered.batteryDischarge);
    const solar = solarMeter?.total, imported = importMeter?.total, exported = exportMeter?.total;
    const batteryCharge = chargeMeter?.total, batteryDischarge = dischargeMeter?.total;
    const end = now;
    let home: number | undefined;
    if (solar !== undefined && imported !== undefined && exported !== undefined &&
      batteryCharge !== undefined && batteryDischarge !== undefined) {
      const balanced = solar + imported + batteryDischarge - batteryCharge - exported;
      if (Number.isFinite(balanced) && balanced >= -.01) home = Math.max(0, balanced);
      else warnings.push("Invalid data source or field mapping: energy balance produces nonfinite or negative household consumption");
    }
    const priceIntervals = (id: string, meter: typeof importMeter, config: MeterSource, fixed?: number) => {
      if (!meter) return { intervals: [], cost: undefined };
      const result = attempt(id, () => {
        if (!currency || !/^[A-Z]{3}$/.test(currency)) fail(`${id}: configure an ISO currency`);
        const prices = fixed === undefined ? points(id, config, "rate") : [];
        const intervals: Array<MeterDelta & { rate: number }> = [];
        for (const item of meter.deltas) {
          const priced = fixed === undefined ? priceDelta(prices, item, id) : [{ ...item, rate: fixed }];
          if (intervals.length + priced.length > INSIGHTS_MAX_PRICED_INTERVALS) fail(`${id}: too many priced intervals`);
          for (const interval of priced) intervals.push(interval);
        }
        if (intervals.some(item => item.approximate)) {
          approximations.push(`${id}: ${INSIGHTS_APPROXIMATION_MESSAGES.tariffs}`);
        }
        const cost = intervals.reduce((sum, item) => sum + item.quantity * item.rate, 0);
        if (!Number.isFinite(cost)) fail(`${id}: calculated cost is out of range`);
        return { intervals, cost };
      });
      return result ?? { intervals: meter.deltas.map(item => ({ ...item, rate: undefined })), cost: undefined };
    };
    const purchase = priceIntervals("importRate", importMeter, options.metered.importRate);
    const exportRateConfigured = options.fixedExportRate !== undefined || Boolean(options.metered.exportRate.entity);
    const sale = exportRateConfigured ? priceIntervals("exportRate", exportMeter, options.metered.exportRate, options.fixedExportRate) :
      { intervals: exportMeter?.deltas.map(item => ({ ...item, rate: undefined })) ?? [], cost: undefined };
    const intervals: MeterInterval[] = [
      ...purchase.intervals.map(item => ({ start: item.start, end: item.end, imported: item.quantity, exported: 0, rate: item.rate, approximate: item.approximate })),
      ...sale.intervals.map(item => ({ start: item.start, end: item.end, imported: 0, exported: item.quantity, exportRate: item.rate, approximate: item.approximate })),
    ];
    const buckets = new Map<number, { rate: number; quantity: number; cost: number }>();
    for (const item of intervals) {
      if (!item.imported || item.rate === undefined) continue;
      const bucket = buckets.get(item.rate) ?? { rate: item.rate, quantity: 0, cost: 0 };
      bucket.quantity += item.imported;
      bucket.cost += item.imported * item.rate;
      buckets.set(item.rate, bucket);
    }
    const consumers = options.consumers.map(consumer => {
      const meter = consumer.energySource?.entity ? energy(`consumer.${consumer.id}`, consumer.energySource) : undefined;
      return { id: consumer.id, energy: meter?.total };
    });
    let remainder = home === undefined ? undefined : home - consumers.reduce((sum, item) => sum + (item.energy ?? 0), 0);
    if (remainder !== undefined && remainder < -.001) {
      warnings.push("Invalid data source or field mapping: consumer total exceeds household energy");
      consumers.forEach(consumer => { consumer.energy = undefined; });
      remainder = home;
    }
    if (carriedSources.length) {
      approximations.unshift(`${carriedSources.join(", ")}: ${INSIGHTS_APPROXIMATION_MESSAGES.endpoint}`);
    }
    return { value: {
      start, end, generated: now, home, solar, batteryCharge, batteryDischarge,
      imported, exported, importCost: purchase.cost, exportCredit: sale.cost, exportRateConfigured,
      buckets: purchase.cost === undefined ? [] : [...buckets.values()].sort((a, b) => a.rate - b.rate),
      intervals: intervals.sort((a, b) => a.start - b.start), consumers, remainder,
      coverage, warnings, approximations,
    } };
  } catch (error) {
    if (!(error instanceof SourceError)) throw error;
    return { error: error.message };
  }
}

export function readPurchasePlan(hass: HomeAssistant | undefined, options: EnergyInsightsOptions, now = Date.now()): SourceResult<PurchasePlan> {
  return source(hass, options.planSource, options, "Plan source", now, (root, start, end, generated) => {
    if (end - start !== 86400000 || start < generated - 60000 || end <= now) fail("upcoming 24-hour window");
    const home = number(root, "home_kwh"), solar = number(root, "solar_kwh");
    const batteryMin = options.showPlanBattery ? number(root, "battery_min", 0, 100) : undefined;
    const reserve = options.showPlanBattery ? number(root, "battery_reserve", 0, 100) : undefined;
    const efficiency = options.showPlanEfficiency ? number(root, "charge_efficiency", Number.MIN_VALUE, 1) : undefined;
    const blocks = list(root, "blocks").map(raw => {
      const item = object(raw, "block");
      const home = options.showPlanAllocations ? number(item, "home_kwh") : undefined;
      const ev = options.showPlanAllocations ? number(item, "ev_kwh") : undefined;
      const battery = options.showPlanAllocations || options.showPlanEfficiency ? number(item, "battery_kwh") : undefined;
      const quantity = options.showPlanAllocations ? home! + ev! + battery! : number(item, "quantity_kwh");
      const rate = number(item, "rate", -1000000, 1000000);
      if (battery !== undefined && battery > quantity + .001) fail("battery_kwh exceeds purchase quantity_kwh");
      if (options.showPlanAllocations && item.quantity_kwh !== undefined &&
        Math.abs(number(item, "quantity_kwh") - quantity) > .001) fail("quantity_kwh does not match allocation");
      return {
        start: instant(item, "start"), end: instant(item, "end"), home, ev, battery, quantity, rate,
        cost: quantity * rate, target: !options.showPlanBattery || item.target === undefined || item.target === null ? undefined : number(item, "target", 0, 100),
        reason: item.reason === undefined ? "" : text(item, "reason"), detail: item.detail === undefined ? "" : text(item, "detail"),
      };
    }).sort((a, b) => a.start - b.start);
    if (blocks.some((item, index) => item.start < start || item.end > end || item.end <= item.start ||
      item.quantity <= 0 || index > 0 && item.start < blocks[index - 1].end)) fail("purchase block window or allocation");
    const consumers = options.consumers.map(consumer => ({
      id: consumer.id,
      energy: options.showForecasts && consumer.forecastField ? number(root, consumer.forecastField) : undefined,
      strategy: options.showForecasts && consumer.strategyField ? text(root, consumer.strategyField) : undefined,
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
