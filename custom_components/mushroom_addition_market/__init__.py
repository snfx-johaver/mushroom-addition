"""Optional historical-market backend for Mushroom Addition."""

import logging

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .cache import MarketCache
from .finance import RANGES, SYMBOL, fetch_snapshot

DOMAIN = "mushroom_addition_market"
LOGGER = logging.getLogger(__name__)


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    async def fetch(symbol, chart_range):
        return await hass.async_add_executor_job(fetch_snapshot, symbol, chart_range)

    hass.data[DOMAIN] = MarketCache(fetch)
    websocket_api.async_register_command(hass, market_data)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    hass.data.pop(DOMAIN, None)
    return True


@websocket_api.websocket_command({
    vol.Required("type"): "mushroom_addition_market/data",
    vol.Required("symbol"): vol.All(str, vol.Match(SYMBOL)),
    vol.Required("range"): vol.In(RANGES),
    vol.Optional("interval", default=300): vol.All(int, vol.Range(min=180, max=86400)),
})
@websocket_api.async_response
async def market_data(hass, connection, msg):
    cache = hass.data.get(DOMAIN)
    if cache is None:
        connection.send_error(msg["id"], "not_loaded", "Set up Mushroom Addition Market Data in Devices & services.")
        return
    try:
        result = await cache.get(msg["symbol"], msg["range"])
    except Exception as error:
        LOGGER.warning("Yahoo market data unavailable for %s: %s", msg["symbol"], error)
        connection.send_error(msg["id"], "market_data_unavailable",
                              f"Yahoo market data unavailable for {msg['symbol']} ({type(error).__name__}). Retry later.")
        return
    connection.send_result(msg["id"], result)
