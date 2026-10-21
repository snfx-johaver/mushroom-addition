# Visual and behavior specification

This implementation is original Lit/TypeScript code built around Home
Assistant's public custom-card APIs and Mushroom's visual conventions.

The shared visual language is a light card surface with a 14px radius, subtle
elevation, 12px internal spacing, compact name/state typography, circular
low-opacity icon fields, and state-driven accent colors. Components share these
tokens but not a generic layout.

Neutral controls and inset surfaces use Mushroom's
`rgba(var(--rgb-primary-text-color), .05)` convention; unfilled progress tracks
use `rgba(var(--rgb-secondary-text-color), .2)`. Shared tokens provide light/dark
fallbacks, respect `--mush-rgb-grey` and `--mush-rgb-disabled`, and keep active
accent colors separate. Raised-button shadows and card-specific geometry are
intentional additions, not changes to the neutral palette.

Shared header icon circles default to 36px, with proportional symbols and
`--mush-icon-size` / `--mush-icon-symbol-size` overrides. Primary text defaults
to 14px, weight 500 and 20px line height; secondary text uses 12px, weight 400
and 16px line height. Both honor Mushroom's size, weight, line-height,
letter-spacing and text-color theme variables. Named accent colors and shared
legacy accent roles resolve through the same palette, preferring
`--mush-rgb-*`, then `--rgb-*`, then Mushroom's standard RGB defaults.

Scenes and Welcome pills retain identical flexible row geometry and shadow
padding. Their labels use two lines of theme-aware secondary text across the
available pill width, with full names available through accessible labels and
tooltips. Carousel captions use the same two-line secondary-text scale.

| Family | Recognizable layout and behavior | Primary reference IDs |
|---|---|---|
| Scene | Compact heading plus a grid of scene activation pills | `card_templates/cards/card_scenes_welcome.yaml`, `docs/usage/cards/card_scenes.md` |
| Battery | Threshold-colored battery icon, large percentage and level bar | `card_templates/cards/card_battery.yaml`, `docs/usage/cards/card_battery.md` |
| Energy/power | Current value emphasis, source-specific graph, or gauge composition | `custom_cards/custom_card_more_power_outlet/` |
| Sensor/graph | Current sensor reading plus deterministic compact history/sparkline treatment | `card_templates/2-line_cards/card_graph.yaml`, `docs/usage/cards/card_graph.md` |
| Media Player Advanced | Artwork or entity icon, title/state, capability-aware transport, volume and power/standby controls | `src/renderers.ts`, `src/sonos-controls.ts` |
| Navigation | Direction icon, destination copy and trailing chevron | `card_templates/cards/card_navigate.yaml` |

## Source-derived composition coverage

The parity generator inspects each exact catalog `sourcePath`, including YAML
and README files in custom-card directories. It records 15 materially distinct
composition profiles built from button-card, native card, popup, control,
chart, entities, image, vertical-stack, and horizontal-stack primitives.
The live development fixture at `/demo/` renders one example of every public
card, ordered by the checked catalog and labeled with its public ID/family.
It does not add overview cards, duplicate state galleries or decorative variants.
Historical screenshots and raw live-instance audit dumps are not distributed:
they can contain household-specific names and entity identifiers.

Every documented source maps explicitly to a public `rendererId` and, where
sources are combined, a stable variant. Shared Lit primitives are reused, but
missing mappings are a generation or test failure rather than a generic visual
fallback.

## Editor contract

**Native Area exception:** `area_card_advanced` uses the installed Area card and
native Area editor rather than this collection's generic presentation contract.
Its compact chips-style advanced control rows open a dedicated detail editor;
labels appear under icons and bottom-align in an opt-in 64px row. The default
unnamed native control height remains 42px. Entity/action/conditional/template
buttons support native action selectors; conditions are native-delegated and
templates are HA-server-rendered. Live checks on HA 2026.10.2 cover native
display-mode sizing, editor round trips, aligned labels at 320px and 440px widths,
conditional visibility, templates and isolated keyboard/click action events.
Recheck native Area custom-feature APIs and extended row sizing after frontend
updates. This addition is not included in the generated upstream-source visual
acceptance count.

Area advanced controls use drag-grip buttons, with Alt + Up/Down keyboard
reordering, not separate arrow buttons. Attribute/custom-text fields appear only
for their selected content mode; attributes are selectable from the entity.
Native Content includes alert color, sensor wrapping and grey default-icon
toggles. The sensor secondary slot preserves native class values and formatting;
scoped styles change presentation only. Aggregate control colors override native
button CSS without replacing native membership, state or click handling.

Each family has a separate schema. The primary entity is always `entity`, shown
at most once and filtered to suitable Home Assistant domains. Secondary inputs
are explicit (`temperature_entity`, `humidity_entity`, `battery_entity`,
`graph_entity`, `eta_entity`, `address_entity`, `min_entity`, `max_entity`) and
only appear for families that use them. Legacy `primary_entity` and known
source entity-variable names are migrated to `entity` during normalization.

The editor groups settings into **Context**, **Content**, **Layout**,
**Interactions** and **Features**. The parity matrix inventories every
discovered source variable, but the editor exposes only options that are wired
to rendering or a valid Home Assistant service. This prevents inert switches
and misleading controls.
Supported source options retain their original YAML key and use native Home
Assistant entity, action, icon, boolean, number, or text selectors.

## Visual verification

`demo/` provides deterministic representative states for the complete checked
card catalog, exactly once per registration. Run `npm run demo` and open `/demo/`
to inspect it with generic, local example data.
The generated [`VISUAL_AUDIT.md`](VISUAL_AUDIT.md) ledger records exact
accepted/total progress, source references, deterministic fixtures, comparison
artifacts, structural contracts, and individually reviewed deviations. The
remaining source-by-source audit is no longer inferred from a shared family
renderer.
