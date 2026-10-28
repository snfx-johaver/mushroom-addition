import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { finnishHelpers, finnishLabels } from "../src/translations/fi";

const withoutAdditions = (
  catalog: Record<string, string>,
  additions: Record<string, string>,
) => Object.fromEntries(Object.entries(catalog).filter(([key]) => !Object.hasOwn(additions, key)));

const fingerprint = (catalog: Record<string, string>) =>
  createHash("sha256")
    .update(JSON.stringify(Object.entries(catalog).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)))
    .digest("hex");

const numericLiterals = (text: string) => (text.match(/-?\d+(?:\.\d+)?/g) ?? []).sort();
const codeLiterals = (text: string) =>
  (text.match(/\$[a-z][a-z0-9_]*|\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b|\b[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+\b/g) ?? []).sort();
const sharedTerms = new Set(["ui.renderer.CPU", "ui.renderer.RAM", "ui.renderer.Ping"]);

const installedLabels = withoutAdditions(translationCatalogs.fi, finnishLabels);
const installedHelpers = withoutAdditions(helperCatalogs.fi, finnishHelpers);
const catalogs = [
  {
    name: "labels",
    english: translationCatalogs.en,
    current: translationCatalogs.fi,
    installed: installedLabels,
    additions: finnishLabels,
    expectedInstalledFingerprint: "6a9ec4ab1d0adf5bc061d5d375d4cdc995c9c5310dee98cf5e127938c2cb273f",
    expectedAdditions: 771,
  },
  {
    name: "helpers",
    english: englishHelpers,
    current: helperCatalogs.fi,
    installed: installedHelpers,
    additions: finnishHelpers,
    expectedInstalledFingerprint: "06594ef25c1e1b435b23030d073b0c6c03e3c58618571d716f04b74eb264adaa",
    expectedAdditions: 556,
  },
];

describe("complete Finnish localization", () => {
  it("adds exactly the missing labels and helpers without changing installed translations", () => {
    for (const catalog of catalogs) {
      const missing = Object.keys(catalog.english).filter((key) => !Object.hasOwn(catalog.installed, key));
      expect(Object.keys(catalog.additions).length, `${catalog.name} additions`).toBe(catalog.expectedAdditions);
      expect(Object.keys(catalog.additions).sort(), `${catalog.name} exact missing keys`).toEqual(missing.sort());
      expect(fingerprint(catalog.installed), `${catalog.name} installed translations`).toBe(
        catalog.expectedInstalledFingerprint,
      );
      expect(Object.keys(catalog.installed).length + Object.keys(catalog.additions).length).toBe(
        Object.keys(catalog.english).length,
      );

      const wiredKeys = Object.keys(catalog.additions).filter(
        (key) => catalog.current[key] === catalog.additions[key],
      );
      expect([0, catalog.expectedAdditions], `${catalog.name} wiring must be all-or-nothing`).toContain(
        wiredKeys.length,
      );

      const merged = { ...catalog.installed, ...catalog.additions };
      expect(Object.keys(merged).sort()).toEqual(Object.keys(catalog.english).sort());
      for (const [key, value] of Object.entries(catalog.installed)) {
        expect(merged[key], `${catalog.name}.${key}`).toBe(value);
      }

      if (wiredKeys.length > 0) {
        expect(Object.keys(catalog.current).sort(), `${catalog.name} wired coverage`).toEqual(
          Object.keys(catalog.english).sort(),
        );
        for (const [key, value] of Object.entries(merged)) {
          expect(catalog.current[key], `${catalog.name}.${key}`).toBe(value);
        }
      } else {
        expect(Object.keys(catalog.current).sort(), `${catalog.name} pre-wiring coverage`).toEqual(
          Object.keys(catalog.installed).sort(),
        );
      }
    }

    expect(Object.keys(translationCatalogs.en)).toHaveLength(1187);
    expect(Object.keys(englishHelpers)).toHaveLength(557);
    expect(Object.keys(finnishLabels)).toHaveLength(771);
    expect(Object.keys(finnishHelpers)).toHaveLength(556);
    expect(Object.keys(finnishLabels).filter((key) => key.startsWith("ui.graph."))).toEqual([]);
  });

  it("covers every English label and helper with nonblank Finnish text and matching placeholders", () => {
    for (const catalog of catalogs) {
      const merged = { ...catalog.installed, ...catalog.additions };
      for (const [key, source] of Object.entries(catalog.english)) {
        expect(merged[key]?.trim(), `${catalog.name}.${key}`).toBeTruthy();
        expect(placeholders(merged[key]), `${catalog.name}.${key}`).toEqual(placeholders(source));
      }
      for (const [key, translated] of Object.entries(catalog.additions)) {
        if (!sharedTerms.has(key)) expect(translated, `${catalog.name}.${key}`).not.toBe(catalog.english[key]);
        expect(translated, `${catalog.name}.${key}`).not.toMatch(/\b(?:TODO|FIXME|untranslated)\b/i);
      }
    }
  });

  it("preserves numerical limits, code literals, protocols, configuration values and units", () => {
    for (const catalog of catalogs) {
      for (const [key, translated] of Object.entries(catalog.additions)) {
        const source = catalog.english[key];
        expect(numericLiterals(translated), `${catalog.name}.${key} numbers`).toEqual(numericLiterals(source));
        expect(codeLiterals(translated), `${catalog.name}.${key} literals`).toEqual(codeLiterals(source));
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
      expect(finnishHelpers[key], key).toBeDefined();
      for (const literal of literals) expect(finnishHelpers[key], key).toContain(literal);
    }

    expect(finnishLabels.buy_sell_trade_energy).toContain("(kWh)");
    expect(finnishLabels.buy_sell_trade_power).toContain("(kW)");
    expect(finnishLabels.buy_sell_feed_in_fee).toContain("€/kWh");
    expect(finnishLabels.panel_gauge_max).toContain("(W)");
    expect(finnishLabels["ui.area.attribute_help"]).toContain("brightness");
    expect(finnishLabels["ui.area.attribute_help"]).toContain("battery_level");
    expect(finnishLabels["ui.runtime_optional_nested_path_such_as_battery_level_30fc3244"]).toContain(
      "battery.level",
    );
    expect(finnishLabels["ui.runtime_use_playlist_for_spotify_playlist_ids_or_another_media_type_supported_by_your_player_c0de82c4"]).toContain(
      "playlist",
    );
    expect(finnishLabels["ui.runtime_use_playlist_for_spotify_playlist_ids_or_another_media_type_supported_by_your_player_c0de82c4"]).toContain(
      "Spotify",
    );
  });

  it("keeps Finnish-specific service safety and runtime behavior clear", () => {
    expect(finnishHelpers.pihole_pause_durations).toContain("ohjaa palvelin");
    expect(finnishHelpers.pihole_pause_durations).toContain("selaimen sulkemisen jälkeen");
    expect(finnishHelpers.pihole_pause_service).toContain("ei koskaan korvata pysyvällä sammutuksella");
    expect(finnishHelpers.pihole_metrics).toContain("ei koskaan korvata nollalla");
    expect(finnishHelpers.upcoming_hide_empty).toContain("selkeä virhe");
    expect(finnishHelpers.buy_sell_trade_energy_entity).toContain("virheen arvion sijaan");
    expect(finnishHelpers.collapsible_controls).toContain("ei voi ohjata");
    expect(finnishHelpers.remote_entity).toContain("ei koskaan");
    expect(finnishHelpers.remote_transport).toContain("ei oleteta tukevan Samsung-koodeja");
    expect(finnishHelpers.remote_double_tap).toContain("ylimääräistä Select-komentoa");
    expect(finnishHelpers.upcoming_text_template).toContain("ei suoriteta");
    expect(finnishHelpers.upcoming_trailers).toContain("ei ladata automaattisesti");
  });
});
