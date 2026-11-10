# Changelog

Versions follow Semantic Versioning. Release tags use the `v` prefix.

## 0.8.0 - 2026-11-10

- Default Area control-button shadows to off, keeping the Layout toggle available.
- Remove the duplicate Area Advanced comparison picker entry, retaining saved
  configurations, and simplify the three advanced Energy display names.
- To-do: support provider-advertised subtask renaming, show Microsoft importance
  stars beside Edit (writable only with a supported update field), add starred-first
  sorting, and move task deletion into the editor's bottom-right action row.
- Add a top-right close icon to the To-do task editor.
- To-do: open tasks by clicking the row/title, move subtask expansion beside Edit,
  show a compact completed/total count, expose supported subtask operations in the
  editor, and keep a quick-add input below the scrollable list.
- Collapse To-do subtasks by default, with a per-task expand/collapse button and count.
- Reduce To-do icon-button boxes by 20%, retaining the smaller icons.
- To-do: show existing MS365 subtasks with supported completion controls, group
  completed tasks in a collapsible bottom section, and add UI-configurable
  alphabetical/due-date sorting. Use compact icon actions and hide whitespace-only
  descriptions to remove unnecessary row height.
- Remove circular icon backgrounds from Area control buttons while retaining
  their button surfaces, centering, and active/inactive icon colors.
- Add optional motion and occupancy status icons with localized relative
  last-change times to Area cards, configurable in Content > Status.
- Center Area button icons without compressing their backgrounds and add a
  Layout button-shadow toggle, preserving button shapes and 8px control spacing.
- Use the thermostat-style theme-aware control background for Area buttons,
  including dark mode.
- Avoid reserving fixed grid height for compact Area cards and restore spacing
  above their lower controls.

## 0.7.6 - 2026-11-09

- Fix Area Advanced status selectors, compact card spacing, and clipped
  multi-line control labels.
- Place Area Advanced air-quality and brightness status to the right of the
  room title, rather than above the card, and restore the content's top margin.
- Add optional air-quality and light-brightness status to Area Advanced cards,
  plus scene-style button states and configurable buttons per row while
  retaining the existing button shape.
- Add an original frontend-only Mushroom To-do card for standard Home Assistant
  `todo` entities, including Microsoft To Do. Capability-aware task creation,
  completion/reopening, editing, due dates/times, descriptions and confirmed
  deletion use HA APIs without a Home Tasks backend. Includes multiple-list
  navigation, shared visual editor/shadow controls, safe UID checks, asynchronous
  error handling, and all 33 supported languages.

- Show a missing-source diagnostic when Energy Insights has no configured
  meter sensors instead of reporting an invalid history response.

## 0.7.5 - 2026-11-09

- Improve Energy Plan's full-width timeline with sticky labels and time axis,
  readable price blocks and ranges, visible power scales and direction labels,
  published coverage, and tap/keyboard interval inspection.
- Add standalone cumulative-meter sources and visual-editor field mappings for
  measured solar, grid, battery and consumer energy, retaining legacy snapshots.
- Keep valid energy totals visible when pricing or individual sources fail; add
  explicit absent-equipment settings, fixed feed-in rates and source diagnostics.
- Make supplied-plan battery, allocation and efficiency details configurable
  without mixing forecast values with measured energy or executing device actions.
- Add a measured interval chart and bounded cached history refreshes with timeout,
  stale-response protection and request-load diagnostics.
- Support high-frequency meters and independently updated counters, with clearly
  identified estimates for midnight boundaries and tariff interval allocations.
- Adapt both energy cards to narrow containers with readable consumer rows,
  touch-sized controls, stacked details and internally scrolling charts/tables,
  preserving full-width desktop layouts.
- Update energy documentation, localized editor labels, synthetic component demos
  and regression coverage.

## 0.7.4 - 2026-11-08

- Correct the Advanced Media playback button height when shared control styles
  previously overrode the compact sizing.

## 0.7.3 - 2026-11-08

- Reduce Advanced Media playback, shortcut and sound-setting button heights by
  40%, with compact shortcut icons and unchanged slider sizing.

## 0.7.2 - 2026-11-06

- Fix empty space beneath shared energy-card headings in fixed-height previews
  and fill-container layouts. Headers size to their content instead of filling
  the card and pushing its controls below the visible area.
- Add Energy Plan, Energy Insights & Purchases and Energy Log to the existing
  bundle and card picker, retaining Smart Saving and every existing energy card.
