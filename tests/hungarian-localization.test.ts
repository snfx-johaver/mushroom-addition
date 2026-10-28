import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { hungarianHelpers, hungarianLabels } from "../src/translations/hu";

const installedWithout = (catalog: Record<string, string>, additions: Record<string, string>) =>
  Object.fromEntries(Object.entries(catalog).filter(([key]) => !Object.hasOwn(additions, key)));
const catalogs = [
  [translationCatalogs.en, installedWithout(translationCatalogs.hu, hungarianLabels), hungarianLabels,
    771, "8199192c5ac6d30c24bc0852db6488c3de67f7bf44b695393199b77e5f2c4198"],
  [englishHelpers, installedWithout(helperCatalogs.hu, hungarianHelpers), hungarianHelpers,
    556, "199816e1c2dff6288b9cf3ac69a67da7d074d9d00ce79356c7683840fb537f79"],
] as const;
const numericLiterals = (text: string) => (text.match(/-?\d+(?:\.\d+)?/g) ?? []).sort();
const rawLiterals = (text: string) =>
  (text.match(/\$[A-Za-z_][\w]*|https?:\/\/[^\s]+|\b(?:[A-Za-z_][\w-]*\.)+[A-Za-z_][\w-]*\b/g) ?? [])
    .map(value => value.replace(/[.,;:)]+$/, ""));

describe("complete Hungarian card localization", () => {
  it("fills exactly the missing inventory without changing installed entries", () => {
    expect(Object.keys(translationCatalogs.en)).toHaveLength(1187);
    expect(Object.keys(englishHelpers)).toHaveLength(557);
    for (const [english, installed, additions, count, fingerprint] of catalogs) {
      expect(Object.keys(additions)).toHaveLength(count);
      expect(Object.keys(additions).sort())
        .toEqual(Object.keys(english).filter(key => !Object.hasOwn(installed, key)).sort());
      expect(createHash("sha256")
        .update(JSON.stringify(Object.entries(installed).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)))
        .digest("hex")).toBe(fingerprint);
      const combined = { ...installed, ...additions };
      expect(Object.keys(combined).sort()).toEqual(Object.keys(english).sort());
      for (const [key, value] of Object.entries(installed)) expect(combined[key], key).toBe(value);
    }
  });

  it("preserves placeholders, numbers and technical examples", () => {
    for (const [english, , additions] of catalogs) {
      for (const [key, value] of Object.entries(additions)) {
        expect(value.trim(), key).toBeTruthy();
        expect(value, key).not.toMatch(/\b(?:TODO|FIXME|untranslated)\b/);
        expect(placeholders(value), key).toEqual(placeholders(english[key]));
        expect(numericLiterals(value), key).toEqual(numericLiterals(english[key]));
        for (const literal of rawLiterals(english[key])) expect(value, key).toContain(literal);
      }
    }
  });

  it("uses Hungarian terminology and retains important operational warnings", () => {
    expect(hungarianLabels.primary_info).toBe("Elsődleges információ");
    expect(hungarianLabels.secondary_info).toBe("Másodlagos információ");
    expect(hungarianLabels["ui.renderer.Next track"]).toBe("Következő szám");
    expect(hungarianLabels["ui.area.kind_template"]).toBe("Sablon");
    expect(hungarianHelpers.remote_entity).toContain("Soha nem küld");
    expect(hungarianHelpers.pihole_metrics).toContain("soha nem helyettesít nullával");
    expect(hungarianHelpers.pihole_pause_service).toContain("soha nem vált");
    expect(hungarianHelpers.ulm_card_media_player_power_button).toContain("nem áramtalanítja");
    expect(hungarianHelpers.upcoming_hide_empty).toContain("egyértelmű hibát");
    expect(hungarianHelpers.upcoming_text_template).toContain("$empty");
  });
});
