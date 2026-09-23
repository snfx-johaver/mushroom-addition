import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CATALOG } from "../src/catalog";
import { editorSchemaFor } from "../src/editor-schema";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import "../src/index";

const states: HomeAssistant["states"] = {
  "device_tracker.phone": { entity_id: "device_tracker.phone", state: "home", attributes: { friendly_name: "Phone" } },
  "device_tracker.phone_ble": { entity_id: "device_tracker.phone_ble", state: "not_home", attributes: { friendly_name: "Phone Bluetooth" } },
  "sensor.temperature": { entity_id: "sensor.temperature", state: "23", attributes: { friendly_name: "Temperature", unit_of_measurement: "°C" } },
  "sensor.humidity": { entity_id: "sensor.humidity", state: "67", attributes: { friendly_name: "Humidity", unit_of_measurement: "%" } },
  "light.one": { entity_id: "light.one", state: "on", attributes: { friendly_name: "Light one", battery: 15, brightness: 128, rgb_color: [255, 180, 90] } },
  "light.two": { entity_id: "light.two", state: "off", attributes: { friendly_name: "Light two" } },
  "group.lights": { entity_id: "group.lights", state: "on", attributes: { friendly_name: "Lights", entity_id: ["light.one", "light.two"] } },
  "binary_sensor.door": { entity_id: "binary_sensor.door", state: "on", attributes: { friendly_name: "Door" } },
  "group.doors": { entity_id: "group.doors", state: "on", attributes: { friendly_name: "Doors", entity_id: ["binary_sensor.door"] } },
  "input_datetime.cat_litter": { entity_id: "input_datetime.cat_litter", state: "2026-09-21 12:00:00", attributes: { friendly_name: "Cat Litter", has_date: true, has_time: true } },
  "input_datetime.time_only": { entity_id: "input_datetime.time_only", state: "20:53:00", attributes: { friendly_name: "Timer", has_date: false, has_time: true, hour: 20, minute: 53, second: 0 } },
  "lock.front": { entity_id: "lock.front", state: "locked", attributes: { friendly_name: "Front lock" } },
  "sensor.lock_battery": { entity_id: "sensor.lock_battery", state: "4", attributes: { friendly_name: "Lock battery", unit_of_measurement: "%" } },
  "light.room": { entity_id: "light.room", state: "on", attributes: { friendly_name: "Room light", brightness: 128, rgb_color: [255, 190, 100] } },
  "climate.room": { entity_id: "climate.room", state: "heat", attributes: { friendly_name: "Room climate" } },
  "cover.room": { entity_id: "cover.room", state: "closed", attributes: { friendly_name: "Room cover" } },
  "input_boolean.welcome": { entity_id: "input_boolean.welcome", state: "off", attributes: { friendly_name: "Welcome" } },
  "weather.home": { entity_id: "weather.home", state: "sunny", attributes: { friendly_name: "Weather" } },
  "person.user": { entity_id: "person.user", state: "home", attributes: { friendly_name: "Lewis" } },
};

interface TestCard extends HTMLElement {
  hass: HomeAssistant;
  setConfig(config: AdditionConfig): void;
  updateComplete: Promise<boolean>;
  shadowRoot: ShadowRoot;
}

const renderCard = async (
  id: string,
  config: Omit<AdditionConfig, "type">,
  stateOverrides = states,
  callService = vi.fn(async () => undefined),
): Promise<TestCard> => {
  const tag = `mushroom-addition-${id.replaceAll("_", "-")}`;
  const card = document.createElement(tag) as TestCard;
  card.hass = { states: stateOverrides, callService };
  card.setConfig({ type: `custom:${tag}`, ...config });
  document.body.append(card);
  await card.updateComplete;
  return card;
};

const item = (sourceId: string) => CATALOG.find((entry) => entry.upstreamId === sourceId)!;

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

