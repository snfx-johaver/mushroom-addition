import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { slovakHelpers, slovakLabels } from "../src/translations/sk";

// Excluding owned entries keeps the baseline checks valid before and after wiring.
const installedWithout = (catalog: Record<string, string>, additions: Record<string, string>) =>
  Object.fromEntries(Object.entries(catalog).filter(([key]) => !Object.hasOwn(additions, key)));

const installedLabels = installedWithout(translationCatalogs.sk, slovakLabels);
const installedHelpers = installedWithout(helperCatalogs.sk, slovakHelpers);
const catalogs = [
  [translationCatalogs.en, installedLabels, slovakLabels],
  [englishHelpers, installedHelpers, slovakHelpers],
] as const;

const fingerprint = (catalog: Record<string, string>) =>
  createHash("sha256")
    .update(JSON.stringify(Object.entries(catalog).filter(([key]) => !key.startsWith("ui.graph.")).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)))
    .digest("hex");

const numericLiterals = (text: string) => (text.match(/-?\d+(?:\.\d+)?/g) ?? []).sort();
const codeLiterals = (text: string) =>
  (text.match(/\$[a-z][a-z0-9_]*|\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b|\b[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+\b/g) ?? []).sort();

describe("complete Slovak card localization", () => {
  it("adds exactly the missing keys and preserves the installed Slovak baseline", () => {
    expect(Object.keys(slovakLabels)).toHaveLength(773);
    expect(Object.keys(slovakHelpers)).toHaveLength(558);
    expect(Object.keys(installedLabels)).toHaveLength(416);
    expect(Object.keys(installedHelpers)).toHaveLength(1);
    expect(fingerprint(installedLabels)).toBe("0fc6ddf546401198b58523b69141d2ed81dbbe17f27c37a154c8cc07e57fb829");
    expect(fingerprint(installedHelpers)).toBe("629db3db6c3f84e2d3e2343980c0d2e998353010bde88f1577e1ea642f016f28");
    expect(Object.keys(translationCatalogs.en)).toHaveLength(1189);
    expect(Object.keys(englishHelpers)).toHaveLength(559);

    for (const [english, installed, additions] of catalogs) {
      expect(Object.keys(additions).sort()).toEqual(
        Object.keys(english).filter((key) => !Object.hasOwn(installed, key)).sort(),
      );
      const merged = { ...installed, ...additions };
      expect(Object.keys(merged).sort()).toEqual(Object.keys(english).sort());
      for (const [key, value] of Object.entries(installed)) expect(merged[key], key).toBe(value);
    }
  });

  it("provides nonblank translations without English filling and keeps placeholders", () => {
    // These are also normal Slovak words or internationally used technical names.
    const sharedTerms = new Set([
      "ui.runtime_minimum_735beee2",
      "ui.runtime_maximum_66c9ab17",
      "ui.renderer.Disk",
      "ui.renderer.CPU",
      "ui.renderer.RAM",
    ]);
    for (const [english, installed, additions] of catalogs) {
      const merged = { ...installed, ...additions };
      for (const [key, source] of Object.entries(english)) {
        expect(merged[key]?.trim(), key).toBeTruthy();
        expect(placeholders(merged[key]), key).toEqual(placeholders(source));
      }
      for (const [key, translated] of Object.entries(additions)) {
        expect(english[key], key).toBeDefined();
        if (sharedTerms.has(key)) expect(translated, key).toBe(english[key]);
        else expect(translated, key).not.toBe(english[key]);
        expect(translated, key).not.toMatch(/\b(?:TODO|FIXME|untranslated)\b/);
      }
    }
  });

  it("preserves numeric limits, code, units, examples and protocol names verbatim", () => {
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
      for (const literal of literals) expect(slovakHelpers[key], key).toContain(literal);
    }
    for (const [key, literal] of Object.entries({
      buy_sell_feed_in_fee: "€/kWh",
      buy_sell_trade_energy: "(kWh)",
      buy_sell_trade_power: "(kW)",
      panel_gauge_max: "(W)",
      "ui.area.attribute_help": "brightness",
      "ui.area.content_help": "Desk lights",
      "ui.runtime_optional_nested_path_such_as_battery_level_30fc3244": "battery.level",
    })) expect(slovakLabels[key], key).toContain(literal);
  });

  it("retains backend pause timing, error behavior and unavailable-value safety", () => {
    expect(slovakHelpers.pihole_pause_durations).toContain("časované na serveri");
    expect(slovakHelpers.pihole_pause_durations).toContain("po zatvorení prehliadača");
    expect(slovakHelpers.pihole_pause_service).toContain("nikdy nenahrádza trvalým vypnutím");
    expect(slovakHelpers.pihole_pause_service).toContain("ani časovačom prehliadača");
    expect(slovakHelpers.pihole_metrics).toContain("nikdy nenahrádzajú nulou");
    expect(slovakHelpers.upcoming_hide_empty).toContain("výslovnú chybu");
    expect(slovakHelpers.buy_sell_trade_energy_entity).toContain("chybu namiesto odhadu");
    expect(slovakHelpers.collapsible_controls).toContain("Neznáme a nedostupné entity nemožno ovládať");
    expect(slovakHelpers.remote_entity).toContain("Nikdy neposiela príkazy");
    expect(slovakHelpers.remote_transport).toContain("podpora kódov Samsung nepredpokladá");
    expect(slovakHelpers.remote_double_tap).toContain("bez dodatočného Select");
    expect(slovakHelpers.upcoming_text_template).toContain("sa nevykonávajú");
    expect(slovakHelpers.upcoming_trailers).toContain("Žiadna upútavka sa nenačítava automaticky");
  });

  it("keeps native constraints, sensible picker defaults, actions and domain terminology", () => {
    expect(slovakHelpers.room_temperature_entity).toContain("číselné teploty s jednotkou teploty");
    expect(slovakHelpers.room_brightness_entity).toContain("hlavné svetlo, potom");
    expect(slovakHelpers.icon).toContain("iba vtedy, keď nie je dostupná entita");
    expect(slovakHelpers.ulm_card_media_player_power_button).toContain("napájanie reproduktora sa tým nepreruší");
    expect(slovakLabels["ui.area.sensor_icons_help"]).toContain("naďalej riadi Home Assistant");
    expect(slovakLabels["ui.area.use_light_color_help"]).toContain("vylúčené svetlá sa ignorujú");
    expect(slovakLabels["ui.runtime_group_membership_icon_and_actions_stay_native_add_an_entity_button_for_a_custom_icon_name_or_action_04800467"]).toContain("zostávajú natívne");
    expect(slovakLabels["ui.runtime_content_name_icon_and_icon_color_accept_home_assistant_jinja_templates_templates_run_in_home_assistant_not_in_the_browser_errors_are_shown_on_the_button_preview_f15200eb"]).toContain("nie v prehliadači");
    expect(slovakLabels["ui.runtime_use_the_native_editor_above_for_area_appearance_features_and_standard_domain_groups_edit_advanced_buttons_below_action_template_and_conditional_buttons_are_intentionally_hidden_from_native_control_lists_names_and_content_appear_below_icons_aligned_to_the_button_bottom_empty_controls_show_no_controls_automatic_controls_retain_home_assistant_defaults_8ead6f08"]).toContain("automatické ovládanie zachová predvolené nastavenia Home Assistant");
    expect(slovakLabels.grid_power_entity).toBe("Výkon elektrickej siete");
    expect(slovakLabels.collapsible_controls).toContain("Zbaliť");
    expect(slovakLabels["ui.area.entity_button"]).toBe("Tlačidlo entity");
    expect(slovakLabels["ui.renderer.GRID"]).toBe("ELEKTRICKÁ SIEŤ");
    expect(slovakLabels["ui.renderer.GRID · Import"]).toContain("Odber");
    expect(slovakLabels["ui.renderer.GRID · Export"]).toContain("Dodávka");
  });
});
