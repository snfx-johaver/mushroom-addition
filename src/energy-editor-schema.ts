import type { EditorField } from "./editor-schema";
import { newMetric, newRow, planDefaults, ROW_KINDS } from "./energy-plan/config";
import { insightsDefaults } from "./energy-insights/config";
import { energyLogStub } from "./energy-cards/energy-log-config";

export interface NativeObjectField {
  label: string;
  description?: string;
  required?: boolean;
  default?: unknown;
  selector: Record<string, unknown>;
}
export type NativeFields = Record<string, NativeObjectField>;
const text = (label: string, value?: string): NativeObjectField => ({
  label, selector: { text: {} }, ...(value === undefined ? {} : { default: value }),
});
const entity = (label: string): NativeObjectField => ({ label, selector: { entity: { domain: "sensor" } } });
const number = (label: string, min: number, max: number, value?: number): NativeObjectField => ({
  label, selector: { number: { min, max, step: "any", mode: "box" } }, ...(value === undefined ? {} : { default: value }),
});
const select = (label: string, options: string[], value?: string): NativeObjectField => ({
  label, selector: { select: { mode: "dropdown", options: options.map(value => ({
    value, label: ({ price: "Prices", power: "Power magnitude", soc: "Battery level", schedule: "Plan", attribute: "Attributes", state: "State", now: "Now", source: "Source", energy: "Energy" } as Record<string, string>)[value] ?? value,
  })) } }, ...(value === undefined ? {} : { default: value }),
});
export const nativeObject = (fields: NativeFields, multiple = false): Record<string, unknown> => ({
  object: { fields, multiple, label_field: "name" in fields ? "name" : "overview" in fields ? "overview" : "path" in fields ? "path" : Object.keys(fields)[0] },
});
const defaults = (fields: NativeFields, values: object): NativeFields => Object.fromEntries(
  Object.entries(fields).map(([key, field]) => [key, key in values ? {
    ...field, default: Reflect.get(values, key),
  } : field]),
);
const appearance: NativeFields = {
  name: { ...text("Name"), required: true },
  icon: { label: "Icon", selector: { icon: {} } },
  color: { label: "Color", selector: { ui_color: {} } },
};
export const PLAN_METRIC_FIELDS = defaults({
  ...appearance, entity: entity("Source"), field: text("Field"), unit: text("Unit"),
}, newMetric());
export const PLAN_ROW_FIELDS = defaults({
  id: { ...text("ID"), required: true },
  enabled: { label: "Enabled", selector: { boolean: {} } },
  ...appearance,
  kind: select("Type", [...ROW_KINDS]),
  entity: entity("Source"), adapter: select("Source type", ["attribute", "state"]),
  path: text("Path"), startField: text("Start field"), endField: text("End field"),
  durationField: text("Duration field"), valueField: text("Value field"), statusField: text("Status field"),
  unit: text("Unit"), scale: number("Power magnitude", .001, 1000000),
  low: number("Low", -1000000, 1000000), high: number("High", -1000000, 1000000),
  lowColor: { label: "Low color", selector: { ui_color: {} } },
  highColor: { label: "High color", selector: { ui_color: {} } },
  positiveLabel: text("Positive label"), negativeLabel: text("Negative label"), zeroLabel: text("Zero label"),
}, { ...newRow(""), id: undefined });
delete PLAN_ROW_FIELDS.id.default;
export const PLAN_PERIOD_FIELDS: NativeFields = {
  name: { ...text("Name", "Plan"), required: true },
  start: number("Start", 0, 168, 0), end: number("End", 0, 168, 12),
  description: text("Description", ""),
  metrics: { label: "Summary", selector: nativeObject(PLAN_METRIC_FIELDS, true), default: [] },
};
export const PLAN_FIELDS = defaults({
  start: select("Start", ["now", "source"]), startEntity: entity("Start source"), startField: text("Start field"),
  ...Object.fromEntries(["showHeader", "showOverview", "showMetrics", "showInspector", "showPeriods", "showLegend"].map((key, index) => [
    key, { label: ["Show header", "Show overview", "Show metrics", "Show inspector", "Show periods", "Show legend"][index], selector: { boolean: {} } },
  ])),
  overview: text("Summary"), description: text("Description"), timelineTitle: text("Timeline"),
  rowHeight: number("Height", 36, 80), minimumWidth: number("Width", 400, 1600), axisStep: number("Interval", 1, 24),
  maxAgeMinutes: number("Maximum source age (minutes)", 1, 10080),
  rows: { label: "Timeline rows", selector: nativeObject(PLAN_ROW_FIELDS, true) },
  metrics: { label: "Summary", selector: nativeObject(PLAN_METRIC_FIELDS, true) },
  periods: { label: "Periods", selector: nativeObject(PLAN_PERIOD_FIELDS, true) },
}, planDefaults());
export const INSIGHTS_CONSUMER_FIELDS: NativeFields = {
  id: { ...text("ID"), required: true }, ...appearance,
  entity: entity("Power sensor"), energyField: { ...text("Measured energy field"), required: true },
  baselineField: text("Same-window plan field"), forecastField: text("Forecast energy field"), strategyField: text("Strategy field"),
};
export const ACTUAL_FIELD_NAMES = [
  "start", "end", "generated_at", "currency", "home_kwh", "solar_kwh", "battery_charge_kwh", "battery_discharge_kwh",
  "baseline_start", "baseline_end", "intervals", "interval_start", "interval_end", "interval_import_kwh",
  "interval_export_kwh", "interval_rate", "interval_export_rate",
] as const;
export const PURCHASE_FIELD_NAMES = [
  "start", "end", "generated_at", "currency", "home_kwh", "solar_kwh", "battery_min", "battery_reserve", "charge_efficiency",
  "blocks", "block_start", "block_end", "block_home_kwh", "block_ev_kwh", "block_battery_kwh", "block_rate",
  "block_target", "block_reason", "block_detail",
] as const;
const sourceLabels: Record<string, string> = {
  start: "Start", end: "End", generated_at: "Updated", currency: "Currency code",
  home_kwh: "Home consumption", solar_kwh: "Solar generated",
  battery_charge_kwh: "Battery input", battery_discharge_kwh: "Battery output",
  baseline_start: "Comparison start", baseline_end: "Comparison end", intervals: "Metered intervals",
  interval_start: "Start", interval_end: "End", interval_import_kwh: "Imported",
  interval_export_kwh: "Exported", interval_rate: "Unit rate", interval_export_rate: "Export rate",
  battery_min: "Minimum planned battery", battery_reserve: "Reserve", charge_efficiency: "Charge efficiency",
  blocks: "Planned blocks", block_start: "Start", block_end: "End", block_home_kwh: "Direct home use",
  block_ev_kwh: "EV input (AC)", block_battery_kwh: "Battery input (AC)", block_rate: "Unit rate",
  block_target: "Battery target", block_reason: "Reason", block_detail: "Description",
};
const sourceFields = (fields: readonly string[]): NativeFields => ({
  entity: entity("Source"), path: text("Path"),
  fields: {
    label: "Field mappings", selector: nativeObject(Object.fromEntries(fields.map(key => [
      key, { ...text(sourceLabels[key] ?? key), default: key.replace(/^(interval_|block_)/, "") },
    ]))),
  },
});
export const INSIGHTS_FIELDS = defaults({
  actualSource: { label: "Measured source", selector: nativeObject(sourceFields(ACTUAL_FIELD_NAMES)) },
  planSource: { label: "Plan source", selector: nativeObject(sourceFields(PURCHASE_FIELD_NAMES)) },
  currency: text("Currency code"),
  maxAgeMinutes: number("Maximum source age (minutes)", 1, 10080),
  activeThreshold: number("Active threshold (W)", 0, 1000000),
  sort: select("Sort consumers", ["energy", "power"]),
  ...Object.fromEntries(["activeOnly", "showHeader", "showFlow", "showConsumers", "showPurchases", "showForecasts"].map((key, index) => [
    key, { label: ["Active only", "Show header", "Show live flow", "Show consumers", "Show purchases", "Show forecasts"][index], selector: { boolean: {} } },
  ])),
  homeEntity: entity("Home power"), solarEntity: entity("Solar power"),
  gridEntity: entity("Grid power"), batteryEntity: entity("Battery power"),
  selfPoweredEntity: entity("Home self-powered percentage"),
  consumers: { label: "Consumers", selector: nativeObject(INSIGHTS_CONSUMER_FIELDS, true) },
}, insightsDefaults());
export const energyFeatureField = (kind: "energy_plan" | "energy_insights"): EditorField => ({
  name: kind, selector: nativeObject(kind === "energy_plan" ? PLAN_FIELDS : INSIGHTS_FIELDS),
});

