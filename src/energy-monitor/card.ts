import { css, html, nothing, svg, type PropertyValues } from "lit";
import { state } from "lit/decorators.js";
import { MushroomAdditionCard } from "../card";
import { getCatalogItem } from "../catalog";
import { energyNumber, energyTime } from "../energy-format";
import { localizeText } from "../localize";
import { relevantHassChanged } from "../energy-cards/helpers";
import { coverageGaps } from "../energy-cards/smart-saving-data";
import { localDayStart } from "../energy-insights/data";
import type { AdditionConfig, HomeAssistant } from "../types";
import { MONITOR_CARDS, monitorKind, monitorOptions, monitorStub, validateMonitor, type MonitorConfig, type MonitorKind } from "./config";
import { checkedSnapshot, compareBaseline, costHistory, costValue, counterHistory, flowReadings, historyIds, reading, sampleSeries, type Series, type Span } from "./data";
import { MonitorHistory } from "./history";

interface PlotRow { start: number; end: number; a?: number; b?: number; }
const flowSceneUrl = new URL("./live-flow-scene.jpg", import.meta.url).href;

function plotBuckets(rows: PlotRow[], start: number, end: number, sum: boolean) {
  const count = 48, duration = (end - start) / count;
  const bins = Array.from({ length: count }, (_, i) => ({ start: start + i * duration, end: start + (i + 1) * duration, a: 0, b: 0, coveredA: 0, coveredB: 0 }));
  for (const row of rows) {
    const left = Math.max(0, Math.floor((row.start - start) / duration)), right = Math.min(count - 1, Math.floor((row.end - start) / duration));
    for (let i = left; i <= right; i++) {
      const overlap = Math.min(row.end, bins[i].end) - Math.max(row.start, bins[i].start);
      if (overlap <= 0) continue;
      const weight = sum ? overlap / (row.end - row.start) : overlap;
      if (row.a !== undefined) { bins[i].a += row.a * weight; bins[i].coveredA += overlap; }
      if (row.b !== undefined) { bins[i].b += row.b * weight; bins[i].coveredB += overlap; }
    }
  }
  if (!sum) for (const bin of bins) {
    if (bin.coveredA) bin.a /= bin.coveredA;
    if (bin.coveredB) bin.b /= bin.coveredB;
  }
  return bins;
}

export class EnergyMonitorCard extends MushroomAdditionCard {
  @state() protected config?: MonitorConfig;
  @state() private open = false;
  @state() private page = 0;
  private refresh?: number;
  private readonly history = new MonitorHistory(() => this.requestUpdate());
  protected kind: MonitorKind = "energy_plan_actual";
  protected descriptor = getCatalogItem("mushroom-addition-energy-plan-actual");

