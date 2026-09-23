import { afterEach, describe, expect, it, vi } from "vitest";
import { CATALOG } from "../src/catalog";
import { normalizeConfig } from "../src/helpers";
import type { AdditionConfig, HassEntity, HomeAssistant } from "../src/types";
import "../src/index";

const states: HomeAssistant["states"] = {
  "vacuum.robob": {
    entity_id: "vacuum.robob",
    state: "docked",
    attributes: { friendly_name: "Robob", icon: "mdi:robot-vacuum" },
  },
  "camera.robob_map": {
    entity_id: "camera.robob_map",
    state: "streaming",
    attributes: { friendly_name: "Robob map", entity_picture: "/local/robob-map.png" },
  },
  "script.clean_living_room": {
    entity_id: "script.clean_living_room",
    state: "off",
    attributes: { friendly_name: "Clean living room", icon: "mdi:sofa" },
  },
  "light.joris_iris_1": {
    entity_id: "light.joris_iris_1",
    state: "on",
    attributes: { friendly_name: "Joris Iris", icon: "mdi:lightbulb", value: "Living room" },
  },
  "weather.hcn_ha": {
    entity_id: "weather.hcn_ha",
    state: "rainy",
    attributes: {
      friendly_name: "Home",
      temperature: 17,
      temperature_unit: "°C",
      humidity: 68,
      precipitation_unit: "mm",
    },
  },
  "input_boolean.dropdown_welcome": {
    entity_id: "input_boolean.dropdown_welcome",
    state: "off",
    attributes: { friendly_name: "Collapse welcome scenes" },
  },
  "scene.living_room_relax": {
    entity_id: "scene.living_room_relax",
    state: "scening",
    attributes: { friendly_name: "Relax", icon: "mdi:sofa" },
  },
  "scene.living_room_dimmed": {
    entity_id: "scene.living_room_dimmed",
    state: "scening",
    attributes: { friendly_name: "Dimmed", icon: "mdi:lightbulb-night" },
  },
  "media_player.office": {
    entity_id: "media_player.office",
    state: "paused",
    attributes: { friendly_name: "Office" },
  },
  "input_select.mode": {
    entity_id: "input_select.mode",
    state: "Home",
    attributes: { friendly_name: "Mode" },
  },
  "script.goodnight": {
    entity_id: "script.goodnight",
    state: "off",
    attributes: { friendly_name: "Goodnight" },
  },
};

const makeHass = (
  overrides: HomeAssistant["states"] = states,
  callService = vi.fn(async () => undefined),
): HomeAssistant => ({
  states: overrides,
  language: "en",
  callService,
  connection: {
    sendMessagePromise: async <T>() => undefined as T,
    subscribeMessage: async <T>(callback: (message: T) => void) => {
      callback({
        forecast: [{
          condition: "rainy",
          temperature: 19,
          templow: 11,
          precipitation_probability: 72,
        }],
      } as T);
      return () => undefined;
    },
  },
});

interface TestCard extends HTMLElement {
  hass: HomeAssistant;
  setConfig(config: AdditionConfig): void;
  updateComplete: Promise<boolean>;
  shadowRoot: ShadowRoot;
}

const renderCard = async (
  tag: string,
  config: AdditionConfig,
  hass = makeHass(),
): Promise<TestCard> => {
  const element = document.createElement(tag) as TestCard;
  element.hass = hass;
  element.setConfig(config);
  document.body.append(element);
  await element.updateComplete;
  await Promise.resolve();
  await element.updateComplete;
  return element;
};

