import { css, html, nothing, svg, type PropertyValues } from "lit";
import { customElement, state } from "lit/decorators.js";
import { MushroomAdditionCard } from "../card";
import { getCatalogItem } from "../catalog";
import { sharedStyles } from "../styles";
import { resolveColor } from "../colors";
import { localizeText, normalizeLocale } from "../localize";
import { energyNumber, energyTime } from "../energy-format";
import { timestamp, readPath } from "../energy-cards/data";
import { relevantHassChanged } from "../energy-cards/helpers";
import type { HomeAssistant } from "../types";
import { ENERGY_PLAN_TAG, planOptions, validatePlan, type EnergyPlanConfig, type PlanMetric, type PlanRow } from "./config";
import { displayIntervals, displayPowerScale, displayPriceIntervals, intervalLabel, metricValue, rowCoverage, rowData, type RowData } from "./data";

const LEFT = 0, RIGHT = 848, WIDTH = 848, TOP = 0;

@customElement(ENERGY_PLAN_TAG)
export class EnergyPlanCard extends MushroomAdditionCard {
  @state() protected config?: EnergyPlanConfig;
  @state() private selected = 0;
  protected descriptor = getCatalogItem(ENERGY_PLAN_TAG);
  private refresh?: number;

  static styles = [sharedStyles, css`
    :host([fill-container]), :host([fill-container]) ha-card { height: 100%; }
    .content { padding: 16px; }
    .energy-heading { border: 0; background: none; color: inherit; padding: 0; width: 100%; text-align: start; }
    .overview { margin-top: 16px; }
    h3 { font-size: 13px; font-weight: 500; margin: 0 0 8px; }
    p, .legend { color: var(--secondary-text-color); font-size: 12px; line-height: 1.6; }
    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin: 16px 0; }
    .metric, .period { background: var(--addition-neutral-background); padding: 12px; border-radius: 12px; }
    .metric-heading { padding: 0; min-height: 0; display: flex; font-size: 12px; }
    ha-icon { --mdc-icon-size: 18px; }
    .metric-value { font-size: 22px; margin-top: 8px; color: var(--primary-text-color); }
    .metric-value small { font-size: 12px; color: var(--secondary-text-color); }
    :host { container-type: inline-size; display: block; min-width: 0; }
    .chart-scroll { overflow: auto; max-height: 560px; margin-top: 12px; }
    .timeline-layout { display: grid; grid-template-columns: 180px minmax(540px, 1fr); }
    .timeline { display: block; width: 100%; }
    .timeline-axis, .axis-corner { position: sticky; top: 0; background: var(--ha-card-background, var(--card-background-color)); z-index: 2; }
    .axis-corner { left: 0; z-index: 4; }
    .timeline-labels { position: sticky; left: 0; background: var(--ha-card-background, var(--card-background-color)); z-index: 3; }
    .row-label { display: flex; flex-direction: column; justify-content: center; font-size: 12px; padding-inline-end: 8px; color: var(--secondary-text-color); }
    .row-label span { display: flex; align-items: center; gap: 7px; }
    .row-label small, .status { font-size: 10px; color: var(--secondary-text-color); }
    .status { margin: 8px 0; }
    .timeline:focus-visible { outline: 2px solid var(--primary-color); outline-offset: -2px; }
    @container (max-width: 620px) {
      .content { padding: 12px; }
      .timeline-layout { grid-template-columns: 128px minmax(540px, 1fr); }
      .metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
      .metric, .period { min-width: 0; overflow-wrap: anywhere; }
      .row-label { overflow-wrap: anywhere; }
      .row-label span { gap: 5px; }
      .row-label ha-icon { flex-shrink: 0; --mdc-icon-size: 16px; }
      .inspector label { flex-wrap: wrap; gap: 8px; }
      .inspector input { min-height: 44px; margin: 4px 0; }
      .details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; overflow-wrap: anywhere; }
      .periods { grid-template-columns: 1fr; }
    }
    @container (max-width: 480px) {
      .timeline-layout { grid-template-columns: 112px minmax(540px, 1fr); }
      .row-label { font-size: 11px; }
      .metric-value { font-size: 20px; }
    }
    .track { fill: var(--addition-neutral-background); }
    .axis, .empty { fill: var(--secondary-text-color); font: 13px sans-serif; }
    .block-label { fill: var(--primary-text-color); font: 12px sans-serif; }
    .grid { stroke: var(--ha-card-border-color, var(--divider-color)); stroke-width: 1; }
    .cursor { stroke: var(--primary-text-color); stroke-dasharray: 3 4; stroke-width: 1; }
    .inspector { border: 1px solid var(--ha-card-border-color, var(--divider-color)); border-radius: 12px; margin-top: 14px; padding: 12px; }
    .inspector label { display: flex; justify-content: space-between; font-size: 12px; }
    input { display: block; width: 100%; margin: 12px 0; accent-color: var(--primary-color); }
    .details { display: flex; flex-wrap: wrap; gap: 8px 16px; font-size: 12px; }
    .periods { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-top: 16px; }
    .period .metrics { margin-bottom: 0; }
    .legend { margin: 14px 0 0; }
    .error { color: var(--error-color); font-size: 12px; padding: 12px; }
    .empty-card { padding: 12px 0; color: var(--secondary-text-color); }
  `];

