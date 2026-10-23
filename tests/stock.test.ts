import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { CATALOG } from "../src/catalog";
import { createStubConfig } from "../src/stub";
import { editorSchemaFor } from "../src/editor-schema";
import { MushroomStockContent, parseStockSnapshot, stockOptions, stockSeries, stockTrends } from "../src/stock";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import type { MushroomAdditionEditor } from "../src/editor";
import type { MushroomAdditionCard } from "../src/card";
import { stockMetricValue, stockEntityQuote } from "../src/stock-data";

const type = "custom:mushroom-addition-stock-card";
const snapshot = {
  symbol: "AAPL", market_open: true, interval: 300, quote_age: 30,
  quote: { symbol: "AAPL", shortName: "Apple", currency: "USD",
    regularMarketPrice: 200, regularMarketChange: 2, regularMarketChangePercent: 1 },
  chart: { t: [1700000000, 1700000300, 1700000600], c: [198, 199, 200], v: [100, 200, 300] },
};
const makeHass = (callWS = vi.fn(async () => snapshot)): HomeAssistant => ({
  states: {}, language: "en", callService: vi.fn(async () => undefined),
  callWS: callWS as HomeAssistant["callWS"],
});
async function settle(element: MushroomStockContent) {
  for (let i = 0; i < 5; i++) { await Promise.resolve(); await element.updateComplete; }
}
async function content(config: Partial<AdditionConfig> = {}, hass = makeHass()) {
  const element = document.createElement("mushroom-addition-stock") as MushroomStockContent;
  element.config = { type, stock_source: "stock_market_deluxe", ...config };
  element.hass = hass;
  document.body.append(element);
  await settle(element);
  return element;
}
afterEach(() => { document.body.replaceChildren(); vi.useRealTimers(); });

