import type { AdditionConfig } from "../types";

export const ENERGY_INSIGHTS_TAG = "mushroom-addition-energy-insights";

export interface InsightsConsumer {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  entity?: string;
  energyField?: string;
  energySource?: MeterSource;
  baselineField?: string;
  forecastField?: string;
  strategyField?: string;
}

export interface InsightsSource {
  entity?: string;
  path: string;
  fields?: Record<string, string>;
}

export interface MeterSource {
  entity?: string;
  field?: string;
  absent?: boolean;
  sourceType?: "unspecified" | "hardware" | "integrated_power";
  recoverGaps?: boolean;
}

export interface MeteredActualSources {
  home?: MeterSource;
  solar: MeterSource;
  gridImport: MeterSource;
  gridExport: MeterSource;
  batteryCharge: MeterSource;
  batteryDischarge: MeterSource;
  importRate: MeterSource;
  exportRate: MeterSource;
}

export interface EnergyInsightsOptions {
  actualSource: InsightsSource;
  metered: MeteredActualSources;
  planSource: InsightsSource;
  purchaseScope: "all" | "battery";
  homeBoundary?: "excludes_battery_charging";
  forecastKind: "unspecified" | "estimate" | "interval";
  currency?: string;
  fixedExportRate?: number;
  maxAgeMinutes: number;
  maxContentWidth: number;
  activeThreshold: number;
  sort: "energy" | "power";
  activeOnly: boolean;
  showHeader: boolean;
  showFlow: boolean;
  showConsumers: boolean;
  showPurchases: boolean;
  showForecasts: boolean;
  showPlanBattery: boolean;
  showPlanAllocations: boolean;
  showPlanEfficiency: boolean;
  homeEntity?: string;
  solarEntity?: string;
  gridEntity?: string;
  batteryEntity?: string;
  selfPoweredEntity?: string;
  consumers: InsightsConsumer[];
}

export interface EnergyInsightsConfig extends AdditionConfig {
  energy_insights?: EnergyInsightsOptions;
}

export function insightsDefaults(): EnergyInsightsOptions {
  return {
    actualSource: { path: "actuals" }, planSource: { path: "plan" }, purchaseScope: "all", forecastKind: "unspecified",
    metered: {
      solar: {}, gridImport: {}, gridExport: {}, batteryCharge: {},
      batteryDischarge: {}, importRate: {}, exportRate: {},
    },
    maxAgeMinutes: 60, maxContentWidth: 1200, activeThreshold: 50, sort: "energy", activeOnly: false,
    showHeader: true, showFlow: true, showConsumers: true, showPurchases: true,
    showForecasts: true, consumers: [],
    showPlanBattery: true, showPlanAllocations: true, showPlanEfficiency: true,
  };
}

export function insightsOptions(config: EnergyInsightsConfig): EnergyInsightsOptions {
  const defaults = insightsDefaults(), saved = config.energy_insights;
  return {
    ...defaults, ...saved,
    metered: { ...defaults.metered, ...saved?.metered },
  };
}

function validateMeterType(source: MeterSource, path: string): void {
  if (source.sourceType !== undefined && !["unspecified", "hardware", "integrated_power"].includes(source.sourceType)) {
    throw new Error(`${path}.sourceType: expected unspecified, hardware or integrated_power.`);
  }
  if (source.recoverGaps !== undefined && typeof source.recoverGaps !== "boolean") throw new Error(`${path}.recoverGaps: expected a boolean.`);
  if (source.recoverGaps && source.sourceType !== "hardware") throw new Error(`${path}.recoverGaps: recovery requires an explicitly verified hardware counter, never integrated power.`);
}

