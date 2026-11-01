import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { CATALOG } from "../src/catalog";
import { createStubConfig } from "../src/stub";
import { editorSchemaFor, type EditorField } from "../src/editor-schema";
import { discoverWasherEntities, washerProgramLabel } from "../src/washer";
import type { MushroomAdditionCard } from "../src/card";
import type { MushroomAdditionEditor } from "../src/editor";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import { openEditorSections } from "./editor-helpers";

const type = "custom:mushroom-addition-custom-card-washer";
const makeHass = (): HomeAssistant => {
  const definitions = [
    ["switch.dishwasher_power", "on", {}],
    ["sensor.dishwasher_operation_state", "run", {}],
    ["sensor.dishwasher_power", "100", { device_class: "power" }],
    ["select.dishwasher_selected_program", "dishcare_dishwasher_program_eco_50", { options: ["dishcare_dishwasher_program_eco_50", "dishcare_dishwasher_program_auto_45_65"] }],
    ["select.dishwasher_active_program", "dishcare_dishwasher_program_eco_50", {}],
    ["binary_sensor.dishwasher_door", "off", {}],
    ["binary_sensor.dishwasher_finished", "off", {}],
    ["binary_sensor.dishwasher_remote_control", "on", {}],
    ["binary_sensor.dishwasher_remote_start", "on", {}],
    ["sensor.dishwasher_program_progress", "25", {}],
    ["input_boolean.dishwasher_delayed_start", "off", {}],
    ["input_datetime.dishwasher_delayed_start", "12:00", {}],
  ] as const;
  return {
    states: Object.fromEntries(definitions.map(([id, state, attributes]) =>
      [id, { entity_id: id, state, attributes: { friendly_name: id, ...attributes } }])),
    entities: Object.fromEntries(definitions.map(([id]) => [id, { device_id: "dishwasher" }])),
    callService: vi.fn(async () => undefined),
  };
};

afterEach(() => document.body.replaceChildren());

describe("Washer-Dryer entity setup", () => {
  it("starts all entity selectors empty, even with compatible HA entities", () => {
    const descriptor = CATALOG.find(item => item.upstreamId === "custom_card_washer")!;
    const config = createStubConfig(descriptor, makeHass(), ["switch.dishwasher_power"]);
    expect(config.entity).toBeUndefined();
    const flatten = (fields: EditorField[]): EditorField[] =>
      fields.flatMap(field => [field, ...flatten(field.schema ?? [])]);
    for (const field of flatten(editorSchemaFor(descriptor, config))) {
      if (field.selector?.entity) expect(config[field.name], field.name).toBeUndefined();
    }
    expect(config.type).toBe(type);
  });

  it("maps all relevant same-device fields and prefers selected over active program", () => {
    expect(discoverWasherEntities(makeHass(), "switch.dishwasher_power")).toEqual({
      program_stage_entity: "sensor.dishwasher_operation_state",
      washer_power_entity: "sensor.dishwasher_power",
      program_select_entity: "select.dishwasher_selected_program",
      power_switch_entity: "switch.dishwasher_power",
      door_entity: "binary_sensor.dishwasher_door",
      finished_entity: "binary_sensor.dishwasher_finished",
      ulm_custom_card_washer_remote_control: "binary_sensor.dishwasher_remote_control",
      ulm_custom_card_washer_job_progress: "sensor.dishwasher_program_progress",
      ulm_custom_card_washer_delayed_start: "input_boolean.dishwasher_delayed_start",
      ulm_custom_card_washer_delayed_starttime: "input_datetime.dishwasher_delayed_start",
    });
  });

  it("leaves missing, unavailable, other-device and ambiguous matches empty", () => {
    const hass = makeHass();
    hass.entities!["sensor.dishwasher_power"].device_id = "other";
    hass.entities!["switch.dishwasher_power"].device_id = "other";
    hass.states["binary_sensor.dishwasher_door"].state = "unavailable";
    hass.states["binary_sensor.dishwasher_finished_copy"] = {
      entity_id: "binary_sensor.dishwasher_finished_copy", state: "off", attributes: {},
    };
    hass.entities!["binary_sensor.dishwasher_finished_copy"] = { device_id: "dishwasher" };
    const mappings = discoverWasherEntities(hass, "sensor.dishwasher_operation_state");
    expect(mappings.washer_power_entity).toBeUndefined();
    expect(mappings.door_entity).toBeUndefined();
    expect(mappings.finished_entity).toBeUndefined();
    expect(discoverWasherEntities({ ...hass, entities: undefined }, "switch.dishwasher_power")).toEqual({});
  });

  it("saves discovery once on selection, preserves overrides and never refills cleared fields on updates", async () => {
    const hass = makeHass();
    const registryReads = vi.fn(() => hass.entities);
    const liveHass = { ...hass };
    Object.defineProperty(liveHass, "entities", { get: registryReads });
    const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
    editor.hass = liveHass;
    const config: AdditionConfig = { type, door_entity: "binary_sensor.manual_door" };
    editor.setConfig(config);
    document.body.append(editor);
    await openEditorSections(editor);
    const changes: AdditionConfig[] = [];
    editor.addEventListener("config-changed", event =>
      changes.push((event as CustomEvent<{ config: AdditionConfig }>).detail.config));
    const change = async (value: Record<string, unknown>) => {
      editor.shadowRoot!.querySelector("ha-form")!.dispatchEvent(new CustomEvent("value-changed", {
        detail: { value }, bubbles: true, composed: true,
      }));
      await editor.updateComplete;
    };
    expect(changes).toHaveLength(0);
    await change({ entity: "switch.dishwasher_power" });
    expect(changes).toHaveLength(1);
    expect(changes[0]).toMatchObject({
      entity: "switch.dishwasher_power",
      door_entity: "binary_sensor.manual_door",
      program_select_entity: "select.dishwasher_selected_program",
    });
    expect(registryReads).toHaveBeenCalled();
    registryReads.mockClear();
    await change({ program_select_entity: "" });
    editor.setConfig(changes.at(-1)!);
    for (let i = 0; i < 5; i++) {
      editor.hass = liveHass;
      editor.requestUpdate();
      await editor.updateComplete;
    }
    await change({ ...changes.at(-1), name: "Kitchen" });
    expect(changes.at(-1)?.program_select_entity).toBe("");
    expect(registryReads).not.toHaveBeenCalled();
    expect(hass.callService).not.toHaveBeenCalled();
  });
});

