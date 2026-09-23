# Visual audit index

This is the source-by-source visual acceptance ledger for the card-only
UI-Lovelace-Minimalist catalog pinned at
`f8a9cb67a53f91367f1dffe18516aa983b463cb5`.

**Progress: 22/86 source designs accepted.**

An entry is accepted only after its upstream source and screenshot have been
inspected, its deterministic fixture has been rendered at the recorded theme
and width, a side-by-side artifact has been reviewed, and structural tests
assert its required and forbidden regions. Family assignment or source metadata
alone is not visual acceptance.

| Source | Category | Public card | Variant | Composition | Reference | Comparison | Status | Exact deviations |
|---|---|---|---|---|---|---|---|---|
| `card_battery` | default-card | `card_battery` | — | `default:card_battery:ulm-default-battery` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_battery.png` | [`artifact`](../docs/assets/visual-audit/card_battery-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_binary_sensor` | default-card | `card_binary_sensor` | default | `default:card_binary_sensor:ulm-binary` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_binary_sensor.png` | [`artifact`](../docs/assets/visual-audit/card_binary_sensor-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_binary_sensor_alert` | default-card | `card_binary_sensor` | alert | `default:card_binary_sensor_alert:ulm-binary` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_binary_sensor_alert.png` | [`artifact`](../docs/assets/visual-audit/card_binary_sensor_alert-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_cover` | default-card | `card_cover` | — | `default:card_cover:ulm-cover` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_cover_controls.png` | [`artifact`](../docs/assets/visual-audit/card_cover-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_fan` | default-card | `card_fan` | — | `default:card_fan:ulm-fan` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_fan_slider.png` | [`artifact`](../docs/assets/visual-audit/card_fan-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_generic` | default-card | `card_generic` | default | `default:card_generic:value-first` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_generic.png` | [`artifact`](../docs/assets/visual-audit/card_generic-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_generic_swap` | default-card | `card_generic` | swapped | `default:card_generic_swap:ulm-generic-swap` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_generic_swap.png` | [`artifact`](../docs/assets/visual-audit/card_generic_swap-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_graph` | default-card | `card_graph` | — | `default:card_graph:ulm-default-graph` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_graph.png` | [`artifact`](../docs/assets/visual-audit/card_graph-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_input_boolean` | default-card | `card_input_boolean` | — | `default:card_input_boolean:ulm-simple-default` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_input_boolean.png` | [`artifact`](../docs/assets/visual-audit/card_input_boolean-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_light` | default-card | `card_light` | — | `default:card_light:ulm-light-card` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_light_combi.png` | [`artifact`](../docs/assets/visual-audit/card_light-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_media_player` | default-card | `card_media_player` | — | `default:card_media_player:ulm-media` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_media_player_art_controls.png` | [`artifact`](../docs/assets/visual-audit/card_media_player-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_navigate` | default-card | `card_navigate` | — | `default:card_navigate:ulm-default-navigation` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_navigate.png` | [`artifact`](../docs/assets/visual-audit/card_navigate-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_person` | default-card | `card_person` | — | `default:card_person:ulm-person` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_person.png` | [`artifact`](../docs/assets/visual-audit/card_person-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_power_outlet` | default-card | `card_power_outlet` | — | `default:card_power_outlet:ulm-simple-default` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_power_outlet.png` | [`artifact`](../docs/assets/visual-audit/card_power_outlet-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_room` | default-card | `card_room` | — | `card_room` | Source: `custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_room.yaml` | — | Pending | — |
| `card_scenes` | default-card | `card_scenes` | welcome-pills | `card_scenes:welcome-pills` | Source: `custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_scenes_welcome.yaml` | — | Pending | — |
| `card_script` | default-card | `card_script` | — | `default:card_script:ulm-simple-default` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_script.png` | [`artifact`](../docs/assets/visual-audit/card_script-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_thermostat` | default-card | `card_thermostat` | — | `default:card_thermostat:ulm-climate` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_thermostat_with_controls.png` | [`artifact`](../docs/assets/visual-audit/card_thermostat-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_title` | default-card | `card_title` | title-and-subtitle | `default:card_title:ulm-title` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_title.png` | [`artifact`](../docs/assets/visual-audit/card_title-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_vacuum` | default-card | `card_vacuum` | — | `default:card_vacuum:ulm-default-vacuum` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_vacuum_cleaning.png` | [`artifact`](../docs/assets/visual-audit/card_vacuum-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_vertical_button` | default-card | `card_vertical_button` | — | `default:card_vertical_button:ulm-vertical-button` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_example.png` | [`artifact`](../docs/assets/visual-audit/card_vertical_button-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_weather` | default-card | `card_weather` | detailed | `default:card_weather:legacy-weather` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_weather.png` | [`artifact`](../docs/assets/visual-audit/card_weather-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_weather_ulm` | default-card | `card_weather` | native | `default:card_weather_ulm:ulm-weather` | `.tmp-ui-minimalist/docs/assets/img/ulm_cards/card_weather_ulm.png` | [`artifact`](../docs/assets/visual-audit/card_weather_ulm-comparison.png) | Accepted | The standalone fixture abbreviates MDI glyphs; Home Assistant renders the configured icons. |
| `card_welcome_scenes` | default-card | `card_welcome_scenes` | — | `card_welcome_scenes` | Source: `custom_components/ui_lovelace_minimalist/lovelace/ulm_templates/card_templates/cards/card_welcome_scenes.yaml` | — | Pending | — |
| `custom_card_afvalophaling` | custom-card | `custom_card_afvalophaling` | — | `custom_card_afvalophaling` | Source: `custom_cards/custom_card_afvalophaling` | — | Pending | — |
| `custom_card_alarm_time` | custom-card | `custom_card_alarm_time` | — | `custom_card_alarm_time` | Source: `custom_cards/custom_card_alarm_time` | — | Pending | — |
| `custom_card_apexcharts` | custom-card | `custom_card_apexcharts` | — | `custom_card_apexcharts` | Source: `custom_cards/custom_card_apexcharts` | — | Pending | — |
| `custom_card_bar_card` | custom-card | `custom_card_bar_card` | — | `bar-card:compact-header-progress` | `.tmp-ui-minimalist/docs/assets/img/screenshot_bar_card.png` | [`artifact`](../docs/assets/visual-audit/custom-card-bar-card-comparison.png) | Accepted | The standalone comparison fixture uses abbreviated icon stubs; Home Assistant renders the configured MDI glyphs. |
| `custom_card_camera` | custom-card | `custom_card_camera` | — | `custom_card_camera` | Source: `custom_cards/custom_card_camera` | — | Pending | — |
| `custom_card_chromecast` | custom-card | `custom_card_chromecast` | — | `custom_card_chromecast` | Source: `custom_cards/custom_card_chromecast` | — | Pending | — |
| `custom_card_damix48_power_details` | custom-card | `custom_card_damix48_power_details` | — | `custom_card_damix48_power_details` | Source: `custom_cards/custom_card_damix48_power_details` | — | Pending | — |
| `custom_card_device_tracker` | custom-card | `custom_card_device_tracker` | — | `custom_card_device_tracker` | Source: `custom_cards/custom_card_device_tracker` | — | Pending | — |
| `custom_card_drealine_roomview` | custom-card | `custom_card_drealine_roomview` | — | `custom_card_drealine_roomview` | Source: `custom_cards/custom_card_drealine_roomview` | — | Pending | — |
| `custom_card_eraycetinay_elapsed_time` | custom-card | `custom_card_eraycetinay_elapsed_time` | — | `custom_card_eraycetinay_elapsed_time` | Source: `custom_cards/custom_card_eraycetinay_elapsed_time` | — | Pending | — |
| `custom_card_eraycetinay_lock` | custom-card | `custom_card_eraycetinay_lock` | — | `custom_card_eraycetinay_lock` | Source: `custom_cards/custom_card_eraycetinay_lock` | — | Pending | — |
| `custom_card_esh_room` | custom-card | `custom_card_esh_room` | — | `custom_card_esh_room` | Source: `custom_cards/custom_card_esh_room` | — | Pending | — |
| `custom_card_esh_welcome` | custom-card | `custom_card_esh_welcome` | — | `custom_card_esh_welcome` | Source: `custom_cards/custom_card_esh_welcome` | — | Pending | — |
| `custom_card_haven_washer` | custom-card | `custom_card_haven_washer` | — | `custom_card_haven_washer` | Source: `custom_cards/custom_card_haven_washer` | — | Pending | — |
| `custom_card_heat_pump` | custom-card | `custom_card_heat_pump` | — | `custom_card_heat_pump` | Source: `custom_cards/custom_card_heat_pump` | — | Pending | — |
| `custom_card_homeassistant_updates` | custom-card | `custom_card_homeassistant_updates` | — | `custom_card_homeassistant_updates` | Source: `custom_cards/custom_card_homeassistant_updates` | — | Pending | — |
| `custom_card_httpedo13_sun` | custom-card | `custom_card_httpedo13_sun` | — | `custom_card_httpedo13_sun` | Source: `custom_cards/custom_card_httpedo13_sun` | — | Pending | — |
| `custom_card_httpedo13_thermostat` | custom-card | `custom_card_httpedo13_thermostat` | — | `custom_card_httpedo13_thermostat` | Source: `custom_cards/custom_card_httpedo13_thermostat` | — | Pending | — |
| `custom_card_iAbadia_battery_chip` | custom-card | `custom_card_iAbadia_battery_chip` | — | `custom_card_iAbadia_battery_chip` | Source: `custom_cards/custom_card_iAbadia_battery_chip` | — | Pending | — |
| `custom_card_imswel_medias` | custom-card | `custom_card_imswel_medias` | — | `custom_card_imswel_medias` | Source: `custom_cards/custom_card_imswel_medias` | — | Pending | — |
| `custom_card_imswel_person` | custom-card | `custom_card_imswel_person` | — | `custom_card_imswel_person` | Source: `custom_cards/custom_card_imswel_person` | — | Pending | — |
| `custom_card_input_datetime` | custom-card | `custom_card_input_datetime` | — | `custom_card_input_datetime` | Source: `custom_cards/custom_card_input_datetime` | — | Pending | — |
| `custom_card_input_number` | custom-card | `custom_card_input_number` | — | `custom_card_input_number` | Source: `custom_cards/custom_card_input_number` | — | Pending | — |
| `custom_card_irmajavi_entities` | custom-card | `custom_card_irmajavi_entities` | — | `custom_card_irmajavi_entities` | Source: `custom_cards/custom_card_irmajavi_entities` | — | Pending | — |
| `custom_card_irmajavi_speedtest` | custom-card | `custom_card_irmajavi_speedtest` | — | `custom_card_irmajavi_speedtest` | Source: `custom_cards/custom_card_irmajavi_speedtest` | — | Pending | — |
| `custom_card_irmajavi_weather` | custom-card | `custom_card_irmajavi_weather` | — | `custom_card_irmajavi_weather` | Source: `custom_cards/custom_card_irmajavi_weather` | — | Pending | — |
| `custom_card_light_colorpick` | custom-card | `custom_card_light_colorpick` | — | `custom_card_light_colorpick` | Source: `custom_cards/custom_card_light_colorpick` | — | Pending | — |
| `custom_card_media_player_sonos` | custom-card | `custom_card_media_player_sonos` | — | `custom_card_media_player_sonos` | Source: `custom_cards/custom_card_media_player_sonos` | — | Pending | — |
| `custom_card_more_power_outlet` | custom-card | `custom_card_more_power_outlet` | — | `custom_card_more_power_outlet` | Source: `custom_cards/custom_card_more_power_outlet` | — | Pending | — |
| `custom_card_mpse_gauge` | custom-card | `custom_card_mpse_gauge` | — | `custom_card_mpse_gauge` | Source: `custom_cards/custom_card_mpse_gauge` | — | Pending | — |
| `custom_card_mpse_printer` | custom-card | `custom_card_mpse_printer` | — | `custom_card_mpse_printer` | Source: `custom_cards/custom_card_mpse_printer` | — | Pending | — |
| `custom_card_mpse_thermostat` | custom-card | `custom_card_mpse_thermostat` | — | `custom_card_mpse_thermostat` | Source: `custom_cards/custom_card_mpse_thermostat` | — | Pending | — |
| `custom_card_mpse_wifisignal` | custom-card | `custom_card_mpse_wifisignal` | — | `custom_card_mpse_wifisignal` | Source: `custom_cards/custom_card_mpse_wifisignal` | — | Pending | — |
| `custom_card_nas` | custom-card | `custom_card_nas` | — | `custom_card_nas` | Source: `custom_cards/custom_card_nas` | — | Pending | — |
| `custom_card_neekster_update` | custom-card | `custom_card_neekster_update` | — | `custom_card_neekster_update` | Source: `custom_cards/custom_card_neekster_update` | — | Pending | — |
| `custom_card_nik_clock` | custom-card | `custom_card_nik_clock` | — | `custom_card_nik_clock` | Source: `custom_cards/custom_card_nik_clock` | — | Pending | — |
| `custom_card_nik_door` | custom-card | `custom_card_nik_door` | — | `custom_card_nik_door` | Source: `custom_cards/custom_card_nik_door` | — | Pending | — |
| `custom_card_nik_nas` | custom-card | `custom_card_nik_nas` | — | `custom_card_nik_nas` | Source: `custom_cards/custom_card_nik_nas` | — | Pending | — |
| `custom_card_nik_tablet` | custom-card | `custom_card_nik_tablet` | — | `custom_card_nik_tablet` | Source: `custom_cards/custom_card_nik_tablet` | — | Pending | — |
| `custom_card_paddy_dwd_pollen` | custom-card | `custom_card_paddy_dwd_pollen` | — | `custom_card_paddy_dwd_pollen` | Source: `custom_cards/custom_card_paddy_dwd_pollen` | — | Pending | — |
| `custom_card_paddy_waste_collection` | custom-card | `custom_card_paddy_waste_collection` | — | `custom_card_paddy_waste_collection` | Source: `custom_cards/custom_card_paddy_waste_collection` | — | Pending | — |
| `custom_card_paddy_welcome` | custom-card | `custom_card_paddy_welcome` | — | `custom_card_paddy_welcome` | Source: `custom_cards/custom_card_paddy_welcome` | — | Pending | — |
| `custom_card_person_chip` | custom-card | `custom_card_person_chip` | — | `custom_card_person_chip` | Source: `custom_cards/custom_card_person_chip` | — | Pending | — |
| `custom_card_person_info` | custom-card | `custom_card_person_info` | full | `custom_card_person_info:full` | Source: `custom_cards/custom_card_person_info` | — | Pending | — |
| `custom_card_person_info_small` | custom-card | `custom_card_person_info` | small | `custom_card_person_info:small` | Source: `custom_cards/custom_card_person_info_small` | — | Pending | — |
| `custom_card_playstation` | custom-card | `custom_card_playstation` | — | `custom_card_playstation` | Source: `custom_cards/custom_card_playstation` | — | Pending | — |
| `custom_card_qubino` | custom-card | `custom_card_qubino` | — | `custom_card_qubino` | Source: `custom_cards/custom_card_qubino` | — | Pending | — |
| `custom_card_ristou_person` | custom-card | `custom_card_ristou_person` | — | `custom_card_ristou_person` | Source: `custom_cards/custom_card_ristou_person` | — | Pending | — |
| `custom_card_saxel_fan` | custom-card | `custom_card_saxel_fan` | — | `custom_card_saxel_fan` | Source: `custom_cards/custom_card_saxel_fan` | — | Pending | — |
| `custom_card_scenes` | custom-card | `card_scenes` | scene-grid | `card_scenes:scene-grid` | Source: `custom_cards/custom_card_scenes` | — | Pending | — |
| `custom_card_schumijo_car` | custom-card | `custom_card_schumijo_car` | — | `custom_card_schumijo_car` | Source: `custom_cards/custom_card_schumijo_car` | — | Pending | — |
| `custom_card_schumijo_flower` | custom-card | `custom_card_schumijo_flower` | — | `custom_card_schumijo_flower` | Source: `custom_cards/custom_card_schumijo_flower` | — | Pending | — |
| `custom_card_senoro_win` | custom-card | `custom_card_senoro_win` | — | `custom_card_senoro_win` | Source: `custom_cards/custom_card_senoro_win` | — | Pending | — |
| `custom_card_sisimomo_printer` | custom-card | `custom_card_sisimomo_printer` | — | `custom_card_sisimomo_printer` | Source: `custom_cards/custom_card_sisimomo_printer` | — | Pending | — |
| `custom_card_speedtest_shogun160` | custom-card | `custom_card_speedtest_shogun160` | — | `custom_card_speedtest_shogun160` | Source: `custom_cards/custom_card_speedtest_shogun160` | — | Pending | — |
| `custom_card_tpx01_aircondition` | custom-card | `custom_card_tpx01_aircondition` | — | `custom_card_tpx01_aircondition` | Source: `custom_cards/custom_card_tpx01_aircondition` | — | Pending | — |
| `custom_card_vncntdev_device_tracer` | custom-card | `custom_card_vncntdev_device_tracer` | — | `custom_card_vncntdev_device_tracer` | Source: `custom_cards/custom_card_vncntdev_device_tracer` | — | Pending | — |
| `custom_card_water_heater` | custom-card | `custom_card_water_heater` | — | `custom_card_water_heater` | Source: `custom_cards/custom_card_water_heater` | — | Pending | — |
| `custom_card_wilbiev_subtitle` | custom-card | `card_title` | divider-subtitle | `card_title:divider-subtitle` | Source: `custom_cards/custom_card_wilbiev_subtitle` | — | Pending | — |
| `custom_card_wilbiev_title` | custom-card | `card_title` | divider-title | `card_title:divider-title` | Source: `custom_cards/custom_card_wilbiev_title` | — | Pending | — |
| `custom_card_wsly_pollen` | custom-card | `custom_card_wsly_pollen` | — | `custom_card_wsly_pollen` | Source: `custom_cards/custom_card_wsly_pollen` | — | Pending | — |
| `custom_card_yagrasdemonde_lights_count` | custom-card | `custom_card_yagrasdemonde_lights_count` | — | `custom_card_yagrasdemonde_lights_count` | Source: `custom_cards/custom_card_yagrasdemonde_lights_count` | — | Pending | — |
