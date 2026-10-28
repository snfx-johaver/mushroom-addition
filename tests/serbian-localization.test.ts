import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { nativeDiagnosticCatalogs } from "../src/native-diagnostics";
import { placeholders } from "../src/translation-coverage";
import { serbianLatinHelpers, serbianLatinLabels } from "../src/translations/sr-Latn";
import { serbianHelpers, serbianLabels } from "../src/translations/sr";

const fingerprints = {
  sr: {
    labels: "778d2a38796ac3b6f3cb6967a1d27c36e7e616797af9d6fd7fb3a105f3d2f81d",
    helpers: "d3f59f6e3057e0ed3215ba810ec7b68e7dd9cf145b5668d3efec22465a0d3d70",
  },
  "sr-Latn": {
    labels: "c980ab4f8c5a957ffcfb4d9bb251a12199d1ee04f93f3ac04c7f3be022d3fa35",
    helpers: "952c0b4c9b5011337d156d60b0d1caf01bb0645cc98ea8bd589345170a11d1cf",
  },
} as const;

const fingerprint = (catalog: Record<string, string>) =>
  createHash("sha256")
    .update(JSON.stringify(
      Object.entries(catalog)
        .filter(([key]) => !key.startsWith("ui.graph."))
        .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0),
    ))
    .digest("hex");

const installedWithout = (catalog: Record<string, string>, additions: Record<string, string>) =>
  Object.fromEntries(Object.entries(catalog).filter(([key]) => !Object.hasOwn(additions, key)));

