# Catalog coverage

This manifest maps the documented card catalog to Mushroom Addition
registrations. It is generated from `src/catalog.ts`; CI rejects duplicate
IDs, missing source paths, invalid namespaces, or broken popup mappings.

**Coverage:** 19 documented upstream card sources map to
31 public card components.
Equivalent aliases and size/layout alternatives are exposed as variants instead
of duplicate picker entries. 0 popup templates and
1 implementation helpers are inventoried but are not
public registrations.

All picker entries use the prefix **Mushroom Addition:** before the card name.

| Card name | Public ID | Category | Addition type | Family | UI variants | Covered source IDs |
|---|---|---|---|---|---|---|
| Battery | `card_battery` | default-card | `custom:mushroom-addition-card-battery` | battery | default | `card_battery` |
| Room | `card_room` | default-card | `custom:mushroom-addition-card-room` | presence | default, with-sensors | `card_room` |
| Scenes | `card_scenes` | default-card | `custom:mushroom-addition-card-scenes` | scene | welcome-pills, scene-grid | `card_scenes`<br>`custom_card_scenes` |
| Trash | `custom_card_trash` | custom-card | `custom:mushroom-addition-custom-card-trash` | sensor | default | `custom_card_trash` |
| Alarm Time | `custom_card_alarm_time` | custom-card | `custom:mushroom-addition-custom-card-alarm-time` | alarm-time | default | `custom_card_alarm_time` |
| Welcome | `custom_card_welcome` | custom-card | `custom:mushroom-addition-custom-card-welcome` | presence | default | `custom_card_welcome` |
| Washer-Dryer | `custom_card_washer` | custom-card | `custom:mushroom-addition-custom-card-washer` | control | default | `custom_card_washer` |
| Astronomy | `custom_card_sun` | custom-card | `custom:mushroom-addition-custom-card-sun` | weather | default | `custom_card_sun` |
| Input Datetime | `custom_card_input_datetime` | custom-card | `custom:mushroom-addition-custom-card-input-datetime` | sensor | default | `custom_card_input_datetime` |
| Media Player Advanced | `custom_card_media_player_sonos` | custom-card | `custom:mushroom-addition-custom-card-media-player-sonos` | media | default | `custom_card_media_player_sonos` |
| Printer | `custom_card_printer` | custom-card | `custom:mushroom-addition-custom-card-printer` | sensor | default | `custom_card_printer` |
| NAS | `custom_card_nas_metrics` | custom-card | `custom:mushroom-addition-custom-card-nas-metrics` | sensor | default | `custom_card_nas_metrics` |
| Tablet | `custom_card_tablet` | custom-card | `custom:mushroom-addition-custom-card-tablet` | sensor | default | `custom_card_tablet` |
| Game Console | `custom_card_playstation` | custom-card | `custom:mushroom-addition-custom-card-game-console` | media | default | `custom_card_playstation` |
| Flower | `custom_card_plant` | custom-card | `custom:mushroom-addition-custom-card-plant` | sensor | default | `custom_card_plant` |
| Speedtest | `custom_card_speedtest_gauges` | custom-card | `custom:mushroom-addition-custom-card-speedtest-gauges` | energy | default | `custom_card_speedtest_gauges` |
| Pollen | `custom_card_pollen` | custom-card | `custom:mushroom-addition-custom-card-pollen` | weather | default | `custom_card_pollen` |
| Graph Advanced | `mini_graph_card` | custom-card | `custom:mushroom-addition-mini-graph-card` | energy | line, bar | `mini_graph_card` |
| Pi-hole | `pi_hole_card` | custom-card | `custom:mushroom-addition-pi-hole-card` | sensor | default | `pi_hole_card` |
| Upcoming Media | `upcoming_media` | custom-card | `custom:mushroom-addition-upcoming-media-card` | media | default | `upcoming_media` |
| Remote | `remote_card` | custom-card | `custom:mushroom-addition-remote-card` | media | default | `remote_card` |
| Area Advanced | `area_card_advanced` | custom-card | `custom:mushroom-addition-area-card-advanced` | presence | default | `area_card_advanced` |
| Area Advanced - Mushroom | `area_card_mushroom` | custom-card | `custom:mushroom-addition-area-card-mushroom` | presence | default | `area_card_mushroom` |
| Carousel Slider | `custom_card_entity_carousel` | custom-card | `custom:mushroom-addition-custom-card-entity-carousel` | sensor | default | `custom_card_entity_carousel` |
| Energy - Home Energy Management | `advanced_home_energy_management` | custom-card | `custom:mushroom-addition-advanced-home-energy-management` | energy | default | `advanced_home_energy_management` |
| Energy - Buy and Sell | `advanced_energy_buy_sell` | custom-card | `custom:mushroom-addition-advanced-energy-buy-and-sell` | energy | default | `advanced_energy_buy_sell` |
| Energy - Solar Panel Health | `advanced_energy_panel_health` | custom-card | `custom:mushroom-addition-advanced-energy-panel-health` | energy | default | `advanced_energy_panel_health` |
| NAS - Server Overview | `nas_server` | custom-card | `custom:mushroom-addition-nas-server-card` | nas-dashboard | default | `nas_server` |
| NAS - Storage and Disks | `nas_storage` | custom-card | `custom:mushroom-addition-nas-storage-card` | nas-dashboard | default | `nas_storage` |
| NAS - Docker Containers | `nas_docker` | custom-card | `custom:mushroom-addition-nas-docker-card` | nas-dashboard | default | `nas_docker` |
| NAS - Unified Dashboard | `nas_dashboard` | custom-card | `custom:mushroom-addition-nas-dashboard-card` | nas-dashboard | default | `nas_dashboard` |

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
