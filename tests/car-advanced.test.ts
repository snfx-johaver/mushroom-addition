import { afterEach, describe, expect, it, vi } from "vitest";
import { LitElement, html } from "lit";
import { CAR_TAG, carStub, engineConfig, validateCar, type CarConfig } from "../src/car-advanced/config";
import type { CarEngineEditor } from "../src/car-advanced/runtime";
import type { HomeAssistant } from "../src/types";

vi.mock("../src/car-advanced/runtime", () => ({
  loadCarEngine: vi.fn(async () => undefined),
}));
import { MushroomCarAdvancedCard } from "../src/car-advanced/card";
import "../src/car-advanced/editor";
import type { CarAdvancedEditor } from "../src/car-advanced/editor";

class TestEngine extends LitElement {
  public hass?: HomeAssistant;
  public received?: Record<string, unknown>;
  public setConfig(config: Record<string, unknown>) { this.received = config; }
  protected render() { return html`<ha-card>Vehicle</ha-card>`; }
}
class TestEditor extends TestEngine {
  public configArea = "";
  public _hass?: HomeAssistant;
  public _renderSelectedConfigType() { return html`<div>Vehicle controls</div>`; }
  public _handleMenuValueChange(event: CustomEvent<{ value: string }>) { this.configArea = event.detail.value; }
}
class TestLayout extends HTMLElement {
  public _createVscForm() { return html``; }
}
customElements.define("addition-car-engine", TestEngine);
customElements.define("addition-car-engine-editor", TestEditor);
customElements.define("addition-car-panel-layout-editor", TestLayout);
customElements.define(CAR_TAG, MushroomCarAdvancedCard);

const source = (): HomeAssistant => ({
  language: "en", states: {
    "device_tracker.offline": { entity_id: "device_tracker.offline", state: "unavailable", attributes: {} },
    "device_tracker.car": { entity_id: "device_tracker.car", state: "home", attributes: { friendly_name: "Electric car" } },
  }, callService: vi.fn(async () => undefined),
});
const config = (): CarConfig => ({
  type: `custom:${CAR_TAG}`, entity: "device_tracker.car", name: "My car", secondary: "Ready",
  icon: "mdi:car-electric", tap_action: { action: "more-info" },
  car: {
    indicator_rows: [{ row_items: [{ type: "group", items: [{ entity: "lock.car", tap_action: { action: "more-info" } }] }] }],
    range_info: [{ charging_template: "{{ true }}", charge_target_entity: "number.car_target", color_thresholds: [{ value: 20, color: "red" }] }],
    images: [{ image_entity: "image.car" }, { image: "/local/car.png" }],
    mini_map: { device_tracker: "device_tracker.car", map_height: 220, hours_to_show: 12 },
    button_cards: [{ name: "Charging", card_type: "custom", sub_card: { custom_card: [{ type: "entities", entities: ["switch.car_charging"] }] } }],
    layout_config: { section_order: ["images", "range_info", "indicators", "buttons", "mini_map"], images_swipe: { effect: "fade", height: 180 } },
  },
});
async function settle(element: LitElement) {
  for (let i = 0; i < 6; i++) { await Promise.resolve(); await element.updateComplete; }
}
afterEach(() => { document.body.replaceChildren(); vi.clearAllMocks(); });

