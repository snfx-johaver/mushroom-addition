import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { CATALOG } from "../src/catalog";
import { createStubConfig } from "../src/stub";
import { EnergyPlanCard } from "../src/energy-plan/card";
import { planDefaults, newMetric, validatePlan, type EnergyPlanConfig } from "../src/energy-plan/config";
import { displayIntervals, metricValue, rowData } from "../src/energy-plan/data";
import { EnergyInsightsCard } from "../src/energy-insights/card";
import { MushroomEnergyLogCard } from "../src/energy-cards/energy-log";
import { energyLogStub } from "../src/energy-cards/energy-log-config";
import { editorSchemaFor, type EditorField } from "../src/editor-schema";
import { insightsDefaults, validateInsights, type EnergyInsightsOptions } from "../src/energy-insights/config";
import { livePower, readActuals, readPurchasePlan } from "../src/energy-insights/data";
import { energyNumber, energyTime } from "../src/energy-format";
import { PLAN_FIELDS, PLAN_ROW_FIELDS, PLAN_METRIC_FIELDS, PLAN_PERIOD_FIELDS, INSIGHTS_FIELDS, INSIGHTS_CONSUMER_FIELDS, type NativeFields } from "../src/energy-editor-schema";
import { localizeEditorSchema } from "../src/localized-schema";
import { editorHelper, localizeText, translationCatalogs } from "../src/localize";
import type { MushroomAdditionEditor } from "../src/editor";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import { openEditorSections } from "./editor-helpers";

const now = Date.parse("2031-04-12T12:00:00Z");
const start = now - 12 * 3600000;
const options = (): EnergyInsightsOptions => ({
  ...insightsDefaults(),
  actualSource: { entity: "sensor.example_energy", path: "actuals" },
  planSource: { entity: "sensor.example_energy", path: "plan" },
  homeEntity: "sensor.example_power", solarEntity: "sensor.example_power",
  gridEntity: "sensor.example_power", batteryEntity: "sensor.example_power",
  consumers: [{ id: "heat", name: "Example heat", entity: "sensor.example_power", energyField: "heat", baselineField: "baseline", forecastField: "heat", strategyField: "strategy" }],
});
function hass(): HomeAssistant {
  return {
    language: "en", config: { time_zone: "UTC", currency: "EUR" }, callService: vi.fn(async () => undefined),
    states: {
      "sensor.example_energy": { entity_id: "sensor.example_energy", state: "ready", last_updated: new Date(now).toISOString(), attributes: {
        start: now,
        timeline: [{ start: now, end: now + 3600000, price: .2, solar: 2, soc: 50, home: 1, heat: 1, grid: 0, battery: 1 }],
        actuals: {
          start, end: now, generated_at: now, currency: "EUR",
          home_kwh: 10, solar_kwh: 6, battery_charge_kwh: 2, battery_discharge_kwh: 1,
          heat: 4, baseline: 3, baseline_start: start, baseline_end: now,
          intervals: [
            { start, end: start + 21600000, import_kwh: 3, export_kwh: 1, rate: .1, export_rate: .05 },
            { start: start + 21600000, end: now, import_kwh: 4, export_kwh: 1, rate: .3, export_rate: .05 },
          ],
        },
        plan: {
          start: now, end: now + 86400000, generated_at: now, home_kwh: 20, solar_kwh: 12,
          battery_min: 29, battery_reserve: 25, charge_efficiency: .94, heat: 7.8, strategy: "Supplied example strategy",
          blocks: [
            { start: now + 3600000, end: now + 7200000, home_kwh: 1, ev_kwh: 2, battery_kwh: 3, rate: .1, target: 57, reason: "Example reason", detail: "Example detail" },
            { start: now + 10800000, end: now + 14400000, home_kwh: 1, ev_kwh: 0, battery_kwh: 0, rate: .2, reason: "Home supply", detail: "No storage" },
          ],
        },
      } },
      "sensor.example_power": { entity_id: "sensor.example_power", state: "0.12", last_updated: new Date(now).toISOString(), attributes: { unit_of_measurement: "kW" } },
    },
  };
}
type ActualRoot = { start: number; end: number; generated_at: number; home_kwh: number; solar_kwh: number; heat: number; baseline_end: number; intervals: Array<Record<string, number>> };
const actualRoot = (h: HomeAssistant) => h.states["sensor.example_energy"].attributes.actuals as ActualRoot;
type PlanRoot = { start: number; end: number; generated_at: number; charge_efficiency: number; blocks: Array<Record<string, unknown>> };
const planRoot = (h: HomeAssistant) => h.states["sensor.example_energy"].attributes.plan as PlanRoot;
function planConfig(): EnergyPlanConfig {
  return {
    type: "custom:mushroom-addition-energy-plan", entity: "sensor.example_energy", visibleHours: 24,
    energy_plan: { ...planDefaults(), start: "source", startField: "start", rows: planDefaults().rows.map(row => ({ ...row, path: "timeline" })) },
  };
}
afterEach(() => { document.body.replaceChildren(); vi.useRealTimers(); vi.restoreAllMocks(); });
function clock() { vi.useFakeTimers(); vi.setSystemTime(now); }

