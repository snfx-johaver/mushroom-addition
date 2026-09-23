import { afterEach, describe, expect, it, vi } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CATALOG } from "../src/catalog";
import { editorSchemaFor, upstreamEditorSchemaFor } from "../src/editor-schema";
import { normalizeConfig } from "../src/helpers";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import "../src/index";

const states: HomeAssistant["states"] = {
  "sensor.primary": {
    entity_id: "sensor.primary",
    state: "78.85",
    attributes: { friendly_name: "Ads Percentage Today", unit_of_measurement: "%", history: [70, 72, 71, 76, 78.85] },
  },
  "sensor.secondary": {
    entity_id: "sensor.secondary",
    state: "639068",
    attributes: { friendly_name: "Domains Blocked", history: [630000, 634000, 639068] },
  },
  "light.kitchen": {
    entity_id: "light.kitchen",
    state: "on",
    attributes: { friendly_name: "Kitchen light", brightness: 128, rgb_color: [255, 145, 0] },
  },
  "light.kitchen_off": {
    entity_id: "light.kitchen_off",
    state: "off",
    attributes: { friendly_name: "Kitchen light", brightness: 0 },
  },
  "light.kitchen_unavailable": {
    entity_id: "light.kitchen_unavailable",
    state: "unavailable",
    attributes: { friendly_name: "Kitchen light" },
  },
  "media_player.living": {
    entity_id: "media_player.living",
    state: "playing",
    attributes: {
      friendly_name: "Living room",
      media_title: "Gosh",
      media_artist: "Jamie xx",
      media_album_name: "In Colour",
      volume_level: .4,
      is_volume_muted: false,
      device_class: "speaker",
      entity_picture: "/local/cover.jpg",
    },
  },
  "media_player.controls": {
    entity_id: "media_player.controls",
    state: "paused",
    attributes: { friendly_name: "Receiver", volume_level: .4, is_volume_muted: false, device_class: "speaker" },
  },
  "media_player.off": {
    entity_id: "media_player.off",
    state: "off",
    attributes: { friendly_name: "Living room", volume_level: 0 },
  },
};

const makeHass = (): HomeAssistant => ({
  states,
  callService: vi.fn(async () => undefined),
});

interface TestCard extends HTMLElement {
  hass: HomeAssistant;
  setConfig(config: AdditionConfig): void;
  updateComplete: Promise<boolean>;
  shadowRoot: ShadowRoot;
}

const renderCard = async (tag: string, config: AdditionConfig, hass = makeHass()): Promise<TestCard> => {
  const card = document.createElement(tag) as TestCard;
  card.hass = hass;
  card.setConfig(config);
  document.body.append(card);
  await card.updateComplete;
  return card;
};