  static styles = [MushroomAdditionCard.styles, css`
    :host { display: block; min-width: 0; container-type: inline-size; }
    ha-card { overflow: hidden; }
    .content { box-sizing: border-box; margin: auto; padding: 18px; min-width: 0; }
    .energy-heading { padding: 0; background: none; border: 0; width: 100%; color: inherit; text-align: start; }
    .window, .note, .legend, .diagnostic { font-size: 11px; color: var(--secondary-text-color); line-height: 1.6; overflow-wrap: anywhere; }
    .window { margin: 12px 0; }
    .metrics { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(150px,100%),1fr)); gap: 10px; margin: 14px 0; }
    .metric { padding: 12px; border-radius: 12px; background: var(--addition-neutral-background); min-width: 0; overflow-wrap: anywhere; }
    .metric small { font-size: 11px; color: var(--secondary-text-color); display: block; }
    .metric b { display: block; font-size: 22px; font-weight: 500; margin: 8px 0 4px; font-variant-numeric: tabular-nums; }
    .metric .status { font-size: 10px; color: var(--secondary-text-color); }
    h3 { font-size: 13px; font-weight: 500; margin: 14px 0 8px; }
    .plot-panel { border: 1px solid var(--divider-color); border-radius: 12px; padding: 12px; }
    .plot-grid { display: grid; grid-template-columns: max-content minmax(0,1fr); gap: 10px; }
    .scale { display: flex; flex-direction: column; justify-content: space-between; font-size: 10px; color: var(--secondary-text-color); text-align: end; }
    .plot { position: relative; min-width: 0; }
    .plot svg { width: 100%; height: 150px; display: block; }
    .axis { display: flex; justify-content: space-between; gap: 5px; font-size: 10px; color: var(--secondary-text-color); margin-top: 8px; }
    .axis span { text-align: center; min-width: 0; }
    .axis span:first-child { text-align: start; } .axis span:last-child { text-align: end; }
    .legend { display: flex; flex-wrap: wrap; gap: 12px; margin: 8px 0; }
    .legend span { display: inline-flex; gap: 5px; align-items: center; }
    .swatch { width: 9px; height: 9px; background: var(--tone); border-radius: 3px; display: inline-block; }
    .swatch-line { width: 14px; height: 0; border-top: 2px solid var(--tone); background: none; border-radius: 0; }
    .battery-grid { grid-template-columns: max-content minmax(0,1fr) max-content; gap: 6px; }
    .battery-grid.power-only { grid-template-columns: max-content minmax(0,1fr); }
    .battery-grid .scale { height: 180px; padding: 7px 0; box-sizing: border-box; }
    .battery-grid .scale span:first-child { transform: translateY(-50%); }
    .battery-grid .scale span:last-child { transform: translateY(50%); }
    .battery-grid .scale:last-child { text-align: start; }
    .battery-grid svg { height: 180px; }
    .axis-units { display: flex; justify-content: space-between; font-size: 10px; color: var(--secondary-text-color); margin-bottom: 6px; }
    .warning { color: var(--warning-color,#ef8b37); } .error { color: var(--error-color,#db4437); }
    .empty { padding: 16px; background: var(--addition-neutral-background); border-radius: 10px; font-size: 12px; }
    details { margin-top: 14px; font-size: 12px; }
    summary, button { cursor: pointer; min-height: 44px; align-content: center; }
    button { font: inherit; color: inherit; border: 1px solid var(--divider-color); border-radius: 8px; background: var(--addition-neutral-background); padding: 8px 12px; }
    button:disabled { opacity: .4; }
    button:focus-visible, summary:focus-visible, .table-scroll:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .table-scroll { overflow: auto; max-height: 300px; margin-top: 10px; }
    table { border-collapse: collapse; width: 100%; white-space: nowrap; text-align: start; font-size: 11px; }
    td, th { padding: 9px; border-bottom: 1px solid var(--divider-color); } th { color: var(--secondary-text-color); font-weight: 400; }
    .pager { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-top: 8px; }
    .flow-scene { position: relative; margin: 18px 0; border: 1px solid var(--divider-color); border-radius: 16px; overflow: hidden; background: #e9eaec; isolation: isolate; }
    .flow-art { position: relative; aspect-ratio: 3 / 2; }
    .flow-art img, .flow-lines { display: block; width: 100%; height: 100%; position: absolute; inset: 0; }
    .flow-art img { object-fit: contain; }
    :host([dark]) .flow-art img { filter: brightness(.68) saturate(.9); }
    .flow-lines { pointer-events: none; overflow: visible; }
    .flow-cable-shadow, .flow-cable, .flow-wire, .flow-highlight { fill: none; stroke-linecap: round; stroke-linejoin: round; }
    .flow-cable-shadow { stroke: #171d25; stroke-width: 5; opacity: .18; transform: translateY(2px); filter: blur(1px); }
    .flow-cable { stroke: #343b42; stroke-width: 3.5; opacity: .9; }
    .flow-wire { stroke: var(--flow-color); opacity: .65; stroke-width: 1.8; }
    .flow-highlight { stroke: #fff; stroke-width: .65; opacity: .25; transform: translateY(-.6px); }
    .flow-line[data-state=unavailable] .flow-wire, .flow-line[data-state=absent] .flow-wire { stroke: #8a9099; stroke-dasharray: 4 6; opacity: .55; }
    .flow-line[data-state=unavailable] .flow-cable, .flow-line[data-state=absent] .flow-cable { opacity: .4; }
    .flow-current { fill: none; stroke: var(--flow-color); stroke-width: 2.2; stroke-linecap: round; stroke-dasharray: 1 9; filter: drop-shadow(0 0 1.5px var(--flow-color)); animation: energy-current var(--flow-duration) linear infinite; }
    .flow-line[data-direction=reverse] .flow-current { animation-direction: reverse; }
    .flow-port { fill: #28323d; stroke: #b6bec7; stroke-width: 2; }
    .flow-port-core { fill: var(--flow-color); }
    .flow-routes { display: flex; flex-wrap: wrap; gap: 8px; margin: 12px 0; }
    .flow-route-reading { flex: 1 1 180px; display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 4px 8px; min-width: 0; padding: 10px 12px; border: 1px solid var(--divider-color); border-inline-start: 3px solid var(--flow-color); border-radius: 10px; font-size: 11px; overflow-wrap: anywhere; }
    .flow-route-reading b { font-variant-numeric: tabular-nums; }
    .flow-route-reading small { grid-column: 1 / -1; color: var(--secondary-text-color); }
    .flow-readings { position: absolute; inset: 0; pointer-events: none; }
    .flow-node { position: absolute; left: var(--node-x); top: var(--node-y); transform: translateX(-50%); min-width: 100px; max-width: 24%;
      box-sizing: border-box; text-align: center; padding: 7px 10px; border: 1px solid var(--divider-color); border-radius: 10px;
      background: var(--ha-card-background,var(--card-background-color,#fff)); color: var(--primary-text-color); box-shadow: 0 2px 8px #0001; overflow-wrap: anywhere; font-size: 11px; }
    .flow-node[data-key=battery], .flow-node[data-key=ev] { top: auto; bottom: 2%; }
    .flow-node b { display: block; font-size: 17px; font-weight: 500; margin: 3px 0; font-variant-numeric: tabular-nums; }
    .flow-node .node-label { color: var(--secondary-text-color); }
    .flow-node .node-label::before { content: ""; width: 6px; height: 6px; display: inline-block; border-radius: 50%; background: var(--flow-color); margin-inline-end: 4px; }
    .flow-node small { display: block; font-size: 9px; color: var(--secondary-text-color); }
    .flow-node .direction { font-size: 10px; min-height: 16px; color: var(--secondary-text-color); }
    @keyframes energy-current { to { stroke-dashoffset: -20; } }
    @media(prefers-reduced-motion:reduce) { .flow-current { animation: none; } }
    @container(max-width:599px) {
      .flow-readings { position: static; display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px; padding: 10px; background: var(--ha-card-background,var(--card-background-color,#fff)); }
      .flow-node { position: static; transform: none; min-width: 0; max-width: none; padding: 8px; box-shadow: none; background: var(--addition-neutral-background); }
      .flow-node[data-key=home] { grid-column: 1 / -1; }
      .flow-node small { font-size: 10px; }
    }
    @container(max-width:500px) { .content { padding: 12px; } .metrics { grid-template-columns: repeat(2,minmax(0,1fr)); } .metric b { font-size: 19px; } .axis span:nth-child(even) { display:none; } }
  `];

