import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { germanHelpers } from "../src/translations/de-helpers";
import { translatedHelpers } from "../src/translations/helpers";

describe("German helper catalog", () => {
  const helpers = { ...helperCatalogs.de, ...germanHelpers };

  it("covers every English helper without blanks or lost placeholders", () => {
    expect(Object.keys(germanHelpers).sort()).toEqual(
      Object.keys(englishHelpers).filter((key) => !translatedHelpers.de?.[key]).sort(),
    );
    expect(Object.keys(germanHelpers)).toHaveLength(575);
    expect(Object.keys(helpers).sort()).toEqual(Object.keys(englishHelpers).sort());
    for (const [key, original] of Object.entries(englishHelpers)) {
      expect(helpers[key]?.trim(), key).toBeTruthy();
      expect(placeholders(helpers[key]), key).toEqual(placeholders(original));
    }
  });

  it("contains original German text rather than English-filled entries", () => {
    for (const [key, translated] of Object.entries(germanHelpers)) {
      expect(englishHelpers[key], key).toBeDefined();
      expect(translated, key).not.toBe(englishHelpers[key]);
    }
    expect(helpers.entity).toBe(helperCatalogs.de.entity);
    expect(germanHelpers.pihole_pause_durations).toContain("Die Pause wird zeitgesteuert im Backend beendet");
    expect(germanHelpers.remote_transport).toContain("wird nur bei erkanntem Samsung-Fernseher verwendet");
  });

  it("preserves literal protocols, identifiers, formats, examples, and units", () => {
    expect(germanHelpers.upcoming_text_template).toContain("$empty");
    expect(germanHelpers.upcoming_url).toContain("https://www.themoviedb.org/tv/$tmdb_id");
    expect(germanHelpers.upcoming_url).toContain("HTTP(S)");
    expect(germanHelpers.upcoming_group_value).toContain("flag = true");
    expect(germanHelpers.upcoming_date_format).toContain("dd, mm, yy oder yyyy");
    expect(germanHelpers.remote_transport).toContain("remote.send_command");
    expect(germanHelpers.remote_transport).toContain("play_media / send_key");
    expect(germanHelpers.pihole_pause_durations).toContain("30s, 5m, 1h30m oder 1h:30m:15s");
    expect(germanHelpers.ulm_button_service).toContain("domain.service");
    expect(germanHelpers.ulm_card_welcome_collapse).toContain("input_boolean");
    expect(germanHelpers.cartridges).toContain("label, entity_id, type");
    expect(germanHelpers.lower_bound).toContain("~20");
    expect(germanHelpers.upper_bound).toContain("~25");
    expect(germanHelpers.graph_span).toContain("1d");
    expect(germanHelpers.ulm_card_media_player_enable_volume_adjust).toContain("0.05 = 5%");
  });
});