describe("Stock Card", () => {
  it("registers the public card with the shared editor and usable defaults", async () => {
    const item = CATALOG.find(item => item.upstreamId === "stock_card")!;
    expect(item.name).toBe("Stock Card");
    expect(window.customCards?.find(card => card.type === item.tag)?.name).toBe("Mushroom Addition: Stock Card");
    expect(createStubConfig(item)).toMatchObject({ type, stock_source: "entity", stock_range: "1D" });
    expect(createStubConfig(item).entity).toBeUndefined();
    const C = customElements.get(item.tag) as typeof HTMLElement & { getConfigElement(): Promise<HTMLElement> };
    expect((await C.getConfigElement()).localName).toBe("mushroom-addition-editor");
    const names = editorSchemaFor(item, { type, stock_source: "stock_market_deluxe" }).flatMap(field => field.schema ?? [field]).map(field => field.name);
    expect(names).toEqual(expect.arrayContaining(["name", "primary_info", "secondary_info", "layout",
      "stock_symbol", "stock_shares", "stock_interval", "stock_range", "stock_show_position",
      "stock_show_statistics", "stock_show_volume", "stock_show_trends", "tap_action", "hold_action", "double_tap_action"]));
  });

  it("uses the standard editor sections and persists all stock settings through config-changed", async () => {
    const e = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
    e.hass = makeHass(); e.setConfig({ type }); document.body.append(e); await e.updateComplete;
    expect([...e.shadowRoot!.querySelectorAll(".section-header")].map(el => el.textContent?.trim()))
      .toEqual(["Context", "Content", "Layout", "Interactions", "Features"]);
    const changes = vi.fn(); e.addEventListener("config-changed", changes);
    const settings = { stock_source: "stock_market_deluxe", stock_symbol: "MSFT", stock_shares: 2.5, stock_interval: 600, stock_range: "1M",
      stock_show_position: false, stock_show_statistics: false, stock_show_volume: false, stock_show_trends: false };
    e.shadowRoot!.querySelector("ha-form")!.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: settings }, bubbles: true, composed: true,
    }));
    await e.updateComplete;
    expect(changes.mock.calls[0][0].detail.config).toMatchObject({ type, ...settings });
  });

  it("fetches once and does not refetch for unrelated hass updates or display settings", async () => {
    const hass = makeHass(), e = await content({ stock_shares: 3 }, hass);
    expect(hass.callWS).toHaveBeenCalledWith({
      type: "stock_market_deluxe_card/data", symbol: "AAPL", range: "1D", interval: 300,
    });
    expect(e.shadowRoot!.textContent).toContain("Apple");
    expect(e.shadowRoot!.textContent).toContain("$600.00");
    e.hass = { ...hass };
    e.config = { type, stock_source: "stock_market_deluxe", stock_shares: 4, stock_show_statistics: false };
    await settle(e);
    expect(hass.callWS).toHaveBeenCalledTimes(1);
    expect(e.shadowRoot!.textContent).toContain("$800.00");
    expect(e.shadowRoot!.querySelector("dl")).toBeNull();
  });

  it("requests selected chart ranges and ignores stale replies after symbol changes", async () => {
    let resolveOld!: (value: typeof snapshot) => void;
    const call = vi.fn().mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve; }))
      .mockResolvedValue({ ...snapshot, symbol: "MSFT", quote: { ...snapshot.quote, shortName: "Microsoft" } });
    const e = await content({}, makeHass(call));
    e.config = { type, stock_source: "stock_market_deluxe", stock_symbol: "MSFT" }; await settle(e);
    resolveOld(snapshot); await settle(e);
    expect(e.shadowRoot!.textContent).toContain("Microsoft");
    expect(e.shadowRoot!.textContent).not.toContain("Apple");
    const range = [...e.shadowRoot!.querySelectorAll("button")].find(b => b.textContent === "1Y")!;
    range.click(); await settle(e);
    expect(call.mock.calls.at(-1)![0]).toMatchObject({ symbol: "MSFT", range: "1Y" });
  });

  it("surfaces missing-backend errors with setup guidance and retry", async () => {
    const call = vi.fn().mockRejectedValue({ message: "Unknown command" });
    const e = await content({}, makeHass(call));
    expect(e.shadowRoot!.querySelector('[role="alert"]')?.textContent).toContain("Unknown command");
    expect(e.shadowRoot!.textContent).toContain("Stock Market Deluxe integration");
    call.mockResolvedValue(snapshot);
    (e.shadowRoot!.querySelector("button") as HTMLButtonElement).click(); await settle(e);
    expect(e.shadowRoot!.querySelector('[role="alert"]')).toBeNull();
  });

  it("honors backend refresh limits and stops timers when disconnected", async () => {
    vi.useFakeTimers();
    const call = vi.fn().mockResolvedValue({ ...snapshot, market_open: false, interval: 900 });
    const e = await content({ stock_interval: 180 }, makeHass(call));
    await vi.advanceTimersByTimeAsync(899000); expect(call).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1000); expect(call).toHaveBeenCalledTimes(2);
    e.remove(); await vi.advanceTimersByTimeAsync(900000); expect(call).toHaveBeenCalledTimes(2);
  });

  it("rejects invalid settings and malformed data", async () => {
    expect(() => stockOptions({ type, stock_source: "stock_market_deluxe", stock_symbol: "<script>" })).toThrow("symbol");
    expect(() => stockOptions({ type, stock_shares: -1 })).toThrow("Shares");
    expect(() => stockOptions({ type, stock_interval: 1 })).toThrow("interval");
    expect(() => parseStockSnapshot({ ...snapshot, chart: { c: "bad" } })).toThrow("series");
    const e = await content({ stock_interval: 0 });
    expect(e.shadowRoot!.querySelector('[role="alert"]')?.textContent).toContain("interval");
    expect(e.hass!.callWS).not.toHaveBeenCalled();
  });

  it("filters missing chart values and computes trends deterministically", () => {
    expect(stockSeries(parseStockSnapshot({ ...snapshot, chart: {
      t: [1, 2, 3], c: [10, null, 20], v: [2, null, 4],
    } }))).toEqual([{ time: 1, price: 10, volume: 2 }, { time: 3, price: 20, volume: 4 }]);
    expect(stockTrends([1, 2, 3], 2).sma).toEqual([1, 1.5, 2.5]);
  });

  it("uses arbitrary provider entities and attributes without requiring the stock backend", async () => {
    const hass = makeHass();
    hass.states = {
      "sensor.provider_price": { entity_id: "sensor.provider_price", state: "123.45",
        attributes: { friendly_name: "My stock", symbol: "EXAMPLE", currency: "EUR", daily_change: -2 } },
      "sensor.provider_percent": { entity_id: "sensor.provider_percent", state: "-1.5", attributes: {} },
    };
    const config: AdditionConfig = { type, entity: "sensor.provider_price", stock_source: "entity",
      stock_change_attribute: "daily_change", stock_percent_entity: "sensor.provider_percent", stock_shares: 2 };
    const e = await content(config, hass);
    expect(hass.callWS).not.toHaveBeenCalled();
    expect(e.shadowRoot!.textContent).toContain("My stock");
    expect(e.shadowRoot!.textContent).toContain("246.90");
    expect(e.shadowRoot!.textContent).toContain("-1.5");
    const graph = e.shadowRoot!.querySelector("mushroom-addition-mini-graph-card");
    expect(graph).not.toBeNull();
    e.hass = { ...hass, states: { ...hass.states, "sensor.provider_price": {
      ...hass.states["sensor.provider_price"], state: "130",
    } } };
    await settle(e);
    expect(e.shadowRoot!.textContent).toContain("260.00");
    expect(hass.callWS).not.toHaveBeenCalled();
    expect(stockEntityQuote(config, hass).currency).toBe("EUR");
  });

  it("supports a price attribute and explicit state mappings without inventing missing metrics", () => {
    const hass = makeHass();
    hass.states["sensor.provider"] = { entity_id: "sensor.provider", state: "ready", attributes: { close: 42 } };
    const config: AdditionConfig = { type, entity: "sensor.provider", stock_price_attribute: "close" };
    expect(stockMetricValue(config, hass, "price")).toBe(42);
    expect(stockMetricValue(config, hass, "change")).toBeUndefined();
    hass.states["sensor.provider"].state = "unavailable";
    expect(stockMetricValue(config, hass, "price")).toBeUndefined();
  });

  it("uses the price override's metadata when no main entity is configured", () => {
    const hass = makeHass();
    hass.states["sensor.price"] = { entity_id: "sensor.price", state: "12",
      attributes: { friendly_name: "Provider stock", symbol: "EXM", currency: "EUR" } };
    const config: AdditionConfig = { type, stock_price_entity: "sensor.price" };
    expect(stockEntityQuote(config, hass)).toMatchObject({
      shortName: "Provider stock", symbol: "EXM", currency: "EUR", regularMarketPrice: 12,
    });
    hass.states["sensor.price"].state = "  ";
    expect(stockMetricValue(config, hass, "price")).toBeUndefined();
  });

  it("does not create an invalid entity history graph for rejected settings", async () => {
    const hass = makeHass();
    hass.states["sensor.price"] = { entity_id: "sensor.price", state: "12", attributes: {} };
    const e = await content({ stock_source: "entity", entity: "sensor.price", stock_interval: 0 }, hass);
    expect(e.shadowRoot!.querySelector('[role="alert"]')?.textContent).toContain("interval");
    expect(e.shadowRoot!.querySelector("mushroom-addition-mini-graph-card")).toBeNull();
    expect(e.shadowRoot!.querySelector("button")).toBeNull();
  });

  it("renders configured names and information through the shared Mushroom header", async () => {
    const card = document.createElement("mushroom-addition-stock-card") as MushroomAdditionCard;
    card.hass = makeHass();
    card.setConfig({ type, name: "My portfolio", secondary: "Watchlist", secondary_info: "none" });
    document.body.append(card);
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".shared-presentation")?.textContent).toContain("My portfolio");
    expect(card.shadowRoot!.querySelector(".shared-presentation")?.textContent).not.toContain("Watchlist");
    expect(card.shadowRoot!.querySelectorAll(".shared-presentation")).toHaveLength(1);
    card.setConfig({ type, name: "My portfolio", primary_info: "none", secondary: "Watchlist" });
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".ulm-name")).toBeNull();
    expect(card.shadowRoot!.querySelector(".ulm-label")?.textContent).toBe("Watchlist");
  });

  it("shows actual metric defaults in the editor and preserves explicit empty attributes", async () => {
    const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
    editor.hass = makeHass();
    editor.setConfig({ type, stock_change_attribute: "", stock_volume_entity: "sensor.volume" });
    document.body.append(editor); await editor.updateComplete;
    const form = editor.shadowRoot!.querySelector("ha-form") as HTMLElement & { data: AdditionConfig };
    expect(form.data.stock_change_attribute).toBe("");
    expect(form.data.stock_volume_attribute).toBe("");
    expect(form.data.stock_market_cap_attribute).toBe("marketCap");
    expect(form.data.stock_price_attribute).toBe("");
  });

  it("refreshes attribute history for entity mode and cancels pending backend requests on source switch", async () => {
    let resolve!: (value: typeof snapshot) => void;
    const call = vi.fn(() => new Promise<typeof snapshot>(r => { resolve = r; }));
    const hass = makeHass(call);
    hass.states["sensor.other"] = { entity_id: "sensor.other", state: "ready",
      attributes: { close: 80, currency: "EUR" } };
    const e = await content({}, hass);
    e.config = { type, stock_source: "entity", entity: "sensor.other", stock_price_attribute: "close" };
    await settle(e);
    resolve(snapshot); await settle(e);
    expect(e.shadowRoot!.textContent).not.toContain("Apple");
    expect(e.shadowRoot!.textContent).toContain("80.00");
    const graph = e.shadowRoot!.querySelector("mushroom-addition-mini-graph-card") as HTMLElement & {
      config: { entities: Array<{ entity: string; attribute: string }> };
    };
    expect(graph.config.entities[0]).toMatchObject({ entity: "sensor.other", attribute: "close" });
  });
});
