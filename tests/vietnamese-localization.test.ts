import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { nativeDiagnosticCatalogs } from "../src/native-diagnostics";
import { placeholders } from "../src/translation-coverage";
import { graphErrorTranslations } from "../src/translations/graph-errors";
import { vietnameseHelpers, vietnameseLabels } from "../src/translations/vi";

const installedWithout = (catalog: Record<string, string>, additions: Record<string, string>) =>
  Object.fromEntries(Object.entries(catalog).filter(([key]) => !Object.hasOwn(additions, key)));

const installedLabels = installedWithout(translationCatalogs.vi, vietnameseLabels);
const installedHelpers = installedWithout(helperCatalogs.vi, vietnameseHelpers);
const labelCatalogs = [
  [translationCatalogs.en, installedLabels, vietnameseLabels],
  [englishHelpers, installedHelpers, vietnameseHelpers],
] as const;

const numericLiterals = (text: string) => (text.match(/-?\d+(?:\.\d+)?/g) ?? []).sort();
const fingerprint = (catalog: Record<string, string>) =>
  createHash("sha256")
    .update(JSON.stringify(Object.entries(catalog).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)))
    .digest("hex");
const rawLiterals = (text: string): string[] => {
  const matches = [
    ...text.matchAll(/\$[A-Za-z_][\w]*/g),
    ...text.matchAll(/https?:\/\/[^\s]+/g),
    ...text.matchAll(/\b(?:[A-Za-z_][\w-]*\.)+[A-Za-z_][\w-]*\b/g),
    ...text.matchAll(/\b\d+(?:\.\d+)?(?:%|s|m|h|d|px|kWh|kW|W)?\b/g),
  ];
  return [...new Set(matches.map(match => match[0].replace(/[.,;:)]+$/, "")))].sort();
};

const acceptedUnchangedTerms = new Set([
  "ui.renderer.CPU",
  "ui.renderer.Ping",
  "ui.renderer.RAM",
]);

