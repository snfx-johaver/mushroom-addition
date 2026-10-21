import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { CATALOG } from "../src/catalog";
import { localize, SUPPORTED_LOCALES } from "../src/localize";
import { placeholders } from "../src/translation-coverage";
import { greetingPollenTranslations } from "../src/translations/greetings-pollen";
import { runtimeTranslations } from "../src/translations/runtime";
import { runtimeControlTranslations } from "../src/translations/runtime-controls";
import { runtimeValueTranslations } from "../src/translations/runtime-values";
import type { MushroomAdditionCard } from "../src/card";
import type { AdditionConfig, HomeAssistant } from "../src/types";

const makeHass = (language: string): HomeAssistant => ({
  language, states: {}, callService: vi.fn().mockResolvedValue(undefined),
});

const cardFor = async (id: string, hass: HomeAssistant, config: Partial<AdditionConfig> = {}) => {
  const descriptor = CATALOG.find(item => item.upstreamId === id)!;
  expect(descriptor).toBeDefined();
  const card = document.createElement(descriptor.tag) as MushroomAdditionCard;
  card.hass = hass;
  card.setConfig({ type: `custom:${descriptor.tag}`, ...config });
  document.body.append(card);
  await card.updateComplete;
  return card;
};

afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
});

describe("runtime catalogs", () => {
  it.each(SUPPORTED_LOCALES)("preserves values, units and message placeholders in %s", locale => {
    const catalog = runtimeValueTranslations[locale];
    expect(Object.keys(catalog)).toEqual(Object.keys(runtimeValueTranslations.en));
    for (const [key, original] of Object.entries(runtimeValueTranslations.en)) {
      expect(catalog[key].trim()).toBeTruthy();
      expect(placeholders(catalog[key])).toEqual(placeholders(original));
      expect(localize(makeHass(locale), key)).toBe(catalog[key]);
    }
    const net = localize(makeHass(locale), "ui.renderer.net_result", { energy: 5, net: "+0.90" });
    expect(net).toContain("5 kWh");
    expect(net).toContain("+0.90 €");
    const minimum = localize(makeHass(locale), "ui.renderer.minimum_value", { value: "{energy} W" });
    expect(minimum).toContain("{energy} W");
  });

  it("renders the translated net trading result without changing energy or monetary values", async () => {
    const hass = makeHass("fr");
    hass.states["sensor.prices"] = {
      entity_id: "sensor.prices",
      state: "unknown",
      attributes: {
        slots: Array.from({ length: 20 }, (_, index) => [
          Date.UTC(2026, 0, 1) + index * 900_000, index < 10 ? 0.2 : 0.4, index % 4,
        ]),
      },
    };
    const card = await cardFor("advanced_energy_buy_sell", hass, {
      entity: "sensor.prices", buy_sell_trade_energy: 5, buy_sell_trade_efficiency: 100,
      buy_sell_trade_power: 4, buy_sell_feed_in_fee: 0.02,
    });
    expect(card.shadowRoot!.querySelector(".energy-result-net")?.textContent)
      .toContain("Résultat net pour 5 kWh : +0.90 €");
  });

  it.each(SUPPORTED_LOCALES)("provides actual greeting and pollen entries for %s", locale => {
    const catalog = greetingPollenTranslations[locale];
    expect(Object.keys(catalog)).toEqual(Object.keys(greetingPollenTranslations.en));
    for (const [key, original] of Object.entries(greetingPollenTranslations.en)) {
      expect(catalog[key].trim()).not.toBe("");
      expect(placeholders(catalog[key])).toEqual(placeholders(original));
      expect(localize(makeHass(locale), key)).toBe(catalog[key]);
    }
    if (locale !== "en") {
      expect(catalog["ui.greeting_morning"]).not.toBe(greetingPollenTranslations.en["ui.greeting_morning"]);
      expect(catalog["ui.pollen_high"]).not.toBe(greetingPollenTranslations.en["ui.pollen_high"]);
    }
  });

  it.each(["nl", "de"])("keeps every extracted runtime label and placeholder translated for %s", locale => {
    expect(Object.keys(runtimeTranslations[locale])).toEqual(Object.keys(runtimeTranslations.en));
    for (const [key, original] of Object.entries(runtimeTranslations.en)) {
      expect(runtimeTranslations[locale][key].trim(), key).not.toBe("");
      expect(placeholders(runtimeTranslations[locale][key]), key).toEqual(placeholders(original));
    }
  });

  it.each(SUPPORTED_LOCALES)("uses the translated runtime controls and named values for %s", locale => {
    const hass = makeHass(locale);
    for (const [key, original] of Object.entries(runtimeControlTranslations.en)) {
      const translated = runtimeControlTranslations[locale][key];
      expect(translated.trim(), key).not.toBe("");
      expect(placeholders(translated), key).toEqual(placeholders(original));
      expect(localize(hass, key), key).toBe(translated);
    }
    expect(localize(hass, "ui.renderer.earlier", { minutes: 15 })).toContain("15");
    expect(localize(hass, "ui.renderer.today", { value: "{name}<Original sensor>" })).toContain("{name}<Original sensor>");
  });
});

