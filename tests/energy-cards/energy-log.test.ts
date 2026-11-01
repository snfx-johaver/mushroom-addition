import { afterEach, describe, expect, it, vi } from "vitest";
import "../../src/index";
import { MushroomEnergyLogCard } from "../../src/energy-cards/energy-log";
import { MushroomEnergyLogEditor } from "../../src/energy-cards/energy-log-editor";
import {
  ENERGY_LOG_EDITOR_TAG, ENERGY_LOG_TAG, energyLogStub, readEnergyLogEntries, validateEnergyLogConfig,
} from "../../src/energy-cards/energy-log-config";
import type { EnergyLogConfig } from "../../src/energy-cards/energy-log-config";
import type { HomeAssistant } from "../../src/types";
import type { EditorField } from "../../src/energy-cards/editor-schema";
import { readFileSync } from "node:fs";
import { parse } from "yaml";

const config = (): EnergyLogConfig => ({
  type: `custom:${ENERGY_LOG_TAG}`,
  title: "Synthetic activity",
  subtitle: "Test-only data",
  sources: [{
    id: "sample", entity: "sensor.example_activity", adapter: "attribute", path: "entries",
    timestampField: "time", categoryField: "kind", titleField: "headline", detailField: "summary",
    descriptionField: "note", sourceField: "origin",
  }],
  categories: [
    { id: "planning", label: "Planning", color: "#7e57c2", icon: "mdi:clipboard-text-outline" },
    { id: "measurement", label: "Measurement", color: "#00897b", icon: "mdi:chart-line" },
  ],
  sortOrder: "newest",
  limit: 20,
  timeZone: "Europe/Amsterdam",
  clockFormat: "24",
  showSource: true,
  emptyState: "No synthetic rows.",
});

const entries = [
  { time: "2026-04-15T08:30:00Z", kind: "planning", headline: "Sample plan", summary: "2 sample blocks",
    note: "Synthetic planning row.", origin: "sensor.example_plan" },
  { time: "2026-04-15T10:15:00Z", kind: "measurement", headline: "Sample measurement", summary: "8 example units",
    note: "Synthetic measurement row.", origin: "sensor.example_measurement" },
  { time: "2026-04-14T20:30:00Z", kind: "planning", headline: "Earlier sample", summary: "1 sample block",
    note: "Synthetic prior-day row.", origin: "sensor.example_prior" },
];

const hass = (): HomeAssistant => ({
  states: {
    "sensor.example_activity": {
      entity_id: "sensor.example_activity", state: "ready", attributes: { entries },
    },
  },
  config: { time_zone: "UTC" },
  language: "en",
  callService: vi.fn(async () => undefined),
});

async function card(initialConfig = config()) {
  const element = document.createElement(ENERGY_LOG_TAG) as MushroomEnergyLogCard;
  element.hass = hass();
  element.setConfig(initialConfig);
  document.body.append(element);
  await element.updateComplete;
  return element;
}

async function editor(initialConfig = config()) {
  const element = document.createElement(ENERGY_LOG_EDITOR_TAG) as MushroomEnergyLogEditor;
  element.hass = hass();
  element.setConfig(initialConfig);
  document.body.append(element);
  await element.updateComplete;
  return element;
}

