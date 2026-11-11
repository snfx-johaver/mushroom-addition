import { afterEach, describe, expect, it, vi } from "vitest";
import "../../src/index";
import { MushroomEnergyLogCard } from "../../src/energy-cards/energy-log";
import type { MushroomAdditionEditor } from "../../src/editor";
import { openEditorSections } from "../editor-helpers";
import {
  ENERGY_LOG_TAG, energyLogStub, readEnergyLogEntries, validateEnergyLogConfig,
} from "../../src/energy-cards/energy-log-config";
import type { EnergyLogConfig } from "../../src/energy-cards/energy-log-config";
import type { HomeAssistant } from "../../src/types";
import type { EditorField } from "../../src/editor-schema";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { liveEntityChanges, mergeLogEntries, recordedEntityChanges } from "../../src/energy-cards/energy-log-changes";

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

const strategyId = "input_select.example_hems_strategy";
const planId = "sensor.example_hems_plan";
const changeConfig = (): EnergyLogConfig => ({
  ...config(),
  historyHours: 24,
  sources: [{ id: "strategy", entity: strategyId, adapter: "changes", category: "planning", name: "Strategy" }],
});
const changeState = (entity_id: string, state: string, time: number, attributes: Record<string, unknown> = {}) => ({
  entity_id, state, attributes, last_updated: new Date(time).toISOString(),
});
const changeHass = (time: number, state = "Smart saving"): HomeAssistant => ({
  ...hass(), states: { ...hass().states, [strategyId]: changeState(strategyId, state, time) },
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
  const element = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
  element.hass = hass();
  element.setConfig(initialConfig);
  document.body.append(element);
  await openEditorSections(element);
  return element;
}

type Form = HTMLElement & { data: Record<string, unknown>; schema: EditorField[] };
function forms(element: MushroomAdditionEditor): Form[] {
  return [...element.shadowRoot!.querySelectorAll<Form>("ha-form")];
}
function change(form: Form, value: Record<string, unknown>) {
  form.dispatchEvent(new CustomEvent("value-changed", { detail: { value }, bubbles: true, composed: true }));
}

afterEach(() => {
  document.body.replaceChildren();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("Energy Log configuration and data", () => {
  it("validates the documented example with synthetic IDs and payload", () => {
    const docs = readFileSync("docs/ENERGY_LOG.md", "utf8");
    const examples = [...docs.matchAll(/```yaml\r?\n([\s\S]*?)```/g)].map(match => parse(match[1]) as EnergyLogConfig);
    for (const example of examples.filter(example => example.type)) {
      expect(() => validateEnergyLogConfig(example)).not.toThrow();
    }
    expect(examples.find(example => example.sources?.[0]?.adapter === "attribute")?.sources[0].entity)
      .toBe("sensor.example_activity_log");
    const payload = examples.find(example => "entries" in example) as unknown as { entries: Array<{ origin: string }> };
    expect(payload.entries
      .every(entry => entry.origin.startsWith("sensor.example_"))).toBe(true);
    expect(energyLogStub(hass()).sources).toEqual([]);
  });

  it.each([
    [{ sources: {} }, /sources must be a list/],
    [{ categories: [] }, /at least one Energy Log category/],
    [{ categories: [{ id: "planning", label: "One" }, { id: "planning", label: "Two" }] }, /Duplicate Energy Log category ID/],
    [{ sources: [{ id: "x", entity: "not-an-entity" }] }, /valid entity ID/],
    [{ sources: [{ id: "x", entity: "sensor.example", adapter: "yaml" }] }, /adapter must/],
    [{ sources: [{ id: "x", entity: "sensor.example" }] }, /requires an attribute path/],
    [{ limit: 0 }, /between 1 and 500/],
    [{ sortOrder: "random" }, /Sort order/],
    [{ timeZone: "Not/A_Zone" }, /Invalid time zone/],
    [{ allIcon: 42 }, /All icon must be text/],
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

  it("reports timestamps outside the JavaScript date range instead of crashing rendering", () => {
    const result = readEnergyLogEntries(config(), {
      "sensor.example_activity": { state: "ready", attributes: {
        entries: [{ ...entries[0], time: 1e20 }],
      } },
    });
    expect(result.entries).toHaveLength(0);
    expect(result.errors[0]).toContain("invalid timestamp");
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
  it("updates All and category icons independently and supports clearing them", async () => {
    const element = await card({ ...config(), allIcon: "mdi:view-grid-outline" });
    const icons = () => [...element.shadowRoot!.querySelectorAll<HTMLElement & { icon: string }>(".filters button")]
      .map(button => (button.querySelector("ha-icon") as (HTMLElement & { icon: string }) | null)?.icon);
    expect(icons()).toEqual(["mdi:view-grid-outline", "mdi:clipboard-text-outline", "mdi:chart-line"]);
    element.setConfig({
      ...config(), allIcon: "mdi:format-list-bulleted",
      categories: config().categories.map(category => ({ ...category, icon: "mdi:star" })),
    });
    await element.updateComplete;
    expect(icons()).toEqual(["mdi:format-list-bulleted", "mdi:star", "mdi:star"]);
    expect([...element.shadowRoot!.querySelectorAll<HTMLElement & { icon: string }>(".badge ha-icon")]
      .every(icon => icon.icon === "mdi:star")).toBe(true);
    element.setConfig({
      ...config(), allIcon: "", categories: config().categories.map(category => ({ ...category, icon: "" })),
    });
    await element.updateComplete;
    expect(icons()).toEqual([undefined, undefined, undefined]);
    expect(element.shadowRoot!.querySelector(".badge ha-icon")).toBeNull();
    expect(element.shadowRoot!.querySelector(".filters button")?.textContent).toContain("All");
  });
  it("registers the picker card, editor, stub, and live entries", async () => {
    const element = await card();
    expect(customElements.get(ENERGY_LOG_TAG)).toBe(MushroomEnergyLogCard);
    expect(window.customCards?.some(item => item.type === ENERGY_LOG_TAG)).toBe(true);
    expect((await MushroomEnergyLogCard.getConfigElement()).tagName).toBe("MUSHROOM-ADDITION-EDITOR");
    expect(MushroomEnergyLogCard.getStubConfig(hass()).sources).toEqual([]);
    expect(element.shadowRoot!.querySelectorAll(".entry")).toHaveLength(3);
    expect(element.shadowRoot!.textContent).toContain("Sample measurement");
    expect(element.shadowRoot!.textContent).toContain("sensor.example_measurement");
    expect(element.shadowRoot!.querySelector(".filters button")?.getAttribute("aria-pressed")).toBe("true");
  });

  describe("Energy Log entity changes", () => {
    it("never opts unrelated healthy entities into Recorder history without an explicit source mapping", async () => {
      const h = changeHass(Date.now());
      delete h.states["sensor.example_activity"];
      h.states["binary_sensor.example_door"] = changeState("binary_sensor.example_door", "off", Date.now());
      h.callWS = vi.fn().mockResolvedValue({});
      expect(energyLogStub(h).sources).toEqual([]);
      expect(energyLogStub(h, [strategyId], ["binary_sensor.example_door"]).sources).toEqual([]);
      expect(energyLogStub().sources).toEqual([]);
      expect(() => validateEnergyLogConfig(energyLogStub())).not.toThrow();
      const e = document.createElement(ENERGY_LOG_TAG) as MushroomEnergyLogCard;
      e.hass = h; e.setConfig(energyLogStub(h)); document.body.append(e); await e.updateComplete;
      expect(e.shadowRoot!.querySelector(".energy-setup")).not.toBeNull();
      expect(h.callWS).not.toHaveBeenCalled();
    });

    it("still detects a compatible structured log feed without requesting Recorder history", () => {
      const h = hass();
      h.states["sensor.example_activity"].attributes.entries = [{
        timestamp: new Date().toISOString(), category: "planning", title: "Synthetic log entry",
      }];
      expect(energyLogStub(h).sources[0]).toMatchObject({ entity: "sensor.example_activity", adapter: "attribute" });
    });

    it("validates static change categories, history bounds and the distinct-entity request limit", () => {
      expect(() => validateEnergyLogConfig(changeConfig())).not.toThrow();
      expect(() => validateEnergyLogConfig({
        ...changeConfig(), sources: [{ ...changeConfig().sources[0], category: "missing" }],
      })).toThrow("category ID");
      for (const historyHours of [0, 169, NaN, "24"]) {
        expect(() => validateEnergyLogConfig({ ...changeConfig(), historyHours })).toThrow("between 1 and 168");
      }
      expect(() => validateEnergyLogConfig({ ...changeConfig(), sources: Array.from({ length: 9 }, (_, i) => ({
        ...changeConfig().sources[0], id: `source_${i}`, entity: `sensor.example_${i}`,
      })) })).toThrow("eight distinct");
    });

    it("compares baseline states, ignores metadata updates and retains actual availability transitions", () => {
      const start = Date.UTC(2026, 3, 15, 8), end = start + 3600000;
      const result = recordedEntityChanges(changeConfig(), { [strategyId]: [
        changeState(strategyId, "Solar first", start - 1000),
        changeState(strategyId, "Smart saving", start + 1000),
        changeState(strategyId, "Smart saving", start + 2000, { extra: "metadata" }),
        changeState(strategyId, "unavailable", start + 3000),
        changeState(strategyId, "Smart saving", start + 4000),
        changeState(strategyId, "Manual", end + 1000),
      ] }, start, end);
      expect(result.errors).toEqual([]);
      expect(result.entries.map(entry => entry.detail)).toEqual([
        "Solar first → Smart saving", "Smart saving → unavailable", "unavailable → Smart saving",
      ]);
      expect(result.entries[0]).toMatchObject({ title: "Strategy", timestamp: start + 1000, source: strategyId });
      expect(recordedEntityChanges(changeConfig(), {
        [strategyId]: [changeState(strategyId, "Smart saving", start + 1000)],
      }, start, end).entries).toEqual([]);
    });

    it("tracks chosen nested attributes, ignores object ordering and reports missing-history gaps", () => {
      const start = Date.UTC(2026, 3, 15, 8);
      const conf = { ...changeConfig(), sources: [{
        ...changeConfig().sources[0], entity: planId, field: "plan.block",
      }] };
      const rows = [
        changeState(planId, "ready", start - 1000, { plan: { block: { energy: 2, start: 10 } } }),
        changeState(planId, "ready", start + 1000, { plan: { block: { start: 10, energy: 2 } }, ignored: 8 }),
        changeState(planId, "ready", start + 2000, { plan: { block: { start: 10, energy: 3 } } }),
        changeState(planId, "ready", start + 3000),
        changeState(planId, "ready", start + 4000, { plan: { block: { start: 10, energy: 5 } } }),
      ];
      const result = recordedEntityChanges(conf, { [planId]: rows }, start, start + 5000);
      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].timestamp).toBe(start + 2000);
      expect(result.entries[0].description).toBe("plan.block");
      expect(result.errors.join(" ")).toContain("gaps cannot be reconstructed");
      expect(readEnergyLogEntries(conf, { [planId]: rows[3] }).errors[0]).toContain("no attribute");
      expect(liveEntityChanges(conf, { [planId]: rows[1] }, { [planId]: rows[2] }, start, start + 5000))
        .toHaveLength(1);
    });

    it("reads compact Recorder rows, rejects malformed timestamps and preserves healthy sources", () => {
      const start = Date.UTC(2026, 3, 15, 8);
      const conf = { ...changeConfig(), sources: [...changeConfig().sources, {
        ...changeConfig().sources[0], id: "bad", entity: planId,
      }] };
      const result = recordedEntityChanges(conf, {
        [strategyId]: [
          { s: "Solar first", lu: (start - 1000) / 1000, a: {} },
          { s: "Smart saving", lu: (start + 1000) / 1000, a: {} },
        ],
        [planId]: [{ state: "ready", last_updated: "not a timestamp" }],
      }, start, start + 2000);
      expect(result.entries).toHaveLength(1);
      expect(result.errors[0]).toContain("invalid Recorder");
    });

    it("merges live and recorded changes without duplicates and applies the global order and limit", () => {
      const start = Date.UTC(2026, 3, 15, 8);
      const previous = { [strategyId]: changeState(strategyId, "Solar first", start) };
      const next = { [strategyId]: changeState(strategyId, "Smart saving", start + 1000) };
      const live = liveEntityChanges(changeConfig(), previous, next, start, start + 2000);
      const recorded = recordedEntityChanges(changeConfig(), { [strategyId]: [previous[strategyId], next[strategyId]] }, start, start + 2000);
      expect(mergeLogEntries(changeConfig(), [...live, ...recorded.entries])).toHaveLength(1);
      expect(liveEntityChanges(changeConfig(), next, {
        [strategyId]: { ...next[strategyId], attributes: { irrelevant: true } },
      }, start, start + 2000)).toEqual([]);
      const newer = { ...live[0], id: "later", timestamp: start + 2000 };
      expect(mergeLogEntries({ ...changeConfig(), limit: 1 }, [...live, newer])[0].id).toBe("later");
      expect(mergeLogEntries({ ...changeConfig(), limit: 1, sortOrder: "oldest" }, [...live, newer])[0].id).toBe(live[0].id);
    });

    it("reloads recorded history after remounting and records live changes without logging the initial snapshot", async () => {
      vi.useFakeTimers();
      const now = Date.UTC(2026, 3, 15, 12);
      vi.setSystemTime(now);
      const response = { [strategyId]: [
        changeState(strategyId, "Solar first", now - 25 * 3600000),
        changeState(strategyId, "Smart saving", now - 60000),
      ] };
      const h = { ...changeHass(now - 60000), callWS: vi.fn().mockResolvedValue(response) };
      const mount = async () => {
        const e = document.createElement(ENERGY_LOG_TAG) as MushroomEnergyLogCard;
        e.hass = h; e.setConfig(changeConfig()); document.body.append(e);
        await vi.waitFor(() => expect(e.shadowRoot!.querySelectorAll(".entry")).toHaveLength(1));
        return e;
      };
      const first = await mount();
      expect(h.callWS).toHaveBeenCalledWith(expect.objectContaining({
        type: "history/history_during_period", entity_ids: [strategyId],
        minimal_response: false, no_attributes: false, significant_changes_only: false,
      }));
      first.remove();
      const second = await mount();
      expect(h.callWS).toHaveBeenCalledTimes(2);
      vi.setSystemTime(now + 1000);
      second.hass = { ...h, states: { ...h.states, [strategyId]: changeState(strategyId, "Manual", now + 1000) } };
      await second.updateComplete;
      expect(second.shadowRoot!.querySelectorAll(".entry")).toHaveLength(2);
      expect(second.shadowRoot!.querySelector(".entry .detail")?.textContent).toBe("Smart saving → Manual");
      expect(h.callService).not.toHaveBeenCalled();
    });

    it.each(["replacement", "in-place", "remount", "cleared", "callWS-only"] as const)(
      "clears recorded/live entries without cross-connection comparisons on %s",
      async mode => {
        vi.useFakeTimers();
        const now = Date.UTC(2026, 3, 15, 12);
        vi.setSystemTime(now);
        const connection = (): NonNullable<HomeAssistant["connection"]> => ({
          sendMessagePromise: vi.fn(), subscribeMessage: vi.fn(),
        });
        const h = { ...changeHass(now, "Old recorded value"), connection: mode === "callWS-only" ? undefined : connection(),
          callWS: vi.fn().mockResolvedValue({ [strategyId]: [
            changeState(strategyId, "Old baseline", now - 2000),
            changeState(strategyId, "Old recorded value", now - 1000),
          ] }) };
        const e = document.createElement(ENERGY_LOG_TAG) as MushroomEnergyLogCard;
        e.hass = h; e.setConfig(changeConfig()); document.body.append(e);
        await vi.waitFor(() => expect(e.shadowRoot!.querySelectorAll(".entry")).toHaveLength(1));
        vi.setSystemTime(now + 1000);
        e.hass = { ...h, states: { [strategyId]: changeState(strategyId, "Old live value", now + 1000) } };
        await e.updateComplete;
        expect(e.shadowRoot!.querySelectorAll(".entry")).toHaveLength(2);
        const next = { ...changeHass(now + 1000, "New baseline"), connection: mode === "callWS-only" ? undefined : connection(),
          callWS: vi.fn().mockReturnValue(new Promise(() => undefined)) };
        if (mode === "remount") {
          e.remove(); e.hass = next; document.body.append(e);
        } else if (mode === "in-place") {
          Object.assign(e.hass!, next); e.requestUpdate();
        } else {
          e.hass = mode === "cleared" ? undefined : next;
        }
        await e.updateComplete;
        expect(e.shadowRoot!.querySelectorAll(".entry")).toHaveLength(0);
        expect(e.shadowRoot!.textContent).not.toMatch(/Old recorded value|Old live value|New baseline/);
        if (mode !== "cleared") expect(next.callWS).toHaveBeenCalledOnce();
      },
    );

    it("discards an old connection's in-flight response and live changes after switching", async () => {
      vi.useFakeTimers();
      let resolve!: (value: unknown) => void;
      const pending = new Promise(yes => { resolve = yes; });
      const now = Date.now();
      vi.setSystemTime(now);
      const connection = (): NonNullable<HomeAssistant["connection"]> => ({
        sendMessagePromise: vi.fn(), subscribeMessage: vi.fn(),
      });
      const h = { ...changeHass(now, "Old baseline"), connection: connection(),
        callWS: vi.fn().mockReturnValue(pending) };
      const e = document.createElement(ENERGY_LOG_TAG) as MushroomEnergyLogCard;
      e.hass = h; e.setConfig(changeConfig()); document.body.append(e); await e.updateComplete;
      vi.setSystemTime(now + 1000);
      e.hass = { ...h, states: { [strategyId]: changeState(strategyId, "Old live value", now + 1) } };
      await e.updateComplete;
      expect(e.shadowRoot!.querySelectorAll(".entry")).toHaveLength(1);
      const next = { ...changeHass(now + 2, "New baseline"), connection: connection(),
        callWS: vi.fn().mockResolvedValue({}) };
      e.hass = next;
      await vi.waitFor(() => expect(next.callWS).toHaveBeenCalledOnce());
      resolve({ [strategyId]: [
        changeState(strategyId, "Old baseline", now - 2000),
        changeState(strategyId, "Old recorded value", now - 1000),
      ] });
      await Promise.resolve();
      await e.updateComplete;
      expect(e.shadowRoot!.querySelectorAll(".entry")).toHaveLength(0);
      expect(e.shadowRoot!.textContent).not.toMatch(/Old live value|Old recorded value/);
    });

    it("shows Recorder failures without hiding an independent log feed", async () => {
      const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
      const e = document.createElement(ENERGY_LOG_TAG) as MushroomEnergyLogCard;
      e.hass = { ...changeHass(Date.now()), callWS: vi.fn().mockRejectedValue({ code: "unauthorized", message: "Recorder unavailable" }) };
      e.setConfig({ ...changeConfig(), sources: [...changeConfig().sources, ...config().sources] });
      document.body.append(e);
      await vi.waitFor(() => expect(e.shadowRoot!.querySelector('[role="alert"]')?.textContent).toContain("Recorder unavailable"));
      expect(e.shadowRoot!.querySelectorAll(".entry")).toHaveLength(3);
      expect(warning).toHaveBeenCalledOnce();
    });

    it("discards in-flight history when source configuration changes", async () => {
      let resolve!: (value: unknown) => void;
      const pending = new Promise(yes => { resolve = yes; });
      const now = Date.now();
      const h = { ...changeHass(now), callWS: vi.fn().mockReturnValueOnce(pending).mockResolvedValue({ [planId]: [] }) };
      h.states[planId] = changeState(planId, "ready", now);
      const e = document.createElement(ENERGY_LOG_TAG) as MushroomEnergyLogCard;
      e.hass = h; e.setConfig(changeConfig()); document.body.append(e); await e.updateComplete;
      e.setConfig({ ...changeConfig(), sources: [{ ...changeConfig().sources[0], entity: planId }] });
      await e.updateComplete;
      resolve({ [strategyId]: [
        changeState(strategyId, "Solar first", now - 2000),
        changeState(strategyId, "Old private source", now - 1000),
      ] });
      await vi.waitFor(() => expect(h.callWS).toHaveBeenCalledTimes(2));
      await e.updateComplete;
      expect(e.shadowRoot!.querySelectorAll(".entry")).toHaveLength(0);
      expect(e.shadowRoot!.textContent).not.toContain("Old private source");
    });
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
    expect(element.shadowRoot!.querySelector(".empty")?.textContent).toContain("Source missing");
    element.hass = { ...hass(), states: {
      "sensor.example_activity": { entity_id: "sensor.example_activity", state: "ready", attributes: { entries: [] } },
    } };
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('[role="alert"]')).toBeNull();
    expect(element.shadowRoot!.querySelector(".empty")?.textContent).toBe("No synthetic rows.");
  });
});

describe("Energy Log visual editor", () => {
  it("roundtrips entity-change sources and offers only the configured categories", async () => {
    const element = await editor(changeConfig());
    const form = forms(element).find(form => form.schema.some(field => field.name === "sources"))!;
    const source = form.schema.find(field => field.name === "sources")!.selector!.object as {
      fields: Record<string, { default?: unknown; selector: { select?: { options: Array<{ value: string }> } } }>;
    };
    expect(source.fields.adapter.selector.select?.options.map(option => option.value)).toEqual(["changes", "attribute", "state"]);
    expect(source.fields.category.selector.select?.options.map(option => option.value)).toEqual(["planning", "measurement"]);
    expect(source.fields.category.default).toBe("planning");
    const listener = vi.fn();
    element.addEventListener("config-changed", listener);
    change(form, { ...form.data, historyHours: 48, sources: [{
      ...changeConfig().sources[0], entity: planId, field: "plan.schedule_tomorrow", name: "Proposed schedule",
    }] });
    await element.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0][0]).toMatchObject({ detail: { config: {
      historyHours: 48, sources: [expect.objectContaining({ adapter: "changes", entity: planId, field: "plan.schedule_tomorrow" })],
    } } });
  });
  it("roundtrips native All and category icon pickers without changing the heading icon", async () => {
    const element = await editor({ ...config(), icon: "mdi:lightning-bolt" });
    const featureForm = forms(element).find(form => form.schema.some(item => item.name === "categories"))!;
    expect(featureForm.schema.find(item => item.name === "allIcon")?.selector).toEqual({ icon: {} });
    const object = featureForm.schema.find(item => item.name === "categories")!.selector!.object as {
      fields: Record<string, { selector: unknown }>;
    };
    expect(object.fields.icon.selector).toEqual({ icon: {} });
    const listener = vi.fn();
    element.addEventListener("config-changed", listener);
    change(featureForm, {
      ...featureForm.data, allIcon: "mdi:view-grid-outline",
      categories: config().categories.map(category => ({ ...category, icon: "mdi:star" })),
    });
    await element.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
    const saved = (listener.mock.calls[0][0] as CustomEvent<{ config: EnergyLogConfig }>).detail.config;
    expect(saved.allIcon).toBe("mdi:view-grid-outline");
    expect(saved.categories.every(category => category.icon === "mdi:star")).toBe(true);
    expect(saved.icon).toBe("mdi:lightning-bolt");
  });
  it("offers editable source and category controls and emits valid config changes", async () => {
    const element = await editor();
    const featureForm = forms(element).find(form => form.schema.some(item => item.name === "sources"))!;
    const source = featureForm.schema.find(item => item.name === "sources")!.selector!.object as { fields: Record<string, unknown> };
    expect(source.fields).toHaveProperty("timestampField");
    const categories = featureForm.schema.find(item => item.name === "categories")!.selector!.object as { fields: Record<string, unknown> };
    expect(categories.fields).toHaveProperty("color");
    const listener = vi.fn();
    element.addEventListener("config-changed", listener);
    const main = forms(element).find(form => form.schema.some(item => item.name === "name"))!;
    change(main, { ...main.data, name: "Updated synthetic title" });
    await element.updateComplete;
    expect(listener).toHaveBeenCalledOnce();
    expect(listener.mock.calls[0][0]).toMatchObject({
      detail: { config: { name: "Updated synthetic title" } },
    });
  });

  it("shows validation errors and suppresses invalid editor output", async () => {
    const element = await editor();
    const listener = vi.fn();
    element.addEventListener("config-changed", listener);
    const categoryForm = forms(element).find(form => form.schema.some(item => item.name === "categories"))!;
    change(categoryForm, { ...categoryForm.data, categories: [{ id: "planning", label: "One" }, { id: "planning", label: "Duplicate" }] });
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('[role="alert"]')?.textContent).toContain("Duplicate Energy Log category ID");
    expect(listener).not.toHaveBeenCalled();
  });
});
