# Smart Saving

Smart Saving shows published electricity prices, a measured battery reading,
supplied battery forecasts and optional plan, applied-sale, EV and solar tracks.
It does not optimize schedules, execute actions, infer future battery levels,
or perform measured-energy accounting. Energy Plan remains a separate card.

## Use your own entities

Start with prices alone; no battery, solar or HEMS integration is required.
Find the entity containing published price intervals in **Developer tools →
States**, following the [source checklist](ENERGY_SETUP.md#find-your-entities-before-configuring-a-card).

1. Add **Mushroom Addition: Smart Saving** and open **Features**.
2. Select your price entity. Check the source type, array path, start/end or
   duration fields and price field against its actual attributes.
3. Enter the source unit and desired display denomination, keeping the same
   currency. Set Layout's visible hours to the period you want to inspect.
4. Save the card and compare one displayed interval with the original source.
   A shorter published forecast should show missing coverage, not invented prices.

For the fictional `forecast` array in [community setup](ENERGY_SETUP.md#published-prices),
this is a complete price-only configuration:

```yaml
type: custom:mushroom-addition-smart-saving
name: Electricity outlook
visibleHours: 24
horizon: published
price:
  entity: sensor.example_tariff
  adapter: attribute
  path: forecast
  startField: from
  endField: until
  priceField: rate
  sourceUnit: USD/MWh
  displayUnit: USD/kWh
```

In that example, a published value of 125 displays as 0.125 USD/kWh.
Replace the entity and mappings with your own. For JSON in the entity's state,
choose `adapter: state` and the path inside that JSON, or an empty path for a
root array. A current-price number without intervals is not sufficient.

Add optional sources one at a time in Features: measured battery percentage,
published battery forecast, solar intervals, schedule tracks and purchase
summaries. The current battery reading uses percent; forecast points need their
own timestamps and percentages. A measured reading cannot generate a forecast.
Use confirmed-action labels only for independently confirmed execution.

**If it is empty or reports an error:** verify entity availability, list path,
field names, timezone and units; check that intervals overlap the rolling
window and do not overlap each other. Check the price-specific age limit if
an otherwise valid feed is rejected. Missing optional equipment should remain
unconfigured, rather than pointing to a placeholder entity.

## Chart and layout

Price and battery plots have fixed pixel heights and HTML labels that do not
grow or shrink with an SVG. Labels, scales and schedule tracks remain aligned.
Time labels reduce from five to three in narrow containers without introducing
horizontal scrolling. Midnight markers, date labels, tooltips and price-period
boundaries use Home Assistant's timezone, including daylight-saving transitions.
Numbers follow Home Assistant's number format.
One shared time axis serves every plot and track. Tap or drag a plot, or use the
labelled time slider with the keyboard, to inspect the same timestamp across
prices, battery forecast and schedules. A selection line stays aligned in each
row. The inspector reports the containing price/schedule interval, and the
nearest **supplied** battery point inside a connected forecast segment, including
that point's actual timestamp. It does not interpolate a selected battery value
or bridge a forecast gap. End timestamps of price/schedule intervals are exclusive.

Prices are coloured relative to the **duration-weighted visible average**:
green at or below it, orange above it. This is not a profitability calculation.
Negative prices retain their own side of the zero baseline. The dotted battery
line is a supplied forecast; the current measured reading is a separate point,
not the start of an invented forecast. Targets and exact supplied horizon values
remain distinct.
The requested horizon is shown independently from the last supplied forecast
point's percentage and timestamp. The last supplied point is the source's actual
endpoint, even if outside the displayed window; it is not an inferred value at
the rolling horizon. Shared explanations are expandable.

Shaded price, battery and solar regions identify unpublished coverage, not zero
values. Battery points farther apart than the connection limit are not joined.
Schedule tracks only appear when configured; a valid schedule with no blocks in
the visible window says so. An empty schedule does not establish a forecast
coverage boundary. Price-period details and plan-block lists render only when
opened. Lists are paginated in groups of 50, with all accepted entries accessible.

## Settings

The shared visual editor retains Context, Content, Layout, Interactions and
Features. Visible hours are in Layout. Additional timeline settings are in
Features alongside the source mappings.

| Setting | Default | Meaning |
|---|---|---|
| `visibleHours` | `36` | Rolling window from now, greater than 0 and at most 168 hours. |
| `maxContentWidth` | `1200` | Centred content cap in pixels, 400–2400; `0` removes the cap. |
| `horizon` | `configured` | `published` ends the window at the latest valid published endpoint across configured sources, capped by visible hours. Internal and source-specific gaps remain visible. With no valid future endpoints, the configured window and empty states remain. |
| `maxSourceAgeMinutes` | `1440` | Warn when an entity's `last_updated` is older than this limit; range 1–10080. Set this for your sources' expected update cadence. |
| `forecastGapMinutes` | `60` | Maximum spacing between battery points that may be joined; range 1–1440. Set it to the publisher's documented cadence. The card does not infer a cadence. |

Freshness warnings **do not hide otherwise valid values**. Attribute-only
updates count through `last_updated`; a missing, invalid or future update time
is reported as unspecified. Literal configured values have no entity timestamp.
For differently paced sources, use a conservative shared warning threshold and
check each integration's source updates; an old timestamp alone cannot prove a
hardware reading is incorrect.
Override `maxSourceAgeMinutes` in `price`, `battery.current`,
`battery.forecast`, any `tracks` mapping, or other battery/summary value sources
to match independent update cadences. Unset overrides inherit the root setting.
Price, current-battery, forecast and track overrides are editable beside their
source controls. Relative update ages are shown next to each configured source.

Price, battery and solar rows report published and missing durations in the
visible window. Battery duration is the union of connected supplied-point
segments, **not** a count of points or proof of a forecast value at every time.
Valid supplied points immediately outside the window preserve boundary coverage;
unconnected spans remain missing. Coverage does not establish freshness.

Schedule tracks default to `meaning: supplied`, including the legacy `applied`
mapping, which is conservatively labelled Planned sale. Set `meaning: confirmed`
only when the source explicitly represents a confirmed applied action. The card
cannot verify execution from a schedule or from free-form status text. This
changes labels, not the source data. Optional `powerUnit` and `energyUnit` fields
label numeric schedule quantities in the inspector, tooltips and plan details.
Values already containing units remain intact; missing units are explicitly
unspecified rather than assumed. All controls are available in Features.

The rolling window and age warnings refresh every minute while connected.
Timers and the chart resize observer are removed when the card disconnects.

## Source contracts

HEMS is not required. Prices are the minimum input; batteries, forecasts,
plans, EVs and solar tracks are optional. The picker recognizes compatible
price arrays and JSON-state feeds by their structure, not entity names.
When none is available, it opens a valid setup state instead of choosing an
unrelated sensor. A battery percentage alone does not create a forecast plot.
See [community energy setup](ENERGY_SETUP.md) for shared examples.

Existing mappings remain supported: attributes or JSON state for prices,
nested field paths, explicit interval ends or duration in minutes, and
same-currency ISO currency/kWh, ISO currency/MWh and ct/kWh conversion.
For example, `sourceUnit: USD/MWh` and `displayUnit: USD/kWh` divide prices by
1000 without exchanging currencies. `currency: USD` identifies cents when
both source and display units are `ct/kWh`; otherwise the ISO unit determines
the currency. Existing unqualified cents default to EUR. Different source
and display currencies are rejected. Price-unit selectors accept custom ISO
currency units. A price-specific `maxSourceAgeMinutes` rejects stale price
data; the source's update status remains visible.
Use ISO timestamps with an explicit timezone or
numeric Unix timestamps in seconds/milliseconds.

Smart Saving now rejects a source rather than silently dropping invalid entries:

- Every interval needs a valid start, positive duration/end, and finite value.
  Overlapping or duplicate price, solar or schedule intervals invalidate that
  source. Adjacent intervals are valid.
- Every battery forecast point needs a unique timestamp and a value from 0 to
  100 inclusive. Current and target percentages outside this range are unavailable,
  not clamped into apparently valid percentages.
- Solar production cannot be negative. Sources cannot exceed 10,000 entries.
- A missing or unavailable entity is distinct from a valid empty array.
  Retained attributes on `unknown` or `unavailable` entities are not treated as
  current data. Configure a healthy publishing source.

These are intentional data-quality checks for Smart Saving.
Fix the publisher or field mapping if a previously partial-looking chart now
reports invalid data. Independent valid sources remain visible. Generic price
mappings on Buy and Sell and Home Energy Management also validate the whole
interval list; their legacy feed formats retain their existing parsers.

## Synthetic example

```yaml
type: custom:mushroom-addition-smart-saving
name: Smart Saving
entity: sensor.example_prices
visibleHours: 36
maxContentWidth: 1200
horizon: published
maxSourceAgeMinutes: 1440
forecastGapMinutes: 60
price:
  entity: sensor.example_prices
  path: prices
  startField: start
  endField: end
  priceField: price
  sourceUnit: EUR/kWh
  displayUnit: ct/kWh
  maxSourceAgeMinutes: 1440
battery:
  current:
    entity: sensor.example_battery_level
    maxSourceAgeMinutes: 10
  forecast:
    entity: sensor.example_battery_forecast
    path: forecast
    startField: time
    valueField: value
    maxSourceAgeMinutes: 60
  target:
    value: 80
```

The real-component showcase at `demo/energy-plan.html#smart-saving` uses only
fictional `sensor.example_smart_*` entities. It includes negative prices,
unpublished price gaps, a disconnected battery forecast and optional schedules,
with phone/section/wide controls, published-horizon fitting and a stale-source
example. It makes no Home Assistant requests and cannot control devices.
