import "../src/index";
import * as mdiPaths from "@mdi/js";
import { CATALOG } from "../src/catalog";
import type { AdditionConfig, HomeAssistant } from "../src/types";

class HaCard extends HTMLElement {}
if (!customElements.get("ha-card")) customElements.define("ha-card", HaCard);
class HaIcon extends HTMLElement {
  public set icon(value: string) {
    const exportName = value.startsWith("mdi:")
      ? `mdi${value.slice(4).split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("")}`
      : "";
    const path = (mdiPaths as Record<string, unknown>)[exportName];
    const root = this.shadowRoot ?? this.attachShadow({ mode: "open" });
    root.innerHTML = typeof path === "string"
      ? `<style>:host{display:inline-grid;place-items:center;width:24px;height:24px}svg{display:block;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px);fill:currentColor}</style><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"></path></svg>`
      : "";
  }
}
if (!customElements.get("ha-icon")) customElements.define("ha-icon", HaIcon);

const hass: HomeAssistant = {
  language: "en",
  states: {
    "sensor.signal": { entity_id: "sensor.signal", state: "-58", attributes: { friendly_name: "Wi-Fi signal", unit_of_measurement: "dBm" } },
    "sensor.nas": { entity_id: "sensor.nas", state: "OK", attributes: { friendly_name: "NAS disks" } },
    "update.core": { entity_id: "update.core", state: "on", attributes: { friendly_name: "Home Assistant Core" } },
    "sensor.time": { entity_id: "sensor.time", state: "22:50", attributes: { friendly_name: "Time" } },
    "sensor.date_time": { entity_id: "sensor.date_time", state: "Wednesday, September 23, 2026", attributes: { friendly_name: "Date and time" } },
    "sensor.door": { entity_id: "sensor.door", state: "Closed & Locked", attributes: { friendly_name: "Front Door" } },
    "lock.door": { entity_id: "lock.door", state: "locked", attributes: { friendly_name: "Front Door lock" } },
    "sensor.door_battery": { entity_id: "sensor.door_battery", state: "82", attributes: { friendly_name: "Door battery", unit_of_measurement: "%" } },
    "sensor.grass_pollen": { entity_id: "sensor.grass_pollen", state: "5", attributes: { friendly_name: "Grass pollen", icon: "mdi:grass" } },
  },
  callService: async () => undefined,
};

interface Comparison {
  width: number;
  height: number;
  reference: string;
  referenceWidth: number;
  referenceX?: number;
  referenceY?: number;
  config: Omit<AdditionConfig, "type">;
}

const comparisons: Record<string, Comparison> = {
  custom_card_mpse_wifisignal: {
    width: 520, height: 109, reference: "custom_wifisignal.png", referenceWidth: 1141,
    config: { entity: "sensor.signal", name_mode: "custom", name: "Energy Wifi Signal" },
  },
  custom_card_nas: {
    width: 245, height: 75, reference: "custom_card_nas.png", referenceWidth: 245,
    config: { entity: "sensor.nas", ulm_custom_card_nas_text: "Disk status", ulm_custom_card_nas_unit: "" },
  },
  custom_card_neekster_update: {
    width: 494, height: 110, reference: "custom_card_neekster_update.png", referenceWidth: 989, referenceY: -190,
    config: {
      entity: "update.core",
      ulm_card_neekster_update_enable_controls: true,
      ulm_card_neekster_update_horizontal: true,
      ulm_card_neekster_update_narrow_buttons: true,
    },
  },
  custom_card_nik_clock: {
    width: 366, height: 133, reference: "custom_card_nik_clock.png", referenceWidth: 366,
    config: { entity: "sensor.time", date_entity: "sensor.date_time" },
  },
  custom_card_nik_door: {
    width: 430, height: 200, reference: "custom_card_nik_door.png", referenceWidth: 430,
    config: { entity: "sensor.door", lock_entity: "lock.door", battery_entity: "sensor.door_battery", name: "Front Door" },
  },
  custom_card_paddy_dwd_pollen: {
    width: 302, height: 141, reference: "cards.png", referenceWidth: 604,
    config: { entity: "sensor.grass_pollen", level_entity: "sensor.grass_pollen", pollen_language: "en" },
  },
};

const sourceId = new URLSearchParams(location.search).get("source") ?? "custom_card_mpse_wifisignal";
const comparison = comparisons[sourceId];
if (!comparison) throw new Error(`Unknown comparison source: ${sourceId}`);
const item = CATALOG.find((entry) => entry.upstreamId === sourceId);
if (!item) throw new Error(`Missing source: ${sourceId}`);

document.documentElement.style.setProperty("--width", `${comparison.width}px`);
document.documentElement.style.setProperty("--height", `${comparison.height}px`);
document.documentElement.style.setProperty("--reference-width", `${comparison.referenceWidth}px`);
document.documentElement.style.setProperty("--reference-x", `${comparison.referenceX ?? 0}px`);
document.documentElement.style.setProperty("--reference-y", `${comparison.referenceY ?? 0}px`);
if (sourceId === "custom_card_mpse_wifisignal") {
  document.documentElement.style.setProperty("--primary-text-color", "#ddd");
  document.documentElement.style.setProperty("--secondary-text-color", "#888");
  document.documentElement.style.setProperty("--card-background-color", "#1f1f1f");
  document.documentElement.style.setProperty("--ha-card-background", "#1f1f1f");
}
document.querySelector("#title")!.textContent = `${sourceId} pinned source comparison`;
document.querySelector("#comparison")!.innerHTML = `
  <section class="comparison">
    <div class="column">
      <div class="label">Pinned upstream reference</div>
      <div class="reference-frame">
        <img src="/.tmp-ui-minimalist/docs/assets/img/${comparison.reference}" alt="">
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