export function validateInsights(raw: AdditionConfig): EnergyInsightsConfig {
  if (raw.type !== `custom:${ENERGY_INSIGHTS_TAG}`) throw new Error(`Expected custom:${ENERGY_INSIGHTS_TAG}.`);
  if (raw.energy_insights !== undefined && (!raw.energy_insights || typeof raw.energy_insights !== "object" || Array.isArray(raw.energy_insights))) throw new Error("energy_insights: expected an object.");
  const savedMetered = raw.energy_insights?.metered;
  if (savedMetered !== undefined && (!savedMetered || typeof savedMetered !== "object" || Array.isArray(savedMetered))) {
    throw new Error("metered: expected source mappings.");
  }
  const options = insightsOptions(raw);
  for (const key of ["actualSource", "planSource"] as const) {
    const source = options[key];
    if (!source || typeof source !== "object" || typeof source.path !== "string" ||
      source.entity !== undefined && typeof source.entity !== "string") throw new Error(`${key}: invalid source.`);
    if (source.fields !== undefined && (!source.fields || typeof source.fields !== "object" || Array.isArray(source.fields) ||
      Object.values(source.fields).some(value => typeof value !== "string" || !value.trim()))) throw new Error(`${key}.fields: expected non-empty field paths.`);
  }
  if (!options.metered || typeof options.metered !== "object" || Array.isArray(options.metered)) {
    throw new Error("metered: expected source mappings.");
  }
  for (const key of ["home", "solar", "gridImport", "gridExport", "batteryCharge", "batteryDischarge", "importRate", "exportRate"] as const) {
    const source = options.metered[key];
    if (key === "home" && source === undefined) continue;
    if (!source || typeof source !== "object" || Array.isArray(source) ||
      source.entity !== undefined && typeof source.entity !== "string" ||
      source.field !== undefined && typeof source.field !== "string") {
      throw new Error(`metered.${key}: expected a sensor and optional attribute field.`);
    }
    if (source.absent !== undefined && typeof source.absent !== "boolean") throw new Error(`metered.${key}.absent: expected a boolean.`);
    if (source.absent && (source.entity || source.field || key === "home" || key === "gridImport" || key.endsWith("Rate"))) {
      throw new Error(`metered.${key}: Not installed is only valid for unconfigured solar, battery or export meters.`);
    }
    if (!source.entity && source.field) throw new Error(`metered.${key}.field: select a sensor before mapping a field.`);
    validateMeterType(source, `metered.${key}`);
    if (key.endsWith("Rate") && (source.sourceType !== undefined || source.recoverGaps !== undefined)) throw new Error(`metered.${key}: counter options apply only to energy meters.`);
  }
  if (options.homeBoundary !== undefined && options.homeBoundary !== "excludes_battery_charging") throw new Error("homeBoundary: expected excludes_battery_charging.");
  if (options.metered.home?.entity && options.homeBoundary !== "excludes_battery_charging") throw new Error("homeBoundary: verify that the household meter excludes battery charging before selecting it.");
  if (!["unspecified", "estimate", "interval"].includes(options.forecastKind)) throw new Error("forecastKind: expected unspecified, estimate or interval.");
  if (options.fixedExportRate !== undefined && (!Number.isFinite(options.fixedExportRate) || Math.abs(options.fixedExportRate) > 1000000)) {
    throw new Error("fixedExportRate: expected a finite rate in currency/kWh.");
  }
  if (options.fixedExportRate !== undefined && options.metered.exportRate.entity) {
    throw new Error("fixedExportRate: choose either a fixed export rate or a rate sensor.");
  }
  for (const [key, min, max] of [["maxAgeMinutes", 1, 10080], ["activeThreshold", 0, 1000000]] as const) {
    if (!Number.isFinite(options[key]) || options[key] < min || options[key] > max) throw new Error(`${key}: expected ${min}-${max}.`);
  }
  if (!["energy", "power"].includes(options.sort)) throw new Error("sort: expected energy or power.");
  if (!["all", "battery"].includes(options.purchaseScope)) throw new Error("purchaseScope: expected all or battery.");
  if (!Number.isFinite(options.maxContentWidth) || options.maxContentWidth < 0 ||
    options.maxContentWidth > 2400 || options.maxContentWidth > 0 && options.maxContentWidth < 400) {
    throw new Error("maxContentWidth: expected zero or 400–2400.");
  }
  for (const key of ["activeOnly", "showHeader", "showFlow", "showConsumers", "showPurchases", "showForecasts",
    "showPlanBattery", "showPlanAllocations", "showPlanEfficiency"] as const) {
    if (typeof options[key] !== "boolean") throw new Error(`${key}: expected a boolean.`);
  }
  for (const key of ["homeEntity", "solarEntity", "gridEntity", "batteryEntity", "selfPoweredEntity"] as const) {
    if (options[key] !== undefined && typeof options[key] !== "string") throw new Error(`${key}: expected an entity ID.`);
  }
  if (options.currency !== undefined && options.currency !== "" && !/^[A-Z]{3}$/.test(options.currency)) throw new Error("currency: expected an ISO currency code.");
  if (!Array.isArray(options.consumers) || options.consumers.length > 32) throw new Error("consumers: expected up to 32 consumers.");
  const ids = new Set<string>();
  for (const consumer of options.consumers) {
    if (!consumer || typeof consumer !== "object") throw new Error("Invalid consumer.");
    for (const key of ["id", "name"] as const) {
      if (typeof consumer[key] !== "string" || !consumer[key].trim()) throw new Error(`consumer.${key}: required.`);
    }
    for (const key of ["icon", "color", "entity", "energyField", "baselineField", "forecastField", "strategyField"] as const) {
      if (consumer[key] !== undefined && typeof consumer[key] !== "string") throw new Error(`consumer.${key}: expected text.`);
    }
    if (consumer.energySource !== undefined) {
      const meter = consumer.energySource;
      if (!meter || typeof meter !== "object" || Array.isArray(meter) ||
        meter.entity !== undefined && typeof meter.entity !== "string" ||
        meter.field !== undefined && typeof meter.field !== "string" || meter.absent !== undefined) {
        throw new Error("consumer.energySource: expected a cumulative energy sensor and optional attribute.");
      }
      if (meter.field && !meter.entity) throw new Error("consumer.energySource.field: select a sensor first.");
      validateMeterType(meter, "consumer.energySource");
    }
    if (ids.has(consumer.id)) throw new Error("consumer.id: duplicate ID.");
    ids.add(consumer.id);
  }
  return { ...raw, energy_insights: options };
}
