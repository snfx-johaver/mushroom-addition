import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { indonesianHelpers, indonesianLabels } from "../src/translations/id";

const catalogs = [
  [translationCatalogs.en, translationCatalogs.id, indonesianLabels],
  [englishHelpers, helperCatalogs.id, indonesianHelpers],
] as const;

describe("Indonesian label and helper catalogs", () => {
  it("covers exactly the missing English keys with nonblank text and matching placeholders", () => {
    for (const [english, installed, additions] of catalogs) {
      const baseline = Object.fromEntries(Object.entries(installed).filter(([key]) => !Object.hasOwn(additions, key)));
      const expectedKeys = Object.keys(english).filter((key) => !Object.hasOwn(baseline, key)).sort();
      expect(Object.keys(additions).sort()).toEqual(expectedKeys);

      const merged = { ...installed, ...additions };
      expect(Object.keys(merged).sort()).toEqual(Object.keys(english).sort());
      for (const [key, original] of Object.entries(english)) {
        expect(merged[key]?.trim(), key).toBeTruthy();
        expect(placeholders(merged[key]), key).toEqual(placeholders(original));
      }
    }
    expect(Object.keys(indonesianLabels)).toHaveLength(782);
    expect(Object.keys(indonesianHelpers)).toHaveLength(567);
  });

  it("preserves the Indonesian entries already installed in the base catalogs", () => {
    for (const [, installed, additions] of catalogs) {
      const merged = { ...installed, ...additions };
      for (const [key, value] of Object.entries(installed)) {
        expect(merged[key], key).toBe(value);
      }
    }
  });

  it("uses Indonesian text rather than English-filled fallbacks", () => {
    const unchangedTerms = new Set([
      "ui.renderer.CPU",
      "ui.renderer.Ping",
      "ui.renderer.RAM",
    ]);
    for (const [english, , additions] of catalogs) {
      for (const [key, translated] of Object.entries(additions)) {
        expect(english[key], key).toBeDefined();
        if (!unchangedTerms.has(key)) expect(translated, key).not.toBe(english[key]);
      }
    }

    expect(indonesianLabels.room_secondary_help).toContain("entitas utama");
    expect(indonesianLabels["ui.area.feature"]).toContain("{number}");
    expect(indonesianHelpers.upcoming_hide_empty).toContain("JSON");
    expect(indonesianHelpers.remote_transport).toContain("Samsung");
    expect(indonesianHelpers.pihole_pause_durations).toContain("1h:30m:15s");
  });

  it("retains configuration tokens, examples, units, and command literals", () => {
    const literals: Record<string, string[]> = {
      upcoming_data_attribute: ["JSON", "data"],
      upcoming_text_template: [
        "$title", "$episode", "$number", "$rating", "$runtime", "$release",
        "$day", "$date", "$time", "$studio", "$empty", "JavaScript", "HTML", "Jinja",
      ],
      upcoming_url: ["https://www.themoviedb.org/tv/$tmdb_id", "HTTP(S)"],
      upcoming_group_value: ["flag = true"],
      upcoming_date_format: ["dd", "mm", "yy", "yyyy"],
      remote_transport: ["remote.send_command", "play_media / send_key", "Samsung"],
      remote_device: ["remote.send_command", "IR"],
      remote_swipe_distance: ["Enter", "Space", "Backspace", "Home"],
      pihole_device_ids: ["v5", "v6"],
      pihole_pause_durations: ["30s", "5m", "1h30m", "1h:30m:15s"],
      cartridges: ["label", "entity_id", "type", "CSS"],
      lower_bound: ["~20"],
      upper_bound: ["~25"],
      graph_span: ["1d", "YAML"],
      value_factor: ["-3"],
      ulm_button_service: ["domain.service"],
      ulm_card_welcome_collapse: ["input_boolean"],
      ulm_custom_card_washer_remote_control: ["true", "on"],
      ulm_custom_card_window_handle: ["Closed", "Tilted", "Open"],
      ulm_card_battery_charger_type_entity_id: ["wireless", "AC", "USB", "charging"],
      ulm_card_media_player_enable_volume_adjust: ["0.01", "0.05 = 5%"],
      carousel_effect: ["Coverflow", "Slide", "Fade", "Cube", "Flip"],
      carousel_button_width: ["32-160"],
      carousel_icon_size: ["12-96"],
      mode_smart_trading_label: ["Dynamic Trading + Smart Matching"],
      show_grid_phases: ["L1", "L2", "L3"],
      grid_phase_1_entity: ["L1"],
      grid_phase_2_entity: ["L2"],
      grid_phase_3_entity: ["L3"],
    };
    for (const [key, tokens] of Object.entries(literals)) {
      for (const token of tokens) {
        expect(indonesianHelpers[key], `${key}: ${token}`).toContain(token);
      }
    }

    expect(indonesianLabels["ui.runtime_select_panel_sensors_in_the_card_editor_or_add_sensors_with_entity_ids_beginning_with_sensor_inverter_4_1ba7d684"])
      .toContain("sensor.inverter_4");
    expect(indonesianLabels["ui.renderer.energy_chart"]).toContain("{hours}");
    expect(indonesianLabels["ui.renderer.weak_panel"]).toContain("{percent}%");
  });
});
