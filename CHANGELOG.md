# Changelog

Versions follow Semantic Versioning. Release tags use the `v` prefix.

## Unreleased

- Give Scenes and Welcome Scenes the same pill dimensions, labels and
  responsive single-row sizing as Welcome buttons, scrolling only when needed.
- Match carousel buttons to the neutral tiles and colored circular icons
  used by scene buttons; keep coverflow shadows outside the tile surface.
- Reserve space around scrolling scene buttons so their bottoms and shadows
  are not clipped.
- Remove tablet active-state outlines and Sonos shortcut/switch borders,
  retaining state colors, subtle shadows and keyboard focus indicators.
- Match the TV remote's subtle button shadows across other card controls,
  without changing their colors, shapes or layouts.
- Center the Astronomy moon icon within its circular orbit marker.
- Use solid carousel button colors instead of gradients, preserving active
  colors, optional coverflow shading and existing button sizes and layouts.

## [0.5.1] - 2026-10-21

- Publish the current fixes from a matching source tag and release build for
  HACS: compatible Upcoming Media data-source choices, recovery of old
  friendly-name selections, and theme-aware native color-picker defaults.
- Shorten the README to installation and everyday essentials, keeping the
  preview and a thank-you to Mushroom.
- Keep household screenshots and raw visual-audit dumps out of published
  assets. Existing card types, layouts and JavaScript filename stay compatible.

## [0.5.0] - 2026-10-21

- Limit Upcoming Media's data-source selector to list-compatible attributes,
  excluding display metadata such as friendly name. Recover old friendly-name
  selections using the standard `data` attribute.

- Update GitHub Actions to supported Node.js 24 releases, removing the
  deprecated Action-runtime warnings, and pin the Ubuntu runner version.
- Prevent accidental household screenshot uploads from the documentation
  assets directory.

- Fix "Unknown item" color-picker warnings in Upcoming Media and other cards
  by registering theme and custom default colors as native picker choices.
  Automatic colors stay theme-aware and do not write overrides into the card.

- Renamed the project and repository to Mushroom Addition, with a refreshed
  introduction and a big thank-you to Mushroom. Existing card types and the
  installed JavaScript filename remain compatible.
- Added Upcoming Media: configurable artwork, sensor-data templates, sorting,
  filtering, flags, collapsed lists, summaries, trailers and media actions.
- Added Remote Card: device-scoped pairing, touchpad and D-pad navigation,
  capability-aware media controls, presets, shortcuts, key mappings and haptics.
- Added Pi-hole Card: multi-device statistics, blocking controls, server-timed
  pauses, maintenance actions, diagnostics and recorder-backed system history.
  All three additions have graphical editors and compatible picker defaults.
- Removed obsolete live-instance screenshots/audit dumps and personal example
  identifiers. Updated CI/release builds to Node.js 24 for the current test runner,
  with a Git-history secret scan in CI.
- Fixed explicit scene action dispatch, nested-control keyboard handling and
  cancellation of delayed card gestures when configurations change or cards
  are removed. Scene rows now contain horizontal overflow without reshaping buttons.
- Isolated Mini Graph histories by entity and attribute, separated state-map
  caches, and corrected threshold-gradient offset ordering.
- Corrected Roku rewind/unsupported keys, never-pressed Pi-hole maintenance
  buttons, and recovery after failed Upcoming Media artwork.
- Completed all 33 Mushroom language catalogs, with regional/script
  normalization and right-to-left support: 1,768 labels, helper messages and
  diagnostics per language. The strict coverage check rejects missing messages
  and invalid placeholders rather than counting English fallback as translation.
  User names, entity IDs, command codes and action payloads stay unchanged;
  duration choices use localized unit names.
- Moved more legacy card and editor text into the translation catalogs.
  Greetings, pollen levels and common battery, washer, playback and linked speaker controls,
  plus plant measurement labels,
  now follow all 33 languages. Entity state labels use Home Assistant's own
  formatter; custom names and service commands don't get "helpfully" translated.
- Translated Mini Graph configuration/history messages into all 33 languages.
  History warnings follow language changes; external error details stay intact.
  Advanced Area button state labels now use Home Assistant's native formatter too.
- Localized native Area compatibility, loading and template diagnostics in all
  33 languages, keeping component identifiers and external error details intact.
- Carousel pagination buttons announce their actual item names without an
  untranslated English prefix.
- Kept long astronomy translations and narrow NAS charts inside their existing
  layouts without shrinking Mushroom typography or icons.
- Fixed Mini Graph picker defaults to prefer healthy temperature/numeric sensors
  in both preview paths, and populated Trash previews from real waste sensors
  and collection calendars instead of unrelated entities or blank rows.
- Corrected combined date/time helper adjustments and disabled time controls
  for date-only helpers without changing card layouts. Obsolete comparison
  demos now skip removed registrations instead of failing during loading.
