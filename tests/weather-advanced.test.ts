import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { CATALOG } from "../src/catalog";
import { createStubConfig } from "../src/stub";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import type { MushroomAdditionEditor } from "../src/editor";
import type { WeatherAdvancedEditor } from "../src/weather-advanced/editor";
import type { AnimatedWeatherCard } from "../src/weather-advanced/components/card";
import type { MushroomWeatherAdvancedCard } from "../src/weather-advanced/card";
import { WEATHER_OPTIONS, validateWeatherOptions, weatherDefaults } from "../src/weather-advanced/config";
import { I18n } from "../src/weather-advanced/internationalization";
import type { EditorField } from "../src/editor-schema";

const tag = "mushroom-addition-weather-advanced";
const source = (): HomeAssistant => ({
  language: "en", callService: vi.fn(async () => undefined),
  states: {
    "weather.example": { entity_id: "weather.example", state: "rainy", attributes: {
      temperature: 18, humidity: 75, wind_speed: 12, wind_speed_unit: "km/h",
      forecast: [{ datetime: new Date(Date.now() + 3600000).toISOString(), temperature: 19, condition: "cloudy" }],
    } },
    "sensor.temperature": { entity_id: "sensor.temperature", state: "21", attributes: {} },
  },
});
afterEach(() => { document.body.replaceChildren(); vi.restoreAllMocks(); });
async function cardFor(config: Partial<AdditionConfig> = {}) {
  const card = document.createElement(tag) as MushroomWeatherAdvancedCard;
  card.hass = source();
  card.setConfig({ type: `custom:${tag}`, entity: "weather.example", weather: { show_animations: false }, ...config });
  document.body.append(card);
  await card.updateComplete;
  const scene = card.shadowRoot!.querySelector<AnimatedWeatherCard>("mushroom-addition-weather-scene")!;
  await scene.updateComplete;
  return { card, scene };
}
async function section(editor: MushroomAdditionEditor, title: string, expanded: boolean) {
  const panel = [...editor.shadowRoot!.querySelectorAll("ha-expansion-panel")]
    .find(panel => panel.querySelector(".section-header")?.textContent?.includes(title))!;
  panel.dispatchEvent(new CustomEvent("expanded-will-change", { detail: { expanded } }));
  await editor.updateComplete;
  panel.dispatchEvent(new CustomEvent("expanded-changed", { detail: { expanded } }));
  await editor.updateComplete;
  const controls = panel.querySelector<WeatherAdvancedEditor>("mushroom-addition-weather-options");
  if (controls) await controls.updateComplete;
  return { panel, controls };
}
type Form = HTMLElement & { schema: EditorField[]; data: Record<string, unknown>; hass: HomeAssistant };

