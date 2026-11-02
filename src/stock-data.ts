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
  ["volume", "Trading volume", "regularMarketVolume"], ["market_cap", "Market cap", "marketCap"],
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
    ? "Optional metric sensor override. Empty uses the main entity."
    : "Attribute or empty for state. Overrides win; Yahoo mappings fill missing values.";
  const helpers: Record<string, string> = {
    stock_source: "Choose entity sensors, Yahoo (Market Data backend), or Stock Market Deluxe. Yahoo sensors alone have no history.",
    stock_symbol: "Ticker (e.g. MSFT). Empty uses entity symbol; Stock Market Deluxe defaults to AAPL.",
    stock_currency: "Currency override (ISO code, e.g. USD or EUR).",
    stock_shares: "Shares owned, including fractions. Calculates position value and daily change.",
    stock_interval: "Refresh interval in seconds. Backend market-hour limits still apply.",
    stock_range: "Yahoo: market history up to 5Y. Entities: recorder retention only. Stock Market Deluxe: up to 1Y.",
    stock_show_position: "Show shares, position value and daily change.",
    stock_show_statistics: "Show market capitalization, highs/lows and valuation ratios.",
    stock_show_volume: "Show backend trading volume.",
    stock_show_trends: "Show 20-sample simple/exponential moving averages.",
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