describe("native energy configuration", () => {
  it("has one copy of each shared presentation field and preserves existing energy registrations", () => {
    const flatten = (fields: EditorField[]): string[] => fields.flatMap(field => field.schema ? flatten(field.schema) : field.name);
    for (const id of ["energy_plan", "energy_insights", "energy_log"]) {
      const item = CATALOG.find(item => item.upstreamId === id)!;
      const names = flatten(editorSchemaFor(item));
      for (const name of ["name", "icon", "layout", "multiline_secondary", "fill_container", "card_shadow", "primary_info", "secondary_info", "tap_action", "hold_action", "double_tap_action"]) {
        expect(names.filter(value => value === name), `${id}: ${name}`).toHaveLength(1);
      }
    }
    expect(CATALOG).toHaveLength(40);
    expect(new Set(CATALOG.map(item => item.tag)).size).toBe(40);
    expect(customElements.get("mushroom-addition-smart-saving")).toBeDefined();
    expect(customElements.get("mushroom-addition-energy-entityworkflow")).toBeDefined();
    expect(editorHelper("limit", hass())).not.toBe(editorHelper("limit", hass(), "custom:mushroom-addition-energy-log"));
  });
  it("prefers healthy compatible sources, including fallback sources after unusable selections", () => {
    clock();
    const h = hass();
    h.states["sensor.bad"] = { entity_id: "sensor.bad", state: "unavailable", last_updated: new Date(now).toISOString(), attributes: { plan: [] } };
    h.states["sensor.plan"] = { entity_id: "sensor.plan", state: "ready", last_updated: new Date(now).toISOString(), attributes: { plan: h.states["sensor.example_energy"].attributes.timeline } };
    h.states["sensor.log"] = { entity_id: "sensor.log", state: "ready", attributes: { entries: [{ timestamp: now, category: "planning", title: "Source title" }] } };
    expect(EnergyPlanCard.getStubConfig(h, ["sensor.bad"]).entity).toBe("sensor.plan");
    expect(EnergyInsightsCard.getStubConfig(h, ["sensor.bad"]).energy_insights).toMatchObject({
      actualSource: { entity: "sensor.example_energy" }, planSource: { entity: "sensor.example_energy" },
    });
    expect(energyLogStub(h, ["sensor.bad"]).sources[0].entity).toBe("sensor.log");
  });
  it("localizes generated defaults but preserves technical mappings and saved custom text", () => {
    const h = { ...hass(), language: "nl" };
    const defaults = planDefaults(h);
    expect(defaults.rows[0].name).toBe(localizeText(h, "Prices"));
    expect(defaults.rows[0].name).not.toBe("Prices");
    expect(defaults.rows[0].valueField).toBe("price");
    expect(validatePlan({ type: "custom:mushroom-addition-energy-plan" }, h).energy_plan!.rows).toEqual(defaults.rows);
    const custom = planConfig();
    custom.energy_plan!.rows[0].name = "My Prices";
    expect(validatePlan(custom, h).energy_plan!.rows[0].name).toBe("My Prices");
    const schema = localizeEditorSchema(h, [{ name: "energy_plan", selector: { object: { fields: PLAN_FIELDS } } }]);
    const rows = ((schema[0].selector!.object as { fields: NativeFields }).fields.rows.default as typeof defaults.rows);
    expect(rows[0].name).toBe(defaults.rows[0].name);
    expect(rows[0].valueField).toBe("price");
    expect(energyLogStub(h).categories[0].label).toBe(localizeText(h, "Planning"));
  });
  it("uses only the shared editor adapter and safe picker defaults", async () => {
    for (const [id, Card] of [["energy_plan", EnergyPlanCard], ["energy_insights", EnergyInsightsCard]] as const) {
      const item = CATALOG.find(item => item.upstreamId === id)!;
      expect(customElements.get(item.tag)).toBe(Card);
      expect(window.customCards?.filter(card => card.type === item.tag)).toHaveLength(1);
      expect(window.customCards?.find(card => card.type === item.tag)?.preview).toBe(false);
      const stub = createStubConfig(item);
      expect(stub.entity).toBeUndefined();
      expect(stub.primary_info).toBeUndefined();
      expect(stub.secondary_info).toBeUndefined();
      expect((await Card.getConfigElement()).tagName).toBe("MUSHROOM-ADDITION-EDITOR");
    }
    expect(customElements.get("mushroom-addition-energy-plan-features")).toBeUndefined();
  });
  it("covers every setting with structured native selectors, including nested repeatables", () => {
    expect(Object.keys(PLAN_FIELDS).sort()).toEqual([...Object.keys(planDefaults()), "startEntity", "startField"].sort());
    expect(Object.keys(PLAN_ROW_FIELDS).sort()).toEqual([...Object.keys(planDefaults().rows[0]), "entity"].sort());
    expect(Object.keys(PLAN_METRIC_FIELDS).sort()).toEqual([...Object.keys(newMetric()), "entity", "field"].sort());
    expect(Object.keys(PLAN_PERIOD_FIELDS).sort()).toEqual(["name", "start", "end", "description", "metrics"].sort());
    expect(Object.keys(INSIGHTS_FIELDS).sort()).toEqual([...Object.keys(insightsDefaults()), "currency", "homeEntity", "solarEntity", "gridEntity", "batteryEntity", "selfPoweredEntity"].sort());
    expect(Object.keys(INSIGHTS_CONSUMER_FIELDS)).toContain("strategyField");
    function check(fields: NativeFields) {
      for (const field of Object.values(fields)) {
        expect(field.selector).toBeDefined();
        if (field.label !== "ID") expect(Object.values(translationCatalogs.en)).toContain(field.label);
        const select = field.selector.select as { options?: Array<{ label: string }> } | undefined;
        for (const option of select?.options ?? []) expect(Object.values(translationCatalogs.en)).toContain(option.label);
        if (field.selector.object) {
          const selector = field.selector.object as { fields: NativeFields; multiple?: boolean; label_field?: string };
          expect(Object.keys(selector.fields).length).toBeGreaterThan(0);
          if (selector.multiple) expect(selector.label_field).toBe("name");
          check(selector.fields);
        }
      }
    }
    check(PLAN_FIELDS); check(INSIGHTS_FIELDS);
  });
  it("roundtrips nested native form values, errors and shared fields without a bespoke UI", async () => {
    const e = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
    e.hass = hass(); e.setConfig(planConfig()); document.body.append(e); await openEditorSections(e);
    const saved: AdditionConfig[] = [];
    e.addEventListener("config-changed", event => saved.push((event as CustomEvent<{ config: AdditionConfig }>).detail.config));
    type Form = HTMLElement & { data: AdditionConfig; schema: Array<{ name: string }> };
    const form = () => [...e.shadowRoot!.querySelectorAll<Form>("ha-form")].find(form => form.schema.some(field => field.name === "energy_plan"))!;
    const change = async (value: AdditionConfig) => {
      form().dispatchEvent(new CustomEvent("value-changed", { detail: { value } })); await e.updateComplete;
    };
    const config = form().data;
    const next = { ...config, name: "Custom heading", energy_plan: {
      ...config.energy_plan!, rows: [...config.energy_plan!.rows].reverse(),
      periods: [{ name: "Example period", start: 0, end: 12, description: "Description", metrics: [newMetric()] }],
    } };
    await change(next);
    expect(saved.at(-1)?.energy_plan).toEqual(next.energy_plan);
    expect(saved.at(-1)?.entity).toBe("sensor.example_energy");
    expect(e.shadowRoot!.querySelector("mushroom-addition-energy-plan-features")).toBeNull();
    await change({ ...next, visibleHours: 0 });
    expect(saved).toHaveLength(1);
    expect(e.shadowRoot!.querySelector("[role=alert]")?.textContent).toContain("visibleHours");
    await change({ ...next, visibleHours: 48 });
    expect(saved).toHaveLength(2);
    expect(e.shadowRoot!.querySelector("[role=alert]")).toBeNull();
    e.setConfig({ type: "custom:mushroom-addition-energy-insights", energy_insights: options(), name: "Insights" });
    await e.updateComplete;
    const insightForm = [...e.shadowRoot!.querySelectorAll<Form>("ha-form")].find(form => form.schema.some(field => field.name === "energy_insights"))!;
    const configured = { ...options(), consumers: [...options().consumers, { id: "other", name: "Other", energyField: "other" }] };
    insightForm.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { ...insightForm.data, energy_insights: configured } } }));
    await e.updateComplete;
    expect(saved.at(-1)?.energy_insights).toEqual(configured);
  });
  it("localizes nested native labels but never changes configured values", () => {
    const schema = localizeEditorSchema({ ...hass(), language: "nl" }, [{ name: "energy_plan", selector: { object: { fields: PLAN_FIELDS } } }]);
    const fields = (schema[0].selector!.object as { fields: NativeFields }).fields;
    expect(fields.description.label).toBe("Beschrijving");
    expect(fields.overview.default).toBe("Plan");
  });
  it("uses HA number, currency and time preferences independently of the UI language", () => {
    const h = { ...hass(), locale: { number_format: "decimal_comma", time_format: "24", language: "en" } };
    expect(energyNumber(h, 1234.5)).toBe("1.234,5");
    expect(energyTime(h, now)).toBe("12:00");
    expect(energyNumber({ ...h, locale: { number_format: "none" } }, 1234.5)).toBe("1234.5");
  });
  it("rejects malformed configuration and accepts ISO price units", () => {
    expect(() => validateInsights({ type: "custom:mushroom-addition-energy-insights", energy_insights: { ...options(), consumers: [...options().consumers, ...options().consumers] } })).toThrow("duplicate");
    expect(() => validateInsights({ type: "custom:mushroom-addition-energy-insights", energy_insights: { ...options(), maxAgeMinutes: 0 } })).toThrow("maxAge");
    const config = planConfig(); config.energy_plan!.rows[0].unit = "USD/kWh";
    expect(validatePlan(config).energy_plan!.rows[0].unit).toBe("USD/kWh");
    config.energy_plan!.rows[0].high = -1;
    expect(() => validatePlan(config)).toThrow("threshold");
  });
});

