import { describe, expect, it } from "vitest";
import { englishHelpers, helperCatalogs, translationCatalogs } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { greekHelpers, greekLabels } from "../src/translations/el";

const strip = (catalog: Record<string, string>, additions: Record<string, string>) =>
  Object.fromEntries(Object.entries(catalog).filter(([key]) => !(key in additions)));

const baselineLabels = strip(translationCatalogs.el, greekLabels);
const baselineHelpers = strip(helperCatalogs.el, greekHelpers);
const missing = (english: Record<string, string>, baseline: Record<string, string>) =>
  Object.keys(english).filter(key => !(key in baseline)).sort();

const sameAsEnglish = new Set(["ui.renderer.Ping", "ui.renderer.RAM", "ui.renderer.CPU"]);
const latinUnits = new Set(["ui.renderer.panel_watts"]);
const digits = (text: string) => text.match(/\d+(?:[.,]\d+)?/g) ?? [];
const literals = (text: string) =>
  text.match(/\$[a-z_]+|[a-z]+(?:[_.][a-z0-9]+)+(?:\.[a-z_]+)*|https?:\/\/\S+[a-z0-9_]/gi) ?? [];

describe("complete Greek label and helper catalog", () => {
  it("covers exactly the inventory missing from the installed Greek catalogs", () => {
    expect(Object.keys(greekLabels).sort()).toEqual(missing(translationCatalogs.en, baselineLabels));
    expect(Object.keys(greekHelpers).sort()).toEqual(missing(englishHelpers, baselineHelpers));
    expect(Object.keys(greekLabels)).toHaveLength(763);
    expect(Object.keys(greekHelpers)).toHaveLength(548);
    expect(Object.keys(baselineLabels)).toHaveLength(416);
    expect(Object.keys(baselineHelpers)).toHaveLength(1);
    expect(Object.keys(translationCatalogs.en).length + Object.keys(englishHelpers).length).toBe(1734 - 6);
  });

  it("fills every English key with non-empty text and identical placeholders", () => {
    const labels = { ...baselineLabels, ...greekLabels };
    const helpers = { ...baselineHelpers, ...greekHelpers };
    expect(Object.keys(labels).sort()).toEqual(Object.keys(translationCatalogs.en).sort());
    expect(Object.keys(helpers).sort()).toEqual(Object.keys(englishHelpers).sort());
    for (const [english, greek] of [
      [translationCatalogs.en, labels],
      [englishHelpers, helpers],
    ]) {
      for (const [key, original] of Object.entries(english)) {
        expect(greek[key]?.trim(), key).toBeTruthy();
        expect(placeholders(greek[key]), key).toEqual(placeholders(original));
      }
    }
  });

  it("preserves installed Greek text and leaves shared graph labels alone", () => {
    for (const [key, text] of Object.entries(baselineLabels)) expect(translationCatalogs.el[key]).toBe(text);
    for (const key of Object.keys(greekLabels)) expect(key.startsWith("ui.graph.")).toBe(false);
    expect(baselineLabels.entity).toBe(translationCatalogs.el.entity);
    expect(baselineLabels.name).toBe(translationCatalogs.el.name);
  });

  it("contains real Greek text rather than English filler", () => {
    for (const [additions, english] of [
      [greekLabels, translationCatalogs.en],
      [greekHelpers, englishHelpers],
    ] as const) {
      for (const [key, text] of Object.entries(additions)) {
        if (sameAsEnglish.has(key)) continue;
        expect(text, key).not.toBe(english[key]);
        if (latinUnits.has(key)) continue;
        expect(text, key).toMatch(/[Ͱ-Ͽ]/);
      }
    }
  });

  it("keeps raw literals, selectors and numeric values from the English source", () => {
    for (const [additions, english] of [
      [greekLabels, translationCatalogs.en],
      [greekHelpers, englishHelpers],
    ] as const) {
      for (const [key, text] of Object.entries(additions)) {
        for (const literal of literals(english[key])) expect(text, `${key}: ${literal}`).toContain(literal);
        for (const number of digits(english[key])) expect(text, `${key}: ${number}`).toContain(number);
      }
    }
    const all = JSON.stringify([greekLabels, greekHelpers]);
    for (const literal of ["$empty", "remote.send_command", "domain.service", "input_boolean", "sensor.inverter_4", "battery.level"]) {
      expect(all).toContain(literal);
    }
  });

  it("keeps important semantics such as defaults and the Home Assistant action wording", () => {
    expect(greekHelpers.pihole_show_header).toBeTruthy();
    const defaults = Object.entries(greekHelpers).filter(([key]) => englishHelpers[key].includes("Default:"));
    for (const [key, text] of defaults) {
      expect(text, key).toContain("Προεπιλογή");
      expect(text, key).not.toContain("Default");
    }
  });
});