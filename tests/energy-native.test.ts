import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { CATALOG } from "../src/catalog";
import { createStubConfig } from "../src/stub";
import { EnergyPlanCard } from "../src/energy-plan/card";
import { planDefaults, newMetric, validatePlan, type EnergyPlanConfig } from "../src/energy-plan/config";
import { displayIntervals, displayPowerScale, displayPriceIntervals, metricValue, rowData } from "../src/energy-plan/data";
import { EnergyInsightsCard } from "../src/energy-insights/card";
import { MushroomEnergyLogCard } from "../src/energy-cards/energy-log";
import { energyLogStub } from "../src/energy-cards/energy-log-config";
import { editorSchemaFor, type EditorField } from "../src/editor-schema";
import { insightsDefaults, validateInsights, type EnergyInsightsOptions } from "../src/energy-insights/config";
import {
  INSIGHTS_HISTORY_MAX_ENTITIES, INSIGHTS_HISTORY_MAX_STATES_PER_ENTITY,
  INSIGHTS_HISTORY_LOOKBACK_MS, INSIGHTS_HISTORY_MAX_STATES, localDayStart,
  INSIGHTS_APPROXIMATION_MESSAGES,
  INSIGHTS_HISTORY_REFRESH_MS, livePower, readActuals,
  readMeteredActuals, readPurchasePlan,
} from "../src/energy-insights/data";
import { energyNumber, energyTime } from "../src/energy-format";
import { sharedStyles } from "../src/styles";
import { PLAN_FIELDS, PLAN_ROW_FIELDS, PLAN_METRIC_FIELDS, PLAN_PERIOD_FIELDS, INSIGHTS_FIELDS, INSIGHTS_CONSUMER_FIELDS, type NativeFields } from "../src/energy-editor-schema";
import { localizeEditorSchema } from "../src/localized-schema";
import { editorHelper, localizeText, SUPPORTED_LOCALES, translationCatalogs } from "../src/localize";
import { energyInsightsAccounting } from "../src/translations/energy-insights-accounting";
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
function meteredOptions(): EnergyInsightsOptions {
  const configured = insightsDefaults();
  configured.metered = {
    solar: { entity: "sensor.solar_meter" },
    gridImport: { entity: "sensor.import_meter" },
    gridExport: { entity: "sensor.export_meter" },
    batteryCharge: { entity: "sensor.battery_charge_meter" },
    batteryDischarge: { entity: "sensor.battery_discharge_meter" },
    importRate: { entity: "sensor.import_rate" },
    exportRate: { entity: "sensor.export_rate" },
  };
  return configured;
}
function meterHistory(): unknown[][] {
  const options = meteredOptions(), timeStart = Date.parse("2031-04-12T00:00:00Z");
  return Object.values(options.metered).map((source, index) => {
    const entityId = source.entity!;
    const unit = index < 5 ? "kWh" : index === 5 || index === 6 ? "EUR/kWh" : "";
    const readings = index === 0 ? [10, 12] : index === 1 ? [20, 24] : index === 2 ? [5, 6]
      : index === 3 ? [1, 2] : index === 4 ? [1, 1.5] : index === 5 ? [.2, .2] : [.1, .1];
    return readings.map((value, rowIndex) => ({
      entity_id: entityId, state: String(value),
      last_updated: new Date(rowIndex ? now : timeStart).toISOString(),
      attributes: { unit_of_measurement: unit },
    }));
  });
}
function meteredHass(): HomeAssistant {
  const h = hass();
  const history = meterHistory();
  for (const [index, source] of Object.values(meteredOptions().metered).entries()) {
    h.states[source.entity!] = {
      entity_id: source.entity!, state: (history[index].at(-1) as { state: string }).state, last_updated: new Date(now).toISOString(),
      attributes: { unit_of_measurement: index < 5 ? "kWh" : "EUR/kWh" },
    };
  }
  return h;
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
    expect(Object.keys(INSIGHTS_FIELDS).sort()).toEqual([...Object.keys(insightsDefaults()), "currency", "fixedExportRate", "homeEntity", "solarEntity", "gridEntity", "batteryEntity", "selfPoweredEntity"].sort());
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
  it("keeps energy totals when tariffs cannot be priced and never reports a partial cost as complete", () => {
    const h = meteredHass(), history = meterHistory();
    history[5].splice(1, 0, { entity_id: "sensor.import_rate", state: "unavailable", last_updated: "2031-04-12T06:00:00Z", attributes: {} });
    const data = readMeteredActuals(h, meteredOptions(), history, now).value!;
    expect(data.imported).toBe(4);
    expect(data.home).toBe(4.5);
    expect(data.importCost).toBeUndefined();
    expect(data.buckets).toEqual([]);
    expect(data.exportCredit).toBeCloseTo(.1);
    expect(data.warnings?.join()).toContain("invalid value");
    expect(data.intervals.find(item => item.imported)?.rate).toBeUndefined();
  });
  it("isolates missing meters and aligns independent changes using the captured current states", () => {
    const h = meteredHass(), opt = meteredOptions();
    delete h.states["sensor.solar_meter"];
    const partial = readMeteredActuals(h, opt, meterHistory(), now).value!;
    expect(partial.imported).toBe(4);
    expect(partial.solar).toBeUndefined();
    expect(partial.home).toBeUndefined();
    expect(partial.coverage?.find(item => item.id === "solar")?.error).toContain("missing");
    const history = meterHistory();
    (history[0][1] as { last_updated: string }).last_updated = "2031-04-12T11:45:00Z";
    const staggered = readMeteredActuals(meteredHass(), opt, history, now).value!;
    expect(staggered.solar).toBe(2);
    expect(staggered.home).toBe(4.5);
    expect(staggered.coverage?.filter(item => item.end).every(item => item.end === now)).toBe(true);
  });
  it("supports explicitly absent equipment and fixed export credit, including negative and zero rates", () => {
    const opt = meteredOptions();
    opt.metered.solar = { absent: true };
    opt.metered.batteryCharge = { absent: true };
    opt.metered.batteryDischarge = { absent: true };
    opt.metered.exportRate = {};
    opt.fixedExportRate = -.05;
    const data = readMeteredActuals(meteredHass(), opt, meterHistory(), now).value!;
    expect(data.solar).toBe(0);
    expect(data.home).toBe(3);
    expect(data.exportCredit).toBeCloseTo(-.05);
    expect(data.coverage?.find(item => item.id === "solar")?.absent).toBe(true);
    opt.fixedExportRate = 0;
    expect(readMeteredActuals(meteredHass(), opt, meterHistory(), now).value?.exportCredit).toBe(0);
    expect(() => validateInsights({ type: "custom:mushroom-addition-energy-insights", energy_insights: {
      ...opt, metered: { ...opt.metered, gridImport: { absent: true } },
    } })).toThrow("Not installed");
  });
  it("reads consumer meters within the same batch and validates their coverage and household allocation", () => {
    const h = meteredHass(), opt = meteredOptions();
    opt.consumers = [{ id: "device", name: "Device", energySource: { entity: "sensor.device" } }];
    h.states["sensor.device"] = { ...h.states["sensor.solar_meter"], entity_id: "sensor.device", state: "102" };
    const history = meterHistory();
    history.push([
      { entity_id: "sensor.device", state: "100", last_updated: "2031-04-12T00:00:00Z" },
      { entity_id: "sensor.device", state: "102", last_updated: new Date(now).toISOString() },
    ]);
    const data = readMeteredActuals(h, opt, history, now).value!;
    expect(data.consumers[0].energy).toBe(2);
    expect(data.remainder).toBe(2.5);
    (history[7][1] as { state: string }).state = "120";
    h.states["sensor.device"].state = "120";
    const overcount = readMeteredActuals(h, opt, history, now).value!;
    expect(overcount.consumers[0].energy).toBeUndefined();
    expect(overcount.warnings?.join()).toContain("exceeds household");
  });
  it("supports compact HA history rows without mixing missing entities by array position", () => {
    const opt = meteredOptions(), history = meterHistory();
    const compact = Object.fromEntries(Object.values(opt.metered).map((source, index) => [
      source.entity, history[index].map(raw => {
        const row = raw as { state: string; last_updated: string; attributes: object };
        return { s: row.state, lu: Date.parse(row.last_updated) / 1000, a: row.attributes };
      }),
    ]));
    expect(readMeteredActuals(meteredHass(), opt, compact, now).value?.imported).toBe(4);
    const missing = readMeteredActuals(meteredHass(), opt, history.slice(1), now).value!;
    expect(missing.solar).toBeUndefined();
    expect(missing.imported).toBe(4);
  });
  it("allows a quantity-and-rate plan without undisplayed battery and allocation mappings", () => {
    const h = hass(), opt = options();
    opt.showPlanBattery = opt.showPlanAllocations = opt.showPlanEfficiency = opt.showForecasts = false;
    planRoot(h).blocks = [{ start: now, end: now + 3600000, quantity_kwh: 3, rate: .2 }];
    const root = h.states["sensor.example_energy"].attributes.plan as Record<string, unknown>;
    delete root.battery_min; delete root.battery_reserve; delete root.charge_efficiency;
    const plan = readPurchasePlan(h, opt, now).value!;
    expect(plan.quantity).toBe(3);
    expect(plan.cost).toBeCloseTo(.6);
    expect(plan.batteryMin).toBeUndefined();
    expect(plan.blocks[0].battery).toBeUndefined();
    opt.showPlanEfficiency = true;
    expect(readPurchasePlan(h, opt, now).error).toContain("charge_efficiency");
  });
  it("reconciles home separately from battery input and calculates weighted interval costs", () => {
    const actual = readActuals(hass(), options(), now).value!;
    expect(actual.imported).toBe(7); expect(actual.exported).toBe(2);
    expect(actual.importCost).toBeCloseTo(1.5); expect(actual.exportCredit).toBeCloseTo(.1);
    expect(actual.importCost! / actual.imported!).toBeCloseTo(1.5 / 7);
    expect(actual.home).toBe(10); expect(actual.batteryCharge).toBe(2);
    expect(actual.remainder).toBe(6); expect(actual.consumers[0].baseline).toBe(3);
    expect(actual.buckets).toEqual([{ rate: .1, quantity: 3, cost: .3 }, { rate: .3, quantity: 4, cost: 1.2 }].map(bucket => expect.objectContaining({ rate: bucket.rate, quantity: bucket.quantity, cost: expect.closeTo(bucket.cost) })));
    const plan = readPurchasePlan(hass(), options(), now).value!;
    expect(plan.quantity).toBe(7); expect(plan.cost).toBeCloseTo(.8);
    expect(plan.blocks[0]).toMatchObject({ home: 1, ev: 2, battery: 3, target: 57 });
    expect(plan.blocks[0].battery! * plan.efficiency!).toBeCloseTo(2.82);
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
  it("calculates measured totals from cumulative meters and timestamped prices", () => {
    const h = meteredHass(), configured = meteredOptions();
    const actual = readMeteredActuals(h, configured, meterHistory(), now).value!;
    expect(actual.start).toBe(Date.parse("2031-04-12T00:00:00Z"));
    expect(actual.home).toBeCloseTo(4.5);
    expect(actual.solar).toBe(2); expect(actual.imported).toBe(4); expect(actual.exported).toBe(1);
    expect(actual.batteryCharge).toBe(1); expect(actual.batteryDischarge).toBe(.5);
    expect(actual.importCost).toBeCloseTo(.8); expect(actual.exportCredit).toBeCloseTo(.1);
    expect(actual.exportRateConfigured).toBe(true);
    expect(actual.buckets).toEqual([{ rate: .2, quantity: 4, cost: .8 }]);
    configured.metered.exportRate = {};
    const withoutExportRate = readMeteredActuals(h, configured, meterHistory(), now).value!;
    expect(withoutExportRate.exportRateConfigured).toBe(false);
    expect(withoutExportRate.exportCredit).toBeUndefined();
    configured.metered.solar.field = "total";
    h.states["sensor.solar_meter"].attributes.total = "12";
    const mappedHistory = meterHistory();
    for (const row of mappedHistory[0]) {
      const state = row as { state: string; attributes: Record<string, unknown> };
      state.attributes.total = state.state;
    }
    expect(readMeteredActuals(h, configured, mappedHistory, now).value?.solar).toBe(2);
    h.config!.time_zone = "Europe/Amsterdam";
    const localHistory = meterHistory();
    for (const group of localHistory) {
      const first = group[0] as { last_updated: string };
      first.last_updated = "2031-04-11T22:00:00Z";
    }
    expect(readMeteredActuals(h, meteredOptions(), localHistory, now).value?.start)
      .toBe(Date.parse("2031-04-11T22:00:00Z"));
  });
  it("requires configured healthy meters, supported units, midnight coverage and bounded history", () => {
    const h = meteredHass(), configured = meteredOptions(), history = meterHistory();
    const warnings = (opt: EnergyInsightsOptions, rows: unknown) =>
      readMeteredActuals(h, opt, rows, now).value?.warnings?.join(" ");
    expect(warnings(insightsDefaults(), history)).toContain("solar");
    configured.metered.gridExport.entity = "sensor.missing_export_meter";
    expect(warnings(configured, history)).toContain("missing or unavailable");
    configured.metered.gridExport.entity = "sensor.export_meter";
    h.states["sensor.solar_meter"].attributes.unit_of_measurement = "W";
    expect(warnings(configured, history)).toContain("cumulative Wh, kWh, or MWh");
    h.states["sensor.solar_meter"].attributes.unit_of_measurement = "kWh";
    expect(warnings(configured, [[], ...history.slice(1)])).toContain("no cumulative reading at the start");
    const crossedMidnight = meterHistory();
    crossedMidnight[0][0] = { ...(crossedMidnight[0][0] as object), last_updated: "2031-04-11T23:59:00Z" };
    expect(readMeteredActuals(h, configured, crossedMidnight, now).value?.approximations?.join()).toContain(INSIGHTS_APPROXIMATION_MESSAGES.midnight);
    const resetMeter = meterHistory();
    (resetMeter[0][1] as { state: string }).state = "9";
    h.states["sensor.solar_meter"].state = "9";
    expect(warnings(configured, resetMeter)).toContain("meter reset or decreased");
    h.states["sensor.solar_meter"].state = "12";
    const changedTariff = meterHistory();
    changedTariff[5].splice(1, 0, {
      entity_id: "sensor.import_rate", state: ".3", last_updated: "2031-04-12T06:00:00Z",
      attributes: { unit_of_measurement: "EUR/kWh" },
    });
    expect(readMeteredActuals(h, configured, changedTariff, now).value?.approximations?.join()).toContain(INSIGHTS_APPROXIMATION_MESSAGES.tariffs);
    const oversizedHistory = meterHistory();
    oversizedHistory[0] = Array.from({ length: INSIGHTS_HISTORY_MAX_STATES_PER_ENTITY + 1 }, () => ({
      entity_id: "sensor.solar_meter", state: "10", last_updated: "2031-04-12T00:00:00Z",
      attributes: { unit_of_measurement: "kWh" },
    }));
    expect(warnings(configured, oversizedHistory)).toContain(`${INSIGHTS_HISTORY_MAX_STATES_PER_ENTITY}-state limit`);
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
    expect(readMeteredActuals(meteredHass(), insightsDefaults(), null).error).toContain("Source missing");
    expect(readActuals(hass(), insightsDefaults(), now).error).toContain("Measured snapshot source");
    expect(readActuals(hass(), options(), now + 7200000).error).toBe("Stale data source");
    const h = hass(); h.states["sensor.example_energy"].state = "unavailable";
    expect(readPurchasePlan(h, options(), now).error).toContain("Plan source");
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

describe("real-world metered Insights accounting", () => {
  const row = (entity_id: string, state: number | string, time: number) => ({
    entity_id, state: String(state), last_updated: new Date(time).toISOString(), attributes: {},
  });
  it("uses the last recorded midnight state and labels physical timing uncertainty", () => {
    const h = meteredHass(), history = meterHistory(), opt = meteredOptions();
    history[1] = [
      row("sensor.import_meter", 20, start - 60000),
      row("sensor.import_meter", 22, start + 60000),
      row("sensor.import_meter", 24, now),
    ];
    const data = readMeteredActuals(h, opt, history, now).value!;
    expect(data.imported).toBe(4);
    expect(data.home).toBe(4.5);
    expect(data.importCost).toBeCloseTo(.8);
    expect(data.approximations).toContain(`gridImport: ${INSIGHTS_APPROXIMATION_MESSAGES.midnight}`);
    expect(data.approximations).toContain(`importRate: ${INSIGHTS_APPROXIMATION_MESSAGES.tariffs}`);
    expect(data.intervals.filter(item => item.imported).map(item => item.approximate)).toEqual([true, false]);
    expect(data.warnings).toEqual([]);
  });
  it("accounts for an idle carry-in's midday first change without inventing a pre-midnight sampling timestamp", () => {
    const h = meteredHass(), history = meterHistory();
    history[1][0] = row("sensor.import_meter", 20, start - INSIGHTS_HISTORY_LOOKBACK_MS);
    const data = readMeteredActuals(h, meteredOptions(), history, now).value!;
    expect(data.imported).toBe(4);
    expect(data.importCost).toBeCloseTo(.8);
    expect(data.home).toBe(4.5);
    expect(data.approximations?.join()).toContain(INSIGHTS_APPROXIMATION_MESSAGES.midnight);
    expect(data.approximations?.join()).not.toContain("midnight energy is linearly interpolated");
    expect(data.warnings).toEqual([]);
    history[1][0] = row("sensor.import_meter", 20, start - 20 * 3600000);
    const longerLookback = readMeteredActuals(h, meteredOptions(), history, now).value!;
    expect(longerLookback.imported).toBe(data.imported);
    expect(longerLookback.importCost).toBe(data.importCost);
  });
  it("accepts unchanged cumulative and price states with old change timestamps at one captured endpoint", () => {
    const h = meteredHass(), history = meterHistory();
    history.forEach((group, index) => {
      const current = h.states[Object.values(meteredOptions().metered)[index].entity!];
      current.last_updated = new Date(start - 3 * 86400000).toISOString();
      group.splice(0, group.length, row(current.entity_id, current.state, start - INSIGHTS_HISTORY_LOOKBACK_MS));
    });
    const data = readMeteredActuals(h, meteredOptions(), history, now).value!;
    expect(data.home).toBe(0);
    expect(data.imported).toBe(0);
    expect(data.exported).toBe(0);
    expect(data.importCost).toBe(0);
    expect(data.end).toBe(now);
    expect(data.coverage?.every(item => item.end === now)).toBe(true);
    expect(data.warnings).toEqual([]);
    expect(data.approximations?.join()).toContain(INSIGHTS_APPROXIMATION_MESSAGES.endpoint);
  });
  it("uses current cumulative values to bridge Recorder lag and independent final updates without extrapolating power", () => {
    const h = meteredHass(), history = meterHistory();
    for (let index = 0; index < 5; index++) {
      const current = h.states[Object.values(meteredOptions().metered)[index].entity!];
      current.last_updated = new Date(now - (index + 1) * 60000).toISOString();
      (history[index][1] as { last_updated: string }).last_updated = current.last_updated;
    }
    history[1][1] = row("sensor.import_meter", 22, now - 3600000);
    const data = readMeteredActuals(h, meteredOptions(), history, now).value!;
    expect(data.imported).toBe(4);
    expect(data.home).toBe(4.5);
    expect(data.importCost).toBeCloseTo(.8);
    expect(data.coverage?.every(item => item.end === now)).toBe(true);
    expect(data.approximations?.join()).toContain(INSIGHTS_APPROXIMATION_MESSAGES.endpoint);
  });
  it("allocates measured deltas by elapsed time across positive, negative and zero tariffs without losing energy", () => {
    const h = meteredHass(), history = meterHistory(), opt = meteredOptions();
    history[5] = [.2, -.1, 0, .4].map((rate, index) => row("sensor.import_rate", rate, start + index * 3 * 3600000));
    h.states["sensor.import_rate"].state = ".4";
    history[6] = [row("sensor.export_rate", .1, start), row("sensor.export_rate", -.1, start + 6 * 3600000)];
    h.states["sensor.export_rate"].state = "-.1";
    const data = readMeteredActuals(h, opt, history, now).value!;
    expect(data.imported).toBe(4);
    expect(data.importCost).toBeCloseTo(.5);
    expect(data.exportCredit).toBeCloseTo(0);
    expect(data.buckets).toHaveLength(4);
    expect(data.buckets.reduce((sum, item) => sum + item.quantity, 0)).toBe(4);
    expect(data.buckets.reduce((sum, item) => sum + item.cost, 0)).toBeCloseTo(data.importCost!);
    expect(data.intervals.filter(item => item.imported).every(item => item.approximate)).toBe(true);
    expect(data.approximations?.join()).toContain(INSIGHTS_APPROXIMATION_MESSAGES.tariffs);
  });
  it("does not mark aligned tariffs or redundant price observations as estimated allocations", () => {
    const h = meteredHass(), history = meterHistory();
    history[1].splice(1, 0, row("sensor.import_meter", 22, start + 6 * 3600000));
    history[5] = [row("sensor.import_rate", .2, start), row("sensor.import_rate", .2, start + 3600000),
      row("sensor.import_rate", .4, start + 6 * 3600000)];
    h.states["sensor.import_rate"].state = ".4";
    const data = readMeteredActuals(h, meteredOptions(), history, now).value!;
    expect(data.importCost).toBeCloseTo(1.2);
    expect(data.approximations).toEqual([]);
    expect(data.intervals.some(item => item.approximate)).toBe(false);
  });
  it.each(["missing-baseline", "unavailable-history", "current-unavailable", "current-invalid",
    "future-current", "missing-current-time", "reset-current", "conflict", "baseline-conflict", "unit-change"])("rejects uncertain energy: %s", kind => {
    const h = meteredHass(), history = meterHistory();
    const current = h.states["sensor.import_meter"];
    if (kind === "missing-baseline") history[1].shift();
    if (kind === "unavailable-history") history[1].splice(1, 0, row("sensor.import_meter", "unavailable", start + 3600000));
    if (kind === "current-unavailable") current.state = "unavailable";
    if (kind === "current-invalid") current.state = "not numeric";
    if (kind === "future-current") current.last_updated = new Date(now + 1).toISOString();
    if (kind === "missing-current-time") delete current.last_updated;
    if (kind === "reset-current") { history[1].pop(); current.state = "19"; }
    if (kind === "conflict") history[1].push(row("sensor.import_meter", 25, now));
    if (kind === "baseline-conflict") history[1].unshift(row("sensor.import_meter", 19, start));
    if (kind === "unit-change") history[1][0] = { ...row("sensor.import_meter", 20, start), attributes: { unit_of_measurement: "Wh" } };
    const data = readMeteredActuals(h, meteredOptions(), history, now).value!;
    expect(data.imported).toBeUndefined();
    expect(data.home).toBeUndefined();
    expect(data.importCost).toBeUndefined();
    expect(data.solar).toBe(2);
    expect(data.warnings?.length).toBeGreaterThan(0);
  });
  it("does not publish partial pricing when a price baseline is missing", () => {
    const h = meteredHass(), history = meterHistory();
    history[5].shift();
    const data = readMeteredActuals(h, meteredOptions(), history, now).value!;
    expect(data.imported).toBe(4);
    expect(data.home).toBe(4.5);
    expect(data.importCost).toBeUndefined();
    expect(data.buckets).toEqual([]);
    expect(data.warnings?.join()).toContain("no price reading");
  });
  it("does not let attribute mappings conceal unavailable historical states", () => {
    const h = meteredHass(), history = meterHistory(), opt = meteredOptions();
    opt.metered.gridImport.field = "total";
    h.states["sensor.import_meter"].attributes.total = 24;
    history[1] = [
      { ...row("sensor.import_meter", 20, start), attributes: { total: 20 } },
      { ...row("sensor.import_meter", "unavailable", start + 3600000), attributes: { total: 22 } },
      { ...row("sensor.import_meter", 24, now), attributes: { total: 24 } },
    ];
    const data = readMeteredActuals(h, opt, history, now).value!;
    expect(data.imported).toBeUndefined();
    expect(data.warnings?.join()).toContain("unknown or unavailable");
  });
  it("synchronizes compact Recorder microseconds and HA's millisecond ISO state timestamps", () => {
    const h = meteredHass(), history = meterHistory();
    const opt = meteredOptions(), snapshot = now + 1000;
    const compact = Object.fromEntries(Object.values(opt.metered).map((source, index) => {
      return [source.entity, history[index].map((raw, position) => {
        const row = raw as { state: string; last_updated: string; attributes: object };
        return { s: row.state, lu: (Date.parse(row.last_updated) + (position ? .8406 : 0)) / 1000, a: row.attributes };
      })];
    }));
    const data = readMeteredActuals(h, opt, compact, snapshot).value!;
    expect(data.imported).toBe(4);
    expect(data.home).toBe(4.5);
    expect(data.importCost).toBeCloseTo(.8);
    expect(data.warnings).toEqual([]);
    h.states["sensor.import_meter"].state = "25";
    expect(readMeteredActuals(h, opt, compact, snapshot).value?.imported).toBeUndefined();
  });
  it("uses newer Recorder observations when the frontend state subscription lags", () => {
    const h = meteredHass(), history = meterHistory(), opt = meteredOptions();
    const stateTime = now - 10000;
    h.states["sensor.import_meter"].state = "23";
    h.states["sensor.import_meter"].last_updated = new Date(stateTime).toISOString();
    history[1].splice(1, 0, row("sensor.import_meter", 23, stateTime + .5));
    h.states["sensor.import_rate"].last_updated = new Date(now - 3600000).toISOString();
    history[5] = [row("sensor.import_rate", .2, start), row("sensor.import_rate", .2, now - 3600000),
      row("sensor.import_rate", .3, now - 1800000)];
    const data = readMeteredActuals(h, opt, history, now + 1000).value!;
    expect(data.imported).toBe(4);
    expect(data.importCost).toBeGreaterThan(.8);
    expect(data.home).toBe(4.5);
    expect(data.warnings).toEqual([]);
    h.states["sensor.import_meter"].state = "22";
    expect(readMeteredActuals(h, opt, history, now + 1000).value?.imported).toBeUndefined();
  });
  it("rejects daily solar resets and unavailable midnight baselines without guessing zero production", () => {
    const h = meteredHass(), history = meterHistory();
    history[0] = [row("sensor.solar_meter", 100, start - 60000),
      row("sensor.solar_meter", 0, start + 60000), row("sensor.solar_meter", 12, now)];
    let data = readMeteredActuals(h, meteredOptions(), history, now).value!;
    expect(data.solar).toBeUndefined();
    expect(data.home).toBeUndefined();
    expect(data.warnings?.join()).toContain("reset or decreased");
    history[0][0] = row("sensor.solar_meter", "unavailable", start - INSIGHTS_HISTORY_LOOKBACK_MS);
    data = readMeteredActuals(h, meteredOptions(), history, now).value!;
    expect(data.solar).toBeUndefined();
    expect(data.imported).toBe(4);
    expect(data.warnings?.join()).toContain("unknown or unavailable");
  });
  it("keeps sub-micro-kWh increments rather than discarding each small delta", () => {
    const h = meteredHass(), history = meterHistory();
    history[1] = [20, 20.0000004, 20.0000008].map((value, index) =>
      row("sensor.import_meter", value, start + index * 6 * 3600000));
    h.states["sensor.import_meter"].state = "20.0000008";
    const data = readMeteredActuals(h, meteredOptions(), history, now).value!;
    expect(data.imported).toBeCloseTo(.0000008, 12);
    expect(data.importCost).toBeCloseTo(.00000016, 12);
  });
  it.each([["Wh", 1000], ["MWh", .001]] as const)("normalizes %s counters and cents tariffs before accounting", (unit, multiplier) => {
    const h = meteredHass(), history = meterHistory();
    h.states["sensor.import_meter"].state = String(24 * multiplier);
    h.states["sensor.import_meter"].attributes.unit_of_measurement = unit;
    history[1] = [row("sensor.import_meter", 20 * multiplier, start), row("sensor.import_meter", 24 * multiplier, now)];
    h.states["sensor.import_rate"].state = "20";
    h.states["sensor.import_rate"].attributes.unit_of_measurement = "ct/kWh";
    history[5] = [row("sensor.import_rate", 20, start), row("sensor.import_rate", 20, now)];
    const data = readMeteredActuals(h, meteredOptions(), history, now).value!;
    expect(data.imported).toBeCloseTo(4);
    expect(data.importCost).toBeCloseTo(.8);
    expect(data.home).toBeCloseTo(4.5);
  });
  it("accounts for over 15000 real-style P1 states without dropping deltas", () => {
    const h = meteredHass(), history = meterHistory(), count = 18000;
    history[1] = Array.from({ length: count + 1 }, (_, index) =>
      row("sensor.import_meter", 20 + 4 * index / count, start + (now - start) * index / count));
    const data = readMeteredActuals(h, meteredOptions(), history, now).value!;
    expect(data.imported).toBeCloseTo(4, 10);
    expect(data.importCost).toBeCloseTo(.8, 10);
    expect(data.home).toBeCloseTo(4.5, 10);
    expect(data.intervals.filter(item => item.imported)).toHaveLength(count);
    expect(data.warnings).toEqual([]);
  });
  it("rejects aggregate and malformed history before building unbounded interval lists", () => {
    const h = meteredHass(), opt = meteredOptions();
    const rows = Array.from({ length: 6 }, (_, index) => Array.from({
      length: Math.floor(INSIGHTS_HISTORY_MAX_STATES / 5),
    }, () => row(`sensor.meter_${index}`, 1, start)));
    expect(readMeteredActuals(h, opt, rows, now).error).toContain("total limit");
    const history = meterHistory();
    expect(readMeteredActuals(h, opt, [...history, history[0]], now).error).toContain("duplicate history group");
    history[1].push(row("sensor.solar_meter", 12, now));
    expect(readMeteredActuals(h, opt, history, now).error).toContain("another entity");
  });
  it("uses calendar midnights across 23- and 25-hour DST days", () => {
    const zone = "Europe/Amsterdam";
    const midnight = (date: string) => localDayStart(Date.parse(`${date}T12:00:00Z`), zone);
    expect(midnight("2026-03-30") - midnight("2026-03-29")).toBe(23 * 3600000);
    expect(midnight("2026-10-26") - midnight("2026-10-25")).toBe(25 * 3600000);
  });
});

describe("energy rendering and HA lifecycle", () => {
  it("registers complete accounting translations without English fallback or broken count placeholders", () => {
    expect(Object.keys(energyInsightsAccounting).sort()).toEqual([...SUPPORTED_LOCALES].sort());
    for (const language of SUPPORTED_LOCALES) {
      for (const [key, english] of Object.entries(energyInsightsAccounting.en)) {
        const translated = energyInsightsAccounting[language][key];
        expect(translated, `${language}: ${key}`).toBeTruthy();
        expect(translationCatalogs[language][key]).toBe(translated);
        expect(localizeText({ language }, english)).toBe(translated);
        expect(translated.match(/\{[^}]+\}/g) ?? []).toEqual(english.match(/\{[^}]+\}/g) ?? []);
        if (language !== "en") expect(translated, `${language}: ${key}`).not.toBe(english);
      }
      for (const message of Object.values(INSIGHTS_APPROXIMATION_MESSAGES)) {
        expect(energyInsightsAccounting[language][`ui.release.${message}`]).toBeTruthy();
      }
    }
  });
  it.each(SUPPORTED_LOCALES)("localizes all accounting notices and bounds dense tables in %s, including cached language changes", async language => {
    clock();
    const h = meteredHass(), rows = meterHistory(), count = 350;
    h.language = language;
    h.states["sensor.solar_meter"].last_updated = new Date(now - 60000).toISOString();
    rows[1] = Array.from({ length: count + 1 }, (_, index) => ({
      entity_id: "sensor.import_meter", state: String(20 + 4 * index / count),
      last_updated: new Date(index ? start + (now - start) * index / count : start - 60000).toISOString(),
    }));
    rows[5] = Array.from({ length: count }, (_, index) => ({
      entity_id: "sensor.import_rate", state: String(.2 + index / 1000),
      last_updated: new Date(start + (now - start) * index / count + (index === 1 ? 1000 : 0)).toISOString(),
    }));
    h.states["sensor.import_rate"].state = String(.2 + (count - 1) / 1000);
    const callWS = vi.fn(async () => rows);
    h.callWS = async <T>() => await callWS() as T;
    const card = document.createElement("mushroom-addition-energy-insights") as EnergyInsightsCard;
    card.hass = h; card.setConfig({ type: "custom:mushroom-addition-energy-insights", energy_insights: meteredOptions() });
    document.body.append(card); await card.updateComplete; await vi.advanceTimersByTimeAsync(0); await card.updateComplete;
    const root = card.shadowRoot!;
    const assertLocalized = (current: HomeAssistant) => {
      const notice = root.querySelector(".approximation")!.textContent!;
      expect(notice).toContain(localizeText(current, "Approximate accounting"));
      expect(notice).toContain(localizeText(current, "Affected totals, household shares and costs are estimates, not exact measurements."));
      for (const message of Object.values(INSIGHTS_APPROXIMATION_MESSAGES)) {
        expect(notice).toContain(localizeText(current, message));
        if (current.language !== "en") expect(notice).not.toContain(message);
      }
      expect(notice).toContain(`gridImport: ${localizeText(current, INSIGHTS_APPROXIMATION_MESSAGES.midnight)}`);
      expect(notice).toContain(`importRate: ${localizeText(current, INSIGHTS_APPROXIMATION_MESSAGES.tariffs)}`);
      expect(notice).toContain(`solar: ${localizeText(current, INSIGHTS_APPROXIMATION_MESSAGES.endpoint)}`);
      expect(root.textContent).toContain(localizeText(current, "Only the first 200 rate buckets are shown; totals include all {count} buckets.")
        .replace("{count}", energyNumber(current, count, { maximumFractionDigits: 0 })));
      expect(root.textContent).toContain(localizeText(current, "Only the first 200 intervals are shown; totals and chart include all {count} intervals.")
        .replace("{count}", energyNumber(current, count + 2, { maximumFractionDigits: 0 })));
      expect(root.querySelector(".diagnostics")?.textContent).toContain(localizeText(current, "Last state update"));
      if (current.language !== "en") {
        expect(root.textContent).not.toContain("Last state update");
        expect(root.textContent).not.toContain("Approximate accounting");
      }
      expect(root.textContent).toContain(`${energyNumber(current, 4.5, { maximumFractionDigits: 2 })} kWh`);
      expect(root.textContent).not.toContain("{count}");
    };
    assertLocalized(h);
    expect(root.querySelectorAll("details table tbody tr")).toHaveLength(200);
    expect(root.querySelectorAll(".price-mix i")).toHaveLength(200);
    expect(root.querySelectorAll(".measured-chart rect").length).toBeLessThanOrEqual(192);
    card.hass = { ...h, language: language === "nl" ? "de" : "nl" };
    await card.updateComplete;
    assertLocalized(card.hass);
    expect(callWS).toHaveBeenCalledOnce();
    card.remove();
  });
  it("revalidates cached availability without moving its endpoint to newer live readings", async () => {
    clock();
    const h = meteredHass();
    const callWS = vi.fn(async () => meterHistory());
    h.callWS = async <T>() => await callWS() as T;
    const card = document.createElement("mushroom-addition-energy-insights") as EnergyInsightsCard;
    card.hass = h; card.setConfig({ type: "custom:mushroom-addition-energy-insights", energy_insights: meteredOptions() });
    document.body.append(card); await card.updateComplete; await vi.advanceTimersByTimeAsync(0); await card.updateComplete;
    await vi.advanceTimersByTimeAsync(60000);
    card.hass = { ...h, states: { ...h.states,
      "sensor.solar_meter": { ...h.states["sensor.solar_meter"], state: "15", last_updated: new Date(now + 60000).toISOString() },
      "sensor.import_rate": { ...h.states["sensor.import_rate"], state: "unavailable" },
    } };
    await card.updateComplete; await vi.advanceTimersByTimeAsync(0); await card.updateComplete;
    expect(callWS).toHaveBeenCalledOnce();
    expect(card.shadowRoot!.textContent).toContain("4.5 kWh");
    expect(card.shadowRoot!.textContent).not.toContain("future timestamp");
    expect(card.shadowRoot!.textContent).toContain("importRate: selected sensor is missing or unavailable");
    card.hass = { ...card.hass, states: { ...card.hass!.states, "sensor.import_rate": h.states["sensor.import_rate"] } };
    await card.updateComplete; await vi.advanceTimersByTimeAsync(0); await card.updateComplete;
    expect(card.shadowRoot!.textContent).not.toContain("importRate: selected sensor is missing or unavailable");
    expect(card.shadowRoot!.textContent).toContain("4.5 kWh");
    expect(callWS).toHaveBeenCalledOnce();
    card.remove();
  });
  it("does not restore a now-unavailable sensor when an earlier history request completes", async () => {
    clock();
    const h = meteredHass();
    let finish: (value: unknown) => void = () => undefined;
    const pending = new Promise<unknown>(resolve => { finish = resolve; });
    h.callWS = async <T>() => await pending as T;
    const card = document.createElement("mushroom-addition-energy-insights") as EnergyInsightsCard;
    card.hass = h; card.setConfig({ type: "custom:mushroom-addition-energy-insights", energy_insights: meteredOptions() });
    document.body.append(card); await card.updateComplete;
    card.hass = { ...h, states: { ...h.states, "sensor.import_meter": { ...h.states["sensor.import_meter"], state: "unavailable" } } };
    await card.updateComplete;
    finish(meterHistory()); await vi.advanceTimersByTimeAsync(0); await card.updateComplete;
    expect(card.shadowRoot!.textContent).toContain("gridImport: selected sensor is missing or unavailable");
    expect(card.shadowRoot!.textContent).not.toContain("4.5 kWh");
    card.remove();
  });
  it("keeps measured energy, live power and comparison separate in responsive consumer rows", async () => {
    clock();
    const card = document.createElement("mushroom-addition-energy-insights") as EnergyInsightsCard;
    card.hass = hass();
    card.setConfig({ type: "custom:mushroom-addition-energy-insights", energy_insights: options() });
    document.body.append(card); await card.updateComplete;
    const root = card.shadowRoot!, row = root.querySelector(".consumer-row")!;
    expect(row.querySelector(".consumer-name")?.textContent).toContain(options().consumers[0].name);
    expect(row.querySelector(".consumer-power")?.textContent).toContain("Now");
    expect(row.querySelector(".consumer-energy")?.textContent).toContain("kWh");
    expect(row.querySelector(".variance")?.textContent).toContain("Same-window plan");
    const chart = root.querySelector(".chart-scroll")!;
    expect(chart.getAttribute("tabindex")).toBe("0");
    expect(chart.getAttribute("role")).toBe("region");
    expect(chart.getAttribute("aria-label")).toBe("Metered intervals");
    expect(chart.querySelectorAll(".measured-chart rect").length).toBeGreaterThan(0);
    root.querySelectorAll<HTMLButtonElement>('[role=tab]')[1].click();
    await card.updateComplete;
    expect(root.querySelectorAll(".consumer-row")).toHaveLength(options().consumers.length);
    expect(root.querySelectorAll(".allocation-metrics > div")).toHaveLength(3);
  });
  it("disposes pending-request timers when removed without reporting cancelled work as a failure", async () => {
    clock();
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const h = meteredHass();
    h.callWS = async <T>() => await new Promise<T>(() => undefined);
    const card = document.createElement("mushroom-addition-energy-insights") as EnergyInsightsCard;
    card.hass = h; card.setConfig({ type: "custom:mushroom-addition-energy-insights", energy_insights: meteredOptions() });
    document.body.append(card); await card.updateComplete;
    expect(vi.getTimerCount()).toBe(3);
    card.remove(); await vi.advanceTimersByTimeAsync(0);
    expect(vi.getTimerCount()).toBe(0);
    expect(warning).not.toHaveBeenCalled();
  });
  it("pins the plan inspector with keyboard navigation without selecting the exclusive end", async () => {
    clock();
    const card = document.createElement("mushroom-addition-energy-plan") as EnergyPlanCard;
    card.hass = hass(); card.setConfig(planConfig()); document.body.append(card);
    await card.updateComplete;
    const timeline = card.shadowRoot!.querySelector(".timeline[tabindex]")!;
    const slider = card.shadowRoot!.querySelector<HTMLInputElement>(".inspector input")!;
    timeline.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    await card.updateComplete;
    expect(slider.value).toBe("999");
    timeline.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
    await card.updateComplete;
    expect(slider.value).toBe("0");
    timeline.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await card.updateComplete;
    expect(slider.value).toBe("10");
    expect(card.getGridOptions().min_columns).toBe(12);
  });
  it("keeps successful measurements and reports a bounded request timeout", async () => {
    clock();
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const h = meteredHass(), configured = meteredOptions();
    const callWS = vi.fn<(message: Record<string, unknown>) => Promise<unknown>>()
      .mockResolvedValueOnce(meterHistory()).mockImplementation(() => new Promise(() => undefined));
    h.callWS = async <T>(message: Record<string, unknown>) => await callWS(message) as T;
    const card = document.createElement("mushroom-addition-energy-insights") as EnergyInsightsCard;
    card.hass = h; card.setConfig({ type: "custom:mushroom-addition-energy-insights", energy_insights: configured });
    document.body.append(card);
    await card.updateComplete; await vi.advanceTimersByTimeAsync(0); await card.updateComplete;
    expect(card.shadowRoot!.textContent).toContain("4.5 kWh");
    await vi.advanceTimersByTimeAsync(INSIGHTS_HISTORY_REFRESH_MS + 30000);
    await card.updateComplete;
    expect(card.shadowRoot!.textContent).toContain("4.5 kWh");
    expect(card.shadowRoot!.textContent).toContain("timed out after 30 seconds");
    expect(warning).toHaveBeenCalledOnce();
    card.remove();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("refreshes a replaced connection and ignores the displaced request result", async () => {
    clock();
    const h = meteredHass();
    let finish: (value: unknown) => void = () => undefined;
    const pending = new Promise<unknown>(resolve => { finish = resolve; });
    h.callWS = async <T>() => await pending as T;
    const card = document.createElement("mushroom-addition-energy-insights") as EnergyInsightsCard;
    card.hass = h; card.setConfig({ type: "custom:mushroom-addition-energy-insights", energy_insights: meteredOptions() });
    document.body.append(card); await card.updateComplete;
    const replacement = vi.fn(async () => meterHistory());
    card.hass = { ...h, callWS: async <T>() => await replacement() as T };
    await card.updateComplete; await Promise.resolve(); await card.updateComplete;
    expect(replacement).toHaveBeenCalledOnce();
    const old = meterHistory();
    (old[0][1] as { state: string }).state = "100";
    finish(old); await Promise.resolve(); await Promise.resolve(); await card.updateComplete;
    expect(card.shadowRoot!.textContent).toContain("4.5 kWh");
    expect(card.shadowRoot!.textContent).not.toContain("92.5 kWh");
    card.remove();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("batches all 32 consumer meters with base sources and reports the actual request load", async () => {
    clock();
    const h = meteredHass(), configured = meteredOptions(), rows = meterHistory();
    configured.consumers = Array.from({ length: 32 }, (_, index) => {
      const entity = `sensor.consumer_${index}`;
      h.states[entity] = { entity_id: entity, state: "0", last_updated: new Date(now).toISOString(), attributes: { unit_of_measurement: "kWh" } };
      rows.push([0, 1].map(position => ({
        entity_id: entity, state: "0", last_updated: new Date(position ? now : Date.parse("2031-04-12T00:00:00Z")).toISOString(),
        attributes: { unit_of_measurement: "kWh" },
      })));
      return { id: `consumer_${index}`, name: `Consumer ${index}`, energySource: { entity } };
    });
    const callWS = vi.fn<(message: Record<string, unknown>) => Promise<unknown[][]>>(async () => rows);
    h.callWS = async <T>(message: Record<string, unknown>) => await callWS(message) as T;
    const card = document.createElement("mushroom-addition-energy-insights") as EnergyInsightsCard;
    card.hass = h; card.setConfig({ type: "custom:mushroom-addition-energy-insights", energy_insights: configured });
    document.body.append(card); await card.updateComplete; await vi.advanceTimersByTimeAsync(0); await card.updateComplete;
    expect(callWS).toHaveBeenCalledOnce();
    expect(callWS.mock.calls[0][0].entity_ids).toHaveLength(INSIGHTS_HISTORY_MAX_ENTITIES);
    expect(card.shadowRoot!.querySelector(".diagnostics")?.textContent).toMatch(/39 Sources · 78 State/);
    expect(card.getGridOptions().min_columns).toBe(12);
    card.remove();
  });
  it("batches and caches Recorder history within the documented refresh budget", async () => {
    clock();
    const h = meteredHass(), configured = meteredOptions();
    const callWS = vi.fn<(message: Record<string, unknown>) => Promise<unknown[][]>>(async () => meterHistory());
    h.callWS = async <T>(message: Record<string, unknown>) => await callWS(message) as T;
    const card = document.createElement("mushroom-addition-energy-insights") as EnergyInsightsCard;
    card.hass = h;
    card.setConfig({ type: "custom:mushroom-addition-energy-insights", energy_insights: configured });
    document.body.append(card);
    await card.updateComplete;
    await Promise.resolve();
    await card.updateComplete;
    expect(callWS).toHaveBeenCalledTimes(1);
    const request = callWS.mock.calls[0][0] as Record<string, unknown>;
    expect(request.type).toBe("history/history_during_period");
    expect((request.entity_ids as string[])).toHaveLength(7);
    expect((request.entity_ids as string[]).length).toBeLessThanOrEqual(INSIGHTS_HISTORY_MAX_ENTITIES);
    expect(request.significant_changes_only).toBe(false);
    expect(request.start_time).toBe(new Date(start - INSIGHTS_HISTORY_LOOKBACK_MS).toISOString());
    card.requestUpdate();
    await card.updateComplete;
    expect(callWS).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(INSIGHTS_HISTORY_REFRESH_MS - 1);
    expect(callWS).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1);
    await Promise.resolve();
    expect(callWS).toHaveBeenCalledTimes(2);
    card.remove();
  });
  it("does not stretch shared headings to fill the entire card or editor preview", () => {
    expect(sharedStyles.cssText).toContain(".mushroom-addition-card > .action-surface:not(.energy-heading) { min-height: 100%; }");
    expect(sharedStyles.cssText).toContain(".energy-heading.action-surface { height: auto; min-height: 0; }");
  });
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
  it("requests full section width for the Energy Plan timeline", () => {
    expect(new EnergyPlanCard().getGridOptions()).toEqual({
      columns: "full", rows: "auto", min_columns: 12, max_columns: 12, min_rows: 3,
    });
  });
  it("groups adjacent price intervals by configured color band and retains their source range", () => {
    const row = planDefaults().rows[0];
    const intervals = [
      { start: now, end: now + 1, value: .20 },
      { start: now + 1, end: now + 2, value: .25 },
      { start: now + 2, end: now + 3, value: .31 },
      { start: now + 3, end: now + 4, value: .28 },
    ];
    expect(displayPriceIntervals(row, intervals)).toMatchObject([
      { start: now, end: now + 2, minimum: .20, maximum: .25 },
      { start: now + 2, end: now + 3, minimum: .31, maximum: .31 },
      { start: now + 3, end: now + 4, minimum: .28, maximum: .28 },
    ]);
  });
  it("scales solar bars to the visible forecast while preserving configured scales on other power rows", () => {
    const rows = planDefaults().rows;
    const intervals = [{ start: now, end: now + 1, value: .53 }, { start: now + 1, end: now + 2, value: .2 }];
    expect(displayPowerScale(rows[1], intervals)).toBe(.53);
    expect(displayPowerScale(rows[1], [])).toBe(rows[1].scale);
    expect(displayPowerScale(rows[5], intervals)).toBe(rows[5].scale);
  });
  it("keeps dense timeline labels readable without dropping the configured grid ticks", async () => {
    clock();
    const config = planConfig();
    config.visibleHours = 168;
    config.energy_plan!.axisStep = 1;
    const card = new EnergyPlanCard(); card.hass = hass(); card.setConfig(config);
    document.body.append(card); await card.updateComplete;
    expect(card.shadowRoot!.querySelectorAll(".timeline-body > .grid")).toHaveLength(169);
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
    const c = planConfig();
    c.energy_plan!.rows[0].name = "<img onerror=alert(1)>";
    c.energy_plan!.rows[1].name = "Planned grid charging";
    c.energy_plan!.metrics = [{ ...newMetric(), entity: "sensor.example_power" }];
    const card = new EnergyPlanCard(); card.hass = hass(); card.setConfig(c); document.body.append(card); await card.updateComplete;
    const labels = card.shadowRoot!.querySelectorAll(".row-label");
    expect(labels).toHaveLength(7);
    expect(labels[1].querySelector("span")?.textContent).toBe("Planned grid charging");
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
    expect(clear).toHaveBeenCalledTimes(3);
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
