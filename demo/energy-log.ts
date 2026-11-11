import type { HassEntity, HomeAssistant } from "../src/types";
import type { MushroomEnergyLogCard } from "../src/energy-cards/energy-log";
import type { EnergyLogConfig } from "../src/energy-cards/energy-log-config";

export function mountEnergyLogDemo() {
  const strategy = "input_select.example_hems_strategy";
  const plan = "sensor.example_hems_plan";
  const execution = "sensor.example_hems_execution";
  const now = Date.now();
  const row = (entity_id: string, state: string, time: number, attributes = {}): HassEntity => ({
    entity_id, state, last_updated: new Date(time).toISOString(), attributes,
  });
  const history: Record<string, HassEntity[]> = {
    [strategy]: [row(strategy, "Solar first", now - 2400000), row(strategy, "Smart saving", now - 1200000)],
    [plan]: [
      row(plan, "ready", now - 2400000, { plan: { schedule: "No proposed charging" } }),
      row(plan, "ready", now - 900000, { plan: { schedule: "Off-peak charging proposed" } }),
    ],
    [execution]: [row(execution, "Idle", now - 2400000), row(execution, "Waiting for next window", now - 600000)],
  };
  let hass: HomeAssistant = {
    states: Object.fromEntries(Object.entries(history).map(([id, rows]) => [id, rows.at(-1)!])),
    language: "en", config: { time_zone: "UTC" }, themes: { darkMode: !document.documentElement.classList.contains("light") },
    callService: async () => { throw new Error("The Energy Log showcase cannot control devices."); },
    callWS: async <T>(message: Record<string, unknown>) => {
      if (message.type !== "history/history_during_period" || !Array.isArray(message.entity_ids)) {
        throw new Error("Unsupported synthetic history request.");
      }
      return Object.fromEntries(message.entity_ids.map(id => {
        if (typeof id !== "string" || !history[id]) throw new Error("Only fictional HEMS entities are supported.");
        return [id, history[id]];
      })) as T;
    },
  };
  const config: EnergyLogConfig = {
    type: "custom:mushroom-addition-energy-log", name: "HEMS-style energy activity",
    secondary_info: "custom", secondary: "Fictional entity changes; no connected devices.",
    icon: "mdi:calendar-clock", allIcon: "mdi:view-list", historyHours: 24,
    clockFormat: "24", timeZone: "UTC",
    sources: [
      { id: "strategy", entity: strategy, adapter: "changes", category: "planning", name: "Strategy" },
      { id: "plan", entity: plan, adapter: "changes", category: "planning", name: "Proposed charge schedule", field: "plan.schedule" },
      { id: "execution", entity: execution, adapter: "changes", category: "operation", name: "Reported execution status" },
    ],
    categories: [
      { id: "planning", label: "Planning", color: "purple", icon: "mdi:calendar-clock" },
      { id: "operation", label: "Operation", color: "teal", icon: "mdi:lightning-bolt" },
    ],
  };
  const preview = document.querySelector("#energy-log-preview")!;
  let card: MushroomEnergyLogCard;
  const reopen = () => {
    card?.remove();
    card = document.createElement("mushroom-addition-energy-log") as MushroomEnergyLogCard;
    card.hass = hass; card.setConfig(config); preview.append(card);
  };
  const controls = document.querySelector("#energy-log-controls")!;
  const button = (text: string, action: () => void) => {
    const b = document.createElement("button"); b.textContent = text; b.addEventListener("click", action); controls.append(b);
  };
  const update = (id: string, state: string, attributes = {}) => {
    const next = row(id, state, Date.now(), attributes);
    history[id].push(next);
    hass = { ...hass, states: { ...hass.states, [id]: next } };
    card.hass = hass;
  };
  button("Simulate strategy change", () => update(strategy, hass.states[strategy].state === "Smart saving" ? "Solar first" : "Smart saving"));
  button("Simulate proposed schedule change", () => update(plan, "ready", { plan: {
    schedule: (history[plan].length % 2) ? "Off-peak charging proposed" : "No proposed charging",
  } }));
  button("Reopen card", reopen);
  reopen();
  return { theme(darkMode: boolean) { hass = { ...hass, themes: { darkMode } }; card.hass = hass; } };
}
