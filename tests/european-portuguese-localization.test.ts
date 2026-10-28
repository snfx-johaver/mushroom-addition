import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import {
  europeanPortugueseHelpers,
  europeanPortugueseLabels,
} from "../src/translations/pt-PT";
import {
  brazilianPortugueseHelpers,
  brazilianPortugueseLabels,
} from "../src/translations/pt-BR";

const catalogs = [
  [translationCatalogs.en, translationCatalogs["pt-PT"], europeanPortugueseLabels, 767, 416],
  [englishHelpers, helperCatalogs["pt-PT"], europeanPortugueseHelpers, 552, 1],
] as const;

describe("complete European Portuguese card translations", () => {
  it("adds exactly the missing keys before and after central integration", () => {
    for (const [english, baseline, additions, addedCount, installedCount] of catalogs) {
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

  it("preserves every installed translation", () => {
    for (const [, baseline, additions] of catalogs) {
      const merged = { ...baseline, ...additions };
      for (const [key, value] of Object.entries(baseline)) {
        expect(merged[key], key).toBe(value);
      }
    }
    expect(europeanPortugueseLabels).not.toHaveProperty("entity");
    expect(europeanPortugueseHelpers).not.toHaveProperty("entity");
  });

  it("uses European Portuguese terminology rather than English fallback filling", () => {
    const sharedTechnicalTerms = new Set([
      "ui.renderer.CPU", "ui.renderer.RAM", "ui.renderer.Download",
      "ui.renderer.Upload", "ui.renderer.Ping",
    ]);
    for (const [english, , additions] of catalogs) {
      for (const [key, value] of Object.entries(additions)) {
        expect(english[key], key).toBeDefined();
        if (!sharedTechnicalTerms.has(key)) expect(value, key).not.toBe(english[key]);
      }
    }
    expect(europeanPortugueseLabels.room_light_entity).toContain("divisão");
    expect(europeanPortugueseLabels.moisture_entity).toContain("humidade");
    expect(europeanPortugueseLabels.findmy_script_entity).toContain("telemóvel");
    expect(europeanPortugueseLabels["ui.runtime_stop_washer_630a44cc"]).toContain("máquina de lavar");
    expect(europeanPortugueseHelpers.pihole_columns).toContain("linha");
    expect(europeanPortugueseHelpers.remote_volume).toContain("controlo deslizante");
    expect(europeanPortugueseHelpers.upcoming_overflow).toContain("ecrã");
    expect(europeanPortugueseLabels["ui.runtime_columns_53aade77"]).toBe("Colunas");
  });

  it("retains numeric examples and limits without changing their values", () => {
    const numbers = (value: string) => value.match(/-?\d+(?:\.\d+)?/g) ?? [];
    for (const [additions, source] of [
      [
        europeanPortugueseLabels,
        { ...translationCatalogs["pt-BR"], ...brazilianPortugueseLabels },
      ],
      [
        europeanPortugueseHelpers,
        { ...helperCatalogs["pt-BR"], ...brazilianPortugueseHelpers },
      ],
    ] as const) {
      for (const [key, value] of Object.entries(additions)) {
        const originalExamples = numbers(source[key] ?? "");
        if (originalExamples.length > 0) {
          expect(numbers(value), key).toEqual(originalExamples);
        }
      }
    }
  });

  it("preserves code, selectors, protocols, examples, and literal units", () => {
    const literals: Record<string, string[]> = {
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
      remote_swipe_distance: ["pixels", "Enter", "Space", "Backspace", "Home"],
      pihole_device_ids: ["v5", "v6"],
      pihole_chart_height: ["pixels"],
      pihole_pause_durations: ["30s", "5m", "1h30m", "1h:30m:15s"],
      pihole_chart_metrics: ["Mini Graph", "CPU", "API", "Pi-hole"],
      upcoming_item_height: ["pixels"],
      upcoming_corner_radius: ["pixels"],
      upcoming_title_size: ["pixels"],
      upcoming_line_size: ["pixels"],
      remote_button_size: ["pixels"],
      remote_touchpad_height: ["pixels"],
      buy_sell_trade_energy_entity: ["kWh"],
      buy_sell_feed_in_fee: ["kWh"],
      cartridges: ["label, entity_id, type", "CSS"],
      lower_bound: ["~20"],
      upper_bound: ["~25"],
      graph_span: ["1d", "YAML"],
      height: ["SVG", "pixels"],
      bar_spacing: ["pixels"],
      font_size_header: ["pixels"],
      value_factor: ["-3"],
      ulm_button_service: ["domain.service"],
      ulm_card_welcome_collapse: ["input_boolean"],
      ulm_custom_card_washer_remote_control: ["true", "on"],
      ulm_custom_card_washer_job_states: ["5", "Material Design"],
      ulm_custom_card_window_handle: ["Closed", "Tilted", "Open"],
      ulm_card_battery_charger_type_entity_id: ["wireless", "AC", "USB", "charging"],
      ulm_card_media_player_enable_volume_adjust: ["0.01", "0.05 = 5%"],
      carousel_effect: ["Coverflow", "Slide", "Fade", "Cube", "Flip"],
      carousel_button_width: ["32-160", "pixels"],
      carousel_button_height: ["pixels"],
      carousel_icon_size: ["12-96", "pixels"],
      carousel_coverflow_stretch: ["pixels"],
      mode_solar_first_label: ["Smart Matching"],
      mode_smart_saving_label: ["Dynamic Smart Matching"],
      mode_smart_trading_label: ["Dynamic Trading + Smart Matching"],
      show_grid_phases: ["L1", "L2", "L3"],
      moon_altitude_entity: ["Astronomy Space Suite"],
    };
    for (const [key, tokens] of Object.entries(literals)) {
      for (const token of tokens) {
        expect(europeanPortugueseHelpers[key], `${key}: ${token}`).toContain(token);
      }
    }
    for (const key of [
      "buy_sell_trade_energy", "buy_sell_trade_energy_entity",
      "buy_sell_trade_power", "buy_sell_trade_efficiency", "buy_sell_feed_in_fee",
      "panel_gauge_max", "panel_low_output_percent", "room_part_brightness",
    ]) {
      const unit = translationCatalogs.en[key].match(/€\/kWh|kWh|kW|W|%/)?.[0];
      expect(unit, key).toBeDefined();
      expect(europeanPortugueseLabels[key], key).toContain(unit!);
    }
    expect(europeanPortugueseLabels["ui.area.attribute_help"]).toContain("brightness");
    expect(europeanPortugueseLabels["ui.area.attribute_help"]).toContain("battery_level");
    expect(europeanPortugueseLabels[
      "ui.runtime_optional_nested_path_such_as_battery_level_30fc3244"
    ]).toContain("battery.level");
    expect(europeanPortugueseLabels[
      "ui.runtime_select_panel_sensors_in_the_card_editor_or_add_sensors_with_entity_ids_beginning_with_sensor_inverter_4_1ba7d684"
    ]).toContain("sensor.inverter_4");
    expect(europeanPortugueseLabels["ui.renderer.energy_chart"]).toContain("{hours}");
    expect(europeanPortugueseLabels["ui.renderer.weak_panel"]).toContain("{percent}%");
    expect(europeanPortugueseLabels["ui.renderer.Buy and sell moments (all-in €/kWh)"])
      .toContain("€/kWh");
  });

  it("preserves backend timing, errors, native constraints, and healthy picker defaults", () => {
    expect(europeanPortugueseHelpers.pihole_pause_durations).toContain("temporizada pelo backend");
    expect(europeanPortugueseHelpers.pihole_pause_durations).toContain("após fechar o navegador");
    expect(europeanPortugueseHelpers.pihole_pause_durations).toContain("visivelmente desativadas");
    expect(europeanPortugueseHelpers.pihole_pause_service)
      .toContain("nunca recorre a um desligamento permanente nem a um temporizador no navegador");
    expect(europeanPortugueseHelpers.pihole_metrics).toContain("nunca são substituídos por zero");
    expect(europeanPortugueseHelpers.pihole_duration_field).toContain("são preservados");
    expect(europeanPortugueseHelpers.upcoming_hide_empty).toContain("erro explícito");
    expect(europeanPortugueseHelpers.upcoming_text_template)
      .toContain("Não é executado JavaScript, HTML nem Jinja");
    expect(europeanPortugueseHelpers.remote_transport).toContain("só é usado para uma TV Samsung detetada");
    expect(europeanPortugueseHelpers.remote_entity).toContain("Nunca envia comandos");
    expect(europeanPortugueseHelpers.remote_device).toContain("não um ID de dispositivo");
    expect(europeanPortugueseHelpers.remote_double_tap).toContain("sem um comando adicional de seleção");
    expect(europeanPortugueseHelpers.room_brightness_entity)
      .toContain("primeiro a luz principal e, em seguida, a luz de destaque da divisão");
    expect(europeanPortugueseHelpers.label_use_temperature).toContain("têm prioridade");
    expect(europeanPortugueseHelpers.volume_controls)
      .toContain("Controlos não suportados pela entidade são ocultados");
    expect(europeanPortugueseHelpers.collapsible_controls)
      .toContain("Entidades desconhecidas e indisponíveis não podem ser controladas");
    expect(europeanPortugueseHelpers.ulm_card_media_player_power_button)
      .toContain("não corta a alimentação do altifalante");
    expect(europeanPortugueseHelpers.ulm_card_media_player_power_button)
      .toContain("mantido quando os outros controlos estão recolhidos");
    expect(europeanPortugueseHelpers.ulm_card_media_player_enable_volume_adjust)
      .toContain("exige suporte à definição de volume");
    expect(europeanPortugueseHelpers.carousel_scrollbar).toContain("não ativa a entidade");
    expect(europeanPortugueseLabels[
      "ui.runtime_content_name_icon_and_icon_color_accept_home_assistant_jinja_templates_templates_run_in_home_assistant_not_in_the_browser_errors_are_shown_on_the_button_preview_f15200eb"
    ]).toContain("no Home Assistant, não no navegador");
    expect(europeanPortugueseLabels[
      "ui.runtime_group_membership_icon_and_actions_stay_native_add_an_entity_button_for_a_custom_icon_name_or_action_04800467"
    ]).toContain("permanecem nativos");
    expect(europeanPortugueseLabels[
      "ui.runtime_use_the_native_editor_above_for_area_appearance_features_and_standard_domain_groups_edit_advanced_buttons_below_action_template_and_conditional_buttons_are_intentionally_hidden_from_native_control_lists_names_and_content_appear_below_icons_aligned_to_the_button_bottom_empty_controls_show_no_controls_automatic_controls_retain_home_assistant_defaults_8ead6f08"
    ]).toContain("os automáticos mantêm as predefinições");
  });
});
