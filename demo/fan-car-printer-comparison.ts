import * as mdiPaths from "@mdi/js";
import "../src/index";
import { publicItemForSource, variantForSource } from "../src/catalog";
import type { AdditionConfig, HomeAssistant } from "../src/types";

class HaCard extends HTMLElement {}
if (!customElements.get("ha-card")) customElements.define("ha-card", HaCard);
class HaIcon extends HTMLElement {
  public static get observedAttributes() { return ["icon"]; }

  public set icon(value: string) {
    const exportName = value.startsWith("mdi:")
      ? `mdi${value.slice(4).split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("")}`
      : "";
    const path = (mdiPaths as Record<string, unknown>)[exportName];
    const root = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    root.innerHTML = typeof path === "string"
      ? `<style>:host{display:inline-flex;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px);color:inherit}svg{display:block;width:100%;height:100%;fill:currentColor}</style><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"></path></svg>`
      : "";
  }

  public attributeChangedCallback(_name: string, _oldValue: string | null, value: string | null): void {
    if (value) this.icon = value;
  }
}
if (!customElements.get("ha-icon")) customElements.define("ha-icon", HaIcon);

const hass: HomeAssistant = {
  states: {
    "fan.air_purifier": {
      entity_id: "fan.air_purifier",
      state: "on",
      attributes: { friendly_name: "Fan", percentage: 44, percentage_step: 1, oscillate: false, temp: 22, hum: 48 },
    },
    "scene.music": { entity_id: "scene.music", state: "off", attributes: { friendly_name: "Music", icon: "mdi:music-note" } },
    "automation.running": { entity_id: "automation.running", state: "on", attributes: { friendly_name: "Running", icon: "mdi:run" } },
    "scene.night": { entity_id: "scene.night", state: "off", attributes: { friendly_name: "Night", icon: "mdi:weather-night" } },
    "script.movie": { entity_id: "script.movie", state: "off", attributes: { friendly_name: "Movie", icon: "mdi:movie-open" } },
    "scene.sleep": { entity_id: "scene.sleep", state: "off", attributes: { friendly_name: "Sleep", icon: "mdi:bed" } },
    "sensor.hn_etronq6_model": {
      entity_id: "sensor.hn_etronq6_model",
      state: "home",
      attributes: { friendly_name: "Audi Q3" },
      last_changed: new Date(Date.now() - 3 * 60_000).toISOString(),
    },
    "binary_sensor.hn_etronq6_doors": {
      entity_id: "binary_sensor.hn_etronq6_doors",
      state: "off",
      attributes: { friendly_name: "Doors" },
    },
    "sensor.hn_etronq6_primary_engine_percent": {
      entity_id: "sensor.hn_etronq6_primary_engine_percent",
      state: "50",
      attributes: { friendly_name: "Energy", unit_of_measurement: "%" },
    },
    "sensor.hn_etronq6_range": {
      entity_id: "sensor.hn_etronq6_range",
      state: "360",
      attributes: { friendly_name: "Range", unit_of_measurement: "km" },
    },
    "plant.bonsai": {
      entity_id: "plant.bonsai",
      state: "ok",
      attributes: {
        friendly_name: "Bonsai Ficus",
        temperature: 22,
        humidity: 58,
        moisture: 42,
        conductivity: 35,
        illuminance: 18,
        dli: 64,
      },
    },
    "binary_sensor.office_window": {
      entity_id: "binary_sensor.office_window",
      state: "off",
      attributes: { friendly_name: "Patio", icon: "mdi:door-sliding" },
    },
    "sensor.office_window_handle": {
      entity_id: "sensor.office_window_handle",
      state: "Closed",
      attributes: { friendly_name: "Patio handle" },
    },
    "sensor.office_window_battery": {
      entity_id: "sensor.office_window_battery",
      state: "64",
      attributes: { friendly_name: "Patio battery", unit_of_measurement: "%" },
    },
    "sensor.printer_status": {
      entity_id: "sensor.printer_status",
      state: "Idle",
      attributes: { friendly_name: "HP LaserJet MFP M28w" },
    },
    "sensor.toner_black": { entity_id: "sensor.toner_black", state: "75", attributes: {} },
    "sensor.toner_photo_black": { entity_id: "sensor.toner_photo_black", state: "67", attributes: {} },
    "sensor.toner_yellow": { entity_id: "sensor.toner_yellow", state: "54", attributes: {} },
    "sensor.toner_magenta": { entity_id: "sensor.toner_magenta", state: "78", attributes: {} },
    "sensor.toner_cyan": { entity_id: "sensor.toner_cyan", state: "72", attributes: {} },
    "sensor.toner_photo_blue": { entity_id: "sensor.toner_photo_blue", state: "41", attributes: {} },
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
  custom_card_saxel_fan: {
    width: 249, referenceHeight: 127, referenceWidth: 499, referenceX: 0, referenceY: 0,
    reference: "custom_fan_light_theme.png",
    config: {
      entity: "fan.air_purifier", name: "Fan", collapsable: false, ulm_show_button: true,
      ulm_button_service: "fan.oscillate", oscillate_attribute: "oscillate", tap_action: { action: "toggle" },
    },
  },
  custom_card_scenes: {
    width: 486, referenceHeight: 120, referenceWidth: 486, referenceX: 0, referenceY: 0,
    reference: "card_scenes.png",
    config: {
      variant: "scene-grid",
      scene_items: [
        { entity: "scene.music", name: "Music", icon: "mdi:music-note", color: "red" },
        { entity: "automation.running", name: "Running", icon: "mdi:run", color: "blue" },
        { entity: "scene.night", name: "Night", icon: "mdi:weather-night", color: "purple" },
        { entity: "script.movie", name: "Movie", icon: "mdi:movie-open", color: "green" },
        { entity: "scene.sleep", name: "Sleep", icon: "mdi:bed", color: "orange" },
      ],
      tap_action: { action: "none" },
    },
  },
  custom_card_schumijo_car: {
    width: 313, referenceHeight: 137, referenceWidth: 313, referenceX: 0, referenceY: 0,
    reference: "car.png",
    config: {
      entity: "sensor.hn_etronq6_model",
      ulm_card_schumijo_car_tracker: "sensor.hn_etronq6_model",
      ulm_card_schumijo_car_lock: "binary_sensor.hn_etronq6_doors",
      ulm_card_schumijo_car_energy_level: "sensor.hn_etronq6_primary_engine_percent",
      ulm_card_schumijo_car_range: "sensor.hn_etronq6_range",
      ulm_card_schumijo_car_name: "Audi Q3",
      tap_action: { action: "none" },
    },
  },
  custom_card_schumijo_flower: {
    width: 274, referenceHeight: 117, referenceWidth: 274, referenceX: 0, referenceY: 0,
    reference: "flower.png",
    config: {
      entity: "plant.bonsai", ulm_card_flower_entity: "plant.bonsai", ulm_card_flower_name: "Bonsai Ficus",
      ulm_card_flower_species: "ficus retusa",
      ulm_card_flower_show_bars: ["temperature", "illuminance", "moisture", "dli"],
      tap_action: { action: "none" },
    },
  },
  custom_card_senoro_win: {
    width: 200, referenceHeight: 80, referenceWidth: 200, referenceX: 0, referenceY: 0,
    reference: "senoro_win_card.png",
    config: {
      entity: "binary_sensor.office_window",
      ulm_custom_card_senoro_win_handle: "sensor.office_window_handle",
      ulm_custom_card_senoro_win_battery_level: "sensor.office_window_battery",
      tap_action: { action: "none" },
    },
  },
  custom_card_sisimomo_printer: {
    width: 500, referenceHeight: 295, referenceWidth: 1000, referenceX: -500, referenceY: 0,
    reference: "custom_card_sisimomo_printer.png",
    config: {
      entity: "sensor.printer_status",
      ulm_card_printer_name: "HP LaserJet MFP M28w",
      tap_action: { action: "none" },
      cartridges: [
        { label: "BK", entity_id: "sensor.toner_black", type: "unicolor", color: "black" },
        { label: "B", entity_id: "sensor.toner_photo_black", type: "unicolor", color: "black" },
        { label: "Y", entity_id: "sensor.toner_yellow", type: "unicolor", color: "#ffd55f" },
        { label: "M", entity_id: "sensor.toner_magenta", type: "unicolor", color: "#f84b7a" },
        { label: "C", entity_id: "sensor.toner_cyan", type: "unicolor", color: "#427ede" },
        { label: "PB", entity_id: "sensor.toner_photo_blue", type: "unicolor", color: "#9272be" },
      ],
    },
  },
};

const sourceId = new URLSearchParams(location.search).get("source") ?? "custom_card_saxel_fan";
const comparison = comparisons[sourceId];
if (!comparison) throw new Error(`Unknown comparison source: ${sourceId}`);
const item = publicItemForSource(sourceId);
if (!item) throw new Error(`Missing source: ${sourceId}`);
const aliasTag = sourceId === item.upstreamId ? item.tag : `mushroom-addition-${sourceId.replaceAll("_", "-")}`;

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
      <div class="reference-frame"><img src="/.tmp-ui-minimalist/docs/assets/img/${comparison.reference}" alt=""></div>
    </div>
    <div class="column">
      <div class="label">Source-faithful implementation</div>
      <div class="implementation"></div>
    </div>
  </section>
`;
const card = document.createElement(aliasTag) as HTMLElement & {
  hass: HomeAssistant;
  setConfig(config: AdditionConfig): void;
};
card.hass = hass;
card.setConfig({
  type: `custom:${aliasTag}`,
  variant: variantForSource(sourceId),
  ...comparison.config,
});
document.querySelector(".implementation")!.append(card);
