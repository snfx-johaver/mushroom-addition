"""Run with python -m pytest tests/test_market_backend.py."""

import asyncio
import importlib.util
import json
import sys
from pathlib import Path
from types import ModuleType, SimpleNamespace
from unittest.mock import AsyncMock, Mock

import pandas as pd
import pytest
import voluptuous as vol

ROOT = Path(__file__).resolve().parents[1]


def load_module(name):
    spec = importlib.util.spec_from_file_location(
        name, ROOT / "custom_components" / "mushroom_addition_market" / f"{name}.py"
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


finance = load_module("finance")
cache_module = load_module("cache")


@pytest.fixture
def ticker(monkeypatch):
    frame = pd.DataFrame(
        {"Close": [100.0, float("nan"), 200.0], "Volume": [10.0, 20.0, float("nan")]},
        index=pd.to_datetime(["2021-10-24", "2023-10-24", "2026-10-23"], utc=True),
    )
    ticker = Mock()
    ticker.history.return_value = frame
    ticker.get_history_metadata.return_value = {
        "regularMarketPrice": 205.0, "previousClose": 200.0,
        "currency": "USD", "regularMarketTime": 1792771200,
    }
    ticker.get_info.return_value = {
        "shortName": "Microsoft", "open": 201.0, "dayHigh": 210.0, "dayLow": 199.0,
        "marketCap": 1e12, "trailingPE": 25.0, "trailingEps": 8.0, "beta": 1.1,
        "preMarketPrice": 206.0, "postMarketPrice": 207.0,
    }
    monkeypatch.setattr(finance.yf, "Ticker", Mock(return_value=ticker))
    return ticker


def test_five_year_history_and_fundamentals(ticker):
    result = finance.fetch_snapshot("MSFT", "5Y")
    ticker.history.assert_called_once_with(
        period="5y", interval="1wk", auto_adjust=False, actions=False,
        raise_errors=True, timeout=20,
    )
    assert len(result["chart"]["t"]) == 2
    assert result["chart"]["t"][-1] - result["chart"]["t"][0] >= 4.99 * 365 * 86400
    assert result["chart"]["c"] == [100.0, 200.0]
    assert result["chart"]["v"] == [10.0, None]
    assert result["quote"]["regularMarketOpen"] == 201
    assert result["quote"]["marketCap"] == 1e12
    assert result["quote"]["epsTrailingTwelveMonths"] == 8
    assert result["quote"]["regularMarketChange"] == 5
    assert result["quote"]["regularMarketChangePercent"] == 2.5
    assert result["quote"]["postMarketPrice"] == 207
    assert result["beta"] == 1.1
    assert result["market_open"] is None
    json.dumps(result, allow_nan=False)


@pytest.mark.parametrize("chart_range,period,interval", [
    ("1D", "1d", "5m"), ("5D", "5d", "30m"), ("1M", "1mo", "1d"),
    ("3M", "3mo", "1d"), ("1Y", "1y", "1d"),
])
def test_range_contract(ticker, chart_range, period, interval):
    finance.fetch_snapshot("MSFT", chart_range)
    assert ticker.history.call_args.kwargs["period"] == period
    assert ticker.history.call_args.kwargs["interval"] == interval


def test_history_survives_fundamentals_failure_with_warning(ticker):
    ticker.get_info.side_effect = RuntimeError("Provider rejected request")
    result = finance.fetch_snapshot("MSFT", "5Y")
    assert len(result["chart"]["c"]) == 2
    assert result["quote"]["regularMarketPrice"] == 205
    assert result["quote"]["marketCap"] is None
    assert any("Company statistics unavailable" in warning for warning in result["warnings"])
    assert any("marketCap" in warning for warning in result["warnings"])


def test_missing_history_or_quote_is_not_faked(ticker):
    ticker.history.return_value = pd.DataFrame()
    with pytest.raises(ValueError, match="No market history"):
        finance.fetch_snapshot("MSFT", "5Y")
    ticker.history.return_value = pd.DataFrame({"Close": [1.0]}, index=pd.to_datetime(["2026-10-23"], utc=True))
    ticker.get_history_metadata.return_value = {}
    ticker.get_info.return_value = {}
    with pytest.raises(ValueError, match="No current quote"):
        finance.fetch_snapshot("MSFT", "1D")


def test_provider_failures_propagate_and_invalid_requests_do_not_fetch(ticker):
    ticker.history.side_effect = TimeoutError("Timed out")
    with pytest.raises(TimeoutError):
        finance.fetch_snapshot("MSFT", "5Y")
    ticker.history.reset_mock()
    for symbol, chart_range in [("https://example.com", "5Y"), ("MSFT", "99Y"), ("msft", "1D")]:
        with pytest.raises(ValueError):
            finance.fetch_snapshot(symbol, chart_range)
    ticker.history.assert_not_called()


def test_non_finite_and_boolean_values_are_not_quotes():
    for value in [float("nan"), float("inf"), True, "5", None]:
        assert finance.number(value) is None
    assert finance.number(0) == 0


def test_zero_previous_close_does_not_create_infinite_percent(ticker):
    ticker.get_history_metadata.return_value["previousClose"] = 0
    result = finance.fetch_snapshot("MSFT", "5Y")
    assert result["quote"]["regularMarketChangePercent"] is None
    json.dumps(result, allow_nan=False)


def test_range_start_close_is_not_used_as_daily_previous_close(ticker):
    ticker.get_info.side_effect = RuntimeError("Fundamentals unavailable")
    ticker.get_history_metadata.return_value.pop("previousClose")
    ticker.get_history_metadata.return_value["chartPreviousClose"] = 100
    result = finance.fetch_snapshot("MSFT", "5Y")
    assert result["quote"]["regularMarketPreviousClose"] is None
    assert result["quote"]["regularMarketChange"] is None
    assert result["quote"]["regularMarketChangePercent"] is None


def test_datetime_quote_age_and_regular_session_status(ticker, monkeypatch):
    monkeypatch.setattr(finance.time, "time", lambda: 1792760400)
    metadata = ticker.get_history_metadata.return_value
    metadata["regularMarketTime"] = pd.Timestamp(1792760340, unit="s", tz="UTC")
    metadata["currentTradingPeriod"] = {"regular": {
        "start": pd.Timestamp(1792760000, unit="s", tz="UTC"),
        "end": pd.Timestamp(1792760600, unit="s", tz="UTC"),
    }}
    result = finance.fetch_snapshot("MSFT", "5Y")
    assert result["quote_age"] == 60
    assert result["market_open"] is True
    monkeypatch.setattr(finance.time, "time", lambda: 1792760700)
    assert finance.fetch_snapshot("MSFT", "5Y")["market_open"] is False
    metadata["currentTradingPeriod"] = None
    assert finance.fetch_snapshot("MSFT", "5Y")["market_open"] is None


def test_cache_deduplicates_requests_bounds_results_and_expires(monkeypatch):
    clock = [0]
    monkeypatch.setattr(cache_module, "monotonic", lambda: clock[0])
    calls = []

    async def fetch(symbol, chart_range):
        calls.append((symbol, chart_range))
        await asyncio.sleep(0)
        return {"symbol": symbol, "quote_age": 10}

    async def run():
        cache = cache_module.MarketCache(fetch, ttl=300, limit=2)
        results = await asyncio.gather(cache.get("MSFT", "5Y"), cache.get("MSFT", "5Y"))
        assert len(calls) == 1
        assert results[0]["interval"] == 300
        clock[0] = 20
        assert (await cache.get("MSFT", "5Y"))["quote_age"] == 30
        clock[0] = 301
        await cache.get("MSFT", "5Y")
        assert len(calls) == 2
        await cache.get("AAPL", "1Y")
        await cache.get("OTHER", "1Y")
        assert len(cache.cache) == 2
        assert ("MSFT", "5Y") not in cache.cache
    asyncio.run(run())


def test_cache_does_not_cache_failures_and_allows_retry():
    calls = []

    async def fetch(*key):
        calls.append(key)
        if len(calls) == 1:
            raise ValueError("Yahoo unavailable")
        return {"quote_age": None}

    async def run():
        cache = cache_module.MarketCache(fetch)
        with pytest.raises(ValueError, match="Yahoo unavailable"):
            await cache.get("MSFT", "5Y")
        assert not cache.pending
        assert not cache.cache
        assert (await cache.get("MSFT", "5Y"))["quote_age"] is None
    asyncio.run(run())


def test_cache_limits_concurrent_downloads_and_pending_work():
    async def run():
        release = asyncio.Event()
        started = []

        async def fetch(symbol, chart_range):
            started.append(symbol)
            await release.wait()
            return {"quote_age": None}

        cache = cache_module.MarketCache(fetch, limit=3)
        tasks = [asyncio.create_task(cache.get(str(i), "5Y")) for i in range(3)]
        for _ in range(4):
            await asyncio.sleep(0)
        assert len(started) == 2
        with pytest.raises(ValueError, match="busy"):
            await cache.get("FOURTH", "5Y")
        release.set()
        await asyncio.gather(*tasks)
        assert len(started) == 3
    asyncio.run(run())


def test_manifest_and_setup_translations():
    folder = ROOT / "custom_components" / "mushroom_addition_market"
    manifest = json.loads((folder / "manifest.json").read_text())
    assert manifest["domain"] == "mushroom_addition_market"
    assert manifest["config_flow"] is True
    assert manifest["requirements"] == ["yfinance==1.7.0"]
    assert json.loads((folder / "strings.json").read_text()) == json.loads(
        (folder / "translations" / "en.json").read_text()
    )


@pytest.fixture
def component(monkeypatch):
    """Exercise our HA adapter against a small mocked HA API contract."""
    def websocket_command(schema):
        def decorate(handler):
            handler.request_schema = vol.Schema(schema)
            return handler
        return decorate

    websocket = SimpleNamespace(
        websocket_command=websocket_command, async_response=lambda handler: handler,
        async_register_command=Mock(),
    )
    for name in ["homeassistant", "homeassistant.components", "homeassistant.config_entries", "homeassistant.core"]:
        monkeypatch.setitem(sys.modules, name, ModuleType(name))
    sys.modules["homeassistant.components"].websocket_api = websocket
    sys.modules["homeassistant.config_entries"].ConfigEntry = object
    sys.modules["homeassistant.core"].HomeAssistant = object
    spec = importlib.util.spec_from_file_location(
        "market_contract", ROOT / "custom_components" / "mushroom_addition_market" / "__init__.py"
    )
    module = importlib.util.module_from_spec(spec)
    monkeypatch.setitem(sys.modules, "market_contract", module)
    spec.loader.exec_module(module)
    return module


def test_websocket_request_schema(component):
    schema = component.market_data.request_schema
    assert schema({"type": "mushroom_addition_market/data", "symbol": "MSFT", "range": "5Y"})["interval"] == 300
    for changes in [{"symbol": "https://example.com"}, {"range": "ALL"},
                    {"symbol": "MSFT\n"}, {"interval": 1}]:
        with pytest.raises(vol.Invalid):
            schema({"type": "mushroom_addition_market/data", "symbol": "MSFT", "range": "5Y", **changes})


def test_websocket_setup_fetch_response_and_unload(component):
    result = {"symbol": "MSFT", "quote_age": None, "quote": {"regularMarketPrice": 205}}
    hass = SimpleNamespace(data={}, async_add_executor_job=AsyncMock(return_value=result))
    connection = SimpleNamespace(send_result=Mock(), send_error=Mock())
    msg = {"id": 1, "symbol": "MSFT", "range": "5Y"}

    async def run():
        assert await component.async_setup_entry(hass, object())
        component.websocket_api.async_register_command.assert_called_once_with(hass, component.market_data)
        await component.market_data(hass, connection, msg)
        hass.async_add_executor_job.assert_awaited_once_with(component.fetch_snapshot, "MSFT", "5Y")
        assert connection.send_result.call_args.args[0] == 1
        assert connection.send_result.call_args.args[1]["quote"]["regularMarketPrice"] == 205
        assert not connection.send_error.called
        assert await component.async_unload_entry(hass, object())
        await component.market_data(hass, connection, msg)
        assert connection.send_error.call_args.args[1] == "not_loaded"
    asyncio.run(run())


def test_websocket_failure_returns_error_not_success(component, caplog):
    hass = SimpleNamespace(data={}, async_add_executor_job=AsyncMock(side_effect=TimeoutError("Provider timed out")))
    connection = SimpleNamespace(send_result=Mock(), send_error=Mock())

    async def run():
        await component.async_setup_entry(hass, object())
        await component.market_data(hass, connection, {"id": 2, "symbol": "MSFT", "range": "5Y"})
        assert connection.send_error.call_args.args[:2] == (2, "market_data_unavailable")
        assert not connection.send_result.called
    asyncio.run(run())
    assert "Provider timed out" in caplog.text
