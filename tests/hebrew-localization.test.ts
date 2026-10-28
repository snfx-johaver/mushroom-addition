import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, localeDirection, translationCatalogs } from "../src/localize";
import { nativeDiagnosticCatalogs } from "../src/native-diagnostics";
import { placeholders } from "../src/translation-coverage";
import { hebrewHelpers, hebrewLabels } from "../src/translations/he";

type Catalog = Record<string, string>;
const withoutAdditions = (installed: Catalog, additions: Catalog): Catalog =>
  Object.fromEntries(Object.entries(installed).filter(([key]) => !(key in additions)));
const missing = (english: Catalog, baseline: Catalog) =>
  Object.keys(english).filter(key => !(key in baseline)).sort();
const fingerprint = (catalog: Catalog) => createHash("sha256")
  .update(JSON.stringify(Object.entries(catalog).sort(([a], [b]) => a.localeCompare(b, "en"))))
  .digest("hex");

// Excluding this module's keys keeps the same inventory before and after central wiring.
const baselineLabels = withoutAdditions(translationCatalogs.he, hebrewLabels);
const baselineHelpers = withoutAdditions(helperCatalogs.he, hebrewHelpers);
const labels = { ...baselineLabels, ...hebrewLabels };
const helpers = { ...baselineHelpers, ...hebrewHelpers };
const additions = [
  [hebrewLabels, translationCatalogs.en],
  [hebrewHelpers, englishHelpers],
] as const;
const rawLiterals = (text: string) =>
  (text.match(/https?:\/\/[^\s]+|\$[a-zA-Z_]\w*|\b[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+\b|\b[a-z]+(?:_[a-z0-9]+)+\b/g) ?? [])
    .map(literal => literal.replace(/[.,;:]$/, ""));
const numbers = (text: string) => (text.match(/-?\d+(?:\.\d+)?/g) ?? []).sort();

describe("complete original Hebrew localization", () => {
  it("adds exactly the missing labels and helpers without replacing shared translations", () => {
    expect(Object.keys(hebrewLabels).sort()).toEqual(missing(translationCatalogs.en, baselineLabels));
    expect(Object.keys(hebrewHelpers).sort()).toEqual(missing(englishHelpers, baselineHelpers));
    expect(Object.keys(hebrewLabels)).toHaveLength(764);
    expect(Object.keys(hebrewHelpers)).toHaveLength(549);
    expect(Object.keys(baselineLabels)).toHaveLength(416);
    expect(Object.keys(baselineHelpers)).toHaveLength(1);
    expect(Object.keys(labels).sort()).toEqual(Object.keys(translationCatalogs.en).sort());
    expect(Object.keys(helpers).sort()).toEqual(Object.keys(englishHelpers).sort());
    expect(Object.keys(hebrewLabels).some(key => key.startsWith("ui.graph."))).toBe(false);
  });

  it("derives the identical missing inventory with or without central wiring", () => {
    for (const [english, baseline, extra] of [
      [translationCatalogs.en, baselineLabels, hebrewLabels],
      [englishHelpers, baselineHelpers, hebrewHelpers],
    ]) {
      const before = withoutAdditions(baseline, extra);
      const after = withoutAdditions({ ...baseline, ...extra }, extra);
      expect(missing(english, before)).toEqual(Object.keys(extra).sort());
      expect(missing(english, after)).toEqual(missing(english, before));
    }
  });

  it("preserves every installed Hebrew label and the installed helper verbatim", () => {
    expect(fingerprint(baselineLabels)).toBe("bcc87eaa98fe850726bff861942bf3915c938ff4ec7f7c52fffe184338cc5d53");
    expect(fingerprint(baselineHelpers)).toBe("1673154b190f37dbf1fc0413e32f04c2a31614e10ea20e29ecfff1c1d467638c");
    for (const [key, text] of Object.entries(baselineLabels)) expect(labels[key], key).toBe(text);
    for (const [key, text] of Object.entries(baselineHelpers)) expect(helpers[key], key).toBe(text);
  });

  it("covers the strict 1736 entries, including the six existing native diagnostics", () => {
    expect(Object.keys(translationCatalogs.en)).toHaveLength(1180);
    expect(Object.keys(englishHelpers)).toHaveLength(550);
    expect(Object.keys(nativeDiagnosticCatalogs.en)).toHaveLength(6);
    expect(Object.keys(nativeDiagnosticCatalogs.he).sort()).toEqual(Object.keys(nativeDiagnosticCatalogs.en).sort());
    expect(Object.keys(labels).length + Object.keys(helpers).length + Object.keys(nativeDiagnosticCatalogs.he).length).toBe(1736);
    for (const [english, hebrew] of [
      [translationCatalogs.en, labels],
      [englishHelpers, helpers],
      [nativeDiagnosticCatalogs.en, nativeDiagnosticCatalogs.he],
    ]) {
      for (const [key, original] of Object.entries(english)) {
        expect(hebrew[key]?.trim(), key).toBeTruthy();
        expect(placeholders(hebrew[key]), key).toEqual(placeholders(original));
      }
    }
    expect(localeDirection("he")).toBe("rtl");
  });

  it("uses Hebrew rather than English filler, apart from standard hardware abbreviations", () => {
    const abbreviations = new Set(["ui.renderer.CPU", "ui.renderer.RAM"]);
    for (const [hebrew, english] of additions) {
      for (const [key, text] of Object.entries(hebrew)) {
        expect(text.trim(), key).toBe(text);
        if (abbreviations.has(key)) {
          expect(text, key).toBe(english[key]);
        } else {
          expect(text, key).toMatch(/[\u05d0-\u05ea]/u);
          expect(text, key).not.toBe(english[key]);
        }
        expect(text, key).not.toMatch(/\b(?:TODO|FIXME|Default:)\b/);
      }
    }
  });

  it("preserves placeholders, raw configuration and service literals, and every number", () => {
    for (const [hebrew, english] of additions) {
      for (const [key, text] of Object.entries(hebrew)) {
        expect(placeholders(text), key).toEqual(placeholders(english[key]));
        expect(numbers(text), key).toEqual(numbers(english[key]));
        for (const literal of rawLiterals(english[key])) expect(text, `${key}: ${literal}`).toContain(literal);
      }
    }
    for (const token of ["data"]) expect(hebrewHelpers.upcoming_data_attribute).toContain(token);
    for (const token of ["flag = true"]) expect(hebrewHelpers.upcoming_group_value).toContain(token);
    for (const token of ["dd", "mm", "yy", "yyyy"]) expect(hebrewHelpers.upcoming_date_format).toContain(token);
    expect(hebrewHelpers.upcoming_text_template).toContain("$empty");
    expect(hebrewHelpers.upcoming_url).toContain("https://www.themoviedb.org/tv/$tmdb_id");
    for (const token of ["play_media", "send_key", "remote.send_command"]) {
      expect(hebrewHelpers.remote_transport).toContain(token);
    }
    for (const token of ["label", "entity_id", "type", "CSS"]) expect(hebrewHelpers.cartridges).toContain(token);
    for (const token of ["Closed", "Tilted", "Open"]) expect(hebrewHelpers.ulm_custom_card_window_handle).toContain(token);
    for (const token of ["wireless", "AC", "USB", "charging"]) {
      expect(hebrewHelpers.ulm_card_battery_charger_type_entity_id).toContain(token);
    }
    expect(hebrewLabels["ui.runtime_use_playlist_for_spotify_playlist_ids_or_another_media_type_supported_by_your_player_c0de82c4"]).toContain("playlist");
    expect(hebrewHelpers.ulm_button_service).toContain("domain.service");
    expect(hebrewHelpers.ulm_card_welcome_collapse).toContain("input_boolean");
    expect(hebrewLabels["ui.area.attribute_help"]).toContain("brightness");
    expect(hebrewLabels["ui.area.attribute_help"]).toContain("battery_level");
    expect(hebrewHelpers.lower_bound).toContain("~20");
    expect(hebrewHelpers.upper_bound).toContain("~25");
  });

  it("retains defaults, inclusive thresholds and energy import/export direction", () => {
    for (const [key, text] of Object.entries(hebrewHelpers)) {
      if (englishHelpers[key].includes("Default:")) expect(text, key).toContain("ברירת מחדל:");
    }
    expect(hebrewHelpers.battery_warning_threshold).toContain("50%");
    expect(hebrewHelpers.battery_low_threshold).toContain("20%");
    expect(hebrewHelpers.battery_critical_threshold).toContain("10%");
    expect(hebrewHelpers.battery_critical_threshold).toContain("או מתחתיו");
    expect(hebrewHelpers.battery_healthy_color).toContain("ירוק");
    expect(hebrewHelpers.battery_warning_color).toContain("צהוב");
    expect(hebrewHelpers.battery_low_color).toContain("כתום");
    expect(hebrewHelpers.battery_critical_color).toContain("אדום");
    expect(hebrewHelpers.price_critical_threshold).toContain("או גבוהים ממנו");
    expect(hebrewHelpers.energy_grid_import_label).toContain("צריכת חשמל מהרשת");
    expect(hebrewHelpers.energy_grid_export_label).toContain("הזרמת חשמל לרשת");
    expect(hebrewHelpers.buy_sell_trade_efficiency).toContain("לאחר הפסדי האחסון");
  });

  it("keeps safety caveats, action distinctions and Mushroom terminology meaningful", () => {
    expect(hebrewLabels.icon_type).toBe("סוג צלמית");
    expect(hebrewLabels.use_entity_picture).toBe("השתמש בתמונת הישות");
    expect(hebrewLabels.media_controls).toBe("שליטה במדיה");
    expect(hebrewLabels["ui.area.kind_template"]).toBe("תבנית");
    expect(hebrewHelpers.pihole_pause_service).toContain("לעולם אינה מוחלפת בכיבוי קבוע");
    expect(hebrewHelpers.pihole_metrics).toContain("לעולם אינם מוחלפים באפס");
    expect(hebrewHelpers.remote_entity).toContain("לעולם לא נשלחות פקודות לשלט של חדר לא קשור");
    expect(hebrewHelpers.upcoming_text_template).toContain("לא מורץ קוד JavaScript, HTML או Jinja");
    expect(hebrewHelpers.upcoming_trailers).toContain("שום קדימון אינו נטען אוטומטית");
    expect(hebrewHelpers.ulm_card_media_player_power_button).toContain("אינה מנתקת חשמל מהרמקול");
    expect(hebrewLabels["ui.area.tap"]).toBe("התנהגות בלחיצה");
    expect(hebrewLabels["ui.area.hold"]).toBe("התנהגות בלחיצה ממושכת");
    expect(hebrewLabels["ui.area.double_tap"]).toBe("התנהגות בלחיצה כפולה");
    expect(hebrewLabels["ui.renderer.Median"]).toBe("חציון");
    expect(hebrewLabels["ui.renderer.Difference"]).toBe("הפרש");
  });
});
