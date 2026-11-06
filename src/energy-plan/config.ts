import type { AdditionConfig, HomeAssistant } from "../types";
import { localizeText } from "../localize";
import type { FieldMapping } from "../energy-cards/types";

export const ENERGY_PLAN_TAG = "mushroom-addition-energy-plan";
export const ROW_KINDS = ["price", "power", "soc", "schedule"] as const;
export type RowKind = typeof ROW_KINDS[number];

export interface PlanRow extends FieldMapping {
  id: string;
  name: string;
  icon: string;
  color: string;
  kind: RowKind;
  enabled: boolean;
  entity?: string;
  adapter: "attribute" | "state";
  unit: string;
  scale: number;
  low: number;
  high: number;
  lowColor: string;
  highColor: string;
  positiveLabel: string;
  negativeLabel: string;
  zeroLabel: string;
}

export interface PlanMetric {
  name: string;
  entity?: string;
  field?: string;
  unit: string;
  icon: string;
  color: string;
}

export interface PlanPeriod {
  name: string;
  start: number;
  end: number;
  description: string;
  metrics: PlanMetric[];
}

export interface EnergyPlanOptions {
  start: "now" | "source";
  startEntity?: string;
  startField?: string;
  showHeader: boolean;
  showOverview: boolean;
  showMetrics: boolean;
  showInspector: boolean;
  showPeriods: boolean;
  showLegend: boolean;
  overview: string;
  description: string;
  timelineTitle: string;
  rowHeight: number;
  minimumWidth: number;
  axisStep: number;
  maxAgeMinutes: number;
  rows: PlanRow[];
  metrics: PlanMetric[];
  periods: PlanPeriod[];
}

export interface EnergyPlanConfig extends AdditionConfig {
  type: "custom:mushroom-addition-energy-plan";
  energy_plan?: EnergyPlanOptions;
}

export function newRow(id: string, name = "Plan", kind: RowKind = "schedule", valueField = "value", color = "green", icon = "mdi:calendar-clock"): PlanRow {
  return {
    id, name, kind, icon, color, enabled: true, adapter: "attribute",
    path: "plan", startField: "start", endField: "end", durationField: "",
    valueField, statusField: "", unit: kind === "price" ? "EUR/kWh" : kind === "soc" ? "%" : "kW",
    scale: kind === "soc" ? 100 : 5, low: .18, high: .30, lowColor: "green", highColor: "red",
    positiveLabel: "Charge", negativeLabel: "Discharge", zeroLabel: "Idle",
  };
}

export function newMetric(): PlanMetric {
  return { name: "Energy", unit: "kWh", icon: "mdi:lightning-bolt", color: "green" };
}

export function planDefaults(hass?: HomeAssistant): EnergyPlanOptions {
  const defaults: EnergyPlanOptions = {
    start: "now", showHeader: true, showOverview: true, showMetrics: true,
    showInspector: true, showPeriods: true, showLegend: true,
    overview: "Plan", description: "", timelineTitle: "Timeline",
    rowHeight: 48, minimumWidth: 720, axisStep: 3, maxAgeMinutes: 60,
    rows: [
      newRow("price", "Prices", "price", "price", "amber", "mdi:currency-eur"),
      newRow("solar", "Solar", "power", "solar", "amber", "mdi:white-balance-sunny"),
      newRow("battery", "Battery", "schedule", "battery", "green", "mdi:battery"),
      newRow("soc", "Battery level", "soc", "soc", "green", "mdi:battery-high"),
      { ...newRow("grid", "Grid", "schedule", "grid", "purple", "mdi:transmission-tower"),
        positiveLabel: "Import", negativeLabel: "Export", zeroLabel: "Idle" },
      newRow("home", "Home", "power", "home", "cyan", "mdi:home"),
      { ...newRow("heat", "Heat pump", "schedule", "heat", "pink", "mdi:heat-pump"),
        positiveLabel: "On", negativeLabel: "Off", zeroLabel: "Off" },
    ],
    metrics: [], periods: [],
  };
  return {
    ...defaults,
    overview: localizeText(hass, defaults.overview),
    timelineTitle: localizeText(hass, defaults.timelineTitle),
    rows: defaults.rows.map(row => ({
      ...row, name: localizeText(hass, row.name),
      positiveLabel: localizeText(hass, row.positiveLabel),
      negativeLabel: localizeText(hass, row.negativeLabel),
      zeroLabel: localizeText(hass, row.zeroLabel),
    })),
  };
}

export function planOptions(config: AdditionConfig, hass?: HomeAssistant): EnergyPlanOptions {
  return { ...planDefaults(hass), ...config.energy_plan };
}

