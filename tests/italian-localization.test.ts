import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { italianHelpers, italianLabels } from "../src/translations/it";

const catalogs = [
  [translationCatalogs.en, translationCatalogs.it, italianLabels],
  [englishHelpers, helperCatalogs.it, italianHelpers],
] as const;

describe("complete Italian label and helper catalog", () => {
  it("covers exactly the missing English keys with nonblank text and matching placeholders", () => {
    for (const [english, baseline, additions] of catalogs) {
      const installed = Object.fromEntries(
        Object.entries(baseline).filter(([key]) => !Object.hasOwn(additions, key)),
      );
      expect(Object.keys(additions).sort()).toEqual(
        Object.keys(english).filter((key) => !installed[key]).sort(),
      );
      const merged = { ...baseline, ...additions };
      expect(Object.keys(merged).sort()).toEqual(Object.keys(english).sort());
      for (const [key, original] of Object.entries(english)) {
        expect(merged[key]?.trim(), key).toBeTruthy();
        expect(placeholders(merged[key]), key).toEqual(placeholders(original));
      }
    }
  });

  it("preserves the Italian translations already installed in the baseline", () => {
    for (const [, baseline, additions] of catalogs) {
      const merged = { ...baseline, ...additions };
      for (const [key, installed] of Object.entries(baseline)) {
        expect(merged[key], key).toBe(installed);
      }
    }
  });

  it("uses Italian rather than English-filled fallback entries", () => {
    const unchangedTerms = new Set([
      "ui.renderer.CPU",
      "ui.renderer.RAM",
      "ui.renderer.Download",
      "ui.renderer.Upload",
      "ui.renderer.Ping",
    ]);
    for (const [english, , additions] of catalogs) {
      for (const [key, translated] of Object.entries(additions)) {
        expect(english[key], key).toBeDefined();
        if (!unchangedTerms.has(key)) expect(translated, key).not.toBe(english[key]);
      }
    }

    expect(italianLabels.collapse_entity).toContain("comprimere");
    expect(italianLabels.grid_power_entity).toContain("rete elettrica");
    expect(italianLabels.ulm_custom_card_washer_pause_action).toContain("pausa");
    expect(italianHelpers.pihole_pause_durations).toContain("temporizzata dal backend");
    expect(italianHelpers.pihole_pause_service).toContain("timer del browser");
    expect(italianHelpers.upcoming_hide_empty).toContain("errore esplicito");
    expect(italianHelpers.remote_transport).toContain("solo per una TV Samsung rilevata");
    expect(italianHelpers.ulm_card_media_player_power_button).toContain("non interrompe l'alimentazione");
  });

  it("retains literal code, option values, protocols, formats, examples, and units", () => {
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
      for (const token of tokens) expect(italianHelpers[key], `${key}: ${token}`).toContain(token);
    }
    expect(italianLabels["ui.area.attribute_help"]).toContain("brightness");
    expect(italianLabels["ui.area.attribute_help"]).toContain("battery_level");
    expect(italianLabels[
      "ui.runtime_select_panel_sensors_in_the_card_editor_or_add_sensors_with_entity_ids_beginning_with_sensor_inverter_4_1ba7d684"
    ]).toContain("sensor.inverter_4");
    expect(italianLabels["ui.renderer.energy_chart"]).toContain("{hours}");
    expect(italianLabels["ui.renderer.weak_panel"]).toContain("{percent}%");
  });
});
