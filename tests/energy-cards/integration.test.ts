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

const hass = (): HomeAssistant => ({
  states: {
    "sensor.prices": { entity_id: "sensor.prices", state: "0.2", attributes: { prices: [] } },
    "sensor.battery": { entity_id: "sensor.battery", state: "72", attributes: { unit_of_measurement: "%" } },
  },
  callService: vi.fn(async () => undefined),
});
const tags = ["mushroom-addition-smart-saving", "mushroom-addition-energy-entityworkflow"];
afterEach(() => document.body.replaceChildren());

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
