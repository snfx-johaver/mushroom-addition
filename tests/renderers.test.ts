import { describe, expect, it, vi } from "vitest";
import { CATALOG } from "../src/catalog";
import "../src/index";
import { PARITY_ENTRIES } from "../src/parity.generated";
import type { AdditionConfig, HomeAssistant } from "../src/types";

const hass: HomeAssistant = {
  states: {
    "weather.home": {
      entity_id: "weather.home",
      state: "partlycloudy",
      attributes: {
        friendly_name: "Home",
        temperature: 17,
        temperature_unit: "°C",
        humidity: 68,
      },
    },
    "climate.living": {
      entity_id: "climate.living",
      state: "heat",
      attributes: { friendly_name: "Living room", current_temperature: 19, temperature: 21 },
    },
    "light.kitchen": {
      entity_id: "light.kitchen",
      state: "on",
      attributes: { friendly_name: "Kitchen", brightness: 153 },
    },
    "person.joris": {
      entity_id: "person.joris",
      state: "home",
      attributes: { friendly_name: "Joris", entity_picture: "/local/joris.jpg" },
    },
    "sensor.battery": {
      entity_id: "sensor.battery",
      state: "72",
      attributes: { friendly_name: "Phone battery", unit_of_measurement: "%" },
    },
    "sensor.person_address": {
      entity_id: "sensor.person_address",
      state: "Home",
      attributes: { friendly_name: "Person address" },
    },
    "sensor.commute": {
      entity_id: "sensor.commute",
      state: "24",
      attributes: { friendly_name: "Commute", unit_of_measurement: "min" },
    },
    "binary_sensor.driving": {
      entity_id: "binary_sensor.driving",
      state: "off",
      attributes: { friendly_name: "Driving" },
    },
    "sensor.power": {
      entity_id: "sensor.power",
      state: "843",
      attributes: { friendly_name: "Home power", unit_of_measurement: "W" },
    },
    "sensor.memory": {
      entity_id: "sensor.memory",
      state: "17.7",
      attributes: { friendly_name: "Memory Usage", unit_of_measurement: "%" },
    },
    "sensor.unknown": {
      entity_id: "sensor.unknown",
      state: "unknown",
      attributes: { friendly_name: "Unknown schedule" },
    },
    "sensor.today": {
      entity_id: "sensor.today",
      state: "residual waste",
      attributes: { friendly_name: "Trash type today" },
    },
    "sensor.tomorrow": {
      entity_id: "sensor.tomorrow",
      state: "paper",
      attributes: { friendly_name: "Trash type tomorrow" },
    },
    "sensor.none": {
      entity_id: "sensor.none",
      state: "geen",
      attributes: { friendly_name: "No collection" },
    },
    "sensor.cleared": {
      entity_id: "sensor.cleared",
      state: "cleared",
      attributes: { friendly_name: "Cleared collection" },
    },
    "media_player.tv": {
      entity_id: "media_player.tv",
      state: "playing",
      attributes: { friendly_name: "TV", media_title: "Movie" },
    },
    "cover.blind": { entity_id: "cover.blind", state: "open", attributes: { friendly_name: "Blind" } },
    "binary_sensor.window": { entity_id: "binary_sensor.window", state: "on", attributes: { friendly_name: "Window" } },
    "fan.fixture": { entity_id: "fan.fixture", state: "on", attributes: { friendly_name: "Fan", percentage: 42 } },
    "vacuum.robot": { entity_id: "vacuum.robot", state: "cleaning", attributes: { friendly_name: "Robot", battery_level: 80 } },
    "alarm_control_panel.home": { entity_id: "alarm_control_panel.home", state: "armed_home", attributes: { friendly_name: "Alarm" } },
    "scene.relax": { entity_id: "scene.relax", state: "scening", attributes: { friendly_name: "Relax" } },
    "update.core": {
      entity_id: "update.core",
      state: "on",
      attributes: { friendly_name: "Core", installed_version: "2026.8", latest_version: "2026.9" },
    },
    "update.supervisor": {
      entity_id: "update.supervisor",
      state: "off",
      attributes: { friendly_name: "Supervisor", installed_version: "2026.9" },
    },
    "update.operating_system": {
      entity_id: "update.operating_system",
      state: "off",
      attributes: { friendly_name: "OS", installed_version: "17.0" },
    },
    "binary_sensor.nas": { entity_id: "binary_sensor.nas", state: "on", attributes: { friendly_name: "HN-NAS" } },
    "sensor.nas_disk": { entity_id: "sensor.nas_disk", state: "25.5", attributes: { friendly_name: "Disk", unit_of_measurement: "%" } },
    "sensor.nas_temp": { entity_id: "sensor.nas_temp", state: "46", attributes: { friendly_name: "Temp", unit_of_measurement: "°C" } },
    "sensor.nas_memory": { entity_id: "sensor.nas_memory", state: "15", attributes: { friendly_name: "Memory", unit_of_measurement: "%" } },
    "sensor.nas_cpu": { entity_id: "sensor.nas_cpu", state: "19.3", attributes: { friendly_name: "CPU", unit_of_measurement: "%" } },
    "binary_sensor.tablet": { entity_id: "binary_sensor.tablet", state: "on", attributes: { friendly_name: "Bram Tablet" } },
    "switch.tablet_usb": { entity_id: "switch.tablet_usb", state: "on", attributes: { friendly_name: "USB" } },
    "switch.tablet_motion": { entity_id: "switch.tablet_motion", state: "on", attributes: { friendly_name: "Motion" } },
    "switch.tablet_display": { entity_id: "switch.tablet_display", state: "on", attributes: { friendly_name: "Display" } },
    "button.tablet_restart": { entity_id: "button.tablet_restart", state: "unknown", attributes: { friendly_name: "Restart" } },
    "switch.tablet_maintenance": { entity_id: "switch.tablet_maintenance", state: "off", attributes: { friendly_name: "Maintenance" } },
    "button.tablet_reload": { entity_id: "button.tablet_reload", state: "unknown", attributes: { friendly_name: "Reload" } },
    "sensor.tablet_ram": { entity_id: "sensor.tablet_ram", state: "747.7", attributes: { friendly_name: "RAM", unit_of_measurement: "MB" } },
    "sensor.tablet_disk": { entity_id: "sensor.tablet_disk", state: "17829.9", attributes: { friendly_name: "Disk", unit_of_measurement: "MB" } },
    "binary_sensor.tablet_power": { entity_id: "binary_sensor.tablet_power", state: "off", attributes: { friendly_name: "Power" } },
    "sensor.tablet_battery": { entity_id: "sensor.tablet_battery", state: "91", attributes: { friendly_name: "Battery", unit_of_measurement: "%" } },
  },
  callService: async () => undefined,
  connection: {
    sendMessagePromise: async <T>() => undefined as T,
    subscribeMessage: async <T>(callback: (message: T) => void) => {
      callback({
        forecast: [
          { condition: "sunny", temperature: 20, templow: 12 },
          { condition: "rainy", temperature: 15, templow: 10 },
        ],
      } as T);
      return () => undefined;
    },
  },
};

