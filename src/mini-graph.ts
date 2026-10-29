import { localizeText } from "./localize";
import { LitElement, css, html, nothing, svg, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { displayName, fireEvent, stateLabel } from "./helpers";
import { renderEntityIcon } from "./entity-icon";
import { miniGraphExampleEntity } from "./stub";
import type { ActionConfig, AdditionConfig, HassEntity, HomeAssistant } from "./types";

export type MiniGraphAggregate =
  | "avg"
  | "median"
  | "min"
  | "max"
  | "first"
  | "last"
  | "sum"
  | "delta"
  | "diff";

export interface MiniGraphEntityConfig {
  entity: string;
  attribute?: string;
  name?: string;
  color?: string;
  unit?: string;
  aggregate_func?: MiniGraphAggregate;
  show_state?: boolean;
  show_legend_state?: boolean;
  show_indicator?: boolean;
  show_graph?: boolean;
  show_line?: boolean;
  show_fill?: boolean;
  show_points?: boolean;
  show_legend?: boolean;
  state_adaptive_color?: boolean;
  y_axis?: "primary" | "secondary";
  fixed_value?: boolean;
  smoothing?: boolean;
}

export interface MiniGraphThreshold {
  value?: number;
  color: string;
}

export interface MiniGraphStateMap {
  value: string;
  label?: string;
}

export interface MiniGraphShowConfig {
  name?: boolean;
  icon?: boolean;
  state?: boolean | "last";
  graph?: "line" | "bar" | "radial" | "scatter" | "pie" | "donut" | false;
  top_labels?: boolean;
  fill?: boolean | "fade";
  points?: boolean | "hover";
  legend?: boolean;
  average?: boolean;
  extrema?: boolean;
  labels?: boolean | "hover";
  labels_secondary?: boolean | "hover";
  name_adaptive_color?: boolean;
  icon_adaptive_color?: boolean;
  loading_indicator?: boolean;
}

export interface MiniGraphCardConfig extends Omit<AdditionConfig, "entities" | "name"> {
  type: string;
  entity?: string;
  entities: Array<string | MiniGraphEntityConfig>;
  name?: string;
  icon_image?: string;
  unit?: string;
  group?: boolean;
  hours_to_show?: number;
  points_per_hour?: number;
  aggregate_func?: MiniGraphAggregate;
  group_by?: "interval" | "date" | "hour";
  update_interval?: number;
  cache?: boolean;
  show?: MiniGraphShowConfig;
  animate?: boolean;
  height?: number;
  bar_spacing?: number;
  line_width?: number;
  line_color?: string | string[];
  color_thresholds?: Array<MiniGraphThreshold | string>;
  color_thresholds_transition?: "smooth" | "hard";
  decimals?: number;
  hour24?: boolean;
  font_size?: number;
  font_size_header?: number;
  align_header?: "default" | "left" | "right" | "center";
  align_icon?: "left" | "right" | "state";
  align_state?: "left" | "right" | "center";
  lower_bound?: number | string;
  upper_bound?: number | string;
  min_bound_range?: number;
  lower_bound_secondary?: number | string;
  upper_bound_secondary?: number | string;
  min_bound_range_secondary?: number;
  smoothing?: boolean;
  state_map?: MiniGraphStateMap[];
  value_factor?: number;
  logarithmic?: boolean;
}

interface GraphPoint {
  time: number;
  value: number;
  label?: string;
}

interface GraphSeries {
  config: MiniGraphEntityConfig;
  points: GraphPoint[];
  color: string;
  state?: string | number;
  unit: string;
  name: string;
}

interface PlotSeries {
  key: number;
  bar: boolean;
  points: Array<{ x: number; y: number; value: number; time: number }>;
}

interface HoverRow {
  key: number;
  fx: number;
  fy: number;
  value: number;
  time: number;
}

interface Bounds {
  min: number;
  max: number;
}

interface CachedHistory {
  fetchedAt: number;
  points: GraphPoint[];
}

type HistoryConnection = NonNullable<HomeAssistant["connection"]>;

const recorderRequests = new WeakMap<HistoryConnection, Map<string, Promise<unknown>>>();

const stableSerialize = (value: unknown): string => JSON.stringify(value, (_key, nested) => {
  if (!nested || typeof nested !== "object" || Array.isArray(nested)) return nested;
  return Object.fromEntries(Object.entries(nested as Record<string, unknown>)
    .sort(([left], [right]) => left.localeCompare(right)));
});

const coalescedRecorderRequest = (
  connection: HistoryConnection,
  key: string,
  message: Record<string, unknown>,
): Promise<unknown> => {
  let requests = recorderRequests.get(connection);
  if (!requests) {
    requests = new Map();
    recorderRequests.set(connection, requests);
  }
  const pending = requests.get(key);
  if (pending) return pending;
  const request = connection.sendMessagePromise<unknown>(message);
  requests.set(key, request);
  void request.finally(() => {
    if (requests?.get(key) === request) requests.delete(key);
  }).catch(() => undefined);
  return request;
};

const DEFAULT_COLORS = [
  "var(--accent-color, #03a9f4)",
  "#ff9800",
  "#4caf50",
  "#9c27b0",
  "#f44336",
  "#00bcd4",
];

const normalizeEntities = (config: MiniGraphCardConfig): MiniGraphEntityConfig[] => {
  const configured = Array.isArray(config.entities) ? config.entities : [];
  const entities = configured.map((entry) =>
    typeof entry === "string" ? { entity: entry } : { ...entry });
  if (!entities.length && config.entity) entities.push({ entity: config.entity });
  return entities.filter((entry) => Boolean(entry.entity));
};

const normalizeShow = (show?: MiniGraphShowConfig): Required<MiniGraphShowConfig> => ({
  name: show?.name ?? true,
  icon: show?.icon ?? true,
  state: show?.state ?? true,
  graph: show?.graph ?? "line",
  top_labels: show?.top_labels ?? false,
  fill: show?.fill ?? true,
  points: show?.points ?? "hover",
  legend: show?.legend ?? true,
  average: show?.average ?? false,
  extrema: show?.extrema ?? false,
  labels: show?.labels ?? "hover",
  labels_secondary: show?.labels_secondary ?? "hover",
  name_adaptive_color: show?.name_adaptive_color ?? false,
  icon_adaptive_color: show?.icon_adaptive_color ?? false,
  loading_indicator: show?.loading_indicator ?? true,
});

export const normalizeMiniGraphConfig = (config: MiniGraphCardConfig): MiniGraphCardConfig => {
  const entities = normalizeEntities(config);
  if (!entities.length) throw new Error("Mini Graph Card requires at least one entity.");
  return {
    ...config,
    entity: config.entity ?? entities[0].entity,
    entities,
    hours_to_show: config.hours_to_show ?? 24,
    points_per_hour: config.points_per_hour ?? 0.5,
    aggregate_func: config.aggregate_func ?? "avg",
    group_by: config.group_by ?? "interval",
    cache: config.cache ?? true,
    show: normalizeShow(config.show),
    animate: config.animate ?? false,
    height: config.height ?? 150,
    bar_spacing: config.bar_spacing ?? 4,
    line_width: config.line_width ?? 5,
    line_color: config.line_color ?? DEFAULT_COLORS[0],
    color_thresholds: interpolateThresholds(config.color_thresholds ?? []),
    color_thresholds_transition: config.color_thresholds_transition ?? "smooth",
    font_size: config.font_size ?? 100,
    font_size_header: config.font_size_header ?? 14,
    align_header: config.align_header ?? "default",
    align_icon: config.align_icon ?? "left",
    align_state: config.align_state ?? "left",
    smoothing: config.smoothing ?? true,
    state_map: config.state_map ?? [],
    value_factor: config.value_factor ?? 0,
    logarithmic: config.logarithmic ?? false,
    tap_action: config.tap_action ?? { action: "more-info" },
    hold_action: config.hold_action ?? { action: "none" },
    double_tap_action: config.double_tap_action ?? { action: "none" },
  };
};

export const interpolateThresholds = (
  values: Array<MiniGraphThreshold | string>,
): MiniGraphThreshold[] => {
  const thresholds = values.map((value) =>
    typeof value === "string" ? { color: value } : { ...value });
  let anchor = -1;
  for (let index = 0; index < thresholds.length; index += 1) {
    if (thresholds[index].value === undefined) continue;
    if (anchor >= 0 && index - anchor > 1) {
      const start = thresholds[anchor].value!;
      const end = thresholds[index].value!;
      for (let offset = anchor + 1; offset < index; offset += 1) {
        thresholds[offset].value = start + ((end - start) * (offset - anchor)) / (index - anchor);
      }
    }
    anchor = index;
  }
  return thresholds.filter((threshold): threshold is MiniGraphThreshold & { value: number } =>
    threshold.value !== undefined && Boolean(threshold.color));
};

const nestedAttribute = (entity: HassEntity | undefined, path?: string): unknown => {
  if (!path) return entity?.state;
  return path.split(".").reduce<unknown>((value, key) => {
    if (!value || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[key];
  }, entity?.attributes);
};

const mappedValue = (
  raw: unknown,
  stateMap: MiniGraphStateMap[],
): { value?: number; label?: string } => {
  const text = String(raw ?? "");
  const mappedIndex = stateMap.findIndex((item) => item.value === text);
  if (mappedIndex >= 0) {
    return {
      value: mappedIndex,
      label: stateMap[mappedIndex].label ?? stateMap[mappedIndex].value,
    };
  }
  const value = Number(raw);
  return Number.isFinite(value) ? { value } : {};
};

const aggregateValues = (values: number[], aggregate: MiniGraphAggregate): number => {
  if (!values.length) return Number.NaN;
  switch (aggregate) {
    case "median": {
      const sorted = [...values].sort((left, right) => left - right);
      const middle = Math.floor(sorted.length / 2);
      return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
    }
    case "min": return Math.min(...values);
    case "max": return Math.max(...values);
    case "first": return values[0];
    case "last": return values.at(-1)!;
    case "sum": return values.reduce((total, value) => total + value, 0);
    case "delta": return Math.max(...values) - Math.min(...values);
    case "diff": return values.at(-1)! - values[0];
    default: return values.reduce((total, value) => total + value, 0) / values.length;
  }
};

export const aggregateHistory = (
  points: GraphPoint[],
  config: Pick<MiniGraphCardConfig, "hours_to_show" | "points_per_hour" | "group_by">,
  aggregate: MiniGraphAggregate,
  now = Date.now(),
): GraphPoint[] => {
  if (!points.length) return [];
  const hours = Math.max(1, Number(config.hours_to_show ?? 24));
  const perHour = Math.max(0.01, Number(config.points_per_hour ?? 0.5));
  const start = now - hours * 3_600_000;
  const interval = 3_600_000 / perHour;
  const buckets = new Map<string, GraphPoint[]>();
  for (const point of points) {
    if (point.time < start || point.time > now || !Number.isFinite(point.value)) continue;
    const date = new Date(point.time);
    const key = config.group_by === "date"
      ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
      : config.group_by === "hour"
        ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`
        : String(Math.floor((point.time - start) / interval));
    buckets.set(key, [...(buckets.get(key) ?? []), point]);
  }
  return [...buckets.values()].map((bucket) => ({
    time: bucket.at(-1)!.time,
    value: aggregateValues(bucket.map((point) => point.value), aggregate),
    label: bucket.at(-1)?.label,
  })).sort((left, right) => left.time - right.time);
};

const parseBound = (value: number | string | undefined): { value?: number; soft: boolean } => {
  if (typeof value === "number" && Number.isFinite(value)) return { value, soft: false };
  if (typeof value !== "string") return { soft: false };
  const soft = value.trim().startsWith("~");
  const parsed = Number(value.replace(/^~/, ""));
  return { value: Number.isFinite(parsed) ? parsed : undefined, soft };
};

export const calculateBounds = (
  values: number[],
  lower?: number | string,
  upper?: number | string,
  minimumRange = 0,
): Bounds => {
  let min = values.length ? Math.min(...values) : 0;
  let max = values.length ? Math.max(...values) : 1;
  const lowerBound = parseBound(lower);
  const upperBound = parseBound(upper);
  if (lowerBound.value !== undefined) min = lowerBound.soft ? Math.min(min, lowerBound.value) : lowerBound.value;
  if (upperBound.value !== undefined) max = upperBound.soft ? Math.max(max, upperBound.value) : upperBound.value;
  if (max <= min) {
    const padding = Math.max(1, Math.abs(min) * 0.05);
    const hardLowerOnly = lowerBound.value !== undefined && !lowerBound.soft && upperBound.value === undefined;
    const hardUpperOnly = upperBound.value !== undefined && !upperBound.soft && lowerBound.value === undefined;
    if (hardLowerOnly) max = min + padding * 2;
    else if (hardUpperOnly) min = max - padding * 2;
    else {
      min -= padding;
      max += padding;
    }
  }
  if (max - min < minimumRange) {
    const midpoint = (min + max) / 2;
    min = midpoint - minimumRange / 2;
    max = midpoint + minimumRange / 2;
  }
  return { min, max };
};

const colorForValue = (
  value: number,
  thresholds: MiniGraphThreshold[],
  fallback: string,
): string => {
  let color = fallback;
  for (const threshold of thresholds) {
    if (threshold.value !== undefined && value >= threshold.value) color = threshold.color;
  }
  return color;
};

const formatNumber = (value: number, decimals?: number): string =>
  Number.isFinite(value)
    ? value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals ?? 2,
    })
    : "Unavailable";

const pathForPoints = (
  points: Array<{ x: number; y: number }>,
  smoothing: boolean,
): string => {
  if (!points.length) return "";
  if (!smoothing || points.length < 3) {
    return points.map((point, index) => `${index ? "L" : "M"} ${point.x} ${point.y}`).join(" ");
  }
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const midpoint = (previous.x + current.x) / 2;
    path += ` C ${midpoint} ${previous.y}, ${midpoint} ${current.y}, ${current.x} ${current.y}`;
  }
  return path;
};

const timestampFromHistory = (value: unknown, fallback: number): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value < 10_000_000_000 ? value * 1000 : value;
  }
  const parsed = Date.parse(String(value ?? ""));
  return Number.isFinite(parsed) ? parsed : fallback;
};

const historyRowsByEntity = (
  response: unknown,
  requestedEntities: MiniGraphEntityConfig[],
): Map<string, unknown[]> => {
  const result = new Map<string, unknown[]>();
  if (Array.isArray(response)) {
    response.forEach((group, index) => {
      if (!Array.isArray(group)) return;
      const first = group.find((row) => row && typeof row === "object") as Record<string, unknown> | undefined;
      const entityId = typeof first?.entity_id === "string"
        ? first.entity_id
        : typeof first?.e === "string"
          ? first.e
          : requestedEntities[index]?.entity;
      if (entityId) result.set(entityId, group);
    });
    return result;
  }
  if (!response || typeof response !== "object") return result;
  for (const [entityId, rows] of Object.entries(response as Record<string, unknown>)) {
    if (Array.isArray(rows)) result.set(entityId, rows);
  }
  return result;
};

export class MushroomMiniGraphCard extends LitElement {
  public static styles = css`
    :host { display: block; min-width: 0; height: 100%; }
    ha-card {
      position: relative;
      display: block;
      overflow: hidden;
      box-sizing: border-box;
      height: 100%;
      border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0));
      border-radius: var(--mush-card-primary-border-radius, 14px);
      background: var(--ha-card-background, var(--card-background-color, #fff));
      box-shadow: none;
      color: var(--primary-text-color);
      cursor: pointer;
    }
    ha-card.card-shadow { box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,.08)); }
    ha-card.group { border: 0; border-radius: 0; box-shadow: none; background: transparent; }
    .content { display: flex; flex-direction: column; box-sizing: border-box; height: 100%; overflow: hidden; gap: var(--mush-spacing, 12px); padding: var(--mush-spacing, 12px); }
    .content > * { flex: 0 0 auto; min-width: 0; }
    .content > .graph { flex: 1 1 auto; min-height: 32px; }
    .header { display: flex; align-items: center; gap: var(--mush-spacing, 12px); min-width: 0; }
    .header[data-align="left"] { justify-content: flex-start; }
    .header[data-align="right"] { justify-content: flex-end; }
    .header[data-align="center"] { justify-content: center; }
    .name { display: flex; flex-direction: column; min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: var(--mcg-title-font-weight, var(--mush-card-primary-font-weight, 500)); letter-spacing: var(--mcg-title-letter-spacing, var(--mush-card-primary-letter-spacing, .1px)); }
    .ulm-name, .ulm-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ulm-name { color: var(--mush-card-primary-color, inherit); line-height: var(--mush-card-primary-line-height, 20px); }
    .ulm-label { color: var(--mush-card-secondary-color, var(--secondary-text-color)); font-size: var(--mush-card-secondary-font-size, 12px); font-weight: var(--mush-card-secondary-font-weight, 400); line-height: var(--mush-card-secondary-line-height, 16px); letter-spacing: var(--mush-card-secondary-letter-spacing, .4px); }
    .icon { display: grid; place-items: center; flex: 0 0 auto; width: var(--mush-icon-size, 36px); height: var(--mush-icon-size, 36px); border-radius: 50%; background: color-mix(in srgb, currentColor 14%, transparent); }
    .icon img { width: var(--mush-icon-size, 36px); height: var(--mush-icon-size, 36px); object-fit: cover; border-radius: 50%; }
    .icon ha-icon, .icon ha-state-icon { --mdc-icon-size: var(--mush-icon-symbol-size, calc(var(--mush-icon-size, 36px) * .667)); }
    .states { display: flex; align-items: baseline; gap: 12px; min-width: 0; }
    .states[data-align="right"] { justify-content: flex-end; text-align: right; }
    .states[data-align="center"] { justify-content: center; text-align: center; }
    .state { display: inline-flex; align-items: baseline; gap: 3px; min-width: 0; }
    .state.primary { font-size: calc(var(--mini-graph-font-size, 100) * .01 * 32px); }
    .state.secondary { color: var(--secondary-text-color); font-size: 14px; }
    .state-value { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-variant-numeric: tabular-nums; }
    .unit { font-size: .48em; }
    .indicator { width: 8px; height: 8px; border-radius: 50%; flex: 0 0 auto; }
    .graph { position: relative; min-width: 0; }
    svg.chart { display: block; width: 100%; height: 100%; overflow: visible; }
    .series { transition: opacity .15s ease; }
    .line { fill: none; stroke-linecap: round; stroke-linejoin: round; }
    .fill { opacity: .16; }
    .fill.fade { opacity: .24; }
    .point { opacity: 1; transition: opacity .15s ease; }
    .series.dim, .ring.dim, .legend-item.dim, .top-label.dim { opacity: .22 !important; }
    .graph { touch-action: pan-y; }
    .crosshair { position: absolute; top: 0; bottom: 0; width: 1px; background: var(--divider-color, rgba(127,127,127,.5)); pointer-events: none; }
    .dot { position: absolute; width: 10px; height: 10px; margin: -5px 0 0 -5px; border-radius: 50%; border: 2px solid var(--card-background-color, #fff); box-sizing: border-box; pointer-events: none; }
    .dot.active { width: 14px; height: 14px; margin: -7px 0 0 -7px; }
    .tooltip { position: absolute; top: 0; z-index: 2; min-width: 120px; padding: 6px 10px; border-radius: 8px; pointer-events: none; background: var(--card-background-color, #fff); color: var(--primary-text-color); box-shadow: 0 2px 10px rgba(0,0,0,.25); font-size: 12px; line-height: 16px; white-space: nowrap; }
    .tooltip .time { color: var(--secondary-text-color); }
    .tooltip .row { display: flex; align-items: center; gap: 6px; opacity: .6; }
    .tooltip .row.active { opacity: 1; font-weight: 600; }
    .content.compact { position: relative; }
    .content.compact > * { position: relative; z-index: 1; }
    .content.compact > .graph:not(.radial) { position: absolute; inset: 0; z-index: 0; flex: none; min-height: 0; height: auto !important; opacity: .4; pointer-events: none; }
    .content.compact > .graph:not(.radial) .labels { display: none; }
    .content.compact.has-radial { flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: space-between; }
    .content.compact.has-radial > .graph.radial { flex: 0 0 auto; height: 100% !important; min-height: 0; margin-left: auto; }
    .radial { display: flex; justify-content: center; }
    .radial svg { height: 100%; width: auto; aspect-ratio: 1; max-width: 100%; }
    .slice { stroke: var(--card-background-color, #fff); stroke-width: 1.5; transition: opacity .15s ease; }
    .pie-total { fill: var(--primary-text-color); font-size: 22px; font-weight: 600; }
    .ring { transition: opacity .15s ease; cursor: default; }
    .ring .track { fill: none; stroke: var(--divider-color, rgba(127,127,127,.25)); opacity: .5; }
    .ring .arc { fill: none; stroke-linecap: round; transition: stroke-dasharray .4s ease; }
    .top-labels { display: flex; flex-wrap: wrap; gap: 8px 24px; }
    .top-label { display: flex; flex-direction: column; min-width: 0; transition: opacity .15s ease; }
    .top-value { font-size: calc(var(--mini-graph-font-size, 100) * .01 * 28px); font-weight: 500; line-height: 1.1; font-variant-numeric: tabular-nums; }
    .top-value small { font-size: .5em; margin-left: 2px; }
    .top-caption { color: var(--secondary-text-color); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .legend-item { transition: opacity .15s ease; }
    .labels {
      position: absolute;
      inset: 3px 4px 3px 4px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      pointer-events: none;
      color: var(--secondary-text-color);
      font-size: var(--mush-card-secondary-font-size, 12px);
      line-height: var(--mush-card-secondary-line-height, 16px);
    }
    .labels.secondary { align-items: flex-end; }
    ha-card.labels-hover .labels { opacity: 0; transition: opacity .15s ease; }
    ha-card.labels-hover .graph:hover .labels { opacity: 1; }
    .legend { display: flex; flex-wrap: wrap; gap: 7px 12px; color: var(--mush-card-secondary-color, var(--secondary-text-color)); font-size: var(--mush-card-secondary-font-size, 12px); line-height: var(--mush-card-secondary-line-height, 16px); }
    .legend-item { display: inline-flex; align-items: center; gap: 5px; min-width: 0; }
    .legend-item span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .statistics { display: flex; flex-wrap: wrap; gap: 8px 14px; color: var(--mush-card-secondary-color, var(--secondary-text-color)); font-size: var(--mush-card-secondary-font-size, 12px); line-height: var(--mush-card-secondary-line-height, 16px); }
    .statistics b { color: var(--primary-text-color); }
    .loading, .warning { display: grid; place-items: center; min-height: 90px; color: var(--secondary-text-color); font-size: 12px; text-align: center; }
    .warning { color: var(--error-color, #db4437); }
    .animate .series { animation: reveal .8s ease both; transform-origin: bottom; }
    @keyframes reveal { from { opacity: 0; transform: scaleY(.65); } }
  `;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config?: MiniGraphCardConfig;
  @state() private series: GraphSeries[] = [];
  @state() private loading = false;
  @state() private compact = false;
  private resizeObserver?: ResizeObserver;
  private lastLoad = 0;
  @state() private error?: string;
  @state() private hover?: { fx: number; bar: boolean; rows: HoverRow[] };
  @state() private active?: number;
  private plot: PlotSeries[] = [];
  private requestKey?: string;
  private configSignature?: string;
  private lastEntityStateSignature?: string;
  private historyGeneration = 0;
  private rawHistory: Record<string, GraphPoint[]> = {};
  private historyStart = 0;
  private historyEnd = 0;
  private interval?: number;
  private holdTimer?: number;
  private tapTimer?: number;
  private holdFired = false;

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement("mushroom-addition-editor");
  }

  public static getStubConfig(
    hass?: HomeAssistant,
    entities: string[] = [],
    entitiesFallback: string[] = [],
  ): MiniGraphCardConfig {
    const entity = miniGraphExampleEntity(hass, entities, entitiesFallback) ?? "sensor.example";
    return normalizeMiniGraphConfig({
      type: "custom:mushroom-addition-mini-graph-card",
      entity,
      entities: [{ entity }],
      name: hass?.states[entity]?.attributes.friendly_name,
      show: { graph: "line", fill: true, points: "hover", labels: "hover" },
    });
  }

  public setConfig(config: MiniGraphCardConfig): void {
    let normalized: MiniGraphCardConfig;
    try {
      normalized = normalizeMiniGraphConfig(config);
    } catch (error) {
      if (error instanceof Error && error.message === "Mini Graph Card requires at least one entity.") {
        throw new Error(localizeText(this.hass, error.message));
      }
      throw error;
    }
    const signature = stableSerialize(normalized);
    if (signature === this.configSignature) return;
    this.config = normalized;
    this.configSignature = signature;
    this.restartInterval();
    this.requestKey = undefined;
    this.lastEntityStateSignature = this.entityStateSignature();
    void this.loadHistory();
  }

  public getGridOptions(): { columns: number; rows: number; min_columns: number; min_rows: number } {
    return { columns: 12, rows: this.gridRows(), min_columns: 3, min_rows: 2 };
  }

  private graphStyle(): string {
    return `flex:1 1 ${this.config?.height ?? 150}px;min-height:32px`;
  }

  private gridRows(): number {
    const show = normalizeShow(this.config?.show);
    const radial = show.graph === "radial" || show.graph === "pie" || show.graph === "donut";
    const chrome = 24 + (show.name || show.icon ? 48 : 0) + (show.state ? 42 : 0) + (show.legend ? 24 : 0)
      + (show.average || show.extrema ? 24 : 0);
    const graph = Number(this.config?.height ?? 150) * (radial ? 0.9 : 0.7);
    return Math.max(2, Math.ceil((chrome + graph) / 64));
  }

  public getCardSize(): number {
    return Math.max(1, Math.ceil((Number(this.config?.height ?? 150) + 110) / 50));
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    if (!changed.has("hass") && !changed.has("config")) return;
    const signature = this.entityStateSignature();
    const relevantStateChanged =
      changed.has("hass") &&
      this.lastEntityStateSignature !== undefined &&
      signature !== this.lastEntityStateSignature;
    this.lastEntityStateSignature = signature;
    if (relevantStateChanged) {
      this.refreshCurrentStates();
      if (this.config?.update_interval) return;
    }
    void this.loadHistory();
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this.restartInterval();
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => {
        const height = this.clientHeight;
        if (height > 0 && !this.compact && height < 150) this.compact = true;
        else if (this.compact && height >= 150) this.compact = false;
      });
      this.resizeObserver.observe(this);
    }
  }

  public disconnectedCallback(): void {
    if (this.interval) window.clearInterval(this.interval);
    this.resizeObserver?.disconnect();
    super.disconnectedCallback();
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.config) return nothing;
    if (!this.hass) return html`<ha-card><div class="loading">${localizeText(this.hass, "Mini Graph preview")}</div></ha-card>`;
    const show = normalizeShow(this.config.show);
    const primary = this.series[0];
    const adaptive = primary ? colorForValue(
      Number(primary.state),
      interpolateThresholds(this.config.color_thresholds ?? []),
      primary.color,
    ) : DEFAULT_COLORS[0];
    const classes = [
      this.config.group ? "group" : "",
      this.config.card_shadow ? "card-shadow" : "",
      show.labels === "hover" || show.labels_secondary === "hover" ? "labels-hover" : "",
    ].filter(Boolean).join(" ");
    return html`
      <ha-card class=${classes} tabindex="0" role="button"
        @click=${this.tap} @dblclick=${this.doubleTap}
        @pointerdown=${this.pointerDown} @pointerup=${this.pointerUp}
        @pointercancel=${this.pointerUp} @keydown=${this.keydown}>
        <div class="content ${this.config.animate ? "animate" : ""} ${this.compact ? "compact" : ""} ${["radial", "pie", "donut"].includes(String(show.graph)) ? "has-radial" : ""}"
          style=${`--mini-graph-font-size:${this.config.font_size ?? 100}`}>
          ${this.renderHeader(primary, adaptive, show)}
          ${this.renderStates(primary, adaptive, show)}
          ${this.renderTopLabels(show)}
          ${this.loading && show.loading_indicator
            ? html`<div class="loading"><ha-spinner size="small"></ha-spinner></div>`
            : this.error
              ? html`<div class="warning">${localizeText(this.hass, this.error)}</div>`
              : this.renderGraph(show)}
          ${this.renderLegend(show)}
          ${this.renderStatistics(show)}
        </div>
      </ha-card>
    `;
  }

  private renderHeader(
    primary: GraphSeries | undefined,
    adaptive: string,
    show: Required<MiniGraphShowConfig>,
  ): TemplateResult | typeof nothing {
    if (!show.name && (!show.icon || this.config?.align_icon === "state")) return nothing;
    const icon = show.icon && this.config?.icon_type !== "none" && this.config?.align_icon !== "state"
      ? this.renderIcon(primary, adaptive, show)
      : nothing;
    const presentation = this.presentation(primary);
    return html`
      <div class="header" data-align=${this.config?.align_header ?? "default"}
        style=${this.config?.font_size_header === undefined ? "font-size:var(--mush-card-primary-font-size, 14px)" : `font-size:${this.config.font_size_header}px`}>
        ${this.config?.align_icon === "left" ? icon : nothing}
        ${show.name ? html`
          <span class="name shared-presentation" style=${show.name_adaptive_color ? `color:${adaptive}` : ""}>
            ${presentation.primary ? html`<span class="ulm-name">${presentation.primary}</span>` : nothing}
            ${presentation.secondary ? html`<span class="ulm-label">${presentation.secondary}</span>` : nothing}
          </span>
        ` : nothing}
        ${this.config?.align_icon !== "left" ? icon : nothing}
      </div>
    `;
  }

  private renderIcon(
    primary: GraphSeries | undefined,
    adaptive: string,
    show: Required<MiniGraphShowConfig>,
  ): TemplateResult {
    const entity = primary ? this.hass?.states[primary.config.entity] : undefined;
    const picture = this.config?.icon_type === "entity-picture"
      ? entity?.attributes.entity_picture
      : undefined;
    return html`
      <span class="icon" style=${show.icon_adaptive_color ? `color:${adaptive}` : ""}>
        ${this.config?.icon_image
          ? html`<img src=${this.config.icon_image} alt="">`
          : picture
            ? html`<img src=${String(picture)} alt="">`
          : renderEntityIcon(this.hass, entity, typeof this.config?.icon === "string" ? this.config.icon : undefined, "mdi:chart-line")}
      </span>
    `;
  }

  private renderStates(
    primary: GraphSeries | undefined,
    adaptive: string,
    show: Required<MiniGraphShowConfig>,
  ): TemplateResult | typeof nothing {
    if (!show.state || !primary || primary.config.show_state === false) return nothing;
    const displayed = show.state === "last" ? primary.points.at(-1)?.value : primary.state;
    const state = Number(displayed);
    const mapped = this.stateLabel(state, primary.points.at(-1)?.label);
    return html`
      <div class="states" data-align=${this.config?.align_state ?? "left"}>
        ${this.renderState(primary, mapped, adaptive, true)}
        ${this.series.slice(1).filter((entry) => entry.config.show_state).map((entry) =>
          this.renderState(
            entry,
            this.stateLabel(Number(entry.state), entry.points.at(-1)?.label),
            colorForValue(Number(entry.state), interpolateThresholds(this.config?.color_thresholds ?? []), entry.color),
            false,
          ))}
        ${show.icon && this.config?.icon_type !== "none" && this.config?.align_icon === "state"
          ? this.renderIcon(primary, adaptive, show)
          : nothing}
      </div>
    `;
  }

  private presentation(primary: GraphSeries | undefined): { primary?: string; secondary?: string } {
    if (!this.config) return {};
    const entityId = primary?.config.entity ?? this.config.entity;
    const entity = entityId ? this.hass?.states[entityId] : undefined;
    const configuredName = displayName(this.config as unknown as AdditionConfig, entity, this.hass);
    const state = stateLabel(entity, this.hass);
    const information = (selection: AdditionConfig["primary_info"] | AdditionConfig["secondary_info"]) => {
      switch (selection) {
        case "none": return undefined;
        case "state": return state;
        case "last-changed": return entity?.last_changed ? new Date(entity.last_changed).toLocaleString() : "Last changed unavailable";
        case "last-updated": return entity?.last_updated ? new Date(entity.last_updated).toLocaleString() : "Last updated unavailable";
        case "name": return configuredName;
        default: return undefined;
      }
    };
    return {
      primary: this.config.primary_info === undefined
        ? configuredName || primary?.name
        : information(this.config.primary_info as AdditionConfig["primary_info"]),
      secondary: this.config.secondary_info === undefined
        ? undefined
        : information(this.config.secondary_info as AdditionConfig["secondary_info"]),
    };
  }

  private renderState(
    series: GraphSeries,
    value: string,
    adaptive: string,
    primary: boolean,
  ): TemplateResult {
    const color = series.config.state_adaptive_color ? adaptive : "";
    return html`
      <span class="state ${primary ? "primary" : "secondary"}" style=${color ? `color:${color}` : ""}>
        ${series.config.show_indicator
          ? html`<span class="indicator" style=${`background:${adaptive}`}></span>`
          : nothing}
        <span class="state-value">${value}</span>
        <span class="unit">${series.unit}</span>
      </span>
    `;
  }

  private renderGraph(show: Required<MiniGraphShowConfig>): TemplateResult | typeof nothing {
    if (!show.graph || !this.series.some((entry) => entry.config.show_graph !== false)) return nothing;
    this.plot = [];
    if (show.graph === "radial") return this.renderRadial();
    if (show.graph === "pie" || show.graph === "donut") return this.renderPie(show.graph === "donut");
    const visible = this.series.filter((entry) => entry.config.show_graph !== false && entry.points.length);
    const primary = visible.filter((entry) => entry.config.y_axis !== "secondary");
    const secondary = visible.filter((entry) => entry.config.y_axis === "secondary");
    const primaryValues = primary.flatMap((entry) => entry.points.map((point) => point.value));
    const secondaryValues = secondary.flatMap((entry) => entry.points.map((point) => point.value));
    if (show.graph === "bar" && this.config?.lower_bound === undefined) primaryValues.push(0);
    if (show.graph === "bar" && this.config?.lower_bound_secondary === undefined) secondaryValues.push(0);
    const primaryBounds = calculateBounds(
      primaryValues,
      this.config?.lower_bound,
      this.config?.upper_bound,
      Number(this.config?.min_bound_range ?? 0),
    );
    const secondaryBounds = calculateBounds(
      secondaryValues,
      this.config?.lower_bound_secondary,
      this.config?.upper_bound_secondary,
      Number(this.config?.min_bound_range_secondary ?? 0),
    );
    const allTimes = visible.flatMap((entry) => entry.points.map((point) => point.time));
    const minTime = Math.min(...allTimes);
    const maxTime = Math.max(...allTimes);
    return html`
      <div class="graph" style=${this.graphStyle()}
        @pointermove=${this.graphMove} @pointerleave=${this.graphLeave}>
        ${show.labels && primary.length ? html`
          <div class="labels">
            <span>${this.stateLabel(primaryBounds.max)}</span>
            <span>${this.stateLabel(primaryBounds.min)}</span>
          </div>` : nothing}
        ${show.labels_secondary && secondary.length ? html`
          <div class="labels secondary">
            <span>${this.stateLabel(secondaryBounds.max)}</span>
            <span>${this.stateLabel(secondaryBounds.min)}</span>
          </div>` : nothing}
        <svg class="chart" viewBox="0 0 500 ${this.config?.height ?? 150}" preserveAspectRatio="none"
          @click=${(event: Event) => event.stopPropagation()}>
          <defs>
            ${visible.map((entry, index) => this.renderGradient(entry, index, entry.config.y_axis === "secondary" ? secondaryBounds : primaryBounds))}
          </defs>
          ${visible.map((entry, index) => this.renderSeries(
            entry,
            index,
            entry.config.y_axis === "secondary" ? secondaryBounds : primaryBounds,
            minTime,
            maxTime,
            show,
            visible.length,
          ))}
        </svg>
        ${this.renderHover(show)}
      </div>
    `;
  }

  private readonly graphMove = (event: PointerEvent): void => {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    if (!rect.width || !this.plot.length) return;
    const height = Number(this.config?.height ?? 150);
    const fx = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const svgX = fx * 500;
    const svgY = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(1, rect.height))) * height;
    const rows: HoverRow[] = [];
    let best: { key: number; distance: number } | undefined;
    for (const plotted of this.plot) {
      let nearest = plotted.points[0];
      for (const point of plotted.points) {
        if (Math.abs(point.x - svgX) < Math.abs(nearest.x - svgX)) nearest = point;
      }
      if (!nearest) continue;
      rows.push({ key: plotted.key, fx: nearest.x / 500, fy: nearest.y / height, value: nearest.value, time: nearest.time });
      const distance = Math.abs(nearest.y - svgY);
      if (!best || distance < best.distance) best = { key: plotted.key, distance };
    }
    this.hover = { fx: rows[0]?.fx ?? fx, bar: this.plot[0].bar, rows };
    this.active = best?.key;
  };

  private readonly graphLeave = (): void => {
    this.hover = undefined;
    this.active = undefined;
  };

  private renderHover(show: Required<MiniGraphShowConfig>): TemplateResult | typeof nothing {
    const hover = this.hover;
    if (!hover?.rows.length) return nothing;
    const left = hover.fx * 100;
    return html`
      ${hover.bar ? nothing : html`<div class="crosshair" style=${`left:${left}%`}></div>`}
      ${hover.bar || !show.points ? nothing : hover.rows.flatMap((row) => {
        const series = this.series[row.key];
        if (!series || series.config.show_points === false) return [];
        return [html`<span class="dot ${this.active === row.key ? "active" : ""}"
          style=${`left:${row.fx * 100}%;top:${row.fy * 100}%;background:${this.seriesColor(series)}`}></span>`];
      })}
      <div class="tooltip" style=${`left:${left}%;transform:translateX(${left > 55 ? "calc(-100% - 10px)" : "10px"})`}>
        <div class="time">${new Date(hover.rows[0].time).toLocaleString(this.hass?.language, {
          hour12: !(this.config?.hour24 ?? false),
        })}</div>
        ${hover.rows.map((row) => {
          const series = this.series[row.key];
          return series ? html`
            <div class="row ${this.active === row.key ? "active" : ""}">
              <span class="indicator" style=${`background:${this.seriesColor(series)}`}></span>
              <span>${series.name}: ${this.stateLabel(row.value)}${series.unit ? ` ${series.unit}` : ""}</span>
            </div>` : nothing;
        })}
      </div>
    `;
  }

  private seriesColor(series: GraphSeries): string {
    if (series.config.color) return series.color;
    return colorForValue(Number(series.state), interpolateThresholds(this.config?.color_thresholds ?? []), series.color);
  }

  private classFor(key: number): string {
    return this.active === undefined ? "" : this.active === key ? "active" : "dim";
  }

  private renderRadial(): TemplateResult | typeof nothing {
    const rings = this.series
      .map((entry, key) => ({ entry, key }))
      .filter(({ entry }) => entry.config.show_graph !== false && Number.isFinite(Number(entry.state)));
    if (!rings.length) return nothing;
    const lower = Number.isFinite(Number(this.config?.lower_bound)) && this.config?.lower_bound !== undefined
      ? Number(this.config.lower_bound) : 0;
    const upperRaw = Number(this.config?.upper_bound);
    const upper = this.config?.upper_bound !== undefined && Number.isFinite(upperRaw) && upperRaw > lower ? upperRaw : 100;
    const stroke = Math.max(6, Math.min(18, Math.floor(70 / rings.length)));
    const step = stroke + 5;
    return html`
      <div class="graph radial" style=${this.graphStyle()} @pointerleave=${this.graphLeave}>
        <svg viewBox="0 0 200 200" @click=${(event: Event) => event.stopPropagation()}>
          ${rings.flatMap(({ entry, key }, index) => {
            const radius = 100 - stroke / 2 - 2 - index * step;
            if (radius < 6) return [];
            const percent = Math.max(0, Math.min(100, ((Number(entry.state) - lower) / (upper - lower)) * 100));
            const color = this.seriesColor(entry);
            return [svg`
              <g class="ring ${this.classFor(key)}" @pointerenter=${() => { this.active = key; }}>
                <circle class="track" cx="100" cy="100" r=${radius} stroke-width=${stroke}/>
                ${percent > 0 ? svg`<circle class="arc" cx="100" cy="100" r=${radius} stroke-width=${stroke}
                  pathLength="100" stroke-dasharray=${`${percent} 100`} stroke=${color}
                  transform="rotate(-90 100 100)"/>` : nothing}
                <title>${entry.name}: ${this.stateLabel(Number(entry.state))}${entry.unit ? ` ${entry.unit}` : ""}</title>
              </g>`];
          })}
        </svg>
      </div>
    `;
  }

  private renderPie(donut: boolean): TemplateResult | typeof nothing {
    const slices = this.series
      .map((entry, key) => ({ entry, key, value: Math.max(0, Number(entry.state)) }))
      .filter(({ entry, value }) => entry.config.show_graph !== false && Number.isFinite(value) && value > 0);
    const total = slices.reduce((sum, slice) => sum + slice.value, 0);
    if (!total) return nothing;
    const outer = 96;
    const inner = donut ? 58 : 0;
    const point = (angle: number, radius: number): string =>
      `${100 + radius * Math.cos(angle)} ${100 + radius * Math.sin(angle)}`;
    let start = -Math.PI / 2;
    const unit = this.series[0]?.unit ?? "";
    return html`
      <div class="graph radial" style=${this.graphStyle()} @pointerleave=${this.graphLeave}>
        <svg viewBox="0 0 200 200" @click=${(event: Event) => event.stopPropagation()}>
          ${slices.map(({ entry, key, value }) => {
            const sweep = Math.min(value / total, 0.99999) * Math.PI * 2;
            const end = start + sweep;
            const large = sweep > Math.PI ? 1 : 0;
            const d = donut
              ? `M ${point(start, outer)} A ${outer} ${outer} 0 ${large} 1 ${point(end, outer)} L ${point(end, inner)} A ${inner} ${inner} 0 ${large} 0 ${point(start, inner)} Z`
              : `M 100 100 L ${point(start, outer)} A ${outer} ${outer} 0 ${large} 1 ${point(end, outer)} Z`;
            start = end;
            return svg`
              <path class="slice ring ${this.classFor(key)}" d=${d} fill=${this.seriesColor(entry)}
                @pointerenter=${() => { this.active = key; }}>
                <title>${entry.name}: ${this.stateLabel(value)}${entry.unit ? ` ${entry.unit}` : ""} (${Math.round((value / total) * 100)}%)</title>
              </path>`;
          })}
          ${donut ? svg`<text class="pie-total" x="100" y="106" text-anchor="middle">${this.stateLabel(
            Math.round(total * 100) / 100)}${unit ? ` ${unit}` : ""}</text>` : nothing}
        </svg>
      </div>
    `;
  }

  private renderTopLabels(show: Required<MiniGraphShowConfig>): TemplateResult | typeof nothing {
    if (!show.top_labels || !this.series.length) return nothing;
    return html`
      <div class="top-labels">
        ${this.series.map((entry, key) => html`
          <div class="top-label ${this.classFor(key)}" style=${`color:${this.seriesColor(entry)}`}
            @pointerenter=${() => { this.active = key; }} @pointerleave=${this.graphLeave}>
            <span class="top-value">${this.stateLabel(Number(entry.state), entry.points.at(-1)?.label)}${entry.unit ? html`<small>${entry.unit}</small>` : nothing}</span>
            <span class="top-caption">${entry.name}</span>
          </div>`)}
      </div>
    `;
  }

  private renderGradient(series: GraphSeries, index: number, bounds: Bounds): TemplateResult {
    const thresholds = interpolateThresholds(this.config?.color_thresholds ?? []);
    const transition = this.config?.color_thresholds_transition ?? "smooth";
    if (!thresholds.length || series.config.color) {
      return svg`<linearGradient id=${`mini-graph-${index}`}><stop offset="0%" stop-color=${series.color}/><stop offset="100%" stop-color=${series.color}/></linearGradient>`;
    }
    const stops = thresholds.flatMap((threshold, thresholdIndex) => {
      const offset = Math.max(0, Math.min(100, (((threshold.value ?? bounds.min) - bounds.min) / (bounds.max - bounds.min)) * 100));
      if (transition === "hard" && thresholdIndex > 0) {
        return [
          svg`<stop offset=${`${offset}%`} stop-color=${thresholds[thresholdIndex - 1].color}/>`,
          svg`<stop offset=${`${offset}%`} stop-color=${threshold.color}/>`,
        ];
      }
      return [svg`<stop offset=${`${offset}%`} stop-color=${threshold.color}/>`];
    });
    return svg`<linearGradient id=${`mini-graph-${index}`} x1="0" y1="1" x2="0" y2="0">${stops}</linearGradient>`;
  }

  private renderSeries(
    series: GraphSeries,
    index: number,
    bounds: Bounds,
    minTime: number,
    maxTime: number,
    show: Required<MiniGraphShowConfig>,
    seriesCount: number,
  ): TemplateResult {
    const height = Number(this.config?.height ?? 150);
    const scaleValue = (value: number): number => {
      const transformed = this.config?.logarithmic ? Math.log10(Math.max(value, Number.EPSILON)) : value;
      const transformedMin = this.config?.logarithmic ? Math.log10(Math.max(bounds.min, Number.EPSILON)) : bounds.min;
      const transformedMax = this.config?.logarithmic ? Math.log10(Math.max(bounds.max, Number.EPSILON)) : bounds.max;
      return height - ((transformed - transformedMin) / Math.max(Number.EPSILON, transformedMax - transformedMin)) * height;
    };
    const singleTimestamp = minTime === maxTime;
    const plotted = series.points.map((point) => ({
      x: singleTimestamp ? 250 : ((point.time - minTime) / Math.max(1, maxTime - minTime)) * 500,
      y: scaleValue(point.value),
      value: point.value,
      time: point.time,
    }));
    const key = this.series.indexOf(series);
    const dim = this.classFor(key);
    const color = series.config.color ? series.color : `url(#mini-graph-${index})`;
    if (show.graph === "bar") {
      const slot = 500 / Math.max(1, Math.min(96, plotted.length));
      const spacing = Number(this.config?.bar_spacing ?? 4);
      const width = Math.max(1, (slot - spacing) / seriesCount);
      const baseline = Math.max(0, Math.min(height, scaleValue(0)));
      const bars = plotted.slice(-96);
      this.plot.push({
        key,
        bar: true,
        points: bars.map((point, pointIndex) => ({ ...point, x: pointIndex * slot + slot / 2 })),
      });
      return svg`
        <g class="series ${dim}">
          ${bars.map((point, pointIndex) => {
            const x = pointIndex * slot + index * width + spacing / 2;
            const y = Math.min(point.y, baseline);
            return svg`<rect x=${x} y=${y} width=${width} height=${Math.abs(baseline - point.y)} rx="1" fill=${color}>
              <title>${this.tooltip(series, point.value, point.time)}</title>
            </rect>`;
          })}
        </g>
      `;
    }
    this.plot.push({ key, bar: false, points: plotted });
    const linePoints = plotted.length === 1
      ? [{ ...plotted[0], x: 0 }, { ...plotted[0], x: 500 }]
      : plotted;
    const path = pathForPoints(linePoints, series.config.smoothing ?? this.config?.smoothing ?? true);
    const fillPath = plotted.length
      ? `${path} L ${linePoints.at(-1)!.x} ${height} L ${linePoints[0].x} ${height} Z`
      : "";
    return svg`
      <g class="series ${dim}">
        ${show.fill && series.config.show_fill !== false
          ? svg`<path class="fill ${show.fill === "fade" ? "fade" : ""}" d=${fillPath} fill=${color}/>`
          : nothing}
        ${series.config.show_line !== false && show.graph !== "scatter"
          ? svg`<path class="line" d=${path} stroke=${color} stroke-width=${this.config?.line_width ?? 5}/>`
          : nothing}
        ${(show.points === true || show.graph === "scatter") && series.config.show_points !== false
          ? plotted.map((point) => svg`
            <circle class="point" cx=${point.x} cy=${point.y} r=${Math.max(2, Number(this.config?.line_width ?? 5) / 1.5)}
              fill=${series.config.color ?? color}>
              <title>${this.tooltip(series, point.value, point.time)}</title>
            </circle>`)
          : nothing}
      </g>
    `;
  }

  private renderLegend(show: Required<MiniGraphShowConfig>): TemplateResult | typeof nothing {
    const visible = this.series
      .map((entry, key) => ({ entry, key }))
      .filter(({ entry }) => entry.config.show_legend !== false);
    const radial = show.graph === "radial" || show.graph === "pie" || show.graph === "donut";
    if (!show.legend || !visible.length) return nothing;
    if (visible.length < 2 && !radial && !visible.some(({ entry }) => entry.config.show_legend_state)) return nothing;
    return html`
      <div class="legend" @pointerleave=${this.graphLeave}>
        ${visible.map(({ entry, key }) => html`
          <span class="legend-item ${this.classFor(key)}" @pointerenter=${() => { this.active = key; }}>
            <span class="indicator" style=${`background:${this.seriesColor(entry)}`}></span>
            <span>${entry.name}${radial
              ? `: ${this.stateLabel(Number(entry.state))}${entry.unit ? ` ${entry.unit}` : ""}`
              : entry.config.show_legend_state
                ? ` (${this.stateLabel(Number(entry.state))}${entry.unit ? ` ${entry.unit}` : ""})`
                : ""}</span>
          </span>
        `)}
      </div>
    `;
  }

  private renderStatistics(show: Required<MiniGraphShowConfig>): TemplateResult | typeof nothing {
    const primary = this.series[0];
    if (!primary || (!show.average && !show.extrema) || !primary.points.length) return nothing;
    const values = primary.points.map((point) => point.value);
    const average = aggregateValues(values, "avg");
    const min = Math.min(...values);
    const max = Math.max(...values);
    return html`
      <div class="statistics">
        ${show.average ? html`<span>${localizeText(this.hass, "Average")}<b>${this.stateLabel(average)} ${primary.unit}</b></span>` : nothing}
        ${show.extrema ? html`
          <span>${localizeText(this.hass, "Minimum")}<b>${this.stateLabel(min)} ${primary.unit}</b></span>
          <span>${localizeText(this.hass, "Maximum")}<b>${this.stateLabel(max)} ${primary.unit}</b></span>
        ` : nothing}
      </div>
    `;
  }

  private stateLabel(value: number, mappedLabel?: string): string {
    if (mappedLabel) return mappedLabel;
    const mapped = this.config?.state_map?.[Math.round(value)];
    if (mapped && Math.abs(value - Math.round(value)) < Number.EPSILON) return mapped.label ?? mapped.value;
    return formatNumber(value, this.config?.decimals);
  }

  private tooltip(series: GraphSeries, value: number, time: number): string {
    const formatted = new Date(time).toLocaleString(this.hass?.language, {
      hour12: !(this.config?.hour24 ?? false),
    });
    return `${series.name}: ${this.stateLabel(value)}${series.unit ? ` ${series.unit}` : ""} · ${formatted}`;
  }

  private restartInterval(): void {
    if (this.interval) window.clearInterval(this.interval);
    this.interval = undefined;
    if (!this.isConnected || !this.config?.update_interval) return;
    this.interval = window.setInterval(() => {
      void this.loadHistory(true);
    }, this.config.update_interval * 1000);
  }

  private entityStateSignature(): string | undefined {
    if (!this.hass || !this.config) return undefined;
    return JSON.stringify(normalizeEntities(this.config).map((entityConfig) => {
      const entity = this.hass?.states[entityConfig.entity];
      return {
        entity: entityConfig.entity,
        attribute: entityConfig.attribute,
        value: nestedAttribute(entity, entityConfig.attribute),
        lastChanged: entity?.last_changed,
        lastUpdated: entity?.last_updated,
      };
    }));
  }

  private cacheMaxAge(): number {
    return Math.max(60, Number(this.config?.update_interval ?? 300)) * 1000;
  }

  private refreshCurrentStates(): void {
    if (!this.config || !this.historyEnd) return;
    this.series = normalizeEntities(this.config).map((entityConfig, index) =>
      this.buildSeries(
        entityConfig,
        index,
        this.rawHistory[this.historyKey(entityConfig)] ?? [],
        this.historyStart,
        Date.now(),
      ));
  }

  private async loadHistory(forceRefresh = false): Promise<void> {
    if (!this.hass || !this.config) return;
    const entities = normalizeEntities(this.config);
    const currentKey = stableSerialize({
      entities,
      hours: this.config.hours_to_show,
      points: this.config.points_per_hour,
      grouping: this.config.group_by,
      factor: this.config.value_factor,
      map: this.config.state_map,
    });
    if (
      !forceRefresh &&
      currentKey === this.requestKey &&
      Date.now() - this.lastLoad <= this.cacheMaxAge()
    ) return;
    this.requestKey = currentKey;
    const generation = ++this.historyGeneration;
    this.lastLoad = Date.now();
    this.loading = !this.series.length;
    this.error = undefined;
    try {
      const end = Date.now();
      const start = end - Number(this.config.hours_to_show ?? 24) * 3_600_000;
      const rawHistory = await this.fetchHistory(entities, start, end, forceRefresh, generation);
      if (generation !== this.historyGeneration) return;
      this.rawHistory = rawHistory;
      this.historyStart = start;
      this.historyEnd = end;
      this.series = entities.map((entityConfig, index) =>
        this.buildSeries(entityConfig, index, rawHistory[this.historyKey(entityConfig)] ?? [], start, end));
      this.error = this.series.some((entry) => entry.points.length)
        ? undefined
        : "No recorder history is available for the selected entities.";
    } catch (error) {
      if (generation !== this.historyGeneration) return;
      this.error = error instanceof Error ? error.message : "Unable to load recorder history.";
      console.warn("Mushroom Cards Addition: unable to load Mini Graph history", error);
    } finally {
      if (generation === this.historyGeneration) this.loading = false;
    }
  }

  private async fetchHistory(
    entities: MiniGraphEntityConfig[],
    start: number,
    end: number,
    bypassCache: boolean,
    generation: number,
  ): Promise<Record<string, GraphPoint[]>> {
    const result: Record<string, GraphPoint[]> = {};
    const needsFetch: MiniGraphEntityConfig[] = [];
    for (const entity of entities) {
      if (entity.fixed_value) continue;
      const cached = bypassCache ? undefined : this.readCache(entity, start);
      if (cached) result[this.historyKey(entity)] = cached;
      else needsFetch.push(entity);
    }
    if (!needsFetch.length) return result;
    if (!this.hass?.connection?.sendMessagePromise) {
      for (const entity of needsFetch) result[this.historyKey(entity)] = this.attributeHistory(entity);
      return result;
    }
    const entityIds = [...new Set(needsFetch.map((entity) => entity.entity))];
    const message = {
      type: "history/history_during_period",
      start_time: new Date(start).toISOString(),
      end_time: new Date(end).toISOString(),
      entity_ids: entityIds,
      no_attributes: false,
      minimal_response: false,
      significant_changes_only: false,
    };
    const response = await coalescedRecorderRequest(
      this.hass.connection,
      stableSerialize({
        entityIds: [...entityIds].sort(),
        hours: this.config?.hours_to_show,
      }),
      message,
    );
    const history = historyRowsByEntity(response, needsFetch);
    if (generation !== this.historyGeneration) return result;
    for (const entity of needsFetch) {
      const rows = history.get(entity.entity) ?? [];
      const points = rows.flatMap((row) => {
        if (!row || typeof row !== "object") return [];
        const record = row as Record<string, unknown>;
        const state = record.state ?? record.s;
        const attributes = (record.attributes ?? record.a ?? {}) as Record<string, unknown>;
        const raw = entity.attribute
          ? entity.attribute.split(".").reduce<unknown>((value, key) =>
            value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined, attributes)
          : state;
        const mapped = mappedValue(raw, this.config?.state_map ?? []);
        const timestamp = timestampFromHistory(
          record.last_updated ?? record.last_changed ?? record.lu ?? record.lc,
          end,
        );
        return mapped.value === undefined || !Number.isFinite(timestamp)
          ? []
          : [{ time: timestamp, value: mapped.value, label: mapped.label }];
      });
      result[this.historyKey(entity)] = points.length ? points : this.attributeHistory(entity);
      this.writeCache(entity, result[this.historyKey(entity)]);
    }
    return result;
  }

  private attributeHistory(entityConfig: MiniGraphEntityConfig): GraphPoint[] {
    const entity = this.hass?.states[entityConfig.entity];
    const history = entity?.attributes.history;
    if (Array.isArray(history)) {
      const now = Date.now();
      return history.flatMap((entry, index) => {
        const raw = typeof entry === "object" && entry
          ? (entry as Record<string, unknown>).value ?? (entry as Record<string, unknown>).state
          : entry;
        const mapped = mappedValue(raw, this.config?.state_map ?? []);
        const time = typeof entry === "object" && entry
          ? Date.parse(String((entry as Record<string, unknown>).time ?? (entry as Record<string, unknown>).last_changed ?? ""))
          : Number.NaN;
        return mapped.value === undefined ? [] : [{
          time: Number.isFinite(time)
            ? time
            : now - (history.length - index - 1) * 3_600_000 / Number(this.config?.points_per_hour ?? 0.5),
          value: mapped.value,
          label: mapped.label,
        }];
      });
    }
    const mapped = mappedValue(nestedAttribute(entity, entityConfig.attribute), this.config?.state_map ?? []);
    return mapped.value === undefined ? [] : [{ time: Date.now(), value: mapped.value, label: mapped.label }];
  }

  private buildSeries(
    entityConfig: MiniGraphEntityConfig,
    index: number,
    history: GraphPoint[],
    start: number,
    end: number,
  ): GraphSeries {
    const entity = this.hass?.states[entityConfig.entity];
    const current = mappedValue(nestedAttribute(entity, entityConfig.attribute), this.config?.state_map ?? []);
    const factor = 10 ** Number(this.config?.value_factor ?? 0);
    const currentTime = Date.parse(entity?.last_updated ?? entity?.last_changed ?? "") || end;
    const historyWithCurrent = current.value === undefined
      ? history
      : [
        ...history.filter((point) => point.time !== currentTime),
        { time: currentTime, value: current.value, label: current.label },
      ];
    const source = entityConfig.fixed_value && current.value !== undefined
      ? [{ time: start, value: current.value }, { time: end, value: current.value }]
      : historyWithCurrent;
    const scaled = source.map((point) => ({ ...point, value: point.value * factor }));
    const points = aggregateHistory(
      scaled,
      this.config ?? {},
      entityConfig.aggregate_func ?? this.config?.aggregate_func ?? "avg",
      end,
    );
    const configuredColors = Array.isArray(this.config?.line_color)
      ? this.config.line_color
      : [this.config?.line_color ?? DEFAULT_COLORS[0]];
    return {
      config: entityConfig,
      points,
      color: entityConfig.color ?? configuredColors[index] ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length],
      state: current.value === undefined ? entity?.state : current.value * factor,
      unit: entityConfig.unit ?? this.config?.unit ?? String(entity?.attributes.unit_of_measurement ?? ""),
      name: entityConfig.name ?? String(entity?.attributes.friendly_name ?? entityConfig.entity),
    };
  }

  private cacheKey(entity: MiniGraphEntityConfig): string {
    return `mushroom-mini-graph:${this.historyKey(entity)}:${this.config?.hours_to_show}:${this.config?.points_per_hour}:${JSON.stringify(this.config?.state_map ?? [])}`;
  }

  private historyKey(entity: MiniGraphEntityConfig): string {
    return JSON.stringify([entity.entity, entity.attribute ?? null]);
  }

  private readCache(entity: MiniGraphEntityConfig, start: number): GraphPoint[] | undefined {
    if (!this.config?.cache || typeof localStorage === "undefined") return undefined;
    try {
      const cached = JSON.parse(localStorage.getItem(this.cacheKey(entity)) ?? "null") as CachedHistory | null;
      if (
        !cached ||
        Date.now() - cached.fetchedAt > this.cacheMaxAge()
      ) return undefined;
      return cached.points.filter((point) => point.time >= start);
    } catch {
      return undefined;
    }
  }

  private writeCache(entity: MiniGraphEntityConfig, points: GraphPoint[]): void {
    if (!this.config?.cache || typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(this.cacheKey(entity), JSON.stringify({
        fetchedAt: Date.now(),
        points,
      } satisfies CachedHistory));
    } catch (error) {
      console.warn("Mushroom Cards Addition: unable to cache Mini Graph history", error);
    }
  }

  private readonly keydown = (event: KeyboardEvent): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.runAction("tap_action");
    }
  };

  private readonly pointerDown = (): void => {
    this.holdFired = false;
    this.holdTimer = window.setTimeout(() => {
      this.holdFired = true;
      this.runAction("hold_action");
    }, 500);
  };

  private readonly pointerUp = (): void => {
    if (this.holdTimer) window.clearTimeout(this.holdTimer);
    this.holdTimer = undefined;
  };

  private readonly tap = (event: MouseEvent): void => {
    if (this.holdFired) {
      this.holdFired = false;
      return;
    }
    if (event.detail > 1) return;
    const doubleTapAction = this.config?.double_tap_action as ActionConfig | undefined;
    if (doubleTapAction?.action && doubleTapAction.action !== "none") {
      if (this.tapTimer) window.clearTimeout(this.tapTimer);
      this.tapTimer = window.setTimeout(() => this.runAction("tap_action"), 300);
      return;
    }
    this.runAction("tap_action");
  };

  private readonly doubleTap = (): void => {
    if (this.tapTimer) window.clearTimeout(this.tapTimer);
    this.tapTimer = undefined;
    this.runAction("double_tap_action");
  };

  private runAction(key: "tap_action" | "hold_action" | "double_tap_action"): void {
    if (!this.config) return;
    const action = key === "tap_action" ? "tap" : key === "hold_action" ? "hold" : "double_tap";
    const selected = this.config[key] as ActionConfig | undefined;
    const entity = typeof selected?.entity === "string" ? selected.entity : this.config.entity;
    fireEvent(this, "hass-action", {
      config: { ...this.config, entity },
      action,
    });
  }
}