  public setConfig(raw: unknown): void {
    const valid = validatePlan(raw, this.hass);
    super.setConfig(valid);
    this.toggleAttribute("fill-container", valid.fill_container === true);
    this.selected = 0;
  }

  public static getStubConfig(hass?: HomeAssistant, entities: string[] = [], fallback: string[] = []): EnergyPlanConfig {
    const ids = [...new Set([...entities, ...fallback, ...Object.keys(hass?.states ?? {})])];
    const now = Date.now();
    const row = planOptions({ type: `custom:${ENERGY_PLAN_TAG}` }).rows[0];
    const entity = ids.find(id => rowData(hass, row, id, now, now + 24 * 3600000).intervals.length > 0);
    return { type: `custom:${ENERGY_PLAN_TAG}`, icon: "mdi:calendar-clock", visibleHours: 24, ...(entity ? { entity } : {}) };
  }

  public getCardSize(): number { return (planOptions(this.config ?? EnergyPlanCard.getStubConfig()).rows.filter(row => row.enabled).length + 4); }

  public getGridOptions(): { columns: "full"; rows: "auto"; min_columns: number; max_columns: number; min_rows: number } {
    return { columns: "full", rows: "auto", min_columns: 12, max_columns: 12, min_rows: 3 };
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this.refresh = window.setInterval(() => this.requestUpdate(), 60_000);
  }
  public disconnectedCallback(): void {
    window.clearInterval(this.refresh);
    this.refresh = undefined;
    super.disconnectedCallback();
  }
  protected shouldUpdate(changed: PropertyValues): boolean {
    return changed.size !== 1 || !changed.has("hass") ||
      relevantHassChanged(changed.get("hass") as HomeAssistant | undefined, this.hass, this.config);
  }

