import { afterEach, describe, expect, it, vi } from "vitest";
import { CATALOG, LEGACY_ALIASES } from "../src/catalog";
import "../src/index";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import { createStubConfig } from "../src/stub";

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

  it("organizes every graphical editor into modern semantic sections", async () => {
    const order = ["Context", "Content", "Layout", "Interactions", "Features"];
    for (const item of CATALOG) {
      const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
      };
      editor.hass = { states: {}, callService: async () => undefined };
      editor.setConfig({ type: `custom:${item.tag}`, entity: `${item.preferredDomains?.[0] ?? "sensor"}.example` });
      document.body.append(editor);
      await editor.updateComplete;
      const panels = [...editor.shadowRoot?.querySelectorAll("ha-expansion-panel") ?? []];
      const headers = panels.map((panel) => panel.querySelector("[slot=header]")?.textContent?.trim());
      expect(headers).toEqual([...headers].sort((left, right) =>
        order.indexOf(left ?? "") - order.indexOf(right ?? "")));
      expect(new Set(headers).size).toBe(headers.length);
      expect(editor.shadowRoot?.textContent).not.toContain("Additional appearance and controls");
      for (const form of editor.shadowRoot?.querySelectorAll("ha-form") ?? []) {
        expect(form.closest("ha-expansion-panel")).not.toBeNull();
      }
      editor.remove();
    }
  });

  it("keeps related multi-entity controls together in Features", async () => {
    for (const [type, expectedFields, customEditorText] of [
      [
        "custom:mushroom-addition-custom-card-media-player-sonos",
        ["crossfade_entity", "bass_entity", "music_surround_level_entity"],
        undefined,
      ],
      [
        "custom:mushroom-addition-custom-card-printer",
        ["black_entity", "yellow_entity", "magenta_entity", "cyan_entity"],
        undefined,
      ],
      [
        "custom:mushroom-addition-card-welcome-scenes",
        [],
        "Scene buttons",
      ],
    ] as const) {
      const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
      };
      editor.hass = { states: {}, callService: async () => undefined };
      editor.setConfig({ type, entity: "media_player.example" });
      document.body.append(editor);
      await editor.updateComplete;
      const features = [...editor.shadowRoot?.querySelectorAll("ha-expansion-panel") ?? []]
        .find((panel) => panel.querySelector("[slot=header]")?.textContent?.includes("Features"));
      const names = [...features?.querySelectorAll<HTMLElement & { schema?: Array<{ name: string; schema?: Array<{ name: string }> }> }>("ha-form") ?? []]
        .flatMap((form) => form.schema ?? [])
        .flatMap((field) => field.schema?.map((nested) => nested.name) ?? [field.name]);
      expect(names).toEqual(expect.arrayContaining([...expectedFields]));
      if (customEditorText) expect(features?.textContent).toContain(customEditorText);
      editor.remove();
    }
  });

  it("renders user-friendly repeatable item controls for scenes and rooms", async () => {
    for (const [type, entity, itemKey] of [
      ["custom:mushroom-addition-card-scenes", "scene.relax", "scene_items"],
      ["custom:mushroom-addition-card-welcome-scenes", "scene.relax", "scene_items"],
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
      expect(editor.shadowRoot?.textContent).toContain("Custom name");
      expect(editor.shadowRoot?.textContent).not.toContain("Active when state is");
      const textSelectors = editor.shadowRoot?.querySelectorAll<HTMLElement & {
        value?: string;
        selector?: Record<string, unknown>;
      }>(".item-row .field ha-selector") ?? [];
      const customName = [...textSelectors].find((selector) => selector.value === "Example");
      expect(customName?.selector).toEqual({ text: {} });
      if (itemKey === "scene_items") {
        expect(editor.shadowRoot?.textContent).toContain("Defaults to activating scenes");
        expect(editor.shadowRoot?.textContent).toContain("Navigation path");
        const navigation = [...textSelectors].find((selector) =>
          Object.prototype.hasOwnProperty.call(selector.selector ?? {}, "navigation"));
        expect(navigation?.selector).toEqual({ navigation: {} });
        const changed = vi.fn();
        editor.addEventListener("config-changed", changed);
        customName?.dispatchEvent(new CustomEvent("value-changed", {
          detail: { value: "Custom scene" },
        }));
        const updated = (changed.mock.calls[0][0] as CustomEvent<{ config: AdditionConfig }>).detail.config;
        expect(updated[itemKey]?.[0].name).toBe("Custom scene");
        changed.mockClear();
        navigation?.dispatchEvent(new CustomEvent("value-changed", {
          detail: { value: "/lovelace/scenes" },
        }));
        const navigable = (changed.mock.calls[0][0] as CustomEvent<{ config: AdditionConfig }>).detail.config;
        expect(navigable[itemKey]?.[0].navigation_path).toBe("/lovelace/scenes");
      }
      const iconType = editor.shadowRoot?.querySelector<HTMLElement & {
        value?: string;
        selector?: Record<string, unknown>;
      }>(".item-icon-type ha-selector");
      expect(iconType?.value).toBe("icon");
      expect(iconType?.selector).toHaveProperty("select");
      const changed = vi.fn();
      editor.addEventListener("config-changed", changed);
      iconType?.dispatchEvent(new CustomEvent("value-changed", {
        detail: { value: "entity-picture" },
      }));
      const config = (changed.mock.calls[0][0] as CustomEvent<{ config: AdditionConfig }>).detail.config;
      expect(config[itemKey]?.[0].icon_type).toBe("entity-picture");
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
      type: "custom:mushroom-addition-custom-card-trash",
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
    const labelSelectors = editor.shadowRoot?.querySelectorAll<HTMLElement & {
      value?: string;
      selector?: Record<string, unknown>;
    }>(".waste-stream-row label.field ha-selector");
    expect([...labelSelectors ?? []]
      .filter((selector) => selector.selector && "text" in selector.selector)
      .map((selector) => selector.value))
      .toEqual(["Residual waste", "Glass"]);
    editor.remove();
  });

  it("clears a stale legacy name mode when the graphical Name field changes", async () => {
    const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    editor.hass = { states: {}, callService: async () => undefined };
    editor.setConfig({
      type: "custom:mushroom-addition-custom-card-trash",
      entity: "sensor.rest",
      name_mode: "entity",
      name: "Residual waste",
      primary_info: "name",
      secondary_info: "default",
      waste_streams: [],
    });
    document.body.append(editor);
    await editor.updateComplete;
    const changed = vi.fn();
    editor.addEventListener("config-changed", changed);
    editor.shadowRoot?.querySelector("ha-form")?.dispatchEvent(new CustomEvent("value-changed", {
      bubbles: true,
      composed: true,
      detail: {
        value: {
          type: "custom:mushroom-addition-custom-card-trash",
          entity: "sensor.rest",
          name_mode: "entity",
          name: "pietjeds",
          primary_info: "name",
          secondary_info: "default",
          waste_streams: [],
        },
      },
    }));
    const config = (changed.mock.calls[0][0] as CustomEvent<{ config: AdditionConfig }>).detail.config;
    expect(config.name).toBe("pietjeds");
    expect(config).not.toHaveProperty("name_mode");
    editor.remove();
  });

  it("populates picker examples with compatible Home Assistant entities", () => {
        const hass: HomeAssistant = {
          states: {
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
        const consoleConstructor = customElements.get("mushroom-addition-custom-card-playstation") as typeof HTMLElement & {
          getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
        };
        expect(consoleConstructor.getStubConfig(hass, Object.keys(hass.states), [])).toMatchObject({
          entity: "media_player.xbox",
          icon: "mdi:sony-playstation",
          show_controls: false,
        });
  });

  it.each([
    ["mushroom-addition-custom-card-trash", "mdi:trash-can-outline"],
    ["mushroom-addition-custom-card-room-overview", "mdi:sofa"],
    ["mushroom-addition-custom-card-roomview", "mdi:home-variant-outline"],
  ])("uses the intended default icon for %s", (tag, icon) => {
    const constructor = customElements.get(tag) as typeof HTMLElement & {
      getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
    };
    expect(constructor.getStubConfig({ states: {}, callService: async () => undefined }, [], [])).toMatchObject({ icon });
  });

  it("creates a useful Better Thermostat starter configuration", () => {
    const constructor = customElements.get("mushroom-addition-custom-card-better-thermostat") as typeof HTMLElement & {
      getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
    };
    const hass: HomeAssistant = {
      states: {
        "climate.living_room": {
          entity_id: "climate.living_room",
          state: "heat",
          attributes: { friendly_name: "Living room" },
        },
        "binary_sensor.living_room_window": {
          entity_id: "binary_sensor.living_room_window",
          state: "off",
          attributes: { friendly_name: "Living room window" },
        },
        "sensor.living_room_humidity": {
          entity_id: "sensor.living_room_humidity",
          state: "45",
          attributes: { device_class: "humidity" },
        },
        "sensor.thermostat_battery": {
          entity_id: "sensor.thermostat_battery",
          state: "78",
          attributes: { device_class: "battery" },
        },
      },
      callService: async () => undefined,
    };
    expect(constructor.getStubConfig(hass, Object.keys(hass.states), [])).toMatchObject({
      entity: "climate.living_room",
      window_sensor: "binary_sensor.living_room_window",
      humidity_entity: "sensor.living_room_humidity",
      battery_entity: "sensor.thermostat_battery",
      variant: "normal",
      show_temperature_control: true,
      show_hvac_modes: true,
      show_presets: true,
    });
  });

  it("populates the weather metrics picker example with healthy weather data", () => {
    const entries: Array<[string, string, Record<string, unknown>]> = [
      ["weather.home", "partlycloudy", { friendly_name: "Home forecast", temperature: 12.5 }],
      ["sensor.outdoor_temperature_old", "unavailable", {
        friendly_name: "Outdoor temperature old",
        device_class: "temperature",
        unit_of_measurement: "°C",
      }],
      ["sensor.outdoor_temperature", "12.5", {
        friendly_name: "Outdoor temperature",
        device_class: "temperature",
        unit_of_measurement: "°C",
      }],
      ["sensor.date_time", "2026-10-19, 10:47", { friendly_name: "Date & Time" }],
      ["sensor.outdoor_humidity", "81", {
        friendly_name: "Outdoor humidity",
        device_class: "humidity",
        unit_of_measurement: "%",
      }],
      ["sensor.wind_speed", "14", {
        friendly_name: "Wind speed",
        device_class: "wind_speed",
        unit_of_measurement: "km/h",
      }],
      ["sensor.weather_pressure", "1014", {
        friendly_name: "Weather pressure",
        device_class: "atmospheric_pressure",
        unit_of_measurement: "hPa",
      }],
      ["sensor.rain_today", "2.4", {
        friendly_name: "Rain today",
        device_class: "precipitation",
        unit_of_measurement: "mm",
      }],
    ];
    const states: HomeAssistant["states"] = Object.fromEntries(entries.map(([entity_id, state, attributes]) => [
      entity_id,
      { entity_id, state, attributes },
    ]));
    const hass: HomeAssistant = { states, callService: async () => undefined };
    const descriptor = CATALOG.find((item) => item.upstreamId === "custom_card_weather_metrics")!;
    const config = createStubConfig(descriptor, hass, Object.keys(states), []);

    expect(config).toMatchObject({
      entity: "weather.home",
      temperature_entity: "sensor.outdoor_temperature",
      date_entity: "sensor.date_time",
      entities: [
        "sensor.outdoor_humidity",
        "sensor.wind_speed",
        "sensor.weather_pressure",
        "sensor.rain_today",
      ],
      ulm_custom_card_weather_metrics_name_1: "Humidity",
      ulm_custom_card_weather_metrics_name_2: "Wind",
      ulm_custom_card_weather_metrics_name_3: "Pressure",
      ulm_custom_card_weather_metrics_name_4: "Precipitation",
    });
  });

  it("never selects an unavailable entity when a healthy compatible picker example exists", () => {
    const domains = [...new Set(CATALOG.flatMap((item) => item.preferredDomains ?? []))];
    const states: HomeAssistant["states"] = {};
    for (const domain of domains) {
      for (const [suffix, state] of [["unavailable", "unavailable"], ["example", "on"]] as const) {
        const entity_id = `${domain}.${suffix}`;
        states[entity_id] = {
          entity_id,
          state,
          attributes: { friendly_name: `${domain} ${suffix}` },
        };
      }
    }
    const hass: HomeAssistant = { states, callService: async () => undefined };

    for (const descriptor of CATALOG) {
      const config = createStubConfig(descriptor, hass, Object.keys(states), []);
      if (config.entity) {
        expect(hass.states[config.entity]?.state, descriptor.upstreamId).not.toBe("unavailable");
      }
      for (const [key, value] of Object.entries(config)) {
        if ((key === "entity" || key.endsWith("_entity")) && typeof value === "string") {
          expect(hass.states[value], `${descriptor.upstreamId}.${key}`).toBeDefined();
        }
      }
    }
  });

  it("exposes the pinned PS4 source without invented console variants", () => {
        const consoleCard = CATALOG.find((item) => item.upstreamId === "custom_card_playstation");
        expect(consoleCard).toMatchObject({
          name: "PS4 Card",
          variants: undefined,
        });
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
    const element = document.createElement("mushroom-addition-card-graph") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    element.hass = { states: {}, callService: async () => undefined };
    element.setConfig({
      type: "custom:mushroom-addition-card-graph",
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
    const element = document.createElement("mushroom-addition-card-graph") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    element.hass = { states: {}, callService: async () => undefined };
    element.setConfig({
      type: "custom:mushroom-addition-card-graph",
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
