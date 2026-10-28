import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { danishHelpers, danishLabels } from "../src/translations/da";

// Remove the owned additions so these checks also work after catalog registration.
const installedWithout = (catalog: Record<string, string>, additions: Record<string, string>) =>
  Object.fromEntries(Object.entries(catalog).filter(([key]) => !Object.hasOwn(additions, key)));
const installedLabels = installedWithout(translationCatalogs.da, danishLabels);
const installedHelpers = installedWithout(helperCatalogs.da, danishHelpers);
const catalogs = [
  [translationCatalogs.en, installedLabels, danishLabels],
  [englishHelpers, installedHelpers, danishHelpers],
] as const;
const fingerprint = (catalog: Record<string, string>) =>
  createHash("sha256")
    .update(JSON.stringify(Object.entries(catalog).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)))
    .digest("hex");
const numericLiterals = (text: string) => (text.match(/-?\d+(?:\.\d+)?/g) ?? []).sort();
const codeLiterals = (text: string) =>
  (text.match(/\$[a-z][a-z0-9_]*|\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b|\b[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+\b/g) ?? []).sort();

describe("complete Danish card localization", () => {
  it("adds exactly the missing keys without changing the installed Danish translations", () => {
    expect(Object.keys(danishLabels)).toHaveLength(781);
    expect(Object.keys(danishHelpers)).toHaveLength(566);
    expect(Object.keys(danishLabels).length + Object.keys(danishHelpers).length).toBe(1347);
    expect(fingerprint(installedLabels)).toBe("b4db9acd56bb41445dacbcecda095fc7f0b8457d36aec0594429205f52560b8a");
    expect(fingerprint(installedHelpers)).toBe("b826d6369013861027950108f3a688aa378273b557f720cb21d09b8e5e9cb12a");

    for (const [english, installed, additions] of catalogs) {
      expect(Object.keys(additions).sort()).toEqual(
        Object.keys(english).filter(key => !Object.hasOwn(installed, key)).sort(),
      );
      expect(Object.keys(installed)).toHaveLength(Object.keys(english).length - Object.keys(additions).length);
      const merged = { ...installed, ...additions };
      expect(Object.keys(merged).sort()).toEqual(Object.keys(english).sort());
      for (const [key, value] of Object.entries(installed)) expect(merged[key], key).toBe(value);
    }
  });

  it("provides nonblank Danish throughout the merged catalogs and preserves placeholders", () => {
    // Danish uses these same words, abbreviations and networking terms.
    const sharedTerms = new Set([
      "ui.renderer.Disk", "ui.renderer.Temp", "ui.renderer.CPU", "ui.renderer.RAM",
      "ui.renderer.Problem", "ui.renderer.Download", "ui.renderer.Upload", "ui.renderer.Ping",
    ]);
    for (const [english, installed, additions] of catalogs) {
      const merged = { ...installed, ...additions };
      for (const [key, original] of Object.entries(english)) {
        expect(merged[key]?.trim(), key).toBeTruthy();
        expect(placeholders(merged[key]), key).toEqual(placeholders(original));
      }
      for (const [key, translated] of Object.entries(additions)) {
        expect(english[key], key).toBeDefined();
        if (sharedTerms.has(key)) expect(translated, key).toBe(english[key]);
        else expect(translated, key).not.toBe(english[key]);
        expect(translated, key).not.toMatch(/\b(?:TODO|FIXME|untranslated)\b/);
      }
    }
  });

  it("retains all numeric limits and raw configuration identifiers", () => {
    for (const [english, , additions] of catalogs) {
      for (const [key, translated] of Object.entries(additions)) {
        expect(numericLiterals(translated), key).toEqual(numericLiterals(english[key]));
        expect(codeLiterals(translated), key).toEqual(expect.arrayContaining(codeLiterals(english[key])));
      }
    }
  });

  it("retains protocols, units, option values, service names and examples", () => {
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
      ulm_card_media_player_enable_volume_adjust: ["0.01", "1", "0.05 = 5%"],
      ulm_card_media_player_idle_off: ["idle", "off"],
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
      carousel_button_height: ["32-160"],
      carousel_icon_size: ["12-96"],
      mode_solar_first_label: ["Smart Matching"],
      mode_smart_saving_label: ["Dynamic Smart Matching"],
      mode_smart_trading_label: ["Dynamic Trading + Smart Matching"],
    })) {
      for (const literal of literals) expect(danishHelpers[key], key).toContain(literal);
    }
    for (const [key, literals] of Object.entries({
      buy_sell_feed_in_fee: ["€/kWh"],
      buy_sell_trade_energy: ["(kWh)"],
      buy_sell_trade_power: ["(kW)"],
      panel_gauge_max: ["(W)"],
      "ui.area.attribute_help": ["brightness", "battery_level"],
      "ui.area.content_help": ["Desk lights"],
      "ui.runtime_optional_nested_path_such_as_battery_level_30fc3244": ["battery.level"],
      "ui.runtime_select_panel_sensors_in_the_card_editor_or_add_sensors_with_entity_ids_beginning_with_sensor_inverter_4_1ba7d684": ["sensor.inverter_4"],
    })) {
      for (const literal of literals) expect(danishLabels[key], key).toContain(literal);
    }
  });

  it("preserves backend timing, errors and safe handling of unavailable data", () => {
    expect(danishHelpers.pihole_pause_durations).toContain("varighed styres i backend");
    expect(danishHelpers.pihole_pause_durations).toContain("fortsætter, når browseren lukkes");
    expect(danishHelpers.pihole_pause_durations).toContain("Ugyldige poster forbliver synligt deaktiverede");
    expect(danishHelpers.pihole_pause_service).toContain("aldrig tilbage til permanent slukning eller en browsertimer");
    expect(danishHelpers.pihole_metrics).toContain("erstattes aldrig med nul");
    expect(danishHelpers.pihole_metrics).toContain("samlet blokeret / samlede forespørgsler");
    expect(danishHelpers.upcoming_hide_empty).toContain("viser fortsat en udtrykkelig fejl");
    expect(danishHelpers.buy_sell_trade_energy_entity).toContain("fejl i stedet for et estimat");
    expect(danishHelpers.collapsible_controls).toContain("Ukendte og utilgængelige entiteter kan ikke styres");
    expect(danishHelpers.remote_entity).toContain("Sender aldrig kommandoer");
    expect(danishHelpers.remote_transport).toContain("antages ikke at understøtte Samsung-koder");
    expect(danishHelpers.remote_double_tap).toContain("ikke et ekstra Select");
    expect(danishHelpers.upcoming_text_template).toContain("udføres ikke");
    expect(danishHelpers.upcoming_trailers).toContain("Ingen trailer indlæses automatisk");
  });

  it("keeps native constraints, action behavior and domain-specific Danish meaning", () => {
    expect(danishHelpers.room_temperature_entity).toContain("numeriske temperaturer med en temperaturenhed");
    expect(danishHelpers.room_brightness_entity).toContain("det primære lys, derefter");
    expect(danishHelpers.icon).toContain("kun, når ingen entitet er tilgængelig");
    expect(danishHelpers.ulm_card_media_player_power_button).toContain("afbryder ikke strømmen til højttaleren");
    expect(danishHelpers.buy_sell_trade_efficiency).toContain("efter lagringstab");
    expect(danishHelpers.tariff_markup_entity).toContain("før moms");
    expect(danishHelpers.tariff_vat_entity).toContain("efter tariftillægget");
    expect(danishLabels["ui.area.sensor_icons_help"]).toContain("styres fortsat af Home Assistant");
    expect(danishLabels["ui.area.use_light_color_help"]).toContain("udelukkede lys ignoreres");
    expect(danishLabels["ui.runtime_group_membership_icon_and_actions_stay_native_add_an_entity_button_for_a_custom_icon_name_or_action_04800467"]).toContain("forbliver indbyggede");
    expect(danishLabels["ui.runtime_content_name_icon_and_icon_color_accept_home_assistant_jinja_templates_templates_run_in_home_assistant_not_in_the_browser_errors_are_shown_on_the_button_preview_f15200eb"]).toContain("ikke i browseren");
    expect(danishLabels["ui.runtime_content_name_icon_and_icon_color_accept_home_assistant_jinja_templates_templates_run_in_home_assistant_not_in_the_browser_errors_are_shown_on_the_button_preview_f15200eb"]).toContain("Fejl vises på knapforhåndsvisningen");
    expect(danishLabels["ui.runtime_use_the_native_editor_above_for_area_appearance_features_and_standard_domain_groups_edit_advanced_buttons_below_action_template_and_conditional_buttons_are_intentionally_hidden_from_native_control_lists_names_and_content_appear_below_icons_aligned_to_the_button_bottom_empty_controls_show_no_controls_automatic_controls_retain_home_assistant_defaults_8ead6f08"]).toContain("automatisk betjening bevarer Home Assistants standarder");
    expect(danishLabels.grid_power_entity).toBe("Neteffekt");
    expect(danishLabels["ui.area.entity_button"]).toBe("Entitetsknap");
    expect(danishLabels["ui.renderer.Buy"]).toBe("Køb");
    expect(danishLabels["ui.renderer.Sell"]).toBe("Sælg");
    expect(danishLabels["ui.renderer.GRID · Import"]).toBe("NET · Import");
    expect(danishLabels["ui.renderer.GRID · Export"]).toBe("NET · Eksport");
    expect(danishLabels.battery_critical_threshold).toBe("Grænse for kritisk batteriniveau");
  });
});