const render = async (tag: string, config: AdditionConfig): Promise<string> => {
  const element = document.createElement(tag) as HTMLElement & {
    hass: HomeAssistant;
    setConfig(config: AdditionConfig): void;
    updateComplete: Promise<boolean>;
  };
  element.hass = hass;
  element.setConfig(config);
  document.body.append(element);
  await element.updateComplete;
  await Promise.resolve();
  await element.updateComplete;
  const markup = element.shadowRoot?.innerHTML ?? "";
  element.remove();
  return markup;
};

const familySignature = (markup: string): string[] =>
  [...markup.matchAll(/class="([^"]*ulm-[^"]*)"/g)]
    .flatMap((match) => match[1].split(" "))
    .filter((className) => className.startsWith("ulm-"))
    .filter((className, index, all) => all.indexOf(className) === index);

describe("family renderers", () => {
  it("renders the Minimalist weather hierarchy and details", async () => {
    const markup = await render("mushroom-addition-card-weather", {
      type: "custom:mushroom-addition-card-weather",
      entity: "weather.home",
      show_forecast: true,
    });
    expect(markup).toContain("ulm-weather");
    expect(markup).toContain("detailed-weather-main");
    expect(markup).toContain("detailed-weather-details");
    expect(markup).toContain("17");
    expect(markup).toContain("partlycloudy");
    expect((document.createElement("mushroom-addition-card-weather") as HTMLElement).tagName).toBe("MUSHROOM-ADDITION-CARD-WEATHER");
  });

  it("rerenders when Home Assistant updates an existing card config", async () => {
    const element = document.createElement("mushroom-addition-card-light") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
      shadowRoot: ShadowRoot;
    };
    element.hass = hass;
    element.setConfig({ type: "custom:mushroom-addition-card-light", entity: "light.kitchen", name: "First" });
    document.body.append(element);
    await element.updateComplete;
    element.setConfig({ type: "custom:mushroom-addition-card-light", entity: "light.kitchen", name: "Updated" });
    await element.updateComplete;
    expect(element.shadowRoot.textContent).toContain("Updated");
    element.remove();
  });

  it("applies Mushroom-style layout, fill, icon, and information choices", async () => {
    const markup = await render("mushroom-addition-card-light", {
      type: "custom:mushroom-addition-card-light",
      entity: "light.kitchen",
      layout: "vertical",
      fill_container: true,
      icon_type: "none",
      primary_info: "state",
      secondary_info: "none",
    });
    expect(markup).toContain("layout-vertical");
    expect(markup).toContain("fill-container");
    expect(markup).not.toContain("light-icon");
    expect(markup).toContain("on");
    expect(markup).not.toContain("Kitchen");
  });

  it("normalizes hidden legacy tags to their unified component variant", async () => {
    const markup = await render("mushroom-addition-custom-card-person-info-small", {
      type: "custom:mushroom-addition-custom-card-person-info-small",
      entity: "person.joris",
    });
    expect(markup).toContain("variant-small");
    expect(markup).toContain("is-compact");
  });

  it("renders source-specific full and small Person Info compositions", async () => {
    const config = {
      entity: "person.joris",
      ulm_card_person_use_entity_picture: true,
      ulm_card_person_battery_entity: "sensor.battery",
      ulm_card_person_driving_entity: "binary_sensor.driving",
      ulm_address: "sensor.person_address",
    };
    const full = await render("mushroom-addition-custom-card-person-info", {
      type: "custom:mushroom-addition-custom-card-person-info",
      ...config,
      ulm_card_person_commute_entity: "sensor.commute",
    });
    const small = await render("mushroom-addition-custom-card-person-info-small", {
      type: "custom:mushroom-addition-custom-card-person-info-small",
      ...config,
    });
    expect(full).toContain("custom-person-info");
    expect(full).toContain("person-info-details");
    expect(full).toContain("24 min");
    expect(small).toContain("custom-person-info-small");
    expect(small).toContain("person-info-small-battery");
    expect(small).toContain("Home");
    expect(small).not.toContain("person-info-details");
  });

  it("uses the battery entity for the small Person Info default hold action", async () => {
    const element = document.createElement("mushroom-addition-custom-card-person-info-small") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
      shadowRoot: ShadowRoot;
    };
    element.hass = hass;
    element.setConfig({
      type: "custom:mushroom-addition-custom-card-person-info-small",
      entity: "person.joris",
      ulm_card_person_battery_entity: "sensor.battery",
    });
    document.body.append(element);
    await element.updateComplete;
    const action = vi.fn();
    element.addEventListener("hass-action", action);
    const surface = element.shadowRoot.querySelector(".action-surface") as HTMLElement;
    surface.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await new Promise((resolve) => window.setTimeout(resolve, 525));
    surface.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    expect(action).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({
        action: "hold",
        config: expect.objectContaining({ entity: "sensor.battery" }),
      }),
    }));
    element.remove();
  });

  it("renders detailed and native weather variants distinctly", async () => {
    const detailed = await render("mushroom-addition-card-weather", {
      type: "custom:mushroom-addition-card-weather",
      entity: "weather.home",
      variant: "detailed",
      show_forecast: true,
    });
    const native = await render("mushroom-addition-card-weather", {
      type: "custom:mushroom-addition-card-weather",
      entity: "weather.home",
      variant: "native",
      show_forecast: true,
    });
    expect(detailed).toContain("detailed-weather");
    expect(detailed).toContain("detailed-weather-main");
    expect(detailed).toContain("detailed-weather-details");
    expect(native).toContain("weather-metrics");
    expect(native).toContain("native-weather");
  });

  it("renders Bar Card as a compact header and 35px progress bar without graph regions", async () => {
    const markup = await render("mushroom-addition-custom-card-bar-card", {
      type: "custom:mushroom-addition-custom-card-bar-card",
      entity: "sensor.memory",
      ulm_custom_card_bar_card_name: "Memory Usage",
      ulm_custom_card_bar_card_min: 0,
      ulm_custom_card_bar_card_max: 100,
      ulm_custom_card_bar_card_value: true,
      ulm_custom_card_bar_card_color: "#81c995",
      ulm_custom_card_bar_card_icon: "mdi:memory",
    });
    expect(markup).toContain("minimalist-bar-card");
    expect(markup).toContain("bar-card-header");
    expect(markup).toContain("bar-card-icon");
    expect(markup).toContain("bar-card-primary-value");
    expect(markup).toContain("bar-card-name");
    expect(markup).toContain("bar-card-track");
    expect(markup).toContain("bar-card-fill");
    expect(markup).toContain("bar-card-inside-value");
    expect(markup).toContain("width:17.7%");
    expect(markup).not.toContain("sparkline");
    expect(markup).not.toContain("metric-extremes");
    expect(markup).not.toContain("ulm-metric");
  });

  it.each([
    ["card_battery", "mushroom-addition-card-battery", "sensor.battery", "ulm-default-battery", "battery-track"],
    ["card_binary_sensor", "mushroom-addition-card-binary-sensor", "binary_sensor.window", "ulm-binary", "sparkline"],
    ["card_binary_sensor_alert", "mushroom-addition-card-binary-sensor-alert", "binary_sensor.window", "variant-alert", "sparkline"],
    ["card_cover", "mushroom-addition-card-cover", "cover.blind", "ulm-cover", "sparkline"],
    ["card_fan", "mushroom-addition-card-fan", "fan.fixture", "ulm-fan", "sparkline"],
    ["card_generic", "mushroom-addition-card-generic", "sensor.power", "value-first", "sparkline"],
    ["card_generic_swap", "mushroom-addition-card-generic-swap", "sensor.power", "ulm-generic-swap", "sparkline"],
    ["card_graph", "mushroom-addition-card-graph", "sensor.power", "ulm-default-graph", "ulm-light-slider"],
    ["card_input_boolean", "mushroom-addition-card-input-boolean", "sensor.power", "ulm-simple-default", "sparkline"],
    ["card_light", "mushroom-addition-card-light", "light.kitchen", "ulm-light-card", "sparkline"],
    ["card_media_player", "mushroom-addition-card-media-player", "media_player.tv", "ulm-media", "sparkline"],
    ["card_navigate", "mushroom-addition-card-navigate", "sensor.power", "ulm-default-navigation", "sparkline"],
    ["card_person", "mushroom-addition-card-person", "person.joris", "ulm-person", "sparkline"],
    ["card_power_outlet", "mushroom-addition-card-power-outlet", "sensor.power", "ulm-source-power-outlet", "sparkline"],
    ["card_room", "mushroom-addition-card-room", "light.kitchen", "ulm-room", "sparkline"],
    ["card_scenes", "mushroom-addition-card-scenes", "scene.relax", "scene-pills", "sparkline"],
    ["card_script", "mushroom-addition-card-script", "sensor.power", "ulm-source-script", "sparkline"],
    ["card_thermostat", "mushroom-addition-card-thermostat", "climate.living", "ulm-climate", "sparkline"],
    ["card_title", "mushroom-addition-card-title", "sensor.power", "ulm-title", "ulm-icon"],
    ["card_vacuum", "mushroom-addition-card-vacuum", "vacuum.robot", "ulm-default-vacuum", "sparkline"],
    ["card_vertical_button", "mushroom-addition-card-vertical-button", "light.kitchen", "ulm-vertical-button", "sparkline"],
    ["card_weather", "mushroom-addition-card-weather", "weather.home", "detailed-weather", "ulm-light-slider"],
    ["card_weather_ulm", "mushroom-addition-card-weather-ulm", "weather.home", "weather-metrics", "detailed-weather"],
    ["card_welcome_scenes", "mushroom-addition-card-welcome-scenes", "scene.relax", "welcome-scenes", "sparkline"],
  ])("enforces the %s visual structure", async (_id, tag, entity, required, forbidden) => {
    const markup = await render(tag, {
      type: `custom:${tag}`,
      entity,
      entities: entity.startsWith("scene.") ? ["scene.relax"] : undefined,
      show_controls: true,
      ulm_card_fan_enable_slider: true,
      ulm_card_light_enable_slider: true,
    });
    expect(markup).toContain(required);
    expect(markup).not.toContain(forbidden);
  });

  it("wires the Minimalist light slider to a valid Home Assistant service", async () => {
    const callService = vi.fn(async () => undefined);
    const element = document.createElement("mushroom-addition-card-light") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
      shadowRoot: ShadowRoot;
    };
    element.hass = { ...hass, callService };
    element.setConfig({
      type: "custom:mushroom-addition-card-light",
      entity: "light.kitchen",
      ulm_card_light_enable_slider: true,
    });
    document.body.append(element);
    await element.updateComplete;
    const slider = element.shadowRoot.querySelector<HTMLInputElement>(".ulm-light-slider input")!;
    slider.value = "50";
    slider.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    expect(callService).toHaveBeenCalledWith("light", "turn_on", {
      entity_id: "light.kitchen",
      brightness_pct: 50,
    });
    element.remove();
  });

  it("executes every Heat Pump control with exact climate service payloads", async () => {
      const callService = vi.fn(async () => undefined);
      const element = document.createElement("mushroom-addition-custom-card-heat-pump") as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
        shadowRoot: ShadowRoot;
      };
      element.hass = {
        ...hass,
        callService,
        states: {
          ...hass.states,
          "climate.living": {
            ...hass.states["climate.living"],
            attributes: {
              ...hass.states["climate.living"].attributes,
              hvac_modes: ["off", "heat", "cool", "heat_cool", "dry", "fan_only"],
              fan_modes: ["auto", "high"],
              target_temp_step: 0.5,
            },
          },
        },
      };
      element.setConfig({ type: "custom:mushroom-addition-custom-card-heat-pump", entity: "climate.living" });
      document.body.append(element);
      await element.updateComplete;

      const click = async (label: string) => {
        (element.shadowRoot.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement).click();
        await Promise.resolve();
      };
      await click("Decrease target temperature");
      await click("Increase target temperature");
      await click("Turn off");
      await click("Heat mode");
      await click("Cool mode");
      await click("Automatic mode");
      await click("Dry mode");
      await click("Fan mode");

      expect(callService.mock.calls).toEqual([
        ["climate", "set_temperature", { entity_id: "climate.living", temperature: 20.5 }],
        ["climate", "set_temperature", { entity_id: "climate.living", temperature: 21.5 }],
        ["climate", "set_hvac_mode", { entity_id: "climate.living", hvac_mode: "off" }],
        ["climate", "set_hvac_mode", { entity_id: "climate.living", hvac_mode: "heat" }],
        ["climate", "set_hvac_mode", { entity_id: "climate.living", hvac_mode: "cool" }],
        ["climate", "set_hvac_mode", { entity_id: "climate.living", hvac_mode: "heat_cool" }],
        ["climate", "set_hvac_mode", { entity_id: "climate.living", hvac_mode: "dry" }],
        ["climate", "set_hvac_mode", { entity_id: "climate.living", hvac_mode: "fan_only" }],
      ]);
      element.remove();
  });

  it("disables unsupported Heat Pump modes and uses set_fan_mode when only fan modes exist", async () => {
      const callService = vi.fn(async () => undefined);
      const element = document.createElement("mushroom-addition-custom-card-heat-pump") as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
        shadowRoot: ShadowRoot;
      };
      element.hass = {
        ...hass,
        callService,
        states: {
          ...hass.states,
          "climate.living": {
            ...hass.states["climate.living"],
            attributes: {
              ...hass.states["climate.living"].attributes,
              hvac_modes: ["off", "heat"],
              fan_modes: ["auto"],
            },
          },
        },
      };
      element.setConfig({ type: "custom:mushroom-addition-custom-card-heat-pump", entity: "climate.living" });
      document.body.append(element);
      await element.updateComplete;
      expect((element.shadowRoot.querySelector('button[aria-label="Cool mode"]') as HTMLButtonElement).disabled).toBe(true);
      expect((element.shadowRoot.querySelector('button[aria-label="Automatic mode"]') as HTMLButtonElement).disabled).toBe(true);
      expect((element.shadowRoot.querySelector('button[aria-label="Dry mode"]') as HTMLButtonElement).disabled).toBe(true);
      (element.shadowRoot.querySelector('button[aria-label="Fan mode"]') as HTMLButtonElement).click();
      expect(callService).toHaveBeenCalledWith("climate", "set_fan_mode", {
        entity_id: "climate.living",
        fan_mode: "auto",
      });
      element.remove();
  });

  it("executes all Home Assistant Updates controls without triggering the card action", async () => {
      const element = document.createElement("mushroom-addition-custom-card-homeassistant-updates") as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
        shadowRoot: ShadowRoot;
      };
      element.hass = hass;
      element.setConfig({
        type: "custom:mushroom-addition-custom-card-homeassistant-updates",
        entity: "update.core",
        ulm_card_homeassistant_core: "update.core",
        ulm_card_homeassistant_supervisor: "update.supervisor",
        ulm_card_homeassistant_os: "update.operating_system",
      });
      const actions: Array<{ config: AdditionConfig; action: string }> = [];
      element.addEventListener("hass-action", (event) => {
        actions.push((event as CustomEvent).detail);
      });
      document.body.append(element);
      await element.updateComplete;
      for (const label of ["Open Home Assistant release notes", "Open update settings", "Open available update"]) {
        (element.shadowRoot.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement).click();
      }
      expect(actions).toEqual([
        {
          action: "tap",
          config: {
            type: "custom:mushroom-addition-custom-card-homeassistant-updates",
            entity: "update.core",
            tap_action: { action: "url", url_path: "https://www.home-assistant.io/latest-release-notes/" },
          },
        },
        {
          action: "tap",
          config: {
            type: "custom:mushroom-addition-custom-card-homeassistant-updates",
            entity: "update.core",
            tap_action: { action: "navigate", navigation_path: "/config/updates" },
          },
        },
        {
          action: "tap",
          config: {
            type: "custom:mushroom-addition-custom-card-homeassistant-updates",
            entity: "update.core",
            tap_action: { action: "more-info" },
          },
        },
      ]);
      element.remove();
  });

  it("disables update details when every configured update entity is unavailable", async () => {
      const element = document.createElement("mushroom-addition-custom-card-homeassistant-updates") as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
        shadowRoot: ShadowRoot;
      };
      const unavailable = {
        entity_id: "update.unavailable",
        state: "unavailable",
        attributes: { friendly_name: "Unavailable update" },
      };
      element.hass = { ...hass, states: { "update.unavailable": unavailable } };
      element.setConfig({
        type: "custom:mushroom-addition-custom-card-homeassistant-updates",
        entity: "update.unavailable",
        ulm_card_homeassistant_core: "update.unavailable",
        ulm_card_homeassistant_supervisor: "update.unavailable",
        ulm_card_homeassistant_os: "update.unavailable",
      });
      document.body.append(element);
      await element.updateComplete;
      expect((element.shadowRoot.querySelector('button[aria-label="Open available update"]') as HTMLButtonElement).disabled).toBe(true);
      element.remove();
  });

  it("renders the dedicated Nik NAS tiles, semantic metrics, and three radial rings", async () => {
      const markup = await render("mushroom-addition-custom-card-nik-nas", {
        type: "custom:mushroom-addition-custom-card-nik-nas",
        entity: "binary_sensor.nas",
        disk_entity: "sensor.nas_disk",
        temperature_entity: "sensor.nas_temp",
        memory_entity: "sensor.nas_memory",
        cpu_entity: "sensor.nas_cpu",
      });
      expect(markup).toContain("nik-nas-top");
      expect(markup).toContain("status-tile");
      expect(markup).toContain("disk-tile");
      expect(markup).toContain("nik-nas-metrics");
      expect(markup).toContain("nik-nas-rings");
      expect(markup.match(/nik-nas-ring-value/g)).toHaveLength(3);
      expect(markup).not.toContain("nik-nas-chart");
      expect(markup).not.toContain("metric-1");
  });

  it("opens NAS status more-info without firing the outer card action", async () => {
      const element = document.createElement("mushroom-addition-custom-card-nik-nas") as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
        shadowRoot: ShadowRoot;
      };
      element.hass = hass;
      element.setConfig({ type: "custom:mushroom-addition-custom-card-nik-nas", entity: "binary_sensor.nas" });
      const actions: unknown[] = [];
      element.addEventListener("hass-action", (event) => actions.push((event as CustomEvent).detail));
      document.body.append(element);
      await element.updateComplete;
      (element.shadowRoot.querySelector('button[aria-label="Open NAS status"]') as HTMLButtonElement).click();
      expect(actions).toEqual([{
        action: "tap",
        config: {
          type: "custom:mushroom-addition-custom-card-nik-nas",
          entity: "binary_sensor.nas",
          tap_action: { action: "more-info" },
        },
      }]);
      element.remove();
  });

  it("renders and executes all six semantic Nik Tablet controls", async () => {
      const callService = vi.fn(async () => undefined);
      const element = document.createElement("mushroom-addition-custom-card-nik-tablet") as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
        shadowRoot: ShadowRoot;
      };
      element.hass = { ...hass, callService };
      element.setConfig({
        type: "custom:mushroom-addition-custom-card-nik-tablet",
        entity: "binary_sensor.tablet",
        tablet_button_usb_entity: "switch.tablet_usb",
        tablet_button_motion_entity: "switch.tablet_motion",
        tablet_button_display_entity: "switch.tablet_display",
        tablet_restart_entity: "button.tablet_restart",
        tablet_maintenance_entity: "switch.tablet_maintenance",
        tablet_reload_entity: "button.tablet_reload",
        tablet_ram_entity: "sensor.tablet_ram",
        tablet_disk_entity: "sensor.tablet_disk",
        tablet_power_entity: "binary_sensor.tablet_power",
        battery_entity: "sensor.tablet_battery",
      });
      document.body.append(element);
      await element.updateComplete;
      expect(element.shadowRoot.querySelectorAll(".nik-tablet-controls button")).toHaveLength(6);
      expect(element.shadowRoot.querySelectorAll(".nik-tablet-metrics > span")).toHaveLength(3);
      for (const label of [
        "Toggle USB", "Toggle motion", "Toggle display", "Restart tablet", "Toggle maintenance mode", "Reload tablet",
      ]) {
        (element.shadowRoot.querySelector(`button[aria-label="${label}"]`) as HTMLButtonElement).click();
      }
      expect(callService.mock.calls).toEqual([
        ["homeassistant", "toggle", { entity_id: "switch.tablet_usb" }],
        ["homeassistant", "toggle", { entity_id: "switch.tablet_motion" }],
        ["homeassistant", "toggle", { entity_id: "switch.tablet_display" }],
        ["button", "press", { entity_id: "button.tablet_restart" }],
        ["homeassistant", "toggle", { entity_id: "switch.tablet_maintenance" }],
        ["button", "press", { entity_id: "button.tablet_reload" }],
      ]);
      element.remove();
  });

  it("does not render service controls for incompatible entity domains", async () => {
    const markup = await render("mushroom-addition-card-cover", {
      type: "custom:mushroom-addition-card-cover",
      entity: "sensor.power",
      show_controls: true,
      ulm_card_cover_enable_slider: true,
    });
    expect(markup).not.toContain("ulm-control");
    expect(markup).not.toContain("ulm-light-slider");
  });

  it.each([
    ["climate", "mushroom-addition-card-thermostat", "climate.living", "ulm-climate"],
    ["light", "mushroom-addition-card-light", "light.kitchen", "ulm-light"],
    ["scene", "mushroom-addition-card-scenes", "scene.relax", "scene-grid"],
    ["person", "mushroom-addition-card-person", "person.joris", "ulm-person"],
    ["battery", "mushroom-addition-card-battery", "sensor.battery", "ulm-default-battery"],
    ["energy", "mushroom-addition-card-graph", "sensor.power", "sparkline"],
    ["media", "mushroom-addition-card-media-player", "media_player.tv", "ulm-media"],
    ["cover", "mushroom-addition-card-cover", "cover.blind", "ulm-controls"],
    ["vacuum", "mushroom-addition-card-vacuum", "vacuum.robot", "ulm-default-vacuum"],
    ["security", "mushroom-addition-custom-card-eraycetinay-lock", "lock.front_door", "custom-eray-lock"],
  ])("renders distinct %s markup", async (_family, tag, entity, marker) => {
    const item = CATALOG.find((entry) => entry.tag === tag)!;
    const markup = await render(tag, {
      type: `custom:${tag}`,
      entity,
      entities: item.family === "scene" ? ["scene.relax"] : undefined,
      show_controls: true,
      show_graph: true,
    });
    expect(markup).toContain(marker);
  });

  it.each([
    ["afvalophaling", "sensor.power", "custom-waste-card", "waste-grid"],
    ["alarm-time", "input_boolean.alarm", "custom-alarm-time", "alarm-time-controls"],
    ["apexcharts", "sensor.power", "custom-apexcharts", "apex-chart"],
    ["chromecast", "media_player.tv", "custom-chromecast", "chromecast-controls"],
    ["damix48-power-details", "sensor.power", "custom-power-details", "power-details-chart"],
    ["device-tracker", "device_tracker.phone", "custom-device-tracker", "device-tracker-icon"],
    ["drealine-roomview", "sensor.temperature", "custom-room-view", "room-view-actions"],
    ["eraycetinay-elapsed-time", "sensor.uptime", "custom-elapsed-time", "ulm-label"],
    ["eraycetinay-lock", "lock.front_door", "custom-eray-lock", "eray-lock-icon"],
    ["esh-welcome", "person.joris", "custom-esh-welcome", "esh-welcome-items"],
    ["haven-washer", "switch.washer", "custom-washer", "washer-stages"],
    ["heat-pump", "climate.living", "custom-heat-pump", "heat-pump-modes"],
    ["homeassistant-updates", "update.core", "custom-ha-updates", "ha-update-list"],
    ["httpedo13-sun", "sun.sun", "custom-sun-card", "sun-arc"],
    ["httpedo13-thermostat", "climate.living", "custom-compact-thermostat", "compact-thermostat-controls"],
    ["iabadia-battery-chip", "sensor.battery", "custom-battery-chip", "tone-green"],
    ["imswel-medias", "media_player.tv", "custom-media-library", "media-platform"],
    ["imswel-person", "person.joris", "custom-imswel-person", "imswel-person-trackers"],
    ["input-datetime", "input_datetime.alarm", "custom-input-datetime", "input-datetime-controls"],
  ])("uses a source-specific %s composition", async (slug, entity, marker, region) => {
    const tag = `mushroom-addition-custom-card-${slug}`;
    const markup = await render(tag, {
      type: `custom:${tag}`,
      entity,
      entities: ["sensor.power", "sensor.humidity", "light.kitchen", "binary_sensor.motion"],
      datetime_entity: "input_datetime.alarm",
      show_controls: true,
      show_graph: true,
    });
    expect(markup).toContain(marker);
    expect(markup).toContain(region);
    expect(markup).not.toContain('class="ulm-metric');
  });

  it("renders only enabled configured waste streams and handles unknown dates", async () => {
    const markup = await render("mushroom-addition-custom-card-afvalophaling", {
      type: "custom:mushroom-addition-custom-card-afvalophaling",
      entity: "sensor.power",
      waste_streams: [
        { enabled: true, entity: "sensor.power", label: "Residual waste", icon: "mdi:trash-can", color: "#43a047" },
        { enabled: true, entity: "sensor.battery", label: "Organic waste", icon: "mdi:leaf", color: "#7cb342" },
        { enabled: false, entity: "sensor.memory", label: "Glass", icon: "mdi:bottle-soda", color: "#00897b" },
        { enabled: true, entity: "sensor.unknown", label: "Bulky waste", icon: "mdi:sofa", color: "#8d6e63" },
      ],
    });
    expect(markup).toContain("Residual waste");
    expect(markup).toContain("Organic waste");
    expect(markup).toContain("Bulky waste");
    expect(markup).not.toContain("Glass");
    expect(markup.match(/class="waste-row"/g)).toHaveLength(3);
    expect(markup).not.toContain("configured waste stream");
  });

  it.each([
    ["today only", { show_today: true, today_entity: "sensor.today" }, ["Today:", "Residual waste"], ["Tomorrow:"]],
    ["tomorrow only", { show_tomorrow: true, tomorrow_entity: "sensor.tomorrow" }, ["Tomorrow:", "Paper"], ["Today:"]],
    ["today and tomorrow", {
      show_today: true,
      today_entity: "sensor.today",
      show_tomorrow: true,
      tomorrow_entity: "sensor.tomorrow",
    }, ["Today:", "Residual waste", "Tomorrow:", "Paper"], []],
    ["sentinel values", {
      show_today: true,
      today_entity: "sensor.none",
      show_tomorrow: true,
      tomorrow_entity: "sensor.cleared",
    }, [], ["waste-summary", "Today:", "Tomorrow:", "geen", "cleared"]],
    ["unavailable values", {
      show_today: true,
      today_entity: "sensor.unknown",
      show_tomorrow: true,
      tomorrow_entity: "sensor.missing",
    }, [], ["waste-summary", "Today:", "Tomorrow:", "unknown"]],
  ])("renders waste header summaries for %s", async (_name, summaryConfig, present, absent) => {
    const markup = await render("mushroom-addition-custom-card-afvalophaling", {
      type: "custom:mushroom-addition-custom-card-afvalophaling",
      entity: "sensor.power",
      waste_streams: [
        { enabled: true, entity: "sensor.power", label: "Residual waste" },
      ],
      ...summaryConfig,
    });
    for (const value of present) expect(markup).toContain(value);
    for (const value of absent) expect(markup).not.toContain(value);
  });

  it.each([
    ["input-number", "sensor.power", "custom-input-number", "input-number-controls"],
    ["irmajavi-entities", "sensor.power", "custom-irmajavi-entities", "irmajavi-four"],
    ["irmajavi-speedtest", "sensor.power", "custom-irmajavi-speedtest", "speedtest-metrics"],
    ["irmajavi-weather", "weather.home", "custom-irmajavi-weather", "irmajavi-weather-header"],
    ["light-colorpick", "light.kitchen", "custom-light-colorpick", "light-color-swatches"],
    ["media-player-sonos", "media_player.tv", "custom-sonos", "sonos-controls"],
    ["more-power-outlet", "sensor.power", "custom-more-power-outlet", "ulm-copy"],
    ["mpse-gauge", "sensor.power", "custom-dual-gauge", "dual-gauge"],
    ["mpse-printer", "sensor.power", "custom-mpse-printer", "toner-bars"],
    ["mpse-thermostat", "climate.living", "custom-compact-thermostat", "compact-thermostat-controls"],
    ["mpse-wifisignal", "sensor.power", "custom-wifi-signal", "ulm-copy"],
    ["nas", "sensor.power", "custom-nas-info", "ulm-icon"],
    ["neekster-update", "sensor.power", "custom-neekster-update", "custom-card-heading"],
    ["nik-clock", "sensor.power", "custom-nik-clock", "custom-nik-clock"],
    ["nik-door", "binary_sensor.window", "custom-nik-door", "nik-door-controls"],
    ["nik-nas", "sensor.power", "custom-nik-nas", "nik-nas-metrics"],
    ["nik-tablet", "sensor.battery", "custom-nik-tablet", "nik-tablet-header"],
    ["paddy-dwd-pollen", "sensor.power", "custom-paddy-pollen", "pollen-icon"],
    ["paddy-waste-collection", "sensor.power", "custom-paddy-waste", "paddy-waste-icon"],
    ["paddy-welcome", "person.joris", "custom-paddy-welcome", "Good"],
    ["person-chip", "person.joris", "custom-person-chip", "person-chip-picture"],
    ["person-info", "person.joris", "custom-person-info", "person-info-details"],
    ["playstation", "media_player.tv", "custom-console-card", "console-content"],
    ["qubino", "sensor.power", "custom-qubino", "ulm-icon"],
    ["ristou-person", "person.joris", "custom-ristou-person", "ristou-person-main"],
    ["saxel-fan", "fan.fixture", "custom-saxel-fan", "fan-speed-row"],
    ["scenes", "scene.relax", "ulm-scenes", "scene-grid"],
    ["schumijo-car", "sensor.power", "custom-schumijo-car", "car-metrics"],
    ["schumijo-flower", "sensor.power", "custom-schumijo-flower", "flower-metrics"],
    ["senoro-win", "binary_sensor.window", "custom-senoro-window", "window-battery"],
    ["sisimomo-printer", "sensor.power", "custom-sisimomo-printer", "printer-cartridges"],
    ["speedtest-shogun160", "sensor.power", "custom-speedtest-shogun", "speedtest-three"],
    ["tpx01-aircondition", "climate.living", "custom-tpx-aircondition", "aircondition-controls"],
    ["vncntdev-device-tracer", "sensor.power", "custom-device-tracer", "device-tracer-meta"],
    ["water-heater", "sensor.power", "custom-water-heater", "water-heater-controls"],
    ["wilbiev-title", "sensor.power", "ulm-title", "variant-divider-title"],
    ["wsly-pollen", "sensor.power", "custom-wsly-pollen", "--pollen:"],
    ["yagrasdemonde-lights-count", "sensor.power", "custom-lights-count", "lights on"],
  ])("uses a dedicated remaining-source %s composition", async (slug, entity, marker, region) => {
    const tag = `mushroom-addition-custom-card-${slug}`;
    const markup = await render(tag, {
      type: `custom:${tag}`,
      entity,
      entities: ["sensor.power", "sensor.battery", "light.kitchen", "scene.relax"],
      show_controls: true,
      show_graph: true,
      use_entity_picture: true,
    });
    expect(markup).toContain(marker);
    expect(markup).toContain(region);
    expect(markup).not.toContain('class="ulm-metric');
  });

  it("keeps every custom source away from broad generic fallback compositions", async () => {
    const forbidden = [
      'class="ulm-metric',
      "ulm-detail-card",
      "ulm-device-status",
      "ulm-schedule-card",
      "ulm-helper-card",
    ];
    for (const source of PARITY_ENTRIES.filter((entry) => entry.upstreamId.startsWith("custom_card_"))) {
      const slug = source.upstreamId.replaceAll("_", "-");
      const tag = `mushroom-addition-${slug}`;
      const markup = await render(tag, {
        type: `custom:${tag}`,
        entity: source.upstreamId.includes("person") ? "person.joris"
          : source.upstreamId.includes("weather") ? "weather.home"
            : source.upstreamId.includes("thermostat") || source.upstreamId.includes("aircondition") ? "climate.living"
              : source.upstreamId.includes("light") ? "light.kitchen"
                : source.upstreamId.includes("media") || source.upstreamId.includes("playstation") || source.upstreamId.includes("chromecast") ? "media_player.tv"
                  : "sensor.power",
        entities: ["sensor.power", "sensor.battery", "light.kitchen", "scene.relax"],
        show_controls: true,
        show_graph: true,
      });
      for (const marker of forbidden) expect(markup, `${source.upstreamId} used ${marker}`).not.toContain(marker);
    }
  });

  it("keeps deterministic family-level visual signatures", async () => {
    const signatures = {
      weather: familySignature(await render("mushroom-addition-card-weather", { type: "custom:mushroom-addition-card-weather", entity: "weather.home", show_forecast: true })),
      climate: familySignature(await render("mushroom-addition-card-thermostat", { type: "custom:mushroom-addition-card-thermostat", entity: "climate.living", show_controls: true })),
      light: familySignature(await render("mushroom-addition-card-light", { type: "custom:mushroom-addition-card-light", entity: "light.kitchen", show_controls: true })),
      scene: familySignature(await render("mushroom-addition-card-scenes", { type: "custom:mushroom-addition-card-scenes", entity: "scene.relax", entities: ["scene.relax"] })),
      person: familySignature(await render("mushroom-addition-card-person", { type: "custom:mushroom-addition-card-person", entity: "person.joris" })),
      battery: familySignature(await render("mushroom-addition-card-battery", { type: "custom:mushroom-addition-card-battery", entity: "sensor.battery" })),
      energy: familySignature(await render("mushroom-addition-card-graph", { type: "custom:mushroom-addition-card-graph", entity: "sensor.power" })),
      media: familySignature(await render("mushroom-addition-card-media-player", { type: "custom:mushroom-addition-card-media-player", entity: "media_player.tv" })),
    };
    expect(signatures).toMatchInlineSnapshot(`
      {
        "battery": [
          "ulm-row",
          "ulm-default-battery",
          "ulm-icon",
          "ulm-copy",
          "ulm-name",
          "ulm-label",
        ],
        "climate": [
          "ulm-climate",
          "ulm-source-thermostat",
          "ulm-icon",
          "ulm-copy",
          "ulm-name",
          "ulm-label",
          "ulm-control",
        ],
        "energy": [
          "ulm-default-graph",
          "ulm-icon",
          "ulm-copy",
          "ulm-name",
          "ulm-label",
        ],
        "light": [
          "ulm-light-card",
          "ulm-icon",
          "ulm-copy",
          "ulm-name",
          "ulm-label",
          "ulm-light-slider",
        ],
        "media": [
          "ulm-media",
          "ulm-icon",
          "ulm-copy",
          "ulm-name",
          "ulm-label",
        ],
        "person": [
          "ulm-row",
          "ulm-person",
          "ulm-source-person",
          "ulm-icon",
          "ulm-copy",
          "ulm-name",
          "ulm-label",
        ],
        "scene": [
          "ulm-scenes",
          "ulm-source-scenes",
        ],
        "weather": [
          "ulm-weather",
        ],
      }
    `);
  });
});
