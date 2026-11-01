import type { HomeAssistant, SmartSavingConfig } from "./types";

export function smartSavingStub(hass?: HomeAssistant, entities: string[] = [], fallback: string[] = []): SmartSavingConfig {
  const available = [...new Set([...entities, ...fallback, ...Object.keys(hass?.states ?? {})])];
  const healthy = (id: string) => id.startsWith("sensor.") && hass?.states[id] &&
    !["unknown", "unavailable"].includes(hass.states[id].state);
  const entity = available.find(id => healthy(id) && Array.isArray(hass!.states[id].attributes.prices))
    ?? available.find(healthy) ?? "sensor.electricity_prices";
  return {
    type: "custom:mushroom-addition-smart-saving",
    name: "Smart Saving",
    entity,
    price: { entity, path: "prices", startField: "start", endField: "end", priceField: "price",
      sourceUnit: "EUR/kWh", displayUnit: "ct/kWh" },
  };
}
