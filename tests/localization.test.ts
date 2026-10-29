import { openEditorSections } from "./editor-helpers";
import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import {
  editorHelper, localize, localizeText, localeDirection, normalizeLocale,
  SUPPORTED_LOCALES, translationCatalogs,
} from "../src/localize";
import { localizeEditorSchema } from "../src/localized-schema";
import { placeholders, translationCoverage } from "../src/translation-coverage";
import { commonTranslations } from "../src/translations/common";
import { optionTranslations } from "../src/translations/options";
import { messageTranslations } from "../src/translations/messages";
import { controlLabelTranslations } from "../src/translations/control-labels";
import { mediaLabelTranslations } from "../src/translations/media-labels";
import { editorControlTranslations } from "../src/translations/editor-controls";
import { editorGuidanceTranslations } from "../src/translations/editor-guidance";
import { mediaOptionTranslations } from "../src/translations/media-options";
import { remoteOptionTranslations } from "../src/translations/remote-options";
import { presentationOptionTranslations } from "../src/translations/presentation-options";
import { greetingPollenTranslations } from "../src/translations/greetings-pollen";
import { runtimeControlTranslations } from "../src/translations/runtime-controls";
import { readUpcomingData, type MushroomUpcomingMedia } from "../src/upcoming-media";
import type { MushroomRemote } from "../src/remote-card";
import type { MushroomPiHole } from "../src/pi-hole";
import type { MushroomAdditionEditor } from "../src/editor";
import type { EditorField } from "../src/editor-schema";
import type { HomeAssistant } from "../src/types";

const makeHass = (language?: string): HomeAssistant => ({ language, states: {}, callService: vi.fn().mockResolvedValue(undefined) });
afterEach(() => document.body.replaceChildren());

describe("locale identity", () => {
  it("uses exactly Mushroom's 33 language identifiers", () => {
    expect(SUPPORTED_LOCALES).toEqual([
      "ar", "bg", "ca", "cs", "da", "de", "el", "en", "es", "fi", "fr", "he", "hu", "id", "it",
      "ko-KR", "nb", "nl", "pl", "pt-BR", "pt-PT", "ro", "ru", "sk", "sl", "sr-Latn", "sr",
      "sv", "tr", "uk", "vi", "zh-Hans", "zh-Hant",
    ]);
  });
  it.each([
    ["pt_BR", "pt-BR"], ["PT-br", "pt-BR"], ["pt-PT", "pt-PT"], ["pt-AO", "pt-PT"],
    ["pt", "pt-PT"], ["zh-CN", "zh-Hans"], ["zh-SG", "zh-Hans"], ["zh-TW", "zh-Hant"],
    ["zh-HK", "zh-Hant"], ["zh-MO", "zh-Hant"], ["zh-Hans-TW", "zh-Hans"],
    ["zh-Hant-CN", "zh-Hant"], ["sr-Latn-RS", "sr-Latn"], ["SR_latn", "sr-Latn"],
    ["sr-Cyrl-RS", "sr"], ["sr", "sr"], ["ko", "ko-KR"], ["ko-KR", "ko-KR"],
    ["nb-NO", "nb"], ["no", "nb"], ["ar-SA", "ar"], ["he-IL", "he"],
    ["de-AT", "de"], ["en-GB", "en"], ["xx-YY", "en"], [undefined, "en"],
  ])("normalizes %s to %s", (input, expected) => expect(normalizeLocale(input)).toBe(expected));
  it("keeps regional and script variants distinct", () => {
    expect(localize(makeHass("pt-BR"), "humidity_entity")).toBe("Sensor de umidade");
    expect(localize(makeHass("pt-PT"), "humidity_entity")).toBe("Sensor de humidade");
    expect(localize(makeHass("zh-CN"), "entity")).toBe("实体");
    expect(localize(makeHass("zh-TW"), "entity")).toBe("實體");
    expect(localize(makeHass("sr-Latn"), "entity")).toBe("Entitet");
    expect(localize(makeHass("sr-Cyrl"), "entity")).toBe("Ентитет");
  });
  it("recognizes RTL without changing native Home Assistant direction handling", () => {
    expect(localeDirection("ar-SA")).toBe("rtl");
    expect(localeDirection("he-IL")).toBe("rtl");
    expect(localeDirection("sr-Latn")).toBe("ltr");
    expect(localize(makeHass("he"), "ui.select")).toBe("בחירה");
  });
  it("retains English fallback for an absent or unsupported language", () => {
    expect(localize(undefined, "entity")).toBe("Entity");
    expect(localize(makeHass("xx"), "entity")).toBe("Entity");
    expect(editorHelper("entity")).toBe("The Home Assistant entity shown and controlled by this card.");
  });
});

