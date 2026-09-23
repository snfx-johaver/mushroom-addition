import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CATALOG } from "../src/catalog";
import { editorSchemaFor } from "../src/editor-schema";
import { normalizeConfig } from "../src/helpers";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import "../src/index";

const states: HomeAssistant["states"] = {
  "light.office": {
    entity_id: "light.office",
    state: "on",
    attributes: { friendly_name: "Office light", brightness: 128, rgb_color: [51, 102, 204] },
  },
  "media_player.office_sonos": {
    entity_id: "media_player.office_sonos",
    state: "playing",
    attributes: { friendly_name: "Office Sonos", source: "Spotify", volume_level: 0.42 },
  },
  "switch.office_plug": {
    entity_id: "switch.office_plug",
    state: "on",
    attributes: { friendly_name: "Office plug" },
  },
  "sensor.office_plug_power": {
    entity_id: "sensor.office_plug_power",
    state: "42.5",
    attributes: { friendly_name: "Office plug power", unit_of_measurement: "W" },
  },
  "sensor.office_plug_energy": {
    entity_id: "sensor.office_plug_energy",
    state: "2.8",
    attributes: { friendly_name: "Office plug energy", unit_of_measurement: "kWh" },
  },
  "sensor.office_plug_time": {
    entity_id: "sensor.office_plug_time",
    state: "0.5",
    attributes: { friendly_name: "Office plug runtime", unit_of_measurement: "h" },
  },
  "sensor.office_humidity": {
    entity_id: "sensor.office_humidity",
    state: "47",
    attributes: { friendly_name: "Office humidity", unit_of_measurement: "%" },
  },
  "binary_sensor.printer_online": {
    entity_id: "binary_sensor.printer_online",
    state: "on",
    attributes: { friendly_name: "Office printer" },
  },
  "sensor.printer_black": {
    entity_id: "sensor.printer_black",
    state: "84",
    attributes: { friendly_name: "Black toner", unit_of_measurement: "%" },
  },
  "sensor.printer_yellow": {
    entity_id: "sensor.printer_yellow",
    state: "37",
    attributes: { friendly_name: "Yellow toner", unit_of_measurement: "%" },
  },
  "sensor.printer_magenta": {
    entity_id: "sensor.printer_magenta",
    state: "63",
    attributes: { friendly_name: "Magenta toner", unit_of_measurement: "%" },
  },
  "sensor.printer_cyan": {
    entity_id: "sensor.printer_cyan",
    state: "51",
    attributes: { friendly_name: "Cyan toner", unit_of_measurement: "%" },
  },
  "climate.office": {
    entity_id: "climate.office",
    state: "heat",
    attributes: {
      friendly_name: "Office thermostat",
      current_temperature: 19,
      temperature: 21,
      target_temp_step: 0.5,
      hvac_action: "heating",
    },
  },
};

interface TestCard extends HTMLElement {
  hass: HomeAssistant;
  setConfig(config: AdditionConfig): void;
  updateComplete: Promise<boolean>;
  shadowRoot: ShadowRoot;
}

const renderCard = async (
  tag: string,
  config: AdditionConfig,
  overrides: HomeAssistant["states"] = states,
  callService = vi.fn(async () => undefined),
): Promise<TestCard> => {
  const element = document.createElement(tag) as TestCard;
  element.hass = { states: overrides, callService };
  element.setConfig(config);
  document.body.append(element);
  await element.updateComplete;
  return element;
};

const item = (id: string) => CATALOG.find((entry) => entry.upstreamId === id)!;

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

