import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { CATALOG } from "../src/catalog";
import { editorSchemaFor, type EditorField } from "../src/editor-schema";
import { sharedStyles } from "../src/styles";
import type { AdditionConfig, HassEntity, HomeAssistant, RoomViewDevice } from "../src/types";

const descriptor = CATALOG.find((item) => item.upstreamId === "custom_card_roomview")!;
const type = `custom:${descriptor.tag}`;
type Card = HTMLElement & {
  hass: HomeAssistant;
  setConfig(config: AdditionConfig): void;
  updateComplete: Promise<boolean>;
  shadowRoot: ShadowRoot;
};
const state = (id: string, value: string, attributes: HassEntity["attributes"] = {}): HassEntity =>
  ({ entity_id: id, state: value, attributes });
const base: AdditionConfig = {
  type, entity: "person.joris", temperature: "sensor.temperature", humidity: "sensor.humidity",
  group_doors: "group.doors", group_windows: "binary_sensor.window",
  group_motions: "binary_sensor.motion", group_water: "binary_sensor.water",
  group_lights: "group.lights", group_windows_shutters: "cover.shutters",
  group_outlets: "switch.outlet", group_tv: "media_player.tv",
};
const render = async (config: Partial<AdditionConfig> = {}, states: HomeAssistant["states"] = {}) => {
  const card = document.createElement(descriptor.tag) as Card;
  card.hass = {
    callService: vi.fn(async () => undefined),
    states: {
      "person.joris": state("person.joris", "home", { friendly_name: "Joris", entity_picture: "/joris.jpg" }),
      "sensor.temperature": state("sensor.temperature", "21", { friendly_name: "Room temperature", unit_of_measurement: "°C" }),
      "sensor.humidity": state("sensor.humidity", "55", { unit_of_measurement: "%" }),
      "group.doors": state("group.doors", "on", { entity_id: ["binary_sensor.door1", "binary_sensor.door2"] }),
      "binary_sensor.door1": state("binary_sensor.door1", "on", { battery: 10 }),
      "binary_sensor.door2": state("binary_sensor.door2", "on"),
      "binary_sensor.window": state("binary_sensor.window", "off"),
      "binary_sensor.motion": state("binary_sensor.motion", "off"),
      "binary_sensor.water": state("binary_sensor.water", "off"),
      "group.lights": state("group.lights", "on", { entity_id: ["light.one", "light.two"] }),
      "light.one": state("light.one", "on"),
      "light.two": state("light.two", "on"),
      "cover.shutters": state("cover.shutters", "closed"),
      "switch.outlet": state("switch.outlet", "off"),
      "media_player.tv": state("media_player.tv", "playing"),
      ...states,
    },
  };
  card.setConfig({ ...base, ...config });
  document.body.append(card);
  await card.updateComplete;
  const actions: Array<{ config: AdditionConfig; action: string }> = [];
  card.addEventListener("hass-action", (event) => actions.push((event as CustomEvent).detail));
  const root = card.shadowRoot;
  const button = (name: string) => root.querySelector<HTMLButtonElement>(`button[aria-label="${name}"]`)!;
  return { card, root, actions, button };
};
const flatten = (fields: EditorField[]): EditorField[] =>
  fields.flatMap((field) => field.schema ? flatten(field.schema) : [field]);
const click = (button: HTMLButtonElement, detail = 1) =>
  button.dispatchEvent(new MouseEvent("click", { bubbles: true, detail }));
const pointer = (button: HTMLButtonElement, type: string) =>
  button.dispatchEvent(new Event(type, { bubbles: true }));

afterEach(() => { document.body.replaceChildren(); vi.useRealTimers(); });