function object(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${path}: expected an object.`);
  return value as Record<string, unknown>;
}
function number(value: unknown, path: string, min: number, max: number): void {
  if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) throw new Error(`${path}: expected ${min}–${max}.`);
}
function text(value: unknown, path: string, required = false): void {
  if (typeof value !== "string" || value.length > 500 || required && !value.trim()) throw new Error(`${path}: expected ${required ? "non-empty " : ""}text (maximum 500 characters).`);
}
function source(value: Record<string, unknown>, path: string): void {
  for (const key of ["entity", "field"]) if (value[key] !== undefined) text(value[key], `${path}.${key}`);
}
function metrics(value: unknown, path: string): void {
  if (!Array.isArray(value) || value.length > 12) throw new Error(`${path}: expected up to 12 metrics.`);
  value.forEach((item, index) => {
    const p = `${path}.${index}`, metric = object(item, p);
    for (const key of ["name", "unit", "icon", "color"]) text(metric[key], `${p}.${key}`, key !== "unit");
    source(metric, p);
  });
}

export function validatePlan(raw: unknown, hass?: HomeAssistant): EnergyPlanConfig {
  const config = object(raw, "config");
  if (config.type !== `custom:${ENERGY_PLAN_TAG}`) throw new Error(`type: expected custom:${ENERGY_PLAN_TAG}.`);
  if (config.entity !== undefined) text(config.entity, "entity");
  if (config.visibleHours !== undefined) number(config.visibleHours, "visibleHours", 1, 168);
  const options = object(config.energy_plan ?? {}, "energy_plan");
  const merged = { ...planDefaults(hass), ...options };
  if (!["now", "source"].includes(merged.start)) throw new Error("energy_plan.start: expected now or source.");
  for (const key of ["startEntity", "startField"]) if (options[key] !== undefined) text(options[key], `energy_plan.${key}`);
  for (const key of ["showHeader", "showOverview", "showMetrics", "showInspector", "showPeriods", "showLegend"] as const) {
    if (typeof merged[key] !== "boolean") throw new Error(`energy_plan.${key}: expected a boolean.`);
  }
  for (const key of ["overview", "description", "timelineTitle"] as const) text(merged[key], `energy_plan.${key}`);
  number(merged.rowHeight, "energy_plan.rowHeight", 36, 80);
  number(merged.minimumWidth, "energy_plan.minimumWidth", 400, 1600);
  number(merged.axisStep, "energy_plan.axisStep", 1, 24);
  number(merged.maxAgeMinutes, "energy_plan.maxAgeMinutes", 1, 10080);
  if (!Array.isArray(merged.rows) || merged.rows.length > 16) throw new Error("energy_plan.rows: expected up to 16 rows.");
  const ids = new Set<string>();
  merged.rows.forEach((value, index) => {
    const p = `energy_plan.rows.${index}`, row = object(value, p);
    for (const key of ["id", "name", "icon", "color", "unit", "positiveLabel", "negativeLabel", "zeroLabel", "lowColor", "highColor"]) text(row[key], `${p}.${key}`, !["unit", "positiveLabel", "negativeLabel", "zeroLabel"].includes(key));
    if (ids.has(String(row.id))) throw new Error(`${p}.id: duplicate ID.`);
    ids.add(String(row.id));
    if (!ROW_KINDS.includes(row.kind as RowKind)) throw new Error(`${p}.kind: invalid row type.`);
    if (!["attribute", "state"].includes(String(row.adapter))) throw new Error(`${p}.adapter: invalid source type.`);
    if (typeof row.enabled !== "boolean") throw new Error(`${p}.enabled: expected a boolean.`);
    for (const key of ["entity", "path", "startField", "endField", "durationField", "valueField", "statusField"]) {
      if (row[key] !== undefined) text(row[key], `${p}.${key}`);
    }
    if (!row.startField || !row.valueField || !row.endField && !row.durationField) throw new Error(`${p}: start, value and end or duration fields are required.`);
    number(row.scale, `${p}.scale`, .001, 1000000);
    number(row.low, `${p}.low`, -1000000, 1000000);
    number(row.high, `${p}.high`, -1000000, 1000000);
    if (Number(row.low) > Number(row.high)) throw new Error(`${p}: low threshold must not exceed high threshold.`);
    if (row.kind === "price" && !/^(?:[A-Z]{3}|ct)\/kWh$/.test(String(row.unit))) throw new Error(`${p}.unit: prices require an ISO currency/kWh or ct/kWh.`);
    if (row.kind === "soc" && row.unit !== "%") throw new Error(`${p}.unit: battery level requires %.`);
  });
  metrics(merged.metrics, "energy_plan.metrics");
  if (!Array.isArray(merged.periods) || merged.periods.length > 12) throw new Error("energy_plan.periods: expected up to 12 periods.");
  merged.periods.forEach((value, index) => {
    const p = `energy_plan.periods.${index}`, period = object(value, p);
    text(period.name, `${p}.name`, true);
    text(period.description, `${p}.description`);
    number(period.start, `${p}.start`, 0, 168);
    number(period.end, `${p}.end`, 0, 168);
    if (Number(period.end) <= Number(period.start)) throw new Error(`${p}: end must follow start.`);
    metrics(period.metrics, `${p}.metrics`);
  });
  return { ...config, energy_plan: merged } as EnergyPlanConfig;
}