describe("power and printer custom batch certification", () => {
  it("records exact local interaction evidence and live-safe configurations", () => {
    const evidence = JSON.parse(readFileSync(
      join(process.cwd(), "docs", "assets", "visual-audit", "power-printer-local-certification.json"),
      "utf8",
    )) as {
      upstreamCommit: string;
      live: boolean;
      exactLiveConfigs: Record<string, AdditionConfig>;
      interactions: Record<string, { visibleInteractions: string[]; exactPayloads: unknown[] }>;
    };
    expect(evidence.upstreamCommit).toBe("f8a9cb67a53f91367f1dffe18516aa983b463cb5");
    expect(evidence.live).toBe(false);
    expect(Object.keys(evidence.exactLiveConfigs)).toEqual([
      "custom_card_light_colorpick",
      "custom_card_media_player_sonos",
      "custom_card_more_power_outlet",
      "custom_card_mpse_gauge",
      "custom_card_mpse_printer",
      "custom_card_mpse_thermostat",
    ]);
    expect(evidence.interactions.custom_card_light_colorpick.visibleInteractions).toHaveLength(8);
    expect(evidence.interactions.custom_card_light_colorpick.exactPayloads).toHaveLength(7);
    expect(evidence.interactions.custom_card_media_player_sonos.exactPayloads).toEqual([
      ["media_player", "volume_down", { entity_id: "media_player.office_joris_sonos" }],
      ["media_player", "media_play_pause", { entity_id: "media_player.office_joris_sonos" }],
      ["media_player", "volume_up", { entity_id: "media_player.office_joris_sonos" }],
    ]);
    expect(evidence.interactions.custom_card_mpse_thermostat.exactPayloads).toEqual([
      ["climate", "set_temperature", { entity_id: "climate.office_joris", temperature: "target - target_temp_step" }],
      ["climate", "set_temperature", { entity_id: "climate.office_joris", temperature: "target + target_temp_step" }],
    ]);
  });

  it("records deterministic matched-width geometry for all six comparisons", () => {
    const geometry = JSON.parse(readFileSync(
      join(process.cwd(), "docs", "assets", "visual-audit", "power-printer-geometry.json"),
      "utf8",
    )) as Record<string, {
      implementation: { width: number; height: number };
      surface: { width: number; height: number };
      regions: Record<string, Array<{ width: number; height: number }>>;
    }>;
    expect(Object.keys(geometry)).toEqual([
      "light-colorpick",
      "media-player-sonos",
      "more-power-outlet",
      "mpse-gauge",
      "mpse-printer",
      "mpse-thermostat",
    ]);
    expect(geometry["light-colorpick"].implementation.width).toBe(320);
    expect(geometry["light-colorpick"].regions[".light-color-swatches button"]).toHaveLength(6);
    expect(geometry["media-player-sonos"].implementation.width).toBe(507);
    expect(geometry["media-player-sonos"].regions[".sonos-controls button"]).toHaveLength(3);
    expect(geometry["more-power-outlet"].implementation.width).toBe(248);
    expect(geometry["mpse-gauge"].implementation).toEqual({ width: 197, height: 145 });
    expect(geometry["mpse-printer"].regions[".toner-bars span"])
      .toEqual(Array.from({ length: 4 }, () => ({ width: 232, height: 20 })));
    expect(geometry["mpse-thermostat"].implementation.width).toBe(246);
    expect(geometry["mpse-thermostat"].regions[".compact-thermostat-controls button"])
      .toEqual(Array.from({ length: 2 }, () => ({ width: 70, height: 42 })));
  });

  it("provides source-specific populated picker defaults", () => {
    const cases = [
      ["custom_card_light_colorpick", "light.office"],
      ["custom_card_media_player_sonos", "media_player.office_sonos"],
      ["custom_card_more_power_outlet", "switch.office_plug"],
      ["custom_card_mpse_gauge", "sensor.office_plug_power"],
      ["custom_card_mpse_printer", "binary_sensor.printer_online"],
      ["custom_card_mpse_thermostat", "climate.office"],
    ] as const;
    const hass: HomeAssistant = { states, callService: vi.fn(async () => undefined) };
    for (const [sourceId, entity] of cases) {
      const descriptor = item(sourceId);
      const constructor = customElements.get(descriptor.tag) as typeof HTMLElement & {
        getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
      };
      const config = constructor.getStubConfig(hass, Object.keys(states), []);
      expect(config).toMatchObject({ type: `custom:${descriptor.tag}`, entity });
      expect(window.customCards?.some((registration) =>
        registration.type === descriptor.tag && registration.preview)).toBe(true);
    }

    const light = customElements.get(item("custom_card_light_colorpick").tag) as typeof HTMLElement & {
      getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
    };
    expect(light.getStubConfig(hass, Object.keys(states), [])).toMatchObject({
      ulm_card_light_colorpick_name: "Office light",
      ulm_card_light_colorpick_transition: 1,
    });
    const outlet = customElements.get(item("custom_card_more_power_outlet").tag) as typeof HTMLElement & {
      getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
    };
    expect(outlet.getStubConfig(hass, Object.keys(states), [])).toMatchObject({
      power_entity: "sensor.office_plug_power",
      energy_entity: "sensor.office_plug_energy",
    });
  });

  it.each([
    ["custom_card_light_colorpick", ["entity", "ulm_card_light_colorpick_name", "ulm_card_light_colorpick_transition"]],
    ["custom_card_media_player_sonos", ["entity", "ulm_card_media_player_with_controls_name"]],
    ["custom_card_more_power_outlet", ["entity", "power_entity", "energy_entity", "time_entity"]],
    ["custom_card_mpse_gauge", ["entity", "minimum", "maximum"]],
    ["custom_card_mpse_printer", ["entity", "black_entity", "yellow_entity", "magenta_entity", "cyan_entity"]],
    ["custom_card_mpse_thermostat", ["entity"]],
  ])("exposes a dedicated graphical editor for %s", (sourceId, expected) => {
    const schema = editorSchemaFor(item(sourceId));
    expect(schema.map(({ name }) => name)).toEqual(expect.arrayContaining([
      ...expected,
      "name_mode",
      "icon",
      "tap_action",
      "hold_action",
      "double_tap_action",
    ]));
    expect(schema.filter(({ name }) => name === "entity")).toHaveLength(1);
  });

  it("round-trips all six configurations through the graphical editor", async () => {
    for (const descriptor of [
      item("custom_card_light_colorpick"),
      item("custom_card_media_player_sonos"),
      item("custom_card_more_power_outlet"),
      item("custom_card_mpse_gauge"),
      item("custom_card_mpse_printer"),
      item("custom_card_mpse_thermostat"),
    ]) {
      const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
        shadowRoot: ShadowRoot;
      };
      editor.hass = { states, callService: vi.fn(async () => undefined) };
      editor.setConfig({ type: `custom:${descriptor.tag}`, entity: Object.keys(states)[0] });
      document.body.append(editor);
      await editor.updateComplete;
      const form = editor.shadowRoot.querySelector<HTMLElement & { data: AdditionConfig }>("ha-form")!;
      const changed = vi.fn();
      editor.addEventListener("config-changed", changed);
      form.dispatchEvent(new CustomEvent("value-changed", {
        bubbles: true,
        composed: true,
        detail: { value: { ...form.data, name: "Edited source card" } },
      }));
      expect(changed).toHaveBeenCalledWith(expect.objectContaining({
        detail: { config: expect.objectContaining({ name: "Edited source card" }) },
      }));
      editor.remove();
    }
  });

  it("migrates every pinned legacy variable to its canonical field", () => {
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-media-player-sonos",
      ulm_card_media_player_with_controls_entity: "media_player.office_sonos",
    })).toMatchObject({ entity: "media_player.office_sonos" });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-more-power-outlet",
      entity: "switch.office_plug",
      custom_card_more_power_outlet_power_sensor: "sensor.office_plug_power",
      custom_card_more_power_outlet_energy_sensor: "sensor.office_plug_energy",
      custom_card_more_power_outlet_time_sensor: "sensor.office_plug_time",
    })).toMatchObject({
      power_entity: "sensor.office_plug_power",
      energy_entity: "sensor.office_plug_energy",
      time_entity: "sensor.office_plug_time",
    });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-mpse-gauge",
      entity: "sensor.office_humidity",
      ulm_card_mpse_gauge_min: 10,
      ulm_card_mpse_gauge_max: 90,
    })).toMatchObject({ minimum: 10, maximum: 90 });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-mpse-printer",
      entity: "binary_sensor.printer_online",
      ulm_card_printer_black_name: "sensor.printer_black",
      ulm_card_printer_yellow_name: "sensor.printer_yellow",
      ulm_card_printer_magenta_name: "sensor.printer_magenta",
      ulm_card_printer_cyan_name: "sensor.printer_cyan",
    })).toMatchObject({
      black_entity: "sensor.printer_black",
      yellow_entity: "sensor.printer_yellow",
      magenta_entity: "sensor.printer_magenta",
      cyan_entity: "sensor.printer_cyan",
    });
  });

  it("matches Colorpick state composition and all seven service payloads", async () => {
    const callService = vi.fn(async () => undefined);
    const card = await renderCard("mushroom-addition-custom-card-light-colorpick", {
      type: "custom:mushroom-addition-custom-card-light-colorpick",
      entity: "light.office",
      ulm_card_light_colorpick_transition: 1,
    }, states, callService);
    expect(card.shadowRoot.querySelectorAll(".light-color-swatches button")).toHaveLength(6);
    const slider = card.shadowRoot.querySelector<HTMLInputElement>('input[aria-label="Brightness"]')!;
    slider.value = "73";
    slider.dispatchEvent(new Event("change"));
    card.shadowRoot.querySelectorAll<HTMLButtonElement>(".light-color-swatches button")
      .forEach((control) => control.click());
    expect(callService.mock.calls).toEqual([
      ["light", "turn_on", { entity_id: "light.office", brightness_pct: 73 }],
      ["light", "turn_on", { entity_id: "light.office", rgb_color: [255, 255, 255], transition: 1 }],
      ["light", "turn_on", { entity_id: "light.office", rgb_color: [245, 68, 54], transition: 1 }],
      ["light", "turn_on", { entity_id: "light.office", rgb_color: [51, 102, 204], transition: 1 }],
      ["light", "turn_on", { entity_id: "light.office", rgb_color: [51, 204, 51], transition: 1 }],
      ["light", "turn_on", { entity_id: "light.office", rgb_color: [255, 0, 255], transition: 1 }],
      ["light", "turn_on", { entity_id: "light.office", rgb_color: [0, 255, 255], transition: 1 }],
    ]);
    card.remove();

    const off = await renderCard("mushroom-addition-custom-card-light-colorpick", {
      type: "custom:mushroom-addition-custom-card-light-colorpick",
      entity: "light.office",
    }, { ...states, "light.office": { ...states["light.office"], state: "off", attributes: { friendly_name: "Office light" } } });
    expect(off.shadowRoot.querySelector(".light-color-swatches")).toBeNull();
  });

  it("matches Sonos state labels, control icons, and exact service payloads", async () => {
    const callService = vi.fn(async () => undefined);
    const card = await renderCard("mushroom-addition-custom-card-media-player-sonos", {
      type: "custom:mushroom-addition-custom-card-media-player-sonos",
      entity: "media_player.office_sonos",
      ulm_card_media_player_with_controls_name: "Office",
    }, states, callService);
    expect(card.shadowRoot.textContent).toContain("Spotify • 42%");
    const controls = [...card.shadowRoot.querySelectorAll<HTMLButtonElement>(".sonos-controls button")];
    controls.forEach((control) => control.click());
    expect(callService.mock.calls).toEqual([
      ["media_player", "volume_down", { entity_id: "media_player.office_sonos" }],
      ["media_player", "media_play_pause", { entity_id: "media_player.office_sonos" }],
      ["media_player", "volume_up", { entity_id: "media_player.office_sonos" }],
    ]);
    card.remove();

    const paused = await renderCard("mushroom-addition-custom-card-media-player-sonos", {
      type: "custom:mushroom-addition-custom-card-media-player-sonos",
      entity: "media_player.office_sonos",
    }, {
      ...states,
      "media_player.office_sonos": { ...states["media_player.office_sonos"], state: "paused" },
    });
    expect((paused.shadowRoot.querySelectorAll(".sonos-controls ha-icon")[1] as HTMLElement & { icon: string }).icon)
      .toBe("mdi:play");
    expect(paused.shadowRoot.textContent).toContain("paused");
  });

  it("matches outlet on/off sensor combinations exactly", async () => {
    const config: AdditionConfig = {
      type: "custom:mushroom-addition-custom-card-more-power-outlet",
      entity: "switch.office_plug",
      power_entity: "sensor.office_plug_power",
      energy_entity: "sensor.office_plug_energy",
      time_entity: "sensor.office_plug_time",
    };
    const on = await renderCard("mushroom-addition-custom-card-more-power-outlet", config);
    expect(on.shadowRoot.textContent).toContain("42.5W • 2.8kWh • 50Mins");
    on.remove();
    const off = await renderCard("mushroom-addition-custom-card-more-power-outlet", config, {
      ...states,
      "switch.office_plug": { ...states["switch.office_plug"], state: "off" },
    });
    expect(off.shadowRoot.textContent).toContain("off • 2.8kWh");
    expect(off.shadowRoot.textContent).not.toContain("42.5W");
  });

  it("matches gauge title suppression and custom range behavior", async () => {
    const standard = await renderCard("mushroom-addition-custom-card-mpse-gauge", {
      type: "custom:mushroom-addition-custom-card-mpse-gauge",
      entity: "sensor.office_humidity",
      minimum: 0,
      maximum: 100,
    });
    expect(standard.shadowRoot.querySelector(".dual-gauge span")).toBeNull();
    standard.remove();
    const ranged = await renderCard("mushroom-addition-custom-card-mpse-gauge", {
      type: "custom:mushroom-addition-custom-card-mpse-gauge",
      entity: "sensor.office_humidity",
      minimum: 10,
      maximum: 90,
    });
    expect(ranged.shadowRoot.textContent).toContain("10 - 90");
  });

  it("matches printer header states and source toner order", async () => {
    const card = await renderCard("mushroom-addition-custom-card-mpse-printer", {
      type: "custom:mushroom-addition-custom-card-mpse-printer",
      entity: "binary_sensor.printer_online",
      ulm_card_printer_name: "Office printer",
      black_entity: "sensor.printer_black",
      yellow_entity: "sensor.printer_yellow",
      magenta_entity: "sensor.printer_magenta",
      cyan_entity: "sensor.printer_cyan",
    });
    expect(card.shadowRoot.querySelectorAll(".toner-bars > span")).toHaveLength(4);
    expect([...card.shadowRoot.querySelectorAll(".toner-bars b")].map((node) => node.textContent)).toEqual([
      "84 %", "37 %", "63 %", "51 %",
    ]);
    expect(card.shadowRoot.textContent).toContain("Office printer");
  });

  it("uses thermostat target_temp_step and disables unavailable controls", async () => {
    const callService = vi.fn(async () => undefined);
    const config: AdditionConfig = {
      type: "custom:mushroom-addition-custom-card-mpse-thermostat",
      entity: "climate.office",
    };
    const card = await renderCard("mushroom-addition-custom-card-mpse-thermostat", config, states, callService);
    expect(card.shadowRoot.textContent).toContain("19° • heat (heating)");
    const controls = [...card.shadowRoot.querySelectorAll<HTMLButtonElement>(".compact-thermostat-controls button")];
    controls.forEach((control) => control.click());
    expect(callService.mock.calls).toEqual([
      ["climate", "set_temperature", { entity_id: "climate.office", temperature: 20.5 }],
      ["climate", "set_temperature", { entity_id: "climate.office", temperature: 21.5 }],
    ]);
    card.remove();

    const unavailable = await renderCard("mushroom-addition-custom-card-mpse-thermostat", config, {
      ...states,
      "climate.office": {
        ...states["climate.office"],
        state: "unavailable",
        attributes: { friendly_name: "Office thermostat" },
      },
    });
    expect([...unavailable.shadowRoot.querySelectorAll<HTMLButtonElement>(".compact-thermostat-controls button")]
      .every((control) => control.disabled)).toBe(true);
  });

  it("dispatches the source card-surface more-info action for every renderer", async () => {
    for (const [tag, entity] of [
      ["mushroom-addition-custom-card-light-colorpick", "light.office"],
      ["mushroom-addition-custom-card-media-player-sonos", "media_player.office_sonos"],
      ["mushroom-addition-custom-card-more-power-outlet", "switch.office_plug"],
      ["mushroom-addition-custom-card-mpse-gauge", "sensor.office_humidity"],
      ["mushroom-addition-custom-card-mpse-printer", "binary_sensor.printer_online"],
      ["mushroom-addition-custom-card-mpse-thermostat", "climate.office"],
    ] as const) {
      const action = vi.fn();
      const card = await renderCard(tag, { type: `custom:${tag}`, entity });
      card.addEventListener("hass-action", action);
      (card.shadowRoot.querySelector(".action-surface") as HTMLElement).click();
      expect(action).toHaveBeenCalledWith(expect.objectContaining({
        detail: expect.objectContaining({
          action: "tap",
          config: expect.objectContaining({ entity, tap_action: { action: "more-info" } }),
        }),
      }));
      card.remove();
    }
  });
});
