import { css, html, nothing, type PropertyValues } from "lit";
import { customElement, state } from "lit/decorators.js";
import { MushroomAdditionCard } from "../card";
import { getCatalogItem } from "../catalog";
import { resolveColor } from "../colors";
import { localizeText } from "../localize";
import { energyNumber, energyTime } from "../energy-format";
import { relevantHassChanged } from "../energy-cards/helpers";
import type { AdditionConfig, HomeAssistant } from "../types";
import { ENERGY_INSIGHTS_TAG, insightsDefaults, insightsOptions, validateInsights, type EnergyInsightsConfig } from "./config";
import { livePower, livePercentage, readActuals, readPurchasePlan, type Actuals, type PurchasePlan, type PurchaseBlock } from "./data";

@customElement(ENERGY_INSIGHTS_TAG)
export class EnergyInsightsCard extends MushroomAdditionCard {
  @state() protected config?: EnergyInsightsConfig;
  @state() private tab: "actual" | "plan" = "actual";
  @state() private sort: "energy" | "power" = "energy";
  @state() private active = false;
  @state() private selected = 0;
  protected descriptor = getCatalogItem(ENERGY_INSIGHTS_TAG);
  private refresh?: number;

  static styles = [MushroomAdditionCard.styles, css`
    :host { container-type: inline-size; display: block; min-width: 0; }
    :host([fill-container]), :host([fill-container]) ha-card { height: 100%; }
    ha-card { overflow: hidden; }
    .energy-heading { padding: 18px 24px; }
    .tabs { display: flex; gap: 24px; padding: 0 24px; border-block: 1px solid var(--divider-color); }
    button, select { font: inherit; color: var(--primary-text-color); cursor: pointer; }
    button:focus-visible, select:focus-visible, summary:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 3px; }
    .tabs button { background: none; border: 0; border-bottom: 2px solid transparent; padding: 15px 0; font-size: 12px; color: var(--secondary-text-color); }
    .tabs [aria-selected=true] { border-color: var(--primary-color); color: var(--primary-text-color); }
    [role=tabpanel] { padding: 22px 24px; }
    [hidden] { display: none !important; }
    h3 { font-size: 13px; font-weight: 500; margin: 0 0 6px; }
    p, small { color: var(--secondary-text-color); line-height: 1.6; }
    p { font-size: 11px; margin: 6px 0 12px; }
    small { font-size: 10px; }
    .window { display: block; font-size: 11px; margin-bottom: 16px; }
    .kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
    .kpi, .consumer-row, .usage-card, .forecast { padding: 16px; background: var(--addition-neutral-background); border-radius: 12px; }
    .kpi-label { display: flex; align-items: center; gap: 7px; font-size: 11px; color: var(--secondary-text-color); }
    .kpi-label ha-icon, .flow ha-icon { color: var(--tone); --mdc-icon-size: 16px; }
    .kpi-value { font-size: 25px; margin: 10px 0 6px; font-variant-numeric: tabular-nums; }
    .kpi-value small { font-size: 12px; }
    .kpi-note { font-size: 10px; color: var(--secondary-text-color); line-height: 1.6; }
    .flow { display: flex; flex-wrap: wrap; gap: 12px 24px; padding: 18px 0; border-bottom: 1px solid var(--divider-color); font-size: 12px; }
    .flow-item { display: inline-flex; gap: 6px; align-items: center; }
    .self-powered { min-width: 180px; }
    .section { margin-top: 24px; }
    .section-top { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 14px; }
    .controls { display: flex; gap: 6px; align-items: center; }
    .controls button, select { border: 1px solid var(--divider-color); border-radius: 9px; background: var(--ha-card-background, var(--card-background-color)); padding: 8px; font-size: 11px; }
    .controls [aria-pressed=true] { color: var(--primary-color); border-color: var(--primary-color); }
    .consumer-layout { display: grid; grid-template-columns: minmax(0, 1fr) 230px; gap: 16px; }
    .consumer-list { display: grid; gap: 7px; align-content: start; }
    .consumer-row { display: grid; grid-template-columns: 30px minmax(90px, 1fr) 80px 100px 100px; align-items: center; gap: 10px; padding: 11px 12px; font-size: 12px; }
    .consumer-row small { display: block; font-size: 9px; margin-top: 4px; }
    .consumer-icon { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; color: var(--tone); background: color-mix(in srgb, var(--tone) 12%, transparent); }
    ha-icon { --mdc-icon-size: 18px; }
    .variance { text-align: end; font-size: 11px; }
    .bar, .allocation, .price-mix { display: flex; height: 5px; border-radius: 6px; background: var(--divider-color); overflow: hidden; margin-top: 7px; }
    .bar i, .allocation i, .price-mix i { display: block; height: 100%; background: var(--tone, var(--primary-color)); }
    .ring { width: 132px; height: 132px; border-radius: 50%; display: grid; place-items: center; margin: 18px auto; }
    .ring-hole { width: 102px; height: 102px; border-radius: 50%; background: var(--ha-card-background, var(--card-background-color)); display: grid; place-content: center; text-align: center; }
    .legend { display: flex; flex-wrap: wrap; gap: 10px; font-size: 10px; color: var(--secondary-text-color); margin: 10px 0; }
    .usage-card .legend { display: grid; }
    .swatch { display: inline-block; width: 7px; height: 7px; border-radius: 50%; margin-inline-end: 6px; background: var(--tone); }
    .price-mix { height: 8px; margin-bottom: 12px; gap: 2px; }
    .table-scroll { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; text-align: start; font-size: 11px; white-space: nowrap; }
    th { color: var(--secondary-text-color); font-size: 10px; font-weight: 400; background: var(--addition-neutral-background); }
    th, td { padding: 12px; border-bottom: 1px solid var(--divider-color); font-variant-numeric: tabular-nums; }
    th:last-child, td:last-child { text-align: end; }
    tfoot td { font-weight: 500; border: 0; }
    details { background: var(--addition-neutral-background); padding: 12px; border-radius: 10px; margin: 12px 0; font-size: 11px; }
    summary { cursor: pointer; color: var(--secondary-text-color); }
    details .table-scroll { max-height: 280px; overflow: auto; margin-top: 12px; }
    .spend-note { padding: 12px 14px; border-inline-start: 2px solid var(--primary-color); background: var(--addition-neutral-background); border-radius: 0 9px 9px 0; font-size: 11px; line-height: 1.8; }
    .selected { background: color-mix(in srgb, var(--primary-color) 7%, transparent); }
    .block-button { background: none; border: 0; padding: 0; text-align: start; font-size: 11px; }
    .block-button[aria-pressed=true] { color: var(--primary-color); }
    .allocation { width: 115px; }
    .block-detail { border: 1px solid var(--divider-color); border-radius: 12px; padding: 16px; margin-top: 12px; }
    .allocation-metrics, .forecasts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 16px; }
    .allocation-metrics > div { border-inline-start: 2px solid var(--tone); padding-inline-start: 10px; }
    .allocation-metrics strong { display: block; font-size: 17px; }
    .forecast strong { font-size: 20px; font-weight: 500; }
    .error { color: var(--error-color); padding: 12px; font-size: 12px; }
    .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
    @container (max-width: 950px) { .consumer-layout { grid-template-columns: 1fr; } .usage-card { display: grid; grid-template-columns: 1fr 1fr; align-items: center; } .usage-card .legend { grid-column: 1 / -1; grid-template-columns: repeat(3, 1fr); } }
    @container (max-width: 620px) {
      .energy-heading { padding: 16px; } .tabs { padding: 0 16px; gap: 16px; } [role=tabpanel] { padding: 18px 16px; }
      .kpis { grid-template-columns: 1fr 1fr; } .kpi { padding: 12px; } .kpi-value { font-size: 22px; }
      .consumer-row { grid-template-columns: 28px minmax(65px, 1fr) 65px 70px; gap: 7px; padding: 10px 8px; }
      .variance { grid-column: 2 / -1; text-align: start; } .forecasts { grid-template-columns: 1fr 1fr; }
      .allocation-metrics { gap: 6px; } .allocation-metrics strong { font-size: 14px; } th, td { padding: 9px 8px; }
    }
  `];

