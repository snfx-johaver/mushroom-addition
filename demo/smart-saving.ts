import { SmartSavingPlanCard } from "../src/energy-cards/card";
import type { HassEntity, HomeAssistant, SmartSavingConfig } from "../src/energy-cards/types";

export function mountSmartSavingDemo() {
  const card = new SmartSavingPlanCard();
  const start = Date.now(), hour = 3_600_000;
  const iso = (hours: number) => new Date(start + hours * hour).toISOString();
  const states: Record<string, HassEntity> = {};
  const sensor = (name: string, state: string, attributes: Record<string, unknown> = {}) => {
    const id = `sensor.example_smart_${name}`;
    states[id] = { entity_id: id, state, last_updated: iso(0), attributes: { friendly_name: `Synthetic ${name}`, ...attributes } };
    return id;
  };
  const prices = sensor("prices", "ready", {
    prices: Array.from({ length: 48 }, (_, i) => ({
      start: iso(i / 2), end: iso((i + 1) / 2),
      price: i < 8 ? .26 : i < 16 ? .34 : i < 28 ? -.025 + (i % 3) * .012 : i < 38 ? .14 : .24,
    })).filter((_, i) => i !== 19 && i !== 20),
  });
  const battery = sensor("battery", "62", { unit_of_measurement: "%" });
  const forecast = sensor("forecast", "ready", {
    forecast: Array.from({ length: 25 }, (_, i) => ({
      time: iso(i), value: i < 8 ? 62 - i * 4 : i < 16 ? 34 + (i - 8) * 7 : 90 - (i - 16) * 5,
    })).filter((_, i) => i !== 11 && i !== 12),
  });
  const plan = sensor("plan", "ready", { blocks: [
    { start: iso(8), end: iso(10), power: 2.4, energy: 4.8, status: "Scheduled" },
    { start: iso(13), end: iso(15), power: 1.8, energy: 3.6, status: "Scheduled" },
  ] });
  const sale = sensor("sale", "ready", { blocks: [
    { start: iso(4), end: iso(6), power: "1.2 kW", energy: "2.4 kWh", status: "Supplied schedule" },
  ] });
  const ev = sensor("ev", "ready", { blocks: [
    { start: iso(9), end: iso(12), power: "3.6 kW", energy: "10.8 kWh" },
  ] });
  const solar = sensor("solar", "ready", {
    forecast: Array.from({ length: 24 }, (_, i) => ({
      start: iso(i), end: iso(i + 1), value: Math.max(0, 3.8 * Math.sin((i - 5) / 11 * Math.PI)),
    })),
  });
  let config: SmartSavingConfig = {
    type: "custom:mushroom-addition-smart-saving", name: "Smart Saving",
    subtitle: "Published prices, battery outlook and supplied schedules", visibleHours: 36,
    price: { entity: prices, path: "prices", startField: "start", endField: "end", priceField: "price", sourceUnit: "EUR/kWh", displayUnit: "ct/kWh", maxSourceAgeMinutes: 1440 },
    battery: {
      current: { entity: battery, maxSourceAgeMinutes: 10 },
      forecast: { entity: forecast, path: "forecast", startField: "time", valueField: "value", maxSourceAgeMinutes: 60 },
      target: { value: 80 }, horizon: { value: 24 },
    },
    tracks: {
      plan: { entity: plan, path: "blocks", startField: "start", endField: "end", powerUnit: "kW", energyUnit: "kWh", maxSourceAgeMinutes: 60 },
      applied: { entity: sale, path: "blocks", startField: "start", endField: "end" },
      ev: { entity: ev, path: "blocks", startField: "start", endField: "end" },
      solar: { entity: solar, path: "forecast", startField: "start", endField: "end", valueField: "value", unit: "kW" },
    },
    summary: { purchaseEnergy: { value: 8.4 }, purchaseCost: { value: .42 } },
    planBlocksEntity: plan,
  };
  let hass: HomeAssistant = {
    states, language: "en", locale: { language: "en", time_format: "24", number_format: "comma_decimal" },
    config: { time_zone: "UTC" }, callService: async () => { throw new Error("Synthetic demo does not control devices."); },
  };
  card.hass = hass;
  card.setConfig(config);
  const preview = document.querySelector<HTMLElement>("#smart-preview")!;
  preview.append(card);
  const buttons = document.querySelector("#smart-controls")!;
  for (const [label, width] of [["Phone", "360px"], ["Section", "620px"], ["Wide", "100%"]] as const) {
    const button = document.createElement("button");
    button.textContent = label;
    button.addEventListener("click", () => { preview.style.width = width; });
    buttons.append(button);
  }
  const horizon = document.createElement("button");
  horizon.textContent = "Fit published horizon";
  horizon.addEventListener("click", () => {
    config = { ...config, horizon: config.horizon === "published" ? "configured" : "published" };
    card.setConfig(config);
    horizon.textContent = config.horizon === "published" ? "Show configured horizon" : "Fit published horizon";
  });
  buttons.append(horizon);
  const stale = document.createElement("button");
  stale.textContent = "Show stale source";
  let staleSource = false;
  stale.addEventListener("click", () => {
    staleSource = !staleSource;
    hass = { ...hass, states: { ...hass.states,
      [prices]: { ...states[prices], last_updated: iso(staleSource ? -30 : 0) },
      [battery]: { ...states[battery], last_updated: iso(staleSource ? -1 : 0) },
    } };
    card.hass = hass;
    stale.textContent = staleSource ? "Restore fresh source" : "Show stale source";
  });
  buttons.append(stale);
  return {
    theme(darkMode: boolean) { hass = { ...hass, themes: { darkMode } }; card.hass = hass; },
  };
}
