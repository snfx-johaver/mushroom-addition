import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { polishHelpers, polishLabels } from "../src/translations/pl";

const catalogs = [
  [translationCatalogs.en, translationCatalogs.pl, polishLabels, 770],
  [englishHelpers, helperCatalogs.pl, polishHelpers, 555],
] as const;

describe("complete Polish card localization", () => {
  it("supplies exactly the missing keys before or after integration", () => {
    for (const [english, baseline, additions, count] of catalogs) {
      const installed = Object.fromEntries(
        Object.entries(baseline).filter(([key]) => !Object.hasOwn(additions, key)),
      );
      expect(Object.keys(additions)).toHaveLength(count);
      expect(Object.keys(additions).sort()).toEqual(
        Object.keys(english).filter((key) => !Object.hasOwn(installed, key)).sort(),
      );
      const merged = { ...baseline, ...additions };
      expect(Object.keys(merged).sort()).toEqual(Object.keys(english).sort());
      for (const [key, original] of Object.entries(english)) {
        expect(merged[key]?.trim(), key).toBeTruthy();
        expect(placeholders(merged[key]), key).toEqual(placeholders(original));
      }
    }
  });

  it("preserves installed Polish text without overriding existing entries", () => {
    for (const [, baseline, additions] of catalogs) {
      const merged = { ...baseline, ...additions };
      for (const [key, installed] of Object.entries(baseline)) {
        expect(merged[key], key).toBe(installed);
      }
    }
    expect(translationCatalogs.pl.entity).toBe("Encja");
    expect(translationCatalogs.pl.secondary).toBe("Własne informacje dodatkowe");
    expect(translationCatalogs.pl.variant).toBe("Styl karty");
    expect(helperCatalogs.pl.entity).toBe(
      "Encja Home Assistant wyświetlana i sterowana przez tę kartę.",
    );
    expect(Object.hasOwn(polishLabels, "entity")).toBe(false);
    expect(Object.hasOwn(polishHelpers, "entity")).toBe(false);
  });

  it("uses Polish rather than English fallback apart from technical terms", () => {
    const technicalTerms = new Set(["ui.renderer.CPU", "ui.renderer.RAM", "ui.renderer.Ping"]);
    for (const [english, , additions] of catalogs) {
      for (const [key, translated] of Object.entries(additions)) {
        expect(english[key], key).toBeDefined();
        if (!technicalTerms.has(key)) expect(translated, key).not.toBe(english[key]);
      }
    }
    expect(polishLabels["ui.area.entity_button"]).toBe("Przycisk encji");
    expect(polishLabels.grid_power_entity).toContain("sieci energetycznej");
    expect(polishLabels.collapsible_controls).toContain("Zwiń");
    expect(polishLabels.ulm_custom_card_washer_pause_action).toBe("Akcja pauzy");
    expect(polishLabels["ui.renderer.Download"]).toBe("Pobieranie");
    expect(polishLabels["ui.renderer.Upload"]).toBe("Wysyłanie");
  });

  it("preserves numeric limits, placeholders, code examples, protocols and units", () => {
    const numbers = (text: string) => (text.match(/-?\d+(?:\.\d+)?/g) ?? []).sort();
    for (const [english, , additions] of catalogs) {
      for (const [key, text] of Object.entries(additions)) {
        expect(numbers(text), key).toEqual(numbers(english[key]));
        expect(placeholders(text), key).toEqual(placeholders(english[key]));
      }
    }
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
      remote_double_tap: ["Select"],
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
      carousel_button_height: ["32-160"],
      carousel_icon_size: ["12-96"],
      mode_solar_first_label: ["Smart Matching"],
      mode_smart_saving_label: ["Dynamic Smart Matching"],
      mode_smart_trading_label: ["Dynamic Trading + Smart Matching"],
      show_grid_phases: ["L1", "L2", "L3"],
    };
    for (const [key, tokens] of Object.entries(literals)) {
      for (const token of tokens) expect(polishHelpers[key], `${key}: ${token}`).toContain(token);
    }
    expect(polishLabels["ui.area.attribute_help"]).toContain("brightness");
    expect(polishLabels["ui.area.attribute_help"]).toContain("battery_level");
    expect(polishLabels[
      "ui.runtime_select_panel_sensors_in_the_card_editor_or_add_sensors_with_entity_ids_beginning_with_sensor_inverter_4_1ba7d684"
    ]).toContain("sensor.inverter_4");
    expect(polishLabels["ui.renderer.energy_chart"]).toContain("{hours}");
    expect(polishLabels["ui.renderer.weak_panel"]).toContain("{percent}%");
  });

  it("retains safety, native limitations, unavailable handling and healthy defaults", () => {
    expect(polishHelpers.pihole_pause_durations).toContain("Czas pauzy odmierza backend");
    expect(polishHelpers.pihole_pause_durations).toContain("po zamknięciu przeglądarki");
    expect(polishHelpers.pihole_pause_durations).toContain("Nieprawidłowe wpisy");
    expect(polishHelpers.pihole_pause_service).toContain("nigdy");
    expect(polishHelpers.pihole_pause_service).toContain("trwałym wyłączeniem");
    expect(polishHelpers.pihole_pause_service).toContain("timera przeglądarki");
    expect(polishHelpers.pihole_metrics).toContain("nigdy nie są zastępowane zerem");
    expect(polishHelpers.upcoming_hide_empty).toContain("jawny błąd");
    expect(polishHelpers.buy_sell_trade_energy_entity).toContain("błąd zamiast szacunku");
    expect(polishHelpers.remote_entity).toContain("Nigdy nie wysyła");
    expect(polishHelpers.remote_transport).toContain("tylko dla wykrytego telewizora Samsung");
    expect(polishHelpers.upcoming_text_template).toContain("nie są wykonywane");
    expect(polishHelpers.upcoming_trailers).toContain("nie jest wczytywany automatycznie");
    expect(polishHelpers.collapsible_controls).toContain("nie można sterować");
    expect(polishHelpers.ulm_card_media_player_power_button).toContain("nie odcina to zasilania");
    expect(polishHelpers.ulm_card_media_player_enable_volume_adjust).toContain("natywnego kroku");
    expect(polishHelpers.icon).toContain("Wyczyść");
    expect(polishHelpers.icon).toContain("klasę urządzenia i stan");
    expect(polishHelpers.custom_card_pollen_tree_name).toContain("zlokalizowanej wartości domyślnej");
    expect(polishLabels[
      "ui.runtime_group_membership_icon_and_actions_stay_native_add_an_entity_button_for_a_custom_icon_name_or_action_04800467"
    ]).toContain("pozostają natywne");
    expect(polishLabels[
      "ui.runtime_content_name_icon_and_icon_color_accept_home_assistant_jinja_templates_templates_run_in_home_assistant_not_in_the_browser_errors_are_shown_on_the_button_preview_f15200eb"
    ]).toContain("nie w przeglądarce");
    expect(polishLabels["ui.area.sensor_icons_help"]).toContain("pod kontrolą Home Assistant");
  });
});
