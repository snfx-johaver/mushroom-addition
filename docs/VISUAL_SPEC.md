# Visual and behavior specification

This implementation is informed by the public UI-Lovelace-Minimalist templates
at upstream commit
[`f8a9cb6`](https://github.com/UI-Lovelace-Minimalist/UI/commit/f8a9cb67a53f91367f1dffe18516aa983b463cb5).
It is original Lit/TypeScript code and does not copy upstream YAML or bundled
assets.

The shared visual language is a light card surface with a 14px radius, subtle
elevation, 12px internal spacing, compact name/state typography, circular
low-opacity icon fields, and state-driven accent colors. Components share these
tokens but not a generic layout.

| Family | Recognizable layout and behavior | Primary upstream references |
|---|---|---|
| Weather | Large condition icon, current temperature, location/condition, high/low summary, humidity and temperature pills, optional compact forecast row | `card_templates/cards/card_weather_ulm.yaml`, `docs/usage/cards/card_weather_ulm.md`, `popup_templates/popups/popup_weather.yaml` |
| Climate | Icon/name/current-mode header, current and target temperatures, humidity detail and setpoint controls | `card_templates/cards/card_thermostat.yaml`, `docs/usage/cards/card_thermostat.md` |
| Light | State-colored icon, brightness label, optional full-width brightness slider | `card_templates/cards/card_light.yaml`, `docs/usage/cards/card_light.md` |
| Scene | Compact heading plus a grid of scene activation pills | `card_templates/cards/card_scenes_welcome.yaml`, `docs/usage/cards/card_scenes.md` |
| Person/presence | Avatar/icon, zone/address/ETA text, presence dot or battery badge | `card_templates/cards/card_person.yaml`, `docs/usage/cards/card_person.md` |
| Battery | Threshold-colored battery icon, large percentage and level bar | `card_templates/cards/card_battery.yaml`, `docs/usage/cards/card_battery.md` |
| Energy/power | Current value emphasis, sparkline, optional minimum/maximum sensor detail | `card_templates/cards/card_power_outlet.yaml`, `card_templates/chips/chip_power_consumption.yaml` |
| Sensor/graph | Current sensor reading plus deterministic compact history/sparkline treatment | `card_templates/2-line_cards/card_graph.yaml`, `docs/usage/cards/card_graph.md` |
| Media | Artwork or app/device icon, title/state, optional transport controls | `card_templates/cards/card_media_player.yaml`, `docs/usage/cards/card_media_player.md` |
| Cover | Device/state header and open/stop/close controls | `card_templates/cards/card_cover.yaml`, `docs/usage/cards/card_cover.md` |
| Vacuum | State-colored robot icon, battery detail and start/pause/home controls | `card_templates/cards/card_vacuum.yaml`, `docs/usage/cards/card_vacuum.md` |
| Alarm/security | Armed/locked state coloring and explicit secured/attention status | `card_templates/chips/chip_alarm.yaml`, `docs/usage/chips/chip_alarm.md` |
| Navigation | Direction icon, destination copy and trailing chevron | `card_templates/cards/card_navigate.yaml`, `card_templates/chips/chip_navigate.yaml` |
| Chips | 34px capsule surface with family-colored circular icon, concise label and state | `card_templates/internal_templates/chips.yaml`, `docs/usage/chips/` |

## Source-derived composition coverage

The parity generator inspects each exact catalog `sourcePath`, including YAML
and README files in custom-card directories. It records 15 materially distinct
composition profiles built from button-card, native card, popup, control,
chart, entities, image, vertical-stack, and horizontal-stack primitives.
[`catalog-fixture.png`](assets/catalog-fixture.png) contains exactly one
browser-rendered example of every registered card, chip, and container. It is
ordered by the checked catalog, labeled with the upstream ID/family, and does
not add duplicate state galleries or decorative variants.

Every public entry also receives a unique `rendererId` and CSS parity class.
Shared Lit primitives are reused, but missing metadata is a runtime error and a
test failure rather than a generic visual fallback.

## Editor contract

Each family has a separate schema. The primary entity is always `entity`, shown
at most once and filtered to suitable Home Assistant domains. Secondary inputs
are explicit (`temperature_entity`, `humidity_entity`, `battery_entity`,
`graph_entity`, `eta_entity`, `address_entity`, `min_entity`, `max_entity`) and
only appear for families that use them. Legacy `primary_entity` and known
Minimalist entity-variable names are migrated to `entity` during normalization.

The editor also contains an expandable **Upstream parity options** section.
Every variable discovered in the exact upstream source is accepted unchanged
as a YAML property and receives a native Home Assistant selector inferred from
its source/default: entity, multi-entity, action, icon, color, boolean, number,
object, or text. The generated matrix documents each raw upstream key and
default. Frequently used values such as `*_name`, `*_icon`, `*_color`,
`*_enable_controls`, `*_enable_buttons`, `*_enable_slider`, and
`*_enable_horizontal` are normalized into the shared Lit rendering primitives
without removing the original property.

## Visual verification

`demo/` provides deterministic representative states for the complete checked
catalog, exactly once per registration. The current browser-rendered fixture is
committed at [`docs/assets/catalog-fixture.png`](assets/catalog-fixture.png).
Renderer tests assert the weather hierarchy, distinct family markup, exact
one-per-registration fixture coverage, explicit per-entry renderer mappings,
and complete editor-variable coverage.
