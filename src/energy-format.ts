import type { HomeAssistant } from "./types";
import { normalizeLocale } from "./localize";

export function energyNumber(hass: HomeAssistant | undefined, value: number, options: Intl.NumberFormatOptions = {}): string {
  const format = hass?.locale?.number_format;
  const locales: Record<string, string> = {
    comma_decimal: "en-US", decimal_comma: "de-DE", space_comma: "fr-FR", quote_decimal: "de-CH",
  };
  const locale = locales[format ?? ""] ?? (format === "system" ? navigator.language : hass?.locale?.language || normalizeLocale(hass?.language));
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 2, ...(format === "none" ? { useGrouping: false } : {}), ...options }).format(value);
}

export function energyTime(hass: HomeAssistant | undefined, value: number, options: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat(hass?.locale?.language || normalizeLocale(hass?.language), {
    hour: "2-digit", minute: "2-digit", timeZone: hass?.config?.time_zone,
    ...(hass?.locale?.time_format === "12" ? { hour12: true } : hass?.locale?.time_format === "24" ? { hour12: false } : {}),
    ...options,
  }).format(value);
}
