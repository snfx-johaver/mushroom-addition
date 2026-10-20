import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { MushroomAdditionEntityCarousel } from "../src/entity-carousel";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import { MushroomAdditionEditor } from "../src/editor";

const type = "custom:mushroom-addition-custom-card-entity-carousel";
const entity = { entity_id: "sensor.battery", state: "75", attributes: { device_class: "battery", friendly_name: "Battery" } };
const hass: HomeAssistant = { states: { [entity.entity_id]: entity }, callService: vi.fn() };

async function create(config: Partial<AdditionConfig> = {}) {
  const card = document.createElement("mushroom-addition-entity-carousel") as MushroomAdditionEntityCarousel;
  card.hass = hass;
  card.config = { type, carousel_items: [{ entity: entity.entity_id }], ...config };
  document.body.append(card);
  await card.updateComplete;
  return card;
}

function tap(card: MushroomAdditionEntityCarousel) {
  const button = card.shadowRoot!.querySelector("button")!;
  for (const name of ["pointerdown", "pointerup"]) {
    button.dispatchEvent(new PointerEvent(name, { bubbles: true, clientX: 100, clientY: 20, button: 0 }));
  }
}

afterEach(() => { document.body.replaceChildren(); vi.useRealTimers(); });

describe("Carousel entity defaults and gestures", () => {
  it("uses native state icons unless explicitly overridden, including picture fallback", async () => {
    const card = await create();
    const icon = card.shadowRoot!.querySelector("ha-state-icon") as HTMLElement & { stateObj: unknown; hass: unknown; _config: unknown; _connection: unknown; _entities: unknown };
    expect(icon.stateObj).toBe(entity);
    expect(icon.hass).toBe(hass);
    expect(icon._config).toBe(hass.config);
    expect(icon._connection).toBe(hass.connection);
    expect(icon._entities).toBe(hass.entities);
    card.config = { type, carousel_items: [{ entity: entity.entity_id, icon: "mdi:star" }] };
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector("ha-state-icon")).toBeNull();
    expect((card.shadowRoot!.querySelector("ha-icon") as HTMLElement & { icon: string }).icon).toBe("mdi:star");
    card.config = { type, carousel_items: [{ entity: entity.entity_id, icon_type: "entity-picture" }] };
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector("ha-state-icon")).not.toBeNull();
    expect(MushroomAdditionEntityCarousel.styles.cssText).toContain("height: 70px");
    expect(MushroomAdditionEntityCarousel.styles.cssText).not.toContain("min-height: 136px");
  });

  it("resolves Default independently for tap, hold and double-tap", async () => {
    vi.useFakeTimers();
    const card = await create({ carousel_items: [{ entity: entity.entity_id, tap_action: { action: "default" }, hold_action: { action: "default" }, double_tap_action: { action: "default" } }] });
    const actions: CustomEvent[] = [];
    card.addEventListener("hass-action", e => actions.push(e as CustomEvent));
    tap(card);
    expect(actions[0].detail).toMatchObject({ action: "tap", config: { tap_action: { action: "more-info" } } });
    const button = card.shadowRoot!.querySelector("button")!;
    button.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 100, clientY: 20 }));
    vi.advanceTimersByTime(500);
    button.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientX: 100, clientY: 20 }));
    expect(actions).toHaveLength(2);
    expect(actions[1].detail).toMatchObject({ action: "hold", config: { hold_action: { action: "none" } } });
  });

  it("uses the primary entity icon in the header after clearing an override", async () => {
    const card = document.createElement(type.replace("custom:", "")) as HTMLElement & {
      hass: HomeAssistant; setConfig(config: AdditionConfig): void; updateComplete: Promise<boolean>;
    };
    card.hass = hass;
    card.setConfig({ type, entity: entity.entity_id, carousel_show_header: true });
    document.body.append(card);
    await card.updateComplete;
    const icon = card.shadowRoot!.querySelector(".entity-carousel-presentation ha-state-icon") as HTMLElement & { stateObj: unknown };
    expect(icon.stateObj).toBe(entity);
    card.setConfig({ type, entity: entity.entity_id, carousel_show_header: true, icon: "mdi:star" });
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".entity-carousel-presentation ha-state-icon")).toBeNull();
  });

  it("arbitrates double-tap, delayed tap, hold, swipe and disconnect", async () => {
    vi.useFakeTimers();
    const card = await create({ carousel_items: [{ entity: entity.entity_id, double_tap_action: { action: "toggle" }, hold_action: { action: "more-info" } }] });
    const actions: CustomEvent[] = [];
    card.addEventListener("hass-action", e => actions.push(e as CustomEvent));
    tap(card);
    expect(actions).toHaveLength(0);
    vi.advanceTimersByTime(100);
    tap(card);
    expect(actions[0].detail).toMatchObject({ action: "double_tap", config: { double_tap_action: { action: "toggle" } } });
    vi.advanceTimersByTime(400);
    expect(actions).toHaveLength(1);
    tap(card);
    vi.advanceTimersByTime(300);
    expect(actions[1].detail.action).toBe("tap");
    tap(card);
    const heldButton = card.shadowRoot!.querySelector("button")!;
    heldButton.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 100, clientY: 20 }));
    vi.advanceTimersByTime(500);
    heldButton.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientX: 100, clientY: 20 }));
    expect(actions).toHaveLength(3);
    expect(actions[2].detail.action).toBe("hold");
    tap(card);
    const button = card.shadowRoot!.querySelector("button")!;
    button.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, clientX: 100, clientY: 20 }));
    button.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, clientX: 50, clientY: 20 }));
    button.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, clientX: 50, clientY: 20 }));
    vi.advanceTimersByTime(600);
    expect(actions).toHaveLength(3);
    tap(card);
    card.remove();
    vi.advanceTimersByTime(600);
    expect(actions).toHaveLength(3);
  });

  it("clears icons and actions without repopulating defaults in the editor", async () => {
    const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
    editor.hass = hass;
    editor.setConfig({ type, icon: "mdi:star", carousel_items: [{ entity: entity.entity_id, icon: "mdi:star", tap_action: { action: "toggle" } }] });
    document.body.append(editor);
    await editor.updateComplete;
    const changes: CustomEvent[] = [];
    editor.addEventListener("config-changed", e => changes.push(e as CustomEvent));
    const row = editor.shadowRoot!.querySelector(".carousel-item-row")!;
    const selectors = [...row.querySelectorAll("ha-selector")] as (HTMLElement & { selector: { ui_action?: unknown }; value: unknown; required: boolean })[];
    const actions = selectors.filter(s => s.selector.ui_action);
    expect(actions).toHaveLength(3);
    expect(actions.every(a => a.required === false)).toBe(true);
    expect(actions[0].selector.ui_action).toEqual({ default_action: "more-info" });
    expect(actions[1].value).toBeUndefined();
    expect(actions[2].value).toBeUndefined();
    actions[0].dispatchEvent(new CustomEvent("value-changed", { detail: { value: { action: "default" } } }));
    expect(changes.at(-1)!.detail.config.carousel_items[0]).not.toHaveProperty("tap_action");
    row.querySelector("label button")!.dispatchEvent(new MouseEvent("click"));
    expect(changes.at(-1)!.detail.config.carousel_items[0]).not.toHaveProperty("icon");
    const clearHeader = [...editor.shadowRoot!.querySelectorAll("button")].find(b => b.textContent === "Use entity icon")!;
    clearHeader.click();
    expect(changes.at(-1)!.detail.config).not.toHaveProperty("icon");
    await editor.updateComplete;
    const forms = [...editor.shadowRoot!.querySelectorAll("ha-form")] as (HTMLElement & { data: AdditionConfig })[];
    expect(forms.every(f => !f.data.icon)).toBe(true);
  });
});
