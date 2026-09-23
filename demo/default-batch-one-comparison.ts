import {
  mdiAutorenew,
  mdiBriefcase,
  mdiCast,
  mdiCandle,
  mdiFaceMan,
  mdiFire,
  mdiHome,
  mdiHomeMinus,
  mdiHomeVariant,
  mdiLightbulb,
  mdiLightbulbNight,
  mdiMinus,
  mdiMusic,
  mdiPalette,
  mdiPlus,
  mdiPowerPlug,
  mdiScriptText,
  mdiSnowflake,
  mdiSofa,
  mdiSofaSingle,
  mdiThermometer,
  mdiWater,
  mdiWeatherNight,
  mdiWhiteBalanceSunny,
} from "@mdi/js";
import "../src/index";
import { CATALOG } from "../src/catalog";
import type { AdditionConfig, HomeAssistant } from "../src/types";

const paths: Record<string, string> = {
  "mdi:autorenew": mdiAutorenew,
  "mdi:briefcase": mdiBriefcase,
  "mdi:cast": mdiCast,
  "mdi:candle": mdiCandle,
  "mdi:face-man": mdiFaceMan,
  "mdi:fire": mdiFire,
  "mdi:home": mdiHome,
  "mdi:home-minus": mdiHomeMinus,
  "mdi:home-variant": mdiHomeVariant,
  "mdi:lightbulb": mdiLightbulb,
  "mdi:lightbulb-night": mdiLightbulbNight,
  "mdi:minus": mdiMinus,
  "mdi:music": mdiMusic,
  "mdi:palette": mdiPalette,
  "mdi:plus": mdiPlus,
  "mdi:power-plug": mdiPowerPlug,
  "mdi:power-socket-eu": mdiPowerPlug,
  "mdi:script-text": mdiScriptText,
  "mdi:snowflake": mdiSnowflake,
  "mdi:sofa": mdiSofa,
  "mdi:sofa-single": mdiSofaSingle,
  "mdi:sun-snowflake": mdiWhiteBalanceSunny,
  "mdi:thermometer": mdiThermometer,
  "mdi:water": mdiWater,
  "mdi:weather-night": mdiWeatherNight,
};

class HaCard extends HTMLElement {}
if (!customElements.get("ha-card")) customElements.define("ha-card", HaCard);
class HaIcon extends HTMLElement {
  private currentIcon = "mdi:palette";

  public get icon(): string {
    return this.currentIcon;
  }

  public set icon(value: string) {
    this.currentIcon = value;
    this.renderIcon();
  }

  public connectedCallback(): void {
    this.renderIcon();
  }

  private renderIcon(): void {
    const path = paths[this.currentIcon] ?? mdiPalette;
    const root = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    root.innerHTML = `<style>:host{display:inline-grid;place-items:center;width:24px;height:24px}svg{display:block;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px);fill:currentColor}</style><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"></path></svg>`;
  }
}
if (!customElements.get("ha-icon")) customElements.define("ha-icon", HaIcon);

const hass: HomeAssistant = {
  states: {
    "person.joris": { entity_id: "person.joris", state: "home", attributes: { friendly_name: "Joris" } },
    "sensor.joris_mobile_battery_level": { entity_id: "sensor.joris_mobile_battery_level", state: "72", attributes: { friendly_name: "Battery", unit_of_measurement: "%" } },
    "switch.cv_plug": { entity_id: "switch.cv_plug", state: "on", attributes: { friendly_name: "Outlet", icon: "mdi:power-plug" } },
    "sensor.cv_plug_power": { entity_id: "sensor.cv_plug_power", state: "10", attributes: { friendly_name: "Power", unit_of_measurement: "W" } },
    "light.joris_iris_1": { entity_id: "light.joris_iris_1", state: "on", attributes: { friendly_name: "Living Room", current_temperature: 19.8, unit_of_measurement: "°C" } },
    "light.room": { entity_id: "light.room", state: "on", attributes: { friendly_name: "Light", icon: "mdi:lightbulb" } },
    "switch.outlet": { entity_id: "switch.outlet", state: "on", attributes: { friendly_name: "Outlet", icon: "mdi:power-plug" } },
    "sensor.temperature": { entity_id: "sensor.temperature", state: "19.8", attributes: { friendly_name: "Temperature", icon: "mdi:thermometer", unit_of_measurement: "°C" } },
    "media_player.speaker": { entity_id: "media_player.speaker", state: "off", attributes: { friendly_name: "Speaker", icon: "mdi:cast" } },
    "scene.home": { entity_id: "scene.home", state: "off", attributes: { friendly_name: "Home", icon: "mdi:home" } },
    "scene.away": { entity_id: "scene.away", state: "off", attributes: { friendly_name: "Away", icon: "mdi:briefcase" } },
    "scene.night": { entity_id: "scene.night", state: "off", attributes: { friendly_name: "Night", icon: "mdi:weather-night" } },
    "scene.movie": { entity_id: "scene.movie", state: "off", attributes: { friendly_name: "Film Scene", icon: "mdi:palette" } },
    "scene.relax": { entity_id: "scene.relax", state: "off", attributes: { friendly_name: "Scene", icon: "mdi:lightbulb" } },
    "scene.music": { entity_id: "scene.music", state: "off", attributes: { friendly_name: "Music", icon: "mdi:music" } },
    "media_player.tv": { entity_id: "media_player.tv", state: "off", attributes: { friendly_name: "TV", icon: "mdi:cast" } },
    "script.welcome_home_briefing": { entity_id: "script.welcome_home_briefing", state: "off", attributes: { friendly_name: "Romantic Light", icon: "mdi:script-text" } },
    "climate.living_room": {
      entity_id: "climate.living_room",
      state: "heat",
      attributes: {
        friendly_name: "Salon",
        current_temperature: 21,
        temperature: 25.5,
        target_temp_step: 0.5,
        hvac_action: "heating",
        hvac_modes: ["heat", "cool"],
      },
    },
  },
  callService: async () => undefined,
};

