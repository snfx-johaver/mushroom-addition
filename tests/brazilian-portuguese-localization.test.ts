import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import {
  brazilianPortugueseHelpers,
  brazilianPortugueseLabels,
} from "../src/translations/pt-BR";

const catalogs = [
  [translationCatalogs.en, translationCatalogs["pt-BR"], brazilianPortugueseLabels, 781, 416],
  [englishHelpers, helperCatalogs["pt-BR"], brazilianPortugueseHelpers, 566, 1],
] as const;

describe("complete Brazilian Portuguese card translations", () => {
  it("adds exactly the missing keys before and after central integration", () => {
    for (const [english, baseline, additions, addedCount, installedCount] of catalogs) {
      // Central integration may already have merged this module into the baseline.
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
    expect(translationCatalogs["pt-BR"].entity).toBe("Entidade");
    expect(translationCatalogs["pt-BR"].hold_action).toBe("Ação ao segurar");
    expect(helperCatalogs["pt-BR"].entity).toBe(
      "A entidade do Home Assistant exibida e controlada por este cartão.",
    );
    expect(brazilianPortugueseLabels).not.toHaveProperty("entity");
    expect(brazilianPortugueseHelpers).not.toHaveProperty("entity");
  });

  it("contains original Portuguese text, not English fallback filling", () => {
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
    expect(brazilianPortugueseLabels.collapse_entity).toContain("recolher");
    expect(brazilianPortugueseLabels.collapsed).toContain("recolhido");
    expect(brazilianPortugueseLabels.grid_power_entity).toContain("rede elétrica");
    expect(brazilianPortugueseLabels["ui.runtime_stop_washer_630a44cc"]).toContain("lavadora");
    expect(brazilianPortugueseHelpers.ulm_card_media_player_power_button).toContain("alto-falante");
  });

  it("retains all numeric examples and limits without changing their values", () => {
    const numbers = (value: string) => value.match(/-?\d+(?:\.\d+)?/g) ?? [];
    for (const [english, , additions] of catalogs) {
      for (const [key, value] of Object.entries(additions)) {
        expect(numbers(value), key).toEqual(numbers(english[key]));
      }
    }
  });

  it("preserves code, option values, protocols, examples and literal units", () => {
    const literals: Record<string, string[]> = {
      upcoming_data_attribute: ["JSON", "data"],
      upcoming_text_template: [
        "$title", "$episode", "$number", "$rating", "$runtime", "$release",
        "$day", "$date", "$time", "$studio", "$empty", "JavaScript", "HTML", "Jinja",
      ],
      upcoming_url: ["https://www.themoviedb.org/tv/$tmdb_id", "HTTP(S)"],
      upcoming_group_value: ["flag = true"],
      upcoming_date_format: ["dd, mm, yy", "yyyy", "Home Assistant"],
      upcoming_hide_empty: ["JSON"],
      remote_transport: ["remote.send_command", "play_media / send_key", "Samsung"],
      remote_device: ["remote.send_command", "IR", "Home Assistant"],
      remote_swipe_distance: ["Enter", "Space", "Backspace", "Home"],
      pihole_device_ids: ["v5", "v6"],
      pihole_pause_durations: ["30s", "5m", "1h30m", "1h:30m:15s"],
      pihole_chart_metrics: ["Mini Graph", "CPU", "API", "Pi-hole"],
      buy_sell_trade_energy_entity: ["kWh"],
      buy_sell_feed_in_fee: ["kWh"],
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
      ulm_card_media_player_enable_volume_adjust: ["0.01", "0.05 = 5%"],
      carousel_effect: ["Coverflow", "Slide", "Fade", "Cube", "Flip"],
      carousel_button_width: ["32-160"],
      carousel_icon_size: ["12-96"],
      mode_solar_first_label: ["Smart Matching"],
      mode_smart_saving_label: ["Dynamic Smart Matching"],
      mode_smart_trading_label: ["Dynamic Trading + Smart Matching"],
      show_grid_phases: ["L1", "L2", "L3"],
      moon_altitude_entity: ["Astronomy Space Suite"],
    };
    for (const [key, tokens] of Object.entries(literals)) {
      for (const token of tokens) {
        expect(brazilianPortugueseHelpers[key], `${key}: ${token}`).toContain(token);
      }
    }
    for (const key of [
      "buy_sell_trade_energy", "buy_sell_trade_energy_entity",
      "buy_sell_trade_power", "buy_sell_trade_efficiency", "buy_sell_feed_in_fee",
      "panel_gauge_max", "panel_low_output_percent", "room_part_brightness",
    ]) {
      const unit = translationCatalogs.en[key].match(/€\/kWh|kWh|kW|W|%/)?.[0];
      expect(unit, key).toBeDefined();
      expect(brazilianPortugueseLabels[key], key).toContain(unit!);
    }
    expect(brazilianPortugueseLabels["ui.area.attribute_help"]).toContain("brightness");
    expect(brazilianPortugueseLabels["ui.area.attribute_help"]).toContain("battery_level");
    expect(brazilianPortugueseLabels[
      "ui.runtime_optional_nested_path_such_as_battery_level_30fc3244"
    ]).toContain("battery.level");
    expect(brazilianPortugueseLabels[
      "ui.runtime_select_panel_sensors_in_the_card_editor_or_add_sensors_with_entity_ids_beginning_with_sensor_inverter_4_1ba7d684"
    ]).toContain("sensor.inverter_4");
    expect(brazilianPortugueseLabels[
      "ui.runtime_use_playlist_for_spotify_playlist_ids_or_another_media_type_supported_by_your_player_c0de82c4"
    ]).toContain("playlist");
    expect(brazilianPortugueseLabels["ui.renderer.energy_chart"]).toContain("{hours}");
    expect(brazilianPortugueseLabels["ui.renderer.weak_panel"]).toContain("{percent}%");
    expect(brazilianPortugueseLabels["ui.renderer.Buy and sell moments (all-in €/kWh)"])
      .toContain("€/kWh");
  });

  it("retains backend timing, error handling, native limitations and picker defaults", () => {
    expect(brazilianPortugueseHelpers.pihole_pause_durations).toContain("temporizada pelo backend");
    expect(brazilianPortugueseHelpers.pihole_pause_durations).toContain("após fechar o navegador");
    expect(brazilianPortugueseHelpers.pihole_pause_durations).toContain("visivelmente desabilitadas");
    expect(brazilianPortugueseHelpers.pihole_pause_service)
      .toContain("nunca recorre a um desligamento permanente nem a um temporizador no navegador");
    expect(brazilianPortugueseHelpers.pihole_metrics).toContain("nunca são substituídos por zero");
    expect(brazilianPortugueseHelpers.pihole_duration_field).toContain("são preservados");
    expect(brazilianPortugueseHelpers.upcoming_hide_empty).toContain("erro explícito");
    expect(brazilianPortugueseHelpers.upcoming_text_template)
      .toContain("Nenhum JavaScript, HTML ou Jinja é executado");
    expect(brazilianPortugueseHelpers.remote_transport).toContain("somente para uma TV Samsung detectada");
    expect(brazilianPortugueseHelpers.remote_entity).toContain("Nunca envia comandos");
    expect(brazilianPortugueseHelpers.remote_device).toContain("não um ID de dispositivo");
    expect(brazilianPortugueseHelpers.remote_double_tap).toContain("sem um comando extra");
    expect(brazilianPortugueseHelpers.room_brightness_entity)
      .toContain("primeiro a luz principal, depois a luz de destaque");
    expect(brazilianPortugueseHelpers.label_use_temperature).toContain("têm prioridade");
    expect(brazilianPortugueseHelpers.volume_controls)
      .toContain("Controles não suportados pela entidade são ocultados");
    expect(brazilianPortugueseHelpers.collapsible_controls)
      .toContain("Entidades desconhecidas e indisponíveis não podem ser controladas");
    expect(brazilianPortugueseHelpers.ulm_card_media_player_power_button)
      .toContain("não corta a alimentação do alto-falante");
    expect(brazilianPortugueseHelpers.ulm_card_media_player_power_button)
      .toContain("mantido quando os outros controles estão recolhidos");
    expect(brazilianPortugueseHelpers.ulm_card_media_player_enable_volume_adjust)
      .toContain("exige suporte à definição de volume");
    expect(brazilianPortugueseHelpers.carousel_scrollbar).toContain("não ativa a entidade");
    expect(brazilianPortugueseLabels[
      "ui.runtime_content_name_icon_and_icon_color_accept_home_assistant_jinja_templates_templates_run_in_home_assistant_not_in_the_browser_errors_are_shown_on_the_button_preview_f15200eb"
    ]).toContain("no Home Assistant, não no navegador");
    expect(brazilianPortugueseLabels[
      "ui.runtime_group_membership_icon_and_actions_stay_native_add_an_entity_button_for_a_custom_icon_name_or_action_04800467"
    ]).toContain("permanecem nativos");
    expect(brazilianPortugueseLabels[
      "ui.runtime_use_the_native_editor_above_for_area_appearance_features_and_standard_domain_groups_edit_advanced_buttons_below_action_template_and_conditional_buttons_are_intentionally_hidden_from_native_control_lists_names_and_content_appear_below_icons_aligned_to_the_button_bottom_empty_controls_show_no_controls_automatic_controls_retain_home_assistant_defaults_8ead6f08"
    ]).toContain("Controles vazios não exibem controles; os automáticos mantêm os padrões");
  });
});
