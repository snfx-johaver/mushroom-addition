import { css, html, nothing, svg } from "lit";
import { MushroomAdditionCard } from "../card";
import { getCatalogItem } from "../catalog";
import { sharedStyles } from "../styles";
import { smartSavingStub } from "./stub";
import { relevantHassChanged } from "./helpers";
import { normalizeConfig } from "../helpers";
import { localize, localizeText, normalizeLocale } from "../localize";
import { customElement, property, state } from "lit/decorators.js";
import {
  buildPeriodAverages,
  clipIntervals,
  convertPrice,
  numeric,
  parseBlocks,
  parseIntervals,
  parsePoints,
  readPath,
  timestamp,
  weightedAverage,
} from "./data";
import type {
  HomeAssistant,
  PeriodConfig,
  ScheduleBlock,
  SmartSavingConfig,
  TrackConfig,
  TimeInterval,
  TimePoint,
  ValueSource,
} from "./types";
import { validateConfig } from "./validation";
import "./editor";

const DEFAULT_PERIODS: PeriodConfig[] = [
  { name: "Morning", startHour: 6, endHour: 12 },
  { name: "Afternoon", startHour: 12, endHour: 18 },
  { name: "Evening", startHour: 18, endHour: 24 },
  { name: "Night", startHour: 0, endHour: 6 },
];

const SVG_WIDTH = 1000;
const LEFT = 76;
const RIGHT = 986;
const PLOT_WIDTH = RIGHT - LEFT;
const TRACKS = [
  { key: "plan", name: "Plan", color: "var(--success-color, #43a047)", kind: "schedule" },
  { key: "applied", name: "Applied sale", color: "var(--warning-color, #ef8b37)", kind: "schedule" },
  { key: "ev", name: "EV", color: "var(--info-color, #8b5cf6)", kind: "schedule" },
  { key: "solar", name: "Solar forecast", color: "var(--energy-solar-color, #e6b832)", kind: "solar" },
] as const;

type TrackRenderData = (typeof TRACKS)[number] & {
  status: "missing" | "valid" | "invalid";
  blocks: ScheduleBlock[];
  solar: TimeInterval[];
  unit?: string;
};

function getEntity(hass: HomeAssistant | undefined, entityId?: string) {
  return entityId ? hass?.states[entityId] : undefined;
}

function getValue(hass: HomeAssistant | undefined, source?: ValueSource): number | undefined {
  if (!source) return undefined;
  if (source.entity) {
    const entity = getEntity(hass, source.entity);
    if (!entity) return undefined;
    const raw = source.field ? readPath(entity.attributes, source.field) : entity.state;
    return numeric(raw);
  }
  return numeric(source.value);
}

function formatDateLabel(time: number, language?: string): string {
  return new Intl.DateTimeFormat(normalizeLocale(language), { weekday: "short", month: "short", day: "numeric" }).format(time);
}

function formatTimeLabel(time: number, language?: string): string {
  return new Intl.DateTimeFormat(normalizeLocale(language), { hour: "2-digit", minute: "2-digit" }).format(time);
}

function priceText(value: number, unit: string): string {
  return `${formatPriceValue(value, unit)} ${unit}`;
}

function formatPriceValue(value: number, unit: string): string {
  return value.toFixed(unit === "EUR/kWh" ? 3 : 1);
}

function getSolarIntervals(entity: ReturnType<typeof getEntity>, mapping: NonNullable<SmartSavingConfig["tracks"]>["solar"]): TimeInterval[] {
  if (!entity || !mapping) return [];
  return parseIntervals(entity, mapping, mapping.valueField);
}

@customElement("mushroom-addition-smart-saving")
export class SmartSavingPlanCard extends MushroomAdditionCard {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() protected config?: SmartSavingConfig;
  protected descriptor = getCatalogItem("mushroom-addition-smart-saving");
  @state() private configError = "";
  @state() private expanded = false;

  protected shouldUpdate(changed: Map<PropertyKey, unknown>): boolean {
    return changed.size !== 1 || !changed.has("hass") ||
      relevantHassChanged(changed.get("hass") as HomeAssistant | undefined, this.hass, this.config);
  }

