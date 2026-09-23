import "../src/index";
import {
  publicItemForSource,
  UPSTREAM_CATALOG,
  variantForSource,
} from "../src/catalog";
import { createStubConfig } from "../src/stub";
import type { AdditionConfig, HomeAssistant } from "../src/types";

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
    "sensor.battery": { entity_id: "sensor.battery", state: "72", attributes: { friendly_name: "Phone battery", unit_of_measurement: "%" } },
    "sensor.battery_charging": { entity_id: "sensor.battery_charging", state: "31", attributes: { friendly_name: "Phone battery", unit_of_measurement: "%", is_charging: true } },
    "sensor.battery_low": { entity_id: "sensor.battery_low", state: "10", attributes: { friendly_name: "Phone battery", unit_of_measurement: "%" } },
    "binary_sensor.window": { entity_id: "binary_sensor.window", state: "on", attributes: { friendly_name: "Kitchen window", device_class: "window" }, last_changed: "2026-09-23T12:00:00Z" },
    "binary_sensor.window_closed": { entity_id: "binary_sensor.window_closed", state: "off", attributes: { friendly_name: "Kitchen window", device_class: "window" }, last_changed: "2026-09-23T11:00:00Z" },
    "cover.blind": { entity_id: "cover.blind", state: "open", attributes: { friendly_name: "Living room blind", current_position: 68 } },
    "fan.bedroom": { entity_id: "fan.bedroom", state: "on", attributes: { friendly_name: "Bedroom fan", percentage: 42, oscillating: false } },
    "fan.bedroom_off": { entity_id: "fan.bedroom_off", state: "off", attributes: { friendly_name: "Bedroom fan", percentage: 0, oscillating: false } },
    "sensor.temperature": { entity_id: "sensor.temperature", state: "21.4", attributes: { friendly_name: "Living room temperature", unit_of_measurement: "°C", history: [19, 20, 20.4, 21, 20.7, 21.4] } },
    "input_boolean.guest_mode": { entity_id: "input_boolean.guest_mode", state: "on", attributes: { friendly_name: "Guest mode" } },
    "light.kitchen": { entity_id: "light.kitchen", state: "on", attributes: { friendly_name: "Kitchen lights", brightness: 172, rgb_color: [255, 174, 66] } },
    "light.kitchen_off": { entity_id: "light.kitchen_off", state: "off", attributes: { friendly_name: "Kitchen lights", brightness: 0 } },
    "media_player.tv": { entity_id: "media_player.tv", state: "playing", attributes: { friendly_name: "Living room TV", media_title: "The Expanse", volume_level: .42, entity_picture: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120'%3E%3Crect width='200' height='120' fill='%235b436f'/%3E%3C/svg%3E" } },
    "person.joris": { entity_id: "person.joris", state: "home", attributes: { friendly_name: "Joris" } },
    "person.joris_away": { entity_id: "person.joris_away", state: "not_home", attributes: { friendly_name: "Joris" } },
    "switch.outlet": { entity_id: "switch.outlet", state: "on", attributes: { friendly_name: "Office outlet" } },
    "switch.outlet_off": { entity_id: "switch.outlet_off", state: "off", attributes: { friendly_name: "Office outlet" } },
    "sensor.power": { entity_id: "sensor.power", state: "843", attributes: { friendly_name: "Power use", unit_of_measurement: "W" } },
    "scene.relax": { entity_id: "scene.relax", state: "scening", attributes: { friendly_name: "Relax" } },
    "scene.movie": { entity_id: "scene.movie", state: "scening", attributes: { friendly_name: "Movie" } },
    "scene.home": { entity_id: "scene.home", state: "scening", attributes: { friendly_name: "Home" } },
    "scene.away": { entity_id: "scene.away", state: "scening", attributes: { friendly_name: "Away" } },
    "scene.night": { entity_id: "scene.night", state: "scening", attributes: { friendly_name: "Night" } },
    "scene.music": { entity_id: "scene.music", state: "scening", attributes: { friendly_name: "Music" } },
    "script.goodnight": { entity_id: "script.goodnight", state: "off", attributes: { friendly_name: "Good night" } },
    "climate.living": { entity_id: "climate.living", state: "heat", attributes: { friendly_name: "Living room", current_temperature: 19, temperature: 21 } },
    "vacuum.robot": { entity_id: "vacuum.robot", state: "cleaning", attributes: { friendly_name: "Roborock", battery_level: 80 } },
    "vacuum.robot_docked": { entity_id: "vacuum.robot_docked", state: "docked", attributes: { friendly_name: "Roborock", battery_level: 100 } },
    "vacuum.robot_returning": { entity_id: "vacuum.robot_returning", state: "returning", attributes: { friendly_name: "Roborock", battery_level: 62 } },
    "weather.home": { entity_id: "weather.home", state: "rainy", attributes: { friendly_name: "Home", temperature: 17, temperature_unit: "°C", humidity: 68, wind_speed: 4, wind_speed_unit: "mi/h" } },
  },
  callService: async () => undefined,
  connection: {
    sendMessagePromise: async <T>() => undefined as T,
    subscribeMessage: async <T>(callback: (message: T) => void) => {
      callback({ forecast: [
        { condition: "sunny", temperature: 20, templow: 12 },
        { condition: "rainy", temperature: 15, templow: 10 },
        { condition: "cloudy", temperature: 16, templow: 11 },
      ] } as T);
      return () => undefined;
    },
  },
};

