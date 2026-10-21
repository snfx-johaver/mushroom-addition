import { describe, expect, it, vi } from "vitest";
import { CATALOG } from "../src/catalog";
import { editorSchemaFor } from "../src/editor-schema";
import "../src/index";
import { stateLabel } from "../src/helpers";
import { PARITY_ENTRIES } from "../src/parity.generated";
import { sharedStyles } from "../src/styles";
import type { MushroomAdditionCard } from "../src/card";
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
    "person.resident": {
      entity_id: "person.resident",
      state: "home",
      attributes: { friendly_name: "Resident", entity_picture: "/local/resident.jpg" },
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
    "sensor.soil_moisture": {
      entity_id: "sensor.soil_moisture",
      state: "42",
      attributes: {
        friendly_name: "Bonsai moisture",
        unit_of_measurement: "%",
        device_class: "moisture",
      },
    },
    "sensor.soil_temperature": {
      entity_id: "sensor.soil_temperature",
      state: "22",
      attributes: {
        friendly_name: "Bonsai temperature",
        unit_of_measurement: "°C",
        device_class: "temperature",
      },
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
    "binary_sensor.tablet": { entity_id: "binary_sensor.tablet", state: "on", attributes: { friendly_name: "Hallway Tablet" } },
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
    "binary_sensor.living_room_console": { entity_id: "binary_sensor.living_room_console", state: "on", attributes: { friendly_name: "Living room console" } },
    "sensor.living_room_console_follower": { entity_id: "sensor.living_room_console_follower", state: "31", attributes: { friendly_name: "Followers" } },
    "sensor.living_room_console_following": { entity_id: "sensor.living_room_console_following", state: "18", attributes: { friendly_name: "Following" } },
    "sensor.living_room_console_friends": { entity_id: "sensor.living_room_console_friends", state: "42", attributes: { friendly_name: "Friends" } },
    "sensor.living_room_console_gamer_score": { entity_id: "sensor.living_room_console_gamer_score", state: "11145", attributes: { friendly_name: "Gamerscore" } },
    "sensor.living_room_console_ranking": { entity_id: "sensor.living_room_console_ranking", state: "Silver", attributes: { friendly_name: "Ranking" } },
    "sensor.living_room_console_now_playing": { entity_id: "sensor.living_room_console_now_playing", state: "Forza Horizon 5", attributes: { friendly_name: "Now Playing" } },
    "image.living_room_console_gamerpic": { entity_id: "image.living_room_console_gamerpic", state: "2026-10-20T00:00:00+00:00", attributes: { friendly_name: "Gamerpic", entity_picture: "/api/image/xbox-gamerpic" } },
    "image.living_room_console_now_playing": { entity_id: "image.living_room_console_now_playing", state: "2026-10-20T00:00:00+00:00", attributes: { friendly_name: "Now Playing artwork", entity_picture: "/api/image/xbox-artwork" } },
    "remote.living_room_console_console": { entity_id: "remote.living_room_console_console", state: "off", attributes: { friendly_name: "Xbox console" } },
  },
  entities: Object.fromEntries([
    "binary_sensor.living_room_console",
    "sensor.living_room_console_follower",
    "sensor.living_room_console_following",
    "sensor.living_room_console_friends",
    "sensor.living_room_console_gamer_score",
    "sensor.living_room_console_ranking",
    "sensor.living_room_console_now_playing",
    "image.living_room_console_gamerpic",
    "image.living_room_console_now_playing",
    "remote.living_room_console_console",
  ].map((entityId) => [entityId, { device_id: "xbox-account", platform: "xbox" }])),
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
  if (domains.includes("person")) return "person.resident";
  if (domains.includes("media_player")) return "media_player.tv";
  if (domains.includes("cover")) return "cover.blind";
  if (domains.includes("fan")) return "fan.fixture";
  if (domains.includes("alarm_control_panel")) return "alarm_control_panel.home";
  if (domains.includes("scene")) return "scene.relax";
  return "sensor.power";
};

