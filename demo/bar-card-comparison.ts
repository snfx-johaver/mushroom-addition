import "../src/index";
import * as mdiPaths from "@mdi/js";
import type { AdditionConfig, HomeAssistant } from "../src/types";

class HaCard extends HTMLElement {}
if (!customElements.get("ha-card")) customElements.define("ha-card", HaCard);

class HaIcon extends HTMLElement {
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
}
if (!customElements.get("ha-icon")) customElements.define("ha-icon", HaIcon);

const hass: HomeAssistant = {
  states: {
    "sensor.cpu": {
      entity_id: "sensor.cpu",
      state: "4",
      attributes: { friendly_name: "CPU Usage", unit_of_measurement: "%" },
    },
    "sensor.memory": {
      entity_id: "sensor.memory",
      state: "17.7",
      attributes: { friendly_name: "Memory Usage", unit_of_measurement: "%" },
    },
  },
  callService: async () => undefined,
};

const configs: AdditionConfig[] = [
  {
    type: "custom:mushroom-addition-custom-card-bar-card",
    entity: "sensor.cpu",
    ulm_custom_card_bar_card_name: "CPU Usage",
    ulm_custom_card_bar_card_icon: "mdi:chip",
    ulm_custom_card_bar_card_color: "#7ba6ff",
    ulm_custom_card_bar_card_min: 0,
    ulm_custom_card_bar_card_max: 100,
    ulm_custom_card_bar_card_value: true,
  },
  {
    type: "custom:mushroom-addition-custom-card-bar-card",
    entity: "sensor.memory",
    ulm_custom_card_bar_card_name: "Memory Usage",
    ulm_custom_card_bar_card_icon: "mdi:memory",
    ulm_custom_card_bar_card_color: "#81c995",
    ulm_custom_card_bar_card_min: 0,
    ulm_custom_card_bar_card_max: 100,
    ulm_custom_card_bar_card_value: true,
  },
];

const container = document.querySelector("#implementation")!;
for (const config of configs) {
  const card = document.createElement("mushroom-addition-custom-card-bar-card") as HTMLElement & {
    hass: HomeAssistant;
    setConfig(value: AdditionConfig): void;
  };
  card.hass = hass;
  card.setConfig(config);
  container.append(card);
}
