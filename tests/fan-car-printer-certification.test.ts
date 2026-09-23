import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { editorSchemaFor } from "../src/editor-schema";
import { normalizeConfig } from "../src/helpers";
import { publicItemForSource, variantForSource } from "../src/catalog";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import "../src/index";

const states: HomeAssistant["states"] = {
  "fan.air_purifier": {
    entity_id: "fan.air_purifier",
    state: "on",
    attributes: {
      friendly_name: "Air purifier",
      percentage: 44,
      percentage_step: 5,
      oscillate: false,
      temp: 22.4,
      hum: 48.2,
    },
  },
  "scene.relax": { entity_id: "scene.relax", state: "off", attributes: { friendly_name: "Relax", icon: "mdi:sofa" } },
  "automation.running": { entity_id: "automation.running", state: "on", attributes: { friendly_name: "Running", icon: "mdi:run" } },
  "script.movie": { entity_id: "script.movie", state: "off", attributes: { friendly_name: "Movie", icon: "mdi:movie-open" } },
  "sensor.car_model": {
    entity_id: "sensor.car_model",
    state: "home",
    attributes: { friendly_name: "Audi Q3" },
    last_changed: "2026-09-23T22:47:00+02:00",
  },
  "binary_sensor.car_doors": { entity_id: "binary_sensor.car_doors", state: "off", attributes: { friendly_name: "Doors" } },
  "sensor.car_energy": { entity_id: "sensor.car_energy", state: "50.4", attributes: { unit_of_measurement: "%" } },
  "sensor.car_range": { entity_id: "sensor.car_range", state: "359.6", attributes: { unit_of_measurement: "km" } },
  "plant.bonsai": {
    entity_id: "plant.bonsai",
    state: "ok",
    attributes: {
      friendly_name: "Bonsai Ficus",
      temperature: 22,
      humidity: 58,
      moisture: 42,
      conductivity: 35,
      illuminance: 18,
      dli: 64,
    },
  },
  "binary_sensor.window": {
    entity_id: "binary_sensor.window",
    state: "off",
    attributes: { friendly_name: "Patio", icon: "mdi:door-sliding" },
    last_changed: "2026-09-23T20:00:00Z",
  },
  "sensor.window_handle": { entity_id: "sensor.window_handle", state: "Closed", attributes: {} },
  "sensor.window_battery": { entity_id: "sensor.window_battery", state: "18", attributes: { unit_of_measurement: "%" } },
  "sensor.printer_status": { entity_id: "sensor.printer_status", state: "Idle", attributes: { friendly_name: "HP LaserJet" } },
  "sensor.black": { entity_id: "sensor.black", state: "75", attributes: {} },
  "sensor.color": { entity_id: "sensor.color", state: "54", attributes: {} },
  "sensor.unavailable_toner": { entity_id: "sensor.unavailable_toner", state: "unavailable", attributes: {} },
};

interface TestCard extends HTMLElement {
  hass: HomeAssistant;
  setConfig(config: AdditionConfig): void;
  updateComplete: Promise<boolean>;
  shadowRoot: ShadowRoot;
}

const tagForSource = (sourceId: string): string => {
  const item = publicItemForSource(sourceId)!;
  return sourceId === item.upstreamId ? item.tag : `mushroom-addition-${sourceId.replaceAll("_", "-")}`;
};

const renderCard = async (
  sourceId: string,
  config: Omit<AdditionConfig, "type">,
  overrides = states,
  callService = vi.fn(async () => undefined),
): Promise<TestCard> => {
  const tag = tagForSource(sourceId);
  const card = document.createElement(tag) as TestCard;
  card.hass = { states: overrides, callService };
  card.setConfig({
    type: `custom:${tag}`,
    variant: variantForSource(sourceId),
    ...config,
  });
  document.body.append(card);
  await card.updateComplete;
  return card;
};

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

