import type { HomeAssistant, SmartSavingConfig } from "./types";
import { discoverPriceSource } from "./price-source";

export function smartSavingStub(hass?: HomeAssistant, entities: string[] = [], fallback: string[] = []): SmartSavingConfig {
  const available = [...new Set([...entities, ...fallback, ...Object.keys(hass?.states ?? {})])];
  const price = discoverPriceSource(hass, available);
  return {
    type: "custom:mushroom-addition-smart-saving",
    name: "Smart Saving",
    ...(price ? { entity: price.entity, price } : {}),
  };
}
