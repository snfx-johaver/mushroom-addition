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
| Weather | Condition and date header, outside temperature, and four configurable weather metrics | `custom_cards/custom_card_weather_metrics` |
| Light | State-colored icon, brightness label, optional full-width brightness slider | `card_templates/cards/card_light.yaml`, `docs/usage/cards/card_light.md` |
| Scene | Compact heading plus a grid of scene activation pills | `card_templates/cards/card_scenes_welcome.yaml`, `docs/usage/cards/card_scenes.md` |
| Person/presence | Avatar/icon, zone/address/ETA text, presence dot or battery badge | `card_templates/cards/card_person.yaml`, `docs/usage/cards/card_person.md` |
| Battery | Threshold-colored battery icon, large percentage and level bar | `card_templates/cards/card_battery.yaml`, `docs/usage/cards/card_battery.md` |
| Energy/power | Current value emphasis, source-specific graph, gauge, or bar composition | `custom_cards/custom_card_more_power_outlet/`, `custom_cards/custom_card_bar_card/` |
| Sensor/graph | Current sensor reading plus deterministic compact history/sparkline treatment | `card_templates/2-line_cards/card_graph.yaml`, `docs/usage/cards/card_graph.md` |
| Media | Artwork or app/device icon, title/state, optional transport controls | `card_templates/cards/card_media_player.yaml`, `docs/usage/cards/card_media_player.md` |
| Cover | Device/state header and open/stop/close controls | `card_templates/cards/card_cover.yaml`, `docs/usage/cards/card_cover.md` |
| Vacuum | State-colored robot icon, battery detail and start/pause/home controls | `card_templates/cards/card_vacuum.yaml`, `docs/usage/cards/card_vacuum.md` |
| Navigation | Direction icon, destination copy and trailing chevron | `card_templates/cards/card_navigate.yaml` |

## Source-derived composition coverage

The parity generator inspects each exact catalog `sourcePath`, including YAML
and README files in custom-card directories. It records 15 materially distinct
composition profiles built from button-card, native card, popup, control,
chart, entities, image, vertical-stack, and horizontal-stack primitives.
[`catalog-fixture.png`](assets/catalog-fixture.png) contains exactly one
browser-rendered example of every public card. The fixture is ordered by the checked catalog,
labeled with the public ID/family, and does not add overview cards, duplicate
state galleries, or decorative variants.

Every documented source maps explicitly to a public `rendererId` and, where
sources are combined, a stable variant. Shared Lit primitives are reused, but
missing mappings are a generation or test failure rather than a generic visual
fallback.

## Editor contract

Each family has a separate schema. The primary entity is always `entity`, shown
at most once and filtered to suitable Home Assistant domains. Secondary inputs
are explicit (`temperature_entity`, `humidity_entity`, `battery_entity`,
`graph_entity`, `eta_entity`, `address_entity`, `min_entity`, `max_entity`) and
only appear for families that use them. Legacy `primary_entity` and known
Minimalist entity-variable names are migrated to `entity` during normalization.

The editor also contains an expandable **Implemented upstream options**
section. The parity matrix inventories every discovered source variable, but
the editor exposes only options that are wired to rendering or a valid Home
Assistant service. This prevents inert switches and misleading controls.
Supported source options retain their original YAML key and use native Home
Assistant entity, action, icon, boolean, number, or text selectors.

## Visual verification

`demo/` provides deterministic representative states for the complete checked
card catalog, exactly once per registration. The current browser-rendered
fixture is committed at [`docs/assets/catalog-fixture.png`](assets/catalog-fixture.png).
Bar Card is the first source-specific visual acceptance gate; its inspected
comparison is committed at
[`docs/assets/visual-audit/custom-card-bar-card-comparison.png`](assets/visual-audit/custom-card-bar-card-comparison.png).
The generated [`VISUAL_AUDIT.md`](VISUAL_AUDIT.md) ledger records exact
accepted/total progress, source references, deterministic fixtures, comparison
artifacts, structural contracts, and individually reviewed deviations. The
remaining source-by-source audit is no longer inferred from a shared family
renderer.
