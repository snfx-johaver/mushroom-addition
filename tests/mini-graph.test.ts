import { openEditorSections } from "./editor-helpers";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  aggregateHistory,
  calculateBounds,
  interpolateThresholds,
  normalizeMiniGraphConfig,
  MushroomMiniGraphCard,
  type MiniGraphCardConfig,
} from "../src/mini-graph";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import "../src/index";
import { CATALOG } from "../src/catalog";
import { createStubConfig } from "../src/stub";
import { localizeText, SUPPORTED_LOCALES } from "../src/localize";
import { graphErrorTranslations } from "../src/translations/graph-errors";

describe("Mini Graph picker examples", () => {
  const descriptor = CATALOG.find(item => item.upstreamId === "mini_graph_card")!;
  const configs = (hass: HomeAssistant, preferred: string[] = []) => [
    MushroomMiniGraphCard.getStubConfig(hass, preferred),
    createStubConfig(descriptor, hass, preferred),
  ];
  const hass: HomeAssistant = {
    states: {
      "binary_sensor.ssh": { entity_id: "binary_sensor.ssh", state: "on", attributes: {} },
      "sensor.dead_temperature": { entity_id: "sensor.dead_temperature", state: "unavailable", attributes: { device_class: "temperature" } },
      "sensor.power": { entity_id: "sensor.power", state: "500", attributes: { device_class: "power" } },
      "sensor.room_temperature": { entity_id: "sensor.room_temperature", state: "21.5", attributes: { device_class: "temperature", friendly_name: "Room temperature", unit_of_measurement: "°C" } },
    },
    callService: async () => undefined,
  };
  it("prefers a healthy temperature sensor over status entities and unavailable temperatures in both paths", () => {
    for (const config of configs(hass, ["binary_sensor.ssh", "sensor.dead_temperature"])) {
      expect(config.entity).toBe("sensor.room_temperature");
      expect(config.name).toBe("Room temperature");
      expect(config.entities?.[0]).toEqual(
        typeof config.entities?.[0] === "string" ? "sensor.room_temperature" : expect.objectContaining({ entity: "sensor.room_temperature" }),
      );
    }
  });
  it("recognizes temperature units without a device class and ignores stale preferred IDs", () => {
    const source = { ...hass, states: { ...hass.states,
      "sensor.room_temperature": { ...hass.states["sensor.room_temperature"], attributes: { unit_of_measurement: "°F" } },
    } };
    for (const config of configs(source, ["sensor.missing"])) expect(config.entity).toBe("sensor.room_temperature");
  });
  it("falls back to a finite numeric sensor rather than an empty, textual or binary sensor", () => {
    const source = { ...hass, states: Object.fromEntries(Object.entries(hass.states).filter(([id]) => !id.includes("temperature"))) };
    source.states["sensor.empty"] = { entity_id: "sensor.empty", state: " ", attributes: { device_class: "temperature" } };
    source.states["sensor.text"] = { entity_id: "sensor.text", state: "Infinity", attributes: { device_class: "temperature" } };
    for (const config of configs(source, ["sensor.empty", "sensor.text", "binary_sensor.ssh"])) expect(config.entity).toBe("sensor.power");
  });
});

const now = Date.parse("2026-10-20T00:00:00.000Z");
const history = {
  "sensor.temperature": [
    { state: "18", last_updated: "2026-10-19T20:00:00.000Z", attributes: { friendly_name: "Temperature", unit_of_measurement: "°C" } },
    { state: "20", last_updated: "2026-10-19T22:00:00.000Z", attributes: { friendly_name: "Temperature", unit_of_measurement: "°C" } },
    { state: "22", last_updated: "2026-10-20T00:00:00.000Z", attributes: { friendly_name: "Temperature", unit_of_measurement: "°C" } },
  ],
  "sensor.humidity": [
    { state: "40", last_updated: "2026-10-19T20:00:00.000Z", attributes: { friendly_name: "Humidity", unit_of_measurement: "%" } },
    { state: "45", last_updated: "2026-10-19T22:00:00.000Z", attributes: { friendly_name: "Humidity", unit_of_measurement: "%" } },
    { state: "50", last_updated: "2026-10-20T00:00:00.000Z", attributes: { friendly_name: "Humidity", unit_of_measurement: "%" } },
  ],
  "binary_sensor.window": [
    { state: "off", last_updated: "2026-10-19T20:00:00.000Z", attributes: { friendly_name: "Window" } },
    { state: "on", last_updated: "2026-10-19T22:00:00.000Z", attributes: { friendly_name: "Window" } },
  ],
};

