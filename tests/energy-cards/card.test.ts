import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../src/index";
import type { HomeAssistant } from "../../src/types";
import type { SmartSavingPlanCard } from "../../src/energy-cards/card";

const cardConfig = {
  type: "custom:mushroom-addition-smart-saving",
  price: {
    entity: "sensor.demo_prices",
    path: "prices",
    startField: "start",
    endField: "end",
    priceField: "price",
    sourceUnit: "EUR/kWh",
    displayUnit: "ct/kWh",
  },
  tracks: {
    plan: { entity: "sensor.demo_plan", path: "blocks", startField: "start", endField: "end" },
    applied: { entity: "sensor.demo_other_schedule", path: "blocks", startField: "start", endField: "end" },
    ev: { entity: "sensor.demo_other_schedule", path: "blocks", startField: "start", endField: "end" },
    solar: { entity: "sensor.demo_solar", path: "forecast", startField: "start", endField: "end", valueField: "value" },
  },
};

function hass(planAttributes?: Record<string, unknown>): HomeAssistant {
  return {
    states: {
      "sensor.demo_prices": {
        entity_id: "sensor.demo_prices",
        state: "available",
        attributes: { prices: [] },
      },
      "sensor.demo_other_schedule": {
        entity_id: "sensor.demo_other_schedule",
        state: "available",
        attributes: {
          blocks: [{
            start: new Date(Date.now() + 60 * 60_000).toISOString(),
            end: new Date(Date.now() + 2 * 60 * 60_000).toISOString(),
          }],
        },
      },
      "sensor.demo_solar": { entity_id: "sensor.demo_solar", state: "available", attributes: { forecast: [] } },
      ...(planAttributes ? {
        "sensor.demo_plan": { entity_id: "sensor.demo_plan", state: "available", attributes: planAttributes },
      } : {}),
    },
    callService: async () => undefined,
  };
}

