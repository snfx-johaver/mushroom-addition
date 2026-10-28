import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, localeDirection, translationCatalogs } from "../src/localize";
import { nativeDiagnosticCatalogs } from "../src/native-diagnostics";
import { placeholders } from "../src/translation-coverage";
import { arabicHelpers, arabicLabels } from "../src/translations/ar";

const withoutAdditions = (catalog: Record<string, string>, additions: Record<string, string>) =>
  Object.fromEntries(Object.entries(catalog).filter(([key]) => !Object.hasOwn(additions, key)));

const catalogs = [
  {
    english: translationCatalogs.en,
    current: translationCatalogs.ar,
    additions: arabicLabels,
    installedCount: 416,
    addedCount: 781,
    installedHash: "7a8bc099665048efc9d82d38c3fb086502ccd9a6e99915e84181426c3bb8c639",
  },
  {
    english: englishHelpers,
    current: helperCatalogs.ar,
    additions: arabicHelpers,
    installedCount: 1,
    addedCount: 566,
    installedHash: "95e2ab070f7e44547b785e0280ea648d06cc51aaf36171ce8e44515cfd339335",
  },
] as const;

describe("complete original Arabic localization", () => {
  it("derives the exact missing inventory before and after central wiring", () => {
    for (const { english, current, additions, installedCount, addedCount } of catalogs) {
      const installed = withoutAdditions(current, additions);
      const expectedMissing = Object.keys(english).filter(key => !Object.hasOwn(installed, key)).sort();
      expect(Object.keys(installed)).toHaveLength(installedCount);
      expect(Object.keys(additions)).toHaveLength(addedCount);
      expect(Object.keys(additions).sort()).toEqual(expectedMissing);

      // Exercise both states even when the central catalog has not been wired yet.
      for (const candidate of [installed, { ...installed, ...additions }, current]) {
        expect(withoutAdditions(candidate, additions)).toEqual(installed);
        expect(Object.keys({ ...candidate, ...additions }).sort()).toEqual(Object.keys(english).sort());
      }
    }
  });

  it("fingerprints all installed text so additions cannot silently replace it", () => {
    for (const { current, additions, installedHash } of catalogs) {
      const installed = Object.entries(withoutAdditions(current, additions))
        .sort(([a], [b]) => a.localeCompare(b));
      expect(createHash("sha256").update(JSON.stringify(installed)).digest("hex")).toBe(installedHash);
      const merged = { ...current, ...additions };
      for (const [key, original] of Object.entries(current)) expect(merged[key], key).toBe(original);
    }
    expect(arabicLabels).not.toHaveProperty("entity");
    expect(arabicHelpers).not.toHaveProperty("entity");
    expect(helperCatalogs.ar.entity).toBe("كيان Home Assistant الذي تعرضه هذه البطاقة وتتحكم فيه.");
  });

  it("keeps shared graph labels and the six diagnostics separate for a strict total of 1770", () => {
    expect(Object.keys(arabicLabels).filter(key => key.startsWith("ui.graph."))).toEqual([]);
    expect(Object.keys(nativeDiagnosticCatalogs.ar).sort()).toEqual(Object.keys(nativeDiagnosticCatalogs.en).sort());
    expect(Object.keys(nativeDiagnosticCatalogs.ar)).toHaveLength(6);
    expect(Object.keys(translationCatalogs.en)).toHaveLength(1197);
    expect(Object.keys(englishHelpers)).toHaveLength(567);
    expect(Object.keys(translationCatalogs.en).length + Object.keys(englishHelpers).length +
      Object.keys(nativeDiagnosticCatalogs.en).length).toBe(1770);
    expect(Object.keys(arabicLabels).length + Object.keys(arabicHelpers).length).toBe(1347);
    expect(localeDirection("ar")).toBe("rtl");
  });

  it("provides Arabic prose for every addition, with no empty or English fallback values", () => {
    for (const { english, additions } of catalogs) {
      for (const [key, text] of Object.entries(additions)) {
        expect(english[key], key).toBeDefined();
        expect(text.trim(), key).toBeTruthy();
        expect(text, key).not.toBe(english[key]);
        expect(text, key).toMatch(/[\u0621-\u064a]/);
        expect(text, key).not.toMatch(/TODO|FIXME|translation pending/i);
      }
    }
  });

  it("preserves every placeholder, including template tokens, in the complete catalogs", () => {
    for (const { english, current, additions } of catalogs) {
      const merged = { ...current, ...additions };
      for (const [key, original] of Object.entries(english)) {
        expect(placeholders(merged[key]), key).toEqual(placeholders(original));
      }
    }
    for (const [key, original] of Object.entries(nativeDiagnosticCatalogs.en)) {
      expect(placeholders(nativeDiagnosticCatalogs.ar[key]), key).toEqual(placeholders(original));
    }
    expect(arabicLabels["ui.renderer.more_info"]).toBe("{label}: {state} · مزيد من المعلومات");
    expect(arabicLabels["ui.renderer.example"].replace("{value}", "sensor.inverter_4"))
      .toBe("على سبيل المثال: sensor.inverter_4");
  });

  it("retains numeric values, signs, ranges, percentages and technical units", () => {
    const numbers = (text: string) => (text.match(/-?\d+(?:\.\d+)?/g) ?? []).sort();
    for (const { english, additions } of catalogs) {
      for (const [key, text] of Object.entries(additions)) {
        expect(numbers(text), key).toEqual(numbers(english[key]));
        for (const unit of english[key].match(/€\/kWh|\bkWh\b|\bkW\b|\bW\b|\bms\b|%/g) ?? []) {
          expect(text, `${key}: ${unit}`).toContain(unit);
        }
      }
    }
    expect(arabicHelpers.carousel_button_width).toContain("32-160");
    expect(arabicHelpers.carousel_icon_size).toContain("12-96");
    expect(arabicHelpers.ulm_card_media_player_enable_volume_adjust).toContain("0.05 = 5%");
    expect(arabicHelpers.value_factor).toContain("-3");
  });

  it("retains raw service, entity, configuration and literal examples without translating identifiers", () => {
    for (const { english, additions } of catalogs) {
      for (const [key, original] of Object.entries(english)) {
        if (!Object.hasOwn(additions, key)) continue;
        const identifiers = original.match(/\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+(?:\.[a-z0-9_]+)*|\b[a-z]+\.[a-z0-9_]+/g) ?? [];
        for (const identifier of identifiers) expect(additions[key], `${key}: ${identifier}`).toContain(identifier);
      }
    }
    const examples: Record<string, string[]> = {
      upcoming_data_attribute: ["JSON", "data"],
      upcoming_text_template: [
        "$title", "$episode", "$number", "$rating", "$runtime", "$release", "$day",
        "$date", "$time", "$studio", "$empty", "JavaScript", "HTML", "Jinja",
      ],
      upcoming_url: ["https://www.themoviedb.org/tv/$tmdb_id", "HTTP(S)"],
      upcoming_group_value: ["flag = true"],
      upcoming_date_format: ["dd", "mm", "yy", "yyyy"],
      remote_transport: ["remote.send_command", "play_media / send_key", "Samsung"],
      remote_device: ["remote.send_command", "IR"],
      remote_swipe_distance: ["Enter", "Space", "Backspace", "Home"],
      pihole_device_ids: ["v5", "v6"],
      pihole_pause_durations: ["30s", "5m", "1h30m", "1h:30m:15s"],
      cartridges: ["label", "entity_id", "type", "CSS"],
      ulm_button_service: ["domain.service"],
      ulm_card_welcome_collapse: ["input_boolean"],
      ulm_custom_card_washer_remote_control: ["true", "on"],
      ulm_custom_card_window_handle: ["Closed", "Tilted", "Open"],
      ulm_card_battery_charger_type_entity_id: ["wireless", "AC", "USB", "charging"],
      lower_bound: ["~20"],
      upper_bound: ["~25"],
      graph_span: ["1d", "YAML"],
      show_grid_phases: ["L1", "L2", "L3"],
      battery_healthy_color: ["green"],
      battery_warning_color: ["yellow"],
      battery_low_color: ["orange"],
      battery_critical_color: ["red"],
    };
    for (const [key, literals] of Object.entries(examples)) {
      for (const literal of literals) expect(arabicHelpers[key], `${key}: ${literal}`).toContain(literal);
    }
    expect(arabicLabels["ui.area.attribute_help"]).toContain("brightness");
    expect(arabicLabels["ui.area.attribute_help"]).toContain("battery_level");
    expect(arabicLabels["ui.area.content_help"]).toContain("Desk lights");
  });

  it("uses Mushroom terminology while distinguishing statistical, energy and astronomy meanings", () => {
    expect(arabicLabels.icon_type).toBe("نوع الأيقونة");
    expect(arabicLabels.primary_info).toBe("المعلومات الأساسية");
    expect(arabicLabels.secondary_info).toBe("المعلومات الفرعية");
    expect(arabicLabels.media_controls).toBe("التحكم في الوسائط");
    expect(arabicLabels["ui.area.kind_template"]).toBe("قالب");
    expect(arabicLabels["ui.area.kind_conditional"]).toBe("مشروط");
    expect(arabicLabels["ui.renderer.Median"]).toBe("الوسيط");
    expect(arabicLabels["ui.runtime_average_b38ae2c5"]).toBe("المتوسط");
    expect(arabicLabels.power_entity).toBe("مستشعر القدرة");
    expect(arabicLabels.energy_entity).toBe("مستشعر الطاقة");
    expect(arabicLabels.moon_right_ascension_entity).toContain("المطلع المستقيم");
    expect(arabicLabels.moon_declination_entity).toContain("ميل القمر");
    expect(arabicLabels.moon_next_new_moon_entity).toContain("المحاق");
    expect(arabicLabels.moon_next_full_moon_entity).toContain("البدر");
    expect(arabicHelpers.buy_sell_trade_efficiency).toContain("بعد خسائر التخزين");
    expect(arabicHelpers.buy_sell_trade_energy).toContain("خسائر دورة الشحن والتفريغ");
    for (const [key, text] of Object.entries(arabicHelpers)) {
      if (englishHelpers[key].includes("Default:")) expect(text, key).toContain("الافتراضي:");
    }
  });

  it("preserves backend timing, no-zero substitution, errors and remote-control safety", () => {
    expect(arabicHelpers.pihole_pause_durations).toContain("تتولى الخلفية توقيت التعليق");
    expect(arabicHelpers.pihole_pause_durations).toContain("يستمر بعد إغلاق المتصفح");
    expect(arabicHelpers.pihole_pause_durations).toContain("ظاهرة ومعطلة");
    expect(arabicHelpers.pihole_pause_service).toContain("لا يتحول التعليق المؤقت مطلقًا إلى إيقاف دائم");
    expect(arabicHelpers.pihole_metrics).toContain("لا تُستبدل القيم المرتبطة المفقودة أو غير المتاحة بصفر مطلقًا");
    expect(arabicHelpers.pihole_duration_field).toContain("وتُحفظ بيانات الإجراء الأخرى");
    expect(arabicHelpers.upcoming_hide_empty).toContain("خطأً صريحًا");
    expect(arabicHelpers.upcoming_text_template).toContain("لا يُنفَّذ أي JavaScript أو HTML أو Jinja");
    expect(arabicHelpers.buy_sell_trade_energy_entity).toContain("خطأً بدلًا من تقدير");
    expect(arabicHelpers.remote_entity).toContain("لا تُرسل الأوامر مطلقًا");
    expect(arabicHelpers.remote_transport).toContain("فقط عند اكتشاف تلفاز Samsung");
    expect(arabicHelpers.remote_device).toContain("وليس معرّف جهاز");
    expect(arabicHelpers.remote_double_tap).toContain("دون أمر اختيار إضافي");
    expect(arabicHelpers.carousel_scrollbar).toContain("لا يؤدي اختيار موضع إلى تفعيل الكيان");
  });

  it("preserves action support, inactive-state restrictions and native Area ownership", () => {
    expect(arabicHelpers.volume_controls).toContain("تُخفى عناصر التحكم التي لا يدعمها الكيان");
    expect(arabicHelpers.media_controls).toContain("لا تظهر إلا العناصر التي يدعمها الكيان");
    expect(arabicHelpers.collapsible_controls).toContain("لا يمكن التحكم في الكيانات غير المعروفة أو غير المتاحة");
    expect(arabicHelpers.ulm_card_media_player_power_button).toContain("لا يقطع ذلك الكهرباء");
    expect(arabicHelpers.ulm_card_media_player_power_button).toContain("يبقى ظاهرًا عند طي بقية");
    expect(arabicHelpers.ulm_card_media_player_enable_volume_adjust).toContain("دعم تعيين مستوى الصوت");
    expect(arabicLabels["ui.area.sensor_icons_help"]).toContain("تظل القيم والتجميع تحت تحكم Home Assistant");
    expect(arabicLabels["ui.area.use_light_color_help"]).toContain("تُتجاهل الإضاءات المستبعدة");
    expect(arabicLabels[
      "ui.runtime_content_name_icon_and_icon_color_accept_home_assistant_jinja_templates_templates_run_in_home_assistant_not_in_the_browser_errors_are_shown_on_the_button_preview_f15200eb"
    ]).toContain("تُنفذ القوالب في Home Assistant، لا في المتصفح. وتظهر الأخطاء في معاينة الزر");
    expect(arabicLabels[
      "ui.runtime_use_the_native_editor_above_for_area_appearance_features_and_standard_domain_groups_edit_advanced_buttons_below_action_template_and_conditional_buttons_are_intentionally_hidden_from_native_control_lists_names_and_content_appear_below_icons_aligned_to_the_button_bottom_empty_controls_show_no_controls_automatic_controls_retain_home_assistant_defaults_8ead6f08"
    ]).toContain("تحتفظ عناصر التحكم التلقائية بإعدادات Home Assistant الافتراضية");
  });
});
