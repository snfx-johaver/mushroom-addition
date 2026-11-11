import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { EnergyMonitorCard } from "../src/energy-monitor/card";
import { MONITOR_CARDS, monitorOptions, validateMonitor, type MonitorConfig } from "../src/energy-monitor/config";
import { checkedSnapshot, compareBaseline, costHistory, counterHistory, flowReadings, historyRows, reading, sampleSeries } from "../src/energy-monitor/data";
import { MonitorHistory } from "../src/energy-monitor/history";
import { CATALOG } from "../src/catalog";
import { createStubConfig } from "../src/stub";
import { editorSchemaFor } from "../src/editor-schema";
import { monitorFields } from "../src/energy-monitor/schema";
import { localizeText, SUPPORTED_LOCALES, translationCatalogs } from "../src/localize";
import { localizeEditorSchema } from "../src/localized-schema";
import { energyMonitorGuidance, energyMonitorLabels, energyMonitorSources } from "../src/translations/energy-monitor";
import { energyDirectRoutes, energyFlowScene } from "../src/translations/energy-flow-scene";
import type { NativeFields } from "../src/energy-editor-schema";
import type { MushroomAdditionEditor } from "../src/editor";
import { openEditorSections } from "./editor-helpers";
import type { HassEntity, HomeAssistant } from "../src/types";

const start = Date.parse("2031-04-12T00:00:00Z"), hour = 3600000, end = start + 2 * hour;
const type = (id: string) => `custom:mushroom-addition-${id}`;
const options = () => monitorOptions({ type: type("battery-activity") });
const row = (id: string, value: string | number, time = end, unit = "kWh"): HassEntity => ({
  entity_id: id, state: String(value), last_updated: new Date(time).toISOString(),
  attributes: { unit_of_measurement: unit, state_class: "total_increasing" },
});
const hass = (): HomeAssistant => ({
  states: {}, language: "en", config: { time_zone: "UTC", currency: "EUR" }, callService: vi.fn(async () => undefined),
});
const fixture = () => {
  const h = hass(), opt = options(), response: Record<string, HassEntity[]> = {};
  for (const [id, value, unit] of [
    ["sensor.import", 4, "kWh"], ["sensor.export", 1, "kWh"], ["sensor.rate", .2, "EUR/kWh"], ["sensor.export_rate", .1, "EUR/kWh"],
  ] as const) {
    response[id] = [row(id, unit === "kWh" ? 10 : value, start, unit), row(id, unit === "kWh" ? 10 + value : value, end, unit)];
    h.states[id] = response[id][1];
  }
  opt.importEnergy = { entity: "sensor.import" }; opt.exportEnergy = { entity: "sensor.export" };
  opt.importRate = { entity: "sensor.rate" }; opt.exportRate = { entity: "sensor.export_rate" };
  return { h, opt, response };
};
afterEach(() => { document.body.replaceChildren(); vi.useRealTimers(); vi.restoreAllMocks(); });