describe("Car Advanced integration", () => {
  it("preserves every nested vehicle option, action and template without duplicating the title or mutating input", () => {
    const original = config();
    const before = structuredClone(original);
    const translated = engineConfig(original);
    expect(translated).toEqual({ ...original.car, type: "custom:addition-car-engine", name: "", layout_config: { ...original.car!.layout_config, hide_card_name: true } });
    expect(original).toEqual(before);
    expect(engineConfig({ type: `custom:${CAR_TAG}` }).layout_config).toMatchObject({ section_order: ["indicators", "range_info", "images", "mini_map", "buttons"] });
  });
  it("rejects malformed option shapes instead of letting the underlying renderer fail later", () => {
    expect(() => validateCar({ type: `custom:${CAR_TAG}`, car: [] as never })).toThrow("object");
    expect(() => validateCar({ type: `custom:${CAR_TAG}`, car: { range_info: {} as never } })).toThrow("range_info");
    expect(() => validateCar({ type: `custom:${CAR_TAG}`, car: { mini_map: [] as never } })).toThrow("mini_map");
    expect(() => validateCar({ type: `custom:${CAR_TAG}`, car_show_header: "false" as never })).toThrow("car_show_header");
    expect(validateCar(config())).toEqual(config());
  });
  it("selects a healthy tracker and leaves primary and secondary information unset", () => {
    const stub = carStub(source(), ["device_tracker.offline"]);
    expect(stub.entity).toBe("device_tracker.car");
    expect(stub.car?.mini_map?.device_tracker).toBe(stub.entity);
    expect(stub.primary_info).toBeUndefined();
    expect(stub.secondary_info).toBeUndefined();
    expect(carStub().car?.mini_map).toBeUndefined();
  });
  it("renders the shared Mushroom heading and forwards live hass/config to the private engine", async () => {
    const card = document.createElement(CAR_TAG) as MushroomCarAdvancedCard;
    const h = source(); card.hass = h; card.setConfig(config()); document.body.append(card);
    await settle(card);
    expect(card.shadowRoot?.textContent).toContain("My car");
    expect(card.shadowRoot?.textContent).toContain("Ready");
    const engine = card.shadowRoot!.querySelector<TestEngine>("addition-car-engine")!;
    expect(engine.hass).toBe(h);
    expect(engine.received).toEqual(engineConfig(config()));
    card.setConfig({ ...config(), car: { ...config().car, images: [{ image: "/local/changed.png" }] } });
    await settle(card);
    expect(engine.received?.images).toEqual([{ image: "/local/changed.png" }]);
    expect(card.shadowRoot!.querySelectorAll("addition-car-engine")).toHaveLength(1);
    expect(engine.shadowRoot?.querySelector("#addition-car-theme")).not.toBeNull();
    card.setConfig({ ...config(), car_show_header: false });
    await settle(card);
    expect(card.shadowRoot!.querySelector(".car-heading")).toBeNull();
    expect(card.shadowRoot!.querySelector("addition-car-engine")).toBe(engine);
    expect(engine.received).toEqual(engineConfig(config()));
    card.setConfig(config());
    await settle(card);
    expect(card.shadowRoot!.querySelector(".car-heading")?.textContent).toContain("My car");
  });
  it("isolates vehicle button and image swiper gestures across nested shadow roots without cancelling clicks", async () => {
    const parent = document.createElement("div");
    const card = document.createElement(CAR_TAG) as MushroomCarAdvancedCard;
    card.hass = source();
    card.setConfig(config());
    parent.append(card);
    document.body.append(parent);
    await settle(card);
    const engine = card.shadowRoot!.querySelector<TestEngine>("addition-car-engine")!;
    await engine.updateComplete;
    const dashboard = vi.fn();
    const clicks = vi.fn();
    const internal = vi.fn();
    for (const type of ["touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointercancel"]) {
      parent.addEventListener(type, dashboard);
    }
    parent.addEventListener("click", clicks);
    for (const tag of ["addition-car-vsc-buttons-group", "addition-car-vsc-buttons-grid", "addition-car-vsc-images-slide"]) {
      const child = document.createElement(tag);
      const root = child.attachShadow({ mode: "open" });
      root.innerHTML = '<div class="swiper-container"><div class="swiper-wrapper"><div class="swiper-slide"><vehicle-button></vehicle-button></div></div></div>';
      const container = root.querySelector(".swiper-container")!;
      const swiper = {
        params: { nested: false },
        onTouchMove: vi.fn((event: Event) => { if (event.type === "pointermove") event.preventDefault(); }),
        onTouchEnd: vi.fn(),
      };
      Object.assign(container, { swiper });
      const button = root.querySelector("vehicle-button")!.attachShadow({ mode: "open" });
      button.innerHTML = "<button>Item</button>";
      engine.shadowRoot!.append(child);
      const target = button.querySelector("button")!;
      for (const type of ["touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointercancel"]) {
        target.addEventListener(type, internal);
        const event = new Event(type, { bubbles: true, composed: true, cancelable: true });
        target.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(type === "pointermove");
      }
      expect(swiper.onTouchMove).toHaveBeenCalledTimes(2);
      expect(swiper.onTouchEnd).toHaveBeenCalledTimes(4);
      target.click();
    }
    expect(internal).toHaveBeenCalledTimes(24);
    expect(dashboard).not.toHaveBeenCalled();
    expect(clicks).toHaveBeenCalledTimes(3);
    engine.shadowRoot!.querySelector("ha-card")!.dispatchEvent(new Event("touchstart", { bubbles: true, composed: true }));
    expect(dashboard).toHaveBeenCalledOnce();
  });
  it("keeps all feature panels accessible and round-trips edits without losing shared or unrelated vehicle configuration", async () => {
    const editor = document.createElement("mushroom-addition-car-options") as CarAdvancedEditor;
    editor.hass = source(); editor.config = config(); document.body.append(editor); await settle(editor);
    const native = editor.shadowRoot!.querySelector<CarEngineEditor>("mushroom-addition-car-native-options")!;
    expect(native.configArea).toBe("indicators");
    const buttons = [...editor.shadowRoot!.querySelectorAll<HTMLButtonElement>("button")];
    expect(buttons.map(b => b.textContent!.trim())).toEqual(["Indicators", "Vehicle range", "Images", "Map", "Buttons"]);
    buttons[4].click(); await settle(editor); expect(native.configArea).toBe("buttons");
    const changed = vi.fn(); editor.addEventListener("config-changed", changed);
    native.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: { ...engineConfig(config()), images: [{ image: "/local/edited.png" }] } }, bubbles: true, composed: true,
    }));
    expect(changed).toHaveBeenCalledTimes(1);
    expect(changed.mock.calls[0][0].detail.config).toEqual({
      ...config(), car: { ...config().car, images: [{ image: "/local/edited.png" }] },
    });
    editor.section = "layout"; await settle(editor); expect(native.configArea).toBe("layout_config");
    expect(editor.shadowRoot!.querySelector(".panels")).toBeNull();
  });
  it("binds editor helpers to the preview in their own dialog, not another vehicle elsewhere", async () => {
    const unrelated = document.createElement("addition-car-engine");
    document.body.append(unrelated);
    const dialog = document.createElement("hui-dialog-edit-card");
    const root = dialog.attachShadow({ mode: "open" });
    const preview = document.createElement("addition-car-engine");
    const editor = document.createElement("mushroom-addition-car-options") as CarAdvancedEditor;
    editor.hass = source(); editor.config = config();
    root.append(preview, editor); document.body.append(dialog); await settle(editor);
    const native = editor.shadowRoot!.querySelector<CarEngineEditor>("mushroom-addition-car-native-options")!;
    expect(await native._getCardInPreview()).toBe(preview);
    expect(native._vscElem).not.toBe(unrelated);
  });
});
