import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CATALOG } from "../src/catalog";
import type { AdditionConfig, HassEntity, HomeAssistant } from "../src/types";
import "../src/index";

const baseStates: HomeAssistant["states"] = {
  "climate.heat_pump": {
    entity_id: "climate.heat_pump",
    state: "off",
    attributes: {
      friendly_name: "Air conditioner",
      current_temperature: null,
      temperature: 20,
      target_temp_step: 1,
      hvac_action: "off",
      hvac_modes: ["off", "heat", "cool", "heat_cool", "dry", "fan_only"],
    },
  },
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
  "binary_sensor.tablet": {
    entity_id: "binary_sensor.tablet",
    state: "on",
    attributes: { friendly_name: "Tablet" },
  },
  "switch.tablet_usb": {
    entity_id: "switch.tablet_usb",
    state: "on",
    attributes: { friendly_name: "USB" },
  },
  "switch.tablet_motion": {
    entity_id: "switch.tablet_motion",
    state: "off",
    attributes: { friendly_name: "Motion" },
  },
  "light.tablet_display": {
    entity_id: "light.tablet_display",
    state: "on",
    attributes: { friendly_name: "Display" },
  },
  "button.tablet_restart": {
    entity_id: "button.tablet_restart",
    state: "unknown",
    attributes: { friendly_name: "Restart" },
  },
  "switch.tablet_maintenance": {
    entity_id: "switch.tablet_maintenance",
    state: "off",
    attributes: { friendly_name: "Maintenance" },
  },
  "button.tablet_reload": {
    entity_id: "button.tablet_reload",
    state: "unknown",
    attributes: { friendly_name: "Reload" },
  },
  "sensor.tablet_ram": {
    entity_id: "sensor.tablet_ram",
    state: "747.7",
    attributes: { friendly_name: "RAM", unit_of_measurement: "MB" },
  },
  "sensor.tablet_disk": {
    entity_id: "sensor.tablet_disk",
    state: "17829.9",
    attributes: { friendly_name: "Disk", unit_of_measurement: "MB" },
  },
  "binary_sensor.tablet_power": {
    entity_id: "binary_sensor.tablet_power",
    state: "off",
    attributes: { friendly_name: "Power" },
  },
  "sensor.tablet_battery": {
    entity_id: "sensor.tablet_battery",
    state: "91",
    attributes: { friendly_name: "Battery", unit_of_measurement: "%" },
  },
  "person.joris": {
    entity_id: "person.joris",
    state: "home",
    attributes: { friendly_name: "Joris", entity_picture: "/local/joris.jpg" },
  },
  "sensor.person_battery": {
    entity_id: "sensor.person_battery",
    state: "72",
    attributes: { friendly_name: "Battery", unit_of_measurement: "%" },
  },
  "sensor.person_battery_state": {
    entity_id: "sensor.person_battery_state",
    state: "discharging",
    attributes: { friendly_name: "Battery state" },
  },
  "binary_sensor.person_driving": {
    entity_id: "binary_sensor.person_driving",
    state: "off",
    attributes: { friendly_name: "Driving" },
  },
  "zone.work": {
    entity_id: "zone.work",
    state: "0",
    attributes: { friendly_name: "Work", icon: "mdi:briefcase" },
  },
  "sensor.person_address": {
    entity_id: "sensor.person_address",
    state: "12 Main Street",
    attributes: { friendly_name: "Address" },
  },
  "sensor.person_locality": {
    entity_id: "sensor.person_locality",
    state: "Amsterdam",
    attributes: { friendly_name: "Locality", Locality: "Amsterdam" },
  },
  "sensor.person_commute": {
    entity_id: "sensor.person_commute",
    state: "24",
    attributes: { friendly_name: "Commute", unit_of_measurement: "min" },
  },
  "binary_sensor.nas": {
    entity_id: "binary_sensor.nas",
    state: "on",
    attributes: { friendly_name: "Home NAS" },
  },
  "sensor.nas_disk": {
    entity_id: "sensor.nas_disk",
    state: "25.5",
    attributes: { friendly_name: "NAS disk", unit_of_measurement: "%" },
  },
  "sensor.nas_temperature": {
    entity_id: "sensor.nas_temperature",
    state: "46",
    attributes: { friendly_name: "NAS temperature", unit_of_measurement: "°C" },
  },
  "sensor.nas_memory": {
    entity_id: "sensor.nas_memory",
    state: "15",
    attributes: { friendly_name: "NAS memory", unit_of_measurement: "%" },
  },
  "sensor.nas_cpu": {
    entity_id: "sensor.nas_cpu",
    state: "19.3",
    attributes: { friendly_name: "NAS CPU", unit_of_measurement: "%" },
  },
};

