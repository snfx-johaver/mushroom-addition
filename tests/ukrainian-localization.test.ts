import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { ukrainianHelpers, ukrainianLabels } from "../src/translations/uk";

// Removing module-owned entries makes these checks valid before and after central integration.
const installedWithout = (catalog: Record<string, string>, additions: Record<string, string>) =>
  Object.fromEntries(Object.entries(catalog).filter(([key]) => !(key in additions)));

const installedLabels = installedWithout(translationCatalogs.uk, ukrainianLabels);
const installedHelpers = installedWithout(helperCatalogs.uk, ukrainianHelpers);
const catalogs = [
  [translationCatalogs.en, installedLabels, ukrainianLabels],
  [englishHelpers, installedHelpers, ukrainianHelpers],
] as const;

const fingerprint = (catalog: Record<string, string>) =>
  createHash("sha256")
    .update(JSON.stringify(Object.entries(catalog).filter(([key]) => !key.startsWith("ui.graph.")).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)))
    .digest("hex");

const numericLiterals = (value: string) => (value.match(/-?\d+(?:\.\d+)?/g) ?? []).sort();
const codeLiterals = (value: string) =>
  (value.match(/\$[a-z][a-z0-9_]*|\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b|\b[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+\b/g) ?? []).sort();

describe("complete Ukrainian card localization", () => {
  it("adds exactly the missing inventory without changing installed translations", () => {
    expect(Object.keys(ukrainianLabels)).toHaveLength(762);
    expect(Object.keys(ukrainianHelpers)).toHaveLength(547);
    expect(Object.keys(installedLabels)).toHaveLength(416);
    expect(Object.keys(installedHelpers)).toHaveLength(1);
    expect(fingerprint(installedLabels)).toBe("ce93a320bab4ca775946ac2988ea94d9c5f24efe6a9ba71fadea53c270345279");
    expect(fingerprint(installedHelpers)).toBe("140dab062b8c78717c8f776b50cc63ecdf05b8e3d1d837ed5a759139151da522");

    for (const [english, installed, additions] of catalogs) {
      const missing = Object.keys(english).filter((key) => !(key in installed)).sort();
      expect(Object.keys(additions).sort()).toEqual(missing);
      const merged = { ...installed, ...additions };
      expect(Object.keys(merged).sort()).toEqual(Object.keys(english).sort());
      for (const [key, value] of Object.entries(installed)) {
        expect(merged[key], key).toBe(value);
      }
    }
    expect(Object.keys(translationCatalogs.en)).toHaveLength(1178);
    expect(Object.keys(englishHelpers)).toHaveLength(548);
  });

  it("provides nonblank Ukrainian values and preserves every placeholder", () => {
    const technicalOnly = new Set(["ui.renderer.CPU", "ui.renderer.RAM"]);
    for (const [english, installed, additions] of catalogs) {
      for (const [key, original] of Object.entries(english)) {
        const translated = { ...installed, ...additions }[key];
        expect(translated?.trim(), key).toBeTruthy();
        expect(placeholders(translated), key).toEqual(placeholders(original));
      }
      for (const [key, translated] of Object.entries(additions)) {
        expect(english[key], key).toBeDefined();
        if (technicalOnly.has(key)) {
          expect(translated, key).toBe(english[key]);
        } else {
          expect(translated, key).not.toBe(english[key]);
          expect(translated, key).toMatch(/[А-Яа-яІіЇїЄєҐґ]/);
        }
        expect(translated, key).not.toMatch(/[ыэъёЫЭЪЁ]/);
      }
    }
  });

  it("retains numeric limits, code tokens, units, protocols and examples", () => {
    for (const [english, , additions] of catalogs) {
      for (const [key, translated] of Object.entries(additions)) {
        expect(numericLiterals(translated), key).toEqual(numericLiterals(english[key]));
        expect(codeLiterals(translated), key).toEqual(codeLiterals(english[key]));
      }
    }
    for (const [key, literals] of Object.entries({
      upcoming_text_template: ["$title", "$episode", "$number", "$rating", "$runtime", "$release", "$day", "$date", "$time", "$studio", "$empty", "JavaScript", "HTML", "Jinja"],
      upcoming_url: ["https://www.themoviedb.org/tv/$tmdb_id", "HTTP(S)"],
      upcoming_group_value: ["flag = true"],
      upcoming_date_format: ["dd, mm, yy", "yyyy"],
      pihole_pause_durations: ["30s, 5m, 1h30m", "1h:30m:15s"],
      remote_transport: ["remote.send_command", "play_media / send_key", "Samsung"],
      remote_swipe_distance: ["Enter", "Space", "Backspace", "Home"],
      cartridges: ["label, entity_id, type", "CSS"],
      ulm_card_media_player_enable_volume_adjust: ["0.01", "0.05 = 5%"],
      ulm_card_welcome_collapse: ["input_boolean"],
      ulm_button_service: ["domain.service"],
      lower_bound: ["~20"],
      upper_bound: ["~25"],
      graph_span: ["1d", "YAML"],
      mode_smart_trading_label: ["Dynamic Trading + Smart Matching"],
    })) {
      for (const literal of literals) expect(ukrainianHelpers[key], key).toContain(literal);
    }
    expect(ukrainianLabels.buy_sell_feed_in_fee).toContain("€/kWh");
    expect(ukrainianLabels.panel_gauge_max).toContain("(W)");
    expect(ukrainianLabels.buy_sell_trade_power).toContain("(kW)");
  });

  it("preserves backend timing, errors, native limitations and picker defaults", () => {
    expect(ukrainianHelpers.pihole_pause_durations).toContain("відлічує сервер");
    expect(ukrainianHelpers.pihole_pause_durations).toContain("після закриття браузера");
    expect(ukrainianHelpers.pihole_pause_service).toContain("ніколи не підміняється");
    expect(ukrainianHelpers.pihole_pause_service).toContain("таймером браузера");
    expect(ukrainianHelpers.pihole_metrics).toContain("ніколи не замінюються нулем");
    expect(ukrainianHelpers.upcoming_hide_empty).toContain("явну помилку");
    expect(ukrainianHelpers.buy_sell_trade_energy_entity).toContain("помилку замість оцінки");
    expect(ukrainianHelpers.collapsible_controls).toContain("керувати не можна");
    expect(ukrainianHelpers.remote_entity).toContain("ніколи не надсилаються");
    expect(ukrainianHelpers.remote_double_tap).toContain("без додаткової команди Select");
    expect(ukrainianHelpers.room_temperature_entity).toContain("одиницею температури");
    expect(ukrainianHelpers.room_brightness_entity).toContain("основний світильник, потім");
    expect(ukrainianHelpers.icon).toContain("за відсутності сутності");
    expect(ukrainianLabels["ui.area.sensor_icons_help"]).toContain("керує Home Assistant");
    expect(ukrainianLabels["ui.area.use_light_color_help"]).toContain("виключені світильники ігноруються");
    expect(ukrainianLabels["ui.runtime_group_membership_icon_and_actions_stay_native_add_an_entity_button_for_a_custom_icon_name_or_action_04800467"]).toContain("залишаються вбудованими");
    expect(ukrainianLabels["ui.runtime_content_name_icon_and_icon_color_accept_home_assistant_jinja_templates_templates_run_in_home_assistant_not_in_the_browser_errors_are_shown_on_the_button_preview_f15200eb"]).toContain("а не в браузері");
    expect(ukrainianLabels.grid_power_entity).toBe("Потужність електромережі");
    expect(ukrainianLabels.collapse_entity).toBe("Помічник згортання");
    expect(ukrainianLabels["ui.area.entity_button"]).toBe("Кнопка сутності");
  });
});