- Raised the declared Home Assistant minimum to the verified 2026.10.2 target;
  the previous 2024.4 claim did not cover current native editor selectors.

### Earlier development updates included in this release

- Added Layout sliders for Entity Carousel button width, height and icon size,
  with responsive spacing, proportional entity pictures and size-aware effects.
- Scene and Welcome buttons retain their raised appearance in dark mode with
  a slightly lifted surface, subtle top highlight and stronger drop shadow;
  light-mode styling and each button's shape are preserved.
- Renamed Media Player Sonos to Media Player Advanced. Its power control now uses
  explicitly labelled standby/stop and resume actions on always-on players that
  advertise playback but no hardware power capability.
- Removed the separate basic Media Player card after verifying Advanced's power,
  playback and volume controls, retaining the existing Sonos YAML type.
- Removed Room Overview from the public catalogue, renderer, editor, examples
  and source inventory. Room, Roomview and Area advanced are unchanged by removal.
- Area advanced now derives its optional RGB accent from lights in the selected
  area, respecting exclusions and on/off availability. Removed the redundant
  light picker; old manual selections no longer override the area's lights.
- Removed Entity Carousel's selected-tile border/inset ring while retaining
  keyboard focus indicators. Added editable navigation, dots/count/progress
  pagination, a draggable position scrollbar, and single-item Fade/Cube/Flip
  effects alongside Slide/Coverflow, without adding an external dependency.
  Catalogue examples now use healthy lighting scenes aligned to one room
  instead of a mixture of unrelated entities.
- Brought working generic media-player options to Sonos: a separate,
  capability-aware power switch, Sources/details, artist/album details,
  an optional playback target, custom volume steps and idle/standby collapse.
  Preserved legacy power selections without duplicating the editor control.
- Fixed default header icons across entity-backed cards (including both media
  players) to use HA's entity/device-class/state icon instead of a recommended
  card icon. Picker/editor defaults no longer freeze header icons; linked metric
  icons no longer accidentally become header overrides. Custom overrides remain.
- Removed Sonos's redundant Show volume level switch: the selected volume
  slider owns the percentage. Use media info now works with the editor's normal
  Name/State modes, showing title/artist while respecting custom/hidden/time modes.
- Aligned NAS status/metric typography with Mushroom's 14px primary/12px secondary
  defaults and 40px icon containers/24px symbols, including narrow layouts and
  theme-controlled sizing. Kept its header and rings.
- Added Trash's opt-in **Hide items without a known date** graphical option;
  missing/unknown dates disappear and automatically return when available.
- Combined Room's brightness/accent light pickers into one shared light entity,
  with migration of brightness-only configs. Status indicators now share the
  square buttons' neutral background. Welcome navigation rows reserve bottom
  shadow space and scroll on narrow widths instead of clipping their buttons.
  Scenes and Welcome Scenes buttons now share Welcome's borderless/shadow
  treatment without changing their shapes; the weather/date background is transparent.
- Stabilized Area advanced Content selectors so the alert color picker stays open
  across state updates. Advanced controls now use native HA sortable grips and
  edit/delete icon buttons, matching Features. Off/disabled controls retain a
  theme-aware neutral background. Added an opt-in configured-light RGB room accent
  that clears when disabled or the light is off.
- Matched Astronomy's Sun and Moon orbit markers at 20px, retaining the Moon
  glyph size while fitting its white circle to the same diameter.
- Simplified Area advanced button content with contextual attribute dropdowns
  and text helpers; replaced arrow reorder buttons with drag grips and removed
  the duplicate controls-feature add button. Fixed native group color overrides.
  Added native Content options for alert colors, wrapped sensor values and small
  grey entity-default sensor icons while retaining native aggregation.
- Removed Weather Metrics from the card picker, renderer, editor, demos and
  source inventory. Astronomy and shared weather-entity support are unchanged.
- Tightened Entity Carousel vertical spacing, including header/label-free mode.
  Cleared header/item icons now follow Home Assistant's entity/device-class/state
  icons. Added per-item double-tap actions and native Default action selection
  for tap, hold and double-tap, with isolated swipe/hold/double-tap handling.
- Fixed cold-page Area card/editor initialization: wait for Home Assistant's lazy
  native Area registration, explicitly upgrade/configure the helper-created
  element, and retain bounded errors and safe retry instead of rejecting the
  loading placeholder as unsupported.
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

First versioned public release of Mushroom Addition. This establishes a
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

[0.0.1]: https://github.com/snfx-johaver/mushroom-addition/releases/tag/v0.0.1
[0.5.0]: https://github.com/snfx-johaver/mushroom-addition/releases/tag/v0.5.0
[0.5.1]: https://github.com/snfx-johaver/mushroom-addition/releases/tag/v0.5.1
