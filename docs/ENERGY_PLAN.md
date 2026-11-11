# Energy Plan

Choose **Mushroom Addition: Energy Plan** in the Home Assistant card picker.
The card and its editor are included in the existing bundle. No separate resource,
Mushroom dependency, custom backend, or YAML-only configuration is required.

This card displays supplied plans, not an optimizer or device controller.
It never estimates missing prices, simulates a battery, or runs a schedule.
Synthetic examples are isolated in `demo/energy-plan.html` and tests.

HEMS is not required. A newly added card starts with a compatible published
price row, plus any other default rows actually supplied by that same plan.
It does not assume that batteries, solar or a heat pump exist. Without a
compatible source it starts with no rows and shows setup guidance. Add your
own rows under Features; each row can use a separate integration/entity.
Existing saved rows and older default-row configurations are not rewritten.
See [community energy setup](ENERGY_SETUP.md) for input requirements.

![Energy Plan synthetic illustration, not a live Home Assistant screenshot](assets/energy-plan-example.svg)

The illustration uses invented forecasts and prices; it contains no home data.

## Use your own entities

You need at least one source publishing timestamped intervals. This can be a
price integration, a forecast integration or your own planner; HEMS and
battery equipment are not required. Begin with a single row.

1. Inspect your entity's interval list in **Developer tools → States** using the
   [source checklist](ENERGY_SETUP.md#find-your-entities-before-configuring-a-card).
2. Add **Mushroom Addition: Energy Plan**. Open **Features → Energy Plan → Edit**
   and add or edit a timeline row.
3. Choose the row type and entity, attribute/JSON source, list path, start/end
   or duration fields, numeric value field and the source's actual unit.
4. Disable or remove rows for equipment/data you do not have. Save and inspect
   one interval to compare it with the original source.

The [minimal configuration](#minimal-configuration) below is a complete
single-price-row example. Different rows may use different entities and
attribute paths; the Context entity is only a fallback for rows without an
explicit entity. The visual editor fills the required row appearance fields.

To add battery percentage, use a `soc` row with `%` values. To add power, use a
`power` row with matching source units and an appropriate scale. A `schedule`
row represents supplied operating intervals, not a command to equipment.
Configure sign labels to match the publisher. Unit labels do not perform
W-to-kW or price-denomination conversion.

**If a row is empty:** check its list path, numeric field, timestamps, source
update age and visible window. A current-power or current-battery sensor alone
cannot populate future intervals. Check availability and the row's error
before increasing an age limit; unpublished gaps are expected when a planner
has not supplied a full horizon.

## Visual editor

The only editor adapter is the existing `mushroom-addition-editor`.
There is no Energy Plan editor custom element, custom row-management UI, separate
panel, or unstructured object/YAML selector. Native Home Assistant object selectors
with explicit fields provide add/edit/delete dialogs and drag ordering, including
metrics nested inside periods. **Features → Energy Plan → Edit** opens the
standard Home Assistant form. All object selectors define their field schemas.

Native selector behavior was checked against the released Home Assistant
2026.11 frontend (20261028.4). This is the supported editor baseline, not a claim
that these features first appeared in that release:
[native object selector](https://github.com/home-assistant/frontend/blob/20261028.4/src/components/ha-selector/ha-selector-object.ts).
Browser showcase selector shims and unit tests are not an end-to-end live HA test.

The shared editor retains its five sections:

| Section | Editable settings |
| --- | --- |
| Context | Default source entity, inherited by rows without their own entity |
| Content | Mushroom name, icon, primary and secondary information, custom secondary text |
| Layout | Visible hours, horizontal/vertical heading, multiline secondary text, fill container, card shadow |
| Interactions | Header tap, hold and double-tap actions |
| Features | Timeline source/start, section visibility, overview text, timeline title, sizing, rows, summaries and periods |

Every specialist setting listed below has a visual control. Rows, summary metrics
and periods can be added, removed and reordered. Each period can contain its own
addable/reorderable metrics. Validation errors stay visible and invalid edits are
not dispatched to Home Assistant; the draft stays available for correction.
Features are mounted only while that shared section is expanded.

## Sources and interval contract

Each timeline row can read its own sensor or inherit the Context entity. With
`adapter: attribute`, `path` selects an attribute array. With `adapter: state`,
the state must be JSON and `path` selects an array inside the parsed JSON; leave
the path empty for a JSON array at the root. Paths are dot-separated.

Every item needs:

- `startField`: ISO timestamp with timezone, Unix seconds, or Unix milliseconds.
- `endField`: timestamp after start; alternatively `durationField` in minutes.
- `valueField`: finite number, including zero or negative values where applicable.

Price-row units accept ISO currency/kWh, ISO currency/MWh or ct/kWh. These
rows display the supplied unit; changing the unit label does not convert values.
Power/schedule rows likewise display their configured units without conversion.

Unconfigured, unavailable and malformed sources have explicit row messages.
Malformed entries, overlaps and battery percentages outside 0–100 reject the
whole source row rather than hiding corrupt entries. Empty arrays and intervals
outside the visible window display “No published intervals”. Unpublished gaps
are shaded, including time before and after the supplied forecast; they are
never interpolated, extrapolated or treated as zero. Adjacent price intervals
are grouped only when they share the configured low/mid/high color band and
their combined price range fits `priceTolerance` (default zero: equal prices).
Adjacent matching schedule modes are grouped visually only. Price tooltips retain the source range;
the inspector still reads the original individual interval values.

## Feature options

`energy_plan` contains these settings; omitted settings receive the card defaults.

| Setting | Meaning |
| --- | --- |
| `start` | `now` (default) or `source` |
| `startEntity`, `startField` | Source timestamp from a sensor state or attribute; empty entity inherits Context |
| `horizon` | `configured` (default): retain the visible-hours window; `published`: fit to the union of valid enabled rows inside that window |
| `forecastKind` | `unspecified` (default), `estimate` or `interval`; describes the supplied forecast basis, not its accuracy |
| `forecastMethodField` | Optional dot-separated attribute path on the start source (or Context entity) containing the source's forecast-method explanation |
| `showHeader`, `showOverview`, `showMetrics`, `showInspector`, `showPeriods`, `showLegend` | Independent section visibility, all enabled by default |
| `overview`, `description`, `timelineTitle` | Editable user text |
| `rowHeight` | 36–80 pixels; default 56 |
| `minimumWidth` | 400–1600 px; default 720; narrow cards scroll horizontally |
| `maxContentWidth` | Centred content limit, default 1200 px; 400–2400, or 0 for unlimited. The card background still fills its section. |
| `axisStep` | 1–24 hours between timeline grid ticks; default 3. Dense axes automatically show fewer time labels to avoid overlap. |
| `maxAgeMinutes` | Maximum source age in minutes, 1–10080; default 60 |
| `rows`, `metrics`, `periods` | Repeatable lists described below |

`visibleHours` is a root-level Layout setting (1–168, default 24). Displayed times
use Home Assistant's configured timezone; tick labels include the weekday across
midnight. A minute timer refreshes the “now” window and is disposed on removal.
Only relevant entity, theme, timezone and locale changes rebuild the card.
In Home Assistant sections, the card requests the full 12-column width so timeline
labels and price blocks have room to remain legible. The built-in solar row scales
its bars to the largest absolute solar value in the visible forecast, making small
but meaningful solar values visible; other power rows use their configured `scale`
unless `autoScale` is enabled. Set `autoScale: false` to keep solar on a fixed scale.
Every power row displays its full positive/negative scale next to its name, so
auto-scaled solar magnitude is not confused with a fixed battery or home scale.
Power tracks have a zero baseline; battery/grid sign labels explain the source's
configured charge/discharge and import/export convention.

The row labels remain pinned while scrolling horizontally, and the time axis
stays pinned while scrolling vertically through long lists. Tap a position on
the actual timeline to pin the inspector to that time. Keyboard users can focus
the timeline and use Left/Right or Home/End, or use the existing range slider.
The now marker is distinct from the selected inspector cursor.
At narrow card widths, summary tiles use two columns, period summaries stack,
and the inspector uses a two-column value list with a larger touch slider.
On phones, the pinned label column narrows to 112 px, leaving more visible
timeline space without compressing its 24-hour data. Long labels wrap rather
than disappear; horizontal scrolling remains inside the timeline.

Above the timeline, the card identifies the supplied-plan horizon and the oldest
row-source update. Each row reports published interval coverage; gaps stay blank,
not zero. The lowest published price and its first source interval are listed
as a factual summary, not a charging recommendation. Grouped price blocks show
a rate range when their source intervals differ. Chart coordinates follow the
rendered pixel width, keeping typography and row heights stable on wide cards.
Inspector values use aligned tiles; explanations and the legend are collapsed
under Plan assumptions.

**Published horizon** trims leading and trailing unpublished space to the union of
the enabled rows' valid intervals, within the requested start and visible-hours
limit. It never stretches a shorter row to match another: internal gaps and
row-specific gaps remain shaded and retain their coverage labels. If no valid
intervals exist, the requested window and explicit source errors remain visible.
Period offsets still refer to the originally requested start and their displayed
times are clipped to the fitted window. Metric values are never recalculated.
Choose Configured horizon to retain a fixed comparison window.

The status names the configured forecast basis and optionally displays escaped
method text from the source. Estimates and interval forecasts are labelled
explicitly; missing provenance is Not specified. The card does not infer a method
from an integration name or convert a supplied estimate into a detailed forecast.
Fitting the horizon fixes misleading empty space, not upstream missing forecasts;
a full rolling forecast still requires publication by the planner.

## Rows

The legacy default row set contains prices, solar power, battery operation,
battery percentage, grid operation, house use and heat pump operation. The default
field names are `price`, `solar`, `battery`, `soc`, `grid`, `home` and `heat`,
respectively, in an attribute named `plan`. These are configurable conventions,
not automatic integration-specific entity mappings. New picker configurations
only enable compatible supplied rows, as described above.

| Setting | Meaning |
| --- | --- |
| `id`, `enabled` | Unique row ID; independent visibility |
| `name`, `icon`, `color` | Label, MDI icon and theme-aware Mushroom/UI color |
| `kind` | `price`, `power`, `soc` or `schedule` |
| `entity`, `adapter`, `path` | Source sensor, attribute/JSON state and array path |
| `startField`, `endField`, `durationField`, `valueField`, `statusField` | Interval field mappings |
| `unit` | Source/display unit; no implicit numeric conversion |
| `scale` | Positive power magnitude at the full bar half-height, in the configured unit |
| `autoScale` | Scale power to the largest absolute visible value; defaults on for the solar row, off for other rows |
| `priceTolerance` | Maximum combined rate spread allowed in a grouped price block; default 0, in the price row's unit |
| `low`, `high`, `lowColor`, `highColor` | Price color thresholds in the configured price unit; low must not exceed high |
| `positiveLabel`, `negativeLabel`, `zeroLabel` | Schedule labels when no mapped textual status is supplied |

Prices support ISO currency units such as `EUR/kWh`, `USD/kWh`, and `ct/kWh`;
configure thresholds in the same unit. Values are not currency-converted.
Percentage rows require `%` and values within 0–100. Power bars use a shared
baseline: positive above and negative below. Percentage values are drawn as
separate dashed interval segments without bridging gaps. Schedules use the
mapped status if available, otherwise the configured sign-based labels.

The defaults assume positive battery power means charge, negative means discharge;
positive grid power means import, negative means export. Adapt the sign labels
to the source's convention. Power and schedule rows otherwise accept any display
unit. The card does not convert energy quantities into power.

## Summary metrics and periods

Summary metrics are deliberately source-backed rather than inferred from tracks.
Each has editable `name`, `entity`, optional attribute `field`, `unit`, `icon`
and `color`. Missing numeric data displays “Source missing”; zero is preserved.
Units are labels and must match the source. Up to 12 metrics are supported.
An optional `rowId` (Published end in the visual editor) links a metric to a
timeline row's source endpoint, displayed alongside its value. This does not
recalculate the supplied metric. For example, name a battery metric “Battery at
published end” and link it to `soc` when its sensor describes that row's final
published interval, rather than implying it covers the entire visible horizon.
Rows and metrics check the entity's Home Assistant `last_updated` timestamp
against `maxAgeMinutes`. Stale or missing timestamps do not produce valid values.

Periods have editable `name`, `description`, `start`, `end` and their own metrics.
Start/end are elapsed-hour offsets from the timeline start, not wall-clock hours;
end must follow start (0–168). Periods are clipped to the visible horizon and
can be reordered. Period metric sources must already represent the intended
period: their values are not recomputed when the horizon changes.

Names, descriptions and entity-provided mode text remain user text, are escaped
by Lit, and are not translated as built-in UI labels. Built-in editor/presentation
labels use the repository's localization helpers and all accents use the shared
theme color resolver. Header interactions use the same Mushroom action handling
as existing cards; the timeline inspector itself never calls a device service.

## Minimal configuration

The following entity and field names are fictional placeholders:

```yaml
type: custom:mushroom-addition-energy-plan
name: Published prices
visibleHours: 24
energy_plan:
  horizon: published
  maxAgeMinutes: 1440
  rows:
    - id: prices
      name: Electricity price
      kind: price
      enabled: true
      icon: mdi:currency-usd
      color: amber
      entity: sensor.example_tariff
      adapter: attribute
      path: forecast
      startField: from
      endField: until
      valueField: rate
      unit: USD/MWh
      scale: 5
      low: 80
      high: 200
      lowColor: green
      highColor: red
      positiveLabel: ""
      negativeLabel: ""
      zeroLabel: ""
```

Its source sensor should expose a timestamped `forecast` array. For example, one
entirely synthetic interval might be:

```yaml
forecast:
  - from: "2031-04-12T10:00:00Z"
    until: "2031-04-12T11:00:00Z"
    rate: 125
```

Here, 125 is displayed as 125 USD/MWh, not converted to USD/kWh. These values
and dates are illustrative, not a recommendation or a current forecast.
Configure actual source fields through **Features** rather than copying
fictional entity IDs.

## Local synthetic showcase

Run `npm ci` and `npm run demo`, then open `/demo/energy-plan.html`.
The showcase renders both real registered energy cards and shared editors against an
in-memory fictional Home Assistant object. Its small selector shims are for the
browser demo only; production uses Home Assistant's native `ha-form` selectors.
The showcase makes no external requests or device service calls. The card does
not persist demo data into Lovelace configuration. Its native-like demo selectors
are explicitly shims, not bundled Home Assistant components or proof of a real
Home Assistant editing session.
