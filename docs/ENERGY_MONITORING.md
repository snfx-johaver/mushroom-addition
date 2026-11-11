# Energy monitoring cards

Four independent cards complement Energy Plan, Energy Insights & Purchases and
Smart Saving. They do not operate devices, save forecasts, create sensors or
repair missing Recorder data.

| Card | Type | Required sources |
|---|---|---|
| Energy Plan vs Actual | `custom:mushroom-addition-energy-plan-actual` | Externally retained pre-period forecast and a cumulative energy counter for the same electrical quantity |
| Energy Battery Activity | `custom:mushroom-addition-battery-activity` | Signed battery power; optional measured SoC and separate cumulative charge/discharge counters |
| Energy Electricity Cost Timeline | `custom:mushroom-addition-electricity-cost-timeline` | Cumulative import/export counters and recorded import/export tariffs, or an explicit fixed export tariff |
| Energy Live Energy Flow | `custom:mushroom-addition-live-energy-flow` | Measured solar, grid, home, EV and battery power, with explicit absence declarations for equipment not installed |

Use the standard **Context**, **Content**, **Layout**, **Interactions** and
**Features** editor sections. The shared Name, Primary information, Secondary
information, icon and header actions work like other Mushroom Addition cards.
Electrical mappings are nested native object selectors under **Features**;
select the entity and, only if needed, a dotted attribute `field`. A Context
entity changes the header, not its electrical role. Picker stubs intentionally
leave electrical roles unassigned rather than guessing from entity names.

All examples below are fictional; replace every `sensor.example_*` mapping with
a verified source. A source must describe the boundary and units specified here.
Nothing about a particular installation is built into these cards.

## Energy Plan vs Actual

This compares **energy**, not instantaneous power or monetary costs. The
comparison window is today so far in Home Assistant's time zone, including
23/25-hour DST days. Choose a single nonnegative electrical quantity, such as
home consumption, solar generation or imported energy. The baseline and actual
counter must represent that same quantity, boundary and unit.

```yaml
type: custom:mushroom-addition-energy-plan-actual
name: Home demand - plan and actual
energy_monitor:
  actualEnergy:
    entity: sensor.example_home_energy_total
    sourceType: hardware
  baseline:
    entity: sensor.example_retained_forecast
    path: intervals
    generatedField: generated
    startField: start
    endField: end
    valueField: energy
    unit: kWh
```

The retained forecast entity's **attributes** must contain a structure like:

```json
{
  "generated": "2031-04-11T22:00:00Z",
  "intervals": [
    { "start": "2031-04-12T00:00:00Z", "end": "2031-04-12T01:00:00Z", "energy": 0.6 },
    { "start": "2031-04-12T01:00:00Z", "end": "2031-04-12T02:00:00Z", "energy": 0.7 }
  ]
}
```

`energy` is the interval's **total**, not a power reading. `unit` accepts `kWh`
or `Wh`. Timestamps accept ISO offsets or epoch seconds/milliseconds; explicit
ISO offsets are recommended. Custom mapping paths are relative to the entity's
attributes; interval field paths are relative to each interval.

The snapshot must have been generated **at or before local midnight**, and its
intervals cannot predate its generation timestamp. A later planner revision is
rejected even when it contains earlier timestamps. The card cannot verify that
an external system truthfully retained the original forecast; retaining an
immutable, accurately timestamped snapshot is that system's responsibility.
It never uses the current plan as a historical baseline or browser-local
storage as a substitute.

Only overlapping supplied forecast and valid measured intervals contribute to
Planned, Measured and Difference. Difference is measured minus planned, not
automatically savings. Energy is apportioned by duration when boundaries differ;
the actual timing within a counter interval is unknown. Matched and missing
durations, the retained generation timestamp and all intervals remain visible.
Absent, revised, empty, malformed or overlapping baselines show an explicit
missing/invalid-baseline state instead of fabricated comparisons.

## Energy Battery Activity

```yaml
type: custom:mushroom-addition-battery-activity
energy_monitor:
  battery: { entity: sensor.example_battery_power }
  batteryPositive: charge
  soc: { entity: sensor.example_battery_level }
  chargeEnergy: { entity: sensor.example_battery_charge_total }
  dischargeEnergy: { entity: sensor.example_battery_discharge_total }
  maxAgeMinutes: 15
  maxGapMinutes: 30
```

