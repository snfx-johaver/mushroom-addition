import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CATALOG } from "../src/catalog";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import "../src/index";

const baseStates: HomeAssistant["states"] = {
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
  "person.resident": {
    entity_id: "person.resident",
    state: "home",
    attributes: { friendly_name: "Resident", entity_picture: "/local/resident.jpg" },
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
      join(process.cwd(), "tests", "fixtures", "visual", "priority-local-certification.json"),
      "utf8",
    )) as {
      browserInteractions: Record<string, {
        controlsClicked: number;
        serviceCalls?: unknown[];
        actions?: unknown[];
        cardSurfaceActions?: unknown[];
      }>;
    };
    expect(evidence.browserInteractions.custom_card_nas_metrics).toMatchObject({
      controlsClicked: 1,
      actions: [
        { gesture: "tap", source: "status tile", action: "more-info", entity: "binary_sensor.hn_nas_status" },
        { gesture: "tap", source: "card surface", action: "more-info", entity: "binary_sensor.hn_nas_status" },
      ],
    });
    expect(evidence.browserInteractions.custom_card_tablet).toMatchObject({
      controlsClicked: 6,
      serviceCalls: expect.arrayContaining([
        ["button", "press", { entity_id: "button.hallway_tablet_reload" }],
      ]),
    });
  });

  it("creates populated picker previews for the remaining visually accepted sources", () => {
    const cases = [
      ["custom_card_nas_metrics", "binary_sensor.nas"],
      ["custom_card_tablet", "binary_sensor.tablet"],
    ] as const;
    for (const [sourceId, expectedEntity] of cases) {
      const item = CATALOG.find((entry) => entry.upstreamId === sourceId)!;
      const constructor = customElements.get(item.tag) as typeof HTMLElement & {
        getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
      };
      const config = constructor.getStubConfig(hass(), Object.keys(baseStates), []);
      expect(window.customCards?.some((registration) =>
        registration.type === item.tag && registration.preview === false)).toBe(true);
      expect(config).toMatchObject({
        type: `custom:${item.tag}`,
        entity: expectedEntity,
        name: baseStates[expectedEntity].attributes.friendly_name,
      });
    }
    const nas = CATALOG.find((entry) => entry.upstreamId === "custom_card_nas_metrics")!;
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
    });
    expect(nas.name).toBe("NAS");
  });

  it.each([
    {
      type: "custom:mushroom-addition-custom-card-nas-metrics",
      entity: "binary_sensor.nas",
      fields: [
        "entity", "disk_entity", "disk_name", "temperature_entity", "temperature_max",
        "memory_entity", "memory_max", "cpu_entity", "cpu_max",
      ],
    },
    {
      type: "custom:mushroom-addition-custom-card-tablet",
      entity: "binary_sensor.tablet",
      fields: ["entity", "tablet_button_usb_entity", "tablet_button_display_entity", "tablet_ram_entity", "battery_entity"],
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

  it("covers Tablet active, inactive, unavailable, and battery states", async () => {
    const config: AdditionConfig = {
      type: "custom:mushroom-addition-custom-card-tablet",
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
    const card = await renderCard("mushroom-addition-custom-card-tablet", config);
    expect(card.shadowRoot.querySelector('button[aria-label="Toggle USB"]')?.classList.contains("is-active")).toBe(true);
    expect(card.shadowRoot.querySelector('button[aria-label="Toggle motion"]')?.classList.contains("is-active")).toBe(false);
    expect((card.shadowRoot.querySelector(".tablet-battery-bar i") as HTMLElement).style.width).toBe("91%");
    card.remove();

    const unavailable = await renderCard("mushroom-addition-custom-card-tablet", config, {
      ...baseStates,
      "switch.tablet_usb": { ...baseStates["switch.tablet_usb"], state: "unavailable" },
    });
    expect((unavailable.shadowRoot.querySelector('button[aria-label="Toggle USB"]') as HTMLButtonElement).disabled).toBe(true);
  });

  it("hides omitted Tablet metrics and controls but keeps configured unavailable slots explicit", async () => {
    const partialConfig: AdditionConfig = {
      type: "custom:mushroom-addition-custom-card-tablet",
      entity: "binary_sensor.tablet",
      tablet_power_entity: "binary_sensor.tablet_power",
      battery_entity: "sensor.tablet_battery",
    };
    const partial = await renderCard("mushroom-addition-custom-card-tablet", partialConfig);
    expect(partial.shadowRoot.querySelector(".tablet-controls")).toBeNull();
    expect(partial.shadowRoot.querySelectorAll(".tablet-metrics > span")).toHaveLength(1);
    expect(partial.shadowRoot.textContent).toContain("Power");
    expect(partial.shadowRoot.textContent).not.toContain("RAM");
    expect(partial.shadowRoot.textContent).not.toContain("Disk");
    expect(partial.shadowRoot.textContent).not.toContain("Entity unavailable");
    expect(partial.shadowRoot.querySelector(".tablet-battery-row")).not.toBeNull();
    partial.remove();

    const configuredUnavailable = await renderCard("mushroom-addition-custom-card-tablet", {
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
    expect(configuredUnavailable.shadowRoot.querySelectorAll(".tablet-metrics > span")).toHaveLength(2);
    expect(configuredUnavailable.shadowRoot.querySelector(".tablet-metrics .is-unavailable")).not.toBeNull();
    expect(configuredUnavailable.shadowRoot.textContent?.toLowerCase()).toContain("unavailable");
  });

  it("covers NAS online, off, unavailable, and configured ring states", async () => {
    const config: AdditionConfig = {
      type: "custom:mushroom-addition-custom-card-nas-metrics",
      entity: "binary_sensor.nas",
      disk_entity: "sensor.nas_disk",
      disk_name: "Storage",
      temperature_entity: "sensor.nas_temperature",
      temperature_max: 80,
      memory_entity: "sensor.nas_memory",
      memory_max: 100,
      cpu_entity: "sensor.nas_cpu",
      cpu_max: 50,
    };
    const online = await renderCard("mushroom-addition-custom-card-nas-metrics", config);
    expect(online.shadowRoot.querySelector(".custom-nas-metrics")?.classList.contains("is-on")).toBe(true);
    expect(online.shadowRoot.textContent).toContain("Storage");
    expect(online.shadowRoot.querySelectorAll(".nas-metrics-ring-value")).toHaveLength(3);
    online.remove();

    for (const state of ["off", "unavailable"]) {
      const collapsed = await renderCard("mushroom-addition-custom-card-nas-metrics", config, {
        ...baseStates,
        "binary_sensor.nas": { ...baseStates["binary_sensor.nas"], state },
      });
      expect(collapsed.shadowRoot.querySelector(".custom-nas-metrics")?.classList.contains("is-off")).toBe(true);
      expect(collapsed.shadowRoot.querySelector(".nas-metrics-body")).toBeNull();
      expect(collapsed.shadowRoot.querySelectorAll(".status-tile")).toHaveLength(1);
      if (state === "unavailable") expect(collapsed.shadowRoot.textContent?.toLowerCase()).toContain("unavailable");
      collapsed.remove();
    }
  });

  it("dispatches NAS status and outer actions", async () => {
    vi.useFakeTimers();
    const nas = await renderCard("mushroom-addition-custom-card-nas-metrics", {
      type: "custom:mushroom-addition-custom-card-nas-metrics",
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
  });
});