- Use the shared Mushroom presentation, five editor sections, native structured
  selectors, theme-aware colors, header actions and shadow option, including
  missing/stale-source surfaces. Avoid duplicate shared presentation controls.
- Add source validation, measured interval accounting separated from supplied
  forecasts, healthy compatible picker defaults, all 33 language catalogs and
  configuration examples for the new cards.

## 0.7.1 - 2026-11-02

- Scenes button entity pickers now allow every Home Assistant domain, matching
  Welcome Scenes and the existing per-button actions and on/off colors.

- Complete the 0.7 translation audit across all 33 supported Mushroom languages,
  including the four NAS cards, Air Quality, appliances, stock data, workflow and
  Smart Saving editors, chart captions, selector options and helper guidance.
- Expand Weather Advanced to all 33 languages while preserving its existing
  Estonian, Portuguese and Chinese language IDs. Resolve regional and script
  variants correctly, including Serbian Latin and Traditional Chinese.
- Refresh optimized NAS cards and editors when only the Home Assistant language
  changes. Use localized native entity states and duration units.
- Translate generated workflow labels and period names without rewriting saved
  custom names, selector values, entity IDs or mappings.
- Check the shipping Weather Advanced catalogs alongside the shared catalogs,
  add 33-language rendering regressions, and guard against unregistered UI text
  and raw English HTML/SVG captions returning.

## 0.7.0 - 2026-11-02

- Light Area Card follows Mushroom's bulb colour normalization, tinted icon
  backgrounds and solid brightness fill over a 20%-tinted track, without added
  light-mode shadows, outlines or a brightness thumb.

- Appliance settings and diagnostics can expand from an icon beside the status indicators,
  with UI-editable detail entities and no separate heading row.

- Appliance power and program selection share one row in a 1:4 layout.

- Appliance cards show unavailable progress explicitly rather than 0%, and allow
  choosing an initial program when Home Connect reports an unknown selection.
  Extra controls grow to fit their labels, and operation status uses the configured
  appliance icon with readable, wrapping status badges.

- Air Quality displays the current quality text beside its changing status icon.

- Air Quality adds compact, reorderable sensor columns for temperature, humidity,
  CO₂, PM2.5, VOC, humidity-derived mould risk, radon, pressure and custom readings.
  Its visual editor controls entities, visibility, icons, colors, units, precision
  and thresholds. Header title/icon and the live quality indicator can be hidden
  independently. The indicator can follow a quality entity or the worst available
  pollutant reading; unavailable readings never become fabricated numeric values.

- Area Advanced and Area Mushroom offer a Camera privacy entity. Only an
  explicit Off state permits the camera view; privacy, missing and unavailable
  states use the compact room view without mounting the camera.

- Pollen's Additional sensors toggle now mounts its repeatable entity/label/icon/
  color controls in Features and preserves rows when hidden or reopened.

- Weather Advanced keeps its heading content-sized so the animated scene is not
  pushed outside the clipped card and stretches correctly with Fill container.
  Restored Interactions in its visual editor,
  honored High animation quality, and added complete option round-trip coverage.

- Washer-Dryer power is blue while On; program controls use cached supported
  same-device defaults, with explicit feedback when Pause is unsupported.

- Washer-Dryer groups power and progress in the heading with small icons instead
  of a separate percentage row.

- Native dropdown popups follow HA light/dark themes across Washer-Dryer, Remote,
  Pi-hole, Area Advanced and NAS editors, with explicit option colors.

- Washer-Dryer offers three optional custom entity buttons with visual name,
  icon and action overrides and responsive wrapping.

- Washer-Dryer displays its live program state independently of the power-switch
  heading and uses the operation state to distinguish running from ready/idle.

- Washer-Dryer starts with empty entity selectors, saves same-device mappings once
  when its primary entity is selected, and shows translated/readable program names.

- Added fully visual-editable Weather Advanced with shared Mushroom presentation
  and actions, animated modern/classic skies, forecasts, clocks and sensor overrides.
  Offscreen/reduced-motion animation safeguards and bounded forecast retries
  avoid unnecessary background work.

- Light Area coverflow keeps both neighboring scene tiles visible on narrow cards,
  reveals successive scenes during long drags, and uses consistent effect spacing
  when snapping after release.

## 0.6.2 - 2026-11-01

- Added Smart Saving and Energy Entityworkflow cards with shared Mushroom
  presentation, interactions, picker defaults and lazy visual editor sections.

