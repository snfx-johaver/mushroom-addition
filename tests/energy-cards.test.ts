import { afterEach, describe, expect, it, vi } from "vitest";
import { CATALOG } from "../src/catalog";
import { editorSchemaFor } from "../src/editor-schema";
import { energyPriceBounds, energyPriceSlots, energyTradeResult, formatEnergyPrice } from "../src/energy-buy-sell";
import "../src/index";
import {
  inverterPanelEntities,
  panelGaugeColor,
  panelGaugePercent,
  summarizePanels,
} from "../src/panel-health";
import { createStubConfig } from "../src/stub";
import type { AdditionConfig, HassEntity, HomeAssistant } from "../src/types";

const entity = (
  entity_id: string,
  state: string,
  attributes: HassEntity["attributes"] = {},
): HassEntity => ({ entity_id, state, attributes });

afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
});

describe("energy price chart helpers", () => {
  const tradeOptions = { energy: 10, power: 7.2, efficiency: 86, fee: 0.02, slotMinutes: 15 };
  const tradeSlots = Array.from({ length: 20 }, (_, index) => ({
    timestamp: Date.UTC(2026, 0, 1) + index * 900_000,
    price: index < 10 ? 0.318 : 0.479,
    kind: 0 as const,
  }));

  it("calculates weighted buy costs, net sale revenue, efficiency losses and fractional final slots", () => {
    const result = energyTradeResult(tradeSlots, tradeOptions);
    expect("error" in result).toBe(false);
    if ("error" in result) throw new Error(result.error);
    expect(result.buy.energy).toBeCloseTo(10 / 0.86);
    expect(result.sell.energy).toBe(10);
    expect(result.buy.averagePrice).toBeCloseTo(0.318);
    expect(result.sell.averagePrice).toBeCloseTo(0.479);
    expect(result.buy.amount).toBeCloseTo(-10 / 0.86 * 0.318);
    expect(result.sell.amount).toBeCloseTo(4.59);
    expect(result.net).toBeCloseTo(4.59 - 10 / 0.86 * 0.318);
    expect(result.buy.slots).toHaveLength(7);
    expect(result.sell.slots).toHaveLength(6);
    expect(result.buy.slots.filter((slot) => slot.energy < 1.8)).toHaveLength(1);
    expect(result.buy.slots.every((buy) => !result.sell.slots.some((sell) => sell.start === buy.start))).toBe(true);
  });

  it("handles negative prices and weights unequal slot durations without filling missing intervals", () => {
    const result = energyTradeResult([
      { timestamp: 0, price: -0.2, kind: 0 },
      { timestamp: 300_000, price: -0.1, kind: 1 },
      { timestamp: 3_600_000, price: 0.4, kind: 2 },
    ], { energy: 1, power: 6, efficiency: 100, fee: 0, slotMinutes: 15 });
    if ("error" in result) throw new Error(result.error);
    expect(result.buy.averagePrice).toBeCloseTo(-0.15);
    expect(result.buy.amount).toBeCloseTo(0.15);
    expect(result.sell.amount).toBeCloseTo(0.4);
    expect(result.net).toBeCloseTo(0.55);
    expect(result.buy.slots[0].end).toBe(300_000);
    expect(result.buy.slots[1].end).toBe(600_000);
  });

  it("reports insufficient, duplicate and missing prices rather than displaying partial results", () => {
    expect(energyTradeResult([], tradeOptions)).toHaveProperty("error");
    expect(energyTradeResult(tradeSlots.slice(0, 12), tradeOptions)).toHaveProperty("error");
    expect(energyTradeResult([...tradeSlots, tradeSlots[0]], tradeOptions)).toHaveProperty("error");
  });

  it.each([
    { energy: 0 }, { power: -1 }, { efficiency: 0 }, { efficiency: 101 },
    { fee: -0.1 }, { slotMinutes: 0 }, { energy: NaN }, { power: Infinity },
  ])("rejects invalid trade assumptions %j", (override) => {
    expect(energyTradeResult(tradeSlots, { ...tradeOptions, ...override })).toHaveProperty("error");
  });

  it("parses, validates, and sorts chart slots", () => {
    const parsed = energyPriceSlots(entity("sensor.hems_price_overview", "unknown", {
      slots: [
        [1_700_000_900_000, 0.4, 2],
        ["2023-11-14T22:00:00Z", 0.2, 0],
        ["invalid", 0.3, 1],
        [1_700_000_800_000, "bad", 3],
        [1_700_000_700_000, 0.8, 4],
      ],
    }));

    expect(parsed).toEqual([
      { timestamp: Date.parse("2023-11-14T22:00:00Z"), price: 0.2, kind: 0 },
      { timestamp: 1_700_000_900_000, price: 0.4, kind: 2 },
    ]);
  });

  it("calculates automatic bounds and honors configured limits", () => {
    const slots = [
      { timestamp: 0, price: -0.2, kind: 0 as const },
      { timestamp: 1, price: 0.5, kind: 1 as const },
    ];

    expect(energyPriceBounds(slots)).toEqual({ minimum: -0.2, maximum: 0.542 });
    expect(energyPriceBounds(slots, 0, 1)).toEqual({ minimum: 0, maximum: 1 });
    expect(formatEnergyPrice(0.45678, 3)).toBe("0.457");
  });
});