const makeHass = (
  sendMessagePromise: (message: Record<string, unknown>) => Promise<unknown> =
    vi.fn(async () => history),
): HomeAssistant => ({
  states: {
    "sensor.temperature": {
      entity_id: "sensor.temperature",
      state: "22",
      attributes: {
        friendly_name: "Temperature",
        unit_of_measurement: "°C",
        measurements: { calibrated: 21.5 },
      },
    },
    "sensor.humidity": {
      entity_id: "sensor.humidity",
      state: "50",
      attributes: { friendly_name: "Humidity", unit_of_measurement: "%" },
    },
    "binary_sensor.window": {
      entity_id: "binary_sensor.window",
      state: "on",
      attributes: { friendly_name: "Window" },
    },
  },
  callService: async () => undefined,
  connection: {
    sendMessagePromise: sendMessagePromise as NonNullable<HomeAssistant["connection"]>["sendMessagePromise"],
    subscribeMessage: async () => () => undefined,
  },
});

const renderCard = async (
  config: MiniGraphCardConfig,
  hass = makeHass(),
) => {
  const card = document.createElement("mushroom-addition-mini-graph-card") as HTMLElement & {
    hass: HomeAssistant;
    setConfig(value: MiniGraphCardConfig): void;
    updateComplete: Promise<boolean>;
  };
  card.hass = hass;
  card.setConfig(config);
  document.body.append(card);
  await card.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
  await card.updateComplete;
  return card;
};

