import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { bulgarianHelpers, bulgarianLabels } from "../src/translations/bg";

const installedWithout = (catalog: Record<string, string>, additions: Record<string, string>) =>
  Object.fromEntries(Object.entries(catalog).filter(([key]) => !Object.hasOwn(additions, key)));

const installedLabels = installedWithout(translationCatalogs.bg, bulgarianLabels);
const installedHelpers = installedWithout(helperCatalogs.bg, bulgarianHelpers);
const catalogs = [
  [translationCatalogs.en, installedLabels, bulgarianLabels],
  [englishHelpers, installedHelpers, bulgarianHelpers],
] as const;

const fingerprint = (catalog: Record<string, string>) =>
  createHash("sha256")
    .update(JSON.stringify(Object.entries(catalog)
      .filter(([key]) => !key.startsWith("ui.graph."))
      .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)))
    .digest("hex");

const numericLiterals = (text: string) => (text.match(/-?\d+(?:\.\d+)?/g) ?? []).sort();
const codeLiterals = (text: string) =>
  (text.match(/\$[a-z][a-z0-9_]*|\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b|\b[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+\b/g) ?? []).sort();

describe("complete Bulgarian card localization", () => {
  it("adds exactly the missing labels and helpers without changing installed translations", () => {
    expect(Object.keys(bulgarianLabels)).toHaveLength(770);
    expect(Object.keys(bulgarianHelpers)).toHaveLength(575);
    expect(Object.keys(installedLabels)).toHaveLength(416);
    expect(Object.keys(installedHelpers)).toHaveLength(1);
    expect(fingerprint(installedLabels)).toBe("2f454396a39f8f335195c5fa4523c94b2d579368a49fde8104a638e5b93a29d0");
    expect(fingerprint(installedHelpers)).toBe("ebabe16006dd0d892b4e4dca06b0fe7191e32bd27a50c95e4caeaedeb2bd4286");
    expect(Object.keys(translationCatalogs.en)).toHaveLength(1186);
    expect(Object.keys(englishHelpers)).toHaveLength(576);
    expect(Object.keys(bulgarianLabels).some(key => key.startsWith("ui.graph."))).toBe(false);

    for (const [english, installed, additions] of catalogs) {
      const missing = Object.keys(english).filter(key => !Object.hasOwn(installed, key)).sort();
      expect(Object.keys(additions).sort()).toEqual(missing);
      const merged = { ...installed, ...additions };
      expect(Object.keys(merged).sort()).toEqual(Object.keys(english).sort());
      for (const [key, value] of Object.entries(installed)) expect(merged[key], key).toBe(value);
    }
  });

  it("provides Bulgarian throughout the merged catalogs and preserves placeholders", () => {
    const unchangedTechnicalTerms = new Set(["ui.renderer.CPU", "ui.renderer.RAM", "ui.renderer.Ping"]);
    for (const [english, installed, additions] of catalogs) {
      const merged = { ...installed, ...additions };
      for (const [key, source] of Object.entries(english)) {
        expect(merged[key]?.trim(), key).toBeTruthy();
        expect(placeholders(merged[key]), key).toEqual(placeholders(source));
      }
      for (const [key, translated] of Object.entries(additions)) {
        expect(english[key], key).toBeDefined();
        if (unchangedTechnicalTerms.has(key)) {
          expect(translated, key).toBe(english[key]);
        } else {
          expect(translated, key).not.toBe(english[key]);
          expect(translated, key).toMatch(/[А-Яа-я]/);
        }
        expect(translated, key).not.toMatch(/\b(?:TODO|FIXME|untranslated)\b/);
      }
    }
  });

  it("preserves numeric limits, raw identifiers, units, protocols and examples", () => {
    for (const [english, , additions] of catalogs) {
      for (const [key, translated] of Object.entries(additions)) {
        expect(numericLiterals(translated), key).toEqual(numericLiterals(english[key]));
        expect(codeLiterals(translated), key).toEqual(codeLiterals(english[key]));
      }
    }
    for (const [key, literals] of Object.entries({
      upcoming_text_template: ["$title", "$episode", "$number", "$rating", "$runtime", "$release", "$day", "$date", "$time", "$studio", "$empty", "JavaScript", "HTML", "Jinja"],
      upcoming_url: ["https://www.themoviedb.org/tv/$tmdb_id", "HTTP(S)"],
      upcoming_data_attribute: ["data", "JSON"],
      upcoming_group_value: ["flag = true"],
      upcoming_date_format: ["dd, mm, yy", "yyyy"],
      pihole_pause_durations: ["30s, 5m, 1h30m", "1h:30m:15s"],
      pihole_device_ids: ["v5", "v6"],
      remote_transport: ["remote.send_command", "play_media / send_key", "Samsung"],
      remote_swipe_distance: ["Enter", "Space", "Backspace", "Home"],
      remote_double_tap: ["Select"],
      cartridges: ["label, entity_id, type", "CSS"],
      ulm_card_media_player_enable_volume_adjust: ["0.01", "0.05 = 5%"],
      ulm_card_welcome_collapse: ["input_boolean"],
      ulm_button_service: ["domain.service"],
      ulm_custom_card_window_handle: ["Closed", "Tilted", "Open"],
      ulm_card_battery_charger_type_entity_id: ["wireless", "AC", "USB", "charging"],
      ulm_custom_card_washer_remote_control: ["true", "on"],
      lower_bound: ["~20"],
      upper_bound: ["~25"],
      graph_span: ["1d", "YAML"],
      carousel_effect: ["Coverflow", "Slide", "Fade", "Cube", "Flip"],
      carousel_button_width: ["32-160"],
      carousel_icon_size: ["12-96"],
      mode_solar_first_label: ["Smart Matching"],
      mode_smart_saving_label: ["Dynamic Smart Matching"],
      mode_smart_trading_label: ["Dynamic Trading + Smart Matching"],
    })) {
      for (const literal of literals) expect(bulgarianHelpers[key], key).toContain(literal);
    }
    expect(bulgarianLabels.buy_sell_feed_in_fee).toContain("€/kWh");
    expect(bulgarianLabels.buy_sell_trade_energy).toContain("(kWh)");
    expect(bulgarianLabels.panel_gauge_max).toContain("(W)");
    expect(bulgarianLabels.buy_sell_trade_power).toContain("(kW)");
    expect(bulgarianLabels["ui.runtime_select_panel_sensors_in_the_card_editor_or_add_sensors_with_entity_ids_beginning_with_sensor_inverter_4_1ba7d684"])
      .toContain("sensor.inverter_4");
    expect(bulgarianLabels["ui.runtime_optional_nested_path_such_as_battery_level_30fc3244"])
      .toContain("battery.level");
    expect(bulgarianLabels["ui.area.attribute_help"]).toContain("brightness");
    expect(bulgarianLabels["ui.area.attribute_help"]).toContain("battery_level");
    expect(bulgarianLabels["ui.area.content_help"]).toContain("Desk lights");
  });

  it("preserves safety behavior, native constraints, and Home Assistant terminology", () => {
    expect(bulgarianHelpers.pihole_pause_durations).toContain("след затваряне на браузъра");
    expect(bulgarianHelpers.pihole_pause_service).toContain("никога не се заменя с постоянно изключване");
    expect(bulgarianHelpers.pihole_pause_service).toContain("таймер в браузъра");
    expect(bulgarianHelpers.pihole_metrics).toContain("никога не се заменят с нула");
    expect(bulgarianHelpers.upcoming_hide_empty).toContain("изрична грешка");
    expect(bulgarianHelpers.buy_sell_trade_energy_entity).toContain("грешка вместо оценка");
    expect(bulgarianHelpers.collapsible_controls).toContain("не могат да се управляват");
    expect(bulgarianHelpers.remote_entity).toContain("Не се изпращат команди");
    expect(bulgarianHelpers.remote_double_tap).toContain("без допълнителен Select");
    expect(bulgarianHelpers.room_temperature_entity).toContain("числови температури с единица за температура");
    expect(bulgarianHelpers.room_brightness_entity).toContain("основната лампа, а след това");
    expect(bulgarianHelpers.icon).toContain("само когато няма наличен обект");
    expect(bulgarianHelpers.lights_hold_action).toContain("500 ms");
    expect(bulgarianHelpers.lights_double_tap_action).toContain("без да се изпълнява и действието при единично докосване");
    expect(bulgarianLabels["ui.area.sensor_icons_help"]).toContain("управляват от Home Assistant");
    expect(bulgarianLabels["ui.area.use_light_color_help"]).toContain("изключените лампи се пропускат");
    expect(bulgarianLabels["ui.runtime_group_membership_icon_and_actions_stay_native_add_an_entity_button_for_a_custom_icon_name_or_action_04800467"])
      .toContain("остават вградени");
    expect(bulgarianLabels["ui.runtime_content_name_icon_and_icon_color_accept_home_assistant_jinja_templates_templates_run_in_home_assistant_not_in_the_browser_errors_are_shown_on_the_button_preview_f15200eb"])
      .toContain("а не в браузъра");
    expect(bulgarianLabels["ui.runtime_use_the_native_editor_above_for_area_appearance_features_and_standard_domain_groups_edit_advanced_buttons_below_action_template_and_conditional_buttons_are_intentionally_hidden_from_native_control_lists_names_and_content_appear_below_icons_aligned_to_the_button_bottom_empty_controls_show_no_controls_automatic_controls_retain_home_assistant_defaults_8ead6f08"])
      .toContain("запазват настройките по подразбиране на Home Assistant");
    expect(bulgarianLabels.grid_power_entity).toBe("Мощност от електрическата мрежа");
    expect(bulgarianLabels.collapse_entity).toBe("Помощник за свиване");
    expect(bulgarianLabels["ui.area.entity_button"]).toBe("Бутон за обект");
  });
});
