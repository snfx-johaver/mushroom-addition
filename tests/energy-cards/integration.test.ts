import { afterEach, describe, expect, it, vi } from "vitest";
import "../../src/index";
import type { AdditionConfig, HomeAssistant } from "../../src/types";
import type { MushroomAdditionEditor } from "../../src/editor";
import type { SmartSavingPlanCardEditor } from "../../src/energy-cards/editor";
import { SmartSavingPlanCard } from "../../src/energy-cards/card";
import type { SmartSavingConfig } from "../../src/energy-cards/types";
import { MushroomWorkflowCard } from "../../src/energy-cards/workflow";
import { createStubConfig } from "../../src/stub";
import { CATALOG } from "../../src/catalog";
import { localize, editorHelper, SUPPORTED_LOCALES } from "../../src/localize";
import { energyEditorLabels, energyEditorHelpers } from "../../src/translations/energy-editor";
import { convertPrice } from "../../src/energy-cards/data";
import { discoverPriceSource, readPriceIntervals, validatePriceSource } from "../../src/energy-cards/price-source";
import { energyPriceSlots, energyTradeResult } from "../../src/energy-buy-sell";
import { tariffIntervals } from "../../src/energy-management";
import type { MushroomAdditionCard } from "../../src/card";

const hass = (): HomeAssistant => ({
  states: {
    "sensor.prices": { entity_id: "sensor.prices", state: "0.2", attributes: { prices: [
      { start: Date.now(), end: Date.now() + 3600000, price: .2 },
    ] } },
    "sensor.battery": { entity_id: "sensor.battery", state: "72", attributes: { unit_of_measurement: "%" } },
  },
  callService: vi.fn(async () => undefined),
});
const tags = ["mushroom-addition-smart-saving", "mushroom-addition-energy-entityworkflow"];
afterEach(() => document.body.replaceChildren());