  private t(value: string): string { return localizeText(this.hass, value); }
  private time(value: number, axis = false): string {
    return energyTime(this.hass, value, { weekday: axis ? undefined : "short" });
  }
  private value(value: number): string {
    return energyNumber(this.hass, value);
  }
  private metric(metric: PlanMetric) {
    const value = metricValue(this.hass, metric, planOptions(this.config!).maxAgeMinutes);
    return html`<div class="metric">
      <div class="metric-heading"><ha-icon .icon=${metric.icon} style=${`color:${resolveColor(metric.color, "green")}`}></ha-icon>${metric.name}</div>
      <div class="metric-value">${value === undefined ? this.t("Source missing") : this.value(value)} <small>${value === undefined ? "" : metric.unit}</small></div>
    </div>`;
  }
  private track(row: PlanRow, data: RowData, y: number, start: number, end: number) {
    const color = resolveColor(row.color, "green");
    const x = (time: number) => LEFT + (time - start) / (end - start) * (RIGHT - LEFT);
    const height = planOptions(this.config!).rowHeight - 12;
    const scale = displayPowerScale(row, data.intervals);
    return svg`<g>
      <rect class="track" x=${LEFT} y=${y} width=${RIGHT - LEFT} height=${height} rx="8"></rect>
      ${row.kind === "power" ? svg`<line class="grid" x1=${LEFT} x2=${RIGHT} y1=${y + height / 2} y2=${y + height / 2}></line>` : nothing}
      ${data.error ? svg`<text class="empty" x=${LEFT + 10} y=${y + 22}>${this.t(data.error)}</text>` : (row.kind === "price"
        ? displayPriceIntervals(row, data.intervals) : displayIntervals(row, data.intervals)).map(item => {
        const left = x(item.start), width = Math.max(.5, x(item.end) - left - 1);
        const tone = row.kind === "price"
          ? resolveColor(item.value <= row.low ? row.lowColor : item.value >= row.high ? row.highColor : row.color, color) : color;
        const tooltip = `${this.time(item.start)} – ${this.time(item.end)}: ${this.value(item.minimum)}${item.minimum !== item.maximum ? ` – ${this.value(item.maximum)}` : ""} ${row.unit}`;
        if (row.kind === "power") {
          const center = y + height / 2, size = Math.min(height / 2 - 2, Math.abs(item.value) / scale * (height / 2 - 2));
          return svg`<rect x=${left} y=${item.value >= 0 ? center - size : center} width=${width} height=${Math.max(.5, size)} rx="1" fill=${tone}><title>${tooltip}</title></rect>`;
        }

        if (row.kind === "soc") {
          const lineY = y + height - item.value / 100 * (height - 4);
          return svg`<rect x=${left} y=${lineY} width=${width + 1} height=${y + height - lineY} fill=${tone} fill-opacity=".12"></rect>
            <line x1=${left} x2=${left + width + 1} y1=${lineY} y2=${lineY} stroke=${tone} stroke-width="2" stroke-dasharray="4 2"><title>${tooltip}</title></line>`;
        }
        const label = row.kind === "schedule" ? intervalLabel(row, item)
          : row.kind === "price" && item.minimum !== item.maximum
            ? `${this.value(item.minimum)}–${this.value(item.maximum)}`
            : this.value(item.value);
        return svg`<rect x=${left} y=${y + 2} width=${width} height=${height - 4} rx="5" fill=${tone} fill-opacity=".25"><title>${tooltip}${row.kind === "schedule" ? ` · ${label}` : ""}</title></rect>
          ${width > Math.max(60, label.length * 9 + 14)
            ? svg`<text class="block-label" x=${left + 7} y=${y + 22}>${label}</text>` : nothing}`;
      })}
    </g>`;
  }

  private selectTime(event: PointerEvent): void {
    const bounds = (event.currentTarget as SVGSVGElement).getBoundingClientRect();
    this.selected = Math.max(0, Math.min(999, Math.round((event.clientX - bounds.left) / bounds.width * 1000)));
  }
  private timelineKey(event: KeyboardEvent): void {
    const delta = event.key === "ArrowLeft" ? -10 : event.key === "ArrowRight" ? 10 : 0;
    if (!delta && !["Home", "End"].includes(event.key)) return;
    event.preventDefault();
    this.selected = event.key === "Home" ? 0 : event.key === "End" ? 999 : Math.max(0, Math.min(999, this.selected + delta));
  }