describe("Mini Graph configuration and history processing", () => {
  afterEach(() => {
    document.body.replaceChildren();
    localStorage.clear();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
  it("renders a real temperature history from the picker stub instead of a binary status", async () => {
    const hass = makeHass();
    const config = MushroomMiniGraphCard.getStubConfig(hass, ["binary_sensor.window"]);
    const card = await renderCard(config, hass);
    expect(config.entity).toBe("sensor.temperature");
    expect(card.shadowRoot?.querySelector("path.line")).not.toBeNull();
    expect(card.shadowRoot?.textContent).not.toContain("No recorder history");
  });

  it("provides real graph diagnostics in every supported language", () => {
    expect(Object.keys(graphErrorTranslations).sort()).toEqual([...SUPPORTED_LOCALES].sort());
    for (const locale of SUPPORTED_LOCALES) {
      for (const [key, english] of Object.entries(graphErrorTranslations.en)) {
        const translated = graphErrorTranslations[locale][key];
        expect(translated.trim(), `${locale}/${key}`).toBeTruthy();
        expect(localizeText({ ...makeHass(), language: locale }, english)).toBe(translated);
        if (locale !== "en") expect(translated, `${locale}/${key}`).not.toBe(english);
      }
    }
  });

  it("localizes empty history at render time and preserves unknown external errors", async () => {
    const hass = { ...makeHass(vi.fn(async () => ({}))), language: "nl" };
    hass.states["sensor.temperature"] = { ...hass.states["sensor.temperature"], state: "unavailable" };
    const card = await renderCard({
      type: "custom:mushroom-addition-mini-graph-card", entities: ["sensor.temperature"], cache: false,
    }, hass);
    expect(card.shadowRoot?.querySelector(".warning")?.textContent).toBe(graphErrorTranslations.nl["ui.graph.no_history"]);
    card.hass = { ...hass, language: "de" };
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".warning")?.textContent).toBe(graphErrorTranslations.de["ui.graph.no_history"]);
    const message = "Recorder connection denied (external detail)";
    const failed = await renderCard({
      type: "custom:mushroom-addition-mini-graph-card", entities: ["sensor.temperature"], cache: false,
    }, { ...makeHass(vi.fn(async () => { throw new Error(message); })), language: "nl" });
    expect(failed.shadowRoot?.querySelector(".warning")?.textContent).toBe(message);
  });

  it("localizes invalid configuration without swallowing unrelated errors", () => {
    const card = new MushroomMiniGraphCard();
    card.hass = { ...makeHass(), language: "nl" };
    expect(() => card.setConfig({ type: "custom:mushroom-addition-mini-graph-card", entities: [] }))
      .toThrow(graphErrorTranslations.nl["ui.graph.entity_required"]);
  });

  it("normalizes the documented defaults and direct entity shorthand", () => {
    expect(normalizeMiniGraphConfig({
      type: "custom:mushroom-addition-mini-graph-card",
      entities: ["sensor.temperature"],
    })).toMatchObject({
      entity: "sensor.temperature",
      entities: [{ entity: "sensor.temperature" }],
      hours_to_show: 24,
      points_per_hour: 0.5,
      aggregate_func: "avg",
      group_by: "interval",
      cache: true,
      smoothing: true,
      height: 150,
      line_width: 5,
      bar_spacing: 4,
      show: {
        graph: "line",
        fill: true,
        points: "hover",
        legend: true,
        labels: "hover",
      },
    });
  });

  it.each([
    ["avg", 4],
    ["median", 4],
    ["min", 1],
    ["max", 7],
    ["first", 1],
    ["last", 7],
    ["sum", 16],
    ["delta", 6],
    ["diff", 6],
  ] as const)("supports the %s aggregate function", (aggregate, expected) => {
    const points = [1, 3, 5, 7].map((value, index) => ({
      time: now - (3 - index) * 1000,
      value,
    }));
    expect(aggregateHistory(
      points,
      { hours_to_show: 1, points_per_hour: 0.0001, group_by: "interval" },
      aggregate,
      now,
    )[0].value).toBe(expected);
  });

  it("groups values by date and hour for the weekly energy examples", () => {
    const points = [
      { time: Date.parse("2026-10-18T08:00:00Z"), value: 3 },
      { time: Date.parse("2026-10-18T20:00:00Z"), value: 7 },
      { time: Date.parse("2026-10-19T08:00:00Z"), value: 4 },
      { time: Date.parse("2026-10-19T20:00:00Z"), value: 9 },
    ];
    expect(aggregateHistory(
      points,
      { hours_to_show: 168, points_per_hour: 0.25, group_by: "date" },
      "max",
      now,
    ).map((point) => point.value)).toEqual([7, 9]);
    expect(aggregateHistory(
      points,
      { hours_to_show: 168, points_per_hour: 0.25, group_by: "hour" },
      "sum",
      now,
    )).toHaveLength(4);
  });

  it("interpolates missing threshold values and preserves hard/soft bounds", () => {
    expect(interpolateThresholds([
      { value: 0, color: "#ff0000" },
      "#ffff00",
      "#00ff00",
      { value: 4, color: "#0000ff" },
    ])).toEqual([
      { value: 0, color: "#ff0000" },
      { value: 4 / 3, color: "#ffff00" },
      { value: 8 / 3, color: "#00ff00" },
      { value: 4, color: "#0000ff" },
    ]);
    expect(calculateBounds([20, 22], "~18", "~25", 10)).toEqual({ min: 16.5, max: 26.5 });
    expect(calculateBounds([20, 22], 0, 100)).toEqual({ min: 0, max: 100 });
    expect(calculateBounds([21])).toEqual({ min: 19.95, max: 22.05 });
  });

  it("renders the upstream single-entity and alternative-style line examples", async () => {
    const card = await renderCard({
      type: "custom:mushroom-addition-mini-graph-card",
      entities: ["sensor.temperature"],
      align_icon: "left",
      align_state: "center",
      show: { fill: false, labels: true, points: true },
      cache: false,
    });
    expect(card.shadowRoot?.querySelector("path.line")).not.toBeNull();
    expect(card.shadowRoot?.querySelector("path.fill")).toBeNull();
    expect(card.shadowRoot?.querySelector(".states")?.getAttribute("data-align")).toBe("center");
    expect(card.shadowRoot?.textContent).toContain("Temperature");
    expect(card.shadowRoot?.textContent).toContain("22");
  });

  it("renders multiple series, legend states, attributes, and a secondary axis", async () => {
    const card = await renderCard({
      type: "custom:mushroom-addition-mini-graph-card",
      name: "SERVER",
      icon: "mdi:server",
      entities: [
        { entity: "sensor.temperature", name: "TOTAL", show_legend_state: true },
        {
          entity: "sensor.humidity",
          name: "Humidity",
          y_axis: "secondary",
          show_state: true,
          show_indicator: true,
        },
        {
          entity: "sensor.temperature",
          attribute: "measurements.calibrated",
          name: "Calibrated",
          fixed_value: true,
          show_line: false,
          show_points: false,
          show_legend: false,
        },
      ],
      show: { labels: true, labels_secondary: true, legend: true },
      cache: false,
    });
    expect(card.shadowRoot?.textContent).toContain("SERVER");
    expect(card.shadowRoot?.textContent).toContain("TOTAL (22 °C)");
    expect(card.shadowRoot?.querySelectorAll(".labels")).toHaveLength(2);
    expect(card.shadowRoot?.querySelectorAll("path.line").length).toBeGreaterThanOrEqual(2);
  });

  it("renders the documented bar, threshold, average, extrema, and animation variants", async () => {
    const card = await renderCard({
      type: "custom:mushroom-addition-mini-graph-card",
      entities: [{ entity: "sensor.temperature", aggregate_func: "max" }],
      hours_to_show: 168,
      group_by: "date",
      show: {
        graph: "bar",
        labels: true,
        average: true,
        extrema: true,
      },
      color_thresholds: [
        { value: 18, color: "#f39c12" },
        { value: 21, color: "#d35400" },
        { value: 22, color: "#c0392b" },
      ],
      color_thresholds_transition: "hard",
      animate: true,
      cache: false,
    });
    expect(card.shadowRoot?.querySelectorAll("svg.chart rect").length).toBeGreaterThan(0);
    expect(card.shadowRoot?.querySelector(".animate")).not.toBeNull();
    expect(card.shadowRoot?.textContent).toContain("Average");
    expect(card.shadowRoot?.textContent).toContain("Minimum");
    expect(card.shadowRoot?.textContent).toContain("Maximum");
  });

  it("renders non-numeric binary-sensor histories through ordered state maps", async () => {
    const card = await renderCard({
      type: "custom:mushroom-addition-mini-graph-card",
      entities: ["binary_sensor.window"],
      state_map: [
        { value: "off", label: "Closed" },
        { value: "on", label: "Open" },
      ],
      show: { state: "last", labels: true },
      cache: false,
    });
    expect(card.shadowRoot?.textContent).toContain("Open");
    expect(card.shadowRoot?.querySelector("path.line")).not.toBeNull();
  });

  it("requests Home Assistant recorder history with all selected entities", async () => {
    const send = vi.fn(async () => history);
    await renderCard({
      type: "custom:mushroom-addition-mini-graph-card",
      entities: ["sensor.temperature", "sensor.humidity"],
      cache: false,
    }, makeHass(send));
    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      type: "history/history_during_period",
      entity_ids: ["sensor.temperature", "sensor.humidity"],
      no_attributes: false,
      minimal_response: false,
      significant_changes_only: false,
    }));
  });

  it("parses Home Assistant's array-of-entity-arrays history response", async () => {
    vi.spyOn(Date, "now").mockReturnValue(now);
    const send = vi.fn(async () => [
      history["sensor.temperature"],
      history["sensor.humidity"],
    ]);
    const card = await renderCard({
      type: "custom:mushroom-addition-mini-graph-card",
      entities: ["sensor.temperature", "sensor.humidity"],
      show: { points: true, legend: true },
      cache: false,
    }, makeHass(send));

    const lines = [...card.shadowRoot?.querySelectorAll("path.line") ?? []];
    expect(lines).toHaveLength(2);
    expect(lines[0].getAttribute("d")).toMatch(/^M .+ [CL] /);
    expect(card.shadowRoot?.querySelectorAll("circle.point").length).toBeGreaterThanOrEqual(6);
  });

  it("renders visible line and bar geometry for a single recorder sample", async () => {
    const sparse = [[{
      entity_id: "sensor.temperature",
      state: "21",
      last_updated: "2026-10-20T00:00:00.000Z",
      attributes: { friendly_name: "Temperature", unit_of_measurement: "°C" },
    }]];
    const line = await renderCard({
      type: "custom:mushroom-addition-mini-graph-card",
      entities: ["sensor.temperature"],
      show: { graph: "line", points: true },
      cache: false,
    }, makeHass(vi.fn(async () => sparse)));
    const linePath = line.shadowRoot?.querySelector("path.line")?.getAttribute("d") ?? "";
    expect(linePath).toContain("M 0");
    expect(linePath).toContain("L 500");

    const bar = await renderCard({
      type: "custom:mushroom-addition-mini-graph-card",
      entities: ["sensor.temperature"],
      show: { graph: "bar" },
      cache: false,
    }, makeHass(vi.fn(async () => sparse)));
    const barRects = [...bar.shadowRoot?.querySelectorAll("g.series rect") ?? []];
    expect(barRects.some((rect) => Number(rect.getAttribute("height")) > 0)).toBe(true);
    expect(barRects.every((rect) => Number(rect.getAttribute("width")) > 0)).toBe(true);
  });

  it("renders array-response state-map and attribute history series", async () => {
    vi.spyOn(Date, "now").mockReturnValue(now);
    const response = [
      [
        {
          entity_id: "binary_sensor.window",
          state: "off",
          last_updated: "2026-10-19T20:00:00.000Z",
          attributes: { friendly_name: "Window" },
        },
        {
          entity_id: "binary_sensor.window",
          state: "on",
          last_updated: "2026-10-19T22:00:00.000Z",
          attributes: { friendly_name: "Window" },
        },
      ],
      [
        {
          entity_id: "sensor.temperature",
          state: "ignored",
          last_updated: "2026-10-19T20:00:00.000Z",
          attributes: { measurements: { calibrated: 19 } },
        },
        {
          entity_id: "sensor.temperature",
          state: "ignored",
          last_updated: "2026-10-19T22:00:00.000Z",
          attributes: { measurements: { calibrated: 21 } },
        },
      ],
    ];
    const card = await renderCard({
      type: "custom:mushroom-addition-mini-graph-card",
      entities: [
        { entity: "binary_sensor.window", name: "Window" },
        { entity: "sensor.temperature", attribute: "measurements.calibrated", name: "Calibrated" },
      ],
      state_map: [
        { value: "off", label: "Night" },
        { value: "on", label: "Day" },
      ],
      show: { graph: "line", points: true, legend: true },
      cache: false,
    }, makeHass(vi.fn(async () => response)));
    expect(card.shadowRoot?.querySelectorAll("path.line")).toHaveLength(2);
    expect(card.shadowRoot?.querySelectorAll("circle.point").length).toBeGreaterThanOrEqual(4);
    expect(card.shadowRoot?.textContent).toContain("Day");
  });

  it("reuses cached history across card instances", async () => {
    const send = vi.fn(async () => history);
    const hass = makeHass(send);
    const config: MiniGraphCardConfig = {
      type: "custom:mushroom-addition-mini-graph-card",
      entities: ["sensor.temperature"],
      cache: true,
    };
    await renderCard(config, hass);
    await renderCard(config, hass);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("updates the current point locally without refetching valid recorder history", async () => {
    const send = vi.fn(async () => history);
    const card = await renderCard({
      type: "custom:mushroom-addition-mini-graph-card",
      entities: ["sensor.temperature"],
      cache: true,
    }, makeHass(send));
    expect(send).toHaveBeenCalledTimes(1);

    const changedHass = makeHass(send);
    changedHass.states["sensor.temperature"] = {
      ...changedHass.states["sensor.temperature"],
      state: "23",
      last_updated: "2026-10-20T00:01:00.000Z",
    };
    card.hass = changedHass;
    await card.updateComplete;

    expect(send).toHaveBeenCalledTimes(1);
    expect(card.shadowRoot?.textContent).toContain("23");
  });

  it("refreshes expired history after preserving live current-state updates", async () => {
    const send = vi.fn(async () => history);
    const clock = vi.spyOn(Date, "now").mockReturnValue(now);
    const card = await renderCard({
      type: "custom:mushroom-addition-mini-graph-card",
      entities: ["sensor.temperature"],
      cache: true,
    }, makeHass(send));
    const changedHass = makeHass(send);
    changedHass.states["sensor.temperature"] = {
      ...changedHass.states["sensor.temperature"],
      state: "24",
      last_updated: "2026-10-20T00:06:00.000Z",
    };
    clock.mockReturnValue(now + 301_000);
    card.hass = changedHass;
    await card.updateComplete;
    await Promise.resolve();
    await card.updateComplete;
    expect(send).toHaveBeenCalledTimes(2);
    expect(card.shadowRoot?.textContent).toContain("24");
  });

  it("coalesces equivalent concurrent recorder requests per connection", async () => {
    let resolve!: (value: unknown) => void;
    const send = vi.fn(() => new Promise((done) => { resolve = done; }));
    const hass = makeHass(send);
    const config: MiniGraphCardConfig = {
      type: "custom:mushroom-addition-mini-graph-card",
      entities: ["sensor.temperature", "sensor.humidity"],
      cache: false,
    };
    const cards = [
      document.createElement("mushroom-addition-mini-graph-card"),
      document.createElement("mushroom-addition-mini-graph-card"),
    ] as Array<HTMLElement & {
      hass: HomeAssistant;
      setConfig(value: MiniGraphCardConfig): void;
      updateComplete: Promise<boolean>;
    }>;
    for (const card of cards) {
      card.hass = hass;
      card.setConfig(config);
      document.body.append(card);
    }
    await Promise.resolve();
    expect(send).toHaveBeenCalledTimes(1);
    resolve(history);
    await Promise.all(cards.map(async (card) => {
      await card.updateComplete;
      await Promise.resolve();
      await card.updateComplete;
    }));
    expect(cards.every((card) => card.shadowRoot?.querySelectorAll("path.line").length === 2)).toBe(true);
  });

  it("does not reload recorder history for an equivalent normalized setConfig", async () => {
    const send = vi.fn(async () => history);
    const card = await renderCard({
      type: "custom:mushroom-addition-mini-graph-card",
      entities: ["sensor.temperature"],
      cache: false,
    }, makeHass(send));
    (card as unknown as MushroomMiniGraphCard).setConfig({
      type: "custom:mushroom-addition-mini-graph-card",
      entities: [{ entity: "sensor.temperature" }],
      cache: false,
    });
    await card.updateComplete;
    await Promise.resolve();
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("does not refetch when an unrelated Home Assistant entity changes", async () => {
    const send = vi.fn(async () => history);
    const card = await renderCard({
      type: "custom:mushroom-addition-mini-graph-card",
      entities: ["sensor.temperature"],
      cache: false,
    }, makeHass(send));
    const changedHass = makeHass(send);
    changedHass.states["light.unrelated"] = {
      entity_id: "light.unrelated",
      state: "on",
      attributes: { friendly_name: "Unrelated light" },
      last_updated: "2026-10-20T00:01:00.000Z",
    };
    card.hass = changedHass;
    await card.updateComplete;
    await Promise.resolve();
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("keeps explicit update intervals authoritative while polling fresh history", async () => {
    vi.useFakeTimers();
    const send = vi.fn(async () => history);
    const card = document.createElement("mushroom-addition-mini-graph-card") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(value: MiniGraphCardConfig): void;
      updateComplete: Promise<boolean>;
    };
    card.hass = makeHass(send);
    card.setConfig({
      type: "custom:mushroom-addition-mini-graph-card",
      entities: ["sensor.temperature"],
      update_interval: 60,
      cache: true,
    });
    document.body.append(card);
    await card.updateComplete;
    await Promise.resolve();
    await card.updateComplete;
    expect(send).toHaveBeenCalledTimes(1);

    const changedHass = makeHass(send);
    changedHass.states["sensor.temperature"] = {
      ...changedHass.states["sensor.temperature"],
      state: "24",
      last_updated: "2026-10-20T00:02:00.000Z",
    };
    card.hass = changedHass;
    await card.updateComplete;
    await Promise.resolve();
    expect(send).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(60_000);
    await card.updateComplete;
    expect(send).toHaveBeenCalledTimes(2);
  });

  it("dispatches Home Assistant actions from the full card surface", async () => {
    const card = await renderCard({
      type: "custom:mushroom-addition-mini-graph-card",
      entities: ["sensor.temperature"],
      tap_action: { action: "more-info" },
      cache: false,
    });
    const action = vi.fn();
    card.addEventListener("hass-action", action);
    card.shadowRoot?.querySelector("ha-card")?.dispatchEvent(new MouseEvent("click", {
      bubbles: true,
      composed: true,
      detail: 1,
    }));
    expect(action).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({ action: "tap" }),
    }));
  });
});