const click = (card: TestCard, selector: string): void => {
  const control = card.shadowRoot.querySelector<HTMLButtonElement>(selector);
  expect(control, selector).not.toBeNull();
  control!.click();
};

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe("queued default batch two certification", () => {
  it("creates source-specific picker defaults using the exact live entities", () => {
    const expectations = [
      ["card_title", undefined],
      ["card_vacuum", "vacuum.robob"],
      ["card_vertical_button", "light.joris_iris_1"],
      ["card_weather", "weather.hcn_ha"],
      ["card_welcome_scenes", "scene.living_room_relax"],
    ] as const;
    for (const [sourceId, entity] of expectations) {
      const item = CATALOG.find((entry) => entry.upstreamId === sourceId)!;
      const constructor = customElements.get(item.tag) as typeof HTMLElement & {
        getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
      };
      const config = constructor.getStubConfig(makeHass(), Object.keys(states), []);
      expect(window.customCards?.some((registration) => registration.type === item.tag && registration.preview)).toBe(true);
      expect(config.entity).toBe(entity);
      if (sourceId === "card_title") {
        expect(config).toMatchObject({
          name: "Living room",
          secondary: "Lights and climate",
          tap_action: { action: "none" },
        });
      }
      if (sourceId === "card_weather") {
        expect(config).toMatchObject({
          variant: "detailed",
          show_forecast: true,
          ulm_card_weather_primary_info: "extrema",
          ulm_card_weather_secondary_info: "precipitation",
        });
      }
      if (sourceId === "card_welcome_scenes") {
        expect(config).toMatchObject({
          collapse_entity: "input_boolean.dropdown_welcome",
          tap_action: { action: "none" },
        });
      }
    }

    const native = customElements.get("mushroom-addition-card-weather-ulm") as typeof HTMLElement & {
      getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
    };
    expect(native.getStubConfig(makeHass(), Object.keys(states), [])).toMatchObject({
      entity: "weather.hcn_ha",
      variant: "native",
      show_forecast: false,
    });
  });

  it.each([
    {
      tag: "mushroom-addition-card-title",
      config: { type: "custom:mushroom-addition-card-title", name: "Living room", secondary: "Lights" },
      fields: ["name", "secondary", "tap_action"],
    },
    {
      tag: "mushroom-addition-card-vacuum",
      config: { type: "custom:mushroom-addition-card-vacuum", entity: "vacuum.robob" },
      fields: ["entity", "show_controls", "ulm_card_vacuum_room", "ulm_card_vacuum_camera", "tap_action"],
    },
    {
      tag: "mushroom-addition-card-vertical-button",
      config: { type: "custom:mushroom-addition-card-vertical-button", entity: "light.joris_iris_1" },
      fields: ["entity", "ulm_card_vertical_button_color", "ulm_card_vertical_button_state", "tap_action"],
    },
    {
      tag: "mushroom-addition-card-weather",
      config: { type: "custom:mushroom-addition-card-weather", entity: "weather.hcn_ha", variant: "detailed" },
      fields: ["entity", "variant", "show_forecast", "ulm_card_weather_primary_info", "ulm_card_weather_secondary_info"],
    },
    {
      tag: "mushroom-addition-card-weather-ulm",
      config: { type: "custom:mushroom-addition-card-weather-ulm", entity: "weather.hcn_ha", variant: "native" },
      fields: ["entity", "variant", "show_forecast", "tap_action"],
    },
    {
      tag: "mushroom-addition-card-welcome-scenes",
      config: { type: "custom:mushroom-addition-card-welcome-scenes", collapse_entity: "input_boolean.dropdown_welcome" },
      fields: ["collapse_entity", "weather_entity", "settings_path", "collapsed", "tap_action"],
    },
  ])("round-trips $tag through its graphical editor", async ({ config, fields }) => {
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
    const forms = [...editor.shadowRoot.querySelectorAll<HTMLElement & {
      schema: Array<{ name: string }>;
      data: AdditionConfig;
    }>("ha-form")];
    const schemaNames = forms.flatMap((form) => form.schema.map((field) => field.name));
    expect(schemaNames).toEqual(expect.arrayContaining(fields));
    const changed = vi.fn();
    editor.addEventListener("config-changed", changed);
    forms[0].dispatchEvent(new CustomEvent("value-changed", {
      bubbles: true,
      composed: true,
      detail: { value: { ...forms[0].data, name: "Edited" } },
    }));
    expect(changed).toHaveBeenCalledWith(expect.objectContaining({
      detail: { config: expect.objectContaining({ name: "Edited" }) },
    }));
  });

  it("migrates legacy source variables into dedicated public config fields", () => {
    expect(normalizeConfig({
      type: "custom:mushroom-addition-card-welcome-scenes",
      ulm_card_welcome_scenes_collapse: "input_boolean.dropdown_welcome",
      entity_1: {
        entity_id: "scene.living_room_relax",
        name: "Relax",
        icon: "mdi:sofa",
        color: "yellow",
      },
    })).toMatchObject({
      collapse_entity: "input_boolean.dropdown_welcome",
      scene_items: [{
        entity: "scene.living_room_relax",
        name: "Relax",
        icon: "mdi:sofa",
        color: "yellow",
      }],
      tap_action: { action: "none" },
    });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-card-vertical-button",
      entity: "light.joris_iris_1",
      ulm_card_vertical_button_state: "on",
      ulm_card_vertical_button_color: "yellow",
    })).toMatchObject({
      active_state: "on",
      icon_color: "yellow",
    });
  });

  it("renders title, vacuum, vertical button, both weather sources, and welcome scene states", async () => {
    const title = await renderCard("mushroom-addition-card-title", {
      type: "custom:mushroom-addition-card-title",
      name: "Living room",
      secondary: "Lights and climate",
    });
    expect(title.shadowRoot.textContent).toContain("Living room");
    expect(title.shadowRoot.textContent).toContain("Lights and climate");
    expect(title.shadowRoot.querySelector(".ulm-icon")).toBeNull();

    const cleaningStates = {
      ...states,
      "vacuum.robob": { ...states["vacuum.robob"], state: "cleaning" },
    };
    const vacuum = await renderCard("mushroom-addition-card-vacuum", {
      type: "custom:mushroom-addition-card-vacuum",
      entity: "vacuum.robob",
      ulm_card_vacuum_camera: "camera.robob_map",
      ulm_card_vacuum_camera_toggle: true,
      ulm_card_vacuum_room: "script.clean_living_room",
    }, makeHass(cleaningStates));
    expect(vacuum.shadowRoot.querySelector('button[aria-label="Stop"]')).not.toBeNull();
    expect(vacuum.shadowRoot.querySelector(".vacuum-map")).not.toBeNull();
    expect(vacuum.shadowRoot.querySelector('button[aria-label="Clean room"]')).not.toBeNull();

    const vertical = await renderCard("mushroom-addition-card-vertical-button", {
      type: "custom:mushroom-addition-card-vertical-button",
      entity: "light.joris_iris_1",
      ulm_card_vertical_button_state: "on",
      ulm_card_vertical_button_color: "yellow",
    });
    expect(vertical.shadowRoot.querySelector(".ulm-vertical-button.is-active")).not.toBeNull();
    expect(vertical.shadowRoot.textContent).toContain("Living room");

    const detailed = await renderCard("mushroom-addition-card-weather", {
      type: "custom:mushroom-addition-card-weather",
      entity: "weather.hcn_ha",
      variant: "detailed",
      show_forecast: true,
    });
    expect(detailed.shadowRoot.querySelector(".detailed-weather")).not.toBeNull();
    expect(detailed.shadowRoot.textContent).toContain("11° / 19°");
    expect(detailed.shadowRoot.textContent).toContain("72%");

    const native = await renderCard("mushroom-addition-card-weather-ulm", {
      type: "custom:mushroom-addition-card-weather-ulm",
      entity: "weather.hcn_ha",
      variant: "native",
    });
    expect(native.shadowRoot.querySelector(".native-weather")).not.toBeNull();
    expect(native.shadowRoot.textContent).toContain("68%");
    expect(native.shadowRoot.textContent).toContain("17°C");

    const collapsed = await renderCard("mushroom-addition-card-welcome-scenes", {
      type: "custom:mushroom-addition-card-welcome-scenes",
      collapse_entity: "input_boolean.dropdown_welcome",
      scene_items: [{ entity: "scene.living_room_relax" }],
    }, makeHass({
      ...states,
      "input_boolean.dropdown_welcome": { ...states["input_boolean.dropdown_welcome"], state: "on" },
    }));
    expect(collapsed.shadowRoot.querySelector(".scene-grid")).toBeNull();
    expect((collapsed.shadowRoot.querySelector('button[aria-label="Toggle scenes"] ha-icon') as HTMLElement & { icon: string }).icon)
      .toBe("mdi:chevron-down");
  });

  it("executes every vacuum control with exact Home Assistant payloads", async () => {
    const dockedCalls = vi.fn(async () => undefined);
    const docked = await renderCard("mushroom-addition-card-vacuum", {
      type: "custom:mushroom-addition-card-vacuum",
      entity: "vacuum.robob",
      ulm_card_vacuum_room: "script.clean_living_room",
    }, makeHass(states, dockedCalls));
    click(docked, 'button[aria-label="Start"]');
    click(docked, 'button[aria-label="Return home"]');
    click(docked, 'button[aria-label="Locate"]');
    click(docked, 'button[aria-label="Clean room"]');
    expect(dockedCalls.mock.calls).toEqual([
      ["vacuum", "start", { entity_id: "vacuum.robob" }],
      ["vacuum", "return_to_base", { entity_id: "vacuum.robob" }],
      ["vacuum", "locate", { entity_id: "vacuum.robob" }],
      ["script", "turn_on", { entity_id: "script.clean_living_room" }],
    ]);

    const cleaningCalls = vi.fn(async () => undefined);
    const cleaning = await renderCard("mushroom-addition-card-vacuum", {
      type: "custom:mushroom-addition-card-vacuum",
      entity: "vacuum.robob",
    }, makeHass({
      ...states,
      "vacuum.robob": { ...states["vacuum.robob"], state: "cleaning" },
    }, cleaningCalls));
    click(cleaning, 'button[aria-label="Stop"]');
    expect(cleaningCalls).toHaveBeenCalledWith("vacuum", "stop", { entity_id: "vacuum.robob" });
  });

  it.each([
    ["input_select.mode", "input_select", "select_option", { entity_id: "input_select.mode", option: "Away" }, "Home"],
    ["input_boolean.test", "input_boolean", "toggle", { entity_id: "input_boolean.test" }, "off"],
    ["switch.test", "switch", "toggle", { entity_id: "switch.test" }, "off"],
    ["light.test", "light", "toggle", { entity_id: "light.test" }, "off"],
    ["automation.test", "automation", "toggle", { entity_id: "automation.test" }, "off"],
    ["input_button.test", "input_button", "press", { entity_id: "input_button.test" }, "unknown"],
    ["fan.test", "fan", "toggle", { entity_id: "fan.test" }, "off"],
    ["vacuum.test", "vacuum", "toggle", { entity_id: "vacuum.test" }, "docked"],
    ["script.test", "script", "toggle", { entity_id: "script.test" }, "off"],
    ["button.test", "button", "press", { entity_id: "button.test" }, "unknown"],
    ["lock.test", "lock", "unlock", { entity_id: "lock.test" }, "locked"],
    ["lock.test", "lock", "lock", { entity_id: "lock.test" }, "unlocked"],
  ])("executes the vertical button action for %s", async (entity, domain, service, data, state) => {
    const callService = vi.fn(async () => undefined);
    const entityState: HassEntity = { entity_id: entity, state, attributes: { friendly_name: entity } };
    const card = await renderCard("mushroom-addition-card-vertical-button", {
      type: "custom:mushroom-addition-card-vertical-button",
      entity,
      ulm_card_vertical_button_state: entity.startsWith("input_select.") ? "Away" : "on",
    }, makeHass({ [entity]: entityState }, callService));
    click(card, 'button[aria-label="Activate"]');
    expect(callService).toHaveBeenCalledWith(domain, service, data);
  });

  it("executes every welcome-scenes control and item domain with exact payloads", async () => {
    const callService = vi.fn(async () => undefined);
    const card = await renderCard("mushroom-addition-card-welcome-scenes", {
      type: "custom:mushroom-addition-card-welcome-scenes",
      collapse_entity: "input_boolean.dropdown_welcome",
      weather_entity: "weather.hcn_ha",
      scene_items: [
        { entity: "scene.living_room_relax", name: "Relax" },
        { entity: "media_player.office", name: "Office" },
        { entity: "input_select.mode", name: "Away", state: "Away" },
        { entity: "script.goodnight", name: "Goodnight" },
        { entity: "light.joris_iris_1", name: "Light" },
        { entity: "scene.living_room_dimmed", name: "Dashboard", nav_path: "/lovelace/scenes" },
      ],
    }, makeHass(states, callService));
    const actions = vi.fn();
    card.addEventListener("hass-action", actions);
    click(card, 'button[aria-label="Toggle scenes"]');
    click(card, 'button[aria-label="Open dashboard settings"]');
    for (const button of card.shadowRoot.querySelectorAll<HTMLButtonElement>(".scene-button")) button.click();
    expect(callService.mock.calls).toEqual([
      ["input_boolean", "toggle", { entity_id: "input_boolean.dropdown_welcome" }],
      ["scene", "turn_on", { entity_id: "scene.living_room_relax" }],
      ["media_player", "media_play_pause", { entity_id: "media_player.office" }],
      ["input_select", "select_option", { entity_id: "input_select.mode", option: "Away" }],
      ["script", "goodnight", { entity_id: "script.goodnight" }],
      ["homeassistant", "toggle", { entity_id: "light.joris_iris_1" }],
    ]);
    expect(actions).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({
        action: "tap",
        config: expect.objectContaining({
          tap_action: { action: "navigate", navigation_path: "/config/dashboard" },
        }),
      }),
    }));
    expect(actions).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({
        action: "tap",
        config: expect.objectContaining({
          entity: "scene.living_room_dimmed",
          tap_action: { action: "navigate", navigation_path: "/lovelace/scenes" },
        }),
      }),
    }));
  });

  it("keeps title non-interactive and gives both weather surfaces exact more-info actions", async () => {
    const cases = [
      ["mushroom-addition-card-title", { type: "custom:mushroom-addition-card-title", name: "Living room" }, "none", undefined],
      ["mushroom-addition-card-weather", { type: "custom:mushroom-addition-card-weather", entity: "weather.hcn_ha", variant: "detailed" }, "more-info", "weather.hcn_ha"],
      ["mushroom-addition-card-weather-ulm", { type: "custom:mushroom-addition-card-weather-ulm", entity: "weather.hcn_ha", variant: "native" }, "more-info", "weather.hcn_ha"],
    ] as const;
    for (const [tag, config, action, entity] of cases) {
      const card = await renderCard(tag, config);
      const triggered = vi.fn();
      card.addEventListener("hass-action", triggered);
      (card.shadowRoot.querySelector(".action-surface") as HTMLElement).click();
      expect(triggered).toHaveBeenCalledWith(expect.objectContaining({
        detail: {
          action: "tap",
          config: expect.objectContaining({
            entity,
            tap_action: { action },
          }),
        },
      }));
    }
  });
});
