import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { MushroomAdditionEntityCarousel } from "../src/entity-carousel";
import { MushroomAdditionCard } from "../src/card";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import { MushroomAdditionEditor } from "../src/editor";
import { CATALOG } from "../src/catalog";
import { createStubConfig } from "../src/stub";
import type { CarouselEffect, CarouselPagination, HassEntity } from "../src/types";

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
  const button = card.shadowRoot!.querySelector(".item.active")!;
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
    expect(MushroomAdditionEntityCarousel.styles.cssText).toContain("height: var(--carousel-stage-height, 70px)");
    expect(MushroomAdditionEntityCarousel.styles.cssText).not.toContain("min-height: 136px");
  });

  describe("Carousel controls and effects", () => {
    const items = ["first", "second", "third", "fourth"].map(name => ({ entity: `scene.${name}`, name }));
    const selected = (card: MushroomAdditionEntityCarousel) => card.shadowRoot!.querySelector<HTMLElement>(".item.active")!.dataset.carouselIndex;
    const matrix = (["coverflow", "slide", "fade", "cube", "flip"] as CarouselEffect[])
      .flatMap(effect => (["bullets", "fraction", "progressbar"] as CarouselPagination[]).map(pagination => ({ effect, pagination })));

    it.each(["coverflow", "slide", "fade", "cube", "flip"] as CarouselEffect[])(
      "sizes buttons, symbols, stage and effect geometry consistently for %s", async (effect) => {
        for (const [requested, expected] of [
          [{}, [58, 58, 28]],
          [{ carousel_button_width: 80, carousel_button_height: 110, carousel_icon_size: 40 }, [80, 110, 40]],
          [{ carousel_button_width: 32, carousel_button_height: 32, carousel_icon_size: 96 }, [32, 32, 20]],
          [{ carousel_button_width: 1000, carousel_button_height: -2, carousel_icon_size: 500 }, [160, 32, 20]],
        ] as const) {
          const card = await create({ carousel_items: items, carousel_effect: effect, ...requested });
          const viewport = card.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
          const [width, height, icon] = expected;
          for (const [key, value] of [["button-width", width], ["button-height", height],
            ["stage-height", height + 12], ["icon-size", icon]] as const) {
            expect(viewport.style.getPropertyValue(`--carousel-${key}`)).toBe(`${value}px`);
          }
          const second = card.shadowRoot!.querySelectorAll(".item")[1];
          if (effect === "cube") expect(second.getAttribute("style")).toContain(`50% 50% -${width / 2}px`);
          if (["slide", "coverflow"].includes(effect)) expect(second.getAttribute("style")).toContain(`translateX(${width}px)`);
          card.remove();
        }
      },
    );

    it("exposes pixel sliders in Layout and preserves sizes with other carousel settings", async () => {
      const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
      editor.hass = hass;
      editor.setConfig({ type, carousel_items: items, carousel_navigation: true, parameters: { effect: "cube" } });
      document.body.append(editor);
      await editor.updateComplete;
      const layout = [...editor.shadowRoot!.querySelectorAll(".editor-section")]
        .find(section => section.querySelector(".section-header")?.textContent?.trim() === "Layout")!;
      const form = layout.querySelector<HTMLElement & { data: AdditionConfig; schema: { name: string; selector?: unknown }[] }>("ha-form")!;
      for (const [name, min, max, initial] of [
        ["carousel_button_width", 32, 160, 58], ["carousel_button_height", 32, 160, 58],
        ["carousel_icon_size", 12, 96, 28],
      ] as const) {
        expect(form.schema.find(field => field.name === name)?.selector)
          .toEqual({ number: { min, max, step: 1, mode: "slider", unit_of_measurement: "px" } });
        expect(form.data[name]).toBe(initial);
      }
      const changed = vi.fn();
      editor.addEventListener("config-changed", changed);
      form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: {
        ...form.data, carousel_button_width: 72, carousel_button_height: 96, carousel_icon_size: 36,
      } }, bubbles: true }));
      expect(changed.mock.calls.at(-1)![0].detail.config).toMatchObject({
        carousel_button_width: 72, carousel_button_height: 96, carousel_icon_size: 36,
        carousel_navigation: true, parameters: { effect: "cube" }, carousel_items: items,
      });
    });

    it.each(matrix)("synchronizes navigation, $pagination and scrollbar with $effect without triggering actions", async ({ effect, pagination }) => {
      const card = await create({ carousel_items: items, carousel_effect: effect, carousel_loop: false,
        carousel_navigation: true, carousel_pagination: true, carousel_pagination_type: pagination, carousel_scrollbar: true });
      const root = card.shadowRoot!;
      const actions = vi.fn();
      card.addEventListener("hass-action", actions);
      const previous = root.querySelector<HTMLButtonElement>('[aria-label="Previous item"]')!;
      const next = root.querySelector<HTMLButtonElement>('[aria-label="Next item"]')!;
      const scrollbar = root.querySelector<HTMLInputElement>(".scrollbar")!;
      expect(previous.disabled).toBe(true);
      next.click();
      await card.updateComplete;
      expect(selected(card)).toBe("1");
      expect(scrollbar.value).toBe("1");
      if (pagination === "bullets") expect(root.querySelector('[aria-current="true"]')?.getAttribute("aria-label")).toBe("second");
      if (pagination === "fraction") expect(root.querySelector(".pagination output")?.textContent).toBe("2 / 4");
      if (pagination === "progressbar") expect(root.querySelector("progress")?.value).toBe(2);
      scrollbar.value = "3";
      scrollbar.dispatchEvent(new Event("input", { bubbles: true }));
      await card.updateComplete;
      expect(selected(card)).toBe("3");
      expect(next.disabled).toBe(true);
      previous.click();
      await card.updateComplete;
      expect(selected(card)).toBe("2");
      if (pagination === "bullets") {
        root.querySelector<HTMLButtonElement>(".dot")!.click();
        await card.updateComplete;
        expect(selected(card)).toBe("0");
      }
      expect(actions).not.toHaveBeenCalled();
    });

    it.each(["fade", "cube", "flip"] as CarouselEffect[])("uses a single centered %s face and responds to swipes and keyboard", async effect => {
      const card = await create({ carousel_effect: effect, carousel_items: items, carousel_slides_per_view: 7, carousel_centered_slides: false });
      const root = card.shadowRoot!;
      const active = root.querySelector<HTMLButtonElement>(".item.active")!;
      const neighbor = root.querySelectorAll<HTMLButtonElement>(".item")[1];
      expect(active.style.transform).not.toContain("translateX(-");
      expect(neighbor.style.pointerEvents).toBe("none");
      if (effect === "fade") { expect(active.style.opacity).toBe("1"); expect(neighbor.style.opacity).toBe("0"); }
      if (effect === "cube") expect(neighbor.style.transform).toBe("rotateY(90deg)");
      if (effect === "flip") expect(neighbor.style.transform).toBe("rotateY(180deg)");
      const actions = vi.fn();
      card.addEventListener("hass-action", actions);
      for (const [name, x] of [["pointerdown", 100], ["pointermove", 65], ["pointerup", 65]] as const) {
        active.dispatchEvent(new PointerEvent(name, { bubbles: true, clientX: x, clientY: 20, button: 0 }));
      }
      await card.updateComplete;
      expect(selected(card)).toBe("1");
      root.querySelector(".carousel")!.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
      await card.updateComplete;
      expect(selected(card)).toBe("3");
      root.querySelector(".carousel")!.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
      await card.updateComplete;
      expect(selected(card)).toBe("0");
      expect(actions).not.toHaveBeenCalled();
      tap(card);
      expect(actions).toHaveBeenCalledTimes(1);
    });

    it("does not show optional chrome by default and handles one/zero items", async () => {
      const card = await create();
      expect(card.shadowRoot!.querySelector(".navigation, .pagination, .scrollbar")).toBeNull();
      card.config = { ...card.config!, carousel_navigation: true, carousel_pagination: true, carousel_scrollbar: true };
      await card.updateComplete;
      expect([...card.shadowRoot!.querySelectorAll<HTMLButtonElement>(".navigation")].every(button => button.disabled)).toBe(true);
      expect(card.shadowRoot!.querySelector<HTMLInputElement>(".scrollbar")!.disabled).toBe(true);
      card.config = { ...card.config!, carousel_items: [] };
      await card.updateComplete;
      expect(card.shadowRoot!.querySelector(".navigation, .pagination, .scrollbar")).toBeNull();
      expect(card.shadowRoot!.textContent).toContain("Add carousel items");
      card.config = { ...card.config!, carousel_items: items };
      await card.updateComplete;
      expect(card.shadowRoot!.querySelectorAll(".item")).toHaveLength(4);
    });

    it("maps Swiper-style parameters to the editor, and explicit off overrides those parameters", async () => {
      const config: AdditionConfig = { type, carousel_items: items, parameters: {
        effect: "cube", navigation: true, pagination: { type: "fraction" }, scrollbar: { enabled: true },
      } };
      const card = await create(config);
      expect(card.shadowRoot!.querySelectorAll(".navigation")).toHaveLength(2);
      expect(card.shadowRoot!.querySelector(".pagination output")?.textContent).toBe("1 / 4");
      const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
      editor.hass = hass; editor.setConfig(config); document.body.append(editor); await editor.updateComplete;
      const form = editor.shadowRoot!.querySelector<HTMLElement & { data: AdditionConfig }>("ha-form")!;
      expect(form.data).toMatchObject({ carousel_effect: "cube", carousel_navigation: true, carousel_pagination: true,
        carousel_pagination_type: "fraction", carousel_scrollbar: true });
      const changed = vi.fn();
      editor.addEventListener("config-changed", changed);
      form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: {
        ...form.data, carousel_navigation: false, carousel_pagination: false, carousel_scrollbar: false,
      } }, bubbles: true }));
      card.config = changed.mock.calls[0][0].detail.config;
      await card.updateComplete;
      expect(card.shadowRoot!.querySelector(".navigation, .pagination, .scrollbar")).toBeNull();
    });

    it("wraps pagination dots on narrow cards without an overflow scrollbar", () => {
      const styles = MushroomAdditionEntityCarousel.styles.cssText;
      const bullets = styles.match(/\.pagination.bullets \{[^}]+\}/)?.[0];
      expect(bullets).toContain("flex-wrap: wrap");
      expect(bullets).not.toContain("overflow-x: auto");
      expect(styles).toContain("flex: 0 0 24px");
    });

    it("keeps tile surfaces solid and borderless with keyboard focus and reduced motion", () => {
      const styles = MushroomAdditionEntityCarousel.styles.cssText;
      expect(styles).not.toContain("gradient(");
      expect(styles.match(/\.item \{[^}]+\}/)?.[0]).toContain("background: var(--card-background-color)");
      expect(styles).not.toContain(".item.entity-active {");
      expect(styles.match(/\.icon-circle \{[^}]+\}/)?.[0]).toContain("border-radius: 50%");
      expect(styles.match(/\.icon-circle \{[^}]+\}/)?.[0]).toContain("16%");
      expect(styles.match(/\.item::after \{[^}]+\}/)?.[0]).not.toContain("background:");
      expect(styles.match(/\.item::after \{[^}]+\}/)?.[0]).toContain("box-shadow:");
      expect(styles.match(/\.item \{[^}]+\}/)?.[0]).toContain("border: 0");
      expect(styles.match(/\.item.active \{[^}]+\}/)?.[0]).not.toMatch(/border|inset/);
      expect(styles).toContain(":focus-visible");
      expect(styles).toContain("prefers-reduced-motion: reduce");
    });
  });

  describe("Carousel catalogue room examples", () => {
    const descriptor = CATALOG.find(item => item.upstreamId === "custom_card_entity_carousel")!;
    const state = (id: string, attributes: HassEntity["attributes"] = {}, value = "off"): HassEntity =>
      ({ entity_id: id, state: value, attributes });
    it("picks healthy Hue scenes from one room and aligns the header, not arbitrary fallback sensors", async () => {
      const exampleHass: HomeAssistant = { callService: vi.fn(), states: {
        "sensor.noise": state("sensor.noise"),
        "light.office": state("light.office", { friendly_name: "Office light" }),
        "scene.office_read": state("scene.office_read", { group_name: "Office", friendly_name: "Office Read" }),
        "scene.kitchen_relax": state("scene.kitchen_relax", { group_name: "Kitchen" }),
        "scene.office_relax": state("scene.office_relax", { group_name: "Office", friendly_name: "Office Relax" }),
        "scene.office_bad": state("scene.office_bad", { group_name: "Office" }, "unavailable"),
        "scene.zone": state("scene.zone", { group_name: "Whole house", group_type: "zone" }),
      }, entities: {
        "light.office": { area_id: "office" },
        ...Object.fromEntries(["office_read", "office_relax", "kitchen_relax", "office_bad", "zone"].map(id => [`scene.${id}`, { platform: "hue", area_id: "infrastructure" }])),
      }, areas: { office: { area_id: "office", name: "Office" }, kitchen: { area_id: "kitchen", name: "Kitchen" } } };
      const stub = createStubConfig(descriptor, exampleHass, ["light.office"], ["sensor.noise", "scene.kitchen_relax"]);
      expect(stub.entity).toBe("light.office");
      expect(stub.name).toBe("Office");
      expect(stub.carousel_items?.map(item => item.entity)).toEqual(["scene.office_read", "scene.office_relax"]);
      const card = document.createElement(descriptor.tag) as MushroomAdditionCard;
      card.hass = exampleHass;
      card.setConfig(stub);
      document.body.append(card);
      await card.updateComplete;
      expect(card.shadowRoot!.querySelector(".ulm-name")?.textContent).toBe("Office");
      for (const item of stub.carousel_items!) {
        expect(item.icon).toBeUndefined();
        expect(item.tap_action).toEqual({ action: "perform-action", perform_action: "scene.turn_on", target: { entity_id: item.entity } });
      }
    });

    it("uses known light membership/device areas and rejects mixed-room/non-light scenes", () => {
      const exampleHass: HomeAssistant = { callService: vi.fn(), states: {
        "light.office": state("light.office"), "light.kitchen": state("light.kitchen"),
        "scene.read": state("scene.read", { entity_id: ["light.office"] }),
        "scene.relax": state("scene.relax", { entities: { "light.office": "on" } }),
        "scene.mixed": state("scene.mixed", { entity_id: ["light.office", "light.kitchen"] }),
        "scene.climate": state("scene.climate", { entity_id: ["climate.office"] }),
        "scene.unknown": state("scene.unknown"),
      }, entities: { "light.office": { device_id: "desk" }, "light.kitchen": { area_id: "kitchen" } },
      devices: { desk: { area_id: "office" } }, areas: { office: { area_id: "office", name: "Office" } } };
      const stub = createStubConfig(descriptor, exampleHass);
      expect(stub.carousel_items?.map(item => item.entity)).toEqual(["scene.read", "scene.relax"]);
      expect(createStubConfig(descriptor, { states: { "sensor.noise": state("sensor.noise") }, callService: vi.fn() }).carousel_items).toEqual([]);
    });
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
