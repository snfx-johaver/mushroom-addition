import { describe, expect, it, vi } from "vitest";
import { CATALOG } from "../src/catalog";
import { editorSchemaFor } from "../src/editor-schema";
import "../src/index";
import { stateLabel } from "../src/helpers";
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

const entityFor = (item: (typeof CATALOG)[number]): string => {
  const domains = item.preferredDomains ?? [];
  if (domains.includes("weather")) return "weather.home";
  if (domains.includes("climate")) return "climate.living";
  if (domains.includes("light")) return "light.kitchen";
  if (domains.includes("person")) return "person.joris";
  if (domains.includes("media_player")) return "media_player.tv";
  if (domains.includes("cover")) return "cover.blind";
  if (domains.includes("fan")) return "fan.fixture";
  if (domains.includes("alarm_control_panel")) return "alarm_control_panel.home";
  if (domains.includes("scene")) return "scene.relax";
  return "sensor.power";
};

describe("family renderers", () => {
  it("rerenders when Home Assistant updates an existing card config", async () => {
    const element = document.createElement("mushroom-addition-card-graph") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
      shadowRoot: ShadowRoot;
    };
    element.hass = hass;
    element.setConfig({ type: "custom:mushroom-addition-card-graph", entity: "sensor.power", name: "First" });
    document.body.append(element);
    await element.updateComplete;
    element.setConfig({ type: "custom:mushroom-addition-card-graph", entity: "sensor.power", name: "Updated" });
    await element.updateComplete;
    expect(element.shadowRoot.textContent).toContain("Updated");
    element.remove();
  });

  it("applies Mushroom-style layout, fill, icon, and information choices", async () => {
    const markup = await render("mushroom-addition-card-graph", {
      type: "custom:mushroom-addition-card-graph",
      entity: "sensor.power",
      layout: "vertical",
      fill_container: true,
      icon_type: "none",
      primary_info: "state",
      secondary_info: "none",
    });
    expect(markup).toContain("layout-vertical");
    expect(markup).toContain("fill-container");
    expect(markup).not.toContain("ulm-icon");
    expect(markup).toContain("on");
    expect(markup).not.toContain("Kitchen");
  });

  it("honors Mushroom name and information fields in every card renderer", async () => {
    for (const item of CATALOG.filter((entry) => entry.kind === "card")) {
      const entity = entityFor(item);
      const element = document.createElement(item.tag) as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
      };
      element.hass = hass;
      element.setConfig({
        type: `custom:${item.tag}`,
        entity,
        entities: item.family === "scene" ? ["scene.relax"] : undefined,
        name: { type: "text", text: "Custom presentation name" },
        primary_info: "state",
        secondary_info: "name",
      });
      document.body.append(element);
      await element.updateComplete;
      const presentation = element.shadowRoot?.querySelector(".shared-presentation");
      expect(presentation, `${item.upstreamId} must render shared presentation information`).not.toBeNull();
      expect(
        presentation?.querySelector(".ulm-name")?.textContent?.trim(),
        `${item.upstreamId} must apply Primary information`,
      ).toBe(stateLabel(hass.states[entity]));
      expect(
        presentation?.querySelector(".ulm-label")?.textContent?.trim(),
        `${item.upstreamId} must apply the custom Name as Secondary information`,
      ).toBe("Custom presentation name");
      element.remove();
    }
  });

  it("uses a configured Name as the default primary information in every card", async () => {
    for (const item of CATALOG.filter((entry) => entry.kind === "card")) {
      const entity = entityFor(item);
      const element = document.createElement(item.tag) as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
      };
      element.hass = hass;
      element.setConfig({
        type: `custom:${item.tag}`,
        entity,
        entities: item.family === "scene" ? ["scene.relax"] : undefined,
        name: { type: "text", text: "Custom card name" },
      });
      document.body.append(element);
      await element.updateComplete;
      expect(
        element.shadowRoot?.querySelector(".shared-presentation .ulm-name")?.textContent?.trim(),
        `${item.upstreamId} must apply Name without requiring an information override`,
      ).toBe("Custom card name");
      element.remove();
    }
  });

  it("makes Icon type affect every card renderer", async () => {
    for (const item of CATALOG.filter((entry) => entry.kind === "card")) {
      const entity = entityFor(item);
      const base = {
        type: `custom:${item.tag}`,
        entity,
        entities: item.family === "scene" ? ["scene.relax"] : undefined,
        icon: "mdi:test-tube",
      };
      const icon = await render(item.tag, { ...base, icon_type: "icon" });
      const none = await render(item.tag, { ...base, icon_type: "none" });
      const schemaNames = editorSchemaFor(item).flatMap((field) =>
        field.schema ? field.schema.map((nested) => nested.name) : [field.name]
      );
      if (none === icon) {
        expect(schemaNames, `${item.upstreamId} exposes an ineffective Icon field`).not.toContain("icon");
        expect(schemaNames, `${item.upstreamId} exposes an ineffective Icon type field`).not.toContain("icon_type");
      } else {
        expect(schemaNames, `${item.upstreamId} must expose its functional Icon field`).toContain("icon");
        expect(schemaNames, `${item.upstreamId} must expose its functional Icon type field`).toContain("icon_type");
      }
    }
  });

  it("applies a custom Name on cards whose primary entity is optional", async () => {
    const markup = await render("mushroom-addition-custom-card-trash", {
      type: "custom:mushroom-addition-custom-card-trash",
      name: { type: "text", text: "My waste schedule" },
      primary_info: "name",
      secondary_info: "none",
      waste_streams: [{ enabled: true, entity: "sensor.today", label: "Today" }],
    });
    expect(markup).toContain("My waste schedule");
    expect(markup).not.toContain(">Mushroom Addition<");
  });

  it("applies the Waste card UI Name over a stale legacy name mode", async () => {
    const element = document.createElement("mushroom-addition-custom-card-trash") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    element.hass = {
      ...hass,
      formatEntityName: (_entity, name) => {
        const items = Array.isArray(name) ? name : [name];
        return items.map((item) => typeof item === "string" ? item : item?.text ?? "Home").join(" ");
      },
    };
    element.setConfig({
      type: "custom:mushroom-addition-custom-card-trash",
      entity: "sensor.today",
      name_mode: "entity",
      name: [{ type: "text", text: "Joris" }, { type: "area" }],
      primary_info: "name",
      secondary_info: "default",
      icon_type: "icon",
      waste_streams: [],
    });
    document.body.append(element);
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector(".ulm-name")?.textContent?.trim()).toBe("Joris Home");
    element.remove();

    const custom = await render("mushroom-addition-custom-card-trash", {
      type: "custom:mushroom-addition-custom-card-trash",
      entity: "sensor.today",
      name_mode: "entity",
      name: "pietjeds",
      primary_info: "name",
      secondary_info: "default",
      waste_streams: [],
    });
    expect(custom).toContain("pietjeds");
    expect(custom).not.toContain(">Trash type today<");
  });

  it("applies every Icon type on the Waste Collection card", async () => {
    const icon = await render("mushroom-addition-custom-card-trash", {
      type: "custom:mushroom-addition-custom-card-trash",
      icon_type: "icon",
      waste_streams: [],
    });
    expect(icon).toContain('class="ulm-icon');

    const none = await render("mushroom-addition-custom-card-trash", {
      type: "custom:mushroom-addition-custom-card-trash",
      icon_type: "none",
      waste_streams: [],
    });
    expect(none).not.toContain('class="ulm-icon');

    const unavailablePicture = await render("mushroom-addition-custom-card-trash", {
      type: "custom:mushroom-addition-custom-card-trash",
      icon_type: "entity-picture",
      waste_streams: [],
    });
    expect(unavailablePicture).toContain('class="ulm-icon');

    const picture = await render("mushroom-addition-custom-card-trash", {
      type: "custom:mushroom-addition-custom-card-trash",
      entity: "person.joris",
      icon_type: "entity-picture",
      waste_streams: [],
    });
    expect(picture).toContain("entity-picture");
    expect(picture).toContain("/local/joris.jpg");
  });

  it("gives Icon type precedence over legacy icon settings", async () => {
    const waste = await render("mushroom-addition-custom-card-trash", {
      type: "custom:mushroom-addition-custom-card-trash",
      show_icon: false,
      icon_type: "icon",
      waste_streams: [],
    });
    expect(waste).toContain('class="ulm-icon');

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
    expect(markup).toContain("bar-card");
    expect(markup).toContain("bar-card-header");
    expect(markup).toContain("bar-card-icon");
    expect(markup).toContain("ulm-name");
    expect(markup).toContain("ulm-label");
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
    ["card_graph", "mushroom-addition-card-graph", "sensor.power", "ulm-default-graph", "ulm-light-slider"],
    ["card_media_player", "mushroom-addition-card-media-player", "media_player.tv", "ulm-media", "sparkline"],
    ["card_room", "mushroom-addition-card-room", "light.kitchen", "ulm-room", "sparkline"],
    ["card_scenes", "mushroom-addition-card-scenes", "scene.relax", "scene-pills", "sparkline"],
    ["card_welcome_scenes", "mushroom-addition-card-welcome-scenes", "scene.relax", "welcome-scenes", "sparkline"],
  ])("enforces the %s visual structure", async (_id, tag, entity, required, forbidden) => {
    const markup = await render(tag, {
      type: `custom:${tag}`,
      entity,
      entities: entity.startsWith("scene.") ? ["scene.relax"] : undefined,
      show_controls: true,
    });
    expect(markup).toContain(required);
    expect(markup).not.toContain(forbidden);
  });

  it("renders the dedicated NAS tiles, semantic metrics, and three radial rings", async () => {
      const markup = await render("mushroom-addition-custom-card-nas-metrics", {
        type: "custom:mushroom-addition-custom-card-nas-metrics",
        entity: "binary_sensor.nas",
        disk_entity: "sensor.nas_disk",
        temperature_entity: "sensor.nas_temp",
        memory_entity: "sensor.nas_memory",
        cpu_entity: "sensor.nas_cpu",
      });
      expect(markup).toContain("nas-metrics-top");
      expect(markup).toContain("status-tile");
      expect(markup).toContain("disk-tile");
      expect(markup).toContain("nas-metrics-metrics");
      expect(markup).toContain("nas-metrics-rings");
      expect(markup.match(/nas-metrics-ring-value/g)).toHaveLength(3);
      expect(markup).not.toContain("nas-metrics-chart");
      expect(markup).not.toContain("metric-1");
  });

  it("opens NAS status more-info without firing the outer card action", async () => {
      const element = document.createElement("mushroom-addition-custom-card-nas-metrics") as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
        shadowRoot: ShadowRoot;
      };
      element.hass = hass;
      element.setConfig({ type: "custom:mushroom-addition-custom-card-nas-metrics", entity: "binary_sensor.nas" });
      const actions: unknown[] = [];
      element.addEventListener("hass-action", (event) => actions.push((event as CustomEvent).detail));
      document.body.append(element);
      await element.updateComplete;
      (element.shadowRoot.querySelector('button[aria-label="Open NAS status"]') as HTMLButtonElement).click();
      expect(actions).toEqual([{
        action: "tap",
        config: {
          type: "custom:mushroom-addition-custom-card-nas-metrics",
          entity: "binary_sensor.nas",
          tap_action: { action: "more-info" },
        },
      }]);
      element.remove();
  });

  it("renders and executes all six semantic Tablet controls", async () => {
      const callService = vi.fn(async () => undefined);
      const element = document.createElement("mushroom-addition-custom-card-tablet") as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
        shadowRoot: ShadowRoot;
      };
      element.hass = { ...hass, callService };
      element.setConfig({
        type: "custom:mushroom-addition-custom-card-tablet",
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
      expect(element.shadowRoot.querySelectorAll(".tablet-controls button")).toHaveLength(6);
      expect(element.shadowRoot.querySelectorAll(".tablet-metrics > span")).toHaveLength(3);
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

  it.each([
    ["scene", "mushroom-addition-card-scenes", "scene.relax", "scene-grid"],
    ["battery", "mushroom-addition-card-battery", "sensor.battery", "ulm-default-battery"],
    ["energy", "mushroom-addition-card-graph", "sensor.power", "sparkline"],
    ["media", "mushroom-addition-card-media-player", "media_player.tv", "ulm-media"],
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
    ["trash", "sensor.power", "custom-waste-card", "waste-grid"],
    ["alarm-time", "input_boolean.alarm", "custom-alarm-time", "alarm-time-controls"],
    ["roomview", "sensor.temperature", "custom-room-view", "room-view-actions"],
    ["welcome", "person.joris", "custom-welcome", "welcome-items"],
    ["washer", "switch.washer", "custom-washer", "washer-stages"],
    ["sun", "sun.sun", "custom-sun-card", "sun-arc"],
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
    const markup = await render("mushroom-addition-custom-card-trash", {
      type: "custom:mushroom-addition-custom-card-trash",
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

  it("applies Home Assistant theme colors to room sensor buttons", async () => {
    const markup = await render("mushroom-addition-card-room", {
      type: "custom:mushroom-addition-card-room",
      entity: "light.kitchen",
      room_sensors: [
        {
          entity: "binary_sensor.window",
          color: "deep-purple",
        },
      ],
    });
    expect(markup).toContain("--item-color:rgb(var(--rgb-deep-purple, 110, 65, 171))");
    expect(markup).not.toContain("--color-deep-purple");
  });

  it("supports entity pictures on individual room sensor buttons", async () => {
    const picture = await render("mushroom-addition-card-room", {
      type: "custom:mushroom-addition-card-room",
      entity: "light.kitchen",
      room_sensors: [{
        entity: "person.joris",
        icon: "mdi:account",
        icon_type: "entity-picture",
      }],
    });
    expect(picture).toContain("room-sensor-picture");
    expect(picture).toContain("/local/joris.jpg");

    const fallback = document.createElement("mushroom-addition-card-room") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    fallback.hass = hass;
    fallback.setConfig({
      type: "custom:mushroom-addition-card-room",
      entity: "light.kitchen",
      room_sensors: [{
        entity: "sensor.battery",
        icon: "mdi:battery",
        icon_type: "entity-picture",
      }],
    });
    document.body.append(fallback);
    await fallback.updateComplete;
    expect(fallback.shadowRoot?.querySelector(".room-sensor-picture")).toBeNull();
    expect((fallback.shadowRoot?.querySelector(".room-sensor ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:battery");
    fallback.remove();
  });

  it("supports entity pictures on individual Welcome Scenes buttons", async () => {
    const card = document.createElement("mushroom-addition-card-welcome-scenes") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    card.hass = hass;
    card.setConfig({
      type: "custom:mushroom-addition-card-welcome-scenes",
      scene_items: [{
        entity: "person.joris",
        icon: "mdi:account",
        icon_type: "entity-picture",
      }, {
        entity: "sensor.battery",
        icon: "mdi:battery",
        icon_type: "entity-picture",
      }],
    });
    document.body.append(card);
    await card.updateComplete;
    const buttons = card.shadowRoot?.querySelectorAll(".scene-button") ?? [];
    expect(buttons[0].querySelector(".scene-entity-picture")?.getAttribute("style"))
      .toContain("/local/joris.jpg");
    expect((buttons[1].querySelector("ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:battery");
    card.remove();
  });

  it("expands and collapses additional Welcome Scenes from the overflow button", async () => {
    const tag = "mushroom-addition-card-welcome-scenes";
    const element = document.createElement(tag) as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    element.hass = hass;
    element.setConfig({
      type: `custom:${tag}`,
      scene_items: Array.from({ length: 9 }, (_, index) => ({
        entity: "scene.relax",
        name: `Scene ${index + 1}`,
      })),
    });
    document.body.append(element);
    await element.updateComplete;

    expect(element.shadowRoot?.querySelectorAll(".scene-button")).toHaveLength(7);
    const more = element.shadowRoot?.querySelector<HTMLButtonElement>(".welcome-scenes-more");
    expect(more?.getAttribute("aria-expanded")).toBe("false");
    more?.click();
    await element.updateComplete;
    expect(element.shadowRoot?.querySelectorAll(".scene-button")).toHaveLength(9);
    expect(element.shadowRoot?.querySelector(".welcome-scenes-more")?.getAttribute("aria-expanded")).toBe("true");

    element.shadowRoot?.querySelector<HTMLButtonElement>(".welcome-scenes-more")?.click();
    await element.updateComplete;
    expect(element.shadowRoot?.querySelectorAll(".scene-button")).toHaveLength(7);
    element.remove();
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
    const markup = await render("mushroom-addition-custom-card-trash", {
      type: "custom:mushroom-addition-custom-card-trash",
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
    ["entity-overview", "sensor.power", "custom-entity-overview", "metrics-four"],
    ["internet-speed", "sensor.power", "custom-internet-speed", "speedtest-metrics"],
    ["weather-metrics", "weather.home", "custom-weather-metrics", "weather-metrics-panel"],
    ["media-player-sonos", "media_player.tv", "custom-sonos", "sonos-controls"],
    ["more-power-outlet", "sensor.power", "custom-more-power-outlet", "ulm-copy"],
    ["gauge", "sensor.power", "custom-dual-gauge", "dual-gauge"],
    ["printer", "sensor.power", "custom-printer", "toner-bars"],
    ["nas-metrics", "sensor.power", "custom-nas-metrics", "nas-metrics-metrics"],
    ["tablet", "sensor.battery", "custom-tablet", "tablet-header"],
    ["pollen-forecast", "sensor.power", "custom-pollen-forecast", "pollen-icon"],
    ["welcome-dashboard", "person.joris", "custom-welcome-dashboard", "welcome-dashboard-message"],
    ["playstation", "media_player.tv", "custom-console-card", "console-content"],
    ["scenes", "scene.relax", "ulm-scenes", "scene-grid"],
    ["vehicle-status", "sensor.power", "custom-vehicle-status", "car-metrics"],
    ["plant", "sensor.power", "custom-plant", "flower-bars"],
    ["speedtest-gauges", "sensor.power", "custom-speedtest-gauges", "speedtest-three"],
    ["pollen", "sensor.power", "custom-pollen", "--pollen:"],
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
                : source.upstreamId.includes("media") || source.upstreamId.includes("playstation") ? "media_player.tv"
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
      scene: familySignature(await render("mushroom-addition-card-scenes", { type: "custom:mushroom-addition-card-scenes", entity: "scene.relax", entities: ["scene.relax"] })),
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
        "energy": [
          "ulm-default-graph",
          "ulm-icon",
          "ulm-copy",
          "ulm-name",
          "ulm-label",
        ],
        "media": [
          "ulm-media",
          "ulm-icon",
          "ulm-copy",
          "ulm-name",
          "ulm-label",
        ],
        "scene": [
          "ulm-scenes",
          "ulm-source-scenes",
          "ulm-copy",
          "ulm-name",
          "ulm-label",
        ],
      }
    `);
  });
});
