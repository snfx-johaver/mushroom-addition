# Energy Log

Choose **Mushroom Addition: Energy Log** in the Home Assistant card picker, or
use `custom:mushroom-addition-energy-log`. The card displays timestamped data
from your chosen Home Assistant entities. Use **Entity changes** to display
recorded state or attribute changes without creating a log sensor, or bring an
existing structured log feed. The card never controls devices, creates sensors,
or sends data to external services.

No HEMS installation is needed. Without a compatible structured log feed, a new
card starts with an empty source list and setup guidance, even when other
healthy entities exist. Entity-change history requires explicitly selecting
your own sources in Features; unrelated sensors are never selected for history
automatically. Fictional entity IDs are never saved as picker defaults.
See [community energy setup](ENERGY_SETUP.md).

## Use your own entities

For a first card, choose one low-frequency status or mode entity already in
your installation. No structured log sensor or HEMS integration is necessary.

1. Check the entity in **Developer tools → States** and confirm its history is
   retained by Recorder. Follow the [source checklist](ENERGY_SETUP.md#find-your-entities-before-configuring-a-card).
2. Add **Mushroom Addition: Energy Log**. In Features, add a category with a
   unique ID, then a source with **Entity changes** as the source type.
3. Select your entity and that category ID. Leave Field empty for state changes;
   enter an attribute path only if that specific attribute is also recorded.
4. Set the desired history hours and save. Compare entries against that entity's
   Home Assistant history, not against an unrelated application's log.

This complete example tracks an ordinary user-selected mode entity:

```yaml
type: custom:mushroom-addition-energy-log
name: Energy activity
historyHours: 24
sources:
  - id: mode
    entity: input_select.example_energy_mode
    adapter: changes
    category: operation
    name: Energy mode
categories:
  - id: operation
    label: Operation
    icon: mdi:lightning-bolt
    color: teal
```

Replace the example entity with your own. To track an attribute, add `field`
to that source, such as `field: schedule.status`, matching the actual structure.
For an existing list of timestamped events, choose Attribute or JSON State
instead and configure the field mappings in [Source format](#source-format).

**If no entries appear:** an unchanged entity produces no events, and the first
history snapshot is only a baseline. Check the history window, Recorder's
retention/exclusions and any displayed request errors. State history does not
prove that a selected attribute was retained; missing historical attributes
cannot be reconstructed. Plan changes are not proof of device execution.

## Entity changes: bring your own entities

In **Features → Sources**, select **Entity changes**, choose an entity and
enter a category ID from **Categories**. Leave **Field** empty to track its
state, or enter a dotted attribute path to track that value instead. **Name**
optionally labels the entries. No entity names or HEMS installation are required.

The card loads the previous 24 hours from Home Assistant's Recorder by default
and updates as live Home Assistant states change. **Visible hours** controls the
recorded window (`historyHours`: 1–168); up to eight distinct tracked entities
are supported. Recorder history refreshes at most every 15 minutes while mounted,
and is reloaded when the card reconnects. A minute timer expires old entries.
History requests time out after 30 seconds; request and data errors remain visible
without hiding independent log feeds.

Persistence belongs to **Home Assistant Recorder**, not the browser. Closing the
dashboard does not stop Recorder. History survives dashboard reloads and Home
Assistant restarts only within Recorder's configured retention and exclusions.
The card cannot recover purged/excluded states or attributes that were never
recorded. The initial history snapshot is a comparison baseline, not a fabricated
event; no change is invented when a new card first opens.
Cached history, live changes and errors are cleared when the Home Assistant
connection changes or the card disconnects. The card reloads history from the
current connection without comparing states across connections.

Only changes to the chosen state or attribute produce entries; unrelated
attributes and timestamp-only updates are ignored. Availability transitions
(`unknown`/`unavailable`) remain visible. Missing attribute history breaks the
comparison and is reported, not interpolated. Object key ordering is ignored.
Long values are shortened to 500 characters per side for display. Prefer status,
strategy, execution and compact schedule attributes over high-frequency power
readings or entire forecast payloads.

### Fictional HEMS-style example

These are illustrative entity names, not an installed HEMS mapping. Select your
own equivalents. Proposed plan changes are **not** evidence of device execution.

```yaml
type: custom:mushroom-addition-energy-log
name: Energy activity
historyHours: 24
limit: 50
sources:
  - id: strategy
    entity: input_select.example_hems_strategy
    adapter: changes
    category: planning
    name: Energy strategy
  - id: schedule
    entity: sensor.example_hems_plan
    adapter: changes
    field: plan.schedule_tomorrow
    category: planning
    name: Proposed charging schedule
  - id: execution
    entity: sensor.example_hems_execution
    adapter: changes
    category: operation
    name: Reported execution status
  - id: availability
    entity: binary_sensor.example_hems_available
    adapter: changes
    category: availability
    name: Controller availability
categories:
  - id: planning
    label: Planning
    icon: mdi:clipboard-text-outline
    color: purple
  - id: operation
    label: Operation
    icon: mdi:lightning-bolt
    color: teal
  - id: availability
    label: Availability
    icon: mdi:check-circle-outline
    color: amber
```

For example, a recorded strategy changing from `Solar first` to `Smart saving`
appears as an old-to-new entry at the recorded change time. A schedule attribute
changing produces a separate proposed-plan entry; unchanged recalculations do not.
You can mix `changes`, `attribute` and JSON `state` sources in one card.

The local `/demo/energy-plan.html#energy-log` showcase lets you simulate these
fictional changes and reopen the card against a simulated Recorder. It never
contacts Home Assistant; its in-memory fixture is not persistent storage.

## Visual editor

All card settings are editable through the shared Mushroom editor's Context,
Content, Layout, Interactions and Features sections. Sources and categories use
Home Assistant's structured object selectors with native add/edit/delete dialogs
and ordering, verified against HA 2026.11 / frontend 20261028.4, as with Energy Plan.
There is no separate Energy Log editor element.

- Shared Mushroom name, primary/secondary information, icon, layout and header
  actions, plus entry limit, sort order, time zone, clock format,
  footer, empty-state text, and source disclosures.
- Any number of entity sources, including each source's payload path and field
  mappings.
- Categories, including the IDs referenced by source entries, labels, colors,
  and icons. Each category is automatically available as a filter chip.

The editor validates source IDs and category IDs and reports incomplete or
invalid configuration rather than emitting it. Entries referencing a category
not in the configured list are reported as data errors.
Existing `title` and `subtitle` values remain supported as fallbacks for `name`
and `secondary`; the editor exposes the shared presentation fields instead.
Built-in labels use the 33 repository language catalogs; user-provided entry text
and category labels stay unchanged. Named colors resolve through the HA theme.

### Changing filter icons in the UI

Open the card editor and expand **Features**:

- **All: Icon** selects the icon for the built-in All filter.
- **Categories → Edit → select a category → Icon** changes that category's
  icon, for example Planning, Measurement, Availability or a category you added.
  The selected icon appears both in its filter chip and beside matching entries.

These are Home Assistant icon pickers; no YAML is required. Clear an icon to
show only the label. Existing configurations without `allIcon` retain the
text-only All filter. The card's Content icon is independent of filter icons.

![Energy Log synthetic illustration, not live Home Assistant data](assets/energy-log-example.svg)

## Source format

For existing log feeds, each source points to an entity attribute containing a list of objects, or to
an entity state containing a JSON-encoded list. For state sources, set
`adapter: state`; `path` may select a nested list in the decoded JSON. Set
`adapter: attribute` to select an attribute path. Attribute sources require a
non-empty path to the list. Field mappings use dot-separated paths.

The timestamp field accepts an ISO date/time string or a Unix timestamp in
seconds or milliseconds. The category field must match a configured category
ID. The other fields are text. Missing entity IDs, `unknown` or `unavailable`
states, invalid payloads, malformed rows, invalid timestamps, and unknown
category references are shown as source errors. A valid list with no entries
is a valid empty log and displays the configured empty-state message.

When multiple sources are configured, valid entries still display if another
source is unavailable or invalid; the card reports that source error separately.
Changing Home Assistant states refreshes the rendered log. The configured
limit is applied after sorting. Filter chips do not alter or write source data.

## Example

This example uses only synthetic IDs, timestamps, and text. Replace the
placeholder entity ID with an entity in your own installation.

```yaml
type: custom:mushroom-addition-energy-log
title: Energy Log
subtitle: Example activity stream
icon: mdi:timeline-text-outline
allIcon: mdi:view-grid-outline
limit: 30
sortOrder: newest
timeZone: Europe/Amsterdam
clockFormat: "24"
showSource: true
emptyState: No example entries are available.
footer: This is an example view of existing entity data.
sources:
  - id: sample_stream
    entity: sensor.example_activity_log
    adapter: attribute
    path: entries
    timestampField: timestamp
    categoryField: category
    titleField: headline
    detailField: value_summary
    descriptionField: note
    sourceField: origin
categories:
  - id: planning
    label: Planning
    color: "#7e57c2"
    icon: mdi:clipboard-text-outline
  - id: measurement
    label: Measurement
    color: "#00897b"
    icon: mdi:chart-line
```

For this example, the configured entity could expose the following synthetic
attribute:

```yaml
entries:
  - timestamp: "2026-04-15T09:10:00+02:00"
    category: planning
    headline: Sample schedule prepared
    value_summary: 3 sample intervals
    note: Example payload stored in an existing entity attribute.
    origin: sensor.example_schedule
  - timestamp: "2026-04-15T10:25:00+02:00"
    category: measurement
    headline: Sample reading received
    value_summary: 12.4 example units
    note: Synthetic measurement text for documentation only.
    origin: sensor.example_reading
```

`timeZone` accepts an IANA time-zone name. Leave it empty to use Home
Assistant's configured time zone, falling back to the browser's zone. Date
headings and times use this zone. Native buttons and disclosure controls are
keyboard-operable, with visible focus styles and theme-aware colors.
