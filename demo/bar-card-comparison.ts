import "../src/index";
import type { AdditionConfig, HomeAssistant } from "../src/types";

class HaCard extends HTMLElement {}
if (!customElements.get("ha-card")) customElements.define("ha-card", HaCard);

class HaIcon extends HTMLElement {
  public set icon(value: string) {
    this.textContent = value.includes("memory") ? "▦" : "⚙";
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