describe("Washer-Dryer program labels", () => {
  it("exposes three empty custom slots and only shows details for configured slots", () => {
    const descriptor = CATALOG.find(item => item.upstreamId === "custom_card_washer")!;
    const flatten = (fields: EditorField[]): EditorField[] =>
      fields.flatMap(field => [field, ...flatten(field.schema ?? [])]);
    const fields = flatten(editorSchemaFor(descriptor, { type }));
    expect(fields.filter(field => /^washer_button_[123]_entity$/.test(field.name))).toHaveLength(3);
    expect(fields.some(field => field.name === "washer_button_1_action")).toBe(false);
    const configured = flatten(editorSchemaFor(descriptor, { type, washer_button_2_entity: "switch.extra" }));
    expect(configured.some(field => field.name === "washer_button_2_action")).toBe(true);
    expect(configured.some(field => field.name === "washer_button_1_action")).toBe(false);
  });

  it("renders optional custom buttons with safe domain defaults, overrides and disabled missing states", async () => {
    const hass = makeHass();
    hass.states["button.extra"] = { entity_id: "button.extra", state: "2026-11-01", attributes: { friendly_name: "Extra function" } };
    const card = document.createElement(type.replace("custom:", "")) as MushroomAdditionCard;
    card.hass = hass;
    card.setConfig({ type, entity: "switch.dishwasher_power",
      washer_button_1_entity: "switch.dishwasher_power", washer_button_1_name: "Intensive zone",
      washer_button_2_entity: "button.extra",
      washer_button_3_entity: "sensor.dishwasher_program_progress",
    });
    document.body.append(card);
    await card.updateComplete;
    const actions = vi.fn();
    card.addEventListener("hass-action", actions);
    const buttons = [...card.shadowRoot!.querySelectorAll<HTMLButtonElement>(".washer-extra-button")];
    expect(buttons).toHaveLength(3);
    expect(buttons[0].textContent).toContain("Intensive zone");
    expect(buttons[0].querySelector("small")?.textContent).toBe("on");
    buttons.forEach(button => button.click());
    const configs = actions.mock.calls.map(([event]) => (event as CustomEvent).detail.config);
    expect(configs[0]).toMatchObject({ entity: "switch.dishwasher_power", tap_action: { action: "toggle" } });
    expect(configs[1]).toMatchObject({ entity: "button.extra", tap_action: {
      action: "perform-action", perform_action: "button.press", target: { entity_id: "button.extra" },
    } });
    expect(configs[2]).toMatchObject({ entity: "sensor.dishwasher_program_progress", tap_action: { action: "more-info" } });
    expect(hass.callService).not.toHaveBeenCalled();
    card.setConfig({ type, washer_button_1_entity: "switch.dishwasher_power",
      washer_button_1_action: { action: "more-info" },
      washer_button_2_entity: "switch.missing",
      washer_button_3_entity: "button.extra", washer_button_3_action: { action: "none" },
    });
    await card.updateComplete;
    const updated = [...card.shadowRoot!.querySelectorAll<HTMLButtonElement>(".washer-extra-button")];
    expect(updated[1].disabled).toBe(true);
    expect(updated[2].disabled).toBe(true);
    updated[0].click();
    expect((actions.mock.calls.at(-1)![0] as CustomEvent).detail.config.tap_action.action).toBe("more-info");
    card.setConfig({ type });
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".washer-extra-controls")).toBeNull();
  });

  it("shows the actual operation state independently of power/heading and updates it live", async () => {
    const hass = makeHass();
    hass.formatEntityState = entity => entity.state === "run" ? "Running"
      : entity.state === "ready" ? "Ready" : entity.state;
    const card = document.createElement(type.replace("custom:", "")) as MushroomAdditionCard;
    card.hass = hass;
    card.setConfig({
      type, entity: "switch.dishwasher_power", secondary_info: "state",
      program_stage_entity: "sensor.dishwasher_operation_state",
      power_switch_entity: "switch.dishwasher_power",
      ulm_custom_card_washer_remote_control: "binary_sensor.dishwasher_remote_control",
    });
    document.body.append(card);
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".washer-operation-state")?.textContent).toContain("Running");
    expect(card.shadowRoot!.querySelector('[aria-label="Pause washer"]')).not.toBeNull();
    card.hass = { ...hass, states: { ...hass.states,
      "sensor.dishwasher_operation_state": { ...hass.states["sensor.dishwasher_operation_state"], state: "ready" },
    } };
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".washer-operation-state")?.textContent).toContain("Ready");
    expect(card.shadowRoot!.querySelector('[aria-label="Start washer"]')).not.toBeNull();
    card.setConfig({
      type, entity: "switch.dishwasher_power", secondary_info: "none",
      ulm_custom_card_washer_job_state: "sensor.dishwasher_operation_state",
    });
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".washer-operation-state")?.textContent).toContain("Ready");
  });

  it("uses HA translated option states and readable integration identifiers", () => {
    const hass = makeHass();
    const entity = hass.states["select.dishwasher_selected_program"];
    expect(washerProgramLabel(hass, entity, entity.state)).toBe("Eco 50");
    hass.formatEntityState = state => state.state === entity.state ? "Eco 50 °C" : state.state;
    expect(washerProgramLabel(hass, entity, entity.state)).toBe("Eco 50 °C");
    expect(washerProgramLabel(hass, entity, "auto_45_65")).toBe("Auto 45 65");
    expect(washerProgramLabel(hass, entity, "Dishcare.Dishwasher.Program.Eco50")).toBe("Eco50");
    hass.formatEntityState = () => "Eco 1.5 h";
    expect(washerProgramLabel(hass, entity, entity.state)).toBe("Eco 1.5 h");
  });

  it("renders friendly labels but sends the unchanged raw selected option", async () => {
    const hass = makeHass();
    const card = document.createElement(type.replace("custom:", "")) as MushroomAdditionCard;
    card.hass = hass;
    card.setConfig({
      type, entity: "switch.dishwasher_power",
      power_switch_entity: "switch.dishwasher_power",
      program_select_entity: "select.dishwasher_selected_program",
    });
    document.body.append(card);
    await card.updateComplete;
    const select = card.shadowRoot!.querySelector<HTMLSelectElement>(".washer-program")!;
    expect(select.options[0].text).toBe("Eco 50");
    expect(select.options[0].value).toBe("dishcare_dishwasher_program_eco_50");
    select.value = "dishcare_dishwasher_program_auto_45_65";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    expect(hass.callService).toHaveBeenCalledWith("select", "select_option", {
      entity_id: "select.dishwasher_selected_program",
      option: "dishcare_dishwasher_program_auto_45_65",
    });
  });
});