describe("measured accounting and supplied purchase plans", () => {
  it("reconciles home separately from battery input and calculates weighted interval costs", () => {
    const actual = readActuals(hass(), options(), now).value!;
    expect(actual.imported).toBe(7); expect(actual.exported).toBe(2);
    expect(actual.importCost).toBeCloseTo(1.5); expect(actual.exportCredit).toBeCloseTo(.1);
    expect(actual.importCost / actual.imported).toBeCloseTo(1.5 / 7);
    expect(actual.home).toBe(10); expect(actual.batteryCharge).toBe(2);
    expect(actual.remainder).toBe(6); expect(actual.consumers[0].baseline).toBe(3);
    expect(actual.buckets).toEqual([{ rate: .1, quantity: 3, cost: .3 }, { rate: .3, quantity: 4, cost: 1.2 }].map(bucket => expect.objectContaining({ rate: bucket.rate, quantity: bucket.quantity, cost: expect.closeTo(bucket.cost) })));
    const plan = readPurchasePlan(hass(), options(), now).value!;
    expect(plan.quantity).toBe(7); expect(plan.cost).toBeCloseTo(.8);
    expect(plan.blocks[0]).toMatchObject({ home: 1, ev: 2, battery: 3, target: 57 });
    expect(plan.blocks[0].battery * plan.efficiency).toBeCloseTo(2.82);
    expect(plan.consumers[0]).toMatchObject({ energy: 7.8, strategy: "Supplied example strategy" });
  });
  it.each(["gap", "overlap", "missing-rate", "negative-energy", "wrong-baseline", "overcount", "imbalance"])("rejects %s instead of calculating misleading actuals", kind => {
    const h = hass(), root = actualRoot(h);
    if (kind === "gap") root.intervals[1].start++;
    if (kind === "overlap") root.intervals[1].start--;
    if (kind === "missing-rate") delete root.intervals[0].rate;
    if (kind === "negative-energy") root.intervals[0].import_kwh = -1;
    if (kind === "wrong-baseline") root.baseline_end--;
    if (kind === "overcount") root.heat = 11;
    if (kind === "imbalance") root.home_kwh = 15;
    expect(readActuals(h, options(), now).error).toContain("Invalid");
  });
  it("supports alternate snapshot and interval field mappings", () => {
    const h = hass(), root = actualRoot(h);
    root.intervals[0].unit_price = root.intervals[0].rate;
    root.intervals[1].unit_price = root.intervals[1].rate;
    delete root.intervals[0].rate; delete root.intervals[1].rate;
    const mapped = { ...options(), actualSource: { ...options().actualSource, fields: { interval_rate: "unit_price" } } };
    expect(readActuals(h, mapped, now).value?.importCost).toBeCloseTo(1.5);
  });
  it("handles negative prices, zero import and zero home without NaN totals", () => {
    const h = hass(), root = actualRoot(h);
    root.intervals[0].rate = -.1;
    expect(readActuals(h, options(), now).value?.importCost).toBeCloseTo(.9);
    root.home_kwh = 0; root.heat = 0; root.solar_kwh = 3;
    root.intervals.forEach(item => { item.import_kwh = 0; item.export_kwh = 1; });
    expect(readActuals(h, options(), now).value?.importCost).toBe(0);
  });
  it("does not substitute synthetic fixtures on unconfigured, stale, unavailable or invalid sources", () => {
    expect(readActuals(hass(), insightsDefaults(), now).error).toBe("Source missing");
    expect(readActuals(hass(), options(), now + 7200000).error).toBe("Stale data source");
    const h = hass(); h.states["sensor.example_energy"].state = "unavailable";
    expect(readPurchasePlan(h, options(), now).error).toBe("Source missing");
    h.states["sensor.example_energy"].state = "ready";
    planRoot(h).charge_efficiency = 2;
    expect(readPurchasePlan(h, options(), now).error).toContain("charge_efficiency");
    planRoot(h).charge_efficiency = .94; planRoot(h).blocks[1].start = now;
    expect(readPurchasePlan(h, options(), now).error).toContain("allocation");
  });
  it.each(["short-horizon", "future-snapshot", "outside-horizon", "zero-block", "missing-efficiency"])("rejects a plan with %s", kind => {
    const h = hass(), root = planRoot(h);
    if (kind === "short-horizon") root.end--;
    if (kind === "future-snapshot") root.generated_at += 120000;
    if (kind === "outside-horizon") root.blocks[0].end = root.end + 1;
    if (kind === "zero-block") Object.assign(root.blocks[0], { home_kwh: 0, ev_kwh: 0, battery_kwh: 0 });
    if (kind === "missing-efficiency") root.charge_efficiency = Number.NaN;
    expect(readPurchasePlan(h, options(), now).error).toBeTruthy();
  });
  it("accepts an explicitly empty purchase plan and leaves optional forecasts unconfigured", () => {
    const h = hass(); planRoot(h).blocks = [];
    const opt = options(); opt.consumers[0].forecastField = undefined; opt.consumers[0].strategyField = undefined;
    const data = readPurchasePlan(h, opt, now).value!;
    expect(data.quantity).toBe(0); expect(data.cost).toBe(0);
    expect(data.consumers[0].energy).toBeUndefined(); expect(data.consumers[0].strategy).toBeUndefined();
  });
  it("requires explicit currency and rejects accidental currency conversion", () => {
    const h = hass(); h.config = { currency: "USD" };
    expect(readActuals(h, options(), now).error).toContain("currency mismatch");
    h.config = {};
    expect(readActuals(h, options(), now).error).toBe("Currency not configured");
  });
  it("reads only fresh power sensors with known W/kW units", () => {
    const h = hass();
    expect(livePower(h, "sensor.example_power", now)).toBe(120);
    expect(livePower(h, "sensor.example_power", now + 7200000)).toBeUndefined();
    h.states["sensor.example_power"].attributes.unit_of_measurement = "kWh";
    expect(livePower(h, "sensor.example_power", now)).toBeUndefined();
  });
});

