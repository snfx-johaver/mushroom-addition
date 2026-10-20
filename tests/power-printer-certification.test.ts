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
    attributes: {
      friendly_name: "Office Sonos",
      source: "Spotify",
      volume_level: 0.42,
      entity_picture: "/api/media_player_proxy/media_player.office_sonos",
    },
  },
  "media_player.office_sonos_2": {
    entity_id: "media_player.office_sonos_2",
    state: "playing",
    attributes: { friendly_name: "Office Sonos controls", source: "Spotify", volume_level: 0.42 },
  },
  "switch.office_sonos_crossfade": {
    entity_id: "switch.office_sonos_crossfade",
    state: "on",
    attributes: { friendly_name: "Office Sonos Crossfade" },
  },
  "switch.office_sonos_night_sound": {
    entity_id: "switch.office_sonos_night_sound",
    state: "off",
    attributes: { friendly_name: "Office Sonos Night sound" },
  },
  "switch.office_sonos_speech_enhancement": {
    entity_id: "switch.office_sonos_speech_enhancement",
    state: "off",
    attributes: { friendly_name: "Office Sonos Speech enhancement" },
  },
  "switch.office_sonos_subwoofer_enabled": {
    entity_id: "switch.office_sonos_subwoofer_enabled",
    state: "on",
    attributes: { friendly_name: "Office Sonos Subwoofer" },
  },
  "switch.office_sonos_surround_enabled": {
    entity_id: "switch.office_sonos_surround_enabled",
    state: "on",
    attributes: { friendly_name: "Office Sonos Surrounds" },
  },
  "switch.office_sonos_loudness": {
    entity_id: "switch.office_sonos_loudness",
    state: "on",
    attributes: { friendly_name: "Office Sonos Loudness" },
  },
  "switch.office_sonos_surround_music_full_volume": {
    entity_id: "switch.office_sonos_surround_music_full_volume",
    state: "off",
    attributes: { friendly_name: "Office Sonos Surround full" },
  },
  "number.office_sonos_audio_delay": {
    entity_id: "number.office_sonos_audio_delay",
    state: "0",
    attributes: { friendly_name: "Office Sonos Audio delay", min: 0, max: 5, step: 1 },
  },
  "number.office_sonos_balance": {
    entity_id: "number.office_sonos_balance",
    state: "0",
    attributes: { friendly_name: "Office Sonos Balance", min: -100, max: 100, step: 1 },
  },
  "number.office_sonos_bass": {
    entity_id: "number.office_sonos_bass",
    state: "1",
    attributes: { friendly_name: "Office Sonos Bass", min: -10, max: 10, step: 1 },
  },
  "number.office_sonos_treble": {
    entity_id: "number.office_sonos_treble",
    state: "2",
    attributes: { friendly_name: "Office Sonos Treble", min: -10, max: 10, step: 1 },
  },
  "number.office_sonos_sub_gain": {
    entity_id: "number.office_sonos_sub_gain",
    state: "3",
    attributes: { friendly_name: "Office Sonos Sub gain", min: -15, max: 15, step: 1 },
  },
  "number.office_sonos_surround_level": {
    entity_id: "number.office_sonos_surround_level",
    state: "4",
    attributes: { friendly_name: "Office Sonos Surround level", min: -15, max: 15, step: 1 },
  },
  "number.office_sonos_music_surround_level": {
    entity_id: "number.office_sonos_music_surround_level",
    state: "5",
    attributes: { friendly_name: "Office Sonos Music surround level", min: -15, max: 15, step: 1 },
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
};

