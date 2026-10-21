import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { dutchHelpers, dutchLabels } from "../src/translations/nl";

describe("complete Dutch label and helper catalog", () => {
  it("fills every English label and helper key after merging with the existing Dutch catalogs", () => {
    const labels = { ...translationCatalogs.nl, ...dutchLabels };
    const helpers = { ...helperCatalogs.nl, ...dutchHelpers };
    expect(Object.keys(labels).sort()).toEqual(Object.keys(translationCatalogs.en).sort());
    expect(Object.keys(helpers).sort()).toEqual(Object.keys(englishHelpers).sort());
    for (const [english, dutch] of [
      [translationCatalogs.en, labels],
      [englishHelpers, helpers],
    ]) {
      for (const [key, original] of Object.entries(english)) {
        expect(dutch[key]?.trim(), key).toBeTruthy();
        expect(placeholders(dutch[key]), key).toEqual(placeholders(original));
      }
    }
    expect(Object.keys(labels).length + Object.keys(helpers).length).toBe(
      Object.keys(translationCatalogs.en).length + Object.keys(englishHelpers).length,
    );
  });

  it("contains actual Dutch translations rather than English-filled entries", () => {
    for (const [english, dutch] of [
      [translationCatalogs.en, dutchLabels],
      [englishHelpers, dutchHelpers],
    ]) {
      for (const [key, translated] of Object.entries(dutch)) {
        expect(english[key], key).toBeDefined();
        expect(translated, key).not.toBe(english[key]);
      }
    }
    expect(dutchLabels.battery_critical_threshold).toBe("Drempel voor kritiek batterijniveau");
    expect(dutchHelpers.room_temperature_entity).toContain("temperatuureenheid");
    expect(dutchHelpers.pihole_pause_durations).toContain("De server bewaakt de pauzeduur");
  });

  it("retains protocols, configuration tokens, placeholders and literal code examples", () => {
    expect(dutchHelpers.upcoming_text_template).toContain("$empty");
    expect(dutchHelpers.upcoming_url).toContain("https://www.themoviedb.org/tv/$tmdb_id");
    expect(dutchHelpers.upcoming_url).toContain("HTTP(S)");
    expect(dutchHelpers.upcoming_group_value).toContain("flag = true");
    expect(dutchHelpers.upcoming_date_format).toContain("dd, mm, yy of yyyy");
    expect(dutchHelpers.remote_transport).toContain("remote.send_command");
    expect(dutchHelpers.remote_transport).toContain("play_media / send_key");
    expect(dutchHelpers.pihole_pause_durations).toContain("30s, 5m, 1h30m of 1h:30m:15s");
    expect(dutchHelpers.ulm_button_service).toContain("domain.service");
    expect(dutchHelpers.ulm_card_welcome_collapse).toContain("input_boolean");
    expect(dutchHelpers.cartridges).toContain("label, entity_id, type");
    expect(dutchHelpers.lower_bound).toContain("~20");
    expect(dutchHelpers.upper_bound).toContain("~25");
    expect(dutchHelpers.graph_span).toContain("1d");
    expect(dutchHelpers.ulm_card_media_player_enable_volume_adjust).toContain("0.05 = 5%");
  });
});