describe("family renderers", () => {
  it("rerenders when Home Assistant updates an existing card config", async () => {
    const element = document.createElement("mushroom-addition-custom-card-printer") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
      shadowRoot: ShadowRoot;
    };
    element.hass = hass;
    element.setConfig({ type: "custom:mushroom-addition-custom-card-printer", entity: "sensor.power", name: "First" });
    document.body.append(element);
    await element.updateComplete;
    element.setConfig({ type: "custom:mushroom-addition-custom-card-printer", entity: "sensor.power", name: "Updated" });
    await element.updateComplete;
    expect(element.shadowRoot.textContent).toContain("Updated");
    element.remove();
  });

  it("applies Mushroom-style layout, fill, icon, and information choices", async () => {
    const markup = await render("mushroom-addition-custom-card-printer", {
      type: "custom:mushroom-addition-custom-card-printer",
      entity: "light.kitchen",
      layout: "vertical",
      multiline_secondary: true,
      fill_container: true,
      icon_type: "none",
      primary_info: "state",
      secondary_info: "none",
    });

    expect(markup).toContain("layout-vertical");
    expect(markup).toContain("multiline-secondary");
    expect(markup).toContain("fill-container");
    expect(markup).not.toContain("ulm-icon");
    expect(markup).toContain("on");
    expect(markup).not.toContain("Kitchen");
  });

  it("renders every selected Flower bar from its independently configured entity", async () => {
    const markup = await render("mushroom-addition-custom-card-plant", {
      type: "custom:mushroom-addition-custom-card-plant",
      entity: "sensor.soil_moisture",
      ulm_card_flower_show_bars: ["moisture", "temperature"],
      moisture_entity: "sensor.soil_moisture",
      temperature_entity: "sensor.soil_temperature",
    });
    expect(markup).toContain('data-flower-bar="moisture"');
    expect(markup).toContain('data-flower-bar="temperature"');
    expect(markup).toContain("Moisture: 42 %");
    expect(markup).toContain("Temperature: 22 °C");
    expect(markup).toContain("width:42%");
    expect(markup).toContain("width:53.333333333333336%");
  });

  it("honors Mushroom name and information fields in every card renderer", async () => {
    for (const item of CATALOG.filter((entry) => entry.kind === "card" && entry.family !== "nas-dashboard" && !["area_card_advanced", "area_card_mushroom"].includes(entry.upstreamId))) {
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
    for (const item of CATALOG.filter((entry) => entry.kind === "card" && entry.family !== "nas-dashboard" && !["area_card_advanced", "area_card_mushroom"].includes(entry.upstreamId))) {
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

  it.each([
    "custom_card_pollen",
    "custom_card_nas_metrics",
    "custom_card_speedtest_gauges",
    "advanced_home_energy_management",
    "advanced_energy_buy_sell",
    "advanced_energy_panel_health",
  ])("aligns the %s header icon with its shared information", async (id) => {
    const item = CATALOG.find((candidate) => candidate.upstreamId === id)!;
    const element = document.createElement(item.tag) as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    const config: AdditionConfig = {
      type: `custom:${item.tag}`,
      entity: entityFor(item),
      name: "Header name",
      primary_info: "name",
      secondary_info: "state",
      icon: "mdi:test-tube",
    };
    element.hass = hass;
    element.setConfig(config);
    document.body.append(element);
    await element.updateComplete;
    const header = element.shadowRoot?.querySelector(".card-heading");
    expect(header, id).not.toBeNull();
    expect((header?.querySelector(".ulm-icon > ha-icon") as HTMLElement & { icon?: string })?.icon)
      .toBe("mdi:test-tube");
    expect(header?.querySelector(".shared-presentation .ulm-name")?.textContent?.trim()).toBe("Header name");
    expect(header?.querySelector(".shared-presentation .ulm-label")?.textContent?.trim())
      .toBe(stateLabel(hass.states[entityFor(item)]));
    expect(element.shadowRoot?.querySelectorAll(".shared-presentation")).toHaveLength(1);
    expect(element.shadowRoot?.querySelector("ha-card")).not.toBeNull();

    element.setConfig({ ...config, icon_type: "none", secondary_info: "none" });
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector(".card-heading .ulm-icon")).toBeNull();
    expect(element.shadowRoot?.querySelector(".card-heading .ulm-label")).toBeNull();
    expect(element.shadowRoot?.querySelector(".energy-card-subtitle")).toBeNull();
    element.remove();
  });

  it("makes Icon type affect every card renderer", async () => {
    for (const item of CATALOG.filter((entry) => entry.kind === "card" && entry.family !== "nas-dashboard" && !["area_card_advanced", "area_card_mushroom"].includes(entry.upstreamId))) {
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
      name: [{ type: "text", text: "Resident" }, { type: "area" }],
      primary_info: "name",
      secondary_info: "default",
      icon_type: "icon",
      waste_streams: [],
    });
    document.body.append(element);
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector(".ulm-name")?.textContent?.trim()).toBe("Resident Home");
    element.remove();

    const custom = await render("mushroom-addition-custom-card-trash", {
      type: "custom:mushroom-addition-custom-card-trash",
      entity: "sensor.today",
      name_mode: "entity",
      name: "Custom collection",
      primary_info: "name",
      secondary_info: "default",
      waste_streams: [],
    });
    expect(custom).toContain("Custom collection");
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
      entity: "person.resident",
      icon_type: "entity-picture",
      waste_streams: [],
    });
    expect(picture).toContain("entity-picture");
    expect(picture).toContain("/local/resident.jpg");
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

  it.each([
    ["card_battery", "mushroom-addition-card-battery", "sensor.battery", "ulm-default-battery", "battery-track"],
    ["card_room", "mushroom-addition-card-room", "light.kitchen", "ulm-room", "sparkline"],
    ["card_scenes", "mushroom-addition-card-scenes", "scene.relax", "scene-pills", "sparkline"],
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
    ["media", "mushroom-addition-custom-card-media-player-sonos", "media_player.tv", "custom-sonos"],
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
    ["welcome", "person.resident", "custom-welcome", "welcome-items"],
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
    expect(markup).toContain("--item-color:rgb(var(--mush-rgb-deep-purple, var(--rgb-deep-purple, 110, 65, 171)))");
    expect(markup).not.toContain("--color-deep-purple");
  });

  it("preserves complete scene names for accessible labels and tooltips", async () => {
    const name = "Evening relaxation lighting across the entire downstairs area";
    const markup = await render("mushroom-addition-card-scenes", {
      type: "custom:mushroom-addition-card-scenes",
      scene_buttons_only: true,
      scene_items: [{ entity: "scene.preview", name }],
    });
    const root = document.createElement("div");
    root.innerHTML = markup;
    const button = root.querySelector<HTMLElement>(".scene-button")!;
    expect(button.getAttribute("aria-label")).toBe(name);
    expect(button.title).toBe(name);
    expect(button.querySelector("span")?.textContent).toBe(name);
  });

  it("supports entity pictures on individual room sensor buttons", async () => {
    const picture = await render("mushroom-addition-card-room", {
      type: "custom:mushroom-addition-card-room",
      entity: "light.kitchen",
      room_sensors: [{
        entity: "person.resident",
        icon: "mdi:account",
        icon_type: "entity-picture",
      }],
    });
    expect(picture).toContain("room-sensor-picture");
    expect(picture).toContain("/local/resident.jpg");

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

  it("supports entity pictures on individual Scenes buttons", async () => {
    const card = document.createElement("mushroom-addition-card-scenes") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    card.hass = hass;
    card.setConfig({
      type: "custom:mushroom-addition-card-scenes",
      scene_items: [{
        entity: "person.resident",
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
      .toContain("/local/resident.jpg");
    expect((buttons[1].querySelector("ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:battery");
    card.remove();
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
    ["media-player-sonos", "media_player.tv", "custom-sonos", "sonos-controls"],
    ["printer", "sensor.power", "custom-printer", "toner-bars"],
    ["nas-metrics", "sensor.power", "custom-nas-metrics", "nas-metrics-metrics"],
    ["tablet", "sensor.battery", "custom-tablet", "tablet-header"],
    ["game-console", "binary_sensor.living_room_console", "custom-console-card", "console-content"],
    ["scenes", "scene.relax", "ulm-scenes", "scene-grid"],
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
        entity: source.upstreamId.includes("person") ? "person.resident"
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

  it.each(["card_scenes", "custom_card_welcome"])(
    "updates raised scene surfaces with Home Assistant's theme without replacing %s buttons", async (id) => {
      const item = CATALOG.find(entry => entry.upstreamId === id)!;
      const card = document.createElement(item.tag) as MushroomAdditionCard;
      card.hass = { ...hass, themes: { darkMode: true } };
      card.setConfig({ type: `custom:${item.tag}`, entity: "scene.relax",
        entities: ["scene.relax"], items: [{ entity: "scene.relax", name: "Relax" }],
        nav_1: "/lovelace", name_1: "Home" });
      document.body.append(card);
      await card.updateComplete;
      const selector = ".scene-button, .welcome-items > button";
      const button = card.shadowRoot!.querySelector(selector);
      expect(button).not.toBeNull();
      expect(card.hasAttribute("dark")).toBe(true);
      card.hass = { ...hass, themes: { darkMode: false } };
      await card.updateComplete;
      expect(card.hasAttribute("dark")).toBe(false);
      expect(card.shadowRoot!.querySelector(selector)).toBe(button);
      card.hass = { ...hass, themes: { darkMode: true } };
      await card.updateComplete;
      expect(card.hasAttribute("dark")).toBe(true);
      expect(card.shadowRoot!.querySelector(selector)).toBe(button);
      card.remove();
    },
  );

  it("keeps deterministic family-level visual signatures", async () => {
    const signatures = {
      scene: familySignature(await render("mushroom-addition-card-scenes", { type: "custom:mushroom-addition-card-scenes", entity: "scene.relax", entities: ["scene.relax"] })),
      battery: familySignature(await render("mushroom-addition-card-battery", { type: "custom:mushroom-addition-card-battery", entity: "sensor.battery" })),
      media: familySignature(await render("mushroom-addition-custom-card-media-player-sonos", { type: "custom:mushroom-addition-custom-card-media-player-sonos", entity: "media_player.tv" })),
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
        "media": [
          "ulm-icon",
          "ulm-copy",
          "ulm-name",
          "ulm-label",
          "ulm-control",
        ],
        "scene": [
          "ulm-scenes",
          "ulm-source-scenes",
          "ulm-icon",
          "ulm-copy",
          "ulm-name",
          "ulm-label",
        ],
      }
    `);
  });

  it("renders an automatically discovered Xbox profile with compact social counts and replaceable stats", async () => {
    const markup = await render("mushroom-addition-custom-card-game-console", {
      type: "custom:mushroom-addition-custom-card-game-console",
      entity: "binary_sensor.living_room_console",
      primary_stat_entity: "sensor.living_room_console_gamer_score",
      secondary_stat_entity: "sensor.living_room_console_ranking",
    });

    expect(markup).toContain("console-card platform-xbox");
    expect(markup).toContain("/api/image/xbox-gamerpic");
    expect(markup).toContain("/api/image/xbox-artwork");
    expect(markup).toContain("Forza Horizon 5");
    expect(markup).toContain("11145");
    expect(markup).toContain("Silver");
    expect((markup.match(/class="console-social-item"/g) ?? [])).toHaveLength(3);
    expect((markup.match(/shared-presentation/g) ?? [])).toHaveLength(1);
    expect(markup).not.toContain("automatic-presentation");
    expect(sharedStyles.cssText).toMatch(/\.console-social ha-icon[\s\S]*?width:\s*var\(--mush-icon-size, 36px\);[\s\S]*?height:\s*var\(--mush-icon-size, 36px\);/);
  });

  it("hides the entire carousel header without removing its configured information or items", async () => {
    const element = document.createElement("mushroom-addition-custom-card-entity-carousel") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    const config: AdditionConfig = {
      type: "custom:mushroom-addition-custom-card-entity-carousel",
      name: "Carousel title",
      primary_info: "name",
      secondary_info: "state",
      icon: "mdi:view-carousel",
      carousel_show_header: false,
      carousel_items: [{ entity: "light.kitchen", name: "Lights" }],
    };
    element.hass = hass;
    element.setConfig(config);
    document.body.append(element);
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector(".entity-carousel-presentation")).toBeNull();
    expect(element.shadowRoot?.querySelector(".shared-presentation")).toBeNull();
    expect(element.shadowRoot?.querySelector("mushroom-addition-entity-carousel")).not.toBeNull();
    element.setConfig({ ...config, carousel_show_header: true });
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector(".shared-presentation")?.textContent).toContain("Carousel title");
    element.remove();
  });

  it("uses the selected console platform and toggles a discovered power entity", async () => {
    const callService = vi.fn(async () => undefined);
    const element = document.createElement("mushroom-addition-custom-card-game-console") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    element.hass = { ...hass, callService };
    element.setConfig({
      type: "custom:mushroom-addition-custom-card-game-console",
      entity: "binary_sensor.living_room_console",
      console_platform: "nintendo",
      console_show_controls: true,
      gamerpic_entity: "image.missing",
    });
    document.body.append(element);
    await element.updateComplete;

    expect(element.shadowRoot?.innerHTML).toContain("platform-nintendo");
    expect((element.shadowRoot?.querySelector(".console-logo ha-state-icon") as HTMLElement & { stateObj: { entity_id: string } }).stateObj.entity_id).toBe("binary_sensor.living_room_console");
    (element.shadowRoot?.querySelector(".console-controls button") as HTMLElement).click();
    expect(callService).toHaveBeenCalledWith("remote", "turn_on", { entity_id: "remote.living_room_console_console" });
    element.remove();
  });

  it("exposes the full Game Console configuration in the graphical editor", () => {
    const item = CATALOG.find((candidate) => candidate.upstreamId === "custom_card_playstation")!;
    const schema = editorSchemaFor(item, {
      type: `custom:${item.tag}`,
      entity: "binary_sensor.living_room_console",
    });
    const serialized = JSON.stringify(schema);
    for (const field of [
      "console_platform",
      "console_show_artwork",
      "console_show_controls",
      "followers_entity",
      "following_entity",
      "friends_entity",
      "primary_stat_entity",
      "secondary_stat_entity",
      "now_playing_entity",
      "gamerpic_entity",
      "artwork_entity",
      "console_power_entity",
    ]) {
      expect(serialized).toContain(`"${field}"`);
    }
  });

  it("renders and navigates the dependency-free entity carousel", async () => {
    const element = document.createElement("mushroom-addition-custom-card-entity-carousel") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    const action = vi.fn();
    element.addEventListener("hass-action", action);
    element.hass = hass;
    element.setConfig({
      type: "custom:mushroom-addition-custom-card-entity-carousel",
      entity: "light.kitchen",
      name: "Entity Carousel",
      primary_info: "name",
      secondary_info: "state",
      carousel_loop: true,
      carousel_show_labels: true,
      carousel_visible_items: 5,
      parameters: {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 400,
          modifier: 1,
          slideShadows: true,
        },
      },
      carousel_items: [
        { entity: "light.kitchen", name: "Lights", icon: "mdi:lightbulb", tap_action: { action: "toggle" } },
        { entity: "scene.relax", name: "Relax", icon: "mdi:palette", tap_action: { action: "more-info" } },
        { entity: "media_player.tv", name: "TV", icon: "mdi:television", tap_action: { action: "more-info" } },
      ],
    });
    document.body.append(element);
    await element.updateComplete;
    const carousel = element.shadowRoot?.querySelector("mushroom-addition-entity-carousel") as HTMLElement & {
      updateComplete: Promise<boolean>;
    };
    const presentation = element.shadowRoot?.querySelector(".entity-carousel-presentation");
    expect(presentation?.querySelector(".ulm-icon")).not.toBeNull();
    expect(presentation?.querySelector(".ulm-copy")).not.toBeNull();
    expect(presentation?.querySelector(".automatic-presentation")).toBeNull();
    expect(sharedStyles.cssText).toMatch(/\.entity-carousel-presentation\s*\{\s*padding:\s*12px;/);
    await carousel.updateComplete;
    const buttons = [...(carousel.shadowRoot?.querySelectorAll("button") ?? [])] as HTMLButtonElement[];
    expect(buttons).toHaveLength(3);
    expect(buttons[0].getAttribute("aria-selected")).toBe("true");
    expect(carousel.shadowRoot?.querySelector(".carousel")?.classList.contains("grab-cursor")).toBe(true);
    expect(buttons[1].style.transform).toContain("translateZ(-400px)");
    expect(buttons[1].style.transform).toContain("rotateY(0deg)");
    expect(buttons[1].dataset.shadow).toBe("true");
    const swipeSurface = carousel.shadowRoot?.querySelector(".carousel") as HTMLElement;
    swipeSurface.dispatchEvent(new PointerEvent("pointerdown", {
      bubbles: true, clientX: 160, clientY: 50, pointerId: 10,
    }));
    swipeSurface.dispatchEvent(new PointerEvent("pointermove", {
      bubbles: true, cancelable: true, clientX: 153, clientY: 50, pointerId: 10,
    }));
    await carousel.updateComplete;
    expect(swipeSurface.classList.contains("dragging")).toBe(true);
    expect(buttons[0].style.transform).toContain("translateX(-7px)");
    swipeSurface.dispatchEvent(new PointerEvent("pointerup", {
      bubbles: true, clientX: 150, clientY: 50, pointerId: 10,
    }));
    await carousel.updateComplete;
    expect(buttons[1].getAttribute("aria-selected")).toBe("true");
    expect(swipeSurface.classList.contains("dragging")).toBe(false);
    const slowDrag = (type: string, clientX: number, timeStamp: number) => {
      const event = new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX,
        clientY: 50,
        pointerId: 13,
      });
      Object.defineProperty(event, "timeStamp", { value: timeStamp });
      return event;
    };
    swipeSurface.dispatchEvent(slowDrag("pointerdown", 120, 100));
    swipeSurface.dispatchEvent(slowDrag("pointermove", 115, 250));
    swipeSurface.dispatchEvent(slowDrag("pointerup", 115, 300));
    await carousel.updateComplete;
    expect(buttons[1].getAttribute("aria-selected")).toBe("true");
    expect(action).not.toHaveBeenCalled();
    swipeSurface.dispatchEvent(new PointerEvent("pointerdown", {
      bubbles: true, clientX: 120, clientY: 50, pointerId: 11,
    }));
    swipeSurface.dispatchEvent(new PointerEvent("pointermove", {
      bubbles: true, clientX: 124, clientY: 80, pointerId: 11,
    }));
    swipeSurface.dispatchEvent(new PointerEvent("pointerup", {
      bubbles: true, clientX: 124, clientY: 90, pointerId: 11,
    }));
    await carousel.updateComplete;
    expect(buttons[1].getAttribute("aria-selected")).toBe("true");
    swipeSurface.dispatchEvent(new PointerEvent("pointerdown", {
      bubbles: true, clientX: 120, clientY: 50, pointerId: 12,
    }));
    swipeSurface.dispatchEvent(new PointerEvent("pointermove", {
      bubbles: true, cancelable: true, clientX: 114, clientY: 50, pointerId: 12,
    }));
    swipeSurface.dispatchEvent(new PointerEvent("pointerup", {
      bubbles: true, clientX: 114, clientY: 50, pointerId: 12,
    }));
    await carousel.updateComplete;
    expect(buttons[2].getAttribute("aria-selected")).toBe("true");
    swipeSurface.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Home" }));
    await carousel.updateComplete;
    expect(buttons[0].getAttribute("aria-selected")).toBe("true");
    buttons[1].dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 100, pointerId: 1 }));
    buttons[1].dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientX: 100, pointerId: 1 }));
    await carousel.updateComplete;
    expect(buttons[1].getAttribute("aria-selected")).toBe("true");
    buttons[1].dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 100, pointerId: 2 }));
    buttons[1].dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientX: 100, pointerId: 2 }));
    expect(action).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({ action: "tap" }),
    }));
    element.remove();
  });

  it("applies configurable coverflow geometry and the flat slide effect", async () => {
    const carousel = document.createElement("mushroom-addition-entity-carousel") as HTMLElement & {
      hass: HomeAssistant;
      config: AdditionConfig;
      updateComplete: Promise<boolean>;
    };
    carousel.hass = hass;
    carousel.config = {
      type: "custom:mushroom-addition-custom-card-entity-carousel",
      carousel_effect: "coverflow",
      carousel_grab_cursor: false,
      carousel_centered_slides: false,
      carousel_slides_per_view: 2,
      carousel_coverflow_rotate: 30,
      carousel_coverflow_stretch: 10,
      carousel_coverflow_depth: 200,
      carousel_coverflow_modifier: 2,
      carousel_coverflow_slide_shadows: false,
      carousel_items: [
        { entity: "light.kitchen" },
        { entity: "scene.relax" },
        { entity: "media_player.tv" },
      ],
    };
    document.body.append(carousel);
    await carousel.updateComplete;
    const buttons = [...(carousel.shadowRoot?.querySelectorAll("button") ?? [])] as HTMLButtonElement[];
    expect(carousel.shadowRoot?.querySelector(".carousel")?.classList.contains("grab-cursor")).toBe(false);
    expect(buttons[0].style.transform).toContain("translateX(-39px)");
    expect(buttons[1].style.transform).toContain("translateX(39px)");
    expect(buttons[1].style.transform).toContain("translateZ(-400px)");
    expect(buttons[1].style.transform).toContain("rotateY(-60deg)");
    expect(buttons[1].dataset.shadow).toBe("false");
    expect(buttons[2].hidden).toBe(true);

    carousel.config = {
      ...carousel.config,
      carousel_effect: "slide",
      carousel_centered_slides: true,
      carousel_slides_per_view: 3,
    };
    await carousel.updateComplete;
    const slideButton = carousel.shadowRoot?.querySelectorAll("button")[1] as HTMLButtonElement;
    expect(slideButton.style.transform).toContain("translateZ(0px)");
    expect(slideButton.style.transform).toContain("rotateY(0deg)");
    carousel.remove();
  });

  it("exposes carousel behavior and item management through the graphical editor", async () => {
    const item = CATALOG.find((candidate) => candidate.upstreamId === "custom_card_entity_carousel")!;
    const schema = editorSchemaFor(item);
    const names = schema.flatMap((field) => field.schema?.map((nested) => nested.name) ?? [field.name]);
    expect(names).toEqual(expect.arrayContaining([
      "entity",
      "layout",
      "carousel_loop",
      "carousel_show_header",
      "carousel_show_labels",
      "carousel_initial_index",
      "carousel_effect",
      "carousel_grab_cursor",
      "carousel_centered_slides",
      "carousel_slides_per_view",
      "carousel_coverflow_rotate",
      "carousel_coverflow_stretch",
      "carousel_coverflow_depth",
      "carousel_coverflow_modifier",
      "carousel_coverflow_slide_shadows",
    ]));

    const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    editor.hass = hass;
    editor.setConfig({
      type: "custom:mushroom-addition-custom-card-entity-carousel",
      parameters: {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        coverflowEffect: {
          rotate: 12,
          stretch: 8,
          depth: 320,
          modifier: 1.5,
          slideShadows: true,
        },
      },
      carousel_items: [{ entity: "light.kitchen", name: "Lights" }],
    });
    document.body.append(editor);
    await editor.updateComplete;
    expect(editor.shadowRoot?.querySelectorAll(".carousel-item-row")).toHaveLength(1);
    expect(editor.shadowRoot?.textContent).toContain("Add carousel item");
    const form = editor.shadowRoot?.querySelector("ha-form") as HTMLElement & {
      data?: AdditionConfig;
    };
    expect(form.data).toEqual(expect.objectContaining({
      carousel_effect: "coverflow",
      carousel_grab_cursor: true,
      carousel_centered_slides: true,
      carousel_slides_per_view: "auto",
      carousel_coverflow_rotate: 12,
      carousel_coverflow_stretch: 8,
      carousel_coverflow_depth: 320,
      carousel_coverflow_modifier: 1.5,
      carousel_coverflow_slide_shadows: true,
    }));
    editor.remove();
  });
});
