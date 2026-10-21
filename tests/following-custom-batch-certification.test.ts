import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CATALOG } from "../src/catalog";
import { additionalEditorSchemaFor, editorSchemaFor } from "../src/editor-schema";
import { normalizeConfig } from "../src/helpers";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import "../src/index";

const states: HomeAssistant["states"] = {
  "sensor.cv_plug_power": {
    entity_id: "sensor.cv_plug_power",
    state: "17.7",
    attributes: { friendly_name: "CV plug power", unit_of_measurement: "W", icon: "mdi:flash" },
  },
  "sensor.wasmachine_operation_state": {
    entity_id: "sensor.wasmachine_operation_state",
    state: "stop",
    attributes: { friendly_name: "Washing machine" },
  },
  "sensor.wasmachine_program_state": {
    entity_id: "sensor.wasmachine_program_state",
    state: "wash",
    attributes: { friendly_name: "Current program stage" },
  },
  "sensor.wasmachine_plug_power": {
    entity_id: "sensor.wasmachine_plug_power",
    state: "3.2",
    attributes: { friendly_name: "Washer power", unit_of_measurement: "W" },
  },
  "sensor.wasmachine_door": {
    entity_id: "sensor.wasmachine_door",
    state: "closed",
    attributes: { friendly_name: "Washer door" },
  },
  "sensor.wasmachine_program_finished": {
    entity_id: "sensor.wasmachine_program_finished",
    state: "off",
    attributes: { friendly_name: "Program finished" },
  },
  "sensor.wasmachine_remote_control": {
    entity_id: "sensor.wasmachine_remote_control",
    state: "true",
    attributes: { friendly_name: "Remote control" },
  },
  "sensor.wasmachine_job_progress": {
    entity_id: "sensor.wasmachine_job_progress",
    state: "52",
    attributes: { friendly_name: "Progress", unit_of_measurement: "%" },
  },
  "input_boolean.wasmachine_delayed_start": {
    entity_id: "input_boolean.wasmachine_delayed_start",
    state: "on",
    attributes: { friendly_name: "Delayed start" },
  },
  "input_datetime.wasmachine_delayed_start": {
    entity_id: "input_datetime.wasmachine_delayed_start",
    state: "08:30:00",
    attributes: { friendly_name: "Delayed start time" },
  },
  "sun.sun": {
    entity_id: "sun.sun",
    state: "above_horizon",
    attributes: {
      friendly_name: "Sun",
      next_dawn: "2026-09-24T04:42:00Z",
      next_rising: "2026-09-24T05:17:00Z",
      next_noon: "2026-09-23T11:31:00Z",
      next_setting: "2026-09-23T16:45:00Z",
      next_dusk: "2026-09-23T17:20:00Z",
      azimuth: 242.5,
      elevation: 12.8,
    },
  },
  "sensor.moon": {
    entity_id: "sensor.moon",
    state: "waxing_gibbous",
    attributes: { friendly_name: "Moon Phase", device_class: "enum" },
  },
  "sensor.astronomy_moon_altitude": {
    entity_id: "sensor.astronomy_moon_altitude",
    state: "-45.4741",
    attributes: { body: "moon", metric: "altitude", unit_of_measurement: "°" },
  },
  "sensor.astronomy_moon_azimuth": {
    entity_id: "sensor.astronomy_moon_azimuth",
    state: "49.3779",
    attributes: { body: "moon", metric: "azimuth", unit_of_measurement: "°" },
  },
  "sensor.astronomy_moon_rising": {
    entity_id: "sensor.astronomy_moon_rising",
    state: "2026-09-24T17:40:00Z",
    attributes: { body: "moon", metric: "next_rising" },
  },
  "sensor.astronomy_moon_setting": {
    entity_id: "sensor.astronomy_moon_setting",
    state: "2026-09-24T05:12:00Z",
    attributes: { body: "moon", metric: "next_setting" },
  },
  "sensor.astronomy_moon_right_ascension": {
    entity_id: "sensor.astronomy_moon_right_ascension",
    state: "319.6431",
    attributes: { body: "moon", metric: "right_ascension", unit_of_measurement: "°" },
  },
  "sensor.astronomy_moon_declination": {
    entity_id: "sensor.astronomy_moon_declination",
    state: "-16.5387",
    attributes: { body: "moon", metric: "declination", unit_of_measurement: "°" },
  },
  "sensor.astronomy_moon_distance": {
    entity_id: "sensor.astronomy_moon_distance",
    state: "397790.3",
    attributes: { body: "moon", metric: "distance_km", unit_of_measurement: "km" },
  },
  "sensor.astronomy_moon_angular_diameter": {
    entity_id: "sensor.astronomy_moon_angular_diameter",
    state: "30.03",
    attributes: { body: "moon", metric: "angular_diameter_arcmin", unit_of_measurement: "arcmin" },
  },
  "sensor.astronomy_moon_phase_angle": {
    entity_id: "sensor.astronomy_moon_phase_angle",
    state: "68.29",
    attributes: { body: "moon", metric: "phase_angle", unit_of_measurement: "°" },
  },
  "sensor.astronomy_moon_illumination": {
    entity_id: "sensor.astronomy_moon_illumination",
    state: "68.5",
    attributes: { body: "moon", metric: "illumination_pct", unit_of_measurement: "%" },
  },
  "sensor.astronomy_moon_next_full": {
    entity_id: "sensor.astronomy_moon_next_full",
    state: "2026-10-26",
    attributes: { body: "moon", metric: "next_full_moon" },
  },
  "sensor.astronomy_moon_next_new": {
    entity_id: "sensor.astronomy_moon_next_new",
    state: "2026-11-09",
    attributes: { body: "moon", metric: "next_new_moon" },
  },
  "sensor.astronomy_moon_above_horizon": {
    entity_id: "sensor.astronomy_moon_above_horizon",
    state: "off",
    attributes: { body: "sky", metric: "is_moon_above_horizon" },
  },
  "climate.living_room": {
    entity_id: "climate.living_room",
    state: "heat",
    attributes: {
      friendly_name: "Living room",
      current_temperature: 19.5,
      temperature: 21,
      hvac_action: "heating",
    },
  },
  "sensor.phone_battery_level": {
    entity_id: "sensor.phone_battery_level",
    state: "18",
    attributes: { friendly_name: "Phone battery", unit_of_measurement: "%" },
  },
  "sensor.phone_battery_state": {
    entity_id: "sensor.phone_battery_state",
    state: "charging",
    attributes: { friendly_name: "Phone battery state" },
  },
  "sensor.phone_charger_type": {
    entity_id: "sensor.phone_charger_type",
    state: "wireless",
    attributes: { friendly_name: "Phone charger type" },
  },
  "media_player.office_sonos": {
    entity_id: "media_player.office_sonos",
    state: "playing",
    attributes: {
      friendly_name: "Office Sonos",
      media_title: "Now playing",
      data: [
        {},
        {
          title: "Ted Lasso",
          number: "S03E02",
          aired: "2026-09-22",
          airdate: "2026-09-25T18:00:00Z",
          fanart: "/local/ted-lasso-fanart.jpg",
          poster: "/local/ted-lasso-poster.jpg",
        },
      ],
    },
  },
  "media_player.office_tv_2": {
    entity_id: "media_player.office_tv_2",
    state: "off",
    attributes: { friendly_name: "Office TV" },
  },
};

