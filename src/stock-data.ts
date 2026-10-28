import type { AdditionConfig, HassEntity, HomeAssistant } from "./types";

export const STOCK_RANGES = ["1D", "5D", "1M", "3M", "1Y", "5Y"] as const;
export type StockRange = typeof STOCK_RANGES[number];
export const stockUsesBackend = (config?: AdditionConfig) =>
  config?.stock_source === "yahoo" || config?.stock_source === "stock_market_deluxe";

export const STOCK_METRICS = [
  ["price", "Price", "regularMarketPrice"],
  ["change", "Daily price change", "regularMarketChange"],
  ["percent", "Daily change (%)", "regularMarketChangePercent"],
  ["open", "Open", "regularMarketOpen"], ["high", "High", "regularMarketDayHigh"],
  ["low", "Low", "regularMarketDayLow"], ["previous", "Previous close", "regularMarketPreviousClose"],
  ["volume", "Volume", "regularMarketVolume"], ["market_cap", "Market cap", "marketCap"],
  ["year_high", "52-week high", "fiftyTwoWeekHigh"], ["year_low", "52-week low", "fiftyTwoWeekLow"],
  ["pe", "P/E", "trailingPE"], ["eps", "EPS", "epsTrailingTwelveMonths"],
  ["beta", "Beta", "beta"], ["after_hours", "After hours", "postMarketPrice"],
  ["pre_market", "Pre-market", "preMarketPrice"],
] as const;

export type StockMetric = typeof STOCK_METRICS[number][0];
export const stockMetricLabel = (field: string): string | undefined => {
  for (const [key, label] of STOCK_METRICS) {
    if (field === `stock_${key}_entity`) return `${label} entity (optional override)`;
    if (field === `stock_${key}_attribute`) return `${label} attribute (empty uses entity state)`;
  }
  return undefined;
};

export const stockEditorHelper = (field: string): string | undefined => {
  if (stockMetricLabel(field)) return field.endsWith("_entity")
    ? "Optional sensor override for this value. Leave empty to read from the main stock entity."
    : "Attribute on the selected sensor. An empty value reads its state. In Yahoo mode, mappings supplement missing provider values; a metric entity override takes priority.";
  const helpers: Record<string, string> = {
    stock_source: "Use any provider's HA sensors, Yahoo market history with the optional Mushroom Addition Market Data backend, or Stock Market Deluxe. The Yahoo Finance sensor integration alone does not supply history.",
    stock_symbol: "Yahoo ticker, such as MSFT (inferred from the main entity's symbol when empty). Entity mode uses it as a display label; Stock Market Deluxe defaults to AAPL.",
    stock_currency: "Optional ISO currency code override, such as USD or EUR. Otherwise read from the entity or provider.",
    stock_shares: "Number of shares owned, including fractions. Position value and daily change are calculated from the quote.",
    stock_interval: "Graph/backend refresh interval in seconds. Backend market-open and market-closed limits still apply.",
    stock_range: "Yahoo mode retrieves actual market history, including 5Y. Entity mode uses recorder retention, not backfilled market prices. Stock Market Deluxe supports up to 1Y.",
    stock_show_position: "Show shares owned, current position value and daily value change.",
    stock_show_statistics: "Show available provider values such as market cap, daily high/low and valuation ratios.",
    stock_show_volume: "Show trading volume supplied with market history by the selected backend.",
    stock_show_trends: "Show 20-sample simple and exponential moving averages on provider-supplied history.",
  };
  return helpers[field];
};

export function stockMetricSource(config: AdditionConfig, hass: HomeAssistant | undefined, key: StockMetric) {
  const override = config[`stock_${key}_entity`];
  const id = typeof override === "string" && override ? override : config.entity;
  const entity = id ? hass?.states[id] : undefined;
  const configuredAttribute = config[`stock_${key}_attribute`];
  const defaultAttribute = STOCK_METRICS.find(metric => metric[0] === key)![2];
  const attribute = typeof configuredAttribute === "string" ? configuredAttribute.trim()
    : key === "price" || override ? "" : defaultAttribute;
  return { entity, id, attribute };
}

export function stockMetricValue(config: AdditionConfig, hass: HomeAssistant | undefined, key: StockMetric) {
  const { entity, attribute } = stockMetricSource(config, hass, key);
  if (!entity || ["unavailable", "unknown"].includes(entity.state)) return undefined;
  const raw = attribute ? entity.attributes[attribute] : entity.state;
  if (raw === null || raw === undefined || (typeof raw !== "string" && typeof raw !== "number") ||
    (typeof raw === "string" && !raw.trim())) return undefined;
  const number = Number(raw);
  return Number.isFinite(number) ? number : undefined;
}

export function stockEntityQuote(config: AdditionConfig, hass: HomeAssistant | undefined) {
  const entity: HassEntity | undefined = (config.entity ? hass?.states[config.entity] : undefined) ||
    stockMetricSource(config, hass, "price").entity;
  const quote: Record<string, unknown> = {
    symbol: config.stock_symbol || entity?.attributes.symbol || entity?.entity_id || "",
    shortName: entity?.attributes.friendly_name || config.stock_symbol || "",
    currency: config.stock_currency || entity?.attributes.currency ||
      (/^[A-Z]{3}$/.test(String(entity?.attributes.unit_of_measurement ?? "")) ? entity?.attributes.unit_of_measurement : undefined),
  };
  for (const [key, , quoteKey] of STOCK_METRICS) quote[quoteKey] = stockMetricValue(config, hass, key);
  return quote;
}

export function stockProviderQuote(config: AdditionConfig, hass: HomeAssistant | undefined, provider: Record<string, unknown>) {
  const quote = { ...provider };
  const entityQuote = stockEntityQuote(config, hass);
  const entitySymbol = stockMetricSource(config, hass, "price").entity?.attributes.symbol;
  const matchingEntity = !entitySymbol || !provider.symbol ||
    String(entitySymbol).toUpperCase() === String(provider.symbol).toUpperCase();
  for (const [key, , quoteKey] of STOCK_METRICS) {
    const mapped = entityQuote[quoteKey];
    if (typeof mapped === "number" && Number.isFinite(mapped) &&
      (config[`stock_${key}_entity`] || (matchingEntity &&
        (typeof quote[quoteKey] !== "number" || !Number.isFinite(quote[quoteKey]))))) {
      quote[quoteKey] = mapped;
    }
  }
  if (matchingEntity) {
    for (const key of ["shortName", "currency"]) {
      if (!quote[key] && entityQuote[key]) quote[key] = entityQuote[key];
    }
  }
  return quote;
}
