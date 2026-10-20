import { afterEach, describe, expect, it, vi } from "vitest";
import {
  aggregateHistory,
  calculateBounds,
  interpolateThresholds,
  normalizeMiniGraphConfig,
  type MiniGraphCardConfig,
} from "../src/mini-graph";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import "../src/index";

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

const makeHass = (sendMessagePromise = vi.fn(async () => history)): HomeAssistant => ({
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
    await editor.updateComplete;
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