  protected render() {
    if (!this.config) return nothing;
    const options = planOptions(this.config), duration = (this.config.visibleHours ?? 24) * 3600000;
    const startSource = this.hass?.states[options.startEntity || this.config.entity || ""];
    const start = options.start === "now" ? Date.now() : timestamp(options.startField ? readPath(startSource?.attributes, options.startField) : startSource?.state);
    const updated = timestamp(startSource?.last_updated);
    const stale = options.start === "source" && startSource && (updated === undefined || Date.now() - updated > options.maxAgeMinutes * 60000 || updated > Date.now() + 60000);
    if (start === undefined || !Number.isFinite(new Date(start + duration).getTime()) || stale) return html`<ha-card class=${`mushroom-addition-card${this.config.card_shadow ? " card-shadow" : ""}`}><div class="content">${options.showHeader ? this.renderSharedHeading() : nothing}<p class="error" role="alert">${this.t(stale ? "Stale data source" : "Source missing")}: ${this.t("Start")}</p></div></ha-card>`;
    const end = start + duration;
    const rows = options.rows.filter(row => row.enabled);
    const data = rows.map(row => rowData(this.hass, row, this.config?.entity, start, end, options.maxAgeMinutes));
    const chartHeight = TOP + rows.length * options.rowHeight;
    const ticks = Math.ceil((this.config.visibleHours ?? 24) / options.axisStep);
    const labelStep = Math.max(1, Math.ceil(ticks / 6));
    const instant = start + this.selected / 1000 * duration;
    const selectedX = LEFT + this.selected / 1000 * (RIGHT - LEFT);
    const sourceTimes = rows.map(row => timestamp(this.hass?.states[row.entity || this.config?.entity || ""]?.last_updated))
      .filter((time): time is number => time !== undefined);
    const oldest = sourceTimes.length ? Math.min(...sourceTimes) : undefined;
    const cheapest = rows.flatMap((row, index) => row.kind === "price" && !data[index].error
      ? [{ row, intervals: data[index].intervals }] : []).map(({ row, intervals }) => {
      const minimum = Math.min(...intervals.map(item => item.value));
      return { row, interval: intervals.find(item => item.value === minimum) };
    });
    return html`<ha-card class=${`mushroom-addition-card${this.config.card_shadow ? " card-shadow" : ""}`}>
      <div class="content">
        ${options.showHeader ? this.renderSharedHeading() : nothing}
        ${options.showOverview ? html`<div class="overview"><h3>${options.overview}</h3><p>${options.description}</p></div>` : nothing}
        ${options.showMetrics && options.metrics.length ? html`<div class="metrics">${options.metrics.map(metric => this.metric(metric))}</div>` : nothing}
        <h3>${options.timelineTitle}</h3>
        <p class="status">${this.t("Supplied plan; not measured or executed.")}<br>
          ${this.time(start)} - ${this.time(end)} · ${this.t("Updated")}: ${oldest === undefined ? this.t("Not supplied") : this.time(oldest)}
          ${cheapest.map(({ row, interval }) => interval ? html`<br>${row.name} · ${this.t("Low")}: ${this.value(interval.value)} ${row.unit} · ${this.time(interval.start)} - ${this.time(interval.end)}` : nothing)}
        </p>
        ${rows.length ? html`<div class="chart-scroll">
          <div class="timeline-layout" style=${`min-width:${options.minimumWidth}px`}>
          <div class="axis-corner"></div>
          ${svg`<svg class="timeline timeline-axis" height="52" viewBox=${`0 0 ${WIDTH} 52`} preserveAspectRatio="none" aria-hidden="true">
            ${Array.from({ length: ticks + 1 }, (_, index) => {
              const time = Math.min(end, start + index * options.axisStep * 3600000);
              const x = LEFT + (time - start) / duration * (RIGHT - LEFT);
              const showLabel = index === 0 || index === ticks || index % labelStep === 0 && ticks - index >= labelStep;
              const day = new Intl.DateTimeFormat(normalizeLocale(this.hass?.language), {
                weekday: "short", timeZone: this.hass?.config?.time_zone,
              }).format(time);
              const anchor = index === 0 ? "start" : index === ticks ? "end" : "middle";
              return svg`${showLabel ? svg`<text class="axis" x=${x} y="18" text-anchor=${anchor}>${this.time(time, true)}</text>
                <text class="axis" x=${x} y="41" text-anchor=${anchor}>${day}</text>` : nothing}`;
            })}
          </svg>`}
          <div class="timeline-labels">${rows.map((row, index) => html`<div class="row-label" style=${`height:${options.rowHeight}px`}>
            <span><ha-icon .icon=${row.icon} style=${`color:${resolveColor(row.color, "green")}`}></ha-icon>${row.name}</span>
            ${row.kind === "price" ? html`<small>${row.unit}</small>` : nothing}
            ${row.kind === "power" ? html`<small>±${this.value(displayPowerScale(row, data[index].intervals))} ${row.unit}${["grid", "battery"].includes(row.id) ? ` · ↑${row.positiveLabel} ↓${row.negativeLabel}` : ""}</small>` : nothing}
            ${row.kind === "schedule" && ["grid", "battery"].includes(row.id) ? html`<small>+ → ${row.positiveLabel} · − ← ${row.negativeLabel}</small>` : nothing}
            ${rowCoverage(data[index], start, end) < 1 ? html`<small>${this.t(data[index].error ?? "No published intervals")} · ${this.value(rowCoverage(data[index], start, end) * 100)}%</small>` : nothing}
          </div>`)}</div>
          ${svg`<svg class="timeline timeline-body" height=${chartHeight} viewBox=${`0 0 ${WIDTH} ${chartHeight}`} preserveAspectRatio="none"
            role=${options.showInspector ? "slider" : "img"} tabindex=${options.showInspector ? "0" : "-1"}
            aria-label=${this.t("Timeline")} aria-valuemin="0" aria-valuemax="999" aria-valuenow=${this.selected} aria-valuetext=${this.time(instant)}
            @pointerdown=${options.showInspector ? this.selectTime : nothing} @keydown=${options.showInspector ? this.timelineKey : nothing}>
            ${Array.from({ length: ticks + 1 }, (_, index) => {
              const x = LEFT + Math.min(duration, index * options.axisStep * 3600000) / duration * (RIGHT - LEFT);
              return svg`<line class="grid" x1=${x} x2=${x} y1="0" y2=${chartHeight}></line>`;
            })}
            ${rows.map((row, index) => this.track(row, data[index], TOP + index * options.rowHeight, start, end))}
            ${Date.now() >= start && Date.now() < end ? svg`<line stroke=${resolveColor("green", "green")} x1=${(Date.now() - start) / duration * RIGHT} x2=${(Date.now() - start) / duration * RIGHT} y1="0" y2=${chartHeight}><title>${this.t("Now")}</title></line>` : nothing}
            ${options.showInspector ? svg`<line class="cursor" x1=${selectedX} x2=${selectedX} y1="0" y2=${chartHeight}></line>` : nothing}
          </svg>`}
          </div>
        </div>` : html`<p class="empty-card">${this.t("No published intervals")}</p>`}
        ${options.showInspector ? html`<div class="inspector"><label for="plan-time">${this.t("Timeline")}<span>${this.time(instant)}</span></label>
          <input id="plan-time" type="range" min="0" max="999" .value=${String(this.selected)} aria-valuetext=${this.time(instant)}
            @input=${(event: Event) => { this.selected = Number((event.target as HTMLInputElement).value); }}>
          <div class="details">${rows.map((row, index) => {
            const item = data[index].intervals.find(interval => interval.start <= instant && instant < interval.end);
            return html`<span>${row.name}: <b>${item ? `${this.value(item.value)} ${row.unit}${row.kind === "schedule" ? ` · ${intervalLabel(row, item)}` : ""}` : this.t(data[index].error ?? "No published intervals")}</b></span>`;
          })}</div></div>` : nothing}
        ${options.showPeriods && options.periods.length ? html`<div class="periods">${options.periods.filter(period => period.start < duration / 3600000).map(period => html`
          <div class="period"><h3>${period.name}</h3><p>${this.time(start + period.start * 3600000)} – ${this.time(Math.min(end, start + period.end * 3600000))}</p>
            <p>${period.description}</p>${period.metrics.length ? html`<div class="metrics">${period.metrics.map(metric => this.metric(metric))}</div>` : nothing}</div>`)}</div>` : nothing}
        ${options.showLegend ? html`<p class="legend">${this.t("Plan values come from entities. This card does not calculate plans or infer future battery levels.")}</p>` : nothing}
      </div>
    </ha-card>`;
  }
}
