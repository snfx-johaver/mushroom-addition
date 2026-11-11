import type { HassEntity, HomeAssistant } from "./types";
import type { PriceConfig } from "./energy-cards/types";
import { convertPrice, currencyPriceUnit, numeric, priceCurrency } from "./energy-cards/data";
import { readPriceIntervals } from "./energy-cards/price-source";

export interface TariffInterval {
  start: number;
  end: number;
  price: number;
}

export const numericEntityState = (
  hass: HomeAssistant,
  entityId?: string,
): number | undefined => {
  if (!entityId) return undefined;
  return numeric(hass.states[entityId]?.state);
};

export const entityUnit = (
  hass: HomeAssistant,
  entityId?: string,
  fallback = "",
): string => {
  if (!entityId) return fallback;
  return hass.states[entityId]?.attributes.unit_of_measurement ?? fallback;
};

export const powerEntityWatts = (
  hass: HomeAssistant,
  entityId?: string,
): number | undefined => {
  const value = numericEntityState(hass, entityId);
  if (value === undefined) return undefined;
  const unit = entityUnit(hass, entityId).toLowerCase();
  const watts = unit === "mw" ? value * 1_000_000 : unit === "kw" ? value * 1000 : unit === "w" ? value : undefined;
  return watts !== undefined && Number.isFinite(watts) ? watts : undefined;
};

export const formatPower = (watts?: number): string => {
  if (watts === undefined) return "—";
  const absolute = Math.abs(watts ?? 0);
  if (absolute >= 1000) {
    return `${(absolute / 1000).toFixed(2).replace(".", ",")} kW`;
  }
  return `${Math.round(absolute).toLocaleString()} W`;
};

export const energyArcPath = (
  radius: number,
  startAngle: number,
  endAngle: number,
  centerX = 380,
  centerY = 300,
): string => {
  const point = (angle: number): [number, number] => {
    const radians = angle * Math.PI / 180;
    return [
      centerX + radius * Math.sin(radians),
      centerY - radius * Math.cos(radians),
    ];
  };
  const [startX, startY] = point(startAngle);
  const [endX, endY] = point(endAngle);
  return `M${startX.toFixed(1)} ${startY.toFixed(1)}A${radius} ${radius} 0 ${
    endAngle - startAngle > 180 ? 1 : 0
  } 1 ${endX.toFixed(1)} ${endY.toFixed(1)}`;
};

export const energyBarPath = (
  radius: number,
  startAngle: number,
  endAngle: number,
  fraction: number,
  fromEnd = false,
): string | undefined => {
  const clamped = Math.max(0, Math.min(1, fraction));
  if (clamped < 0.015) return undefined;
  const span = (endAngle - startAngle) * clamped;
  return fromEnd
    ? energyArcPath(radius, endAngle - span, endAngle)
    : energyArcPath(radius, startAngle, startAngle + span);
};

const rawTariffIntervals = (entity?: HassEntity): unknown[] => {
  const raw = entity?.attributes.raw_today;
  return Array.isArray(raw) ? raw : [];
};

export const tariffIntervals = (
  entity: HassEntity | undefined,
  markup = 0,
  vatPercentage = 0,
  mapping?: PriceConfig,
): TariffInterval[] => {
  if (mapping) {
    const sourceUnit = mapping.sourceUnit ?? "EUR/kWh";
    const currency = priceCurrency(sourceUnit, mapping.displayUnit, mapping.currency);
    const unit = currencyPriceUnit(currency);
    return readPriceIntervals(entity, mapping).items.map(item => ({
      start: item.start, end: item.end, price: (convertPrice(item.value, sourceUnit, unit) + markup) * (1 + vatPercentage / 100),
    }));
  }
  return rawTariffIntervals(entity).flatMap((value) => {
    if (!value || typeof value !== "object") return [];
    const record = value as Record<string, unknown>;
    const start = new Date(String(record.start ?? "")).getTime();
    const end = new Date(String(record.end ?? "")).getTime();
    const rawPrice = Number(record.value);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start || !Number.isFinite(rawPrice)) return [];
    return [{
      start,
      end,
      price: (rawPrice + markup) * (1 + vatPercentage / 100),
    }];
  });
};
