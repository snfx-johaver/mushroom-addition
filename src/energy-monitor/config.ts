import type { AdditionConfig, HomeAssistant } from "../types";
import type { MeterSource } from "../energy-insights/config";

export const MONITOR_CARDS = [
  { id: "energy_plan_actual", tag: "mushroom-addition-energy-plan-actual", name: "Energy Plan vs Actual", icon: "mdi:chart-timeline-variant", description: "Compare an externally retained forecast baseline with measured energy over matching intervals." },
  { id: "battery_activity", tag: "mushroom-addition-battery-activity", name: "Energy Battery Activity", icon: "mdi:battery-charging", description: "Measured battery power, state of charge, daily charge/discharge totals and source gaps." },
  { id: "electricity_cost_timeline", tag: "mushroom-addition-electricity-cost-timeline", name: "Energy Electricity Cost Timeline", icon: "mdi:currency-eur", description: "Daily import costs and export credits from cumulative meters and recorded tariffs." },
  { id: "live_energy_flow", tag: "mushroom-addition-live-energy-flow", name: "Energy Live Energy Flow", icon: "mdi:home-lightning-bolt", description: "Realistic 3D home, grid, solar, EV and battery scene with measured directional power flows." },
] as const;
export type MonitorKind = typeof MONITOR_CARDS[number]["id"];
export interface LiveSource { entity?: string; field?: string; absent?: boolean; }
export interface BaselineSource {
  entity?: string;
  path?: string;
  generatedField?: string;
  startField?: string;
  endField?: string;
  valueField?: string;
  unit?: "kWh" | "Wh";
}
export interface MonitorOptions {
  maxAgeMinutes: number;
  maxContentWidth: number;
  maxGapMinutes: number;
  solar: LiveSource;
  home: LiveSource;
  grid: LiveSource;
  battery: LiveSource;
  ev: LiveSource;
  solarToEv: LiveSource;
  batteryToEv: LiveSource;
  soc: LiveSource;
  gridPositive: "import" | "export";
  batteryPositive: "charge" | "discharge";
  deriveHome: boolean;
  homeBoundary?: "excludes_battery_charging";
  importEnergy: MeterSource;
  exportEnergy: MeterSource;
  chargeEnergy: MeterSource;
  dischargeEnergy: MeterSource;
  importRate: MeterSource;
  exportRate: MeterSource;
  fixedExportRate?: number;
  currency?: string;
  baseline: BaselineSource;
  actualEnergy: MeterSource;
}
export interface MonitorConfig extends AdditionConfig { energy_monitor?: Partial<MonitorOptions>; }

