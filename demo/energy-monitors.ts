import { EnergyMonitorCard } from "../src/energy-monitor/card";
import { MONITOR_CARDS, type MonitorOptions, type MonitorConfig } from "../src/energy-monitor/config";
import type { HassEntity, HomeAssistant } from "../src/types";

export function mountEnergyMonitors() {
  const end = Date.now(), start = new Date(end).setUTCHours(0, 0, 0, 0);
  const hour = 3600000, states: HomeAssistant["states"] = {}, history: Record<string, HassEntity[]> = {};
  const timestamps = [start - hour, start, ...Array.from({ length: Math.floor((end - start) / 900000) }, (_, i) => start + (i + 1) * 900000), end];
  const sensor = (name: string, unit: string, fn: (time: number) => number, cumulative = false) => {
    const id = `sensor.example_monitor_${name}`;
    const attrs = { unit_of_measurement: unit, friendly_name: `Synthetic ${name}`, ...(cumulative ? { state_class: "total_increasing" } : {}) };
    const rows = [...new Set(timestamps)].map(time => ({
      entity_id: id, state: String(fn(time)), last_updated: new Date(time).toISOString(), attributes: attrs,
    }));
    history[id] = rows;
    states[id] = rows.at(-1)!;
    return id;
  };
  const hours = (time: number) => (time - start) / hour;
  const solar = sensor("solar_power", "kW", time => Math.max(0, 3 * Math.sin((hours(time) - 6) / 12 * Math.PI)));
  const home = sensor("home_power", "W", () => 850);
  const battery = sensor("battery_power", "W", time => hours(time) > 17 ? -450 : hours(time) > 9 && hours(time) < 16 ? 800 : 0);
  const grid = sensor("grid_power", "W", time => 850 + Number(history[battery].find(row => row.last_updated === new Date(time).toISOString())?.state ?? 0) - 1000 * Number(history[solar].find(row => row.last_updated === new Date(time).toISOString())?.state ?? 0));
  const soc = sensor("soc", "%", time => 50 + 25 * Math.sin(hours(time) / 24 * Math.PI));
  const ev = sensor("ev_power", "W", () => 3600);
  const solarToEv = sensor("solar_to_ev_power", "W", () => 4200);
  const batteryToEv = sensor("battery_to_ev_power", "W", () => 0);
  const imported = sensor("import_energy", "kWh", time => 200 + hours(time) * .28, true);
  const exported = sensor("export_energy", "kWh", time => 60 + hours(time) * .06, true);
  const charge = sensor("charge_energy", "kWh", time => 40 + hours(time) * .12, true);
  const discharge = sensor("discharge_energy", "kWh", time => 30 + hours(time) * .08, true);
  const actual = sensor("home_energy", "kWh", time => 300 + hours(time) * .7, true);
  const importRate = sensor("import_rate", "EUR/kWh", time => hours(time) > 10 && hours(time) < 14 ? -.03 : hours(time) > 17 ? .34 : .18);
  const exportRate = sensor("export_rate", "EUR/kWh", time => hours(time) > 10 && hours(time) < 14 ? -.01 : .06);
  const baseline = "sensor.example_monitor_retained_baseline";
  states[baseline] = {
    entity_id: baseline, state: "retained", last_updated: new Date(start - hour).toISOString(),
    attributes: {
      generated: new Date(start - hour).toISOString(),
      intervals: Array.from({ length: 24 }, (_, i) => ({
        start: new Date(start + i * hour).toISOString(), end: new Date(start + (i + 1) * hour).toISOString(), energy: i > 17 ? .9 : .6,
      })),
    },
  };
  let gap = false, missing = false, stale = false, direct = true, staleRoutes = false, flowMode = 0;
  let darkMode = !document.documentElement.classList.contains("light");
  const liveScene = () => {
    const values = [
      [5.8, 7000, 2400, 1200, 6200, 4200, 0],
      [5.8, 1400, -3600, 800, 600, 600, 0],
      [0, 4050, 0, -4050, 3200, 0, 3200],
      [0, 0, 0, 0, 0, 0, 0],
    ][flowMode];
    return Object.fromEntries([solar, home, grid, battery, ev, solarToEv, batteryToEv].map((id, i) => [id, {
      ...states[id], state: String(values[i]), last_updated: new Date(staleRoutes && [solarToEv, batteryToEv].includes(id) ? end - 2 * hour : Date.now()).toISOString(),
    }]));
  };
  const createHass = (scene = false): HomeAssistant => ({
    states: {
      ...states,
      ...(scene ? liveScene() : {}),
      ...(missing ? { [baseline]: { ...states[baseline], state: "unavailable" } } : {}),
      ...(stale ? { [battery]: { ...states[battery], last_updated: new Date(end - 2 * hour).toISOString() } } : {}),
    },
    language: "en", themes: { darkMode }, locale: { language: "en", time_format: "24", number_format: "comma_decimal" },
    config: { time_zone: "UTC", currency: "EUR" },
    callService: async () => { throw new Error("Synthetic demo cannot control devices."); },
    callWS: async <T,>(message: Record<string, unknown>): Promise<T> => {
      const ids = message.entity_ids as string[];
      const result = Object.fromEntries(ids.map(id => [id, (history[id] ?? []).map((row, i) =>
        gap && [battery, charge, discharge].includes(id) && i > 2 && i < 5 ? { ...row, state: "unavailable" } : row)]));
      return result as T;
    },
  });
  const shared: Partial<MonitorOptions> = {
    solar: { entity: solar }, home: { entity: home }, grid: { entity: grid }, battery: { entity: battery },
    soc: { entity: soc }, ev: { entity: ev }, solarToEv: { entity: solarToEv }, batteryToEv: { entity: batteryToEv },
    chargeEnergy: { entity: charge }, dischargeEnergy: { entity: discharge },
    importEnergy: { entity: imported }, exportEnergy: { entity: exported },
    importRate: { entity: importRate }, exportRate: { entity: exportRate },
    currency: "EUR", baseline: { entity: baseline }, actualEnergy: { entity: actual },
  };
  const cards = MONITOR_CARDS.map(definition => {
    const section = document.createElement("section");
    section.id = `showcase-${definition.id}`;
    section.style.marginTop = "28px";
    const heading = document.createElement("h2"); heading.textContent = definition.name;
    const card = document.createElement(definition.tag) as EnergyMonitorCard;
    const config: MonitorConfig = { type: `custom:${definition.tag}`, name: definition.name, icon: definition.icon, energy_monitor: shared };
    const scene = definition.id === "live_energy_flow";
    card.hass = createHass(scene); card.setConfig(config);
    section.append(heading, card);
    document.querySelector("#energy-monitors")!.append(section);
    return { card, config, scene };
  });
  for (const [label, change] of [
    ["Toggle missing retained baseline", () => { missing = !missing; }],
    ["Toggle battery history gaps", () => { gap = !gap; }],
    ["Toggle stale battery power", () => { stale = !stale; }],
    ["Cycle live scene: charging / exporting / discharging / idle", () => { flowMode = (flowMode + 1) % 4; }],
    ["Toggle direct EV measurements", () => { direct = !direct; }],
    ["Toggle stale EV-route sensors", () => { staleRoutes = !staleRoutes; }],
  ] as const) {
    const button = document.createElement("button"); button.textContent = label;
    button.addEventListener("click", () => { change(); cards.forEach(({ card, config, scene }) => {
      card.hass = createHass(scene);
      card.setConfig(direct ? config : { ...config, energy_monitor: { ...config.energy_monitor, solarToEv: {}, batteryToEv: {} } });
    }); });
    document.querySelector("#monitor-controls")!.append(button);
  }
  return { theme(nextDarkMode: boolean) { darkMode = nextDarkMode; cards.forEach(({ card }) => { card.hass = { ...card.hass!, themes: { darkMode } }; }); } };
}