- Mini Graph clips plots to their viewport, bounds bar geometry, and aligns grouped bars by timestamp without overlapping narrow time slots.

- Shared card editors retain lazy content through Home Assistant's pre-collapse measurement instead of unmounting it when a collapse is first requested.

- Light Area: controls wrap the slider onto a full-width second row when the card is too narrow for the buttons and a usable slider.
- Editors: let Home Assistant own the native expansion state while measuring content, so Layout, Features and other lazy sections open reliably on the first click without mounting hidden controls.

## 0.6.1 - 2026-10-29

Speed improvement.

- Forecasts: only subscribe for actual weather entities. Failed subscriptions use bounded exponential backoff instead of retrying on every state update; disconnects, configuration changes and replacement connections release subscriptions and pending retries.
- Area Advanced cards: forward state updates to the native Area card only when area members, explicitly referenced entities or area sensor overrides change. Registry, presentation and layout changes still refresh normally; dynamic controls and unknown features retain unrestricted updates.

- Card picker: only rank Sonos players for Sonos defaults, scoring each candidate once rather than repeating discovery while preparing every card. Only discover solar-panel examples for the panel card, reuse entity search text within each stub, and stop searches at the first healthy match.

- Card editors now create controls only for expanded sections and release them when collapsed, avoiding hidden scene selectors and forms processing every Home Assistant state update.

- Astronomy card: reuse a single Moon-sensor discovery index per Home Assistant state snapshot, including missing sensors, rather than repeatedly scanning all entities for each displayed metric. Reuse the time formatter within each render.
- Fixed relative-time labels breaking subsequent card updates after Home Assistant replaced their text. Light Area controls now expand normally when a light turns on; the same fix applies to room cards and primary/secondary last-changed/updated labels.
- Cards showing last changed/updated now display relative time (for example 4 hours ago) like Home Assistant, instead of a full date.
- Graph Advanced: compact layout for small card sizes (graph becomes a background sparkline, radial graphs sit beside the header), no spinner flashing on live refreshes, and current values update without refetching unchanged Recorder history. Equivalent history requests are coalesced.

- Graph Advanced card: the graph now shrinks to fit small card sizes instead of being cut off, and the default grid height is derived from the graph type and visible content.

## 0.6.0 - 2026-10-29

- Light Area Card: scene lookup is cached per config (runs once), and all light card labels are translated.
- Light Area Card: added Use light color, Color temperature control, Color control Collapse controls when off and Full collapse controls (also hides the scenes and group lights), and fixed the scene carousel resetting mid-drag whenever Home Assistant refreshed the card.

- Added a Light Area Card: Mushroom light controls with a brightness slider plus a pulldown that lists every light in the selected light group as small on/off buttons (per-row setting, optional open by default) and a second, hideable pulldown with a coverflow scene carousel that auto-fills with the scenes of the light's area (add/remove scenes, button size, icon size, effect, coverflow spacing and depth).
- Welcome: optional people row above the scene buttons (home on the left, away with their state on the right). People are picked once in the editor and new cards pre-select everyone in the household.
- Pollen: optional 'Additional pollen sensors' list (off by default) adds Trash-style rows below the three main types; add, reorder or remove any number of sensors from the editor.
- Input Datetime card: added step size, single-row layout and manual time entry (click the time to type it).
- Added a **Card shadow** toggle to the Layout section of every card editor (off by default); the soft shadow around the card border is now opt-in.

- Scenes Card: new "Scenes per row" setting wraps scene buttons onto additional rows (all scenes are now shown).
- Scenes and Welcome cards: grey off state; Welcome also supports scenes per row.
- Welcome Card: buttons are now edited exactly like Scene buttons (entity, name, icon, color, navigation, tap action); existing nav_N settings migrate automatically.
- Scenes and Welcome: the grey off colour only applies to entities with an on/off state; scenes, scripts, buttons, sensors and navigation buttons always use their chosen colour.
- Washer-Dryer Card: program selection dropdown and power button, configurable from the editor.
- All cards, including the graph cards, now support dashboard Layout size overrides and scale to fill their grid cell.
## 0.5.4 - 2026-10-28

- Mini Graph Card: hovering the graph now highlights the nearest series, dims the
  others and shows a tooltip with every series value; "points: on hover" now
  shows dots under the cursor (previously nearly impossible to hover). Legend
  and top-label entries also highlight/dim on hover.
