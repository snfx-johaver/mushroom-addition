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
      ? `mdi${value.slice(4).split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join("")}`
      : "";
    const path = (mdiPaths as Record<string, unknown>)[exportName];
    this.shadowRoot!.innerHTML = typeof path === "string"
      ? `<style>:host{display:inline-flex;width:24px;height:24px;color:inherit}svg{width:100%;height:100%;fill:currentColor}</style><svg viewBox="0 0 24 24"><path d="${path}"></path></svg>`
      : "";
  }
  public attributeChangedCallback(_name: string, _oldValue: string | null, value: string | null) {
    if (value) this.icon = value;
  }
}
if (!customElements.get("ha-icon")) customElements.define("ha-icon", HaIcon);

const states: HomeAssistant["states"] = {
  "sensor.waste": { entity_id: "sensor.waste", state: "TODAY", attributes: { friendly_name: "Paper", icon: "mdi:trash-can", daysTo: 0 } },
  "sensor.time": { entity_id: "sensor.time", state: "19:15", attributes: { friendly_name: "Time" } },
  "weather.home": { entity_id: "weather.home", state: "partlycloudy", attributes: { friendly_name: "Home weather", temperature: 18 } },
  "person.joris": { entity_id: "person.joris", state: "home", attributes: { friendly_name: "Joris", entity_picture: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='64' height='64' rx='32' fill='%23d6aa8d'/%3E%3Ccircle cx='32' cy='24' r='12' fill='%2345342d'/%3E%3C/svg%3E" } },
  "media_player.console": { entity_id: "media_player.console", state: "playing", attributes: { friendly_name: "PlayStation 4", media_title: "Gran Turismo", entity_picture: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='120'%3E%3Cdefs%3E%3ClinearGradient id='g'%3E%3Cstop stop-color='%236f4a2f'/%3E%3Cstop offset='1' stop-color='%23d79a44'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='480' height='120' fill='url(%23g)'/%3E%3C/svg%3E" } },
  "light.qubino": { entity_id: "light.qubino", state: "on", attributes: { friendly_name: "Pilot wire", brightness: 128 } },
  "input_select.ordres_fil_pilote": { entity_id: "input_select.ordres_fil_pilote", state: "Comfort", attributes: { friendly_name: "Pilot wire order" } },
  "binary_sensor.driving": { entity_id: "binary_sensor.driving", state: "off", attributes: { friendly_name: "Driving" } },
  "zone.work": { entity_id: "zone.work", state: "0", attributes: { friendly_name: "Work", icon: "mdi:briefcase" } },
  "script.find_phone": { entity_id: "script.find_phone", state: "off", attributes: { friendly_name: "Find phone" } },
};
const hass: HomeAssistant = {
  states,
  callService: async () => undefined,
  localize: (key) => key.endsWith(".home") ? "Home" : key,
};

const fixtures: Array<{
  sourceId: string;
  slug: string;
  width: number;
  config: Omit<AdditionConfig, "type">;
  reference: string;
}> = [
  {
    sourceId: "custom_card_paddy_waste_collection",
    slug: "paddy-waste-collection",
    width: 320,
    config: { entity: "sensor.waste" },
    reference: `<div class="source-card"><div class="source-row"><span class="bubble alert" style="color:#f44336;background:rgb(244 67 54 / 50%)"><ha-icon icon="mdi:trash-can"></ha-icon></span><span class="copy"><b>TODAY</b><small>Paper</small></span></div></div>`,
  },
  {
    sourceId: "custom_card_paddy_welcome",
    slug: "paddy-welcome",
    width: 420,
    config: { entity: "person.joris", variant: "weather", time_entity: "sensor.time", weather_entity: "weather.home" },
    reference: `<div class="source-card welcome-source"><div class="greeting">Good evening,<br>Joris!</div><div class="weather-source"><span><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon><span class="copy"><b>partly cloudy</b><small>Home weather</small></span></span><b>18°</b></div></div>`,
  },
  {
    sourceId: "custom_card_person_chip",
    slug: "person-chip",
    width: 180,
    config: { entity: "person.joris", use_entity_picture: true },
    reference: `<div class="source-card chip-source"><span class="avatar"><ha-icon icon="mdi:face-man"></ha-icon></span><b>Home</b></div>`,
  },
  {
    sourceId: "custom_card_playstation",
    slug: "playstation",
    width: 320,
    config: { entity: "media_player.console" },
    reference: `<div class="source-card console-source"><div class="source-row"><span class="bubble"><ha-icon icon="mdi:sony-playstation"></ha-icon></span><span class="copy"><b>Gran Turismo</b><small>PlayStation 4</small></span></div></div>`,
  },
  {
    sourceId: "custom_card_qubino",
    slug: "qubino",
    width: 320,
    config: { entity: "light.qubino", qubino_more_info_entity: "input_select.ordres_fil_pilote" },
    reference: `<div class="source-card qubino-source"><div class="source-row"><span class="bubble"><ha-icon icon="mdi:memory"></ha-icon></span><span class="copy"><b>Pilot wire</b><small>Comfort -1°C · 50</small></span></div></div>`,
  },
  {
    sourceId: "custom_card_ristou_person",
    slug: "ristou-person",
    width: 466,
    config: {
      entity: "person.joris",
      ulm_custom_card_ristou_use_entity_picture: true,
      ulm_custom_card_ristou_use_badge: true,
      ulm_custom_card_ristou_zones: ["zone.work"],
      ulm_custom_card_ristou_find_device_script: "script.find_phone",
      ulm_custom_card_ristou_map_enable: true,
    },
    reference: `<div class="source-card ristou-source"><div class="source-row"><span class="avatar"><ha-icon icon="mdi:face-man"></ha-icon></span><span class="copy"><b>Joris</b><small>home</small></span><span class="find"><ha-icon icon="mdi:cellphone-sound"></ha-icon></span></div><div class="ristou-map"><ha-icon icon="mdi:map-marker-path"></ha-icon></div></div>`,
  },
];

const main = document.querySelector("#comparisons")!;
for (const fixture of fixtures) {
  const section = document.createElement("section");
  section.dataset.source = fixture.sourceId;
  section.style.setProperty("--width", `${fixture.width}px`);
  section.innerHTML = `<h2>${fixture.sourceId}</h2><div class="columns"><div><div class="column-label">Pinned source composition</div><div class="source">${fixture.reference}</div></div><div><div class="column-label">Lit implementation</div><div class="implementation"></div></div></div>`;
  const tag = `mushroom-addition-custom-card-${fixture.slug}`;
  const card = document.createElement(tag) as HTMLElement & { hass: HomeAssistant; setConfig(config: AdditionConfig): void };
  card.hass = hass;
  card.setConfig({ type: `custom:${tag}`, ...fixture.config });
  section.querySelector(".implementation")!.append(card);
  main.append(section);
}
