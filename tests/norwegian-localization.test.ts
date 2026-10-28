import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { norwegianHelpers, norwegianLabels } from "../src/translations/nb";

// Remove our additions so the same assertions work before and after registration.
const installedWithout = (catalog: Record<string, string>, additions: Record<string, string>) =>
  Object.fromEntries(Object.entries(catalog).filter(([key]) => !Object.hasOwn(additions, key)));

const installedLabels = installedWithout(translationCatalogs.nb, norwegianLabels);
const installedHelpers = installedWithout(helperCatalogs.nb, norwegianHelpers);
const catalogs = [
  [translationCatalogs.en, installedLabels, norwegianLabels],
  [englishHelpers, installedHelpers, norwegianHelpers],
] as const;

const fingerprint = (catalog: Record<string, string>) =>
  createHash("sha256")
    .update(JSON.stringify(Object.entries(catalog).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)))
    .digest("hex");
const numericLiterals = (text: string) => (text.match(/-?\d+(?:\.\d+)?/g) ?? []).sort();
const codeLiterals = (text: string) =>
  (text.match(/\$[a-z][a-z0-9_]*|\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b|\b[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+\b/g) ?? []).sort();

describe("complete Norwegian Bokmål localization", () => {
  it("adds exactly the missing entries without changing installed translations", () => {
    expect(Object.keys(norwegianLabels)).toHaveLength(782);
    expect(Object.keys(norwegianHelpers)).toHaveLength(567);
    expect(Object.keys(norwegianLabels).length + Object.keys(norwegianHelpers).length).toBe(1349);
    expect(fingerprint(installedLabels)).toBe("2a13437b8ee6c4f72765e4b82d4126c764511a0977cc9ccbaa431322dcc7de27");
    expect(fingerprint(installedHelpers)).toBe("10e37dd9959cfa6d9fffa5d2135993b5b5df12d9d92443d43ffe1538eab359b4");

    for (const [english, installed, additions] of catalogs) {
      expect(Object.keys(installed).length + Object.keys(additions).length).toBe(Object.keys(english).length);
      expect(Object.keys(additions).sort()).toEqual(
        Object.keys(english).filter((key) => !Object.hasOwn(installed, key)).sort(),
      );
      const merged = { ...installed, ...additions };
      expect(Object.keys(merged).sort()).toEqual(Object.keys(english).sort());
      for (const [key, value] of Object.entries(installed)) expect(merged[key], key).toBe(value);
    }
  });

  it("covers the complete English catalogs with nonblank text and exact placeholders", () => {
    for (const [english, installed, additions] of catalogs) {
      const merged = { ...installed, ...additions };
      for (const [key, source] of Object.entries(english)) {
        expect(merged[key]?.trim(), key).toBeTruthy();
        expect(placeholders(merged[key]), key).toEqual(placeholders(source));
      }
    }
  });

  it("does not fill missing entries with English except shared technical terms", () => {
    // Minimum and disk are also Bokmål words; CPU and RAM are standard acronyms.
    const sharedTerms = new Set([
      "ui.runtime_minimum_735beee2",
      "ui.renderer.Disk",
      "ui.renderer.CPU",
      "ui.renderer.RAM",
    ]);
    for (const [english, , additions] of catalogs) {
      for (const [key, translated] of Object.entries(additions)) {
        expect(english[key], key).toBeDefined();
        if (sharedTerms.has(key)) expect(translated, key).toBe(english[key]);
        else expect(translated, key).not.toBe(english[key]);
        expect(translated, key).not.toMatch(/\b(?:TODO|FIXME|untranslated)\b/);
      }
    }
  });

  it("keeps raw code, examples, protocols, units and numerical limits", () => {
    for (const [english, , additions] of catalogs) {
      for (const [key, translated] of Object.entries(additions)) {
        expect(numericLiterals(translated), key).toEqual(numericLiterals(english[key]));
        expect(codeLiterals(translated), key).toEqual(codeLiterals(english[key]));
      }
    }
    for (const [key, literals] of Object.entries({
      upcoming_data_attribute: ["JSON", "data"],
      upcoming_text_template: ["$title", "$episode", "$number", "$rating", "$runtime", "$release", "$day", "$date", "$time", "$studio", "$empty", "JavaScript", "HTML", "Jinja"],
      upcoming_url: ["https://www.themoviedb.org/tv/$tmdb_id", "HTTP(S)"],
      upcoming_group_value: ["flag = true"],
      upcoming_date_format: ["dd, mm, yy", "yyyy"],
      pihole_device_ids: ["v5", "v6"],
      pihole_pause_durations: ["30s, 5m, 1h30m", "1h:30m:15s"],
      remote_transport: ["remote.send_command", "play_media / send_key", "Samsung"],
      remote_swipe_distance: ["Enter", "Space", "Backspace", "Home"],
      remote_double_tap: ["Select"],
      cartridges: ["label, entity_id, type", "CSS"],
      ulm_card_welcome_collapse: ["input_boolean"],
      ulm_button_service: ["domain.service"],
      ulm_custom_card_window_handle: ["Closed", "Tilted", "Open"],
      ulm_custom_card_washer_remote_control: ["true", "on"],
      ulm_card_battery_charger_type_entity_id: ["wireless", "AC", "USB", "charging"],
      ulm_card_media_player_enable_volume_adjust: ["0.01", "0.05 = 5%"],
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
      for (const literal of literals) expect(norwegianHelpers[key], key).toContain(literal);
    }
    for (const [key, literals] of Object.entries({
      buy_sell_feed_in_fee: ["€/kWh"],
      buy_sell_trade_energy: ["(kWh)"],
      buy_sell_trade_power: ["(kW)"],
      panel_gauge_max: ["(W)"],
      "ui.area.attribute_help": ["brightness", "battery_level"],
      "ui.area.content_help": ["Desk lights"],
      "ui.runtime_optional_nested_path_such_as_battery_level_30fc3244": ["battery.level"],
      "ui.runtime_use_playlist_for_spotify_playlist_ids_or_another_media_type_supported_by_your_player_c0de82c4": ["playlist", "Spotify"],
    })) {
      for (const literal of literals) expect(norwegianLabels[key], key).toContain(literal);
    }
  });

  it("preserves backend timing, error handling and command safety", () => {
    expect(norwegianHelpers.pihole_pause_durations).toContain("tidsstyres på serveren");
    expect(norwegianHelpers.pihole_pause_durations).toContain("etter at nettleseren lukkes");
    expect(norwegianHelpers.pihole_pause_durations).toContain("Ugyldige oppføringer forblir synlig deaktivert");
    expect(norwegianHelpers.pihole_pause_service).toContain("erstattes aldri av permanent avslåing");
    expect(norwegianHelpers.pihole_pause_service).toContain("eller en tidtaker i nettleseren");
    expect(norwegianHelpers.pihole_metrics).toContain("erstattes aldri med null");
    expect(norwegianHelpers.upcoming_hide_empty).toContain("viser fortsatt en tydelig feil");
    expect(norwegianHelpers.buy_sell_trade_energy_entity).toContain("en feil i stedet for et estimat");
    expect(norwegianHelpers.collapsible_controls).toContain("Ukjente og utilgjengelige entiteter kan ikke styres");
    expect(norwegianHelpers.remote_entity).toContain("Sender aldri kommandoer");
    expect(norwegianHelpers.remote_transport).toContain("generiske spillere antas ikke å støtte Samsung-koder");
    expect(norwegianHelpers.remote_double_tap).toContain("ikke et ekstra Select");
    expect(norwegianHelpers.upcoming_text_template).toContain("Ingen JavaScript, HTML eller Jinja kjøres");
    expect(norwegianHelpers.upcoming_trailers).toContain("Ingen trailer lastes automatisk");
  });

  it("retains native limitations, action semantics and accurate Bokmål terminology", () => {
    expect(norwegianHelpers.room_temperature_entity).toContain("Bare numeriske temperaturer med temperaturenhet");
    expect(norwegianHelpers.room_brightness_entity).toContain("hovedlyset, deretter rommets aksentlys");
    expect(norwegianHelpers.icon).toContain("bare når ingen entitet er tilgjengelig");
    expect(norwegianHelpers.ulm_card_media_player_power_button).toContain("kutter ikke strømmen til høyttaleren");
    expect(norwegianHelpers.carousel_scrollbar).toContain("aktiverer ikke entiteten");
    expect(norwegianLabels["ui.area.sensor_icons_help"]).toContain("styres fortsatt av Home Assistant");
    expect(norwegianLabels["ui.area.use_light_color_help"]).toContain("ekskluderte lys ignoreres");
    expect(norwegianLabels["ui.runtime_group_membership_icon_and_actions_stay_native_add_an_entity_button_for_a_custom_icon_name_or_action_04800467"]).toContain("forblir innebygde");
    expect(norwegianLabels["ui.runtime_content_name_icon_and_icon_color_accept_home_assistant_jinja_templates_templates_run_in_home_assistant_not_in_the_browser_errors_are_shown_on_the_button_preview_f15200eb"]).toContain("ikke i nettleseren");
    expect(norwegianLabels["ui.runtime_use_the_native_editor_above_for_area_appearance_features_and_standard_domain_groups_edit_advanced_buttons_below_action_template_and_conditional_buttons_are_intentionally_hidden_from_native_control_lists_names_and_content_appear_below_icons_aligned_to_the_button_bottom_empty_controls_show_no_controls_automatic_controls_retain_home_assistant_defaults_8ead6f08"]).toContain("automatiske kontroller beholder Home Assistants standardinnstillinger");
    expect(norwegianLabels.icon_type).toBe("Ikontype");
    expect(norwegianLabels.primary_info).toBe("Primærinformasjon");
    expect(norwegianLabels.secondary_info).toBe("Sekundærinformasjon");
    expect(norwegianLabels.use_entity_picture).toBe("Bruk enhetsbilde");
    expect(norwegianLabels.grid_power_entity).toBe("Netteffekt");
    expect(norwegianLabels.collapsible_controls).toContain("Fold sammen");
    expect(norwegianLabels["ui.area.entity_button"]).toBe("Entitetsknapp");
    expect(norwegianLabels["ui.renderer.GRID"]).toBe("NETT");
    expect(norwegianLabels["ui.renderer.GRID · Import"]).toContain("Uttak");
    expect(norwegianLabels["ui.renderer.GRID · Export"]).toContain("Innmating");
  });
});
