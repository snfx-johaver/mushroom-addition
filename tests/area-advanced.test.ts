import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AREA_TAG, AREA_FEATURE_TAG, MushroomAreaAdvancedCard, MushroomAreaAdvancedEditor,
  MushroomAreaControlsAdvanced, defaultAreaAction, mergeNativeAreaEdit, nativeAreaConfig,
  type AreaAdvancedConfig, type AreaFeature,
} from "../src/area-advanced";
import type { ActionConfig, HomeAssistant } from "../src/types";
import { MUSHROOM_AREA_TAG, MushroomAreaCard, applyMushroomAreaPresentation } from "../src/area-mushroom";

class NativeEditor extends HTMLElement {
  hass?: HomeAssistant;
  config?: AreaAdvancedConfig;
  _config?: AreaAdvancedConfig;
  private baseSchema = [{ name: "content", schema: [{ name: "sensor_classes" }] }];
  _schema = () => this.baseSchema;
  _computeLabelCallback = (field: { name: string }) => field.name;
  get updateComplete() {
    Object.assign(this.shadowRoot!.querySelector("ha-form")!, {
      schema: this._schema(), data: { ...this._config }, computeLabel: this._computeLabelCallback,
    });
    return Promise.resolve(true);
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = "<ha-form></ha-form>";
  }
  setConfig = vi.fn((config: AreaAdvancedConfig) => {
    this.config = config;
    this._config = { ...config };
    Object.assign(this.shadowRoot!.querySelector("ha-form")!, {
      schema: [{ name: "content", schema: [{ name: "sensor_classes" }] }], data: config,
    });
  });
}
class NativeArea extends HTMLElement {
  hass?: HomeAssistant;
  layout?: unknown;
  config?: AreaAdvancedConfig;
  setConfig = vi.fn((config: AreaAdvancedConfig) => { this.config = config; });
  getCardSize = vi.fn(() => 4);
  getGridOptions = vi.fn(() => ({ columns: 6, rows: 4, min_columns: 6, min_rows: 4 }));
  static getConfigElement = vi.fn(async () => document.createElement("test-area-editor"));
}
class NativeControls extends HTMLElement {
  hass?: HomeAssistant;
  context?: unknown;
  color?: string;
  position?: string;
  config?: AreaFeature;
  setConfig = vi.fn((config: AreaFeature) => { this.config = config; });
}
class NativeConditional extends NativeEditor {
  preview = true;
  setNativeVisibility(visible: boolean) {
    this.hidden = !visible;
    this.dispatchEvent(new CustomEvent("card-visibility-changed", {
      detail: { value: visible }, bubbles: true, composed: true,
    }));
  }
}
customElements.define("test-area-editor", NativeEditor);
customElements.define("hui-area-card", NativeArea);
customElements.define("hui-area-controls-card-feature", NativeControls);
customElements.define("hui-conditional-card", NativeConditional);
customElements.define("hui-conditions-editor", class extends HTMLElement {});
if (!customElements.get(AREA_TAG)) customElements.define(AREA_TAG, MushroomAreaAdvancedCard);
const base: AreaAdvancedConfig = { type: `custom:${AREA_TAG}`, area: "office" };
const hass: HomeAssistant = {
  areas: { office: { area_id: "office", name: "Office" } },
  states: Object.fromEntries(["sensor.test", "button.test", "scene.test", "script.test", "light.test", "select.test"].map((entity_id) =>
    [entity_id, { entity_id, state: "on", attributes: { friendly_name: entity_id } }])),
  callService: vi.fn(async () => undefined),
};
const createCardElement = vi.fn(async (config: AreaAdvancedConfig) => {
  const element = document.createElement("hui-area-card") as NativeArea;
  element.setConfig(config);
  return element;
});
const loader = vi.fn(async () => ({ createCardElement }));
const areaWindow = window as typeof window & { loadCardHelpers?: typeof loader };
async function settle(element: MushroomAreaAdvancedCard | MushroomAreaAdvancedEditor | MushroomAreaControlsAdvanced) {
  for (let i = 0; i < 8; i++) { await Promise.resolve(); await element.updateComplete; }
}
beforeEach(() => { vi.clearAllMocks(); areaWindow.loadCardHelpers = loader; });
afterEach(() => { document.body.replaceChildren(); delete areaWindow.loadCardHelpers; vi.useRealTimers(); });