  public setConfig(raw: AdditionConfig): void {
    const config = validateMonitor(raw);
    this.kind = monitorKind(config.type)!;
    this.descriptor = getCatalogItem(config.type.replace(/^custom:/, ""));
    super.setConfig(config);
    this.open = false; this.page = 0;
    this.history.clear();
  }
  public getCardSize(): number { return this.kind === "live_energy_flow" ? 12 : 8; }
  public connectedCallback(): void {
    super.connectedCallback();
    this.refresh = window.setInterval(() => { this.requestUpdate(); this.load(); }, 60000);
    this.requestUpdate();
  }
  public disconnectedCallback(): void {
    window.clearInterval(this.refresh); this.refresh = undefined;
    this.history.clear(); super.disconnectedCallback();
  }
  protected shouldUpdate(changed: PropertyValues): boolean {
    const previous = changed.get("hass") as HomeAssistant | undefined;
    return changed.size !== 1 || !changed.has("hass") || previous?.connection !== this.hass?.connection ||
      previous?.callWS !== this.hass?.callWS || relevantHassChanged(previous, this.hass, this.config);
  }
  protected updated(changed: PropertyValues = new Map()): void {
    super.updated();
    if (changed.has("hass")) {
      const previous = changed.get("hass") as HomeAssistant | undefined;
      if (previous?.connection !== this.hass?.connection || previous?.callWS !== this.hass?.callWS || previous?.config !== this.hass?.config) this.history.clear();
    }
    this.load();
  }
  private load(): void {
    if (!this.isConnected || !this.hass || !this.config || this.kind === "live_energy_flow") return;
    const options = monitorOptions(this.config), now = Date.now();
    const start = localDayStart(now, this.hass.config?.time_zone || "UTC");
    const ids = historyIds(this.kind, options);
    void this.history.load(this.hass, ids, start, now, JSON.stringify(options));
  }
  private t(text: string) { return localizeText(this.hass, text); }
  private number(value: number, digits = 2) { return energyNumber(this.hass, value, { maximumFractionDigits: digits }); }
  private time(value: number) { return energyTime(this.hass, value); }
  private metric(label: string, value: number | undefined, unit: string, note?: string) {
    return html`<div class="metric"><small>${this.t(label)}</small><b>${value === undefined ? this.t("Unavailable") : `${this.number(value)} ${unit}`}</b>
      ${note ? html`<span class="status">${this.t(note)}</span>` : nothing}</div>`;
  }
  private empty(message: string) { return html`<p class="empty" role="status">${this.t(message)}</p>`; }
  private window(start: number, end: number) {
    return html`<div class="window">${energyTime(this.hass, start, { year: "numeric", month: "short", day: "numeric" })} – ${this.time(end)}</div>`;
  }
  private plot(rows: PlotRow[], start: number, end: number, unit: string, first: string, second?: string, sum = true) {
    if (!rows.length || end <= start) return this.empty("No measured intervals");
    const bins = plotBuckets(rows, start, end, sum);
    const max = Math.max(.001, ...bins.flatMap(bin => [Math.abs(bin.a), Math.abs(bin.b)]));
    const signed = bins.some(bin => bin.a < 0 || bin.b < 0), zero = signed ? 75 : 144, height = signed ? 68 : 136;
    const x = (time: number) => (time - start) / (end - start) * 1000;
    const bar = (value: number, bin: typeof bins[number], offset: number, tone: string) => {
      const size = Math.abs(value) / max * height;
      return svg`<rect x=${x(bin.start) + offset} y=${value >= 0 ? zero - size : zero}
        width=${second ? 9 : 18} height=${Math.max(.5, size)} fill=${tone} rx="1">
        <title>${this.time(bin.start)}–${this.time(bin.end)} · ${this.t(offset > 1 ? second! : first)}: ${this.number(value, 3)} ${unit}</title></rect>`;
    };
    return html`<div class="plot-panel"><div class="legend">
      <span><i class="swatch" style="--tone:var(--primary-color)"></i>${this.t(first)}</span>
      ${second ? html`<span><i class="swatch" style="--tone:var(--warning-color,#ef8b37)"></i>${this.t(second)}</span>` : nothing}
      <span>${unit}</span></div><div class="plot-grid">
      <div class="scale"><span>${this.number(max)}</span><span>${signed ? "0" : this.number(max / 2)}</span><span>${signed ? `−${this.number(max)}` : "0"}</span></div>
      <div class="plot"><svg viewBox="0 0 1000 150" preserveAspectRatio="none" role="img" aria-label=${`${this.t(first)}${second ? ` / ${this.t(second)}` : ""}`}>
        ${coverageGaps(rows.filter(row => row.a !== undefined), start, end).map(gap => svg`<rect x=${x(gap.start)} y="0" width=${x(gap.end) - x(gap.start)} height=${second ? 6 : 150} fill="var(--secondary-text-color)" fill-opacity=".18"><title>${this.t(first)}: ${this.t("Unpublished data, not zero")}</title></rect>`)}
        ${second ? coverageGaps(rows.filter(row => row.b !== undefined), start, end).map(gap => svg`<rect x=${x(gap.start)} y="144" width=${x(gap.end) - x(gap.start)} height="6" fill="var(--secondary-text-color)" fill-opacity=".18"><title>${this.t(second)}: ${this.t("Unpublished data, not zero")}</title></rect>`) : nothing}
        ${[7, 75, 144].map(y => svg`<line x1="0" x2="1000" y1=${y} y2=${y} stroke="var(--divider-color)"></line>`)}
        <line x1="0" x2="1000" y1=${zero} y2=${zero} stroke="var(--secondary-text-color)"></line>
        ${bins.map(bin => svg`${bin.coveredA ? bar(bin.a, bin, 1, "var(--primary-color)") : nothing}${second && bin.coveredB ? bar(bin.b, bin, 11, "var(--warning-color,#ef8b37)") : nothing}`)}
      </svg><div class="axis">${Array.from({ length: 5 }, (_, i) => html`<span>${this.time(start + (end - start) * i / 4)}</span>`)}</div></div>
    </div><p class="note">${this.t("Unpublished data, not zero")}</p></div>`;
  }
  private batteryPlot(power: PlotRow[], socSeries: Series | undefined, start: number, end: number, showSoc: boolean) {
    const soc = socSeries?.spans ?? [];
    if ((!power.length && !soc.length) || end <= start) return this.empty("No measured intervals");
    const bins = plotBuckets(power.map(row => ({ ...row,
      a: row.a === undefined ? undefined : Math.max(0, row.a),
      b: row.a === undefined ? undefined : Math.min(0, row.a),
    })), start, end, false);
    const maximum = Math.max(.001, ...bins.flatMap(bin => [bin.a, -bin.b]));
    const x = (time: number) => (time - start) / (end - start) * 1000;
    const socY = (value: number) => 173 - value / 100 * 166;
    const socPoints = new Map(socSeries?.points.map(point => [point.time, point.value]));
    const segments: Span[][] = [];
    for (const span of soc) {
      const previous = segments.at(-1);
      if (previous?.at(-1)?.end === span.start) previous.push(span);
      else segments.push([span]);
    }
    const bar = (value: number, bin: typeof bins[number], charging: boolean) => {
      const height = Math.abs(value) / maximum * 83;
      return svg`<rect class=${charging ? "charge-bar" : "discharge-bar"} x=${x(bin.start) + 1}
        y=${charging ? 90 - height : 90} width=${x(bin.end) - x(bin.start) - 2} height=${height}
        fill=${charging ? "var(--success-color,#43a047)" : "var(--warning-color,#ef8b37)"} rx="1">
        <title>${this.time(bin.start)}–${this.time(bin.end)} · ${this.t(charging ? "Charging" : "Discharging")}: ${this.number(Math.abs(value), 3)} kW</title>
      </rect>`;
    };
    return html`<div class="plot-panel battery-panel"><div class="legend">
      <span><i class="swatch" style="--tone:var(--success-color,#43a047)"></i>${this.t("Charging")}</span>
      <span><i class="swatch" style="--tone:var(--warning-color,#ef8b37)"></i>${this.t("Discharging")}</span>
      ${showSoc ? html`<span><i class="swatch swatch-line" style="--tone:var(--info-color,#039be5)"></i>${this.t("Battery level")}</span>` : nothing}
    </div><div class="axis-units"><span>kW</span>${showSoc ? html`<span>%</span>` : nothing}</div>
    <div class=${`plot-grid battery-grid${showSoc ? "" : " power-only"}`}>
      <div class="scale power-scale" aria-label=${`${this.t("Battery power")} · kW`}>
        <span>${power.length ? this.number(maximum, 3) : "—"}</span><span>${power.length ? "0" : "—"}</span><span>${power.length ? `−${this.number(maximum, 3)}` : "—"}</span>
      </div>
      <div class="plot"><svg viewBox="0 0 1000 180" preserveAspectRatio="none" role="img"
        aria-label=${`${this.t("Battery power")} · kW${showSoc ? ` / ${this.t("Battery level")} · %` : ""}`}>
        ${coverageGaps(power, start, end).map(gap => svg`<rect class="power-gap" x=${x(gap.start)} y="0" width=${x(gap.end) - x(gap.start)} height="6" fill="var(--secondary-text-color)" fill-opacity=".25"><title>${this.t("Battery power")}: ${this.t("Unpublished data, not zero")}</title></rect>`)}
        ${showSoc ? coverageGaps(soc, start, end).map(gap => svg`<rect class="soc-gap" x=${x(gap.start)} y="174" width=${x(gap.end) - x(gap.start)} height="6" fill="var(--secondary-text-color)" fill-opacity=".25"><title>${this.t("Battery level")}: ${this.t("Unpublished data, not zero")}</title></rect>`) : nothing}
        ${[7, 173].map(y => svg`<line x1="0" x2="1000" y1=${y} y2=${y} stroke="var(--divider-color)"></line>`)}
        <line x1="0" x2="1000" y1="90" y2="90" stroke="var(--secondary-text-color)"></line>
        ${bins.map(bin => svg`${bin.coveredA && bin.a > 0 ? bar(bin.a, bin, true) : nothing}${bin.coveredB && bin.b < 0 ? bar(bin.b, bin, false) : nothing}`)}
        ${segments.map(segment => svg`<path class="soc-line" d=${segment.map((span, i) =>
          `${i ? "L" : "M"}${x(span.start)},${socY(span.value)} H${x(span.end)} V${socY(socPoints.get(span.end) ?? span.value)}`).join(" ")}
          fill="none" stroke="var(--info-color,#039be5)" stroke-width="2" vector-effect="non-scaling-stroke">
          <title>${this.t("Battery level")}: ${this.time(segment[0].start)}–${this.time(segment.at(-1)!.end)}</title>
        </path>`)}
      </svg><div class="axis">${Array.from({ length: 5 }, (_, i) => html`<span>${this.time(start + (end - start) * i / 4)}</span>`)}</div></div>
      ${showSoc ? html`<div class="scale soc-scale" aria-label=${`${this.t("Battery level")} · %`}><span>100</span><span>50</span><span>0</span></div>` : nothing}
    </div><p class="note">${this.t("Unpublished data, not zero")}</p></div>`;
  }
  private details(rows: PlotRow[], unit: string, first: string, second?: string) {
    const page = Math.min(this.page, Math.max(0, Math.ceil(rows.length / 100) - 1));
    return html`<details .open=${this.open} @toggle=${(event: Event) => { this.open = (event.currentTarget as HTMLDetailsElement).open; }}>
      <summary>${this.t("Intervals")} (${rows.length})</summary>
      ${this.open ? html`<div class="table-scroll" tabindex="0" role="region" aria-label=${this.t("Intervals")}><table>
        <thead><tr><th>${this.t("Start")}</th><th>${this.t("End")}</th><th>${this.t(first)} · ${unit}</th>${second ? html`<th>${this.t(second)} · ${unit}</th>` : nothing}</tr></thead>
        <tbody>${rows.slice(page * 100, (page + 1) * 100).map(row => html`<tr><td>${this.time(row.start)}</td><td>${this.time(row.end)}</td><td>${row.a === undefined ? "—" : this.number(row.a, 4)}</td>${second ? html`<td>${row.b === undefined ? "—" : this.number(row.b, 4)}</td>` : nothing}</tr>`)}</tbody>
      </table></div>${rows.length > 100 ? html`<div class="pager"><button ?disabled=${page === 0} @click=${() => { this.page = page - 1; }}>${this.t("Previous")}</button>
        <span>${page * 100 + 1}–${Math.min(rows.length, (page + 1) * 100)} / ${rows.length}</span>
        <button ?disabled=${(page + 1) * 100 >= rows.length} @click=${() => { this.page = page + 1; }}>${this.t("Next")}</button></div>` : nothing}` : nothing}
    </details>`;
  }
  private diagnostics(messages: string[]) {
    messages = [...new Set(messages)];
    return messages.length ? html`<details class="diagnostic"><summary>${this.t("Data quality")} (${messages.length})</summary>
      ${messages.map(message => html`<p>${this.t(message)}</p>`)}</details>` : nothing;
  }
  private flow() {
    const options = monitorOptions(this.config!), flow = flowReadings(this.hass, options);
    const nodes = [
      { key: "grid", name: "Grid", value: flow.grid, label: (flow.grid.value ?? 0) >= 0 ? "Importing" : "Exporting",
        path: "M150 221 L211 257 Q225 266 225 285 L225 366 Q225 386 245 397 L432 486 Q448 493 462 480 L502 445 L502 397", color: "#2196f3", x: 14, y: 38 },
      { key: "solar", name: "Solar", value: flow.solar, label: "Production",
        path: "M852 221 L790 264 Q775 274 768 294 L736 380 Q732 394 713 403 L556 478 Q541 486 525 474 L502 459 L502 397", color: "#e5a817", x: 88, y: 40 },
      { key: "home", name: "Home", value: flow.home, label: options.deriveHome ? "Calculated" : "Measured",
        path: "", color: "#36a269", x: 49, y: 69 },
      { key: "battery", name: "Battery", value: flow.battery, label: (flow.battery.value ?? 0) >= 0 ? "Charging" : "Discharging",
        path: "M195 523 L232 501 L428 466 Q450 462 471 445 L502 422 L502 397", color: "#9b6ee4", x: 17, y: 85 },
      { key: "ev", name: "EV power", value: flow.ev, label: "Charging",
        path: "M502 397 L502 449 Q502 469 526 479 L694 560 Q710 568 710 582 Q710 590 730 590 L900 590 Q918 590 933 572 L950 552 L950 532 Q950 519 929 506", color: "#11a8a2", x: 83, y: 85 },
    ];
    const direct = [
      { key: "solarToEv", name: "Solar to EV", source: options.solarToEv, value: flow.solarToEv, color: "#e5a817",
        path: "M852 221 L957 279 Q974 289 974 311 L974 461 Q974 482 955 492 L929 506" },
      { key: "batteryToEv", name: "Battery to EV", source: options.batteryToEv, value: flow.batteryToEv, color: "#9b6ee4",
        path: "M195 523 L343 609 Q365 621 391 621 L935 621 Q976 621 976 580 L976 548 Q976 531 959 522 L929 506" },
    ].filter(route => route.source.entity);
    const routes = [...nodes.filter(node => node.path), ...direct];
    return html`<div class="flow-scene" role="group" aria-label=${this.t("Live Energy Flow")}>
      <div class="flow-art"><img src=${flowSceneUrl} width="1536" height="1024" alt="" loading="lazy" decoding="async">
        <svg class="flow-lines" viewBox="0 0 1000 667" aria-hidden="true" focusable="false">
          ${routes.map(node => {
            const value = node.value.value;
            const status = node.value.absent ? "absent" : value === undefined ? "unavailable" : value === 0 ? "idle" : "flowing";
            return svg`<g class="flow-line" data-key=${node.key} data-state=${status}
              data-direction=${value !== undefined && (node.key === "battery" ? value > 0 : value < 0) ? "reverse" : "forward"}
              style=${`--flow-color:${node.color};--flow-duration:${Math.max(.7, 3.8 - Math.log2(1 + Math.abs(value ?? 0)) * .65)}s`}>
              <path class="flow-cable-shadow" d=${node.path} vector-effect="non-scaling-stroke"></path>
              <path class="flow-cable" d=${node.path} vector-effect="non-scaling-stroke"></path>
              <path class="flow-wire" d=${node.path} vector-effect="non-scaling-stroke"></path>
              <path class="flow-highlight" d=${node.path} vector-effect="non-scaling-stroke"></path>
              ${status === "flowing" ? svg`<path class="flow-current" d=${node.path} pathLength="100" vector-effect="non-scaling-stroke"></path>` : nothing}
            </g>`;
          })}
          ${[[150, 221, "#2196f3"], [852, 221, "#e5a817"], [195, 523, "#9b6ee4"], [929, 506, "#11a8a2"], [502, 397, "#36a269"]].map(([x, y, color]) => svg`
            <g style=${`--flow-color:${color}`}><circle class="flow-port" cx=${x} cy=${y} r="5" vector-effect="non-scaling-stroke"></circle>
            <circle class="flow-port-core" cx=${x} cy=${y} r="2"></circle></g>`)}
        </svg>
      </div>
      <div class="flow-readings">${nodes.map(node => html`<div class="flow-node" data-key=${node.key}
        style=${`--node-x:${node.x}%;--node-y:${node.y}%;--flow-color:${node.color}`}>
        <div class="node-label">${this.t(node.name)}</div>
        <b>${node.value.value === undefined ? "—" : `${this.number(Math.abs(node.value.value))} kW`}</b>
        <div class="direction" aria-label=${this.t(node.value.value === undefined ? "Unavailable" : node.label)}>
          ${node.value.absent ? this.t("Not installed") : node.value.value === undefined ? this.t(node.value.error || "Unavailable")
            : node.value.value === 0 ? this.t("Idle") : this.t(node.label)}</div>
        ${node.value.updated ? html`<small>${this.t("Updated")}: ${this.time(node.value.updated)}</small>` : nothing}
      </div>`)}</div>
    </div>
    ${direct.length ? html`<div class="flow-routes">${direct.map(route => html`<div class="flow-route-reading" data-key=${route.key} style=${`--flow-color:${route.color}`}>
      <span>${this.t(route.name)}</span><b>${route.value.value === undefined ? "—" : `${this.number(route.value.value)} kW`}</b>
      <small>${route.value.value === undefined ? this.t(route.value.error || "Unavailable") : route.value.value === 0 ? this.t("Idle") : this.t("Measured")}
        ${route.value.updated ? html` · ${this.t("Updated")}: ${this.time(route.value.updated)}` : nothing}</small>
    </div>`)}</div><p class="note">${this.t("Direct EV routes use separate measurements, not estimated allocations.")}</p>` : nothing}
    ${flow.mismatch ? html`<p class="warning" role="status">${this.t("Energy balance mismatch")}: ${this.number(flow.residual!)} kW</p>` : nothing}
    <p class="note">${this.t("Flows show directions at the electrical boundary, not allocations between individual sources.")}</p>
    ${options.ev.entity ? html`<p class="note">${this.t("EV power is shown separately and is never added to or subtracted from the home total.")}</p>` : nothing}`;
  }
  private battery() {
    const options = monitorOptions(this.config!), now = Date.now();
    const power = reading(this.hass, options.battery, now, options.maxAgeMinutes), soc = reading(this.hass, options.soc, now, options.maxAgeMinutes, "soc");
    const signed = power.value === undefined ? undefined : power.value * (options.batteryPositive === "charge" ? 1 : -1);
    const snapshot = this.history.snapshot;
    let rows: PlotRow[] = [];
    let socSeries: Series | undefined;
    const notes: string[] = [];
    let charge: number | undefined, discharge: number | undefined;
    if (snapshot && this.hass) {
      const checked = checkedSnapshot(snapshot.hass, this.hass, historyIds(this.kind, options));
      const series = sampleSeries(checked, options.battery, snapshot.response, snapshot.start, snapshot.end, options.maxGapMinutes, "power");
      rows = series.spans.map(span => ({ start: span.start, end: span.end, a: span.value * (options.batteryPositive === "charge" ? 1 : -1) }));
      if (series.error) notes.push(series.error);
      notes.push(`${this.t("Missing duration")}: ${this.number(series.missingMs / 3600000)} h`);
      if (options.soc.entity) {
        socSeries = sampleSeries(checked, options.soc, snapshot.response, snapshot.start, snapshot.end, options.maxGapMinutes, "soc");
        if (socSeries.error) notes.push(socSeries.error);
      }
      for (const [source, assign] of [[options.chargeEnergy, (total: number | undefined) => { charge = total; }], [options.dischargeEnergy, (total: number | undefined) => { discharge = total; }]] as const) {
        if (!source.entity) continue;
        const counter = counterHistory(checked, source, snapshot.response, snapshot.end);
        assign(counter.total);
        if (counter.error) notes.push(counter.error);
        notes.push(...counter.notes);
      }
    }
    return html`<div class="metrics">
      ${this.metric("Battery power", signed === undefined ? undefined : Math.abs(signed), "kW", power.error || (signed === 0 ? "Idle" : (signed ?? 0) > 0 ? "Charging" : "Discharging"))}
      ${this.metric("Battery level", soc.value, "%", soc.error)}
      ${this.metric("Charged today", charge, "kWh", options.chargeEnergy.entity ? undefined : "Source missing")}
      ${this.metric("Discharged today", discharge, "kWh", options.dischargeEnergy.entity ? undefined : "Source missing")}
    </div>
    ${snapshot ? html`${this.window(snapshot.start, snapshot.end)}
      ${this.batteryPlot(rows, socSeries, snapshot.start, snapshot.end, !!options.soc.entity)}
      ${this.details(rows, "kW", "Battery power")}` : this.historyState()}
    <p class="note">${this.t("Positive battery power is charging. Missing history is not treated as zero; throughput uses configured cumulative counters only.")}</p>
    ${this.diagnostics(notes)}`;
  }
  private costs() {
    const snapshot = this.history.snapshot, options = monitorOptions(this.config!);
    if (!snapshot || !this.hass) return this.historyState();
    const result = costHistory(checkedSnapshot(snapshot.hass, this.hass, historyIds(this.kind, options)), options, snapshot.response, snapshot.end);
    if (!result.value) return this.empty(result.error);
    const value = result.value, currency = options.currency || this.hass.config?.currency;
    const rows: PlotRow[] = value.intervals.flatMap(interval => {
      const cost = costValue(interval);
      return cost === undefined ? [] : [{ start: interval.start, end: interval.end, a: interval.exported ? undefined : cost, b: interval.exported ? cost : undefined }];
    });
    const notes = [...value.warnings ?? [], ...value.approximations ?? []];
    return html`${this.window(snapshot.start, snapshot.end)}<div class="metrics">
      ${this.metric("Import cost", value.importCost, currency || "—")}
      ${this.metric("Export credit", value.exportCredit, currency || "—")}
      ${this.metric("Net cost", value.importCost !== undefined && value.exportCredit !== undefined ? value.importCost - value.exportCredit : undefined, currency || "—")}
    </div>
    ${this.plot(rows, snapshot.start, snapshot.end, currency || "—", "Import cost", "Export credit")}
    <p class="note">${this.t("Export credits are plotted below zero; negative tariffs may reverse costs. Fixed fees and taxes are included only if supplied in the rates.")}</p>
    ${this.details(rows, currency || "—", "Import cost", "Export credit")}${this.diagnostics(notes)}`;
  }
  private comparison() {
    const options = monitorOptions(this.config!), snapshot = this.history.snapshot;
    if (!options.baseline.entity) return this.empty("Retained baseline missing");
    if (!snapshot || !this.hass) return this.historyState();
    const counter = counterHistory(checkedSnapshot(snapshot.hass, this.hass, historyIds(this.kind, options)), options.actualEnergy, snapshot.response, snapshot.end);
    const result = compareBaseline(this.hass, options, counter, snapshot.start, snapshot.end);
    if (result.error) return this.empty(result.error);
    const rows = result.intervals.map(row => ({ start: row.start, end: row.end, a: row.planned, b: row.actual }));
    return html`${this.window(snapshot.start, snapshot.end)}
      <p class="note">${this.t("Retained baseline")}: ${result.generated === undefined ? "—" : energyTime(this.hass, result.generated, { year: "numeric", month: "short", day: "numeric" })}</p>
      <div class="metrics">
        ${this.metric("Planned", rows.length ? result.planned : undefined, "kWh")}
        ${this.metric("Measured", rows.length ? result.actual : undefined, "kWh")}
        ${this.metric("Difference", rows.length ? result.actual - result.planned : undefined, "kWh")}
      </div>
      ${this.plot(rows, snapshot.start, snapshot.end, "kWh", "Planned", "Measured")}
      <p class="note">${this.t("Published duration")}: ${this.number(result.coveredMs / 3600000)} h · ${this.t("Missing duration")}: ${this.number(result.missingMs / 3600000)} h</p>
      <p class="note">${this.t("Only overlapping intervals are compared. Energy is apportioned by duration; timing within meter intervals is approximate.")}</p>
      ${this.details(rows, "kWh", "Planned", "Measured")}${this.diagnostics(counter.notes)}`;
  }
  private historyState() {
    return html`${this.empty(this.history.loading ? "Loading measured history" : this.history.error || "Measured history missing")}
      ${this.history.error ? html`<button @click=${() => { this.history.clear(); this.load(); }}>${this.t("Retry")}</button>` : nothing}`;
  }
  protected render() {
    if (!this.config) return nothing;
    const options = monitorOptions(this.config);
    return html`<ha-card><div class="content" style=${`max-width:${options.maxContentWidth ? `${options.maxContentWidth}px` : "none"}`}>
      ${this.renderSharedHeading()}
      ${this.kind === "live_energy_flow" ? this.flow() : this.kind === "battery_activity" ? this.battery() : this.kind === "electricity_cost_timeline" ? this.costs() : this.comparison()}
      ${this.history.snapshot ? html`<p class="note">${this.t("Updated")}: ${this.time(this.history.snapshot.end)} · ${this.t("Measured history refreshes every 15 minutes.")}</p>` : nothing}
    </div></ha-card>`;
  }
}

for (const definition of MONITOR_CARDS) {
  const kind = definition.id;
  class RegisteredEnergyMonitor extends EnergyMonitorCard {
    protected kind = kind;
    protected descriptor = getCatalogItem(definition.tag);
    public static getStubConfig(hass?: HomeAssistant, entities: string[] = [], fallback: string[] = []) { return monitorStub(kind, hass, [...entities, ...fallback]); }
  }
  if (!customElements.get(definition.tag)) customElements.define(definition.tag, RegisteredEnergyMonitor);
}
