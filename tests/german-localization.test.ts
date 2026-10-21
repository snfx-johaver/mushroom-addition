import { describe, expect, it } from "vitest";
import { localize, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { germanLabels } from "../src/translations/de";
import type { HomeAssistant } from "../src/types";

describe("German card and editor labels", () => {
  it("covers every English label without registering unknown keys or losing placeholders", () => {
    expect(Object.keys(translationCatalogs.de).sort()).toEqual(Object.keys(translationCatalogs.en).sort());
    for (const [key, original] of Object.entries(translationCatalogs.en)) {
      expect(translationCatalogs.de[key]?.trim(), key).toBeTruthy();
      expect(placeholders(translationCatalogs.de[key]), key).toEqual(placeholders(original));
    }
    for (const [key, translated] of Object.entries(germanLabels)) {
      expect(translationCatalogs.en[key], key).toBeDefined();
      expect(translated, key).not.toBe(translationCatalogs.en[key]);
    }
  });

  it("uses home-automation meanings rather than unrelated dictionary senses", () => {
    const hass: HomeAssistant = { language: "de", states: {}, callService: async () => undefined };
    expect(localize(hass, "collapse_entity")).toBe("Hilfsentität zum Einklappen");
    expect(localize(hass, "room_part_name")).toBe("Entitätsname");
    expect(localize(hass, "room_part_state")).toBe("Zustand (ein/aus usw.)");
    expect(localize(hass, "room_status_inactive")).toBe("Inaktiv");
    expect(localize(hass, "ulm_custom_card_washer_pause_action")).toBe("Pausenaktion");
    expect(localize(hass, "tariff_markup_entity")).toBe("Tarifaufschlag");
    expect(localize(hass, "group_windows")).toBe("Fenstergruppe");
  });
});
