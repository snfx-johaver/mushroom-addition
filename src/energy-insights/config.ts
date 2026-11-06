import type { AdditionConfig } from "../types";

export const ENERGY_INSIGHTS_TAG = "mushroom-addition-energy-insights";

export interface InsightsConsumer {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  entity?: string;
  energyField: string;
  baselineField?: string;
  forecastField?: string;
  strategyField?: string;
}

export interface InsightsSource {
  entity?: string;
  path: string;
  fields?: Record<string, string>;
}

export interface EnergyInsightsOptions {
  actualSource: InsightsSource;
  planSource: InsightsSource;
  currency?: string;
  maxAgeMinutes: number;
  activeThreshold: number;
  sort: "energy" | "power";
  activeOnly: boolean;
  showHeader: boolean;
  showFlow: boolean;
  showConsumers: boolean;
  showPurchases: boolean;
  showForecasts: boolean;
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
    actualSource: { path: "actuals" }, planSource: { path: "plan" },
    maxAgeMinutes: 60, activeThreshold: 50, sort: "energy", activeOnly: false,
    showHeader: true, showFlow: true, showConsumers: true, showPurchases: true,
    showForecasts: true, consumers: [],
  };
}

export function insightsOptions(config: EnergyInsightsConfig): EnergyInsightsOptions {
  return { ...insightsDefaults(), ...config.energy_insights };
}

export function validateInsights(raw: AdditionConfig): EnergyInsightsConfig {
  if (raw.type !== `custom:${ENERGY_INSIGHTS_TAG}`) throw new Error(`Expected custom:${ENERGY_INSIGHTS_TAG}.`);
  if (raw.energy_insights !== undefined && (!raw.energy_insights || typeof raw.energy_insights !== "object" || Array.isArray(raw.energy_insights))) throw new Error("energy_insights: expected an object.");
  const options = insightsOptions(raw);
  for (const key of ["actualSource", "planSource"] as const) {
    const source = options[key];
    if (!source || typeof source !== "object" || typeof source.path !== "string" ||
      source.entity !== undefined && typeof source.entity !== "string") throw new Error(`${key}: invalid source.`);
    if (source.fields !== undefined && (!source.fields || typeof source.fields !== "object" || Array.isArray(source.fields) ||
      Object.values(source.fields).some(value => typeof value !== "string" || !value.trim()))) throw new Error(`${key}.fields: expected non-empty field paths.`);
  }
  for (const [key, min, max] of [["maxAgeMinutes", 1, 10080], ["activeThreshold", 0, 1000000]] as const) {
    if (!Number.isFinite(options[key]) || options[key] < min || options[key] > max) throw new Error(`${key}: expected ${min}-${max}.`);
  }
  if (!["energy", "power"].includes(options.sort)) throw new Error("sort: expected energy or power.");
  for (const key of ["activeOnly", "showHeader", "showFlow", "showConsumers", "showPurchases", "showForecasts"] as const) {
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
    for (const key of ["id", "name", "energyField"] as const) {
      if (typeof consumer[key] !== "string" || !consumer[key].trim()) throw new Error(`consumer.${key}: required.`);
    }
    for (const key of ["icon", "color", "entity", "baselineField", "forecastField", "strategyField"] as const) {
      if (consumer[key] !== undefined && typeof consumer[key] !== "string") throw new Error(`consumer.${key}: expected text.`);
    }
    if (ids.has(consumer.id)) throw new Error("consumer.id: duplicate ID.");
    ids.add(consumer.id);
  }
  return { ...raw, energy_insights: options };
}
