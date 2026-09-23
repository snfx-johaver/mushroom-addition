import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CATALOG } from "../src/catalog";
import { editorSchemaFor, upstreamEditorSchemaFor } from "../src/editor-schema";
import "../src/index";
import type { AdditionConfig, HassEntity, HomeAssistant } from "../src/types";

const sourceIds = [
  "card_battery",
  "card_binary_sensor",
  "card_binary_sensor_alert",
  "card_cover",
  "card_fan",
  "card_input_boolean",
] as const;

const tags = [
  "mushroom-addition-card-battery",
  "mushroom-addition-card-binary-sensor",
  "mushroom-addition-card-binary-sensor-alert",
  "mushroom-addition-card-cover",
  "mushroom-addition-card-fan",
  "mushroom-addition-card-input-boolean",
] as const;

const states: Record<string, HassEntity> = {
  "sensor.phone_battery": {
    entity_id: "sensor.phone_battery",
    state: "charging",
    attributes: { friendly_name: "Phone battery", battery_level: 15 },
  },
  "sensor.phone_battery_state": {
    entity_id: "sensor.phone_battery_state",
    state: "charging",
    attributes: { friendly_name: "Phone battery state" },
  },
  "sensor.phone_charger": {
    entity_id: "sensor.phone_charger",
    state: "wireless",
    attributes: { friendly_name: "Phone charger" },
  },
  "binary_sensor.window": {
    entity_id: "binary_sensor.window",
    state: "on",
    attributes: { friendly_name: "Window", icon: "mdi:window-open" },
    last_changed: "2026-09-23T18:30:00.000Z",
  },
  "cover.blind": {
    entity_id: "cover.blind",
    state: "open",
    attributes: {
      friendly_name: "Living room blind",
      device_class: "blind",
      current_position: 64,
      current_tilt_position: 20,
    },
  },
  "fan.bedroom": {
    entity_id: "fan.bedroom",
    state: "on",
    attributes: {
      friendly_name: "Bedroom fan",
      icon: "mdi:fan",
      percentage: 42,
      oscillate: true,
      temperature: 22.4,
      humidity: 48.2,
    },
  },
  "input_boolean.guest_mode": {
    entity_id: "input_boolean.guest_mode",
    state: "on",
    attributes: { friendly_name: "Guest mode", icon: "mdi:account-multiple" },
  },
};

const baseHass = (callService = vi.fn(async () => undefined)): HomeAssistant => ({
  states,
  callService,
});

type TestCard = HTMLElement & {
  hass: HomeAssistant;
  setConfig(config: AdditionConfig): void;
  updateComplete: Promise<boolean>;
  shadowRoot: ShadowRoot;
};

const renderCard = async (
  tag: string,
  config: AdditionConfig,
  hass = baseHass(),
): Promise<TestCard> => {
  const card = document.createElement(tag) as TestCard;
  card.hass = hass;
  card.setConfig(config);
  document.body.append(card);
  await card.updateComplete;
  return card;
};

afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
});

