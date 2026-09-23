import { describe, expect, it, vi } from "vitest";
import { displayName, handleAction, migrateLegacyConfig, normalizeConfig, stateLabel } from "../src/helpers";
import type { AdditionConfig, HassEntity } from "../src/types";

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

  it("normalizes safe defaults", () => {
    expect(normalizeConfig({ type: "x", entity: "light.kitchen" })).toMatchObject({
      show_icon: true,
      name_mode: "entity",
      icon_type: "icon",
      layout: "default",
      fill_container: false,
      primary_info: "name",
      secondary_info: "default",
      show_state: true,
      tap_action: { action: "more-info" },
    });
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
    expect(normalizeConfig({
      type: "x",
      ulm_card_weather_entity: "weather.home",
    })).toMatchObject({ entity: "weather.home" });
  });

  it("migrates named upstream waste entities into ordered semantic streams", () => {
    const normalized = normalizeConfig({
      type: "custom:mushroom-addition-custom-card-afvalophaling",
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

  it("migrates documented Nik NAS and Tablet variables into semantic fields", () => {
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-nik-nas",
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
      type: "custom:mushroom-addition-custom-card-nik-tablet",
      ulm_custom_card_nik_tablet_main: "binary_sensor.tablet",
      ulm_custom_card_nik_tablet_battery: "sensor.tablet_battery",
      ulm_custom_card_nik_tablet_button1: "switch.tablet_usb",
      ulm_custom_card_nik_tablet_button2: "switch.tablet_motion",
      ulm_custom_card_nik_tablet_button3: "light.tablet_display",
      ulm_custom_card_nik_tablet_restart: "button.tablet_restart",
      ulm_custom_card_nik_tablet_reload: "button.tablet_reload",
      ulm_custom_card_nik_tablet_maintenance: "switch.tablet_maintenance",
      ulm_custom_card_nik_tablet_par1: "sensor.tablet_ram",
      ulm_custom_card_nik_tablet_par2: "sensor.tablet_disk",
      ulm_custom_card_nik_tablet_par3: "binary_sensor.tablet_power",
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

  it("defaults navigation cards to a native navigate action", () => {
    expect(normalizeConfig({
      type: "custom:mushroom-addition-card-navigate",
      navigation_path: "/lovelace/upstairs",
    }).tap_action).toEqual({
      action: "navigate",
      navigation_path: "/lovelace/upstairs",
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
