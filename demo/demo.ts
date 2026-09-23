import "../src/index";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import { CATALOG } from "../src/catalog";
import { createStubConfig } from "../src/stub";
import { EXAMPLE_CATALOG_IDS } from "../src/example-catalog";

class HaCard extends HTMLElement {}
if (!customElements.get("ha-card")) customElements.define("ha-card", HaCard);

class HaIcon extends HTMLElement {
  public set icon(value: string) {
    this.textContent = value.replace("mdi:", "").split("-").map((part) => part[0]).join("").slice(0, 3).toUpperCase();
  }
}
if (!customElements.get("ha-icon")) customElements.define("ha-icon", HaIcon);

const hass: HomeAssistant = {
  states: {
    "weather.home": { entity_id: "weather.home", state: "partlycloudy", attributes: { friendly_name: "Home", temperature: 17, temperature_unit: "°C", humidity: 68 } },
    "climate.living": { entity_id: "climate.living", state: "heat", attributes: { friendly_name: "Living room", current_temperature: 19, temperature: 21 } },
    "light.kitchen": { entity_id: "light.kitchen", state: "on", attributes: { friendly_name: "Kitchen lights", brightness: 172 } },
    "person.joris": { entity_id: "person.joris", state: "home", attributes: { friendly_name: "Joris" } },
    "sensor.battery": { entity_id: "sensor.battery", state: "72", attributes: { friendly_name: "Phone battery", unit_of_measurement: "%" } },
    "sensor.power": { entity_id: "sensor.power", state: "843", attributes: { friendly_name: "Home power", unit_of_measurement: "W" } },
    "switch.outlet": { entity_id: "switch.outlet", state: "on", attributes: { friendly_name: "Office outlet" } },
    "media_player.tv": { entity_id: "media_player.tv", state: "playing", attributes: { friendly_name: "Living room TV", media_title: "The Expanse" } },
    "cover.blind": { entity_id: "cover.blind", state: "open", attributes: { friendly_name: "Living room blind" } },
    "vacuum.robot": { entity_id: "vacuum.robot", state: "cleaning", attributes: { friendly_name: "Roborock", battery_level: 80 } },
    "alarm_control_panel.home": { entity_id: "alarm_control_panel.home", state: "armed_home", attributes: { friendly_name: "Home alarm" } },
    "input_boolean.alarm_enabled": { entity_id: "input_boolean.alarm_enabled", state: "on", attributes: { friendly_name: "Morning alarm" } },
    "input_datetime.alarm_time": { entity_id: "input_datetime.alarm_time", state: "07:30:00", attributes: { friendly_name: "Alarm time" } },
    "scene.relax": { entity_id: "scene.relax", state: "scening", attributes: { friendly_name: "Relax" } },
    "scene.movie": { entity_id: "scene.movie", state: "scening", attributes: { friendly_name: "Movie" } },
    "scene.bright": { entity_id: "scene.bright", state: "scening", attributes: { friendly_name: "Bright" } },
  },
  callService: async () => undefined,
  connection: {
    sendMessagePromise: async <T>() => undefined as T,
    subscribeMessage: async <T>(callback: (message: T) => void) => {
      callback({
        forecast: [
          { condition: "sunny", temperature: 20, templow: 12 },
          { condition: "rainy", temperature: 15, templow: 10 },
          { condition: "cloudy", temperature: 16, templow: 11 },
        ],
      } as T);
      return () => undefined;
    },
  },
};

const stateForDomain = (domain: string): string => {
  if (["light", "switch", "input_boolean", "fan"].includes(domain)) return "on";
  if (domain === "binary_sensor") return "off";
  if (domain === "lock") return "locked";
  if (domain === "cover") return "open";
  if (domain === "person" || domain === "device_tracker") return "home";
  if (domain === "climate") return "heat";
  if (domain === "media_player") return "playing";
  if (domain === "vacuum") return "docked";
  if (domain === "weather") return "partlycloudy";
  return "42";
};

for (const domain of new Set(CATALOG.flatMap((item) => item.preferredDomains ?? []))) {
  const entityId = `${domain}.fixture`;
  hass.states[entityId] ??= {
    entity_id: entityId,
    state: stateForDomain(domain),
    attributes: {
      friendly_name: `${domain.replaceAll("_", " ")} fixture`,
      unit_of_measurement: domain === "sensor" ? "%" : undefined,
      temperature: domain === "weather" ? 17 : undefined,
      humidity: domain === "weather" ? 68 : undefined,
    },
  };
}

const container = document.querySelector("#cards")!;
for (const upstreamId of EXAMPLE_CATALOG_IDS) {
  const item = CATALOG.find((candidate) => candidate.upstreamId === upstreamId)!;
  const config = createStubConfig(item, hass, Object.keys(hass.states), Object.keys(hass.states));
  const wrapper = document.createElement("div");
  wrapper.className = "catalog-fixture";
  const label = document.createElement("div");
  label.className = "catalog-label";
  label.textContent = `${item.upstreamId} · ${item.family}`;
  const element = document.createElement(item.tag) as HTMLElement & {
    hass: HomeAssistant;
    setConfig(config: AdditionConfig): void;
  };
  element.hass = hass;
  element.setConfig(config);
  wrapper.append(label, element);
  container.append(wrapper);
}