const entityFor: Record<string, string | undefined> = {
  card_battery: "sensor.battery",
  card_binary_sensor: "binary_sensor.window",
  card_binary_sensor_alert: "binary_sensor.window",
  card_cover: "cover.blind",
  card_fan: "fan.bedroom",
  card_generic: "sensor.temperature",
  card_generic_swap: "sensor.temperature",
  card_graph: "sensor.temperature",
  card_input_boolean: "input_boolean.guest_mode",
  card_light: "light.kitchen",
  card_media_player: "media_player.tv",
  card_person: "person.joris",
  card_power_outlet: "switch.outlet",
  card_room: "light.kitchen",
  card_scenes: "scene.relax",
  card_script: "script.goodnight",
  card_thermostat: "climate.living",
  card_vacuum: "vacuum.robot",
  card_vertical_button: "light.kitchen",
  card_weather: "weather.home",
  card_weather_ulm: "weather.home",
  card_welcome_scenes: "scene.relax",
};

const referenceFor: Record<string, string> = {
  card_battery: "card_battery.png",
  card_binary_sensor: "card_binary_sensor.png",
  card_binary_sensor_alert: "card_binary_sensor_alert.png",
  card_cover: "card_cover_controls.png",
  card_fan: "card_fan_slider.png",
  card_generic: "card_generic.png",
  card_generic_swap: "card_generic_swap.png",
  card_graph: "card_graph.png",
  card_input_boolean: "card_input_boolean.png",
  card_light: "card_light_combi.png",
  card_media_player: "card_media_player_art_controls.png",
  card_navigate: "card_navigate.png",
  card_person: "card_person.png",
  card_power_outlet: "card_power_outlet.png",
  card_room: "room-card.png",
  card_scenes: "card_scenes.png",
  card_script: "card_script.png",
  card_thermostat: "card_thermostat_with_controls.png",
  card_title: "card_title.png",
  card_vacuum: "card_vacuum_cleaning.png",
  card_vertical_button: "card_example.png",
  card_weather: "card_weather.png",
  card_weather_ulm: "card_weather_ulm.png",
  card_welcome_scenes: "card_welcome_scenes.png",
};

