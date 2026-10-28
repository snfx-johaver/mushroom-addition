import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { russianHelpers, russianLabels } from "../src/translations/ru";

const catalogs = [
  { english: translationCatalogs.en, baseline: translationCatalogs.ru, additions: russianLabels, installed: 416, added: 763 },
  { english: englishHelpers, baseline: helperCatalogs.ru, additions: russianHelpers, installed: 1, added: 548 },
];

describe("complete Russian card localization", () => {
  it("adds exactly the missing keys, both before and after integration", () => {
    for (const { english, baseline, additions, installed: count, added } of catalogs) {
      const installed = Object.fromEntries(
        Object.entries(baseline).filter(([key]) => !Object.hasOwn(additions, key)),
      );
      expect(Object.keys(installed)).toHaveLength(count);
      expect(Object.keys(additions)).toHaveLength(added);
      expect(Object.keys(additions).sort()).toEqual(
        Object.keys(english).filter(key => !Object.hasOwn(installed, key)).sort(),
      );
      const complete = { ...installed, ...additions };
      expect(Object.keys(complete).sort()).toEqual(Object.keys(english).sort());
      for (const [key, original] of Object.entries(english)) {
        expect(complete[key]?.trim(), key).toBeTruthy();
        expect(placeholders(complete[key]), key).toEqual(placeholders(original));
      }
    }
  });

  it("preserves installed Russian translations and their ownership", () => {
    for (const { baseline, additions } of catalogs) {
      const complete = { ...baseline, ...additions };
      for (const [key, original] of Object.entries(baseline)) {
        if (!Object.hasOwn(additions, key)) expect(complete[key], key).toBe(original);
        else expect(additions[key], key).toBe(original);
      }
    }
    expect(translationCatalogs.ru.entity).toBe("Сущность");
    expect(translationCatalogs.ru.secondary).toBe("Свои дополнительные сведения");
    expect(translationCatalogs.ru.variant).toBe("Стиль карточки");
    expect(helperCatalogs.ru.entity).toBe(
      "Сущность Home Assistant, которую показывает и которой управляет эта карточка.",
    );
    expect(Object.hasOwn(russianLabels, "entity")).toBe(false);
    expect(Object.hasOwn(russianHelpers, "entity")).toBe(false);
  });

  it("contains original Russian prose, not English fallback or empty values", () => {
    const technicalTerms = new Set(["ui.renderer.CPU", "ui.renderer.RAM", "ui.renderer.Ping"]);
    for (const { english, additions } of catalogs) {
      for (const [key, translated] of Object.entries(additions)) {
        expect(translated.trim(), key).toBeTruthy();
        expect(english[key], key).toBeDefined();
        if (technicalTerms.has(key)) {
          expect(translated, key).toBe(english[key]);
        } else {
          expect(translated, key).not.toBe(english[key]);
          expect(translated, key).toMatch(/[А-Яа-яЁё]/u);
        }
      }
    }
  });

  it("retains every number, placeholder, technical path and explicit literal", () => {
    const numbers = (text: string) => (text.match(/-?\d+(?:\.\d+)?/g) ?? []).sort();
    const units = (text: string) => (text.match(/€\/kWh|\bkWh\b|\bkW\b|\bW\b|\bms\b|%/g) ?? []).sort();
    for (const { english, additions } of catalogs) {
      for (const [key, translated] of Object.entries(additions)) {
        expect(numbers(translated), key).toEqual(numbers(english[key]));
        expect(units(translated), key).toEqual(units(english[key]));
        expect(placeholders(translated), key).toEqual(placeholders(english[key]));
        const paths = english[key].match(/\b[a-z]\w*(?:[._][a-z]\w*)+\b/g) ?? [];
        for (const path of paths) expect(translated, `${key}: ${path}`).toContain(path);
      }
    }
    const helperLiterals: Record<string, string[]> = {
      upcoming_data_attribute: ["data", "JSON"],
      upcoming_text_template: [
        "$title", "$episode", "$number", "$rating", "$runtime", "$release",
        "$day", "$date", "$time", "$studio", "$empty", "JavaScript", "HTML", "Jinja",
      ],
      upcoming_url: ["https://www.themoviedb.org/tv/$tmdb_id", "HTTP(S)"],
      upcoming_group_value: ["flag = true"],
      upcoming_date_format: ["dd", "mm", "yy", "yyyy"],
      remote_transport: ["remote.send_command", "Samsung", "play_media / send_key"],
      remote_device: ["IR", "remote.send_command"],
      remote_swipe_distance: ["Enter", "Space", "Backspace", "Home"],
      remote_double_tap: ["Select"],
      pihole_device_ids: ["v5", "v6"],
      pihole_pause_durations: ["30s", "5m", "1h30m", "1h:30m:15s"],
      cartridges: ["label, entity_id, type", "CSS"],
      lower_bound: ["~20"],
      upper_bound: ["~25"],
      graph_span: ["1d", "YAML"],
      ulm_button_service: ["domain.service"],
      ulm_card_welcome_collapse: ["input_boolean"],
      ulm_custom_card_washer_remote_control: ["true", "on"],
      ulm_custom_card_window_handle: ["Closed", "Tilted", "Open"],
      ulm_card_battery_charger_type_entity_id: ["wireless", "AC", "USB", "charging"],
      ulm_card_media_player_idle_off: ["idle"],
      ulm_card_media_player_enable_volume_adjust: ["0.01", "1", "0.05 = 5%"],
      carousel_effect: ["Coverflow", "Slide", "Fade", "Cube", "Flip"],
      carousel_button_width: ["32-160"],
      carousel_button_height: ["32-160"],
      carousel_icon_size: ["12-96"],
      mode_solar_first_label: ["Smart Matching"],
      mode_smart_saving_label: ["Dynamic Smart Matching"],
      mode_smart_trading_label: ["Dynamic Trading + Smart Matching"],
      show_grid_phases: ["L1", "L2", "L3"],
      battery_healthy_color: ["green"],
      battery_warning_color: ["yellow"],
      battery_low_color: ["orange"],
      battery_critical_color: ["red"],
      tariff_markup_entity: ["kWh"],
    };
    for (const [key, literals] of Object.entries(helperLiterals)) {
      for (const literal of literals) expect(russianHelpers[key], `${key}: ${literal}`).toContain(literal);
    }
    const labelLiterals: Record<string, string[]> = {
      "ui.area.attribute_help": ["brightness", "battery_level"],
      "ui.area.content_help": ["Desk lights"],
      room_part_state: ["on/off"],
      buy_sell_trade_energy: ["kWh"],
      buy_sell_trade_power: ["kW"],
      buy_sell_feed_in_fee: ["€/kWh"],
      panel_gauge_max: ["W"],
      "ui.renderer.Buy and sell moments (all-in €/kWh)": ["€/kWh"],
      "ui.runtime_drag_up_or_down_to_reorder_keyboard_alt_up_or_down_3e98c5b3": ["Alt + Up", "Down"],
    };
    for (const [key, literals] of Object.entries(labelLiterals)) {
      for (const literal of literals) expect(russianLabels[key], `${key}: ${literal}`).toContain(literal);
    }
  });

  it("distinguishes entity, electrical grid, collapse, battery and washer meanings", () => {
    expect(russianLabels["ui.area.entity_button"]).toBe("Кнопка сущности");
    expect(russianLabels.grid_power_entity).toBe("Мощность электросети");
    expect(russianLabels["ui.renderer.GRID"]).toBe("ЭЛЕКТРОСЕТЬ");
    expect(russianLabels.buy_sell_show_grid).toBe("Показывать сетку графика");
    expect(russianLabels.collapsible_controls).toContain("Сворачивать");
    expect(russianLabels["ui.runtime_stop_washer_630a44cc"]).toBe("Остановить стиральную машину");
    expect(russianLabels.battery_1_level_entity).toBe("Заряд аккумулятора 1");
    expect(russianLabels.battery_low_threshold).toContain("батареи");
    expect(russianLabels["ui.renderer.Download"]).toBe("Загрузка");
    expect(russianLabels["ui.renderer.Upload"]).toBe("Отдача");
  });

  it("keeps backend timing, safety, errors, native constraints and picker defaults explicit", () => {
    expect(russianHelpers.pihole_pause_durations).toContain("отсчитывается сервером");
    expect(russianHelpers.pihole_pause_durations).toContain("после закрытия браузера");
    expect(russianHelpers.pihole_pause_durations).toContain("Некорректные записи");
    expect(russianHelpers.pihole_pause_service).toContain("никогда не заменяется постоянным выключением или таймером браузера");
    expect(russianHelpers.pihole_metrics).toContain("никогда не заменяются нулём");
    expect(russianHelpers.upcoming_hide_empty).toContain("явную ошибку");
    expect(russianHelpers.buy_sell_trade_energy_entity).toContain("ошибку вместо оценки");
    expect(russianHelpers.remote_entity).toContain("никогда не отправляются пульту посторонней комнаты");
    expect(russianHelpers.remote_transport).toContain("только для обнаруженного телевизора Samsung");
    expect(russianHelpers.upcoming_text_template).toContain("не выполняются");
    expect(russianHelpers.upcoming_trailers).toContain("не загружаются автоматически");
    expect(russianHelpers.collapsible_controls).toContain("неизвестным или недоступным состоянием невозможно");
    expect(russianHelpers.ulm_card_media_player_power_button).toContain("не отключает питание колонки");
    expect(russianHelpers.ulm_card_media_player_enable_volume_adjust).toContain("собственного шага проигрывателя");
    expect(russianHelpers.icon).toContain("Очистите");
    expect(russianHelpers.icon).toContain("класса устройства и состояния");
    expect(russianHelpers.custom_card_pollen_tree_name).toContain("локализованного значения по умолчанию");
    expect(russianHelpers.carousel_scrollbar).toContain("не активирует сущность");
    expect(russianLabels["ui.area.sensor_icons_help"]).toContain("управляются Home Assistant");
    expect(russianLabels[
      "ui.runtime_group_membership_icon_and_actions_stay_native_add_an_entity_button_for_a_custom_icon_name_or_action_04800467"
    ]).toContain("остаются встроенными");
    expect(russianLabels[
      "ui.runtime_content_name_icon_and_icon_color_accept_home_assistant_jinja_templates_templates_run_in_home_assistant_not_in_the_browser_errors_are_shown_on_the_button_preview_f15200eb"
    ]).toContain("в Home Assistant, а не в браузере");
  });
});
