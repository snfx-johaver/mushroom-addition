import "../src/index";
import * as mdiPaths from "@mdi/js";
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
  public static get observedAttributes() { return ["icon"]; }

  public constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  public set icon(value: string) {
    const exportName = value.startsWith("mdi:")
      ? `mdi${value.slice(4).split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("")}`
      : "";
    const path = (mdiPaths as Record<string, unknown>)[exportName];
    this.shadowRoot!.innerHTML = typeof path === "string"
      ? `<style>:host{display:inline-flex;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px);color:inherit}svg{display:block;width:100%;height:100%;fill:currentColor}</style><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"></path></svg>`
      : `<style>:host{display:inline-flex;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px)}</style>`;
  }

  public attributeChangedCallback(_name: string, _oldValue: string | null, value: string | null) {
    if (value) this.icon = value;
  }
}
if (!customElements.get("ha-icon")) customElements.define("ha-icon", HaIcon);

const hass: HomeAssistant = {
  states: {
    "sensor.battery": { entity_id: "sensor.battery", state: "72", attributes: { friendly_name: "Phone battery", unit_of_measurement: "%" } },
    "sensor.battery_charging": { entity_id: "sensor.battery_charging", state: "31", attributes: { friendly_name: "Phone battery", unit_of_measurement: "%" } },
    "sensor.battery_usb": { entity_id: "sensor.battery_usb", state: "31", attributes: { friendly_name: "Phone battery", unit_of_measurement: "%" } },
    "sensor.battery_warning": { entity_id: "sensor.battery_warning", state: "25", attributes: { friendly_name: "Phone battery", unit_of_measurement: "%" } },
    "sensor.battery_state": { entity_id: "sensor.battery_state", state: "charging", attributes: { friendly_name: "Battery state" } },
    "sensor.charger_type": { entity_id: "sensor.charger_type", state: "wireless", attributes: { friendly_name: "Charger type" } },
    "sensor.battery_low": { entity_id: "sensor.battery_low", state: "10", attributes: { friendly_name: "Phone battery", unit_of_measurement: "%" } },
    "binary_sensor.window": { entity_id: "binary_sensor.window", state: "on", attributes: { friendly_name: "Kitchen window", device_class: "window", icon: "mdi:checkbox-blank" }, last_changed: "2026-09-23T12:00:00Z" },
    "binary_sensor.window_closed": { entity_id: "binary_sensor.window_closed", state: "off", attributes: { friendly_name: "Kitchen window", device_class: "window", icon: "mdi:checkbox-blank-outline" }, last_changed: "2026-09-23T11:00:00Z" },
    "cover.blind": { entity_id: "cover.blind", state: "open", attributes: { friendly_name: "Living room blind", current_position: 68, current_tilt_position: 20, device_class: "blind" } },
    "fan.bedroom": { entity_id: "fan.bedroom", state: "on", attributes: { friendly_name: "Bedroom fan", percentage: 42, oscillate: false, temperature: 22.4, humidity: 48 } },
    "fan.bedroom_off": { entity_id: "fan.bedroom_off", state: "off", attributes: { friendly_name: "Bedroom fan", percentage: 0, oscillating: false } },
    "sensor.temperature": { entity_id: "sensor.temperature", state: "21.4", attributes: { friendly_name: "Living room temperature", unit_of_measurement: "°C", history: [19, 20, 20.4, 21, 20.7, 21.4] } },
    "input_boolean.guest_mode": { entity_id: "input_boolean.guest_mode", state: "on", attributes: { friendly_name: "Guest mode" } },
    "input_boolean.bed_mode": { entity_id: "input_boolean.bed_mode", state: "off", attributes: { friendly_name: "Bed mode", icon: "mdi:bed" } },
    "input_boolean.scenes_collapsed": { entity_id: "input_boolean.scenes_collapsed", state: "off", attributes: { friendly_name: "Collapse scenes" } },
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
    "script.clean_living_room": { entity_id: "script.clean_living_room", state: "off", attributes: { friendly_name: "Clean living room", icon: "mdi:sofa" } },
    "climate.living": { entity_id: "climate.living", state: "heat", attributes: { friendly_name: "Living room", current_temperature: 19, temperature: 21 } },
    "vacuum.robot": { entity_id: "vacuum.robot", state: "cleaning", attributes: { friendly_name: "Roborock", battery_level: 80 } },
    "vacuum.robot_docked": { entity_id: "vacuum.robot_docked", state: "docked", attributes: { friendly_name: "Roborock", battery_level: 100 } },
    "vacuum.robot_returning": { entity_id: "vacuum.robot_returning", state: "returning", attributes: { friendly_name: "Roborock", battery_level: 62 } },
    "weather.home": { entity_id: "weather.home", state: "rainy", attributes: { friendly_name: "Home", temperature: 49.3, temperature_unit: "°F", humidity: 68, wind_speed: 4, wind_speed_unit: "mi/h" } },
    "weather.ulm": { entity_id: "weather.ulm", state: "partlycloudy", attributes: { friendly_name: "Lieusaint", temperature: 21, temperature_unit: "°C", humidity: 75 } },
  },
  language: "nl",
  user: { name: "Bas" },
  callService: async () => undefined,
  connection: {
    sendMessagePromise: async <T>() => undefined as T,
    subscribeMessage: async <T>(callback: (message: T) => void) => {
      callback({ forecast: [
        { condition: "sunny", temperature: 61, templow: 45.9 },
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
  card_weather_ulm: "weather.ulm",
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
      {
        ...base,
        entity: "sensor.battery_charging",
      },
      {
        ...base,
        entity: "sensor.battery_usb",
        ulm_card_battery_charger_type_entity_id: "sensor.charger_type",
        ulm_card_battery_battery_level_danger: 10,
        ulm_card_battery_battery_level_warning: 20,
      },
      {
        ...base,
        entity: "sensor.battery_charging",
        ulm_card_battery_battery_state_entity_id: "sensor.battery_state",
        ulm_card_battery_charging_animation: true,
        ulm_card_battery_battery_level_danger: 10,
        ulm_card_battery_battery_level_warning: 20,
      },
      {
        ...base,
        entity: "sensor.battery_warning",
        ulm_card_battery_battery_level_danger: 20,
        ulm_card_battery_battery_level_warning: 50,
      },
      {
        ...base,
        entity: "sensor.battery_low",
        ulm_card_battery_battery_level_danger: 20,
        ulm_card_battery_battery_level_warning: 50,
      },
    ];
    case "card_binary_sensor":
    case "card_binary_sensor_alert": return [
      { ...base, entity: "binary_sensor.window" },
      { ...base, entity: "binary_sensor.window_closed" },
    ];
    case "card_cover": return [{
        ...base,
        show_controls: true,
        ulm_card_cover_enable_controls: true,
        ulm_card_cover_enable_slider: true,
      }];
    case "card_fan": return [
      { ...base, entity: "fan.bedroom_off", show_controls: false, ulm_card_fan_enable_slider: false },
      {
        ...base,
        ulm_card_fan_enable_slider: true,
        ulm_card_fan_enable_button: true,
        ulm_card_fan_temp_attribute: "temperature",
        ulm_card_fan_hum_attribute: "humidity",
        ulm_card_fan_oscillate_attribute: "oscillate",
      },
    ];
    case "card_input_boolean": return [
      { ...base, entity: "input_boolean.guest_mode" },
      { ...base, entity: "input_boolean.bed_mode", name: "Bed mode" },
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
    case "card_room": return [{
      ...base,
      room_sensors: [
        { entity: "light.kitchen", icon: "mdi:lightbulb", color: "#ff9800", active_state: "on", name: "Lights" },
        { entity: "sensor.temperature", icon: "mdi:thermometer", color: "#f44336", name: "Temperature" },
        { entity: "switch.outlet", icon: "mdi:power-plug", color: "#00c853", active_state: "on", name: "Outlet" },
      ],
    }];
    case "card_scenes": return [{
      ...base,
      scene_items: [
        { entity: "scene.home", icon: "mdi:home", color: "#536dfe", name: "Home" },
        { entity: "scene.away", icon: "mdi:briefcase", color: "#ff5252", name: "Away" },
        { entity: "scene.night", icon: "mdi:weather-night", color: "#00c853", name: "Night" },
        { entity: "scene.movie", icon: "mdi:movie", color: "#ff9800", name: "Film Scene" },
        { entity: "scene.relax", icon: "mdi:lightbulb", color: "#00c853", name: "Scene" },
        { entity: "scene.music", icon: "mdi:music", color: "#ec407a", name: "Music" },
      ],
    }];
    case "card_welcome_scenes": return [{
      ...base,
      name: undefined,
      secondary: "Scenes",
      collapse_entity: "input_boolean.scenes_collapsed",
      scene_items: [
        { entity: "scene.home", icon: "mdi:home", color: "#536dfe", name: "Home" },
        { entity: "scene.away", icon: "mdi:shield-home", color: "#ff5252", name: "Away" },
        { entity: "scene.night", icon: "mdi:weather-night", color: "#00c853", name: "Night" },
        { entity: "scene.movie", icon: "mdi:movie", color: "#ff9800", name: "Film" },
        { entity: "scene.relax", icon: "mdi:lightbulb", color: "#ff9800", name: "Scene" },
      ],
    }];
    case "card_thermostat": return [{ ...base, show_controls: false }, { ...base, show_controls: true }];
    case "card_person": return [{ ...base, entity: "person.joris" }, { ...base, entity: "person.joris_away" }];
    case "card_power_outlet": return [{ ...base, entity: "switch.outlet" }, { ...base, entity: "switch.outlet_off" }];
    case "card_vacuum": return [
      {
        ...base,
        entity: "vacuum.robot",
        ulm_card_vacuum_room: "script.clean_living_room",
        ulm_card_vacuum_room_icon: "mdi:sofa",
      },
    ];
    case "card_weather": return [{ ...base, variant: "detailed", show_forecast: true }];
    case "card_weather_ulm": return [{ ...base, variant: "native", show_forecast: false }];
    case "card_title": return [{ ...base, name: "Living Room", secondary: "Light" }];
    case "card_navigate": return [{ ...base, name: "Navigate Card", secondary: "Navigate" }];
    default: return [base];
  }
};

const container = document.querySelector("#comparisons")!;
const focusedSource = new URLSearchParams(window.location.search).get("source");
for (const source of UPSTREAM_CATALOG.filter((item) =>
  item.category === "default-card" && (!focusedSource || item.upstreamId === focusedSource))) {
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
  section.style.setProperty("--comparison-width", source.upstreamId === "card_cover" ? "309px" : "320px");
  section.innerHTML = `<h2>${source.upstreamId}</h2><div class="columns"><div><div class="column-label">Upstream reference</div><img class="reference" alt="${source.upstreamId} upstream reference" src="/.tmp-ui-minimalist/docs/assets/img/ulm_cards/${referenceFor[source.upstreamId]}"></div><div><div class="column-label">Rendered implementation</div><div class="implementation"></div></div></div>`;
  const reference = section.querySelector<HTMLImageElement>(".reference")!;
  reference.addEventListener("load", () => {
    const width = Math.min(reference.naturalWidth, 560);
    section.style.setProperty("--comparison-width", `${width}px`);
  });
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
