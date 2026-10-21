import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { CATALOG } from "../src/catalog";
import { MushroomAdditionCard } from "../src/card";
import { MushroomAdditionEditor } from "../src/editor";
import { editorSchemaFor, type EditorField } from "../src/editor-schema";
import { localize } from "../src/localize";
import type { AdditionConfig, HomeAssistant } from "../src/types";

const descriptor = CATALOG.find(item => item.upstreamId === "custom_card_welcome")!;
const type = `custom:${descriptor.tag}`;
const makeHass = (): HomeAssistant => ({
  language: "en",
  config: { time_zone: "UTC", unit_system: { temperature: "°C" } },
  states: {
    "weather.preview": { entity_id: "weather.preview", state: "rainy", attributes: { friendly_name: "Weather", temperature: 17.5, temperature_unit: "°C" } },
    "person.preview": { entity_id: "person.preview", state: "home", attributes: { friendly_name: "Preview" } },
  },
  formatEntityState: entity => entity.state === "rainy" ? "Rainy" : entity.state,
  callService: vi.fn().mockResolvedValue(undefined),
});
async function render(config: Partial<AdditionConfig> = {}, hass = makeHass()) {
  const card = document.createElement(descriptor.tag) as MushroomAdditionCard;
  card.hass = hass;
  card.setConfig({ type, entity: "person.preview", ulm_weather: "weather.preview", ...config });
  document.body.append(card);
  await card.updateComplete;
  return card;
}
afterEach(() => { document.body.replaceChildren(); vi.useRealTimers(); vi.restoreAllMocks(); });

describe("Welcome weather toolbar", () => {
  it("defaults to the provider's weather icon, current temperature and secondary date", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-21T12:00:00Z"));
    const card = await render();
    const root = card.shadowRoot!;
    expect(root.querySelector("ha-icon")?.getAttribute("icon")).not.toBe("mdi:thermometer");
    expect(root.querySelector<HTMLElement & { icon: string }>(".welcome-weather ha-icon")!.icon).toBe("mdi:weather-rainy");
    expect(root.querySelector(".welcome-weather-primary")!.textContent).toBe("17.5°C");
    expect(root.querySelector(".welcome-weather-secondary")!.textContent).toBe("Oct 21");
    const action = vi.fn();
    card.addEventListener("hass-action", action);
    root.querySelector<HTMLButtonElement>(".welcome-weather")!.click();
    expect(action.mock.calls[0][0].detail.config).toMatchObject({
      entity: "weather.preview", tap_action: { action: "more-info" },
    });
    expect(card.hass!.callService).not.toHaveBeenCalled();
  });

  it("supports custom and hidden icons, independent lines, date format and tap action", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-21T12:00:00Z"));
    const card = await render({
      welcome_weather_icon_type: "icon", welcome_weather_icon: "mdi:umbrella",
      welcome_weather_primary_info: "state", welcome_weather_secondary_info: "date",
      welcome_weather_date_format: "full",
      welcome_weather_tap_action: { action: "navigate", navigation_path: "/lovelace/weather" },
    });
    const root = card.shadowRoot!;
    expect(root.querySelector<HTMLElement & { icon: string }>(".welcome-weather ha-icon")!.icon).toBe("mdi:umbrella");
    expect(root.querySelector(".welcome-weather-primary")!.textContent).toBe("Rainy");
    expect(root.querySelector(".welcome-weather-secondary")!.textContent).toBe("Wednesday, October 21, 2026");
    const action = vi.fn();
    card.addEventListener("hass-action", action);
    root.querySelector<HTMLButtonElement>(".welcome-weather")!.click();
    expect(action.mock.calls[0][0].detail.config.tap_action).toEqual({ action: "navigate", navigation_path: "/lovelace/weather" });
    card.setConfig({ type, ulm_weather: "weather.preview", welcome_weather_icon_type: "none",
      welcome_weather_primary_info: "none", welcome_weather_secondary_info: "none", welcome_weather_tap_action: { action: "none" } });
    await card.updateComplete;
    expect(root.querySelector(".welcome-weather ha-icon")).toBeNull();
    expect(root.querySelector(".welcome-weather-copy")).toBeNull();
    expect(root.querySelector<HTMLButtonElement>(".welcome-weather")!.disabled).toBe(true);
  });

  it("does not fabricate temperatures for unavailable or missing providers", async () => {
    const hass = makeHass();
    hass.states["weather.preview"].state = "unavailable";
    const card = await render({}, hass);
    expect(card.shadowRoot!.querySelector(".welcome-weather-primary")!.textContent).toBe("unavailable");
    delete hass.states["weather.preview"];
    card.hass = { ...hass };
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".welcome-weather-primary")!.textContent).toBe("Entity unavailable");
    expect(card.shadowRoot!.querySelector(".welcome-weather-secondary")).not.toBeNull();
  });

  it("uses Home Assistant's locale/time zone and refreshes the date without entity changes", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-21T23:59:30Z"));
    const hass = makeHass();
    hass.language = "nl";
    hass.config!.time_zone = "Europe/Amsterdam";
    const card = await render({}, hass);
    const expected = () => new Intl.DateTimeFormat("nl", { month: "short", day: "numeric", timeZone: "Europe/Amsterdam" }).format(new Date());
    expect(card.shadowRoot!.querySelector(".welcome-weather-primary")!.textContent).toBe("17,5°C");
    expect(card.shadowRoot!.querySelector(".welcome-weather-secondary")!.textContent).toBe(expected());
    const update = vi.spyOn(card, "requestUpdate");
    await vi.advanceTimersByTimeAsync(60_000);
    expect(update).toHaveBeenCalledOnce();
    await card.updateComplete;
    card.remove();
    update.mockClear();
    await vi.advanceTimersByTimeAsync(60_000);
    expect(update).not.toHaveBeenCalled();
  });

  it("exposes and round-trips all weather controls through the localized graphical editor", async () => {
    const config: AdditionConfig = { type, ulm_weather: "weather.preview", welcome_weather_icon_type: "icon", welcome_weather_icon: "mdi:umbrella" };
    const hass = makeHass();
    hass.language = "nl";
    const schema = editorSchemaFor(descriptor, config, hass);
    const fields = ["welcome_weather_icon_type", "welcome_weather_icon", "welcome_weather_primary_info",
      "welcome_weather_secondary_info", "welcome_weather_date_format", "welcome_weather_tap_action"];
    for (const field of fields) expect(schema.some(item => item.name === field), field).toBe(true);
    const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
    editor.hass = hass; editor.setConfig(config);
    document.body.append(editor); await editor.updateComplete;
    const forms = [...editor.shadowRoot!.querySelectorAll<HTMLElement & {
      schema: EditorField[]; data: AdditionConfig; computeLabel: (schema: { name: string }) => string;
    }>("ha-form")];
    const form = forms.find(item => item.schema.some(field => field.name === "welcome_weather_primary_info"))!;
    expect(form.computeLabel({ name: "welcome_weather_primary_info" }))
      .toBe(`${localize(hass, "ulm_weather")}: ${localize(hass, "primary_info")}`);
    expect(form.data.welcome_weather_primary_info).toBe("temperature");
    expect(form.data.welcome_weather_secondary_info).toBe("date");
    const changed = vi.fn();
    editor.addEventListener("config-changed", changed);
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { ...form.data, welcome_weather_primary_info: "state" } } }));
    expect(changed.mock.calls.at(-1)![0].detail.config).toMatchObject({
      ulm_weather: "weather.preview", welcome_weather_icon: "mdi:umbrella", welcome_weather_primary_info: "state",
    });
  });
});
