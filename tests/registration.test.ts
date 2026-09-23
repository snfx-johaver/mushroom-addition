import { afterEach, describe, expect, it, vi } from "vitest";
import { CATALOG } from "../src/catalog";
import "../src/index";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import { upstreamDefaultsFor } from "../src/defaults";

describe("Home Assistant registration", () => {
  afterEach(() => vi.useRealTimers());
  it("defines every catalog custom element", () => {
    for (const item of CATALOG) expect(customElements.get(item.tag)).toBeDefined();
  });

  it("publishes every component to the Lovelace picker", () => {
    const registered = new Set(window.customCards?.map((item) => item.type));
    for (const item of CATALOG) expect(registered.has(item.tag)).toBe(true);
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
          ulm_card_light_enable_slider: true,
          ulm_card_light_enable_color: true,
        });
        expect(consoleConstructor.getStubConfig(hass, Object.keys(hass.states), [])).toMatchObject({
          entity: "media_player.xbox",
          variant: "xbox",
          icon: "mdi:microsoft-xbox",
        });
  });

  it("provides populated example chips in the container preview", () => {
        const constructor = customElements.get("mushroom-addition-chips-card") as typeof HTMLElement & {
          getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
        };
        const hass: HomeAssistant = {
          states: {
            "sensor.temperature": {
              entity_id: "sensor.temperature",
              state: "21",
              attributes: { friendly_name: "Temperature" },
            },
            "person.joris": {
              entity_id: "person.joris",
              state: "home",
              attributes: { friendly_name: "Joris" },
            },
          },
          callService: async () => undefined,
        };
        const config = constructor.getStubConfig(hass, Object.keys(hass.states), []);
        expect(config.chips).toHaveLength(2);
        expect(config.chips?.map((chip) => chip.entity)).toEqual([
          "sensor.temperature",
          "person.joris",
        ]);
  });

  it("exposes PS5 and Xbox as graphical console variants", () => {
        const consoleCard = CATALOG.find((item) => item.upstreamId === "custom_card_playstation");
        expect(consoleCard).toMatchObject({
          name: "PS5 / Xbox Card",
          variants: ["ps5", "xbox"],
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
        chips: item.kind === "container" ? [] : undefined,
      });
      document.body.append(element);
      await element.updateComplete;
      const text = element.shadowRoot?.textContent ?? "";
      if (item.kind === "container") expect(text).toContain("Add chips");
      else expect(text.trim().length).toBeGreaterThan(0);
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

  it("supports hold actions on chips without also tapping", async () => {
    vi.useFakeTimers();
    const element = document.createElement("mushroom-addition-chip-alarm") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    element.hass = { states: {}, callService: async () => undefined };
    element.setConfig({
      type: "custom:mushroom-addition-chip-alarm",
      tap_action: { action: "more-info" },
      hold_action: { action: "assist" },
    });
    const actions: string[] = [];
    element.addEventListener("hass-action", (event) =>
      actions.push((event as CustomEvent<{ action: string }>).detail.action));
    document.body.append(element);
    await element.updateComplete;
    const target = element.shadowRoot?.querySelector(".ulm-chip");
    target?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    vi.advanceTimersByTime(500);
    target?.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    target?.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
    expect(actions).toEqual(["hold"]);
    element.remove();
  });
});
