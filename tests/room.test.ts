import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { CATALOG } from "../src/catalog";
import { additionalEditorSchemaFor, editorSchemaFor, type EditorField } from "../src/editor-schema";
import { normalizeConfig } from "../src/helpers";
import { populatedDefaultsFor } from "../src/defaults";
import { roomEntityIcon, roomItemDefaultsFor, roomLightRgb, roomStatusActive, roomStatusKind } from "../src/room";
import { sharedStyles } from "../src/styles";
import type { AdditionConfig, AdditionItemConfig, HassEntity, HomeAssistant, RoomStatusKind } from "../src/types";

const type = "custom:mushroom-addition-card-room";
const descriptor = CATALOG.find((item) => item.upstreamId === "card_room")!;
type Element = HTMLElement & {
  hass: HomeAssistant;
  setConfig(config: AdditionConfig): void;
  updateComplete: Promise<boolean>;
  shadowRoot: ShadowRoot;
};
type Selector = HTMLElement & { value: unknown; selector: Record<string, unknown> };
const state = (id: string, value: string, attributes: HassEntity["attributes"] = {}): HassEntity =>
  ({ entity_id: id, state: value, attributes });
const states = {
  "sensor.temperature": state("sensor.temperature", "21", { unit_of_measurement: "°C", device_class: "temperature" }),
  "sensor.lux": state("sensor.lux", "80", { device_class: "illuminance" }),
  "binary_sensor.window": state("binary_sensor.window", "on", { device_class: "window", friendly_name: "Window" }),
  "binary_sensor.door": state("binary_sensor.door", "off", { device_class: "door" }),
  "binary_sensor.motion": state("binary_sensor.motion", "off", { device_class: "occupancy" }),
  "binary_sensor.water": state("binary_sensor.water", "on", { device_class: "moisture" }),
  "binary_sensor.smoke": state("binary_sensor.smoke", "on", { device_class: "smoke" }),
  "light.room": state("light.room", "on", { rgb_color: [12, 130, 240], friendly_name: "Room light" }),
  "light.other": state("light.other", "on", { icon: "mdi:lamp", entity_picture: "/light.jpg" }),
  "media_player.room": state("media_player.room", "playing"),
  "scene.relax": state("scene.relax", "scening", { friendly_name: "Relax" }),
};
const hass = (): HomeAssistant => ({ states: { ...states }, language: "en", callService: vi.fn(async () => undefined) });
const mount = async (tag: string, config: Partial<AdditionConfig> = {}, home = hass()) => {
  const element = document.createElement(tag) as Element;
  element.hass = home;
  element.setConfig({ type, entity: "sensor.temperature", ...config });
  document.body.append(element);
  await element.updateComplete;
  return element;
};
const render = (config: Partial<AdditionConfig> = {}, home = hass()) => mount(descriptor.tag, config, home);
const editor = (config: Partial<AdditionConfig> = {}) => mount("mushroom-addition-editor", config);
const change = (selector: Selector, value: unknown) => selector.dispatchEvent(new CustomEvent("value-changed", {
  bubbles: true, composed: true, detail: { value },
}));
const selector = (row: HTMLElement, key: string): Selector =>
  [...row.querySelectorAll<Selector>("ha-selector")].find((item) => key in item.selector)!;
const flatten = (fields: EditorField[]): string[] => fields.flatMap((field) => field.schema ? flatten(field.schema) : field.name);
const actionsFor = (card: Element) => {
  const actions: Array<{ action: string; config: AdditionConfig }> = [];
  card.addEventListener("hass-action", (event) => actions.push((event as CustomEvent).detail));
  return actions;
};
afterEach(() => { document.body.replaceChildren(); vi.useRealTimers(); });