describe("panel health helpers and card setup", () => {
  const states: HomeAssistant["states"] = {
    "sensor.inverter_4002": entity("sensor.inverter_4002", "120", { friendly_name: "Panel 2" }),
    "sensor.inverter_4001": entity("sensor.inverter_4001", "240", { friendly_name: "Panel 1" }),
    "sensor.other_output": entity("sensor.other_output", "900"),
  };

  it("discovers panels, summarizes their output, and maps gauges to configured segments", () => {
    const panels = inverterPanelEntities(states);
    const summary = summarizePanels(panels);

    expect(panels.map(({ id }) => id)).toEqual(["4001", "4002"]);
    expect(summary).toMatchObject({
      activeCount: 2,
      totalOutput: 360,
      averageOutput: 180,
      best: { id: "4001", value: 240 },
      weakest: { id: "4002", value: 120 },
      spread: 120,
    });
    expect(panelGaugePercent(175, 350)).toBe(50);
    expect(panelGaugePercent(400, 350)).toBe(100);
    expect(panelGaugeColor(120, [0, 80, 150, 230, 300], ["gray", "orange", "yellow", "green", "darkgreen"]))
      .toBe("orange");
  });

  it("provides UI fields and meaningful picker defaults for both cards", () => {
    const priceCard = CATALOG.find(({ upstreamId }) => upstreamId === "advanced_energy_buy_sell")!;
    const panelCard = CATALOG.find(({ upstreamId }) => upstreamId === "advanced_energy_panel_health")!;
    const priceConfig = createStubConfig(priceCard, {
      states: { "sensor.hems_price_overview": entity("sensor.hems_price_overview", "unknown") },
      callService: async () => undefined,
    });
    const panelConfig = createStubConfig(panelCard, {
      states,
      callService: async () => undefined,
    });

    expect(priceConfig.entity).toBe("sensor.hems_price_overview");
    expect(editorSchemaFor(priceCard).map(({ name }) => name)).toContain("buy_sell_graph_span");
    expect(editorSchemaFor(priceCard).map(({ name }) => name)).toContain("buy_sell_update_interval");
    for (const name of [
      "buy_sell_show_result", "buy_sell_trade_energy", "buy_sell_trade_energy_entity",
      "buy_sell_trade_power", "buy_sell_trade_efficiency", "buy_sell_feed_in_fee", "buy_sell_slot_minutes",
    ]) expect(editorSchemaFor(priceCard).map((field) => field.name)).toContain(name);
    expect(editorSchemaFor(priceCard).find(({ name }) => name === "buy_sell_trade_power")?.selector)
      .toMatchObject({ number: { step: 0.01 } });
    expect(priceConfig.buy_sell_show_result).toBe(true);
    expect(panelConfig.entity).toBe("sensor.inverter_4001");
    expect(panelConfig.panel_entities).toEqual(["sensor.inverter_4001", "sensor.inverter_4002"]);
    expect(editorSchemaFor(panelCard).map(({ name }) => name)).toContain("panel_entities");
    expect(editorSchemaFor(panelCard).map(({ name }) => name)).toContain("panel_gauge_max");
  });

  it("renders the buy/sell timeline and refreshes with a periodic card timer", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T10:30:00"));
    const item = CATALOG.find(({ upstreamId }) => upstreamId === "advanced_energy_buy_sell")!;
    const start = new Date("2026-01-15T00:00:00").getTime();
    const priceSensor = entity("sensor.hems_price_overview", "unknown", {
      slots: [
        [start + 9 * 3_600_000, 0.22, 1],
        [start + 10 * 3_600_000, 0.18, 0],
        [start + 11 * 3_600_000, 0.3, 2],
        [start + 12 * 3_600_000, 0.4, 3],
      ],
    });
    const hass: HomeAssistant = {
      states: { [priceSensor.entity_id]: priceSensor },
      callService: async () => undefined,
    };
    const element = document.createElement(item.tag) as HTMLElement & {
      hass: HomeAssistant;
      setConfig(value: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    element.hass = hass;
    element.setConfig({
      type: `custom:${item.tag}`,
      entity: priceSensor.entity_id,
      buy_sell_span_start: "day",
      buy_sell_update_interval: 5,
    });
    document.body.append(element);
    await element.updateComplete;

    const root = element.shadowRoot!;
    expect(root.textContent).toContain("Buy and sell moments (all-in €/kWh)");
    expect(root.querySelectorAll(".energy-chart-legend-item")).toHaveLength(4);
    expect(root.querySelectorAll(".energy-buy-sell-chart rect")).toHaveLength(4);
    expect(root.querySelector(".energy-chart-now")).not.toBeNull();
    expect(
      Array.from(root.querySelectorAll(".energy-buy-sell-chart title"), (title) => title.textContent),
    ).toContain("Price: 0.180 €/kWh");
    expect(vi.getTimerCount()).toBe(1);
    element.remove();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("renders panel metrics and individual gauges in the native card", async () => {
    const item = CATALOG.find(({ upstreamId }) => upstreamId === "advanced_energy_panel_health")!;
    const hass: HomeAssistant = {
      states,
      callService: async () => undefined,
    };
    const element = document.createElement(item.tag) as HTMLElement & {
      hass: HomeAssistant;
      setConfig(value: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    element.hass = hass;
    element.setConfig({
      type: `custom:${item.tag}`,
      entity: "sensor.inverter_4001",
      panel_entities: ["sensor.inverter_4001", "sensor.inverter_4002"],
    });
    document.body.append(element);
    await element.updateComplete;

    const root = element.shadowRoot!;
    expect(root.textContent).toContain("Combined output");
    expect(root.textContent).toContain("360 W");
    expect(root.querySelectorAll(".panel-health-gauge")).toHaveLength(2);
    expect(root.querySelector(".panel-health-status-success")).not.toBeNull();
  });

  it("renders a collapsed result dropdown, honors trade controls and isolates interactions", async () => {
    const item = CATALOG.find(({ upstreamId }) => upstreamId === "advanced_energy_buy_sell")!;
    const priceSensor = entity("sensor.hems_price_overview", "unknown", {
      slots: Array.from({ length: 20 }, (_, index) => [
        Date.UTC(2026, 0, 1) + index * 900_000, index < 10 ? 0.2 : 0.4, index % 4,
      ]),
    });
    const element = document.createElement(item.tag) as HTMLElement & {
      hass: HomeAssistant;
      setConfig(value: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    element.hass = {
      states: {
        [priceSensor.entity_id]: priceSensor,
        "input_number.trade": entity("input_number.trade", "5"),
      },
      callService: async () => undefined,
    };
    const config = {
      type: `custom:${item.tag}`, entity: priceSensor.entity_id,
      buy_sell_trade_energy: 10, buy_sell_trade_energy_entity: "input_number.trade",
      buy_sell_trade_efficiency: 100, buy_sell_trade_power: 4, buy_sell_feed_in_fee: 0.02,
    };
    element.setConfig(config);
    document.body.append(element);
    await element.updateComplete;
    const root = element.shadowRoot!;
    const details = root.querySelector<HTMLDetailsElement>(".energy-buy-sell-result")!;
    expect(details.open).toBe(false);
    expect(details.querySelector("summary ha-icon")?.getAttribute("icon")).toBe("mdi:chevron-down");
    expect(details.querySelectorAll("tbody tr")).toHaveLength(2);
    expect(details.querySelector(".energy-result-net")?.textContent).toContain("Net result for 5 kWh: +0.90 €");
    expect(details.textContent).toContain("all published prices");
    const parentClick = vi.fn();
    const parentKey = vi.fn();
    root.querySelector(".action-surface")!.addEventListener("click", parentClick);
    root.querySelector(".action-surface")!.addEventListener("keydown", parentKey);
    details.querySelector("summary")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    details.querySelector("summary")!.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(parentClick).not.toHaveBeenCalled();
    expect(parentKey).not.toHaveBeenCalled();

    element.setConfig({ ...config, buy_sell_trade_energy_entity: "sensor.missing" });
    await element.updateComplete;
    expect(root.querySelector(".energy-buy-sell-result [role=status]")?.textContent).toContain("sensor.missing");
    expect(root.querySelector(".energy-result-net")).toBeNull();
    element.setConfig({ ...config, buy_sell_show_result: false });
    await element.updateComplete;
    expect(root.querySelector(".energy-buy-sell-result")).toBeNull();
  });
});