describe("translated text safety and coverage", () => {
  it("retains every named placeholder in the original translated tables", () => {
    for (const catalogs of [commonTranslations, optionTranslations, messageTranslations, controlLabelTranslations, mediaLabelTranslations, editorControlTranslations, editorGuidanceTranslations, mediaOptionTranslations, remoteOptionTranslations, presentationOptionTranslations, greetingPollenTranslations, runtimeControlTranslations]) {
      for (const locale of SUPPORTED_LOCALES) {
        expect(Object.keys(catalogs[locale])).toEqual(Object.keys(catalogs.en));
        for (const [key, value] of Object.entries(catalogs[locale])) {
          expect(value.trim()).not.toBe("");
          expect(placeholders(value), `${locale}.${key}`).toEqual(placeholders(catalogs.en[key]));
        }
      }
    }
  });
  it("measures missing translations rather than counting English fallbacks", () => {
    const coverage = translationCoverage();
    expect(coverage).toHaveLength(33);
    expect(coverage.every(locale => locale.invalid.length === 0)).toBe(true);
    expect(coverage.find(locale => locale.locale === "en")?.missing).toEqual([]);
    const missing = coverage.find(locale => locale.locale === "pt-BR")!;
    expect(missing.translated + missing.missing.length).toBe(missing.total);
    // A successful lookup via English fallback must never inflate catalog coverage.
    if (missing.missing.length) {
      const key = missing.missing.find(key => key.startsWith("labels."))?.slice(7);
      if (key) {
        expect(translationCatalogs["pt-BR"][key]).toBeUndefined();
        expect(localize(makeHass("pt-BR"), key)).toBe(translationCatalogs.en[key]);
      }
    }
  });
  it("substitutes named values once without interpreting their contents", () => {
    expect(localize(makeHass("zh-Hant"), "ui.show_more", { count: 3 })).toBe("再顯示 3 項");
    expect(localize(makeHass("nl"), "ui.toggle", { name: "{count}<Office>" })).toBe("{count}<Office> omschakelen");
    expect(localize(makeHass("nl"), "ui.show_more")).toContain("{count}");
    expect(localizeText(makeHass("de"), "Temperature sensor")).toBe("Temperatursensor");
  });
  it.each(SUPPORTED_LOCALES)("translates new-card selector wording without an English fallback for %s", locale => {
    for (const catalogs of [mediaOptionTranslations, remoteOptionTranslations, presentationOptionTranslations]) {
      for (const [key, original] of Object.entries(catalogs.en)) {
        expect(localizeText(makeHass(locale), original), `${locale}.${key}`).toBe(catalogs[locale][key]);
      }
    }
    expect(localizeText(makeHass(locale), "Pi-hole v6")).toBe("Pi-hole v6");
    expect(localizeText(makeHass(locale), "Samsung TV")).toBe("Samsung TV");
  });
  it("formats duration choices using localized units and keeps serialized values unchanged", () => {
    const fields: EditorField[] = [{
      name: "pihole_pause_durations", selector: { select: { multiple: true, options: [
        { value: "30", label: "30 seconds" }, { value: "300", label: "5 minutes" },
      ] } },
    }];
    const result = localizeEditorSchema(makeHass("de"), fields);
    expect(result[0].selector?.select).toEqual({ multiple: true, options: [
      { value: "30", label: "30 Sekunden" }, { value: "300", label: "5 Minuten" },
    ] });
    expect(fields[0].selector?.select).toEqual({ multiple: true, options: [
      { value: "30", label: "30 seconds" }, { value: "300", label: "5 minutes" },
    ] });
  });
  it("accepts hass compatibly for editor helpers", () => {
    expect(editorHelper("entity", makeHass("pt-BR"))).toContain("exibida");
    expect(editorHelper("entity", makeHass("pt-PT"))).toContain("apresentada");
    expect(editorHelper("not_a_field", makeHass("nl"))).toBeUndefined();
  });
  it("translates option labels recursively without mutating values, images or HA selectors", () => {
    const fields: EditorField[] = [{
      name: "", type: "grid", schema: [{
        name: "layout", selector: { select: { options: [
          { value: "horizontal", label: "Horizontal", image: { src: "/static/English.svg", flip_rtl: true } },
          { value: "vertical", label: "Vertical" },
        ] } },
      }, { name: "entity", selector: { entity: { domain: "light" } } }],
    }];
    const before = JSON.stringify(fields);
    const translated = localizeEditorSchema(makeHass("zh-Hant"), fields);
    const select = translated[0].schema![0].selector!.select as { options: { value: string; label: string; image?: unknown }[] };
    expect(select.options[0]).toEqual({
      value: "horizontal", label: "水平", image: { src: "/static/English.svg", flip_rtl: true },
    });
    expect(select.options[1]).toEqual({ value: "vertical", label: "垂直" });
    expect(translated[0].schema![1]).toEqual(fields[0].schema![1]);
    expect(JSON.stringify(fields)).toBe(before);
  });
});

