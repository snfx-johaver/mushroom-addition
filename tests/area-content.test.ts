import { afterEach, describe, expect, it, vi } from "vitest";
import { applyAreaContent, applyNativeControlColor } from "../src/area-content";
import { mergeNativeAreaEdit, nativeAreaConfig } from "../src/area-advanced";
import type { HassEntity, HomeAssistant } from "../src/types";

const temperature: HassEntity = { entity_id: "sensor.temperature", state: "21",
  attributes: { device_class: "temperature", icon: "mdi:home-thermometer", unit_of_measurement: "°C" } };
const humidity: HassEntity = { entity_id: "sensor.humidity", state: "50",
  attributes: { device_class: "humidity", unit_of_measurement: "%" } };
const hass: HomeAssistant = { states: { [temperature.entity_id]: temperature, [humidity.entity_id]: humidity },
  areas: { office: { area_id: "office", name: "Office" } }, entities: {}, callService: vi.fn() };
class ContentCard extends HTMLElement {
  hass = hass;
  layout = "grid";
  _config: Record<string, unknown> = { type: "area", area: "office", display_type: "compact", sensor_classes: ["temperature", "humidity"] };
  _groupedSensorEntityIds = vi.fn(() => new Map([["temperature", [temperature.entity_id]], ["humidity", [humidity.entity_id]]]));
  _computeSensorsDisplay() {
    const classes = this._config.sensor_classes as string[];
    return classes.map(c => c === "temperature" ? "21 °C" : "50 %").join(" · ");
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = "<ha-tile-container><ha-tile-info></ha-tile-info></ha-tile-container>";
  }
}
customElements.define("test-area-content", ContentCard);
afterEach(() => document.body.replaceChildren());

describe("Area native content enhancements", () => {
  it("applies the selected active light group RGB only when enabled and clears stale accents", () => {
    const card = document.createElement("test-area-content") as ContentCard;
    const light: HassEntity = { entity_id: "light.member", state: "on", attributes: { rgb_color: [24, 100, 200] } };
    const group: HassEntity = { entity_id: "light.room", state: "on", attributes: { entity_id: [light.entity_id] } };
    card.hass = { ...hass, states: { ...hass.states, [light.entity_id]: light, [group.entity_id]: group } };
    const options = { use_light_color: true, light_entity: group.entity_id };
    applyAreaContent(card, options);
    expect(card.hasAttribute("data-light-accent")).toBe(true);
    expect(card.style.getPropertyValue("--addition-room-rgb")).toBe("24,100,200");
    applyAreaContent(card, { ...options, use_light_color: false });
    expect(card.hasAttribute("data-light-accent")).toBe(false);
    expect(card.style.getPropertyValue("--addition-room-rgb")).toBe("");
    applyAreaContent(card, options);
    card.hass = { ...card.hass, states: { ...card.hass.states, [group.entity_id]: { ...group, state: "off" } } };
    applyAreaContent(card, options);
    expect(card.hasAttribute("data-light-accent")).toBe(false);
    applyAreaContent(card, { ...options, light_entity: "light.missing" });
    expect(card.style.getPropertyValue("--addition-room-rgb")).toBe("");
    const native = nativeAreaConfig({ type: "custom:area", ...options }, true);
    expect(native).not.toHaveProperty("use_light_color");
    expect(native).not.toHaveProperty("light_entity");
    expect(mergeNativeAreaEdit({ type: "custom:area", ...options }, native)).toMatchObject(options);
  });
  it("preserves native values, class order, entity icons and resets options without copying aggregation", () => {
    const card = document.createElement("test-area-content") as ContentCard;
    document.body.append(card);
    const snapshot = structuredClone(card._config);
    applyAreaContent(card, { alert_color: "red", sensor_wrap: true, sensor_icons: true });
    const slot = card.shadowRoot!.querySelector(".addition-sensors")!;
    expect(slot.getAttribute("slot")).toBe("secondary");
    expect(slot.classList.contains("wrap")).toBe(true);
    expect([...slot.querySelectorAll(".value")].map(el => el.textContent)).toEqual(["21 °C", "50 %"]);
    const icons = [...slot.querySelectorAll("ha-state-icon")] as (HTMLElement & { stateObj: HassEntity })[];
    expect(icons.map(icon => icon.stateObj)).toEqual([temperature, humidity]);
    expect(card._config).toEqual(snapshot);
    expect(card.style.getPropertyValue("--addition-alert-color")).toBe("var(--red-color, red)");
    applyAreaContent(card, { sensor_wrap: true });
    expect(slot.querySelector("ha-state-icon")).toBeNull();
    expect(card.shadowRoot!.querySelectorAll("style[data-area-content]")).toHaveLength(1);
    applyAreaContent(card, {});
    expect(card.shadowRoot!.querySelector(".addition-sensors")).toBeNull();
    expect(card.style.getPropertyValue("--addition-alert-color")).toBe("");
    expect((card.shadowRoot!.querySelector("ha-tile-container") as HTMLElement & { fixedInfoHeight: boolean }).fixedInfoHeight).toBe(true);
  });

  it("retains per-class entity overrides and omits absent native values", () => {
    const card = document.createElement("test-area-content") as ContentCard;
    card.hass = { ...hass, areas: { office: { area_id: "office", name: "Office", temperature_entity_id: humidity.entity_id } } };
    card._computeSensorsDisplay = function () {
      return (this._config.sensor_classes as string[])[0] === "temperature" ? "50 %" : "";
    };
    applyAreaContent(card, { sensor_icons: true });
    expect(card.shadowRoot!.querySelectorAll(".addition-sensor")).toHaveLength(1);
    expect((card.shadowRoot!.querySelector("ha-state-icon") as HTMLElement & { stateObj: HassEntity }).stateObj).toBe(humidity);
  });

  it("keeps extension keys out of strict native configuration and roundtrips their changes", () => {
    const config = { type: "custom:area", area: "office", alert_color: "red", sensor_wrap: true, sensor_icons: false };
    const native = nativeAreaConfig(config, true);
    expect(native).not.toHaveProperty("alert_color");
    expect(native).not.toHaveProperty("sensor_wrap");
    expect(native).not.toHaveProperty("sensor_icons");
    expect(mergeNativeAreaEdit(config, { ...native, name: "Office" })).toMatchObject(config);
    expect(mergeNativeAreaEdit(config, { ...native, alert_color: undefined, sensor_wrap: false, sensor_icons: true }))
      .toMatchObject({ alert_color: undefined, sensor_wrap: false, sensor_icons: true });
  });

  it("overrides native control CSS without replacing native aggregation or actions", () => {
    const group = document.createElement("div");
    group.attachShadow({ mode: "open" }).innerHTML = '<ha-control-button class="active"></ha-control-button>';
    applyNativeControlColor(group, "red");
    expect(group.style.getPropertyValue("--addition-control-color")).toBe("var(--red-color, red)");
    expect(group.shadowRoot!.querySelector("style")!.textContent).toContain("--control-button-icon-color");
    applyNativeControlColor(group, undefined);
    expect(group.style.getPropertyValue("--addition-control-color")).toBe("");
    expect(group.shadowRoot!.querySelectorAll("style")).toHaveLength(1);
  });
});
