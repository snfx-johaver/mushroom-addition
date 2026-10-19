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
      "card_person",
      "card_room",
      "card_scenes",
    ]);
    expect(evidence.sources.card_person.liveConfig).toEqual({
      entity: "person.joris",
      battery_entity: "sensor.joris_mobile_battery_level",
    });
  });

  it("creates source-specific picker defaults from the exact live entities", () => {
    const expected = {
      card_person: ["person.joris", { battery_entity: "sensor.joris_mobile_battery_level" }],
      card_room: ["light.joris_iris_1", { room_sensors: expect.arrayContaining([
        expect.objectContaining({ entity: "sensor.office_joris_motion_illuminance" }),
        expect.objectContaining({ entity: "sensor.bedroom_temperature_2" }),
      ]) }],
      card_scenes: [undefined, { scene_items: expect.arrayContaining([
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
    ["card_person", ["entity", "battery_entity", "eta_entity", "address_entity"]],
    ["card_room", ["entity", "label_use_temperature", "label_use_brightness", "input_select_entity", "input_select_option"]],
    ["card_scenes", ["variant", "name"]],
  ])("exposes a dedicated %s graphical editor", (sourceId, fields) => {
    const item = CATALOG.find((entry) => entry.upstreamId === sourceId)!;
    const schema = editorSchemaFor(item, { type: `custom:${item.tag}`, variant: item.variants?.[0] });
    expect(schema.map((field) => field.name)).toEqual(expect.arrayContaining(fields));
    expect(schema.map((field) => field.name)).not.toContain("use_entity_picture");
  });

  it("migrates documented upstream variables into semantic defaults", () => {
    expect(normalizeConfig({
      type: "custom:mushroom-addition-card-person",
      ulm_card_person_entity: "person.joris",
      ulm_card_person_battery: "sensor.joris_mobile_battery_level",
      ulm_card_person_eta: "sensor.joris_eta",
      ulm_address: "sensor.joris_address",
      ulm_card_person_use_entity_picture: true,
    })).toMatchObject({
      entity: "person.joris",
      battery_entity: "sensor.joris_mobile_battery_level",
      eta_entity: "sensor.joris_eta",
      address_entity: "sensor.joris_address",
      use_entity_picture: true,
    });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-card-room",
      entity: "light.joris_iris_1",
      ulm_input_select: "input_select.room",
      ulm_input_select_option: "Office",
    })).toMatchObject({
      input_select_entity: "input_select.room",
      input_select_option: "Office",
      double_tap_action: {
        action: "perform-action",
        perform_action: "input_select.select_option",
        target: { entity_id: "input_select.room" },
        data: { option: "Office" },
      },
    });
  });

  it("covers person, room, and scene state styling", async () => {
    const person = await renderCard("card_person", {
      entity: "person.joris",
      battery_entity: "sensor.joris_mobile_battery_level",
      address_entity: "sensor.joris_address",
    });
    expect(person.shadowRoot.querySelector(".person-location-badge.home")).not.toBeNull();
    expect(person.shadowRoot.textContent).toContain("72");
    person.remove();

    const awayPerson = await renderCard("card_person", { entity: "person.joris" }, {
      ...states,
      "person.joris": { ...states["person.joris"], state: "not_home" },
    });
    expect(awayPerson.shadowRoot.querySelector(".person-location-badge.away")).not.toBeNull();
    awayPerson.remove();

    const room = await renderCard("card_room", { entity: "light.joris_iris_1" });
    expect(room.shadowRoot.textContent).toContain("21°C");
    room.remove();
    const unavailableRoom = await renderCard("card_room", { entity: "light.joris_iris_1" }, {
      ...states,
      "light.joris_iris_1": { ...states["light.joris_iris_1"], state: "unavailable" },
    });
    expect(unavailableRoom.shadowRoot.querySelector(".room-unavailable")).not.toBeNull();
    unavailableRoom.remove();

    const scenes = await renderCard("card_scenes", {
      scene_items: [{ entity: "media_player.office", name: "Media", active_state: "playing" }],
    });
    expect(scenes.shadowRoot.querySelector(".scene-button.is-active")).not.toBeNull();
    scenes.remove();

  });

  it("dispatches exact source surface and room widget Home Assistant actions", async () => {
    const person = await renderCard("card_person", { entity: "person.joris" });
    const personAction = vi.fn();
    person.addEventListener("hass-action", personAction);
    (person.shadowRoot.querySelector(".action-surface") as HTMLElement).click();
    expect(personAction).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        action: "tap",
        config: expect.objectContaining({
          entity: "person.joris",
          tap_action: { action: "more-info" },
        }),
      },
    }));
    person.remove();

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
        config: {
          type: "custom:mushroom-addition-card-room",
          entity: "sensor.office_joris_motion_illuminance",
          tap_action: { action: "toggle" },
        },
      },
    }));

    vi.useFakeTimers();
    sensor.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    vi.advanceTimersByTime(500);
    sensor.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    expect(action).toHaveBeenLastCalledWith(expect.objectContaining({
      detail: {
        action: "tap",
        config: {
          type: "custom:mushroom-addition-card-room",
          entity: "sensor.office_joris_motion_illuminance",
          tap_action: { action: "more-info" },
        },
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
          double_tap_action: {
            action: "perform-action",
            perform_action: "input_select.select_option",
            target: { entity_id: "input_select.room" },
            data: { option: "Office" },
          },
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