Power accepts `W`/`kW`, SoC accepts `%` between 0 and 100. Set `batteryPositive`
to `discharge` for a source with the opposite polarity. Displayed and recorded
signed power is normalized to **positive charging / negative discharging**.
Live power and SoC have a configurable freshness limit. Unknown, unavailable,
invalid-unit, future-dated and stale live sources remain unavailable.

Power and SoC share **one chart and time axis**: charging/discharging bars use
the signed kW axis on the left, while a distinct stepped SoC line uses the fixed
0-100% axis on the right. Power bars are duration-weighted; the SoC line holds
each recorded state until the next validated observation, never a forecast.
Opposite power directions within a chart bucket are kept separate rather than
cancelled. Both series retain their own gap markers and unavailable intervals.
Unavailable samples, gaps exceeding `maxGapMinutes`, and an unreported trailing
interval are not connected. Recorder often stores only changes: an unchanged
source may therefore have sparse history, and this conservative gap policy may
show missing coverage. Raise the limit only when that assumption is appropriate.
Historical observations can remain visible even if the current live source is
unavailable; daily counter totals are rechecked against current source health.

Charged today and Discharged today require their own cumulative counters. The
card does **not** integrate power to invent those totals, infer battery health,
calculate cycles or claim a round-trip efficiency from incomparable flows.
Missing counters do not suppress a valid power/SoC plot.

## Energy Electricity Cost Timeline

```yaml
type: custom:mushroom-addition-electricity-cost-timeline
energy_monitor:
  importEnergy: { entity: sensor.example_import_total }
  exportEnergy: { entity: sensor.example_export_total }
  importRate: { entity: sensor.example_import_tariff }
  exportRate: { entity: sensor.example_export_tariff }
  currency: EUR
```

Cumulative counter changes are priced using recorded tariffs over the same
period. Counters accept `Wh`, `kWh` or `MWh`, with `total`/`total_increasing`
metadata when provided. Tariffs must have a supported currency-per-energy unit,
such as `EUR/kWh` or `ct/kWh` for EUR. Currency defaults to HA's configured
currency; `currency` explicitly overrides it with an ISO code.

Instead of `exportRate`, set `fixedExportRate` in currency/kWh for a known fixed
feed-in tariff. Do not configure both. If the installation has **no exporting
equipment**, set `exportEnergy: { absent: true }`; this explicitly makes export
credit zero. Missing export tariffs are **not** zero revenue: export credit and
net cost stay unavailable while valid import costs remain visible.

Net cost is import cost minus export credit. Negative tariffs are supported.
Credits are plotted with a negative sign; negative tariffs may reverse either
series. Import/export tariff coverage is tracked separately so a known import
series cannot fill a missing export series with zeroes. Interval tables use the
same signed values as the chart; summary Export credit is the earned credit.
These are interval-based estimates, not a utility invoice. Fixed fees and taxes
are included only when the supplied rates include them.

## Energy Live Energy Flow

```yaml
type: custom:mushroom-addition-live-energy-flow
energy_monitor:
  solar: { entity: sensor.example_solar_power }
  home: { entity: sensor.example_home_power }
  grid: { entity: sensor.example_grid_power }
  gridPositive: import
  battery: { entity: sensor.example_battery_power }
  batteryPositive: charge
  ev: { entity: sensor.example_ev_charger_power }
  # Optional: dedicated source-to-EV measurements, not total charger power.
  solarToEv: { entity: sensor.example_solar_to_ev_power }
  batteryToEv: { entity: sensor.example_battery_to_ev_power }
  maxAgeMinutes: 15
```

Power accepts `W`/`kW`. Solar generation and home consumption must be
nonnegative. Grid is normalized positive importing/negative exporting; battery
is normalized positive charging/negative discharging. Verify both sign
conventions and the electrical boundaries before interpreting the arrows.

The card uses a bundled, generated **3D-rendered illustration** of a house,
solar panels, utility grid, EV/charger and home battery. This is a fixed
architectural scene, not a reconstruction of an installation or a remotely
loaded image. Live HTML readouts and SVG power routes are layered separately;
the illustration never supplies readings. Shaded, highlighted cables follow
the courtyard to physical connection points. Grid, solar and battery cables
connect directly to the house's connection cabinet, rather than a detached
diagram junction. The house-to-charger cable routes around the vehicle.