describe("Weather Advanced integration", () => {
  it("is registered once with a healthy weather picker example and no costly preview", () => {
    const descriptor = CATALOG.find(item => item.tag === tag)!;
    const hass = source();
    hass.states["weather.unavailable"] = { entity_id: "weather.unavailable", state: "unavailable", attributes: {} };
    const stub = createStubConfig(descriptor, hass, ["weather.unavailable"]);
    expect(stub.entity).toBe("weather.example");
    expect(stub.primary_info).toBeUndefined();
    expect(stub.secondary_info).toBeUndefined();
    expect(window.customCards!.filter(item => item.type === tag)).toHaveLength(1);
    expect(window.customCards!.find(item => item.type === tag)?.preview).toBe(false);
    expect(customElements.get("dynamic-weather-card")).toBeUndefined();
    for (const original of ["weather-clock", "weather-details", "hourly-forecast", "daily-forecast"]) {
      expect(customElements.get(original)).toBeUndefined();
    }
  });
  it("uses one Mushroom heading and shared actions for both header and weather surface", async () => {
    const { card, scene } = await cardFor({ name: "Garden weather", secondary: "Live forecast" });
    expect(card.shadowRoot!.textContent).toContain("Garden weather");
    expect(card.shadowRoot!.textContent).toContain("Live forecast");
    expect(scene.shadowRoot!.querySelector(".location")).toBeNull();
    expect(scene.shadowRoot!.textContent).toContain("Rainy");
    const actions = vi.fn();
    card.addEventListener("hass-action", actions);
    card.shadowRoot!.querySelector<HTMLElement>(".energy-heading")!.click();
    card.shadowRoot!.querySelector<HTMLElement>(".weather-content")!.click();
    expect(actions).toHaveBeenCalledTimes(2);
    expect(card.hass!.callService).not.toHaveBeenCalled();
  });
  it("renders missing entities explicitly rather than inventing sunny weather", async () => {
    const { scene } = await cardFor({ entity: "weather.missing" });
    expect(scene.shadowRoot!.querySelector("[role=status]")).not.toBeNull();
    expect(scene.shadowRoot!.querySelector(".canvas-container")).toBeNull();
  });
  it("updates sensor overrides but skips unrelated hass updates", async () => {
    const { card, scene } = await cardFor({ weather: { show_animations: false, temperature_entity: "sensor.temperature" } });
    expect(scene.shadowRoot!.querySelector(".temperature")?.textContent).toBe("21°");
    const original = scene.hass;
    card.hass = { ...card.hass!, states: { ...card.hass!.states, "sensor.unrelated": {
      entity_id: "sensor.unrelated", state: "2", attributes: {},
    } } };
    await card.updateComplete;
    expect(scene.hass).toBe(original);
    card.hass = { ...card.hass!, states: { ...card.hass!.states, "sensor.temperature": {
      entity_id: "sensor.temperature", state: "23", attributes: {},
    } } };
    await card.updateComplete;
    await scene.updateComplete;
    expect(scene.shadowRoot!.querySelector(".temperature")?.textContent).toBe("23°");
  });
  it("covers every supported option in lazy Layout/Features forms without duplicate presentation or actions", async () => {
    const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
    editor.hass = source();
    editor.setConfig({ type: `custom:${tag}`, name: "Garden weather", entity: "weather.example" });
    document.body.append(editor);
    await editor.updateComplete;
    expect(editor.shadowRoot!.querySelector("mushroom-addition-weather-options")).toBeNull();
    const layout = await section(editor, "Layout", true);
    const features = await section(editor, "Features", true);
    const forms = [layout.controls!, features.controls!].flatMap(control =>
      [...control.shadowRoot!.querySelectorAll<Form>("ha-form")]);
    const fields = forms.flatMap(form => form.schema.map(field => field.name));
    expect(new Set(fields)).toEqual(new Set(Object.values(WEATHER_OPTIONS).flat().map(option => option.field.name)));
    expect(fields).not.toContain("name");
    expect(fields).not.toContain("entity");
    expect(fields).not.toContain("tap_action");
    const before = forms.map(form => form.schema);
    editor.hass = { ...editor.hass! };
    await editor.updateComplete;
    await Promise.all([layout.controls!.updateComplete, features.controls!.updateComplete]);
    forms.forEach((form, index) => { expect(form.schema).toBe(before[index]); expect(form.hass).toBe(editor.hass); });
    await section(editor, "Layout", false);
    await section(editor, "Features", false);
    expect(editor.shadowRoot!.querySelector("mushroom-addition-weather-options")).toBeNull();
    const reopened = await section(editor, "Features", true);
    expect(reopened.controls!.shadowRoot!.querySelectorAll("ha-form")).toHaveLength(4);
  });
  it("saves nested weather options without overwriting Mushroom layout, name or actions and rejects invalid values", async () => {
    const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
    editor.hass = source();
    editor.setConfig({ type: `custom:${tag}`, entity: "weather.example", name: "Garden",
      layout: "vertical", tap_action: { action: "navigate", navigation_path: "/weather" },
      weather: { show_clock: true } });
    document.body.append(editor);
    await editor.updateComplete;
    const { controls } = await section(editor, "Layout", true);
    const form = controls!.shadowRoot!.querySelector<Form>("ha-form")!;
    const changes = vi.fn();
    editor.addEventListener("config-changed", changes);
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { layout: "minimal", show_animations: false } } }));
    await editor.updateComplete;
    expect(changes.mock.calls[0][0].detail.config).toMatchObject({ name: "Garden", layout: "vertical",
      tap_action: { action: "navigate" }, weather: { show_clock: true, layout: "minimal", show_animations: false } });
    changes.mockClear();
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { height: 0 } } }));
    await controls!.updateComplete;
    expect(changes).not.toHaveBeenCalled();
    expect(controls!.shadowRoot!.querySelector("[role=alert]")?.textContent).toContain("height");
  });
  it("validates numeric options and isolates translated text per instance", async () => {
    expect(() => validateWeatherOptions(weatherDefaults)).not.toThrow();
    for (const weather of [{ overlay_opacity: 2 }, { hourly_forecast_hours: 0 }, { daily_forecast_days: 1.5 }]) {
      expect(() => validateWeatherOptions(weather)).toThrow();
    }
    const english = new I18n(), dutch = new I18n();
    dutch.setLanguage("nl");
    expect(english.t("rainy")).not.toBe(dutch.t("rainy"));
    expect(english.lang).toBe("en");
    const { scene } = await cardFor({ weather: { show_animations: false, language: "nl" } });
    expect(scene.shadowRoot!.textContent).toContain(dutch.t("rainy"));
  });
});
