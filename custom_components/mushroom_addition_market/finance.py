"""Yahoo market data adapter. No Home Assistant or dashboard state is accessed."""

import math
import re
import time
from datetime import datetime
from numbers import Real

import yfinance as yf

RANGES = {
    "1D": ("1d", "5m"),
    "5D": ("5d", "30m"),
    "1M": ("1mo", "1d"),
    "3M": ("3mo", "1d"),
    "1Y": ("1y", "1d"),
    "5Y": ("5y", "1wk"),
}
SYMBOL = re.compile(r"^[A-Z0-9^][A-Z0-9.^=-]{0,14}\Z")


def number(value):
    """Convert provider numbers to finite, JSON-safe native numbers."""
    if isinstance(value, Real) and not isinstance(value, bool) and math.isfinite(value):
        return float(value)
    return None


def first_number(*values):
    return next((n for value in values if (n := number(value)) is not None), None)


def timestamp(value):
    if isinstance(value, datetime):
        return number(value.timestamp()) if value.tzinfo is not None else None
    return number(value)


def fetch_snapshot(symbol, chart_range):
    """Fetch historical prices and optional fundamentals, never recorder history."""
    if not SYMBOL.fullmatch(symbol) or chart_range not in RANGES:
        raise ValueError("Invalid stock symbol or chart range")
    period, interval = RANGES[chart_range]
    ticker = yf.Ticker(symbol)
    frame = ticker.history(
        period=period, interval=interval, auto_adjust=False, actions=False,
        raise_errors=True, timeout=20,
    )
    if frame.empty:
        raise ValueError(f"No market history returned for {symbol}")
    times, closes, volumes = [], [], []
    for index, row in frame.iterrows():
        close = number(row.get("Close"))
        if close is None:
            continue
        times.append(int(index.timestamp()))
        closes.append(close)
        volumes.append(number(row.get("Volume")))
    if not closes:
        raise ValueError(f"No valid historical prices returned for {symbol}")

    metadata = ticker.get_history_metadata()
    warnings = []
    try:
        info = ticker.get_info()
    except Exception as error:
        # History is still useful when Yahoo rejects the optional fundamentals call.
        warnings.append(f"Company statistics unavailable ({type(error).__name__}).")
        info = {}
    info = info or {}
    metadata = metadata or {}
    quote = {}
    aliases = {
        "regularMarketPrice": ("regularMarketPrice", "currentPrice"),
        "regularMarketChange": ("regularMarketChange",),
        "regularMarketChangePercent": ("regularMarketChangePercent",),
        "regularMarketOpen": ("regularMarketOpen", "open"),
        "regularMarketDayHigh": ("regularMarketDayHigh", "dayHigh"),
        "regularMarketDayLow": ("regularMarketDayLow", "dayLow"),
        "regularMarketPreviousClose": ("regularMarketPreviousClose", "previousClose"),
        "regularMarketVolume": ("regularMarketVolume", "volume"),
        "marketCap": ("marketCap",),
        "fiftyTwoWeekHigh": ("fiftyTwoWeekHigh",),
        "fiftyTwoWeekLow": ("fiftyTwoWeekLow",),
        "trailingPE": ("trailingPE",),
        "epsTrailingTwelveMonths": ("epsTrailingTwelveMonths", "trailingEps"),
        "beta": ("beta",),
        "postMarketPrice": ("postMarketPrice",),
        "preMarketPrice": ("preMarketPrice",),
    }
    for field, keys in aliases.items():
        quote[field] = first_number(
            *(info.get(key) for key in keys), *(metadata.get(key) for key in keys)
        )
    if quote["regularMarketPrice"] is None:
        raise ValueError(f"No current quote returned for {symbol}")
    previous = quote["regularMarketPreviousClose"]
    if previous is not None:
        if quote["regularMarketChange"] is None:
            quote["regularMarketChange"] = quote["regularMarketPrice"] - previous
        if quote["regularMarketChangePercent"] is None and previous != 0:
            quote["regularMarketChangePercent"] = quote["regularMarketChange"] / previous * 100
    for field in ("shortName", "longName", "currency"):
        value = info.get(field) or metadata.get(field)
        if isinstance(value, str):
            quote[field] = value
    quote["symbol"] = symbol
    missing = [key for key, value in quote.items() if value is None]
    if missing:
        warnings.append("Provider did not supply: " + ", ".join(missing) + ".")
    quote_time = timestamp(info.get("regularMarketTime")) or timestamp(metadata.get("regularMarketTime"))
    market_state = info.get("marketState") or metadata.get("marketState")
    now = time.time()
    periods = metadata.get("currentTradingPeriod")
    regular_session = periods.get("regular") if isinstance(periods, dict) else None
    regular_session = regular_session if isinstance(regular_session, dict) else {}
    start, end = timestamp(regular_session.get("start")), timestamp(regular_session.get("end"))
    market_open = market_state == "REGULAR" if market_state else (
        start <= now < end if start is not None and end is not None else None
    )
    return {
        "symbol": symbol, "quote": quote,
        "chart": {"t": times, "c": closes, "v": volumes},
        "beta": quote["beta"],
        "quote_age": max(0, now - quote_time) if quote_time else None,
        "market_open": market_open,
        "warnings": warnings,
        "provider": "Yahoo Finance",
    }