describe("Room status indicators", () => {
  it("renders at most four distinct small indicators without altering action buttons or adding visible labels", async () => {
    const card = await render({
      room_status: (["window", "door", "water", "smoke", "motion"] as RoomStatusKind[])
        .map((kind) => ({ entity: `binary_sensor.${kind}`, kind })),
      room_sensors: [{ entity: "light.room" }],
    });
    expect(card.shadowRoot.querySelectorAll(".room-status-indicator")).toHaveLength(4);
    expect(card.shadowRoot.querySelectorAll(".room-sensor")).toHaveLength(1);
    expect(card.shadowRoot.querySelector(".room-status")?.textContent?.trim()).toBe("");
    expect(card.shadowRoot.querySelector(".room-status-indicator")?.getAttribute("aria-label"))
      .toContain("Window: Triggered");
    const actions = actionsFor(card);
    card.shadowRoot.querySelector<HTMLButtonElement>(".room-status-indicator")!.click();
    expect(actions).toHaveLength(1);
    expect(actions[0]).toMatchObject({ action: "tap", config: { entity: "binary_sensor.window", tap_action: { action: "more-info" } } });
  });

  it("clears alert classes when inactive, unknown, missing or unavailable and exposes state", async () => {
    const card = await render({ room_status: [
      { entity: "binary_sensor.water", kind: "water" }, { entity: "binary_sensor.smoke", kind: "smoke" },
    ] });
    expect(card.shadowRoot.querySelectorAll(".room-status-indicator.is-active")).toHaveLength(2);
    for (const value of ["off", "unknown", "unavailable"]) {
      card.hass = { ...card.hass, states: {
        ...card.hass.states,
        "binary_sensor.water": state("binary_sensor.water", value),
        "binary_sensor.smoke": state("binary_sensor.smoke", value),
      } };
      await card.updateComplete;
      expect(card.shadowRoot.querySelectorAll(".room-status-indicator.is-active")).toHaveLength(0);
      const icons = [...card.shadowRoot.querySelectorAll<HTMLButtonElement>(".room-status-indicator")];
      expect(icons.every((item) => item.disabled === (value !== "off"))).toBe(true);
      expect(icons[0].getAttribute("aria-label")).toContain(value === "off" ? "Inactive" : "Unavailable");
    }
    card.hass = { ...card.hass, states: {} };
    await card.updateComplete;
    expect(card.shadowRoot.querySelectorAll(".room-status-indicator.is-unavailable:disabled")).toHaveLength(2);
    const actions = actionsFor(card);
    card.shadowRoot.querySelector<HTMLButtonElement>(".room-status-indicator")!.click();
    expect(actions).toHaveLength(0);
  });

  it.each([
    ["window", "window", "open"], ["door", "door", "open"], ["motion", "motion", "detected"],
    ["occupancy", "motion", "occupied"], ["presence", "motion", "home"],
    ["moisture", "water", "wet"], ["fire", "smoke", "fire"], ["smoke", "smoke", "on"],
  ] as const)("handles %s class and fallback icon", (deviceClass, kind, active) => {
    const entity = state("binary_sensor.status", active, { device_class: deviceClass });
    expect(roomStatusKind(entity)).toBe(kind);
    expect(roomStatusActive(entity, kind)).toBe(true);
    expect(roomStatusActive({ ...entity, state: "off" }, kind)).toBe(false);
    expect(roomEntityIcon(entity)).not.toContain("circle-small");
  });

  it("limits animation to water/smoke triggered classes and disables it for reduced motion", () => {
    const css = sharedStyles.cssText;
    expect(css).toContain(".room-status-indicator.kind-water.is-active { color: rgb(var(--ulm-blue)); animation:");
    expect(css).toContain(".room-status-indicator.kind-smoke.is-active { color: rgb(var(--ulm-red)); animation:");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain(".room-status-indicator.kind-water.is-active, .room-status-indicator.kind-smoke.is-active { animation: none; }");
    expect(css).not.toContain(".room-status-indicator.is-inactive { animation");
  });

  it("adds, edits, previews, caps and deletes indicators under Features independently from buttons", async () => {
    const element = await editor({ room_sensors: [{ entity: "light.room" }] });
    const section = () => element.shadowRoot.querySelector<HTMLElement>(".room-status-editor")!;
    expect(section().closest("ha-expansion-panel")?.textContent).toContain("Features");
    let config: AdditionConfig | undefined;
    element.addEventListener("config-changed", (event) => { config = (event as CustomEvent).detail.config; });
    for (let i = 0; i < 4; i++) {
      section().querySelector<HTMLButtonElement>("button.add")!.click();
      await element.updateComplete;
      const row = section().querySelectorAll<HTMLElement>(".item-row")[i];
      change(selector(row, "entity"), i === 0 ? "binary_sensor.water" : "binary_sensor.door");
      await element.updateComplete;
    }
    expect(config?.room_status).toHaveLength(4);
    expect(config?.room_status?.[0]).toEqual({ entity: "binary_sensor.water", kind: "water" });
    expect(config?.room_sensors).toEqual([{ entity: "light.room" }]);
    expect(section().querySelector<HTMLButtonElement>("button.add")!.disabled).toBe(true);
    const row = section().querySelector<HTMLElement>(".item-row")!;
    expect((row.querySelector("ha-icon") as HTMLElement & { icon: string }).icon).toBe("mdi:water-alert");
    change(selector(row, "select"), "smoke");
    await element.updateComplete;
    expect(config?.room_status?.[0].kind).toBe("smoke");
    section().querySelector<HTMLButtonElement>(".item-actions button")!.click();
    await element.updateComplete;
    expect(config?.room_status).toHaveLength(3);
    expect(section().querySelector<HTMLButtonElement>("button.add")!.disabled).toBe(false);
    const excessive = await editor({ room_status: Array.from({ length: 9 }, () => ({ entity: "binary_sensor.water", kind: "water" })) });
    expect(excessive.shadowRoot.querySelectorAll(".room-status-editor .item-row")).toHaveLength(4);
  });
});

