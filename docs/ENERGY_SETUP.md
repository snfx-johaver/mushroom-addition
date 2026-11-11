# Community energy setup

All seven cards work without HEMS. They display your chosen Home Assistant
entities and published data; installing a card does not install a price
integration, create forecasts or execute a charging schedule.

| Card | Minimum input | Optional inputs |
| --- | --- | --- |
| [Smart Saving](SMART_SAVING.md#use-your-own-entities) | Published electricity-price intervals | Battery percentage, battery/solar forecasts, schedules and purchase summaries |
| [Energy Plan](ENERGY_PLAN.md#use-your-own-entities) | At least one configured interval row | Independent price, power, battery and equipment rows from different entities |
| [Energy Live Energy Flow](ENERGY_MONITORING.md#use-your-own-entities) | Verified measured power sources for the boundaries you want to display | Solar, battery, EV and dedicated source-to-EV measurements |
| [Energy Home Energy Management](ENERGY_HOME_MANAGEMENT.md) | Household/grid power sources for the readings you want to display | Solar, battery, individual battery units, grid phases, EV, tariff intervals and strategy status |
| [Energy Buy and Sell](ENERGY_BUY_SELL.md) | Published price intervals or a compatible legacy `slots` feed | An explicitly enabled price-only trade estimate with your own energy, power, efficiency and fee assumptions |
| [Energy Log](ENERGY_LOG.md#use-your-own-entities) | User-selected state/attribute changes or an existing structured log feed | Recorder history, multiple categories and multiple sources |
| [Energy Entityworkflow](ENERGY_WORKFLOW.md#use-your-own-entities) | Your own entity rows | User-authored groups, nodes and relationships |

No battery, solar panels, heat pump, EV, three-phase supply, particular
equipment brand or particular tariff provider is required.

## Find your entities before configuring a card

Open **Developer tools → States** in your own Home Assistant. For each source,
check its entity ID, current state, attributes, unit and update time. The
friendly name is not the entity ID. Inspect the actual list structure rather
than assuming another integration uses the same fields.

Use power sensors in W/kW/MW for live flow, not cumulative energy counters in
Wh/kWh. A current price sensor with a single number is not a future price list.
For prices and plans, identify the list path, start/end fields, numeric value
field, units and timezone. For a log, decide whether to track changes to an
entity or read a list of events already published by an integration.

Every `example_*` entity and payload below and in the linked guides is fictional.
Replace the IDs with your own existing entities. Payload examples describe
attributes an integration might publish; they are not sensor-creation YAML.
Their dates are illustrative: your real intervals must overlap the selected
window. Changing an entity state in Developer tools is not a persistent feed.
Do not post your configuration exports, tokens, private URLs or screenshots
of real states when requesting help; provide a small redacted sample instead.

## First use

1. Add the card from the picker.
2. Confirm any automatically selected price source and its units. Selection
   uses available data shapes, not installation-specific entity names.
3. Configure sources and field mappings under **Features**. Assign electrical
   roles manually; a sensor being a power sensor does not identify its boundary.
4. Add only the optional rows/equipment you actually have.

Without a compatible source, the cards show setup guidance rather than inventing
an entity or substituting zero readings. New Energy Plan cards only enable rows
with supplied data. New Home Energy Management cards leave electrical roles
unassigned and hide unconfigured optional equipment. New workflows never invent
relationships between unrelated entities. Existing saved configurations remain
supported; these picker changes do not rewrite dashboards.

## Published prices

Smart Saving, Buy and Sell and Home Energy Management accept a structured price
mapping, called `price` on the first two cards and `tariff_price` on the third.
Energy Plan has equivalent per-row mapping fields under `energy_plan.rows`.

The picker recognizes attribute arrays such as `prices`, `raw_today`,
`raw_tomorrow` and price-bearing `plan` arrays, plus JSON-state arrays.
Recognized fields include `start`/`end`, `from`/`to`, or
`start_time`/`end_time`, with `price`, `value` or `total`. Explicit interval
ends or numeric `duration` in minutes are required. Selection requires a
nonempty valid source; it does not guess a slot length from point timestamps.
This is bounded format detection, not automatic support for every integration.
One mapping selects one array; separate daily arrays are not automatically merged.

Use explicit mappings for other shapes. For example, an integration might publish
this **fictional** `sensor.example_tariff` attribute:

```yaml
forecast:
  - from: "2031-04-12T10:00:00Z"
    until: "2031-04-12T11:00:00Z"
    rate: 125
```

Its source unit is USD/MWh. Configure Smart Saving like this:

```yaml
type: custom:mushroom-addition-smart-saving
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

For Buy and Sell, use the same `price` object with
`type: custom:mushroom-addition-advanced-energy-buy-and-sell`.
For Home Energy Management, use the same object as `tariff_price` with
`type: custom:mushroom-addition-advanced-home-energy-management`.
These mappings are available as structured native object selectors in Features.
The legacy Home Energy Management `electricity_price_entity` with `raw_today`
and Buy and Sell tuple-based `slots` feeds remain supported.

For JSON-state lists use `adapter: state`; leave `path` empty for a root array.
Starts/ends accept ISO timestamps with a timezone or Unix seconds/milliseconds.
Malformed or overlapping generic intervals reject the source rather than
silently removing corrupt rows. Missing intervals are never zero-priced.

## Currency and units

Price sources accept ISO currency/kWh, ISO currency/MWh and `ct/kWh`.
For example, 125 USD/MWh becomes 0.125 USD/kWh, or 12.5 cents/kWh.
This changes energy denomination, **not currency**; USD-to-EUR requests fail
explicitly. Set `currency: USD` when both source and display use `ct/kWh`;
otherwise the ISO unit identifies the currency. Legacy unqualified cents use EUR.
Price-unit controls accept custom ISO currency units.

Energy Plan displays values in each row's supplied unit. Changing a row's
unit label does not convert the numeric values.

Buy/Sell trade estimates use currency/kWh for prices and feed-in fees and the
currency itself for costs/revenue, regardless of the graph's display unit.
Generic intervals retain their supplied durations. `buy_sell_slot_minutes`
is a fallback for legacy point slots, not a replacement for published ends.
New cards keep the estimate disabled until you choose to enable and configure it.
The estimate does not enforce buying before selling, battery capacity or
available charge, and must not be used as an executable battery plan.

Home Energy Management tariff markup and thresholds use currency/kWh.
Tariff markup/VAT helpers are optional; do not apply them again to an already
all-in price feed. Configured but unavailable markup/VAT helpers block the
tariff display instead of silently becoming zero. Confirm these rules before
changing an existing mapping.

## Measured power and optional equipment

Assign verified sources, for example:

```yaml
type: custom:mushroom-addition-advanced-home-energy-management
entity: sensor.example_household_power
grid_power_entity: sensor.example_grid_power
energy_grid_positive: import
```

Household/grid power can be used without solar, batteries, EVs, individual
battery units, tariff feeds or strategy-control helpers. Unconfigured optional
readouts are hidden; configured unavailable readings display a dash, not zero.
`energy_battery_positive: charge` is the default battery convention; choose
`discharge` when the source reports discharging as positive.

Home Energy Management reads power in W/kW/MW. Live Energy Flow normalizes those
units to kW and additionally supports measured attributes with an explicit unit:

```yaml
type: custom:mushroom-addition-live-energy-flow
energy_monitor:
  home: { entity: sensor.example_household_power }
  grid: { entity: sensor.example_meter, field: power, unit: W }
  gridPositive: import
  solar: { absent: true }
  battery: { absent: true }
  ev: { absent: true }
```

Declare `absent: true` only for equipment you know is not installed. An
unconfigured source is unknown, not absent. Direct solar/battery-to-EV paths
require separate measured allocations; they are never derived from totals.

## History, forecasts and relationships

Energy Log works with any supported user-selected entity. Persistent change
history requires Home Assistant Recorder to retain the selected states and
attributes; no separate log sensor or HEMS automation is required.

Current power readings and battery percentages do not become forecasts by
themselves. Bring published forecasts/plans from an integration or your own
automation. Entityworkflow only displays the relationships you define; it
does not discover or execute a control system.

Detailed guides: [Smart Saving](SMART_SAVING.md), [Energy Plan](ENERGY_PLAN.md),
[Live Energy Flow](ENERGY_MONITORING.md), [Energy Log](ENERGY_LOG.md) and
[Entityworkflow](ENERGY_WORKFLOW.md), plus
[Home Energy Management](ENERGY_HOME_MANAGEMENT.md) and
[Buy and Sell](ENERGY_BUY_SELL.md). Examples and regression tests use
fictional entities and contain no live Home Assistant configuration.