  static styles = [sharedStyles, css`
    :host {
      display: block;
      container-type: inline-size;
      color: var(--primary-text-color);
      --card-background: var(--ha-card-background, var(--card-background-color, #fff));
      --muted-color: var(--secondary-text-color, #727272);
      --divider-color: var(--ha-card-border-color, rgba(127, 127, 127, .22));
      --price-low: var(--success-color, #43a047);
      --price-high: var(--warning-color, #ef8b37);
      --forecast-color: var(--info-color, #4b7cff);
      --solar-color: var(--energy-solar-color, #e6b832);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    }
    ha-card { display: block; box-sizing: border-box; border-radius: var(--ha-card-border-radius, 16px); overflow: hidden; }
    .content { padding: 16px; }
    .header { display: flex; align-items: flex-start; flex-wrap: wrap; gap: 12px; }
    .heading { min-width: 0; flex: 1 1 240px; }
    h1 { margin: 0; font-size: clamp(18px, 2.4vw, 23px); font-weight: 600; }
    .subtitle, .description, .footnote { color: var(--muted-color); }
    .subtitle { margin-top: 4px; font-size: 13px; }
    .chips, .legend, .summary-chips { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
    .chip { display: inline-flex; gap: 5px; align-items: center; padding: 6px 10px; border-radius: 999px; background: var(--secondary-background-color, rgba(127,127,127,.12)); font-size: 12px; white-space: nowrap; }
    .chip.status { background: var(--primary-color, #607d8b); color: var(--text-primary-color, white); }
    .current { font-size: 12px; color: var(--muted-color); white-space: nowrap; }
    .description { font-size: 12px; margin: 14px 0 2px; }
    .chart-scroll { overflow-x: auto; margin: 0 -3px; }
    .timeline { display: block; width: 100%; min-width: 640px; height: auto; }
    .chart-title { margin: 13px 0 0; font-size: 14px; font-weight: 600; fill: var(--primary-text-color); }
    .axis-label, .track-label, .small-label { fill: var(--muted-color); font-size: 11px; }
    .day-label { fill: var(--primary-text-color); font-size: 13px; font-weight: 600; }
    .grid-line { stroke: var(--divider-color); stroke-width: 1; }
    .avg-line { stroke: var(--muted-color); stroke-dasharray: 6 5; stroke-width: 1.5; }
    .target-line { stroke: var(--price-low); stroke-dasharray: 5 5; stroke-width: 1.5; }
    .forecast-line { fill: none; stroke: var(--forecast-color); stroke-width: 3; stroke-dasharray: 7 5; }
    .track-bg { fill: var(--secondary-background-color, rgba(127,127,127,.1)); }
    .empty-note { fill: var(--muted-color); font-size: 11px; }
    .divider { height: 1px; background: var(--divider-color); margin: 10px 0; }
    .periods { display: grid; grid-template-columns: repeat(auto-fit, minmax(125px, 1fr)); gap: 7px; margin-top: 10px; }
    .period { text-align: center; padding: 9px 7px; border-radius: 12px; background: var(--secondary-background-color, rgba(127,127,127,.12)); }
    .period-name { color: var(--muted-color); font-size: 10px; }
    .period-date { color: var(--muted-color); font-size: 10px; margin-top: 2px; }
    .period-value { font-size: 17px; font-weight: 650; margin: 3px 0; }
    .period-range { color: var(--muted-color); font-size: 10px; }
    .period-note, .footnote { font-size: 11px; margin: 8px 0; line-height: 1.45; }
    .legend { margin: 12px 0; font-size: 12px; }
    .legend-item { display: inline-flex; align-items: center; gap: 5px; }
    .swatch { display: inline-block; height: 9px; width: 9px; border-radius: 3px; background: var(--swatch); }
    .summary-chips { margin: 8px 0; }
    details { font-size: 12px; margin-top: 8px; }
    summary { cursor: pointer; }
    .blocks { list-style: none; margin: 8px 0 0; padding: 0; }
    .blocks li { padding: 6px 0; border-top: 1px solid var(--divider-color); }
    .error { border-left: 4px solid var(--error-color, #db4437); padding: 12px; color: var(--error-color, #db4437); }
    @container (max-width: 600px) {
      .content { padding: 13px; }
      .heading { flex-basis: 100%; }
      .current { width: 100%; }
      .timeline { min-width: 600px; }
    }
    .energy-heading { padding: 0; width: 100%; background: none; border: 0; color: inherit; text-align: start; }
  `];

