import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CATALOG } from "../src/catalog";
import { editorSchemaFor, upstreamEditorSchemaFor } from "../src/editor-schema";
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
  "sensor.yvette_mobile_battery_level": {
    entity_id: "sensor.yvette_mobile_battery_level",
    state: "18",
    attributes: { friendly_name: "Yvette battery", unit_of_measurement: "%" },
  },
  "sensor.yvette_mobile_battery_state": {
    entity_id: "sensor.yvette_mobile_battery_state",
    state: "charging",
    attributes: { friendly_name: "Yvette battery state" },
  },
  "sensor.yvette_mobile_charger_type": {
    entity_id: "sensor.yvette_mobile_charger_type",
    state: "wireless",
    attributes: { friendly_name: "Yvette charger type" },
  },
  "media_player.office_joris_sonos": {
    entity_id: "media_player.office_joris_sonos",
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
  "media_player.office_joris_tv_2": {
    entity_id: "media_player.office_joris_tv_2",
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
  it("records deterministic browser evidence for exactly the six requested sources", () => {
    const evidence = JSON.parse(readFileSync(
      join(process.cwd(), "docs", "assets", "visual-audit", "following-custom-batch-local-certification.json"),
      "utf8",
    )) as {
      sources: string[];
      interactions: Record<string, unknown>;
      configs: Record<string, AdditionConfig>;
    };
    expect(evidence.sources).toEqual([
      "custom_card_bar_card",
      "custom_card_haven_washer",
      "custom_card_httpedo13_sun",
      "custom_card_httpedo13_thermostat",
      "custom_card_iAbadia_battery_chip",
      "custom_card_imswel_medias",
    ]);
    expect(evidence.configs.custom_card_haven_washer).toMatchObject({
      entity: "sensor.wasmachine_operation_state",
      power_entity: "sensor.wasmachine_plug_power",
      door_entity: "sensor.wasmachine_door",
      finished_entity: "sensor.wasmachine_program_finished",
    });
    expect(evidence.interactions.custom_card_httpedo13_thermostat).toBeDefined();
  });

  it("creates source-specific picker defaults from the provided live entity mappings", () => {
    const expected = {
      custom_card_bar_card: { entity: "sensor.cv_plug_power" },
      custom_card_haven_washer: {
        entity: "sensor.wasmachine_operation_state",
        power_entity: "sensor.wasmachine_plug_power",
        door_entity: "sensor.wasmachine_door",
        finished_entity: "sensor.wasmachine_program_finished",
      },
      custom_card_httpedo13_sun: { entity: "sun.sun", timeFormat: "24h" },
      custom_card_httpedo13_thermostat: { entity: "climate.living_room", variant: "buttons" },
      custom_card_iAbadia_battery_chip: {
        entity: "sensor.yvette_mobile_battery_level",
        battery_state_entity: "sensor.yvette_mobile_battery_state",
        charger_type_entity: "sensor.yvette_mobile_charger_type",
      },
      custom_card_imswel_medias: {
        entity: "media_player.office_joris_sonos",
        secondary_entity: "media_player.office_joris_tv_2",
        variant: "library",
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
      custom_card_bar_card: ["entity", "ulm_custom_card_bar_card_min", "ulm_custom_card_bar_card_value"],
      custom_card_haven_washer: [
        "entity", "power_entity", "door_entity", "finished_entity",
        "ulm_custom_card_washer_start_action", "ulm_custom_card_washer_stop_action",
      ],
      custom_card_httpedo13_sun: ["entity", "title", "language", "timeFormat", "showAzimuth", "showElevation"],
      custom_card_httpedo13_thermostat: ["entity", "variant"],
      custom_card_iAbadia_battery_chip: [
        "entity", "battery_state_entity", "charger_type_entity",
        "ulm_custom_card_iAbadia_battery_chip_warning",
      ],
      custom_card_imswel_medias: [
        "entity", "secondary_entity", "variant",
        "ulm_custom_card_imswel_medias_index", "ulm_custom_card_imswel_medias_platform",
      ],
    };
    for (const [sourceId, fields] of Object.entries(expectedFields)) {
      const descriptor = item(sourceId);
      const names = [
        ...editorSchemaFor(descriptor),
        ...(sourceId === "custom_card_bar_card" ? upstreamEditorSchemaFor(descriptor) : []),
      ].map(({ name }) => name);
      expect(names).toEqual(expect.arrayContaining(fields));
    }
    expect(editorSchemaFor(item("custom_card_bar_card")).map(({ name }) => name))
      .not.toEqual(expect.arrayContaining(["show_graph", "min_entity", "max_entity"]));
  });

  it("migrates required upstream variables into semantic renderer config", () => {
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-haven-washer",
      ulm_custom_card_washer_machine_state: "sensor.wasmachine_operation_state",
      ulm_custom_card_washer_power: "sensor.wasmachine_plug_power",
    })).toMatchObject({
      entity: "sensor.wasmachine_operation_state",
      power_entity: "sensor.wasmachine_plug_power",
    });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-iabadia-battery-chip",
      ulm_custom_card_iAbadia_battery_chip_entity: "sensor.yvette_mobile_battery_level",
    })).toMatchObject({ entity: "sensor.yvette_mobile_battery_level" });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-imswel-medias",
      entity: "media_player.office_joris_sonos",
      ulm_custom_card_imswel_medias_platform: "plex",
    })).toMatchObject({ variant: "library" });
  });

  it("round-trips all six source configs through the graphical editor", async () => {
    for (const [sourceId, config] of Object.entries({
      custom_card_bar_card: {
        type: "custom:mushroom-addition-custom-card-bar-card",
        entity: "sensor.cv_plug_power",
        ulm_custom_card_bar_card_value: true,
      },
      custom_card_haven_washer: {
        type: "custom:mushroom-addition-custom-card-haven-washer",
        entity: "sensor.wasmachine_operation_state",
        power_entity: "sensor.wasmachine_plug_power",
      },
      custom_card_httpedo13_sun: {
        type: "custom:mushroom-addition-custom-card-httpedo13-sun",
        entity: "sun.sun",
        timeFormat: "24h",
      },
      custom_card_httpedo13_thermostat: {
        type: "custom:mushroom-addition-custom-card-httpedo13-thermostat",
        entity: "climate.living_room",
        variant: "buttons",
      },
      custom_card_iAbadia_battery_chip: {
        type: "custom:mushroom-addition-custom-card-iabadia-battery-chip",
        entity: "sensor.yvette_mobile_battery_level",
        battery_state_entity: "sensor.yvette_mobile_battery_state",
      },
      custom_card_imswel_medias: {
        type: "custom:mushroom-addition-custom-card-imswel-medias",
        entity: "media_player.office_joris_sonos",
        variant: "library",
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
      }>("ha-form")];
      expect(forms.length, sourceId).toBeGreaterThan(0);
      expect(forms.flatMap((form) => form.schema.map((field) => field.name)), sourceId).toContain("entity");
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

  it("preserves Bar Card's accepted 35px composition and state behavior", async () => {
    const styles = readFileSync(join(process.cwd(), "src", "styles.ts"), "utf8");
    expect(styles).toContain("grid-template-rows: minmax(60px, 1fr) 35px");
    expect(styles).toContain("height: 35px");
    const card = await renderCard("mushroom-addition-custom-card-bar-card", {
      type: "custom:mushroom-addition-custom-card-bar-card",
      entity: "sensor.cv_plug_power",
      ulm_custom_card_bar_card_min: 0,
      ulm_custom_card_bar_card_max: 100,
      ulm_custom_card_bar_card_value: true,
      ulm_custom_card_bar_card_indicator: true,
    });
    expect((card.shadowRoot.querySelector(".bar-card-fill") as HTMLElement).style.width).toBe("17.7%");
    expect(card.shadowRoot.querySelector(".bar-card-indicator")).not.toBeNull();
    expect(card.shadowRoot.querySelector(".bar-card-inside-value")?.textContent).toContain("17.7 W");
  });

  it("renders Washer stopped, running, progress, stage, delay, and auxiliary states", async () => {
    const config: AdditionConfig = {
      type: "custom:mushroom-addition-custom-card-haven-washer",
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
    const stopped = await renderCard("mushroom-addition-custom-card-haven-washer", config);
    expect(stopped.shadowRoot.querySelector('button[aria-label="Start washer"]')).not.toBeNull();
    expect((stopped.shadowRoot.querySelector('button[aria-label="Stop washer"]') as HTMLButtonElement).disabled).toBe(true);
    expect(stopped.shadowRoot.querySelector(".washer-progress")?.textContent).toContain("52%");
    expect(stopped.shadowRoot.textContent).toContain("closed");
    expect(stopped.shadowRoot.textContent).toContain("08:30:00");
    stopped.remove();

    const running = await renderCard("mushroom-addition-custom-card-haven-washer", config, {
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

  it("renders all documented Sun options and both Thermostat states", async () => {
    const sun = await renderCard("mushroom-addition-custom-card-httpedo13-sun", {
      type: "custom:mushroom-addition-custom-card-httpedo13-sun",
      entity: "sun.sun",
      title: "Today",
      language: "en-GB",
      timeFormat: "24h",
      darkMode: true,
      showAzimuth: true,
      showElevation: true,
    });
    expect(sun.shadowRoot.querySelector(".custom-sun-card.is-dark")).not.toBeNull();
    expect(sun.shadowRoot.textContent).toContain("Today");
    expect(sun.shadowRoot.textContent).toContain("Azimuth");
    expect(sun.shadowRoot.textContent).toContain("242.5°");
    expect(sun.shadowRoot.textContent).toContain("Elevation");

    const thermostat = await renderCard("mushroom-addition-custom-card-httpedo13-thermostat", {
      type: "custom:mushroom-addition-custom-card-httpedo13-thermostat",
      entity: "climate.living_room",
      variant: "buttons",
    });
    expect(thermostat.shadowRoot.querySelector(".is-heating")).not.toBeNull();
    expect(thermostat.shadowRoot.querySelector(".compact-thermostat-controls")).not.toBeNull();
    thermostat.remove();

    const collapsed = await renderCard("mushroom-addition-custom-card-httpedo13-thermostat", {
      type: "custom:mushroom-addition-custom-card-httpedo13-thermostat",
      entity: "climate.living_room",
      variant: "collapse",
    }, {
      ...states,
      "climate.living_room": {
        ...states["climate.living_room"],
        state: "off",
        attributes: { ...states["climate.living_room"].attributes, hvac_action: "idle" },
      },
    });
    expect(collapsed.shadowRoot.querySelector(".compact-thermostat-controls")).toBeNull();
  });

  it("renders Battery Chip thresholds and source-specific Media variants", async () => {
    const battery = await renderCard("mushroom-addition-custom-card-iabadia-battery-chip", {
      type: "custom:mushroom-addition-custom-card-iabadia-battery-chip",
      entity: "sensor.yvette_mobile_battery_level",
      battery_state_entity: "sensor.yvette_mobile_battery_state",
      charger_type_entity: "sensor.yvette_mobile_charger_type",
      ulm_custom_card_iAbadia_battery_chip_warning: 20,
      ulm_custom_card_iAbadia_battery_chip_danger: 10,
    });
    expect(battery.shadowRoot.querySelector(".tone-yellow")).not.toBeNull();
    expect((battery.shadowRoot.querySelector("ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:battery-charging");
    battery.remove();

    const library = await renderCard("mushroom-addition-custom-card-imswel-medias", {
      type: "custom:mushroom-addition-custom-card-imswel-medias",
      entity: "media_player.office_joris_sonos",
      secondary_entity: "media_player.office_joris_tv_2",
      variant: "library",
      ulm_custom_card_imswel_medias_index: 1,
      ulm_custom_card_imswel_medias_platform: "plex",
    });
    expect(library.shadowRoot.querySelector(".is-library")).not.toBeNull();
    expect(library.shadowRoot.textContent).toContain("Recently added");
    expect(library.shadowRoot.textContent).toContain("Ted Lasso S03E02");
    library.remove();

    const upcoming = await renderCard("mushroom-addition-custom-card-imswel-medias", {
      type: "custom:mushroom-addition-custom-card-imswel-medias",
      entity: "media_player.office_joris_sonos",
      variant: "upcoming",
      ulm_custom_card_imswel_medias_index: 1,
      ulm_custom_card_imswel_medias_platform: "sonarr",
    });
    expect(upcoming.shadowRoot.querySelector(".is-upcoming")).not.toBeNull();
    expect(upcoming.shadowRoot.textContent).toContain("Ted Lasso - S03E02");
  });

  it("enumerates every visible control with exact Home Assistant payloads", async () => {
    const washerServices = vi.fn(async () => undefined);
    const washer = await renderCard("mushroom-addition-custom-card-haven-washer", {
      type: "custom:mushroom-addition-custom-card-haven-washer",
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
          type: "custom:mushroom-addition-custom-card-haven-washer",
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
          type: "custom:mushroom-addition-custom-card-haven-washer",
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

    const runningWasher = await renderCard("mushroom-addition-custom-card-haven-washer", {
      type: "custom:mushroom-addition-custom-card-haven-washer",
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

    const thermostatServices = vi.fn(async () => undefined);
    const thermostat = await renderCard("mushroom-addition-custom-card-httpedo13-thermostat", {
      type: "custom:mushroom-addition-custom-card-httpedo13-thermostat",
      entity: "climate.living_room",
      variant: "buttons",
    }, states, thermostatServices);
    (thermostat.shadowRoot.querySelector(".thermostat-summary") as HTMLButtonElement).click();
    (thermostat.shadowRoot.querySelector('button[aria-label="Decrease temperature"]') as HTMLButtonElement).click();
    (thermostat.shadowRoot.querySelector('button[aria-label="Increase temperature"]') as HTMLButtonElement).click();
    expect(thermostatServices.mock.calls).toEqual([
      ["climate", "set_hvac_mode", { entity_id: "climate.living_room", hvac_mode: "off" }],
      ["climate", "set_temperature", { entity_id: "climate.living_room", temperature: 20.5 }],
      ["climate", "set_temperature", { entity_id: "climate.living_room", temperature: 21.5 }],
    ]);
    thermostat.remove();

    for (const [tag, config, expectedAction] of [
      [
        "mushroom-addition-custom-card-bar-card",
        { type: "custom:mushroom-addition-custom-card-bar-card", entity: "sensor.cv_plug_power" },
        { action: "more-info" },
      ],
      [
        "mushroom-addition-custom-card-httpedo13-sun",
        { type: "custom:mushroom-addition-custom-card-httpedo13-sun", entity: "sun.sun" },
        { action: "none" },
      ],
      [
        "mushroom-addition-custom-card-iabadia-battery-chip",
        { type: "custom:mushroom-addition-custom-card-iabadia-battery-chip", entity: "sensor.yvette_mobile_battery_level" },
        { action: "more-info" },
      ],
      [
        "mushroom-addition-custom-card-imswel-medias",
        { type: "custom:mushroom-addition-custom-card-imswel-medias", entity: "media_player.office_joris_sonos" },
        { action: "more-info" },
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