describe("localized legacy card behavior", () => {
  it.each(SUPPORTED_LOCALES)("renders pollen text in %s without modifying entities or custom names", async locale => {
    const hass = makeHass(locale);
    const entity = { entity_id: "sensor.pollen", state: "high", attributes: {} };
    hass.states[entity.entity_id] = entity;
    const card = await cardFor("custom_card_pollen", hass, { trees_entity: entity.entity_id });
    const item = card.shadowRoot!.querySelector(".pollen-item")!;
    expect(item.querySelector("b")?.textContent).toBe(localize(hass, "ui.pollen_tree"));
    expect(item.querySelector("small")?.textContent).toBe(localize(hass, "ui.pollen_high"));
    card.setConfig({
      type: `custom:${card.tagName.toLowerCase()}`, trees_entity: entity.entity_id,
      custom_card_pollen_tree_name: "Trees",
    });
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".pollen-item b")?.textContent).toBe("Trees");
    expect(entity.state).toBe("high");
  });

  it("updates the Welcome greeting when the Home Assistant language changes", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 9, 1, 9));
    const hass = { ...makeHass("ko-KR"), user: { name: "Home" } };
    const welcome = await cardFor("custom_card_welcome", hass);
    expect(welcome.shadowRoot!.querySelector(".welcome-greeting")?.textContent).toContain(localize(hass, "ui.greeting_morning"));
    const nextHass = { ...hass, language: "zh-Hant" };
    welcome.hass = nextHass;
    await welcome.updateComplete;
    expect(welcome.shadowRoot!.querySelector(".welcome-greeting")?.textContent).toContain("早安");
  });

  it("forwards native state formatting and preserves an explicit user heading", async () => {
    const hass = makeHass("de");
    hass.states["sensor.test"] = { entity_id: "sensor.test", state: "1.5", attributes: { unit_of_measurement: "kWh" } };
    hass.formatEntityState = vi.fn(() => "1,5 kWh");
    const card = await cardFor("card_battery", hass, {
      entity: "sensor.test", name: "Battery", primary_info: "name", secondary_info: "state",
    });
    expect(card.shadowRoot!.querySelector(".shared-presentation .ulm-name")?.textContent).toBe("Battery");
    expect(card.shadowRoot!.querySelector(".shared-presentation .ulm-label")?.textContent).toBe("1,5 kWh");
    expect(hass.formatEntityState).toHaveBeenCalledWith(hass.states["sensor.test"]);
  });

  it("keeps a translated panel gauge connected to its original more-info action", async () => {
    const hass = makeHass("nl");
    hass.states["sensor.panel_1"] = { entity_id: "sensor.panel_1", state: "125", attributes: { friendly_name: "Home", unit_of_measurement: "W" } };
    const card = await cardFor("advanced_energy_panel_health", hass, { panel_entities: ["sensor.panel_1"] });
    const action = vi.fn();
    card.addEventListener("hass-action", action);
    const gauge = card.shadowRoot!.querySelector(".panel-health-gauge") as HTMLButtonElement;
    expect(gauge.getAttribute("aria-label")).toBe("Home: 125 watt");
    gauge.click();
    expect(action).toHaveBeenCalledTimes(1);
    expect((action.mock.calls[0][0] as CustomEvent).detail).toMatchObject({
      action: "tap", config: { entity: "sensor.panel_1", tap_action: { action: "more-info" } },
    });
    expect(hass.callService).not.toHaveBeenCalled();
    expect(card.shadowRoot!.textContent).not.toContain("@click=");
  });
});