- Mini Graph Card: new circular rings chart type (APEX radial-bar style) and an
  optional "top labels" row of large coloured values with captions.
- Mini Graph Card: new scatter, pie and donut chart types in the chart type selector.
- Mini Graph Card editor audit: primary "Show state" is honoured, "State in
  legend" works for a single series, the chart type selector reflects YAML
  config, and the ineffective "Fill container" option was removed.
- Fix Mini Graph Card chart height so a narrower card no longer leaves a blank
  bar under the graph with the lower label stranded at the bottom.
- Add optional Yahoo market-data backend and Stock Card source selection for
  actual historical prices, including a five-year chart, independent of HA
  recorder retention. Retrieve available company fundamentals and expose
  provider warnings rather than inventing missing values. Preserve arbitrary
  sensor providers, explicit per-metric overrides and Stock Market Deluxe.
  The backend requires separate installation and UI setup.

## 0.5.3 - 2026-10-28

- Safely escape entity-provided image URLs in CSS backgrounds and remove the
  setup-specific navigation default from Home Energy Management.

## 0.5.2 - 2026-10-24

- Add the provider-independent Stock Card with visual entity/attribute mappings,
  recorder history, holdings and optional Stock Market Deluxe backend support.
- Reuse shared visual-editor schemas across unrelated Home Assistant updates
  while keeping entity selectors and configuration-dependent fields current.
- Add four NAS cards: Server Overview, Storage and Disks, Docker Containers,
  and Unified Dashboard. Preserve Synology DSM/QNAP/manual discovery, all
  upstream entity mappings, editors and optional Portainer/manual controls.
  Keep the original NAS card and hidden `synology-*`/`snfx-*` card/editor
  aliases; ship everything in the main bundle with Apache-2.0 notices.
  Remove the old standalone frontend resource and fully reload when migrating.

- Remove obsolete source-comparison pages and their broken local reference
  image links. Retain the current catalog demo and regression fixtures.
- Replace the outdated dashboard screenshot with a data-free project banner.

- Use concise functional card names with the consistent `Mushroom Addition:`
  picker prefix. Existing card type IDs and saved dashboard configurations are
  unchanged.
- Add Area Advanced - Mushroom as a separate comparison card with Mushroom
  typography, icon bubbles, spacing and controls. Retain the original Area
  Advanced card and share its native area behavior and full visual editor.
- Align Game Console, Upcoming Media, NAS, Tablet, Speedtest, Pollen and Pi-hole
  supporting text, control sizing, spacing and theme tokens with Mushroom.
  Preserve artwork, gauges, existing actions and explicit media sizing.

- Remove the redundant Welcome Scenes card, including its registration,
  editor, renderer and examples. Welcome and the regular Scenes card remain.
- Remove the Roomview card, including its registration, graphical editor,
  renderer, styles and examples. The separate Room card remains available.
- Replace Welcome's fixed thermometer shortcut with a weather-aware icon,
  current temperature and secondary date. Expose icon, both information lines,
  date format and weather tap action in the graphical editor, preserving the
  selected weather provider and navigation controls.
- Align Astronomy labels/spacing, Alarm Time/Washer/Input Datetime controls,
  Trash/Printer typography and Mini Graph headers/supporting text with
  Mushroom theme tokens. Preserve astronomy graphics, graph readings and
  matched 30px Trash/Printer rows.
- Give Sonos and Remote shared themed native range tracks, keyboard focus and
  disabled styling; style the Remote source selector consistently. Preserve
  service behavior and custom Remote button sizes.
- Center scene/navigation pill content vertically and separate the plain
  Scenes header from its button row.

- Give Scenes and Welcome navigation pills the same hover highlight and
  keyboard-focus outline as Welcome Scenes, without changing their layout.

- Align shared headers with Mushroom's 36px icon circles, 500-weight primary
  typography and theme-controlled text metrics. Share Mushroom accent-palette
  defaults and overrides across named colors and legacy accent roles.
- Make Scenes, Welcome and Carousel labels theme-aware 12px secondary text
  with two-line wrapping and full-name tooltips, preserving responsive pill
  sizing, shadows and the existing horizontal overflow behavior.

- Match Mushroom's neutral controls to primary-text RGB at 5% opacity and
  progress tracks to secondary-text RGB at 20%, including theme-aware grey
  and disabled colors. Keep card geometry and colored active states intact.
- Wrap carousel pagination dots on narrow cards instead of adding a horizontal
  overflow scrollbar; preserve the separately configurable position slider.
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
