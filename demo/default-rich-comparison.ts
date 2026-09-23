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
      : `<style>:host{display:inline-flex;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px)}</style>`;
  }

  public attributeChangedCallback(_name: string, _oldValue: string | null, value: string | null) {
    if (value) this.icon = value;
  }
}
if (!customElements.get("ha-icon")) customElements.define("ha-icon", HaIcon);

const hass: HomeAssistant = {
  states: {
    "sensor.ads": {
      entity_id: "sensor.ads",
      state: "78.85",
      attributes: { friendly_name: "Ads Percentage Today", unit_of_measurement: "%", icon: "mdi:help-circle-outline" },
    },
    "sensor.domains": {
      entity_id: "sensor.domains",
      state: "639068",
      attributes: { friendly_name: "Pi-Hole Domains Blocked", unit_of_measurement: "Domains", icon: "mdi:help-circle-outline" },
    },
    "sensor.temperature": {
      entity_id: "sensor.temperature",
      state: "23.7",
      attributes: {
        friendly_name: "Temperature Inside",
        unit_of_measurement: "°C",
        icon: "mdi:thermometer",
        history: [23.4, 23.1, 23.3, 23.8, 24, 23.7, 23.3, 23.2, 23.25, 23.4],
      },
    },
    "light.window": {
      entity_id: "light.window",
      state: "on",
      attributes: { friendly_name: "Kugellampe Fenster", icon: "mdi:lightbulb", brightness: 128, rgb_color: [255, 145, 0] },
    },
    "media_player.living": {
      entity_id: "media_player.living",
      state: "playing",
      attributes: {
        friendly_name: "Gosh",
        media_title: "Gosh",
        media_artist: "Jamie xx",
        media_album_name: "In Colour",
        volume_level: .42,
        device_class: "speaker",
        icon: "mdi:speaker",
        entity_picture: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='240'%3E%3Cdefs%3E%3ClinearGradient id='g'%3E%3Cstop stop-color='%23d7ca00'/%3E%3Cstop offset='.5' stop-color='%23ce1764'/%3E%3Cstop offset='1' stop-color='%236c168b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='240' fill='url(%23g)'/%3E%3C/svg%3E",
      },
    },
  },
  callService: async () => undefined,
};

interface Spec {
  id: string;
  tag: string;
  reference: string;
  crop: [number, number, number, number];
  config: AdditionConfig;
}

const specs: Spec[] = [
  {
    id: "card_generic",
    tag: "mushroom-addition-card-generic",
    reference: "card_generic.png",
    crop: [55, 55, 1000, 270],
    config: { type: "custom:mushroom-addition-card-generic", entity: "sensor.ads", variant: "default" },
  },
  {
    id: "card_generic_swap",
    tag: "mushroom-addition-card-generic-swap",
    reference: "card_generic_swap.png",
    crop: [55, 55, 1000, 270],
    config: { type: "custom:mushroom-addition-card-generic-swap", entity: "sensor.ads", variant: "swapped" },
  },
  {
    id: "card_graph",
    tag: "mushroom-addition-card-graph",
    reference: "card_graph.png",
    crop: [590, 55, 1000, 485],
    config: {
      type: "custom:mushroom-addition-card-graph",
      entity: "sensor.temperature",
      ulm_card_graph_color: "red",
      ulm_card_graph_type: "fill",
    },
  },
  {
    id: "card_light",
    tag: "mushroom-addition-card-light",
    reference: "card_light_combi.png",
    crop: [10, 82, 286, 122],
    config: {
      type: "custom:mushroom-addition-card-light",
      entity: "light.window",
      ulm_card_light_enable_slider: true,
      ulm_card_light_enable_color: true,
    },
  },
  {
    id: "card_media_player",
    tag: "mushroom-addition-card-media-player",
    reference: "card_media_player_art_controls.png",
    crop: [8, 8, 242, 130],
    config: {
      type: "custom:mushroom-addition-card-media-player",
      entity: "media_player.living",
      ulm_card_media_player_enable_art: true,
      ulm_card_media_player_enable_controls: true,
      ulm_card_media_player_more_info: true,
    },
  },
  {
    id: "card_navigate",
    tag: "mushroom-addition-card-navigate",
    reference: "card_navigate.png",
    crop: [55, 55, 1000, 270],
    config: {
      type: "custom:mushroom-addition-card-navigate",
      name: "Media",
      icon: "mdi:account",
      navigation_path: "/lovelace/media",
    },
  },
];

const container = document.querySelector("#comparisons")!;
for (const spec of specs) {
  const [x, y, width, height] = spec.crop;
  const scale = 320 / width;
  const section = document.createElement("section");
  section.className = "comparison";
  section.dataset.source = spec.id;
  section.innerHTML = `
    <h2>${spec.id}</h2>
    <div class="columns">
      <div>
        <div class="column-label">Pinned upstream reference</div>
        <div class="reference-crop" style="height:${Math.round(height * scale)}px">
          <img alt="${spec.id} pinned upstream crop"
            src="/.tmp-ui-minimalist/docs/assets/img/ulm_cards/${spec.reference}"
            style="left:${-x * scale}px;top:${-y * scale}px;transform:scale(${scale})">
        </div>
      </div>
      <div>
        <div class="column-label">Source-faithful renderer</div>
        <div class="implementation"></div>
      </div>
    </div>`;
  const card = document.createElement(spec.tag) as HTMLElement & {
    hass: HomeAssistant;
    setConfig(config: AdditionConfig): void;
  };
  card.hass = hass;
  card.setConfig(spec.config);
  section.querySelector(".implementation")!.append(card);
  container.append(section);
}
