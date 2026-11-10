import { css, html, nothing, svg, type PropertyValues } from "lit";
import { customElement, state } from "lit/decorators.js";
import { MushroomAdditionCard } from "../card";
import { getCatalogItem } from "../catalog";
import { resolveColor } from "../colors";
import { localizeText } from "../localize";
import { energyNumber, energyTime } from "../energy-format";
import { relevantHassChanged } from "../energy-cards/helpers";
import type { AdditionConfig, HomeAssistant } from "../types";
import { ENERGY_INSIGHTS_TAG, insightsDefaults, insightsOptions, validateInsights, type EnergyInsightsConfig } from "./config";
import {
  INSIGHTS_HISTORY_LOOKBACK_MS, INSIGHTS_HISTORY_MAX_ENTITIES, INSIGHTS_HISTORY_REFRESH_MS, livePower, livePercentage,
  localDayStart, meteredEntityIds, readActuals, readMeteredActuals, readPurchasePlan,
  type Actuals, type PurchasePlan, type PurchaseBlock, type SourceResult,
} from "./data";

@customElement(ENERGY_INSIGHTS_TAG)
export class EnergyInsightsCard extends MushroomAdditionCard {
  @state() protected config?: EnergyInsightsConfig;
  @state() private tab: "actual" | "plan" = "actual";
  @state() private sort: "energy" | "power" = "energy";
  @state() private active = false;
  @state() private selected = 0;
  @state() private ratesOpen = false;
  @state() private intervalsOpen = false;
  @state() private ratePage = 0;
  @state() private intervalPage = 0;
  @state() private measuredHistory?: SourceResult<Actuals>;
  protected descriptor = getCatalogItem(ENERGY_INSIGHTS_TAG);
  private refresh?: number;
  private historyRefresh?: number;
  private historyGeneration = 0;
  private historyKey = "";
  private lastHistoryRequestAt = 0;
  private historyPending = false;
  private cancelHistoryRequest?: () => void;
  private historyResponse?: unknown;
  private historySnapshotAt = 0;
  private historyHass?: HomeAssistant;
  @state() private historyLoad?: { duration: number; entities: number; states: number };