describe("Mini Graph graphical editor", () => {
  afterEach(() => document.body.replaceChildren());

  it("uses dropdowns and ordered repeatable editors for entities, thresholds, and state maps", async () => {
    const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
      hass: HomeAssistant;
      setConfig(config: AdditionConfig): void;
      updateComplete: Promise<boolean>;
    };
    editor.hass = makeHass();
    editor.setConfig({
      type: "custom:mushroom-addition-mini-graph-card",
      entity: "sensor.temperature",
      entities: [
        { entity: "sensor.temperature", name: "Indoor" },
        { entity: "sensor.humidity", y_axis: "secondary" },
      ] as unknown as string[],
      color_thresholds: [
        { value: 18, color: "#03a9f4" },
        { value: 24, color: "#f44336" },
      ],
      state_map: [
        { value: "off", label: "Closed" },
        { value: "on", label: "Open" },
      ],
    });
    document.body.append(editor);
    await openEditorSections(editor);
    expect(editor.shadowRoot?.querySelectorAll(".mini-graph-entity-row")).toHaveLength(2);
    expect(editor.shadowRoot?.querySelectorAll(".mini-graph-threshold-row")).toHaveLength(2);
    expect(editor.shadowRoot?.querySelectorAll(".mini-graph-state-row")).toHaveLength(2);
    expect(editor.shadowRoot?.textContent).toContain("Add graph entity");
    expect(editor.shadowRoot?.textContent).toContain("Add color threshold");
    expect(editor.shadowRoot?.textContent).toContain("Add state mapping");
    const forms = [...editor.shadowRoot?.querySelectorAll<HTMLElement & {
      schema?: Array<{ name: string; selector?: Record<string, unknown> }>;
    }>("ha-form") ?? []];
    const aggregate = forms.flatMap((form) => form.schema ?? [])
      .find((field) => field.name === "aggregate_func");
    expect(aggregate?.selector).toMatchObject({ select: { mode: "dropdown" } });
  });
});

