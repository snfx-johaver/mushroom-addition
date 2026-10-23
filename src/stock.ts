import { LitElement, css, html, nothing, svg, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { AdditionConfig, HomeAssistant } from "./types";
import { localizeText } from "./localize";
import { stockEntityQuote, stockMetricSource, stockMetricValue } from "./stock-data";
import type { MushroomMiniGraphCard, MiniGraphCardConfig } from "./mini-graph";

export const STOCK_RANGES = ["1D", "5D", "1M", "3M", "1Y"] as const;
type StockRange = typeof STOCK_RANGES[number];
type Quote = Record<string, unknown> & {
  symbol?: string; shortName?: string; longName?: string; currency?: string;
  regularMarketPrice?: number; regularMarketChange?: number; regularMarketChangePercent?: number;
};
export interface StockSnapshot {
  symbol: string;
  quote: Quote | null;
  chart?: { t?: number[]; c?: number[]; v?: number[] };
  interval?: number;
  quote_age?: number | null;
  market_open?: boolean;
  rate_limited?: boolean;
  beta?: number | null;
}

const finite = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);
const visible = () => document.visibilityState !== "hidden";

export function parseStockSnapshot(value: unknown): StockSnapshot {
  if (!value || typeof value !== "object" || !("symbol" in value) || typeof value.symbol !== "string" ||
    !("quote" in value) || !value.quote || typeof value.quote !== "object") {
    throw new Error("The stock integration returned an invalid response.");
  }
  const rawQuote: Record<string, unknown> = { ...value.quote };
  const quote: Quote = { ...rawQuote };
  for (const key of ["symbol", "shortName", "longName", "currency"] as const) {
    const field = rawQuote[key];
    if (field !== undefined && field !== null && typeof field !== "string") {
      throw new Error("The stock integration returned an invalid quote.");
    }
    quote[key] = typeof field === "string" ? field : undefined;
  }
  let chart: StockSnapshot["chart"];
  if ("chart" in value && value.chart !== undefined && value.chart !== null) {
    if (typeof value.chart !== "object") throw new Error("The stock integration returned an invalid chart.");
    const raw = value.chart;
    const numbers = (key: string): number[] => {
      const series: unknown = key in raw ? raw[key as keyof typeof raw] : [];
      if (!Array.isArray(series) || !series.every(point => point === null || finite(point))) {
        throw new Error("The stock integration returned an invalid chart series.");
      }
      return series.map(point => point === null ? NaN : point);
    };
    chart = { t: numbers("t"), c: numbers("c"), v: numbers("v") };
  }
  return {
    symbol: value.symbol, quote, chart,
    interval: "interval" in value && finite(value.interval) ? value.interval : undefined,
    quote_age: "quote_age" in value && finite(value.quote_age) ? value.quote_age : undefined,
    market_open: "market_open" in value && value.market_open === true,
    rate_limited: "rate_limited" in value && value.rate_limited === true,
    beta: "beta" in value && finite(value.beta) ? value.beta : undefined,
  };
}

export function stockOptions(config: AdditionConfig) {
  if (config.stock_source !== undefined && !["entity", "stock_market_deluxe"].includes(config.stock_source)) {
    throw new Error("Select a supported stock data source.");
  }
  const symbol = (config.stock_symbol ?? "AAPL").trim().toUpperCase();
  if (config.stock_source === "stock_market_deluxe" && !/^[A-Z0-9^][A-Z0-9.^=-]{0,14}$/.test(symbol)) {
    throw new Error("Enter a valid stock symbol (up to 15 characters).");
  }
  const shares = config.stock_shares ?? 0;
  if (!finite(shares) || shares < 0) throw new Error("Shares owned must be a non-negative number.");
  const interval = config.stock_interval ?? 300;
  if (!finite(interval) || interval < 180 || interval > 86400) throw new Error("Refresh interval must be between 180 and 86400 seconds.");
  const range = config.stock_range ?? "1D";
  if (!STOCK_RANGES.includes(range)) throw new Error("Select a supported stock chart range.");
  return { symbol, shares, interval: Math.round(interval), range };
}

export function stockSeries(snapshot: StockSnapshot) {
  const chart = snapshot.chart;
  return (chart?.c ?? []).flatMap((price, i) => finite(price) && finite(chart?.t?.[i])
    ? [{ time: chart!.t![i], price, volume: finite(chart?.v?.[i]) ? Math.max(0, chart!.v![i]) : 0 }] : []);
}

