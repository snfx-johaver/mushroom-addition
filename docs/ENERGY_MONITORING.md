# Energy Live Energy Flow

This read-only card complements Energy Plan, Energy Log and Smart Saving.
It shows measured power, not forecasts or device controls.

Use the standard **Context**, **Content**, **Layout**, **Interactions** and
**Features** editor sections. The shared name, information, icon and header
actions work like other Mushroom Addition cards. Electrical settings appear
directly under **Features**, with native source selectors. Select the entity
and, only if needed, a dotted attribute `field`. A Context entity changes the
header, not its electrical role. Picker stubs leave electrical roles unassigned
rather than guessing from entity names.

The following example is fictional. Replace every mapping with a verified source.

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

## Rendering and refresh

The card uses live Home Assistant states; it does not request Recorder history.
Freshness is rechecked every minute, including when a source stops updating.
Numbers follow Home Assistant's locale preferences and update times follow its
time zone. `maxContentWidth` caps centered content (default 1200 px, 400-2400 px,
or 0 for no cap). No device service calls are issued by the live scene; explicitly
configured shared header actions retain their normal behavior.

Run `npm run demo -- --port 4174`, then open
`/demo/energy-plan.html#energy-monitors` for synthetic charging, export,
battery-discharge, idle and stale-power scene modes.