describe("six default-control source certifications", () => {
  it("records every visible interaction and exact Home Assistant payload", () => {
    const evidence = JSON.parse(readFileSync(
      join(process.cwd(), "docs", "assets", "visual-audit", "default-controls-certification.json"),
      "utf8",
    )) as {
      sources: Record<string, {
        cardSurface: string[];
        controls: Array<{ label: string; service?: string; data?: Record<string, unknown> }>;
      }>;
    };
    expect(Object.keys(evidence.sources)).toEqual(sourceIds);
    for (const sourceId of sourceIds) {
      expect(evidence.sources[sourceId].cardSurface).toEqual(["tap", "hold", "double_tap", "keyboard"]);
    }
    expect(evidence.sources.card_cover.controls).toEqual([
      { label: "Close", service: "cover.close_cover", data: { entity_id: "cover.blind" } },
      { label: "Stop", service: "cover.stop_cover", data: { entity_id: "cover.blind" } },
      { label: "Open", service: "cover.open_cover", data: { entity_id: "cover.blind" } },
      { label: "Move to 35%", service: "cover.set_cover_position", data: { entity_id: "cover.blind", position: 35 } },
      { label: "Cover position", service: "cover.set_cover_position", data: { entity_id: "cover.blind", position: 55 } },
      { label: "Close tilt", service: "cover.close_cover_tilt", data: { entity_id: "cover.blind" } },
      { label: "Stop tilt", service: "cover.stop_cover_tilt", data: { entity_id: "cover.blind" } },
      { label: "Open tilt", service: "cover.open_cover_tilt", data: { entity_id: "cover.blind" } },
    ]);
    expect(evidence.sources.card_fan.controls).toEqual([
      { label: "Fan speed", service: "fan.set_percentage", data: { entity_id: "fan.bedroom", percentage: 65 } },
      { label: "Toggle oscillation", service: "fan.oscillate", data: { entity_id: "fan.bedroom", oscillating: false } },
    ]);
  });

  it("records exact safe live semantic configs without accepting the live stage", () => {
    const evidence = JSON.parse(readFileSync(
      join(process.cwd(), "docs", "assets", "visual-audit", "default-controls-certification.json"),
      "utf8",
    )) as {
      liveAccepted: boolean;
      liveSemanticConfigs: Record<string, unknown>;
    };
    expect(evidence.liveAccepted).toBe(false);
    expect(evidence.liveSemanticConfigs).toEqual({
      card_battery: {
        primary: {
          type: "custom:mushroom-addition-card-battery",
          entity: "sensor.yvette_mobile_battery_level",
        },
        alternateLowBattery: {
          type: "custom:mushroom-addition-card-battery",
          entity: "sensor.joris_mobile_battery_level",
          ulm_card_battery_battery_level_danger: 20,
          ulm_card_battery_battery_level_warning: 50,
        },
      },
      card_binary_sensor: {
        type: "custom:mushroom-addition-card-binary-sensor",
        entity: "binary_sensor.all_doors",
      },
      card_binary_sensor_alert: {
        type: "custom:mushroom-addition-card-binary-sensor",
        variant: "alert",
        entity: "binary_sensor.all_smoke_sensors",
      },
      card_cover: {
        type: "custom:mushroom-addition-card-cover",
        entity: "cover.sunscreen",
        ulm_card_cover_enable_controls: false,
        ulm_card_cover_enable_slider: false,
        ulm_card_cover_enable_tilt: false,
      },
      card_fan: {
        type: "custom:mushroom-addition-card-fan",
        entity: "fan.air_purifier",
        ulm_card_fan_enable_slider: false,
        ulm_card_fan_enable_button: false,
      },
      card_input_boolean: {
        type: "custom:mushroom-addition-card-input-boolean",
        entity: "input_boolean.dropdown_welcome",
        tap_action: { action: "toggle" },
      },
    });
  });

  it("prefers the prepared semantic entities in picker stubs when they are available", () => {
    const liveStates: Record<string, HassEntity> = {
      "sensor.joris_mobile_battery_state": {
        entity_id: "sensor.joris_mobile_battery_state",
        state: "discharging",
        attributes: { friendly_name: "Joris battery state" },
      },
      "sensor.yvette_mobile_battery_level": {
        entity_id: "sensor.yvette_mobile_battery_level",
        state: "77",
        attributes: { friendly_name: "Yvette battery", unit_of_measurement: "%" },
      },
      "sensor.joris_mobile_battery_level": {
        entity_id: "sensor.joris_mobile_battery_level",
        state: "18",
        attributes: { friendly_name: "Joris battery", unit_of_measurement: "%" },
      },
      "binary_sensor.other_door": {
        entity_id: "binary_sensor.other_door",
        state: "off",
        attributes: { friendly_name: "Other door" },
      },
      "binary_sensor.all_doors": {
        entity_id: "binary_sensor.all_doors",
        state: "off",
        attributes: { friendly_name: "All doors" },
      },
      "cover.sunscreen": {
        entity_id: "cover.sunscreen",
        state: "closed",
        attributes: { friendly_name: "Sunscreen" },
      },
      "fan.air_purifier": {
        entity_id: "fan.air_purifier",
        state: "off",
        attributes: { friendly_name: "Air purifier" },
      },
      "input_boolean.dropdown_welcome": {
        entity_id: "input_boolean.dropdown_welcome",
        state: "off",
        attributes: { friendly_name: "Welcome dropdown" },
      },
    };
    const hass: HomeAssistant = { states: liveStates, callService: async () => undefined };
    const expected = new Map([
      ["card_battery", "sensor.yvette_mobile_battery_level"],
      ["card_binary_sensor", "binary_sensor.all_doors"],
      ["card_cover", "cover.sunscreen"],
      ["card_fan", "fan.air_purifier"],
      ["card_input_boolean", "input_boolean.dropdown_welcome"],
    ]);
    for (const [sourceId, entity] of expected) {
      const item = CATALOG.find((entry) => entry.upstreamId === sourceId)!;
      const constructor = customElements.get(item.tag) as typeof HTMLElement & {
        getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
      };
      expect(constructor.getStubConfig(hass, Object.keys(liveStates), [])).toMatchObject({ entity });
    }
  });

  it("publishes source-faithful picker defaults for all six sources", () => {
    const entityBySource: Record<(typeof sourceIds)[number], string> = {
      card_battery: "sensor.phone_battery",
      card_binary_sensor: "binary_sensor.window",
      card_binary_sensor_alert: "binary_sensor.window",
      card_cover: "cover.blind",
      card_fan: "fan.bedroom",
      card_input_boolean: "input_boolean.guest_mode",
    };
    for (const sourceId of sourceIds) {
      const item = CATALOG.find((entry) =>
        entry.upstreamId === sourceId || entry.sourceIds?.includes(sourceId))!;
      const constructor = customElements.get(item.tag) as typeof HTMLElement & {
        getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
      };
      const entity = entityBySource[sourceId];
      const stub = constructor.getStubConfig(baseHass(), [entity], []);
      expect(stub.entity).toBe(entity);
      expect(stub.icon).toBeUndefined();
      expect(stub.tap_action).toEqual({ action: ["fan", "input_boolean"].includes(entity.split(".")[0]) ? "toggle" : "more-info" });
      if (sourceId === "card_binary_sensor_alert") {
        expect(item.variants).toContain("alert");
        expect(item.variantLabels?.alert).toBe("Alert sensor");
      }
      if (sourceId === "card_cover") {
        expect(stub).toMatchObject({
          show_controls: true,
          ulm_card_cover_enable_controls: true,
          ulm_card_cover_enable_slider: true,
        });
      }
      if (sourceId === "card_fan") {
        expect(stub).toMatchObject({
          show_controls: true,
          ulm_card_fan_enable_slider: true,
          ulm_card_fan_enable_button: true,
        });
      }
    }
  });

  it("exposes executable source options and round-trips them through the graphical editor", async () => {
    const expectedFields: Record<(typeof sourceIds)[number], string[]> = {
      card_battery: [
        "ulm_card_battery_attribute",
        "ulm_card_battery_battery_state_entity_id",
        "ulm_card_battery_charger_type_entity_id",
        "ulm_card_battery_battery_level_danger",
        "ulm_card_battery_color_battery_level_danger",
      ],
      card_binary_sensor: [
        "ulm_card_binary_sensor_icon",
        "ulm_card_binary_sensor_color",
        "ulm_card_binary_sensor_show_last_changed",
      ],
      card_binary_sensor_alert: [
        "ulm_card_binary_sensor_alert_icon",
        "ulm_card_binary_sensor_alert_color",
        "ulm_card_binary_sensor_alert_show_last_changed",
      ],
      card_cover: [
        "ulm_card_cover_enable_controls",
        "ulm_card_cover_enable_slider",
        "ulm_card_cover_enable_tilt",
        "ulm_card_cover_favorite_percentage",
        "ulm_card_cover_icon",
      ],
      card_fan: [
        "ulm_card_fan_enable_collapse",
        "ulm_card_fan_enable_slider",
        "ulm_card_fan_enable_button",
        "ulm_card_fan_button_service",
        "ulm_card_fan_temp_attribute",
      ],
      card_input_boolean: [
        "ulm_card_input_boolean_icon",
        "ulm_card_input_boolean_color",
        "ulm_card_input_boolean_force_background_color",
      ],
    };
    for (const sourceId of sourceIds) {
      const item = CATALOG.find((entry) =>
        entry.upstreamId === sourceId || entry.sourceIds?.includes(sourceId))!;
      const config: AdditionConfig = {
        type: `custom:${sourceId === "card_binary_sensor_alert" ? tags[2] : item.tag}`,
        variant: sourceId === "card_binary_sensor_alert" ? "alert" : undefined,
      };
      expect(upstreamEditorSchemaFor(item, config).map((field) => field.name))
        .toEqual(expect.arrayContaining(expectedFields[sourceId]));
      expect(editorSchemaFor(item, config).map((field) => field.name))
        .toEqual(expect.arrayContaining(["entity", "tap_action", "hold_action", "double_tap_action"]));

      const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
        hass: HomeAssistant;
        setConfig(value: AdditionConfig): void;
        updateComplete: Promise<boolean>;
      };
      editor.hass = baseHass();
      editor.setConfig(config);
      const changed = vi.fn();
      editor.addEventListener("config-changed", changed);
      document.body.append(editor);
      await editor.updateComplete;
      const form = editor.shadowRoot?.querySelector("ha-expansion-panel ha-form");
      form?.dispatchEvent(new CustomEvent("value-changed", {
        bubbles: true,
        composed: true,
        detail: { value: { [expectedFields[sourceId][0]]: "certified-value" } },
      }));
      expect(changed).toHaveBeenCalledWith(expect.objectContaining({
        detail: {
          config: expect.objectContaining({ [expectedFields[sourceId][0]]: "certified-value" }),
        },
      }));
      editor.remove();
    }
  });

  it("renders battery attribute, thresholds, linked charging state, charger type, and unavailable state", async () => {
    const card = await renderCard(tags[0], {
      type: `custom:${tags[0]}`,
      entity: "sensor.phone_battery",
      ulm_card_battery_attribute: "battery_level",
      ulm_card_battery_battery_state_entity_id: "sensor.phone_battery_state",
      ulm_card_battery_charger_type_entity_id: "sensor.phone_charger",
      ulm_card_battery_charging_animation: true,
      ulm_card_battery_battery_level_danger: 20,
      ulm_card_battery_battery_level_warning: 50,
    });
    expect(card.shadowRoot.querySelector(".value-first .ulm-name")?.textContent).toBe("15%");
    expect((card.shadowRoot.querySelector(".source-icon ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:battery-charging-wireless-10");
    expect(card.shadowRoot.querySelector(".ulm-default-battery")?.classList.contains("is-charging")).toBe(true);

    card.hass = {
      ...baseHass(),
      states: {
        ...states,
        "sensor.phone_battery": { ...states["sensor.phone_battery"], state: "unknown", attributes: { friendly_name: "Phone battery" } },
      },
    };
    card.setConfig({ type: `custom:${tags[0]}`, entity: "sensor.phone_battery" });
    await card.updateComplete;
    expect((card.shadowRoot.querySelector(".source-icon ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:battery-off");
  });

  it("renders standard, alert, and input-boolean source states with configured icons and names", async () => {
    const standard = await renderCard(tags[1], {
      type: `custom:${tags[1]}`,
      entity: "binary_sensor.window",
      ulm_card_binary_sensor_icon: "mdi:window-open-variant",
      ulm_card_binary_sensor_name: "Kitchen window",
      ulm_card_binary_sensor_show_last_changed: true,
    });
    expect(standard.shadowRoot.querySelector(".ulm-binary")?.classList.contains("is-active")).toBe(true);
    expect((standard.shadowRoot.querySelector(".source-icon ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:window-open-variant");
    expect(standard.shadowRoot.textContent).toContain("Kitchen window");
    expect(standard.shadowRoot.textContent).toContain("2026");

    const alert = await renderCard(tags[2], {
      type: `custom:${tags[2]}`,
      entity: "binary_sensor.window",
      variant: "alert",
      ulm_card_binary_sensor_alert_icon: "mdi:shield-alert",
    });
    expect(alert.shadowRoot.querySelector(".binary-alert-badge")).not.toBeNull();
    expect(alert.shadowRoot.querySelector(".action-surface")?.classList.contains("variant-alert")).toBe(true);

    const helper = await renderCard(tags[5], {
      type: `custom:${tags[5]}`,
      entity: "input_boolean.guest_mode",
      ulm_card_input_boolean_icon: "mdi:account-multiple-check",
      ulm_card_input_boolean_name: "Visitors",
    });
    expect(helper.shadowRoot.querySelector(".ulm-input-boolean")?.classList.contains("is-active")).toBe(true);
    expect((helper.shadowRoot.querySelector(".source-icon ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:account-multiple-check");
    expect(helper.shadowRoot.textContent).toContain("Visitors");
  });

  it("renders cover device-class, position, inversion, controls, slider, favorite, and tilt states", async () => {
    const callService = vi.fn(async () => undefined);
    const card = await renderCard(tags[3], {
      type: `custom:${tags[3]}`,
      entity: "cover.blind",
      ulm_card_cover_enable_controls: true,
      ulm_card_cover_enable_slider: true,
      ulm_card_cover_enable_tilt: true,
      ulm_card_cover_favorite_percentage: 35,
      ulm_card_cover_invert_percent: true,
    }, baseHass(callService));
    expect((card.shadowRoot.querySelector(".source-icon ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:blinds-open");
    expect(card.shadowRoot.textContent).toContain("36%");
    expect(card.shadowRoot.querySelectorAll(".cover-controls .ulm-control")).toHaveLength(7);
    for (const label of ["Close", "Stop", "Open", "Move to 35%", "Close tilt", "Stop tilt", "Open tilt"]) {
      (card.shadowRoot.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement).click();
    }
    const slider = card.shadowRoot.querySelector<HTMLInputElement>('input[aria-label="Cover position"]')!;
    slider.value = "55";
    slider.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    expect(callService.mock.calls).toEqual([
      ["cover", "close_cover", { entity_id: "cover.blind" }],
      ["cover", "stop_cover", { entity_id: "cover.blind" }],
      ["cover", "open_cover", { entity_id: "cover.blind" }],
      ["cover", "set_cover_position", { entity_id: "cover.blind", position: 35 }],
      ["cover", "close_cover_tilt", { entity_id: "cover.blind" }],
      ["cover", "stop_cover_tilt", { entity_id: "cover.blind" }],
      ["cover", "open_cover_tilt", { entity_id: "cover.blind" }],
      ["cover", "set_cover_position", { entity_id: "cover.blind", position: 55 }],
    ]);
  });

  it("renders fan percentage, source attributes, collapse state, slider, and configurable oscillation service", async () => {
    const callService = vi.fn(async () => undefined);
    const card = await renderCard(tags[4], {
      type: `custom:${tags[4]}`,
      entity: "fan.bedroom",
      ulm_card_fan_enable_slider: true,
      ulm_card_fan_enable_button: true,
      ulm_card_fan_temp_attribute: "temperature",
      ulm_card_fan_hum_attribute: "humidity",
      ulm_card_fan_oscillate_attribute: "oscillate",
      ulm_card_fan_button_service: "fan.oscillate",
    }, baseHass(callService));
    expect(card.shadowRoot.textContent).toContain("42% · 22°C · 48%");
    const slider = card.shadowRoot.querySelector<HTMLInputElement>('input[aria-label="Fan speed"]')!;
    slider.value = "65";
    slider.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    (card.shadowRoot.querySelector('button[aria-label="Toggle oscillation"]') as HTMLButtonElement).click();
    expect(callService.mock.calls).toEqual([
      ["fan", "set_percentage", { entity_id: "fan.bedroom", percentage: 65 }],
      ["fan", "oscillate", { entity_id: "fan.bedroom", oscillating: false }],
    ]);

    card.hass = {
      ...baseHass(),
      states: {
        ...states,
        "fan.bedroom": { ...states["fan.bedroom"], state: "off" },
      },
    };
    card.setConfig({
      type: `custom:${tags[4]}`,
      entity: "fan.bedroom",
      ulm_card_fan_enable_slider: true,
      ulm_card_fan_enable_button: true,
      ulm_card_fan_enable_collapse: true,
    });
    await card.updateComplete;
    expect(card.shadowRoot.querySelector(".ulm-fan")?.classList.contains("is-collapsed")).toBe(true);
    expect(card.shadowRoot.querySelector(".ulm-fan-controls")).toBeNull();
  });

  it("tests every card surface tap, hold, double-tap, and keyboard interaction", async () => {
    for (const [index, tag] of tags.entries()) {
      vi.useFakeTimers();
      const entity = [
        "sensor.phone_battery",
        "binary_sensor.window",
        "binary_sensor.window",
        "cover.blind",
        "fan.bedroom",
        "input_boolean.guest_mode",
      ][index];
      const card = await renderCard(tag, {
        type: `custom:${tag}`,
        entity,
        tap_action: { action: "more-info" },
        hold_action: { action: "assist" },
        double_tap_action: { action: "toggle" },
      });
      const actions: string[] = [];
      card.addEventListener("hass-action", (event) =>
        actions.push((event as CustomEvent<{ action: string }>).detail.action));
      const surface = card.shadowRoot.querySelector(".action-surface")!;

      surface.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
      vi.advanceTimersByTime(301);
      surface.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
      vi.advanceTimersByTime(500);
      surface.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
      surface.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
      surface.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
      surface.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 2 }));
      surface.dispatchEvent(new MouseEvent("dblclick", { bubbles: true, detail: 2 }));
      surface.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }));
      vi.advanceTimersByTime(301);
      expect(actions).toEqual(["tap", "hold", "double_tap", "tap"]);
      card.remove();
      vi.useRealTimers();
    }
  });
});
