import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import {
  traditionalChineseHelpers,
  traditionalChineseLabels,
} from "../src/translations/zh-Hant";

const labels = { ...translationCatalogs["zh-Hant"], ...traditionalChineseLabels };
const helpers = { ...helperCatalogs["zh-Hant"], ...traditionalChineseHelpers };
const catalogs = [
  [translationCatalogs.en, translationCatalogs["zh-Hant"], traditionalChineseLabels, labels, 770],
  [englishHelpers, helperCatalogs["zh-Hant"], traditionalChineseHelpers, helpers, 575],
] as const;
const technicalTerms = new Set(["ui.renderer.CPU", "ui.renderer.RAM", "ui.renderer.Ping"]);

describe("complete Traditional Chinese localization", () => {
  it("covers the exact complete English inventory and placeholder multisets", () => {
    for (const [english, , additions, merged, missingCount] of catalogs) {
      expect(Object.keys(additions)).toHaveLength(missingCount);
      expect(Object.keys(merged).sort()).toEqual(Object.keys(english).sort());
      for (const [key, source] of Object.entries(english)) {
        expect(merged[key]?.trim(), key).toBeTruthy();
        expect(placeholders(merged[key]), key).toEqual(placeholders(source));
      }
    }
    expect(Object.keys(labels)).toHaveLength(1186);
    expect(Object.keys(helpers)).toHaveLength(576);
  });

  it("adds only missing keys and preserves the entire installed baseline before and after wiring", () => {
    for (const [english, baseline, additions, merged] of catalogs) {
      for (const [key, original] of Object.entries(baseline)) {
        expect(merged[key], key).toBe(original);
      }
      // Excluding the additions recovers the installed baseline even after central wiring.
      const installed = Object.fromEntries(
        Object.entries(baseline).filter(([key]) => !Object.hasOwn(additions, key)),
      );
      expect(Object.keys(additions).sort()).toEqual(
        Object.keys(english).filter(key => !Object.hasOwn(installed, key)).sort(),
      );
      expect(Object.keys(additions).filter(key => !Object.hasOwn(english, key))).toEqual([]);
    }
    const installedLabels = Object.entries(translationCatalogs["zh-Hant"])
      .filter(([key]) => !Object.hasOwn(traditionalChineseLabels, key) && !key.startsWith("ui.graph."))
      .sort();
    expect(installedLabels).toHaveLength(413);
    expect(createHash("sha256").update(JSON.stringify(installedLabels)).digest("hex")).toBe(
      "69750342d5679edf5a522371d468887fd18acd31b625cb9d5a8aa5bb1ebb4098",
    );
    expect(Object.fromEntries(
      Object.entries(helperCatalogs["zh-Hant"])
        .filter(([key]) => !Object.hasOwn(traditionalChineseHelpers, key)),
    )).toEqual({ entity: "此卡片顯示及控制的 Home Assistant 實體。" });
    expect(traditionalChineseLabels).not.toHaveProperty("entity");
    expect(traditionalChineseHelpers).not.toHaveProperty("entity");
  });

  it("uses Chinese text rather than blank or English-filled fallback values", () => {
    for (const [english, , , merged] of catalogs) {
      for (const [key, translated] of Object.entries(merged)) {
        expect(translated, key).toBe(translated.trim());
        if (technicalTerms.has(key)) {
          expect(translated, key).toBe(english[key]);
        } else {
          expect(translated, key).not.toBe(english[key]);
          expect(translated, key).toMatch(/\p{Script=Han}/u);
        }
      }
    }
  });

  it("retains literal identifiers, protocols, examples, raw options, units and limits", () => {
    const examples: Record<string, string[]> = {
      upcoming_data_attribute: ["data", "JSON"],
      upcoming_text_template: [
        "$title", "$episode", "$number", "$rating", "$runtime", "$release", "$day",
        "$date", "$time", "$studio", "$empty", "JavaScript", "HTML", "Jinja",
      ],
      upcoming_url: ["https://www.themoviedb.org/tv/$tmdb_id", "HTTP(S)", "URL"],
      upcoming_group_value: ["flag = true"],
      upcoming_date_format: ["dd", "mm", "yy", "yyyy", "Home Assistant"],
      remote_transport: ["remote.send_command", "play_media / send_key", "Samsung"],
      remote_device: ["device", "remote.send_command", "Home Assistant", "ID"],
      remote_swipe_distance: ["Enter", "Space", "Backspace", "Home"],
      remote_double_tap: ["Select"],
      pihole_device_ids: ["v5", "v6"],
      pihole_pause_durations: ["30s", "5m", "1h30m", "1h:30m:15s"],
      pihole_pause_service: ["disable"],
      pihole_chart_metrics: ["Recorder", "CPU", "Pi-hole API"],
      cartridges: ["label, entity_id, type", "CSS"],
      ulm_button_service: ["domain.service"],
      ulm_card_welcome_collapse: ["input_boolean"],
      lower_bound: ["~20"],
      upper_bound: ["~25"],
      lower_bound_secondary: ["~"],
      upper_bound_secondary: ["~"],
      graph_span: ["1d", "YAML"],
      height: ["SVG"],
      value_factor: ["-3"],
      buy_sell_trade_energy_entity: ["kWh"],
      buy_sell_feed_in_fee: ["kWh"],
      tariff_markup_entity: ["kWh"],
      ulm_card_media_player_enable_volume_adjust: ["0.01", "0.05 = 5%"],
      ulm_card_media_player_idle_off: ["idle"],
      carousel_button_width: ["32-160"],
      carousel_button_height: ["32-160"],
      carousel_icon_size: ["12-96"],
      carousel_effect: ["Coverflow", "Slide", "Fade", "Cube", "Flip"],
      carousel_visible_items: ["3", "11"],
      ulm_custom_card_window_handle: ["Closed", "Tilted", "Open"],
      ulm_card_battery_charger_type_entity_id: ["wireless", "AC", "USB", "charging"],
      ulm_custom_card_washer_remote_control: ["true", "on"],
      ulm_custom_card_washer_job_states: ["5", "Material Design"],
      battery_warning_threshold: ["50%"],
      battery_low_threshold: ["20%"],
      battery_critical_threshold: ["10%"],
      show_grid_phases: ["L1", "L2", "L3"],
      mode_solar_first_label: ["Smart Matching"],
      mode_smart_saving_label: ["Dynamic Smart Matching"],
      mode_smart_trading_label: ["Dynamic Trading + Smart Matching"],
      moon_altitude_entity: ["Astronomy Space Suite"],
      console_platform: ["Xbox", "PlayStation", "Nintendo"],
      room_brightness_entity: ["brightness"],
      room_light_entity: ["RGB"],
    };
    for (const kind of ["lights", "shutters", "outlets", "tv"]) {
      examples[`${kind}_hold_action`] = ["500 ms"];
    }
    for (const [key, literals] of Object.entries(examples)) {
      for (const literal of literals) expect(helpers[key], `${key}: ${literal}`).toContain(literal);
    }
    expect(labels["ui.area.attribute_help"]).toContain("brightness");
    expect(labels["ui.area.attribute_help"]).toContain("battery_level");
    expect(labels["ui.area.content_help"]).toContain("Desk lights");
    expect(labels["ui.runtime_optional_nested_path_such_as_battery_level_30fc3244"]).toContain("battery.level");
    expect(labels["ui.runtime_use_playlist_for_spotify_playlist_ids_or_another_media_type_supported_by_your_player_c0de82c4"]).toContain("playlist");
    expect(labels["ui.runtime_select_panel_sensors_in_the_card_editor_or_add_sensors_with_entity_ids_beginning_with_sensor_inverter_4_1ba7d684"]).toContain("sensor.inverter_4");
    for (const [english, , additions] of catalogs) {
      for (const [key, translated] of Object.entries(additions)) {
        const numericLiterals = english[key].match(/(?<![a-zA-Z_])\d+(?:\.\d+)?/g) ?? [];
        for (const literal of numericLiterals) expect(translated, `${key}: ${literal}`).toContain(literal);
      }
    }
  });

  it("preserves backend pause timing, invalid entries, unavailable values and explicit error cases", () => {
    expect(helpers.pihole_pause_durations).toContain("暫停由後端計時");
    expect(helpers.pihole_pause_durations).toContain("關閉瀏覽器後仍然有效");
    expect(helpers.pihole_pause_durations).toContain("無效條目保持可見但被停用");
    expect(helpers.pihole_pause_service).toContain("絕不會退回為永久關閉開關");
    expect(helpers.pihole_pause_service).toContain("不會使用瀏覽器計時器");
    expect(helpers.pihole_duration_field).toContain("其他已設定的動作資料維持不變");
    expect(helpers.pihole_metrics).toContain("缺失或不可用的對映值絕不會替換為零");
    expect(helpers.upcoming_hide_empty).toContain("JSON 無效和資料不可用時仍顯示明確錯誤");
    expect(helpers.upcoming_trailers).toContain("不會自動載入任何預告片");
    expect(helpers.upcoming_text_template).toContain("不會執行 JavaScript、HTML 或 Jinja");
    expect(helpers.upcoming_filter_attribute).toContain("選擇或輸入項目屬性");
    expect(helpers.upcoming_filter_attribute).toContain("清空此欄位可停止篩選");
    expect(helpers.upcoming_overflow).toContain("啟用時忽略摺疊設定");
    expect(helpers.remote_entity).toContain("絕不會向無關房間的遙控器傳送命令");
    expect(helpers.remote_transport).toContain("不會假定普通播放器支援 Samsung 程式碼");
    expect(helpers.remote_double_tap).toContain("不會額外傳送 Select");
  });

  it("keeps supported controls, device-only actions and sensible picker defaults", () => {
    expect(helpers.carousel_scrollbar).toContain("選擇位置不會啟用實體");
    expect(helpers.ulm_card_media_player_power_button).toContain("不會切斷喇叭電源");
    expect(helpers.ulm_card_media_player_power_button).toContain("其他控制摺疊時仍保留");
    expect(helpers.collapsible_controls).toContain("未知和不可用的實體無法控制");
    expect(helpers.volume_controls).toContain("隱藏實體不支援的控制");
    expect(helpers.climate_name).toContain("不會更改主實體標題");
    expect(helpers.room_temperature_entity).toContain("具有溫度單位的數值溫度");
    expect(helpers.room_brightness_entity).toContain("預設先使用主燈光");
    expect(helpers.icon).toContain("清空則跟隨實體在 Home Assistant 中的圖示");
    expect(helpers.moon_entity).toContain("留空時自動發現 Home Assistant 的 Moon 整合");
    for (const kind of ["lights", "shutters", "outlets", "tv"]) {
      expect(helpers[`${kind}_tap_action`]).toContain("僅此裝置");
      expect(helpers[`${kind}_hold_action`]).toContain("500 ms");
      expect(helpers[`${kind}_double_tap_action`]).toContain("不會同時執行單擊操作");
    }
  });

  it("uses appropriate Traditional Chinese UI vocabulary and retains native Area limitations", () => {
    expect(labels.room_status_choose_entity).toBe("選擇實體");
    expect(labels.window_sensor).toBe("窗戶感測器");
    expect(labels.audio_delay_entity).toBe("音訊延遲控制");
    expect(labels.memory_entity).toContain("記憶體");
    expect(labels.findmy_script_entity).toBe("尋找手機腳本");
    expect(labels.conductivity_entity).toBe("電導度感測器");
    expect(labels.dli_entity).toBe("每日光照積分感測器");
    expect(labels["ui.renderer.GRID"]).toBe("電網");
    expect(labels["ui.renderer.GRID · Import"]).toContain("購電");
    expect(labels["ui.renderer.GRID · Export"]).toContain("上網");
    expect(labels["ui.runtime_columns_53aade77"]).toBe("欄數");
    expect(labels["ui.area.kind_template"]).toBe("範本");
    expect(helpers.pihole_duration_field).toContain("參數名稱");
    for (const translated of [
      ...Object.values(traditionalChineseLabels),
      ...Object.values(traditionalChineseHelpers),
    ]) {
      expect(translated).not.toMatch(/软件|代码|字段|传感器|实体|电网|音频|運算元據|專案|總髮電|滑塊|模板/);
    }
    expect(labels["ui.area.sensor_icons_help"]).toContain("仍由 Home Assistant 控制");
    expect(labels["ui.area.use_light_color_help"]).toContain("已排除的燈光不會被使用");
    expect(labels["ui.runtime_group_membership_icon_and_actions_stay_native_add_an_entity_button_for_a_custom_icon_name_or_action_04800467"]).toContain("保持原生行為");
    expect(labels["ui.runtime_conditions_use_home_assistant_s_native_conditional_card_including_nested_conditions_1b7643b4"]).toContain("支援巢狀條件");
    const template = labels["ui.runtime_content_name_icon_and_icon_color_accept_home_assistant_jinja_templates_templates_run_in_home_assistant_not_in_the_browser_errors_are_shown_on_the_button_preview_f15200eb"];
    expect(template).toContain("不是在瀏覽器中執行");
    expect(template).toContain("錯誤會顯示在按鈕預覽中");
    const advanced = labels["ui.runtime_use_the_native_editor_above_for_area_appearance_features_and_standard_domain_groups_edit_advanced_buttons_below_action_template_and_conditional_buttons_are_intentionally_hidden_from_native_control_lists_names_and_content_appear_below_icons_aligned_to_the_button_bottom_empty_controls_show_no_controls_automatic_controls_retain_home_assistant_defaults_8ead6f08"];
    expect(advanced).toContain("不顯示在原生控制清單中");
    expect(advanced).toContain("空控制清單不顯示控制");
    expect(advanced).toContain("自動控制保留 Home Assistant 預設設定");
  });
});
