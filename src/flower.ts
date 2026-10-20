import type { AdditionConfig } from "./types";

export const FLOWER_BARS = [
  { key: "temperature", label: "Temperature", icon: "mdi:thermometer", min: -10, max: 50 },
  { key: "humidity", label: "Humidity", icon: "mdi:water-percent", min: 0, max: 100 },
  { key: "moisture", label: "Moisture", icon: "mdi:water", min: 0, max: 100 },
  { key: "conductivity", label: "Conductivity", icon: "mdi:flash", min: 0, max: 3000 },
  { key: "illuminance", label: "Illuminance", icon: "mdi:white-balance-sunny", min: 0, max: 100000 },
  { key: "dli", label: "Daily light integral", icon: "mdi:leaf", min: 0, max: 30 },
] as const;

export type FlowerBarKey = typeof FLOWER_BARS[number]["key"];

const flowerBarKeys = new Set<string>(FLOWER_BARS.map(({ key }) => key));

export const flowerBarsForConfig = (config?: AdditionConfig): FlowerBarKey[] => {
  const configured = config?.ulm_card_flower_show_bars;
  if (!Array.isArray(configured)) return FLOWER_BARS.map(({ key }) => key);
  return [...new Set(configured)]
    .filter((value): value is FlowerBarKey => typeof value === "string" && flowerBarKeys.has(value));
};

export const flowerEntityConfigKey = (key: FlowerBarKey): `${FlowerBarKey}_entity` =>
  `${key}_entity`;
