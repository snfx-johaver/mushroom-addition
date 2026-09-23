# Catalog coverage

This manifest maps the UI-Lovelace-Minimalist catalog at commit
[`f8a9cb67a53f91367f1dffe18516aa983b463cb5`](https://github.com/UI-Lovelace-Minimalist/UI/commit/f8a9cb67a53f91367f1dffe18516aa983b463cb5)
to Mushroom Cards Addition registrations. It is generated from
`src/catalog.ts`; CI rejects duplicate IDs, missing source paths, invalid
namespaces, or broken popup mappings.

**Coverage:** 86 documented upstream card sources map to
79 public card components.
Equivalent aliases and size/layout alternatives are exposed as variants instead
of duplicate picker entries. 7 popup templates and
1 implementation helpers are inventoried but are not
public registrations.

| Public ID | Category | Addition type | Family | UI variants | Covered upstream sources |
|---|---|---|---|---|---|
| `card_battery` | default-card | `custom:mushroom-addition-card-battery` | battery | default | `card_battery` |
| `card_binary_sensor` | default-card | `custom:mushroom-addition-card-binary-sensor` | sensor | default, alert | `card_binary_sensor`<br>`card_binary_sensor_alert` |
| `card_cover` | default-card | `custom:mushroom-addition-card-cover` | cover | default | `card_cover` |
| `card_fan` | default-card | `custom:mushroom-addition-card-fan` | control | default | `card_fan` |
| `card_generic` | default-card | `custom:mushroom-addition-card-generic` | sensor | default, swapped | `card_generic`<br>`card_generic_swap` |
| `card_graph` | default-card | `custom:mushroom-addition-card-graph` | energy | default | `card_graph` |
| `card_input_boolean` | default-card | `custom:mushroom-addition-card-input-boolean` | control | default | `card_input_boolean` |
| `card_light` | default-card | `custom:mushroom-addition-card-light` | light | default, slider, compact | `card_light` |
| `card_media_player` | default-card | `custom:mushroom-addition-card-media-player` | media | default, controls, artwork | `card_media_player` |
| `card_navigate` | default-card | `custom:mushroom-addition-card-navigate` | navigation | default | `card_navigate` |
| `card_person` | default-card | `custom:mushroom-addition-card-person` | presence | default, small | `card_person` |
| `card_power_outlet` | default-card | `custom:mushroom-addition-card-power-outlet` | control | default | `card_power_outlet` |
| `card_room` | default-card | `custom:mushroom-addition-card-room` | presence | default, with-sensors | `card_room` |
| `card_scenes` | default-card | `custom:mushroom-addition-card-scenes` | scene | welcome-pills, scene-grid | `card_scenes`<br>`custom_card_scenes` |
| `card_script` | default-card | `custom:mushroom-addition-card-script` | control | default | `card_script` |
| `card_thermostat` | default-card | `custom:mushroom-addition-card-thermostat` | climate | default | `card_thermostat` |
| `card_title` | default-card | `custom:mushroom-addition-card-title` | text | title-and-subtitle, divider-title, divider-subtitle | `card_title`<br>`custom_card_wilbiev_title`<br>`custom_card_wilbiev_subtitle` |
| `card_vacuum` | default-card | `custom:mushroom-addition-card-vacuum` | vacuum | default | `card_vacuum` |
| `card_vertical_button` | default-card | `custom:mushroom-addition-card-vertical-button` | sensor | default, custom-state | `card_vertical_button` |
| `card_weather` | default-card | `custom:mushroom-addition-card-weather` | weather | detailed, native | `card_weather`<br>`card_weather_ulm` |
| `card_welcome_scenes` | default-card | `custom:mushroom-addition-card-welcome-scenes` | scene | default | `card_welcome_scenes` |
| `custom_card_afvalophaling` | custom-card | `custom:mushroom-addition-custom-card-afvalophaling` | sensor | default | `custom_card_afvalophaling` |
| `custom_card_alarm_time` | custom-card | `custom:mushroom-addition-custom-card-alarm-time` | alarm-time | default | `custom_card_alarm_time` |
| `custom_card_apexcharts` | custom-card | `custom:mushroom-addition-custom-card-apexcharts` | energy | default | `custom_card_apexcharts` |
| `custom_card_bar_card` | custom-card | `custom:mushroom-addition-custom-card-bar-card` | bar | default | `custom_card_bar_card` |
| `custom_card_camera` | custom-card | `custom:mushroom-addition-custom-card-camera` | camera | default | `custom_card_camera` |
| `custom_card_chromecast` | custom-card | `custom:mushroom-addition-custom-card-chromecast` | media | default | `custom_card_chromecast` |
| `custom_card_damix48_power_details` | custom-card | `custom:mushroom-addition-custom-card-damix48-power-details` | energy | default | `custom_card_damix48_power_details` |
| `custom_card_device_tracker` | custom-card | `custom:mushroom-addition-custom-card-device-tracker` | presence | default | `custom_card_device_tracker` |
| `custom_card_drealine_roomview` | custom-card | `custom:mushroom-addition-custom-card-drealine-roomview` | presence | default | `custom_card_drealine_roomview` |
| `custom_card_eraycetinay_elapsed_time` | custom-card | `custom:mushroom-addition-custom-card-eraycetinay-elapsed-time` | sensor | default | `custom_card_eraycetinay_elapsed_time` |
| `custom_card_eraycetinay_lock` | custom-card | `custom:mushroom-addition-custom-card-eraycetinay-lock` | security | default | `custom_card_eraycetinay_lock` |
| `custom_card_esh_room` | custom-card | `custom:mushroom-addition-custom-card-esh-room` | presence | default | `custom_card_esh_room` |
| `custom_card_esh_welcome` | custom-card | `custom:mushroom-addition-custom-card-esh-welcome` | presence | default | `custom_card_esh_welcome` |
| `custom_card_haven_washer` | custom-card | `custom:mushroom-addition-custom-card-haven-washer` | control | default | `custom_card_haven_washer` |
| `custom_card_heat_pump` | custom-card | `custom:mushroom-addition-custom-card-heat-pump` | climate | default | `custom_card_heat_pump` |
| `custom_card_homeassistant_updates` | custom-card | `custom:mushroom-addition-custom-card-homeassistant-updates` | text | default | `custom_card_homeassistant_updates` |
| `custom_card_httpedo13_sun` | custom-card | `custom:mushroom-addition-custom-card-httpedo13-sun` | weather | default | `custom_card_httpedo13_sun` |
| `custom_card_httpedo13_thermostat` | custom-card | `custom:mushroom-addition-custom-card-httpedo13-thermostat` | climate | default | `custom_card_httpedo13_thermostat` |
| `custom_card_iAbadia_battery_chip` | custom-card | `custom:mushroom-addition-custom-card-iabadia-battery-chip` | battery | default | `custom_card_iAbadia_battery_chip` |
| `custom_card_imswel_medias` | custom-card | `custom:mushroom-addition-custom-card-imswel-medias` | media | default | `custom_card_imswel_medias` |
| `custom_card_imswel_person` | custom-card | `custom:mushroom-addition-custom-card-imswel-person` | presence | default | `custom_card_imswel_person` |
| `custom_card_input_datetime` | custom-card | `custom:mushroom-addition-custom-card-input-datetime` | text | default | `custom_card_input_datetime` |
| `custom_card_input_number` | custom-card | `custom:mushroom-addition-custom-card-input-number` | sensor | default | `custom_card_input_number` |
| `custom_card_irmajavi_entities` | custom-card | `custom:mushroom-addition-custom-card-irmajavi-entities` | sensor | default | `custom_card_irmajavi_entities` |
| `custom_card_irmajavi_speedtest` | custom-card | `custom:mushroom-addition-custom-card-irmajavi-speedtest` | energy | default | `custom_card_irmajavi_speedtest` |
| `custom_card_irmajavi_weather` | custom-card | `custom:mushroom-addition-custom-card-irmajavi-weather` | weather | default | `custom_card_irmajavi_weather` |
| `custom_card_light_colorpick` | custom-card | `custom:mushroom-addition-custom-card-light-colorpick` | light | default | `custom_card_light_colorpick` |
| `custom_card_media_player_sonos` | custom-card | `custom:mushroom-addition-custom-card-media-player-sonos` | media | default | `custom_card_media_player_sonos` |
| `custom_card_more_power_outlet` | custom-card | `custom:mushroom-addition-custom-card-more-power-outlet` | control | default | `custom_card_more_power_outlet` |
| `custom_card_mpse_gauge` | custom-card | `custom:mushroom-addition-custom-card-mpse-gauge` | energy | default | `custom_card_mpse_gauge` |
| `custom_card_mpse_printer` | custom-card | `custom:mushroom-addition-custom-card-mpse-printer` | sensor | default | `custom_card_mpse_printer` |
| `custom_card_mpse_thermostat` | custom-card | `custom:mushroom-addition-custom-card-mpse-thermostat` | climate | default | `custom_card_mpse_thermostat` |
| `custom_card_mpse_wifisignal` | custom-card | `custom:mushroom-addition-custom-card-mpse-wifisignal` | energy | default | `custom_card_mpse_wifisignal` |
| `custom_card_nas` | custom-card | `custom:mushroom-addition-custom-card-nas` | sensor | default | `custom_card_nas` |
| `custom_card_neekster_update` | custom-card | `custom:mushroom-addition-custom-card-neekster-update` | text | default | `custom_card_neekster_update` |
| `custom_card_nik_clock` | custom-card | `custom:mushroom-addition-custom-card-nik-clock` | security | default | `custom_card_nik_clock` |
| `custom_card_nik_door` | custom-card | `custom:mushroom-addition-custom-card-nik-door` | door | default | `custom_card_nik_door` |
| `custom_card_nik_nas` | custom-card | `custom:mushroom-addition-custom-card-nik-nas` | sensor | default | `custom_card_nik_nas` |
| `custom_card_nik_tablet` | custom-card | `custom:mushroom-addition-custom-card-nik-tablet` | sensor | default | `custom_card_nik_tablet` |
| `custom_card_paddy_dwd_pollen` | custom-card | `custom:mushroom-addition-custom-card-paddy-dwd-pollen` | weather | default | `custom_card_paddy_dwd_pollen` |
| `custom_card_paddy_waste_collection` | custom-card | `custom:mushroom-addition-custom-card-paddy-waste-collection` | sensor | default | `custom_card_paddy_waste_collection` |
| `custom_card_paddy_welcome` | custom-card | `custom:mushroom-addition-custom-card-paddy-welcome` | presence | default | `custom_card_paddy_welcome` |
| `custom_card_person_chip` | custom-card | `custom:mushroom-addition-custom-card-person-chip` | presence | default | `custom_card_person_chip` |
| `custom_card_person_info` | custom-card | `custom:mushroom-addition-custom-card-person-info` | presence | full, small | `custom_card_person_info`<br>`custom_card_person_info_small` |
| `custom_card_playstation` | custom-card | `custom:mushroom-addition-custom-card-playstation` | media | ps5, xbox | `custom_card_playstation` |
| `custom_card_qubino` | custom-card | `custom:mushroom-addition-custom-card-qubino` | control | default | `custom_card_qubino` |
| `custom_card_ristou_person` | custom-card | `custom:mushroom-addition-custom-card-ristou-person` | presence | default | `custom_card_ristou_person` |
| `custom_card_saxel_fan` | custom-card | `custom:mushroom-addition-custom-card-saxel-fan` | control | default | `custom_card_saxel_fan` |
| `custom_card_schumijo_car` | custom-card | `custom:mushroom-addition-custom-card-schumijo-car` | sensor | default | `custom_card_schumijo_car` |
| `custom_card_schumijo_flower` | custom-card | `custom:mushroom-addition-custom-card-schumijo-flower` | sensor | default | `custom_card_schumijo_flower` |
| `custom_card_senoro_win` | custom-card | `custom:mushroom-addition-custom-card-senoro-win` | sensor | default | `custom_card_senoro_win` |
| `custom_card_sisimomo_printer` | custom-card | `custom:mushroom-addition-custom-card-sisimomo-printer` | sensor | default | `custom_card_sisimomo_printer` |
| `custom_card_speedtest_shogun160` | custom-card | `custom:mushroom-addition-custom-card-speedtest-shogun160` | energy | default | `custom_card_speedtest_shogun160` |
| `custom_card_tpx01_aircondition` | custom-card | `custom:mushroom-addition-custom-card-tpx01-aircondition` | climate | default | `custom_card_tpx01_aircondition` |
| `custom_card_vncntdev_device_tracer` | custom-card | `custom:mushroom-addition-custom-card-vncntdev-device-tracer` | presence | default | `custom_card_vncntdev_device_tracer` |
| `custom_card_water_heater` | custom-card | `custom:mushroom-addition-custom-card-water-heater` | control | default | `custom_card_water_heater` |
| `custom_card_wsly_pollen` | custom-card | `custom:mushroom-addition-custom-card-wsly-pollen` | weather | default | `custom_card_wsly_pollen` |
| `custom_card_yagrasdemonde_lights_count` | custom-card | `custom:mushroom-addition-custom-card-yagrasdemonde-lights-count` | light | default | `custom_card_yagrasdemonde_lights_count` |

## Unified component mapping

| Public component | Upstream source → variant |
|---|---|
| `card_binary_sensor` | `card_binary_sensor` → `default`<br>`card_binary_sensor_alert` → `alert` |
| `card_generic` | `card_generic` → `default`<br>`card_generic_swap` → `swapped` |
| `card_weather` | `card_weather` → `detailed`<br>`card_weather_ulm` → `native` |
| `card_scenes` | `card_scenes` → `welcome-pills`<br>`custom_card_scenes` → `scene-grid` |
| `card_title` | `card_title` → `title-and-subtitle`<br>`custom_card_wilbiev_title` → `divider-title`<br>`custom_card_wilbiev_subtitle` → `divider-subtitle` |
| `custom_card_person_info` | `custom_card_person_info` → `full`<br>`custom_card_person_info_small` → `small` |

Old custom-element tags for non-canonical sources remain registered as hidden
compatibility aliases. They normalize to the public component and variant but do
not appear in the card picker or example dashboard.

## Excluded popup templates

Popup templates depend on Browser Mod behavior and are not public card variants.
Standard Home Assistant actions are used instead.

| Upstream popup | Addition component | Public behavior | Upstream source |
|---|---|---|---|
| `popup_cover` | `card_cover` | Not exposed; use standard card actions | [source](https://github.com/UI-Lovelace-Minimalist/UI/blob/f8a9cb67a53f91367f1dffe18516aa983b463cb5/custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/popup_templates/popups/popup_cover.yaml) |
| `popup_light` | `card_light` | Not exposed; use standard card actions | [source](https://github.com/UI-Lovelace-Minimalist/UI/blob/f8a9cb67a53f91367f1dffe18516aa983b463cb5/custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/popup_templates/popups/popup_light.yaml) |
| `popup_media_player` | `card_media_player` | Not exposed; use standard card actions | [source](https://github.com/UI-Lovelace-Minimalist/UI/blob/f8a9cb67a53f91367f1dffe18516aa983b463cb5/custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/popup_templates/popups/popup_media_player.yaml) |
| `popup_power_outlet` | `card_power_outlet` | Not exposed; use standard card actions | [source](https://github.com/UI-Lovelace-Minimalist/UI/blob/f8a9cb67a53f91367f1dffe18516aa983b463cb5/custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/popup_templates/popups/popup_power_outlet.yaml) |
| `popup_thermostat` | `card_thermostat` | Not exposed; use standard card actions | [source](https://github.com/UI-Lovelace-Minimalist/UI/blob/f8a9cb67a53f91367f1dffe18516aa983b463cb5/custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/popup_templates/popups/popup_thermostat.yaml) |
| `popup_vacuum` | `card_vacuum` | Not exposed; use standard card actions | [source](https://github.com/UI-Lovelace-Minimalist/UI/blob/f8a9cb67a53f91367f1dffe18516aa983b463cb5/custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/popup_templates/popups/popup_vacuum.yaml) |
| `popup_weather` | `card_weather` | Not exposed; use standard card actions | [source](https://github.com/UI-Lovelace-Minimalist/UI/blob/f8a9cb67a53f91367f1dffe18516aa983b463cb5/custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/popup_templates/popups/popup_weather.yaml) |

## Source-only helpers

- `custom_template_shogun160_battery_info`: Reusable implementation template, not a standalone user-facing custom card. [source](https://github.com/UI-Lovelace-Minimalist/UI/blob/f8a9cb67a53f91367f1dffe18516aa983b463cb5/custom_cards/custom_template_shogun160_battery_info)

## Naming exception

- `custom_card_speedtest_shogun160` is the upstream source folder associated
  with the differently named custom template documentation; it remains covered
  under its source identity.