describe("energy monitor source contracts", () => {
  it("uses verified units, explicit directions and honest missing/absent states", () => {
    const h = hass(), opt = options();
    h.states = { "sensor.solar": row("sensor.solar", 2000, end, "W"), "sensor.grid": row("sensor.grid", -1, end, "kW"),
      "sensor.battery": row("sensor.battery", -300, end, "W"), "sensor.home": row("sensor.home", 700, end, "W") };
    opt.solar = { entity: "sensor.solar" }; opt.grid = { entity: "sensor.grid" };
    opt.battery = { entity: "sensor.battery" }; opt.home = { entity: "sensor.home" };
    opt.batteryPositive = "discharge";
    const flow = flowReadings(h, opt, end);
    expect(flow.solar.value).toBe(2); expect(flow.battery.value).toBe(.3);
    expect(flow.mismatch).toBe(false);
    opt.battery = {};
    expect(flowReadings(h, opt, end).residual).toBeUndefined();
    opt.battery = { absent: true };
    expect(flowReadings(h, opt, end).battery).toEqual({ value: 0, absent: true });
    opt.gridPositive = "export";
    expect(flowReadings(h, opt, end).grid.value).toBe(1);
    h.states["sensor.solar"].last_updated = new Date(start).toISOString();
    expect(flowReadings(h, opt, end).solar.error).toBe("Stale data source");
    h.states["sensor.home"].attributes.unit_of_measurement = "kWh";
    expect(flowReadings(h, opt, end).home.value).toBeUndefined();
  });
  it("requires a verified home boundary and avoids calculating from missing equipment", () => {
    const cfg: MonitorConfig = { type: type("live-energy-flow"), energy_monitor: { deriveHome: true } };
    expect(() => validateMonitor(cfg)).toThrow("boundary");
    cfg.energy_monitor!.homeBoundary = "excludes_battery_charging";
    validateMonitor(cfg);
    const opt = monitorOptions(cfg), h = hass();
    opt.solar = opt.battery = { absent: true }; opt.grid = { entity: "sensor.grid" };
    h.states["sensor.grid"] = row("sensor.grid", 600, end, "W");
    expect(flowReadings(h, opt, end).home.value).toBe(.6);
    opt.battery = {};
    expect(flowReadings(h, opt, end).home.error).toBe("Source missing");
    cfg.energy_monitor!.home = { entity: "sensor.home" };
    expect(() => validateMonitor(cfg)).toThrow("not both");
  });
  it("reads EV charging independently without changing the household total or balance", () => {
    const h = hass(), opt = options(), ev = "sensor.ev", grid = "sensor.grid";
    opt.solar = opt.battery = { absent: true };
    opt.grid = { entity: grid }; opt.ev = { entity: ev };
    opt.deriveHome = true; opt.homeBoundary = "excludes_battery_charging";
    h.states[grid] = row(grid, 7000, end, "W"); h.states[ev] = row(ev, 6200, end, "W");
    const flow = flowReadings(h, opt, end);
    expect(flow.ev.value).toBe(6.2); expect(flow.home.value).toBe(7); expect(flow.residual).toBe(0);
    h.states[ev] = row(ev, -6200, end, "W");
    expect(flowReadings(h, opt, end).ev.value).toBeUndefined();
    expect(flowReadings(h, opt, end).home.value).toBe(7);
    opt.ev = { absent: true };
    expect(flowReadings(h, opt, end).ev).toEqual({ value: 0, absent: true });
  });
  it("uses only dedicated EV-route measurements and never adds them to site totals", () => {
    const h = hass(), opt = options();
    opt.solar = { entity: "sensor.solar" }; opt.battery = { entity: "sensor.battery" }; opt.grid = { entity: "sensor.grid" };
    opt.deriveHome = true; opt.homeBoundary = "excludes_battery_charging";
    h.states["sensor.solar"] = row("sensor.solar", 5000, end, "W");
    h.states["sensor.battery"] = row("sensor.battery", -600, end, "W");
    h.states["sensor.grid"] = row("sensor.grid", 1400, end, "W");
    h.states["sensor.solar_ev"] = row("sensor.solar_ev", 4200, end, "W");
    h.states["sensor.battery_ev"] = row("sensor.battery_ev", .6, end, "kW");
    expect(flowReadings(h, opt, end).solarToEv.value).toBeUndefined();
    opt.solarToEv = { entity: "sensor.solar_ev" }; opt.batteryToEv = { entity: "sensor.battery_ev" };
    const flow = flowReadings(h, opt, end);
    expect(flow.solarToEv.value).toBe(4.2); expect(flow.batteryToEv.value).toBe(.6);
    expect(flow.home.value).toBe(7); expect(flow.residual).toBe(0);
    opt.solar = { absent: true };
    expect(() => validateMonitor({ type: type("live-energy-flow"), energy_monitor: opt })).toThrow("Not installed");
    opt.solar = opt.battery = {};
    expect(() => validateMonitor({ type: type("live-energy-flow"), energy_monitor: opt })).not.toThrow();
    opt.ev = { absent: true };
    expect(() => validateMonitor({ type: type("live-energy-flow"), energy_monitor: opt })).toThrow("Not installed");
  });
  it.each([
    [-1, end, "W"], ["unavailable", end, "W"], [4200, end, "kWh"],
    [4200, start, "W"], [4200, end + 2 * 60000, "W"],
  ] as const)("rejects an invalid dedicated EV route (%s, %s, %s) independently", (value, time, unit) => {
    const h = hass(), opt = options();
    opt.solarToEv = { entity: "sensor.solar_ev" }; opt.batteryToEv = { entity: "sensor.battery_ev" };
    h.states["sensor.solar_ev"] = row("sensor.solar_ev", value, time, unit);
    h.states["sensor.battery_ev"] = row("sensor.battery_ev", .6, end, "kW");
    const flow = flowReadings(h, opt, end);
    expect(flow.solarToEv.value).toBeUndefined(); expect(flow.solarToEv.error).toBeTruthy();
    expect(flow.batteryToEv.value).toBe(.6);
  });
  it("rejects unsafe settings and invalid state of charge", () => {
    const config: MonitorConfig = { type: type("battery-activity") };
    expect(() => validateMonitor({ ...config, energy_monitor: { maxGapMinutes: 0 } })).toThrow();
    expect(() => validateMonitor({ ...config, energy_monitor: { maxContentWidth: 200 } })).toThrow();
    expect(() => validateMonitor({ ...config, energy_monitor: { chargeEnergy: { entity: "sensor.counter", sourceType: "hardware", recoverGaps: true } } })).toThrow("gap recovery");
    const h = hass();
    h.states["sensor.soc"] = row("sensor.soc", 101, end, "%");
    expect(reading(h, { entity: "sensor.soc" }, end, 15, "soc").value).toBeUndefined();
    h.states["sensor.soc"] = row("sensor.soc", 60, end + 2 * 60000, "%");
    expect(reading(h, { entity: "sensor.soc" }, end, 15, "soc").value).toBeUndefined();
  });
});