describe("energy rendering and HA lifecycle", () => {
  it.each(["energy-plan", "energy-insights", "energy-log"])("uses shared presentation, actions and shadow on %s in both data and error states", async tag => {
    clock();
    const h = hass();
    h.states["sensor.log"] = { entity_id: "sensor.log", state: "ready", attributes: {
      entries: [{ timestamp: now, category: "planning", title: "Source title" }],
    } };
    const base = tag === "energy-plan" ? planConfig()
      : tag === "energy-insights" ? { type: "custom:mushroom-addition-energy-insights", energy_insights: options() }
      : { ...energyLogStub(), sources: [{ ...energyLogStub().sources[0], entity: "sensor.log" }] };
    const card = document.createElement(`mushroom-addition-${tag}`) as EnergyPlanCard | EnergyInsightsCard | MushroomEnergyLogCard;
    card.hass = h;
    const config = {
      ...base, entity: "sensor.example_energy", name: "Custom heading", secondary: "Custom secondary",
      icon: "mdi:home", primary_info: "name" as const, card_shadow: true,
      tap_action: { action: "more-info" as const },
    };
    card.setConfig(config); document.body.append(card); await card.updateComplete;
    expect(card.shadowRoot!.querySelectorAll(".shared-presentation")).toHaveLength(1);
    expect(card.shadowRoot!.querySelector(".shared-presentation")?.textContent).toContain("Custom heading");
    expect(card.shadowRoot!.querySelector(".shared-presentation")?.textContent).toContain("Custom secondary");
    expect(card.shadowRoot!.querySelector("ha-card")?.classList.contains("card-shadow")).toBe(true);
    const actions: Array<{ config: AdditionConfig; action: string }> = [];
    card.addEventListener("hass-action", event => actions.push((event as CustomEvent<{ config: AdditionConfig; action: string }>).detail));
    card.shadowRoot!.querySelector<HTMLElement>(".energy-heading")!.click();
    vi.advanceTimersByTime(300);
    expect(actions).toEqual([expect.objectContaining({
      action: "tap", config: expect.objectContaining({ entity: "sensor.example_energy", tap_action: { action: "more-info" } }),
    })]);
    card.hass = { ...h, states: {} }; await card.updateComplete;
    if (tag === "energy-plan") {
      card.setConfig({ ...config, energy_plan: { ...planDefaults(), start: "source" } });
      await card.updateComplete;
    }
    expect(card.shadowRoot!.querySelector("[role=alert]")).not.toBeNull();
    expect(card.shadowRoot!.querySelector("ha-card")?.classList.contains("card-shadow")).toBe(true);
    card.setConfig({ ...config, card_shadow: false, primary_info: "none", secondary_info: "none", icon_type: "none" });
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector("ha-card")?.classList.contains("card-shadow")).toBe(false);
    expect(card.shadowRoot!.querySelector(".shared-presentation")?.textContent ?? "").not.toContain("Custom heading");
  });
  it("rejects invalid Plan configuration through HA's standard configuration-error path", () => {
    const card = new EnergyPlanCard();
    expect(() => card.setConfig({ type: "custom:mushroom-addition-energy-plan", visibleHours: 0 })).toThrow("visibleHours");
  });
  it("keeps dense timeline labels readable without dropping the configured grid ticks", async () => {
    clock();
    const config = planConfig();
    config.visibleHours = 168;
    config.energy_plan!.axisStep = 1;
    const card = new EnergyPlanCard(); card.hass = hass(); card.setConfig(config);
    document.body.append(card); await card.updateComplete;
    expect(card.shadowRoot!.querySelectorAll(".grid")).toHaveLength(169);
    expect(card.shadowRoot!.querySelectorAll(".axis").length).toBeLessThanOrEqual(14);
    expect(card.shadowRoot!.querySelector(".axis")?.getAttribute("text-anchor")).toBe("start");
    expect([...card.shadowRoot!.querySelectorAll(".axis")].at(-1)?.getAttribute("text-anchor")).toBe("end");
  });
  it("reads JSON timeline arrays, rejects corrupt rows and never bridges missing intervals", () => {
    clock();
    const h = hass(), c = planConfig(), row = { ...c.energy_plan!.rows[0], adapter: "state" as const, path: "" };
    h.states["sensor.example_energy"].state = JSON.stringify(h.states["sensor.example_energy"].attributes.timeline);
    expect(rowData(h, row, c.entity, now, now + 3600000).intervals).toHaveLength(1);
    h.states["sensor.example_energy"].state = "not-json";
    expect(rowData(h, row, c.entity, now, now + 3600000).error).toContain("Invalid");
    h.states["sensor.example_energy"].state = JSON.stringify([{ start: now, end: now + 2, price: 1 }, { start: now + 1, end: now + 3, price: 2 }]);
    expect(rowData(h, row, c.entity, now, now + 3600000).error).toContain("Invalid");
    h.states["sensor.example_energy"].state = JSON.stringify([{ start: now, end: now + 2, price: 1 }, { start: now + 3, end: now + 4, price: 2 }]);
    expect(rowData(h, row, c.entity, now, now + 3600000).intervals).toHaveLength(2);
  });
  it("renders escaped timeline labels, gaps, metrics and configured row order", async () => {
    clock();
    const c = planConfig(); c.energy_plan!.rows[0].name = "<img onerror=alert(1)>";
    c.energy_plan!.metrics = [{ ...newMetric(), entity: "sensor.example_power" }];
    const card = new EnergyPlanCard(); card.hass = hass(); card.setConfig(c); document.body.append(card); await card.updateComplete;
    expect(card.shadowRoot!.querySelectorAll(".row-label")).toHaveLength(7);
    expect(card.shadowRoot!.querySelector("img")).toBeNull();
    expect(card.shadowRoot!.querySelector(".metric-value")?.textContent).toContain("0.12");
    const slider = card.shadowRoot!.querySelector<HTMLInputElement>("input")!;
    slider.value = "500"; slider.dispatchEvent(new Event("input")); await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".details")?.textContent).toContain("No published intervals");
    const intervals = [{ start: now, end: now + 1, value: 1 }, { start: now + 1, end: now + 2, value: 2 }];
    expect(displayIntervals(planDefaults().rows[2], intervals)[0]).toMatchObject({ minimum: 1, maximum: 2 });
    expect(intervals[0].end).toBe(now + 1);
    expect(rowData(hass(), c.energy_plan!.rows[0], c.entity, now, now + 1).intervals).toHaveLength(1);
    expect(metricValue(hass(), { ...newMetric(), entity: "sensor.example_power" })).toBe(.12);
  });
  it("preserves tabs, active filtering, sorting, purchase selection and escaped rationale", async () => {
    clock();
    const h = hass(); planRoot(h).blocks[0].reason = "<script>alert(1)</script>";
    const card = new EnergyInsightsCard(); card.hass = h;
    card.setConfig({ ...EnergyInsightsCard.getStubConfig(), energy_insights: options() });
    document.body.append(card); await card.updateComplete;
    expect(card.shadowRoot!.querySelectorAll(".kpi")).toHaveLength(8);
    expect(card.shadowRoot!.querySelector(".ring")).not.toBeNull();
    expect(card.shadowRoot!.querySelectorAll(".consumer-row")).toHaveLength(1);
    expect(card.shadowRoot!.querySelector("script")).toBeNull();
    const tab = card.shadowRoot!.querySelector<HTMLButtonElement>("#actual-tab")!;
    tab.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true })); await card.updateComplete;
    expect(card.shadowRoot!.querySelector("#plan-tab")?.getAttribute("aria-selected")).toBe("true");
    expect(card.shadowRoot!.querySelector("#actual-panel")?.hasAttribute("hidden")).toBe(true);
    card.shadowRoot!.querySelectorAll<HTMLButtonElement>(".block-button")[1].click(); await card.updateComplete;
    expect(card.shadowRoot!.querySelector("#block-detail")?.textContent).toContain("Home supply");
    const sort = card.shadowRoot!.querySelector<HTMLSelectElement>("#sort")!;
    sort.value = "power"; sort.dispatchEvent(new Event("change")); await card.updateComplete;
    h.states["sensor.example_power"] = { ...h.states["sensor.example_power"], state: "0.01" };
    card.hass = { ...h }; await card.updateComplete;
    card.shadowRoot!.querySelector<HTMLButtonElement>(".controls button")!.click(); await card.updateComplete;
    expect(card.shadowRoot!.querySelectorAll(".consumer-row")).toHaveLength(0);
    expect(h.callService).not.toHaveBeenCalled();
  });
  it("reacts to relevant HA updates, expires data on timer and cleans up both refresh timers", async () => {
    clock();
    const clear = vi.spyOn(window, "clearInterval"), h = hass();
    const insight = new EnergyInsightsCard(); insight.hass = h;
    insight.setConfig({ ...EnergyInsightsCard.getStubConfig(), energy_insights: options() });
    const plan = new EnergyPlanCard(); plan.hass = h; plan.setConfig(planConfig());
    document.body.append(insight, plan); await Promise.all([insight.updateComplete, plan.updateComplete]);
    insight.hass = { ...h, language: "nl", themes: { darkMode: true } }; await insight.updateComplete;
    expect(insight.hasAttribute("dark")).toBe(true);
    vi.advanceTimersByTime(61 * 60000); await Promise.all([insight.updateComplete, plan.updateComplete]);
    expect(insight.shadowRoot!.querySelector("[role=alert]")).not.toBeNull();
    expect(plan.shadowRoot!.textContent).toContain("Stale data source");
    insight.remove(); plan.remove();
    expect(clear).toHaveBeenCalledTimes(2);
  });
  it("does not break the valid plan when actuals fail, and uses a strict active threshold", async () => {
    clock();
    const h = hass(), opt = options();
    const card = new EnergyInsightsCard(); card.hass = h;
    card.setConfig({ ...EnergyInsightsCard.getStubConfig(), energy_insights: { ...opt, activeOnly: true } });
    document.body.append(card); await card.updateComplete;
    for (const [watts, count] of [[50, 0], [51, 1]] as const) {
      card.hass = { ...h, states: { ...h.states,
        "sensor.example_power": { ...h.states["sensor.example_power"], state: String(watts), attributes: { unit_of_measurement: "W" } },
      } }; await card.updateComplete;
      expect(card.shadowRoot!.querySelectorAll(".consumer-row")).toHaveLength(count);
    }
    const broken = hass(); delete actualRoot(broken).intervals[0].rate;
    card.hass = broken; await card.updateComplete;
    expect(card.shadowRoot!.querySelector("#actual-panel [role=alert]")).not.toBeNull();
    expect(card.shadowRoot!.querySelectorAll(".block-button")).toHaveLength(2);
  });
});
