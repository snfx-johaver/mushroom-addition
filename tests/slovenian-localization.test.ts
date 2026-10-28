import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, normalizeLocale, SUPPORTED_LOCALES, translationCatalogs } from "../src/localize";
import { nativeDiagnosticCatalogs } from "../src/native-diagnostics";
import { placeholders } from "../src/translation-coverage";
import { slovenianHelpers, slovenianLabels } from "../src/translations/sl";

// Removing only our additions lets the same inventory checks run before and after wiring.
const installedWithout = (catalog: Record<string, string>, additions: Record<string, string>) =>
  Object.fromEntries(Object.entries(catalog).filter(([key]) => !Object.hasOwn(additions, key)));
const installedLabels = installedWithout(translationCatalogs.sl, slovenianLabels);
const installedHelpers = installedWithout(helperCatalogs.sl, slovenianHelpers);
const catalogs = [
  [translationCatalogs.en, installedLabels, slovenianLabels],
  [englishHelpers, installedHelpers, slovenianHelpers],
] as const;

const fingerprint = (catalog: Record<string, string>) =>
  createHash("sha256")
    .update(JSON.stringify(Object.entries(catalog)
      .filter(([key]) => !key.startsWith("ui.graph."))
      .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)))
    .digest("hex");
const numbers = (text: string) => (text.match(/-?\d+(?:\.\d+)?/g) ?? []).sort();
const codeLiterals = (text: string) =>
  (text.match(/\$[a-z][a-z0-9_]*|\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b|\b[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+\b/g) ?? []).sort();

describe("complete Slovenian localization", () => {
  it("adds precisely the dynamically missing inventory without overwriting installed entries", () => {
    expect(Object.keys(slovenianLabels)).toHaveLength(767);
    expect(Object.keys(slovenianHelpers)).toHaveLength(552);
    expect(Object.keys(installedLabels)).toHaveLength(416);
    expect(Object.keys(installedHelpers)).toHaveLength(1);
    expect(fingerprint(installedLabels)).toBe("ebee4757b0ab64a9098bf59bc3cf12b2b3bac47dd6369023d0c0fd22e2f037b3");
    expect(fingerprint(installedHelpers)).toBe("694dcbae44eb83bd6f9060951294353ea4456818c5353c79d3fd684a4a476a09");
    expect(Object.keys(translationCatalogs.en)).toHaveLength(1183);
    expect(Object.keys(englishHelpers)).toHaveLength(553);

    for (const [english, installed, additions] of catalogs) {
      const expected = Object.keys(english).filter(key => !Object.hasOwn(installed, key)).sort();
      expect(Object.keys(additions).sort()).toEqual(expected);
      const merged = { ...installed, ...additions };
      expect(Object.keys(merged).sort()).toEqual(Object.keys(english).sort());
      expect(installedWithout(merged, additions)).toEqual(installed);
      for (const [key, value] of Object.entries(installed)) expect(merged[key], key).toBe(value);
      for (const state of [installed, merged]) {
        const baseline = installedWithout(state, additions);
        expect(Object.keys(english).filter(key => !Object.hasOwn(baseline, key)).sort()).toEqual(expected);
      }
    }
    expect(Object.keys(slovenianLabels).some(key => key.startsWith("ui.graph."))).toBe(false);
  });

  it("covers all 1742 messages including the six separate native diagnostic templates", () => {
    expect(SUPPORTED_LOCALES).toHaveLength(33);
    expect(normalizeLocale("sl-SI")).toBe("sl");
    const diagnostics = nativeDiagnosticCatalogs.sl;
    expect(Object.keys(diagnostics).sort()).toEqual(Object.keys(nativeDiagnosticCatalogs.en).sort());
    expect(Object.keys(diagnostics)).toHaveLength(6);
    let count = 0;
    for (const [english, translated] of [
      ...catalogs.map(([source, installed, additions]) => [source, { ...installed, ...additions }] as const),
      [nativeDiagnosticCatalogs.en, diagnostics],
    ] as const) {
      for (const [key, source] of Object.entries(english)) {
        count++;
        expect(translated[key]?.trim(), key).toBeTruthy();
        expect(placeholders(translated[key]), key).toEqual(placeholders(source));
      }
    }
    expect(count).toBe(1742);
    for (const [key, value] of Object.entries(diagnostics)) {
      expect(value, key).not.toBe(nativeDiagnosticCatalogs.en[key]);
    }
  });

  it("uses Slovenian text rather than English filler and preserves every placeholder", () => {
    const internationalTerms = new Set(["ui.renderer.Disk", "ui.renderer.CPU", "ui.renderer.RAM"]);
    for (const [english, , additions] of catalogs) {
      for (const [key, value] of Object.entries(additions)) {
        expect(value, key).toBe(value.trim());
        expect(value.trim(), key).toBeTruthy();
        expect(placeholders(value), key).toEqual(placeholders(english[key]));
        if (internationalTerms.has(key)) expect(value, key).toBe(english[key]);
        else expect(value, key).not.toBe(english[key]);
        expect(value, key).not.toMatch(/\b(?:TODO|FIXME|untranslated)\b/);
      }
    }
  });

  it("keeps numerical limits and raw configuration, service, entity and token literals", () => {
    for (const [english, , additions] of catalogs) {
      for (const [key, value] of Object.entries(additions)) {
        expect(numbers(value), key).toEqual(numbers(english[key]));
        expect(codeLiterals(value), key).toEqual(codeLiterals(english[key]));
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
      remote_device: ["remote.send_command"],
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
      carousel_button_height: ["32-160"],
      carousel_icon_size: ["12-96"],
      mode_solar_first_label: ["Smart Matching"],
      mode_smart_saving_label: ["Dynamic Smart Matching"],
      mode_smart_trading_label: ["Dynamic Trading + Smart Matching"],
      moon_altitude_entity: ["Astronomy Space Suite"],
    })) {
      for (const literal of literals) expect(slovenianHelpers[key], `${key}: ${literal}`).toContain(literal);
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
      "ui.runtime_use_playlist_for_spotify_playlist_ids_or_another_media_type_supported_by_your_player_c0de82c4": ["playlist", "Spotify"],
    })) {
      for (const literal of literals) expect(slovenianLabels[key], `${key}: ${literal}`).toContain(literal);
    }
  });

  it("retains backend timing and safety instead of promising unsafe fallbacks", () => {
    expect(slovenianHelpers.pihole_pause_durations).toContain("Čas premora meri zaledje");
    expect(slovenianHelpers.pihole_pause_durations).toContain("tudi po zaprtju brskalnika");
    expect(slovenianHelpers.pihole_pause_durations).toContain("Neveljavni vnosi ostanejo vidno onemogočeni");
    expect(slovenianHelpers.pihole_pause_service).toContain("nikoli ne nadomesti s trajnim izklopom ali časovnikom brskalnika");
    expect(slovenianHelpers.pihole_metrics).toContain("se nikoli ne nadomestijo z ničlo");
    expect(slovenianHelpers.pihole_metrics).toContain("temperatura prikaže največjo vrednost");
    expect(slovenianHelpers.upcoming_hide_empty).toContain("še vedno prikažejo izrecno napako");
    expect(slovenianHelpers.buy_sell_trade_energy_entity).toContain("napako namesto ocene");
    expect(slovenianHelpers.collapsible_controls).toContain("Neznanih in nedostopnih entitet ni mogoče upravljati");
    expect(slovenianHelpers.remote_entity).toContain("Nikoli ne pošilja ukazov");
    expect(slovenianHelpers.remote_transport).toContain("ne predpostavlja podpora kodam Samsung");
    expect(slovenianHelpers.remote_device).toContain("ne ID naprave v Home Assistant");
    expect(slovenianHelpers.remote_double_tap).toContain("brez dodatnega Select");
    expect(slovenianHelpers.upcoming_text_template).toContain("JavaScript, HTML in Jinja se ne izvajajo");
    expect(slovenianHelpers.upcoming_trailers).toContain("Noben napovednik se ne naloži samodejno");
    expect(slovenianHelpers.ulm_card_media_player_power_button).toContain("to ne prekine napajanja zvočnika");
  });

  it("preserves defaults, action scope, native constraints and template execution location", () => {
    expect(slovenianHelpers.room_temperature_entity).toContain("samo številske temperature s temperaturno enoto");
    expect(slovenianHelpers.room_brightness_entity).toContain("primarno luč, nato luč za poudarek prostora");
    expect(slovenianHelpers.icon).toContain("samo, kadar entiteta ni na voljo");
    for (const [english, , additions] of catalogs) {
      for (const [key, source] of Object.entries(english)) {
        if (source.includes("Default:")) expect(additions[key], key).toContain("Privzeto:");
      }
    }
    expect(slovenianHelpers.carousel_effect).toContain("eno sredinsko postavko ne glede na število diapozitivov");
    expect(slovenianHelpers.carousel_scrollbar).toContain("ne aktivira entitete");
    expect(slovenianLabels["ui.area.sensor_icons_help"]).toContain("še naprej upravlja Home Assistant");
    expect(slovenianLabels["ui.area.use_light_color_help"]).toContain("izključene luči se prezrejo");
    expect(slovenianLabels["ui.runtime_group_membership_icon_and_actions_stay_native_add_an_entity_button_for_a_custom_icon_name_or_action_04800467"]).toContain("ostanejo izvorni");
    expect(slovenianLabels["ui.runtime_content_name_icon_and_icon_color_accept_home_assistant_jinja_templates_templates_run_in_home_assistant_not_in_the_browser_errors_are_shown_on_the_button_preview_f15200eb"]).toContain("v Home Assistant, ne v brskalniku");
    expect(slovenianLabels["ui.runtime_use_the_native_editor_above_for_area_appearance_features_and_standard_domain_groups_edit_advanced_buttons_below_action_template_and_conditional_buttons_are_intentionally_hidden_from_native_control_lists_names_and_content_appear_below_icons_aligned_to_the_button_bottom_empty_controls_show_no_controls_automatic_controls_retain_home_assistant_defaults_8ead6f08"]).toContain("samodejni kontrolniki ohranijo privzete nastavitve Home Assistant");
  });

  it("uses official Mushroom terminology for ambiguous interface concepts", () => {
    // Terminology reference: piitaya/lovelace-mushroom src/translations/sl.json.
    expect(slovenianLabels.icon_type).toBe("Vrsta ikone");
    expect(slovenianLabels.fill_container).toBe("Zapolnitev prostora");
    expect(slovenianLabels.primary_info).toBe("Primarna informacija");
    expect(slovenianLabels.secondary_info).toBe("Sekundarna informacija");
    expect(slovenianLabels.collapsible_controls).toBe("Strni kontrolnike, ko so izklopljeni");
    expect(slovenianLabels.media_controls).toBe("Nadzor medijev");
    expect(slovenianLabels["ui.area.entity_button"]).toBe("Gumb entitete");
    expect(slovenianLabels["ui.area.kind_template"]).toBe("Predloga");
    expect(slovenianLabels["ui.renderer.GRID"]).toBe("OMREŽJE");
    expect(slovenianLabels["ui.renderer.GRID · Import"]).toBe("OMREŽJE · Prevzem");
    expect(slovenianLabels["ui.renderer.GRID · Export"]).toBe("OMREŽJE · Oddaja");
    expect(slovenianLabels["ui.renderer.Solar Panels"]).toBe("Sončni paneli");
  });
});
