# Mini Graph Card

The integrated Mini Graph Card is a Mushroom-styled, fully graphical
implementation of the public
[kalkih/mini-graph-card](https://github.com/kalkih/mini-graph-card)
configuration surface. It uses Home Assistant's recorder WebSocket API directly;
the standalone `mini-graph-card` resource is not required.

Add **Mushroom Addition: Mini Graph Card** from the dashboard card picker. The
editor groups configuration into Context, Content, Layout, Interactions, and
Features. Closed option sets use dropdowns, while graph entities, color
thresholds, and state maps use ordered add/remove/reorder controls.

## Supported features

- Line and bar graphs, solid/faded fill, points, labels, legend, average, and extrema
- Multiple entities with per-series names, colors, units, attributes, aggregation,
  visibility, smoothing, fixed values, state indicators, and primary/secondary axes
- Recorder history fetching, configurable refresh intervals, and local caching
- Dynamic interval, hourly, and daily grouping
- Average, median, minimum, maximum, first, last, sum, delta, and difference aggregation
- Hard and soft primary/secondary bounds with minimum axis ranges
- Smooth or hard threshold transitions with interpolated threshold stops
- Non-numeric state maps, nested attribute paths, and value-factor scaling
- Decimal, 12/24-hour, header/icon/state alignment, logarithmic, smoothing, and animation options
- Home Assistant tap, hold, and double-tap actions

## Examples

### Single entity

```yaml
type: custom:mushroom-addition-mini-graph-card
entities:
  - sensor.illumination
```

### Alternative line style

```yaml
type: custom:mushroom-addition-mini-graph-card
entities:
  - sensor.illumination
align_icon: left
align_state: center
show:
  fill: false
```

### Multiple entities and legend

```yaml
type: custom:mushroom-addition-mini-graph-card
name: SERVER
icon: mdi:server
entities:
  - entity: sensor.server_total
    name: TOTAL
    show_legend_state: true
  - entity: sensor.server_sent
    name: SENT
  - entity: sensor.server_received
    name: RECEIVED
show:
  legend: true
```

### Bar chart

```yaml
type: custom:mushroom-addition-mini-graph-card
name: ENERGY CONSUMPTION
entities:
  - entity: sensor.energy_consumption
show:
  graph: bar
```

### Past week with daily aggregation

```yaml
type: custom:mushroom-addition-mini-graph-card
name: Energy consumption
entities:
  - entity: sensor.energy_daily
    aggregate_func: max
hours_to_show: 168
points_per_hour: 0.25
group_by: date
show:
  graph: bar
```

### Minimum, maximum, and average series

```yaml
type: custom:mushroom-addition-mini-graph-card
name: Outside temperature
hours_to_show: 168
group_by: date
entities:
  - entity: sensor.outside_temperature
    aggregate_func: max
    name: Max
    color: "#e74c3c"
  - entity: sensor.outside_temperature
    aggregate_func: min
    name: Min
  - entity: sensor.outside_temperature
    aggregate_func: avg
    name: Average
    color: "#4caf50"
```

### Graph only

```yaml
type: custom:mushroom-addition-mini-graph-card
entities:
  - sensor.humidity
show:
  icon: false
  name: false
  state: false
```

### Dynamic threshold colors

```yaml
type: custom:mushroom-addition-mini-graph-card
entities:
  - sensor.temperature
show:
  labels: true
color_thresholds_transition: smooth
color_thresholds:
  - value: 20
    color: "#f39c12"
  - value: 21
    color: "#d35400"
  - value: 21.5
    color: "#c0392b"
```

Intermediate values may be omitted and are interpolated between surrounding
stops:

```yaml
color_thresholds:
  - value: 0
    color: "#ff0000"
  - color: "#ffff00"
  - color: "#00ff00"
  - value: 4
    color: "#0000ff"
```

### Secondary Y-axis and fixed value

```yaml
type: custom:mushroom-addition-mini-graph-card
entities:
  - entity: sensor.verandah_temperature
    name: Verandah
  - entity: sensor.lounge_temperature
    name: Lounge
  - entity: input_number.night_temperature
    name: Night
    color: "#808080"
    fixed_value: true
    show_line: false
    show_points: false
    show_legend: false
    y_axis: secondary
show:
  labels: true
  labels_secondary: true
```

### Non-numeric states

```yaml
type: custom:mushroom-addition-mini-graph-card
entities:
  - binary_sensor.window
state_map:
  - value: "off"
    label: Closed
  - value: "on"
    label: Open
```

### Nested attributes

```yaml
type: custom:mushroom-addition-mini-graph-card
entities:
  - entity: sensor.air_quality
    attribute: measurements.pm25
    name: PM2.5
```

### Bounds, logarithmic scale, and statistics

```yaml
type: custom:mushroom-addition-mini-graph-card
entities:
  - sensor.network_throughput
lower_bound: "~0"
upper_bound: "~1000"
min_bound_range: 100
logarithmic: true
show:
  average: true
  extrema: true
```

### Cache and fixed polling interval

```yaml
type: custom:mushroom-addition-mini-graph-card
entities:
  - sensor.power
cache: true
update_interval: 60
```

The card accepts the original `custom:mini-graph-card` option names, except the
card `type`, which uses this repository's namespaced registration:
`custom:mushroom-addition-mini-graph-card`.
