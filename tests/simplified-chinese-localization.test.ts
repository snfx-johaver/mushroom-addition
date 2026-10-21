import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { runtimeEnglishLabels } from "../src/translations/runtime";
import {
  simplifiedChineseHelpers,
  simplifiedChineseLabels,
} from "../src/translations/zh-Hans";

const labels = { ...translationCatalogs["zh-Hans"], ...simplifiedChineseLabels };
const helpers = { ...helperCatalogs["zh-Hans"], ...simplifiedChineseHelpers };
const technicalTerms = new Set(["ui.renderer.CPU", "ui.renderer.RAM", "ui.renderer.Ping"]);
const catalogs = [
  [translationCatalogs.en, translationCatalogs["zh-Hans"], simplifiedChineseLabels, labels],
  [englishHelpers, helperCatalogs["zh-Hans"], simplifiedChineseHelpers, helpers],
] as const;

describe("complete Simplified Chinese localization", () => {
  it("covers exactly the English inventory with matching placeholder multisets", () => {
    for (const [english, , , merged] of catalogs) {
      expect(Object.keys(merged).sort()).toEqual(Object.keys(english).sort());
      for (const [key, source] of Object.entries(english)) {
        expect(merged[key]?.trim(), key).toBeTruthy();
        expect(placeholders(merged[key]), key).toEqual(placeholders(source));
      }
    }
    for (const key of Object.keys(runtimeEnglishLabels)) {
      expect(labels[key]?.trim(), key).toBeTruthy();
    }
    for (const key of Object.keys(translationCatalogs.en).filter(key => key.startsWith("ui.area."))) {
      expect(labels[key]?.trim(), key).toBeTruthy();
    }
  });

  it("adds only missing keys and retains installed translations, also after integration", () => {
    for (const [english, baseline, additions, merged] of catalogs) {
      for (const [key, original] of Object.entries(baseline)) {
        expect(merged[key], key).toBe(original);
      }
      // Removing this module's keys also works once localize.ts wires the module in.
      const installed = Object.fromEntries(
        Object.entries(baseline).filter(([key]) => !Object.hasOwn(additions, key)),
      );
      expect(Object.keys(additions).sort()).toEqual(
        Object.keys(english).filter(key => !Object.hasOwn(installed, key)).sort(),
      );
      for (const key of Object.keys(additions)) expect(english[key], key).toBeDefined();
    }
    expect(labels.entity).toBe("实体");
    expect(labels.secondary).toBe("自定义次要信息");
    expect(labels.variant).toBe("卡片样式");
    expect(helpers.entity).toBe("此卡片显示和控制的 Home Assistant 实体。");
    expect(simplifiedChineseLabels).not.toHaveProperty("entity");
    expect(simplifiedChineseHelpers).not.toHaveProperty("entity");
  });

  it("contains Chinese rather than English-filled entries except unchanged technical terms", () => {
    for (const [english, , , merged] of catalogs) {
      for (const [key, translated] of Object.entries(merged)) {
        if (technicalTerms.has(key)) {
          expect(translated, key).toBe(english[key]);
        } else {
          expect(translated, key).not.toBe(english[key]);
          expect(translated, key).toMatch(/\p{Script=Han}/u);
        }
      }
    }
  });

  it("preserves code, service names, protocols, examples, units and limits", () => {
    const literals: Record<string, string[]> = {
      upcoming_data_attribute: ["data", "JSON"],
      upcoming_text_template: [
        "$title", "$episode", "$number", "$rating", "$runtime", "$release", "$day",
        "$date", "$time", "$studio", "$empty", "JavaScript", "HTML", "Jinja",
      ],
      upcoming_url: ["https://www.themoviedb.org/tv/$tmdb_id", "HTTP(S)", "URL"],
      upcoming_group_value: ["flag = true"],
      upcoming_date_format: ["dd", "mm", "yy", "yyyy", "Home Assistant"],
      remote_transport: ["remote.send_command", "play_media / send_key", "Samsung"],
      remote_device: ["remote.send_command", "Home Assistant"],
      remote_swipe_distance: ["Enter", "Space", "Backspace", "Home"],
      remote_double_tap: ["Select"],
      pihole_device_ids: ["v5", "v6"],
      pihole_pause_durations: ["30s", "5m", "1h30m", "1h:30m:15s"],
      pihole_pause_service: ["disable"],
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
      carousel_button_width: ["32-160"],
      carousel_button_height: ["32-160"],
      carousel_icon_size: ["12-96"],
      carousel_effect: ["Coverflow", "Slide", "Fade", "Cube", "Flip"],
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
    };
    for (const kind of ["lights", "shutters", "outlets", "tv"]) {
      literals[`${kind}_hold_action`] = ["500 ms"];
    }
    for (const [key, examples] of Object.entries(literals)) {
      for (const example of examples) expect(helpers[key], `${key}: ${example}`).toContain(example);
    }
    expect(labels["ui.area.attribute_help"]).toContain("brightness");
    expect(labels["ui.area.attribute_help"]).toContain("battery_level");
    expect(labels["ui.area.content_help"]).toContain("Desk lights");
    expect(labels["ui.runtime_optional_nested_path_such_as_battery_level_30fc3244"]).toContain("battery.level");
    expect(labels["ui.runtime_use_playlist_for_spotify_playlist_ids_or_another_media_type_supported_by_your_player_c0de82c4"]).toContain("playlist");
    expect(labels["ui.runtime_select_panel_sensors_in_the_card_editor_or_add_sensors_with_entity_ids_beginning_with_sensor_inverter_4_1ba7d684"]).toContain("sensor.inverter_4");
  });

  it("keeps backend timing, error cases, picker behavior and action constraints", () => {
    expect(helpers.pihole_pause_durations).toContain("暂停由后端计时");
    expect(helpers.pihole_pause_durations).toContain("关闭浏览器后仍然有效");
    expect(helpers.pihole_pause_durations).toContain("无效条目保持可见但被禁用");
    expect(helpers.pihole_pause_service).toContain("绝不会退回为永久关闭开关");
    expect(helpers.pihole_pause_service).toContain("不会使用浏览器计时器");
    expect(helpers.pihole_metrics).toContain("缺失或不可用的映射值绝不会替换为零");
    expect(helpers.upcoming_hide_empty).toContain("JSON 无效和数据不可用时仍显示明确错误");
    expect(helpers.upcoming_trailers).toContain("不会自动加载任何预告片");
    expect(helpers.upcoming_text_template).toContain("不会执行 JavaScript、HTML 或 Jinja");
    expect(helpers.upcoming_filter_attribute).toContain("选择或输入项目属性");
    expect(helpers.upcoming_filter_attribute).toContain("清空此字段可停止筛选");
    expect(helpers.upcoming_overflow).toContain("启用时忽略折叠设置");
    expect(helpers.remote_entity).toContain("绝不会向无关房间的遥控器发送命令");
    expect(helpers.remote_transport).toContain("不会假定普通播放器支持 Samsung 代码");
    expect(helpers.remote_double_tap).toContain("不会额外发送 Select");
    expect(helpers.carousel_scrollbar).toContain("选择位置不会激活实体");
    expect(helpers.ulm_card_media_player_power_button).toContain("不会切断音箱电源");
    expect(helpers.ulm_card_media_player_power_button).toContain("其他控制折叠时仍保留");
    expect(helpers.collapsible_controls).toContain("未知和不可用的实体无法控制");
    expect(helpers.volume_controls).toContain("隐藏实体不支持的控制");
    expect(helpers.climate_name).toContain("不会更改主实体标题");
    expect(helpers.room_temperature_entity).toContain("具有温度单位的数值温度");
  });

  it("retains native Area limitations and uses correct entity, grid and collapse terminology", () => {
    expect(labels.room_status_choose_entity).toBe("选择实体");
    expect(labels.collapse_entity).toContain("折叠");
    expect(labels["ui.renderer.GRID"]).toBe("电网");
    expect(labels["ui.renderer.GRID · Import"]).toContain("购电");
    expect(labels["ui.renderer.GRID · Export"]).toContain("上网");
    expect(labels["ui.renderer.weak_panel"]).toContain("遮挡或故障");
    expect(labels["ui.area.sensor_icons_help"]).toContain("仍由 Home Assistant 控制");
    expect(labels["ui.area.use_light_color_help"]).toContain("已排除的灯光不会被使用");
    expect(labels["ui.runtime_group_membership_icon_and_actions_stay_native_add_an_entity_button_for_a_custom_icon_name_or_action_04800467"]).toContain("保持原生行为");
    expect(labels["ui.runtime_conditions_use_home_assistant_s_native_conditional_card_including_nested_conditions_1b7643b4"]).toContain("支持嵌套条件");
    const template = labels["ui.runtime_content_name_icon_and_icon_color_accept_home_assistant_jinja_templates_templates_run_in_home_assistant_not_in_the_browser_errors_are_shown_on_the_button_preview_f15200eb"];
    expect(template).toContain("不是在浏览器中运行");
    expect(template).toContain("错误会显示在按钮预览中");
    const advanced = labels["ui.runtime_use_the_native_editor_above_for_area_appearance_features_and_standard_domain_groups_edit_advanced_buttons_below_action_template_and_conditional_buttons_are_intentionally_hidden_from_native_control_lists_names_and_content_appear_below_icons_aligned_to_the_button_bottom_empty_controls_show_no_controls_automatic_controls_retain_home_assistant_defaults_8ead6f08"];
    expect(advanced).toContain("不显示在原生控制列表中");
    expect(advanced).toContain("空控制列表不显示控制");
    expect(advanced).toContain("自动控制保留 Home Assistant 默认设置");
  });
});
