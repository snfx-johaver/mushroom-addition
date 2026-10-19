import { afterEach, describe, expect, it, vi } from "vitest";
import { CATALOG, LEGACY_ALIASES } from "../src/catalog";
import "../src/index";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import { upstreamDefaultsFor } from "../src/defaults";
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
      expect(editor.shadowRoot?.textContent).toContain("Custom name");
      expect(editor.shadowRoot?.textContent).toContain("Active when state is");
      const textSelectors = editor.shadowRoot?.querySelectorAll<HTMLElement & {
        value?: string;
        selector?: Record<string, unknown>;
      }>(".item-row .field ha-selector") ?? [];
      const customName = [...textSelectors].find((selector) => selector.value === "Example");
      const activeState = [...textSelectors].find((selector) => selector.value === "");
      expect(customName?.selector).toEqual({ text: {} });
      expect(activeState?.selector).toEqual({ text: {} });
      if (itemKey === "scene_items") {
        expect(editor.shadowRoot?.textContent).toContain("Defaults to activating scenes");
        const changed = vi.fn();
        editor.addEventListener("config-changed", changed);
        customName?.dispatchEvent(new CustomEvent("value-changed", {
          detail: { value: "Custom scene" },
        }));
        const updated = (changed.mock.calls[0][0] as CustomEvent<{ config: AdditionConfig }>).detail.config;
        expect(updated[itemKey]?.[0].name).toBe("Custom scene");
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

  it("uses healthy device trackers for both picker example badges", () => {
    const entries = [
      ["device_tracker.phone_wifi", "unavailable"],
      ["device_tracker.phone_ble", "unavailable"],
      ["device_tracker.joris_mobile", "home"],
      ["device_tracker.yvette_mobile", "not_home"],
    ] as const;
    const states: HomeAssistant["states"] = Object.fromEntries(entries.map(([entity_id, state]) => [
      entity_id,
      { entity_id, state, attributes: { friendly_name: entity_id } },
    ]));
    const hass: HomeAssistant = { states, callService: async () => undefined };
    const descriptor = CATALOG.find((item) => item.upstreamId === "custom_card_device_tracker")!;
    const config = createStubConfig(descriptor, hass, Object.keys(states), []);

    expect(config.ulm_custom_card_device_tracker_tracker_1_entity).toBe("device_tracker.joris_mobile");
    expect(config.ulm_custom_card_device_tracker_tracker_2_entity).toBe("device_tracker.yvette_mobile");
  });

  it("selects Person Info defaults linked to the chosen person's tracker", () => {
    const entries: Array<[string, string, Record<string, unknown>]> = [
      ["person.joris", "home", {
        friendly_name: "Joris",
        source: "device_tracker.joris_mobile",
        device_trackers: ["device_tracker.joris_mobile"],
        entity_picture: "/api/image/joris",
      }],
      ["device_tracker.joris_mobile", "home", { friendly_name: "Joris Mobile" }],
      ["sensor.office_joris_motion_battery", "100", {
        friendly_name: "Office Joris motion Battery",
        device_class: "battery",
      }],
      ["sensor.joris_mobile_battery_level", "91", {
        friendly_name: "Joris Mobile Battery level",
        device_class: "battery",
      }],
      ["sensor.joris_mobile_battery_state", "charging", {
        friendly_name: "Joris Mobile Battery state",
        device_class: "enum",
      }],
      ["sensor.joris_mobile_geocoded_location", "12 Main Street", {
        friendly_name: "Joris Mobile Geocoded Location",
        Locality: "Amsterdam",
      }],
      ["binary_sensor.joris_mobile_android_auto", "off", {
        friendly_name: "Joris Mobile Android Auto",
      }],
      ["sensor.joris_mobile_commute", "24", {
        friendly_name: "Joris Mobile Commute",
        unit_of_measurement: "min",
      }],
      ["zone.work", "0", { friendly_name: "Work" }],
    ];
    const states: HomeAssistant["states"] = Object.fromEntries(entries.map(([entity_id, state, attributes]) => [
      entity_id,
      { entity_id, state, attributes },
    ]));
    const hass: HomeAssistant = { states, callService: async () => undefined };
    const descriptor = CATALOG.find((item) => item.upstreamId === "custom_card_person_info")!;
    const config = createStubConfig(descriptor, hass, Object.keys(states), []);

    expect(config).toMatchObject({
      entity: "person.joris",
      icon_type: "entity-picture",
      ulm_card_person_zone1: "zone.work",
      ulm_address: "sensor.joris_mobile_geocoded_location",
      ulm_address_locality: "sensor.joris_mobile_geocoded_location",
      ulm_card_person_driving_entity: "binary_sensor.joris_mobile_android_auto",
      ulm_card_person_battery_entity: "sensor.joris_mobile_battery_level",
      ulm_card_person_battery_state_entity: "sensor.joris_mobile_battery_state",
      ulm_card_person_commute_entity: "sensor.joris_mobile_commute",
      hold_action: {
        action: "more-info",
        entity: "sensor.joris_mobile_battery_level",
      },
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
