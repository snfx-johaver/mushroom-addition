# Energy Home Energy Management

Use `custom:mushroom-addition-advanced-home-energy-management` to display
measured household/grid power, optional equipment readings and a published
tariff timeline. No HEMS integration, equipment brand or automatic controller
is required. The card does not optimize or execute a plan.

## Use your own entities

Start with household and grid power, then add only equipment you actually have.
Follow the [source checklist](ENERGY_SETUP.md#find-your-entities-before-configuring-a-card)
in your own **Developer tools → States**.

1. Add **Mushroom Addition: Energy Home Energy Management** from the picker.
2. Select the household-power entity in Context or its source control in
   Features. Select the grid-power entity in Features. These must be power
   sensors in W/kW/MW, not energy counters in Wh/kWh.
3. Set the grid's positive direction to match your meter. Keep phase, individual
   battery and tariff sections disabled until their sources are configured.
4. Save and compare both readings and the import/export direction with your
   original entities before adding more equipment.

This is a complete starter configuration using fictional sources:

```yaml
type: custom:mushroom-addition-advanced-home-energy-management
name: Household energy
entity: sensor.example_household_power
grid_power_entity: sensor.example_grid_power
energy_grid_positive: import
show_grid_phases: false
show_battery_units: false
show_tariff_timeline: false
```

Replace the entity IDs. Positive grid power means import in this example;
choose `energy_grid_positive: export` for the opposite convention.
Household, solar and charger consumption/generation readings must be
nonnegative. Missing or invalid configured readings show a dash, not zero.
This card reads entity states for these roles, not arbitrary power attributes;
Live Energy Flow supports explicit measured-attribute mappings.

## Optional equipment and status

Add these keys to the same card only when you have compatible sources:

| Key | Expected source |
| --- | --- |
| `solar_power_entity` | Measured solar generation in W/kW/MW |
| `solar_forecast_entity` | Numeric sensor state for today's expected solar energy, using the source's own unit |
| `battery_power_entity` | Signed measured battery power in W/kW/MW |
| `battery_level_entity` | Battery percentage, 0–100 |
| `energy_battery_positive` | `charge` (default) or `discharge`, matching the battery source |
| `ev_charger_power_entity` | Nonnegative charger consumption in W/kW/MW |
| `grid_phase_1_entity` through `grid_phase_3_entity` | Verified individual phase-power sensors; enable `show_grid_phases` |
| `battery_1_level_entity` / `battery_1_power_entity`, up to battery 3 | Individual battery percentage/power sensors; enable `show_battery_units` |
| `energy_mode_entity` | Existing reported strategy/mode |
| `energy_auto_control_entity` | Existing on/off automatic-control status |

Unconfigured optional readouts stay hidden. A displayed mode or automatic
status is not evidence that a charging schedule was executed. Do not select
unrelated entities just to fill every field. Household and EV meters may
overlap; the display does not establish a separately measured EV allocation.

## Add your own tariff feed

Edit the tariff source mapping (`tariff_price`) in Features and map your actual interval list. For the
fictional `forecast` list in [community setup](ENERGY_SETUP.md#published-prices),
add these keys to the same card:

```yaml
show_tariff_timeline: true
tariff_price:
  entity: sensor.example_tariff
  adapter: attribute
  path: forecast
  startField: from
  endField: until
  priceField: rate
  sourceUnit: USD/MWh
  displayUnit: USD/kWh
```

The source must publish starts, ends or duration in minutes, and numeric prices.
For JSON state, use `adapter: state` and the appropriate JSON path instead.
Same-currency denomination conversion is supported; currency exchange is not.
The legacy `electricity_price_entity` / `raw_today` mapping remains supported.

Optional `tariff_markup_entity` is a numeric markup in currency/kWh;
`tariff_vat_entity` is a percentage, such as 21 for 21%. The calculation is
`(base price + markup) * (1 + VAT / 100)`. Leave both unset for an already
all-in feed to avoid applying tax/markup twice. Configured unavailable helpers
block the tariff display instead of becoming zero. Price color thresholds
use currency/kWh even when a different chart denomination is selected.

## Troubleshooting

A dash means an unconfigured, unavailable, nonnumeric or unsupported reading,
not proof that equipment is idle. Check entity IDs and units against States.
If the tariff is missing, verify its list path, timestamps, fields, source
availability and any configured adjustment helpers. A single current-price
number cannot supply a future timeline.

The card uses live Home Assistant state updates; the power display is not a
Recorder history chart. Only explicitly configured shared header actions
retain their normal action behavior.