describe("recorded power and cumulative accounting", () => {
  it("keeps unavailable samples, long gaps and unreported tails out of power plots", () => {
    const h = hass(), id = "sensor.battery";
    h.states[id] = row(id, 500, end, "W");
    const rows = [row(id, 500, start, "W"), row(id, 800, start + 600000, "W"),
      row(id, "unavailable", start + 1200000, "W"), row(id, 1000, start + 1800000, "W"),
      row(id, 600, start + 2400000, "W"), row(id, 600, start + hour, "W")];
    const result = sampleSeries(h, { entity: id }, { [id]: rows }, start, end, 15, "power");
    expect(result.spans).toHaveLength(2);
    expect(result.spans.map(span => span.value)).toEqual([.5, 1]);
    expect(result.missingMs).toBe(100 * 60000);
    expect(result.spans.at(-1)!.end).toBe(start + 2400000);
    rows.push(row(id, 650, start + hour, "W"));
    expect(sampleSeries(h, { entity: id }, { [id]: rows }, start, end, 15, "power").error).toContain("Conflicting");
    expect(() => historyRows({ [id]: new Array(50001) }, id)).toThrow("limit");
  });
  it("rejects changed units, ambiguous groups and unavailable current counter snapshots", () => {
    const { h, opt, response } = fixture(), id = opt.importEnergy.entity!;
    expect(() => historyRows({ [id]: [row("sensor.unrelated", 1)] }, id)).toThrow("row");
    response[id][0].attributes.unit_of_measurement = "Wh";
    expect(counterHistory(h, opt.importEnergy, response, end).total).toBeUndefined();
    response[id][0].attributes.unit_of_measurement = "kWh";
    const live = { ...h, states: { ...h.states, [id]: { ...h.states[id], state: "unavailable" } } };
    expect(counterHistory(checkedSnapshot(h, live, [id]), opt.importEnergy, response, end).total).toBeUndefined();
    const powerId = "sensor.power";
    h.states[powerId] = row(powerId, 1, end, "kW");
    expect(sampleSeries(h, { entity: powerId }, { [powerId]: [row(powerId, 100, start, "W")] }, start, end, 30, "power").error).toContain("unit changed");
  });
  it("preserves unrelated costs when a counter has an outage or reset", () => {
    const { h, opt, response } = fixture();
    response["sensor.export"].splice(1, 0, row("sensor.export", "unavailable", start + hour));
    const result = costHistory(h, opt, response, end).value!;
    expect(result.importCost).toBeCloseTo(.8);
    expect(result.exportCredit).toBeUndefined();
    response["sensor.import"][0].state = "15";
    expect(counterHistory(h, opt.importEnergy, response, end).total).toBeUndefined();
  });
  it("handles negative tariffs and distinguishes missing export rates from absent equipment", () => {
    const { h, opt, response } = fixture();
    response["sensor.rate"][0].state = "-0.2"; response["sensor.rate"][1].state = "-0.2";
    h.states["sensor.rate"] = response["sensor.rate"][1];
    expect(costHistory(h, opt, response, end).value?.importCost).toBeCloseTo(-.8);
    opt.exportRate = {};
    expect(costHistory(h, opt, response, end).value?.exportCredit).toBeUndefined();
    opt.exportEnergy = { absent: true };
    expect(costHistory(h, opt, response, end).value?.exportCredit).toBe(0);
  });
});

