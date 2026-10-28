import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { romanianHelpers, romanianLabels } from "../src/translations/ro";

const labelSupplementSize = 777;
const helperSupplementSize = 562;

const catalogs = [
  [translationCatalogs.en, translationCatalogs.ro, romanianLabels],
  [englishHelpers, helperCatalogs.ro, romanianHelpers],
] as const;

describe("complete Romanian label and helper catalog", () => {
  it("fills exactly the dynamic English gaps, before or after locale wiring", () => {
    for (const [english, baseline, supplement] of catalogs) {
      const englishKeys = Object.keys(english).sort();
      const supplementKeys = Object.keys(supplement).sort();
      const installedBaseline = Object.fromEntries(
        Object.entries(baseline).filter(([key]) => !Object.hasOwn(supplement, key)),
      );
      const missingBeforeWiring = englishKeys.filter(key => !Object.hasOwn(installedBaseline, key));
      const mergedAfterWiring = { ...installedBaseline, ...supplement };

      expect(supplementKeys).toHaveLength(
        english === translationCatalogs.en ? labelSupplementSize : helperSupplementSize,
      );
      expect(missingBeforeWiring).toEqual(supplementKeys);
      expect(Object.keys(mergedAfterWiring).sort()).toEqual(englishKeys);
      expect(Object.keys({ ...baseline, ...supplement }).sort()).toEqual(englishKeys);

      for (const [key, original] of Object.entries(english)) {
        const translated = supplement[key] ?? baseline[key];
        expect(translated?.trim(), key).toBeTruthy();
        expect(placeholders(translated), key).toEqual(placeholders(original));
      }

      for (const [key, translated] of Object.entries(supplement)) {
        expect(english[key], key).toBeDefined();
        if (Object.hasOwn(baseline, key)) {
          expect(baseline[key], key).toBe(translated);
        }
      }
    }
  });

  it("preserves all installed Romanian translations", () => {
    for (const [, baseline, supplement] of catalogs) {
      const merged = { ...baseline, ...supplement };
      for (const [key, installed] of Object.entries(baseline)) {
        expect(merged[key], key).toBe(installed);
      }
    }
  });

  it("uses Romanian wording rather than English fallback text", () => {
    for (const [english, , supplement] of catalogs) {
      for (const [key, translated] of Object.entries(supplement)) {
        if (!["ui.renderer.CPU", "ui.renderer.RAM", "ui.renderer.Manual", "ui.renderer.Ping"].includes(key)) {
          expect(translated, key).not.toBe(english[key]);
        }
      }
    }

    expect(romanianLabels.battery_critical_threshold).toBe("Prag pentru baterie critică");
    expect(romanianLabels.room_secondary_help).toContain("entitatea principală");
    expect(romanianLabels["ui.area.attribute_help"]).toContain("battery_level");
    expect(romanianHelpers.room_temperature_entity).toContain("unitate de temperatură");
    expect(romanianHelpers.pihole_pause_service).toContain("pauză temporară");
    expect(romanianHelpers.upcoming_hide_empty).toContain("eroare explicită");
    expect(romanianHelpers.ulm_card_media_player_power_button).toContain("alimentarea difuzorului");
  });

  it("retains code literals, option values, protocols, units and examples", () => {
    const literals: Record<string, string[]> = {
      upcoming_data_attribute: ["JSON", "data"],
      upcoming_text_template: [
        "$title", "$episode", "$number", "$rating", "$runtime", "$release",
        "$day", "$date", "$time", "$studio", "$empty", "JavaScript", "HTML", "Jinja",
      ],
      upcoming_url: ["https://www.themoviedb.org/tv/$tmdb_id", "HTTP(S)"],
      upcoming_group_value: ["flag = true"],
      upcoming_date_format: ["dd", "mm", "yy", "yyyy"],
      remote_transport: ["remote.send_command", "Samsung play_media / send_key"],
      remote_device: ["remote.send_command", "Home Assistant"],
      remote_swipe_distance: ["Enter", "Space", "Backspace", "Home"],
      pihole_device_ids: ["v5", "v6"],
      pihole_pause_durations: ["30s", "5m", "1h30m", "1h:30m:15s"],
      cartridges: ["label", "entity_id", "type", "CSS"],
      lower_bound: ["~20"],
      upper_bound: ["~25"],
      graph_span: ["1d", "YAML"],
      value_factor: ["-3"],
      ulm_button_service: ["domain.service"],
      ulm_custom_card_window_handle: ["Closed", "Tilted", "Open"],
      ulm_card_battery_charger_type_entity_id: ["wireless", "AC", "USB", "charging"],
      ulm_card_media_player_enable_volume_adjust: ["0.01", "0.05 = 5%"],
      carousel_effect: ["Coverflow", "Slide", "Fade", "Cube", "Flip"],
      carousel_button_width: ["32-160"],
      carousel_icon_size: ["12-96"],
      mode_smart_trading_label: ["Dynamic Trading + Smart Matching"],
      show_grid_phases: ["L1", "L2", "L3"],
    };

    for (const [key, tokens] of Object.entries(literals)) {
      for (const token of tokens) {
        expect(romanianHelpers[key], `${key}: ${token}`).toContain(token);
      }
    }
  });
});