describe("Room RGB accent", () => {
  it("requires opt-in and an on RGB light, with fallback to the main light", async () => {
    const card = await render({ entity: "light.room" });
    expect(card.shadowRoot.querySelector(".dynamic-color")).toBeNull();
    card.setConfig({ type, entity: "light.room", ulm_card_dynamic_color: true });
    await card.updateComplete;
    expect(card.shadowRoot.querySelector(".dynamic-color")?.getAttribute("style")).toContain("--room-rgb:12,130,240");
    card.setConfig({ type, entity: "sensor.temperature", room_light_entity: "light.room", ulm_card_dynamic_color: true });
    await card.updateComplete;
    expect(card.shadowRoot.querySelector(".dynamic-color")).not.toBeNull();
    for (const entity of [
      state("light.room", "off", { rgb_color: [12, 130, 240] }),
      state("light.room", "unavailable", { rgb_color: [12, 130, 240] }),
      state("light.room", "on"),
      state("light.room", "on", { rgb_color: [999, -1, NaN] }),
    ]) {
      card.hass = { ...card.hass, states: { ...card.hass.states, "light.room": entity } };
      await card.updateComplete;
      expect(card.shadowRoot.querySelector(".dynamic-color")).toBeNull();
      expect(card.shadowRoot.querySelector(".ulm-source-room")?.getAttribute("style")).not.toContain("--room-rgb");
    }
    expect(card.hass.callService).not.toHaveBeenCalled();
  });

  it("handles RGB groups, off members, cycles and missing entities without stale color", () => {
    const home = hass();
    home.states["light.group"] = state("light.group", "on", { entity_id: ["light.off", "light.group", "light.room"] });
    home.states["light.off"] = state("light.off", "off", { rgb_color: [255, 0, 0] });
    expect(roomLightRgb(home, home.states["light.group"])).toEqual([12, 130, 240]);
    expect(roomLightRgb(home, undefined)).toBeUndefined();
    home.states["light.group"] = { ...home.states["light.group"], state: "off" };
    expect(roomLightRgb(home, home.states["light.group"])).toBeUndefined();
  });
});