const variantsFor = (sourceId: string, base: AdditionConfig): AdditionConfig[] => {
  switch (sourceId) {
    case "card_battery": return [
      { ...base, entity: "sensor.battery_charging" },
      { ...base, entity: "sensor.battery" },
      { ...base, entity: "sensor.battery_low" },
    ];
    case "card_binary_sensor":
    case "card_binary_sensor_alert": return [
      { ...base, entity: "binary_sensor.window" },
      { ...base, entity: "binary_sensor.window_closed" },
    ];
    case "card_cover": return [
      { ...base, show_controls: false },
      { ...base, show_controls: true, ulm_card_cover_enable_controls: true },
    ];
    case "card_fan": return [
      { ...base, entity: "fan.bedroom_off", show_controls: false, ulm_card_fan_enable_slider: false },
      { ...base, ulm_card_fan_enable_slider: true },
    ];
    case "card_light": return [
      { ...base, entity: "light.kitchen_off", layout: "default", show_controls: false, ulm_card_light_enable_slider: false },
      { ...base, layout: "default", show_controls: true, ulm_card_light_enable_slider: true },
      { ...base, layout: "horizontal", show_controls: true, ulm_card_light_enable_slider: true, ulm_card_light_enable_horizontal: true },
    ];
    case "card_media_player": return [
      { ...base, show_controls: false, ulm_card_media_player_enable_art: false },
      { ...base, show_controls: true, ulm_card_media_player_enable_art: true, ulm_card_media_player_enable_controls: true },
    ];
    case "card_room": return [{ ...base, entities: ["sensor.temperature"] }];
    case "card_scenes": return [{ ...base, entities: ["scene.home", "scene.away", "scene.night", "scene.movie", "scene.relax", "scene.music"] }];
    case "card_welcome_scenes": return [{
      ...base,
      name: "Good afternoon, Joris!",
      secondary: "Scenes",
      entities: ["scene.home", "scene.away", "scene.night", "scene.movie", "scene.relax"],
    }];
    case "card_thermostat": return [{ ...base, show_controls: false }, { ...base, show_controls: true }];
    case "card_person": return [{ ...base, entity: "person.joris" }, { ...base, entity: "person.joris_away" }];
    case "card_power_outlet": return [{ ...base, entity: "switch.outlet" }, { ...base, entity: "switch.outlet_off" }];
    case "card_vacuum": return [
      { ...base, entity: "vacuum.robot_docked" },
      { ...base, entity: "vacuum.robot" },
      { ...base, entity: "vacuum.robot_returning" },
    ];
    case "card_weather": return [{ ...base, variant: "detailed", show_forecast: true }];
    case "card_weather_ulm": return [{ ...base, variant: "native", show_forecast: false }];
    case "card_title": return [{ ...base, name: "Living Room", secondary: "Light" }];
    case "card_navigate": return [{ ...base, name: "Navigate Card", secondary: "Navigate" }];
    default: return [base];
  }
};

const container = document.querySelector("#comparisons")!;
for (const source of UPSTREAM_CATALOG.filter((item) => item.category === "default-card")) {
  const item = publicItemForSource(source.upstreamId)!;
  const entity = entityFor[source.upstreamId];
  const base = {
    ...createStubConfig(item, hass, Object.keys(hass.states), Object.keys(hass.states)),
    type: `custom:${source.tag}`,
    entity,
    variant: variantForSource(source.upstreamId) ?? createStubConfig(item, hass).variant,
    name: entity ? hass.states[entity]?.attributes.friendly_name : item.name,
  };
  const section = document.createElement("section");
  section.className = "comparison";
  section.dataset.source = source.upstreamId;
  section.innerHTML = `<h2>${source.upstreamId}</h2><div class="columns"><div><div class="column-label">Upstream reference</div><img class="reference" alt="${source.upstreamId} upstream reference" src="/.tmp-ui-minimalist/docs/assets/img/ulm_cards/${referenceFor[source.upstreamId]}"></div><div><div class="column-label">Rendered implementation</div><div class="implementation"></div></div></div>`;
  const implementation = section.querySelector(".implementation")!;
  for (const config of variantsFor(source.upstreamId, base)) {
    const element = document.createElement(source.tag) as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
    };
    element.hass = hass;
    element.setConfig(config);
    implementation.append(element);
  }
  container.append(section);
}