describe("Roomview independent headers and sections", () => {
  it("keeps the compact card appearance with independent climate defaults", async () => {
    const { root } = await render({ icon: "mdi:account", icon_type: "entity-picture" });
    expect(root.querySelector(".card-heading .ulm-name")?.textContent).toBe("Joris");
    expect(root.querySelector(".card-heading .entity-picture")?.getAttribute("style")).toContain("/joris.jpg");
    expect(root.querySelector(".room-view-summary .ulm-name")?.textContent).toBe("21 °C");
    expect(root.querySelector(".room-view-summary .ulm-label")?.textContent).toBe("55 %");
    expect(root.querySelector(".room-view-summary ha-icon")?.getAttribute("icon")).not.toBe("mdi:account");
    expect((root.querySelector(".room-view-summary ha-icon") as HTMLElement & { icon: string }).icon).toBe("mdi:home-variant-outline");
    expect(root.querySelectorAll("section, h3")).toHaveLength(0);
    expect(root.querySelectorAll(".room-view-status .room-view-indicator")).toHaveLength(2);
    expect(root.querySelector(".room-view-status")?.textContent?.replace(/\s/g, "")).toBe("21");
    expect(root.querySelector(".room-view-status i")?.textContent).toBe("2");
    expect(root.querySelector(".room-view-actions i")?.textContent).toBe("2");
    expect(root.querySelector('.room-view-actions button[aria-label="Television"]')).not.toBeNull();
    expect(root.querySelector(".room-view-actions span")).toBeNull();
  });

  it("supports independent names, icons, information selectors and custom secondary text", async () => {
    const { root } = await render({
      name: "Main name", icon: "mdi:account", primary_info: "name", secondary_info: "state",
      climate_name: "Indoor climate", climate_icon: "mdi:thermostat",
      climate_primary_info: "name", climate_secondary: "Comfortable",
    });
    expect(root.querySelector(".card-heading .ulm-name")?.textContent).toBe("Main name");
    expect(root.querySelector(".card-heading .ulm-label")?.textContent).toBe("home");
    expect(root.querySelector(".room-view-summary .ulm-name")?.textContent).toBe("Indoor climate");
    expect(root.querySelector(".room-view-summary .ulm-label")?.textContent).toBe("Comfortable");
    expect((root.querySelector(".room-view-summary ha-icon") as HTMLElement & { icon: string }).icon).toBe("mdi:thermostat");
    const independent = await render({ climate_name: "Climate only", climate_icon: "mdi:snowflake" });
    expect(independent.root.querySelector(".card-heading .ulm-name")?.textContent).toBe("Joris");
    expect((independent.root.querySelector(".card-heading ha-icon") as HTMLElement & { icon: string }).icon)
      .not.toBe("mdi:snowflake");
  });

  it("handles composed climate names using HA's entity-name formatter", async () => {
    const { card, root } = await render({
      climate_name: [{ type: "area" }, { type: "entity" }],
      climate_primary_info: "name", climate_secondary_info: "state",
    });
    const formatEntityName = vi.fn((entity: HassEntity) => entity.entity_id === "sensor.temperature" ? "Living room Temperature" : "Joris");
    card.hass = { ...card.hass, formatEntityName };
    await card.updateComplete;
    expect(root.querySelector(".room-view-summary .ulm-name")?.textContent).toBe("Living room Temperature");
    expect(root.querySelector(".room-view-summary .ulm-label")?.textContent).toBe("21 °C");
    expect(formatEntityName).toHaveBeenCalledWith(card.hass.states["sensor.temperature"], [{ type: "area" }, { type: "entity" }]);
  });

  it("supports climate entity icon/picture and explicit none independently of main presentation", async () => {
    const { root } = await render({ climate_icon_type: "entity-picture" }, {
      "sensor.temperature": state("sensor.temperature", "22", { entity_picture: "/climate.jpg" }),
    });
    expect(root.querySelector(".room-view-summary .entity-picture")?.getAttribute("style")).toContain("/climate.jpg");
    const hidden = await render({
      climate_icon_type: "none", climate_primary_info: "none", climate_secondary_info: "none",
      climate_secondary: "Should not show",
    });
    expect(hidden.root.querySelector(".room-view-summary ha-icon")).toBeNull();
    expect(hidden.root.querySelectorAll(".room-view-summary .ulm-name, .room-view-summary .ulm-label")).toHaveLength(0);
    expect(hidden.root.querySelector(".card-heading .ulm-name")?.textContent).toBe("Joris");
    const entityIcon = await render({}, {
      "sensor.temperature": state("sensor.temperature", "22", { icon: "mdi:thermostat-box" }),
    });
    expect((entityIcon.root.querySelector(".room-view-summary ha-icon") as HTMLElement & { icon: string }).icon).toBe("mdi:thermostat-box");
  });

  it("surfaces missing, unknown and unavailable sensors including missing group members without a false all-clear", async () => {
    const { root, button, actions } = await render({
      group_windows: "binary_sensor.missing", group_motions: "binary_sensor.unknown",
      group_water: "binary_sensor.unavailable", group_tv: "media_player.missing",
    }, {
      "binary_sensor.unknown": state("binary_sensor.unknown", "unknown"),
      "binary_sensor.unavailable": state("binary_sensor.unavailable", "unavailable"),
      "group.doors": state("group.doors", "off", { entity_id: ["binary_sensor.door1", "binary_sensor.missing_door"] }),
    });
    expect(root.querySelector(".room-view-warning")?.getAttribute("aria-label")).toBe("5 unavailable");
    expect(root.querySelectorAll(".room-view-status .is-unavailable")).toHaveLength(5);
    expect(root.querySelector(".room-view-clear")).toBeNull();
    expect(button("Television").disabled).toBe(true);
    button("Television").click();
    expect(actions).toHaveLength(0);
  });

  it("omits unconfigured climate without adding visible empty-state sections", async () => {
    const { root } = await render({
      temperature: undefined, humidity: undefined, group_doors: undefined, group_windows: undefined,
      group_motions: undefined, group_water: undefined, group_lights: undefined,
      group_windows_shutters: undefined, group_outlets: undefined, group_tv: undefined,
    });
    expect(root.querySelector('[aria-label="Climate"]')).toBeNull();
    expect(root.querySelectorAll(".room-view-empty, section, h3")).toHaveLength(0);
    expect(root.querySelector(".room-view-clear")).not.toBeNull();
  });
});

