# Energy Insights & Purchases

Choose **Mushroom Addition: Energy Insights & Purchases** in the Home Assistant
card picker. The card is in the existing bundle; no separate resource or data
service is installed. Defaults contain no entities or invented readings.

The card preserves the concept's two distinct reporting surfaces: measured
actuals (for example 00:00–12:00) and a supplied upcoming 24-hour purchase plan.
It is a viewer and accounting surface, not an optimizer, device controller or
recorder integration. Supply interval energy, not cumulative meter readings.

![Energy Insights and Purchases synthetic illustration showing two separate tab states, not a live Home Assistant screenshot](assets/energy-insights-example.svg)

The illustration shows measured and upcoming-plan tabs side by side for
comparison only. All figures are invented, not production fallbacks.

## Native configuration

The minimal shared editor adapter retains Context, Content, Layout, Interactions
and Features. There is no separate Energy Insights editor element. Under
**Features → Energy Insights & Purchases → Edit**, standard Home Assistant forms
and structured object selectors configure all settings. Native add/edit/delete
dialogs and drag ordering manage consumers; every object has explicit fields,
so no setting requires YAML or an unstructured object editor.

Native structured selector behavior is verified against released **Home Assistant
2026.11 / frontend 20261028.4**, the supported baseline for these editors.
See the [released selector implementation](https://github.com/home-assistant/frontend/blob/20261028.4/src/components/ha-selector/ha-selector-object.ts).
The local demo uses clearly identified shims, not an actual Home Assistant host.

Shared configuration includes the heading entity, name, icon, primary/secondary
information, supporting text, heading layout, multiline secondary text, card
shadow, fill-container behavior, and header tap/hold/double-tap actions.
The heading entity is independent of the two snapshot sources below.
Tabs support arrows/Home/End and native keyboard focus. Purchase rows select a
live-announced rationale. Tables have scroll containers on narrow dashboards;
colors and surfaces inherit the Home Assistant theme.

## Feature settings

All settings below live under `energy_insights`:

| Setting | Meaning |
| --- | --- |
| `actualSource`, `planSource` | Each has a sensor `entity`, attribute-object `path`, and optional structured `fields` mappings |
| `currency` | Optional ISO currency code; otherwise use Home Assistant's currency |
| `maxAgeMinutes` | Maximum snapshot/live source age, 1–10080 minutes; default 60 |
| `activeThreshold` | Active consumer threshold in W; default 50, strictly greater than |
| `sort` | `energy` (default) or `power` |
| `activeOnly` | Initial active-only filter; default false |
| `showHeader`, `showFlow`, `showConsumers`, `showPurchases`, `showForecasts` | Independent visibility controls, default true |
| `homeEntity`, `solarEntity`, `gridEntity`, `batteryEntity` | Optional live power sensors with W or kW units |
| `selfPoweredEntity` | Optional fresh percentage sensor for the home self-powered indicator |
| `consumers` | Up to 32 ordered consumer definitions |

Positive grid power means import; negative means export. Positive battery power
means charging; negative means discharge. Adapt source sensors to this convention.
Live power requires a fresh `last_updated`; unknown, unavailable, stale or
wrong-unit values are explicitly unavailable. No history is inferred from power.
The self-powered indicator is source-backed too: net grid power alone cannot
identify which imported energy feeds the home versus battery charging, so this
percentage is never guessed from those power readings.

A consumer has required `id` (unique), `name`, and `energyField`, plus optional
`icon`, `color`, live power `entity`, `baselineField`, `forecastField`, and
`strategyField`. Field paths are dot-separated paths inside the relevant
snapshot: measured/baseline fields use actuals, forecast/strategy fields use plan.
Missing optional mappings display “not supplied” or “comparison not configured”;
configured-but-invalid mappings reject that snapshot instead of inventing data.
Names and source-provided text are escaped by Lit and are never translated.
Built-in labels, explanations and native field labels use the repository's
33-locale translation catalogs. Source mapping paths remain unchanged. Numbers, currency and
time respect Home Assistant locale preferences and timezone.

## Measured snapshot contract

The default actual path is `actuals`. All numeric energy quantities are kWh;
rates are currency/kWh. Timestamps accept ISO timestamps with timezone or numeric
Unix seconds/milliseconds. Required properties:

| Field | Meaning |
| --- | --- |
| `start`, `end`, `generated_at` | Reporting window and snapshot publication time |
| `home_kwh`, `solar_kwh` | Measured household demand and production over exactly that window |
| `battery_charge_kwh`, `battery_discharge_kwh` | Separate AC battery input/output |
| `intervals` | Complete, non-overlapping metered interval list |
| `currency` | Optional source currency assertion; if present must match the configured/HA currency |
| `baseline_start`, `baseline_end` | Required when any comparison is configured; must exactly match actual start/end |

Each interval requires `start`, `end`, `import_kwh`, `export_kwh`, `rate`, and
`export_rate`. Explicit zero is valid, including for no export. Negative energy
is invalid; negative rates are supported. Intervals must cover the whole actual
window exactly. Gaps, duplicates, overlaps and missing prices reject the snapshot;
missing coverage is never priced at zero. Up to 10000 intervals are supported.
The actual window must not be in the future or older than the freshness limit.

Listed consumer energy may not exceed household demand (0.001 kWh tolerance).
The remaining demand is shown as **Unallocated home**, not an invented device.
Energy balance must reconcile:

`solar + import + battery discharge = home + battery charge + export`

The balance tolerance is the greater of 0.01 kWh and 1% of household demand,
to accommodate metering precision. Inputs must use comparable AC boundaries.
Battery charging is not added to household consumption.

Purchases are grouped by their exact unrounded rate. Import cost is the sum of
each interval's imported kWh × rate; export credit is calculated separately.
Weighted prices divide the respective total cost/credit by total import/export
energy. Zero denominators display “not applicable”. Net variable grid spend
is import cost minus export credit. Fixed charges are excluded. Device euro
costs are deliberately not inferred from grid-average prices.

## Supplied purchase-plan contract

The default plan path is `plan`. Its independent snapshot requires:

| Field | Meaning |
| --- | --- |
| `start`, `end`, `generated_at` | Upcoming horizon, exactly 24 elapsed hours, plus snapshot time |
| `home_kwh`, `solar_kwh` | Supplied forecasts for that same horizon |
| `battery_min`, `battery_reserve` | Supplied minimum SoC and reserve, both 0–100% |
| `charge_efficiency` | Supplied AC-to-stored charging efficiency, greater than zero and at most one |
| `blocks` | Ordered non-overlapping planned purchase windows; an empty list means no planned purchases |
| `currency` | Optional source currency assertion |

Each block requires `start`, `end`, `home_kwh`, `ev_kwh`, `battery_kwh`, `rate`,
`reason`, and `detail`; optional `target` is a supplied battery percentage.
Quantity is direct-home + EV + battery **AC input**. Cost is quantity × rate.
Stored energy is battery AC input × charge efficiency. Windows must be inside
the horizon, non-overlapping and have positive total quantity. Gaps between
purchases are normal and are not interpreted as missing measured coverage.

The home forecast includes EV demand but excludes home-battery charging.
Configured consumer forecasts may not exceed it. The card does not simulate
energy balance, derive targets, infer solar outside the supplied horizon, execute
purchases or make recommendations. A minimum below reserve stays visible as
negative headroom. Forecasts are never added to measured totals.

## Field mappings

Sources may use different property names. Native **Field mappings** forms expose
all canonical snapshot, interval and block fields. Unset mappings use the names
above. Snapshot mappings are relative to the selected source object; `interval_*`
and `block_*` mappings are relative to each list item. For example:

| Canonical mapping key | Fictional source path |
| --- | --- |
| `home_kwh` | `totals.home` |
| `intervals` | `readings` |
| `interval_import_kwh` | `grid.in` |
| `interval_rate` | `tariff.purchase` |
| `block_battery_kwh` | `allocation.storage` |

Consumer paths refer to the original snapshot object; source mappings do not
rename consumer data. All quantities remain kWh, rates remain currency/kWh, and
no currency/unit conversion is performed on supplied energy/rates.

## Missing and stale data

Actuals and plan validate independently; one failing source does not replace the
other. Unconfigured/unavailable entities show **Source missing**, expired
snapshots show **Stale data source**, and malformed contracts identify the failing
field. A future publication time beyond one minute is invalid/stale. A minute
timer refreshes freshness without requiring HA state changes and is disposed
when the card is removed. HA source, theme, locale and configuration changes
update the card; unrelated state changes do not force a redraw.

## Synthetic showcase and privacy

Run `npm run demo` and open `/demo/energy-plan.html` to view both real registered
cards against explicitly invented sensors and data. Its selector shims are
demo-only and do not demonstrate a real Home Assistant connection. Changes are
saved only in this browser's local storage; reset restores the fictional examples.
No live accounts, external data services or service calls are used.

All examples use `sensor.example_*` placeholders. Do not copy household URLs,
device names, real entity IDs or credentials into source code or review material.
No secrets, machine-specific paths or home settings are required by either card.