describe("complete Vietnamese card localization", () => {
  it("adds exactly the missing inventory before and after catalog wiring", () => {
    expect(Object.keys(translationCatalogs.en)).toHaveLength(1183);
    expect(Object.keys(englishHelpers)).toHaveLength(553);
    expect(Object.keys(nativeDiagnosticCatalogs.en)).toHaveLength(6);
    expect(Object.keys(translationCatalogs.en).length + Object.keys(englishHelpers).length + 6).toBe(1742);
    expect(Object.keys(installedLabels)).toHaveLength(416);
    expect(Object.keys(installedHelpers)).toHaveLength(1);
    expect(Object.keys(vietnameseLabels)).toHaveLength(767);
    expect(Object.keys(vietnameseHelpers)).toHaveLength(552);
    expect(fingerprint(installedLabels)).toBe("6db737bf3546397e8f1712f3758dd9ed0bfdb2b0835e560a9b9e1ae58bdda8d3");
    expect(fingerprint(installedHelpers)).toBe("e9b991363034f3894e5bd1a4d6add7697ff4797a7a2be84518b9ce784730523e");

    for (const [english, installed, additions] of labelCatalogs) {
      const missingBeforeWiring = Object.keys(english)
        .filter(key => !Object.hasOwn(installed, key))
        .sort();
      expect(Object.keys(additions).sort()).toEqual(missingBeforeWiring);

      const afterWiring = { ...installed, ...additions };
      expect(Object.keys(afterWiring).sort()).toEqual(Object.keys(english).sort());
      for (const [key, value] of Object.entries(installed)) {
        expect(afterWiring[key], key).toBe(value);
      }
    }
  });

  it("provides natural Vietnamese text and preserves every placeholder and literal", () => {
    for (const [english, installed, additions] of labelCatalogs) {
      const complete = { ...installed, ...additions };
      for (const [key, original] of Object.entries(english)) {
        expect(complete[key]?.trim(), key).toBeTruthy();
        expect(placeholders(complete[key]), key).toEqual(placeholders(original));
        expect(numericLiterals(complete[key]), key).toEqual(numericLiterals(original));
        expect(rawLiterals(complete[key]), key).toEqual(rawLiterals(original));
      }

      for (const [key, translated] of Object.entries(additions)) {
        expect(english[key], key).toBeDefined();
        expect(translated.trim(), key).not.toMatch(/\b(?:TODO|FIXME|untranslated)\b/i);
        if (!acceptedUnchangedTerms.has(key)) expect(translated, key).not.toBe(english[key]);
      }
    }
  });

  it("uses Mushroom's Vietnamese terminology and retains important behavior guidance", () => {
    expect(Object.keys(vietnameseLabels).filter(key => key.startsWith("ui.graph."))).toEqual([]);
    expect(Object.keys(translationCatalogs.vi).filter(key => key.startsWith("ui.graph.")))
      .toEqual(Object.keys(graphErrorTranslations.vi));
    expect(Object.keys(nativeDiagnosticCatalogs.vi)).toEqual(Object.keys(nativeDiagnosticCatalogs.en));
    for (const [key, value] of Object.entries(nativeDiagnosticCatalogs.vi)) {
      expect(value.trim(), key).toBeTruthy();
      expect(placeholders(value), key).toEqual(placeholders(nativeDiagnosticCatalogs.en[key]));
      expect(vietnameseLabels).not.toHaveProperty(key);
      expect(vietnameseHelpers).not.toHaveProperty(key);
    }
    expect(translationCatalogs.vi.entity).toBe("Thực thể");
    expect(vietnameseLabels["ui.area.feature"]).toContain("Khu vực");
    expect(translationCatalogs.vi.icon).toBe("Biểu tượng");
    expect(vietnameseLabels.secondary_info).toBe("Thông tin phụ");
    expect(vietnameseLabels["ui.area.feature"]).toBe("Tính năng điều khiển Khu vực {number}");
    expect(vietnameseLabels["ui.area.attribute_help"]).toContain("brightness");
    expect(vietnameseLabels["ui.area.attribute_help"]).toContain("battery_level");
    expect(vietnameseLabels["ui.runtime_select_panel_sensors_in_the_card_editor_or_add_sensors_with_entity_ids_beginning_with_sensor_inverter_4_1ba7d684"])
      .toContain("sensor.inverter_4");
    expect(vietnameseHelpers.upcoming_text_template).toContain("$title");
    expect(vietnameseHelpers.upcoming_text_template).toContain("$empty");
    expect(vietnameseHelpers.upcoming_url).toContain("https://www.themoviedb.org/tv/$tmdb_id");
    expect(vietnameseHelpers.upcoming_url).toContain("HTTP(S)");
    expect(vietnameseHelpers.upcoming_group_value).toContain("flag = true");
    expect(vietnameseHelpers.upcoming_date_format).toContain("dd, mm, yy");
    expect(vietnameseHelpers.upcoming_date_format).toContain("yyyy");
    expect(vietnameseHelpers.remote_transport).toContain("remote.send_command");
    expect(vietnameseHelpers.remote_transport).toContain("play_media / send_key");
    expect(vietnameseHelpers.remote_transport).toContain("Samsung");
    expect(vietnameseHelpers.remote_double_tap).toContain("Select");
    expect(vietnameseHelpers.pihole_pause_durations).toContain("30s, 5m, 1h30m");
    expect(vietnameseHelpers.pihole_pause_durations).toContain("1h:30m:15s");
    expect(vietnameseHelpers.pihole_pause_service).toContain("không bao giờ chuyển thành tắt công tắc vĩnh viễn");
    expect(vietnameseHelpers.pihole_metrics).toContain("không bao giờ được thay bằng không");
    expect(vietnameseHelpers.remote_entity).toContain("Không bao giờ gửi lệnh");
    expect(vietnameseHelpers.ulm_card_media_player_enable_volume_adjust).toContain("0.05 = 5%");
  });
});
