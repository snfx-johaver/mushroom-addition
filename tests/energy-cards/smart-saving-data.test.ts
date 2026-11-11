import { describe, expect, it } from "vitest";
import { calendarDay, calendarHour } from "../../src/energy-cards/calendar";
import { buildPeriodAverages } from "../../src/energy-cards/data";
import { coverageGaps, forecastSegments, MAX_SOURCE_ITEMS, sourceHealth, strictBlocks, strictForecast, strictIntervals, visibleForecastSegments } from "../../src/energy-cards/smart-saving-data";
import { validateConfig } from "../../src/energy-cards/validation";
import type { HassEntity } from "../../src/types";

const start = Date.parse("2031-04-12T08:00:00Z"), hour = 3_600_000;
const entity = (items: unknown, state = "ready"): HassEntity => ({
  entity_id: "sensor.example_source", state, last_updated: new Date(start).toISOString(), attributes: { items },
});
const mapping = { path: "items", startField: "start", endField: "end", valueField: "value" };
const interval = { start, end: start + hour, value: 10 };

describe("Smart Saving source contracts", () => {
  it("sorts valid intervals, rejects partial errors, overlaps, unavailable retained data and oversized lists", () => {
    expect(strictIntervals(entity([interval, { ...interval, start: start + hour, end: start + 2 * hour }].reverse()), mapping).items).toHaveLength(2);
    for (const items of [[interval, null], [interval, interval], Array(MAX_SOURCE_ITEMS + 1).fill(interval)]) {
      expect(strictIntervals(entity(items), mapping)).toEqual({ valid: false, items: [] });
    }
    expect(strictIntervals(entity([interval], "unavailable"), mapping).valid).toBe(false);
    expect(strictIntervals(entity([]), mapping)).toEqual({ valid: true, items: [] });
  });

  it("rejects malformed or overlapping schedules but accepts empty schedules and duration mappings", () => {
    expect(strictBlocks(entity([]), mapping).valid).toBe(true);
    expect(strictBlocks(entity([interval, {}]), mapping).valid).toBe(false);
    expect(strictBlocks(entity([interval, interval]), mapping).valid).toBe(false);
    expect(strictBlocks(entity([{ start, duration: 15 }]), { ...mapping, endField: undefined, durationField: "duration" }).items[0].end).toBe(start + 900_000);
  });

  it("rejects out-of-range, duplicate or partially malformed forecast points", () => {
    const point = { start, value: 40 };
    for (const items of [[point, {}], [point, point], [{ ...point, value: 101 }], [{ ...point, value: -1 }]]) {
      expect(strictForecast(entity(items), mapping).valid).toBe(false);
    }
    expect(strictForecast(entity([point, { start: start + hour, value: 100 }]), mapping).valid).toBe(true);
  });

  it("keeps leading, internal and trailing coverage gaps and never connects across an excessive point gap", () => {
    expect(coverageGaps([{ start: start + hour, end: start + 2 * hour }, { start: start + 3 * hour, end: start + 4 * hour }], start, start + 5 * hour))
      .toEqual([{ start, end: start + hour }, { start: start + 2 * hour, end: start + 3 * hour }, { start: start + 4 * hour, end: start + 5 * hour }]);
    expect(forecastSegments([0, 1, 3].map(i => ({ time: start + i * hour, value: 50 })), 60).map(segment => segment.length)).toEqual([2, 1]);
  });

  it("preserves supplied bracketing points at rolling window boundaries without bridging gaps", () => {
    const points = [0, 1, 2, 5, 6].map(i => ({ time: start + i * hour, value: 10 * i }));
    const visible = visibleForecastSegments(points, 60, start + hour / 2, start + 5.5 * hour);
    expect(visible.map(segment => segment.length)).toEqual([3, 2]);
    const intervals = visible.map(segment => ({ start: segment[0].time, end: segment.at(-1)!.time }));
    expect(coverageGaps(intervals, start + hour / 2, start + 5.5 * hour))
      .toEqual([{ start: start + 2 * hour, end: start + 5 * hour }]);
    expect(visibleForecastSegments(points, 60, start + 3 * hour, start + 4 * hour)).toEqual([]);
    expect(visibleForecastSegments(points, 60, start + 7 * hour, start + 8 * hour)).toEqual([]);
  });

  it("distinguishes unknown freshness, stale data and source availability", () => {
    expect(sourceHealth(entity([]), start, 60)).toBeUndefined();
    expect(sourceHealth(entity([]), start + 61 * 60_000, 60)).toBe("Stale data source");
    expect(sourceHealth({ ...entity([]), last_updated: undefined }, start, 60)).toBe("Not specified");
    expect(sourceHealth(entity([], "unavailable"), start, 60)).toBe("Unavailable");
    expect(sourceHealth(undefined, start, 60)).toBe("Source missing");
  });

  it.each([{ maxContentWidth: 100 }, { maxContentWidth: -1 }, { maxSourceAgeMinutes: 0 }, { forecastGapMinutes: Infinity }, { horizon: "invalid" }])("rejects invalid settings %j", extra => {
    expect(() => validateConfig({ type: "custom:mushroom-addition-smart-saving", price: { entity: "sensor.example_source" }, ...extra })).toThrow();
  });

  it.each([
    { price: { entity: "sensor.example_source", maxSourceAgeMinutes: 0 } },
    { battery: { current: { maxSourceAgeMinutes: NaN } } },
    { battery: { forecast: { entity: "sensor.example_source", maxSourceAgeMinutes: -1 } } },
    { tracks: { ev: { maxSourceAgeMinutes: 10081 } } },
    { tracks: { applied: { meaning: "automatically_confirmed" } } },
    { tracks: { plan: { powerUnit: 4 } } },
  ])("validates source-specific age limits and track meanings %j", extra => {
    expect(() => validateConfig({ type: "custom:mushroom-addition-smart-saving", price: { entity: "sensor.example_source" }, ...extra })).toThrow();
  });
});

describe("Home Assistant calendar boundaries", () => {
  it.each([
    ["2031-03-29T23:00:00Z", "Europe/Amsterdam", 23],
    ["2031-10-25T22:00:00Z", "Europe/Amsterdam", 25],
    ["2031-04-11T18:15:00Z", "Asia/Kathmandu", 24],
  ])("uses the configured timezone across %s", (date, zone, hours) => {
    const day = Date.parse(date), end = calendarDay(day, 1, zone);
    expect(calendarDay(day, 0, zone)).toBe(day);
    expect(end - day).toBe(hours * hour);
    const periods = buildPeriodAverages([{ start: day, end, value: 20 }], day, end, [{ name: "All day", startHour: 0, endHour: 24 }], zone);
    expect(periods).toHaveLength(1);
    expect(periods[0]).toMatchObject({ average: 20, coverage: "complete" });
  });

  it("matches the earlier repeated hour and advances nonexistent local hours", () => {
    const zone = "Europe/Amsterdam";
    expect(calendarHour(Date.parse("2031-03-30T00:00:00Z"), 2, zone)).toBe(Date.parse("2031-03-30T01:00:00Z"));
    expect(calendarHour(Date.parse("2031-10-25T23:00:00Z"), 2, zone)).toBe(Date.parse("2031-10-26T00:00:00Z"));
  });
});