  public setConfig(raw: unknown): void {
    try {
      const input = raw && typeof raw === "object" && "entity" in raw && !("price" in raw)
        ? { ...raw, price: { entity: raw.entity, path: "prices" } } : raw;
      const validated = validateConfig(input);
      this.config = {
        ...normalizeConfig(validated),
        ...validated,
        entity: validated.entity ?? validated.price?.entity,
        name: validated.name ?? validated.title ?? "Smart Saving",
        secondary: validated.secondary ?? validated.subtitle,
        price: { ...validated.price!, entity: validated.entity ?? validated.price!.entity },
      };
      this.configError = "";
    } catch (error) {
      this.configError = error instanceof Error ? error.message : "Invalid card configuration.";
      throw new Error(`Smart Saving Plan card: ${this.configError}`);
    }
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement("mushroom-addition-editor");
  }

  public static getStubConfig(hass?: HomeAssistant, entities: string[] = [], fallback: string[] = []): SmartSavingConfig {
    return smartSavingStub(hass, entities, fallback);
  }

  public getCardSize(): number {
    return 8;
  }

  private entityValue(source?: ValueSource): number | undefined {
    return getValue(this.hass, source);
  }
  private t(text: string): string { return localizeText(this.hass, text); }
  private readonly dateLabel = (time: number): string => formatDateLabel(time, this.hass?.language);
  private readonly timeLabel = (time: number): string => formatTimeLabel(time, this.hass?.language);