interface TestCard extends HTMLElement {
  hass: HomeAssistant;
  setConfig(config: AdditionConfig): void;
  updateComplete: Promise<boolean>;
  shadowRoot: ShadowRoot;
}

const renderCard = async (
  tag: string,
  config: AdditionConfig,
  overrides: HomeAssistant["states"] = states,
  callService = vi.fn(async () => undefined),
): Promise<TestCard> => {
  const card = document.createElement(tag) as TestCard;
  card.hass = { states: overrides, language: "en-GB", callService };
  card.setConfig(config);
  document.body.append(card);
  await card.updateComplete;
  return card;
};

const item = (sourceId: string) => CATALOG.find((entry) => entry.upstreamId === sourceId)!;

afterEach(() => document.body.replaceChildren());

describe("following custom batch certification", () => {
  it("records deterministic browser evidence for exactly the remaining requested sources", () => {
    const evidence = JSON.parse(readFileSync(
      join(process.cwd(), "tests", "fixtures", "visual", "following-custom-batch-local-certification.json"),
      "utf8",
    )) as {
      sources: string[];
      interactions: Record<string, unknown>;
      configs: Record<string, AdditionConfig>;
    };
    expect(evidence.sources).toEqual([
      "custom_card_washer",
      "custom_card_sun",
    ]);
    expect(evidence.configs.custom_card_washer).toMatchObject({
      entity: "sensor.wasmachine_operation_state",
      power_entity: "sensor.wasmachine_plug_power",
      door_entity: "sensor.wasmachine_door",
      finished_entity: "sensor.wasmachine_program_finished",
    });
  });

  it("creates source-specific picker defaults from the provided live entity mappings", () => {
    const expected = {
      custom_card_washer: {
        entity: "sensor.wasmachine_operation_state",
        program_stage_entity: "sensor.wasmachine_program_state",
        washer_power_entity: "sensor.wasmachine_plug_power",
        door_entity: "sensor.wasmachine_door",
        finished_entity: "sensor.wasmachine_program_finished",
      },
      custom_card_sun: {
        entity: "sun.sun",
        timeFormat: "24h",
        showMoon: true,
        moon_entity: "sensor.moon",
        moon_altitude_entity: "sensor.astronomy_moon_altitude",
        moon_azimuth_entity: "sensor.astronomy_moon_azimuth",
        moon_rising_entity: "sensor.astronomy_moon_rising",
        moon_setting_entity: "sensor.astronomy_moon_setting",
      },
    } satisfies Record<string, Partial<AdditionConfig>>;

    for (const [sourceId, expectedConfig] of Object.entries(expected)) {
      const descriptor = item(sourceId);
      const constructor = customElements.get(descriptor.tag) as typeof HTMLElement & {
        getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
      };
      expect(constructor.getStubConfig(
        { states, language: "en-GB", callService: vi.fn() },
        Object.keys(states),
        [],
      )).toMatchObject({
        type: `custom:${descriptor.tag}`,
        ...expectedConfig,
      });
    }
  });

  it("provides dedicated graphical editor fields without unrelated family controls", () => {
    const expectedFields: Record<string, string[]> = {
      custom_card_washer: [
        "entity", "program_stage_entity", "washer_power_entity", "door_entity", "finished_entity",
        "ulm_custom_card_washer_start_action", "ulm_custom_card_washer_stop_action",
      ],
      custom_card_sun: [
        "entity", "title", "language", "timeFormat", "showMoon",
        "moon_entity", "moon_altitude_entity", "moon_azimuth_entity",
        "moon_rising_entity", "moon_setting_entity", "moon_next_full_moon_entity",
        "moon_next_new_moon_entity", "moon_above_horizon_entity",
      ],
    };
    for (const [sourceId, fields] of Object.entries(expectedFields)) {
      const descriptor = item(sourceId);
      const names = editorSchemaFor(descriptor).map(({ name }) => name);
      expect(names).toEqual(expect.arrayContaining(fields));
    }
    const washerFields = editorSchemaFor(item("custom_card_washer")).flatMap((field) =>
      field.schema ?? [field]);
    const washerFieldNames = washerFields.map(({ name }) => name);
    const machineFieldIndex = washerFieldNames.indexOf("entity");
    const programFieldIndex = washerFieldNames.indexOf("program_stage_entity");
    const powerFieldIndex = washerFieldNames.indexOf("washer_power_entity");
    const doorFieldIndex = washerFieldNames.indexOf("door_entity");
    expect(machineFieldIndex).toBeLessThan(programFieldIndex);
    expect(programFieldIndex).toBeLessThan(powerFieldIndex);
    expect(powerFieldIndex).toBeLessThan(doorFieldIndex);
    expect([machineFieldIndex, programFieldIndex, powerFieldIndex]
      .every((index) => washerFields[index].selector && "entity" in washerFields[index].selector!)).toBe(true);
    expect(additionalEditorSchemaFor(item("custom_card_washer")).map(({ name }) => name)).not.toEqual(expect.arrayContaining([
      "ulm_custom_card_washer_job_state",
      "ulm_custom_card_washer_machine_state",
      "ulm_custom_card_washer_power",
    ]));
  });

  it("migrates required upstream variables into semantic renderer config", () => {
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-washer",
      ulm_custom_card_washer_machine_state: "sensor.wasmachine_operation_state",
      ulm_custom_card_washer_power: "sensor.wasmachine_plug_power",
    })).toMatchObject({
      entity: "sensor.wasmachine_operation_state",
      program_stage_entity: "sensor.wasmachine_operation_state",
      power_entity: "sensor.wasmachine_plug_power",
      washer_power_entity: "sensor.wasmachine_plug_power",
    });
  });

  it("round-trips the remaining washer and Sun source configs through the graphical editor", async () => {
    for (const [sourceId, config] of Object.entries({
      custom_card_washer: {
        type: "custom:mushroom-addition-custom-card-washer",
        entity: "sensor.wasmachine_operation_state",
        program_stage_entity: "sensor.wasmachine_program_state",
        washer_power_entity: "sensor.wasmachine_plug_power",
      },
      custom_card_sun: {
        type: "custom:mushroom-addition-custom-card-sun",
        entity: "sun.sun",
        timeFormat: "24h",
      },
    } satisfies Record<string, AdditionConfig>)) {
      const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
        shadowRoot: ShadowRoot;
      };
      editor.hass = { states, language: "en-GB", callService: vi.fn() };
      editor.setConfig(config);
      document.body.append(editor);
      await editor.updateComplete;
      const forms = [...editor.shadowRoot.querySelectorAll<HTMLElement & {
        schema: Array<{ name: string }>;
        data: AdditionConfig;
        computeLabel: (schema: { name: string }) => string;
      }>("ha-form")];
      expect(forms.length, sourceId).toBeGreaterThan(0);
      expect(forms.flatMap((form) => form.schema.map((field) => field.name)), sourceId).toContain("entity");
      if (sourceId === "custom_card_washer") {
        expect(forms[0].computeLabel({ name: "entity" })).toBe("Machine state");
      }
      const changed = vi.fn();
      editor.addEventListener("config-changed", changed);
      forms[0].dispatchEvent(new CustomEvent("value-changed", {
        bubbles: true,
        composed: true,
        detail: { value: { ...forms[0].data, name: `Edited ${sourceId}` } },
      }));
      expect(changed, sourceId).toHaveBeenCalledWith(expect.objectContaining({
        detail: {
          config: expect.objectContaining({
            entity: config.entity,
            name: `Edited ${sourceId}`,
          }),
        },
      }));
      editor.remove();
    }
  });

  it("renders Washer stopped, running, progress, stage, delay, and auxiliary states", async () => {
    const config: AdditionConfig = {
      type: "custom:mushroom-addition-custom-card-washer",
      entity: "sensor.wasmachine_operation_state",
      power_entity: "sensor.wasmachine_plug_power",
      door_entity: "sensor.wasmachine_door",
      finished_entity: "sensor.wasmachine_program_finished",
      ulm_custom_card_washer_remote_control: "sensor.wasmachine_remote_control",
      ulm_custom_card_washer_job_progress: "sensor.wasmachine_job_progress",
      ulm_custom_card_washer_delayed_start: "input_boolean.wasmachine_delayed_start",
      ulm_custom_card_washer_delayed_starttime: "input_datetime.wasmachine_delayed_start",
      ulm_custom_card_washer_start_action: { action: "call-service", service: "switch.turn_on", service_data: { entity_id: "switch.washer_start" } },
      ulm_custom_card_washer_pause_action: { action: "call-service", service: "switch.turn_on", service_data: { entity_id: "switch.washer_pause" } },
      ulm_custom_card_washer_stop_action: { action: "call-service", service: "switch.turn_on", service_data: { entity_id: "switch.washer_stop" } },
    };
    const stopped = await renderCard("mushroom-addition-custom-card-washer", config);
    expect(stopped.shadowRoot.querySelector('button[aria-label="Start washer"]')).not.toBeNull();
    expect((stopped.shadowRoot.querySelector('button[aria-label="Stop washer"]') as HTMLButtonElement).disabled).toBe(true);
    expect(stopped.shadowRoot.querySelector(".washer-progress")?.textContent).toContain("52%");
    expect(stopped.shadowRoot.textContent).toContain("closed");
    expect(stopped.shadowRoot.textContent).toContain("08:30:00");
    stopped.remove();

    const running = await renderCard("mushroom-addition-custom-card-washer", config, {
      ...states,
      "sensor.wasmachine_operation_state": {
        ...states["sensor.wasmachine_operation_state"],
        state: "wash",
      },
    });
    expect(running.shadowRoot.querySelector('button[aria-label="Pause washer"]')).not.toBeNull();
    expect((running.shadowRoot.querySelector('button[aria-label="Stop washer"]') as HTMLButtonElement).disabled).toBe(false);
    expect(running.shadowRoot.querySelector(".washer-stages .is-active")).not.toBeNull();
    expect(running.shadowRoot.querySelector(".washer-delay-controls")).not.toBeNull();
  });

  it("renders all documented Sun options", async () => {
    const sun = await renderCard("mushroom-addition-custom-card-sun", {
      type: "custom:mushroom-addition-custom-card-sun",
      entity: "sun.sun",
      title: "Today",
      language: "en-GB",
      timeFormat: "24h",
      darkMode: true,
    });
    expect(sun.shadowRoot.querySelector(".custom-sun-card.is-dark")).not.toBeNull();
    expect(sun.shadowRoot.textContent).toContain("Today");
    expect(sun.shadowRoot.textContent).toContain("Azimuth");
    expect(sun.shadowRoot.textContent).toContain("242.5°");
    expect(sun.shadowRoot.textContent).toContain("Elevation");
    expect(sun.shadowRoot.querySelector(".moon-section")).not.toBeNull();
    expect(sun.shadowRoot.querySelector(".moon-arc")).toBeNull();
    expect(sun.shadowRoot.querySelector(".sun-arc .sun-marker")).not.toBeNull();
    expect(sun.shadowRoot.querySelector(".sun-arc .moon-marker")).not.toBeNull();
    expect(sun.shadowRoot.textContent).toContain("waxing gibbous");
    expect(sun.shadowRoot.textContent).toContain("Below horizon");
    expect(sun.shadowRoot.textContent).toContain("Moonrise");
    expect(sun.shadowRoot.textContent).toContain("Moonset");
    expect(sun.shadowRoot.textContent).toContain("Sun:");
    expect(sun.shadowRoot.textContent).toContain("Moon:");
    expect(sun.shadowRoot.textContent).not.toContain("Illumination");
    expect(sun.shadowRoot.textContent).not.toContain("Phase angle");
    expect(sun.shadowRoot.textContent).not.toContain("Right ascension");
    expect(sun.shadowRoot.textContent).not.toContain("Declination");
    expect(sun.shadowRoot.textContent).not.toContain("Distance");
    expect(sun.shadowRoot.textContent).not.toContain("Angular diameter");
    expect(sun.shadowRoot.textContent).toContain("Next full Moon");
    expect(sun.shadowRoot.textContent).toContain("26 Oct 2026");
    expect(sun.shadowRoot.querySelector(".moon-marker")?.getAttribute("style"))
      .toContain("--moon-x:13.72%");
    expect(sun.shadowRoot.querySelector(".sun-marker")?.getAttribute("style"))
      .toContain("--sun-x:67.36%");
    expect(sun.shadowRoot.querySelector(".sun-arc circle")).toBeNull();
    sun.remove();

  });

  it("enumerates every visible control with exact Home Assistant payloads", async () => {
    const washerServices = vi.fn(async () => undefined);
    const washer = await renderCard("mushroom-addition-custom-card-washer", {
      type: "custom:mushroom-addition-custom-card-washer",
      entity: "sensor.wasmachine_operation_state",
      power_entity: "sensor.wasmachine_plug_power",
      ulm_custom_card_washer_remote_control: "sensor.wasmachine_remote_control",
      ulm_custom_card_washer_delayed_start: "input_boolean.wasmachine_delayed_start",
      ulm_custom_card_washer_delayed_starttime: "input_datetime.wasmachine_delayed_start",
      ulm_custom_card_washer_start_action: {
        action: "call-service",
        service: "switch.turn_on",
        service_data: { entity_id: "switch.washer_start" },
      },
    }, states, washerServices);
    const washerActions = vi.fn();
    washer.addEventListener("hass-action", washerActions);
    (washer.shadowRoot.querySelector('button[aria-label="Start washer"]') as HTMLButtonElement).click();
    (washer.shadowRoot.querySelector('button[aria-label="Disable delayed start"]') as HTMLButtonElement).click();
    (washer.shadowRoot.querySelector('button[aria-label="Move delayed start 15 minutes earlier"]') as HTMLButtonElement).click();
    (washer.shadowRoot.querySelector(".washer-delay-time") as HTMLButtonElement).click();
    (washer.shadowRoot.querySelector('button[aria-label="Move delayed start 15 minutes later"]') as HTMLButtonElement).click();
    expect(washerActions.mock.calls.map(([event]) => event.detail)).toEqual([
      {
        config: {
          type: "custom:mushroom-addition-custom-card-washer",
          entity: "sensor.wasmachine_operation_state",
          tap_action: {
            action: "call-service",
            service: "switch.turn_on",
            service_data: { entity_id: "switch.washer_start" },
          },
        },
        action: "tap",
      },
      {
        config: {
          type: "custom:mushroom-addition-custom-card-washer",
          entity: "input_boolean.wasmachine_delayed_start",
          tap_action: { action: "toggle" },
        },
        action: "tap",
      },
    ]);
    expect(washerServices.mock.calls).toEqual([
      ["input_datetime", "set_datetime", { entity_id: "input_datetime.wasmachine_delayed_start", time: "08:15:00" }],
      ["input_datetime", "set_datetime", { entity_id: "input_datetime.wasmachine_delayed_start", time: "08:31:00" }],
      ["input_datetime", "set_datetime", { entity_id: "input_datetime.wasmachine_delayed_start", time: "08:45:00" }],
    ]);
    washer.remove();

    const runningWasher = await renderCard("mushroom-addition-custom-card-washer", {
      type: "custom:mushroom-addition-custom-card-washer",
      entity: "sensor.wasmachine_operation_state",
      power_entity: "sensor.wasmachine_plug_power",
      ulm_custom_card_washer_remote_control: "sensor.wasmachine_remote_control",
      ulm_custom_card_washer_pause_action: {
        action: "call-service",
        service: "switch.turn_on",
        service_data: { entity_id: "switch.washer_pause" },
      },
      ulm_custom_card_washer_stop_action: {
        action: "call-service",
        service: "switch.turn_on",
        service_data: { entity_id: "switch.washer_stop" },
      },
    }, {
      ...states,
      "sensor.wasmachine_operation_state": {
        ...states["sensor.wasmachine_operation_state"],
        state: "wash",
      },
    });
    const runningActions = vi.fn();
    runningWasher.addEventListener("hass-action", runningActions);
    (runningWasher.shadowRoot.querySelector('button[aria-label="Pause washer"]') as HTMLButtonElement).click();
    (runningWasher.shadowRoot.querySelector('button[aria-label="Stop washer"]') as HTMLButtonElement).click();
    expect(runningActions.mock.calls.map(([event]) => event.detail.config.tap_action)).toEqual([
      {
        action: "call-service",
        service: "switch.turn_on",
        service_data: { entity_id: "switch.washer_pause" },
      },
      {
        action: "call-service",
        service: "switch.turn_on",
        service_data: { entity_id: "switch.washer_stop" },
      },
    ]);
    runningWasher.remove();

    for (const [tag, config, expectedAction] of [
      [
        "mushroom-addition-custom-card-sun",
        { type: "custom:mushroom-addition-custom-card-sun", entity: "sun.sun" },
        { action: "none" },
      ],
    ] as const) {
      const card = await renderCard(tag, config);
      const action = vi.fn();
      card.addEventListener("hass-action", action);
      (card.shadowRoot.querySelector(".action-surface") as HTMLElement).click();
      expect(action).toHaveBeenCalledWith(expect.objectContaining({
        detail: {
          action: "tap",
          config: expect.objectContaining({ tap_action: expectedAction }),
        },
      }));
      card.remove();
    }
  });
});
