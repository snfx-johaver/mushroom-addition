import { localizeText, SUPPORTED_LOCALES, translationCatalogs, type SupportedLocale } from "../../localize";
import { optionTranslations } from "../../translations/options";
import { translations as existing, type SupportedLanguage as ExistingLanguage } from "./locales.generated";
import { extraWeatherTranslations } from "./extra";
import { extraWeatherHelp } from "./extra-help";
import type { Translation } from "./types";

export type SupportedLanguage = SupportedLocale | ExistingLanguage;
const labels = new Map([
  ...Object.values(translationCatalogs.en), ...Object.values(optionTranslations.en),
].map(text => [text.toLowerCase(), text]));
const sensorLabels: Record<string, string> = {
  sunrise_entity: "Sunrise", sunset_entity: "Sunset", feels_like_entity: "Feels like",
  wind_speed_entity: "Wind speed", wind_gust_entity: "Gusts", wind_bearing_entity: "Wind bearing",
  precipitation_entity: "Precipitation", pressure_entity: "Pressure", uv_index_entity: "UV index",
  dew_point_entity: "Dew point", aqi_entity: "Air quality index",
};
const invariantLabels: Record<string, string> = {
  "km/h": "km/h", "m/s": "m/s", mph: "mph", knots: "kn", "ft/s": "ft/s", AM: "AM", PM: "PM",
  "12-hour (AM/PM)": "12 h (AM/PM)", "24-hour": "24 h",
  "Custom CSS": "CSS",
};

function translatedText(locale: SupportedLocale, text: string): string {
  const extra = { ...extraWeatherTranslations[locale], ...extraWeatherHelp[locale] };
  const match = Object.keys(extra).find(key => key.slice("ui.release.".length).toLowerCase() === text.toLowerCase());
  if (match) return extra[match];
  if (invariantLabels[text]) return invariantLabels[text];
  const shared = labels.get(text.toLowerCase());
  if (shared) return localizeText({ language: locale, states: {}, callService: async () => undefined }, shared);
  throw new Error(`Missing ${locale} weather translation: ${text}`);
}

function completeLocale(locale: SupportedLocale): Translation {
  const source = locale === "zh-Hans" ? existing.zh : existing[locale as ExistingLanguage];
  const hass = { language: locale, states: {}, callService: async () => undefined };
  if (source) return { ...source, editor: {
    ...source.editor,
    templow_attribute: `${source.editor.show_min_temp}: ${localizeText(hass, "Entity attribute")}`,
  } };
  const t = (text: string) => translatedText(locale, text);
  const editor = { ...existing.en.editor };
  for (const [key, text] of Object.entries(existing.en.editor)) {
    let value: string;
    if (key.startsWith("language_")) {
      value = key === "language_auto" ? t("Automatic")
        : new Intl.DisplayNames([locale], { type: "language" }).of(key.slice(9)) ?? key.slice(9);
    } else value = sensorLabels[key] ? `${t(sensorLabels[key])}: ${t("Sensor")}` : t(text);
    Object.assign(editor, { [key]: value });
  }
  editor.templow_attribute = t("Minimum temperature attribute");
  return {
    ...existing.en,
    ...Object.fromEntries(Object.entries(existing.en).filter(([, value]) => typeof value === "string")
      .map(([key, value]) => [key, t(value as string)])),
    precipitation_outlook: Object.fromEntries(Object.entries(existing.en.precipitation_outlook!)
      .map(([key, text]) => [key, t(key === "storm" ? "Thunderstorm" : text)])) as Translation["precipitation_outlook"],
    editor,
  };
}

export const translations: Record<SupportedLanguage, Translation> = {
  ...existing,
  ...Object.fromEntries(SUPPORTED_LOCALES.map(locale => [locale, completeLocale(locale)])) as Record<SupportedLocale, Translation>,
};
