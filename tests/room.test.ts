import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { CATALOG } from "../src/catalog";
import { additionalEditorSchemaFor, editorSchemaFor, type EditorField } from "../src/editor-schema";
import { normalizeConfig } from "../src/helpers";
import { populatedDefaultsFor } from "../src/defaults";
import { roomBrightnessLabel, roomEntityIcon, roomItemDefaultsFor, roomLightRgb, roomSecondary, roomStatusActive, roomStatusKind, roomTemperatureLabel } from "../src/room";
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
  it("places fixed-size indicators directly after secondary text, bounded in the left column without resizing the square or sofa", async () => {
    const card = await render({ room_status: [{ entity: "binary_sensor.window" }], room_sensors: [{ entity: "light.room" }] });
    const copy = card.shadowRoot.querySelector(".room-copy")!;
    expect(copy.querySelector(".shared-presentation")?.nextElementSibling?.className).toBe("room-status");
    expect(copy.nextElementSibling?.classList.contains("ulm-icon")).toBe(true);
    const css = sharedStyles.cssText;
    expect(css).toContain(".ulm-source-room { position: relative; aspect-ratio: 1; min-height: 0; padding: 5px;");
    expect(css).toContain("width: 75%; height: 75%; margin: 0; border-radius: 50%; transform: translate(-25%, 25%);");
    expect(css).toContain(".room-main .ulm-icon ha-icon, .room-main .ulm-icon ha-state-icon { --mdc-icon-size: 56px; }");
    expect(css).toContain(".room-status { display: flex; flex: 0 0 25px; max-width: 100%; overflow: hidden;");
    expect(css).toContain(".room-status-indicator { display: grid; flex: 0 0 25px;");
    expect(css).toContain("width: 18px; height: 18px; --mdc-icon-size: 18px;");
    expect(css).not.toContain(".room-status { position: absolute;");
  });

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

  describe("Room secondary information", () => {
    const config = (extra: Partial<AdditionConfig> = {}): AdditionConfig => ({ type, entity: "light.room", ...extra });
    const home = () => {
      const result = hass();
      result.states["light.room"] = state("light.room", "on", {
        ...states["light.room"].attributes, brightness: 128, color_mode: "rgb",
      });
      return result;
    };

    it("combines selected sensor temperature with primary light brightness and updates both live", async () => {
      const card = await render(config({
        room_temperature_entity: "sensor.temperature", label_use_temperature: true, label_use_brightness: true,
      }), home());
      const label = () => card.shadowRoot.querySelector(".ulm-label")?.textContent;
      expect(label()).toBe("21 °C · 50%");
      card.hass = { ...card.hass, states: {
        ...card.hass.states,
        "sensor.temperature": state("sensor.temperature", "22.5", { unit_of_measurement: "°C" }),
        "light.room": state("light.room", "on", { brightness: 255 }),
      } };
      await card.updateComplete;
      expect(label()).toBe("22.5 °C · 100%");
      card.setConfig(config({ label_use_temperature: true }));
      await card.updateComplete;
      expect(label()).toBe("on");
      expect(label()).not.toContain("°C");
    });

    it("uses explicit feature entities before primary light and accent-light fallbacks", () => {
      const ha = home();
      ha.states["light.other"] = state("light.other", "on", { brightness: 0 });
      expect(roomSecondary(config({ label_use_brightness: true }), ha)).toBe("50%");
      expect(roomSecondary(config({ label_use_brightness: true, room_brightness_entity: "light.other" }), ha)).toBe("0%");
      expect(roomSecondary(config({ entity: "sensor.lux", label_use_brightness: true, room_light_entity: "light.room" }), ha)).toBe("50%");
      expect(roomSecondary(config({ label_use_brightness: true, room_brightness_entity: "light.missing" }), ha)).toBe("on");
    });

    it.each([
      ["unset", undefined, undefined, "21 °C · 50%"],
      ["default", "default", undefined, "21 °C · 50%"],
      ["legacy state", "state", undefined, "on · 21 °C · 50%"],
      ["state with legacy text", "state", "Old text", "on · 21 °C · 50%"],
      ["none", "none", "Hidden", undefined],
      ["custom", "custom", "Custom", "Custom"],
      ["empty custom", "custom", "", undefined],
      ["legacy custom", undefined, "Legacy", "Legacy"],
      ["name", "name", "Ignored", "Room light"],
      ["empty composed", "composed", "Ignored", undefined],
    ] as const)("respects %s precedence with both feature toggles", (_, mode, secondary, expected) => {
      const value = config({ room_temperature_entity: "sensor.temperature", label_use_brightness: true,
        label_use_temperature: true, secondary_info: mode, secondary });
      expect(roomSecondary(normalizeConfig(value), home())).toBe(expected);
    });

    it("reflects toggling either feature even with explicit legacy state mode", async () => {
      const card = await render(config({ secondary_info: "state", room_temperature_entity: "sensor.temperature",
        label_use_temperature: false, label_use_brightness: false }), home());
      const label = () => card.shadowRoot.querySelector(".ulm-label")?.textContent;
      expect(label()).toBe("on");
      for (const [temperature, brightness, expected] of [
        [true, false, "on · 21 °C"], [false, true, "on · 50%"],
        [true, true, "on · 21 °C · 50%"], [false, false, "on"],
      ] as const) {
        card.setConfig(config({ secondary_info: "state", room_temperature_entity: "sensor.temperature",
          label_use_temperature: temperature, label_use_brightness: brightness }));
        await card.updateComplete;
        expect(label()).toBe(expected);
      }
      card.setConfig(config({ secondary_info: "none", label_use_temperature: true, label_use_brightness: true }));
      await card.updateComplete;
      expect(label()).toBeUndefined();
    });

    it("validates temperature state/attributes/units without inventing Celsius", () => {
      const ha = home();
      expect(roomTemperatureLabel(ha, states["sensor.temperature"])).toBe("21 °C");
      expect(roomTemperatureLabel(ha, state("climate.room", "heat", { current_temperature: 20, unit_of_measurement: "°F" }))).toBe("20 °F");
      expect(roomTemperatureLabel(ha, state("climate.room", "heat", { current_temperature: 20 }))).toBeUndefined();
      ha.config = { unit_system: { temperature: "°C" } };
      for (const attrs of [{ current_temperature: 0 }, { temperature: "19.5" }, { device_temperature: 23 }]) {
        expect(roomTemperatureLabel(ha, state("climate.room", "heat", attrs))).toMatch(/°C$/);
      }
      expect(roomTemperatureLabel(ha, state("sensor.temp", "17", { device_class: "temperature" }))).toBe("17 °C");
      for (const value of ["on", "unavailable", "unknown", "", " ", "NaN", "Infinity"]) {
        expect(roomTemperatureLabel(ha, state("sensor.temp", value, { unit_of_measurement: "°C" }))).toBeUndefined();
      }
      for (const attrs of [{}, { unit_of_measurement: "%" }, { unit_of_measurement: "watts" }]) {
        expect(roomTemperatureLabel(ha, state("sensor.other", "20", attrs))).toBeUndefined();
      }
      expect(roomTemperatureLabel(ha, state("climate.room", "unavailable", { current_temperature: 22 }))).toBeUndefined();
      expect(roomTemperatureLabel(ha, undefined)).toBeUndefined();
    });

    it("rejects missing, invalid and unavailable brightness and never fabricates fallback labels", () => {
      for (const value of [undefined, null, true, "", " ", "bad", NaN, Infinity, -1, 256]) {
        expect(roomBrightnessLabel(state("light.room", "on", { brightness: value }))).toBeUndefined();
      }
      expect(roomBrightnessLabel(state("light.room", "unavailable", { brightness: 128 }))).toBeUndefined();
      expect(roomBrightnessLabel(state("sensor.room", "on", { brightness: 128 }))).toBeUndefined();
      expect(roomBrightnessLabel(undefined)).toBeUndefined();
      const ha = home();
      ha.states["sensor.temperature"] = state("sensor.temperature", "unavailable", { unit_of_measurement: "°C" });
      ha.states["light.room"] = state("light.room", "unknown", { brightness: 128 });
      expect(roomSecondary(config({ room_temperature_entity: "sensor.temperature", label_use_brightness: true }), ha)).toBe("unknown");
    });

    it("composes primary entity values only, omits invalid parts and refreshes when primary entity changes", async () => {
      const card = await render(config({
        name: "Not the entity name", secondary_info: "composed", secondary: "Ignored",
        room_temperature_entity: "sensor.temperature", room_brightness_entity: "light.other",
        label_use_temperature: false, label_use_brightness: false,
        room_secondary_parts: [
          { type: "text", text: "Room" }, { type: "name" }, { type: "state" }, { type: "brightness" },
          { type: "temperature" }, { type: "attribute", attribute: "color_mode" },
          { type: "attribute", attribute: "missing" }, { type: "text", text: "" },
        ],
      }), home());
      expect(card.shadowRoot.querySelector(".ulm-label")?.textContent).toBe("Room · Room light · on · 50% · rgb");
      card.hass = { ...card.hass, states: { ...card.hass.states,
        "light.room": state("light.room", "off", { friendly_name: "Updated light", brightness: 0, color_mode: "unknown" }),
      } };
      await card.updateComplete;
      expect(card.shadowRoot.querySelector(".ulm-label")?.textContent).toBe("Room · Updated light · off · 0%");
      card.setConfig({ ...config({ entity: "sensor.temperature", secondary_info: "composed" }),
        room_secondary_parts: [{ type: "temperature" }, { type: "brightness" }, { type: "attribute", attribute: "device_class" }] });
      await card.updateComplete;
      expect(card.shadowRoot.querySelector(".ulm-label")?.textContent).toBe("21 °C · temperature");
    });

    it("retains explicit timestamp modes and safe scalar attributes without falling back to feature labels", () => {
      const ha = home();
      ha.states["light.room"] = { ...ha.states["light.room"], last_changed: "2026-10-20T10:00:00Z",
        attributes: { count: 0, enabled: false, invalid: Infinity, list: ["x"], object: {}, empty: " ", missing: null } };
      expect(roomSecondary(config({ secondary_info: "last-changed", label_use_brightness: true }), ha))
        .toBe(new Date("2026-10-20T10:00:00Z").toLocaleString());
      expect(roomSecondary(config({ secondary_info: "last-updated" }), ha)).toBe("Last updated unavailable");
      expect(roomSecondary(config({ secondary_info: "composed",
        room_secondary_parts: ["count", "enabled", "invalid", "list", "object", "empty", "missing"]
          .map((attribute) => ({ type: "attribute", attribute })),
      }), ha)).toBe("0 · false");
    });

    it("exposes Room-only feature selectors and composed/custom modes without changing other schemas", () => {
      const schema = editorSchemaFor(descriptor);
      const flattenFields = (fields: EditorField[]): EditorField[] => fields.flatMap((field) => field.schema ? flattenFields(field.schema) : [field]);
      const fields = flattenFields(schema);
      expect(fields.find((field) => field.name === "room_temperature_entity")?.selector).toEqual({ entity: { domain: ["sensor", "climate"] } });
      expect(fields.find((field) => field.name === "room_light_entity")?.selector).toEqual({ entity: { domain: ["light"] } });
      expect(fields.find((field) => field.name === "room_brightness_entity")).toBeUndefined();
      expect(fields.find((field) => field.name === "secondary_info")?.selector).toMatchObject({ select: {
        options: expect.arrayContaining([{ value: "custom", label: expect.any(String) }, { value: "composed", label: expect.any(String) }]),
      } });
      for (const item of CATALOG.filter((item) => item.upstreamId !== "card_room")) {
        const others = flattenFields(editorSchemaFor(item));
        expect(others.find((field) => field.name === "room_temperature_entity")).toBeUndefined();
        const options = others.find((field) => field.name === "secondary_info")?.selector?.select as { options?: { value: string }[] } | undefined;
        expect(options?.options?.some((option) => ["custom", "composed"].includes(option.value))).not.toBe(true);
      }
    });

    it("adds, configures, reorders and removes composed parts in the graphical Content editor", async () => {
      const element = await editor(config({ secondary_info: "composed" }));
      const section = () => element.shadowRoot.querySelector<HTMLElement>(".room-secondary-editor")!;
      expect(section().closest("ha-expansion-panel")?.textContent).toContain("Content");
      let saved: AdditionConfig | undefined;
      element.addEventListener("config-changed", (event) => { saved = (event as CustomEvent).detail.config; });
      for (let index = 0; index < 2; index++) {
        section().querySelector<HTMLButtonElement>(".add")!.click();
        await element.updateComplete;
      }
      const rows = () => section().querySelectorAll<HTMLElement>(".item-row");
      change(selector(rows()[0], "select"), "text");
      await element.updateComplete;
      change(selector(rows()[0], "text"), "Hello");
      change(selector(rows()[1], "select"), "attribute");
      await element.updateComplete;
      expect(selector(rows()[1], "attribute").selector).toEqual({ attribute: { entity_id: "light.room" } });
      change(selector(rows()[1], "attribute"), "brightness");
      await element.updateComplete;
      expect(rows()[0].querySelector<HTMLButtonElement>(".move-up")!.disabled).toBe(true);
      expect(rows()[1].querySelector<HTMLButtonElement>(".move-down")!.disabled).toBe(true);
      rows()[1].querySelector<HTMLButtonElement>(".move-up")!.click();
      await element.updateComplete;
      expect(saved?.room_secondary_parts).toEqual([{ type: "attribute", attribute: "brightness" }, { type: "text", text: "Hello" }]);
      rows()[0].querySelector<HTMLButtonElement>(".move-down")!.click();
      await element.updateComplete;
      rows()[0].querySelector<HTMLButtonElement>(".remove")!.click();
      await element.updateComplete;
      expect(saved?.room_secondary_parts).toEqual([{ type: "attribute", attribute: "brightness" }]);
      expect(normalizeConfig(saved!).room_secondary_parts).toEqual(saved?.room_secondary_parts);
    });
  });

  describe("Room accent opt-out", () => {
    it("uses one selected light for brightness and accent and migrates brightness-only configs", async () => {
      const home = hass();
      home.states["light.room"] = state("light.room", "on", { brightness: 255, rgb_color: [12, 130, 240] });
      home.states["light.other"] = state("light.other", "on", { brightness: 128, rgb_color: [200, 20, 30] });
      const cfg = { entity: "light.room", room_light_entity: "light.other", room_brightness_entity: "light.room",
        label_use_brightness: true, ulm_card_dynamic_color: true };
      const card = await render(cfg, home);
      expect(card.shadowRoot.querySelector(".room-copy")?.textContent).toContain("50%");
      expect(card.shadowRoot.querySelector(".dynamic-color")?.getAttribute("style")).toContain("--room-rgb:200,20,30");
      expect(normalizeConfig({ type, ...cfg }).room_brightness_entity).toBeUndefined();
      const legacy = normalizeConfig({ type, entity: "sensor.temperature", room_brightness_entity: "light.other" });
      expect(legacy.room_light_entity).toBe("light.other");
      const element = await editor({ room_brightness_entity: "light.other" });
      const forms = [...element.shadowRoot.querySelectorAll<HTMLElement & { data: AdditionConfig }>("ha-form")];
      expect(forms.some(form => form.data.room_light_entity === "light.other")).toBe(true);
      expect(forms.every(form => form.data.room_brightness_entity === undefined)).toBe(true);
      let saved: AdditionConfig | undefined;
      element.addEventListener("config-changed", event => { saved = (event as CustomEvent).detail.config; });
      forms[0].dispatchEvent(new CustomEvent("value-changed", { detail: { value: { room_light_entity: undefined } } }));
      await element.updateComplete;
      expect(saved).toHaveProperty("room_light_entity", undefined);
      expect(saved).not.toHaveProperty("room_brightness_entity");
    });

    it("gives small status indicators the same neutral surface as square sensor buttons", () => {
      expect(sharedStyles.cssText).toContain("background: var(--addition-neutral-background); cursor: pointer; }");
      expect(sharedStyles.cssText).not.toContain("color: var(--secondary-text-color); background: var(--card-background-color); cursor: pointer;");
    });
    it("keeps Room neutral when disabled and clears accents on config/entity changes", async () => {
      const item = descriptor;
      const config: AdditionConfig = {
        type: `custom:${item.tag}`, entity: "light.room",
        room_light_entity: "light.room",
        ulm_card_dynamic_color: false,
      };
      const card = await mount(item.tag, config);
      const surface = () => card.shadowRoot.querySelector(".action-surface")!;
      const neutral = () => {
        expect(surface().classList.contains("light-on")).toBe(false);
        expect(surface().classList.contains("is-on")).toBe(false);
        expect(surface().classList.contains("dynamic-color")).toBe(false);
        expect(surface().getAttribute("style")).not.toContain("--room-rgb");
      };
      neutral();
      card.setConfig({ ...config, ulm_card_dynamic_color: true });
      await card.updateComplete;
      expect(surface().classList.contains("dynamic-color")).toBe(true);
      expect(surface().getAttribute("style")).toContain("--room-rgb:12,130,240");
      card.setConfig(config);
      await card.updateComplete;
      neutral();
      card.setConfig({ ...config, ulm_card_dynamic_color: true });
      await card.updateComplete;
      card.hass = { ...card.hass, states: { ...card.hass.states, "light.room": state("light.room", "off", { rgb_color: [12, 130, 240] }) } };
      await card.updateComplete;
      neutral();
      card.hass = { ...card.hass, states: { ...card.hass.states, "light.room": state("light.room", "on") } };
      await card.updateComplete;
      neutral();
    });
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
  it("persists button order without materializing defaults or changing actions/icons, including legacy entity lists", async () => {
    const items: AdditionItemConfig[] = [
      { entity: "light.room", icon: "mdi:star", name: "Legacy", color: "red", tap_action: { action: "navigate", navigation_path: "/room" }, hold_action: { action: "none" } },
      { entity: "sensor.temperature", icon_type: "entity-picture", double_tap_action: { action: "more-info" } },
      { entity: "binary_sensor.window" },
    ];
    const element = await editor({ room_sensors: items });
    let saved: AdditionConfig | undefined;
    element.addEventListener("config-changed", (event) => { saved = (event as CustomEvent).detail.config; });
    const rows = () => element.shadowRoot.querySelectorAll<HTMLElement>(".item-editor:not(.room-status-editor) .item-row");
    expect(rows()[0].querySelector<HTMLButtonElement>(".move-up")!.disabled).toBe(true);
    expect(rows()[2].querySelector<HTMLButtonElement>(".move-down")!.disabled).toBe(true);
    rows()[0].querySelector<HTMLButtonElement>(".move-down")!.click();
    await element.updateComplete;
    expect(saved?.room_sensors).toEqual([items[1], items[0], items[2]]);
    rows()[2].querySelector<HTMLButtonElement>(".move-up")!.click();
    await element.updateComplete;
    expect(normalizeConfig(saved!).room_sensors).toEqual([items[1], items[2], items[0]]);
    element.setConfig(saved!);
    await element.updateComplete;
    expect(selector(rows()[2], "entity").value).toBe("light.room");
    const card = await render(saved);
    expect([...card.shadowRoot.querySelectorAll<HTMLButtonElement>(".room-sensor")].map((button) => button.getAttribute("aria-label")))
      .toEqual(["sensor.temperature", "Window", "Legacy"]);
    const actions = actionsFor(card);
    card.shadowRoot.querySelectorAll<HTMLButtonElement>(".room-sensor")[2].click();
    expect(actions[0].config.tap_action).toEqual(items[0].tap_action);
    const legacy = await editor({ entities: ["light.room", "sensor.temperature"] });
    legacy.addEventListener("config-changed", (event) => { saved = (event as CustomEvent).detail.config; });
    legacy.shadowRoot.querySelector<HTMLButtonElement>(".item-actions .move-down")!.click();
    await legacy.updateComplete;
    expect(saved?.room_sensors).toEqual([{ entity: "sensor.temperature" }, { entity: "light.room" }]);
    expect(saved?.entities).toBeUndefined();
    const scenes = await editor({ type: "custom:mushroom-addition-card-scenes", scene_items: [{ entity: "scene.relax" }] });
    expect(scenes.shadowRoot.querySelector(".move-up")).toBeNull();
  });

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
