# Mushroom Addition

[![CI](https://github.com/snfx-johaver/mushroom-addition/actions/workflows/ci.yml/badge.svg)](https://github.com/snfx-johaver/mushroom-addition/actions/workflows/ci.yml)
[![Latest release](https://img.shields.io/github/v/release/snfx-johaver/mushroom-addition)](https://github.com/snfx-johaver/mushroom-addition/releases/latest)

Your dashboard called. It wants fewer YAML headaches and a little more fun(gus).

**40 Home Assistant dashboard cards, with visual editors and theme-aware styling.**
Air quality, animated weather, lights, appliances, energy, media, rooms, NAS and more.
Pick a card, pick your entities, enjoy your dashboard.
YAML is still welcome; it just isn't compulsory.

[![Open Mushroom Addition in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=snfx-johaver&repository=mushroom-addition&category=plugin)

[Browse the cards](docs/CATALOG.md) / [Community post](https://community.home-assistant.io/t/mushroom-addition-integration-more-fungus-to-enjoy/1030164) / [Bugs and ideas](https://github.com/snfx-johaver/mushroom-addition/issues)

![Mushroom Addition: Home Assistant dashboard cards with visual editors](docs/assets/project-banner.svg)

A big thank-you to **[Mushroom](https://github.com/piitaya/lovelace-mushroom)**
and its contributors for the roots: clean design, thoughtful controls and
editors that make dashboards a pleasure to build. We grew a few more caps.
This is an independent companion project, not an official Mushroom release,
and does not require Mushroom to be installed.

## A little more fun(gus), in pictures

Real Home Assistant dashboards, shared in the
[community post](https://community.home-assistant.io/t/mushroom-addition-integration-more-fungus-to-enjoy/1030164).
Click a screenshot for a closer look.

| Everyday controls and media | Around the house |
|---|---|
| [![Alarm, printer, tablet, washer, console and media controls on a real Home Assistant dashboard](https://community-assets.home-assistant.io/original/4X/2/2/b/22b18653285c52a31ca44ff12cc847fbadee713f.png)](https://community-assets.home-assistant.io/original/4X/2/2/b/22b18653285c52a31ca44ff12cc847fbadee713f.png) | [![NAS, speedtest, scenes, plants, pollen, trash and astronomy cards on a real Home Assistant dashboard](https://community-assets.home-assistant.io/original/4X/b/b/7/bb7e904bb6d1b5e68daeec7d6024f78ed833a012.png)](https://community-assets.home-assistant.io/original/4X/b/b/7/bb7e904bb6d1b5e68daeec7d6024f78ed833a012.png) |
| Printer ink, laundry progress, playback and a remote within reach. | Network stats, scene shortcuts and the small things that keep a home ticking. |
| **Rooms, graphs and energy** | **NAS dashboards** |
| [![Room controls, energy flows and history graphs on a real Home Assistant dashboard](https://community-assets.home-assistant.io/original/4X/0/2/6/026ac451af58e280b008f4a834bb261bd43225c5.png)](https://community-assets.home-assistant.io/original/4X/0/2/6/026ac451af58e280b008f4a834bb261bd43225c5.png) | [![Storage, Docker containers and unified layouts from the earlier NAS dashboard](https://community-assets.home-assistant.io/original/4X/c/7/0/c70fa96613cef06f8915c2639d8a013a15f30eb8.png)](https://community-assets.home-assistant.io/original/4X/c/7/0/c70fa96613cef06f8915c2639d8a013a15f30eb8.png) |
| See how your rooms and energy are doing, with history a glance away. | Storage, drive health and containers together, without jumping between pages. |

These are real setups, not mockups; some cards are only partially configured.
The NAS image is from the earlier dashboard whose layouts are now included.
Not every card is pictured: see the [full catalog](docs/CATALOG.md) for all cards.

## What's new in 0.7

- **Energy cards (0.7.2):** Energy Plan, Energy Insights & Purchases and Energy Log,
  with shared Mushroom presentation, native visual editors and the shadow option.
  Smart Saving and existing energy cards remain supported.
- **Languages:** all 40 cards and visual editors now use the 33 Mushroom language
  catalogs, including NAS, stock data, Smart Saving and Weather Advanced.
  Version 0.7.1 completes the translation audit for the 0.7 release.
- **Air Quality:** compact, reorderable sensor readings, editable thresholds and a
  changing quality icon with Good/Fair/Poor text. Hide the header or quality badge
  independently.
- **Weather Advanced:** animated skies, forecasts, clocks and sensor overrides,
  with visual controls for content, layout, animation quality and interactions.
- **Light Area Card:** standard Mushroom bulb colours and brightness sliders,
  individual group-light controls and improved narrow-card scene coverflow.
- **Appliances:** readable program names, saved same-device entity mappings,
  supported start/pause/stop actions, three optional extra controls and compact
  settings/diagnostics that expand beside the status indicators. Power and program
  selection share a row.
- **Privacy and editor polish:** camera privacy selectors on both Area cards,
  visual additional pollen sensors, and dropdowns that follow light/dark themes.

Existing dashboard card types and configurations remain supported. Install
**v0.7.4** through HACS, then reload every dashboard browser. If you have been
using an unreleased hotfix, return to the single HACS-managed resource after the
update; do not load both bundles.

See the [changelog](CHANGELOG.md#072---2026-11-06) for the new energy cards,
[translation update](CHANGELOG.md#071---2026-11-02) and
[0.7.0 release details](CHANGELOG.md#070---2026-11-02).

## Air Quality

`custom:mushroom-addition-air-quality` shows compact icon-over-value sensor
columns. Add, reorder, hide or remove readings in **Features**. Each reading has a
sensor selector, tooltip label, icon, automatic or fixed color, display unit,
decimal precision and editable high/low thresholds. Reading buttons open the
corresponding sensor's more-info dialog. Mould risk is a humidity-based indication,
not a mould measurement.

**Content** independently controls the header, title, header icon and upper-right
quality indicator, which shows both the status icon and its text. Name,
primary/secondary information and header interactions
use the shared Mushroom presentation and actions.

Select an optional qualitative air-quality sensor in **Context** for Good,
Fair/Moderate, Poor or Very poor/Unhealthy states. Without it, the indicator uses
the worst available CO₂, PM2.5, VOC or radon reading. Temperature, humidity,
pressure and custom readings do not determine overall air quality. A numeric AQI
sensor is not interpreted as a qualitative state; missing/unsupported states show
Unknown. This is a configurable indoor indication, not a regulatory AQI or
health assessment.

Threshold units are always °C, %, ppm CO₂, µg/m³ PM2.5, ppb VOC, Bq/m³ radon and
hPa pressure; custom thresholds use the entity's native units. Fahrenheit/Kelvin,
mg/m³ particles, ppm VOC, pCi/L radon and common pressure units are converted for
classification without changing the displayed reading. Unsupported units retain
their value but have no automatic rating. VOC mass concentrations cannot be
converted to ppb without knowing the compound. Display-unit overrides change the
suffix only, not the value. Unavailable readings display a dash.

## Install with HACS

Mushroom Addition installs through HACS as a **Dashboard** plugin.
An optional, separately installed market-data backend is available for Stock
Card users who want Yahoo historical prices; other cards do not need it.
It requires **Home Assistant 2026.10.2 or newer** and a supported modern browser.

**Now in the default HACS store.** No custom repository needed.

[![Open Mushroom Addition in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=snfx-johaver&repository=mushroom-addition&category=plugin)

1. Click the button above, or open **HACS** and search for **Mushroom Addition**.
2. Open it and choose **Download**.
3. Reload your browser.
4. Edit a dashboard, add a card and search for **Mushroom Addition**.

Already using a manual copy? Remove its old dashboard resource after installing
through HACS, keeping only the HACS-managed resource below. Your existing card
configurations can stay as they are. Reload every open dashboard browser.

If HACS does not register the resource automatically, add this URL as a
**JavaScript module** under **Settings > Dashboards > Resources**:

```text
/hacsfiles/mushroom-addition/mushroom-cards-addition.js
```

Keep only one resource entry. The older JavaScript filename and existing card
tags are intentional: your installed dashboards should keep working.

For manual installation, download `mushroom-cards-addition.js` from the
[latest release](https://github.com/snfx-johaver/mushroom-addition/releases/latest),
put it in `config/www/community/mushroom-addition/`, and register
`/local/community/mushroom-addition/mushroom-cards-addition.js` as a module.

For an unreleased hotfix, use a separate directory outside HACS-managed
`www/community/` and replace the existing resource entry with its `/local/`
URL; do not load both copies. HACS redownloads can overwrite files in its
managed directory with the published release. Return to the HACS resource
after installing a release that includes the hotfix.

## Using the cards

Area Advanced and Area Mushroom expose **Camera privacy entity** under Content.
Select a switch, input boolean or binary sensor: the camera is shown only while
that entity is `off`. Privacy `on`, unknown, unavailable or missing uses the
compact room view with its controls instead of mounting a camera. Clearing the
selector restores the configured camera behavior. This is a dashboard display
guard; it does not change the camera's own recording or privacy settings.

Choose your entities and configure the card in the visual editor. Layout,
colors, information and actions are available where supported. Picker previews
prefer compatible entities already in your Home Assistant instance.

Shared visual editors reuse their form schemas across unrelated state updates,
while continuing to pass live Home Assistant data to selectors. Configuration,
language and relevant media-attribute changes refresh the cached schemas.

Cards use your Home Assistant theme and language. Your custom names, entity IDs
and action values stay untouched. Some cards need their corresponding sensors
or integrations; installing a card does not install its data source.

All 40 cards and their visual editors use the 33 Mushroom language catalogs.
This includes stock-specific labels, the four NAS cards, Smart Saving and
Weather Advanced. Language and script variants follow Home Assistant; saved
custom names and entity values are preserved. Technical identifiers, brands,
upstream error details and user-provided text are not translated.

See the **[card catalog](docs/CATALOG.md)** for the complete list and source
references, or the [changelog](CHANGELOG.md) for what's new.

Tried it on your setup? Share your dashboard in the
[community thread](https://community.home-assistant.io/t/mushroom-addition-integration-more-fungus-to-enjoy/1030164).
Found a rough edge or have an idea for another card?
[Open an issue or feature request](https://github.com/snfx-johaver/mushroom-addition/issues)
and help grow the next batch.

### Light Area Card colours

Light icons and brightness controls follow Mushroom's colour normalization.
Brightness uses a solid fill over a 20%-tinted track without a thumb. Enabling
**Use light color** follows the bulb colour; otherwise the configured icon colour
or Mushroom's theme light colour is used. The same rules apply in both themes.

### Washer-Dryer Card

The Features editor's **Settings & diagnostics entities** selector adds native
Home Assistant controls beneath the card. They expand from an icon-only chevron
beside the status indicators and remain collapsed by default.

New cards start with all entity selectors empty. Selecting the primary entity in
Context fills unambiguous, available matching entities from the same device into
empty Features fields. These mappings are saved in the card configuration; normal
state updates, reopening the editor, and clearing an individual field do not
trigger discovery. Existing manual selections are preserved. Missing or ambiguous
matches remain empty for you to select, and devices without registry information
are never matched by unrelated entity names.

Program selection displays Home Assistant's translated option names when
available, with readable names for raw integration identifiers. Service calls
always use the original option value.
The configured current program stage also displays its live state (such as
Running or Ready) in the status row, independently of the primary power entity
and Mushroom heading settings.
Power and progress appear together at the top right with small power/progress
icons. Native dropdowns use Home Assistant's light/dark theme for both their
closed control and popup options.
Features also offers three optional custom entity buttons for extra appliance
functions. Each has an entity, optional name/icon, and tap-action override.
Switches, input booleans, lights and fans toggle by default; buttons/input buttons
use their press service; other domains open more-info. Missing or unavailable
entities disable their button. These custom selections are never auto-discovered.
For example, select the appliance's Child lock switch to toggle it and see its
live On/Off state directly on the button.
Power is blue while On. Start/Stop/Pause use explicit configured actions when
provided; otherwise supported same-device program buttons are used. Home Connect
also supports Start selected program. Default control mappings are cached by
registry/device/service snapshot, not scanned on each state update. Legacy
`action: none` placeholders use these supported defaults. An unsupported Pause
remains disabled with an explanation; the card never substitutes power-off for
pause or stop.

### Stock Card

Choose **Mushroom Addition: Stock Card** in the picker. Its visual editor uses
the same Context, Content, Layout, Interactions and Features sections as the
other cards; no separate settings popup or YAML is required.

The default **Home Assistant entities** source works with any stock provider
that exposes sensors in HA. Select the main price sensor, then map optional
metrics to its attributes or to separate sensors under Features. Each metric
has an entity override and an attribute field: an empty attribute reads the
selected entity's state. Price defaults to the main entity's state; other
metrics initially look for standard quote attributes (for example,
`regularMarketChange` and `marketCap`). Unavailable metrics show `--`, not zero.
Currency can be read from the main entity or overridden in the editor.

Entity-mode charts reuse Graph Advanced and Home Assistant recorder history,
including configured price attributes. Chart ranges represent elapsed time,
not trading sessions, and cannot show data older than recorder retention.
The card does not fetch external APIs, store API keys, or install a provider.

For actual market history, select **Yahoo Finance (Mushroom Addition Market
Data)** in Context after installing the optional backend. This retrieves
prices from Yahoo, including **5Y**, rather than relying on recorder retention.
It also retrieves available company statistics such as opening price, market
cap, EPS, P/E and beta, plus trading volume and SMA/EMA overlays.
Your existing Yahoo Finance sensor plugin can remain installed, but does not
provide this history endpoint by itself. See **[Stock setup](docs/STOCK.md)** for
backend installation, metric overrides and provider limitations.

The optional **Stock Market Deluxe** source supports its integration's quote
and historical-price WebSocket API, including volume and SMA/EMA chart overlays.
For that source only, separately install and configure
[Stock Market Deluxe](https://github.com/codemonkey2k5/stock-market-deluxe-card).
Its Python integration handles Yahoo requests, caching, rate limits and stock
sensors. The Dashboard bundle does not bundle or rename that integration.
This is a new Mushroom-style frontend, not a copy of its UI.
Holdings and display preferences are saved in the dashboard configuration.

### NAS dashboard cards and migration

Four additional cards provide **NAS - Server Overview**, **NAS - Storage and
Disks**, **NAS - Docker Containers**, and **NAS - Unified Dashboard**.
The existing **NAS** card remains unchanged. Synology DSM, QNAP and manually
mapped entities are supported; Portainer is optional.

They are included in the main Mushroom Addition module. When migrating from
SNFX Synology Cards, remove its old Dashboard resource(s) and HACS frontend
package/custom repository after installing the integrated bundle, then fully
reload every browser. Keep the NAS/Portainer backend integrations and existing
dashboard YAML: `synology-*` and `snfx-*` card/editor tags remain hidden
compatibility aliases. Do not load both frontend bundles.

See [NAS configuration and migration](docs/NAS.md) for supported settings,
examples and resource paths.

## Troubleshooting

- **Missing card or old version?** Redownload in HACS, then hard-refresh the
  browser. For manual installs, change the resource's `?v=` cache token.
- **Unavailable entity?** Check that it exists and is accessible to your user.
- **Missing editor controls?** Check your Home Assistant version and that the
  resource is registered as a JavaScript module.

[Report a bug](https://github.com/snfx-johaver/mushroom-addition/issues).
Please keep household screenshots and personal information out of reports.

## Energy cards

Three additional energy cards are included in the existing bundle and card
picker; no additional resource is needed.

| Card | Configuration type | Purpose |
| --- | --- | --- |
| [Energy Plan](docs/ENERGY_PLAN.md) | `custom:mushroom-addition-energy-plan` | Configurable aligned timeline for supplied prices, solar, battery, grid and consumer forecasts. |
| [Energy Insights & Purchases](docs/ENERGY_INSIGHTS.md) | `custom:mushroom-addition-energy-insights` | Measured consumption and interval-priced purchases, with a separate view for supplied future purchase allocations. |
| [Energy Log](docs/ENERGY_LOG.md) | `custom:mushroom-addition-energy-log` | Entity-backed events with category filters, date grouping and source details. |

All three use the shared Mushroom presentation, theme-aware colors, shadow
option, header actions and Context, Content, Layout, Interactions and Features
editor sections. Repeatable rows, metrics, periods, consumers, sources, categories
and field mappings use Home Assistant's native structured object selectors.
These editors require HA 2026.11 / frontend 20261028.4 or newer.
Built-in labels use all 33 language catalogs; custom names and source text are
preserved.

The cards display supplied data; they do not generate forecasts, optimize
schedules or control devices. Missing, invalid and stale sources are shown
explicitly. Picker defaults select compatible sources when available; otherwise
configure sources using the contracts in each card's documentation.

**Existing cards are preserved.** Energy Plan overlaps with Smart Saving's
forecast display, but has a different configuration and a customizable aligned
timeline. It does not replace or migrate Smart Saving dashboards. Energy Insights
adds measured accounting rather than duplicating Home Energy Management or Buy
and Sell; Energy Log adds event history rather than duplicating Entityworkflow.

### Smart Saving and Energy Entityworkflow

Both cards are included in the existing bundle and picker; do not install a
second energy-card resource. They use the same Context, Content, Layout,
Interactions and lazily mounted Features editor sections as other cards.
Name and Primary/Secondary information use the shared Mushroom presentation.
Header actions use the usual tap, hold and double-tap settings.

**Smart Saving** displays published electricity prices, measured battery level,
timestamped forecasts, and configured purchase, sale, EV and solar tracks.
It never synthesizes missing prices or forecasts and does not execute plans.
Select the price sensor in Context, the visible horizon in Layout, and source
attribute/JSON mappings, battery, tracks, summary and periods in Features.
Only EUR/kWh and ct/kWh conversions are supported.

```yaml
type: custom:mushroom-addition-smart-saving
name: Smart Saving
entity: sensor.example_prices
visibleHours: 36
price:
  entity: sensor.example_prices
  path: prices
  startField: start
  endField: end
  priceField: price
  sourceUnit: EUR/kWh
  displayUnit: ct/kWh
```

**Energy Entityworkflow** displays grouped entities and directed relationships
in sequential or graph layouts. Entity rows open more-info, never execute
workflow steps. Groups, nodes, rows and relationships are editable under
Features; invalid IDs or references show errors rather than saving broken
configurations. See [the full workflow schema and examples](docs/ENERGY_WORKFLOW.md).

```yaml
type: custom:mushroom-addition-energy-entityworkflow
name: Energy Entityworkflow
presentation: sequential
nodes:
  - id: source
    label: Available energy
    entities:
      - entity: sensor.example_available_energy
  - id: proposal
    label: Proposed purchase
    entities:
      - entity: sensor.example_purchase_plan
relations:
  - from: source
    to: proposal
    label: informs
```

Replace the synthetic example IDs with your own entities. The source `title`
and Smart Saving `subtitle` are accepted as Name and secondary text fallbacks;
the shared editor does not expose duplicate title fields.

## Weather Advanced

The animated scene stays directly below its content-sized Mushroom heading,
including in fixed-height dashboard sections. Mushroom layout controls the heading;
the separate scene layout setting selects the default or minimal weather view.
Interactions exposes tap, hold and double-tap actions in the visual editor.

**Weather Advanced** is included in the main resource and card picker as
`custom:mushroom-addition-weather-advanced`. No additional weather-card resource
is needed. It retains animated modern/classic skies, drifting clouds, sun/moon,
rain, snow, lightning, fog, wind, glass raindrops and optional northern lights.

The visual editor exposes every supported setting: select a weather entity in
**Context**, use the normal Mushroom Name, Primary/Secondary information and
icon settings in **Content**, and configure the scene layout, dimensions,
graphics, colors and animation settings in **Layout**. **Interactions** controls
tap, hold and double-tap for both the heading and scene. **Features** contains
weather details, hourly/daily forecasts (including temperature charts/bars and
wind), clock/date controls, language and optional sensor overrides. Related
sensor overrides and minimum-temperature attribute selection stay together.

Scene options are stored under `weather`, separate from the Mushroom heading's
`layout`. For example:

```yaml
type: custom:mushroom-addition-weather-advanced
entity: weather.example_home
name: Weather Advanced
weather:
  layout: default
  visual_style: modern
  animation_quality: medium
  show_animations: true
  show_hourly_forecast: true
  show_daily_forecast: true
  show_clock: true
  show_date: true
```

Forecast availability depends on the selected integration; unsupported forecast
types are not requested. Sensor overrides fall back to the weather entity when
unavailable. Animations pause offscreen or in hidden tabs and become still frames
when the operating system requests reduced motion. Medium quality is the default;
high and low remain editable. The scene retains high-contrast weather artwork
while its heading uses the dashboard's Mushroom theme.

## Development

Use **Node.js 24 LTS or 26+**.

```sh
npm ci
npm run validate
```

Validation covers linting, types, catalog consistency, translations, tests and
the production build. The bundle is `dist/mushroom-cards-addition.js`.
The optional Python backend has a separate CI test job; its local test command
and dependencies are documented in [Stock setup](docs/STOCK.md).

Include tests for behavior changes. Update `src/catalog.ts` and run
`npm run docs:catalog` when changing the catalog. Use synthetic entities and
sanitized fixtures, not live household screenshots or raw audit exports.

For implementation details, see the [parity matrix](docs/PARITY_MATRIX.md) and
[visual specification](docs/VISUAL_SPEC.md). All 33 language catalogs have
complete message coverage; independent native-speaker review is still welcome.

## Roots and references

Good mushrooms don't grow in a vacuum. Thanks to these projects for the
design ideas, configuration references and behavior that helped this one grow:

| Project | Contribution |
|---|---|
| [Mushroom](https://github.com/piitaya/lovelace-mushroom) | Visual style, presentation conventions and translation guidance. |
| [UI Lovelace Minimalist](https://github.com/UI-Lovelace-Minimalist/UI) | Card concepts and YAML references for Battery, Room, Scenes, Trash, Washer, Printer, Plant and more. |
| [Mini Graph Card](https://github.com/kalkih/mini-graph-card) | Mini Graph configuration and chart behavior; see the third-party notices below. |
| [Upcoming Media Card](https://github.com/custom-cards/upcoming-media-card) | Upcoming Media data formats, artwork and media-list features. |
| [TV Card](https://github.com/usernein/tv-card) | Remote controls, touchpad and haptic interaction references. |
| [Pi-hole Card](https://github.com/homeassistant-extras/pi-hole-card) | Pi-hole statistics and blocking-control references. |
| [Home Assistant](https://github.com/home-assistant/frontend) | Native editors, selectors, actions, entity formatting and the Area card used by Advanced Area. |
| [SNFX Synology Cards](https://github.com/snfx-johaver/SNFX-Synology-cards) / [ha-unraid](https://github.com/ruaan-deysel/ha-unraid) | Apache-2.0 NAS server, storage, container and unified dashboard frontend. |

These are references, not a shopping list of required installations.
Mushroom Addition works without the separate custom cards above. Individual
cards still need suitable Home Assistant entities or integrations for their data.

## License

[MIT](LICENSE), except the imported NAS frontend, which remains Apache-2.0.
Required attribution and the NAS license/NOTICE are retained in
[Third-party notices](THIRD_PARTY_NOTICES.md). Mushroom and Home Assistant are
independent projects and trademarks of their respective owners.
