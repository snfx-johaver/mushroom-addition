import { afterEach, describe, expect, it, vi } from "vitest";
import { sharedStyles } from "../src/styles";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import "../src/index";

const states: HomeAssistant["states"] = {
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
  "light.office_accent": {
    entity_id: "light.office_accent",
    state: "on",
    attributes: { friendly_name: "Resident Iris", icon: "mdi:lightbulb", value: "Living room" },
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

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe("regular Scenes service certification", () => {
  it("executes each Scenes item domain with exact payloads", async () => {
    const callService = vi.fn(async () => undefined);
    const card = await renderCard("mushroom-addition-card-scenes", {
      type: "custom:mushroom-addition-card-scenes",
      scene_items: [
        { entity: "scene.living_room_relax", name: "Relax" },
        { entity: "media_player.office", name: "Office" },
        { entity: "input_select.mode", name: "Away", state: "Away" },
        { entity: "script.goodnight", name: "Goodnight" },
        { entity: "light.office_accent", name: "Light" },
        { entity: "scene.living_room_dimmed", name: "Dashboard", navigation_path: "/lovelace/scenes" },
      ],
    }, makeHass(states, callService));
    const actions = vi.fn();
    card.addEventListener("hass-action", actions);
    for (const button of card.shadowRoot.querySelectorAll<HTMLButtonElement>(".scene-button")) button.click();
    expect(callService.mock.calls).toEqual([
      ["scene", "turn_on", { entity_id: "scene.living_room_relax" }],
      ["media_player", "media_play_pause", { entity_id: "media_player.office" }],
      ["input_select", "select_option", { entity_id: "input_select.mode", option: "Away" }],
      ["script", "goodnight", { entity_id: "script.goodnight" }],
      ["homeassistant", "toggle", { entity_id: "light.office_accent" }],
    ]);
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
});

describe("scene surface styling", () => {
  it("uses the same shaded scene-button surface for Scenes and Welcome navigation", () => {
    expect(sharedStyles.cssText).toContain(
      ".scene-button { display: flex; min-width: 52px; flex: 1;",
    );
    expect(sharedStyles.cssText).toContain("box-shadow: var(--addition-raised-shadow)");
    expect(sharedStyles.cssText).not.toContain(".welcome-scenes .scene-button {");
  });
});