describe("localized card rendering", () => {
  it("renders Serbian script-specific remote controls without changing command payloads", async () => {
    const card = document.createElement("mushroom-addition-remote") as MushroomRemote;
    const hass = makeHass("sr-Latn-RS");
    hass.states["remote.tv"] = { entity_id: "remote.tv", state: "on", attributes: {} };
    card.hass = hass;
    card.config = { type: "custom:mushroom-addition-remote-card", entity: "remote.tv", remote_navigation: "buttons" };
    document.body.append(card);
    await card.updateComplete;
    (card.shadowRoot!.querySelector('[aria-label="Gore"]') as HTMLButtonElement).click();
    expect(hass.callService).toHaveBeenCalledWith("remote", "send_command", { entity_id: "remote.tv", command: "up" });
    card.hass = { ...hass, language: "sr-Cyrl-RS" };
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector('[aria-label="Горе"]')).not.toBeNull();
  });
  it("renders RTL labels while preserving user button names and numeric IDs", async () => {
    const card = document.createElement("mushroom-addition-remote") as MushroomRemote;
    card.hass = makeHass("ar-SA");
    card.config = {
      type: "custom:mushroom-addition-remote-card", remote_sections: ["navigation", "keypad", "shortcuts"],
      remote_navigation: "buttons", remote_buttons: [{ type: "command", name: "Home", command: "KEY_HOME" }],
    };
    document.body.append(card);
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector('[aria-label="أعلى"]')).not.toBeNull();
    expect(card.shadowRoot!.querySelector('[aria-label="0"]')).not.toBeNull();
    expect(card.shadowRoot!.querySelector(".shortcut")?.getAttribute("aria-label")).toBe("Home");
  });
  it("translates Chinese upcoming-media errors and keeps attribute names verbatim", async () => {
    const hass = makeHass("zh-TW");
    const error = readUpcomingData({ entity_id: "sensor.media", state: "on", attributes: {} }, "MyData_123", hass).error;
    expect(error).toContain('"MyData_123"');
    expect(error).toContain("感測器");
    const card = document.createElement("mushroom-addition-upcoming-media") as MushroomUpcomingMedia;
    card.hass = hass;
    card.config = { type: "custom:mushroom-addition-upcoming-media-card" };
    document.body.append(card);
    await card.updateComplete;
    expect(card.shadowRoot!.textContent).toContain("請在卡片編輯器");
  });
  it("localizes Pi-hole metrics and confirmations but not entity friendly names", async () => {
    const card = document.createElement("mushroom-addition-pi-hole") as MushroomPiHole;
    const hass = makeHass("pt-BR");
    hass.states["switch.pihole"] = { entity_id: "switch.pihole", state: "on", attributes: { friendly_name: "My Pi-hole" } };
    card.hass = hass;
    card.config = { type: "custom:mushroom-addition-pi-hole-card", entity: "switch.pihole", pihole_sections: ["blocking", "statistics"] };
    document.body.append(card);
    await card.updateComplete;
    expect(card.shadowRoot!.textContent).toContain("Consultas DNS");
    expect(card.shadowRoot!.textContent).toContain("Bloqueio ativo");
    expect(card.shadowRoot!.querySelector('[aria-label="Alternar My Pi-hole"]')).not.toBeNull();
  });
  it("passes hass to form helper and option translation without translating config keys", async () => {
    const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
    editor.hass = makeHass("zh-Hant");
    editor.setConfig({ type: "custom:mushroom-addition-remote-card", entity: "media_player.TV", name: "Original Name" });
    document.body.append(editor);
    await openEditorSections(editor);
    expect(editor.shadowRoot!.textContent).toContain("情境");
    const forms = [...editor.shadowRoot!.querySelectorAll("ha-form")] as (HTMLElement & {
      schema: EditorField[]; computeHelper: (field: { name: string }) => string;
    })[];
    expect(forms[0].computeHelper({ name: "entity" })).toContain("Home Assistant 實體");
    expect(forms.some(form => JSON.stringify(form.schema).includes('"name":"remote_navigation"'))).toBe(true);
  });
  it.each(SUPPORTED_LOCALES)("has actual new-card field translations for %s", locale => {
    for (const catalogs of [controlLabelTranslations, mediaLabelTranslations]) {
      for (const key of Object.keys(catalogs.en)) {
        expect(translationCatalogs[locale][key], `${locale}.${key}`).toBe(catalogs[locale][key]);
        expect(localize(makeHass(locale), key)).toBe(catalogs[locale][key]);
      }
    }
  });
  it("translates remote section editing, command choices and native labels without rewriting button values", async () => {
    const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
    const hass = makeHass("de");
    editor.hass = hass;
    editor.setConfig({
      type: "custom:mushroom-addition-remote-card", entity: "remote.tv",
      remote_sections: ["power", "shortcuts"], remote_commands: { up: "KEY_UP_CUSTOM" },
      remote_buttons: [{ type: "command", name: "My Home", command: "KEY_HOME_CUSTOM" }],
    });
    document.body.append(editor);
    await openEditorSections(editor);
    const root = editor.shadowRoot!;
    expect(root.textContent).toContain("Fernbedienungsabschnitte");
    expect(root.textContent).toContain("Ein-/Aus- und Funktionstasten");
    expect(root.textContent).toContain("Tastenbelegungen");
    expect(root.textContent).toContain("My Home");
    expect(root.querySelector('[aria-label="Fernbedienungsabschnitt hinzufügen"]')).not.toBeNull();
    type NativeForm = HTMLElement & { computeLabel: (schema: { name: string }) => string; schema: EditorField[] };
    const form = root.querySelector("ha-form") as NativeForm;
    expect(form.computeLabel({ name: "entity" })).toBe("TV- oder Fernbedienungsentität");
    expect(form.computeLabel({ name: "remote_button_size" })).toBe("Größe der Fernbedienungstasten");
    const edit = [...root.querySelectorAll("ha-icon-button")].find(button =>
      (button as HTMLElement & { label: string }).label === "Eigene Taste bearbeiten")!;
    edit.dispatchEvent(new MouseEvent("click"));
    await openEditorSections(editor);
    const detail = root.querySelector(".remote-detail ha-form") as NativeForm;
    expect(detail.computeLabel({ name: "command" })).toBe("Befehlscode");
    const select = detail.schema[0].selector!.select as { options: { value: string; label: string }[] };
    expect(select.options[0]).toEqual({ value: "command", label: "Fernbedienungsbefehl" });
    const changed = vi.fn();
    editor.addEventListener("config-changed", changed);
    detail.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: { name: "Custom Home", command: "KEY_LITERAL" } },
    }));
    expect(changed.mock.calls[0][0].detail.config.remote_buttons[0]).toMatchObject({
      type: "command", name: "Custom Home", command: "KEY_LITERAL",
    });
  });
  it("localizes Pi-hole discovery editing without translating discovered names", async () => {
    const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
    editor.hass = {
      ...makeHass("zh-Hant"),
      states: {
        "sensor.custom": { entity_id: "sensor.custom", state: "42", attributes: { friendly_name: "Original sensor name" } },
      },
    };
    editor.setConfig({
      type: "custom:mushroom-addition-pi-hole-card",
      pihole_sections: ["statistics"], pihole_metric_entities: { queries: ["sensor.custom"] },
    });
    document.body.append(editor);
    await openEditorSections(editor);
    const root = editor.shadowRoot!;
    expect(root.textContent).toContain("感測器對應與實體順序");
    expect(root.textContent).toContain("目前對應：Original sensor name");
    expect(root.querySelector('[aria-label="DNS 查詢 感測器覆寫"]')).not.toBeNull();
  });
});
