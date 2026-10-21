import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { koreanHelpers, koreanLabels } from "../src/translations/ko-KR";

const catalogs = [
  {
    english: translationCatalogs.en,
    baseline: translationCatalogs["ko-KR"],
    additions: koreanLabels,
    addedCount: 762,
    installedCount: 416,
    installedHash: "e5c5d8917c6134af96b0aea8623440989c87931d97d1a4a444d831ecfa121747",
  },
  {
    english: englishHelpers,
    baseline: helperCatalogs["ko-KR"],
    additions: koreanHelpers,
    addedCount: 547,
    installedCount: 1,
    installedHash: "2d3dcaee1b0a9c12432e107306b7b0efdf70d01cc9ba62051e9d3543102467a4",
  },
] as const;

describe("complete Korean card translations", () => {
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
    expect(Object.keys(koreanLabels).filter((key) => key.startsWith("ui.graph."))).toEqual([]);
  });

  it("preserves installed Korean entries and keeps the diagnostic namespace separate", () => {
    for (const { baseline, additions, installedHash } of catalogs) {
      const installed = Object.entries(baseline)
        .filter(([key]) => !Object.hasOwn(additions, key))
        .sort(([a], [b]) => a.localeCompare(b));
      expect(createHash("sha256").update(JSON.stringify(installed)).digest("hex"))
        .toBe(installedHash);
      const merged = { ...baseline, ...additions };
      for (const [key, original] of Object.entries(baseline)) {
        expect(merged[key], key).toBe(original);
      }
    }
    expect(koreanLabels).not.toHaveProperty("entity");
    expect(koreanHelpers).not.toHaveProperty("entity");
    expect(Object.keys(koreanLabels).length + Object.keys(koreanHelpers).length).toBe(1309);
    expect(Object.keys(translationCatalogs.en).length + Object.keys(englishHelpers).length + 6)
      .toBe(1732);
  });

  it("uses original Korean wording and retains numeric examples and technical units", () => {
    const sharedTechnicalTerms = new Set(["ui.renderer.CPU", "ui.renderer.RAM"]);
    const numbers = (value: string): string[] => value.match(/-?\d+(?:\.\d+)?/g) ?? [];
    for (const { english, additions } of catalogs) {
      for (const [key, value] of Object.entries(additions)) {
        expect(english[key], key).toBeDefined();
        if (!sharedTechnicalTerms.has(key)) expect(value, key).not.toBe(english[key]);
        expect(placeholders(value), key).toEqual(placeholders(english[key]));
        const originalNumbers = numbers(english[key]);
        expect(numbers(value).filter((number) => originalNumbers.includes(number)).sort(), key)
          .toEqual(originalNumbers.sort());
        const units = english[key].match(/€\/kWh|\bkWh\b|\bkW\b|\bW\b|\bms\b|%/g) ?? [];
        for (const unit of units) expect(value, `${key}: ${unit}`).toContain(unit);
      }
    }
    expect(koreanHelpers.carousel_button_width).toContain("32-160");
    expect(koreanHelpers.carousel_icon_size).toContain("12-96");
    expect(koreanHelpers.ulm_card_media_player_enable_volume_adjust).toContain("0.05 = 5%");
    expect(koreanHelpers.battery_warning_threshold).toContain("50%");
    expect(koreanHelpers.battery_low_threshold).toContain("20%");
    expect(koreanHelpers.battery_critical_threshold).toContain("10%");
  });

  it("preserves raw configuration literals, service names, protocols, and examples", () => {
    const helperLiterals: Record<string, string[]> = {
      upcoming_data_attribute: ["JSON", "data"],
      upcoming_text_template: [
        "$title", "$episode", "$number", "$rating", "$runtime", "$release",
        "$day", "$date", "$time", "$studio", "$empty", "JavaScript", "HTML", "Jinja",
      ],
      upcoming_url: ["https://www.themoviedb.org/tv/$tmdb_id", "HTTP(S)"],
      upcoming_group_value: ["flag = true"],
      upcoming_date_format: ["dd", "mm", "yy", "yyyy", "Home Assistant"],
      remote_transport: ["remote.send_command", "play_media / send_key", "Samsung"],
      remote_device: ["remote.send_command", "IR", "Home Assistant"],
      remote_swipe_distance: ["Enter", "Space", "Backspace", "Home"],
      remote_double_tap: ["Select"],
      pihole_device_ids: ["v5", "v6"],
      pihole_pause_durations: ["30s", "5m", "1h30m", "1h:30m:15s"],
      pihole_chart_metrics: ["Mini Graph", "CPU", "Pi-hole"],
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
      for (const literal of literals) expect(koreanHelpers[key], key).toContain(literal);
    }
    expect(koreanLabels["ui.area.attribute_help"]).toContain("brightness");
    expect(koreanLabels["ui.area.attribute_help"]).toContain("battery_level");
    expect(koreanLabels["ui.area.content_help"]).toContain("Desk lights");
    expect(koreanLabels[
      "ui.runtime_optional_nested_path_such_as_battery_level_30fc3244"
    ]).toContain("battery.level");
    expect(koreanLabels[
      "ui.runtime_select_panel_sensors_in_the_card_editor_or_add_sensors_with_entity_ids_beginning_with_sensor_inverter_4_1ba7d684"
    ]).toContain("sensor.inverter_4");
    expect(koreanLabels[
      "ui.runtime_use_playlist_for_spotify_playlist_ids_or_another_media_type_supported_by_your_player_c0de82c4"
    ]).toContain("playlist");
    const example = koreanLabels["ui.renderer.example"].replace("{value}", "spotify:playlist:PLAYLIST_ID");
    expect(example).toBe("예: spotify:playlist:PLAYLIST_ID");
  });

  it("keeps backend timing, explicit errors, and supported-action constraints clear", () => {
    expect(koreanHelpers.pihole_pause_durations).toContain("백엔드에서 시간을 관리");
    expect(koreanHelpers.pihole_pause_durations).toContain("브라우저를 닫아도 유지");
    expect(koreanHelpers.pihole_pause_durations).toContain("비활성 상태로 표시");
    expect(koreanHelpers.pihole_pause_service)
      .toContain("영구적인 스위치 끄기나 브라우저 타이머로 대체되지 않습니다");
    expect(koreanHelpers.pihole_metrics).toContain("0으로 대체하지 않습니다");
    expect(koreanHelpers.pihole_duration_field).toContain("다른 동작 데이터는 그대로 유지");
    expect(koreanHelpers.upcoming_hide_empty).toContain("명시적인 오류");
    expect(koreanHelpers.buy_sell_trade_energy_entity).toContain("오류로 표시");
    expect(koreanHelpers.upcoming_text_template).toContain("JavaScript, HTML 또는 Jinja는 실행되지 않습니다");
    expect(koreanHelpers.remote_transport).toContain("감지된 Samsung TV에서만");
    expect(koreanHelpers.remote_entity).toContain("다른 방의 리모컨에는 명령을 보내지 않습니다");
    expect(koreanHelpers.remote_device).toContain("기기 ID가 아니라 명령에 사용하는 기기 이름");
    expect(koreanHelpers.remote_double_tap).toContain("Select를 추가로 보내지 않습니다");
    expect(koreanHelpers.room_brightness_entity).toContain("기본 조명을 우선");
    expect(koreanHelpers.volume_controls).toContain("지원하지 않는 제어 항목은 숨기며");
    expect(koreanHelpers.media_controls).toContain("엔티티가 지원하는 제어 항목만 표시");
    expect(koreanHelpers.collapsible_controls).toContain("제어할 수 없습니다");
    expect(koreanHelpers.ulm_card_media_player_power_button).toContain("전원을 차단하지 않고");
    expect(koreanHelpers.ulm_card_media_player_power_button).toContain("다른 제어를 접어도");
    expect(koreanHelpers.ulm_card_media_player_enable_volume_adjust).toContain("음량 설정을 지원해야 합니다");
    expect(koreanHelpers.carousel_scrollbar).toContain("엔티티를 활성화하지 않습니다");
  });

  it("preserves native Area ownership, template errors, and automatic controls", () => {
    expect(koreanLabels[
      "ui.runtime_content_name_icon_and_icon_color_accept_home_assistant_jinja_templates_templates_run_in_home_assistant_not_in_the_browser_errors_are_shown_on_the_button_preview_f15200eb"
    ]).toContain("브라우저가 아니라 Home Assistant에서 실행");
    expect(koreanLabels[
      "ui.runtime_content_name_icon_and_icon_color_accept_home_assistant_jinja_templates_templates_run_in_home_assistant_not_in_the_browser_errors_are_shown_on_the_button_preview_f15200eb"
    ]).toContain("오류는 버튼 미리보기에 표시");
    expect(koreanLabels[
      "ui.runtime_group_membership_icon_and_actions_stay_native_add_an_entity_button_for_a_custom_icon_name_or_action_04800467"
    ]).toContain("그룹 구성, 아이콘 및 동작은 기본 설정을 따릅니다");
    expect(koreanLabels[
      "ui.runtime_use_the_native_editor_above_for_area_appearance_features_and_standard_domain_groups_edit_advanced_buttons_below_action_template_and_conditional_buttons_are_intentionally_hidden_from_native_control_lists_names_and_content_appear_below_icons_aligned_to_the_button_bottom_empty_controls_show_no_controls_automatic_controls_retain_home_assistant_defaults_8ead6f08"
    ]).toContain("자동 제어는 Home Assistant 기본값을 유지");
    expect(koreanLabels["ui.area.sensor_icons_help"]).toContain("Home Assistant에서 계속 관리");
    expect(koreanLabels["ui.area.use_light_color_help"]).toContain("제외된 조명은 무시");
  });
});
