import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { spanishHelpers, spanishLabels } from "../src/translations/es";

const catalogs = [
  [translationCatalogs.en, translationCatalogs.es, spanishLabels],
  [englishHelpers, helperCatalogs.es, spanishHelpers],
] as const;

describe("complete Spanish label and helper catalog", () => {
  it("covers exactly the English keys with nonblank text and identical placeholder multisets", () => {
    for (const [english, baseline, additions] of catalogs) {
      const merged = { ...baseline, ...additions };
      expect(Object.keys(merged).sort()).toEqual(Object.keys(english).sort());
      for (const [key, original] of Object.entries(english)) {
        expect(merged[key]?.trim(), key).toBeTruthy();
        expect(placeholders(merged[key]), key).toEqual(placeholders(original));
      }
    }
  });

  it("preserves installed Spanish translations", () => {
    for (const [, baseline, additions] of catalogs) {
      const merged = { ...baseline, ...additions };
      for (const [key, installed] of Object.entries(baseline)) {
        expect(merged[key], key).toBe(installed);
      }
    }
  });

  it("provides original Spanish rather than English fallback text", () => {
    for (const [english, , additions] of catalogs) {
      for (const [key, translated] of Object.entries(additions)) {
        expect(english[key], key).toBeDefined();
        // «Color» is spelled identically in Spanish and English.
        if (key !== "ui.runtime_color_6b73191a") {
          expect(translated, key).not.toBe(english[key]);
        }
      }
    }
    expect(spanishLabels.battery_critical_threshold).toBe("Umbral de batería crítica");
    expect(spanishLabels.collapse_entity).toBe("Ayudante para contraer");
    expect(spanishLabels.ulm_custom_card_washer_pause_action).toBe("Acción de pausa");
    expect(spanishHelpers.room_temperature_entity).toContain("unidad de temperatura");
    expect(spanishHelpers.pihole_pause_durations).toContain("El servidor controla la duración de la pausa");
    expect(spanishHelpers.room_light_entity).toContain("miembros RGB activos de grupos");
    expect(spanishHelpers.upcoming_hide_empty).toContain("error explícito");
    expect(spanishHelpers.ulm_card_media_player_power_button).toContain("no corta la alimentación");
  });

  it("retains literal code, option values, protocols, units and examples", () => {
    const literals: Record<string, string[]> = {
      upcoming_data_attribute: ["JSON", "data"],
      upcoming_text_template: [
        "$title", "$episode", "$number", "$rating", "$runtime", "$release",
        "$day", "$date", "$time", "$studio", "$empty", "JavaScript", "HTML", "Jinja",
      ],
      upcoming_url: ["https://www.themoviedb.org/tv/$tmdb_id", "HTTP(S)"],
      upcoming_group_value: ["flag = true"],
      upcoming_date_format: ["dd, mm, yy", "yyyy"],
      remote_transport: ["remote.send_command", "play_media / send_key", "Samsung"],
      remote_device: ["remote.send_command", "IR"],
      remote_swipe_distance: ["Enter", "Space", "Backspace", "Home"],
      pihole_device_ids: ["v5", "v6"],
      pihole_pause_durations: ["30s", "5m", "1h30m", "1h:30m:15s"],
      cartridges: ["label, entity_id, type", "CSS"],
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
      lights_hold_action: ["500 ms"],
      mode_smart_trading_label: ["Dynamic Trading + Smart Matching"],
      show_grid_phases: ["L1", "L2", "L3"],
    };
    for (const [key, tokens] of Object.entries(literals)) {
      for (const token of tokens) expect(spanishHelpers[key], `${key}: ${token}`).toContain(token);
    }
    expect(spanishLabels["ui.area.attribute_help"]).toContain("brightness");
    expect(spanishLabels["ui.area.attribute_help"]).toContain("battery_level");
    expect(spanishLabels[
      "ui.runtime_select_panel_sensors_in_the_card_editor_or_add_sensors_with_entity_ids_beginning_with_sensor_inverter_4_1ba7d684"
    ]).toContain("sensor.inverter_4");
    expect(spanishLabels["ui.renderer.energy_chart"]).toContain("{hours}");
    expect(spanishLabels["ui.renderer.weak_panel"]).toContain("{percent}%");
  });
});
