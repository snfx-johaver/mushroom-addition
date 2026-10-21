import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { frenchHelpers, frenchLabels } from "../src/translations/fr";
import { runtimeEnglishLabels } from "../src/translations/runtime";

const labels = { ...translationCatalogs.fr, ...frenchLabels };
const helpers = { ...helperCatalogs.fr, ...frenchHelpers };

describe("complete French label and helper catalogs", () => {
  it("covers exactly the English keys, including runtime labels, without blank entries or changed placeholders", () => {
    for (const [english, french] of [
      [translationCatalogs.en, labels],
      [englishHelpers, helpers],
    ]) {
      expect(Object.keys(french).sort()).toEqual(Object.keys(english).sort());
      for (const [key, original] of Object.entries(english)) {
        expect(french[key]?.trim(), key).toBeTruthy();
        expect(placeholders(french[key]), key).toEqual(placeholders(original));
      }
    }
    for (const key of Object.keys(runtimeEnglishLabels)) {
      expect(labels[key]?.trim(), key).toBeTruthy();
    }
  });

  it("preserves installed French translations and adds original French rather than English fallback", () => {
    for (const [english, baseline, additions, merged] of [
      [translationCatalogs.en, translationCatalogs.fr, frenchLabels, labels],
      [englishHelpers, helperCatalogs.fr, frenchHelpers, helpers],
    ]) {
      for (const [key, original] of Object.entries(baseline)) {
        expect(merged[key], key).toBe(original);
      }
      for (const [key, translated] of Object.entries(additions)) {
        expect(english[key], key).toBeDefined();
        expect(translated, key).not.toBe(english[key]);
      }
    }
    expect(frenchLabels.battery_critical_threshold).toBe("Seuil de batterie critique");
    expect(frenchLabels.room_status_choose_entity).toBe("Choisir une entité");
    expect(frenchLabels.collapse_entity).toBe("Assistant de repli");
    expect(frenchHelpers.pihole_pause_durations).toContain("durée de pause est gérée par le serveur");
    expect(frenchHelpers.ulm_custom_card_washer_pause_action).toContain("mise en pause");
    expect(frenchHelpers.room_temperature_entity).toContain("unité de température");
    expect(frenchLabels["ui.renderer.weak_panel"]).toContain("présence d’ombre ou d’un défaut");
  });

  it("retains literal code examples, protocols, units, option values and numeric constraints", () => {
    const literals: Record<string, string[]> = {
      upcoming_data_attribute: ["data", "JSON"],
      upcoming_text_template: [
        "$title", "$episode", "$number", "$rating", "$runtime", "$release",
        "$day", "$date", "$time", "$studio", "$empty", "JavaScript", "HTML", "Jinja",
      ],
      upcoming_url: ["https://www.themoviedb.org/tv/$tmdb_id", "HTTP(S)"],
      upcoming_group_value: ["flag = true"],
      upcoming_date_format: ["dd, mm, yy ou yyyy"],
      remote_transport: ["remote.send_command", "play_media / send_key", "Samsung"],
      remote_device: ["remote.send_command", "Home Assistant"],
      pihole_pause_durations: ["30s, 5m, 1h30m ou 1h:30m:15s"],
      pihole_device_ids: ["v5", "v6"],
      cartridges: ["label, entity_id, type", "CSS"],
      ulm_button_service: ["domain.service"],
      ulm_card_welcome_collapse: ["input_boolean"],
      lower_bound: ["~20"],
      upper_bound: ["~25"],
      graph_span: ["1d", "YAML"],
      value_factor: ["-3"],
      ulm_card_media_player_enable_volume_adjust: ["0.01", "0.05 = 5%"],
      carousel_button_width: ["32-160"],
      carousel_button_height: ["32-160"],
      carousel_icon_size: ["12-96"],
      carousel_effect: ["Coverflow", "Slide", "Fade", "Cube", "Flip"],
      lights_hold_action: ["500 ms"],
      ulm_custom_card_washer_remote_control: ["true", "on"],
      battery_warning_threshold: ["50%"],
      battery_low_threshold: ["20%"],
      battery_critical_threshold: ["10%"],
      show_grid_phases: ["L1", "L2", "L3"],
      mode_smart_saving_label: ["Dynamic Smart Matching"],
      mode_smart_trading_label: ["Dynamic Trading + Smart Matching"],
    };
    for (const [key, examples] of Object.entries(literals)) {
      for (const example of examples) expect(helpers[key], `${key}: ${example}`).toContain(example);
    }
    expect(labels["ui.area.attribute_help"]).toContain("brightness ou battery_level");
    expect(labels["ui.runtime_optional_nested_path_such_as_battery_level_30fc3244"]).toContain("battery.level");
    expect(labels["ui.runtime_select_panel_sensors_in_the_card_editor_or_add_sensors_with_entity_ids_beginning_with_sensor_inverter_4_1ba7d684"]).toContain("sensor.inverter_4");
  });

  it("keeps behavioral qualifications in longer guidance", () => {
    expect(helpers.pihole_metrics).toContain("ne sont jamais remplacées par zéro");
    expect(helpers.pihole_pause_service).toContain("ni sur une minuterie du navigateur");
    expect(helpers.upcoming_hide_empty).toContain("affichent toujours une erreur explicite");
    expect(helpers.upcoming_trailers).toContain("Aucune bande-annonce n’est chargée automatiquement");
    expect(helpers.remote_entity).toContain("N’envoie jamais de commandes");
    expect(helpers.carousel_scrollbar).toContain("n’active pas l’entité");
    expect(helpers.ulm_card_media_player_power_button).toContain("ne coupe pas l’alimentation");
    expect(helpers.ulm_card_media_player_power_button).toContain("autres commandes sont repliées");
    expect(helpers.climate_name).toContain("Ne modifie pas l’en-tête de l’entité principale");
    expect(helpers.upcoming_text_template).toContain("Aucun JavaScript, HTML ou Jinja n’est exécuté");
  });
});