describe("community energy setup", () => {
  const ids = ["live_energy_flow", "advanced_energy_buy_sell", "advanced_home_energy_management",
    "energy_log", "energy_plan", "smart_saving", "energy_entityworkflow"];
  const prices = (): HomeAssistant => ({
    states: {
      "sensor.example_temperature": { entity_id: "sensor.example_temperature", state: "21", attributes: { unit_of_measurement: "°C" } },
      "sensor.example_tariff": { entity_id: "sensor.example_tariff", state: "ready", last_updated: new Date().toISOString(),
        attributes: { unit_of_measurement: "USD/MWh", raw_today: [
          { start: Date.now(), end: Date.now() + 3600000, value: 100 },
          { start: Date.now() + 3600000, end: Date.now() + 7200000, value: 300 },
        ] } },
    },
    callService: vi.fn(async () => undefined),
  });

  it.each(ids)("opens %s without fictional sensors, fabricated measurements or configuration errors", async id => {
    const item = CATALOG.find(item => item.upstreamId === id)!;
    const source: HomeAssistant = { states: {}, callService: vi.fn(async () => undefined) };
    const config = createStubConfig(item, source);
    const card = document.createElement(item.tag) as MushroomAdditionCard;
    card.hass = source;
    card.setConfig(config);
    document.body.append(card);
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".energy-setup")?.textContent).toContain("Features");
    expect(card.shadowRoot!.textContent).not.toMatch(/NaN|0 W|0 kW|0%/);
    expect(JSON.stringify(config)).not.toContain("sensor.example");
    expect(source.callService).not.toHaveBeenCalled();
  });

  it("uses verified common price data across cards, not entity names or an unrelated healthy sensor", () => {
    const source = prices();
    const mapping = discoverPriceSource(source)!;
    expect(mapping).toMatchObject({ entity: "sensor.example_tariff", path: "raw_today", priceField: "value",
      sourceUnit: "USD/MWh", displayUnit: "USD/kWh" });
    for (const id of ["smart_saving", "advanced_energy_buy_sell"]) {
      const stub = createStubConfig(CATALOG.find(item => item.upstreamId === id)!, source);
      expect(stub.price).toEqual(mapping);
    }
    const plan = createStubConfig(CATALOG.find(item => item.upstreamId === "energy_plan")!, source);
    expect(plan.energy_plan!.rows).toHaveLength(1);
    expect(plan.energy_plan!.rows[0]).toMatchObject({ kind: "price", entity: mapping.entity, path: mapping.path,
      valueField: "value", unit: "USD/MWh" });
    const home = createStubConfig(CATALOG.find(item => item.upstreamId === "advanced_home_energy_management")!, source);
    expect(home.tariff_price).toEqual(mapping);
    expect(home.entity).toBeUndefined();
    expect(home.grid_power_entity).toBeUndefined();
    const workflow = createStubConfig(CATALOG.find(item => item.upstreamId === "energy_entityworkflow")!, source);
    expect(workflow.nodes).toHaveLength(1);
    expect(workflow.relations).toEqual([]);
    source.states["sensor.example_tariff"].state = "unavailable";
    expect(discoverPriceSource(source)).toBeUndefined();
    expect(createStubConfig(CATALOG.find(item => item.upstreamId === "smart_saving")!, source).entity).toBeUndefined();
  });

  it("recognizes JSON price states and rejects partial, overlapping or non-price arrays", () => {
    const source = prices(), entity = source.states["sensor.example_tariff"];
    entity.state = JSON.stringify(entity.attributes.raw_today);
    entity.attributes = { unit_of_measurement: "GBP/kWh" };
    const mapping = discoverPriceSource(source)!;
    expect(mapping).toMatchObject({ adapter: "state", path: "", priceField: "value", sourceUnit: "GBP/kWh" });
    expect(readPriceIntervals(entity, mapping).items).toHaveLength(2);
    const intervals: Array<Record<string, unknown>> = JSON.parse(entity.state);
    entity.state = JSON.stringify([...intervals, { start: "invalid" }]);
    expect(discoverPriceSource(source)).toBeUndefined();
    expect(readPriceIntervals(entity, mapping).error).toContain("Invalid");
    entity.state = JSON.stringify([intervals[0], intervals[0]]);
    expect(discoverPriceSource(source)).toBeUndefined();
    entity.state = JSON.stringify(intervals);
    entity.attributes.unit_of_measurement = "kW";
    expect(discoverPriceSource(source)).toBeUndefined();
  });

  it("converts energy denominations and cents without performing currency exchange", () => {
    expect(convertPrice(150, "USD/MWh", "USD/kWh")).toBeCloseTo(.15);
    expect(convertPrice(.15, "USD/kWh", "ct/kWh")).toBeCloseTo(15);
    expect(() => convertPrice(15, "ct/kWh", "GBP/kWh")).toThrow("currencies must match");
    expect(convertPrice(15, "ct/kWh", "GBP/kWh", "GBP")).toBeCloseTo(.15);
    expect(() => convertPrice(.15, "USD/kWh", "EUR/kWh")).toThrow("currencies must match");
    expect(() => validatePriceSource({ sourceUnit: "USD/kWh", currency: "EUR" })).toThrow("currencies must match");
    expect(() => validatePriceSource({ sourceUnit: "USD/hour" })).toThrow("unsupported price unit");
  });

  it("preserves supplied slot lengths and uses currency/kWh for buy/sell costs and home tariffs", () => {
    const source = prices(), mapping = discoverPriceSource(source)!;
    const entity = source.states[mapping.entity];
    const slots = energyPriceSlots(entity, mapping);
    expect(slots[0].price).toBeCloseTo(.1);
    expect(tariffIntervals(entity, .02, 10, mapping)[0].price).toBeCloseTo(.132);
    const estimate = energyTradeResult(slots, { energy: 1, power: 1, efficiency: 100, fee: 0, slotMinutes: 15 });
    if ("error" in estimate) throw new Error(estimate.error);
    expect(estimate.buy.amount).toBeCloseTo(-.1);
    expect(estimate.sell.amount).toBeCloseTo(.3);
    expect(estimate.buy.slots[0].end - estimate.buy.slots[0].start).toBe(3600000);
  });

  it("renders non-EUR prices without invented purchase/sale series or battery forecasts", async () => {
    const source = prices();
    for (const id of ["smart_saving", "advanced_energy_buy_sell", "energy_plan"]) {
      const item = CATALOG.find(item => item.upstreamId === id)!;
      const card = document.createElement(item.tag) as MushroomAdditionCard;
      card.hass = source;
      card.setConfig(createStubConfig(item, source));
      document.body.append(card);
      await card.updateComplete;
      expect(card.shadowRoot!.textContent).toContain("USD/");
      expect(card.shadowRoot!.querySelector(".battery-plot")).toBeNull();
      expect(card.shadowRoot!.querySelector(".energy-setup")).toBeNull();
      if (id === "advanced_energy_buy_sell") {
        expect(card.shadowRoot!.querySelectorAll(".energy-chart-legend-item")).toHaveLength(1);
        expect(card.shadowRoot!.querySelector("title")?.textContent).toContain("0.100 USD/kWh");
        expect(card.shadowRoot!.querySelector(".energy-buy-sell-result")).toBeNull();
      }
    }
    expect(source.callService).not.toHaveBeenCalled();
  });

  it("keeps a custom currency and denomination when an unrelated price editor field changes", async () => {
    const source = prices(), config = createStubConfig(CATALOG.find(item => item.upstreamId === "smart_saving")!, source);
    const features = document.createElement("mushroom-addition-smart-saving-features") as SmartSavingPlanCardEditor;
    features.hass = source;
    features.setConfig(config as SmartSavingConfig);
    document.body.append(features);
    await features.updateComplete;
    const saved: SmartSavingConfig[] = [];
    features.addEventListener("config-changed", event => saved.push((event as CustomEvent<{ config: SmartSavingConfig }>).detail.config));
    const form = [...features.shadowRoot!.querySelectorAll<HTMLElement & { data: Record<string, unknown>; schema: Array<{ name: string }> }>("ha-form")]
      .find(form => form.schema.some(field => field.name === "sourceUnit"))!;
    form.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { ...form.data, maxSourceAgeMinutes: 120 } } }));
    await features.updateComplete;
    expect(saved.at(-1)?.price).toMatchObject({ sourceUnit: "USD/MWh", displayUnit: "USD/kWh", maxSourceAgeMinutes: 120 });
  });
});

