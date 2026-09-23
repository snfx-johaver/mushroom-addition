import "../src/index";
import * as mdiPaths from "@mdi/js";
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
      : "";
  }

  public attributeChangedCallback(_name: string, _oldValue: string | null, value: string | null) {
    if (value) this.icon = value;
  }
}
if (!customElements.get("ha-icon")) customElements.define("ha-icon", HaIcon);

const states: HomeAssistant["states"] = {
  "sensor.speedtest_download": { entity_id: "sensor.speedtest_download", state: "273.07", attributes: { friendly_name: "Download", unit_of_measurement: "Mbit/s" } },
  "sensor.speedtest_upload": { entity_id: "sensor.speedtest_upload", state: "17.19", attributes: { friendly_name: "Upload", unit_of_measurement: "Mbit/s" } },
  "sensor.speedtest_ping": { entity_id: "sensor.speedtest_ping", state: "24", attributes: { friendly_name: "Ping", unit_of_measurement: "ms" } },
  "climate.living_room": { entity_id: "climate.living_room", state: "off", attributes: { friendly_name: "Living room", current_temperature: 19.5, temperature: 21 } },
  "device_tracker.joris_mobile": { entity_id: "device_tracker.joris_mobile", state: "home", attributes: { friendly_name: "Joris mobile" } },
  "water_heater.hot_water": { entity_id: "water_heater.hot_water", state: "eco", attributes: { friendly_name: "Hot water" } },
  "sensor.hot_water_power": { entity_id: "sensor.hot_water_power", state: "835", attributes: { friendly_name: "Hot water power", unit_of_measurement: "W" } },
};
const hass: HomeAssistant = { states, callService: async () => undefined };

interface Fixture {
  sourceId: string;
  slug: string;
  width: number;
  height: number;
  reference?: string;
  blueprint?: { icon: string; title: string; label: string };
  config: Omit<AdditionConfig, "type">;
}

const fixtures: Fixture[] = [
  {
    sourceId: "custom_card_speedtest_shogun160",
    slug: "speedtest-shogun160",
    width: 498,
    height: 128,
    reference: "https://user-images.githubusercontent.com/63370033/223386117-ea10ceee-c0a4-48b0-b3da-12768565c8f0.png",
    config: {
      download_entity: "sensor.speedtest_download",
      upload_entity: "sensor.speedtest_upload",
      ping_entity: "sensor.speedtest_ping",
      ulm_custom_card_speedtest_round: true,
    },
  },
  {
    sourceId: "custom_card_tpx01_aircondition",
    slug: "tpx01-aircondition",
    width: 320,
    height: 132,
    blueprint: { icon: "mdi:air-conditioner", title: "A/C Living room", label: "Power, target, decrement, increment" },
    config: { entity: "climate.living_room", name: "A/C Living room" },
  },
  {
    sourceId: "custom_card_vncntdev_device_tracer",
    slug: "vncntdev-device-tracer",
    width: 320,
    height: 82,
    reference: "/.tmp-ui-minimalist/docs/assets/img/custom_device_tracer.jpg",
    config: {
      entity: "device_tracker.joris_mobile",
      custom_card_vncntdev_device_tracker_name: "Joris mobile",
      custom_card_vncntdev_device_tracker_icon: "mdi:cellphone",
    },
  },
  {
    sourceId: "custom_card_water_heater",
    slug: "water-heater",
    width: 320,
    height: 82,
    blueprint: { icon: "mdi:waves", title: "Hot water", label: "Chauffe • 835 W" },
    config: { entity: "water_heater.hot_water", power_entity: "sensor.hot_water_power" },
  },
  {
    sourceId: "custom_card_wilbiev_subtitle",
    slug: "wilbiev-subtitle",
    width: 500,
    height: 82,
    reference: "/.tmp-ui-minimalist/docs/assets/img/custom_card_wilbiev_subtitle.png",
    config: { name: "Living room" },
  },
  {
    sourceId: "custom_card_wilbiev_title",
    slug: "wilbiev-title",
    width: 500,
    height: 92,
    reference: "/.tmp-ui-minimalist/docs/assets/img/custom_card_wilbiev_title.png",
    config: { name: "Home", navigation_path: "/lovelace/home" },
  },
];

const requested = new URLSearchParams(location.search).get("source");
const container = document.querySelector("#comparisons")!;
for (const fixture of fixtures.filter((candidate) => !requested || candidate.sourceId === requested)) {
  const tag = `mushroom-addition-custom-card-${fixture.slug}`;
  const section = document.createElement("section");
  section.className = "comparison";
  section.dataset.source = fixture.sourceId;
  section.style.setProperty("--width", `${fixture.width}px`);
  section.style.setProperty("--height", `${fixture.height}px`);
  section.innerHTML = `
    <h2>${fixture.sourceId}</h2>
    <div class="columns">
      <div><div class="label">Pinned source/reference</div><div class="reference-frame">${
        fixture.reference
          ? `<img src="${fixture.reference}" alt="">`
          : `<div class="source-blueprint"><ha-icon></ha-icon><span><b>${fixture.blueprint!.title}</b><small>${fixture.blueprint!.label}</small></span></div>`
      }</div></div>
      <div><div class="label">Source-faithful Lit implementation</div><div class="implementation"></div></div>
    </div>`;
  if (fixture.blueprint) {
    (section.querySelector(".source-blueprint ha-icon") as HaIcon).icon = fixture.blueprint.icon;
  }
  const card = document.createElement(tag) as HTMLElement & {
    hass: HomeAssistant;
    setConfig(config: AdditionConfig): void;
  };
  card.hass = hass;
  card.setConfig({ type: `custom:${tag}`, ...fixture.config });
  section.querySelector(".implementation")!.append(card);
  container.append(section);
}