describe("Room-only helper removal and button controls", () => {
  it("does not expose or act on helper config, but preserves explicit actions and other card helper behavior", () => {
    const names = flatten([...editorSchemaFor(descriptor), ...additionalEditorSchemaFor(descriptor)]);
    expect(names).toContain("room_light_entity");
    expect(names).toContain("ulm_card_dynamic_color");
    for (const key of ["input_select_entity", "input_select_option", "ulm_input_select", "ulm_input_select_option"]) expect(names).not.toContain(key);
    const config = { type, input_select_entity: "input_select.room", input_select_option: "Room" };
    expect(normalizeConfig(config).double_tap_action).toBeUndefined();
    expect(normalizeConfig({ ...config, ulm_input_select: "input_select.other", ulm_input_select_option: "Other" }).double_tap_action).toBeUndefined();
    const action = { action: "navigate", navigation_path: "/room" };
    expect(normalizeConfig({ ...config, double_tap_action: action }).double_tap_action).toEqual(action);
    expect(normalizeConfig({ ...config, type: "custom:mushroom-addition-custom-card-roomview" }).double_tap_action)
      .toMatchObject({ perform_action: "input_select.select_option" });
    expect(populatedDefaultsFor(descriptor, hass(), "light.room")).toMatchObject({ room_status: [], ulm_card_dynamic_color: false, room_light_entity: "light.room" });
  });

  it("materializes Room defaults on entity selection, refreshes inferred fields, preserves overrides and scene names", async () => {
    const element = await editor({ room_sensors: [] });
    let config: AdditionConfig | undefined;
    element.addEventListener("config-changed", (event) => { config = (event as CustomEvent).detail.config; });
    const section = () => element.shadowRoot.querySelector<HTMLElement>(".item-editor:not(.room-status-editor)")!;
    section().querySelector<HTMLButtonElement>("button.add")!.click();
    await element.updateComplete;
    const row = () => section().querySelector<HTMLElement>(".item-row")!;
    change(selector(row(), "entity"), "sensor.lux");
    await element.updateComplete;
    expect(config?.room_sensors?.[0]).toEqual(roomItemDefaultsFor(hass(), "sensor.lux"));
    expect(config?.room_sensors?.[0].icon).toBe("mdi:brightness-5");
    change(selector(row(), "entity"), "light.other");
    await element.updateComplete;
    expect(config?.room_sensors?.[0]).toMatchObject({ icon: "mdi:lamp", icon_type: "entity-picture", tap_action: { action: "toggle" }, active_state: "on", color: "blue" });
    change(selector(row(), "icon"), "mdi:star");
    await element.updateComplete;
    change(selector(row(), "entity"), "media_player.room");
    await element.updateComplete;
    expect(config?.room_sensors?.[0]).toMatchObject({ icon: "mdi:star", icon_type: "icon", active_state: "playing" });
    expect(section().textContent).not.toContain("Custom name");
    const scenes = await editor({ type: "custom:mushroom-addition-card-scenes", scene_items: [{ entity: "scene.relax" }] });
    expect(scenes.shadowRoot.textContent).toContain("Custom name");
    expect([...scenes.shadowRoot.querySelectorAll<Selector>("ha-selector")].some((field) => field.value === "Relax")).toBe(true);
  });

  it("keeps legacy names accessible only, uses proper domain/class icons and gives icons/pictures fixed nonshrinking sizes", async () => {
    const card = await render({ room_sensors: [
      { entity: "sensor.lux", name: "Legacy lux" },
      { entity: "light.other", icon_type: "entity-picture" },
      { entity: "binary_sensor.window" },
    ] });
    expect(card.shadowRoot.querySelector<HTMLButtonElement>(".room-sensor")!.getAttribute("aria-label")).toBe("Legacy lux");
    expect(card.shadowRoot.textContent).not.toContain("Legacy lux");
    const icon = card.shadowRoot.querySelector(".room-sensor ha-icon") as HTMLElement & { icon: string };
    expect(icon.icon).toBe("mdi:brightness-5");
    expect(card.shadowRoot.querySelector(".room-sensor-picture")?.getAttribute("style")).toContain("/light.jpg");
    expect(sharedStyles.cssText).toContain(".room-sensor > ha-icon { flex: 0 0 24px; width: 24px; height: 24px; --mdc-icon-size: 24px;");
    expect(sharedStyles.cssText).toContain(".room-sensor .room-sensor-label {");
    expect(sharedStyles.cssText).not.toContain(".room-sensor span {");
  });

  it("isolates Room action-button tap, hold, double tap and keyboard from the parent, and cancels disconnected timers", async () => {
    vi.useFakeTimers();
    const item: AdditionItemConfig = {
      entity: "light.room", tap_action: { action: "toggle" },
      hold_action: { action: "more-info" }, double_tap_action: { action: "navigate", navigation_path: "/room" },
    };
    const card = await render({ room_sensors: [item], tap_action: { action: "navigate", navigation_path: "/parent" } });
    const actions = actionsFor(card);
    const button = card.shadowRoot.querySelector<HTMLButtonElement>(".room-sensor")!;
    const click = (detail: number) => button.dispatchEvent(new MouseEvent("click", { bubbles: true, detail }));
    click(1);
    vi.advanceTimersByTime(300);
    expect(actions.map((action) => action.action)).toEqual(["tap"]);
    actions.length = 0;
    click(1); click(2);
    button.dispatchEvent(new MouseEvent("dblclick", { bubbles: true, detail: 2 }));
    vi.advanceTimersByTime(600);
    expect(actions.map((action) => action.action)).toEqual(["double_tap"]);
    actions.length = 0;
    button.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    vi.advanceTimersByTime(500);
    button.dispatchEvent(new Event("pointerup", { bubbles: true }));
    click(1);
    vi.advanceTimersByTime(600);
    expect(actions.map((action) => action.action)).toEqual(["hold"]);
    actions.length = 0;
    button.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(actions.map((action) => action.action)).toEqual(["tap"]);
    expect(actions[0].config.entity).toBe("light.room");
    actions.length = 0;
    button.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    card.remove();
    vi.advanceTimersByTime(1000);
    expect(actions).toHaveLength(0);
  });
});