describe("fan, car, and printer custom source certification", () => {
  it("records exactly six honest local certifications and exact live configs", () => {
    const evidence = JSON.parse(readFileSync(join(
      process.cwd(), "docs", "assets", "visual-audit", "fan-car-printer-local-certification.json",
    ), "utf8")) as {
      liveAccepted: boolean;
      physicalActionsProhibited: boolean;
      geometry: Record<string, { width: number; height: number; regions: Record<string, number> }>;
      sources: Record<string, { liveConfig: Record<string, unknown>; artifact: string; visibleInteractions: unknown[] }>;
    };
    expect(evidence.liveAccepted).toBe(false);
    expect(evidence.physicalActionsProhibited).toBe(true);
    expect(Object.keys(evidence.sources)).toEqual([
      "custom_card_saxel_fan",
      "custom_card_scenes",
      "custom_card_schumijo_car",
      "custom_card_schumijo_flower",
      "custom_card_senoro_win",
      "custom_card_sisimomo_printer",
    ]);
    expect(evidence.sources.custom_card_saxel_fan.liveConfig).toEqual({
      entity: "fan.air_purifier",
      collapsable: true,
      ulm_card_fan_horizontal: false,
      ulm_show_button: true,
      ulm_button_service: "fan.oscillate",
      oscillate_attribute: "oscillate",
      tap_action: { action: "toggle" },
      hold_action: { action: "more-info" },
    });
    expect(evidence.sources.custom_card_schumijo_car.liveConfig).toMatchObject({
      ulm_card_schumijo_car_tracker: "sensor.hn_etronq6_model",
      ulm_card_schumijo_car_lock: "binary_sensor.hn_etronq6_doors",
      ulm_card_schumijo_car_energy_level: "sensor.hn_etronq6_primary_engine_percent",
      ulm_card_schumijo_car_range: "sensor.hn_etronq6_range",
    });
    expect(evidence.sources.custom_card_senoro_win.liveConfig).toEqual({
      entity: "binary_sensor.office_joris_window",
      tap_action: { action: "none" },
    });
    expect(evidence.sources.custom_card_senoro_win.visibleInteractions).toEqual([]);
    expect(Object.values(evidence.sources).every(({ artifact }) => artifact.endsWith("-comparison.png"))).toBe(true);
    expect(evidence.geometry.custom_card_saxel_fan).toMatchObject({
      width: 249,
      regions: { summary: 1, slider: 1, oscillate: 1 },
    });
    expect(evidence.geometry.custom_card_scenes.regions.buttons).toBe(5);
    expect(evidence.geometry.custom_card_sisimomo_printer).toMatchObject({
      width: 500,
      regions: { summary: 1, cartridges: 6 },
    });
  });

  it("provides source-specific defaults, graphical fields, and editor round trips", async () => {
    const expectedFields: Record<string, string[]> = {
      custom_card_saxel_fan: ["entity", "collapsable", "ulm_card_fan_horizontal", "ulm_show_button", "ulm_button_service", "oscillate_attribute"],
      custom_card_scenes: ["variant", "name_mode"],
      custom_card_schumijo_car: ["ulm_card_schumijo_car_tracker", "ulm_card_schumijo_car_lock", "ulm_card_schumijo_car_energy_level", "ulm_card_schumijo_car_range"],
      custom_card_schumijo_flower: ["ulm_card_flower_entity", "ulm_card_flower_name", "ulm_card_flower_species", "ulm_card_flower_show_bars"],
      custom_card_senoro_win: ["entity", "ulm_custom_card_senoro_win_handle", "ulm_custom_card_senoro_win_battery_level", "ulm_custom_card_senoro_win_battery_warning"],
      custom_card_sisimomo_printer: ["entity", "ulm_card_printer_name", "cartridges"],
    };
    for (const [sourceId, fields] of Object.entries(expectedFields)) {
      const item = publicItemForSource(sourceId)!;
      const variant = variantForSource(sourceId);
      expect(editorSchemaFor(item, { type: `custom:${item.tag}`, variant }).map(({ name }) => name))
        .toEqual(expect.arrayContaining(fields));

      const tag = tagForSource(sourceId);
      const constructor = customElements.get(tag) as typeof HTMLElement & {
        getStubConfig?: (hass: HomeAssistant, entities: string[], fallback: string[]) => AdditionConfig;
      };
      const publicConstructor = customElements.get(item.tag) as typeof HTMLElement & {
        getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
      };
      const config = constructor.getStubConfig?.({ states, callService: vi.fn() }, Object.keys(states), []) ??
        publicConstructor.getStubConfig({ states, callService: vi.fn() }, Object.keys(states), []);
      const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
        shadowRoot: ShadowRoot;
      };
      editor.hass = { states, callService: vi.fn() };
      editor.setConfig({ ...config, variant });
      document.body.append(editor);
      await editor.updateComplete;
      const form = editor.shadowRoot.querySelector<HTMLElement & { data: AdditionConfig }>("ha-form")!;
      const changed = vi.fn();
      editor.addEventListener("config-changed", changed);
      form.dispatchEvent(new CustomEvent("value-changed", {
        bubbles: true,
        composed: true,
        detail: { value: { ...form.data, name: "Round trip" } },
      }));
      expect(changed).toHaveBeenCalledWith(expect.objectContaining({
        detail: { config: expect.objectContaining({ name: "Round trip" }) },
      }));
      editor.remove();
    }

    const fan = customElements.get(tagForSource("custom_card_saxel_fan")) as typeof HTMLElement & {
      getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
    };
    expect(fan.getStubConfig({ states, callService: vi.fn() }, Object.keys(states), [])).toMatchObject({
      entity: "fan.air_purifier",
      collapsable: true,
      ulm_show_button: true,
      ulm_button_service: "fan.oscillate",
      tap_action: { action: "toggle" },
      hold_action: { action: "more-info" },
    });
  });

  it("migrates documented nested and legacy semantic fields", () => {
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-scenes",
      entity_1: { entity_id: "scene.relax", icon: "mdi:sofa", icon_color: "yellow", name: "Relax" },
      entity_2: { entity_id: "automation.running", icon: "mdi:run", icon_color: "blue", name: "Running" },
    })).toMatchObject({
      scene_items: [
        { entity: "scene.relax", icon: "mdi:sofa", color: "yellow", name: "Relax" },
        { entity: "automation.running", icon: "mdi:run", color: "blue", name: "Running" },
      ],
    });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-schumijo-car",
      range_entity: "sensor.car_range",
      battery_entity: "sensor.car_energy",
      doors_entity: "binary_sensor.car_doors",
      ulm_card_schumijo_car_tracker: "sensor.car_model",
    })).toMatchObject({
      entity: "sensor.car_model",
      ulm_card_schumijo_car_range: "sensor.car_range",
      ulm_card_schumijo_car_energy_level: "sensor.car_energy",
      ulm_card_schumijo_car_lock: "binary_sensor.car_doors",
    });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-schumijo-flower",
      ulm_card_flower_entity: "plant.bonsai",
    })).toMatchObject({ entity: "plant.bonsai", ulm_card_flower_entity: "plant.bonsai" });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-senoro-win",
      entity: "binary_sensor.window",
      entities: ["sensor.window_handle", "sensor.window_battery"],
    })).toMatchObject({
      ulm_custom_card_senoro_win_entity: "binary_sensor.window",
      ulm_custom_card_senoro_win_handle: "sensor.window_handle",
      ulm_custom_card_senoro_win_battery_level: "sensor.window_battery",
    });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-sisimomo-printer",
      entity: "sensor.printer_status",
      entities: ["sensor.black", "sensor.color"],
    }).cartridges).toEqual([
      { label: "BK", entity_id: "sensor.black", type: "unicolor", color: "black" },
      { label: "C", entity_id: "sensor.color", type: "unicolor", color: "#427EDE" },
    ]);
  });

  it("matches Saxel fan states and every visible payload", async () => {
    const callService = vi.fn(async () => undefined);
    const card = await renderCard("custom_card_saxel_fan", {
      entity: "fan.air_purifier",
      collapsable: false,
      ulm_show_button: true,
      ulm_button_service: "fan.oscillate",
      oscillate_attribute: "oscillate",
      tap_action: { action: "toggle" },
      hold_action: { action: "more-info" },
    }, states, callService);
    expect(card.shadowRoot.querySelector(".custom-saxel-fan.is-on")).not.toBeNull();
    expect(card.shadowRoot.textContent).toContain("44% • 22°C • 48%");
    const slider = card.shadowRoot.querySelector<HTMLInputElement>(".saxel-fan-slider")!;
    slider.value = "65";
    slider.dispatchEvent(new Event("change", { bubbles: true }));
    card.shadowRoot.querySelector<HTMLButtonElement>(".saxel-fan-oscillate")!.click();
    expect(callService.mock.calls).toEqual([
      ["fan", "set_percentage", { entity_id: "fan.air_purifier", percentage: 65 }],
      ["fan", "oscillate", { entity_id: "fan.air_purifier", oscillating: true }],
    ]);

    const actions = vi.fn();
    card.addEventListener("hass-action", actions);
    card.shadowRoot.querySelector<HTMLElement>(".action-surface")!.click();
    expect(actions).toHaveBeenLastCalledWith(expect.objectContaining({
      detail: { action: "tap", config: expect.objectContaining({ entity: "fan.air_purifier", tap_action: { action: "toggle" } }) },
    }));
    card.remove();

    const collapsed = await renderCard("custom_card_saxel_fan", {
      entity: "fan.air_purifier", collapsable: true,
    }, {
      ...states,
      "fan.air_purifier": { ...states["fan.air_purifier"], state: "off" },
    });
    expect(collapsed.shadowRoot.querySelector(".saxel-fan-controls")).toBeNull();
  });

  it("limits the source Scenes grid to five and dispatches exact domain payloads", async () => {
    const callService = vi.fn(async () => undefined);
    const card = await renderCard("custom_card_scenes", {
      scene_items: [
        { entity: "scene.relax" },
        { entity: "automation.running" },
        { entity: "script.movie" },
        { entity: "scene.relax" },
        { entity: "scene.relax" },
        { entity: "scene.relax" },
      ],
      tap_action: { action: "none" },
    }, states, callService);
    const buttons = [...card.shadowRoot.querySelectorAll<HTMLButtonElement>(".scene-button")];
    expect(buttons).toHaveLength(5);
    buttons.slice(0, 3).forEach((button) => button.click());
    expect(callService.mock.calls).toEqual([
      ["homeassistant", "turn_on", { entity_id: "scene.relax" }],
      ["automation", "trigger", { entity_id: "automation.running" }],
      ["homeassistant", "turn_on", { entity_id: "script.movie" }],
    ]);
  });

  it("renders Car source badges and read-only metrics with one more-info interaction", async () => {
    const card = await renderCard("custom_card_schumijo_car", {
      entity: "sensor.car_model",
      ulm_card_schumijo_car_tracker: "sensor.car_model",
      ulm_card_schumijo_car_lock: "binary_sensor.car_doors",
      ulm_card_schumijo_car_energy_level: "sensor.car_energy",
      ulm_card_schumijo_car_range: "sensor.car_range",
      ulm_card_schumijo_car_name: "Audi Q3",
      tap_action: { action: "none" },
    });
    expect(card.shadowRoot.querySelector(".car-badge.is-home")).not.toBeNull();
    expect(card.shadowRoot.querySelector(".car-badge.is-locked")).not.toBeNull();
    expect(card.shadowRoot.textContent).toContain("50");
    expect(card.shadowRoot.textContent).toContain("% Nível de energia");
    expect(card.shadowRoot.textContent).toContain("360");
    expect(card.shadowRoot.textContent).toContain("km Alcance");
    const actions = vi.fn();
    card.addEventListener("hass-action", actions);
    card.shadowRoot.querySelector<HTMLButtonElement>(".car-hero")!.click();
    expect(actions).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        action: "tap",
        config: expect.objectContaining({ entity: "sensor.car_model", tap_action: { action: "more-info" } }),
      },
    }));
  });

  it("renders Flower status and configured attribute bars with one more-info interaction", async () => {
    const card = await renderCard("custom_card_schumijo_flower", {
      entity: "plant.bonsai",
      ulm_card_flower_entity: "plant.bonsai",
      ulm_card_flower_name: "Bonsai Ficus",
      ulm_card_flower_show_bars: ["temperature", "humidity", "moisture", "conductivity", "illuminance", "dli"],
      tap_action: { action: "none" },
    });
    expect(card.shadowRoot.querySelectorAll(".flower-bars > span")).toHaveLength(6);
    expect(card.shadowRoot.textContent).toContain("Correto");
    const actions = vi.fn();
    card.addEventListener("hass-action", actions);
    card.shadowRoot.querySelector<HTMLButtonElement>(".flower-heading")!.click();
    expect(actions).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        action: "tap",
        config: expect.objectContaining({ entity: "plant.bonsai", tap_action: { action: "more-info" } }),
      },
    }));
    card.remove();

    const problem = await renderCard("custom_card_schumijo_flower", {
      entity: "plant.bonsai", ulm_card_flower_entity: "plant.bonsai",
    }, {
      ...states,
      "plant.bonsai": { ...states["plant.bonsai"], state: "problem" },
    });
    expect(problem.shadowRoot.textContent).toContain("Problema");
  });

  it.each([
    ["off", "Closed", "Locked", "status-locked"],
    ["off", "Open", "Closed", "status-closed"],
    ["on", "Tilted", "Tilted", "status-tilted"],
    ["on", "Open", "Open", "status-open"],
    ["on", "Closed", "Manipulated", "status-manipulated"],
  ])("maps Senoro contact %s and handle %s to %s", async (contact, handle, label, cssClass) => {
    const card = await renderCard("custom_card_senoro_win", {
      entity: "binary_sensor.window",
      ulm_custom_card_senoro_win_handle: "sensor.window_handle",
      ulm_custom_card_senoro_win_battery_level: "sensor.window_battery",
      tap_action: { action: "none" },
    }, {
      ...states,
      "binary_sensor.window": { ...states["binary_sensor.window"], state: contact },
      "sensor.window_handle": { ...states["sensor.window_handle"], state: handle },
    });
    expect(card.shadowRoot.querySelector(`.${cssClass}`)).not.toBeNull();
    expect(card.shadowRoot.textContent).toContain(label);
    expect(card.shadowRoot.querySelector(".senoro-battery-badge.is-warning")).not.toBeNull();
  });

  it("renders printer cartridge types, unavailable toner, errors, and exact header action", async () => {
    const config = {
      entity: "sensor.printer_status",
      ulm_card_printer_name: "HP LaserJet",
      tap_action: { action: "none" },
      cartridges: [
        { label: "BK", entity_id: "sensor.black", type: "unicolor" as const, color: "black" },
        { label: "Col", entity_id: "sensor.color", type: "tricolor" as const, color: ["cyan", "magenta", "yellow"] },
      ],
    };
    const card = await renderCard("custom_card_sisimomo_printer", config);
    expect(card.shadowRoot.querySelectorAll(".printer-cartridges > span")).toHaveLength(2);
    expect(card.shadowRoot.textContent).toContain("75%");
    expect(card.shadowRoot.textContent).toContain("54%");
    expect(card.shadowRoot.querySelector(".printer-errors")).toBeNull();
    const actions = vi.fn();
    card.addEventListener("hass-action", actions);
    card.shadowRoot.querySelector<HTMLButtonElement>(".printer-summary")!.click();
    expect(actions).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        action: "tap",
        config: expect.objectContaining({ entity: "sensor.printer_status", tap_action: { action: "more-info" } }),
      },
    }));
    card.remove();

    const unavailable = await renderCard("custom_card_sisimomo_printer", {
      entity: "sensor.printer_status",
      cartridges: [{ label: "BK", entity_id: "sensor.unavailable_toner", type: "unicolor", color: "black" }],
    });
    expect(unavailable.shadowRoot.textContent).toContain("Toner Information Unavailable");
    unavailable.remove();

    const invalid = await renderCard("custom_card_sisimomo_printer", {
      entity: "sensor.printer_status",
      cartridges: [{ entity_id: "sensor.missing", type: "tricolor", color: ["cyan"] }],
    });
    expect(invalid.shadowRoot.textContent).toContain("Configuration Error:");
    expect(invalid.shadowRoot.textContent).toContain("label");
    expect(invalid.shadowRoot.textContent).toContain("existing entity_id");
    expect(invalid.shadowRoot.textContent).toContain("Invalid combination");
  });
});