export function stockTrends(values: number[], period = 20) {
  const sma: number[] = [], ema: number[] = [];
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    sma.push(sum / Math.min(i + 1, period));
    ema.push(i ? values[i] * (2 / (period + 1)) + ema[i - 1] * (1 - 2 / (period + 1)) : values[i]);
  }
  return { sma, ema };
}

@customElement("mushroom-addition-stock")
export class MushroomStockContent extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) config?: AdditionConfig;
  @state() private data?: StockSnapshot;
  @state() private error?: string;
  @state() private loading = false;
  @state() private range?: StockRange;
  private requestKey?: string;
  private generation = 0;
  private timer?: ReturnType<typeof setTimeout>;
  private graph?: MushroomMiniGraphCard;
  private graphKey?: string;
  private visibility = () => {
    this.clearTimer();
    if (document.visibilityState !== "hidden") void this.load();
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("visibilitychange", this.visibility);
    this.requestUpdate();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.generation++;
    this.requestKey = undefined;
    this.clearTimer();
    document.removeEventListener("visibilitychange", this.visibility);
  }
  private clearTimer() { clearTimeout(this.timer); this.timer = undefined; }
  protected willUpdate(changes: PropertyValues) {
    if (!this.config || !this.hass) return;
    try {
      const options = stockOptions(this.config);
      if (changes.has("config")) {
        const previous = changes.get("config") as AdditionConfig | undefined;
        if (previous?.stock_range !== this.config.stock_range) this.range = options.range;
      }
      if (this.config.stock_source !== "stock_market_deluxe") {
        if (this.requestKey) { this.generation++; this.clearTimer(); this.requestKey = undefined; }
        this.loading = false;
        this.error = undefined;
        return;
      }
      const key = JSON.stringify([options.symbol, options.interval, this.range ?? options.range]);
      const previousHass = changes.get("hass") as HomeAssistant | undefined;
      const connectionChanged = changes.has("hass") && (
        previousHass?.connection !== this.hass.connection || previousHass?.callWS !== this.hass.callWS);
      if (key !== this.requestKey || connectionChanged) {
        this.requestKey = key;
        this.data = undefined;
        void this.load();
      }
    } catch (error) {
      this.generation++;
      this.clearTimer();
      this.requestKey = undefined;
      this.data = undefined;
      this.loading = false;
      this.error = error instanceof Error ? error.message : String(error);
    }
  }
  private async load() {
    if (!this.isConnected || !this.hass || !this.config ||
      this.config.stock_source !== "stock_market_deluxe" || !visible()) return;
    this.clearTimer();
    const generation = ++this.generation;
    this.loading = true;
    this.error = undefined;
    let interval = 600;
    try {
      const options = stockOptions(this.config);
      const message = { type: "stock_market_deluxe_card/data", symbol: options.symbol,
        range: this.range ?? options.range, interval: options.interval };
      const response: unknown = this.hass.callWS
        ? await this.hass.callWS(message)
        : this.hass.connection
          ? await this.hass.connection.sendMessagePromise(message)
          : await Promise.reject(new Error("Home Assistant WebSocket connection is unavailable."));
      if (generation !== this.generation || !this.isConnected) return;
      const snapshot = parseStockSnapshot(response);
      if (!finite(snapshot.quote?.regularMarketPrice)) throw new Error(`No quote found for ${options.symbol}.`);
      this.data = snapshot;
      interval = Math.max(options.interval, snapshot.market_open ? 180 : 600,
        finite(snapshot.interval) ? snapshot.interval : 0);
    } catch (error) {
      if (generation !== this.generation || !this.isConnected) return;
      const message = error instanceof Error ? error.message :
        error && typeof error === "object" && "message" in error ? String(error.message) : String(error);
      this.error = `${localizeText(this.hass, "Stock data unavailable")}: ${message}. ${localizeText(this.hass,
        "Install and set up the Stock Market Deluxe integration in Settings > Devices & services.")}`;
    } finally {
      if (generation === this.generation && this.isConnected) {
        this.loading = false;
        if (visible()) this.timer = setTimeout(() => void this.load(), interval * 1000);
      }
    }
  }
  private currentSnapshot(): StockSnapshot | undefined {
    if (this.config?.stock_source === "stock_market_deluxe") return this.data;
    if (!this.config) return undefined;
    const quote = stockEntityQuote(this.config, this.hass);
    return { symbol: String(quote.symbol), quote, beta: stockMetricValue(this.config, this.hass, "beta") };
  }
  protected updated() {
    const slot = this.shadowRoot?.querySelector(".entity-chart");
    if (!slot || !this.config || !this.hass) return;
    const { id, attribute } = stockMetricSource(this.config, this.hass, "price");
    if (!id) return;
    const hours = { "1D": 24, "5D": 120, "1M": 720, "3M": 2160, "1Y": 8760 }[this.range ?? this.config.stock_range ?? "1D"];
    const config: MiniGraphCardConfig = {
      type: "custom:mushroom-addition-mini-graph-card",
      entities: [{ entity: id, ...(attribute ? { attribute } : {}) }],
      hours_to_show: hours, points_per_hour: Math.min(2, 500 / hours),
      update_interval: this.config.stock_interval ?? 300,
      show: { name: false, icon: false, state: false, legend: false, fill: false, points: false },
    };
    this.graph ??= document.createElement("mushroom-addition-mini-graph-card") as MushroomMiniGraphCard;
    this.graph.style.setProperty("--ha-card-border-width", "0px");
    this.graph.style.setProperty("--ha-card-box-shadow", "none");
    const key = JSON.stringify(config);
    if (key !== this.graphKey) { this.graph.setConfig(config); this.graphKey = key; }
    this.graph.hass = this.hass;
    if (this.graph.parentElement !== slot) slot.append(this.graph);
  }
  private format(value: unknown, currency?: string, compact = false) {
    if (!finite(value)) return "--";
    try {
      return new Intl.NumberFormat(this.hass?.language, {
        ...(currency ? { style: "currency", currency } : {}),
        maximumFractionDigits: 2, ...(compact ? { notation: "compact" } : {}),
      }).format(value);
    } catch (error) {
      if (!(error instanceof RangeError)) throw error;
      return `${value.toFixed(2)}${currency ? ` ${currency}` : ""}`;
    }
  }
  private chart() {
    const points = this.data ? stockSeries(this.data) : [];
    if (!points.length) return html`<p>${localizeText(this.hass, "No chart history available.")}</p>`;
    const prices = points.map(p => p.price), low = Math.min(...prices), high = Math.max(...prices);
    const trends = stockTrends(prices);
    const x = (i: number) => points.length === 1 ? 250 : i / (points.length - 1) * 500;
    const y = (p: number) => high === low ? 75 : 140 - (p - low) / (high - low) * 130;
    const line = (values: number[]) => values.map((p, i) => `${x(i)},${y(p)}`).join(" ");
    const maxVolume = Math.max(1, ...points.map(p => p.volume));
    const date = (time: number) => new Date(time * 1000).toLocaleString(this.hass?.language);
    return html`
      <svg viewBox="0 0 500 180" role="img" aria-label=${localizeText(this.hass, "Stock price history")}>
        ${this.config?.stock_show_volume !== false ? points.map((p, i) => svg`
          <rect x=${x(i)} y=${180 - p.volume / maxVolume * 28} width=${Math.max(.5, 500 / points.length - 1)}
            height=${p.volume / maxVolume * 28} fill="var(--divider-color)"></rect>`) : nothing}
        <polyline points=${line(prices)} fill="none" stroke="var(--primary-color)" stroke-width="2" vector-effect="non-scaling-stroke"></polyline>
        ${this.config?.stock_show_trends !== false ? svg`
          <polyline points=${line(trends.sma)} fill="none" stroke="var(--info-color, #039be5)" vector-effect="non-scaling-stroke"></polyline>
          <polyline points=${line(trends.ema)} fill="none" stroke="var(--warning-color, #ffa600)" vector-effect="non-scaling-stroke"></polyline>` : nothing}
      </svg>
      <div class="axis"><span>${date(points[0].time)}</span><span>${date(points.at(-1)!.time)}</span></div>
      ${this.config?.stock_show_trends !== false ? html`<div class="legend">SMA 20 / EMA 20</div>` : nothing}`;
  }
  protected render() {
    const snapshot = this.currentSnapshot();
    const quote = snapshot?.quote;
    const entityMode = this.config?.stock_source !== "stock_market_deluxe";
    const hasPrice = finite(quote?.regularMarketPrice);
    const currency = this.config?.stock_currency || quote?.currency;
    const shares = this.config?.stock_shares ?? 0;
    const change = quote?.regularMarketChange;
    const stop = (event: Event) => event.stopPropagation();
    return html`<div class="stock" @click=${stop} @dblclick=${stop} @pointerdown=${stop} @keydown=${stop}>
      ${this.error ? html`<div role="alert">${this.error}
        ${!entityMode ? html`<button @click=${() => void this.load()}>${localizeText(this.hass, "Retry")}</button>` : nothing}
      </div>` : nothing}
      ${this.loading && !quote ? html`<p role="status">${localizeText(this.hass, "Loading stock data...")}</p>` : nothing}
      ${entityMode && !hasPrice ? html`<p role="alert">${localizeText(this.hass,
        "Select an available stock price entity, or map its price attribute, in the visual editor.")}</p>` : nothing}
      ${quote && hasPrice && !(entityMode && this.error) ? html`
        <div class="quote"><div><strong>${quote.longName || quote.shortName || snapshot!.symbol}</strong>
          <div class="muted">${snapshot!.symbol}${!entityMode ? html` - ${localizeText(this.hass, snapshot!.market_open ? "Market open" : "Market closed")}` : nothing}</div></div>
          <div><strong class="price">${this.format(quote.regularMarketPrice, currency)}</strong>
          <div class=${!finite(change) ? "muted" : change < 0 ? "negative" : "positive"}>
            ${this.format(change)} (${this.format(quote.regularMarketChangePercent)}%)</div></div></div>
        ${snapshot!.rate_limited ? html`<p role="status">${localizeText(this.hass, "Rate limited: showing cached stock data.")}</p>` : nothing}
        ${finite(snapshot!.quote_age) ? html`<p class="muted">${localizeText(this.hass, "Updated")} ${Math.floor(snapshot!.quote_age! / 60)} min</p>` : nothing}
        <div class="ranges" role="group" aria-label=${localizeText(this.hass, "Chart range")}>
          ${STOCK_RANGES.map(range => html`<button aria-pressed=${range === (this.range ?? this.config?.stock_range ?? "1D")}
            @click=${() => { this.range = range; }}>${range}</button>`)}</div>
        ${entityMode ? html`<div class="entity-chart"></div>` : this.chart()}
        ${this.config?.stock_show_position !== false ? html`<div class="position">
          <span>${localizeText(this.hass, "Shares owned")}: ${this.format(shares)}</span>
          <strong>${this.format(shares * quote.regularMarketPrice!, currency)}</strong>
          <span>${localizeText(this.hass, "Today")}: ${this.format(finite(change) ? shares * change : undefined, currency)}</span>
        </div>` : nothing}
        ${this.config?.stock_show_statistics !== false ? html`<dl>${[
          ["Open", quote.regularMarketOpen], ["High", quote.regularMarketDayHigh],
          ["Low", quote.regularMarketDayLow], ["Previous close", quote.regularMarketPreviousClose],
          ["Volume", quote.regularMarketVolume], ["Market cap", quote.marketCap],
          ["52-week high", quote.fiftyTwoWeekHigh], ["52-week low", quote.fiftyTwoWeekLow],
          ["P/E", quote.trailingPE], ["EPS", quote.epsTrailingTwelveMonths],
          ["Beta", snapshot!.beta], ["After hours", quote.postMarketPrice], ["Pre-market", quote.preMarketPrice],
        ].map(([label, value]) => html`<div><dt>${localizeText(this.hass, String(label))}</dt><dd>${this.format(value, undefined, true)}</dd></div>`)}</dl>` : nothing}
      ` : nothing}
    </div>`;
  }
  static styles = css`
    :host { display: block; min-width: 0; color: var(--primary-text-color); }
    .stock { padding: 12px; font-size: var(--mush-card-secondary-font-size, 12px); }
    .quote { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
    .price { font-size: 24px; } .muted, dt, .axis { color: var(--secondary-text-color); }
    .positive { color: var(--success-color, #2e7d32); } .negative { color: var(--error-color, #c62828); }
    button { border: 0; border-radius: var(--mush-control-border-radius, 12px); padding: 8px 12px;
      background: var(--secondary-background-color); color: var(--primary-text-color); cursor: pointer; }
    button:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    button[aria-pressed="true"] { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    .ranges { display: flex; gap: 8px; flex-wrap: wrap; margin: 12px 0; }
    svg { width: 100%; height: auto; display: block; overflow: visible; }
    .axis, .position { display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
    .axis, .legend { font-size: 10px; } .legend { text-align: center; margin: 8px; }
    .position { margin-top: 12px; padding: 12px; border-radius: 12px; background: var(--secondary-background-color); }
    dl { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 12px; margin-bottom: 0; }
    dd { margin: 4px 0 0; font-size: 14px; } [role="alert"] { color: var(--error-color); }
  `;
}
