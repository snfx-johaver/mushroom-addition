import { afterEach, describe, expect, it, vi } from "vitest";
import { CATALOG, LEGACY_ALIASES } from "../src/catalog";
import "../src/index";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import { upstreamDefaultsFor } from "../src/defaults";

describe("Home Assistant registration", () => {
  afterEach(() => vi.useRealTimers());
  it("defines every catalog custom element", () => {
    for (const item of CATALOG) expect(customElements.get(item.tag)).toBeDefined();
    for (const alias of LEGACY_ALIASES) expect(customElements.get(alias.tag)).toBeDefined();
  });

  it("publishes every component to the Lovelace picker", () => {
    const registered = new Set(window.customCards?.map((item) => item.type));
    for (const item of CATALOG) expect(registered.has(item.tag)).toBe(true);
    for (const alias of LEGACY_ALIASES) expect(registered.has(alias.tag)).toBe(false);
  });

  it("keeps internal terminology out of public picker metadata", () => {
    for (const card of window.customCards ?? []) {
      expect(`${card.name} ${card.description}`).not.toMatch(/\bulm\b/i);
    }
  });

  it("provides a graphical editor for every component", async () => {
    for (const item of CATALOG) {
      const constructor = customElements.get(item.tag) as typeof HTMLElement & {
        getConfigElement(): Promise<HTMLElement>;
      };
      await expect(constructor.getConfigElement()).resolves.toMatchObject({
        tagName: "MUSHROOM-ADDITION-EDITOR",
      });
    }
  });

  it("renders user-friendly repeatable item controls for scenes and rooms", async () => {
    for (const [type, entity, itemKey] of [
      ["custom:mushroom-addition-card-scenes", "scene.relax", "scene_items"],
      ["custom:mushroom-addition-card-room", "light.kitchen", "room_sensors"],
    ] as const) {
      const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
      };
      editor.hass = {
        states: {},
        callService: async () => undefined,
      };
      editor.setConfig({
        type,
        entity,
        [itemKey]: [{ entity, name: "Example", icon: "mdi:star", color: "#ff9800" }],
      });

      document.body.append(editor);
      await editor.updateComplete;
      expect(editor.shadowRoot?.textContent).toContain("Add button");
      expect(editor.shadowRoot?.textContent).toContain(itemKey === "scene_items" ? "Scene buttons" : "Room sensor buttons");
      editor.remove();
    }
  });

  it("renders independent repeatable waste-stream controls", async () => {
    const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    editor.hass = { states: {}, callService: async () => undefined };
    editor.setConfig({
      type: "custom:mushroom-addition-custom-card-afvalophaling",
      entity: "sensor.rest",
      waste_streams: [
        { enabled: true, entity: "sensor.rest", label: "Residual waste", icon: "mdi:trash-can", color: "#43a047" },
        { enabled: false, entity: "sensor.glass", label: "Glass", icon: "mdi:bottle-soda", color: "#00897b" },
      ],
    });
    document.body.append(editor);
    await editor.updateComplete;
    const rows = editor.shadowRoot?.querySelectorAll(".waste-stream-row") ?? [];
    expect(rows).toHaveLength(2);
    expect(editor.shadowRoot?.textContent).toContain("Collection date entity");
    expect(editor.shadowRoot?.textContent).toContain("Add waste stream");
    const entitySelectors = editor.shadowRoot?.querySelectorAll<HTMLElement & { value?: string }>(
      ".waste-stream-row .wide ha-selector",
    );
    expect([...entitySelectors ?? []].map((selector) => selector.value)).toEqual(["sensor.rest", "sensor.glass"]);
    editor.remove();
  });

  it("populates picker examples with compatible Home Assistant entities", () => {
        const hass: HomeAssistant = {
          states: {
            "light.kitchen": {
              entity_id: "light.kitchen",
              state: "on",
              attributes: { friendly_name: "Kitchen" },
            },
            "media_player.xbox": {
              entity_id: "media_player.xbox",
              state: "playing",
              attributes: { friendly_name: "Xbox" },
            },
            "sensor.temperature": {
              entity_id: "sensor.temperature",
              state: "21",
              attributes: { friendly_name: "Temperature", unit_of_measurement: "°C" },
            },
          },
          callService: async () => undefined,
        };
        const lightConstructor = customElements.get("mushroom-addition-card-light") as typeof HTMLElement & {
          getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
        };
        const consoleConstructor = customElements.get("mushroom-addition-custom-card-playstation") as typeof HTMLElement & {
          getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
        };
        expect(lightConstructor.getStubConfig(hass, Object.keys(hass.states), [])).toMatchObject({
          entity: "light.kitchen",
          name: "Kitchen",
          icon: "mdi:lightbulb",
          ulm_card_light_enable_slider: false,
          ulm_card_light_enable_color: false,
        });
        expect(consoleConstructor.getStubConfig(hass, Object.keys(hass.states), [])).toMatchObject({
          entity: "media_player.xbox",
          icon: "mdi:sony-playstation",
          show_controls: false,
        });
  });

  it("exposes the pinned PS4 source without invented console variants", () => {
        const consoleCard = CATALOG.find((item) => item.upstreamId === "custom_card_playstation");
        expect(consoleCard).toMatchObject({
          name: "PS4 Card",
          variants: undefined,
        });
  });

  it("hydrates implemented upstream defaults without popup options", () => {
    const light = CATALOG.find((item) => item.upstreamId === "card_light")!;
    expect(upstreamDefaultsFor(light)).toMatchObject({
      ulm_card_light_enable_slider: false,
      ulm_card_light_enable_collapse: false,
      ulm_card_light_enable_horizontal: false,
      ulm_card_light_enable_color: false,
      ulm_card_light_enable_buttons: false,
      ulm_card_light_brightness_low: 1,
      ulm_card_light_brightness_medium: 50,
      ulm_card_light_brightness_high: 100,
    });
    expect(Object.keys(upstreamDefaultsFor(light)).some((key) => key.includes("popup"))).toBe(false);
  });

  it("renders a representative from every component family", async () => {
    const hass: HomeAssistant = {
      states: {
        "sensor.example": {
          entity_id: "sensor.example",
          state: "21",
          attributes: { friendly_name: "Example", unit_of_measurement: "°C" },
        },
      },
      callService: async () => undefined,
    };
    const representatives = new Map(CATALOG.map((item) => [item.family, item]));
    for (const item of representatives.values()) {
      const element = document.createElement(item.tag) as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
      };
      element.hass = hass;
      element.setConfig({
        type: `custom:${item.tag}`,
        entity: "sensor.example",
      });
      document.body.append(element);
      await element.updateComplete;
      const markup = element.shadowRoot?.innerHTML ?? "";
      expect(markup.trim().length, item.family).toBeGreaterThan(0);
      element.remove();
    }
  });

  it("dispatches only the double-tap action for a double click", async () => {
    vi.useFakeTimers();
    const element = document.createElement("mushroom-addition-card-light") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    element.hass = { states: {}, callService: async () => undefined };
    element.setConfig({
      type: "custom:mushroom-addition-card-light",
      tap_action: { action: "toggle" },
      double_tap_action: { action: "more-info" },
    });
    const actions: string[] = [];
    element.addEventListener("hass-action", (event) =>
      actions.push((event as CustomEvent<{ action: string }>).detail.action));
    document.body.append(element);
    await element.updateComplete;
    const target = element.shadowRoot?.querySelector(".action-surface");
    target?.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
    target?.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 2 }));
    target?.dispatchEvent(new MouseEvent("dblclick", { bubbles: true, detail: 2 }));
    vi.advanceTimersByTime(400);
    expect(actions).toEqual(["double_tap"]);
    element.remove();
  });

  it("supports hold actions on cards without also tapping", async () => {
    vi.useFakeTimers();
    const element = document.createElement("mushroom-addition-card-light") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    element.hass = { states: {}, callService: async () => undefined };
    element.setConfig({
      type: "custom:mushroom-addition-card-light",
      tap_action: { action: "more-info" },
      hold_action: { action: "assist" },
    });
    const actions: string[] = [];
    element.addEventListener("hass-action", (event) =>
      actions.push((event as CustomEvent<{ action: string }>).detail.action));
    document.body.append(element);
    await element.updateComplete;
    const target = element.shadowRoot?.querySelector(".action-surface");
    target?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    vi.advanceTimersByTime(500);
    target?.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    target?.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
    expect(actions).toEqual(["hold"]);
    element.remove();
  });
});
