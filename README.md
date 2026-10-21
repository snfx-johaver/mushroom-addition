# Mushroom Addition

[![CI](https://github.com/snfx-johaver/mushroom-addition/actions/workflows/ci.yml/badge.svg)](https://github.com/snfx-johaver/mushroom-addition/actions/workflows/ci.yml)

Your dashboard called. It wants fewer YAML headaches and a little more fun(gus).

**28 Home Assistant dashboard cards, with visual editors, theme-aware styling
and support for all 33 Mushroom languages.** Energy, media, rooms, batteries,
graphs, remotes and more. Pick a card, pick your entities, enjoy your dashboard.
YAML is still welcome; it just isn't compulsory.

![Illustrated preview of Mushroom Addition cards](docs/assets/cards-preview.svg)

A big thank-you to **[Mushroom](https://github.com/piitaya/lovelace-mushroom)**
for the roots. We grew a few more caps. This is an independent companion project,
not an official Mushroom release, and does not require Mushroom to be installed.

## Install with HACS

Mushroom Addition is a **Dashboard** plugin, not a backend integration.
It requires **Home Assistant 2026.10.2 or newer** and a supported modern browser.

[Open Mushroom Addition in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=snfx-johaver&repository=mushroom-addition&category=plugin)

Until it is accepted into the default HACS catalog:

1. In HACS, open **Custom repositories**.
2. Add `https://github.com/snfx-johaver/mushroom-addition` with type **Dashboard**.
3. Install **Mushroom Addition** and reload your browser.
4. Add a dashboard card and search for **Mushroom Addition**.

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

Cards use your Home Assistant theme and language. Your custom names, entity IDs
and action values stay untouched. Some cards need their corresponding sensors
or integrations; installing a card does not install its data source.

See the **[card catalog](docs/CATALOG.md)** for the complete list and source
references, or the [changelog](CHANGELOG.md) for what's new.

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

Include tests for behavior changes. Update `src/catalog.ts` and run
`npm run docs:catalog` when changing the catalog. Use synthetic entities and
sanitized fixtures, not live household screenshots or raw audit exports.

For implementation details, see the [parity matrix](docs/PARITY_MATRIX.md) and
[visual specification](docs/VISUAL_SPEC.md). All 33 language catalogs have
complete message coverage; independent native-speaker review is still welcome.

## License

[MIT](LICENSE). Required attribution is retained in
[Third-party notices](THIRD_PARTY_NOTICES.md). Mushroom and Home Assistant are
independent projects and trademarks of their respective owners.