describe("native Area card delegation", () => {
  it("keeps the Mushroom comparison card separate and preserves its type in the shared editor", async () => {
    await import("../src/index");
    expect(customElements.get(MUSHROOM_AREA_TAG)).toBe(MushroomAreaCard);
    expect(customElements.get(AREA_TAG)).toBe(MushroomAreaAdvancedCard);
    const stub = MushroomAreaCard.getStubConfig(hass);
    expect(stub).toEqual({ ...base, type: `custom:${MUSHROOM_AREA_TAG}`, display_type: "compact" });
    expect(MushroomAreaAdvancedCard.getStubConfig(hass)).toEqual(base);
    const card = document.createElement(MUSHROOM_AREA_TAG) as MushroomAreaCard;
    card.hass = hass;
    card.setConfig(stub);
    document.body.append(card);
    await settle(card);
    const native = card.shadowRoot!.querySelector("hui-area-card") as NativeArea;
    expect(native.config).toEqual({ ...stub, type: "area" });
    card.setConfig({ ...stub, display_type: "camera", aspect_ratio: "4:3", features: [{ type: "area-controls" }] });
    await settle(card);
    expect(native.config).toMatchObject({ display_type: "camera", aspect_ratio: "4:3", features: [{ type: "area-controls" }] });
    const edited = mergeNativeAreaEdit(stub, { ...base, type: "area", name: "Edited" });
    expect(edited).toMatchObject({ type: `custom:${MUSHROOM_AREA_TAG}`, name: "Edited" });
    expect((await MushroomAreaCard.getConfigElement()).localName).toBe(`${AREA_TAG}-editor`);
  });
  it("scopes Mushroom styles to the comparison instance, including nested shadow roots", async () => {
    const original = document.createElement("hui-area-card");
    const comparison = document.createElement("hui-area-card");
    original.attachShadow({ mode: "open" }).innerHTML = "<ha-card></ha-card>";
    comparison.attachShadow({ mode: "open" }).innerHTML = "<ha-card><ha-tile-info></ha-tile-info></ha-card>";
    const info = comparison.shadowRoot!.querySelector("ha-tile-info")!;
    info.attachShadow({ mode: "open" }).innerHTML = '<span class="primary">Office</span><span class="secondary">21°C</span>';
    document.body.append(original, comparison);
    await applyMushroomAreaPresentation(comparison);
    await applyMushroomAreaPresentation(comparison);
    expect(original.shadowRoot!.querySelector("style")).toBeNull();
    expect(comparison.shadowRoot!.querySelectorAll("style[data-area-mushroom]")).toHaveLength(1);
    expect(info.shadowRoot!.querySelector("style")?.textContent).toContain("--mush-card-primary-font-weight, 500");
    expect(info.shadowRoot!.querySelector("style")?.textContent).toContain("--mush-card-secondary-line-height, 16px");
  });
  it("localizes the missing-area message when Home Assistant arrives after configuration", async () => {
    const card = document.createElement(AREA_TAG) as MushroomAreaAdvancedCard;
    card.setConfig({ type: base.type });
    document.body.append(card);
    await settle(card);
    expect(card.shadowRoot!.textContent).toContain("Select an area in the native Area editor.");
    card.hass = { ...hass, language: "de" };
    await settle(card);
    expect(card.shadowRoot!.textContent).toContain("Wähle einen Bereich im nativen Bereichskarten-Editor aus.");
    expect(createCardElement).not.toHaveBeenCalled();
  });
  it("registers the exact picker name, native editor and real-area stub", async () => {
    await import("../src/index");
    expect(window.customCards?.find((card) => card.type === AREA_TAG)?.name)
      .toBe("Mushroom Addition: Area Advanced");
    expect(MushroomAreaAdvancedCard.getStubConfig(hass)).toEqual(base);
    expect(MushroomAreaAdvancedCard.getStubConfig()).toEqual({ type: base.type });
    expect((await MushroomAreaAdvancedCard.getConfigElement()).localName).toBe(`${AREA_TAG}-editor`);
  });
  it("passes every known and future native option through, with no generic Mushroom defaults", async () => {
    const config: AreaAdvancedConfig = {
      ...base, display_type: "camera", camera_view: "live", camera_image: "camera.office",
      vertical: true, aspect_ratio: "16:9", features_position: "inline",
      exclude_entities: ["light.other"], alert_classes: ["motion"], sensor_classes: ["temperature"],
      tap_action: { action: "navigate", navigation_path: "/office" },
      image_tap_action: { action: "more-info" }, grid_options: { columns: 6 },
      future_native_option: { nested: [1, 2] }, features: [{ type: "area-controls" }, { type: "future-native", arbitrary: true }],
    };
    const snapshot = structuredClone(config);
    const card = document.createElement(AREA_TAG) as MushroomAreaAdvancedCard;
    card.hass = hass;
    card.layout = "panel";
    card.setConfig(config);
    document.body.append(card);
    await settle(card);
    const native = card.shadowRoot!.querySelector("hui-area-card") as NativeArea;
    expect(native.config).toEqual({ ...config, type: "area" });
    expect(native.hass).toBe(hass);
    expect(native.layout).toBe("panel");
    expect(card.getCardSize()).toBe(4);
    expect(card.getGridOptions()).toEqual({ columns: 6, rows: 4, min_columns: 6, min_rows: 4 });
    const nextHass = { ...hass, language: "nl" };
    card.hass = nextHass;
    card.layout = "grid";
    await settle(card);
    expect(native.hass).toBe(nextHass);
    expect(native.layout).toBe("grid");
    card.setConfig({ ...base, display_type: "picture" });
    await settle(card);
    expect(card.shadowRoot!.querySelector("hui-area-card")).toBe(native);
    expect(native.config).toEqual({ ...base, type: "area", display_type: "picture" });
    card.remove();
    document.body.append(card);
    await settle(card);
    expect(card.shadowRoot!.querySelector("hui-area-card")).toBe(native);
    expect(config).toEqual(snapshot);
  });
  it("changes only enhanced area-controls feature types internally", () => {
    const config: AreaAdvancedConfig = { ...base, features: [
      { type: "area-controls" }, { type: "area-controls", controls: [] },
      { type: "other", controls: [{ entity_id: "sensor.test", icon: "mdi:star" }] },
      { type: "area-controls", controls: ["light", { entity_id: "sensor.test", icon: "mdi:star" }], future: true },
    ] };
    expect(nativeAreaConfig(config).features).toEqual([
      config.features![0], config.features![1], config.features![2],
      { ...config.features![3], type: `custom:${AREA_FEATURE_TAG}` },
    ]);
    expect(config.features![3].type).toBe("area-controls");
  });
  it("places alert and sensor options inside native Content, preserving native edits", async () => {
    const editor = document.createElement(`${AREA_TAG}-editor`) as MushroomAreaAdvancedEditor;
    const config = { ...base, alert_color: "red", sensor_wrap: true, sensor_icons: true };
    editor.hass = hass; editor.setConfig(config);
    document.body.append(editor); await settle(editor);
    const native = editor.shadowRoot!.querySelector("test-area-editor") as NativeEditor;
    const form = native.shadowRoot!.querySelector("ha-form") as HTMLElement & {
      schema: { name: string; schema: { name: string }[] }[]; data: AreaAdvancedConfig;
      computeLabel(field: { name: string }): string;
    };
    void native.updateComplete;
    expect(form.schema[0].schema.map(field => field.name)).toEqual([
      "sensor_classes", "alert_color", "sensor_wrap", "sensor_icons", "use_light_color",
    ]);
    expect(form.data).toMatchObject({ alert_color: "red", sensor_wrap: true, sensor_icons: true });
    expect(form.computeLabel({ name: "alert_color" })).toBe("Alert icon color");
    const schema = form.schema;
    for (let index = 0; index < 5; index++) {
      editor.hass = { ...hass, states: { ...hass.states } };
      await settle(editor);
      void native.updateComplete;
      expect(form.schema).toBe(schema);
      expect(form.data).toMatchObject({ alert_color: "red", sensor_wrap: true, sensor_icons: true });
    }
    expect(native.config).not.toHaveProperty("alert_color");
    const events = vi.fn(); editor.addEventListener("config-changed", events);
    native.dispatchEvent(new CustomEvent("config-changed", { detail: {
      config: { ...native.config, alert_color: "blue", sensor_wrap: false, sensor_icons: true },
    }, bubbles: true, composed: true }));
    expect((events.mock.calls[0][0] as CustomEvent).detail.config).toMatchObject({
      alert_color: "blue", sensor_wrap: false, sensor_icons: true,
    });
  });
  it("shows an explicit missing-helper error and can retry", async () => {
    delete areaWindow.loadCardHelpers;
    const card = document.createElement(AREA_TAG) as MushroomAreaAdvancedCard;
    card.setConfig(base); document.body.append(card); await settle(card);
    expect(card.shadowRoot!.textContent).toContain("helpers are unavailable");
    areaWindow.loadCardHelpers = loader;
    (card.shadowRoot!.querySelector("button") as HTMLButtonElement).click();
    await settle(card);
    expect(card.shadowRoot!.querySelector("hui-area-card")).toBeTruthy();
  });
  it("bounds hanging helper promises, retries, and rejects unsupported native errors", async () => {
    vi.useFakeTimers();
    areaWindow.loadCardHelpers = vi.fn(() => new Promise(() => undefined));
    const card = document.createElement(AREA_TAG) as MushroomAreaAdvancedCard;
    card.setConfig(base); document.body.append(card);
    await vi.advanceTimersByTimeAsync(8001); await settle(card);
    expect(card.shadowRoot!.textContent).toContain("The native component (loadCardHelpers) took too long to load.");
    card.hass = { ...hass, language: "nl" };
    await settle(card);
    expect(card.shadowRoot!.textContent).toContain("Het laden van de ingebouwde component (loadCardHelpers) duurde te lang.");
    areaWindow.loadCardHelpers = vi.fn(async () => ({
      createCardElement: vi.fn(async () => document.createElement("hui-error-card") as NativeArea),
    }));
    (card.shadowRoot!.querySelector("button") as HTMLButtonElement).click();
    await settle(card);
    expect(card.shadowRoot!.textContent).toContain("De vereiste ingebouwde component (hui-area-card) is niet beschikbaar.");
  });
  it("ignores stale asynchronous card creation", async () => {
    let resolve!: (card: NativeArea) => void;
    createCardElement.mockImplementationOnce(() => new Promise((done) => { resolve = done; }));
    const card = document.createElement(AREA_TAG) as MushroomAreaAdvancedCard;
    card.setConfig({ ...base, area: "old" }); document.body.append(card);
    await Promise.resolve(); await Promise.resolve();
    card.setConfig({ ...base, area: "new" }); await settle(card);
    const current = card.shadowRoot!.querySelector("hui-area-card") as NativeArea;
    const old = document.createElement("hui-area-card") as NativeArea;
    resolve(old); await settle(card);
    expect(card.shadowRoot!.querySelector("hui-area-card")).toBe(current);
    expect(current.config!.area).toBe("new");
  });
});

