import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { swedishHelpers, swedishLabels } from "../src/translations/sv";

const installedWithout = (catalog: Record<string, string>, additions: Record<string, string>) =>
  Object.fromEntries(Object.entries(catalog).filter(([key]) => !Object.hasOwn(additions, key)));

const catalogs = [
  [translationCatalogs.en, installedWithout(translationCatalogs.sv, swedishLabels), swedishLabels,
    773, "c608541448090a85655fce7f7387f8c3043b2d43842ef9c937c58b5b03555684"],
  [englishHelpers, installedWithout(helperCatalogs.sv, swedishHelpers), swedishHelpers,
    558, "3dfb4ae661a652789ac56e25e80ea848e1309478d5016e26f8e59c9fdac0a8b5"],
] as const;

const numericLiterals = (text: string) => (text.match(/-?\d+(?:\.\d+)?/g) ?? []).sort();
const rawLiterals = (text: string) =>
  (text.match(/\$[A-Za-z_][\w]*|https?:\/\/[^\s]+|\b(?:[A-Za-z_][\w-]*\.)+[A-Za-z_][\w-]*\b/g) ?? [])
    .map(value => value.replace(/[.,;:)]+$/, ""));

describe("complete Swedish card localization", () => {
  it("fills exactly the missing inventory without changing installed entries", () => {
    expect(Object.keys(translationCatalogs.en)).toHaveLength(1189);
    expect(Object.keys(englishHelpers)).toHaveLength(559);
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

  it("preserves placeholders, numeric values and raw technical examples", () => {
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

  it("retains Swedish terminology and safety-critical behavior guidance", () => {
    expect(swedishLabels.primary_info).toBe("Primär information");
    expect(swedishLabels.secondary_info).toBe("Sekundär information");
    expect(swedishLabels.icon_type).toBe("Ikontyp");
    expect(swedishHelpers.remote_entity).toContain("aldrig");
    expect(swedishHelpers.remote_transport).toContain("remote.send_command");
    expect(swedishHelpers.pihole_metrics).toContain("ersätts aldrig med noll");
    expect(swedishHelpers.pihole_pause_service).toContain("aldrig");
    expect(swedishHelpers.ulm_card_media_player_power_button).toContain("bryter inte");
    expect(swedishHelpers.upcoming_text_template).toContain("$empty");
    expect(swedishHelpers.upcoming_hide_empty).toContain("tydligt fel");
  });
});
