# Changelog

Versions follow Semantic Versioning. Release tags use the `v` prefix.

## Updates to 0.0.1 (no version bump)

- Added **Mushroom Addition - Area card advanced** using the installed native HA
  Area card/editor, with runtime-only enhanced controls and no copied upstream
  code. Added any-domain entity buttons, chips-style compact list/detail editing,
  names/bottom-aligned content, entity pictures, icon/color overrides and
  tap/hold/double actions; action, native-conditional and server-template buttons
  are opt-in. Native domain/default controls and all other Area features remain
  delegated. Native custom-feature support is required. Checked on HA 2026.10.2:
  native display-mode sizing, editor round trips, bottom-aligned named controls,
  narrow layouts, conditional visibility and server-rendered templates.
- Kept Room's square geometry and icon sizes while placing status indicators
  below secondary text. Fixed temperature/brightness labels with explicit
  entity selectors, valid-value checks and combined output; added Room-only
  composed secondary information and up/down sensor-button ordering.
- Fixed Room Overview's whole-card yellow tint when the light-color accent is
  disabled. Room and Room Overview now tint only for an enabled, valid RGB accent.
- Added Room's Features status-indicator editor (up to four), water/smoke alert
  pulses with reduced-motion support, and configurable RGB light accents.
  Removed Room selection helpers and Room-only custom button-name editing;
  fixed action-button icon sizing, entity defaults and gesture isolation.
- Added independent Roomview climate presentation, grouped climate,
  sensor status and device settings in the editor only, and per-device graphical tap/hold/double-tap
  actions with isolated keyboard/pointer handling. Restored the original compact
  card appearance; unavailable sensors do not show a false all-clear.
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
