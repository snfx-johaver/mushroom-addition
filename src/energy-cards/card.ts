import { css, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { MushroomAdditionCard } from "../card";
import { getCatalogItem } from "../catalog";
import { sharedStyles } from "../styles";
import { energyNumber, energyTime } from "../energy-format";
import { normalizeConfig } from "../helpers";
import { localizeText, normalizeLocale } from "../localize";
import { smartSavingStub } from "./stub";
import { energySetupNotice, relevantHassChanged } from "./helpers";
import { buildPeriodAverages, clipIntervals, convertPrice, numeric, priceCurrency, readPath, weightedAverage } from "./data";
import { readPriceIntervals } from "./price-source";
import { calendarDay } from "./calendar";
import { coverageGaps, sourceAvailable, sourceHealth, strictBlocks, strictForecast, strictIntervals, visibleForecastSegments } from "./smart-saving-data";
import type { FieldMapping, HomeAssistant, PeriodConfig, SmartSavingConfig, TimeInterval, ValueSource } from "./types";
import { validateConfig } from "./validation";
import "./editor";

const DEFAULT_PERIODS: PeriodConfig[] = [
  { name: "Morning", startHour: 6, endHour: 12 },
  { name: "Afternoon", startHour: 12, endHour: 18 },
  { name: "Evening", startHour: 18, endHour: 24 },
  { name: "Night", startHour: 0, endHour: 6 },
];
const TRACKS = [
  { key: "plan", name: "Plan", color: "var(--price-low)" },
  { key: "applied", name: "Applied sale", color: "var(--price-high)" },
  { key: "ev", name: "EV", color: "var(--info-color, #8b5cf6)" },
  { key: "solar", name: "Solar forecast", color: "var(--solar-color)" },
] as const;
const PAGE_SIZE = 50;

@customElement("mushroom-addition-smart-saving")
export class SmartSavingPlanCard extends MushroomAdditionCard {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() protected config?: SmartSavingConfig;
  protected descriptor = getCatalogItem("mushroom-addition-smart-saving");
  @state() private configError = "";
  @state() private expanded = false;
  @state() private periodsExpanded = false;
  @state() private page = 0;
  @state() private chartWidth = 720;
  @state() private selectedTime?: number;
  private refreshTimer?: ReturnType<typeof setInterval>;
  private chartObserver?: ResizeObserver;
  private observedPlot?: Element;

  public connectedCallback(): void {
    super.connectedCallback();
    this.refreshTimer = setInterval(() => this.requestUpdate(), 60_000);
    this.requestUpdate();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    clearInterval(this.refreshTimer);
    this.refreshTimer = undefined;
    this.chartObserver?.disconnect();
    this.chartObserver = undefined;
    this.observedPlot = undefined;
  }

  protected updated(): void {
    super.updated();
    const plot = this.shadowRoot?.querySelector(".price-plot");
    if (!plot || plot === this.observedPlot || typeof ResizeObserver === "undefined") return;
    this.chartObserver?.disconnect();
    this.observedPlot = plot;
    this.chartObserver = new ResizeObserver(entries => {
      const width = Math.max(100, Math.round(entries[0].contentRect.width));
      if (width !== this.chartWidth) this.chartWidth = width;
    });
    this.chartObserver.observe(plot);
  }

  protected shouldUpdate(changed: Map<PropertyKey, unknown>): boolean {
    return changed.size !== 1 || !changed.has("hass") ||
      relevantHassChanged(changed.get("hass") as HomeAssistant | undefined, this.hass, this.config);
  }

  static styles = [sharedStyles, css`
    :host {
      display: block; container-type: inline-size; color: var(--primary-text-color);
      --muted-color: var(--secondary-text-color, #727272);
      --divider-color: var(--ha-card-border-color, rgba(127,127,127,.22));
      --price-low: var(--success-color, #43a047);
      --price-high: var(--warning-color, #ef8b37);
      --forecast-color: var(--info-color, #4b7cff);
      --solar-color: var(--energy-solar-color, #e6b832);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    }
    ha-card { display: block; box-sizing: border-box; border-radius: var(--ha-card-border-radius,16px); overflow: hidden; }
    .content { padding: 18px; margin: auto; box-sizing: border-box; }
    .header { display: flex; align-items: flex-start; flex-wrap: wrap; gap: 12px; }
    .heading { min-width: 0; flex: 1 1 240px; }
    .energy-heading { padding: 0; width: 100%; background: none; border: 0; color: inherit; text-align: start; }
    .description, .footnote, .current, .plot-note, .period-note { color: var(--muted-color); font-size: 12px; line-height: 1.5; }
    .description { margin: 12px 0; }
    .chip { display: inline-flex; gap: 5px; align-items: center; padding: 6px 10px; border-radius: 999px;
      background: var(--secondary-background-color,rgba(127,127,127,.12)); font-size: 12px; }
    .chip.status { background: var(--primary-color,#607d8b); color: var(--text-primary-color,white); }
    .timeline { border: 1px solid var(--divider-color); border-radius: 12px; padding: 12px; }
    .chart-title { margin: 0 0 8px; font-size: 13px; font-weight: 600; }
    .chart-section + .chart-section { border-top: 1px solid var(--divider-color); margin-top: 14px; padding-top: 14px; }
    .plot-row { display: grid; grid-template-columns: 42px minmax(0,1fr); gap: 8px; }
    .scale { display: flex; flex-direction: column; justify-content: space-between; text-align: end; padding: 6px 0; }
    .scale, .axis { font-size: 10px; color: var(--muted-color); font-variant-numeric: tabular-nums; }
    .plot { position: relative; min-width: 0; }
    .plot svg { touch-action: pan-y; cursor: crosshair; }
    .selection-line { stroke: var(--primary-text-color); stroke-width: 1.5; stroke-dasharray: 3 3; pointer-events: none; }
    .inspector { margin: 12px 0 0 50px; font-size: 12px; }
    .inspector label { display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
    .inspector input { display: block; width: 100%; margin: 8px 0; min-height: 28px; accent-color: var(--primary-color); cursor: ew-resize; }
    .inspection-values { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(110px,100%),1fr)); gap: 8px; }
    .inspection-value { padding: 8px; border-radius: 8px; background: var(--secondary-background-color,rgba(127,127,127,.1)); overflow-wrap: anywhere; min-width: 0; }
    .inspection-value b, .inspection-value small { display: block; }
    .inspection-value small { color: var(--muted-color); margin-top: 3px; }
    .coverage { color: var(--muted-color); font-size: 10px; }
    .explanations { color: var(--muted-color); line-height: 1.5; }
    .plot svg { width: 100%; display: block; overflow: hidden; }
    .price-plot svg { height: 150px; }
    .battery-plot svg { height: 100px; }
    .grid-line { stroke: var(--divider-color); stroke-width: 1; }
    .avg-line { stroke: var(--muted-color); stroke-dasharray: 6 5; stroke-width: 1.5; }
    .target-line { stroke: var(--price-low); stroke-dasharray: 5 5; stroke-width: 1.5; }
    .zero-line { stroke: var(--muted-color); stroke-width: 1; }
    .forecast-line { fill: none; stroke: var(--forecast-color); stroke-width: 2.5; stroke-dasharray: 6 4; }
    .unpublished { fill: var(--secondary-text-color,#888); fill-opacity: .09; }
    .axis { display: flex; justify-content: space-between; gap: 4px; margin: 7px 0 0 50px; }
    .axis span { min-width: 0; text-align: center; overflow-wrap: anywhere; }
    .axis span:first-child { text-align: start; }
    .axis span:last-child { text-align: end; }
    .axis b { display: block; font-size: 9px; font-weight: 400; }
    .plot-note { display: flex; flex-wrap: wrap; gap: 6px 14px; margin: 8px 0; font-size: 11px; }
    .legend-item { display: inline-flex; align-items: center; gap: 5px; }
    .swatch { display: inline-block; flex: 0 0 9px; height: 9px; width: 9px; border-radius: 3px; background: var(--swatch); }
    .empty-note { position: absolute; inset: 0; display: grid; place-content: center; padding: 8px; text-align: center;
      color: var(--muted-color); font-size: 11px; background: var(--ha-card-background,var(--card-background-color,#fff)); }
    .track-row { margin: 10px 0 0 50px; }
    .track-label { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 5px; font-size: 11px; overflow-wrap: anywhere; }
    .track-row .plot { background: var(--secondary-background-color,rgba(127,127,127,.1)); border-radius: 5px; }
    .track-row svg { height: 24px; }
    .track-row .empty-note { position: static; min-height: 24px; box-sizing: border-box; padding: 4px 8px; background: none; text-align: start; place-content: center start; }
    .track-health { font-size: 10px; color: var(--warning-color,#ef8b37); display: block; }
    .periods { display: grid; grid-template-columns: repeat(auto-fit,minmax(125px,1fr)); gap: 7px; margin-top: 10px; }
    .period { text-align: center; padding: 9px 7px; border-radius: 10px; background: var(--secondary-background-color,rgba(127,127,127,.12)); }
    .period-name, .period-date, .period-range { color: var(--muted-color); font-size: 10px; }
    .period-value { font-size: 16px; font-weight: 600; margin: 4px 0; }
    .summary-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
    details { font-size: 12px; margin-top: 14px; }
    summary { cursor: pointer; }
    .blocks { list-style: none; margin: 8px 0; padding: 0; }
    .blocks li { padding: 7px 0; border-top: 1px solid var(--divider-color); }
    .pagination { display: flex; gap: 10px; align-items: center; }
    button { font: inherit; color: inherit; background: var(--secondary-background-color); border: 1px solid var(--divider-color); border-radius: 6px; padding: 6px 10px; cursor: pointer; }
    button:disabled { opacity: .4; cursor: default; }
    .warning { color: var(--warning-color,#ef8b37); }
    .error { border-inline-start: 4px solid var(--error-color,#db4437); padding: 12px; color: var(--error-color,#db4437); }
    @container (max-width: 500px) {
      .content { padding: 12px; } .timeline { padding: 10px; }
      .axis span:nth-child(2), .axis span:nth-child(4) { display: none; }
    }
  `];

  public setConfig(raw: unknown): void {
    try {
      const input = raw && typeof raw === "object" && "entity" in raw && !("price" in raw)
        ? { ...raw, price: { entity: raw.entity, path: "prices" } } : raw;
      const validated = validateConfig(input);
      this.config = {
        ...normalizeConfig(validated), ...validated,
        entity: validated.entity ?? validated.price?.entity,
        name: validated.name ?? validated.title ?? "Smart Saving",
        secondary: validated.secondary ?? validated.subtitle,
        price: validated.price ? { ...validated.price, entity: validated.entity ?? validated.price.entity } : undefined,
      };
      this.page = 0;
      this.selectedTime = undefined;
      this.configError = "";
    } catch (error) {
      this.configError = error instanceof Error ? error.message : "Invalid card configuration.";
      throw new Error(`Smart Saving Plan card: ${this.configError}`);
    }
  }

  public static async getConfigElement(): Promise<HTMLElement> { return document.createElement("mushroom-addition-editor"); }
  public static getStubConfig(hass?: HomeAssistant, entities: string[] = [], fallback: string[] = []): SmartSavingConfig {
    return smartSavingStub(hass, entities, fallback);
  }
  public getCardSize(): number { return 8; }

  private t(text: string): string { return localizeText(this.hass, text); }
  private entity(id?: string) { return id ? this.hass?.states[id] : undefined; }
  private hasValueSource(source?: ValueSource) { return !!source?.entity || source?.value !== undefined; }
  private value(source?: ValueSource): number | undefined {
    if (!source?.entity) return numeric(source?.value);
    const entity = this.entity(source.entity);
    if (!sourceAvailable(entity)) return undefined;
    return numeric(source.field ? readPath(entity?.attributes, source.field) : entity?.state);
  }
  private percent(value?: number) { return value !== undefined && value >= 0 && value <= 100 ? value : undefined; }
  private number(value: number, digits = 1): string { return energyNumber(this.hass, value, { maximumFractionDigits: digits }); }
  private date(time: number): string { return energyTime(this.hass, time, { hour: undefined, minute: undefined, weekday: "short", month: "short", day: "numeric" }); }
  private time(time: number): string { return energyTime(this.hass, time); }
  private health(id?: string, maxAge?: number) {
    return id ? sourceHealth(this.entity(id), Date.now(), maxAge ?? this.config?.maxSourceAgeMinutes ?? 1440) : undefined;
  }
  private healthNote(id?: string, maxAge?: number) {
    if (!id) return nothing;
    const health = this.health(id, maxAge);
    const updated = Date.parse(this.entity(id)?.last_updated ?? "");
    const age = Math.max(0, Math.floor((Date.now() - updated) / 60_000));
    const relative = Number.isFinite(updated) && updated <= Date.now() + 60_000
      ? new Intl.RelativeTimeFormat(this.hass?.locale?.language || normalizeLocale(this.hass?.language), { numeric: "auto" })
        .format(age < 60 ? -age : age < 1440 ? -Math.floor(age / 60) : -Math.floor(age / 1440), age < 60 ? "minute" : age < 1440 ? "hour" : "day")
      : undefined;
    return html`<span class=${health ? "warning" : "source-age"}>${health ? `${this.t("Source")}: ${this.t(health)} · ` : ""}${this.t("Updated")}: ${relative ?? this.t("Not specified")}</span>`;
  }

  private coverage(intervals: Pick<TimeInterval, "start" | "end">[], start: number, end: number) {
    const missing = coverageGaps(intervals, start, end).reduce((total, gap) => total + gap.end - gap.start, 0);
    const hours = (duration: number) => `${this.number(duration / 3_600_000, 2)} h`;
    return html`<span class="coverage">${this.t("Published duration")}: ${hours(end - start - missing)}
      · ${this.t("Missing duration")}: ${hours(missing)}</span>`;
  }

  private selectTime(event: PointerEvent, start: number, end: number): void {
    if (!event.isPrimary || event.button > 0) return;
    const plot = event.currentTarget as SVGSVGElement;
    if (event.type === "pointerdown") plot.setPointerCapture(event.pointerId);
    if (event.type === "pointermove" && !plot.hasPointerCapture(event.pointerId)) return;
    const bounds = plot.getBoundingClientRect();
    if (bounds.width > 0) this.selectedTime = start + Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)) * (end - start);
  }

  private cursor(time: number, start: number, end: number, height: number) {
    const x = (time - start) / (end - start) * this.chartWidth;
    return svg`<line class="selection-line" x1=${x} x2=${x} y1="0" y2=${height}></line>`;
  }

  private axes(start: number, end: number) {
    return html`<div class="axis">${Array.from({ length: 5 }, (_, i) => {
      const time = start + (end - start) * i / 4;
      return html`<span>${this.time(time)}<b>${this.date(time)}</b></span>`;
    })}</div>`;
  }

  private gaps(intervals: Pick<TimeInterval, "start" | "end">[], start: number, end: number, height: number) {
    const x = (time: number) => (time - start) / (end - start) * this.chartWidth;
    return coverageGaps(intervals, start, end).map(gap => svg`
      <rect class="unpublished" x=${x(gap.start)} y="0" width=${x(gap.end) - x(gap.start)} height=${height}>
        <title>${this.t("Unpublished data, not zero")}: ${this.date(gap.start)} ${this.time(gap.start)} – ${this.date(gap.end)} ${this.time(gap.end)}</title>
      </rect>`);
  }

  private dayLines(start: number, end: number, height: number) {
    const lines = [];
    for (let day = calendarDay(start, 1, this.hass?.config?.time_zone); day < end;
      day = calendarDay(day, 1, this.hass?.config?.time_zone)) {
      const x = (day - start) / (end - start) * this.chartWidth;
      lines.push(svg`<line class="grid-line" x1=${x} x2=${x} y1="0" y2=${height}><title>${this.date(day)}</title></line>`);
    }
    return lines;
  }

  private renderCard() {
    const config = this.config;
    if (!config || !this.hass) return nothing;
    if (!config.price?.entity) return html`<ha-card class=${config.card_shadow ? "card-shadow" : ""}><div class="content">
      ${this.renderSharedHeading()}${energySetupNotice(this.hass)}
    </div></ha-card>`;
    const now = Date.now(), requestedEnd = now + (config.visibleHours ?? 36) * 3_600_000;
    const priceEntity = this.entity(config.price?.entity);
    const parsedPrices = readPriceIntervals(priceEntity, config.price ?? { entity: "" });
    const forecastMapping = { startField: "time", valueField: "value", ...config.battery?.forecast };
    const parsedForecast = strictForecast(this.entity(config.battery?.forecast?.entity), forecastMapping);
    const tracks = TRACKS.filter(track => config.tracks?.[track.key]?.entity).map(track => {
      const mapping = { startField: "start", endField: "end", ...config.tracks![track.key]! };
      const entity = this.entity(mapping.entity);
      const parsed = track.key === "solar" ? strictIntervals(entity, mapping, mapping.valueField ?? "value") : strictBlocks(entity, mapping);
      const valid = parsed.valid && (track.key !== "solar" || parsed.items.every(item => item.value >= 0));
      return { ...track, name: track.key === "applied" && mapping.meaning !== "confirmed" ? "Planned sale" : track.name,
        mapping, valid, items: valid ? parsed.items : [] };
    });
    const sourceUnit = config.price?.sourceUnit ?? "EUR/kWh";
    const unit = config.price?.displayUnit ?? sourceUnit;
    const currency = priceCurrency(sourceUnit, unit, config.price?.currency);
    const unitLabel = unit === "ct/kWh" ? `${unit} (${currency})` : unit;
    const rawPrices = parsedPrices.items.map(item => ({ ...item, value: convertPrice(item.value, sourceUnit, unit) }));
    const publishedEnds = [
      ...rawPrices.filter(item => item.start < requestedEnd && item.end > now).map(item => item.end),
      ...parsedForecast.items.filter(point => point.time > now && point.time <= requestedEnd).map(point => point.time),
      ...tracks.flatMap(track => track.items.filter(item => item.start < requestedEnd && item.end > now).map(item => item.end)),
    ];
    const end = config.horizon === "published" && publishedEnds.length
      ? Math.min(requestedEnd, Math.max(...publishedEnds)) : requestedEnd;
    const prices = clipIntervals(rawPrices, now, end);
    const forecast = parsedForecast.items.filter(point => point.time >= now && point.time <= end);
    const segments = visibleForecastSegments(parsedForecast.items, config.forecastGapMinutes ?? 60, now, end);
    const batteryCoverage = segments.filter(segment => segment.length > 1).map(segment => ({ start: segment[0].time, end: segment.at(-1)!.time }));
    const selected = Math.max(now, Math.min(end, this.selectedTime ?? now));
    const selectedPrice = prices.find(item => item.start <= selected && selected < item.end);
    const selectedSegment = segments.find(segment => segment[0].time <= selected && selected <= segment.at(-1)!.time);
    const selectedForecast = selectedSegment?.reduce((closest, point) => Math.abs(point.time - selected) < Math.abs(closest.time - selected) ? point : closest);
    const lastForecast = parsedForecast.items.at(-1);
    const currentSoc = this.percent(this.value(config.battery?.current));
    const target = this.percent(this.value(config.battery?.target));
    const horizon = this.value(config.battery?.horizon);
    const horizonTime = horizon !== undefined && horizon > 0 && horizon <= 168 ? now + horizon * 3_600_000 : undefined;
    const exactHorizon = horizonTime === undefined ? undefined
      : parsedForecast.items.find(point => Math.abs(point.time - horizonTime) < 60_000);
    const x = (time: number) => (time - now) / (end - now) * this.chartWidth;
    const average = weightedAverage(prices);
    const values = prices.map(item => item.value);
    const min = Math.min(0, ...values), max = Math.max(0, ...values);
    const padding = Math.max((max - min) * .12, unit === "ct/kWh" ? .1 : .001);
    const chartMin = min < 0 ? min - padding : 0, chartMax = max + padding;
    const priceY = (value: number) => 144 - (value - chartMin) / (chartMax - chartMin) * 138;
    const batteryY = (value: number) => 94 - value / 100 * 88;
    const invalid = this.t("Invalid data source or field mapping");
    const priceMessage = !sourceAvailable(priceEntity) ? this.t(priceEntity ? "Unavailable" : "Source missing")
      : !parsedPrices.valid ? this.t(parsedPrices.error ?? "Invalid data source or field mapping") : !prices.length ? this.t("No published intervals") : "";
    const forecastMessage = !config.battery?.forecast?.entity ? "" : !sourceAvailable(this.entity(config.battery?.forecast?.entity))
      ? `${this.t("Forecast")}: ${this.t(this.entity(config.battery?.forecast?.entity) ? "Unavailable" : "Source missing")}`
      : !parsedForecast.valid ? `${this.t("Forecast")}: ${invalid}` : !segments.length ? this.t("No published forecast") : "";
    const hasBattery = !!config.battery?.forecast?.entity;
    const periods = buildPeriodAverages(rawPrices, now, end,
      config.periods?.length ? config.periods : DEFAULT_PERIODS.map(period => ({ ...period, name: this.t(period.name) })),
      this.hass.config?.time_zone);
    const energy = this.value(config.summary?.purchaseEnergy), cost = this.value(config.summary?.purchaseCost);
    const planMapping = { startField: "start", endField: "end", ...config.tracks?.plan, path: config.planBlocksPath ?? "blocks" };
    const plan = strictBlocks(this.entity(config.planBlocksEntity), planMapping);
    const page = Math.min(this.page, Math.max(0, Math.ceil(plan.items.length / PAGE_SIZE) - 1));
    const priceDigits = unit === "ct/kWh" ? 1 : 3;
    const priceText = (value: number) => `${this.number(value, priceDigits)} ${unitLabel}`;
    const intervalTooltip = (item: TimeInterval) => `${this.date(item.start)} ${this.time(item.start)} – ${this.date(item.end)} ${this.time(item.end)}`;

    return html`<ha-card class=${config.card_shadow ? "card-shadow" : ""}>
      <div class="content" style=${`max-width:${config.maxContentWidth === 0 ? "none" : `${config.maxContentWidth ?? 1200}px`}`}>
        <div class="header">
          <div class="heading">${this.renderSharedHeading()}</div>
          ${config.statusEntity ? html`<span class="chip status">${sourceAvailable(this.entity(config.statusEntity))
            ? this.hass.formatEntityState?.(this.entity(config.statusEntity)!) ?? this.entity(config.statusEntity)!.state : this.t("Unavailable")}</span>` : nothing}
          ${this.hasValueSource(config.battery?.current) ? html`<span class="current">${this.t("Current battery")} <b>${currentSoc === undefined ? this.t("Unavailable") : `${this.number(currentSoc)}%`}</b>
            ${this.healthNote(config.battery?.current?.entity, config.battery?.current?.maxSourceAgeMinutes)}</span>` : nothing}
        </div>
        <div class="description">${this.t("Timeline")}: ${this.date(now)} ${this.time(now)} – ${this.date(end)} ${this.time(end)}
          · ${this.number((end - now) / 3_600_000)} h</div>
        <div class="timeline">
          <section class="chart-section">
            <h2 class="chart-title">${this.t("Published electricity prices")} · ${unitLabel}</h2>
            <div class="plot-row">
              <div class="scale">${[chartMax, (chartMin + chartMax) / 2, chartMin].map(value => html`<span>${this.number(value, priceDigits)}</span>`)}</div>
              <div class="plot price-plot">
                <svg viewBox=${`0 0 ${this.chartWidth} 150`} preserveAspectRatio="none" role="img" aria-label=${this.t("Published electricity prices")}
                  @pointerdown=${(event: PointerEvent) => this.selectTime(event, now, end)}
                  @pointermove=${(event: PointerEvent) => this.selectTime(event, now, end)}>
                  ${this.gaps(prices, now, end, 150)}${this.dayLines(now, end, 150)}
                  ${[chartMin, (chartMin + chartMax) / 2, chartMax].map(value => svg`<line class="grid-line" x1="0" x2=${this.chartWidth} y1=${priceY(value)} y2=${priceY(value)}></line>`)}
                  <line class="zero-line" x1="0" x2=${this.chartWidth} y1=${priceY(0)} y2=${priceY(0)}></line>
                  ${average === null ? nothing : svg`<line class="avg-line" x1="0" x2=${this.chartWidth} y1=${priceY(average)} y2=${priceY(average)}></line>`}
                  ${prices.map(item => svg`<rect class="price-bar" x=${x(item.start)} y=${Math.min(priceY(item.value), priceY(0))}
                    width=${Math.max(.5, x(item.end) - x(item.start) - 1)} height=${Math.max(.75, Math.abs(priceY(item.value) - priceY(0)))} rx="2"
                    fill=${average !== null && item.value <= average ? "var(--price-low)" : "var(--price-high)"}><title>${intervalTooltip(item)} · ${priceText(item.value)}</title></rect>`)}
                  ${this.cursor(selected, now, end, 150)}
                </svg>
                ${priceMessage ? html`<div class="empty-note" role="status">${this.t("Price")}: ${priceMessage}</div>` : nothing}
              </div>
            </div>
            <div class="plot-note">
              ${average === null ? nothing : html`
                <span>${this.t("Average")}: <b>${priceText(average)}</b></span>
                <span>${this.t("Minimum")}: ${priceText(Math.min(...values))}</span><span>${this.t("Maximum")}: ${priceText(Math.max(...values))}</span>
                <span class="legend-item"><i class="swatch" style="--swatch:var(--price-low)"></i>${this.t("Price")} ≤ ${this.t("Average")}</span>
                <span class="legend-item"><i class="swatch" style="--swatch:var(--price-high)"></i>${this.t("Price")} &gt; ${this.t("Average")}</span>`}
              <span>${this.t(coverageGaps(prices, now, end).length ? "Partial" : "Complete")}</span>
              ${this.coverage(prices, now, end)}
              ${this.healthNote(config.price?.entity, config.price?.maxSourceAgeMinutes)}
            </div>
          </section>
          ${hasBattery ? html`<section class="chart-section">
            <h2 class="chart-title">${this.t("Battery level · measured now and forecast")}</h2>
            <div class="plot-row">
              <div class="scale"><span>100%</span><span>50%</span><span>0%</span></div>
              <div class="plot battery-plot">
                <svg viewBox=${`0 0 ${this.chartWidth} 100`} preserveAspectRatio="none" role="img" aria-label=${this.t("Battery level · measured now and forecast")}
                  @pointerdown=${(event: PointerEvent) => this.selectTime(event, now, end)}
                  @pointermove=${(event: PointerEvent) => this.selectTime(event, now, end)}>
                  ${this.gaps(batteryCoverage, now, end, 100)}
                  ${this.dayLines(now, end, 100)}
                  ${[0, 50, 100].map(value => svg`<line class="grid-line" x1="0" x2=${this.chartWidth} y1=${batteryY(value)} y2=${batteryY(value)}></line>`)}
                  ${target === undefined ? nothing : svg`<line class="target-line" x1="0" x2=${this.chartWidth} y1=${batteryY(target)} y2=${batteryY(target)}></line>`}
                  ${segments.filter(segment => segment.length > 1).map(segment => svg`<polyline class="forecast-line" points=${segment.map(point => `${x(point.time)},${batteryY(point.value)}`).join(" ")}></polyline>`)}
                  ${forecast.map(point => svg`<circle class="forecast-point" cx=${x(point.time)} cy=${batteryY(point.value)} r="2.5" fill="var(--forecast-color)">
                    <title>${this.t("Forecast")}: ${this.number(point.value)}% · ${this.date(point.time)} ${this.time(point.time)}</title></circle>`)}
                  ${currentSoc === undefined ? nothing : svg`<circle class="measured-point" cx="4" cy=${batteryY(currentSoc)} r="4" fill="var(--forecast-color)">
                    <title>${this.t("Measured SoC now")}: ${this.number(currentSoc)}%</title></circle>`}
                  ${horizonTime !== undefined && horizonTime <= end ? svg`<line class="avg-line" x1=${x(horizonTime)} x2=${x(horizonTime)} y1="0" y2="100"></line>` : nothing}
                  ${this.cursor(selected, now, end, 100)}
                </svg>
                ${forecastMessage && currentSoc === undefined ? html`<div class="empty-note" role="status">${forecastMessage}</div>` : nothing}
              </div>
            </div>
            <div class="plot-note">
              <span class="legend-item"><i class="swatch" style="--swatch:var(--forecast-color)"></i>${this.t("Forecast")}</span>
              ${forecastMessage ? html`<span role="status">${forecastMessage}</span>` : nothing}
              ${target === undefined ? nothing : html`<span>${this.t("Plan target")}: ${this.number(target)}%</span>`}
              ${horizonTime === undefined ? config.battery?.horizon ? html`<span class="warning">${this.t("Horizon")}: ${this.t("Unavailable")}</span>` : nothing
                : html`<span>${this.t("Requested horizon")}: ${this.number(horizon!)} h${exactHorizon ? ` · ${this.number(exactHorizon.value)}% · ${this.time(exactHorizon.time)}` : ""}</span>`}
              ${lastForecast ? html`<span class="forecast-endpoint">${this.t("Last supplied forecast")}: <b>${this.number(lastForecast.value)}%</b>
                · ${this.date(lastForecast.time)} ${this.time(lastForecast.time)}</span>` : nothing}
              ${this.coverage(batteryCoverage, now, end)}
              ${this.healthNote(config.battery?.forecast?.entity, config.battery?.forecast?.maxSourceAgeMinutes)}${this.healthNote(config.battery?.horizon?.entity, config.battery?.horizon?.maxSourceAgeMinutes)}${this.healthNote(config.battery?.target?.entity, config.battery?.target?.maxSourceAgeMinutes)}
              ${config.battery?.target && target === undefined ? html`<span class="warning">${this.t("Plan target")}: ${this.t("Unavailable")}</span>` : nothing}
            </div>
          </section>` : nothing}
          ${tracks.length ? html`<section class="chart-section">
            <h2 class="chart-title">${this.t("Supplied schedules")}</h2>
            ${tracks.map(track => {
              const items = clipIntervals(track.items, now, end);
              const solarMax = Math.max(0, ...items.map(item => item.value));
              const missing = !sourceAvailable(this.entity(track.mapping.entity));
              const message = missing ? this.t(this.entity(track.mapping.entity) ? "Unavailable" : "Source missing")
                : !track.valid ? invalid : !items.length ? this.t(track.key === "solar" ? "No forecast production values" : "No blocks scheduled") : "";
              return html`<div class="track-row" data-track=${track.key}>
                <div class="track-label"><span class="legend-item"><i class="swatch" style=${`--swatch:${track.color}`}></i>${this.t(track.key === "applied" && track.mapping.meaning !== "confirmed" ? "Planned sale" : track.name)}</span>
                  ${track.key !== "solar" && track.mapping.meaning === "confirmed" ? html`<span>${this.t("Confirmed action")}</span>` : nothing}
                  ${this.healthNote(track.mapping.entity, track.mapping.maxSourceAgeMinutes)}</div>
                <div class="plot">${message ? html`<div class="empty-note" role="status">${message}</div>`
                  : svg`<svg viewBox=${`0 0 ${this.chartWidth} 24`} preserveAspectRatio="none" role="img" aria-label=${this.t(track.name)}
                    @pointerdown=${(event: PointerEvent) => this.selectTime(event, now, end)}
                    @pointermove=${(event: PointerEvent) => this.selectTime(event, now, end)}>
                    ${track.key === "solar" ? this.gaps(items, now, end, 24) : nothing}
                    ${items.map(item => svg`<rect x=${x(item.start)} y="2" width=${Math.max(.5, x(item.end) - x(item.start) - 1)} height="20" rx="3"
                      fill=${track.color} opacity=${track.key === "solar" ? solarMax ? .22 + .78 * item.value / solarMax : .22 : 1}>
                      <title>${this.t(track.name)}: ${intervalTooltip(item)}${track.key === "solar" ? ` · ${this.number(item.value)} ${track.mapping.unit ?? ""}` : this.blockDetails(item.source, track.mapping)}</title></rect>`)}
                    ${this.cursor(selected, now, end, 24)}
                  </svg>`}</div>
              </div>${track.key === "solar" ? html`<p class="plot-note">${this.t("Forecast production")}: ${items.length ? `0–${this.number(solarMax)} ${track.mapping.unit ?? this.t("Unit")}` : this.t("No data")}
                ${this.coverage(items, now, end)}</p>` : nothing}`;
            })}
          </section>` : nothing}
          ${this.axes(now, end)}
          <div class="inspector">
            <label for="inspect-time"><span>${this.t("Inspect time")}</span><b>${this.date(selected)} ${this.time(selected)}</b></label>
            <input id="inspect-time" type="range" min="0" max="1000" step="1"
              .value=${String(Math.round((selected - now) / (end - now) * 1000))}
              aria-valuetext=${`${this.date(selected)} ${this.time(selected)}`}
              @input=${(event: Event) => { this.selectedTime = now + Number((event.target as HTMLInputElement).value) / 1000 * (end - now); }}>
            <div class="inspection-values" aria-live="polite">
              <div class="inspection-value">${this.t("Price")}<b>${selectedPrice ? priceText(selectedPrice.value) : priceMessage || this.t("No published intervals")}</b>
                ${selectedPrice ? html`<small>${intervalTooltip(selectedPrice)}</small>` : nothing}</div>
              ${hasBattery ? html`<div class="inspection-value">${this.t("Forecast")}<b>${selectedForecast ? `${this.number(selectedForecast.value)}%` : forecastMessage || this.t("No published forecast")}</b>
                ${selectedForecast ? html`<small>${this.date(selectedForecast.time)} ${this.time(selectedForecast.time)}</small>` : nothing}</div>` : nothing}
              ${tracks.map(track => {
                const item = track.items.find(item => item.start <= selected && selected < item.end);
                return html`<div class="inspection-value">${this.t(track.key === "applied" && track.mapping.meaning !== "confirmed" ? "Planned sale" : track.name)}
                  <b>${!sourceAvailable(this.entity(track.mapping.entity)) ? this.t(this.entity(track.mapping.entity) ? "Unavailable" : "Source missing")
                    : !track.valid ? invalid : item ? track.key === "solar" ? `${this.number(item.value)} ${track.mapping.unit ?? this.t("Unit")}`
                    : this.t(track.mapping.meaning === "confirmed" ? "Confirmed action" : "Supplied schedules")
                    : this.t(track.key === "solar" ? "No published forecast" : "No blocks scheduled")}</b>
                  ${item ? html`<small>${intervalTooltip(item)}${track.key === "solar" ? "" : this.blockDetails(item.source, track.mapping)}</small>` : nothing}</div>`;
              })}
            </div>
          </div>
          <details class="explanations"><summary>${this.t("Description")}</summary>
            <p>${this.t("Unpublished data, not zero")}</p>
            <p>${this.t("The inspector shows the nearest supplied forecast point within a connected segment, with its timestamp; gaps are not interpolated.")}</p>
            ${tracks.some(track => track.key === "solar") ? html`<p>${this.t("Solar values are forecast production, not measured production.")}</p>` : nothing}
          </details>
        </div>
        <details class="period-details" .open=${this.periodsExpanded} @toggle=${(event: Event) => { this.periodsExpanded = (event.currentTarget as HTMLDetailsElement).open; }}>
          <summary>${this.t("Periods")} · ${this.t("Average")}</summary>
          ${this.periodsExpanded ? html`<div class="periods">${periods.map(period => html`<div class="period">
            <div class="period-name">${period.name}</div><div class="period-date">${period.date}</div>
            <div class="period-value">${period.average === null ? "—" : priceText(period.average)}</div>
            <div class="period-range">${this.t(period.coverage === "complete" ? "Complete" : period.coverage === "partial" ? "Partial" : "No published intervals")}</div>
          </div>`)}</div><p class="period-note">${this.t("Averages use published intervals only, weighted by duration. Gaps are not estimated.")}</p>` : nothing}
        </details>
        <div class="summary-chips">
          ${this.hasValueSource(config.summary?.purchaseEnergy) || this.hasValueSource(config.summary?.purchaseCost) ? html`<span class="chip">${this.t("Planned purchase")}:
            ${this.hasValueSource(config.summary?.purchaseEnergy) ? html`<b>${energy === undefined ? this.t("Unavailable") : `${this.number(energy, 2)} ${this.entity(config.summary?.purchaseEnergy?.entity)?.attributes.unit_of_measurement ?? "kWh"}`}</b>${this.healthNote(config.summary?.purchaseEnergy?.entity, config.summary?.purchaseEnergy?.maxSourceAgeMinutes)}` : nothing}
            ${this.hasValueSource(config.summary?.purchaseCost) ? html`<b>${cost === undefined ? this.t("Unavailable") : `${this.number(cost, 2)} ${this.entity(config.summary?.purchaseCost?.entity)?.attributes.unit_of_measurement ?? currency}`}</b>${this.healthNote(config.summary?.purchaseCost?.entity, config.summary?.purchaseCost?.maxSourceAgeMinutes)}` : nothing}
          </span>` : nothing}
        </div>
        ${config.planBlocksEntity ? html`<details class="plan-details" .open=${this.expanded}
          @toggle=${(event: Event) => { this.expanded = (event.currentTarget as HTMLDetailsElement).open; }}>
          <summary>${this.t("Plan blocks")} (${plan.items.length})</summary>
          ${this.expanded ? html`${this.healthNote(config.planBlocksEntity)}
            ${!plan.valid ? html`<p role="status">${!sourceAvailable(this.entity(config.planBlocksEntity)) ? this.t("Source missing") : invalid}</p>`
              : !plan.items.length ? html`<p>${this.t("No blocks scheduled")}</p>`
              : html`<ul class="blocks">${plan.items.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map(block => html`
                <li>${intervalTooltip(block)}${this.blockDetails(block.source, planMapping)}</li>`)}</ul>
                ${plan.items.length > PAGE_SIZE ? html`<div class="pagination">
                  <button ?disabled=${page === 0} @click=${() => { this.page = page - 1; }}>${this.t("Previous")}</button>
                  <span>${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, plan.items.length)} / ${plan.items.length}</span>
                  <button ?disabled=${(page + 1) * PAGE_SIZE >= plan.items.length} @click=${() => { this.page = page + 1; }}>${this.t("Next")}</button>
                </div>` : nothing}`}` : nothing}
        </details>` : nothing}
        <p class="footnote">${this.t("Plan values come from entities. This card does not calculate plans or infer future battery levels.")}</p>
      </div>
    </ha-card>`;
  }

  private blockDetails(raw: unknown, mapping?: FieldMapping) {
    const quantity = (field: string, unit?: string) => {
      const value = readPath(raw, field);
      if (value === undefined) return undefined;
      const number = numeric(value);
      return number === undefined ? String(value) : `${this.number(number, 2)} ${unit || `${this.t("Unit")}: ${this.t("Not specified")}`}`;
    };
    return [
      [this.t("Power"), quantity(mapping?.powerField ?? "power", mapping?.powerUnit)],
      [this.t("Energy"), quantity(mapping?.energyField ?? "energy", mapping?.energyUnit)],
      ["", readPath(raw, mapping?.statusField ?? "status")],
    ].filter(([, value]) => value !== undefined).map(([label, value]) => ` · ${label ? `${label} ` : ""}${String(value)}`).join("");
  }

  protected render() {
    if (this.configError) return html`<ha-card><div class="error" role="alert">${this.t("Configuration error")}: ${this.configError}</div></ha-card>`;
    return this.renderCard();
  }
}
