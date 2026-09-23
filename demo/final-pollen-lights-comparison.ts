import * as mdiPaths from "@mdi/js";
import "../src/index";
import type { AdditionConfig, HomeAssistant } from "../src/types";

class HaCard extends HTMLElement {}
if (!customElements.get("ha-card")) customElements.define("ha-card", HaCard);

class HaIcon extends HTMLElement {
  private currentIcon = "mdi:information-outline";

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
    const exportName = `mdi${this.currentIcon.slice(4).split("-")
      .map((part) => part[0].toUpperCase() + part.slice(1)).join("")}`;
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
    "sensor.kleenex_pollen_radar_home_trees": {
      entity_id: "sensor.kleenex_pollen_radar_home_trees",
      state: "very_low",
      attributes: { friendly_name: "Trees", icon: "mdi:tree" },
    },
    "sensor.kleenex_pollen_radar_home_grass": {
      entity_id: "sensor.kleenex_pollen_radar_home_grass",
      state: "medium",
      attributes: { friendly_name: "Grass", icon: "mdi:grass" },
    },
    "sensor.kleenex_pollen_radar_home_weeds": {
      entity_id: "sensor.kleenex_pollen_radar_home_weeds",
      state: "very_high",
      attributes: { friendly_name: "Weeds", icon: "mdi:flower-pollen" },
    },
    "sensor.number_of_lights_on": {
      entity_id: "sensor.number_of_lights_on",
      state: "4",
      attributes: { friendly_name: "Lights on", icon: "mdi:lightbulb-on-outline" },
    },
  },
  callService: async () => undefined,
};

const fixtures: Array<{
  id: string;
  title: string;
  width: number;
  height: number;
  imageWidth: number;
  imageX: number;
  imageY: number;
  reference: string;
  config: AdditionConfig;
}> = [
  {
    id: "custom-card-wsly-pollen",
    title: "custom_card_wsly_pollen",
    width: 368,
    height: 122,
    imageWidth: 368,
    imageX: 0,
    imageY: 0,
    reference: "https://raw.githubusercontent.com/UI-Lovelace-Minimalist/UI/f8a9cb67a53f91367f1dffe18516aa983b463cb5/docs/assets/img/custom_card_wsly_pollen_light.png",
    config: {
      type: "custom:mushroom-addition-custom-card-wsly-pollen",
      trees_entity: "sensor.kleenex_pollen_radar_home_trees",
      grass_entity: "sensor.kleenex_pollen_radar_home_grass",
      weeds_entity: "sensor.kleenex_pollen_radar_home_weeds",
      custom_card_wsly_pollen_tree_name: "Bomen",
      custom_card_wsly_pollen_grass_name: "Grassen",
      custom_card_wsly_pollen_weed_name: "Kruiden",
    },
  },
  {
    id: "custom-card-yagrasdemonde-lights-count",
    title: "custom_card_yagrasdemonde_lights_count",
    width: 486,
    height: 71,
    imageWidth: 502,
    imageX: -8,
    imageY: -5.5,
    reference: "https://raw.githubusercontent.com/UI-Lovelace-Minimalist/UI/f8a9cb67a53f91367f1dffe18516aa983b463cb5/docs/assets/img/screenshot_light_count_lights.png",
    config: {
      type: "custom:mushroom-addition-custom-card-yagrasdemonde-lights-count",
      entity: "sensor.number_of_lights_on",
      ulm_custom_card_yagrasdemonde_lights_count_type: "light",
      ulm_custom_card_yagrasdemonde_lights_count_color: "yellow",
    },
  },
];

const main = document.querySelector("#comparisons")!;
for (const fixture of fixtures) {
  const card = document.createElement(`mushroom-addition-${fixture.id}`) as HTMLElement & {
    hass: HomeAssistant;
    setConfig(config: AdditionConfig): void;
  };
  card.hass = hass;
  card.setConfig(fixture.config);

  const section = document.createElement("section");
  section.dataset.source = fixture.title;
  section.style.setProperty("--width", `${fixture.width}px`);
  section.style.setProperty("--height", `${fixture.height}px`);
  section.style.setProperty("--image-width", `${fixture.imageWidth}px`);
  section.style.setProperty("--image-x", `${fixture.imageX}px`);
  section.style.setProperty("--image-y", `${fixture.imageY}px`);
  section.innerHTML = `
    <h2>${fixture.title}</h2>
    <div class="comparison">
      <div class="column"><div class="label">Pinned upstream</div><div class="reference-frame"><img src="${fixture.reference}" alt=""></div></div>
      <div class="column"><div class="label">Lit implementation · real MDI</div><div class="implementation"></div></div>
    </div>`;
  section.querySelector(".implementation")!.append(card);
  main.append(section);
}