const click = (element: Element): void => {
  element.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true, detail: 1 }));
};

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe("default rich source certification", () => {
  it("records deterministic visual artifacts and complete interaction inventories", () => {
    const evidence = JSON.parse(readFileSync(
      join(process.cwd(), "docs", "assets", "visual-audit", "default-rich-certification.json"),
      "utf8",
    )) as {
      upstreamCommit: string;
      matchedImplementationWidth: number;
      sources: Record<string, {
        artifact: string;
        artifactSha256: string;
        interactions: string[];
        liveConfig: AdditionConfig;
      }>;
    };
    expect(evidence.upstreamCommit).toBe("f8a9cb67a53f91367f1dffe18516aa983b463cb5");
    expect(evidence.matchedImplementationWidth).toBe(320);
    expect(Object.keys(evidence.sources)).toEqual([
      "card_generic",
      "card_generic_swap",
      "card_graph",
      "card_light",
      "card_media_player",
      "card_navigate",
    ]);
    expect(evidence.sources.card_light.interactions).toHaveLength(5);
    expect(evidence.sources.card_media_player.interactions).toHaveLength(10);
    expect(evidence.sources.card_navigate.liveConfig.entity).toBeUndefined();
    for (const source of Object.values(evidence.sources)) {
      const contents = readFileSync(join(process.cwd(), source.artifact));
      expect(createHash("sha256").update(contents).digest("hex")).toBe(source.artifactSha256);
    }
  });

  it("creates source-faithful picker defaults for exactly the six certified sources", () => {
    const cases = [
      ["card_generic", "sensor.primary"],
      ["card_graph", "sensor.primary"],
      ["card_light", "light.kitchen"],
      ["card_media_player", "media_player.living"],
    ] as const;
    const hass = makeHass();
    for (const [sourceId, entity] of cases) {
      const item = CATALOG.find((entry) => entry.upstreamId === sourceId)!;
      const constructor = customElements.get(item.tag) as typeof HTMLElement & {
        getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
      };
      expect(window.customCards?.some((registration) => registration.type === item.tag && registration.preview)).toBe(true);
      expect(constructor.getStubConfig(hass, Object.keys(states), [])).toMatchObject({
        type: `custom:${item.tag}`,
        entity,
      });
    }

    const generic = CATALOG.find((entry) => entry.upstreamId === "card_generic")!;
    const genericConstructor = customElements.get(generic.tag) as typeof HTMLElement & {
      getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
    };
    expect(genericConstructor.getStubConfig(hass, Object.keys(states), []).variant).toBe("default");

    const light = CATALOG.find((entry) => entry.upstreamId === "card_light")!;
    const lightConstructor = customElements.get(light.tag) as typeof HTMLElement & {
      getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
    };
    expect(lightConstructor.getStubConfig(hass, Object.keys(states), [])).toMatchObject({
      ulm_card_light_enable_slider: false,
      ulm_card_light_enable_buttons: false,
    });

    const media = CATALOG.find((entry) => entry.upstreamId === "card_media_player")!;
    const mediaConstructor = customElements.get(media.tag) as typeof HTMLElement & {
      getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
    };
    expect(mediaConstructor.getStubConfig(hass, Object.keys(states), [])).toMatchObject({
      show_controls: undefined,
      ulm_card_media_player_enable_art: false,
      ulm_card_media_player_enable_controls: false,
    });

    const navigate = CATALOG.find((entry) => entry.upstreamId === "card_navigate")!;
    const navigateConstructor = customElements.get(navigate.tag) as typeof HTMLElement & {
      getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
    };
    expect(navigateConstructor.getStubConfig(hass, Object.keys(states), [])).toMatchObject({
      navigation_path: "/lovelace",
      tap_action: { action: "navigate", navigation_path: "/lovelace" },
    });
  });

  it.each([
    ["card_generic", "default", ["entity", "variant", "name", "icon", "tap_action"], ["ulm_card_generic_color", "ulm_card_generic_force_background_color"]],
    ["card_generic", "swapped", ["entity", "variant", "name", "icon", "tap_action"], ["ulm_card_generic_swap_color", "ulm_card_generic_swap_force_background_color"]],
    ["card_graph", undefined, ["entity", "show_graph", "tap_action"], ["ulm_card_graph_entity2", "ulm_card_graph_hours", "ulm_card_graph_type"]],
    ["card_light", undefined, ["entity", "tap_action"], ["ulm_card_light_enable_slider", "ulm_card_light_enable_buttons", "ulm_card_light_enable_horizontal_wide"]],
    ["card_media_player", undefined, ["entity", "show_controls", "tap_action"], ["ulm_card_media_player_enable_controls", "ulm_card_media_player_enable_volume_buttons", "ulm_card_media_player_player_controls_entity"]],
    ["card_navigate", undefined, ["navigation_path", "name", "icon", "tap_action"], ["ulm_card_navigate_color"]],
  ] as const)("exposes and round-trips the %s %s graphical editor", async (sourceId, variant, coreFields, advancedFields) => {
    const item = CATALOG.find((entry) => entry.upstreamId === sourceId)!;
    const config: AdditionConfig = {
      type: `custom:${item.tag}`,
      entity: item.family === "navigation" ? undefined : sourceId === "card_light" ? "light.kitchen" :
        sourceId === "card_media_player" ? "media_player.living" : "sensor.primary",
      variant,
      navigation_path: sourceId === "card_navigate" ? "/lovelace/media" : undefined,
    };
    expect(editorSchemaFor(item, config).map((field) => field.name)).toEqual(expect.arrayContaining([...coreFields]));
    expect(upstreamEditorSchemaFor(item, config).map((field) => field.name)).toEqual(expect.arrayContaining([...advancedFields]));

    const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
      shadowRoot: ShadowRoot;
    };
    editor.hass = makeHass();
    editor.setConfig(config);
    document.body.append(editor);
    await editor.updateComplete;
    const form = editor.shadowRoot.querySelector<HTMLElement & { data: AdditionConfig }>("ha-form")!;
    const changed = vi.fn();
    editor.addEventListener("config-changed", changed);
    form.dispatchEvent(new CustomEvent("value-changed", {
      bubbles: true,
      composed: true,
      detail: { value: { ...form.data, name: "Edited source" } },
    }));
    expect(changed).toHaveBeenCalledWith(expect.objectContaining({
      detail: { config: expect.objectContaining({ name: "Edited source", variant }) },
    }));
  });

  it("migrates the six source variable contracts into semantic defaults", () => {
    expect(normalizeConfig({
      type: "custom:mushroom-addition-card-generic-swap",
      entity: "sensor.primary",
      ulm_card_generic_swap_name: "Blocked domains",
      ulm_card_generic_swap_icon: "mdi:shield",
    })).toMatchObject({ name: "Blocked domains", icon: "mdi:shield" });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-card-graph",
      ulm_card_graph_entity: "sensor.primary",
    })).toMatchObject({ entity: "sensor.primary" });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-card-navigate",
      ulm_card_navigate_title: "Media",
      ulm_card_navigate_icon: "mdi:account",
      ulm_card_navigate_path: "/lovelace/media",
    })).toMatchObject({
      name: "Media",
      icon: "mdi:account",
      navigation_path: "/lovelace/media",
      tap_action: { action: "navigate", navigation_path: "/lovelace/media" },
    });
  });

  it("renders the generic, swapped, graph, light, media, and navigate state contracts", async () => {
    const generic = await renderCard("mushroom-addition-card-generic", {
      type: "custom:mushroom-addition-card-generic",
      entity: "sensor.primary",
      variant: "default",
    });
    expect(generic.shadowRoot.querySelector(".value-first")?.textContent).toContain("78.85 %");
    expect(generic.shadowRoot.querySelector(".value-first")?.textContent).toContain("Ads Percentage Today");

    const swapped = await renderCard("mushroom-addition-card-generic-swap", {
      type: "custom:mushroom-addition-card-generic-swap",
      entity: "sensor.primary",
    });
    expect(swapped.shadowRoot.querySelector(".ulm-name")?.textContent).toContain("Ads Percentage Today");
    expect(swapped.shadowRoot.querySelector(".ulm-label")?.textContent).toContain("78.85 %");

    const graph = await renderCard("mushroom-addition-card-graph", {
      type: "custom:mushroom-addition-card-graph",
      entity: "sensor.primary",
      ulm_card_graph_entity2: "sensor.secondary",
      ulm_card_graph_type: "fill",
    });
    expect(graph.shadowRoot.querySelector(".sparkline.is-filled")).not.toBeNull();
    expect(graph.shadowRoot.textContent).toContain("78.85 %");

    const light = await renderCard("mushroom-addition-card-light", {
      type: "custom:mushroom-addition-card-light",
      entity: "light.kitchen",
      ulm_card_light_enable_slider: true,
    });
    expect(light.shadowRoot.querySelector(".light-header.is-active")).not.toBeNull();
    expect(light.shadowRoot.textContent).toContain("50%");

    const collapsedLight = await renderCard("mushroom-addition-card-light", {
      type: "custom:mushroom-addition-card-light",
      entity: "light.kitchen_off",
      ulm_card_light_enable_slider: true,
      ulm_card_light_enable_collapse: true,
    });
    expect(collapsedLight.shadowRoot.querySelector(".is-collapsed")).not.toBeNull();
    expect(collapsedLight.shadowRoot.querySelector(".ulm-light-slider")).toBeNull();

    const unavailableLight = await renderCard("mushroom-addition-card-light", {
      type: "custom:mushroom-addition-card-light",
      entity: "light.kitchen_unavailable",
    });
    expect(unavailableLight.shadowRoot.textContent).toContain("unavailable");

    const media = await renderCard("mushroom-addition-card-media-player", {
      type: "custom:mushroom-addition-card-media-player",
      entity: "media_player.living",
      ulm_card_media_player_enable_art: true,
      ulm_card_media_player_enable_controls: true,
      ulm_card_media_player_more_info: true,
    });
    expect(media.shadowRoot.querySelector(".ulm-media.has-art")).not.toBeNull();
    expect(media.shadowRoot.querySelectorAll(".media-controls .ulm-control")).toHaveLength(4);
    expect(media.shadowRoot.textContent).toContain("Jamie xx");

    const collapsedMedia = await renderCard("mushroom-addition-card-media-player", {
      type: "custom:mushroom-addition-card-media-player",
      entity: "media_player.off",
      ulm_card_media_player_enable_controls: true,
      ulm_card_media_player_collapsible: true,
    });
    expect(collapsedMedia.shadowRoot.querySelector(".is-collapsed")).not.toBeNull();
    expect(collapsedMedia.shadowRoot.querySelector(".media-controls")).toBeNull();

    const navigate = await renderCard("mushroom-addition-card-navigate", {
      type: "custom:mushroom-addition-card-navigate",
      name: "Media",
      icon: "mdi:account",
      navigation_path: "/lovelace/media",
    });
    expect(navigate.shadowRoot.querySelector(".navigation-label")?.textContent).toBe("Media");
    expect(navigate.shadowRoot.querySelector(".ulm-label")).toBeNull();
  });

  it("asserts every visible generic, graph, and navigation surface action", async () => {
    for (const [tag, config, expected] of [
      [
        "mushroom-addition-card-generic",
        { type: "custom:mushroom-addition-card-generic", entity: "sensor.primary" },
        { action: "tap", config: expect.objectContaining({ entity: "sensor.primary", tap_action: { action: "more-info" } }) },
      ],
      [
        "mushroom-addition-card-generic-swap",
        { type: "custom:mushroom-addition-card-generic-swap", entity: "sensor.primary" },
        { action: "tap", config: expect.objectContaining({ entity: "sensor.primary", tap_action: { action: "more-info" } }) },
      ],
      [
        "mushroom-addition-card-graph",
        { type: "custom:mushroom-addition-card-graph", entity: "sensor.primary" },
        { action: "tap", config: expect.objectContaining({ entity: "sensor.primary", tap_action: { action: "more-info" } }) },
      ],
      [
        "mushroom-addition-card-navigate",
        { type: "custom:mushroom-addition-card-navigate", name: "Media", navigation_path: "/lovelace/media" },
        { action: "tap", config: expect.objectContaining({ tap_action: { action: "navigate", navigation_path: "/lovelace/media" } }) },
      ],
    ] as const) {
      const card = await renderCard(tag, config);
      const action = vi.fn();
      card.addEventListener("hass-action", action);
      click(card.shadowRoot.querySelector(".action-surface")!);
      expect(action).toHaveBeenCalledTimes(1);
      expect(action).toHaveBeenCalledWith(expect.objectContaining({ detail: expected }));
    }
  });

  it("asserts all five visible light interactions with exact Home Assistant payloads", async () => {
    const hass = makeHass();
    const card = await renderCard("mushroom-addition-card-light", {
      type: "custom:mushroom-addition-card-light",
      entity: "light.kitchen",
      tap_action: { action: "toggle" },
      ulm_card_light_enable_slider: true,
      ulm_card_light_enable_buttons: true,
      ulm_card_light_brightness_low: 10,
      ulm_card_light_brightness_medium: 55,
      ulm_card_light_brightness_high: 90,
    }, hass);
    const action = vi.fn();
    card.addEventListener("hass-action", action);
    click(card.shadowRoot.querySelector(".action-surface")!);
    const slider = card.shadowRoot.querySelector<HTMLInputElement>(".ulm-light-slider input")!;
    slider.value = "45";
    slider.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    for (const control of card.shadowRoot.querySelectorAll(".brightness-presets .ulm-control")) click(control);
    expect(action).toHaveBeenCalledWith(expect.objectContaining({
      detail: { action: "tap", config: expect.objectContaining({ tap_action: { action: "toggle" } }) },
    }));
    expect(hass.callService).toHaveBeenNthCalledWith(1, "light", "turn_on", {
      entity_id: "light.kitchen",
      brightness_pct: 45,
    });
    expect(hass.callService).toHaveBeenNthCalledWith(2, "light", "turn_on", {
      entity_id: "light.kitchen",
      brightness_pct: 10,
    });
    expect(hass.callService).toHaveBeenNthCalledWith(3, "light", "turn_on", {
      entity_id: "light.kitchen",
      brightness_pct: 55,
    });
    expect(hass.callService).toHaveBeenNthCalledWith(4, "light", "turn_on", {
      entity_id: "light.kitchen",
      brightness_pct: 90,
    });
  });

  it("asserts all ten visible media interactions with exact Home Assistant payloads", async () => {
    const hass = makeHass();
    const card = await renderCard("mushroom-addition-card-media-player", {
      type: "custom:mushroom-addition-card-media-player",
      entity: "media_player.living",
      tap_action: { action: "more-info" },
      ulm_card_media_player_enable_controls: true,
      ulm_card_media_player_enable_volume_slider: true,
      ulm_card_media_player_enable_volume_buttons: true,
      ulm_card_media_player_enable_volume_adjust: .1,
      ulm_card_media_player_player_controls_entity: "media_player.controls",
      ulm_card_media_player_power_button: true,
    }, hass);
    const action = vi.fn();
    card.addEventListener("hass-action", action);
    click(card.shadowRoot.querySelector(".action-surface")!);
    click(card.shadowRoot.querySelector('[aria-label="Toggle power"]')!);
    for (const label of ["Previous", "Pause", "Next", "Sources"]) {
      click(card.shadowRoot.querySelector(`[aria-label="${label}"]`)!);
    }
    const slider = card.shadowRoot.querySelector<HTMLInputElement>('[aria-label="Volume"]')!;
    slider.value = "65";
    slider.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    for (const label of ["Mute or unmute", "Volume down", "Volume up"]) {
      click(card.shadowRoot.querySelector(`[aria-label="${label}"]`)!);
    }

    expect(action).toHaveBeenNthCalledWith(1, expect.objectContaining({
      detail: { action: "tap", config: expect.objectContaining({ entity: "media_player.living" }) },
    }));
    expect(action).toHaveBeenNthCalledWith(2, expect.objectContaining({
      detail: {
        action: "tap",
        config: expect.objectContaining({
          entity: "media_player.controls",
          tap_action: { action: "more-info" },
        }),
      },
    }));
    expect(hass.callService).toHaveBeenNthCalledWith(1, "homeassistant", "toggle", {
      entity_id: "media_player.living",
    });
    expect(hass.callService).toHaveBeenNthCalledWith(2, "media_player", "media_previous_track", {
      entity_id: "media_player.controls",
    });
    expect(hass.callService).toHaveBeenNthCalledWith(3, "media_player", "media_play_pause", {
      entity_id: "media_player.controls",
    });
    expect(hass.callService).toHaveBeenNthCalledWith(4, "media_player", "media_next_track", {
      entity_id: "media_player.controls",
    });
    expect(hass.callService).toHaveBeenNthCalledWith(5, "media_player", "volume_set", {
      entity_id: "media_player.controls",
      volume_level: .65,
    });
    expect(hass.callService).toHaveBeenNthCalledWith(6, "media_player", "volume_mute", {
      entity_id: "media_player.controls",
      is_volume_muted: true,
    });
    expect(hass.callService).toHaveBeenNthCalledWith(7, "media_player", "volume_set", {
      entity_id: "media_player.controls",
      volume_level: .30000000000000004,
    });
    expect(hass.callService).toHaveBeenNthCalledWith(8, "media_player", "volume_set", {
      entity_id: "media_player.controls",
      volume_level: .5,
    });
  });
});
