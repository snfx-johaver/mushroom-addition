import type { AdditionConfig, HomeAssistant } from "../types";
import type { ConfigInput } from "./types";
import type { EditorField } from "../editor-schema";
import { I18n } from "./internationalization";
import { resolveLanguage } from "./internationalization/resolveLanguage";
import { SUPPORTED_LOCALES } from "../localize";

export type WeatherAdvancedOptions = Omit<ConfigInput, "type" | "entity" | "name" | "tap_action" | "hold_action" | "double_tap_action">;
type Option = { field: EditorField; value?: string | number | boolean };
const boolean = (name: keyof WeatherAdvancedOptions, value: boolean): Option => ({ field: { name, selector: { boolean: {} } }, value });
const text = (name: keyof WeatherAdvancedOptions): Option => ({ field: { name, selector: { text: { ...(name === "styles" ? { multiline: true } : {}) } } } });
const number = (name: keyof WeatherAdvancedOptions, min: number, max: number, step: number, value?: number): Option =>
  ({ field: { name, selector: { number: { min, max, step, mode: "box" } } }, value });
const select = (name: keyof WeatherAdvancedOptions, options: string[], value: string): Option =>
  ({ field: { name, selector: { select: { mode: "dropdown", options } } }, value });
const sensor = (name: keyof WeatherAdvancedOptions): Option => ({ field: { name, selector: { entity: { domain: ["sensor"] } } } });

export const WEATHER_OPTIONS = {
  appearance: [
    select("layout", ["default", "minimal"], "default"),
    number("height", 50, 800, 1),
    select("visual_style", ["modern", "classic"], "modern"),
    select("animation_quality", ["high", "medium", "low"], "medium"),
    boolean("show_animations", true), boolean("show_aurora", false),
    boolean("show_raindrops", true), boolean("show_wind_effects", true),
    number("overlay_opacity", 0, 1, 0.05, 0.35),
    number("text_shadow", 0, 3, 0.1, 1), text("text_color"),
    number("border_radius", 0, 50, 1),
    number("sun_position_x", 0, 100, 1), number("sun_position_y", 0, 100, 1),
    text("styles"),
  ],
  details: [
    boolean("show_feels_like", true), boolean("show_min_temp", true),
    boolean("show_humidity", true), boolean("show_pressure", false),
    boolean("show_uv_index", false), boolean("show_dew_point", false),
    boolean("show_sunrise_sunset", true), boolean("show_precipitation_outlook", false),
    boolean("show_wind", true), boolean("show_wind_gust", true), boolean("show_wind_direction", true),
    select("wind_speed_unit", ["auto", "ms", "kmh", "mph", "kn"], "auto"),
  ],
  forecast: [
    boolean("show_hourly_forecast", false), number("hourly_forecast_hours", 1, 168, 1, 5),
    number("hourly_forecast_step", 1, 12, 1, 1), text("hourly_forecast_title"),
    boolean("hourly_forecast_chart", false), boolean("show_daily_forecast", false),
    number("daily_forecast_days", 1, 14, 1, 5), text("daily_forecast_title"),
    boolean("show_temperature_bars", false), boolean("show_forecast_wind", false),
    boolean("show_forecast_description", false),
  ],
  clock: [
    select("language", ["auto", ...SUPPORTED_LOCALES, "et", "pt", "zh"], "auto"),
    boolean("show_clock", false), boolean("show_date", false),
    select("clock_position", ["top", "details"], "top"),
    select("clock_format", ["24h", "12h"], "24h"),
    select("clock_size", ["small", "medium", "large"], "medium"),
    select("clock_weight", ["thin", "regular", "bold"], "regular"),
  ],
  sensors: [
    sensor("temperature_entity"), sensor("feels_like_entity"), sensor("humidity_entity"),
    sensor("wind_speed_entity"), sensor("wind_gust_entity"), sensor("wind_bearing_entity"),
    sensor("precipitation_entity"), sensor("pressure_entity"), sensor("uv_index_entity"),
    sensor("dew_point_entity"), sensor("aqi_entity"), sensor("sunrise_entity"), sensor("sunset_entity"),
    text("templow_attribute"),
  ],
} satisfies Record<string, Option[]>;

export const weatherDefaults = Object.fromEntries(
  Object.values(WEATHER_OPTIONS).flat().filter(option => option.value !== undefined)
    .map(option => [option.field.name, option.value]),
) as WeatherAdvancedOptions;

export function validateWeatherOptions(options?: WeatherAdvancedOptions): void {
  if (options === undefined) return;
  if (!options || typeof options !== "object" || Array.isArray(options)) throw new Error("Weather options must be an object.");
  for (const { field } of Object.values(WEATHER_OPTIONS).flat()) {
    const value = options[field.name as keyof WeatherAdvancedOptions];
    if (value === undefined) continue;
    const selector = field.selector!;
    if ("boolean" in selector && typeof value !== "boolean") throw new Error(`${field.name} must be a boolean.`);
    if ("number" in selector) {
      const bounds = selector.number as { min: number; max: number; step: number };
      if (typeof value !== "number" || !Number.isFinite(value) || value < bounds.min || value > bounds.max ||
          bounds.step === 1 && !Number.isInteger(value)) throw new Error(`${field.name} must be between ${bounds.min} and ${bounds.max}.`);
    }
    if ("select" in selector && !(selector.select as { options: unknown[] }).options.includes(value)) {
      throw new Error(`Unsupported ${field.name}: ${String(value)}.`);
    }
    if (("text" in selector || "entity" in selector) && typeof value !== "string") throw new Error(`${field.name} must be text.`);
    if ("entity" in selector && value && !/^sensor\.[a-z0-9_]+$/.test(String(value))) throw new Error(`${field.name} must be a sensor entity.`);
  }
}

export function weatherStub(hass?: HomeAssistant, entities: string[] = [], fallback: string[] = []): AdditionConfig {
  const candidates = [...new Set([...entities, ...fallback, ...Object.keys(hass?.states ?? {})])];
  const weather = candidates.filter(id => id.startsWith("weather."));
  const entity = weather.find(id => hass?.states[id] && !["unknown", "unavailable"].includes(hass.states[id].state))
    ?? weather[0] ?? "weather.home";
  return { type: "custom:mushroom-addition-weather-advanced", name: "Weather Advanced", entity,
    weather: { show_hourly_forecast: true, show_daily_forecast: true } };
}

export function weatherLabels(hass?: HomeAssistant): I18n {
  const labels = new I18n();
  labels.setLanguage(resolveLanguage({ hassLang: hass?.language }));
  return labels;
}
