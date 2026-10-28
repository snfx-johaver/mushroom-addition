import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { czechHelpers, czechLabels } from "../src/translations/cs";

const catalogs = [
  {
    english: translationCatalogs.en,
    baseline: translationCatalogs.cs,
    additions: czechLabels,
    addedCount: 773,
    installedCount: 416,
    installedHash: "0225a82c42967afb2c922d09103c67665e22f92280eb5843939532792d466f33",
  },
  {
    english: englishHelpers,
    baseline: helperCatalogs.cs,
    additions: czechHelpers,
    addedCount: 558,
    installedCount: 1,
    installedHash: "245c6bc7bb9ccaa28bf190bacc74aafc90865c9c07ebb56397d8103d0d06a45f",
  },
] as const;

describe("complete Czech card translations", () => {
  it("adds exactly the missing keys before and after central integration", () => {
    for (const { english, baseline, additions, addedCount, installedCount } of catalogs) {
      const installed = Object.fromEntries(
        Object.entries(baseline).filter(([key]) => !Object.hasOwn(additions, key)),
      );
      expect(Object.keys(additions)).toHaveLength(addedCount);
      expect(Object.keys(installed)).toHaveLength(installedCount);
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

  it("preserves installed Czech text rather than replacing it", () => {
    for (const { baseline, additions, installedHash } of catalogs) {
      const installed = Object.entries(baseline)
        .filter(([key]) => !Object.hasOwn(additions, key) && !key.startsWith("ui.graph."))
        .sort(([a], [b]) => a.localeCompare(b));
      expect(createHash("sha256").update(JSON.stringify(installed)).digest("hex"))
        .toBe(installedHash);
      const merged = { ...baseline, ...additions };
      for (const [key, original] of Object.entries(baseline)) {
        expect(merged[key], key).toBe(original);
      }
    }
    expect(czechLabels).not.toHaveProperty("entity");
    expect(czechHelpers).not.toHaveProperty("entity");
  });

  it("uses original Czech text, allowing only shared technical abbreviations", () => {
    const sharedTechnicalTerms = new Set(["ui.renderer.CPU", "ui.renderer.RAM"]);
    for (const { english, additions } of catalogs) {
      for (const [key, value] of Object.entries(additions)) {
        expect(english[key], key).toBeDefined();
        if (!sharedTechnicalTerms.has(key)) expect(value, key).not.toBe(english[key]);
      }
    }
    expect(czechLabels.icon_type).toBe("Typ ikony");
    expect(czechLabels["ui.area.kind_template"]).toBe("Šablona");
    expect(czechLabels["ui.renderer.entity_number"]).toBe("Entita {number}");
    expect(czechLabels["ui.renderer.GRID"]).toBe("ELEKTRICKÁ SÍŤ");
    expect(czechHelpers.grid_power_entity).toContain("elektrické sítě");
    expect(czechLabels.buy_sell_show_grid).toContain("mřížku grafu");
    expect(czechLabels.collapse_entity).toContain("sbalení");
    expect(czechLabels.collapsible_controls).toContain("Sbalit");
    for (const value of [...Object.values(czechLabels), ...Object.values(czechHelpers)]) {
      expect(value).not.toMatch(/kolaps|zřícen/i);
    }
  });

  it("retains every numeric example, limit, and technical unit", () => {
    const numbers = (value: string) => value.match(/-?\d+(?:\.\d+)?/g) ?? [];
    for (const { english, additions } of catalogs) {
      for (const [key, value] of Object.entries(additions)) {
        expect(numbers(value), key).toEqual(numbers(english[key]));
        const units = english[key].match(/€\/kWh|\bkWh\b|\bkW\b|\bW\b|\bms\b|%/g) ?? [];
        for (const unit of units) expect(value, `${key}: ${unit}`).toContain(unit);
      }
    }
    expect(czechHelpers.carousel_button_width).toContain("32-160");
    expect(czechHelpers.carousel_icon_size).toContain("12-96");
    expect(czechHelpers.ulm_card_media_player_enable_volume_adjust)
      .toContain("0.05 = 5%");
  });

  it("preserves raw code, selectors, protocols, and healthy examples", () => {
    const helperLiterals: Record<string, string[]> = {
      upcoming_data_attribute: ["JSON", "data"],
      upcoming_text_template: [
        "$title", "$episode", "$number", "$rating", "$runtime", "$release",
        "$day", "$date", "$time", "$studio", "$empty", "JavaScript", "HTML", "Jinja",
      ],
      upcoming_url: ["https://www.themoviedb.org/tv/$tmdb_id", "HTTP(S)"],
      upcoming_group_value: ["flag = true"],
      upcoming_date_format: ["dd, mm, yy", "yyyy", "Home Assistant"],
      remote_transport: ["remote.send_command", "play_media / send_key", "Samsung"],
      remote_device: ["remote.send_command", "IR", "Home Assistant"],
      remote_swipe_distance: ["Enter", "Space", "Backspace", "Home"],
      remote_double_tap: ["Select"],
      pihole_device_ids: ["v5", "v6"],
      pihole_pause_durations: ["30s", "5m", "1h30m", "1h:30m:15s"],
      pihole_chart_metrics: ["Mini Graph", "CPU", "API", "Pi-hole"],
      buy_sell_trade_energy_entity: ["kWh"],
      cartridges: ["label, entity_id, type", "CSS"],
      lower_bound: ["~20"],
      upper_bound: ["~25"],
      graph_span: ["1d", "YAML"],
      height: ["SVG"],
      value_factor: ["-3"],
      ulm_button_service: ["domain.service"],
      ulm_card_welcome_collapse: ["input_boolean"],
      ulm_custom_card_washer_remote_control: ["true", "on"],
      ulm_custom_card_washer_job_states: ["5", "Material Design"],
      ulm_custom_card_window_handle: ["Closed", "Tilted", "Open"],
      ulm_card_battery_charger_type_entity_id: ["wireless", "AC", "USB", "charging"],
      carousel_effect: ["Coverflow", "Slide", "Fade", "Cube", "Flip"],
      mode_solar_first_label: ["Smart Matching"],
      mode_smart_saving_label: ["Dynamic Smart Matching"],
      mode_smart_trading_label: ["Dynamic Trading + Smart Matching"],
      show_grid_phases: ["L1", "L2", "L3"],
      moon_altitude_entity: ["Astronomy Space Suite"],
      battery_healthy_color: ["green"],
      battery_warning_color: ["yellow"],
      battery_low_color: ["orange"],
      battery_critical_color: ["red"],
    };
    for (const [key, literals] of Object.entries(helperLiterals)) {
      for (const literal of literals) expect(czechHelpers[key], key).toContain(literal);
    }
    expect(czechLabels["ui.area.attribute_help"]).toContain("brightness");
    expect(czechLabels["ui.area.attribute_help"]).toContain("battery_level");
    expect(czechLabels["ui.area.content_help"]).toContain("Desk lights");
    expect(czechLabels[
      "ui.runtime_optional_nested_path_such_as_battery_level_30fc3244"
    ]).toContain("battery.level");
    expect(czechLabels[
      "ui.runtime_select_panel_sensors_in_the_card_editor_or_add_sensors_with_entity_ids_beginning_with_sensor_inverter_4_1ba7d684"
    ]).toContain("sensor.inverter_4");
    expect(czechLabels[
      "ui.runtime_use_playlist_for_spotify_playlist_ids_or_another_media_type_supported_by_your_player_c0de82c4"
    ]).toContain("playlist");
    const example = czechLabels["ui.renderer.example"]
      .replace("{value}", "spotify:playlist:PLAYLIST_ID");
    expect(example).toBe("Například: spotify:playlist:PLAYLIST_ID");
  });

  it("retains backend timing, explicit errors, and supported-action constraints", () => {
    expect(czechHelpers.pihole_pause_durations).toContain("časuje backend");
    expect(czechHelpers.pihole_pause_durations).toContain("po zavření prohlížeče");
    expect(czechHelpers.pihole_pause_durations).toContain("viditelně zakázané");
    expect(czechHelpers.pihole_pause_service)
      .toContain("nikdy nepřejde na trvalé vypnutí přepínače ani na časovač v prohlížeči");
    expect(czechHelpers.pihole_metrics).toContain("nikdy nenahrazují nulou");
    expect(czechHelpers.pihole_duration_field).toContain("data akce zůstávají zachována");
    expect(czechHelpers.upcoming_hide_empty).toContain("výslovnou chybu");
    expect(czechHelpers.buy_sell_trade_energy_entity).toContain("chybu namísto odhadu");
    expect(czechHelpers.upcoming_text_template).toContain("Nespouští se JavaScript, HTML ani Jinja");
    expect(czechHelpers.remote_transport).toContain("pouze u rozpoznaného televizoru Samsung");
    expect(czechHelpers.remote_entity).toContain("Nikdy neposílá příkazy");
    expect(czechHelpers.remote_device).toContain("nikoli ID zařízení Home Assistant");
    expect(czechHelpers.remote_double_tap).toContain("nikoli navíc Select");
    expect(czechHelpers.room_brightness_entity).toContain("hlavní světlo a poté světlo zvýraznění");
    expect(czechHelpers.label_use_temperature).toContain("mají přednost");
    expect(czechHelpers.volume_controls).toContain("nepodporované entitou se skrývá");
    expect(czechHelpers.media_controls).toContain("pouze ovládání podporované entitou");
    expect(czechHelpers.collapsible_controls).toContain("neznámým nebo nedostupným stavem nelze ovládat");
    expect(czechHelpers.ulm_card_media_player_power_button).toContain("neodpojí napájení");
    expect(czechHelpers.ulm_card_media_player_power_button).toContain("při sbalení ostatního ovládání");
    expect(czechHelpers.ulm_card_media_player_enable_volume_adjust).toContain("vyžaduje podporu");
    expect(czechHelpers.carousel_scrollbar).toContain("neaktivuje entitu");
  });

  it("retains native Area ownership, template errors, and automatic controls", () => {
    expect(czechLabels[
      "ui.runtime_content_name_icon_and_icon_color_accept_home_assistant_jinja_templates_templates_run_in_home_assistant_not_in_the_browser_errors_are_shown_on_the_button_preview_f15200eb"
    ]).toContain("v Home Assistant, nikoli v prohlížeči");
    expect(czechLabels[
      "ui.runtime_content_name_icon_and_icon_color_accept_home_assistant_jinja_templates_templates_run_in_home_assistant_not_in_the_browser_errors_are_shown_on_the_button_preview_f15200eb"
    ]).toContain("Chyby se zobrazují v náhledu tlačítka");
    expect(czechLabels[
      "ui.runtime_group_membership_icon_and_actions_stay_native_add_an_entity_button_for_a_custom_icon_name_or_action_04800467"
    ]).toContain("ikona a akce zůstávají nativní");
    expect(czechLabels[
      "ui.runtime_use_the_native_editor_above_for_area_appearance_features_and_standard_domain_groups_edit_advanced_buttons_below_action_template_and_conditional_buttons_are_intentionally_hidden_from_native_control_lists_names_and_content_appear_below_icons_aligned_to_the_button_bottom_empty_controls_show_no_controls_automatic_controls_retain_home_assistant_defaults_8ead6f08"
    ]).toContain("automatické ovládání zachovává výchozí nastavení Home Assistant");
    expect(czechLabels["ui.area.sensor_icons_help"]).toContain("nadále řídí Home Assistant");
    expect(czechLabels["ui.area.use_light_color_help"]).toContain("vyloučená světla se ignorují");
  });
});