type Form = HTMLElement & { data: Record<string, unknown>; schema: EditorField[] };
function forms(element: MushroomEnergyLogEditor): Form[] {
  return [...element.shadowRoot!.querySelectorAll<Form>("ha-form")];
}
function change(form: Form, value: Record<string, unknown>) {
  form.dispatchEvent(new CustomEvent("value-changed", { detail: { value }, bubbles: true, composed: true }));
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe("Energy Log configuration and data", () => {
  it("validates the documented example with synthetic IDs and payload", () => {
    const docs = readFileSync("docs/ENERGY_LOG.md", "utf8");
    const examples = [...docs.matchAll(/```yaml\n([\s\S]*?)```/g)].map(match => parse(match[1]) as EnergyLogConfig);
    expect(examples).toHaveLength(2);
    expect(() => validateEnergyLogConfig(examples[0])).not.toThrow();
    expect(examples[0].sources[0].entity).toBe("sensor.example_activity_log");
    expect((examples[1] as unknown as { entries: Array<{ origin: string }> }).entries
      .every(entry => entry.origin.startsWith("sensor.example_"))).toBe(true);
    expect(energyLogStub().sources[0].entity).toBe("sensor.example_energy_log");
  });

  it.each([
    [{ sources: [] }, /at least one Energy Log source/],
    [{ categories: [] }, /at least one Energy Log category/],
    [{ categories: [{ id: "planning", label: "One" }, { id: "planning", label: "Two" }] }, /Duplicate Energy Log category ID/],
    [{ sources: [{ id: "x", entity: "not-an-entity" }] }, /valid entity ID/],
    [{ sources: [{ id: "x", entity: "sensor.example", adapter: "yaml" }] }, /adapter must/],
    [{ sources: [{ id: "x", entity: "sensor.example" }] }, /requires an attribute path/],
    [{ limit: 0 }, /between 1 and 500/],
    [{ sortOrder: "random" }, /Sort order/],
    [{ timeZone: "Not/A_Zone" }, /Invalid time zone/],
  ])("rejects invalid configuration %j", (overrides, error) => {
    expect(() => validateEnergyLogConfig({ ...config(), ...overrides })).toThrow(error);
  });

  it("maps nested attributes, sorts both ways, filters category IDs, and applies the limit", () => {
    const result = readEnergyLogEntries(config(), hass().states);
    expect(result.errors).toEqual([]);
    expect(result.validSources).toBe(1);
    expect(result.entries.map(entry => entry.title)).toEqual([
      "Sample measurement", "Sample plan", "Earlier sample",
    ]);
    const oldest = readEnergyLogEntries({ ...config(), sortOrder: "oldest", limit: 2 }, hass().states);
    expect(oldest.entries.map(entry => entry.title)).toEqual(["Earlier sample", "Sample plan"]);
    expect(oldest.entries.filter(entry => entry.category.id === "planning")).toHaveLength(2);
  });

  it("supports JSON state adapters and nested payload paths", () => {
    const state = JSON.stringify({ payload: { rows: entries } });
    const sourceConfig = {
      ...config(), sources: [{ ...config().sources[0], adapter: "state" as const, path: "payload.rows" }],
    };
    const result = readEnergyLogEntries(sourceConfig, {
      "sensor.example_activity": { state, attributes: {} },
    });
    expect(result.errors).toEqual([]);
    expect(result.validSources).toBe(1);
    expect(result.entries).toHaveLength(3);
  });

  it("accepts Unix timestamps in seconds and milliseconds", () => {
    const mapped = [
      { ...entries[0], time: 1_776_240_000 },
      { ...entries[1], time: 1_776_240_000_000 },
    ];
    const result = readEnergyLogEntries(config(), {
      "sensor.example_activity": { state: "ready", attributes: { entries: mapped } },
    });
    expect(result.entries).toHaveLength(2);
    expect(result.entries.every(entry => Number.isFinite(entry.timestamp))).toBe(true);
  });

  it("distinguishes valid empty, missing, unavailable, malformed and bad-reference sources", () => {
    const validEmpty = readEnergyLogEntries(config(), {
      "sensor.example_activity": { state: "ready", attributes: { entries: [] } },
    });
    expect(validEmpty).toMatchObject({ entries: [], errors: [], validSources: 1 });
    const missing = readEnergyLogEntries(config(), {});
    expect(missing.errors[0]).toContain("is missing");
    expect(missing.validSources).toBe(0);
    const unavailable = readEnergyLogEntries(config(), {
      "sensor.example_activity": { state: "unavailable", attributes: { entries } },
    });
    expect(unavailable.errors[0]).toContain("unavailable");
    const invalid = readEnergyLogEntries(config(), {
      "sensor.example_activity": { state: "ready", attributes: { entries: [{ time: "invalid", kind: "unknown" }] } },
    });
    expect(invalid.validSources).toBe(1);
    expect(invalid.errors.join(" ")).toContain("invalid timestamp");
    const badReference = readEnergyLogEntries(config(), {
      "sensor.example_activity": { state: "ready", attributes: { entries: [{
        time: "2026-04-15T12:00:00Z", kind: "unconfigured",
      }] } },
    });
    expect(badReference.errors[0]).toContain("unknown category");
  });
});

describe("Energy Log live card", () => {
  it("registers the picker card, editor, stub, and live entries", async () => {
    const element = await card();
    expect(customElements.get(ENERGY_LOG_TAG)).toBe(MushroomEnergyLogCard);
    expect(window.customCards?.some(item => item.type === ENERGY_LOG_TAG)).toBe(true);
    expect((await MushroomEnergyLogCard.getConfigElement()).tagName).toBe(ENERGY_LOG_EDITOR_TAG.toUpperCase());
    expect(MushroomEnergyLogCard.getStubConfig().sources[0].entity).toMatch(/^sensor\.example_/);
    expect(element.shadowRoot!.querySelectorAll(".entry")).toHaveLength(3);
    expect(element.shadowRoot!.textContent).toContain("Sample measurement");
    expect(element.shadowRoot!.textContent).toContain("sensor.example_measurement");
    expect(element.shadowRoot!.querySelector(".filters button")?.getAttribute("aria-pressed")).toBe("true");
  });

  it("filters entries by accessible category chips and hides source details when configured", async () => {
    const element = await card({ ...config(), showSource: false });
    const chip = [...element.shadowRoot!.querySelectorAll<HTMLButtonElement>(".filters button")]
      .find(button => button.textContent?.includes("Measurement"))!;
    chip.click();
    await element.updateComplete;
    expect(chip.getAttribute("aria-pressed")).toBe("true");
    expect(element.shadowRoot!.querySelectorAll(".entry")).toHaveLength(1);
    expect(element.shadowRoot!.textContent).toContain("Sample measurement");
    expect(element.shadowRoot!.querySelector("details.source")).toBeNull();
  });

  it("groups entries by configured time zone and refreshes when hass state snapshots change", async () => {
    const element = await card();
    expect(element.shadowRoot!.querySelectorAll(".day")).toHaveLength(2);
    expect(element.shadowRoot!.textContent).toContain("Europe/Amsterdam");
    element.hass = {
      ...hass(),
      states: { "sensor.example_activity": { entity_id: "sensor.example_activity", state: "ready",
        attributes: { entries: [entries[0]] } } },
    };
    await element.updateComplete;
    expect(element.shadowRoot!.querySelectorAll(".entry")).toHaveLength(1);
  });

  it("renders explicit source errors separately from a valid empty log", async () => {
    const element = await card();
    element.hass = { ...hass(), states: {
      "sensor.example_activity": { entity_id: "sensor.example_activity", state: "unavailable", attributes: {} },
    } };
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('[role="alert"]')?.textContent).toContain("unavailable");
    expect(element.shadowRoot!.querySelector(".empty")?.textContent).toContain("No valid");
    element.hass = { ...hass(), states: {
      "sensor.example_activity": { entity_id: "sensor.example_activity", state: "ready", attributes: { entries: [] } },
    } };
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('[role="alert"]')).toBeNull();
    expect(element.shadowRoot!.querySelector(".empty")?.textContent).toBe("No synthetic rows.");
  });
});

describe("Energy Log visual editor", () => {
  it("offers editable source and category controls and emits valid config changes", async () => {
    const element = await editor();
    expect(element.shadowRoot!.querySelectorAll("details")).toHaveLength(3);
    expect(forms(element).some(form => form.schema.some(item => item.name === "timestampField"))).toBe(true);
    expect(forms(element).some(form => form.schema.some(item => item.name === "color"))).toBe(true);
    const listener = vi.fn();
    element.addEventListener("config-changed", listener);
    const main = forms(element)[0];
    change(main, { title: "Updated synthetic title" });
    await element.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0][0]).toMatchObject({
      detail: { config: { title: "Updated synthetic title" } },
    });
  });

  it("shows validation errors and suppresses invalid editor output", async () => {
    const element = await editor();
    const listener = vi.fn();
    element.addEventListener("config-changed", listener);
    const categoryForm = forms(element).find(form => form.data.id === "measurement")!;
    change(categoryForm, { id: "planning", label: "Duplicate" });
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('[role="alert"]')?.textContent).toContain("Duplicate Energy Log category ID");
    expect(listener).not.toHaveBeenCalled();
  });
});