describe("Roomview device gestures", () => {
  it.each([
    ["lights", "Lights", "group.lights"], ["shutters", "Shutters", "cover.shutters"],
    ["outlets", "Outlets", "switch.outlet"], ["tv", "Television", "media_player.tv"],
  ] as const)("gives %s safe single tap and legacy double toggle without parent leakage", async (_key, label, entity) => {
    vi.useFakeTimers();
    const { button, actions } = await render();
    click(button(label));
    expect(actions).toHaveLength(0);
    vi.advanceTimersByTime(301);
    expect(actions).toHaveLength(1);
    expect(actions[0]).toMatchObject({ config: { entity, tap_action: { action: "more-info" } }, action: "tap" });
    actions.length = 0;
    click(button(label));
    click(button(label), 2);
    button(label).dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    vi.advanceTimersByTime(501);
    expect(actions).toHaveLength(1);
    expect(actions[0]).toMatchObject({ config: { entity, double_tap_action: { action: "toggle" } }, action: "double_tap" });
  });

  it.each(["lights", "shutters", "outlets", "tv"] as RoomViewDevice[])("honors independent %s custom actions and explicit action entity", async (device) => {
    vi.useFakeTimers();
    const labels = { lights: "Lights", shutters: "Shutters", outlets: "Outlets", tv: "Television" };
    const { button, actions } = await render({
      [`${device}_tap_action`]: { action: "navigate", navigation_path: "/lovelace/room", entity: "sensor.target" },
      [`${device}_hold_action`]: { action: "perform-action", perform_action: "script.room", target: { entity_id: "script.room" } },
      [`${device}_double_tap_action`]: { action: "url", url_path: "https://example.com" },
    });
    const control = button(labels[device]);
    click(control);
    vi.advanceTimersByTime(301);
    expect(actions[0]).toMatchObject({ action: "tap", config: { entity: "sensor.target", tap_action: { action: "navigate" } } });
    pointer(control, "pointerdown");
    vi.advanceTimersByTime(501);
    pointer(control, "pointerup");
    click(control);
    vi.advanceTimersByTime(501);
    expect(actions).toHaveLength(2);
    expect(actions[1]).toMatchObject({ action: "hold", config: { hold_action: { perform_action: "script.room", target: { entity_id: "script.room" } } } });
    pointer(control, "pointerdown");
    pointer(control, "pointerup");
    click(control);
    click(control, 2);
    control.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    vi.advanceTimersByTime(501);
    expect(actions).toHaveLength(3);
    expect(actions[2]).toMatchObject({ action: "double_tap", config: { double_tap_action: { action: "url" } } });
  });

  it("respects explicit none and isolates keyboard, pointer cancellation, status and climate controls", async () => {
    vi.useFakeTimers();
    const { root, actions, button } = await render({
      lights_tap_action: { action: "none" }, lights_hold_action: { action: "none" },
      lights_double_tap_action: { action: "none" },
    });
    const lights = button("Lights");
    click(lights);
    pointer(lights, "pointerdown");
    vi.advanceTimersByTime(501);
    pointer(lights, "pointerup");
    lights.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    lights.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    vi.advanceTimersByTime(501);
    expect(actions).toHaveLength(0);
    for (const key of ["Enter", " "]) {
      button("Shutters").dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
    }
    expect(actions).toHaveLength(2);
    expect(actions.every((action) => action.config.entity === "cover.shutters")).toBe(true);
    actions.length = 0;
    pointer(button("Outlets"), "pointerdown");
    pointer(button("Outlets"), "pointercancel");
    vi.advanceTimersByTime(501);
    click(button("Outlets"));
    expect(actions).toHaveLength(0);
    root.querySelector<HTMLButtonElement>(".room-view-status button")!.click();
    root.querySelector<HTMLButtonElement>(".room-view-summary")!.click();
    expect(actions.map((action) => action.config.entity)).toEqual(["group.doors", "sensor.temperature"]);
  });

  it("retains hold arbitration across hass updates and cancels timers when removed", async () => {
    vi.useFakeTimers();
    const { card, button, actions } = await render();
    pointer(button("Lights"), "pointerdown");
    card.hass = { ...card.hass };
    await card.updateComplete;
    vi.advanceTimersByTime(501);
    pointer(button("Lights"), "pointerup");
    click(button("Lights"));
    vi.advanceTimersByTime(501);
    expect(actions.map((action) => action.action)).toEqual(["hold"]);
    pointer(button("Lights"), "pointerdown");
    card.remove();
    vi.advanceTimersByTime(501);
    expect(actions).toHaveLength(1);
  });
});