const sonosRegistry: NonNullable<HomeAssistant["entities"]> = Object.fromEntries([
  ["media_player.office_sonos", { device_id: "sonos-player" }],
  ["media_player.office_sonos_2", { device_id: "sonos-controls" }],
  ...Object.keys(states)
    .filter((entityId) => entityId.startsWith("switch.office_sonos_") || entityId.startsWith("number.office_sonos_"))
    .map((entityId) => [entityId, { device_id: "sonos-controls" }]),
]);

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
  entities?: HomeAssistant["entities"],
): Promise<TestCard> => {
  const element = document.createElement(tag) as TestCard;
  element.hass = { states: overrides, entities, callService };
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
      "custom_card_media_player_sonos",
      "custom_card_more_power_outlet",
      "custom_card_gauge",
      "custom_card_printer",
    ]);
    expect(evidence.interactions.custom_card_media_player_sonos.exactPayloads).toEqual([
      ["media_player", "volume_down", { entity_id: "media_player.office_joris_sonos" }],
      ["media_player", "media_play_pause", { entity_id: "media_player.office_joris_sonos" }],
      ["media_player", "volume_up", { entity_id: "media_player.office_joris_sonos" }],
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
      "media-player-sonos",
      "more-power-outlet",
      "gauge",
      "printer",
    ]);
    expect(geometry["media-player-sonos"].implementation.width).toBe(507);
    expect(geometry["media-player-sonos"].regions[".sonos-controls button"]).toHaveLength(3);
    expect(geometry["more-power-outlet"].implementation.width).toBe(248);
    expect(geometry["gauge"].implementation).toEqual({ width: 197, height: 145 });
    expect(geometry["printer"].regions[".toner-bars span"])
      .toEqual(Array.from({ length: 4 }, () => ({ width: 232, height: 20 })));
  });

  it("provides source-specific populated picker defaults", () => {
    const cases = [
      ["custom_card_media_player_sonos", "media_player.office_sonos"],
      ["custom_card_more_power_outlet", "switch.office_plug"],
      ["custom_card_gauge", "sensor.office_plug_power"],
      ["custom_card_printer", "binary_sensor.printer_online"],
    ] as const;
    const hass: HomeAssistant = { states, entities: sonosRegistry, callService: vi.fn(async () => undefined) };
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

    const outlet = customElements.get(item("custom_card_more_power_outlet").tag) as typeof HTMLElement & {
      getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
    };
    expect(outlet.getStubConfig(hass, Object.keys(states), [])).toMatchObject({
      power_entity: "sensor.office_plug_power",
      energy_entity: "sensor.office_plug_energy",
    });
    const sonos = customElements.get(item("custom_card_media_player_sonos").tag) as typeof HTMLElement & {
      getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
    };
    expect(sonos.getStubConfig(hass, Object.keys(states), [])).toMatchObject({
      entity: "media_player.office_sonos",
      crossfade_entity: "switch.office_sonos_crossfade",
      surround_full_entity: "switch.office_sonos_surround_music_full_volume",
      audio_delay_entity: "number.office_sonos_audio_delay",
      music_surround_level_entity: "number.office_sonos_music_surround_level",
    });
  });
  it.each([
    ["custom_card_media_player_sonos", [
      "entity", "crossfade_entity", "night_sound_entity", "speech_enhancement_entity",
      "subwoofer_entity", "surrounds_entity", "loudness_entity", "surround_full_entity",
      "audio_delay_entity", "balance_entity", "bass_entity", "treble_entity", "sub_gain_entity",
      "surround_level_entity", "music_surround_level_entity", "ulm_card_media_player_enable_art",
      "sonos_details_always_visible",
    ]],
    ["custom_card_more_power_outlet", ["entity", "power_entity", "energy_entity", "time_entity"]],
    ["custom_card_gauge", ["entity", "minimum", "maximum"]],
    ["custom_card_printer", ["entity", "black_entity", "yellow_entity", "magenta_entity", "cyan_entity"]],
  ])("exposes a dedicated graphical editor for %s", (sourceId, expected) => {
    const schema = editorSchemaFor(item(sourceId));
    expect(schema.map(({ name }) => name)).toEqual(expect.arrayContaining([
      ...expected,
      "name",
      "icon",
      "tap_action",
      "hold_action",
      "double_tap_action",
    ]));
    expect(schema.filter(({ name }) => name === "entity")).toHaveLength(1);
  });

  it("round-trips all six configurations through the graphical editor", async () => {
    for (const descriptor of [
      item("custom_card_media_player_sonos"),
      item("custom_card_more_power_outlet"),
      item("custom_card_gauge"),
      item("custom_card_printer"),
    ]) {
      const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
        shadowRoot: ShadowRoot;
      };
      editor.hass = { states, entities: sonosRegistry, callService: vi.fn(async () => undefined) };
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

  it("re-discovers automatic Sonos controls when the primary entity changes", async () => {
    const descriptor = item("custom_card_media_player_sonos");
    const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
      shadowRoot: ShadowRoot;
    };
    editor.hass = { states, entities: sonosRegistry, callService: vi.fn(async () => undefined) };
    editor.setConfig({ type: `custom:${descriptor.tag}`, entity: "media_player.office_sonos" });
    document.body.append(editor);
    await editor.updateComplete;
    const form = editor.shadowRoot.querySelector<HTMLElement & { data: AdditionConfig }>("ha-form")!;
    const changed = vi.fn();
    editor.addEventListener("config-changed", changed);
    form.dispatchEvent(new CustomEvent("value-changed", {
      bubbles: true,
      composed: true,
      detail: { value: { ...form.data, entity: "media_player.office_sonos_2" } },
    }));
    expect(changed).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        config: expect.not.objectContaining({
          crossfade_entity: "switch.office_sonos_crossfade",
        }),
      },
    }));
  });

  it("configures Sonos playlist shortcuts through the graphical editor", async () => {
    const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
      shadowRoot: ShadowRoot;
    };
    editor.hass = { states, entities: sonosRegistry, callService: vi.fn(async () => undefined) };
    editor.setConfig({
      type: "custom:mushroom-addition-custom-card-media-player-sonos",
      entity: "media_player.office_sonos",
      shortcuts: {
        columns: 4,
        buttons: [
          { icon: "mdi:party-popper", name: "Party", type: "playlist", id: "spotify:playlist:party" },
        ],
      },
    });
    document.body.append(editor);
    await editor.updateComplete;
    const shortcutEditor = editor.shadowRoot.querySelector(".sonos-shortcut-editor")!;
    const row = shortcutEditor.querySelector(".sonos-shortcut-row")!;
    const selectors = [...row.querySelectorAll<HTMLElement & { value: unknown }>("ha-selector")];
    expect(selectors.map((selector) => selector.value)).toEqual([
      "Party",
      "mdi:party-popper",
      "playlist",
      "spotify:playlist:party",
    ]);
    const changed = vi.fn();
    editor.addEventListener("config-changed", changed);
    selectors[3].dispatchEvent(new CustomEvent("value-changed", {
      bubbles: true,
      composed: true,
      detail: { value: "spotify:playlist:updated" },
    }));
    expect(changed).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        config: expect.objectContaining({
          shortcuts: {
            columns: 4,
            buttons: [
              expect.objectContaining({ id: "spotify:playlist:updated" }),
            ],
          },
        }),
      },
    }));
    editor.remove();
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
      type: "custom:mushroom-addition-custom-card-gauge",
      entity: "sensor.office_humidity",
      ulm_card_gauge_min: 10,
      ulm_card_gauge_max: 90,
    })).toMatchObject({ minimum: 10, maximum: 90 });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-printer",
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

  it("matches Sonos state labels, control icons, and exact service payloads", async () => {
    const callService = vi.fn(async () => undefined);
    const card = await renderCard("mushroom-addition-custom-card-media-player-sonos", {
      type: "custom:mushroom-addition-custom-card-media-player-sonos",
      entity: "media_player.office_sonos",
      ulm_card_media_player_with_controls_name: "Office",
    }, states, callService, sonosRegistry);
    expect(card.shadowRoot.textContent).toContain("Spotify • 42%");
    const controls = [...card.shadowRoot.querySelectorAll<HTMLButtonElement>(".sonos-controls button")];
    controls.forEach((control) => control.click());
    expect(callService.mock.calls).toEqual([
      ["media_player", "volume_down", { entity_id: "media_player.office_sonos" }],
      ["media_player", "media_play_pause", { entity_id: "media_player.office_sonos" }],
      ["media_player", "volume_up", { entity_id: "media_player.office_sonos" }],
    ]);
    expect(card.shadowRoot.querySelector("details.sonos-details")).not.toBeNull();
    expect(card.shadowRoot.querySelectorAll(".sonos-switches button")).toHaveLength(7);
    expect(card.shadowRoot.querySelectorAll(".sonos-sliders input")).toHaveLength(7);
    callService.mockClear();
    card.shadowRoot.querySelector<HTMLButtonElement>(".sonos-switches button")!.click();
    const bass = [...card.shadowRoot.querySelectorAll<HTMLInputElement>(".sonos-sliders input")]
      .find((input) => input.getAttribute("aria-label") === "Bass")!;
    bass.value = "6";
    bass.dispatchEvent(new Event("change"));
    expect(callService.mock.calls).toEqual([
      ["homeassistant", "toggle", { entity_id: "switch.office_sonos_crossfade" }],
      ["number", "set_value", { entity_id: "number.office_sonos_bass", value: 6 }],
    ]);
    card.remove();

    const artwork = await renderCard("mushroom-addition-custom-card-media-player-sonos", {
      type: "custom:mushroom-addition-custom-card-media-player-sonos",
      entity: "media_player.office_sonos",
      ulm_card_media_player_enable_art: true,
    }, states, undefined, sonosRegistry);
    expect(artwork.shadowRoot.querySelector(".custom-sonos.has-art")).not.toBeNull();
    expect(artwork.shadowRoot.querySelector(".media-art")?.getAttribute("style"))
      .toContain("/api/media_player_proxy/media_player.office_sonos");
    artwork.remove();

    const artworkHidden = await renderCard("mushroom-addition-custom-card-media-player-sonos", {
      type: "custom:mushroom-addition-custom-card-media-player-sonos",
      entity: "media_player.office_sonos",
      ulm_card_media_player_enable_art: false,
    }, states, undefined, sonosRegistry);
    expect(artworkHidden.shadowRoot.querySelector(".media-art")).toBeNull();
    artworkHidden.remove();

    const detailsAlwaysVisible = await renderCard("mushroom-addition-custom-card-media-player-sonos", {
      type: "custom:mushroom-addition-custom-card-media-player-sonos",
      entity: "media_player.office_sonos",
      sonos_details_always_visible: true,
    }, states, undefined, sonosRegistry);
    expect(detailsAlwaysVisible.shadowRoot.querySelector("details.sonos-details")).toBeNull();
    expect(detailsAlwaysVisible.shadowRoot.querySelector(".sonos-details-always-visible")).not.toBeNull();
    expect(detailsAlwaysVisible.shadowRoot.textContent).not.toContain("More details");
    expect(detailsAlwaysVisible.shadowRoot.querySelectorAll(".sonos-switches button")).toHaveLength(7);
    expect(detailsAlwaysVisible.shadowRoot.querySelectorAll(".sonos-sliders input")).toHaveLength(7);
    detailsAlwaysVisible.remove();

    const shortcuts = await renderCard("mushroom-addition-custom-card-media-player-sonos", {
      type: "custom:mushroom-addition-custom-card-media-player-sonos",
      entity: "media_player.office_sonos",
      shortcuts: {
        columns: 4,
        buttons: [
          { icon: "mdi:party-popper", name: "Party", type: "playlist", id: "spotify:playlist:party" },
          { icon: "mdi:coffee", type: "playlist", id: "spotify:playlist:coffee" },
        ],
      },
    }, states, callService, sonosRegistry);
    expect(shortcuts.shadowRoot.querySelector(".sonos-shortcuts")?.getAttribute("style"))
      .toContain("--sonos-shortcut-columns:4");
    const shortcutButtons = [
      ...shortcuts.shadowRoot.querySelectorAll<HTMLButtonElement>(".sonos-shortcuts button"),
    ];
    expect(shortcutButtons).toHaveLength(2);
    expect(shortcutButtons[0].textContent).toContain("Party");
    expect((shortcutButtons[0].querySelector("ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:party-popper");
    callService.mockClear();
    shortcutButtons[0].click();
    expect(callService).toHaveBeenCalledWith("media_player", "play_media", {
      entity_id: "media_player.office_sonos",
      media_content_type: "playlist",
      media_content_id: "spotify:playlist:party",
    });
    shortcuts.remove();

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
    const standard = await renderCard("mushroom-addition-custom-card-gauge", {
      type: "custom:mushroom-addition-custom-card-gauge",
      entity: "sensor.office_humidity",
      minimum: 0,
      maximum: 100,
    });
    expect(standard.shadowRoot.querySelector(".dual-gauge span")).toBeNull();
    standard.remove();
    const ranged = await renderCard("mushroom-addition-custom-card-gauge", {
      type: "custom:mushroom-addition-custom-card-gauge",
      entity: "sensor.office_humidity",
      minimum: 10,
      maximum: 90,
    });
    expect(ranged.shadowRoot.textContent).toContain("10 - 90");
  });

  it("matches printer header states and source toner order", async () => {
    const card = await renderCard("mushroom-addition-custom-card-printer", {
      type: "custom:mushroom-addition-custom-card-printer",
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

  it("dispatches the source card-surface more-info action for every renderer", async () => {
    for (const [tag, entity] of [
      ["mushroom-addition-custom-card-media-player-sonos", "media_player.office_sonos"],
      ["mushroom-addition-custom-card-more-power-outlet", "switch.office_plug"],
      ["mushroom-addition-custom-card-gauge", "sensor.office_humidity"],
      ["mushroom-addition-custom-card-printer", "binary_sensor.printer_online"],
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
