# Private vehicle engine

`vehicle-engine.js` is generated from the MIT-licensed
[vehicle-status-card v1.26.1 release](https://github.com/ngocjohn/vehicle-status-card/releases/tag/v1.26.1),
copyright Viet Ngoc. See `LICENSE`; bundled dependency notices remain in the
generated source.

Pinned inputs:

| Asset | SHA-256 |
| --- | --- |
| [vehicle-status-card v1.26.1](https://github.com/ngocjohn/vehicle-status-card/releases/download/v1.26.1/vehicle-status-card.js) | `58a1607ab3708a346f29d21ec821b0433e38039a7244e8ec18753c7766387547` |
| [extra-map-card 1.8.0](https://cdn.jsdelivr.net/npm/extra-map-card@1.8.0/dist/extra-map-card-bundle.js) | `659edd1de372f0d5c2445adfeb46359439b6d38211d7b2f606093d7b3f4cd962` |
| [Mapbox RTL text 0.2.3](https://cdn.maptiler.com/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.min.js) | `142f4fc31b4911887bacfea4df1813df67be28dfcb4c56e3f8f576f2e6fdf5d2` |

`extra-map-card` is published by Viet Ngoc and its
[package metadata](https://cdn.jsdelivr.net/npm/extra-map-card@1.8.0/package.json)
declares MIT; the published package does not contain its own license file.
`LICENSE-EXTRA-MAP` records the MIT terms and attributes the package author.
`LICENSE-RTL` is the published Mapbox RTL license, including its ICU notice.
Other bundled library notices remain in the generated source. Distributors
must preserve these notices in their output.

From the repository root, run `node scripts/vendor-car-engine.mjs`. Alternatively,
pass the three previously downloaded exact assets as positional arguments in the
order listed above. The generator verifies every checksum before transforming anything.
It wraps the bundle in an idempotent, lazy `initializeCarEngine()` function,
registers private element names, isolates upstream private globals and
document-level events, and removes the upstream picker registration and banner.
It replaces the upstream automatic external map-card loader with the bundled
private map implementation and replaces visible upstream card branding.
The image-upload helper dispatches its simulated shortcut on `document.body`
instead of `document`, so Home Assistant receives an element event target.
Do not edit the generated bundle directly.

After awaiting initialization, `addition-car-engine` and
`addition-car-engine-editor` are registered. The initializer resolves to the
upstream main and editor constructors and its bundled `LitElement` constructor.
The editor and its panels are already registered; no editor module is fetched.
The native layout panel is `addition-car-panel-layout-editor`.
The editor's integration surface includes `setConfig`, `hass`, `_config`,
`_store`, `configArea`, `_getCardInPreview`, `_renderSelectedConfigType`, and
`_renderLayoutConfig`. Its `configArea` values are `indicators`, `range_info`,
`images`, `mini_map`, `buttons`, and `layout_config`. These are private upstream
APIs and may change with a vendor update.

The standalone editor's `connectedCallback` changes the Home Assistant editor
dialog, loads HA controls, assigns a global preview manager, and cleans config.
For embedding, use the bundled `LitElement.prototype.connectedCallback` instead,
override `_getCardInPreview`, and render the selected native panel rather than
the entire standalone editor. Initialization of HA controls, config cleanup,
and isolation between simultaneous embedded editor instances then need explicit
handling by the host. Native layout name and `hide_card_name` controls must be
filtered by the host if the enclosing card owns its name.

## Map runtime and network requirements

The map runtime initializes only when `single_map_card`, a device tracker and a
MapTiler key are configured; it registers `addition-car-extra-map-card` and
private map components without touching an installed original map card. It no
longer fetches npm metadata or injects external JavaScript. The RTL text plugin
is embedded into the existing MapLibre worker and runs lazily when required;
it is not downloaded at runtime. MapLibre creates blob workers as upstream
does, so the browser's CSP must permit blob workers. Map styles, tiles, glyphs,
sprites, geocoding, telemetry and other configured map services still require
their normal network access and any applicable API keys. The upstream sample
stub also points to remote sample images. User-configured custom cards and
images have their own independent resource and network requirements.