async function editorFor(tag: string) {
  const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
  editor.hass = hass();
  editor.setConfig(createStubConfig(CATALOG.find(item => item.tag === tag)!, editor.hass));
  document.body.append(editor);
  await editor.updateComplete;
  return editor;
}
async function expand(editor: MushroomAdditionEditor, expanded: boolean) {
  const panel = [...editor.shadowRoot!.querySelectorAll("ha-expansion-panel")]
    .find(item => item.textContent?.includes("Features"))!;
  panel.dispatchEvent(new CustomEvent("expanded-will-change", { detail: { expanded } }));
  await editor.updateComplete;
  panel.dispatchEvent(new CustomEvent("expanded-changed", { detail: { expanded } }));
  await editor.updateComplete;
  return panel;
}

describe("integrated energy editor and presentation", () => {
  it.each(SUPPORTED_LOCALES)("localizes the new editor fields and guidance in %s", language => {
    for (const key of ["visibleHours", "statusEntity", "presentation"]) {
      expect(energyEditorLabels[language][key].trim()).not.toBe("");
      expect(energyEditorHelpers[language][key].trim()).not.toBe("");
      expect(localize({ ...hass(), language }, key)).toBe(energyEditorLabels[language][key]);
      expect(editorHelper(key, { ...hass(), language })).toBe(energyEditorHelpers[language][key]);
      if (language !== "en") {
        expect(energyEditorLabels[language][key]).not.toBe(energyEditorLabels.en[key]);
        expect(energyEditorHelpers[language][key]).not.toBe(energyEditorHelpers.en[key]);
      }
    }
  });
  it.each(tags)("uses shared picker defaults and lazily releases specialist controls for %s", async tag => {
    const editor = await editorFor(tag);
    const config = createStubConfig(CATALOG.find(item => item.tag === tag)!, editor.hass);
    expect(config.primary_info).toBeUndefined();
    expect(config.secondary_info).toBeUndefined();
    expect(window.customCards!.find(item => item.type === tag)?.preview).toBe(false);
    expect(editor.shadowRoot!.querySelectorAll("ha-form")).toHaveLength(0);
    const panel = await expand(editor, true);
    const features = panel.querySelector<SmartSavingPlanCardEditor>(
      tag.endsWith("smart-saving") ? "mushroom-addition-smart-saving-features" : "mushroom-addition-energy-workflow-features",
    )!;
    await features.updateComplete;
    const fields = [...features.shadowRoot!.querySelectorAll<HTMLElement & { schema: Array<{ name: string }> }>("ha-form")]
      .flatMap(form => form.schema.map(field => field.name));
    expect(fields.length).toBeGreaterThan(0);
    expect(fields).not.toContain("title");
    expect(fields).not.toContain("subtitle");
    await expand(editor, false);
    expect(panel.querySelector(".section-body")).toBeNull();
    await expand(editor, true);
    expect(panel.querySelector(".section-body")).not.toBeNull();
  });

  it("keeps the Context entity and nested price source in sync in both directions", async () => {
    const editor = await editorFor(tags[0]);
    const configs: AdditionConfig[] = [];
    editor.addEventListener("config-changed", event => configs.push((event as CustomEvent<{ config: AdditionConfig }>).detail.config));
    const context = editor.shadowRoot!.querySelector("ha-expansion-panel")!;
    context.dispatchEvent(new CustomEvent("expanded-will-change", { detail: { expanded: true } }));
    await editor.updateComplete;
    context.querySelector("ha-form")!.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { entity: "sensor.battery" } } }));
    await editor.updateComplete;
    expect(configs.at(-1)?.price?.entity).toBe("sensor.battery");
    await expand(editor, true);
    const features = editor.shadowRoot!.querySelector<SmartSavingPlanCardEditor>("mushroom-addition-smart-saving-features")!;
    await features.updateComplete;
    const price = features.shadowRoot!.querySelector("ha-form")!;
    price.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { entity: "sensor.prices" } } }));
    await editor.updateComplete;
    expect(configs.at(-1)?.entity).toBe("sensor.prices");
    expect(configs.at(-1)?.price?.entity).toBe("sensor.prices");
    expect(configs.at(-1)?.name).toBe("Smart Saving");
  });

  it("does not save invalid Smart Saving period edits", async () => {
    const editor = await editorFor(tags[0]);
    await expand(editor, true);
    const features = editor.shadowRoot!.querySelector<SmartSavingPlanCardEditor>("mushroom-addition-smart-saving-features")!;
    await features.updateComplete;
    const saved = vi.fn();
    editor.addEventListener("config-changed", saved);
    const forms = [...features.shadowRoot!.querySelectorAll<HTMLElement & { schema: Array<{ name: string }> }>("ha-form")];
    forms.find(form => form.schema.some(field => field.name === "startHour"))!
      .dispatchEvent(new CustomEvent("value-changed", { detail: { value: { startHour: 25 } } }));
    await features.updateComplete;
    expect(saved).not.toHaveBeenCalled();
    expect(features.shadowRoot!.querySelector("[role=alert]")?.textContent).toContain("startHour");
  });

  it("reports a zero forecast horizon instead of silently replacing it", async () => {
    const editor = await editorFor(tags[0]);
    await expand(editor, true);
    const features = editor.shadowRoot!.querySelector<SmartSavingPlanCardEditor>("mushroom-addition-smart-saving-features")!;
    await features.updateComplete;
    const saved = vi.fn();
    editor.addEventListener("config-changed", saved);
    const forms = [...features.shadowRoot!.querySelectorAll<HTMLElement & {
      schema: Array<{ name: string }>; data: Record<string, unknown>;
    }>("ha-form")];
    const battery = forms.find(form => form.schema.some(field => field.name === "horizonHours"))!;
    battery.dispatchEvent(new CustomEvent("value-changed", {
      detail: { value: { ...battery.data, horizonHours: 0 } },
    }));
    await features.updateComplete;
    expect(saved).not.toHaveBeenCalled();
    expect(features.shadowRoot!.querySelector("[role=alert]")?.textContent).toContain("battery.horizon.value");
  });

  it("edits source-specific freshness and schedule meaning without dropping nested configuration", async () => {
    const features = document.createElement("mushroom-addition-smart-saving-features") as SmartSavingPlanCardEditor;
    features.hass = hass();
    features.setConfig({
      type: "custom:mushroom-addition-smart-saving",
      price: { entity: "sensor.prices", maxSourceAgeMinutes: 1440 },
      battery: {
        current: { entity: "sensor.battery", maxSourceAgeMinutes: 5 },
        forecast: { entity: "sensor.example_forecast", maxSourceAgeMinutes: 60 },
        target: { value: 80, maxSourceAgeMinutes: 120 },
        horizon: { value: 24, maxSourceAgeMinutes: 120 },
      },
      tracks: { applied: { entity: "sensor.example_sale", meaning: "confirmed", powerUnit: "kW", energyUnit: "kWh", maxSourceAgeMinutes: 30 } },
    });
    document.body.append(features);
    await features.updateComplete;
    const configs: SmartSavingConfig[] = [];
    features.addEventListener("config-changed", event => configs.push((event as CustomEvent<{ config: SmartSavingConfig }>).detail.config));
    type Form = HTMLElement & { data: Record<string, unknown>; schema: Array<{ name: string }> };
    const forms = [...features.shadowRoot!.querySelectorAll<Form>("ha-form")];
    const battery = forms.find(form => form.schema.some(field => field.name === "currentAgeMinutes"))!;
    battery.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { ...battery.data, currentAgeMinutes: 10, forecastAgeMinutes: 90 } } }));
    await features.updateComplete;
    expect(configs.at(-1)?.battery?.current?.maxSourceAgeMinutes).toBe(10);
    expect(configs.at(-1)?.battery?.forecast?.maxSourceAgeMinutes).toBe(90);
    expect(configs.at(-1)?.battery?.target?.maxSourceAgeMinutes).toBe(120);
    const sale = [...features.shadowRoot!.querySelectorAll<Form>("ha-form")].find(form => form.data.entity === "sensor.example_sale")!;
    sale.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { ...sale.data, meaning: "supplied", maxSourceAgeMinutes: 45 } } }));
    await features.updateComplete;
    expect(configs.at(-1)?.tracks?.applied).toMatchObject({ meaning: "supplied", powerUnit: "kW", energyUnit: "kWh", maxSourceAgeMinutes: 45 });
    const price = [...features.shadowRoot!.querySelectorAll<Form>("ha-form")].find(form => form.schema.some(field => field.name === "sourceUnit"))!;
    price.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { ...price.data, maxSourceAgeMinutes: "" } } }));
    await features.updateComplete;
    expect(configs.at(-1)?.price?.maxSourceAgeMinutes).toBeUndefined();
  });

  it.each(tags)("retains selector schemas while forwarding fresh hass to %s controls", async tag => {
    const editor = await editorFor(tag);
    await expand(editor, true);
    const features = editor.shadowRoot!.querySelector<SmartSavingPlanCardEditor>(
      tag.endsWith("smart-saving") ? "mushroom-addition-smart-saving-features" : "mushroom-addition-energy-workflow-features",
    )!;
    await features.updateComplete;
    const forms = [...features.shadowRoot!.querySelectorAll<HTMLElement & {
      schema: unknown; computeLabel: unknown; hass: HomeAssistant;
    }>("ha-form")];
    const schemas = forms.map(form => form.schema);
    const labels = forms.map(form => form.computeLabel);
    editor.hass = { ...editor.hass!, states: { ...editor.hass!.states } };
    await editor.updateComplete;
    await features.updateComplete;
    const updated = [...features.shadowRoot!.querySelectorAll<typeof forms[number]>("ha-form")];
    expect(updated).toHaveLength(forms.length);
    updated.forEach((form, index) => {
      expect(form).toBe(forms[index]);
      expect(form.schema).toBe(schemas[index]);
      expect(form.computeLabel).toBe(labels[index]);
      expect(form.hass).toBe(editor.hass);
    });
  });

  it.each(tags)("supports shared header actions for %s without executing workflow steps", async tag => {
    const source = hass();
    const card = document.createElement(tag) as SmartSavingPlanCard | MushroomWorkflowCard;
    card.hass = source;
    card.setConfig(createStubConfig(CATALOG.find(item => item.tag === tag)!, source));
    const moreInfo = vi.fn();
    card.addEventListener("hass-action", moreInfo);
    document.body.append(card);
    await card.updateComplete;
    card.shadowRoot!.querySelector<HTMLElement>(".energy-heading")!.click();
    expect(moreInfo).toHaveBeenCalledTimes(1);
    expect(source.callService).not.toHaveBeenCalled();
  });
});

class MeasuredSmartSaving extends SmartSavingPlanCard {
  public renders = 0;
  protected render() { this.renders++; return super.render(); }
}
customElements.define("test-measured-smart-saving", MeasuredSmartSaving);

it("does not rebuild charts for unrelated hass state changes", async () => {
  const source = hass();
  const card = document.createElement("test-measured-smart-saving") as MeasuredSmartSaving;
  card.hass = source;
  card.setConfig(SmartSavingPlanCard.getStubConfig(source));
  document.body.append(card);
  await card.updateComplete;
  const renders = card.renders;
  card.hass = { ...source, states: { ...source.states, "sensor.unrelated": {
    entity_id: "sensor.unrelated", state: "1", attributes: {},
  } } };
  await card.updateComplete;
  expect(card.renders).toBe(renders);
  card.hass = { ...source, states: { ...source.states, "sensor.prices": { ...source.states["sensor.prices"], state: "0.3" } } };
  await card.updateComplete;
  expect(card.renders).toBe(renders + 1);
});
