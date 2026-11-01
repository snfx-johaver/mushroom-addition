import { describe, expect, it } from "vitest";
import {
  buildPeriodAverages,
  convertPrice,
  numeric,
  parseBlocks,
  parseIntervals,
  parsePoints,
  timestamp,
  weightedAverage,
} from "../../src/energy-cards/data";
import type { HassEntity } from "../../src/types";

const entity = (attributes: Record<string, unknown>, state = "unknown"): HassEntity => ({
  entity_id: "sensor.synthetic_fixture",
  state,
  attributes,
});

describe("price and interval data", () => {
  it("parses numeric price strings and ignores malformed or incomplete intervals", () => {
    const result = parseIntervals(entity({ prices: [
      { start: "2026-01-02T10:00:00Z", end: "2026-01-02T11:00:00Z", price: "0,25" },
      { start: "not-a-date", end: "2026-01-02T12:00:00Z", price: 4 },
      { start: "2026-01-02T12:00:00Z", price: 3 },
      { start: "2026-01-02T13:00:00Z", end: "2026-01-02T14:00:00Z", price: "bad" },
    ] }), { path: "prices", startField: "start", endField: "end", priceField: "price" });
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe(0.25);
  });

  it("parses interval duration when an explicit end is absent", () => {
    const parsed = parseIntervals(entity({ prices: [
      { start: "2026-01-02T10:00:00Z", duration: 15, price: 12 },
    ] }), { path: "prices", startField: "start", durationField: "duration", priceField: "price" });
    expect(parsed[0].end - parsed[0].start).toBe(15 * 60_000);
  });

  it("computes duration-weighted averages and converts price units", () => {
    const start = Date.UTC(2026, 0, 1);
    expect(weightedAverage([
      { start, end: start + 15 * 60_000, value: 10 },
      { start: start + 15 * 60_000, end: start + 60 * 60_000, value: 20 },
    ])).toBe(17.5);
    expect(convertPrice(0.42, "EUR/kWh", "ct/kWh")).toBe(42);
    expect(convertPrice(42, "ct/kWh", "EUR/kWh")).toBe(0.42);
    expect(numeric("3,14")).toBe(3.14);
  });

  it("clips to visible intervals and does not fabricate partial-period prices", () => {
    const start = new Date(2026, 2, 1, 6).getTime();
    const end = new Date(2026, 2, 1, 12).getTime();
    const results = buildPeriodAverages([
      { start: new Date(2026, 2, 1, 6).getTime(), end: new Date(2026, 2, 1, 7).getTime(), value: 10 },
      { start: new Date(2026, 2, 1, 9).getTime(), end: new Date(2026, 2, 1, 10).getTime(), value: 30 },
    ], start, end, [{ name: "Morning", startHour: 6, endHour: 12 }]);
    expect(results).toHaveLength(1);
    expect(results[0].average).toBe(20);
    expect(results[0].minimum).toBe(10);
    expect(results[0].coverage).toBe("partial");
  });

  it("handles overnight periods spanning midnight", () => {
    const first = new Date(2026, 3, 5, 23).getTime();
    const afterMidnight = new Date(2026, 3, 6, 1).getTime();
    const periods = buildPeriodAverages([
      { start: first, end: first + 60 * 60_000, value: 10 },
      { start: afterMidnight, end: afterMidnight + 60 * 60_000, value: 30 },
    ], new Date(2026, 3, 5, 22).getTime(), new Date(2026, 3, 6, 3).getTime(), [
      { name: "Night", startHour: 22, endHour: 6 },
    ]);
    expect(periods[0].average).toBe(20);
    expect(periods[0].date).toBe("2026-04-05");
  });

  it("attributes a visible after-midnight portion to the previous overnight period", () => {
    const start = new Date(2026, 3, 6, 1).getTime();
    const periods = buildPeriodAverages([
      { start, end: start + 60 * 60_000, value: 15 },
    ], start, new Date(2026, 3, 6, 2).getTime(), [
      { name: "Night", startHour: 22, endHour: 6 },
      { name: "Morning", startHour: 6, endHour: 12 },
      { name: "Afternoon", startHour: 12, endHour: 18 },
      { name: "Evening", startHour: 18, endHour: 22 },
    ]);
    expect(periods.find((period) => period.name === "Night")?.date).toBe("2026-04-05");
    expect(periods.find((period) => period.name === "Night")?.average).toBe(15);
  });

  it("supports point-based forecasts and differentiates valid empty from missing schedules", () => {
    expect(parsePoints(entity({ forecast: [{ at: "2026-02-01T10:00:00Z", pct: 62 }] }), {
      path: "forecast", startField: "at", valueField: "pct",
    })).toHaveLength(1);
    expect(parseBlocks(entity({ blocks: [] }), { path: "blocks", startField: "start", endField: "end" }))
      .toEqual({ validSource: true, blocks: [] });
    expect(parseBlocks(undefined, { path: "blocks" }).validSource).toBe(false);
    expect(parseBlocks(entity({ blocks: [{ start: "invalid" }] }), {
      path: "blocks", startField: "start", endField: "end",
    }).validSource).toBe(false);
  });

  it("reads JSON-array intervals from a state adapter root", () => {
    const state = JSON.stringify([{ from: "2026-02-01T10:00:00Z", until: "2026-02-01T11:00:00Z", amount: 20 }]);
    const parsed = parseIntervals(entity({}, state), {
      startField: "from", endField: "until", priceField: "amount",
    }, "amount", JSON.parse(state) as unknown);
    expect(parsed[0].value).toBe(20);
  });

  it("parses ISO timestamps and epoch seconds", () => {
    expect(timestamp(1_700_000_000)).toBe(1_700_000_000_000);
    expect(timestamp("bad")).toBeUndefined();
  });
});
