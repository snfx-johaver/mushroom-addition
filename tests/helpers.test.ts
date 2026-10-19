import { describe, expect, it, vi } from "vitest";
import { displayName, handleAction, migrateLegacyConfig, normalizeConfig, stateLabel } from "../src/helpers";
import type { AdditionConfig, EntityNameItem, HassEntity, HomeAssistant } from "../src/types";

const entity: HassEntity = {
  entity_id: "sensor.power",
  state: "42",
  attributes: { friendly_name: "Power", unit_of_measurement: "W" },
};

describe("shared card behavior", () => {
  it("formats state and friendly names", () => {
    expect(stateLabel(entity)).toBe("42 W");
    expect(displayName({ type: "x" }, entity)).toBe("Power");
    expect(displayName({ type: "x", name_mode: "entity", name: "Ignored" }, entity)).toBe("Power");
    expect(displayName({ type: "x", name_mode: "custom", name: "Custom power" }, entity)).toBe("Custom power");
    expect(displayName({ type: "x", name_mode: "none" }, entity)).toBe("");
  });

  it("renders names composed by Home Assistant's entity name selector", () => {
    const formatEntityName = vi.fn(() => "Kitchen Power");
    const hass = {
      states: {},
      callService: vi.fn(),
      formatEntityName,
    } as HomeAssistant;
    const name = [{ type: "area" as const }, { type: "entity" as const }];
    expect(displayName({ type: "x", name }, entity, hass)).toBe("Kitchen Power");
    expect(formatEntityName).toHaveBeenCalledWith(entity, name);
  });

  it("lets the Mushroom Name picker override stale legacy name modes", () => {
    const formatEntityName = vi.fn((_entity: HassEntity, name?: string | EntityNameItem | EntityNameItem[]) => {
      const items = Array.isArray(name) ? name : [name];
      return items.map((item) => typeof item === "string" ? item : item?.text ?? "Kitchen").join(" ");
    });
    const hass = {
      states: {},
      callService: vi.fn(),
      formatEntityName,
    } as HomeAssistant;
    const name = [{ type: "text" as const, text: "Joris" }, { type: "area" as const }];
    expect(displayName({ type: "x", name_mode: "entity", name }, entity, hass)).toBe("Joris Kitchen");
    expect(displayName({
      type: "x",
      name_mode: "none",
      name: { type: "text", text: "Waste schedule" },
    }, entity, hass)).toBe("Waste schedule");
    const normalized = normalizeConfig({
      type: "custom:mushroom-addition-custom-card-trash",
      entity: "sensor.power",
      name_mode: "entity",
      name: "Waste schedule",
      primary_info: "name",
      secondary_info: "default",
    });
    expect(normalized.name_mode).toBeUndefined();
    expect(displayName(normalized, entity, hass)).toBe("Waste schedule");
  });

  it("renders a custom entity-name value even when a card has no primary entity", () => {
    expect(displayName({
      type: "x",
      name: { type: "text", text: "Waste schedule" },
    })).toBe("Waste schedule");
    expect(displayName({
      type: "x",
      name: [{ type: "text", text: "Waste" }, { type: "text", text: "schedule" }],
    })).toBe("Waste schedule");
  });

  it("normalizes safe defaults", () => {
    expect(normalizeConfig({ type: "x", entity: "light.kitchen" })).toMatchObject({
      show_icon: true,
      icon_type: "icon",
      layout: "default",
      fill_container: false,
      show_state: true,
      tap_action: { action: "more-info" },
    });
    expect(normalizeConfig({ type: "x", entity: "light.kitchen" }).primary_info).toBeUndefined();
    expect(normalizeConfig({ type: "x", entity: "light.kitchen" }).secondary_info).toBeUndefined();
    expect(normalizeConfig({ type: "x", entity: "light.kitchen" }).name_mode).toBeUndefined();
  });

  it("lets Icon type override legacy icon visibility and picture settings", () => {
    expect(normalizeConfig({
      type: "x",
      show_icon: false,
      icon_type: "icon",
    }).icon_type).toBe("icon");
  });

  it("migrates legacy primary entity fields without retaining duplicates", () => {
    expect(migrateLegacyConfig({
      type: "x",
      primary_entity: "weather.home",
    })).toMatchObject({
      type: "x",
      entity: "weather.home",
      primary_entity: undefined,
    });
  });

  it("migrates named upstream waste entities into ordered semantic streams", () => {
    const normalized = normalizeConfig({
      type: "custom:mushroom-addition-custom-card-trash",
      ulm_card_datum_gft: "sensor.gft",
      ulm_card_datum_pmd: "sensor.pbd",
      ulm_card_datum_rest: "sensor.rest",
      ulm_card_datum_papier: "sensor.paper",
      ulm_card_ophaling_vandaag: "sensor.today",
      ulm_card_ophaling_morgen: "sensor.tomorrow",
    });

    expect(normalized.waste_streams?.slice(0, 5)).toMatchObject([
      { preset: "residual", entity: "sensor.rest", enabled: true },
      { preset: "paper", entity: "sensor.paper", enabled: true },
      { preset: "packaging", entity: "sensor.pbd", enabled: true },
      { preset: "organic", entity: "sensor.gft", enabled: true },
      { preset: "glass", entity: undefined },
    ]);
    expect(normalized).toMatchObject({
      today_entity: "sensor.today",
      tomorrow_entity: "sensor.tomorrow",
      show_today: true,
      show_tomorrow: true,
    });
  });

  it("migrates documented NAS and Tablet variables into semantic fields", () => {
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-nas-metrics",
      entity: "switch.nas",
      entity_1: { entity_id: "sensor.nas_temp", max_value: 80 },
      entity_2: { entity_id: "sensor.nas_memory" },
      entity_3: { entity_id: "sensor.nas_cpu" },
      entity_4: { entity_id: "sensor.nas_disk" },
    })).toMatchObject({
      entity: "switch.nas",
      temperature_entity: "sensor.nas_temp",
      memory_entity: "sensor.nas_memory",
      cpu_entity: "sensor.nas_cpu",
      disk_entity: "sensor.nas_disk",
    });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-tablet",
      ulm_custom_card_tablet_main: "binary_sensor.tablet",
      ulm_custom_card_tablet_battery: "sensor.tablet_battery",
      ulm_custom_card_tablet_button1: "switch.tablet_usb",
      ulm_custom_card_tablet_button2: "switch.tablet_motion",
      ulm_custom_card_tablet_button3: "light.tablet_display",
      ulm_custom_card_tablet_restart: "button.tablet_restart",
      ulm_custom_card_tablet_reload: "button.tablet_reload",
      ulm_custom_card_tablet_maintenance: "switch.tablet_maintenance",
      ulm_custom_card_tablet_par1: "sensor.tablet_ram",
      ulm_custom_card_tablet_par2: "sensor.tablet_disk",
      ulm_custom_card_tablet_par3: "binary_sensor.tablet_power",
    })).toMatchObject({
      entity: "binary_sensor.tablet",
      battery_entity: "sensor.tablet_battery",
      tablet_button_usb_entity: "switch.tablet_usb",
      tablet_button_motion_entity: "switch.tablet_motion",
      tablet_button_display_entity: "light.tablet_display",
      tablet_restart_entity: "button.tablet_restart",
      tablet_reload_entity: "button.tablet_reload",
      tablet_maintenance_entity: "switch.tablet_maintenance",
      tablet_ram_entity: "sensor.tablet_ram",
      tablet_disk_entity: "sensor.tablet_disk",
      tablet_power_entity: "binary_sensor.tablet_power",
    });
  });

    it("dispatches native Home Assistant actions without dropping modern fields", () => {
    const node = document.createElement("div");
    const listener = vi.fn();
    node.addEventListener("hass-action", listener);
    const config: AdditionConfig = {
      type: "x",
      entity: "light.kitchen",
      tap_action: {
        action: "perform-action",
        perform_action: "light.turn_on",
        target: { entity_id: "light.kitchen" },
        data: { brightness_pct: 50 },
        confirmation: { text: "Continue?" },
      },
    };
    handleAction(node, config, "tap");
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({ config, action: "tap" });
  });

  it.each(["more-info", "toggle", "navigate", "url", "perform-action", "assist", "none"] as const)(
    "supports the %s action",
    (action) => expect(action satisfies NonNullable<AdditionConfig["tap_action"]>["action"]).toBe(action),
  );
});