export const ENERGY_LOG_LABELS: Record<string, string> = {
  sources: "Sources", categories: "Categories", limit: "Entry limit", sortOrder: "Sort order",
  timeZone: "Time zone", clockFormat: "Clock format", showSource: "Show source",
  footer: "Footer", emptyState: "Empty state",
};
export const ENERGY_LOG_SOURCE_FIELDS = defaults({
  id: { ...text("ID"), required: true },
  entity: { label: "Entity", required: true, selector: { entity: {} } },
  adapter: select("Source type", ["attribute", "state"]),
  path: text("Path"), timestampField: text("Timestamp"), categoryField: text("Categories"),
  titleField: text("Title"), detailField: text("Summary"),
  descriptionField: text("Description"), sourceField: text("Source"),
}, { ...energyLogStub().sources[0], id: undefined, entity: undefined });
delete ENERGY_LOG_SOURCE_FIELDS.id.default;
delete ENERGY_LOG_SOURCE_FIELDS.entity.default;
export const ENERGY_LOG_CATEGORY_FIELDS: NativeFields = {
  id: { ...text("ID"), required: true }, label: { ...text("Label"), required: true },
  color: { label: "Color", selector: { ui_color: {} } }, icon: { label: "Icon", selector: { icon: {} } },
};
export const energyLogFeatureFields = (): EditorField[] => [
  { name: "allIcon", selector: { icon: {} } },
  { name: "sources", selector: nativeObject(ENERGY_LOG_SOURCE_FIELDS, true) },
  { name: "categories", selector: { object: { ...(nativeObject(ENERGY_LOG_CATEGORY_FIELDS, true).object as object), label_field: "label" } } },
  { name: "limit", selector: { number: { min: 1, max: 500, mode: "box", step: 1 } } },
  { name: "sortOrder", selector: { select: { mode: "dropdown", options: [
    { value: "newest", label: "Newest first" }, { value: "oldest", label: "Oldest first" },
  ] } } },
  { name: "timeZone", selector: { text: {} } },
  { name: "clockFormat", selector: { select: { mode: "dropdown", options: ["24", "12"] } } },
  { name: "showSource", selector: { boolean: {} } },
  { name: "footer", selector: { text: { multiline: true } } },
  { name: "emptyState", selector: { text: {} } },
];
