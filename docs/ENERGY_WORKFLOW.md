# Energy Entityworkflow

Choose **Mushroom Addition: Energy Entityworkflow** in the Home Assistant card picker,
or use `custom:mushroom-addition-energy-entityworkflow`.

Define a sequential process or a network of directed relationships between
entities. Nodes can contain multiple live entity states or attribute rows,
with labels, icons, colors and explanatory notes. This is a **definition and
visualization card**, not an execution engine, calculator, ontology reasoner,
or text-to-diagram service. It does not call services, fetch external data,
or create sensors. Home Assistant automations remain responsible for execution.

## Use your own entities

Start with one node displaying an existing entity. No planner, forecasts,
Recorder history or HEMS installation is required.

1. Find an entity ID and any attribute you want to show in **Developer tools →
   States**, using the [source checklist](ENERGY_SETUP.md#find-your-entities-before-configuring-a-card).
2. Add **Mushroom Addition: Energy Entityworkflow**. In Features, edit the input
   node and select the entity for its row.
3. Add more nodes only when useful. Create groups for your own presentation,
   then explicitly add relationships between node IDs when they reflect your
   intended model.
4. Save. Compare the displayed state with Home Assistant more-info; opening a
   row is informational, not execution of a workflow step.

This complete minimal example has no invented dependencies:

```yaml
type: custom:mushroom-addition-energy-entityworkflow
name: Household measurement
presentation: sequential
groups: []
nodes:
  - id: household
    label: Household power
    entities:
      - entity: sensor.example_household_power
        label: Measured consumption
relations: []
```

Replace the entity ID with your own. To show an attribute, add `attribute`
to the entity row using its exact attribute name. Set a row's `unit` only
when it matches the value; this changes a suffix, not the underlying number.

**If a row is unavailable:** check the entity ID and attribute name. If saving
reports a reference error, ensure node/group IDs are unique and relationships
point to existing node IDs. A diagram does not calculate missing values,
discover a controller or confirm that a proposed action actually happened.

## Visual editor and saving

The visual editor uses the shared Context, Content, Layout, Interactions and
Features sections. Groups, Nodes and Relationships are kept together in Features:

- Choose **Sequential process** or **Relationship graph** in Layout, and Name
  and Primary/Secondary information in Content.
- Add named groups and move them up/down to define the process order.
- Add nodes, assign a group, and select entities for their rows. An optional
  attribute reads that exact attribute, rather than the entity's state.
- Add directed relationships by selecting source and target nodes and a label.
  Branches, cycles and self-relations are allowed.

The editor uses native Home Assistant entity/icon selectors and emits standard
Lovelace `config-changed` events. Save the dashboard/card normally to persist
the configuration. No separate storage, account or backend is required.

Group and node IDs must be non-empty and unique within their respective lists.
Relationships must reference node IDs; node groups must reference group IDs.
Renaming an ID updates references. Removing a node removes its relationships;
removing a group leaves its nodes ungrouped. Node order defines order within
each group. Ungrouped nodes appear after the configured groups.

Incomplete edits, such as a new row with no selected entity, show an explicit
error and are not emitted as a saved configuration until corrected. YAML
configuration is validated by the card too; invalid references are not hidden.
The picker starts with one input node and no inferred relationships. It can
select a compatible energy entity or a healthy entity explicitly supplied to
the picker; otherwise it shows setup guidance. Add your own entities, groups
and relationships. No HEMS integration or planner is required. Existing saved
graphs remain unchanged. See [community energy setup](ENERGY_SETUP.md).
The examples below contain **synthetic placeholder IDs**, not
personal installation data.

## Configuration

| Field | Meaning |
|---|---|
| `type` | `custom:mushroom-addition-energy-entityworkflow` |
| `name` | Shared Mushroom card heading; source `title` is also accepted |
| `presentation` | `sequential` (default) or `graph` |
| `groups` | Ordered list of `{ id, label, color? }` |
| `nodes` | Non-empty ordered list of `{ id, label, group?, icon?, color?, note?, entities? }` |
| `nodes[].entities` | Ordered rows of `{ entity, label?, attribute?, icon?, unit? }` |
| `relations` | Directed edges of `{ from, to, label?, color? }` |

Colors are CSS colors such as `#42a5f5`, `teal`, or `var(--primary-color)`.
A node inherits its group color unless overridden. Entity states use Home
Assistant's state formatter; a `unit` overrides the displayed unit. Attributes
are displayed as text (structured attributes as JSON); they do not automatically
inherit the state unit. Use `unit` for an attribute only when appropriate.

Missing entities show **Entity unavailable** and cannot open more-info.
Unknown/unavailable states are displayed without substituting old attribute
values or zero. Missing attributes show **Attribute unavailable**. Clicking
an existing entity row opens Home Assistant more-info; it never executes a
workflow step. Changes to the Home Assistant state snapshot refresh every row.

Sequential groups wrap on smaller dashboards and stack on narrow cards.
Group order indicates process order, not automatic execution or an inferred
relationship. Explicit relationships are listed below the groups in both
presentations. Graph mode places groups in ordered columns and draws directed,
labeled connectors between the actual node bounds; its canvas scrolls
horizontally on narrow dashboards. Backward and self-relations use outer
routes. The relationship list also provides a readable, accessible alternative
to the diagram. This is an ordered layout, not a draggable/free-position graph.

## Energy process example

**Input → Calculation → Plan → Execution** keeps a proposed plan separate
from confirmed execution. Replace every `sensor.example_*` ID with an existing
entity in your installation. The card only displays these values: calculations,
forecasts, schedules and execution confirmation must already exist in HA.

```yaml
type: custom:mushroom-addition-energy-entityworkflow
name: Energy process
presentation: sequential
groups:
  - id: input
    label: Input
    color: "#42a5f5"
  - id: calculation
    label: Calculation
    color: "#26a69a"
  - id: plan
    label: Plan
    color: "#ab47bc"
  - id: execution
    label: Execution
    color: "#78909c"
nodes:
  - id: battery
    group: input
    label: Battery at calculation
    icon: mdi:battery
    entities:
      - entity: sensor.example_battery_level
        label: Battery level
      - entity: sensor.example_available_battery_energy
        label: Available above battery floor
  - id: consumption
    group: input
    label: Home consumption over the horizon
    icon: mdi:home-lightning-bolt
    entities:
      - entity: sensor.example_expected_consumption
        label: Expected consumption
      - entity: sensor.example_horizon
        label: Calculated over
      - entity: sensor.example_horizon
        attribute: start
        label: From
      - entity: sensor.example_horizon
        attribute: end
        label: To
    note: Existing forecast, excluding EV charging and before solar contribution.
  - id: solar
    group: input
    label: Solar contribution
    icon: mdi:weather-sunny
    color: "#ffa726"
    entities:
      - entity: sensor.example_solar_contribution
        label: Within the same horizon
      - entity: sensor.example_solar_factor
        label: Solar factor
    note: This contribution is not a prediction of actual battery charging.
  - id: requirement
    group: calculation
    label: Demand and the following night
    icon: mdi:weather-night
    entities:
      - entity: sensor.example_night_consumption
        label: Night consumption including discharge losses
      - entity: sensor.example_night_reserve
        label: Extra night reserve
      - entity: sensor.example_battery_floor
        label: Battery floor
      - entity: sensor.example_required_energy
        label: Required at the end of the horizon
    note: End-of-night stock is a future target, not the required battery level now.
  - id: purchase
    group: plan
    label: Purchase proposal
    icon: mdi:battery-arrow-down
    entities:
      - entity: sensor.example_purchase_plan
        label: Proposed grid purchase
      - entity: sensor.example_purchase_plan
        attribute: cost
        label: Planned cost
        unit: EUR
      - entity: sensor.example_plan_coverage
        label: Coverage
    note: A published plan is a proposal, not evidence that charging took place.
  - id: trade
    group: plan
    label: Trading opportunities
    icon: mdi:swap-horizontal
    entities:
      - entity: sensor.example_round_trip_efficiency
        label: Round-trip efficiency
      - entity: sensor.example_selected_sale
        label: Selected sale
      - entity: sensor.example_trade_benefit
        label: Expected trading benefit
    note: Revenue and cash balance are not automatically profit.
  - id: confirmation
    group: execution
    label: Execution — separate from the proposal
    icon: mdi:clipboard-check-outline
    entities:
      - entity: sensor.example_control_mode
        label: Control mode
      - entity: sensor.example_schedule_confirmation
        label: Schedule agreement
      - entity: sensor.example_execution_status
        label: Execution status
    note: Only an independently confirmed execution entity describes actual execution. A proposed schedule does not prove that the battery charged.
relations:
  - from: battery
    to: requirement
    label: informs
  - from: consumption
    to: requirement
    label: contributes demand
  - from: solar
    to: requirement
    label: offsets demand
  - from: requirement
    to: purchase
    label: informs proposal
  - from: purchase
    to: trade
    label: provides planned energy
  - from: purchase
    to: confirmation
    label: compare against independent confirmation
```

Change `presentation` to `graph` to display this same configuration as a
relationship diagram. Relationships label your model; they do not calculate
the demand, offset, purchase or confirmation.

## Non-energy relationship network

This model describes monitoring relationships, including a cycle and a
same-group edge. The labels do not implement dependencies or control devices.
All entity IDs are placeholders.

```yaml
type: custom:mushroom-addition-energy-entityworkflow
name: Service relationships
presentation: graph
groups:
  - id: environment
    label: Environment
    color: "#42a5f5"
  - id: services
    label: Services
    color: "#26a69a"
  - id: observation
    label: Observation
    color: "#ab47bc"
nodes:
  - id: network
    group: environment
    label: Network
    icon: mdi:lan
    entities:
      - entity: binary_sensor.example_network_connected
  - id: gateway
    group: services
    label: Gateway
    icon: mdi:router-network
    entities:
      - entity: sensor.example_gateway_status
  - id: application
    group: services
    label: Application
    icon: mdi:application
    entities:
      - entity: sensor.example_application_status
      - entity: sensor.example_application_status
        attribute: version
        label: Version
  - id: monitor
    group: observation
    label: Monitor
    icon: mdi:monitor-eye
    entities:
      - entity: sensor.example_monitor_status
relations:
  - from: network
    to: gateway
    label: connects
  - from: gateway
    to: application
    label: routes to
  - from: application
    to: monitor
    label: observed by
  - from: monitor
    to: application
    label: reports on
```