describe("Mini Graph hover, radial and top labels", () => {
  afterEach(() => {
    document.body.replaceChildren();
    localStorage.clear();
  });
  const twoSeries: MiniGraphCardConfig = {
    type: "custom:mushroom-addition-mini-graph-card",
    entities: [{ entity: "sensor.temperature" }, { entity: "sensor.humidity" }],
  };
  it("dims other series and shows a tooltip with values while hovering the graph", async () => {
    const card = await renderCard(twoSeries);
    const graph = card.shadowRoot!.querySelector<HTMLElement>(".graph")!;
    graph.getBoundingClientRect = () => ({ left: 0, top: 0, width: 500, height: 150, right: 500, bottom: 150, x: 0, y: 0, toJSON: () => ({}) });
    graph.dispatchEvent(new MouseEvent("pointermove", { clientX: 500, clientY: 0 }));
    await card.updateComplete;
    expect(card.shadowRoot!.querySelectorAll(".series.dim")).toHaveLength(1);
    expect(card.shadowRoot!.querySelector(".tooltip")?.textContent).toContain("Humidity");
    expect(card.shadowRoot!.querySelectorAll(".dot")).toHaveLength(2);
    graph.dispatchEvent(new MouseEvent("pointerleave"));
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".tooltip")).toBeNull();
    expect(card.shadowRoot!.querySelectorAll(".series.dim")).toHaveLength(0);
  });
  it("does not draw hover dots when points are hidden", async () => {
    const card = await renderCard({ ...twoSeries, show: { points: false } });
    const graph = card.shadowRoot!.querySelector<HTMLElement>(".graph")!;
    graph.getBoundingClientRect = () => ({ left: 0, top: 0, width: 500, height: 150, right: 500, bottom: 150, x: 0, y: 0, toJSON: () => ({}) });
    graph.dispatchEvent(new MouseEvent("pointermove", { clientX: 250, clientY: 10 }));
    await card.updateComplete;
    expect(card.shadowRoot!.querySelectorAll(".dot")).toHaveLength(0);
    expect(card.shadowRoot!.querySelector(".tooltip")).not.toBeNull();
  });
  it("renders concentric radial rings with legend values and top labels", async () => {
    const card = await renderCard({ ...twoSeries, show: { graph: "radial", top_labels: true } });
    expect(card.shadowRoot!.querySelectorAll(".ring")).toHaveLength(2);
    expect(card.shadowRoot!.querySelector(".ring .arc")?.getAttribute("stroke-dasharray")).toBe("22 100");
    expect(card.shadowRoot!.querySelectorAll(".top-label")).toHaveLength(2);
    expect(card.shadowRoot!.querySelector(".legend")?.textContent).toContain("Humidity: 50 %");
  });
  it("renders pie, donut and scatter chart types", async () => {
    const pie = await renderCard({ ...twoSeries, show: { graph: "pie" } });
    expect(pie.shadowRoot!.querySelectorAll(".slice")).toHaveLength(2);
    expect(pie.shadowRoot!.querySelector(".pie-total")).toBeNull();
    const donut = await renderCard({ ...twoSeries, show: { graph: "donut" } });
    expect(donut.shadowRoot!.querySelectorAll(".slice")).toHaveLength(2);
    expect(donut.shadowRoot!.querySelector(".pie-total")).not.toBeNull();
    const scatter = await renderCard({ type: "custom:mushroom-addition-mini-graph-card", entities: ["sensor.temperature"], show: { graph: "scatter" } });
    expect(scatter.shadowRoot!.querySelector("path.line")).toBeNull();
  });
  it("lets the primary series state be hidden and shows legend state for a single series", async () => {
    const card = await renderCard({ type: "custom:mushroom-addition-mini-graph-card", entities: [{ entity: "sensor.temperature", show_state: false, show_legend_state: true }] });
    expect(card.shadowRoot!.querySelector(".state.primary")).toBeNull();
    expect(card.shadowRoot!.querySelector(".legend")?.textContent).toContain("22 °C");
  });
});
