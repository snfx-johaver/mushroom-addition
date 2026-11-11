import type { SmartSavingConfig } from "./types";
import { validatePriceSource } from "./price-source";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateMapping(label: string, value: unknown): void {
  if (value === undefined) return;
  if (!isRecord(value)) throw new Error(`${label} must be an object.`);
  for (const field of [
    "entity", "path", "startField", "endField", "durationField", "valueField",
    "priceField", "powerField", "energyField", "statusField", "unit", "field", "powerUnit", "energyUnit",
  ]) {
    if (value[field] !== undefined && typeof value[field] !== "string") {
      throw new Error(`${label}.${field} must be text.`);
    }
    if (value.maxSourceAgeMinutes !== undefined && (typeof value.maxSourceAgeMinutes !== "number"
      || !Number.isFinite(value.maxSourceAgeMinutes) || value.maxSourceAgeMinutes < 1 || value.maxSourceAgeMinutes > 10080)) {
      throw new Error(`${label}.maxSourceAgeMinutes must be 1–10080 minutes.`);
    }
  }
}

export function validateConfig(value: unknown): SmartSavingConfig {
  if (!isRecord(value)) throw new Error("Card configuration must be an object.");
  const config = value as Partial<SmartSavingConfig>;
  if (config.type !== "custom:mushroom-addition-smart-saving") {
    throw new Error('Card type must be "custom:mushroom-addition-smart-saving".');
  }
  const price = config.price;
  validateMapping("price", price);
  validatePriceSource(price);
  if (!Number.isFinite(config.visibleHours ?? 36) || (config.visibleHours ?? 36) <= 0 || (config.visibleHours ?? 36) > 168) {
    throw new Error("visibleHours must be a number greater than 0 and no more than 168.");
  }
  for (const [name, fallback, min, max] of [
    ["maxContentWidth", 1200, 400, 2400],
    ["maxSourceAgeMinutes", 1440, 1, 10080],
    ["forecastGapMinutes", 60, 1, 1440],
  ] as const) {
    const current = config[name] ?? fallback;
    if (!Number.isFinite(current) || (name === "maxContentWidth" && current === 0 ? false : current < min || current > max)) {
      throw new Error(`${name} must be ${min}–${max}${name === "maxContentWidth" ? " or 0 (unlimited)" : ""}.`);
    }
  }
  if (config.horizon !== undefined && !["configured", "published"].includes(config.horizon)) {
    throw new Error('horizon must be "configured" or "published".');
  }
  if (config.periods !== undefined && !Array.isArray(config.periods)) {
    throw new Error("periods must be an array of named time windows.");
  }
  for (const [name, section] of [
    ["battery", config.battery],
    ["tracks", config.tracks],
    ["summary", config.summary],
  ] as const) {
    if (section !== undefined && !isRecord(section)) throw new Error(`${name} must be an object.`);
  }
  const periodNames = new Set<string>();
  for (const period of config.periods ?? []) {
    if (!isRecord(period)) throw new Error("Each periods entry must be an object.");
    if (!period.name || periodNames.has(period.name)) throw new Error("Period names must be non-empty and unique.");
    periodNames.add(period.name);
    if (!Number.isInteger(period.startHour) || period.startHour < 0 || period.startHour > 23
      || !Number.isInteger(period.endHour) || period.endHour < 0 || period.endHour > 24) {
      throw new Error(`Period "${period.name}" startHour must be 0–23 and endHour must be 0–24.`);
    }
  }
  if (config.periods && config.periods.length > 0 && config.periods.length < 4) {
    throw new Error("Configure at least four time-of-day periods.");
  }
  for (const [label, value] of [
    ["battery.current.value", config.battery?.current?.value],
    ["battery.target.value", config.battery?.target?.value],
  ] as const) {
    if (value !== undefined && (!Number.isFinite(value) || value < 0 || value > 100)) {
      throw new Error(`${label} must be between 0 and 100 percent.`);
    }
  }
  const horizon = config.battery?.horizon?.value;
  if (horizon !== undefined && (!Number.isFinite(horizon) || horizon <= 0 || horizon > 168)) {
    throw new Error("battery.horizon.value must be greater than 0 and no more than 168 hours.");
  }
  validateMapping("battery.forecast", config.battery?.forecast);
  for (const [name, source] of Object.entries({
    "battery.current": config.battery?.current,
    "battery.horizon": config.battery?.horizon,
    "battery.target": config.battery?.target,
    "summary.purchaseEnergy": config.summary?.purchaseEnergy,
    "summary.purchaseCost": config.summary?.purchaseCost,
  })) {
    validateMapping(name, source);
    if (source?.value !== undefined && (typeof source.value !== "number" || !Number.isFinite(source.value))) {
      throw new Error(`${name}.value must be a finite number.`);
    }
  }
  for (const [name, track] of Object.entries(config.tracks ?? {})) {
    validateMapping(`tracks.${name}`, track);
    if (track.meaning !== undefined && !["supplied", "confirmed"].includes(track.meaning)) {
      throw new Error(`tracks.${name}.meaning must be "supplied" or "confirmed".`);
    }
  }
  for (const [name, entity] of [
    ["statusEntity", config.statusEntity],
    ["planBlocksEntity", config.planBlocksEntity],
    ["planBlocksPath", config.planBlocksPath],
  ] as const) {
    if (entity !== undefined && typeof entity !== "string") throw new Error(`${name} must be text.`);
  }
  return config as SmartSavingConfig;
}