describe("Roomview graphical editor and responsive structure", () => {
  it("keeps every presentation field and selector binding, grouped per device", () => {
    const fields = flatten(editorSchemaFor(descriptor));
    const names = fields.map((field) => field.name);
    for (const name of ["entity", "name", "icon", "icon_type", "primary_info", "secondary_info",
      "temperature", "humidity", "climate_name", "climate_icon", "climate_icon_type",
      "climate_primary_info", "climate_secondary_info", "climate_secondary",
      "group_lights", "group_windows_shutters", "group_tv", "group_outlets",
      "group_motions", "group_doors", "group_windows", "group_water"]) expect(names).toContain(name);
    expect(fields.find((field) => field.name === "climate_name")?.selector).toEqual({ entity_name: {} });
    expect(fields.find((field) => field.name === "climate_name")?.context).toEqual({ entity: "temperature" });
    for (const device of ["lights", "shutters", "outlets", "tv"]) {
      for (const gesture of ["tap", "hold", "double_tap"]) {
        expect(fields.find((field) => field.name === `${device}_${gesture}_action`)?.selector).toEqual({ ui_action: {} });
      }
    }
  });

  it("roundtrips climate and device actions across distinct editor sections", async () => {
    const editor = document.createElement("mushroom-addition-editor") as Card;
    editor.hass = { states: {}, callService: vi.fn(async () => undefined) };
    editor.setConfig({
      ...base, climate_name: [{ type: "area" }], climate_icon_type: "none",
      lights_tap_action: { action: "none" }, tv_hold_action: { action: "navigate", navigation_path: "/tv" },
    });
    document.body.append(editor);
    await editor.updateComplete;
    const panels = [...editor.shadowRoot.querySelectorAll("ha-expansion-panel")];
    expect(panels.map((panel) => panel.querySelector(".section-header span")?.textContent)).toEqual([
      "Primary entity presentation", "Climate", "Sensor status", "Device controls", "Card interactions",
    ]);
    const forms = [...editor.shadowRoot.querySelectorAll("ha-form")] as Array<HTMLElement & {
      schema: EditorField[]; data: AdditionConfig;
    }>;
    expect(flatten(forms[0].schema).map((field) => field.name)).toContain("primary_info");
    expect(flatten(forms[0].schema).map((field) => field.name)).not.toContain("climate_name");
    expect(flatten(forms[1].schema).map((field) => field.name)).toContain("climate_icon_type");
    expect(flatten(forms[2].schema).map((field) => field.name)).toEqual(["group_motions", "group_doors", "group_windows", "group_water"]);
    expect(flatten(forms[3].schema).map((field) => field.name).slice(0, 4))
      .toEqual(["group_lights", "lights_tap_action", "lights_hold_action", "lights_double_tap_action"]);
    const changes = vi.fn();
    editor.addEventListener("config-changed", changes);
    forms[1].dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: { ...forms[1].data, climate_secondary: "Comfort", climate_primary_info: "name" } },
    }));
    expect(changes.mock.calls[0][0].detail.config).toMatchObject({
      entity: "person.joris", temperature: "sensor.temperature", humidity: "sensor.humidity",
      climate_name: [{ type: "area" }], climate_icon_type: "none", climate_secondary: "Comfort",
      lights_tap_action: { action: "none" }, tv_hold_action: { action: "navigate", navigation_path: "/tv" },
    });
  });

  it("retains the compact icon rows with accessible labels", async () => {
    const { root } = await render({ name: "A long main header that must truncate" });
    for (const selector of [".room-view-status", ".room-view-actions"]) {
      expect(root.querySelector(selector)?.closest("section")).toBeNull();
      for (const control of root.querySelectorAll(`${selector} button`)) {
        expect(control.getAttribute("aria-label")).toBeTruthy();
        expect(control.querySelector("span")).toBeNull();
      }
    }
    const styles = sharedStyles.cssText;
    expect(styles).toMatch(/\.room-view-actions\s*\{[^}]*display: flex/);
    expect(styles).toMatch(/\.room-view-actions button\s*\{[^}]*height: 44px/);
    expect(styles).toContain(".custom-room-view button:focus-visible");
  });
});
