import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CATALOG } from "../src/catalog";
import { editorSchemaFor } from "../src/editor-schema";
import { normalizeConfig } from "../src/helpers";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import "../src/index";

const states: HomeAssistant["states"] = {
  "person.joris": {
    entity_id: "person.joris",
    state: "home",
    attributes: { friendly_name: "Joris", entity_picture: "/local/joris.jpg" },
  },
  "sensor.joris_mobile_battery_level": {
    entity_id: "sensor.joris_mobile_battery_level",
    state: "72",
    attributes: { friendly_name: "Battery", unit_of_measurement: "%" },
  },
  "sensor.joris_eta": {
    entity_id: "sensor.joris_eta",
    state: "12",
    attributes: { friendly_name: "ETA", unit_of_measurement: "min" },
  },
  "sensor.joris_address": {
    entity_id: "sensor.joris_address",
    state: "Home",
    attributes: { friendly_name: "Address" },
  },
  "zone.office": {
    entity_id: "zone.office",
    state: "1",
    attributes: { friendly_name: "Office", icon: "mdi:office-building", persons: ["person.joris"] },
  },
  "switch.cv_plug": {
    entity_id: "switch.cv_plug",
    state: "on",
    attributes: { friendly_name: "CV plug", icon: "mdi:power-plug" },
  },
  "sensor.cv_plug_power": {
    entity_id: "sensor.cv_plug_power",
    state: "10",
    attributes: { friendly_name: "CV plug power", unit_of_measurement: "W" },
  },
  "light.joris_iris_1": {
    entity_id: "light.joris_iris_1",
    state: "on",
    attributes: { friendly_name: "Office", brightness: 128, current_temperature: 21, unit_of_measurement: "°C" },
  },
  "sensor.office_joris_motion_illuminance": {
    entity_id: "sensor.office_joris_motion_illuminance",
    state: "85",
    attributes: { friendly_name: "Light", unit_of_measurement: "lx", icon: "mdi:lightbulb" },
  },
  "sensor.bedroom_temperature_2": {
    entity_id: "sensor.bedroom_temperature_2",
    state: "19.8",
    attributes: { friendly_name: "Temperature", unit_of_measurement: "°C", icon: "mdi:thermometer" },
  },
  "input_select.room": {
    entity_id: "input_select.room",
    state: "Living room",
    attributes: { friendly_name: "Room" },
  },
  "scene.living_room_relax": {
    entity_id: "scene.living_room_relax",
    state: "scening",
    attributes: { friendly_name: "Relax", icon: "mdi:sofa" },
  },
  "scene.living_room_dimmed": {
    entity_id: "scene.living_room_dimmed",
    state: "off",
    attributes: { friendly_name: "Dimmed", icon: "mdi:lightbulb-night" },
  },
  "media_player.office": {
    entity_id: "media_player.office",
    state: "playing",
    attributes: { friendly_name: "Office media", icon: "mdi:cast" },
  },
  "input_select.scene": {
    entity_id: "input_select.scene",
    state: "Relax",
    attributes: { friendly_name: "Scene choice" },
  },
  "script.welcome_home_briefing": {
    entity_id: "script.welcome_home_briefing",
    state: "off",
    attributes: { friendly_name: "Welcome home briefing", icon: "mdi:script-text" },
  },
  "climate.living_room": {
    entity_id: "climate.living_room",
    state: "heat",
    attributes: {
      friendly_name: "Living room",
      current_temperature: 19,
      temperature: 21,
      target_temp_step: 0.5,
      hvac_action: "heating",
      hvac_modes: ["auto", "heat", "cool", "dry", "heat_cool", "fan_only"],
    },
  },
  "fan.living_room": {
    entity_id: "fan.living_room",
    state: "off",
    attributes: { friendly_name: "Living room fan" },
  },
};

interface TestCard extends HTMLElement {
  hass: HomeAssistant;
  setConfig(config: AdditionConfig): void;
  updateComplete: Promise<boolean>;
  shadowRoot: ShadowRoot;
}

