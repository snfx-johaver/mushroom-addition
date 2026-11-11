import type { HassEntity, HomeAssistant, PriceConfig, PriceUnit } from "./types";
import { currencyPriceUnit, isPriceUnit, priceCurrency, readPath } from "./data";
import { sourceAvailable, sourceHealth, strictIntervals } from "./smart-saving-data";

export function validatePriceSource(value: unknown): void {
  if (value === undefined) return;
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Price source must be an object.");
  const source = value as Record<string, unknown>;
  for (const key of ["entity", "path", "startField", "endField", "durationField", "priceField", "currency"]) {
    if (source[key] !== undefined && typeof source[key] !== "string") throw new Error(`price.${key} must be text.`);
  }
  if (source.adapter !== undefined && !["attribute", "state"].includes(String(source.adapter))) throw new Error("Price adapter must be attribute or state.");
  for (const key of ["sourceUnit", "displayUnit"]) {
    if (source[key] !== undefined && !isPriceUnit(source[key])) throw new Error(`price.${key}: unsupported price unit.`);
  }
  if (source.maxSourceAgeMinutes !== undefined && (typeof source.maxSourceAgeMinutes !== "number" ||
    !Number.isFinite(source.maxSourceAgeMinutes) || source.maxSourceAgeMinutes < 1 || source.maxSourceAgeMinutes > 10080)) {
    throw new Error("price.maxSourceAgeMinutes must be 1–10080 minutes.");
  }
  const unit = source.sourceUnit ?? "EUR/kWh";
  const display = source.displayUnit ?? unit;
  if (!isPriceUnit(unit) || !isPriceUnit(display)) throw new Error("Unsupported price unit.");
  priceCurrency(unit, display, typeof source.currency === "string" ? source.currency : undefined);
}

export function readPriceIntervals(entity: HassEntity | undefined, mapping: PriceConfig) {
  if (!sourceAvailable(entity)) return { valid: false, items: [], error: entity ? "Unavailable" : "Source missing" };
  if (mapping.maxSourceAgeMinutes !== undefined) {
    const health = sourceHealth(entity, Date.now(), mapping.maxSourceAgeMinutes);
    if (health) return { valid: false, items: [], error: health };
  }
  let root: unknown;
  if (mapping.adapter === "state") {
    try { root = JSON.parse(entity!.state) as unknown; }
    catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
      return { valid: false, items: [], error: "Invalid data source or field mapping" };
    }
  }
  const parsed = strictIntervals(entity, { startField: "start", endField: "end", ...mapping }, mapping.priceField ?? "price", root);
  return { ...parsed, error: parsed.valid ? undefined : "Invalid data source or field mapping" };
}

export function discoverPriceSource(hass?: HomeAssistant, ids = Object.keys(hass?.states ?? {})): PriceConfig | undefined {
  for (const id of [...new Set(ids)]) {
    const entity = hass?.states[id];
    if (!sourceAvailable(entity)) continue;
    const rawUnit = entity!.attributes.unit_of_measurement;
    const aliases: Record<string, PriceUnit> = { "€/kWh": "EUR/kWh", "€/MWh": "EUR/MWh" };
    const configuredCurrency = hass?.config?.currency;
    const currency = configuredCurrency && /^[A-Z]{3}$/.test(configuredCurrency) ? configuredCurrency : "EUR";
    const sourceUnit = rawUnit ? aliases[rawUnit] ?? rawUnit : `${currency}/kWh`;
    if (!isPriceUnit(sourceUnit)) continue;
    const displayUnit: PriceUnit = sourceUnit === "EUR/kWh" ? "ct/kWh"
      : sourceUnit.endsWith("/MWh") ? currencyPriceUnit(sourceUnit.split("/")[0]) : sourceUnit;
    const roots: Array<{ adapter: "attribute" | "state"; path: string }> =
      ["prices", "raw_today", "raw_tomorrow", "plan"].filter(path => Array.isArray(entity!.attributes[path]))
        .map(path => ({ adapter: "attribute", path }));
    if (entity!.state.trimStart().startsWith("[") || entity!.state.trimStart().startsWith("{")) {
      try {
        const state: unknown = JSON.parse(entity!.state);
        for (const path of ["", "prices"]) if (Array.isArray(readPath(state, path))) roots.push({ adapter: "state", path });
      } catch (error) {
        if (!(error instanceof SyntaxError)) throw error;
      }
    }
    for (const root of roots) {
      for (const [startField, endField] of [["start", "end"], ["from", "to"], ["start_time", "end_time"]]) {
        for (const priceField of ["price", "value", "total"]) {
          if (priceField !== "price" && !rawUnit && (root.path === "plan" || root.path === "")) continue;
          const mapping: PriceConfig = { entity: id, ...root, startField, endField, durationField: "duration", priceField,
            sourceUnit, displayUnit };
          const parsed = readPriceIntervals(entity, mapping);
          if (parsed.valid && parsed.items.length) return mapping;
        }
      }
    }
  }
  return undefined;
}