interface Comparison {
  width: number;
  referenceHeight: number;
  referenceWidth: number;
  referenceX: number;
  referenceY: number;
  reference: string;
  config: Omit<AdditionConfig, "type">;
}

const comparisons: Record<string, Comparison> = {
  card_person: {
    width: 496,
    referenceHeight: 160,
    referenceWidth: 1090,
    referenceX: 0,
    referenceY: 0,
    reference: "card_person.png",
    config: { entity: "person.joris", battery_entity: "sensor.joris_mobile_battery_level" },
  },
  card_power_outlet: {
    width: 496,
    referenceHeight: 140,
    referenceWidth: 1090,
    referenceX: 0,
    referenceY: 0,
    reference: "card_power_outlet.png",
    config: { entity: "switch.cv_plug", consumption_entity: "sensor.cv_plug_power" },
  },
  card_room: {
    width: 340,
    referenceHeight: 360,
    referenceWidth: 1055,
    referenceX: 0,
    referenceY: 0,
    reference: "room-card.png",
    config: {
      entity: "light.joris_iris_1",
      room_sensors: [
        { entity: "light.room", icon: "mdi:lightbulb", color: "#ff9800", active_state: "on", name: "Light" },
        { entity: "switch.outlet", icon: "mdi:power-plug", color: "#00c853", active_state: "on", name: "Outlet" },
        { entity: "sensor.temperature", icon: "mdi:thermometer", color: "#f44336", name: "Temperature" },
        { entity: "media_player.speaker", icon: "mdi:cast", color: "#536dfe", name: "Speaker" },
      ],
    },
  },
  card_scenes: {
    width: 486,
    referenceHeight: 119,
    referenceWidth: 486,
    referenceX: 0,
    referenceY: 0,
    reference: "card_scenes.png",
    config: {
      scene_items: [
        { entity: "scene.home", name: "Home", icon: "mdi:home", color: "#536dfe" },
        { entity: "scene.away", name: "Away", icon: "mdi:briefcase", color: "#ff5252" },
        { entity: "scene.night", name: "Night", icon: "mdi:weather-night", color: "#ff9800" },
        { entity: "scene.movie", name: "Film Scene", icon: "mdi:palette", color: "#7e57c2" },
        { entity: "scene.relax", name: "Scene", icon: "mdi:lightbulb", color: "#00c853" },
        { entity: "scene.music", name: "Music", icon: "mdi:music", color: "#ec407a" },
        { entity: "media_player.tv", name: "TV", icon: "mdi:cast", color: "#ff9800" },
      ],
    },
  },
  card_script: {
    width: 496,
    referenceHeight: 160,
    referenceWidth: 1090,
    referenceX: 0,
    referenceY: 0,
    reference: "card_script.png",
    config: { entity: "script.welcome_home_briefing", icon: "mdi:candle" },
  },
  card_thermostat: {
    width: 496,
    referenceHeight: 138,
    referenceWidth: 496,
    referenceX: 0,
    referenceY: 0,
    reference: "card_thermostat_with_controls.png",
    config: {
      entity: "climate.living_room",
      ulm_card_thermostat_enable_controls: true,
      ulm_card_thermostat_enable_display_temperature: false,
    },
  },
};

const sourceId = new URLSearchParams(location.search).get("source") ?? "card_person";
const comparison = comparisons[sourceId];
if (!comparison) throw new Error(`Unknown comparison source: ${sourceId}`);
const item = CATALOG.find((entry) => entry.upstreamId === sourceId);
if (!item) throw new Error(`Missing source: ${sourceId}`);

document.documentElement.style.setProperty("--width", `${comparison.width}px`);
document.documentElement.style.setProperty("--reference-height", `${comparison.referenceHeight}px`);
document.documentElement.style.setProperty("--reference-width", `${comparison.referenceWidth}px`);
document.documentElement.style.setProperty("--reference-x", `${comparison.referenceX}px`);
document.documentElement.style.setProperty("--reference-y", `${comparison.referenceY}px`);
document.querySelector("#title")!.textContent = `${sourceId} pinned source comparison`;
document.querySelector("#comparison")!.innerHTML = `
  <section class="comparison">
    <div class="column">
      <div class="label">Pinned upstream reference</div>
      <div class="reference-frame">
        <img src="/.tmp-ui-minimalist/docs/assets/img/ulm_cards/${comparison.reference}" alt="">
      </div>
    </div>
    <div class="column">
      <div class="label">Source-faithful implementation</div>
      <div class="implementation"></div>
    </div>
  </section>
`;
const card = document.createElement(item.tag) as HTMLElement & {
  hass: HomeAssistant;
  setConfig(config: AdditionConfig): void;
};
card.hass = hass;
card.setConfig({ type: `custom:${item.tag}`, ...comparison.config });
document.querySelector(".implementation")!.append(card);
