import { LitElement, css, html, nothing, svg, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { displayName, fireEvent, stateLabel } from "./helpers";
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
  graph?: "line" | "bar" | false;
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

interface Bounds {
  min: number;
  max: number;
}

interface CachedHistory {
  fetchedAt: number;
  stateSignature: string;
  points: GraphPoint[];
}

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
    align_icon: config.align_icon ?? "right",
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
    :host { display: block; min-width: 0; }
    ha-card {
      position: relative;
      display: block;
      overflow: hidden;
      border: 0;
      border-radius: var(--mush-card-primary-border-radius, 14px);
      background: var(--ha-card-background, var(--card-background-color, #fff));
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,.08));
      color: var(--primary-text-color);
      cursor: pointer;
    }
    ha-card.group { border-radius: 0; box-shadow: none; background: transparent; }
    .content { display: grid; gap: 10px; padding: 14px; }
    .header { display: flex; align-items: center; gap: 10px; min-width: 0; }
    .header[data-align="left"] { justify-content: flex-start; }
    .header[data-align="right"] { justify-content: flex-end; }
    .header[data-align="center"] { justify-content: center; }
    .name { min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: var(--mcg-title-font-weight, 500); letter-spacing: var(--mcg-title-letter-spacing); }
    .icon { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; background: color-mix(in srgb, currentColor 14%, transparent); }
    .icon img { width: 25px; height: 25px; object-fit: contain; border-radius: 50%; }
    .icon ha-icon { --mdc-icon-size: 20px; }
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
    svg.chart { display: block; width: 100%; overflow: visible; }
    .series { transition: opacity .15s ease; }
    .line { fill: none; stroke-linecap: round; stroke-linejoin: round; }
    .fill { opacity: .16; }
    .fill.fade { opacity: .24; }
    .point { opacity: 1; transition: opacity .15s ease; }
    ha-card.points-hover .point { opacity: 0; }
    ha-card.points-hover .point:hover { opacity: 1; }
    .labels {
      position: absolute;
      inset: 3px 4px 3px 4px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      pointer-events: none;
      color: var(--secondary-text-color);
      font-size: 10px;
    }
    .labels.secondary { align-items: flex-end; }
    ha-card.labels-hover .labels { opacity: 0; transition: opacity .15s ease; }
    ha-card.labels-hover .graph:hover .labels { opacity: 1; }
    .legend { display: flex; flex-wrap: wrap; gap: 7px 12px; color: var(--secondary-text-color); font-size: 11px; }
    .legend-item { display: inline-flex; align-items: center; gap: 5px; min-width: 0; }
    .legend-item span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .statistics { display: flex; flex-wrap: wrap; gap: 8px 14px; color: var(--secondary-text-color); font-size: 11px; }
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
  @state() private error?: string;
  private requestKey?: string;
  private lastEntityStateSignature?: string;
  private historyGeneration = 0;
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
    const available = [...entities, ...entitiesFallback, ...Object.keys(hass?.states ?? {})];
    const entity = available.find((id) =>
      (id.startsWith("sensor.") || id.startsWith("binary_sensor.")) &&
      !["unknown", "unavailable"].includes(hass?.states[id]?.state ?? "")) ??
      available.find((id) => id.startsWith("sensor.") || id.startsWith("binary_sensor.")) ??
      "sensor.example";
    return normalizeMiniGraphConfig({
      type: "custom:mushroom-addition-mini-graph-card",
      entity,
      entities: [{ entity }],
      name: hass?.states[entity]?.attributes.friendly_name,
      show: { graph: "line", fill: true, points: "hover", labels: "hover" },
    });
  }

  public setConfig(config: MiniGraphCardConfig): void {
    this.config = normalizeMiniGraphConfig(config);
    this.restartInterval();
    this.requestKey = undefined;
    this.lastEntityStateSignature = this.entityStateSignature();
    void this.loadHistory();
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
    if (relevantStateChanged && this.config?.update_interval) return;
    void this.loadHistory(relevantStateChanged);
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this.restartInterval();
  }

  public disconnectedCallback(): void {
    if (this.interval) window.clearInterval(this.interval);
    super.disconnectedCallback();
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.config) return nothing;
    if (!this.hass) return html`<ha-card><div class="loading">Mini Graph preview</div></ha-card>`;
    const show = normalizeShow(this.config.show);
    const primary = this.series[0];
    const adaptive = primary ? colorForValue(
      Number(primary.state),
      interpolateThresholds(this.config.color_thresholds ?? []),
      primary.color,
    ) : DEFAULT_COLORS[0];
    const classes = [
      this.config.group ? "group" : "",
      show.points === "hover" ? "points-hover" : "",
      show.labels === "hover" || show.labels_secondary === "hover" ? "labels-hover" : "",
    ].filter(Boolean).join(" ");
    return html`
      <ha-card class=${classes} tabindex="0" role="button"
        @click=${this.tap} @dblclick=${this.doubleTap}
        @pointerdown=${this.pointerDown} @pointerup=${this.pointerUp}
        @pointercancel=${this.pointerUp} @keydown=${this.keydown}>
        <div class="content ${this.config.animate ? "animate" : ""}"
          style=${`--mini-graph-font-size:${this.config.font_size ?? 100}`}>
          ${this.renderHeader(primary, adaptive, show)}
          ${this.renderStates(primary, adaptive, show)}
          ${this.loading && show.loading_indicator
            ? html`<div class="loading"><ha-spinner size="small"></ha-spinner></div>`
            : this.error
              ? html`<div class="warning">${this.error}</div>`
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
        style=${`font-size:${this.config?.font_size_header ?? 14}px`}>
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
          : html`<ha-icon .icon=${this.config?.icon ?? this.hass?.states[primary?.config.entity ?? ""]?.attributes.icon ?? "mdi:chart-line"}></ha-icon>`}
      </span>
    `;
  }

  private renderStates(
    primary: GraphSeries | undefined,
    adaptive: string,
    show: Required<MiniGraphShowConfig>,
  ): TemplateResult | typeof nothing {
    if (!show.state || !primary) return nothing;
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
    const state = stateLabel(entity);
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
      <div class="graph" style=${`height:${this.config?.height ?? 150}px`}>
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
      const offset = Math.max(0, Math.min(100, 100 - (((threshold.value ?? bounds.min) - bounds.min) / (bounds.max - bounds.min)) * 100));
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
    const color = series.config.color ? series.color : `url(#mini-graph-${index})`;
    if (show.graph === "bar") {
      const slot = 500 / Math.max(1, Math.min(96, plotted.length));
      const spacing = Number(this.config?.bar_spacing ?? 4);
      const width = Math.max(1, (slot - spacing) / seriesCount);
      const baseline = Math.max(0, Math.min(height, scaleValue(0)));
      return svg`
        <g class="series">
          ${plotted.slice(-96).map((point, pointIndex) => {
            const x = pointIndex * slot + index * width + spacing / 2;
            const y = Math.min(point.y, baseline);
            return svg`<rect x=${x} y=${y} width=${width} height=${Math.abs(baseline - point.y)} rx="1" fill=${color}>
              <title>${this.tooltip(series, point.value, point.time)}</title>
            </rect>`;
          })}
        </g>
      `;
    }
    const linePoints = plotted.length === 1
      ? [{ ...plotted[0], x: 0 }, { ...plotted[0], x: 500 }]
      : plotted;
    const path = pathForPoints(linePoints, series.config.smoothing ?? this.config?.smoothing ?? true);
    const fillPath = plotted.length
      ? `${path} L ${linePoints.at(-1)!.x} ${height} L ${linePoints[0].x} ${height} Z`
      : "";
    return svg`
      <g class="series">
        ${show.fill && series.config.show_fill !== false
          ? svg`<path class="fill ${show.fill === "fade" ? "fade" : ""}" d=${fillPath} fill=${color}/>`
          : nothing}
        ${series.config.show_line !== false
          ? svg`<path class="line" d=${path} stroke=${color} stroke-width=${this.config?.line_width ?? 5}/>`
          : nothing}
        ${show.points && series.config.show_points !== false
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
    const visible = this.series.filter((entry) => entry.config.show_legend !== false);
    if (!show.legend || visible.length < 2) return nothing;
    return html`
      <div class="legend">
        ${visible.map((entry) => html`
          <span class="legend-item">
            <span class="indicator" style=${`background:${entry.color}`}></span>
            <span>${entry.name}${entry.config.show_legend_state
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
        ${show.average ? html`<span>Average <b>${this.stateLabel(average)} ${primary.unit}</b></span>` : nothing}
        ${show.extrema ? html`
          <span>Minimum <b>${this.stateLabel(min)} ${primary.unit}</b></span>
          <span>Maximum <b>${this.stateLabel(max)} ${primary.unit}</b></span>
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

  private singleEntityStateSignature(entityConfig: MiniGraphEntityConfig): string {
    const entity = this.hass?.states[entityConfig.entity];
    return JSON.stringify({
      value: nestedAttribute(entity, entityConfig.attribute),
      lastChanged: entity?.last_changed,
      lastUpdated: entity?.last_updated,
    });
  }

  private async loadHistory(forceRefresh = false): Promise<void> {
    if (!this.hass || !this.config) return;
    const entities = normalizeEntities(this.config);
    const currentKey = JSON.stringify({
      entities,
      hours: this.config.hours_to_show,
      points: this.config.points_per_hour,
      grouping: this.config.group_by,
      factor: this.config.value_factor,
      map: this.config.state_map,
      state: this.entityStateSignature(),
    });
    if (!forceRefresh && currentKey === this.requestKey) return;
    this.requestKey = currentKey;
    const generation = ++this.historyGeneration;
    this.loading = true;
    this.error = undefined;
    try {
      const end = Date.now();
      const start = end - Number(this.config.hours_to_show ?? 24) * 3_600_000;
      const rawHistory = await this.fetchHistory(entities, start, end, forceRefresh, generation);
      if (generation !== this.historyGeneration) return;
      this.series = entities.map((entityConfig, index) =>
        this.buildSeries(entityConfig, index, rawHistory[entityConfig.entity] ?? [], start, end));
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
      if (cached) result[entity.entity] = cached;
      else needsFetch.push(entity);
    }
    if (!needsFetch.length) return result;
    if (!this.hass?.connection?.sendMessagePromise) {
      for (const entity of needsFetch) result[entity.entity] = this.attributeHistory(entity);
      return result;
    }
    const response = await this.hass.connection.sendMessagePromise<unknown>({
      type: "history/history_during_period",
      start_time: new Date(start).toISOString(),
      end_time: new Date(end).toISOString(),
      entity_ids: [...new Set(needsFetch.map((entity) => entity.entity))],
      no_attributes: false,
      minimal_response: false,
      significant_changes_only: false,
    });
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
      result[entity.entity] = points.length ? points : this.attributeHistory(entity);
      this.writeCache(entity, result[entity.entity]);
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
    return `mushroom-mini-graph:${entity.entity}:${entity.attribute ?? "state"}:${this.config?.hours_to_show}:${this.config?.points_per_hour}`;
  }

  private readCache(entity: MiniGraphEntityConfig, start: number): GraphPoint[] | undefined {
    if (!this.config?.cache || typeof localStorage === "undefined") return undefined;
    try {
      const cached = JSON.parse(localStorage.getItem(this.cacheKey(entity)) ?? "null") as CachedHistory | null;
      const maxAge = Math.max(60, Number(this.config.update_interval ?? 300)) * 1000;
      if (
        !cached ||
        cached.stateSignature !== this.singleEntityStateSignature(entity) ||
        Date.now() - cached.fetchedAt > maxAge
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
        stateSignature: this.singleEntityStateSignature(entity),
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