  private renderCard() {
    const config = this.config;
    const hass = this.hass;
    if (!config || !hass) return html``;

    const now = Date.now();
    const windowStart = now;
    const visibleHours = config.visibleHours ?? 36;
    const windowEnd = now + visibleHours * 60 * 60 * 1000;
    const x = (time: number) => LEFT + ((time - windowStart) / (windowEnd - windowStart)) * PLOT_WIDTH;

    const priceEntity = getEntity(hass, config.price?.entity);
    const sourceUnit = config.price?.sourceUnit ?? "EUR/kWh";
    const displayUnit = config.price?.displayUnit ?? sourceUnit;
    let priceRoot: unknown;
    if (config.price?.adapter === "state" && priceEntity) {
      try {
        priceRoot = JSON.parse(priceEntity.state) as unknown;
      } catch {
        priceRoot = null;
      }
    }
    const rawPrices = parseIntervals(
      priceEntity,
      config.price ?? {},
      config.price?.priceField ?? "price",
      priceRoot,
    );
    const priceDataRoot = priceEntity
      ? readPath(
        config.price?.adapter === "state" ? priceRoot : priceEntity.attributes,
        config.price?.path,
      )
      : undefined;
    const priceDataContainer = Array.isArray(priceDataRoot)
      || (priceDataRoot !== null && typeof priceDataRoot === "object");
    const priceMessage = !priceEntity
      ? `${this.t("Price")}: ${this.t("Source missing")}`
      : !priceDataContainer || (Array.isArray(priceDataRoot) && priceDataRoot.length > 0 && rawPrices.length === 0)
        ? `${this.t("Price")}: ${this.t("Invalid data source or field mapping")}`
        : rawPrices.length === 0
          ? this.t("No published intervals")
          : `${this.t("Timeline")}: ${this.t("No published intervals")}`;
    const prices = clipIntervals(rawPrices, windowStart, windowEnd).map((item) => ({
      ...item,
      value: convertPrice(item.value, sourceUnit, displayUnit),
    }));
    const average = weightedAverage(prices);
    const rawPriceMin = Math.min(0, ...prices.map((item) => item.value));
    const rawPriceMax = Math.max(0, ...prices.map((item) => item.value));
    const pricePadding = Math.max((rawPriceMax - rawPriceMin) * 0.12, 0.01);
    const chartPriceMin = rawPriceMin < 0 ? rawPriceMin - pricePadding : 0;
    const chartPriceMax = rawPriceMax > 0 ? rawPriceMax + pricePadding : 0.01;
    const priceRange = chartPriceMax - chartPriceMin;
    const priceY = (value: number) => 151 - ((value - chartPriceMin) / priceRange) * 112;
    const minPrice = prices.length ? prices.reduce((a, b) => a.value <= b.value ? a : b) : undefined;
    const maxPrice = prices.length ? prices.reduce((a, b) => a.value >= b.value ? a : b) : undefined;

    const currentSource = config.battery?.current;
    const currentEntity = getEntity(hass, currentSource?.entity);
    const currentRaw = currentSource?.field
      ? readPath(currentEntity?.attributes, currentSource.field)
      : currentEntity?.state;
    const currentSoc = currentSource?.entity
      ? currentEntity ? numeric(currentRaw) : undefined
      : numeric(currentSource?.value);
    const forecastEntity = getEntity(hass, config.battery?.forecast?.entity);
    const allForecastPoints = parsePoints(forecastEntity, config.battery?.forecast ?? {});
    const forecast = allForecastPoints.filter(
      (point) => point.time >= windowStart && point.time <= windowEnd,
    );
    const forecastRoot = forecastEntity
      ? readPath(forecastEntity.attributes, config.battery?.forecast?.path)
      : undefined;
    const forecastMessage = !config.battery?.forecast?.entity || !forecastEntity
      ? `${this.t("Forecast")}: ${this.t("Source missing")}`
      : !Array.isArray(forecastRoot) || (forecastRoot.length > 0 && allForecastPoints.length === 0)
        ? `${this.t("Forecast")}: ${this.t("Invalid data source or field mapping")}`
        : allForecastPoints.length === 0
          ? `${this.t("Forecast")}: ${this.t("No data")}`
          : forecast.length === 0
            ? `${this.t("Forecast")}: ${this.t("Timeline")}: ${this.t("No data")}`
            : "";
    const horizonValue = this.entityValue(config.battery?.horizon);
    const horizonTime = horizonValue !== undefined ? now + horizonValue * 60 * 60 * 1000 : undefined;
    const exactHorizon = horizonTime === undefined ? undefined : forecast.find((point) => Math.abs(point.time - horizonTime) < 60_000);
    const target = this.entityValue(config.battery?.target);

    const trackData = TRACKS.map((track) => {
      const mapping = config.tracks?.[track.key];
      const entity = getEntity(hass, mapping?.entity);
      if (!mapping?.entity || !entity) {
        return { ...track, status: "missing" as const, blocks: [] as ScheduleBlock[], solar: [] as TimeInterval[], unit: mapping?.unit };
      }
      if (track.kind === "solar") {
        const solar = clipIntervals(getSolarIntervals(entity, mapping), windowStart, windowEnd);
        const solarRoot = readPath(entity.attributes, mapping.path);
        const hasArray = Array.isArray(solarRoot) && (solarRoot.length === 0 || solar.length > 0);
        return { ...track, status: hasArray ? "valid" as const : "invalid" as const, blocks: [], solar, unit: mapping.unit };
      }
      const parsed = parseBlocks(entity, mapping);
      return {
        ...track,
        status: parsed.validSource ? "valid" as const : "invalid" as const,
        blocks: parsed.blocks,
        solar: [] as TimeInterval[],
        unit: mapping.unit,
      };
    });

    const periods = buildPeriodAverages(
      rawPrices.map((item) => ({ ...item, value: convertPrice(item.value, sourceUnit, displayUnit) })),
      windowStart,
      windowEnd,
      config.periods?.length ? config.periods : DEFAULT_PERIODS.map(period => ({ ...period, name: this.t(period.name) })),
    ).slice(0, 8);

    const timeline = this.renderTimeline({
      now, windowStart, windowEnd, visibleHours, x, prices, priceMessage, chartPriceMin, chartPriceMax, priceY, average, minPrice, maxPrice,
      currentSoc, forecast, forecastMessage, horizonTime, exactHorizon, target, trackData, displayUnit,
    });

    const status = getEntity(hass, config.statusEntity);
    const statusText = status && status.state !== "unknown" && status.state !== "unavailable"
      ? hass.formatEntityState?.(status) ?? status.state
      : `${this.t("Status")}: ${this.t("Unavailable")}`;
    const energy = this.entityValue(config.summary?.purchaseEnergy);
    const cost = this.entityValue(config.summary?.purchaseCost);
    const energyUnit = getEntity(hass, config.summary?.purchaseEnergy?.entity)?.attributes.unit_of_measurement ?? "kWh";
    const costUnit = getEntity(hass, config.summary?.purchaseCost?.entity)?.attributes.unit_of_measurement ?? "€";
    const planEntity = getEntity(hass, config.planBlocksEntity);
    const blocksValue = planEntity ? readPath(planEntity.attributes, config.planBlocksPath ?? "blocks") : undefined;
    const planList = Array.isArray(blocksValue) ? blocksValue : [];

    return html`
      <ha-card class=${config.card_shadow ? "card-shadow" : ""}>
        <div class="content">
          <div class="header">
            <div class="heading">${this.renderSharedHeading()}</div>
            <span class="chip status">${statusText}</span>
            <span class="current">${this.t("Current battery")} ${currentSoc === undefined ? this.t("Unavailable") : `${currentSoc.toFixed(0)}%`}</span>
          </div>
          <div class="description">${this.t("Timeline")}: ${this.dateLabel(windowStart)} – ${this.dateLabel(windowEnd)} · ${visibleHours} h</div>
          <div class="chart-scroll">${timeline}</div>
          <div class="divider"></div>
          <div class="periods">${periods.map((period) => html`
            <div class="period">
              <div class="period-name">${period.name}</div>
              <div class="period-date">${period.date}</div>
              <div class="period-value">${period.average === null ? "—" : priceText(period.average, displayUnit)}</div>
              <div class="period-range">${period.minimum === null || period.maximum === null
                ? this.t("No published intervals")
                : `${period.coverage === "partial" ? `${this.t("Partial")} · ` : ""}${formatPriceValue(period.minimum, displayUnit)}–${formatPriceValue(period.maximum, displayUnit)} ${displayUnit}`}</div>
            </div>
          `)}</div>
          <p class="period-note">${this.t("Averages use published intervals only, weighted by duration. Gaps are not estimated.")}</p>
          <div class="legend">
            <span class="legend-item"><i class="swatch" style="--swatch:var(--success-color,#43a047)"></i>${this.t("Planned grid charge")}</span>
            <span class="legend-item"><i class="swatch" style="--swatch:var(--warning-color,#ef8b37)"></i>${this.t("Planned sale")}</span>
            <span class="legend-item"><i class="swatch" style="--swatch:var(--forecast-color,#4b7cff)"></i>${this.t("Measured SoC now")}</span>
            <span class="legend-item"><i class="swatch" style="--swatch:var(--solar-color,#e6b832)"></i>${this.t("Solar forecast")}</span>
          </div>
          <div class="summary-chips">
            ${target === undefined ? nothing : html`<span class="chip">${this.t("Plan target")} <b>${target}%</b></span>`}
            ${energy === undefined && cost === undefined ? nothing : html`
              <span class="chip">${this.t("Planned purchase")}
                <b>${energy === undefined ? "—" : `${energy} ${String(energyUnit)}`}</b>
                ${cost === undefined ? nothing : html`· <b>${cost.toFixed(2)} ${String(costUnit)}</b>`}
              </span>`}
          </div>
          ${config.planBlocksEntity ? html`
            <details .open=${this.expanded} @toggle=${(event: Event) => { this.expanded = (event.currentTarget as HTMLDetailsElement).open; }}>
              <summary>${this.t("Plan blocks")} (${planList.length})</summary>
              ${planEntity ? planList.length ? html`<ul class="blocks">${planList.map((raw) => html`
                <li>${this.renderPlanBlock(raw, config.tracks?.plan)}</li>
              `)}</ul>` : html`<p class="description">${this.t("No blocks scheduled")}</p>` : html`<p class="description">${this.t("Plan blocks")}: ${this.t("Source missing")}: ${config.planBlocksEntity}</p>`}
            </details>` : nothing}
          <p class="footnote">${this.t("Plan values come from entities. This card does not calculate plans or infer future battery levels.")}</p>
        </div>
      </ha-card>
    `;
  }

