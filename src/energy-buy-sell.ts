import type { HassEntity } from "./types";

export interface EnergyPriceSlot {
  timestamp: number;
  price: number;
  kind: 0 | 1 | 2 | 3;
}

export interface EnergyPriceBounds {
  minimum: number;
  maximum: number;
}

const timestampMilliseconds = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value < 1_000_000_000_000 ? value * 1000 : value;
  }
  if (typeof value !== "string" || !value.trim()) return undefined;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const energyPriceSlots = (entity?: HassEntity): EnergyPriceSlot[] => {
  const slots = entity?.attributes.slots;
  if (!Array.isArray(slots)) return [];
  return slots.flatMap((value): EnergyPriceSlot[] => {
    if (!Array.isArray(value) || value.length < 3) return [];
    const timestamp = timestampMilliseconds(value[0]);
    if (
      (typeof value[1] !== "number" && (typeof value[1] !== "string" || !value[1].trim())) ||
      (typeof value[2] !== "number" && (typeof value[2] !== "string" || !value[2].trim()))
    ) return [];
    const price = Number(value[1]);
    const kind = Number(value[2]);
    if (
      timestamp === undefined ||
      !Number.isFinite(price) ||
      !Number.isInteger(kind) ||
      kind < 0 ||
      kind > 3
    ) return [];
    return [{ timestamp, price, kind: kind as EnergyPriceSlot["kind"] }];
  }).sort((left, right) => left.timestamp - right.timestamp);
};

export const energyPriceBounds = (
  slots: readonly EnergyPriceSlot[],
  configuredMinimum?: number,
  configuredMaximum?: number,
): EnergyPriceBounds => {
  const values = slots.map(({ price }) => price);
  const minimum = Number.isFinite(configuredMinimum)
    ? configuredMinimum!
    : Math.min(0, ...values);
  const highest = Number.isFinite(configuredMaximum)
    ? configuredMaximum!
    : Math.max(0, ...values);
  if (highest > minimum) {
    const padding = Number.isFinite(configuredMaximum) ? 0 : (highest - minimum) * 0.06;
    return { minimum, maximum: highest + padding };
  }
  const padding = Math.max(Math.abs(minimum) * 0.1, 1);
  return { minimum: minimum - padding, maximum: highest + padding };
};

export const formatEnergyPrice = (value: number, decimals = 2): string =>
  value.toFixed(Math.max(0, Math.min(6, Math.floor(decimals))));

export interface EnergyTradeOptions {
  energy: number;
  power: number;
  efficiency: number;
  fee: number;
  slotMinutes: number;
}

export interface EnergyTradeSelection {
  slots: { start: number; end: number; energy: number }[];
  energy: number;
  averagePrice: number;
  amount: number;
}

export type EnergyTradeResult =
  | { error: string }
  | { buy: EnergyTradeSelection; sell: EnergyTradeSelection; net: number };

export const energyTradeResult = (
  slots: readonly EnergyPriceSlot[],
  options: EnergyTradeOptions,
): EnergyTradeResult => {
  const { energy, power, efficiency, fee, slotMinutes } = options;
  if (
    ![energy, power, efficiency, fee, slotMinutes].every(Number.isFinite) ||
    energy <= 0 || power <= 0 || efficiency <= 0 || efficiency > 100 ||
    fee < 0 || slotMinutes <= 0
  ) return { error: "Enter a positive trade size, power and slot duration, an efficiency from 1 to 100%, and a non-negative feed-in fee." };
  if (slots.length === 0) return { error: "No price slots available for the buy and sell result." };

  const chronological = [...slots].sort((a, b) => a.timestamp - b.timestamp);
  if (chronological.some((slot, index) =>
    !Number.isFinite(slot.timestamp) || !Number.isFinite(slot.price) ||
    (index > 0 && slot.timestamp === chronological[index - 1].timestamp)
  )) return { error: "Price slots must contain finite prices and unique timestamps." };
  const available = chronological.map((slot, index) => ({
    ...slot,
    duration: Math.min(
      slotMinutes * 60_000,
      chronological[index + 1] ? chronological[index + 1].timestamp - slot.timestamp : Infinity,
    ),
  })).sort((a, b) => a.price - b.price || a.timestamp - b.timestamp);
  const used = new Set<number>();
  const select = (target: number, descending: boolean): EnergyTradeSelection | undefined => {
    let remaining = target;
    let total = 0;
    const selected: EnergyTradeSelection["slots"] = [];
    for (let i = 0; i < available.length && remaining > 1e-9; i++) {
      const slot = available[descending ? available.length - 1 - i : i];
      if (used.has(slot.timestamp)) continue;
      const amount = Math.min(remaining, power * slot.duration / 3_600_000);
      used.add(slot.timestamp);
      selected.push({ start: slot.timestamp, end: slot.timestamp + amount / power * 3_600_000, energy: amount });
      total += amount * slot.price;
      remaining -= amount;
    }
    if (remaining > 1e-9) return undefined;
    return {
      slots: selected.sort((a, b) => a.start - b.start),
      energy: target,
      averagePrice: total / target,
      amount: descending ? total - fee * target : -total,
    };
  };
  const buy = select(energy / (efficiency / 100), false);
  const sell = select(energy, true);
  if (!buy || !sell) return { error: "Not enough separate price slots to buy and sell the configured trade size. Reduce the trade size or supply more prices." };
  return { buy, sell, net: buy.amount + sell.amount };
};