  public static getStubConfig(hass?: HomeAssistant, entities: string[] = [], fallback: string[] = []): EnergyInsightsConfig {
    const options = insightsDefaults();
    const ids = [...new Set([...entities, ...fallback, ...Object.keys(hass?.states ?? {})])];
    for (const id of ids) {
      if (!options.actualSource.entity && readActuals(hass, { ...options, actualSource: { ...options.actualSource, entity: id } }).value) options.actualSource.entity = id;
      if (!options.planSource.entity && readPurchasePlan(hass, { ...options, planSource: { ...options.planSource, entity: id } }).value) options.planSource.entity = id;
      if (options.actualSource.entity && options.planSource.entity) break;
    }
    return {
      type: `custom:${ENERGY_INSIGHTS_TAG}`, icon: "mdi:lightning-bolt",
      ...(options.actualSource.entity || options.planSource.entity ? { energy_insights: options } : {}),
    };
  }
  public setConfig(config: AdditionConfig): void {
    const valid = validateInsights(config);
    super.setConfig(valid);
    const options = insightsOptions(valid);
    this.sort = options.sort; this.active = options.activeOnly; this.selected = 0;
    this.toggleAttribute("fill-container", valid.fill_container === true);
  }
  public getCardSize(): number { return 12; }
  public connectedCallback(): void {
    super.connectedCallback();
    this.refresh = window.setInterval(() => this.requestUpdate(), 60000);
  }
  public disconnectedCallback(): void {
    window.clearInterval(this.refresh); this.refresh = undefined;
    super.disconnectedCallback();
  }
  protected shouldUpdate(changed: PropertyValues): boolean {
    return changed.size !== 1 || !changed.has("hass") ||
      relevantHassChanged(changed.get("hass") as HomeAssistant | undefined, this.hass, this.config);
  }
  private t(value: string): string { return localizeText(this.hass, value); }
  private n(value: number, digits = 2): string {
    return energyNumber(this.hass, value, { maximumFractionDigits: digits });
  }
  private money(value: number): string {
    const currency = insightsOptions(this.config!).currency || this.hass?.config?.currency;
    return currency ? energyNumber(this.hass, value, { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }) : this.n(value);
  }
  private rate(value: number): string {
    return `${this.n(value, 3)} ${insightsOptions(this.config!).currency || this.hass?.config?.currency || this.t("Currency not configured")}/kWh`;
  }
  private time(value: number): string {
    return energyTime(this.hass, value, { month: "short", day: "numeric" });
  }
  private kwh(value: number, digits = 2): string { return `${this.n(value, digits)} kWh`; }
  private power(entity?: string): number | undefined {
    const options = insightsOptions(this.config!);
    return livePower(this.hass, entity, Date.now(), options.maxAgeMinutes);
  }
  private watts(value: number | undefined): string {
    return value === undefined ? this.t("Source missing") : Math.abs(value) >= 1000 ? `${this.n(value / 1000)} kW` : `${this.n(value, 0)} W`;
  }
  private kpi(label: string, value: string, note: string, icon = "mdi:transmission-tower", color = "purple") {
    return html`<div class="kpi" style=${`--tone:${resolveColor(color, "green")}`}><div class="kpi-label"><ha-icon .icon=${icon}></ha-icon>${this.t(label)}</div><div class="kpi-value">${value}</div><div class="kpi-note">${note}</div></div>`;
  }
  private error(message: string) {
    const [label, ...detail] = message.split(":");
    return html`<p class="error" role="alert">${this.t(label)}${detail.length ? `: ${detail.join(":")}` : ""}</p>`;
  }
  private selectTab(tab: "actual" | "plan", focus = false): void {
    this.tab = tab;
    if (focus) void this.updateComplete.then(() => this.shadowRoot?.querySelector<HTMLButtonElement>(`#${tab}-tab`)?.focus());
  }
  private tabKey(event: KeyboardEvent): void {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    this.selectTab(event.key === "Home" ? "actual" : event.key === "End" ? "plan" : this.tab === "actual" ? "plan" : "actual", true);
  }
  private actual(data: Actuals) {
    const options = insightsOptions(this.config!);
    const consumers = options.consumers.map((consumer, index) => ({
      ...consumer, ...data.consumers[index], power: this.power(consumer.entity),
      tone: resolveColor(consumer.color, ["orange", "purple", "amber", "blue", "green"][index % 5]),
    }));
    const shown = consumers.filter(item => !this.active || item.power !== undefined && item.power > options.activeThreshold)
      .sort((a, b) => this.sort === "energy" ? b.energy - a.energy : (b.power ?? -Infinity) - (a.power ?? -Infinity));
    const share = (value: number) => data.home ? value / data.home * 100 : 0;
    let offset = 0;
    const stops = consumers.map(item => {
      const start = offset; offset += share(item.energy);
      return `${item.tone} ${start}% ${offset}%`;
    });
    if (data.remainder > 0) stops.push(`var(--disabled-text-color) ${offset}% 100%`);
    const self = livePercentage(this.hass, options.selfPoweredEntity, Date.now(), options.maxAgeMinutes);
    return html`
      <small class="window">${this.t("Measured window")}: ${this.time(data.start)} - ${this.time(data.end)}</small>
      <div class="kpis">
        ${this.kpi("Imported", this.kwh(data.imported), `${this.t("Cost")} ${this.money(data.importCost)} · ${this.t("Weighted average")} ${data.imported ? this.rate(data.importCost / data.imported) : this.t("Not applicable")}`)}
        ${this.kpi("Exported", this.kwh(data.exported), `${this.t("Credit")} ${this.money(data.exportCredit)} · ${data.exported ? this.rate(data.exportCredit / data.exported) : this.t("Not applicable")}`, "mdi:transmission-tower", "orange")}
        ${this.kpi("Solar generated", this.kwh(data.solar), this.t("Measured production"), "mdi:white-balance-sunny", "amber")}
        ${this.kpi("Home consumption", this.kwh(data.home), this.t("Excludes battery charging"), "mdi:home", "blue")}
      </div>
      ${options.showFlow ? html`<div class="flow">
        ${([["Solar", options.solarEntity, "mdi:white-balance-sunny", "amber"], ["Home", options.homeEntity, "mdi:home", "blue"], ["Grid", options.gridEntity, "mdi:transmission-tower", "purple"], ["Battery", options.batteryEntity, "mdi:battery", "green"]] as const).map(([label, entity, icon, color]) =>
          html`<span class="flow-item" style=${`--tone:${resolveColor(color, "green")}`}><ha-icon .icon=${icon}></ha-icon>${this.t(label)} <strong>${this.watts(this.power(entity))}</strong></span>`)}
        <span class="self-powered">${this.t("Home self-powered now")} <strong>${self === undefined ? this.t("Source missing") : `${this.n(self, 0)}%`}</strong>
          ${self === undefined ? nothing : html`<span class="bar" role="meter" aria-label=${this.t("Home self-powered now")} aria-valuenow=${self} aria-valuemin="0" aria-valuemax="100"><i style=${`width:${self}%`}></i></span>`}
        </span>
      </div>` : nothing}
      ${options.showConsumers ? html`<section class="section">
        <div class="section-top"><h3>${this.t("Where your energy goes")}</h3>
          <div class="controls"><label class="sr-only" for="sort">${this.t("Sort consumers")}</label>
            <select id="sort" .value=${this.sort} @change=${(event: Event) => { this.sort = (event.target as HTMLSelectElement).value as "energy" | "power"; }}>
              <option value="energy">${this.t("Most energy")}</option><option value="power">${this.t("Highest demand")}</option>
            </select>
            <button aria-pressed=${this.active} @click=${() => { this.active = !this.active; }}>${this.t("Active")} &gt;${this.n(options.activeThreshold, 0)} W</button>
          </div>
        </div>
        <div class="consumer-layout"><div class="consumer-list">
          ${shown.length ? shown.map(item => html`<div class="consumer-row" style=${`--tone:${item.tone}`}>
            <span class="consumer-icon"><ha-icon .icon=${item.icon || "mdi:lightning-bolt"}></ha-icon></span>
            <div>${item.name}<small>${item.entity && this.hass?.states[item.entity] ? this.hass.formatEntityState?.(this.hass.states[item.entity]) ?? this.watts(item.power) : this.t("Source missing")}</small></div>
            <div>${this.watts(item.power)}<small>${this.t("Now")}</small></div>
            <div>${this.kwh(item.energy)}<small>${this.n(share(item.energy), 0)}% ${this.t("of home")}</small><div class="bar"><i style=${`width:${share(item.energy)}%`}></i></div></div>
            <div class="variance" style=${`color:${item.baseline === undefined || Math.abs(item.energy - item.baseline) < .005 ? "var(--secondary-text-color)" : resolveColor(item.energy > item.baseline ? "orange" : "green", "green")}`}>${item.baseline === undefined ? this.t("Comparison not configured") : Math.abs(item.energy - item.baseline) < .005 ? this.t("On plan") : `${item.energy - item.baseline > 0 ? "+" : ""}${this.kwh(item.energy - item.baseline)}`}<small>${this.t("Same-window plan")}</small></div>
          </div>`) : html`<p>${this.t("No consumers to display")}</p>`}
        </div><aside class="usage-card"><div><h3>${this.t("Home consumption")}</h3><strong>${this.kwh(data.home)}</strong></div>
          <div class="ring" role="img" aria-label=${this.t("Consumer share")} style=${`background:${stops.length ? `conic-gradient(${stops.join(",")})` : "var(--divider-color)"}`}>
            <div class="ring-hole">${data.home ? `${this.n(100 - share(data.remainder), 0)}%` : this.t("Not applicable")}<small>${this.t("Configured consumers")}</small></div>
          </div>
          <div class="legend">${consumers.map(item => html`<span><i class="swatch" style=${`--tone:${item.tone}`}></i>${item.name}: ${this.n(share(item.energy), 0)}%</span>`)}
            <span>${this.t("Unallocated home")}: ${this.kwh(data.remainder)}</span></div>
        </aside></div>
        <p>${this.t("Consumer totals exclude battery charging. Device costs are not estimated.")}</p>
      </section>` : nothing}
      ${options.showPurchases ? html`<section class="section"><h3>${this.t("What you bought, at what price")}</h3>
        <div class="price-mix" aria-hidden="true">${data.buckets.map((bucket, index) => html`<i style=${`width:${data.imported ? bucket.quantity / data.imported * 100 : 0}%;--tone:${resolveColor(["green", "amber", "orange"][index % 3], "green")}`}></i>`)}</div>
        <div class="table-scroll"><table><caption class="sr-only">${this.t("Measured purchases")}</caption>
          <thead><tr>${["Unit rate", "Energy bought", "Share of import", "Cost"].map(label => html`<th scope="col">${this.t(label)}</th>`)}</tr></thead>
          <tbody>${data.buckets.map(bucket => html`<tr><td>${this.rate(bucket.rate)}</td><td>${this.kwh(bucket.quantity)}</td><td>${this.n(bucket.quantity / data.imported * 100, 0)}%</td><td>${this.money(bucket.cost)}</td></tr>`)}</tbody>
          <tfoot><tr><td>${this.t("Total imported")}</td><td>${this.kwh(data.imported)}</td><td>${data.imported ? "100%" : this.t("Not applicable")}</td><td>${this.money(data.importCost)}</td></tr></tfoot>
        </table></div>
        <details><summary>${this.t("Metered intervals")} (${data.intervals.length})</summary><div class="table-scroll"><table>
          <thead><tr>${["Time", "Import", "Export", "Unit rate", "Export rate", "Cost", "Credit"].map(label => html`<th scope="col">${this.t(label)}</th>`)}</tr></thead>
          <tbody>${data.intervals.map(item => html`<tr><td>${this.time(item.start)} - ${this.time(item.end)}</td><td>${this.kwh(item.imported, 3)}</td><td>${this.kwh(item.exported, 3)}</td><td>${this.rate(item.rate)}</td><td>${this.rate(item.exportRate)}</td><td>${this.money(item.imported * item.rate)}</td><td>${this.money(item.exported * item.exportRate)}</td></tr>`)}</tbody>
        </table></div></details>
        <div class="spend-note"><strong>${this.money(data.importCost - data.exportCredit)} ${this.t("Net variable grid spend")}</strong><br>
          ${this.money(data.importCost)} ${this.t("Import cost")} - ${this.money(data.exportCredit)} ${this.t("Export credit")}
          <p>${this.t("Fixed charges excluded. Totals use unrounded interval values.")}</p>
          ${this.t("Battery input")}: ${this.kwh(data.batteryCharge)} · ${this.t("Battery output")}: ${this.kwh(data.batteryDischarge)}
        </div>
      </section>` : nothing}`;
  }
  private allocation(block: PurchaseBlock) {
    return html`<div class="allocation" aria-hidden="true">${([["home", "blue"], ["ev", "purple"], ["battery", "green"]] as const).map(([key, color]) =>
      html`<i style=${`width:${block[key] / block.quantity * 100}%;--tone:${resolveColor(color, "green")}`}></i>`)}</div>`;
  }
  private plan(data: PurchasePlan) {
    const options = insightsOptions(this.config!);
    const selected = Math.min(this.selected, data.blocks.length - 1), block = data.blocks[selected];
    return html`
      <small class="window">${this.t("Upcoming plan")}: ${this.time(data.start)} - ${this.time(data.end)} · ${this.t("Snapshot")}: ${this.time(data.generated)}</small>
      <div class="kpis">
        ${this.kpi("Planned grid purchase", this.kwh(data.quantity), `${this.t("Estimated cost")} ${this.money(data.cost)} · ${data.quantity ? this.rate(data.cost / data.quantity) : this.t("Not applicable")}`)}
        ${this.kpi("Home demand forecast", this.kwh(data.home), this.t("Includes EV; excludes home-battery charging"), "mdi:home", "blue")}
        ${this.kpi("Solar forecast", this.kwh(data.solar), this.t("Upcoming 24 hours"), "mdi:white-balance-sunny", "amber")}
        ${this.kpi("Minimum planned battery", `${this.n(data.batteryMin, 0)}%`, `${this.t("Reserve")} ${this.n(data.reserve, 0)}% · ${this.t("Headroom")} ${this.n(data.batteryMin - data.reserve, 0)} pp`, "mdi:battery", "green")}
      </div>
      <section class="section"><h3>${this.t("Upcoming grid purchases")}</h3><p>${this.t("Supplied plan; not measured or executed.")}</p>
        <div class="legend">${["Direct home use", "EV input (AC)", "Battery input (AC)"].map((label, index) => html`<span><i class="swatch" style=${`--tone:${resolveColor(["blue", "purple", "green"][index], "green")}`}></i>${this.t(label)}</span>`)}</div>
        <div class="table-scroll"><table><caption class="sr-only">${this.t("Upcoming grid purchases")}</caption>
          <thead><tr>${["Window", "Energy & purpose", "Unit rate", "Estimated cost", "Battery target"].map(label => html`<th scope="col">${this.t(label)}</th>`)}</tr></thead>
          <tbody>${data.blocks.map((item, index) => html`<tr class=${index === selected ? "selected" : ""}><td><button class="block-button" aria-pressed=${index === selected} aria-controls="block-detail" @click=${() => { this.selected = index; }}>${this.time(item.start)}<br>${this.time(item.end)}</button></td><td>${this.kwh(item.quantity)}${this.allocation(item)}</td><td>${this.rate(item.rate)}</td><td>${this.money(item.cost)}</td><td>${item.target === undefined ? this.t("Not supplied") : `${this.n(item.target, 0)}%`}</td></tr>`)}</tbody>
          <tfoot><tr><td>${data.blocks.length} ${this.t("Planned blocks")}</td><td>${this.kwh(data.quantity)}</td><td>${data.quantity ? this.rate(data.cost / data.quantity) : this.t("Not applicable")}</td><td>${this.money(data.cost)}</td><td>${this.t("Not executed")}</td></tr></tfoot>
        </table></div>
        ${block ? html`<div class="block-detail" id="block-detail" aria-live="polite">
          <h3>${this.time(block.start)} - ${this.time(block.end)}</h3><p>${block.reason}</p>
          <div class="allocation-metrics">${([["home", "Direct home use", "blue"], ["ev", "EV input (AC)", "purple"], ["battery", "Battery input (AC)", "green"]] as const).map(([key, label, color]) =>
            html`<div style=${`--tone:${resolveColor(color, "green")}`}><strong>${this.kwh(block[key])}</strong><small>${this.t(label)}</small></div>`)}</div>
          <p>${this.kwh(block.quantity)} × ${this.rate(block.rate)} = ${this.money(block.cost)}</p><p>${block.detail}</p>
          <p>${this.t("Charge efficiency")}: ${this.n(data.efficiency * 100, 0)}% · ${this.t("Stored battery energy")}: ${this.kwh(block.battery * data.efficiency)}</p>
        </div>` : html`<p>${this.t("No planned purchases")}</p>`}
        <details><summary>${this.t("Plan assumptions")}</summary><p>${this.t("AC input includes charging losses. Forecasts are not measured totals.")}</p><p>${this.t("Plan values come from entities. This card does not calculate plans or infer future battery levels.")}</p></details>
      </section>
      ${options.showForecasts ? html`<section class="section"><h3>${this.t("How consumers fit the plan")}</h3><div class="forecasts">
        ${options.consumers.map((consumer, index) => html`<div class="forecast"><h3>${consumer.name}</h3><strong>${data.consumers[index].energy === undefined ? this.t("Not supplied") : this.kwh(data.consumers[index].energy!)}</strong><small> ${this.t("Forecast")}</small><p>${data.consumers[index].strategy ?? this.t("Not supplied")}</p></div>`)}
      </div></section>` : nothing}`;
  }
  protected render() {
    if (!this.config) return nothing;
    const options = insightsOptions(this.config), actual = readActuals(this.hass, options), plan = readPurchasePlan(this.hass, options);
    return html`<ha-card class=${`mushroom-addition-card${this.config.card_shadow ? " card-shadow" : ""}`}>
      ${options.showHeader ? this.renderSharedHeading() : nothing}
      <div class="tabs" role="tablist" aria-label=${this.t("Energy reporting window")}>
        ${(["actual", "plan"] as const).map(tab => html`<button id=${`${tab}-tab`} role="tab" aria-selected=${tab === this.tab} aria-controls=${`${tab}-panel`} tabindex=${tab === this.tab ? 0 : -1}
          @click=${() => this.selectTab(tab)} @keydown=${this.tabKey}>${this.t(tab === "actual" ? "Today so far" : "Upcoming plan")}</button>`)}
      </div>
      <section id="actual-panel" role="tabpanel" aria-labelledby="actual-tab" ?hidden=${this.tab !== "actual"}>
        ${actual.value ? this.actual(actual.value) : this.error(actual.error)}
      </section>
      <section id="plan-panel" role="tabpanel" aria-labelledby="plan-tab" ?hidden=${this.tab !== "plan"}>
        ${plan.value ? this.plan(plan.value) : this.error(plan.error)}
      </section>
    </ha-card>`;
  }
}