const hass = (states: HomeAssistant["states"] = baseStates): HomeAssistant => ({
  states,
  callService: vi.fn(async () => undefined),
});

interface TestCard extends HTMLElement {
  hass: HomeAssistant;
  setConfig(config: AdditionConfig): void;
  updateComplete: Promise<boolean>;
  shadowRoot: ShadowRoot;
}

const renderCard = async (
  tag: string,
  config: AdditionConfig,
  states: HomeAssistant["states"] = baseStates,
): Promise<TestCard> => {
  const element = document.createElement(tag) as TestCard;
  element.hass = hass(states);
  element.setConfig(config);
  document.body.append(element);
  await element.updateComplete;
  return element;
};

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

describe("priority local certification", () => {
  it("records browser evidence for every visible priority interaction", () => {
    const evidence = JSON.parse(readFileSync(
      join(process.cwd(), "docs", "assets", "visual-audit", "priority-local-certification.json"),
      "utf8",
    )) as {
      browserInteractions: Record<string, {
        controlsClicked: number;
        serviceCalls?: unknown[];
        actions?: unknown[];
        cardSurfaceActions?: unknown[];
      }>;
    };
    expect(evidence.browserInteractions.custom_card_heat_pump).toMatchObject({
      controlsClicked: 8,
      serviceCalls: expect.arrayContaining([
        ["climate", "set_hvac_mode", { entity_id: "climate.heat_pump", hvac_mode: "fan_only" }],
      ]),
    });
    expect(evidence.browserInteractions.custom_card_homeassistant_updates).toMatchObject({
      controlsClicked: 3,
      actions: expect.arrayContaining([
        { action: "navigate", navigation_path: "/config/updates" },
      ]),
    });
    expect(evidence.browserInteractions.custom_card_nik_nas).toMatchObject({
      controlsClicked: 1,
      actions: [
        { gesture: "tap", source: "status tile", action: "more-info", entity: "binary_sensor.hn_nas_status" },
        { gesture: "tap", source: "card surface", action: "more-info", entity: "binary_sensor.hn_nas_status" },
      ],
    });
    expect(evidence.browserInteractions.custom_card_nik_tablet).toMatchObject({
      controlsClicked: 6,
      serviceCalls: expect.arrayContaining([
        ["button", "press", { entity_id: "button.bram_tablet_reload" }],
      ]),
    });
    expect(evidence.browserInteractions.custom_card_person_info_small).toMatchObject({
      controlsClicked: 0,
      cardSurfaceActions: [
        { gesture: "tap", action: "more-info", entity: "person.joris" },
        { gesture: "hold", action: "more-info", entity: "sensor.phone_battery" },
      ],
    });
    expect(evidence.browserInteractions.custom_card_person_info).toMatchObject({
      controlsClicked: 0,
      cardSurfaceActions: [
        { gesture: "tap", action: "more-info", entity: "person.joris" },
        { gesture: "hold", action: "more-info", entity: "sensor.person_full_battery" },
      ],
    });
  });

  it("creates populated picker previews for the four visually accepted sources", () => {
    const cases = [
      ["custom_card_heat_pump", "climate.heat_pump"],
      ["custom_card_homeassistant_updates", "update.core"],
      ["custom_card_nik_nas", "binary_sensor.nas"],
      ["custom_card_nik_tablet", "binary_sensor.tablet"],
      ["custom_card_person_info", "person.joris"],
    ] as const;
    for (const [sourceId, expectedEntity] of cases) {
      const item = CATALOG.find((entry) => entry.upstreamId === sourceId)!;
      const constructor = customElements.get(item.tag) as typeof HTMLElement & {
        getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
      };
      const config = constructor.getStubConfig(hass(), Object.keys(baseStates), []);
      expect(window.customCards?.some((registration) => registration.type === item.tag && registration.preview)).toBe(true);
      expect(config).toMatchObject({
        type: `custom:${item.tag}`,
        entity: expectedEntity,
        name: baseStates[expectedEntity].attributes.friendly_name,
      });
    }
    const person = CATALOG.find((entry) => entry.upstreamId === "custom_card_person_info")!;
    const personConstructor = customElements.get(person.tag) as typeof HTMLElement & {
      getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
    };
    expect(personConstructor.getStubConfig(hass(), Object.keys(baseStates), []).variant).toBe("full");
    expect(person.variants).toContain("small");
    const nas = CATALOG.find((entry) => entry.upstreamId === "custom_card_nik_nas")!;
    const nasConstructor = customElements.get(nas.tag) as typeof HTMLElement & {
      getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
    };
    expect(nasConstructor.getStubConfig(hass(), Object.keys(baseStates), [])).toMatchObject({
      entity: "binary_sensor.nas",
      disk_entity: "sensor.nas_disk",
      temperature_entity: "sensor.nas_temperature",
      memory_entity: "sensor.nas_memory",
      cpu_entity: "sensor.nas_cpu",
      temperature_max: 100,
      memory_max: 100,
      cpu_max: 100,
      graph_span: "1d",
      chart_type: "radialBar",
    });
  });

  it.each([
    {
      type: "custom:mushroom-addition-custom-card-heat-pump",
      entity: "climate.heat_pump",
      fields: ["entity", "humidity_entity", "show_controls", "tap_action"],
    },
    {
      type: "custom:mushroom-addition-custom-card-homeassistant-updates",
      entity: "update.core",
      fields: ["entity", "ulm_card_homeassistant_core", "ulm_card_homeassistant_supervisor", "ulm_card_homeassistant_os"],
    },
    {
      type: "custom:mushroom-addition-custom-card-nik-nas",
      entity: "binary_sensor.nas",
      fields: [
        "entity", "disk_entity", "disk_name", "temperature_entity", "temperature_max",
        "memory_entity", "memory_max", "cpu_entity", "cpu_max", "graph_span", "chart_type",
      ],
    },
    {
      type: "custom:mushroom-addition-custom-card-nik-tablet",
      entity: "binary_sensor.tablet",
      fields: ["entity", "tablet_button_usb_entity", "tablet_button_display_entity", "tablet_ram_entity", "battery_entity"],
    },
    {
      type: "custom:mushroom-addition-custom-card-person-info",
      entity: "person.joris",
      variant: "full",
      fields: [
        "entity", "variant", "ulm_card_person_zone1", "ulm_address", "ulm_address_locality",
        "ulm_card_person_driving_entity", "ulm_card_person_battery_entity",
        "ulm_card_person_battery_state_entity", "ulm_card_person_commute_entity", "ulm_multiline", "hold_action",
      ],
    },
    {
      type: "custom:mushroom-addition-custom-card-person-info",
      entity: "person.joris",
      variant: "small",
      fields: ["entity", "variant", "ulm_card_person_zone1", "ulm_card_person_battery_entity", "hold_action"],
    },
  ])("round-trips $type through its graphical editor", async ({ fields, ...config }) => {
    const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
      shadowRoot: ShadowRoot;
    };
    editor.hass = hass();
    editor.setConfig(config as AdditionConfig);
    document.body.append(editor);
    await editor.updateComplete;
    const forms = [...editor.shadowRoot.querySelectorAll<HTMLElement & {
      schema: Array<{ name: string }>;
      data: AdditionConfig;
    }>("ha-form")];
    const schemaNames = forms.flatMap((form) => form.schema.map((field) => field.name));
    expect(schemaNames).toEqual(expect.arrayContaining(fields));
    const changed = vi.fn();
    editor.addEventListener("config-changed", changed);
    forms[0].dispatchEvent(new CustomEvent("value-changed", {
      bubbles: true,
      composed: true,
      detail: { value: { ...forms[0].data, name: "Edited preview" } },
    }));
    expect(changed).toHaveBeenCalledWith(expect.objectContaining({
      detail: { config: expect.objectContaining({ name: "Edited preview" }) },
    }));
  });

  it("covers Heat Pump off, active, and unsupported mode states", async () => {
    const off = await renderCard("mushroom-addition-custom-card-heat-pump", {
      type: "custom:mushroom-addition-custom-card-heat-pump",
      entity: "climate.heat_pump",
    });
    expect((off.shadowRoot.querySelector(".heat-pump-icon ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:thermostat");
    expect(off.shadowRoot.querySelector('button[aria-label="Turn on"]')).not.toBeNull();
    off.remove();

    const heatEntity: HassEntity = {
      ...baseStates["climate.heat_pump"],
      state: "heat",
      attributes: { ...baseStates["climate.heat_pump"].attributes, hvac_action: "heating" },
    };
    const active = await renderCard("mushroom-addition-custom-card-heat-pump", {
      type: "custom:mushroom-addition-custom-card-heat-pump",
      entity: "climate.heat_pump",
    }, { ...baseStates, "climate.heat_pump": heatEntity });
    expect(active.shadowRoot.querySelector('button[aria-label="Heat mode"]')?.classList.contains("is-active")).toBe(true);
    active.remove();

    const limited: HassEntity = {
      ...heatEntity,
      attributes: { ...heatEntity.attributes, hvac_modes: ["off", "heat"] },
    };
    const unsupported = await renderCard("mushroom-addition-custom-card-heat-pump", {
      type: "custom:mushroom-addition-custom-card-heat-pump",
      entity: "climate.heat_pump",
    }, { ...baseStates, "climate.heat_pump": limited });
    expect((unsupported.shadowRoot.querySelector('button[aria-label="Cool mode"]') as HTMLButtonElement).disabled).toBe(true);
  });

  it("covers Updates available, clear, and unavailable states", async () => {
    const config: AdditionConfig = {
      type: "custom:mushroom-addition-custom-card-homeassistant-updates",
      entity: "update.core",
      ulm_card_homeassistant_core: "update.core",
      ulm_card_homeassistant_supervisor: "update.supervisor",
      ulm_card_homeassistant_os: "update.operating_system",
    };
    const available = await renderCard("mushroom-addition-custom-card-homeassistant-updates", config);
    expect(available.shadowRoot.textContent).toContain("Updates available!");
    expect(available.shadowRoot.querySelector(".ha-updates-badge")).not.toBeNull();
    available.remove();

    const clearStates = Object.fromEntries(Object.entries(baseStates).map(([id, entity]) => [
      id,
      id.startsWith("update.") ? { ...entity, state: "off" } : entity,
    ]));
    const clear = await renderCard("mushroom-addition-custom-card-homeassistant-updates", config, clearStates);
    expect(clear.shadowRoot.textContent).toContain("No updates available");
    expect(clear.shadowRoot.querySelector(".ha-updates-badge")).toBeNull();
    clear.remove();

    const unavailableStates = Object.fromEntries(Object.entries(baseStates).map(([id, entity]) => [
      id,
      id.startsWith("update.") ? { ...entity, state: "unavailable" } : entity,
    ]));
    const unavailable = await renderCard("mushroom-addition-custom-card-homeassistant-updates", config, unavailableStates);
    expect((unavailable.shadowRoot.querySelector('button[aria-label="Open available update"]') as HTMLButtonElement).disabled)
      .toBe(true);
  });

  it("covers Tablet active, inactive, unavailable, and battery states", async () => {
    const config: AdditionConfig = {
      type: "custom:mushroom-addition-custom-card-nik-tablet",
      entity: "binary_sensor.tablet",
      tablet_button_usb_entity: "switch.tablet_usb",
      tablet_button_motion_entity: "switch.tablet_motion",
      tablet_button_display_entity: "light.tablet_display",
      tablet_restart_entity: "button.tablet_restart",
      tablet_maintenance_entity: "switch.tablet_maintenance",
      tablet_reload_entity: "button.tablet_reload",
      tablet_ram_entity: "sensor.tablet_ram",
      tablet_disk_entity: "sensor.tablet_disk",
      tablet_power_entity: "binary_sensor.tablet_power",
      battery_entity: "sensor.tablet_battery",
    };
    const card = await renderCard("mushroom-addition-custom-card-nik-tablet", config);
    expect(card.shadowRoot.querySelector('button[aria-label="Toggle USB"]')?.classList.contains("is-active")).toBe(true);
    expect(card.shadowRoot.querySelector('button[aria-label="Toggle motion"]')?.classList.contains("is-active")).toBe(false);
    expect((card.shadowRoot.querySelector(".nik-tablet-battery-bar i") as HTMLElement).style.width).toBe("91%");
    card.remove();

    const unavailable = await renderCard("mushroom-addition-custom-card-nik-tablet", config, {
      ...baseStates,
      "switch.tablet_usb": { ...baseStates["switch.tablet_usb"], state: "unavailable" },
    });
    expect((unavailable.shadowRoot.querySelector('button[aria-label="Toggle USB"]') as HTMLButtonElement).disabled).toBe(true);
  });

  it("hides omitted Tablet metrics and controls but keeps configured unavailable slots explicit", async () => {
    const partialConfig: AdditionConfig = {
      type: "custom:mushroom-addition-custom-card-nik-tablet",
      entity: "binary_sensor.tablet",
      tablet_power_entity: "binary_sensor.tablet_power",
      battery_entity: "sensor.tablet_battery",
    };
    const partial = await renderCard("mushroom-addition-custom-card-nik-tablet", partialConfig);
    expect(partial.shadowRoot.querySelector(".nik-tablet-controls")).toBeNull();
    expect(partial.shadowRoot.querySelectorAll(".nik-tablet-metrics > span")).toHaveLength(1);
    expect(partial.shadowRoot.textContent).toContain("Power");
    expect(partial.shadowRoot.textContent).not.toContain("RAM");
    expect(partial.shadowRoot.textContent).not.toContain("Disk");
    expect(partial.shadowRoot.textContent).not.toContain("Entity unavailable");
    expect(partial.shadowRoot.querySelector(".nik-tablet-battery-row")).not.toBeNull();
    partial.remove();

    const configuredUnavailable = await renderCard("mushroom-addition-custom-card-nik-tablet", {
      ...partialConfig,
      tablet_button_usb_entity: "switch.tablet_usb",
      tablet_ram_entity: "sensor.tablet_ram",
    }, {
      ...baseStates,
      "switch.tablet_usb": { ...baseStates["switch.tablet_usb"], state: "unavailable" },
      "sensor.tablet_ram": { ...baseStates["sensor.tablet_ram"], state: "unavailable" },
    });
    const unavailableButton = configuredUnavailable.shadowRoot.querySelector(
      'button[aria-label="Toggle USB"]',
    ) as HTMLButtonElement;
    expect(unavailableButton.disabled).toBe(true);
    expect(configuredUnavailable.shadowRoot.querySelectorAll(".nik-tablet-metrics > span")).toHaveLength(2);
    expect(configuredUnavailable.shadowRoot.querySelector(".nik-tablet-metrics .is-unavailable")).not.toBeNull();
    expect(configuredUnavailable.shadowRoot.textContent?.toLowerCase()).toContain("unavailable");
  });

  it("covers NAS online, off, unavailable, and configured ring states", async () => {
    const config: AdditionConfig = {
      type: "custom:mushroom-addition-custom-card-nik-nas",
      entity: "binary_sensor.nas",
      disk_entity: "sensor.nas_disk",
      disk_name: "Storage",
      temperature_entity: "sensor.nas_temperature",
      temperature_max: 80,
      memory_entity: "sensor.nas_memory",
      memory_max: 100,
      cpu_entity: "sensor.nas_cpu",
      cpu_max: 50,
      graph_span: "1d",
      chart_type: "radialBar",
    };
    const online = await renderCard("mushroom-addition-custom-card-nik-nas", config);
    expect(online.shadowRoot.querySelector(".custom-nik-nas")?.classList.contains("is-on")).toBe(true);
    expect(online.shadowRoot.textContent).toContain("Storage");
    expect(online.shadowRoot.querySelectorAll(".nik-nas-ring-value")).toHaveLength(3);
    online.remove();

    for (const state of ["off", "unavailable"]) {
      const collapsed = await renderCard("mushroom-addition-custom-card-nik-nas", config, {
        ...baseStates,
        "binary_sensor.nas": { ...baseStates["binary_sensor.nas"], state },
      });
      expect(collapsed.shadowRoot.querySelector(".custom-nik-nas")?.classList.contains("is-off")).toBe(true);
      expect(collapsed.shadowRoot.querySelector(".nik-nas-body")).toBeNull();
      expect(collapsed.shadowRoot.querySelectorAll(".status-tile")).toHaveLength(1);
      if (state === "unavailable") expect(collapsed.shadowRoot.textContent?.toLowerCase()).toContain("unavailable");
      collapsed.remove();
    }
  });

  it("covers compact Person Info home, driving, zone, charging, and threshold states", async () => {
    const config: AdditionConfig = {
      type: "custom:mushroom-addition-custom-card-person-info-small",
      entity: "person.joris",
      ulm_card_person_battery_entity: "sensor.person_battery",
      ulm_card_person_battery_state_entity: "sensor.person_battery_state",
      ulm_card_person_driving_entity: "binary_sensor.person_driving",
      ulm_card_person_zone1: "zone.work",
      ulm_card_battery_battery_level_danger: 15,
      ulm_card_battery_battery_level_warning: 30,
    };
    const home = await renderCard("mushroom-addition-custom-card-person-info-small", config);
    expect((home.shadowRoot.querySelector(".person-info-badge ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:home-variant");
    expect(home.shadowRoot.querySelector(".person-info-small-battery")?.classList.contains("tone-green")).toBe(true);
    home.remove();

    const driving = await renderCard("mushroom-addition-custom-card-person-info-small", config, {
      ...baseStates,
      "binary_sensor.person_driving": { ...baseStates["binary_sensor.person_driving"], state: "on" },
      "sensor.person_battery_state": { ...baseStates["sensor.person_battery_state"], state: "charging" },
    });
    expect((driving.shadowRoot.querySelector(".person-info-badge ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:car");
    expect((driving.shadowRoot.querySelector(".person-info-small-battery ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:battery-charging");
    driving.remove();

    const work = await renderCard("mushroom-addition-custom-card-person-info-small", config, {
      ...baseStates,
      "person.joris": { ...baseStates["person.joris"], state: "Work" },
      "sensor.person_battery": { ...baseStates["sensor.person_battery"], state: "10" },
    });
    expect((work.shadowRoot.querySelector(".person-info-badge ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:briefcase");
    expect(work.shadowRoot.querySelector(".person-info-small-battery")?.classList.contains("tone-red")).toBe(true);
  });

  it("covers full Person Info address, multiline, zone, driving, charging, threshold, and commute states", async () => {
    const config: AdditionConfig = {
      type: "custom:mushroom-addition-custom-card-person-info",
      entity: "person.joris",
      variant: "full",
      ulm_card_person_use_entity_picture: true,
      ulm_card_person_zone1: "zone.work",
      ulm_address: "sensor.person_address",
      ulm_address_locality: "sensor.person_locality",
      ulm_card_person_driving_entity: "binary_sensor.person_driving",
      ulm_card_person_battery_entity: "sensor.person_battery",
      ulm_card_person_battery_state_entity: "sensor.person_battery_state",
      ulm_card_person_commute_entity: "sensor.person_commute",
      ulm_multiline: true,
      ulm_card_battery_battery_level_danger: 15,
      ulm_card_battery_battery_level_warning: 30,
    };
    const addressed = await renderCard("mushroom-addition-custom-card-person-info", config);
    expect(addressed.shadowRoot.querySelector(".custom-person-info")?.classList.contains("is-multiline")).toBe(true);
    expect(addressed.shadowRoot.textContent).toContain("12 Main Street");
    expect(addressed.shadowRoot.textContent).toContain("24 min");
    expect(addressed.shadowRoot.querySelector(".person-info-detail")?.classList.contains("tone-green")).toBe(true);
    addressed.remove();

    const zone = await renderCard("mushroom-addition-custom-card-person-info", {
      ...config,
      ulm_address: undefined,
      ulm_address_locality: undefined,
      ulm_multiline: false,
    }, {
      ...baseStates,
      "person.joris": { ...baseStates["person.joris"], state: "Work" },
      "sensor.person_battery": { ...baseStates["sensor.person_battery"], state: "22" },
    });
    expect(zone.shadowRoot.querySelector(".custom-person-info")?.classList.contains("is-inline")).toBe(true);
    expect((zone.shadowRoot.querySelector(".person-info-badge ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:briefcase");
    expect(zone.shadowRoot.querySelector(".person-info-detail")?.classList.contains("tone-yellow")).toBe(true);
    zone.remove();

    const driving = await renderCard("mushroom-addition-custom-card-person-info", {
      ...config,
      ulm_address: undefined,
      ulm_address_locality: undefined,
    }, {
      ...baseStates,
      "person.joris": { ...baseStates["person.joris"], state: "away" },
      "binary_sensor.person_driving": { ...baseStates["binary_sensor.person_driving"], state: "on" },
      "sensor.person_battery": { ...baseStates["sensor.person_battery"], state: "10" },
      "sensor.person_battery_state": { ...baseStates["sensor.person_battery_state"], state: "charging" },
    });
    expect((driving.shadowRoot.querySelector(".person-info-badge ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:car");
    expect(driving.shadowRoot.textContent).toContain("Driving - away");
    expect((driving.shadowRoot.querySelector(".person-info-detail ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:battery-charging");
    expect(driving.shadowRoot.querySelector(".person-info-detail")?.classList.contains("tone-red")).toBe(true);
  });

  it("dispatches NAS status/outer actions and full Person tap/configured hold actions", async () => {
    vi.useFakeTimers();
    const nas = await renderCard("mushroom-addition-custom-card-nik-nas", {
      type: "custom:mushroom-addition-custom-card-nik-nas",
      entity: "binary_sensor.nas",
    });
    const nasActions: Array<{ action: string; config: AdditionConfig }> = [];
    nas.addEventListener("hass-action", (event) => nasActions.push((event as CustomEvent).detail));
    (nas.shadowRoot.querySelector('button[aria-label="Open NAS status"]') as HTMLButtonElement).click();
    (nas.shadowRoot.querySelector(".action-surface") as HTMLElement).click();
    expect(nasActions).toEqual([
      expect.objectContaining({ action: "tap", config: expect.objectContaining({ entity: "binary_sensor.nas" }) }),
      expect.objectContaining({ action: "tap", config: expect.objectContaining({ entity: "binary_sensor.nas" }) }),
    ]);
    nas.remove();

    const person = await renderCard("mushroom-addition-custom-card-person-info", {
      type: "custom:mushroom-addition-custom-card-person-info",
      entity: "person.joris",
      variant: "full",
      ulm_card_person_battery_entity: "sensor.person_battery",
      hold_action: { action: "more-info", entity: "sensor.person_battery" },
    });
    const personActions: Array<{ action: string; config: AdditionConfig }> = [];
    person.addEventListener("hass-action", (event) => personActions.push((event as CustomEvent).detail));
    const surface = person.shadowRoot.querySelector(".action-surface") as HTMLElement;
    surface.click();
    surface.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await vi.advanceTimersByTimeAsync(500);
    surface.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    expect(personActions).toEqual([
      expect.objectContaining({ action: "tap", config: expect.objectContaining({ entity: "person.joris" }) }),
      expect.objectContaining({ action: "hold", config: expect.objectContaining({ entity: "sensor.person_battery" }) }),
    ]);
  });

  it("dispatches compact Person Info tap and battery-targeted hold actions", async () => {
    vi.useFakeTimers();
    const card = await renderCard("mushroom-addition-custom-card-person-info-small", {
      type: "custom:mushroom-addition-custom-card-person-info-small",
      entity: "person.joris",
      ulm_card_person_battery_entity: "sensor.person_battery",
    });
    const actions: Array<{ action: string; config: AdditionConfig }> = [];
    card.addEventListener("hass-action", (event) => actions.push((event as CustomEvent).detail));
    const surface = card.shadowRoot.querySelector(".action-surface") as HTMLElement;
    surface.click();
    surface.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await vi.advanceTimersByTimeAsync(500);
    surface.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    expect(actions).toEqual([
      expect.objectContaining({ action: "tap", config: expect.objectContaining({ entity: "person.joris" }) }),
      expect.objectContaining({ action: "hold", config: expect.objectContaining({ entity: "sensor.person_battery" }) }),
    ]);
  });
});
