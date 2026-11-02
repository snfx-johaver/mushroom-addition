import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { AIR_QUALITY_KINDS, airQualityAnalysisValue, airQualityColor, airQualitySeverity, airQualityStatus, airQualityStub, validateAirQuality, type AirQualitySensor } from "../src/air-quality";
import { airQualitySensorSchema, type AirQualityEditor } from "../src/air-quality-editor";
import type { MushroomAirQualityCard } from "../src/air-quality-card";
import type { MushroomAdditionEditor } from "../src/editor";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import { getCatalogItem } from "../src/catalog";
import { editorSchemaFor } from "../src/editor-schema";
import { createStubConfig } from "../src/stub";

const type = "custom:mushroom-addition-air-quality";
const source = (state = "900", unit = "ppm"): HomeAssistant => ({
  language: "en", callService: vi.fn(async () => undefined),
  states: {
    "sensor.co2": { entity_id: "sensor.co2", state, attributes: { device_class: "carbon_dioxide", unit_of_measurement: unit } },
    "sensor.quality": { entity_id: "sensor.quality", state: "good", attributes: {} },
  },
});
const row: AirQualitySensor = { kind: "co2", entity: "sensor.co2" };
const config = (extra: Partial<AdditionConfig> = {}): AdditionConfig => ({ type, air_quality_sensors: [row], ...extra });
afterEach(() => { document.body.replaceChildren(); vi.restoreAllMocks(); });
async function cardFor(extra: Partial<AdditionConfig> = {}) {
  const card = document.createElement(type.slice(7)) as MushroomAirQualityCard;
  card.setConfig(config(extra)); card.hass = source();
  document.body.append(card); await card.updateComplete;
  return card;
}
describe("Air Quality readings and indication", () => {
  it.each([
    [800, 0], [801, 1], [1000, 1], [1001, 2], [1400, 2], [1401, 3],
  ])("rates CO2 %s at the preserved boundary %s", (value, severity) => {
    expect(airQualitySeverity(row, value)).toBe(severity);
  });
  it.each([
    ["temperature", 15, "blue"], ["temperature", 19, "amber"], ["temperature", 20, "green"],
    ["temperature", 25, "orange"], ["temperature", 28, "red"],
    ["humidity", 25, "red"], ["humidity", 30, "amber"], ["humidity", 60, "green"], ["humidity", 70, "amber"], ["humidity", 71, "red"],
    ["pm25", 12, "green"], ["pm25", 25, "amber"], ["pm25", 35, "orange"], ["pm25", 36, "red"],
    ["voc", 250, "green"], ["voc", 1000, "amber"], ["voc", 2000, "orange"], ["voc", 2001, "red"],
    ["radon", 50, "green"], ["radon", 100, "amber"], ["radon", 150, "orange"], ["radon", 151, "red"],
    ["mould", 59, "green"], ["mould", 60, "amber"], ["mould", 70, "orange"], ["mould", 80, "red"],
    ["pressure", 989, "orange"], ["pressure", 990, "green"], ["pressure", 1030, "green"], ["pressure", 1031, "amber"],
  ] as const)("preserves %s color at %s", (kind, value, color) => {
    expect(airQualityColor({ kind }, value)).toBe(color);
  });
  it.each([
    ["temperature", "77", "°F", 25], ["temperature", "298.15", "K", 25],
    ["pm25", ".03", "mg/m³", 30], ["pm25", "30", "μg/m³", 30],
    ["voc", "1.5", "ppm", 1500], ["radon", "4", "pCi/L", 148],
    ["pressure", "101300", "Pa", 1013], ["pressure", "101.3", "kPa", 1013],
  ] as const)("converts %s %s %s only for classification", (kind, value, unit, expected) => {
    expect(airQualityAnalysisValue(source(value, unit), { ...row, kind })).toBeCloseTo(expected);
  });
  it("does not convert VOC mass units, unknown units or invalid values to a healthy rating", () => {
    expect(airQualityAnalysisValue(source("150", "µg/m³"), { ...row, kind: "voc" })).toBeUndefined();
    for (const value of ["", " ", "unknown", "unavailable", "NaN", "Infinity", "-1"]) {
      expect(airQualityStatus(source(value), config()).name).toBe("Unknown");
    }
    expect(airQualityStatus(source("900", "nonsense"), config()).name).toBe("Unknown");
  });
  it("uses only available visible pollutants, not temperature or humidity, for the derived indicator", () => {
    const hass = source("500");
    hass.states["sensor.hot"] = { entity_id: "sensor.hot", state: "95", attributes: {} };
    expect(airQualityStatus(hass, config({ air_quality_sensors: [row, { kind: "humidity", entity: "sensor.hot" }] })).name).toBe("Good");
    expect(airQualityStatus(hass, config({ air_quality_sensors: [{ ...row, enabled: false }] })).name).toBe("Unknown");
    expect(airQualityStatus(hass, config({ air_quality_sensors: [row, { kind: "pm25", entity: "sensor.hot" }] })).name).toBe("Very poor");
  });
  it.each(["good", "moderate", "poor", "very_poor", "unhealthy", "unavailable", "42"])("honors the explicit %s quality source", state => {
    const hass = source("9000"); hass.states["sensor.quality"].state = state;
    const expected = { good: "Good", moderate: "Fair", poor: "Poor", very_poor: "Very poor", unhealthy: "Very poor" }[state] ?? "Unknown";
    expect(airQualityStatus(hass, config({ entity: "sensor.quality" })).name).toBe(expected);
  });
  it("rejects invalid types, decimals and threshold ranges explicitly", () => {
    expect(() => validateAirQuality(config({ air_quality_sensors: [{ ...row, decimals: -1 }] }))).toThrow("Decimal");
    expect(() => validateAirQuality(config({ air_quality_sensors: [{ ...row, warning_above: 1500 }] }))).toThrow("increase");
    expect(() => validateAirQuality(config({ air_quality_sensors: [{ ...row, warning_below: 15, bad_below: 30 }] }))).toThrow("lower threshold");
    expect(() => validateAirQuality(config({ air_quality_sensors: [{ ...row, bad_above: NaN }] }))).toThrow("finite");
  });
});
describe("Air Quality card and visual editor", () => {
  it("registers in the picker with coherent device-specific healthy defaults", () => {
    const hass = source();
    hass.entities = { "sensor.co2": { device_id: "room" },
      "sensor.temperature": { device_id: "room" } };
    hass.states["sensor.temperature"] = { entity_id: "sensor.temperature", state: "21", attributes: { device_class: "temperature" } };
    const stub = airQualityStub(hass);
    expect(stub.air_quality_sensors).toEqual([{ kind: "temperature", entity: "sensor.temperature" }, { kind: "co2", entity: "sensor.co2" }]);
    expect(createStubConfig(getCatalogItem(type.slice(7))!, hass)).toEqual(stub);
    expect(stub.primary_info).toBeUndefined();
    expect(stub.secondary_info).toBeUndefined();
    expect(airQualityStub().air_quality_sensors).toEqual([]);
  });
  it("renders compact readings, scoped more-info actions and a live top-right indicator", async () => {
    const card = await cardFor({ name: "Office" });
    expect(card.shadowRoot!.querySelector(".ulm-name")!.textContent).toBe("Office");
    expect(card.shadowRoot!.querySelector(".aq-reading b")!.textContent).toBe("900");
    expect(card.shadowRoot!.querySelector(".aq-status")!.getAttribute("aria-label")).toBe("Air Quality: Fair");
    expect(card.shadowRoot!.querySelector(".aq-status-label")!.textContent).toBe("Fair");
    const listener = vi.fn(); card.addEventListener("hass-action", listener);
    card.shadowRoot!.querySelector<HTMLButtonElement>(".aq-reading")!.click();
    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0][0].detail.config.entity).toBe("sensor.co2");
    expect(listener.mock.calls[0][0].detail.config.tap_action.action).toBe("more-info");
    card.hass = source("1500"); await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".aq-status ha-icon")).toHaveProperty("icon", "mdi:emoticon-dead-outline");
    expect(card.shadowRoot!.querySelector(".aq-status-label")!.textContent).toBe("Very poor");
    card.hass = source("unavailable"); await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".aq-reading b")!.textContent).toBe("—");
    expect(card.shadowRoot!.querySelector(".aq-reading")!.getAttribute("aria-label")).toContain("Unavailable");
    expect(card.shadowRoot!.querySelector(".aq-status-label")!.textContent).toBe("Unknown");
  });
  it("honors shared primary/secondary presentation and independent header controls", async () => {
    const card = await cardFor({ entity: "sensor.quality", primary_info: "state", secondary_info: "name", name: "Office" });
    expect(card.shadowRoot!.querySelector(".ulm-name")!.textContent).toBe("good");
    expect(card.shadowRoot!.querySelector(".ulm-label")!.textContent).toBe("Office");
    card.setConfig(config({ air_quality_show_title: false, air_quality_show_icon: false }));
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".ulm-name")).toBeNull();
    expect(card.shadowRoot!.querySelector(".ulm-icon")).toBeNull();
    expect(card.shadowRoot!.querySelector(".aq-status")).not.toBeNull();
    card.setConfig(config({ air_quality_show_header: false, air_quality_show_badge: false }));
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".aq-header")).toBeNull();
    expect(card.shadowRoot!.querySelectorAll(".aq-reading")).toHaveLength(1);
  });
  it("uses per-row precision, units, icons, colors, order, mould labels and visibility", async () => {
    const card = await cardFor({ air_quality_sensors: [
      { kind: "custom", entity: "sensor.co2", decimals: 2, unit: " ppm", icon: "mdi:star", color: "purple" },
      { ...row, enabled: false }, { kind: "mould", entity: "sensor.humidity" },
    ] });
    card.hass = { ...source("900.234"), states: { ...source("900.234").states,
      "sensor.humidity": { entity_id: "sensor.humidity", state: "70", attributes: { unit_of_measurement: "%" } } } };
    await card.updateComplete;
    const readings = [...card.shadowRoot!.querySelectorAll(".aq-reading")];
    expect(readings).toHaveLength(2);
    expect(readings[0].querySelector("b")!.textContent).toBe("900.23 ppm");
    expect(readings[0].querySelector("ha-icon")).toHaveProperty("icon", "mdi:star");
    expect(readings[0].getAttribute("style")).toContain("purple");
    expect(readings[1].querySelector("b")!.textContent).toBe("High");
  });
  it("ignores unrelated hass state updates without polling", async () => {
    const card = await cardFor();
    const root = card.shadowRoot!.querySelector(".aq-readings");
    const update = vi.spyOn(card, "update");
    card.hass = { ...card.hass!, states: { ...card.hass!.states, "sensor.other": { entity_id: "sensor.other", state: "1", attributes: {} } } };
    await card.updateComplete;
    expect(update).not.toHaveBeenCalled();
    expect(card.shadowRoot!.querySelector(".aq-readings")).toBe(root);
  });
  it("exposes all options through the shared sectioned editor and keeps draft errors visible", async () => {
    const item = getCatalogItem(type.slice(7))!;
    const fields = editorSchemaFor(item).flatMap(field => field.schema ?? field);
    expect(fields.map(f => f.name)).toEqual(expect.arrayContaining(["entity", "name", "icon", "primary_info", "secondary_info",
      "air_quality_show_header", "air_quality_show_title", "air_quality_show_icon", "air_quality_show_badge", "tap_action", "hold_action", "double_tap_action"]));
    for (const kind of AIR_QUALITY_KINDS) expect(airQualitySensorSchema({ kind }).map(f => f.name)).toEqual(expect.arrayContaining([
      "kind", "entity", "enabled", "icon", "color", "warning_above", "poor_above", "bad_above", "warning_below", "bad_below",
    ]));
    const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
    editor.hass = source(); editor.setConfig(config()); document.body.append(editor); await editor.updateComplete;
    const panel = [...editor.shadowRoot!.querySelectorAll("ha-expansion-panel")].find(p => p.textContent?.includes("Features"))!;
    panel.dispatchEvent(new CustomEvent("expanded-will-change", { detail: { expanded: true } })); await editor.updateComplete;
    const options = panel.querySelector<AirQualityEditor>("mushroom-addition-air-quality-options")!;
    await options.updateComplete;
    expect(options).not.toBeNull();
    const events = vi.fn(); options.addEventListener("config-changed", events);
    const change = (value: Partial<AirQualitySensor>) => options.shadowRoot!.querySelector("ha-form")!.dispatchEvent(
      new CustomEvent("value-changed", { detail: { value: { ...row, ...value } }, bubbles: true, composed: true }));
    change({ warning_above: 2000 }); await options.updateComplete;
    expect(events).not.toHaveBeenCalled();
    expect(options.shadowRoot!.querySelector("[role=alert]")!.textContent).toContain("increase");
    change({ warning_above: 700 }); await options.updateComplete;
    expect(events).toHaveBeenCalledOnce();
    expect(events.mock.calls[0][0].detail.config.air_quality_sensors[0].warning_above).toBe(700);
  });
  it("adds, edits, reorders, hides, removes and reopens sensor rows without config loops", async () => {
    const editor = document.createElement("mushroom-addition-air-quality-options") as AirQualityEditor;
    editor.hass = source(); editor.config = config(); document.body.append(editor); await editor.updateComplete;
    const configs: AdditionConfig[] = [];
    editor.addEventListener("config-changed", event => { const next = (event as CustomEvent<{ config: AdditionConfig }>).detail.config; configs.push(next); editor.config = next; });
    const click = async (label: string, index = 0) => {
      [...editor.shadowRoot!.querySelectorAll("button")].filter(button => button.textContent === label)[index].click();
      await editor.updateComplete;
    };
    await click("Add sensor");
    expect(editor.config.air_quality_sensors).toHaveLength(2);
    await click("Move up", 1);
    expect(editor.config.air_quality_sensors![0].kind).toBe("custom");
    const form = editor.shadowRoot!.querySelector("ha-form")!;
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { kind: "temperature", entity: "sensor.co2", enabled: false, name: "Extra" } } }));
    await editor.updateComplete;
    expect(editor.config.air_quality_sensors![0]).toMatchObject({ kind: "temperature", name: "Extra", enabled: false });
    await click("Remove", 1);
    const saved = structuredClone(editor.config);
    editor.config = saved; await editor.updateComplete;
    expect(editor.config).toEqual(saved);
    expect(configs).toHaveLength(4);
  });
});