export function monitorKind(type: string): MonitorKind | undefined {
  return MONITOR_CARDS.find(card => `custom:${card.tag}` === type)?.id;
}
export function monitorOptions(config: MonitorConfig): MonitorOptions {
  return {
    maxAgeMinutes: 15, maxContentWidth: 1200, maxGapMinutes: 30,
    solar: {}, home: {}, grid: {}, battery: {}, ev: {}, solarToEv: {}, batteryToEv: {}, soc: {},
    gridPositive: "import", batteryPositive: "charge", deriveHome: false,
    importEnergy: {}, exportEnergy: {}, chargeEnergy: {}, dischargeEnergy: {},
    importRate: {}, exportRate: {}, baseline: {}, actualEnergy: {},
    ...config.energy_monitor,
  };
}
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
export function validateMonitor(config: AdditionConfig): MonitorConfig {
  if (!monitorKind(config.type)) throw new Error("Unknown energy monitor card.");
  if (config.energy_monitor !== undefined && !record(config.energy_monitor)) throw new Error("energy_monitor: expected source mappings.");
  const options = monitorOptions(config);
  for (const [key, min, max] of [["maxAgeMinutes", 1, 10080], ["maxGapMinutes", 1, 1440], ["maxContentWidth", 0, 2400]] as const) {
    if (!Number.isFinite(options[key]) || options[key] < min || options[key] > max ||
      key === "maxContentWidth" && options[key] > 0 && options[key] < 400) throw new Error(`${key}: invalid range.`);
  }
  for (const key of ["solar", "home", "grid", "battery", "ev", "solarToEv", "batteryToEv", "soc", "importEnergy", "exportEnergy", "chargeEnergy", "dischargeEnergy", "importRate", "exportRate", "actualEnergy"] as const) {
    const source = options[key];
    if (!record(source)) throw new Error(`${key}: expected a source.`);
    for (const field of ["entity", "field"] as const) {
      if (source[field] !== undefined && typeof source[field] !== "string") throw new Error(`${key}.${field}: expected text.`);
    }
    if (options.solarToEv.entity && (options.solar.absent || options.ev.absent)) throw new Error("solarToEv: cannot connect equipment declared Not installed.");
    if (options.batteryToEv.entity && (options.battery.absent || options.ev.absent)) throw new Error("batteryToEv: cannot connect equipment declared Not installed.");
    if (source.absent !== undefined && typeof source.absent !== "boolean") throw new Error(`${key}.absent: expected a boolean.`);
    if (source.absent && (source.entity || !["solar", "battery", "ev", "exportEnergy", "chargeEnergy", "dischargeEnergy"].includes(key))) throw new Error(`${key}: invalid Not installed setting.`);
    if (source.field && !source.entity) throw new Error(`${key}: select a sensor before an attribute.`);
    if ("recoverGaps" in source && source.recoverGaps) throw new Error(`${key}: gap recovery is not supported by these cards.`);
    if ("sourceType" in source && source.sourceType !== undefined &&
      !["unspecified", "hardware", "integrated_power"].includes(String(source.sourceType))) throw new Error(`${key}: invalid counter type.`);
  }
  if (!["import", "export"].includes(options.gridPositive) || !["charge", "discharge"].includes(options.batteryPositive)) throw new Error("Invalid power direction.");
  if (typeof options.deriveHome !== "boolean") throw new Error("deriveHome: expected a boolean.");
  if (options.homeBoundary !== undefined && options.homeBoundary !== "excludes_battery_charging") throw new Error("Invalid household measurement boundary.");
  if (options.deriveHome && options.home.entity) throw new Error("Choose measured or calculated household power, not both.");
  if (options.deriveHome && options.homeBoundary !== "excludes_battery_charging") throw new Error("Verify the household boundary before calculating power.");
  if (options.currency !== undefined && options.currency !== "" && !/^[A-Z]{3}$/.test(options.currency)) throw new Error("currency: expected an ISO currency.");
  if (options.fixedExportRate !== undefined && (!Number.isFinite(options.fixedExportRate) || Math.abs(options.fixedExportRate) > 1e6 || options.exportRate.entity)) throw new Error("Choose a finite fixed export rate or a sensor.");
  if (!record(options.baseline)) throw new Error("baseline: expected a source.");
  for (const key of ["entity", "path", "generatedField", "startField", "endField", "valueField"] as const) {
    if (options.baseline[key] !== undefined && typeof options.baseline[key] !== "string") throw new Error(`baseline.${key}: expected text.`);
  }
  if (options.baseline.unit !== undefined && (typeof options.baseline.unit !== "string" || !["Wh", "kWh"].includes(options.baseline.unit))) throw new Error("baseline.unit: expected Wh or kWh.");
  return config;
}

export function monitorStub(kind: MonitorKind, hass?: HomeAssistant, ids: string[] = []): MonitorConfig {
  const card = MONITOR_CARDS.find(card => card.id === kind)!;
  const candidates = [...new Set([...ids, ...Object.keys(hass?.states ?? {})])];
  const power = candidates.find(id => {
    const entity = hass?.states[id];
    return entity && !["unknown", "unavailable"].includes(entity.state) &&
      Number.isFinite(Number(entity.state)) && ["W", "kW"].includes(String(entity.attributes.unit_of_measurement));
  });
  // Electrical roles are never inferred from names: the user assigns verified sources.
  return { type: `custom:${card.tag}`, name: card.name, icon: card.icon, ...(power ? { entity: power } : {}) };
}