Animated particles show the measured direction of each boundary flow. Grid
import and battery discharge travel toward the house; grid export travels
from the house to the grid, and battery charging from the house to the battery.
Higher measured power
increases particle speed qualitatively, not as a calibrated physical velocity.
Zero, stale, unavailable, invalid or explicitly absent sources never animate.
Reduced-motion preferences stop movement while retaining static readings and
direction labels. On narrow cards, readable source labels move below the scene
rather than shrinking with the image.

`ev` maps a separate, nonnegative **charger power** sensor; V2G/exporting EV
readings are not supported. EV power is never automatically added to or
subtracted from home consumption. A home meter or the full-site balance often
already includes charging, so adding it would double-count the car. Verify
the measurement boundaries before interpreting either number.

Optional `solarToEv` and `batteryToEv` sources add direct solar-to-charger and
battery-to-charger cables. These require **dedicated, separately measured,
nonnegative power sensors** in W/kW, or matching measured attributes selected
with `field`. A total PV, battery or EV sensor does not establish these
allocations and must not be used as a substitute. Nothing is inferred from
source totals, sensor names, charging state or simultaneous generation.

An unconfigured optional route is hidden. A configured route with a missing,
stale, invalid, unavailable or zero reading never animates; its independent
reading/status remains visible below the scene. The same freshness limit
applies to all power sensors. A healthy dedicated route can remain visible
when another boundary sensor is unavailable. Equipment declared `absent`
cannot be used in a direct EV mapping.

These are informational submeasurements, not additional loads: they never
change the home total, home derivation or site-balance calculation. Main
source readouts still show their full boundary totals; do not sum them with
the direct-route readings. The house represents the site's connection point,
not a claim that all generation is consumed inside the building.

Only explicitly declared `solar: { absent: true }`,
`battery: { absent: true }` or `ev: { absent: true }` equipment contributes a known zero. Unconfigured,
unavailable, stale or invalid sources stay unknown. Individual node update
timestamps remain visible. Main cables show **boundary directions**, not
unmeasured allocations such as how much solar specifically charges the
battery. Only explicitly mapped direct EV cables show source-to-load
measurements; other source allocations are never invented.

Use a direct household-power source whenever available. Alternatively, omit
`home`, enable `deriveHome: true`, and explicitly set
`homeBoundary: excludes_battery_charging` **after verifying the boundary**.
Then household power is calculated from solar + grid - battery. Missing inputs
block calculation; impossible negative balances and a mismatch between measured
inputs are reported rather than silently made plausible. Asynchronous samples,
conversion losses and differently placed meters can legitimately disagree; a
warning is not proof of a faulty device.

## History, assumptions and rendering

The three history cards request Recorder data, plus a one-hour midnight
lookback, outside rendering. Read-only history needs normal HA access and
Recorder inclusion for each selected entity, including rate history. Requests
are cached for 15 minutes, time out after 30 seconds, and are invalidated on
configuration, connection or HA day/time-zone changes. Superseded results are
discarded; failures provide a Retry button. Requests are bounded to eight
entities, 50,000 rows per entity and 100,000 rows overall.

Counter accounting reuses Energy Insights' conservative rules: a missing
midnight baseline, unavailable episode, decrease/reset, conflicting timestamp,
unsupported unit or inconsistent current endpoint invalidates that counter,
not unrelated sources. Power-integral counters are allowed but never repaired
through outages. Hardware-gap recovery is deliberately not available here.

The latest captured cumulative reading is held through the common snapshot
endpoint; unchanged readings are not simultaneous physical measurements.
Midnight baselines carried from before midnight and duration-proportional
tariff splits are disclosed as approximations under **Data quality**. Configure
continuous source history rather than treating a chart as recovery of missing
energy. See [Energy Insights accounting](ENERGY_INSIGHTS.md) for shared details.

Charts use up to 48 buckets: energy/cost is summed by duration overlap;
power is duration-weighted; the battery SoC overlay follows recorded states.
Full source/comparison intervals remain in lazy
tables with 100-row pagination. Shared theme colors, locale-aware numbers,
HA-zone times and responsive labels avoid scaling text with chart SVGs.
`maxContentWidth` caps centered content (default 1200 px, 400-2400 px, or 0
for no cap). No device service calls are issued by these cards; explicitly
configured shared header actions retain their normal behavior.

Run `npm run demo -- --port 4174`, then open
`/demo/energy-plan.html#energy-monitors` for a synthetic showcase with missing
baseline, battery-history-gap and stale-power controls, plus charging, export,
battery-discharge and idle live-scene modes.