  private renderTimeline(args: {
    now: number; windowStart: number; windowEnd: number; visibleHours: number; x: (time: number) => number;
    prices: TimeInterval[]; priceMessage: string; chartPriceMin: number; chartPriceMax: number; priceY: (value: number) => number;
    average: number | null; minPrice?: TimeInterval; maxPrice?: TimeInterval;
    currentSoc?: number; forecast: TimePoint[]; forecastMessage: string; horizonTime?: number; exactHorizon?: TimePoint;
    target?: number; trackData: TrackRenderData[]; displayUnit: string;
  }) {
    const {
      now, windowStart, windowEnd, x, prices, priceMessage, chartPriceMin, chartPriceMax, priceY, average, minPrice, maxPrice,
      currentSoc, forecast, forecastMessage, horizonTime, exactHorizon, target, trackData,
    } = args;
    const batteryY = (value: number) => 342 - (Math.max(0, Math.min(100, value)) / 100) * 86;
    const solarMax = Math.max(1, ...trackData.flatMap((track) => track.solar.map((item) => item.value)));
    const ticks: number[] = [];
    const firstTick = new Date(windowStart);
    firstTick.setMinutes(0, 0, 0);
    if (firstTick.getTime() <= windowStart) firstTick.setHours(firstTick.getHours() + 1);
    while (firstTick.getHours() % 3 !== 0) firstTick.setHours(firstTick.getHours() + 1);
    for (const tick = new Date(firstTick); tick.getTime() < windowEnd; tick.setHours(tick.getHours() + 3)) {
      ticks.push(tick.getTime());
    }
    const dayMarkers: number[] = [];
    const midnight = new Date(windowStart);
    midnight.setHours(0, 0, 0, 0);
    if (midnight.getTime() <= windowStart) midnight.setDate(midnight.getDate() + 1);
    for (const day = new Date(midnight); day.getTime() < windowEnd; day.setDate(day.getDate() + 1)) {
      dayMarkers.push(day.getTime());
    }
    const batteryPoints = forecast.map((point) => `${x(point.time).toFixed(1)},${batteryY(point.value).toFixed(1)}`).join(" ");
    const intervalWidth = (item: TimeInterval) => Math.max(1.5, (item.end - item.start) / (windowEnd - windowStart) * PLOT_WIDTH - 1);
    const trackTop = 390;

    return svg`<svg class="timeline" viewBox="0 0 ${SVG_WIDTH} 536" role="img" aria-label="${this.t("Price")}, ${this.t("Battery")}, ${this.t("Energy")}: ${this.dateLabel(windowStart)} – ${this.dateLabel(windowEnd)}">
      <text x="${LEFT}" y="20" class="chart-title">${this.t("Published electricity prices")} · ${args.displayUnit}</text>
      ${dayMarkers.map((time) => svg`<line x1="${x(time)}" x2="${x(time)}" y1="28" y2="519" class="grid-line"></line>
        <text x="${x(time) + 5}" y="39" class="day-label">${this.dateLabel(time)}</text>`)}
      ${[chartPriceMin, (chartPriceMin + chartPriceMax) / 2, chartPriceMax].map((value) => svg`<line x1="${LEFT}" x2="${RIGHT}" y1="${priceY(value)}" y2="${priceY(value)}" class="grid-line"></line>
        <text x="${LEFT - 8}" y="${priceY(value) + 4}" text-anchor="end" class="axis-label">${formatPriceValue(value, args.displayUnit)}</text>`)}
      ${average === null ? nothing : svg`<line x1="${LEFT}" x2="${RIGHT}" y1="${priceY(average)}" y2="${priceY(average)}" class="avg-line"></line>
        <text x="${RIGHT - 3}" y="${priceY(average) - 4}" text-anchor="end" class="small-label">${this.t("Average")} ${formatPriceValue(average, args.displayUnit)}</text>`}
      ${prices.map((item) => svg`<rect x="${x(item.start)}" y="${Math.min(priceY(item.value), priceY(0))}" width="${intervalWidth(item)}" height="${Math.max(1, Math.abs(priceY(item.value) - priceY(0)))}" rx="2" fill="${average !== null && item.value <= average ? "var(--price-low)" : "var(--price-high)"}">
        <title>${this.dateLabel(item.start)} · ${this.timeLabel(item.start)}–${this.timeLabel(item.end)} · ${priceText(item.value, args.displayUnit)}</title></rect>`)}
      ${prices.length === 0 ? svg`<text x="${LEFT + PLOT_WIDTH / 2}" y="98" text-anchor="middle" class="empty-note">${priceMessage}</text>` : nothing}
      ${prices.length > 0 ? svg`<text x="${LEFT}" y="191" class="small-label">${this.t("Published electricity prices")}: ${prices.length}</text>` : nothing}
      ${minPrice ? svg`<text x="${x(minPrice.start)}" y="${Math.max(53, priceY(minPrice.value) - 7)}" class="small-label">${localize(this.hass, "ui.renderer.minimum_value", { value: formatPriceValue(minPrice.value, args.displayUnit) })} · ${this.dateLabel(minPrice.start)} ${this.timeLabel(minPrice.start)}</text>` : nothing}
      ${maxPrice ? svg`<text x="${Math.min(RIGHT - 5, x(maxPrice.start))}" y="${Math.max(53, priceY(maxPrice.value) - 7)}" text-anchor="end" class="small-label">${localize(this.hass, "ui.renderer.maximum_value", { value: formatPriceValue(maxPrice.value, args.displayUnit) })} · ${this.dateLabel(maxPrice.start)} ${this.timeLabel(maxPrice.start)}</text>` : nothing}
      ${ticks.map((time) => svg`<text x="${x(time)}" y="174" text-anchor="middle" class="axis-label">${this.timeLabel(time)}</text>`)}

      <text x="${LEFT}" y="208" class="chart-title">${this.t("Battery level · measured now and forecast")}</text>
      ${[0, 50, 100].map((value) => svg`<line x1="${LEFT}" x2="${RIGHT}" y1="${batteryY(value)}" y2="${batteryY(value)}" class="grid-line"></line>
        <text x="${LEFT - 8}" y="${batteryY(value) + 4}" text-anchor="end" class="axis-label">${value}%</text>`)}
      ${forecast.length > 1 ? svg`<polyline points="${batteryPoints}" class="forecast-line"></polyline>` : nothing}
      ${forecast.map((point) => svg`<circle cx="${x(point.time)}" cy="${batteryY(point.value)}" r="3" fill="var(--forecast-color)">
        <title>${this.t("Forecast")} ${point.value}% · ${this.dateLabel(point.time)} ${this.timeLabel(point.time)}</title></circle>`)}
      ${currentSoc === undefined ? svg`<text x="${LEFT + 4}" y="278" class="empty-note">${this.t("Current SoC source missing or invalid")}</text>` : svg`
        <circle cx="${x(now)}" cy="${batteryY(currentSoc)}" r="5" fill="var(--forecast-color)"><title>${this.t("Measured SoC now")}: ${currentSoc}%</title></circle>
        <text x="${x(now) + 8}" y="${batteryY(currentSoc) + 4}" class="small-label">${this.t("Now")} ${currentSoc}%</text>`}
      ${forecast.length === 0 ? svg`<text x="${LEFT + PLOT_WIDTH / 2}" y="294" text-anchor="middle" class="empty-note">${forecastMessage}</text>` : nothing}
      ${target === undefined ? nothing : svg`<line x1="${LEFT}" x2="${RIGHT}" y1="${batteryY(target)}" y2="${batteryY(target)}" class="target-line"></line>
        <text x="${RIGHT - 4}" y="${batteryY(target) - 5}" text-anchor="end" class="small-label">${this.t("Plan target")} ${target}%</text>`}
      ${horizonTime === undefined ? nothing : svg`<line x1="${x(Math.min(windowEnd, horizonTime))}" x2="${x(Math.min(windowEnd, horizonTime))}" y1="248" y2="353" stroke="var(--forecast-color)" stroke-dasharray="2 4"></line>
        <text x="${RIGHT - 3}" y="231" text-anchor="end" class="small-label">${this.t("Horizon")} ${args.visibleHours > 0 ? `${(horizonTime - now) / 3600000} h` : ""}${exactHorizon ? ` · ${exactHorizon.value}%` : ""}</text>`}

      ${trackData.map((track, index) => {
        const y = trackTop + index * 30;
        const label = this.t(track.name);
        return svg`<text x="${LEFT - 9}" y="${y + 14}" text-anchor="end" class="track-label">${label}</text>
          <rect x="${LEFT}" y="${y}" width="${PLOT_WIDTH}" height="22" rx="7" class="track-bg"></rect>
          ${track.status === "missing" ? svg`<text x="${LEFT + 9}" y="${y + 15}" class="empty-note">${this.t("Source missing")}</text>` : nothing}
          ${track.status === "invalid" ? svg`<text x="${LEFT + 9}" y="${y + 15}" class="empty-note">${this.t("Invalid data source or field mapping")}</text>` : nothing}
          ${track.status === "valid" && track.kind === "schedule" && track.blocks.length === 0 ? svg`<text x="${LEFT + 9}" y="${y + 15}" class="empty-note">${this.t("No blocks scheduled")}</text>` : nothing}
          ${track.kind === "schedule" && track.status === "valid" ? track.blocks.map((block) => {
            const start = Math.max(windowStart, block.start);
            const end = Math.min(windowEnd, block.end);
            if (end <= start) return nothing;
            return svg`<rect x="${x(start)}" y="${y + 2}" width="${Math.max(2, x(end) - x(start) - 1)}" height="18" rx="3" fill="${track.color}">
              <title>${label}: ${this.dateLabel(block.start)} ${this.timeLabel(block.start)}–${this.timeLabel(block.end)}${block.power === undefined ? "" : ` · ${this.t("Power")} ${block.power}`}${block.energy === undefined ? "" : ` · ${this.t("Energy")} ${block.energy}`}${block.status ? ` · ${block.status}` : ""}</title></rect>`;
          }) : nothing}
          ${track.kind === "solar" && track.status === "valid" && track.solar.length === 0 ? svg`<text x="${LEFT + 9}" y="${y + 15}" class="empty-note">${this.t("No forecast production values")}</text>` : nothing}
          ${track.kind === "solar" ? track.solar.map((item) => {
            const start = Math.max(windowStart, item.start);
            const end = Math.min(windowEnd, item.end);
            if (end <= start) return nothing;
            const opacity = 0.22 + 0.78 * (item.value / solarMax);
            return svg`<rect x="${x(start)}" y="${y + 2}" width="${Math.max(2, x(end) - x(start) - 1)}" height="18" fill="var(--solar-color)" opacity="${opacity}">
              <title>${this.t("Forecast production")}: ${item.value} ${track.unit ?? this.t("Unit")} · ${this.dateLabel(item.start)} ${this.timeLabel(item.start)}–${this.timeLabel(item.end)}</title></rect>`;
          }) : nothing}`;
      })}
      <text x="${LEFT}" y="${trackTop + 4 * 30 + 8}" class="small-label">${this.t("Solar values are forecast production, not measured production.")}</text>
    </svg>`;
  }

