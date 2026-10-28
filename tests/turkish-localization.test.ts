import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { turkishHelpers, turkishLabels } from "../src/translations/tr";

const rawLiterals = (value: string): string[] => {
  const matches = [
    ...value.matchAll(/\$[A-Za-z_][\w]*/g),
    ...value.matchAll(/https?:\/\/[^\s]+/g),
    ...value.matchAll(/\b(?:[A-Za-z_][\w-]*\.)+[A-Za-z_][\w-]*\b/g),
    ...value.matchAll(/\b\d+(?:\.\d+)?(?:%|s|m|h|d|px|kWh|kW|W)?\b/g),
  ];
  return [...new Set(matches.map(match => match[0].replace(/[.,;:)]+$/, "")))].sort();
};

const acceptedUnchangedTerms = new Set(["ui.renderer.CPU", "ui.renderer.Disk", "ui.renderer.Ping", "ui.renderer.RAM"]);

describe("complete Turkish label and helper supplement", () => {
  const installedLabels = Object.fromEntries(Object.entries(translationCatalogs.tr).filter(([key]) => !Object.hasOwn(turkishLabels, key)));
  const installedHelpers = Object.fromEntries(Object.entries(helperCatalogs.tr).filter(([key]) => !Object.hasOwn(turkishHelpers, key)));
  const missingLabels = Object.keys(translationCatalogs.en).filter(key => !Object.hasOwn(installedLabels, key));
  const missingHelpers = Object.keys(englishHelpers).filter(key => !Object.hasOwn(installedHelpers, key));
  const labels = { ...translationCatalogs.tr, ...turkishLabels };
  const helpers = { ...helperCatalogs.tr, ...turkishHelpers };

  it("fills exactly the missing keys without duplicating shared graph translations", () => {
    expect(Object.keys(turkishLabels).sort()).toEqual(missingLabels.sort());
    expect(Object.keys(turkishHelpers).sort()).toEqual(missingHelpers.sort());
    expect(Object.keys(turkishLabels)).toHaveLength(764);
    expect(Object.keys(turkishHelpers)).toHaveLength(549);
    expect(Object.keys(turkishLabels).filter(key => key.startsWith("ui.graph."))).toEqual([]);
    expect(Object.keys(labels).sort()).toEqual(Object.keys(translationCatalogs.en).sort());
    expect(Object.keys(helpers).sort()).toEqual(Object.keys(englishHelpers).sort());
  });

  it("preserves installed Turkish values and supplies translated, placeholder-safe text", () => {
    for (const [original, supplement, merged, english] of [
      [translationCatalogs.tr, turkishLabels, labels, translationCatalogs.en],
      [helperCatalogs.tr, turkishHelpers, helpers, englishHelpers],
    ]) {
      for (const [key, value] of Object.entries(original)) {
        expect(merged[key], key).toBe(value);
      }
      for (const [key, value] of Object.entries(supplement)) {
        expect(value.trim(), key).toBeTruthy();
        if (!acceptedUnchangedTerms.has(key)) expect(value, key).not.toBe(english[key]);
        expect(placeholders(value), key).toEqual(placeholders(english[key]));
        expect(rawLiterals(value), key).toEqual(rawLiterals(english[key]));
      }
      for (const [key, value] of Object.entries(english)) {
        expect(merged[key]?.trim(), key).toBeTruthy();
        expect(placeholders(merged[key]), key).toEqual(placeholders(value));
      }
    }
  });

  it("keeps important Turkish meanings and configuration examples intact", () => {
    expect(turkishHelpers.upcoming_text_template).toContain("$title");
    expect(turkishHelpers.upcoming_text_template).toContain("$empty");
    expect(turkishHelpers.upcoming_url).toContain("https://www.themoviedb.org/tv/$tmdb_id");
    expect(turkishHelpers.upcoming_url).toContain("HTTP(S)");
    expect(turkishHelpers.upcoming_group_value).toContain("flag = true");
    expect(turkishHelpers.upcoming_date_format).toContain("dd, mm, yy ya da yyyy");
    expect(turkishHelpers.remote_transport).toContain("remote.send_command");
    expect(turkishHelpers.remote_transport).toContain("play_media / send_key");
    expect(turkishHelpers.pihole_pause_durations).toContain("30s, 5m, 1h30m ya da 1h:30m:15s");
    expect(turkishHelpers.ulm_button_service).toContain("domain.service");
    expect(turkishHelpers.ulm_card_welcome_collapse).toContain("input_boolean");
    expect(turkishHelpers.cartridges).toContain("label, entity_id, type");
    expect(turkishHelpers.lower_bound).toContain("~20");
    expect(turkishHelpers.upper_bound).toContain("~25");
    expect(turkishHelpers.graph_span).toContain("1d");
    expect(turkishHelpers.ulm_card_media_player_enable_volume_adjust).toContain("0.05 = 5%");
    expect(turkishHelpers.pihole_pause_service).toContain("kalıcı kapatma");
    expect(turkishHelpers.remote_entity).toContain("Başka bir odanın");
    expect(turkishHelpers.buy_sell_trade_efficiency).toContain("Depolama kayıplarından sonra");
    expect(turkishLabels["ui.area.feature"]).toBe("Alan denetimi özelliği {number}");
    expect(turkishLabels["ui.renderer.weak_panel"]).toContain("{panel}");
    expect(turkishLabels["ui.renderer.weak_panel"]).toContain("{percent}");
  });
});