const createHass = (callService = vi.fn(async () => undefined), overrides: HomeAssistant["states"] = states): HomeAssistant => ({
  states: overrides,
  callService,
});

const renderCard = async (
  sourceId: string,
  config: Omit<AdditionConfig, "type">,
  overrides: HomeAssistant["states"] = states,
  callService = vi.fn(async () => undefined),
): Promise<TestCard> => {
  const item = CATALOG.find((entry) => entry.upstreamId === sourceId)!;
  const card = document.createElement(item.tag) as TestCard;
  card.hass = createHass(callService, overrides);
  card.setConfig({ type: `custom:${item.tag}`, ...config });
  document.body.append(card);
  await card.updateComplete;
  return card;
};

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

describe("queued default batch one certification", () => {
  it("records exact live configs without claiming live acceptance", () => {
    const evidence = JSON.parse(readFileSync(
      join(process.cwd(), "docs", "assets", "visual-audit", "default-batch-one-local-certification.json"),
      "utf8",
    )) as {
      liveAccepted: boolean;
      sources: Record<string, { liveConfig: Record<string, unknown>; artifact: string }>;
    };
    expect(evidence.liveAccepted).toBe(false);
    expect(Object.keys(evidence.sources)).toEqual([
      "card_room",
      "card_scenes",
    ]);
  });

  it("creates source-specific picker defaults from the exact live entities", () => {
    const expected = {
      card_room: ["light.joris_iris_1", { room_sensors: expect.arrayContaining([
        expect.objectContaining({ entity: "sensor.office_joris_motion_illuminance" }),
        expect.objectContaining({ entity: "sensor.bedroom_temperature_2" }),
      ]) }],
      card_scenes: ["light.joris_iris_1", { scene_items: expect.arrayContaining([
        expect.objectContaining({ entity: "scene.living_room_relax" }),
        expect.objectContaining({ entity: "scene.living_room_dimmed" }),
      ]) }],
    } as const;
    for (const [sourceId, [expectedEntity, extra]] of Object.entries(expected)) {
      const item = CATALOG.find((entry) => entry.upstreamId === sourceId)!;
      const constructor = customElements.get(item.tag) as typeof HTMLElement & {
        getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
      };
      const entityIds = sourceId === "card_scenes"
        ? Object.keys(states).filter((entityId) => entityId.startsWith("scene."))
        : Object.keys(states);
      expect(constructor.getStubConfig(createHass(), entityIds, [])).toMatchObject({
        type: `custom:${item.tag}`,
        ...(expectedEntity ? { entity: expectedEntity } : {}),
        ...extra,
      });
    }
  });

  it.each([
    ["card_room", ["entity", "label_use_temperature", "label_use_brightness", "room_light_entity", "ulm_card_dynamic_color"]],
    ["card_scenes", ["entity", "variant", "scene_buttons_only", "name"]],
  ])("exposes a dedicated %s graphical editor", (sourceId, fields) => {
    const item = CATALOG.find((entry) => entry.upstreamId === sourceId)!;
    const schema = editorSchemaFor(item, { type: `custom:${item.tag}`, variant: item.variants?.[0] });
    expect(schema.map((field) => field.name)).toEqual(expect.arrayContaining(fields));
    expect(schema.map((field) => field.name)).not.toContain("use_entity_picture");
  });

  it("ignores obsolete Room helper variables without synthesizing an action", () => {
    expect(normalizeConfig({
      type: "custom:mushroom-addition-card-room",
      entity: "light.joris_iris_1",
      ulm_input_select: "input_select.room",
      ulm_input_select_option: "Office",
    }).double_tap_action).toBeUndefined();
  });

  it("covers room and scene state styling", async () => {
    const room = await renderCard("card_room", { entity: "light.joris_iris_1" });
    expect(room.shadowRoot.textContent).toContain("21 °C");
    room.remove();
    const unavailableRoom = await renderCard("card_room", { entity: "light.joris_iris_1" }, {
      ...states,
      "light.joris_iris_1": { ...states["light.joris_iris_1"], state: "unavailable" },
    });
    expect(unavailableRoom.shadowRoot.querySelector(".room-unavailable")).not.toBeNull();
    unavailableRoom.remove();

    const scenes = await renderCard("card_scenes", {
      entity: "light.joris_iris_1",
      scene_items: [{ entity: "media_player.office", name: "Media", active_state: "playing" }],
    });
    expect(scenes.shadowRoot.querySelector(".automatic-presentation")).not.toBeNull();
    expect(scenes.shadowRoot.querySelector(".scene-button.is-active")).not.toBeNull();
    scenes.remove();

    const buttonsOnly = await renderCard("card_scenes", {
      entity: "light.joris_iris_1",
      name: "Office scenes",
      secondary_info: "state",
      scene_buttons_only: true,
      scene_items: [{ entity: "media_player.office", name: "Media", active_state: "playing" }],
    });
    expect(buttonsOnly.shadowRoot.querySelector(".automatic-presentation")).toBeNull();
    expect(buttonsOnly.shadowRoot.querySelector(".scene-buttons-only .scene-button")).not.toBeNull();
    expect(buttonsOnly.shadowRoot.textContent).not.toContain("Office scenes");
    buttonsOnly.remove();

  });

  it("dispatches exact room widget Home Assistant actions", async () => {
    const room = await renderCard("card_room", {
      entity: "light.joris_iris_1",
      room_sensors: [{ entity: "sensor.office_joris_motion_illuminance" }],
      input_select_entity: "input_select.room",
      input_select_option: "Office",
    });
    const action = vi.fn();
    room.addEventListener("hass-action", action);
    const sensor = room.shadowRoot.querySelector(".room-sensor") as HTMLElement;
    sensor.click();
    expect(action).toHaveBeenLastCalledWith(expect.objectContaining({
      detail: {
        action: "tap",
        config: expect.objectContaining({
          type: "custom:mushroom-addition-card-room",
          entity: "sensor.office_joris_motion_illuminance",
          tap_action: { action: "more-info" },
        }),
      },
    }));

    vi.useFakeTimers();
    sensor.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    vi.advanceTimersByTime(500);
    sensor.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    expect(action).toHaveBeenLastCalledWith(expect.objectContaining({
      detail: {
        action: "hold",
        config: expect.objectContaining({
          type: "custom:mushroom-addition-card-room",
          entity: "sensor.office_joris_motion_illuminance",
          hold_action: { action: "more-info" },
        }),
      },
    }));
    vi.useRealTimers();

    const surface = room.shadowRoot.querySelector(".action-surface") as HTMLElement;
    surface.dispatchEvent(new MouseEvent("dblclick", { bubbles: true, detail: 2 }));
    expect(action).toHaveBeenLastCalledWith(expect.objectContaining({
      detail: {
        action: "double_tap",
        config: expect.objectContaining({
          entity: "light.joris_iris_1",
          double_tap_action: undefined,
        }),
      },
    }));
  });

  it("calls every scene-pill service with the exact source payload", async () => {
    const callService = vi.fn(async () => undefined);
    const scenes = await renderCard("card_scenes", {
      scene_items: [
        { entity: "scene.living_room_relax", name: "Scene" },
        { entity: "media_player.office", name: "Media" },
        { entity: "input_select.scene", name: "Choice", state: "Dimmed" },
        { entity: "script.welcome_home_briefing", name: "Script" },
        { entity: "light.joris_iris_1", name: "Light" },
      ],
    }, states, callService);
    for (const button of scenes.shadowRoot.querySelectorAll<HTMLButtonElement>(".scene-button")) button.click();
    expect(callService.mock.calls).toEqual([
      ["scene", "turn_on", { entity_id: "scene.living_room_relax" }],
      ["media_player", "media_play_pause", { entity_id: "media_player.office" }],
      ["input_select", "select_option", { entity_id: "input_select.scene", option: "Dimmed" }],
      ["script", "welcome_home_briefing", { entity_id: "script.welcome_home_briefing" }],
      ["homeassistant", "toggle", { entity_id: "light.joris_iris_1" }],
    ]);
  });

});
