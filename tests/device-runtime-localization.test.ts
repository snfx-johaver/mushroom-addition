import { afterEach, describe, expect, it } from "vitest";
import "../src/index";
import { CATALOG } from "../src/catalog";
import { FLOWER_BARS } from "../src/flower";
import { localizeText, SUPPORTED_LOCALES } from "../src/localize";
import { SONOS_CONTROLS } from "../src/sonos-controls";
import { runtimeDeviceTranslations } from "../src/translations/runtime-devices";
import type { AdditionConfig, HomeAssistant } from "../src/types";

afterEach(() => document.body.replaceChildren());

describe("device runtime localization", () => {
  it.each(SUPPORTED_LOCALES)("supplies all additional device labels in %s without blank cells", locale => {
    const catalog = runtimeDeviceTranslations[locale];
    expect(Object.keys(catalog).sort()).toEqual(Object.keys(runtimeDeviceTranslations.en).sort());
    expect(Object.values(catalog)).toHaveLength(19);
    for (const text of Object.values(catalog)) expect(text.trim()).toBeTruthy();
    for (const { label } of [...SONOS_CONTROLS, ...FLOWER_BARS]) {
      const key = Object.entries(runtimeDeviceTranslations.en).find(([, value]) => value === label)?.[0];
      const translated = localizeText({ language: locale, states: {}, callService: async () => undefined }, label);
      if (key) expect(translated, label).toBe(catalog[key]);
      else {
        expect(label).toBe("Temperature");
        if (locale === "zh-Hans") expect(translated).toBe("温度");
      }
    }
  });

  it.each([
    ["de", "Bodenfeuchte"],
    ["es", "Humedad del suelo"],
    ["fr", "Humidité du sol"],
    ["nl", "Bodemvochtigheid"],
    ["it", "Umidità del terreno"],
    ["zh-Hans", "土壤湿度"],
    ["zh-Hant", "土壤濕度"],
    ["pt-BR", "Umidade do solo"],
    ["pt-PT", "Humidade do solo"],
    ["pl", "Wilgotność gleby"],
    ["ru", "Влажность почвы"],
    ["uk", "Вологість ґрунту"],
  ])("localizes actual plant measurement accessibility text in %s without renaming the plant", async (language, label) => {
    const descriptor = CATALOG.find(item => item.upstreamId === "custom_card_plant")!;
    const card = document.createElement(descriptor.tag) as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    card.hass = {
      language,
      states: {
        "plant.flower": {
          entity_id: "plant.flower",
          state: "ok",
          attributes: { friendly_name: "Plant Home", moisture: 42 },
        },
      },
      callService: async () => undefined,
    };
    card.setConfig({
      type: `custom:${descriptor.tag}`,
      entity: "plant.flower",
      name: "Plant Home",
      ulm_card_flower_show_bars: ["moisture"],
    });
    document.body.append(card);
    await card.updateComplete;
    const measurement = card.shadowRoot!.querySelector('[data-flower-bar="moisture"]');
    expect(measurement?.getAttribute("aria-label")).toBe(`${label}: 42`);
    expect(measurement?.getAttribute("title")).toBe(`${label}: 42`);
    expect(card.shadowRoot!.textContent).toContain("Plant Home");
  });
});
