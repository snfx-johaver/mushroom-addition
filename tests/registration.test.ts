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

  it.each(["custom-card-weather-metrics", "custom-card-room-overview", "custom-card-roomview", "card-welcome-scenes", "card-media-player"])("does not register the removed %s card or expose it in the picker", (removed) => {
    const tag = `mushroom-addition-${removed}`;
    expect(customElements.get(tag)).toBeUndefined();
    expect(window.customCards?.some((item) => item.type === tag)).toBe(false);
  });

  it("publishes every component to the Lovelace picker", () => {
    const registered = new Set(window.customCards?.map((item) => item.type));
    for (const item of CATALOG) expect(registered.has(item.tag)).toBe(true);
    for (const alias of LEGACY_ALIASES) expect(registered.has(alias.tag)).toBe(false);
    for (const item of CATALOG) {
      expect(window.customCards?.find(card => card.type === item.tag)?.name).toBe(`Mushroom Addition: ${item.name}`);
    }
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
        tagName: item.editorTag?.toUpperCase() ??
          (["area_card_advanced", "area_card_mushroom"].includes(item.upstreamId)
            ? "MUSHROOM-ADDITION-AREA-CARD-ADVANCED-EDITOR" : "MUSHROOM-ADDITION-EDITOR"),
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

  it("uses the modern Mushroom layout picker on every card", async () => {
    for (const item of CATALOG) {
      const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
      };
      editor.hass = { states: {}, callService: async () => undefined };
      editor.setConfig({ type: `custom:${item.tag}`, entity: "sensor.example", layout: "default" });
      document.body.append(editor);
      await editor.updateComplete;
      const forms = [
        ...editor.shadowRoot?.querySelectorAll<HTMLElement & {
          data?: AdditionConfig;
          schema?: Array<{ name: string; selector?: Record<string, unknown> }>;
        }>("ha-form") ?? [],
      ];
      const layoutForm = forms.find((form) => form.schema?.some((field) => field.name === "layout"));
      if (item.upstreamId === "mini_graph_card") {
        expect(layoutForm).toBeUndefined();
        expect(forms.some((form) =>
          form.schema?.some((field) => field.name === "multiline_secondary"))).toBe(false);
        editor.remove();
        continue;
      }
      const layoutField = layoutForm?.schema?.find((field) => field.name === "layout");
      expect(layoutForm?.data?.layout).toBe("horizontal");
      expect(layoutField?.selector).toMatchObject({
        select: {
          mode: "box",
          options: [
            { value: "horizontal", image: { src: "/static/images/form/tile_content_layout_horizontal.svg" } },
            { value: "vertical", image: { src: "/static/images/form/tile_content_layout_vertical.svg" } },
          ],
        },
      });
      expect(forms.some((form) =>
        form.schema?.some((field) => field.name === "multiline_secondary"))).toBe(true);
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
      if (itemKey === "scene_items") expect(editor.shadowRoot?.textContent).toContain("Custom name");
      else expect(editor.shadowRoot?.textContent).not.toContain("Custom name");
      expect(editor.shadowRoot?.textContent).not.toContain("Active when state is");
      const textSelectors = editor.shadowRoot?.querySelectorAll<HTMLElement & {
        value?: string;
        selector?: Record<string, unknown>;
      }>(".item-row .field ha-selector") ?? [];
      const customName = [...textSelectors].find((selector) => selector.value === "Example");
      if (itemKey === "scene_items") expect(customName?.selector).toEqual({ text: {} });
      else expect(customName).toBeUndefined();
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
          name: "Custom collection",
          primary_info: "name",
          secondary_info: "default",
          waste_streams: [],
        },
      },
    }));
    const config = (changed.mock.calls[0][0] as CustomEvent<{ config: AdditionConfig }>).detail.config;
    expect(config.name).toBe("Custom collection");
    expect(config).not.toHaveProperty("name_mode");
    editor.remove();
  });

  it("populates picker examples with compatible Home Assistant entities", () => {
        const hass: HomeAssistant = {
          states: {
            "binary_sensor.xbox_profile": {
              entity_id: "binary_sensor.xbox_profile",
              state: "on",
              attributes: { friendly_name: "Xbox profile" },
            },
            "sensor.xbox_followers": {
              entity_id: "sensor.xbox_followers",
              state: "4",
              attributes: { friendly_name: "Xbox Followers" },
            },
            "sensor.xbox_gamer_score": {
              entity_id: "sensor.xbox_gamer_score",
              state: "11145",
              attributes: { friendly_name: "Xbox Gamerscore", unit_of_measurement: "points" },
            },
            "sensor.temperature": {
              entity_id: "sensor.temperature",
              state: "21",
              attributes: { friendly_name: "Temperature", unit_of_measurement: "°C" },
            },
          },
          entities: {
            "binary_sensor.xbox_profile": { device_id: "xbox-profile", platform: "xbox" },
            "sensor.xbox_followers": { device_id: "xbox-profile", platform: "xbox" },
            "sensor.xbox_gamer_score": { device_id: "xbox-profile", platform: "xbox" },
          },
          callService: async () => undefined,
        };
        const consoleConstructor = customElements.get("mushroom-addition-custom-card-game-console") as typeof HTMLElement & {
          getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
        };
        expect(consoleConstructor.getStubConfig(hass, Object.keys(hass.states), [])).toMatchObject({
          entity: "binary_sensor.xbox_profile",
          console_platform: "xbox",
          console_show_artwork: true,
          console_show_controls: true,
          followers_entity: "sensor.xbox_followers",
          primary_stat_entity: "sensor.xbox_gamer_score",
        });
  });

  it.each([
    ["mushroom-addition-custom-card-trash", "mdi:trash-can-outline"],
  ])("leaves the default icon entity-driven for %s", (tag) => {
    const constructor = customElements.get(tag) as typeof HTMLElement & {
      getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
    };
    expect(constructor.getStubConfig({ states: {}, callService: async () => undefined }, [], []).icon).toBeUndefined();
  });

  it("populates Flower bars with independently compatible sensor entities", () => {
    const states: HomeAssistant["states"] = {
      "sensor.garden_soil_moisture": {
        entity_id: "sensor.garden_soil_moisture",
        state: "48",
        attributes: {
          friendly_name: "Garden soil moisture",
          device_class: "moisture",
          unit_of_measurement: "%",
        },
      },
      "sensor.garden_soil_temperature": {
        entity_id: "sensor.garden_soil_temperature",
        state: "18",
        attributes: {
          friendly_name: "Garden soil temperature",
          device_class: "temperature",
          unit_of_measurement: "°C",
        },
      },
    };
    const descriptor = CATALOG.find((item) => item.upstreamId === "custom_card_plant")!;
    const config = createStubConfig(
      descriptor,
      { states, callService: async () => undefined },
      Object.keys(states),
      [],
    );
    expect(config).toMatchObject({
      entity: "sensor.garden_soil_moisture",
      ulm_card_flower_show_bars: ["moisture", "temperature"],
      moisture_entity: "sensor.garden_soil_moisture",
      temperature_entity: "sensor.garden_soil_temperature",
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

  it("exposes one platform-neutral Game Console card with the PlayStation tag as a legacy alias", () => {
        const consoleCard = CATALOG.find((item) => item.upstreamId === "custom_card_playstation");
        expect(consoleCard).toMatchObject({
          name: "Game Console",
          tag: "mushroom-addition-custom-card-game-console",
          variants: undefined,
        });
        expect(LEGACY_ALIASES).toContainEqual(expect.objectContaining({
          tag: "mushroom-addition-custom-card-playstation",
          targetTag: "mushroom-addition-custom-card-game-console",
        }));
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

  it("does not register deleted card types or expose them in the picker", () => {
    for (const tag of [
      "mushroom-addition-card-graph",
      "mushroom-addition-custom-card-internet-speed",
      "mushroom-addition-custom-card-entity-overview",
      "mushroom-addition-custom-card-more-power-outlet",
      "mushroom-addition-custom-card-gauge",
      "mushroom-addition-custom-card-bar-card",
    ]) {
      expect(customElements.get(tag)).toBeUndefined();
      expect(window.customCards?.some((card) => card.type === tag)).toBe(false);
    }
  });

  it("dispatches only the double-tap action for a double click", async () => {
    vi.useFakeTimers();
    const element = document.createElement("mushroom-addition-custom-card-printer") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    element.hass = { states: {}, callService: async () => undefined };
    element.setConfig({
      type: "custom:mushroom-addition-custom-card-printer",
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
    const element = document.createElement("mushroom-addition-custom-card-printer") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    element.hass = { states: {}, callService: async () => undefined };
    element.setConfig({
      type: "custom:mushroom-addition-custom-card-printer",
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