describe("externally retained Plan vs Actual baseline", () => {
  const baseline = () => {
    const { h, opt, response } = fixture();
    opt.baseline = { entity: "sensor.baseline" };
    h.states["sensor.baseline"] = {
      entity_id: "sensor.baseline", state: "retained", attributes: {
        generated: start - hour, intervals: [{ start, end: start + hour, energy: 1 }, { start: start + hour, end, energy: 3 }],
      },
    };
    const measured = counterHistory(h, opt.importEnergy, response, end);
    return { h, opt, measured };
  };
  it("matches measured energy only over overlapping baseline windows", () => {
    const { h, opt, measured } = baseline();
    const result = compareBaseline(h, opt, measured, start, end);
    expect(result.error).toBeUndefined(); expect(result.planned).toBe(4); expect(result.actual).toBe(4); expect(result.coveredMs).toBe(2 * hour);
    measured.spans = [{ start: start + hour / 2, end: start + 1.5 * hour, value: 2 }];
    const partial = compareBaseline(h, opt, measured, start, end);
    expect(partial.actual).toBe(2); expect(partial.planned).toBe(2);
    expect(partial.coveredMs).toBe(hour); expect(partial.missingMs).toBe(hour);
    opt.baseline.unit = "Wh";
    expect(compareBaseline(h, opt, measured, start, end).planned).toBeCloseTo(.002);
  });
  it("counts valid zero-use meter intervals as covered without adding them to cost accounting", () => {
    const { h, opt, response } = fixture(), id = opt.importEnergy.entity!;
    response[id] = [row(id, 10, start), row(id, 10, start + hour), row(id, 10, end)];
    h.states[id] = response[id].at(-1)!;
    const measured = counterHistory(h, opt.importEnergy, response, end);
    opt.baseline = { entity: "sensor.baseline" };
    h.states["sensor.baseline"] = {
      entity_id: "sensor.baseline", state: "retained", attributes: {
        generated: start - hour, intervals: [{ start, end: start + hour, energy: 1 }, { start: start + hour, end, energy: 3 }],
      },
    };
    expect(measured.total).toBe(0);
    expect(measured.error).toBeUndefined();
    expect(measured.spans).toEqual([
      { start, end: start + hour, value: 0 },
      { start: start + hour, end, value: 0 },
    ]);
    const result = compareBaseline(h, {
      ...opt,
      baseline: { entity: "sensor.baseline" },
    }, measured, start, end);
    expect(result.actual).toBe(0);
    expect(result.planned).toBe(4);
    expect(result.coveredMs).toBe(2 * hour);
    expect(result.missingMs).toBe(0);
    expect(costHistory(h, opt, response, end).value?.intervals.every(interval => interval.imported === 0)).toBe(true);
  });
  it("rejects revised, unavailable, malformed and overlapping baselines rather than substituting forecasts", () => {
    const { h, opt, measured } = baseline(), attrs = h.states["sensor.baseline"].attributes;
    attrs.generated = start + 1;
    expect(compareBaseline(h, opt, measured, start, end).error).toContain("predate");
    attrs.generated = start - hour;
    attrs.intervals = [{ start, end, energy: 1 }, { start, end, energy: 2 }];
    expect(compareBaseline(h, opt, measured, start, end).error).toBe("Invalid retained baseline");
    attrs.intervals = [];
    expect(compareBaseline(h, opt, measured, start, end).error).toBe("Invalid retained baseline");
    h.states["sensor.baseline"].state = "unavailable";
    expect(compareBaseline(h, opt, measured, start, end).error).toBe("Retained baseline missing");
    delete h.states["sensor.baseline"];
    expect(compareBaseline(h, opt, measured, start, end).error).toBe("Retained baseline missing");
  });
});

describe("bounded Recorder lifecycle", () => {
  it("throttles requests, captures the query window and retries after clearing an error", async () => {
    const h = hass(), changed = vi.fn(), history = new MonitorHistory(changed), id = "sensor.power";
    h.callWS = vi.fn(async () => ({ [id]: [] })) as HomeAssistant["callWS"];
    await history.load(h, [id], start, end, "options");
    await history.load(h, [id], start, end + 60000, "options");
    expect(h.callWS).toHaveBeenCalledTimes(1); expect(history.snapshot?.end).toBe(end);
    expect(h.callWS).toHaveBeenCalledWith(expect.objectContaining({ start_time: new Date(start - hour).toISOString(), minimal_response: false }));
    history.clear();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    h.callWS = vi.fn(async () => { throw new Error("Permission denied"); });
    await history.load(h, [id], start, end, "options");
    expect(history.snapshot).toBeUndefined(); expect(history.error).toBe("Permission denied"); expect(warn).toHaveBeenCalled();
    history.clear();
    h.callWS = vi.fn(async () => ({})) as HomeAssistant["callWS"];
    await history.load(h, [], start, end, "options");
    expect(h.callWS).not.toHaveBeenCalled(); expect(history.error).toBe("Source missing");
  });
  it("cancels superseded queries and reports bounded timeouts without retaining stale results", async () => {
    vi.useFakeTimers(); vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const h = hass(), history = new MonitorHistory(vi.fn());
    let finish!: (value: unknown) => void;
    h.callWS = vi.fn(() => new Promise(resolve => { finish = resolve; })) as HomeAssistant["callWS"];
    const old = history.load(h, ["sensor.old"], start, end, "old");
    history.clear();
    finish({ "sensor.old": [] }); await old;
    expect(history.snapshot).toBeUndefined(); expect(history.error).toBeUndefined();
    const timeout = history.load(h, ["sensor.new"], start, end, "new");
    await vi.advanceTimersByTimeAsync(30001); await timeout;
    expect(history.error).toContain("timed out"); expect(history.loading).toBe(false);
  });
});

