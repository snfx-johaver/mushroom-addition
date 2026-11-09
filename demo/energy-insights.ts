import { EnergyInsightsCard } from "../src/energy-insights/card";
import { insightsDefaults, validateInsights, type EnergyInsightsConfig } from "../src/energy-insights/config";
import type { MushroomAdditionEditor } from "../src/editor";
import type { HomeAssistant } from "../src/types";

/** Invented metered history and independent supplied planner outputs, not a real home. */
export function mountInsightsDemo(base: HomeAssistant): { theme: (dark: boolean) => void; reset: () => void } {
  const end = new Date(); end.setHours(12, 0, 0, 0);
  const start = end.getTime() - 12 * 3600000, now = Date.now();
  const devices = [
    { id: "heat", name: "Heat pump", icon: "mdi:heat-pump", color: "orange", forecast: 7.8, watts: 720 },
    { id: "ev", name: "EV charger", icon: "mdi:car-electric", color: "purple", forecast: 8.2, watts: 0 },
    { id: "water", name: "Hot water", icon: "mdi:water", color: "amber", forecast: 3.2, watts: 0 },
    { id: "kitchen", name: "Kitchen & laundry", icon: "mdi:silverware-fork-knife", color: "blue", forecast: 2.4, watts: 45 },
    { id: "server", name: "Servers & network", icon: "mdi:server", color: "green", forecast: 2.88, watts: 120 },
    { id: "other", name: "Other home", icon: "mdi:home", color: "red", forecast: 4.12, watts: 215 },
  ];
  const usage: Record<string, number> = Object.fromEntries(devices.map(device => [device.id, 0]));
  let homeTotal = 0, solarTotal = 0;
  const intervals = Array.from({ length: 48 }, (_, index) => {
    const hour = index / 4;
    const loads = [hour >= 6 && hour < 8 ? 1.35 : .1, hour >= 1 && hour < 2.5 ? 2.4 : 0,
      hour >= 9 && hour < 9.75 ? 1.8 : 0, hour >= 7 && hour < 7.5 ? .95 : .04, .12, .21];
    const home = loads.reduce((sum, load) => sum + load, 0);
    const solar = hour >= 6.5 ? 3.6 * Math.sin(Math.PI * (hour - 6.5) / 12) : 0;
    devices.forEach((device, i) => { usage[device.id] += loads[i] * .25; });
    homeTotal += home * .25; solarTotal += solar * .25;
    return { start: start + index * 900000, end: start + (index + 1) * 900000,
      import_kwh: Math.max(0, home - solar) * .25, export_kwh: Math.max(0, solar - home) * .25,
      rate: hour < 5 ? .16 : hour < 9 ? .27 : .22, export_rate: .075 };
  });
  const snapshot = (id: string, value: string, attributes: Record<string, unknown>) => {
    base.states[id] = { entity_id: id, state: value, attributes, last_updated: new Date(now).toISOString() };
  };
  const source = "sensor.example_insights";
  const planStart = now, planEnd = now + 86400000;
  const plan = {
    start: planStart, end: planEnd, generated_at: now, currency: "EUR", home_kwh: 28.6, solar_kwh: 13.6,
    battery_min: 29, battery_reserve: 25, charge_efficiency: .94,
    consumers: Object.fromEntries(devices.map(device => [device.id, { energy: device.forecast, strategy: "Synthetic supplied forecast; not a recommendation or a device schedule." }])),
    blocks: [
      { offset: 2, hours: .5, home_kwh: .8, ev_kwh: 0, battery_kwh: 0, rate: .31, reason: "Cover an illustrative household shortfall.", detail: "Direct home supply; no battery charging." },
      { offset: 12, hours: 1.5, home_kwh: .7, ev_kwh: 6, battery_kwh: 2.4, rate: .145, target: 57, reason: "Combine EV input with a modest storage top-up.", detail: "Battery AC input is separate from household consumption." },
      { offset: 16, hours: 1, home_kwh: .9, ev_kwh: 0, battery_kwh: 2.5, rate: .17, target: 73, reason: "Build a household reserve before morning demand.", detail: "Targets are supplied example outputs, not computed from this table." },
      { offset: 19, hours: .5, home_kwh: .8, ev_kwh: 0, battery_kwh: 0, rate: .24, reason: "Supply a short household demand gap.", detail: "No EV or storage allocation." },
    ].map(block => ({ ...block, start: planStart + block.offset * 3600000, end: planStart + (block.offset + block.hours) * 3600000 })),
  };
  snapshot(source, "ready", {
    actuals: { start, end: end.getTime(), generated_at: now, currency: "EUR",
      home_kwh: homeTotal, solar_kwh: solarTotal, battery_charge_kwh: 0, battery_discharge_kwh: 0,
      baseline_start: start, baseline_end: end.getTime(), consumers: Object.fromEntries(devices.map(device => [
        device.id, { energy: usage[device.id], baseline: usage[device.id] * (device.id === "heat" ? .93 : 1) },
      ])), intervals },
    plan,
  });
  devices.forEach(device => snapshot(`sensor.example_${device.id}_power`, String(device.watts), { unit_of_measurement: "W" }));
  for (const [id, watts] of [["home", 1100], ["solar", 2750], ["grid", 0], ["battery", 1650]] as const) {
    snapshot(`sensor.example_${id}_power`, String(watts), { unit_of_measurement: "W" });
  }
  snapshot("sensor.example_self_powered", "100", { unit_of_measurement: "%" });
  const midnight = new Date(now); midnight.setHours(0, 0, 0, 0);
  base.config = { ...base.config, currency: "EUR", time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone };
  const meterNames = ["solar_meter", "import_meter", "export_meter", "charge_meter", "discharge_meter"];
  const history: Record<string, Array<{ state: string; last_updated: string; attributes: Record<string, unknown> }>> = {};
  const record = (name: string, value: number, time: number, unit = "kWh") => {
    const id = `sensor.example_${name}`;
    (history[id] ??= []).push({ state: String(value), last_updated: new Date(time).toISOString(), attributes: { unit_of_measurement: unit } });
    snapshot(id, String(value), { unit_of_measurement: unit });
  };
  const totals = Array.from({ length: 5 + devices.length }, () => 0);
  [...meterNames, ...devices.map(device => `${device.id}_meter`)].forEach(name => record(name, 0, midnight.getTime()));
  for (let time = midnight.getTime(); time < now; time += 900000) {
    const until = Math.min(now, time + 900000), hours = (until - time) / 3600000;
    const hour = (time - midnight.getTime()) / 3600000;
    const loads = [.12 + (hour >= 6 && hour < 8 ? 1.4 : 0), hour >= 1 && hour < 3 ? 2.4 : 0,
      hour >= 9 && hour < 10 ? 1.8 : 0, .08, .12, .21];
    const home = loads.reduce((sum, load) => sum + load, 0);
    const solar = hour >= 7 && hour < 18 ? Math.max(0, 3.6 * Math.sin(Math.PI * (hour - 7) / 11)) : 0;
    const charge = Math.min(.6, Math.max(0, solar - home));
    const discharge = solar === 0 ? .1 : 0;
    const grid = home + charge - solar - discharge;
    const power = [solar, Math.max(0, grid), Math.max(0, -grid), charge, discharge, ...loads];
    [...meterNames, ...devices.map(device => `${device.id}_meter`)].forEach((name, index) => {
      totals[index] += power[index] * hours;
      record(name, totals[index], until);
    });
    record("import_rate", hour < 5 ? .16 : hour < 9 ? .27 : .22, time, "EUR/kWh");
    record("export_rate", .075, time, "EUR/kWh");
  }
  base.callWS = async <T>(message: Record<string, unknown>) => {
    if (message.type !== "history/history_during_period" || !Array.isArray(message.entity_ids) ||
      message.entity_ids.some(id => typeof id !== "string" || !id.startsWith("sensor.example_"))) {
      throw new Error("Only synthetic example history requests are supported.");
    }
    return Object.fromEntries(message.entity_ids.map(id => [String(id), history[String(id)] ?? []])) as T;
  };
  const initial: EnergyInsightsConfig = {
    type: "custom:mushroom-addition-energy-insights", name: "Energy Insights & Purchases",
    secondary: "Synthetic snapshot - no live connections", icon: "mdi:lightning-bolt",
    tap_action: { action: "none" },
    energy_insights: { ...insightsDefaults(), currency: "EUR", maxAgeMinutes: 1440,
      actualSource: { entity: source, path: "actuals" }, planSource: { entity: source, path: "plan" },
      homeEntity: "sensor.example_home_power", solarEntity: "sensor.example_solar_power",
      gridEntity: "sensor.example_grid_power", batteryEntity: "sensor.example_battery_power",
      selfPoweredEntity: "sensor.example_self_powered",
      consumers: devices.map(device => ({ id: device.id, name: device.name, icon: device.icon, color: device.color,
        entity: `sensor.example_${device.id}_power`, energyField: `consumers.${device.id}.energy`, baselineField: `consumers.${device.id}.baseline`,
        forecastField: `consumers.${device.id}.energy`, strategyField: `consumers.${device.id}.strategy` })),
    },
  };
  // Keep the 00:00-12:00 example in the past, regardless of the viewer's clock.
  if (end.getTime() > now) {
    const shift = 86400000;
    const actuals = base.states[source].attributes.actuals as { start: number; end: number; baseline_start: number; baseline_end: number; intervals: typeof intervals };
    actuals.start -= shift; actuals.end -= shift; actuals.baseline_start -= shift; actuals.baseline_end -= shift;
    actuals.intervals.forEach(interval => { interval.start -= shift; interval.end -= shift; });
  }
  const card = document.createElement("mushroom-addition-energy-insights") as EnergyInsightsCard;
  const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
  const key = "mushroom-addition-energy-insights-synthetic-config";
  const status = document.querySelector("#saved")!;
  function safe(raw: EnergyInsightsConfig): EnergyInsightsConfig {
    const valid = validateInsights(raw);
    const visit = (value: unknown): void => {
      if (!value || typeof value !== "object") return;
      for (const [key, item] of Object.entries(value)) {
        if ((key === "entity" || key.endsWith("Entity")) && typeof item === "string" && item && !(item in base.states)) throw new Error("Only fictional example entities are accepted.");
        if (key.endsWith("_action") && item && typeof item === "object" && "action" in item && !["none", "more-info"].includes(String(item.action))) throw new Error("Only none or more-info showcase actions are allowed.");
        visit(item);
      }
    };
    visit(valid); return valid;
  }
  let config = initial;
  try { const saved = localStorage.getItem(key); if (saved) config = safe(JSON.parse(saved)); }
  catch (error) { if (!(error instanceof Error)) throw error; status.textContent = `Saved example rejected: ${error.message}`; }
  card.hass = editor.hass = base; card.setConfig(config); editor.setConfig(config);
  document.querySelector("#insights-preview")!.append(card); document.querySelector("#insights-editor")!.append(editor);
  editor.addEventListener("config-changed", event => {
    try {
      config = safe((event as CustomEvent<{ config: EnergyInsightsConfig }>).detail.config);
      card.setConfig(config); localStorage.setItem(key, JSON.stringify(config)); status.textContent = "Synthetic Insights configuration saved locally.";
    } catch (error) { if (!(error instanceof Error)) throw error; status.textContent = `Configuration rejected: ${error.message}`; }
  });
  document.querySelector("#insights-mode")?.addEventListener("click", () => {
    const metered = {
      ...initial.energy_insights!,
      actualSource: { path: "actuals" },
      metered: {
        solar: { entity: "sensor.example_solar_meter" }, gridImport: { entity: "sensor.example_import_meter" },
        gridExport: { entity: "sensor.example_export_meter" }, batteryCharge: { entity: "sensor.example_charge_meter" },
        batteryDischarge: { entity: "sensor.example_discharge_meter" }, importRate: { entity: "sensor.example_import_rate" },
        exportRate: { entity: "sensor.example_export_rate" },
      },
      consumers: initial.energy_insights!.consumers.map(consumer => ({
        ...consumer, energySource: { entity: `sensor.example_${consumer.id}_meter` },
      })),
    };
    config = config.energy_insights?.actualSource.entity ? { ...initial, energy_insights: metered } : initial;
    card.setConfig(config); editor.setConfig(config);
    status.textContent = config.energy_insights?.actualSource.entity
      ? "Synthetic legacy snapshot example." : "Synthetic individual-meter example. Recorder is simulated locally.";
  });
  return {
    theme: dark => { card.hass = editor.hass = { ...base, themes: { darkMode: dark } }; },
    reset: () => { localStorage.removeItem(key); card.setConfig(initial); editor.setConfig(initial); },
  };
}