describe("advanced controls inside the native feature position", () => {
  async function feature(controls?: AreaFeature["controls"]) {
    const element = document.createElement(AREA_FEATURE_TAG) as MushroomAreaControlsAdvanced;
    element.hass = hass; element.context = { area_id: "office", exclude_entities: ["light.other"] };
    element.position = "inline"; element.color = "#123456";
    element.setConfig({ type: `custom:${AREA_FEATURE_TAG}`, ...(controls ? { controls } : {}) });
    document.body.append(element); await settle(element); return element;
  }
  it("delegates automatic defaults exactly once and distinguishes explicit empty controls", async () => {
    const element = await feature();
    const group = element.shadowRoot!.querySelector("hui-area-controls-card-feature") as NativeControls;
    expect(element.shadowRoot!.querySelectorAll("hui-area-controls-card-feature")).toHaveLength(1);
    expect(group.config).toEqual({ type: "area-controls" });
    expect(group.context).toBe(element.context);
    expect(group.hass).toBe(hass); expect(group.position).toBe("inline"); expect(group.color).toBe("#123456");
    element.setConfig({ type: "area-controls", controls: [] }); await settle(element);
    expect(element.shadowRoot!.querySelectorAll("button, hui-area-controls-card-feature")).toHaveLength(0);
  });
  it("keeps ordered standard domain groups native and enhanced entities custom, without duplication", async () => {
    const element = await feature(["light", { entity_id: "sensor.test", icon: "mdi:star", icon_color: "red" }, "fan"]);
    const groups = [...element.shadowRoot!.querySelectorAll("hui-area-controls-card-feature")] as NativeControls[];
    expect(groups.map((group) => group.config!.controls)).toEqual([["light"], ["fan"]]);
    expect(element.shadowRoot!.querySelectorAll(".entity")).toHaveLength(1);
    expect((element.shadowRoot!.querySelector("ha-icon") as HTMLElement & { icon: string }).icon).toBe("mdi:star");
    expect((element.shadowRoot!.querySelector(".entity") as HTMLButtonElement).style.getPropertyValue("--control-icon-color"))
      .toBe("var(--red-color, red)");
    element.setConfig({ type: "area-controls", controls: [{ entity_id: "scene.test", tap_action: { action: "none" } }] });
    await settle(element);
    expect(element.shadowRoot!.querySelectorAll("hui-area-controls-card-feature")).toHaveLength(0);
    expect(element.shadowRoot!.querySelector("ha-state-icon")).toBeTruthy();
  });
  it.each([
    ["sensor.test", { action: "more-info" }], ["select.test", { action: "more-info" }],
    ["light.test", { action: "toggle" }],
    ["button.test", { action: "perform-action", perform_action: "button.press", target: { entity_id: "button.test" } }],
    ["scene.test", { action: "perform-action", perform_action: "scene.turn_on", target: { entity_id: "scene.test" } }],
    ["script.test", { action: "perform-action", perform_action: "script.turn_on", target: { entity_id: "script.test" } }],
  ])("uses safe default %s actions through HA action infrastructure", async (entity, expected) => {
    expect(defaultAreaAction(entity)).toEqual(expected);
    const element = await feature([{ entity_id: entity, icon: "mdi:star" }]);
    const actions = vi.fn(); const clicks = vi.fn();
    element.addEventListener("hass-action", actions); element.addEventListener("click", clicks);
    (element.shadowRoot!.querySelector("button") as HTMLButtonElement).click();
    expect(actions).toHaveBeenCalledTimes(1);
    expect((actions.mock.calls[0][0] as CustomEvent).detail).toMatchObject({
      action: "tap", config: { entity, tap_action: expected },
    });
    expect(clicks).not.toHaveBeenCalled(); expect(hass.callService).not.toHaveBeenCalled();
  });
  it.each<ActionConfig>([
    { action: "navigate", navigation_path: "/lovelace/test" },
    { action: "more-info", entity: "light.test" },
    { action: "perform-action", perform_action: "light.turn_on", target: { area_id: "office" },
      data: { brightness: 80 }, confirmation: { text: "Sure?" } },
    { action: "call-service", service: "scene.turn_on", service_data: { entity_id: "scene.test" } },
    { action: "url", url_path: "https://example.org" },
  ])("preserves all custom action data: $action", async (action) => {
    const element = await feature([{ entity_id: "sensor.test", tap_action: action }]);
    const listener = vi.fn(); element.addEventListener("hass-action", listener);
    (element.shadowRoot!.querySelector("button") as HTMLButtonElement).dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect((listener.mock.calls[0][0] as CustomEvent).detail.config.tap_action).toEqual(action);
  });
  it("supports none, unavailable entities and live state/icon updates without parent taps", async () => {
    const element = await feature([{ entity_id: "light.test", tap_action: { action: "none" } }]);
    const listener = vi.fn(); element.addEventListener("hass-action", listener);
    (element.shadowRoot!.querySelector("button") as HTMLButtonElement).click();
    expect(listener).not.toHaveBeenCalled();
    element.hass = { ...hass, states: { ...hass.states, "light.test": { ...hass.states["light.test"], state: "unavailable" } } };
    await settle(element);
    expect((element.shadowRoot!.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    element.hass = { ...hass, states: { ...hass.states, "light.test": { ...hass.states["light.test"], state: "off" } } };
    await settle(element);
    expect(element.shadowRoot!.querySelector("button")!.getAttribute("aria-pressed")).toBe("false");
    expect((element.shadowRoot!.querySelector("ha-state-icon") as HTMLElement & { stateObj: unknown }).stateObj)
      .toBe(element.hass.states["light.test"]);
  });
  it("shows names below icons in bottom-aligned shared-height buttons and supports entity pictures/content", async () => {
    const element = await feature([
      { entity_id: "light.test", name: "Office", content_info: "name", use_entity_picture: true },
      { entity_id: "sensor.test", content_info: "state" },
    ]);
    element.hass = { ...hass, states: { ...hass.states,
      "light.test": { ...hass.states["light.test"], attributes: { entity_picture: "/local/office.png" } },
      "sensor.test": { ...hass.states["sensor.test"], state: "21", attributes: { unit_of_measurement: "°C" } },
    } }; await settle(element);
    expect(element.hasAttribute("named")).toBe(true);
    const button = element.shadowRoot!.querySelector(".entity")!;
    expect(button.querySelector(".button-icon + .button-label")!.textContent).toBe("Office");
    expect(button.querySelector("img")!.getAttribute("src")).toBe("/local/office.png");
    expect(element.shadowRoot!.querySelectorAll(".button-label")[1].textContent).toBe("21 °C");
    const formatEntityState = vi.fn(() => "21,0 °C");
    element.hass = { ...element.hass!, formatEntityState };
    await settle(element);
    expect(element.shadowRoot!.querySelectorAll(".button-label")[1].textContent).toBe("21,0 °C");
    expect(formatEntityState).toHaveBeenCalledWith(element.hass.states["sensor.test"]);
    const styles = MushroomAreaControlsAdvanced.styles.cssText;
    expect(styles).toContain("flex-direction: column");
    expect(styles).toContain("margin-top: auto");
    expect(styles).toContain("height: 64px");
    element.setConfig({ type: "area-controls", controls: [{ entity_id: "sensor.test", icon: "mdi:star" }] });
    await settle(element); expect(element.hasAttribute("named")).toBe(false);
  });
  it("reserves additional native grid/card space only for named controls", async () => {
    const card = document.createElement(AREA_TAG) as MushroomAreaAdvancedCard;
    card.setConfig({ ...base, features: [{ type: "area-controls", controls: [{ entity_id: "light.test", name: "Office" }] }] });
    document.body.append(card); await settle(card);
    expect(card.getCardSize()).toBe(5);
    expect(card.getGridOptions()).toEqual({ columns: 6, rows: 5, min_columns: 6, min_rows: 5 });
    const native = card.shadowRoot!.querySelector("hui-area-card") as HTMLElement;
    expect(native.style.getPropertyValue("--feature-height")).toBe("64px");
    card.setConfig(base); await settle(card);
    expect(card.getCardSize()).toBe(4);
    expect(native.style.getPropertyValue("--feature-height")).toBe("");
  });
  it("supports action buttons without an entity and isolates hold/double-tap gestures", async () => {
    vi.useFakeTimers();
    const element = await feature([{ type: "action", name: "Scene", icon: "mdi:star",
      tap_action: { action: "navigate", navigation_path: "/tap" },
      hold_action: { action: "navigate", navigation_path: "/hold" },
      double_tap_action: { action: "navigate", navigation_path: "/double" } }]);
    const events = vi.fn(); element.addEventListener("hass-action", events);
    const button = element.shadowRoot!.querySelector("button") as HTMLButtonElement;
    expect(button.disabled).toBe(false);
    button.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
    button.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 2 }));
    button.dispatchEvent(new MouseEvent("dblclick", { bubbles: true, detail: 2 }));
    await vi.advanceTimersByTimeAsync(400);
    expect(events).toHaveBeenCalledTimes(1);
    expect((events.mock.calls[0][0] as CustomEvent).detail.action).toBe("double_tap");
    button.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0 }));
    await vi.advanceTimersByTimeAsync(501);
    button.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    button.click();
    expect(events).toHaveBeenCalledTimes(2);
    expect((events.mock.calls[1][0] as CustomEvent).detail.action).toBe("hold");
  });
  it("delegates conditional visibility unchanged to native conditional cards", async () => {
    const conditional = document.createElement("hui-conditional-card") as NativeConditional;
    createCardElement.mockImplementationOnce(async (config) => { conditional.setConfig(config); return conditional as unknown as NativeArea; });
    const conditions = [{ condition: "or", conditions: [{ condition: "state", entity: "light.test", state: "on" }] }];
    const child = { type: "action" as const, name: "Office", icon: "mdi:desk", tap_action: { action: "none" } };
    const element = await feature([{ type: "conditional", conditions, control: child }]);
    await settle(element);
    expect(element.shadowRoot!.querySelector("hui-conditional-card")).toBe(conditional);
    expect(conditional.config).toEqual({
      type: "conditional", conditions, card: { type: `custom:${AREA_FEATURE_TAG}`, controls: [child],
        area_context: element.context, feature_position: "inline", feature_color: "#123456" },
    });
    expect(conditional.hass).toBe(hass);
    const updated = { ...hass, language: "nl" }; element.hass = updated; await settle(element);
    expect(conditional.hass).toBe(updated);
  });
  it("removes a native-hidden conditional from flex layout without unmounting its condition listeners", async () => {
    const conditional = document.createElement("hui-conditional-card") as NativeConditional;
    createCardElement.mockImplementationOnce(async (config) => {
      conditional.setConfig(config); return conditional as unknown as NativeArea;
    });
    const element = await feature([
      { type: "action", name: "Always", icon: "mdi:star" },
      { type: "conditional", conditions: [{ condition: "state", entity: "light.test", state: "on" }],
        control: { type: "action", name: "Conditional", icon: "mdi:desk" } },
    ]);
    await settle(element);
    expect(conditional.preview).toBe(false);
    conditional.setNativeVisibility(false);
    await settle(element);
    expect(getComputedStyle(conditional).display).toBe("none");
    expect(conditional.isConnected).toBe(true);
    expect(element.shadowRoot!.querySelectorAll(".entity")).toHaveLength(1);
    const clonedHass = { ...hass, states: { ...hass.states,
      "light.test": { ...hass.states["light.test"], state: "off" } } };
    element.hass = clonedHass; await settle(element);
    expect(conditional.hass).toBe(clonedHass);
    expect(getComputedStyle(conditional).display).toBe("none");
    // The native/server verdict, not a locally cloned state, controls visibility.
    conditional.setNativeVisibility(true); await settle(element);
    expect(getComputedStyle(conditional).display).not.toBe("none");
    expect(element.shadowRoot!.querySelector("hui-conditional-card")).toBe(conditional);
    expect(createCardElement).toHaveBeenCalledTimes(1);
  });
  it("renders HA-server templates and cleans up all subscriptions on config changes/removal", async () => {
    let callback!: (message: { result?: unknown; error?: unknown }) => void;
    const unsubscribe = vi.fn();
    const subscribeMessage = vi.fn(async (listener: typeof callback) => { callback = listener; return unsubscribe; });
    const element = await feature([{ type: "template", entity_id: "sensor.test", content: "{{ states(entity) }}", icon: "mdi:star" }]);
    element.hass = { ...hass, connection: { sendMessagePromise: vi.fn(),
      subscribeMessage: subscribeMessage as NonNullable<HomeAssistant["connection"]>["subscribeMessage"] } };
    await settle(element);
    expect(subscribeMessage).toHaveBeenCalledTimes(1);
    expect(subscribeMessage.mock.calls[0]).toHaveLength(2);
    expect((subscribeMessage.mock.calls[0] as unknown[])[1]).toMatchObject({
      type: "render_template", template: "{{ states(entity) }}", variables: { entity: "sensor.test" },
    });
    callback({ result: "21 °C" }); await settle(element);
    expect(element.shadowRoot!.querySelector(".button-label")!.textContent).toBe("21 °C");
    element.setConfig({ type: "area-controls", controls: [{ type: "template", content: "{{ 2 }}" }] });
    await settle(element); expect(unsubscribe).toHaveBeenCalledTimes(1);
    callback({ error: "Permission denied" }); await settle(element);
    expect(element.shadowRoot!.textContent).toContain("Template error: Permission denied");
    element.remove();
    expect(unsubscribe).toHaveBeenCalledTimes(2);
  });
  it("cleans up late template subscriptions and reports connection failures explicitly", async () => {
    let finish!: (unsubscribe: () => void) => void;
    const unsubscribe = vi.fn();
    const element = await feature([{ type: "template", content: "{{ 1 }}" }]);
    expect(element.shadowRoot!.textContent).toContain("template connection unavailable");
    element.hass = { ...hass, connection: { sendMessagePromise: vi.fn(),
      subscribeMessage: vi.fn(() => new Promise((resolve) => { finish = resolve; })) as NonNullable<HomeAssistant["connection"]>["subscribeMessage"] } };
    await settle(element); element.remove(); finish(unsubscribe); await Promise.resolve();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});

