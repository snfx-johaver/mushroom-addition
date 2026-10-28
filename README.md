# Mushroom Addition

[![CI](https://github.com/snfx-johaver/mushroom-addition/actions/workflows/ci.yml/badge.svg)](https://github.com/snfx-johaver/mushroom-addition/actions/workflows/ci.yml)
[![Latest release](https://img.shields.io/github/v/release/snfx-johaver/mushroom-addition)](https://github.com/snfx-johaver/mushroom-addition/releases/latest)

Your dashboard called. It wants fewer YAML headaches and a little more fun(gus).

**32 Home Assistant dashboard cards, with visual editors and theme-aware styling.**
Energy, media, rooms, batteries, graphs, remotes and more.
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
Not every card is pictured: see the [full catalog](docs/CATALOG.md) for all 32.

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

## Using the cards

Choose your entities and configure the card in the visual editor. Layout,
colors, information and actions are available where supported. Picker previews
prefer compatible entities already in your Home Assistant instance.

Shared visual editors reuse their form schemas across unrelated state updates,
while continuing to pass live Home Assistant data to selectors. Configuration,
language and relevant media-attribute changes refresh the cached schemas.

Cards use your Home Assistant theme and language. Your custom names, entity IDs
and action values stay untouched. Some cards need their corresponding sensors
or integrations; installing a card does not install its data source.

The original 27 cards support all 33 Mushroom languages. Stock-specific labels
and the four expanded NAS cards currently use English fallbacks.

See the **[card catalog](docs/CATALOG.md)** for the complete list and source
references, or the [changelog](CHANGELOG.md) for what's new.

Tried it on your setup? Share your dashboard in the
[community thread](https://community.home-assistant.io/t/mushroom-addition-integration-more-fungus-to-enjoy/1030164).
Found a rough edge or have an idea for another card?
[Open an issue or feature request](https://github.com/snfx-johaver/mushroom-addition/issues)
and help grow the next batch.

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
Data backend)** in Context after installing the optional backend. This retrieves
prices from Yahoo, including **5Y**, rather than relying on recorder retention.
It also retrieves available company statistics such as opening price, market
cap, EPS, P/E and beta, plus trading volume and SMA/EMA overlays.
Your existing Yahoo Finance sensor plugin can remain installed, but does not
provide this history endpoint by itself. See **[Stock setup](docs/STOCK.md)** for
backend installation, metric overrides and provider limitations.

The optional **Stock Market Deluxe integration** source supports its quote
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