describe("Mushroom monitor integration", () => {
  it("draws dedicated source-to-EV cables only when mapped and stops unhealthy routes independently", async () => {
    vi.useFakeTimers(); vi.setSystemTime(end);
    const h = hass(), opt = options();
    opt.battery = { entity: "sensor.battery" };
    opt.solarToEv = { entity: "sensor.solar_ev" }; opt.batteryToEv = { entity: "sensor.battery_ev" };
    h.states = {
      "sensor.battery": row("sensor.battery", -1, end, "kW"),
      "sensor.solar_ev": row("sensor.solar_ev", 4200, end, "W"),
      "sensor.battery_ev": row("sensor.battery_ev", 600, end, "W"),
    };
    const card = document.createElement("mushroom-addition-live-energy-flow") as EnergyMonitorCard;
    card.hass = h; card.setConfig({ type: type("live-energy-flow"), energy_monitor: opt }); document.body.append(card);
    await card.updateComplete;
    const root = card.shadowRoot!;
    expect(root.querySelectorAll(".flow-current")).toHaveLength(3);
    expect(root.querySelector('.flow-line[data-key=battery]')?.getAttribute("data-direction")).toBe("forward");
    expect(root.querySelector('.flow-route-reading[data-key=solarToEv]')?.textContent).toContain("4.2 kW");
    for (const key of ["solarToEv", "batteryToEv"]) {
      expect(root.querySelector(`.flow-line[data-key=${key}] .flow-wire`)?.getAttribute("d")).toMatch(/L929 506$/);
      expect(root.querySelector(`.flow-line[data-key=${key}]`)?.getAttribute("data-direction")).toBe("forward");
    }
    card.hass = { ...h, states: { ...h.states, "sensor.solar_ev": row("sensor.solar_ev", 4200, start, "W") } };
    await card.updateComplete;
    expect(root.querySelector('.flow-line[data-key=solarToEv] .flow-current')).toBeNull();
    expect(root.querySelector('.flow-route-reading[data-key=solarToEv]')?.textContent).toContain("Stale data source");
    expect(root.querySelector('.flow-line[data-key=batteryToEv] .flow-current')).toBeTruthy();
    card.setConfig({ type: type("live-energy-flow"), energy_monitor: { ...opt, solarToEv: {}, batteryToEv: {} } });
    await card.updateComplete;
    expect(root.querySelector(".flow-route-reading")).toBeNull();
    expect(root.querySelector('.flow-line[data-key=solarToEv]')).toBeNull();
    expect(root.querySelector('.flow-line[data-key=batteryToEv]')).toBeNull();
  });
  it("renders a local 3D asset and measured animated routes with import/export direction and speed", async () => {
    vi.useFakeTimers(); vi.setSystemTime(end);
    const h = hass(), opt = options();
    const readings = { grid: -2, solar: 5, home: 2, battery: 1, ev: 1.5 } as const;
    for (const [key, value] of Object.entries(readings)) {
      const id = `sensor.${key}`;
      opt[key as keyof typeof readings] = { entity: id }; h.states[id] = row(id, value, end, "kW");
    }
    h.callWS = vi.fn();
    const card = document.createElement("mushroom-addition-live-energy-flow") as EnergyMonitorCard;
    card.hass = h; card.setConfig({ type: type("live-energy-flow"), energy_monitor: opt }); document.body.append(card);
    await card.updateComplete;
    const root = card.shadowRoot!, routes = () => [...root.querySelectorAll(".flow-current")];
    expect(root.querySelector(".flow-art img")?.getAttribute("src")).toContain("live-flow-scene");
    expect(root.querySelectorAll(".flow-node")).toHaveLength(5); expect(routes()).toHaveLength(4);
    expect(root.querySelector(".flow-junction")).toBeNull();
    expect(root.querySelector('.flow-line[data-key=home]')).toBeNull();
    expect(root.querySelector('.flow-line[data-key=battery]')?.getAttribute("data-direction")).toBe("reverse");
    for (const key of ["grid", "solar", "battery"]) {
      expect(root.querySelector(`.flow-line[data-key=${key}] .flow-wire`)?.getAttribute("d")).toMatch(/L502 397$/);
    }
    expect(root.querySelector(".flow-route-reading")).toBeNull();
    expect(root.querySelector('.flow-line[data-key=grid]')?.getAttribute("data-direction")).toBe("reverse");
    expect(root.querySelector('.flow-line[data-key=ev]')?.getAttribute("data-state")).toBe("flowing");
    const oldDuration = root.querySelector('.flow-line[data-key=ev]')?.getAttribute("style");
    card.hass = { ...h, states: { ...h.states, "sensor.ev": row("sensor.ev", 6.2, end, "kW") } }; await card.updateComplete;
    expect(root.querySelector('.flow-line[data-key=ev]')?.getAttribute("style")).not.toBe(oldDuration);
    card.hass = { ...h, states: Object.fromEntries(Object.entries(h.states).map(([id, state]) => [id, { ...state, state: "0" }])) };
    await card.updateComplete;
    expect(routes()).toHaveLength(0);
    expect(root.querySelectorAll('.flow-line[data-state=idle]')).toHaveLength(4);
    expect(h.callWS).not.toHaveBeenCalled(); expect(h.callService).not.toHaveBeenCalled();
    expect(String(EnergyMonitorCard.styles)).toContain("@media(prefers-reduced-motion:reduce)");
  });
  it("stops a route for stale, unavailable and absent sources without stopping healthy routes", async () => {
    vi.useFakeTimers(); vi.setSystemTime(end);
    const h = hass(), opt = options();
    opt.grid = { entity: "sensor.grid" }; opt.home = { entity: "sensor.home" };
    opt.solar = { entity: "sensor.solar" }; opt.battery = { absent: true }; opt.ev = { entity: "sensor.ev" };
    h.states = {
      "sensor.grid": row("sensor.grid", 2, end, "kW"), "sensor.home": row("sensor.home", 2, end, "kW"),
      "sensor.solar": row("sensor.solar", "unavailable", end, "kW"), "sensor.ev": row("sensor.ev", 1, start, "kW"),
    };
    const card = document.createElement("mushroom-addition-live-energy-flow") as EnergyMonitorCard;
    card.hass = h; card.setConfig({ type: type("live-energy-flow"), energy_monitor: opt }); document.body.append(card);
    await card.updateComplete;
    const root = card.shadowRoot!;
    expect(root.querySelectorAll(".flow-current")).toHaveLength(1);
    expect(root.querySelector('.flow-line[data-key=ev]')?.getAttribute("data-state")).toBe("unavailable");
    expect(root.querySelector('.flow-line[data-key=solar] .flow-current')).toBeNull();
    expect(root.querySelector('.flow-line[data-key=battery]')?.getAttribute("data-state")).toBe("absent");
    expect(root.querySelector('.flow-node[data-key=ev]')?.textContent).toContain("Stale data source");
    card.hass = { ...h, states: { ...h.states, "sensor.ev": row("sensor.ev", 1, end, "kW") } }; await card.updateComplete;
    expect(root.querySelector('.flow-line[data-key=ev] .flow-current')).toBeTruthy();
  });
  const battery = async (includePower = true, includeSoc = true) => {
    vi.useFakeTimers(); vi.setSystemTime(end);
    const h = hass(), minute = 60000, powerId = "sensor.battery", socId = "sensor.soc";
    const response = {
      [powerId]: [row(powerId, 1000, start, "W"), row(powerId, -1000, start + minute, "W"), row(powerId, 0, start + 2 * minute, "W")],
      [socId]: [
        row(socId, 0, start, "%"), row(socId, 50, start + 10 * minute, "%"), row(socId, 100, start + 20 * minute, "%"),
        row(socId, "unavailable", start + 30 * minute, "%"), row(socId, 70, start + 40 * minute, "%"),
        row(socId, 65, start + 50 * minute, "%"), row(socId, 60, start + hour, "%"),
      ],
    };
    h.states[powerId] = row(powerId, 0, end, "W"); h.states[socId] = row(socId, 60, end, "%");
    h.callWS = vi.fn(async () => response) as HomeAssistant["callWS"];
    const card = document.createElement("mushroom-addition-battery-activity") as EnergyMonitorCard;
    card.hass = h; card.setConfig({ type: type("battery-activity"), energy_monitor: {
      battery: includePower ? { entity: powerId } : {}, soc: includeSoc ? { entity: socId } : {},
    } });
    document.body.append(card); await card.updateComplete; await vi.advanceTimersByTimeAsync(1); await card.updateComplete;
    return card.shadowRoot!;
  };
  it("overlays power bars and the SoC line in exactly one chart with independent axes", async () => {
    const root = await battery();
    expect(root.querySelectorAll("svg[role=img]")).toHaveLength(1);
    expect(root.querySelectorAll(".plot-panel")).toHaveLength(1);
    expect(root.querySelectorAll(".axis")).toHaveLength(1);
    expect(root.querySelector(".power-scale")?.getAttribute("aria-label")).toContain("kW");
    expect([...root.querySelectorAll(".soc-scale span")].map(node => node.textContent)).toEqual(["100", "50", "0"]);
    const charge = root.querySelector(".charge-bar")!, discharge = root.querySelector(".discharge-bar")!;
    expect(charge.getAttribute("fill")).not.toBe(discharge.getAttribute("fill"));
    expect(Number(charge.getAttribute("y"))).toBeLessThan(90);
    expect(Number(discharge.getAttribute("y"))).toBe(90);
    expect(charge.getAttribute("height")).toBe(discharge.getAttribute("height"));
    expect(root.querySelector(".soc-line")?.getAttribute("d")).toContain("M0,173");
    expect(root.querySelector(".soc-line")?.getAttribute("d")).toContain("V7");
  });
  it("breaks the overlaid SoC line at gaps and never extends it into an unreported tail", async () => {
    const root = await battery(), lines = [...root.querySelectorAll(".soc-line")];
    expect(lines).toHaveLength(2);
    expect(lines[0].getAttribute("d")).toContain("H166.");
    expect(lines[1].getAttribute("d")).toMatch(/^M333\./);
    expect(lines[1].getAttribute("d")).toContain("H500");
    expect(lines[1].getAttribute("d")).not.toContain("H1000");
    expect(root.querySelectorAll(".soc-gap")).toHaveLength(2);
    expect(root.querySelector(".power-gap")).toBeTruthy();
  });
  it.each([[true, false], [false, true]])("preserves a usable single chart when power=%s and SoC=%s are configured", async (power, soc) => {
    const root = await battery(power, soc);
    expect(root.querySelectorAll("svg[role=img]")).toHaveLength(1);
    expect(!!root.querySelector(".soc-line")).toBe(soc);
    expect(!!root.querySelector(".soc-scale")).toBe(soc);
    expect(!!root.querySelector(".charge-bar")).toBe(power);
    if (!power) expect(root.querySelector(".power-scale")?.textContent).not.toContain("0");
  });
  it("localizes every new label and preserves machine field paths in native object editors", () => {
    for (const locale of SUPPORTED_LOCALES) {
      for (const table of [energyMonitorLabels, energyMonitorSources, energyMonitorGuidance, energyFlowScene, energyDirectRoutes]) {
        expect(Object.keys(table[locale])).toEqual(Object.keys(table.en));
        for (const key of Object.keys(table.en)) expect(translationCatalogs[locale][key]).toBe(table[locale][key]);
      }
    }
    const descriptor = CATALOG.find(item => item.upstreamId === "energy_plan_actual")!;
    const field = localizeEditorSchema({ language: "nl" } as HomeAssistant, editorSchemaFor(descriptor)).find(field => field.name === "energy_monitor")!;
    const fields = (field.selector?.object as { fields: NativeFields }).fields;
    expect(fields.baseline.label).toBe("Bewaarde referentieprognose");
    const baseline = (fields.baseline.selector.object as { fields: NativeFields }).fields;
    expect(baseline.path.default).toBe("intervals");
    expect(baseline.generatedField.default).toBe("generated");
    expect(localizeText({ language: "nl" }, "Live Energy Flow")).toBe("Actuele energiestromen");
    const flow = CATALOG.find(item => item.upstreamId === "live_energy_flow")!;
    const flowField = localizeEditorSchema({ language: "nl" } as HomeAssistant, editorSchemaFor(flow)).find(field => field.name === "energy_monitor")!;
    expect((flowField.selector?.object as { fields: NativeFields }).fields.ev.label).toBe("Vermogen elektrische auto");
    expect((flowField.selector?.object as { fields: NativeFields }).fields.solarToEv.label).toBe("Solar naar EV");
    expect((flowField.selector?.object as { fields: NativeFields }).fields.batteryToEv.label).toBe("Batterij naar EV");
  });
  it.each(MONITOR_CARDS)("registers $name with shared headings, explicit source mappings and native features", definition => {
    const descriptor = CATALOG.find(item => item.tag === definition.tag)!;
    const cfg = createStubConfig(descriptor, hass()), card = document.createElement(definition.tag) as EnergyMonitorCard;
    expect(card).toBeInstanceOf(EnergyMonitorCard); validateMonitor(cfg);
    expect(cfg.primary_info).toBeUndefined(); expect(cfg.secondary_info).toBeUndefined();
    expect(editorSchemaFor(descriptor, cfg).find(field => field.name === "energy_monitor")?.selector?.object).toBeTruthy();
    expect(monitorFields(definition.id).maxContentWidth).toBeTruthy();
    expect(window.customCards?.find(item => item.type === definition.tag)?.preview).toBe(false);
  });
  it("loads outside rendering, keeps details lazy and updates missing-baseline states", async () => {
    vi.useFakeTimers(); vi.setSystemTime(end);
    const { h, opt, response } = fixture();
    h.callWS = vi.fn(async () => response) as HomeAssistant["callWS"];
    const card = document.createElement("mushroom-addition-energy-plan-actual") as EnergyMonitorCard;
    card.hass = h; card.setConfig({ type: type("energy-plan-actual"), name: "Synthetic comparison", energy_monitor: { actualEnergy: opt.importEnergy } });
    document.body.append(card); await card.updateComplete;
    await vi.advanceTimersByTimeAsync(1); await card.updateComplete;
    expect(card.shadowRoot?.textContent).toContain("Retained baseline missing");
    card.remove();
    const cost = document.createElement("mushroom-addition-electricity-cost-timeline") as EnergyMonitorCard;
    cost.hass = h; cost.setConfig({ type: type("electricity-cost-timeline"), energy_monitor: opt });
    document.body.append(cost); await cost.updateComplete; await vi.advanceTimersByTimeAsync(1); await cost.updateComplete;
    expect(cost.shadowRoot?.querySelector("svg")).toBeTruthy();
    expect(cost.shadowRoot?.querySelector("table")).toBeNull();
    const details = [...cost.shadowRoot!.querySelectorAll("details")].find(detail => detail.textContent?.includes("Intervals"))!;
    details.open = true; details.dispatchEvent(new Event("toggle")); await cost.updateComplete;
    expect(cost.shadowRoot?.querySelectorAll("tbody tr").length).toBeGreaterThan(0);
    expect(h.callService).not.toHaveBeenCalled();
  });
  it("hydrates defaults in the shared editor and reports invalid mappings without publishing them", async () => {
    const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
    editor.hass = hass(); editor.setConfig({ type: type("live-energy-flow") });
    document.body.append(editor); await openEditorSections(editor);
    const form = [...editor.shadowRoot!.querySelectorAll<HTMLElement & { data: MonitorConfig["energy_monitor"]; schema: Array<{ name: string }> }>("ha-form")]
      .find(form => form.schema.some(field => field.name === "deriveHome"))!;
    expect(form.data?.maxAgeMinutes).toBe(15);
    const changed = vi.fn(); editor.addEventListener("config-changed", changed);
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { ...form.data, deriveHome: true } } }));
    await editor.updateComplete;
    expect(changed).not.toHaveBeenCalled();
    expect(editor.shadowRoot?.textContent).toContain("boundary");
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { ...form.data, deriveHome: true, homeBoundary: "excludes_battery_charging" } } }));
    await editor.updateComplete;
    expect(changed).toHaveBeenCalledTimes(1);
  });
  it.each(MONITOR_CARDS)("exposes $name feature fields directly and preserves the card configuration on edits", async definition => {
    const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
    editor.hass = hass();
    editor.setConfig({ type: `custom:${definition.tag}`, name: "Custom heading", energy_monitor: { maxContentWidth: 1000 } });
    document.body.append(editor); await openEditorSections(editor);
    const forms = [...editor.shadowRoot!.querySelectorAll<HTMLElement & {
      data: MonitorConfig["energy_monitor"]; schema: Array<{ name: string }>;
      computeLabel: (field: { name: string }) => string;
    }>("ha-form")];
    expect(forms.some(form => form.schema.some(field => field.name === "energy_monitor"))).toBe(false);
    const features = forms.find(form => form.schema.some(field => field.name === "maxContentWidth"))!;
    expect(features.schema.map(field => field.name)).toEqual(Object.keys(monitorFields(definition.id)));
    const sourceField = features.schema.find(field => !field.name.startsWith("max"))!;
    expect(features.computeLabel(sourceField)).toBe(monitorFields(definition.id)[sourceField.name].label);
    const changed = vi.fn(); editor.addEventListener("config-changed", changed);
    features.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { ...features.data, maxContentWidth: 900 } } }));
    await editor.updateComplete;
    expect(changed).toHaveBeenCalledTimes(1);
    expect(changed.mock.calls[0][0].detail.config).toMatchObject({
      type: `custom:${definition.tag}`, name: "Custom heading", energy_monitor: { maxContentWidth: 900 },
    });
  });
  it("does not render a missing export tariff as a zero-valued credit series", async () => {
    vi.useFakeTimers(); vi.setSystemTime(end);
    const { h, opt, response } = fixture();
    opt.exportRate = {};
    h.callWS = vi.fn(async () => response) as HomeAssistant["callWS"];
    const cost = document.createElement("mushroom-addition-electricity-cost-timeline") as EnergyMonitorCard;
    cost.hass = h; cost.setConfig({ type: type("electricity-cost-timeline"), energy_monitor: opt });
    document.body.append(cost); await cost.updateComplete; await vi.advanceTimersByTimeAsync(1); await cost.updateComplete;
    const values = [...cost.shadowRoot!.querySelectorAll(".metric b")].map(node => node.textContent);
    expect(values).toEqual(["0.8 EUR", "Unavailable", "Unavailable"]);
    const titles = [...cost.shadowRoot!.querySelectorAll("rect title")].map(node => node.textContent!);
    expect(titles.some(title => title.includes("Import cost:"))).toBe(true);
    expect(titles.filter(title => title.includes("Export credit:")).every(title => title.includes("not zero"))).toBe(true);
  });
});