describe("native Area editor round trips", () => {
  const features: AreaFeature[] = [
    { type: "area-controls", controls: [{ entity_id: "sensor.test", icon: "mdi:one", icon_color: "red" },
      { entity_id: "sensor.test", icon: "mdi:two" }, "light"] },
    { type: "future", future: { preserved: true } },
    { type: "area-controls", controls: [{ entity_id: "scene.test", tap_action: { action: "none" } }] },
  ];
  it("strips only advanced fields for the native editor and restores duplicate occurrences", () => {
    const config = { ...base, features };
    const native = nativeAreaConfig(config, true);
    expect(native.features![0].controls).toEqual([{ entity_id: "sensor.test" }, { entity_id: "sensor.test" }, "light"]);
    expect(mergeNativeAreaEdit(config, { ...native, name: "Office" })).toEqual({ ...config, name: "Office" });
  });
  it("tracks feature/control reorder, removal and empty/automatic semantics", () => {
    const config = { ...base, features };
    const native = nativeAreaConfig(config, true);
    const reordered = { ...native, features: [native.features![2], native.features![1], {
      ...native.features![0], controls: ["light", { entity_id: "sensor.test" }],
    }] };
    const merged = mergeNativeAreaEdit(config, reordered);
    expect(merged.features![0]).toEqual(features[2]);
    expect(merged.features![2].controls).toEqual(["light", features[0].controls![0]]);
    expect(mergeNativeAreaEdit(config, { ...native, features: [] }).features).toEqual([]);
    expect(mergeNativeAreaEdit(config, { ...native, features: [{ type: "area-controls", controls: [] }] }).features![0].controls).toEqual([]);
    expect(mergeNativeAreaEdit(config, { ...native, features: [{ type: "area-controls" }] }).features![0].controls).toBeUndefined();
    expect(mergeNativeAreaEdit(config, { type: "area", area: "office" }).features).toBeUndefined();
  });
  it("uses preserved native object identities for duplicate reorders/removals and native feature edits", () => {
    const config = { ...base, features };
    const native = nativeAreaConfig(config, true);
    const reordered = { ...native, features: [
      { ...native.features![0], future_option: "new",
        controls: [native.features![0].controls![1], native.features![0].controls![0]] },
    ] };
    expect(mergeNativeAreaEdit(config, reordered).features![0].controls)
      .toEqual([features[0].controls![1], features[0].controls![0]]);
    expect(mergeNativeAreaEdit(config, { ...native, features: [
      { ...native.features![0], controls: [native.features![0].controls![1]] },
    ] }).features![0].controls).toEqual([features[0].controls![1]]);
  });
  it("delegates the actual native editor, forwards hass and renders unrestricted graphical extensions", async () => {
    const editor = document.createElement(`${AREA_TAG}-editor`) as MushroomAreaAdvancedEditor;
    editor.hass = hass; editor.setConfig({ ...base, features });
    document.body.append(editor); await settle(editor);
    const native = editor.shadowRoot!.querySelector("test-area-editor") as NativeEditor;
    expect(NativeArea.getConfigElement).toHaveBeenCalled();
    expect(native.config).toEqual(nativeAreaConfig({ ...base, features }, true));
    expect(native.hass).toBe(hass);
    (editor.shadowRoot!.querySelector('[aria-label="Edit button"]') as HTMLButtonElement).click();
    await settle(editor);
    const form = editor.shadowRoot!.querySelector("ha-form") as HTMLElement & {
      schema: { name: string; selector: Record<string, unknown> }[];
    };
    expect(form.schema).toContainEqual({ name: "entity_id", required: true, selector: { entity: {} } });
    expect(form.schema).toContainEqual({ name: "icon", selector: { icon: {} } });
    expect(form.schema).toContainEqual({ name: "icon_color", selector: { ui_color: {} } });
    expect(form.schema).toContainEqual({ name: "tap_action", selector: { ui_action: {} } });
    const events = vi.fn(); editor.addEventListener("config-changed", events);
    const nativeUpdate = { ...native.config!, display_type: "camera" };
    native.dispatchEvent(new CustomEvent("config-changed", { bubbles: true, composed: true, detail: { config: nativeUpdate } }));
    expect(events).toHaveBeenCalledTimes(1);
    expect((events.mock.calls[0][0] as CustomEvent).detail.config).toEqual({ ...base, features, display_type: "camera" });
    const newHass = { ...hass, language: "nl" }; editor.hass = newHass; await settle(editor);
    expect(native.hass).toBe(newHass);
    expect(editor.shadowRoot!.querySelector(".edit-icon")!.getAttribute("aria-label")).toBe("Knop bewerken");
    (editor.shadowRoot!.querySelector(".edit-icon") as HTMLButtonElement).click(); await settle(editor);
    const translatedForm = editor.shadowRoot!.querySelector("ha-form") as HTMLElement & {
      computeLabel: (field: { name: string }) => string;
      schema: { name: string; selector: { select?: { options: { value: string; label: string }[] } } }[];
    };
    expect(translatedForm.computeLabel({ name: "entity_id" })).toBe("Entiteit (elk domein)");
    const contentOptions = translatedForm.schema.find(field => field.name === "content_info")!.selector.select!.options;
    expect(contentOptions.map(option => option.value)).toEqual(["none", "name", "state", "last-changed", "last-updated", "attribute", "custom"]);
    expect(contentOptions.find(option => option.value === "custom")?.label).toBe("Eigen tekst");
    editor.shadowRoot!.querySelector("ha-form")!.dispatchEvent(new CustomEvent("value-changed", { bubbles: true, composed: true,
      detail: { value: { entity_id: "sensor.test", icon: "mdi:new", icon_color: "blue", tap_action: { action: "none" } } } }));
    const saved = (events.mock.calls.at(-1)![0] as CustomEvent).detail.config as AreaAdvancedConfig;
    expect(saved.features![0].controls![0]).toMatchObject({ icon: "mdi:new", icon_color: "blue", tap_action: { action: "none" } });
    expect(saved.features!.every((feature) => !feature.type.startsWith("custom:"))).toBe(true);
  });
  it("graphically reorders/removes duplicate controls without losing their own overrides", async () => {
    const editor = document.createElement(`${AREA_TAG}-editor`) as MushroomAreaAdvancedEditor;
    editor.hass = hass; editor.setConfig({ ...base, features: [features[0]] });
    document.body.append(editor); await settle(editor);
    const events = vi.fn(); editor.addEventListener("config-changed", events);
    (editor.shadowRoot!.querySelector(".drag") as HTMLButtonElement).dispatchEvent(new KeyboardEvent("keydown", {
      key: "ArrowDown", altKey: true, bubbles: true,
    }));
    await settle(editor);
    let saved = (events.mock.calls.at(-1)![0] as CustomEvent).detail.config as AreaAdvancedConfig;
    expect(saved.features![0].controls).toEqual([features[0].controls![1], features[0].controls![0], "light"]);
    (editor.shadowRoot!.querySelector('[aria-label="Remove control"]') as HTMLButtonElement).click();
    await settle(editor);
    saved = (events.mock.calls.at(-1)![0] as CustomEvent).detail.config as AreaAdvancedConfig;
    expect(saved.features![0].controls).toEqual([features[0].controls![0], "light"]);
  });
  it("offers compact chips-style list/detail editing, type selection and keyboard reordering", async () => {
    const editor = document.createElement(`${AREA_TAG}-editor`) as MushroomAreaAdvancedEditor;
    editor.hass = hass; editor.setConfig({ ...base, features: [features[0]] });
    document.body.append(editor); await settle(editor);
    expect(editor.shadowRoot!.querySelectorAll(".control")).toHaveLength(3);
    expect(editor.shadowRoot!.querySelector("ha-form")).toBeNull();
    expect(editor.shadowRoot!.querySelector('ha-sortable')?.getAttribute("handle-selector")).toBe(".handle");
    const events = vi.fn(); editor.addEventListener("config-changed", events);
    const select = editor.shadowRoot!.querySelector('[aria-label="Add button type"]') as HTMLSelectElement;
    expect([...select.options].map((option) => option.value)).toEqual(["", "entity", "action", "conditional", "template"]);
    select.value = "action"; select.dispatchEvent(new Event("change", { bubbles: true })); await settle(editor);
    expect(editor.shadowRoot!.querySelector('[aria-label="Edit action button"]')).toBeTruthy();
    const form = editor.shadowRoot!.querySelector("ha-form") as HTMLElement & { schema: { name: string }[] };
    expect(form.schema.map((field) => field.name)).toEqual(expect.arrayContaining([
      "name", "content_info", "use_entity_picture", "tap_action", "hold_action", "double_tap_action",
    ]));
    expect(form.schema.map(field => field.name)).not.toContain("attribute");
    expect(form.schema.map(field => field.name)).not.toContain("content");
    expect(editor.shadowRoot!.querySelector('[aria-label="Move control down"]')).toBeNull();
    expect(editor.shadowRoot!.textContent).not.toContain("Add area controls feature");
    (editor.shadowRoot!.querySelector(".detail button") as HTMLButtonElement).click(); await settle(editor);
    (editor.shadowRoot!.querySelector(".drag") as HTMLElement).dispatchEvent(new KeyboardEvent("keydown", {
      key: "ArrowDown", altKey: true, bubbles: true,
    })); await settle(editor);
    const saved = (events.mock.calls.at(-1)![0] as CustomEvent).detail.config as AreaAdvancedConfig;
    expect(saved.features![0].controls![0]).toEqual(features[0].controls![1]);
  });
  it("reorders with the drag handle and only shows the selected content input", async () => {
    const editor = document.createElement(`${AREA_TAG}-editor`) as MushroomAreaAdvancedEditor;
    editor.hass = hass; editor.setConfig({ ...base, features: [features[0]] });
    document.body.append(editor); await settle(editor);
    const events = vi.fn(); editor.addEventListener("config-changed", events);
    editor.shadowRoot!.querySelector("ha-sortable")!.dispatchEvent(new CustomEvent("item-moved", {
      detail: { oldIndex: 0, newIndex: 1 }, bubbles: true,
    }));
    await settle(editor);
    const saved = (events.mock.calls.at(-1)![0] as CustomEvent).detail.config as AreaAdvancedConfig;
    expect(saved.features![0].controls![0]).toEqual(features[0].controls![1]);
    (editor.shadowRoot!.querySelector('[aria-label="Edit button"]') as HTMLButtonElement).click();
    await settle(editor);
    const readForm = () => editor.shadowRoot!.querySelector(".detail ha-form") as HTMLElement & {
      data: Record<string, unknown>; schema: { name: string; selector: Record<string, unknown> }[];
    };
    let form = readForm();
    expect(form.schema.map(s => s.name)).not.toContain("attribute");
    expect(form.schema.map(s => s.name)).not.toContain("content");
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { ...form.data, content_info: "attribute" } } }));
    await settle(editor);
    form = readForm();
    expect(form.schema.find(s => s.name === "attribute")!.selector).toEqual({
      select: { mode: "dropdown", custom_value: true, options: [{ value: "friendly_name", label: "friendly name" }] },
    });
    expect(form.schema.map(s => s.name)).not.toContain("content");
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { ...form.data, content_info: "custom" } } }));
    await settle(editor);
    expect(readForm().schema.map(s => s.name)).toContain("content");
    expect(readForm().schema.map(s => s.name)).not.toContain("attribute");
  });
  it("preserves advanced-only buttons through native edits and feature reordering without exposing invalid native fields", () => {
    const action = { type: "action" as const, name: "Work", icon: "mdi:desk" };
    const template = { type: "template" as const, content: "{{ 1 }}" };
    const config = { ...base, features: [
      { type: "area-controls", controls: [action, "light"] },
      { type: "area-controls", controls: [template] },
    ] };
    const projected = nativeAreaConfig(config, true);
    expect(projected.features![0].controls).toEqual(["light"]);
    expect(projected.features![1].controls).toEqual([]);
    expect(mergeNativeAreaEdit(config, { ...projected, name: "Office" })).toEqual({ ...config, name: "Office" });
    expect(mergeNativeAreaEdit(config, { ...projected, features: [...projected.features!].reverse() }).features)
      .toEqual([...config.features].reverse());
    expect(mergeNativeAreaEdit(config, { ...projected, features: [] }).features).toEqual([]);
  });
});