describe("second custom batch certification", () => {
  it("records matched browser geometry and interaction evidence", () => {
    const evidence = JSON.parse(readFileSync(join(
      process.cwd(), "docs", "assets", "visual-audit", "second-custom-batch-local-certification.json",
    ), "utf8")) as {
      geometry: Record<string, { width: number; regions: Record<string, number> }>;
      browserInteractions: Record<string, { controlsClicked: number; serviceCalls?: unknown[]; cardActions?: unknown[] }>;
    };
    expect(evidence.geometry.custom_card_device_tracker.regions[".tracker-badge"]).toBe(2);
    expect(evidence.geometry.custom_card_drealine_roomview.regions[".room-view-actions button"]).toBeGreaterThan(0);
    expect(evidence.geometry.custom_card_esh_welcome.regions[".esh-welcome-items button"]).toBe(5);
    expect(evidence.browserInteractions.custom_card_esh_welcome.controlsClicked).toBe(8);
    expect(evidence.browserInteractions.custom_card_eraycetinay_lock.serviceCalls).toEqual([
      ["lock", "unlock", { entity_id: "lock.front_door" }],
      ["lock", "open", { entity_id: "lock.front_door" }],
    ]);
  });

  it("provides dedicated defaults, schemas, and editor round trips for exactly six sources", async () => {
    const fields: Record<string, string[]> = {
      custom_card_device_tracker: ["ulm_custom_card_device_tracker_tracker_1_entity", "ulm_custom_card_device_tracker_tracker_2_entity"],
      custom_card_drealine_roomview: ["group_lights", "group_motions", "group_doors", "group_windows", "group_outlets", "group_tv", "group_water", "group_windows_shutters", "temperature", "humidity"],
      custom_card_eraycetinay_elapsed_time: ["entity"],
      custom_card_eraycetinay_lock: ["ulm_custom_card_eraycetinay_lock_tap_control", "ulm_custom_card_eraycetinay_lock_only_open", "ulm_custom_card_eraycetinay_lock_battery_level"],
      custom_card_esh_room: ["ulm_custom_card_esh_room_light_entity", "ulm_custom_card_esh_room_climate_entity", "ulm_custom_card_esh_room_cover_entity"],
      custom_card_esh_welcome: ["ulm_card_esh_welcome_collapse", "ulm_weather", "nav_1", "icon_1", "name_1", "color_1", "nav_5", "icon_5", "name_5", "color_5"],
    };
    for (const [sourceId, expected] of Object.entries(fields)) {
      const descriptor = item(sourceId);
      expect(editorSchemaFor(descriptor).map(({ name }) => name)).toEqual(expect.arrayContaining(expected));
      const constructor = customElements.get(descriptor.tag) as typeof HTMLElement & {
        getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
      };
      const config = constructor.getStubConfig({ states, callService: vi.fn() }, Object.keys(states), []);
      expect(config.type).toBe(`custom:${descriptor.tag}`);

      const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
        hass: HomeAssistant; setConfig(config: AdditionConfig): void; updateComplete: Promise<boolean>; shadowRoot: ShadowRoot;
      };
      editor.hass = { states, callService: vi.fn() };
      editor.setConfig(config);
      document.body.append(editor);
      await editor.updateComplete;
      const form = editor.shadowRoot.querySelector<HTMLElement & { data: AdditionConfig }>("ha-form")!;
      const changed = vi.fn();
      editor.addEventListener("config-changed", changed);
      form.dispatchEvent(new CustomEvent("value-changed", {
        bubbles: true, composed: true, detail: { value: { ...form.data, name: "Round trip" } },
      }));
      expect(changed).toHaveBeenCalledWith(expect.objectContaining({
        detail: { config: expect.objectContaining({ name: "Round trip" }) },
      }));
      editor.remove();
    }
  });

  it("renders two independent truthful device tracker badges", async () => {
    const card = await renderCard("custom-card-device-tracker", {
      entity: "device_tracker.phone",
      ulm_custom_card_device_tracker_tracker_1_entity: "device_tracker.phone",
      ulm_custom_card_device_tracker_tracker_1_type: "lan",
      ulm_custom_card_device_tracker_tracker_2_entity: "device_tracker.phone_ble",
      ulm_custom_card_device_tracker_tracker_2_type: "bluetooth",
    });
    expect(card.shadowRoot.querySelector(".tracker-one.is-home ha-icon")?.getAttribute("icon")).toBeNull();
    expect((card.shadowRoot.querySelector(".tracker-one ha-icon") as HTMLElement & { icon: string }).icon).toBe("mdi:lan-connect");
    expect((card.shadowRoot.querySelector(".tracker-two ha-icon") as HTMLElement & { icon: string }).icon).toBe("mdi:bluetooth-off");
  });

  it("uses Drealine named groups with truthful counts, more-info, and source double-tap toggles", async () => {
    const card = await renderCard("custom-card-drealine-roomview", {
      group_lights: "group.lights", group_doors: "group.doors",
      temperature: "sensor.temperature", humidity: "sensor.humidity",
    });
    expect(card.shadowRoot.textContent).toContain("23 °C");
    expect(card.shadowRoot.textContent).toContain("67 %");
    expect(card.shadowRoot.querySelectorAll(".room-view-status button")).toHaveLength(2);
    const actions = vi.fn();
    card.addEventListener("hass-action", actions);
    card.shadowRoot.querySelector<HTMLButtonElement>(".room-view-status button")!.click();
    card.shadowRoot.querySelector<HTMLButtonElement>(".room-view-actions button")!
      .dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    expect(actions.mock.calls.map(([event]) => (event as CustomEvent).detail.config)).toEqual([
      expect.objectContaining({ entity: "group.doors", tap_action: { action: "more-info" } }),
      expect.objectContaining({ entity: "group.lights", tap_action: { action: "toggle" } }),
    ]);
  });

  it("matches elapsed-time date and time-only source formatting without controls", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 23, 22, 23, 0));
    const dated = await renderCard("custom-card-eraycetinay-elapsed-time", { entity: "input_datetime.cat_litter" });
    expect(dated.shadowRoot.textContent).toContain("2 days 10 hours ago");
    expect(dated.shadowRoot.querySelector("button")).toBeNull();
    dated.remove();
    const timeOnly = await renderCard("custom-card-eraycetinay-elapsed-time", { entity: "input_datetime.time_only" });
    expect(timeOnly.shadowRoot.textContent).toContain("1 hour 30 minutes ago");
  });

  it("supports lock more-info, lock/unlock/open, and door plus battery warnings", async () => {
    const callService = vi.fn(async () => undefined);
    const base = {
      entity: "lock.front",
      ulm_custom_card_eraycetinay_lock_door_open: "binary_sensor.door",
      ulm_custom_card_eraycetinay_lock_battery_level: "sensor.lock_battery",
    };
    const info = await renderCard("custom-card-eraycetinay-lock", base);
    const actions = vi.fn();
    info.addEventListener("hass-action", actions);
    info.shadowRoot.querySelector<HTMLButtonElement>(".eray-lock-control")!.click();
    expect(actions).toHaveBeenCalledWith(expect.objectContaining({
      detail: { config: expect.objectContaining({ entity: "lock.front", tap_action: { action: "more-info" } }), action: "tap" },
    }));
    expect(info.shadowRoot.querySelector(".door-badge")).not.toBeNull();
    expect(info.shadowRoot.querySelector(".battery-badge.is-critical")).not.toBeNull();
    info.remove();

    const control = await renderCard("custom-card-eraycetinay-lock", {
      ...base, ulm_custom_card_eraycetinay_lock_tap_control: true,
    }, states, callService);
    control.shadowRoot.querySelector<HTMLButtonElement>(".eray-lock-control")!.click();
    control.remove();
    const open = await renderCard("custom-card-eraycetinay-lock", {
      ...base, ulm_custom_card_eraycetinay_lock_tap_control: true,
      ulm_custom_card_eraycetinay_lock_only_open: true,
    }, states, callService);
    open.shadowRoot.querySelector<HTMLButtonElement>(".eray-lock-control")!.click();
    expect(callService.mock.calls).toEqual([
      ["lock", "unlock", { entity_id: "lock.front" }],
      ["lock", "open", { entity_id: "lock.front" }],
    ]);
  });

  it("exposes and operates Esh Room light, climate, and cover semantic slots", async () => {
    const room = await renderCard("custom-card-esh-room", {
      entity: "light.room", name: "Living room",
      ulm_custom_card_esh_room_light_entity: "light.room",
      ulm_custom_card_esh_room_climate_entity: "climate.room",
      ulm_card_dynamic_color: true,
    });
    const actions = vi.fn();
    room.addEventListener("hass-action", actions);
    [...room.shadowRoot.querySelectorAll<HTMLButtonElement>(".esh-room-control")].forEach((control) => control.click());
    expect(actions.mock.calls.map(([event]) => (event as CustomEvent).detail.config.entity)).toEqual(["light.room", "climate.room"]);
    room.remove();
    const cover = await renderCard("custom-card-esh-room", {
      entity: "light.room",
      ulm_custom_card_esh_room_light_entity: "light.room",
      ulm_custom_card_esh_room_cover_entity: "cover.room",
    });
    expect(cover.shadowRoot.querySelector(".esh-room-control.cover")).not.toBeNull();
  });

  it("makes every Esh Welcome topbar and semantic navigation control functional", async () => {
    const callService = vi.fn(async () => undefined);
    const card = await renderCard("custom-card-esh-welcome", {
      entity: "person.user", name: "Lewis",
      ulm_card_esh_welcome_collapse: "input_boolean.welcome", ulm_weather: "weather.home",
      nav_1: "house", icon_1: "mdi:home", name_1: "House", color_1: "blue",
      nav_2: "lights", icon_2: "mdi:lightbulb", name_2: "Lights", color_2: "yellow",
      nav_3: "security", icon_3: "mdi:shield", name_3: "Secure", color_3: "green",
      nav_4: "climate", icon_4: "mdi:radiator", name_4: "Climate", color_4: "purple",
      nav_5: "network", icon_5: "mdi:flask", name_5: "Lab", color_5: "red",
    }, states, callService);
    const actions = vi.fn();
    card.addEventListener("hass-action", actions);
    [...card.shadowRoot.querySelectorAll<HTMLButtonElement>(".esh-welcome-toolbar button, .esh-welcome-items button")]
      .forEach((control) => control.click());
    expect(callService).toHaveBeenCalledWith("input_boolean", "toggle", { entity_id: "input_boolean.welcome" });
    expect(actions.mock.calls.map(([event]) => (event as CustomEvent).detail.config.tap_action)).toEqual([
      { action: "more-info" },
      { action: "navigate", navigation_path: "/config/dashboard" },
      { action: "navigate", navigation_path: "house" },
      { action: "navigate", navigation_path: "lights" },
      { action: "navigate", navigation_path: "security" },
      { action: "navigate", navigation_path: "climate" },
      { action: "navigate", navigation_path: "network" },
    ]);
  });
});
