# Changelog

Versions follow Semantic Versioning. Release tags use the `v` prefix.

## Updates to 0.0.1 (no version bump)

- Added independent Roomview climate presentation, clearly labeled climate,
  sensor status and device sections, and per-device graphical tap/hold/double-tap
  actions with isolated keyboard/pointer handling. Inactive and unavailable
  sensors retain their context instead of showing a false all-clear.
- Fixed Astronomy's default header icon to use a sun instead of an information icon.
- Added Mushroom-compatible Sonos media information, volume display, selectable
  volume/playback controls, and collapse-when-off behavior with feature-aware
  service calls, entity-driven icons, and isolated nested control actions.
- Removed Internet Speed, Graph, Entity Overview, More Power Outlet, Gauge, and Bar Card.
  Mini Graph and Speedtest Gauges remain available.
- Added theme-controlled Mushroom-style borders to standalone cards.
- Added a carousel-only mode via the graphical **Show card header** switch.
- Combined Game Console profile image, profile name and current game into one
  shared header instead of showing a duplicate information row.
- Prepared the Dashboard/plugin repository for HACS validation and catalog review.

## [0.0.1] - 2026-10-20

First versioned public release of Mushroom Cards Addition. This establishes a
new release baseline; previous internal `1.4.0` build labels were not published
releases.

### Included

- 33 Mushroom-style Home Assistant dashboard components with visual editors,
  entity pickers, theme-aware presentation and dashboard actions.
- Advanced Energy home management live flow, buy/sell price timeline with an
  expandable trade-result estimate, and panel-health summary with gauges.
- Configurable trade size, power, efficiency, feed-in fee and slot duration.
- Native Mini Graph charts, combined Sun/Moon positioning, media controls,
  room views, battery intelligence, plants, pollen and device metrics.
- Consistent header icons and information alignment, including NAS, Weather
  Metrics, Internet Speed, Speedtest, Pollen and Roomview.
- Refined Speedtest reading placement.

### Changed

- Energy labels use English and generic Battery / Solar Panels terminology.
- Mini Graph omits irrelevant layout controls in its visual editor.
- The redundant Pollen Forecast card is removed; the Pollen card remains.

### Release tooling

- One frontend version sourced from `package.json`, with lockfile and tag checks.
- Tag-triggered validation and downloadable HACS-compatible release assets.

[0.0.1]: https://github.com/snfx-johaver/mushroom-cards-addition/releases/tag/v0.0.1