describe("Smart Saving rendering", () => {
  afterEach(() => {
    document.body.replaceChildren();
    vi.useRealTimers();
  });
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("shows a missing schedule source separately from an empty valid schedule", async () => {
    const missing = document.createElement("mushroom-addition-smart-saving") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: unknown): void;
      updateComplete: Promise<boolean>;
    };
    missing.hass = hass();
    missing.setConfig(cardConfig);
    document.body.append(missing);
    await missing.updateComplete;
    const scheduleNotes = (card: typeof missing) => [...card.shadowRoot!.querySelectorAll(".track-row .empty-note")]
      .map(note => note.textContent);
    expect(scheduleNotes(missing)).toContain("Source missing");
    expect(scheduleNotes(missing)).not.toContain("No blocks scheduled");

    const empty = document.createElement("mushroom-addition-smart-saving") as typeof missing;
    empty.hass = hass({ blocks: [] });
    empty.setConfig(cardConfig);
    document.body.append(empty);
    await empty.updateComplete;
    expect(empty.shadowRoot?.textContent).toContain("No blocks scheduled");
    expect(scheduleNotes(empty)).not.toContain("Source missing");
  });

  it("renders explicit no-price and missing-forecast states without creating data", async () => {
    const card = document.createElement("mushroom-addition-smart-saving") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: unknown): void;
      updateComplete: Promise<boolean>;
    };
    card.hass = hass({ blocks: [] });
    card.setConfig(cardConfig);
    document.body.append(card);
    await card.updateComplete;
    expect(card.shadowRoot?.textContent).toContain("No published intervals");
    expect(card.shadowRoot?.querySelector(".battery-plot")).toBeNull();
  });

  async function render(extra: Record<string, unknown> = {}, source = hass({ blocks: [] })) {
    const card = document.createElement("mushroom-addition-smart-saving") as SmartSavingPlanCard;
    card.hass = source;
    card.setConfig({ ...cardConfig, ...extra });
    document.body.append(card);
    await card.updateComplete;
    return card;
  }

  it("uses fixed-height plots with HTML labels, configured tracks and lazy period details", async () => {
    const card = await render({ tracks: {} });
    const root = card.shadowRoot!;
    expect(root.querySelector("svg text")).toBeNull();
    expect(root.querySelector(".price-plot svg")?.getAttribute("preserveAspectRatio")).toBe("none");
    expect(root.querySelectorAll(".axis span")).toHaveLength(5);
    expect(root.querySelector(".track-row")).toBeNull();
    expect(root.querySelector(".content")?.getAttribute("style")).toContain("1200px");
    expect(root.querySelector(".period")).toBeNull();
    const details = root.querySelector<HTMLDetailsElement>(".period-details")!;
    details.open = true;
    details.dispatchEvent(new Event("toggle"));
    await card.updateComplete;
    expect(root.querySelector(".period")).not.toBeNull();
  });

  it("does not display out-of-range or unavailable retained battery readings", async () => {
    const source = hass();
    source.states["sensor.example_soc"] = { entity_id: "sensor.example_soc", state: "180", attributes: {} };
    const card = await render({ battery: { current: { entity: "sensor.example_soc" } } }, source);
    expect(card.shadowRoot!.querySelector(".current")?.textContent).toContain("Unavailable");
    expect(card.shadowRoot!.querySelector(".measured-point")).toBeNull();
    const unavailable = hass();
    unavailable.states["sensor.example_soc"] = {
      entity_id: "sensor.example_soc", state: "unavailable", attributes: { soc: 55 },
    };
    card.hass = unavailable;
    card.setConfig({ ...cardConfig, battery: { current: { entity: "sensor.example_soc", field: "soc" } } });
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".measured-point")).toBeNull();
    expect(card.shadowRoot!.querySelector(".battery-plot")).toBeNull();
  });

  it("keeps optional empty editor sections hidden while preserving explicitly supplied zero values", async () => {
    const card = await render({ battery: { current: {} }, summary: { purchaseCost: {}, purchaseEnergy: {} } });
    expect(card.shadowRoot!.querySelector(".current")).toBeNull();
    expect(card.shadowRoot!.querySelector(".summary-chips .chip")).toBeNull();
    card.setConfig({ ...cardConfig, battery: { current: { value: 0 } }, summary: { purchaseCost: { value: 0 } } });
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".current")?.textContent).toContain("0%");
    expect(card.shadowRoot!.querySelector(".summary-chips .chip")?.textContent).toContain("EUR");
  });

  it("rejects partially malformed and overlapping prices instead of producing partial averages", async () => {
    const start = Date.now();
    const source = hass();
    const valid = { start, end: start + 3_600_000, price: .2 };
    source.states["sensor.demo_prices"].attributes.prices = [valid, { start: "invalid" }];
    const card = await render({}, source);
    expect(card.shadowRoot!.querySelector(".price-plot")?.textContent).toContain("Invalid data source");
    expect(card.shadowRoot!.querySelector(".price-bar")).toBeNull();
    source.states["sensor.demo_prices"].attributes.prices = [valid, valid];
    card.requestUpdate();
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".price-bar")).toBeNull();
  });

  it("keeps measured SoC separate, breaks forecast gaps and fits only to published endpoints", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2031-04-12T08:00:00Z"));
    const start = Date.now(), hour = 3_600_000;
    const source = hass();
    source.states["sensor.demo_prices"].attributes.prices = [
      { start, end: start + hour, price: -.1 },
      { start: start + 2 * hour, end: start + 3 * hour, price: .3 },
    ];
    source.states["sensor.example_forecast"] = {
      entity_id: "sensor.example_forecast", state: "ready", last_updated: new Date().toISOString(),
      attributes: { forecast: [0, 1, 4, 5].map(i => ({ time: start + i * hour, value: 30 + i * 5 })) },
    };
    const card = await render({
      tracks: {}, horizon: "published", visibleHours: 24,
      battery: { current: { value: 65 }, forecast: { entity: "sensor.example_forecast", path: "forecast", startField: "time", valueField: "value" }, horizon: { value: 3 } },
    }, source);
    const root = card.shadowRoot!;
    expect(root.querySelectorAll(".forecast-line")).toHaveLength(2);
    expect(root.querySelectorAll(".forecast-point")).toHaveLength(4);
    expect(root.querySelector(".measured-point")?.textContent).toContain("65%");
    expect(root.querySelector(".description")?.textContent).toContain("5 h");
    expect(root.querySelectorAll(".price-plot .unpublished")).toHaveLength(2);
    expect(root.textContent).toContain("Requested horizon");
    expect(root.querySelector(".forecast-endpoint")?.textContent).toContain("55%");
    expect(root.querySelectorAll(".price-bar")).toHaveLength(2);
    expect(root.querySelector(".zero-line")).not.toBeNull();
  });

  it("advances the rolling window and freshness on its timer and cleans up on reconnect", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2031-04-12T08:00:00Z"));
    const source = hass();
    source.states["sensor.demo_prices"].last_updated = new Date(Date.now() - 3_570_000).toISOString();
    const card = await render({ maxSourceAgeMinutes: 60 }, source);
    expect(card.shadowRoot!.textContent).not.toContain("Stale data source");
    const before = card.shadowRoot!.querySelector(".description")!.textContent;
    vi.advanceTimersByTime(60_000);
    await card.updateComplete;
    expect(card.shadowRoot!.textContent).toContain("Stale data source");
    expect(card.shadowRoot!.querySelector(".description")!.textContent).not.toBe(before);
    expect(vi.getTimerCount()).toBe(1);
    card.remove();
    expect(vi.getTimerCount()).toBe(0);
    document.body.append(card);
    await card.updateComplete;
    expect(vi.getTimerCount()).toBe(1);
  });

  it("shows schedules outside the visible window as empty and pages all supplied plan details lazily", async () => {
    const source = hass();
    const now = Date.now(), hour = 3_600_000;
    source.states["sensor.demo_plan"] = {
      entity_id: "sensor.demo_plan", state: "ready", attributes: {
        blocks: Array.from({ length: 121 }, (_, i) => ({ start: now + (i + 40) * hour, end: now + (i + 41) * hour, energy: i })),
      },
    };
    const card = await render({ planBlocksEntity: "sensor.demo_plan" }, source);
    const root = card.shadowRoot!;
    expect(root.querySelector('[data-track="plan"] .empty-note')?.textContent).toContain("No blocks scheduled");
    expect(root.querySelector(".blocks")).toBeNull();
    const details = root.querySelector<HTMLDetailsElement>(".plan-details")!;
    details.open = true;
    details.dispatchEvent(new Event("toggle"));
    await card.updateComplete;
    expect(root.querySelectorAll(".blocks li")).toHaveLength(50);
    root.querySelectorAll<HTMLButtonElement>(".pagination button")[1].click();
    await card.updateComplete;
    expect(root.querySelector(".pagination")?.textContent).toContain("51–100 / 121");
    root.querySelectorAll<HTMLButtonElement>(".pagination button")[1].click();
    await card.updateComplete;
    expect(root.querySelectorAll(".blocks li")).toHaveLength(21);
  });

  it("inspects one shared time without interpolating battery gaps or filling unpublished prices", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2031-04-12T08:00:00Z"));
    const now = Date.now(), hour = 3_600_000, source = hass();
    source.states["sensor.demo_prices"].attributes.prices = [
      { start: now, end: now + hour, price: .2 },
      { start: now + 2 * hour, end: now + 4 * hour, price: .3 },
    ];
    source.states["sensor.example_forecast"] = {
      entity_id: "sensor.example_forecast", state: "ready", attributes: {
        forecast: [0, 1, 3, 4].map(i => ({ time: now + i * hour, value: 20 + i * 10 })),
      },
    };
    const card = await render({
      visibleHours: 4, battery: { forecast: { entity: "sensor.example_forecast", path: "forecast" } },
      tracks: { plan: cardConfig.tracks.plan },
    }, { ...source, states: { ...source.states, "sensor.demo_plan": {
      entity_id: "sensor.demo_plan", state: "ready",
      attributes: { blocks: [{ start: now + 3 * hour, end: now + 4 * hour, power: 2, energy: 2 }] },
    } } });
    const root = card.shadowRoot!, slider = root.querySelector<HTMLInputElement>("#inspect-time")!;
    expect(root.querySelectorAll(".axis")).toHaveLength(1);
    expect(slider.getAttribute("aria-valuetext")).toBeTruthy();
    slider.value = "375";
    slider.dispatchEvent(new Event("input"));
    await card.updateComplete;
    expect(root.querySelector(".inspection-values")?.textContent).toContain("No published intervals");
    expect(root.querySelector(".inspection-values")?.textContent).toContain("No published forecast");
    slider.value = "850";
    slider.dispatchEvent(new Event("input"));
    await card.updateComplete;
    expect(root.querySelector(".inspection-values")?.textContent).toContain("30 ct/kWh");
    expect(root.querySelector(".inspection-values")?.textContent).toContain("50%");
    expect(root.querySelector(".inspection-values")?.textContent).toContain("Supplied schedules");
    expect(root.querySelectorAll(".selection-line")).toHaveLength(3);
    expect(new Set([...root.querySelectorAll(".selection-line")].map(line => line.getAttribute("x1"))).size).toBe(1);
    expect(root.querySelector(".price-plot")?.parentElement?.nextElementSibling?.textContent).toContain("Published duration: 3 h");
    expect(root.querySelector(".price-plot")?.parentElement?.nextElementSibling?.textContent).toContain("Missing duration: 1 h");
    expect(root.querySelector(".battery-plot")?.parentElement?.nextElementSibling?.textContent).toContain("Published duration: 2 h");
  });

  it("selects a time by pointer and ignores uncaptured movement and non-primary pointers", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2031-04-12T08:00:00Z"));
    const card = await render({ visibleHours: 4, tracks: {} });
    const root = card.shadowRoot!, plot = root.querySelector<SVGSVGElement>(".price-plot svg")!;
    vi.spyOn(plot, "getBoundingClientRect").mockReturnValue(new DOMRect(10, 0, 200, 150));
    let captured = false;
    Object.defineProperties(plot, {
      setPointerCapture: { value: vi.fn(() => { captured = true; }) },
      hasPointerCapture: { value: vi.fn(() => captured) },
    });
    const pointer = (type: string, clientX: number, isPrimary = true) => {
      const event = new Event(type);
      Object.defineProperties(event, {
        clientX: { value: clientX }, isPrimary: { value: isPrimary }, button: { value: 0 }, pointerId: { value: 1 },
      });
      plot.dispatchEvent(event);
    };
    pointer("pointermove", 110);
    await card.updateComplete;
    expect(root.querySelector<HTMLInputElement>("#inspect-time")!.value).toBe("0");
    pointer("pointerdown", 110, false);
    await card.updateComplete;
    expect(root.querySelector<HTMLInputElement>("#inspect-time")!.value).toBe("0");
    pointer("pointerdown", 110);
    await card.updateComplete;
    expect(root.querySelector<HTMLInputElement>("#inspect-time")!.value).toBe("500");
    pointer("pointermove", 250);
    await card.updateComplete;
    expect(root.querySelector<HTMLInputElement>("#inspect-time")!.value).toBe("1000");
  });

  it("uses independent source age limits and displays relative source ages", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2031-04-12T08:00:00Z"));
    const source = hass();
    const updated = new Date(Date.now() - 2 * 3_600_000).toISOString();
    source.states["sensor.demo_prices"].last_updated = updated;
    source.states["sensor.example_battery"] = {
      entity_id: "sensor.example_battery", state: "70", attributes: {}, last_updated: updated,
    };
    const card = await render({
      price: { ...cardConfig.price, maxSourceAgeMinutes: 1440 },
      battery: { current: { entity: "sensor.example_battery", maxSourceAgeMinutes: 5 } },
    }, source);
    const root = card.shadowRoot!;
    expect(root.querySelector(".current")?.textContent).toContain("Stale data source");
    expect(root.querySelector(".current")?.textContent).toContain("2 hours ago");
    expect(root.querySelector(".current")?.textContent).toContain("70%");
    expect(root.querySelector(".price-plot")?.parentElement?.nextElementSibling?.textContent).not.toContain("Stale data source");
    expect(root.querySelector(".price-plot")?.parentElement?.nextElementSibling?.textContent).toContain("2 hours ago");
  });

  it("labels sale schedules conservatively and only marks explicitly confirmed actions as applied", async () => {
    const source = hass();
    const now = Date.now(), block = { start: now, end: now + 3_600_000, power: 1.5, energy: 1.5 };
    source.states["sensor.demo_other_schedule"].attributes.blocks = [block];
    const tracks = { applied: { ...cardConfig.tracks.applied, powerUnit: "kW", energyUnit: "kWh" } };
    const card = await render({ tracks }, source);
    const root = card.shadowRoot!;
    expect(root.querySelector('[data-track="applied"]')?.textContent).toContain("Planned sale");
    expect(root.querySelector('[data-track="applied"]')?.textContent).not.toContain("Applied sale");
    expect(root.querySelector(".inspection-values")?.textContent).toContain("1.5 kW");
    expect(root.querySelector(".inspection-values")?.textContent).toContain("1.5 kWh");
    card.setConfig({ ...cardConfig, tracks: { applied: { ...tracks.applied, meaning: "confirmed" } } });
    await card.updateComplete;
    expect(root.querySelector('[data-track="applied"]')?.textContent).toContain("Applied sale");
    expect(root.querySelector('[data-track="applied"]')?.textContent).toContain("Confirmed action");
  });

  it("shows unavailable inspector sources distinctly and does not invent units", async () => {
    const source = hass({ blocks: [{ start: Date.now(), end: Date.now() + 3_600_000, power: 3 }] });
    const card = await render({}, source);
    expect(card.shadowRoot!.querySelector(".inspection-values")?.textContent).toContain("Power 3 Unit: Not specified");
    card.hass = hass();
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".inspection-values")?.textContent).toContain("Source missing");
  });
});
