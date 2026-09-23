import "../src/index";
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

const fixtures: AdditionConfig[] = [
  { type: "custom:mushroom-addition-card-weather", entity: "weather.home", show_forecast: true },
  { type: "custom:mushroom-addition-card-thermostat", entity: "climate.living", show_controls: true },
  { type: "custom:mushroom-addition-card-light", entity: "light.kitchen", show_controls: true },
  { type: "custom:mushroom-addition-card-scenes", entity: "scene.relax", entities: ["scene.relax", "scene.movie", "scene.bright"] },
  { type: "custom:mushroom-addition-card-person", entity: "person.joris" },
  { type: "custom:mushroom-addition-card-battery", entity: "sensor.battery", show_graph: true },
  { type: "custom:mushroom-addition-card-power-outlet", entity: "switch.outlet", graph_entity: "sensor.power", show_graph: true },
  { type: "custom:mushroom-addition-card-media-player", entity: "media_player.tv", show_controls: true },
  { type: "custom:mushroom-addition-card-cover", entity: "cover.blind", show_controls: true },
  { type: "custom:mushroom-addition-card-vacuum", entity: "vacuum.robot", show_controls: true },
  { type: "custom:mushroom-addition-custom-card-alarm-time", entity: "input_boolean.alarm_enabled", datetime_entity: "input_datetime.alarm_time", show_controls: true },
  { type: "custom:mushroom-addition-card-navigate", name: "Upstairs", secondary: "Open dashboard", navigation_path: "/lovelace/upstairs" },
];

const container = document.querySelector("#cards")!;
for (const config of fixtures) {
  const element = document.createElement(config.type.replace(/^custom:/, "")) as HTMLElement & {
    hass: HomeAssistant;
    setConfig(config: AdditionConfig): void;
  };
  element.hass = hass;
  element.setConfig(config);
  container.append(element);
}
