import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { catalanHelpers, catalanLabels } from "../src/translations/ca";

const installedWithout = (catalog: Record<string, string>, additions: Record<string, string>) =>
  Object.fromEntries(Object.entries(catalog).filter(([key]) => !Object.hasOwn(additions, key)));
const catalogs = [
  [translationCatalogs.en, installedWithout(translationCatalogs.ca, catalanLabels), catalanLabels,
    782, "a5b04537fa24d652007a15e49d4216dc7d4828da6374ec506eb30fe09298832b"],
  [englishHelpers, installedWithout(helperCatalogs.ca, catalanHelpers), catalanHelpers,
    567, "e6556fbb68dfebb0b868bac75ca7f0d611c2f9b5195365931a1bb8bd79c21b95"],
] as const;
const numericLiterals = (text: string) => (text.match(/-?\d+(?:\.\d+)?/g) ?? []).sort();
const rawLiterals = (text: string) =>
  (text.match(/\$[A-Za-z_][\w]*|https?:\/\/[^\s]+|\b(?:[A-Za-z_][\w-]*\.)+[A-Za-z_][\w-]*\b/g) ?? [])
    .map(value => value.replace(/[.,;:)]+$/, ""));

describe("complete Catalan card localization", () => {
  it("fills exactly the missing inventory while preserving installed entries", () => {
    expect(Object.keys(translationCatalogs.en)).toHaveLength(1198);
    expect(Object.keys(englishHelpers)).toHaveLength(568);
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

  it("uses Catalan terminology and preserves operational warnings", () => {
    expect(catalanLabels.icon_type).toBe("Tipus d'icona");
    expect(catalanLabels.primary_info).toBe("Informació principal");
    expect(catalanLabels["ui.renderer.Next track"]).toBe("Pista següent");
    expect(catalanHelpers.remote_entity).toContain("Mai no envia");
    expect(catalanHelpers.pihole_metrics).toContain("mai no se substitueixen per zero");
    expect(catalanHelpers.pihole_pause_service).toContain("mai no es converteix");
    expect(catalanHelpers.ulm_card_media_player_power_button).toContain("no talla el corrent");
    expect(catalanHelpers.upcoming_hide_empty).toContain("error explícit");
    expect(catalanHelpers.upcoming_text_template).toContain("$empty");
  });
});