  private renderPlanBlock(raw: unknown, mapping?: TrackConfig) {
    if (!raw || typeof raw !== "object") return this.t("Invalid data source or field mapping");
    const value = raw as Record<string, unknown>;
    const start = timestamp(readPath(value, mapping?.startField ?? "start"));
    const end = timestamp(readPath(value, mapping?.endField ?? "end"));
    return `${start === undefined ? "?" : `${this.dateLabel(start)} ${this.timeLabel(start)}`}–${end === undefined ? "?" : this.timeLabel(end)}`
      + `${readPath(value, mapping?.powerField ?? "power") === undefined ? "" : ` · ${this.t("Power")} ${String(readPath(value, mapping?.powerField ?? "power"))}`}`
      + `${readPath(value, mapping?.energyField ?? "energy") === undefined ? "" : ` · ${this.t("Energy")} ${String(readPath(value, mapping?.energyField ?? "energy"))}`}`
      + `${readPath(value, mapping?.statusField ?? "status") === undefined ? "" : ` · ${String(readPath(value, mapping?.statusField ?? "status"))}`}`;
  }

  protected render() {
    if (this.configError) return html`<ha-card><div class="error" role="alert">${this.t("Configuration error")}: ${this.configError}</div></ha-card>`;
    return this.renderCard();
  }
}
