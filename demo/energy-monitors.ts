import { EnergyMonitorCard } from "../src/energy-monitor/card";
import { MONITOR_CARDS, type MonitorOptions, type MonitorConfig } from "../src/energy-monitor/config";
import type { HomeAssistant } from "../src/types";

export function mountEnergyMonitors() {
  const end = Date.now(), hour = 3600000, states: HomeAssistant["states"] = {};
  const sensor = (name: string, unit: string, value: number) => {
    const id = `sensor.example_monitor_${name}`;
    states[id] = { entity_id: id, state: String(value), last_updated: new Date(end).toISOString(),
      attributes: { unit_of_measurement: unit, friendly_name: `Synthetic ${name}` } };
    return id;
  };
  const solar = sensor("solar_power", "kW", 5.8);
  const home = sensor("home_power", "W", 7000);
  const battery = sensor("battery_power", "W", 1200);
  const grid = sensor("grid_power", "W", 2400);
  const ev = sensor("ev_power", "W", 6200);
  const solarToEv = sensor("solar_to_ev_power", "W", 4200);
  const batteryToEv = sensor("battery_to_ev_power", "W", 0);
  let stale = false, direct = true, staleRoutes = false, flowMode = 0;
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
      ...(stale ? { [battery]: { ...states[battery], last_updated: new Date(end - 2 * hour).toISOString() } } : {}),
    },
    language: "en", themes: { darkMode }, locale: { language: "en", time_format: "24", number_format: "comma_decimal" },
    config: { time_zone: "UTC", currency: "EUR" },
    callService: async () => { throw new Error("Synthetic demo cannot control devices."); },
  });
  const shared: Partial<MonitorOptions> = {
    solar: { entity: solar }, home: { entity: home }, grid: { entity: grid }, battery: { entity: battery },
    ev: { entity: ev }, solarToEv: { entity: solarToEv }, batteryToEv: { entity: batteryToEv },
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
