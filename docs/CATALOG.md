# Catalog coverage

This manifest maps the documented card catalog to Mushroom Cards Addition
registrations. It is generated from `src/catalog.ts`; CI rejects duplicate
IDs, missing source paths, invalid namespaces, or broken popup mappings.

**Coverage:** 21 documented upstream card sources map to
25 public card components.
Equivalent aliases and size/layout alternatives are exposed as variants instead
of duplicate picker entries. 0 popup templates and
1 implementation helpers are inventoried but are not
public registrations.

| Public ID | Category | Addition type | Family | UI variants | Covered source IDs |
|---|---|---|---|---|---|
| `card_battery` | default-card | `custom:mushroom-addition-card-battery` | battery | default | `card_battery` |
| `card_room` | default-card | `custom:mushroom-addition-card-room` | presence | default, with-sensors | `card_room` |
| `card_scenes` | default-card | `custom:mushroom-addition-card-scenes` | scene | welcome-pills, scene-grid | `card_scenes`<br>`custom_card_scenes` |
| `card_welcome_scenes` | default-card | `custom:mushroom-addition-card-welcome-scenes` | scene | default | `card_welcome_scenes` |
| `custom_card_trash` | custom-card | `custom:mushroom-addition-custom-card-trash` | sensor | default | `custom_card_trash` |
| `custom_card_alarm_time` | custom-card | `custom:mushroom-addition-custom-card-alarm-time` | alarm-time | default | `custom_card_alarm_time` |
| `custom_card_roomview` | custom-card | `custom:mushroom-addition-custom-card-roomview` | presence | default | `custom_card_roomview` |
| `custom_card_welcome` | custom-card | `custom:mushroom-addition-custom-card-welcome` | presence | default | `custom_card_welcome` |
| `custom_card_washer` | custom-card | `custom:mushroom-addition-custom-card-washer` | control | default | `custom_card_washer` |
| `custom_card_sun` | custom-card | `custom:mushroom-addition-custom-card-sun` | weather | default | `custom_card_sun` |
| `custom_card_input_datetime` | custom-card | `custom:mushroom-addition-custom-card-input-datetime` | sensor | default | `custom_card_input_datetime` |
| `custom_card_media_player_sonos` | custom-card | `custom:mushroom-addition-custom-card-media-player-sonos` | media | default | `custom_card_media_player_sonos` |
| `custom_card_printer` | custom-card | `custom:mushroom-addition-custom-card-printer` | sensor | default | `custom_card_printer` |
| `custom_card_nas_metrics` | custom-card | `custom:mushroom-addition-custom-card-nas-metrics` | sensor | default | `custom_card_nas_metrics` |
| `custom_card_tablet` | custom-card | `custom:mushroom-addition-custom-card-tablet` | sensor | default | `custom_card_tablet` |
| `custom_card_playstation` | custom-card | `custom:mushroom-addition-custom-card-game-console` | media | default | `custom_card_playstation` |
| `custom_card_plant` | custom-card | `custom:mushroom-addition-custom-card-plant` | sensor | default | `custom_card_plant` |
| `custom_card_speedtest_gauges` | custom-card | `custom:mushroom-addition-custom-card-speedtest-gauges` | energy | default | `custom_card_speedtest_gauges` |
| `custom_card_pollen` | custom-card | `custom:mushroom-addition-custom-card-pollen` | weather | default | `custom_card_pollen` |
| `mini_graph_card` | custom-card | `custom:mushroom-addition-mini-graph-card` | energy | line, bar | `mini_graph_card` |
| `area_card_advanced` | custom-card | `custom:mushroom-addition-area-card-advanced` | presence | default | `area_card_advanced` |
| `custom_card_entity_carousel` | custom-card | `custom:mushroom-addition-custom-card-entity-carousel` | sensor | default | `custom_card_entity_carousel` |
| `advanced_home_energy_management` | custom-card | `custom:mushroom-addition-advanced-home-energy-management` | energy | default | `advanced_home_energy_management` |
| `advanced_energy_buy_sell` | custom-card | `custom:mushroom-addition-advanced-energy-buy-and-sell` | energy | default | `advanced_energy_buy_sell` |
| `advanced_energy_panel_health` | custom-card | `custom:mushroom-addition-advanced-energy-panel-health` | energy | default | `advanced_energy_panel_health` |

## Unified component mapping

| Public component | Source → variant |
|---|---|
| `card_scenes` | `card_scenes` → `welcome-pills`<br>`custom_card_scenes` → `scene-grid` |

Old custom-element tags for non-canonical sources remain registered as hidden
compatibility aliases. They normalize to the public component and variant but do
not appear in the card picker or example dashboard.

## Excluded popup templates

Popup templates depend on Browser Mod behavior and are not public card variants.
Standard Home Assistant actions are used instead.

| Popup template | Addition component | Public behavior | Reference path |
|---|---|---|---|


## Source-only helpers

- `custom_template_battery_info`: Reusable implementation template, not a standalone user-facing custom card. Source: `custom_cards/custom_template_battery_info`.

## Naming exception

- `custom_card_speedtest_gauges` retains its source identity while using a
  clearer public display name.