  static styles = [MushroomAdditionCard.styles, css`
    :host { container-type: inline-size; display: block; min-width: 0; }
    :host([fill-container]), :host([fill-container]) ha-card { height: 100%; }
    ha-card { overflow: hidden; }
    .content { margin-inline: auto; container-type: inline-size; }
    .pager { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-block: 10px; }
    .pager button { min-height: 44px; padding: 8px 12px; border: 1px solid var(--divider-color); border-radius: 8px; background: var(--addition-neutral-background); }
    .quality { font-size: 12px; margin-bottom: 12px; }
    .quality button { background: none; color: var(--primary-color); border: 0; min-height: 44px; padding: 4px; }
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
    .metered-section { padding: 16px; border: 1px solid var(--divider-color); border-radius: 12px; }
    .metered-heading { display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 8px 16px; }
    .metered-heading .legend { margin: 0 0 12px; font-size: 11px; }
    .metered-plot { display: grid; grid-template-columns: max-content minmax(0, 1fr); column-gap: 10px; }
    .metered-scale { display: flex; flex-direction: column; justify-content: space-between; height: 160px; font-size: 10px; color: var(--secondary-text-color); text-align: end; font-variant-numeric: tabular-nums; }
    .metered-scale span { line-height: 12px; }
    .measured-chart { display: block; width: 100%; height: 160px; overflow: hidden; }
    .metered-times { grid-column: 2; position: relative; height: 24px; margin-top: 8px; color: var(--secondary-text-color); font-size: 10px; font-variant-numeric: tabular-nums; }
    .metered-times span { position: absolute; transform: translateX(-50%); white-space: nowrap; }
    .metered-times span:first-child { transform: none; }
    .metered-times span:last-child { transform: translateX(-100%); }
    .metered-missing { margin-bottom: 0; }
    .chart-scroll { min-width: 0; }
    .chart-scroll:focus-visible, .table-scroll:focus-visible { outline: 2px solid var(--primary-color); outline-offset: -2px; }
    .diagnostics { overflow-wrap: anywhere; }
    .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
    @container (max-width: 950px) { .consumer-layout { grid-template-columns: 1fr; } .usage-card { display: grid; grid-template-columns: 1fr 1fr; align-items: center; } .usage-card .legend { grid-column: 1 / -1; grid-template-columns: repeat(3, 1fr); } }
    @container (max-width: 620px) {
      .energy-heading { padding: 16px; } .tabs { padding: 0 16px; gap: 16px; } [role=tabpanel] { padding: 18px 16px; }
      .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); } .kpi { padding: 12px; } .kpi-value { font-size: 22px; }
      .kpi, .forecast, .usage-card, .consumer-row > div { min-width: 0; overflow-wrap: anywhere; }
      .kpi-label ha-icon, .flow-item ha-icon { flex-shrink: 0; }
      .tabs { gap: 8px; }
      .tabs button { flex: 1; min-width: 0; min-height: 44px; }
      .controls { flex-wrap: wrap; }
      .controls button, .controls select, .block-button, summary { min-height: 44px; }
      .controls select {
        appearance: none; padding-inline-end: 28px;
        background-image: linear-gradient(45deg, transparent 50%, var(--secondary-text-color) 50%),
          linear-gradient(135deg, var(--secondary-text-color) 50%, transparent 50%);
        background-position: right 13px center, right 8px center;
        background-size: 5px 5px; background-repeat: no-repeat;
      }
      .controls select:dir(rtl) { background-position: left 8px center, left 13px center; }
      summary { box-sizing: border-box; padding-block: 12px; }
      .flow { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 8px; }
      .flow-item { flex-wrap: wrap; }
      .self-powered { grid-column: 1 / -1; min-width: 0; }
      .consumer-row {
        grid-template-columns: 28px minmax(0, 1fr) minmax(0, 1fr);
        grid-template-areas: "icon name name" ". energy power" ". variance variance";
        gap: 8px; padding: 12px;
      }
      .consumer-icon { grid-area: icon; }
      .consumer-name { grid-area: name; }
      .consumer-name small { display: none; }
      .consumer-power { grid-area: power; }
      .consumer-energy { grid-area: energy; }
      .variance { grid-area: variance; text-align: start; }
      .usage-card .legend { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .forecasts { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .metered-section { padding: 12px; }
      .metered-times span:nth-child(even) { display: none; }
      .allocation-metrics { gap: 6px; } .allocation-metrics strong { font-size: 14px; } th, td { padding: 9px 8px; }
    }
    @container (max-width: 480px) {
      .energy-heading { padding: 12px; } [role=tabpanel] { padding: 16px 12px; }
      .kpi { padding: 10px; } .kpi-value { font-size: 20px; }
      .forecasts, .allocation-metrics { grid-template-columns: 1fr; }
      .allocation-metrics { gap: 12px; }
      .usage-card { grid-template-columns: minmax(0, 1fr) 132px; gap: 8px; }
      .ring { margin: 8px auto; }
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
    this.ratePage = this.intervalPage = 0;
    this.ratesOpen = this.intervalsOpen = false;
    this.toggleAttribute("fill-container", valid.fill_container === true);
  }
  public getCardSize(): number { return 12; }
  public getGridOptions() {
    return { columns: "full" as const, rows: "auto" as const, min_columns: 12, max_columns: 12, min_rows: 3 };
  }
  public connectedCallback(): void {
    super.connectedCallback();
    this.refresh = window.setInterval(() => this.requestUpdate(), 60000);
    this.historyRefresh = window.setInterval(() => this.refreshMeasuredHistory(), INSIGHTS_HISTORY_REFRESH_MS);
    this.refreshMeasuredHistory();
  }
  public disconnectedCallback(): void {
    window.clearInterval(this.refresh); this.refresh = undefined;
    window.clearInterval(this.historyRefresh); this.historyRefresh = undefined;
    this.invalidateHistoryRequest();
    this.lastHistoryRequestAt = 0;
    super.disconnectedCallback();
  }
  protected shouldUpdate(changed: PropertyValues): boolean {
    if (changed.size !== 1 || !changed.has("hass")) return true;
    const previous = changed.get("hass") as HomeAssistant | undefined;
    return previous?.connection !== this.hass?.connection || previous?.callWS !== this.hass?.callWS ||
      relevantHassChanged(previous, this.hass, this.config);
  }
  protected updated(changed: PropertyValues = new Map()): void {
    super.updated();
    if (changed.has("config")) {
      this.refreshMeasuredHistory();
      return;
    }
    if (changed.has("hass") && this.config) {
      const previous = changed.get("hass") as HomeAssistant | undefined;
      if (previous?.connection !== this.hass?.connection || previous?.callWS !== this.hass?.callWS ||
        previous?.config !== this.hass?.config) {
        this.invalidateHistoryRequest();
        this.lastHistoryRequestAt = 0;
        this.refreshMeasuredHistory();
      } else {
        const ids = meteredEntityIds(insightsOptions(this.config!));
        if (ids.some(id => {
          const before = previous?.states[id], current = this.hass?.states[id];
          const wasHealthy = Boolean(before && !["unknown", "unavailable"].includes(before.state));
          const isHealthy = Boolean(current && !["unknown", "unavailable"].includes(current.state));
          return wasHealthy !== isHealthy || before?.attributes.unit_of_measurement !== current?.attributes.unit_of_measurement;
        })) {
          if (this.historyResponse !== undefined) {
            const failures = this.measuredHistory?.value?.warnings?.filter(warning => warning.startsWith("Recorder history request failed:")) ?? [];
            const refreshed = readMeteredActuals(this.checkedHistorySnapshot(this.historyHass!), insightsOptions(this.config), this.historyResponse, this.historySnapshotAt);
            if (refreshed.value) refreshed.value.warnings = [...(refreshed.value.warnings ?? []), ...failures];
            this.measuredHistory = refreshed;
          } else this.refreshMeasuredHistory();
        }
      }
    }
  }
  private invalidateHistoryRequest(): void {
    this.historyGeneration++;
    this.cancelHistoryRequest?.();
    this.cancelHistoryRequest = undefined;
    this.historyPending = false;
  }
  private checkedHistorySnapshot(snapshot: HomeAssistant): HomeAssistant {
    const states = { ...snapshot.states };
    for (const id of meteredEntityIds(insightsOptions(this.config!))) {
      const current = this.hass?.states[id];
      if (!current || ["unknown", "unavailable"].includes(current.state) ||
        current.attributes.unit_of_measurement !== states[id]?.attributes.unit_of_measurement) {
        states[id] = { ...(current ?? states[id]), state: "unavailable" };
      }
    }
    return { ...snapshot, states };
  }
  private refreshMeasuredHistory(): void {
    if (!this.isConnected || !this.config) return;
    const options = insightsOptions(this.config);
    if (options.actualSource.entity) {
      this.invalidateHistoryRequest();
      this.historyKey = "";
      this.lastHistoryRequestAt = 0;
      this.measuredHistory = undefined;
      this.historyResponse = undefined;
      return;
    }
    const ids = meteredEntityIds(options);
    if (!ids.length) {
      this.invalidateHistoryRequest();
      this.historyKey = "";
      this.historyResponse = undefined;
      this.lastHistoryRequestAt = 0;
      this.measuredHistory = readMeteredActuals(this.hass, options, null);
      return;
    }
    if (ids.length > INSIGHTS_HISTORY_MAX_ENTITIES) {
      this.invalidateHistoryRequest();
      this.measuredHistory = { error: "Invalid data source or field mapping: too many history entities" };
      return;
    }
    const hass = this.hass;
    if (!hass) {
      this.invalidateHistoryRequest();
      this.lastHistoryRequestAt = 0;
      this.measuredHistory = { error: "Source missing: Home Assistant is not connected" };
      return;
    }
    const key = JSON.stringify([options.metered, options.consumers, options.fixedExportRate,
      options.maxAgeMinutes, hass.config?.time_zone, options.currency, hass.config?.currency]);
    const now = Date.now();
    if (key === this.historyKey && (this.historyPending || now - this.lastHistoryRequestAt < INSIGHTS_HISTORY_REFRESH_MS)) return;
    const configChanged = key !== this.historyKey;
    this.historyKey = key;
    this.lastHistoryRequestAt = now;
    this.invalidateHistoryRequest();
    const generation = this.historyGeneration;
    this.historyPending = true;
    if (configChanged || !this.measuredHistory?.value) {
      this.historyResponse = undefined;
      this.historyLoad = undefined;
      this.measuredHistory = { error: "Loading measured history" };
    }
    const message = {
      type: "history/history_during_period",
      start_time: new Date(localDayStart(now, hass.config?.time_zone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC") - INSIGHTS_HISTORY_LOOKBACK_MS).toISOString(),
      end_time: new Date(now).toISOString(),
      entity_ids: ids,
      minimal_response: false,
      no_attributes: false,
      significant_changes_only: false,
    };
    void (async () => {
      const began = performance.now();
      let timeout: number | undefined;
      try {
        const request = hass.callWS
          ? hass.callWS<unknown>(message)
          : hass.connection ? hass.connection.sendMessagePromise<unknown>(message) : undefined;
        const response = await Promise.race([request, new Promise<never>((_, reject) => {
          this.cancelHistoryRequest = () => reject(new Error("Recorder history request superseded"));
          timeout = window.setTimeout(() => reject(new Error("Recorder history request timed out after 30 seconds")), 30000);
        })]);
        if (response === undefined) throw new Error("Recorder history connection is unavailable");
        const result = readMeteredActuals(this.checkedHistorySnapshot(hass), options, response, now);
        if (this.isConnected && generation === this.historyGeneration) {
          this.measuredHistory = result;
          this.historyResponse = result.value ? response : undefined;
          this.historySnapshotAt = now;
          this.historyHass = result.value ? hass : undefined;
          const groups = Array.isArray(response) ? response : response && typeof response === "object" ? Object.values(response) : [];
          this.historyLoad = {
            duration: performance.now() - began, entities: ids.length,
            states: groups.reduce<number>((sum, group) => sum + (Array.isArray(group) ? group.length : 0), 0),
          };
        }
      } catch (error) {
        if (!this.isConnected || generation !== this.historyGeneration) return;
        const detail = error instanceof Error ? error.message : String(error);
        console.warn(`${ENERGY_INSIGHTS_TAG}: Recorder history request failed`, error);
        if (this.isConnected && generation === this.historyGeneration) {
          const previous = this.measuredHistory?.value;
          this.measuredHistory = previous ? { value: {
            ...previous, warnings: [...(previous.warnings ?? []).filter(warning => !warning.startsWith("Recorder history request failed:")),
              `Recorder history request failed: ${detail}`],
          } } : { error: `Recorder history request failed: ${detail}` };
        }
      } finally {
        window.clearTimeout(timeout);
        if (generation === this.historyGeneration) {
          this.historyPending = false;
          this.cancelHistoryRequest = undefined;
        }
      }
    })();
  }
  private t(value: string): string { return localizeText(this.hass, value); }
  private n(value: number, digits = 2): string {
    return energyNumber(this.hass, value, { maximumFractionDigits: digits });
  }
  private money(value: number | undefined): string {
    if (value === undefined) return this.t("Not supplied");
    const currency = insightsOptions(this.config!).currency || this.hass?.config?.currency;
    return currency ? energyNumber(this.hass, value, { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }) : this.n(value);
  }
  private rate(value: number | undefined): string {
    if (value === undefined) return this.t("Not supplied");
    return `${this.n(value, 3)} ${insightsOptions(this.config!).currency || this.hass?.config?.currency || this.t("Currency not configured")}/kWh`;
  }
  private time(value: number): string {
    return energyTime(this.hass, value, { month: "short", day: "numeric" });
  }
  private kwh(value: number | undefined, digits = 2): string {
    return value === undefined ? this.t("Not supplied") : `${this.n(value, digits)} kWh`;
  }
  private power(entity?: string): number | undefined {
    const options = insightsOptions(this.config!);
    return livePower(this.hass, entity, Date.now(), options.maxAgeMinutes);
  }
  private watts(value: number | undefined): string {
    return value === undefined ? this.t("Source missing") : Math.abs(value) >= 1000 ? `${this.n(value / 1000)} kW` : `${this.n(Math.abs(value) < .5 ? 0 : value, 0)} W`;
  }
  private flowPower(label: string, value: number | undefined): string {
    if (value === undefined || Math.abs(value) < .5 || !["Grid", "Battery"].includes(label)) return this.watts(value);
    const direction = label === "Grid" ? value > 0 ? "Import" : "Export" : value > 0 ? "Charging" : "Discharging";
    return `${this.t(direction)} · ${this.watts(Math.abs(value))}`;
  }
  private pages(count: number, kind: "rates" | "intervals") {
    const pages = Math.ceil(count / 100), page = Math.min(kind === "rates" ? this.ratePage : this.intervalPage, Math.max(0, pages - 1));
    const change = (next: number) => { if (kind === "rates") this.ratePage = next; else this.intervalPage = next; };
    return pages > 1 ? html`<nav class="pager" aria-label=${this.t(kind === "rates" ? "Price breakdown" : "Metered intervals")}>
      <button ?disabled=${page === 0} @click=${() => change(page - 1)}>${this.t("Previous")}</button>
      <span>${this.n(page + 1, 0)} / ${this.n(pages, 0)}</span>
      <button ?disabled=${page + 1 >= pages} @click=${() => change(page + 1)}>${this.t("Next")}</button>
    </nav>` : nothing;
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
  private measuredChart(data: Actuals) {
    if (!data.intervals.length || data.end <= data.start) return nothing;
    const bars = (direction: "imported" | "exported") => {
      const readings = data.intervals.filter(item => item[direction] > 0);
      const step = Math.max(1, Math.ceil(readings.length / 96));
      return Array.from({ length: Math.ceil(readings.length / step) }, (_, index) => {
        const group = readings.slice(index * step, (index + 1) * step);
        return { start: group[0].start, end: group.at(-1)!.end,
          quantity: group.reduce((sum, item) => sum + item[direction], 0), direction };
      });
    };
    const intervals = [...bars("imported"), ...bars("exported")];
    const largest = intervals.reduce((maximum, item) => Math.max(maximum, item.quantity), 0);
    const magnitude = 10 ** Math.floor(Math.log10(largest || 1));
    const maximum = largest ? Math.ceil(largest / magnitude / .5) * magnitude * .5 : 1;
    const scaleLabel = energyNumber(this.hass, maximum, { maximumSignificantDigits: 3 });
    const x = (time: number) => (time - data.start) / (data.end - data.start) * 1000;
    const importedColor = resolveColor("purple", "green"), exportedColor = resolveColor("orange", "green");
    const ticks = Array.from({ length: 5 }, (_, index) => data.start + (data.end - data.start) * index / 4);
    return html`<section class="section metered-section">
      <div class="metered-heading"><h3>${this.t("Metered intervals")}</h3>
        <div class="legend"><span><i class="swatch" style=${`--tone:${importedColor}`}></i>${this.t("Imported")} ↑</span>
          <span><i class="swatch" style=${`--tone:${exportedColor}`}></i>${this.t("Exported")} ↓</span><span>kWh</span></div>
      </div>
      <div class="chart-scroll" tabindex="0" role="region" aria-label=${this.t("Metered intervals")}>
      <div class="metered-plot">
      <div class="metered-scale" aria-hidden="true"><span>${scaleLabel}</span><span>0</span><span>−${scaleLabel}</span></div>
      <svg class="measured-chart" viewBox="0 0 1000 160" preserveAspectRatio="none" role="img"
        aria-label=${`${this.t("Metered intervals")} · ${this.time(data.start)} – ${this.time(data.end)} · ±${scaleLabel} kWh`}>
        ${[8, 44, 116, 152].map(y => svg`<line x1="0" x2="1000" y1=${y} y2=${y} stroke="var(--divider-color)" stroke-opacity=".5" stroke-dasharray="3 5" vector-effect="non-scaling-stroke"></line>`)}
        ${ticks.map(time => svg`<line x1=${x(time)} x2=${x(time)} y1="8" y2="152" stroke="var(--divider-color)" stroke-opacity=".4" vector-effect="non-scaling-stroke"></line>`)}
        <line x1="0" x2="1000" y1="80" y2="80" stroke="var(--secondary-text-color)" stroke-opacity=".6" vector-effect="non-scaling-stroke"></line>
        ${intervals.map(item => {
          const height = Math.max(.75, item.quantity / maximum * 72);
          return svg`<rect x=${x(item.start)} y=${item.direction === "imported" ? 80 - height : 80}
            width=${Math.max(.5, x(item.end) - x(item.start) - 1.5)} height=${height} rx="1.5"
            fill=${item.direction === "imported" ? importedColor : exportedColor} fill-opacity=".85">
            <title>${this.t(item.direction === "imported" ? "Imported" : "Exported")}: ${this.kwh(item.quantity, 3)} · ${this.time(item.start)} - ${this.time(item.end)}</title>
          </rect>`;
        })}
      </svg>
      <div class="metered-times" aria-hidden="true">${ticks.map((time, index) => html`<span style=${`left:${index * 25}%`}>${energyTime(this.hass, time)}</span>`)}</div>
      </div>
      </div>
      ${data.imported === undefined || data.exported === undefined ? html`<p class="metered-missing">${this.t(data.imported === undefined ? "Imported" : "Exported")}: ${this.t("Not supplied")}</p>` : nothing}
    </section>`;
  }
  private actual(data: Actuals) {
    const options = insightsOptions(this.config!);
    const consumers = options.consumers.map((consumer, index) => ({
      ...consumer, ...(data.consumers[index] ?? { id: consumer.id }), power: this.power(consumer.entity),
      tone: resolveColor(consumer.color, ["orange", "purple", "amber", "blue", "green"][index % 5]),
    }));
    const shown = consumers.filter(item => !this.active || item.power !== undefined && item.power > options.activeThreshold)
      .sort((a, b) => this.sort === "energy" ? (b.energy ?? -Infinity) - (a.energy ?? -Infinity) : (b.power ?? -Infinity) - (a.power ?? -Infinity));
    const share = (value?: number) => data.home && value !== undefined ? value / data.home * 100 : 0;
    let offset = 0;
    const stops = consumers.map(item => {
      const start = offset; offset += share(item.energy);
      return `${item.tone} ${start}% ${offset}%`;
    });
    if (data.remainder !== undefined && data.remainder > 0) stops.push(`var(--disabled-text-color) ${offset}% 100%`);
    const net = data.importCost !== undefined && data.exportCredit !== undefined
      ? data.importCost - data.exportCredit : undefined;
    const self = livePercentage(this.hass, options.selfPoweredEntity, Date.now(), options.maxAgeMinutes);
    const selfMissing = Boolean(options.selfPoweredEntity && self === undefined);
    const issueCount = (data.warnings?.length ?? 0) + (selfMissing ? 1 : 0);
    const stale = Date.now() - data.generated > options.maxAgeMinutes * 60000 ||
      data.coverage?.some(source => source.end !== undefined && Date.now() - source.end > options.maxAgeMinutes * 60000);
    const partial = issueCount || data.approximations?.length ||
      [data.home, data.solar, data.imported, data.exported, data.batteryCharge, data.batteryDischarge].some(value => value === undefined) ||
      data.importCost === undefined || (data.exported !== 0 && data.exportCredit === undefined);
    const ratePage = Math.min(this.ratePage, Math.max(0, Math.ceil(data.buckets.length / 100) - 1));
    const intervalPage = Math.min(this.intervalPage, Math.max(0, Math.ceil(data.intervals.length / 100) - 1));
    const mixStep = Math.max(1, Math.ceil(data.buckets.length / 96));
    const mix = Array.from({ length: Math.ceil(data.buckets.length / mixStep) }, (_, index) =>
      data.buckets.slice(index * mixStep, (index + 1) * mixStep).reduce((sum, bucket) => sum + bucket.quantity, 0));
    return html`
      <small class="window">${this.t("Measured window")}: ${this.time(data.start)} - ${this.time(data.end)}
        · ${this.t("Updated")}: ${this.time(data.generated)}</small>
      <p class="quality" role="status">${this.t(stale ? "Stale data source" : partial ? "Partial" : "Complete")} ·
        <button @click=${() => {
          const details = this.shadowRoot?.querySelector<HTMLDetailsElement>(".diagnostics");
          if (details) { details.open = true; details.scrollIntoView({ block: "nearest" }); }
        }}>${this.t("Measured source")} (${this.n(issueCount, 0)})</button></p>
      ${data.approximations?.length ? html`<p class="approximation" role="note"><strong>${this.t("Approximate accounting")}</strong>:
        ${this.t("Affected totals, household shares and costs are estimates, not exact measurements.")}</p>` : nothing}
      <div class="kpis">
        ${this.kpi("Imported", this.kwh(data.imported), `${this.t("Cost")} ${this.money(data.importCost)} · ${this.t("Weighted average")} ${data.imported && data.importCost !== undefined ? this.rate(data.importCost / data.imported) : this.t("Not supplied")}`)}
        ${this.kpi("Exported", this.kwh(data.exported), `${this.t("Credit")} ${this.money(data.exportCredit)} · ${data.exported && data.exportCredit !== undefined ? this.rate(data.exportCredit / data.exported) : this.t("Not supplied")}`, "mdi:transmission-tower", "orange")}
        ${this.kpi("Solar generated", this.kwh(data.solar), this.t("Measured production"), "mdi:white-balance-sunny", "amber")}
        ${this.kpi("Home consumption", this.kwh(data.home), `${this.t("Excludes battery charging")}${data.homeSource === "direct" ? ` · ${this.t("Household energy sensor")}` : ""}`, "mdi:home", "blue")}
      </div>
      ${options.showFlow ? html`<div class="flow">
        ${([["Solar", options.solarEntity, "mdi:white-balance-sunny", "amber"], ["Home", options.homeEntity, "mdi:home", "blue"], ["Grid", options.gridEntity, "mdi:transmission-tower", "purple"], ["Battery", options.batteryEntity, "mdi:battery", "green"]] as const).map(([label, entity, icon, color]) =>
          html`<span class="flow-item" style=${`--tone:${resolveColor(color, "green")}`}><ha-icon .icon=${icon}></ha-icon>${this.t(label)} <strong>${this.flowPower(label, this.power(entity))}</strong></span>`)}
        ${options.selfPoweredEntity ? html`<span class="self-powered">${this.t("Home self-powered now")} <strong>${self === undefined ? this.t("Source missing") : `${this.n(self, 0)}%`}</strong>
          ${self === undefined ? nothing : html`<span class="bar" role="meter" aria-label=${this.t("Home self-powered now")} aria-valuenow=${self} aria-valuemin="0" aria-valuemax="100"><i style=${`width:${self}%`}></i></span>`}
        </span>` : nothing}
      </div>` : nothing}
      ${options.showConsumers && !consumers.length ? html`<p class="consumer-setup">${this.t("Configure consumer energy sensors in the visual editor.")}</p>` : nothing}
      ${options.showConsumers && consumers.length ? html`<section class="section">
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
            <div class="consumer-name">${item.name}<small>${item.entity && this.hass?.states[item.entity] ? this.hass.formatEntityState?.(this.hass.states[item.entity]) ?? this.watts(item.power) : this.t("Source missing")}</small></div>
            <div class="consumer-power">${this.watts(item.power)}<small>${this.t("Now")}</small></div>
            <div class="consumer-energy">${item.energy === undefined ? this.t("Not supplied") : this.kwh(item.energy)}<small>${item.energy === undefined || data.home === undefined ? this.t("Not supplied") : `${this.n(share(item.energy), 0)}% ${this.t("of home")}`}</small><div class="bar"><i style=${`width:${share(item.energy)}%`}></i></div></div>
            <div class="variance" style=${`color:${item.energy === undefined || item.baseline === undefined || Math.abs(item.energy - item.baseline) < .005 ? "var(--secondary-text-color)" : resolveColor(item.energy > item.baseline ? "orange" : "green", "green")}`}>${item.energy === undefined ? this.t("Not supplied") : item.baseline === undefined ? this.t("Comparison not configured") : Math.abs(item.energy - item.baseline) < .005 ? this.t("On plan") : `${item.energy - item.baseline > 0 ? "+" : ""}${this.kwh(item.energy - item.baseline)}`}<small>${this.t("Same-window plan")}</small></div>
          </div>`) : html`<p>${this.t("No consumers to display")}</p>`}
        </div>${data.home !== undefined && data.remainder !== undefined ? html`<aside class="usage-card"><div><h3>${this.t("Home consumption")}</h3><strong>${this.kwh(data.home)}</strong></div>
          <div class="ring" role="img" aria-label=${this.t("Consumer share")} style=${`background:${stops.length ? `conic-gradient(${stops.join(",")})` : "var(--divider-color)"}`}>
            <div class="ring-hole">${data.home === undefined || data.remainder === undefined ? this.t("Not supplied") :
              data.home ? `${this.n(100 - share(data.remainder), 0)}%` : this.t("Not applicable")}<small>${this.t("Configured consumers")}</small></div>
          </div>
          <div class="legend">${consumers.map(item => html`<span><i class="swatch" style=${`--tone:${item.tone}`}></i>${item.name}: ${item.energy === undefined || data.home === undefined ? this.t("Not supplied") : `${this.n(share(item.energy), 0)}%`}</span>`)}
            <span>${this.t("Unallocated home")}: ${this.kwh(data.remainder)}</span></div>
        </aside>` : html`<p>${this.t("Home consumption")}: ${this.t("Not supplied")} · ${this.t("Measured source")}</p>`}</div>
        <p>${this.t("Consumer totals exclude battery charging. Device costs are not estimated.")}</p>
      </section>` : nothing}
      ${options.showPurchases ? this.measuredChart(data) : nothing}
      ${options.showPurchases ? html`<section class="section"><h3>${this.t("What you bought, at what price")}</h3>
        <div class="price-mix" aria-hidden="true">${mix.map((quantity, index) => html`<i style=${`width:${data.imported ? quantity / data.imported * 100 : 0}%;--tone:${resolveColor(["green", "amber", "orange"][index % 3], "green")}`}></i>`)}</div>
        <p>${this.t("Total imported")}: ${this.kwh(data.imported)} · ${this.t("Weighted average")}: ${data.imported && data.importCost !== undefined ? this.rate(data.importCost / data.imported) : this.t("Not applicable")}</p>
        <details class="rate-details" @toggle=${(event: Event) => { this.ratesOpen = (event.currentTarget as HTMLDetailsElement).open; }}>
        <summary>${this.t("Price breakdown")} (${this.n(data.buckets.length, 0)})</summary>
        ${this.ratesOpen ? html`${this.pages(data.buckets.length, "rates")}<div class="table-scroll"><table><caption class="sr-only">${this.t("Measured purchases")}</caption>
          <thead><tr>${["Unit rate", "Energy bought", "Share of import", "Cost"].map(label => html`<th scope="col">${this.t(label)}</th>`)}</tr></thead>
          <tbody>${data.buckets.slice(ratePage * 100, (ratePage + 1) * 100).map(bucket => html`<tr><td>${this.rate(bucket.rate)}</td><td>${this.kwh(bucket.quantity)}</td><td>${data.imported ? `${this.n(bucket.quantity / data.imported * 100, 0)}%` : this.t("Not applicable")}</td><td>${this.money(bucket.cost)}</td></tr>`)}</tbody>
          <tfoot><tr><td>${this.t("Total imported")}</td><td>${this.kwh(data.imported)}</td><td>${data.imported ? "100%" : this.t("Not applicable")}</td><td>${this.money(data.importCost)}</td></tr></tfoot>
        </table></div>` : nothing}</details>
        <details class="interval-details" @toggle=${(event: Event) => { this.intervalsOpen = (event.currentTarget as HTMLDetailsElement).open; }}><summary>${this.t("Metered intervals")} (${data.intervals.length})</summary>
          ${this.intervalsOpen ? html`${this.pages(data.intervals.length, "intervals")}<div class="table-scroll"><table>
          <thead><tr>${["Time", "Import", "Export", "Unit rate", "Export rate", "Cost", "Credit"].map(label => html`<th scope="col">${this.t(label)}</th>`)}</tr></thead>
          <tbody>${data.intervals.slice(intervalPage * 100, (intervalPage + 1) * 100).map(item => html`<tr><td>${item.approximate ? "≈ " : ""}${this.time(item.start)} - ${this.time(item.end)}</td><td>${this.kwh(item.imported, 3)}</td><td>${this.kwh(item.exported, 3)}</td><td>${item.imported ? this.rate(item.rate) : "-"}</td><td>${item.exported ? this.rate(item.exportRate) : "-"}</td><td>${this.money(item.rate === undefined ? undefined : item.imported * item.rate)}</td><td>${this.money(item.exportRate === undefined ? undefined : item.exported * item.exportRate)}</td></tr>`)}</tbody>
        </table></div>` : nothing}</details>
        <div class="spend-note"><strong>${this.money(data.exportRateConfigured ? net : data.importCost)} ${this.t(data.exportRateConfigured ? "Net variable grid spend" : "Import cost")}</strong><br>
          ${this.money(data.importCost)} ${this.t("Import cost")} - ${data.exportRateConfigured ? this.money(data.exportCredit) : this.t("Not supplied")} ${this.t("Export credit")}
          <p>${this.t("Fixed charges excluded. Totals use unrounded interval values.")}</p>
          ${this.t("Battery input")}: ${this.kwh(data.batteryCharge)} · ${this.t("Battery output")}: ${this.kwh(data.batteryDischarge)}
        </div>
      </section>` : nothing}
      <details class="diagnostics"><summary>${this.t("Measured source")} · ${this.t("Updated")} · ${this.n(issueCount, 0)}</summary>
        ${data.warnings?.map(warning => this.error(warning))}
        ${data.approximations?.map(message => {
          const separator = message.indexOf(": ");
          return html`<p>${separator < 0 ? this.t(message) : `${message.slice(0, separator)}: ${this.t(message.slice(separator + 2))}`}</p>`;
        })}
        ${options.selfPoweredEntity && self === undefined ? this.error("Source missing: selfPoweredEntity requires a fresh percentage sensor") : nothing}
        ${!options.selfPoweredEntity ? html`<p>${this.t("Home self-powered percentage")}: ${this.t("Not supplied")} · ${this.t("Source")}</p>` : nothing}
        ${data.coverage?.map(item => html`<p>${item.id}: ${item.absent ? this.t("Not installed") :
          item.error ?? (item.end === undefined ? this.t("Not supplied") : this.time(item.end))}
          ${item.sourceType ? html` · ${this.t("Counter type")}: ${this.t(item.sourceType === "hardware" ? "Hardware counter" : item.sourceType === "integrated_power" ? "Integrated power" : "Not specified")}` : nothing}
          ${item.lastUpdated === undefined ? nothing : html` · ${this.t("Last state update")}: ${this.time(item.lastUpdated)}`}</p>`)}
        ${this.historyLoad ? html`<p>${this.historyLoad.entities} ${this.t("Sources")} · ${this.historyLoad.states} ${this.t("State")} · ${this.n(this.historyLoad.duration, 0)} ms</p>` : nothing}
      </details>`;
  }
  private allocation(block: PurchaseBlock) {
    return html`<div class="allocation" aria-hidden="true">${([["home", "blue"], ["ev", "purple"], ["battery", "green"]] as const).map(([key, color]) =>
      html`<i style=${`width:${(block[key] ?? 0) / block.quantity * 100}%;--tone:${resolveColor(color, "green")}`}></i>`)}</div>`;
  }
  private plan(data: PurchasePlan) {
    const options = insightsOptions(this.config!);
    const selected = Math.min(this.selected, data.blocks.length - 1), block = data.blocks[selected];
    return html`
      <small class="window">${this.t("Upcoming plan")}: ${this.time(data.start)} - ${this.time(data.end)} · ${this.t("Snapshot")}: ${this.time(data.generated)}</small>
      <p class="forecast-basis">${this.t("Forecast basis")}: ${this.t(options.forecastKind === "estimate" ? "Estimated forecast" : options.forecastKind === "interval" ? "Interval forecast" : "Not specified")}
        ${data.forecastMethod !== undefined || options.planSource.fields?.forecast_method ? html` · ${this.t("Forecast method")}: ${data.forecastMethod?.trim() ? data.forecastMethod : this.t("Not supplied")}` : nothing}</p>
      <div class="kpis">
        ${this.kpi(options.purchaseScope === "battery" ? "Battery input (AC)" : "Planned grid purchase", this.kwh(data.quantity), `${this.t("Estimated cost")} ${this.money(data.cost)} · ${data.quantity ? this.rate(data.cost / data.quantity) : this.t("Not applicable")}`)}
        ${this.kpi("Home demand forecast", this.kwh(data.home), this.t("Includes EV; excludes home-battery charging"), "mdi:home", "blue")}
        ${this.kpi("Solar forecast", this.kwh(data.solar), `${this.time(data.start)} – ${this.time(data.end)}`, "mdi:white-balance-sunny", "amber")}
        ${data.batteryMin !== undefined && data.reserve !== undefined ? this.kpi("Minimum planned battery", `${this.n(data.batteryMin, 0)}%`, `${this.t("Reserve")} ${this.n(data.reserve, 0)}% · ${this.t("Headroom")} ${this.n(data.batteryMin - data.reserve, 0)} pp`, "mdi:battery", "green") : nothing}
      </div>
      <section class="section"><h3>${this.t(options.purchaseScope === "battery" ? "Battery input (AC)" : "Upcoming grid purchases")}</h3><p>${this.t("Supplied plan; not measured or executed.")}</p>
        ${options.showPlanAllocations && data.blocks.length ? html`<div class="legend">${["Direct home use", "EV input (AC)", "Battery input (AC)"].map((label, index) => html`<span><i class="swatch" style=${`--tone:${resolveColor(["blue", "purple", "green"][index], "green")}`}></i>${this.t(label)}</span>`)}</div>` : nothing}
        ${data.blocks.length ? html`<div class="table-scroll"><table><caption class="sr-only">${this.t("Upcoming grid purchases")}</caption>
          <thead><tr>${["Window", "Energy & purpose", "Unit rate", "Estimated cost", ...(options.showPlanBattery ? ["Battery target"] : [])].map(label => html`<th scope="col">${this.t(label)}</th>`)}</tr></thead>
          <tbody>${data.blocks.map((item, index) => html`<tr class=${index === selected ? "selected" : ""}><td><button class="block-button" aria-pressed=${index === selected} aria-controls="block-detail" @click=${() => { this.selected = index; }}>${this.time(item.start)}<br>${this.time(item.end)}</button></td><td>${this.kwh(item.quantity)}${options.showPlanAllocations ? this.allocation(item) : nothing}</td><td>${this.rate(item.rate)}</td><td>${this.money(item.cost)}</td>${options.showPlanBattery ? html`<td>${item.target === undefined ? this.t("Not supplied") : `${this.n(item.target, 0)}%`}</td>` : nothing}</tr>`)}</tbody>
          <tfoot><tr><td>${data.blocks.length} ${this.t("Planned blocks")}</td><td>${this.kwh(data.quantity)}</td><td>${data.quantity ? this.rate(data.cost / data.quantity) : this.t("Not applicable")}</td><td>${this.money(data.cost)}</td>${options.showPlanBattery ? html`<td>${this.t("Not executed")}</td>` : nothing}</tr></tfoot>
        </table></div>` : nothing}
        ${block ? html`<div class="block-detail" id="block-detail" aria-live="polite">
          <h3>${this.time(block.start)} - ${this.time(block.end)}</h3><p>${block.reason}</p>
          ${options.showPlanAllocations ? html`<div class="allocation-metrics">${([["home", "Direct home use", "blue"], ["ev", "EV input (AC)", "purple"], ["battery", "Battery input (AC)", "green"]] as const).map(([key, label, color]) =>
            html`<div style=${`--tone:${resolveColor(color, "green")}`}><strong>${this.kwh(block[key])}</strong><small>${this.t(label)}</small></div>`)}</div>` : nothing}
          <p>${this.kwh(block.quantity)} × ${this.rate(block.rate)} = ${this.money(block.cost)}</p><p>${block.detail}</p>
          ${data.efficiency !== undefined && block.battery !== undefined ? html`<p>${this.t("Charge efficiency")}: ${this.n(data.efficiency * 100, 0)}% · ${this.t("Stored battery energy")}: ${this.kwh(block.battery * data.efficiency)}</p>` : nothing}
        </div>` : html`<p class="empty-plan">${this.t(options.purchaseScope === "battery" ? "No battery charging purchases in the supplied horizon." : "No grid purchases in the supplied horizon.")} ${this.time(data.start)} – ${this.time(data.end)}</p>`}
        <details><summary>${this.t("Plan assumptions")}</summary><p>${this.t("AC input includes charging losses. Forecasts are not measured totals.")}</p><p>${this.t("Plan values come from entities. This card does not calculate plans or infer future battery levels.")}</p></details>
      </section>
      ${options.showForecasts && options.consumers.length ? html`<section class="section"><h3>${this.t("How consumers fit the plan")}</h3><div class="forecasts">
        ${options.consumers.map((consumer, index) => html`<div class="forecast"><h3>${consumer.name}</h3><strong>${data.consumers[index].energy === undefined ? this.t("Not supplied") : this.kwh(data.consumers[index].energy!)}</strong><small> ${this.t("Forecast")}</small><p>${data.consumers[index].strategy ?? this.t("Not supplied")}</p></div>`)}
      </div></section>` : nothing}`;
  }
  protected render() {
    if (!this.config) return nothing;
    const options = insightsOptions(this.config);
    const actual = options.actualSource.entity ? readActuals(this.hass, options) :
      this.measuredHistory ?? readMeteredActuals(this.hass, options, null);
    const plan: SourceResult<PurchasePlan> = options.planSource.entity ? readPurchasePlan(this.hass, options) :
      { error: "Source missing: select the plan source sensor and map the required upcoming-plan fields" };
    return html`<ha-card class=${`mushroom-addition-card${this.config.card_shadow ? " card-shadow" : ""}`}>
      <div class="content" style=${`max-width:${options.maxContentWidth ? `${options.maxContentWidth}px` : "none"}`}>
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
      </div>
    </ha-card>`;
  }
}
