# Stock Card market data

The Stock Card has three explicitly selected data sources. Installing the
Dashboard plugin does not automatically install a backend or change saved cards.

| Source | Prices and statistics | Chart history |
|---|---|---|
| Home Assistant entities (default) | Any provider's sensors and mapped attributes | HA recorder only; limited by retention |
| Yahoo Finance | Yahoo quotes and available fundamentals; optional sensor overrides | Yahoo market history, including 5Y |
| Stock Market Deluxe | Its separately installed integration's response | Its supported ranges up to 1Y |

## Install the optional Yahoo backend

The existing Yahoo Finance sensor integration can stay installed. It supplies
quotes, not the historical-series endpoint used here. This backend is separate,
original code; it does not modify that integration.

1. Download the source archive for the **same version as your updated card**
   from GitHub, or use a checkout containing `custom_components/mushroom_addition_market`.
2. Copy that entire `mushroom_addition_market` directory to
   `/config/custom_components/mushroom_addition_market/` on your HA host.
   `manifest.json` must be directly inside that directory, not in another nested
   copy. Do not put Python files in `www`.
3. Restart Home Assistant at a convenient time. HA installs the pinned
   `yfinance` dependency. This requires outbound internet access.
4. Under **Settings > Devices & services > Add integration**, add
   **Mushroom Addition Market Data** and confirm the setup screen.
5. Install the matching updated Dashboard JavaScript, reload the browser, and
   edit your Stock Card. In **Context**, choose **Yahoo Finance (Mushroom Addition
   Market Data backend)** and set **Stock symbol** to `MSFT` for Microsoft.
   The symbol may be left empty if the selected main sensor has a `symbol`
   attribute. Symbols are Yahoo tickers, including exchange suffixes where needed.
6. In **Features**, set **Default chart range** to **5Y**. Holdings, volume,
   trends and statistics remain editable in the same standard card editor.

The repository remains a HACS **Dashboard** repository. Adding it as an
Integration repository is not a supported way to install this optional folder.
No Yahoo account, API key, YAML setup or separate Stock Market Deluxe install is
needed for this mode. The backend is optional; removing it does not affect
entity-mode cards or other card types.

## What the backend retrieves

History uses 5-minute samples for 1D, 30-minute samples for 5D, daily samples for
1M/3M/1Y, and weekly samples for 5Y. Prices are closing prices with
`auto_adjust=False`, not dividend-adjusted total returns. Trading gaps and
shorter listing histories are normal. A newly created HA sensor does not limit
Yahoo market history.

Quotes include price, daily change, percentage change, open, high, low, previous
close, volume, market cap, 52-week high/low, P/E, EPS, beta and pre-/after-market
prices **when Yahoo supplies them**. Missing data remains `--`, never a made-up
zero. Daily change can be derived from current price and previous close;
fundamentals cannot be reconstructed from a price chart.

Historical volume and SMA/EMA overlays use the selected chart's samples.
Weekly volume is weekly volume, not current daily volume. SMA/EMA 20 means
20 samples, not always 20 days. Chart dates reflect the actual returned
history, not synthetic five-year points.

Yahoo mode prefers backend values. Under **Features**, entity/attribute mappings
can supplement missing values. An explicit per-metric **entity override** takes
priority over a backend value; leave it empty for Yahoo's value. The attribute
field applies to that sensor, and an empty attribute reads its state.
An unavailable override does not discard a valid backend value. Currency can
be explicitly overridden in the editor. Plain entity mode preserves its existing
mapping behavior and does not call Yahoo.

## Limits, privacy and errors

Only requested stock symbols are sent to Yahoo through `yfinance`; this service
does not read household entities or send dashboard configurations. Requests
use the Home Assistant host, not a public CORS proxy or browser credentials.
Yahoo's data terms apply, and this feature is intended for personal use.
There is no guarantee of real-time prices, complete fundamentals or availability.

Requests are cached for five minutes per symbol/range and shared across cards
and users. Two downloads can run concurrently; cache and pending work are
bounded to 64 entries each. This reduces requests but cannot eliminate provider
rate limits. A card's longer refresh interval is respected. Quote timestamps
may remain at the last trading session when markets are closed.

If historical prices cannot be retrieved, the card shows an error and Retry.
It **does not silently switch to recorder history**. If history works but
fundamentals fail or individual fields are absent, a visible status message
explains this and the chart remains usable.

An `Unknown command` error means the optional backend is not loaded: check the
folder, restart, and add the integration in Devices & services. For provider
errors, check the ticker, internet access and HA logs; retry later if Yahoo is
rate limiting requests. Do not post credentials or private HA logs in issues.

## Backend development

Use Python 3.13+ in an isolated environment:

```powershell
python -m venv .market-venv
.\.market-venv\Scripts\python -m pip install yfinance==1.7.0 pytest==9.0.0 voluptuous==0.15.2
.\.market-venv\Scripts\python -m pytest -q tests\test_market_backend.py
```

The tests use synthetic provider responses and do not contact Yahoo. CI reads
the runtime dependency from the integration manifest. Home Assistant remains
responsible for installing runtime dependencies on its own host.