const numericLiterals = (value: string) => (value.match(/-?\d+(?:\.\d+)?/g) ?? []).sort();
const codeLiterals = (value: string) =>
  (value.match(/\$[a-z][a-z0-9_]*|\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b|\b[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+\b/g) ?? []).sort();
const unitLiterals = (value: string) =>
  (value.match(/€\/kWh|\bkWh\b|\bkW\b|\bW\b|\bms\b|%/g) ?? []).sort();

const latinLetters: Record<string, string> = {
  А: "A", а: "a", Б: "B", б: "b", В: "V", в: "v", Г: "G", г: "g",
  Д: "D", д: "d", Ђ: "Đ", ђ: "đ", Е: "E", е: "e", Ж: "Ž", ж: "ž",
  З: "Z", з: "z", И: "I", и: "i", Ј: "J", ј: "j", К: "K", к: "k",
  Л: "L", л: "l", Љ: "Lj", љ: "lj", М: "M", м: "m", Н: "N", н: "n",
  Њ: "Nj", њ: "nj", О: "O", о: "o", П: "P", п: "p", Р: "R", р: "r",
  С: "S", с: "s", Т: "T", т: "t", Ћ: "Ć", ћ: "ć", У: "U", у: "u",
  Ф: "F", ф: "f", Х: "H", х: "h", Ц: "C", ц: "c", Ч: "Č", ч: "č",
  Џ: "Dž", џ: "dž", Ш: "Š", ш: "š",
};

const toLatin = (text: string) => [...text].map((character) => latinLetters[character] ?? character).join("");

const catalogs = [
  {
    locale: "sr",
    labels: serbianLabels,
    helpers: serbianHelpers,
    installedLabels: translationCatalogs.sr,
    installedHelpers: helperCatalogs.sr,
    latin: false,
  },
  {
    locale: "sr-Latn",
    labels: serbianLatinLabels,
    helpers: serbianLatinHelpers,
    installedLabels: translationCatalogs["sr-Latn"],
    installedHelpers: helperCatalogs["sr-Latn"],
    latin: true,
  },
] as const;

describe("complete Serbian card localization", () => {
  it("adds exactly the missing labels and helpers without changing the installed baseline", () => {
    expect(Object.keys(translationCatalogs.en)).toHaveLength(1179);
    expect(Object.keys(englishHelpers)).toHaveLength(549);

    for (const { locale, labels, helpers, installedLabels, installedHelpers } of catalogs) {
      const labelsBeforeAdditions = installedWithout(installedLabels, labels);
      const helpersBeforeAdditions = installedWithout(installedHelpers, helpers);
      expect(Object.keys(labelsBeforeAdditions)).toHaveLength(416);
      expect(Object.keys(helpersBeforeAdditions)).toHaveLength(1);
      expect(fingerprint(labelsBeforeAdditions)).toBe(fingerprints[locale].labels);
      expect(fingerprint(helpersBeforeAdditions)).toBe(fingerprints[locale].helpers);
      expect(Object.keys(labels)).toHaveLength(763);
      expect(Object.keys(helpers)).toHaveLength(548);
      expect(Object.keys(labels).sort()).toEqual(
        Object.keys(translationCatalogs.en).filter((key) => !Object.hasOwn(labelsBeforeAdditions, key)).sort(),
      );
      expect(Object.keys(helpers).sort()).toEqual(
        Object.keys(englishHelpers).filter((key) => !Object.hasOwn(helpersBeforeAdditions, key)).sort(),
      );
      expect(Object.keys(labels).filter((key) => key.startsWith("ui.graph."))).toEqual([]);

      const completeLabels = { ...labelsBeforeAdditions, ...labels };
      const completeHelpers = { ...helpersBeforeAdditions, ...helpers };
      expect(Object.keys(completeLabels).sort()).toEqual(Object.keys(translationCatalogs.en).sort());
      expect(Object.keys(completeHelpers).sort()).toEqual(Object.keys(englishHelpers).sort());
      for (const [key, original] of Object.entries(labelsBeforeAdditions)) {
        expect(completeLabels[key], `${locale}:${key}`).toBe(original);
      }
      for (const [key, original] of Object.entries(helpersBeforeAdditions)) {
        expect(completeHelpers[key], `${locale}:${key}`).toBe(original);
      }
    }
  });

  it("provides complete nonblank translations and preserves placeholders, numbers, and code literals", () => {
    for (const { locale, labels, helpers, latin } of catalogs) {
      const entries = [
        ...Object.entries(labels).map(([key, value]) => [key, translationCatalogs.en[key], value] as const),
        ...Object.entries(helpers).map(([key, value]) => [key, englishHelpers[key], value] as const),
      ];
      for (const [key, original, translated] of entries) {
        expect(original, `${locale}:${key}`).toBeDefined();
        expect(translated.trim(), `${locale}:${key}`).toBeTruthy();
        expect(placeholders(translated), `${locale}:${key}`).toEqual(placeholders(original));
        expect(numericLiterals(translated), `${locale}:${key}`).toEqual(numericLiterals(original));
        expect(codeLiterals(translated), `${locale}:${key}`).toEqual(codeLiterals(original));
        expect(unitLiterals(translated), `${locale}:${key}`).toEqual(unitLiterals(original));

        if (latin) {
          expect(translated, `${locale}:${key}`).not.toMatch(/[А-Яа-яЂђЈјЉљЊњЋћЏџ]/u);
          expect(translated, `${locale}:${key}`).not.toMatch(/[ыэъёЫЭЪЁ]/u);
        } else if (key !== "ui.renderer.CPU" && key !== "ui.renderer.RAM" && key !== "ui.renderer.Ping") {
          expect(translated, `${locale}:${key}`).toMatch(/[А-Яа-яЂђЈјЉљЊњЋћЏџ]/u);
          expect(translated, `${locale}:${key}`).not.toMatch(/[ыэъёЫЭЪЁ]/u);
        }
      }
    }
  });

  it("keeps the Latin catalog as an exact Serbian-script transliteration", () => {
    for (const [key, value] of Object.entries(serbianLabels)) {
      expect(serbianLatinLabels[key], key).toBe(toLatin(value));
    }
    for (const [key, value] of Object.entries(serbianHelpers)) {
      expect(serbianLatinHelpers[key], key).toBe(toLatin(value));
    }
  });

  it("keeps Mushroom terms distinct and native diagnostics outside these additions", () => {
    expect(serbianLabels.grid_power_entity).toBe("Снага електричне мреже");
    expect(serbianLabels["ui.renderer.GRID"]).toBe("МРЕЖА");
    expect(serbianLabels.buy_sell_show_grid).toBe("Прикажи мрежу графика");
    expect(serbianLabels.collapsed).toBe("Прикажи склопљено");
    expect(serbianLabels["ui.runtime_stop_washer_630a44cc"]).toBe("Заустави машину за прање веша");
    expect(serbianLabels.battery_1_level_entity).toBe("Ниво батерије 1");
    expect(serbianLabels["ui.renderer.Download"]).toBe("Преузимање");
    expect(serbianLabels["ui.renderer.Upload"]).toBe("Слање");
    expect(Object.hasOwn(serbianLabels, "entity")).toBe(false);
    expect(Object.hasOwn(serbianHelpers, "entity")).toBe(false);

    for (const locale of ["sr", "sr-Latn"] as const) {
      expect(Object.keys(nativeDiagnosticCatalogs[locale])).toHaveLength(6);
      expect(Object.keys(serbianLabels)).not.toContain("diagnostics.timeout");
      expect(Object.keys(serbianHelpers)).not.toContain("diagnostics.timeout");
    }
  });

  it("retains technical examples, service names, entity tokens, and UI literals verbatim", () => {
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
      for (const literal of literals) expect(serbianHelpers[key], `${key}: ${literal}`).toContain(literal);
      for (const literal of literals) expect(serbianLatinHelpers[key], `${key}: ${literal}`).toContain(literal);
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
      for (const literal of literals) expect(serbianLabels[key], `${key}: ${literal}`).toContain(literal);
      for (const literal of literals) expect(serbianLatinLabels[key], `${key}: ${literal}`).toContain(literal);
    }
  });
});
