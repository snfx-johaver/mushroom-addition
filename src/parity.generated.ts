/* Generated parity metadata for the documented card catalog. */
import type { ParityEntry } from "./types";

export const PARITY_ENTRIES: readonly ParityEntry[] = [
  {
    "upstreamId": "mini_graph_card",
    "sourcePath": "https://github.com/kalkih/mini-graph-card",
    "publicId": "mini_graph_card",
    "rendererId": "mini_graph_card",
    "layoutProfile": "card:recorder-history+svg-chart",
    "primitives": [
      "ha-card",
      "ha-icon",
      "recorder-history",
      "svg"
    ],
    "customFields": [
      "graph",
      "legend",
      "statistics"
    ],
    "stateDriven": true,
    "animated": true,
    "actions": [
      "tap",
      "hold",
      "double_tap"
    ],
    "variables": [],
    "dependencies": [],
    "backendRequirements": [
      "history/history_during_period"
    ],
    "deviations": [
      "The renderer is an integrated TypeScript implementation and does not require the standalone mini-graph-card frontend resource."
    ],
    "sourceDigest": "9d672bd3d743aa0901ba68d2940a4cb9f86da17df7c54fd93406833bde181b47"
  },
  {
    "upstreamId": "card_battery",
    "sourcePath": "reference_catalog/cards/card_battery.yaml",
    "publicId": "card_battery",
    "rendererId": "card_battery",
    "layoutProfile": "card:button-card+popup",
    "primitives": [
      "button-card",
      "popup"
    ],
    "customFields": [
      "icon",
      "item1",
      "item2",
      "ulm_card_battery_battery_state_entity_id"
    ],
    "stateDriven": true,
    "animated": true,
    "actions": [],
    "variables": [
      {
        "name": "ulm_card_battery_attribute",
        "defaultValue": "<null>",
        "selector": "text"
      },
      {
        "name": "ulm_card_battery_battery_level_danger",
        "defaultValue": "<null>",
        "selector": "text"
      },
      {
        "name": "ulm_card_battery_battery_level_warning",
        "defaultValue": "<null>",
        "selector": "text"
      },
      {
        "name": "ulm_card_battery_battery_state_entity_id",
        "defaultValue": "<null>",
        "selector": "entity"
      },
      {
        "name": "ulm_card_battery_charger_type_entity_id",
        "defaultValue": "<null>",
        "selector": "entity"
      },
      {
        "name": "ulm_card_battery_charging_animation",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_battery_color_battery_level_danger",
        "defaultValue": "\"var(--google-red)\"",
        "selector": "color"
      },
      {
        "name": "ulm_card_battery_color_battery_level_ok",
        "defaultValue": "\"var(--google-green)\"",
        "selector": "color"
      },
      {
        "name": "ulm_card_battery_color_battery_level_warning",
        "defaultValue": "\"var(--google-yellow)\"",
        "selector": "color"
      },
      {
        "name": "ulm_card_battery_name",
        "defaultValue": "\"[[[ return entity.attributes.friendly_name ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_popup",
        "defaultValue": "<documented/inherited>",
        "selector": "boolean"
      },
      {
        "name": "ulm_outlet_power_enable_popup",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_popup_power_outlet_graph_sensor",
        "defaultValue": "<documented/inherited>",
        "selector": "boolean"
      },
      {
        "name": "ulm_popup_power_outlet_sensor1",
        "defaultValue": "<documented/inherited>",
        "selector": "boolean"
      },
      {
        "name": "ulm_popup_power_outlet_sensor2",
        "defaultValue": "<documented/inherited>",
        "selector": "boolean"
      },
      {
        "name": "ulm_templates",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_translation_engine",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_translation_state",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "button-card"
    ],
    "backendRequirements": [],
    "deviations": [],
    "sourceDigest": "af55091a8c7e957582a315c1d6dc8dde0015681ce99c1abbc534e8abfe9b9372"
  },
  {
    "upstreamId": "card_media_player",
    "sourcePath": "reference_catalog/cards/card_media_player.yaml",
    "publicId": "card_media_player",
    "rendererId": "card_media_player",
    "layoutProfile": "card:button-card+popup+control",
    "primitives": [
      "button-card",
      "popup",
      "control"
    ],
    "customFields": [
      "icon",
      "item1",
      "item2",
      "item3",
      "item4",
      "label",
      "state"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [
      "hold_action",
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_active_state",
        "defaultValue": "<documented/inherited>",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_media_player_collapsible",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_media_player_color",
        "defaultValue": "\"blue\"",
        "selector": "color"
      },
      {
        "name": "ulm_card_media_player_enable_art",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_media_player_enable_controls",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_media_player_enable_popup",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_media_player_enable_volume_adjust",
        "defaultValue": "0",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_media_player_enable_volume_buttons",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_media_player_enable_volume_slider",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_media_player_force_background_color",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_media_player_icon",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_media_player_idle_off",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_media_player_more_info",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_media_player_name",
        "defaultValue": "\"[[[ return entity.attributes.friendly_name ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_media_player_player_controls_entity",
        "defaultValue": "\"[[[ return entity.entity_id ]]]\"",
        "selector": "entity"
      },
      {
        "name": "ulm_card_media_player_power_button",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_custom_popup",
        "defaultValue": "<documented/inherited>",
        "selector": "boolean"
      },
      {
        "name": "ulm_templates",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_translation_engine",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_translation_on",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_translation_state",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "button-card",
      "my-slider"
    ],
    "backendRequirements": [
      "media entity/services"
    ],
    "deviations": [
      "Upstream embeds custom:my-slider; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    "sourceDigest": "98d764b1b0ef8d266aa3ea592fbfdae0a1b8b37edf4944dfd0735e06f354578e"
  },
  {
    "upstreamId": "card_room",
    "sourcePath": "reference_catalog/cards/card_room.yaml",
    "publicId": "card_room",
    "rendererId": "card_room",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [
      "icon",
      "label",
      "state"
    ],
    "stateDriven": true,
    "animated": true,
    "actions": [
      "double_tap_action",
      "hold_action",
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_input_select",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_input_select_option",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_templates",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_translation_engine",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_translation_state",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "button-card"
    ],
    "backendRequirements": [],
    "deviations": [
      "Room selection helpers are ignored by this component; use explicit standard actions instead. Roomview and other components retain their own behavior.",
      "Original Room extensions add up to four typed status indicators and an optional RGB light accent. Water/smoke alerts respect reduced motion. Room action buttons infer entity defaults and retain legacy names only for accessibility."
    ],
    "sourceDigest": "e72f25403653d056e1b206e2056f3898e0d469d35656c7f6a25d956e3a5f3fad"
  },
  {
    "upstreamId": "card_scenes",
    "sourcePath": "reference_catalog/cards/card_scenes_welcome.yaml",
    "publicId": "card_scenes",
    "variant": "welcome-pills",
    "rendererId": "card_scenes",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [
      "item1",
      "item2",
      "item3",
      "item4",
      "item5",
      "item6",
      "item7"
    ],
    "stateDriven": false,
    "animated": false,
    "actions": [],
    "variables": [
      {
        "name": "ulm_templates",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "button-card"
    ],
    "backendRequirements": [],
    "deviations": [],
    "sourceDigest": "02a01ff5d4873eaa8c953ac4d39061c9daf661dc1156139a87982e37bb91892f"
  },
  {
    "upstreamId": "card_welcome_scenes",
    "sourcePath": "reference_catalog/cards/card_welcome_scenes.yaml",
    "publicId": "card_welcome_scenes",
    "rendererId": "card_welcome_scenes",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [
      "icon",
      "item1",
      "item2",
      "item3",
      "item4",
      "label",
      "state"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_afternoon",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_welcome_scenes_collapse",
        "defaultValue": "\"[[[ return variables.ulm_card_welcome_scenes_collapse ]]]\"",
        "selector": "boolean"
      },
      {
        "name": "ulm_chip_mdi_icon_only_icon",
        "defaultValue": "\"mdi:cog-outline\"",
        "selector": "icon"
      },
      {
        "name": "ulm_evening",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_hello",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_language",
        "defaultValue": "\"[[[ return variables.ulm_language ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_language_variables",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_morning",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_templates",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_translation_engine",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_translation_scenes",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_weather",
        "defaultValue": "\"[[[ return variables.ulm_weather ]]]\"",
        "selector": "entity"
      }
    ],
    "dependencies": [
      "auto-entities",
      "button-card"
    ],
    "backendRequirements": [],
    "deviations": [
      "Upstream embeds custom:auto-entities; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    "sourceDigest": "055cc3323c175f8b1414ff9f86ce9cbc1762d5358f20797581dd0b0cda0afd90"
  },
  {
    "upstreamId": "custom_card_trash",
    "sourcePath": "custom_cards/custom_card_trash",
    "publicId": "custom_card_trash",
    "rendererId": "custom_card_trash",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [
      "icon",
      "label",
      "state"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [],
    "variables": [
      {
        "name": "ulm_card_datum_gft",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_datum_glas",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_datum_papier",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_datum_pmd",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_datum_rest",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_ophaling_morgen",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_ophaling_vandaag",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_cards",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_language_variables",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_ophaling",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_volgende_ophaling",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "button-card"
    ],
    "backendRequirements": [
      "provider-specific sensor attributes"
    ],
    "deviations": [],
    "sourceDigest": "03cf36ad54d30f5386ebbfb13073e07a2f0f63494536d884b059ac0616fef49f"
  },
  {
    "upstreamId": "custom_card_alarm_time",
    "sourcePath": "custom_cards/custom_card_alarm_time",
    "publicId": "custom_card_alarm_time",
    "rendererId": "custom_card_alarm_time",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [
      "icon",
      "item1",
      "item2",
      "item3",
      "label",
      "state"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_card_alarm_time_collapse",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_alarm_time_color",
        "defaultValue": "\"blue\"",
        "selector": "color"
      },
      {
        "name": "ulm_card_alarm_time_datetime",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_alarm_time_force_background_color",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_alarm_time_horizontal",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_alarm_time_icon",
        "defaultValue": "\"[[[ return entity.attributes.icon ]]]\"",
        "selector": "icon"
      },
      {
        "name": "ulm_card_alarm_time_name",
        "defaultValue": "\"[[[ return entity.attributes.friendly_name ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_alarm_time_step",
        "defaultValue": "15",
        "selector": "number"
      }
    ],
    "dependencies": [
      "button-card"
    ],
    "backendRequirements": [],
    "deviations": [],
    "sourceDigest": "d4453221cd292b5d2f057fb0c78f73af4a54bc6446377ee9c410c69390c573e0"
  },
  {
    "upstreamId": "custom_card_roomview",
    "sourcePath": "custom_cards/custom_card_roomview",
    "publicId": "custom_card_roomview",
    "rendererId": "custom_card_roomview",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [
      "header",
      "header_card",
      "icon",
      "label"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [
      "double_tap_action",
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_actions_card",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_tap_action",
        "defaultValue": "\"[[[ return variables.ulm_card_tap_action; ]]]\"",
        "selector": "action"
      },
      {
        "name": "ulm_card_tap_navigate_path",
        "defaultValue": "\"[[[ return variables.ulm_card_tap_navigate_path; ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_input_select",
        "defaultValue": "\"[[[ return variables.ulm_input_select; ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_input_select_option",
        "defaultValue": "\"[[[ return variables.ulm_input_select_option; ]]]\"",
        "selector": "text"
      }
    ],
    "dependencies": [
      "button-card"
    ],
    "backendRequirements": [],
    "deviations": [],
    "sourceDigest": "a8781de5079b414542ff3cc6653c01448336db8433e9dcbdcb2aa6900d2cf7c8"
  },
  {
    "upstreamId": "custom_card_room_overview",
    "sourcePath": "custom_cards/custom_card_room_overview",
    "publicId": "custom_card_room_overview",
    "rendererId": "custom_card_room_overview",
    "layoutProfile": "card:button-card+popup",
    "primitives": [
      "button-card",
      "popup"
    ],
    "customFields": [
      "icon",
      "label",
      "state"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_actions_card",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_cover_popup",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_dynamic_color",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_room_overview_cover_icon_closed",
        "defaultValue": "\"mdi:roller-shade-closed\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_room_overview_cover_icon_closing",
        "defaultValue": "\"mdi:blinds\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_room_overview_cover_icon_open",
        "defaultValue": "\"mdi:blinds-open\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_room_overview_cover_icon_opening",
        "defaultValue": "\"mdi:blinds\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_room_overview_light_icon_off",
        "defaultValue": "\"mdi:lightbulb-off\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_room_overview_light_icon_on",
        "defaultValue": "\"mdi:lightbulb\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_light_enable_popup",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_thermostat_enable_popup",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_custom_actions",
        "defaultValue": "<documented/inherited>",
        "selector": "action"
      },
      {
        "name": "ulm_custom_card_room_overview_climate_entity",
        "defaultValue": "<null>",
        "selector": "entity"
      },
      {
        "name": "ulm_custom_card_room_overview_cover_entity",
        "defaultValue": "<null>",
        "selector": "entity"
      },
      {
        "name": "ulm_custom_card_room_overview_light_entity",
        "defaultValue": "<null>",
        "selector": "entity"
      },
      {
        "name": "ulm_custom_popup",
        "defaultValue": "<documented/inherited>",
        "selector": "boolean"
      },
      {
        "name": "ulm_popup_cover_entity",
        "defaultValue": "<documented/inherited>",
        "selector": "boolean"
      },
      {
        "name": "ulm_popup_light_entity",
        "defaultValue": "<documented/inherited>",
        "selector": "boolean"
      },
      {
        "name": "ulm_popup_thermostat_entity",
        "defaultValue": "<documented/inherited>",
        "selector": "boolean"
      },
      {
        "name": "ulm_translation_engine",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_translation_state",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "button-card"
    ],
    "backendRequirements": [],
    "deviations": [],
    "sourceDigest": "05d6591e9fc47e3c4664d249a8d6b7e8cfa3b4175487c776042dd67dcaf8f60e"
  },
  {
    "upstreamId": "custom_card_welcome",
    "sourcePath": "custom_cards/custom_card_welcome",
    "publicId": "custom_card_welcome",
    "rendererId": "custom_card_welcome",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [
      "icon",
      "item1",
      "item2",
      "item3",
      "item4",
      "item5",
      "label",
      "state"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_afternoon",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_welcome_collapse",
        "defaultValue": "\"[[[ return variables.ulm_card_welcome_collapse ]]]\"",
        "selector": "boolean"
      },
      {
        "name": "ulm_chip_mdi_icon_only_icon",
        "defaultValue": "\"mdi:cog-outline\"",
        "selector": "icon"
      },
      {
        "name": "ulm_evening",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_hello",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_language_variables",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_morning",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_weather",
        "defaultValue": "\"[[[ return variables.ulm_weather]]]\"",
        "selector": "entity"
      }
    ],
    "dependencies": [
      "button-card"
    ],
    "backendRequirements": [],
    "deviations": [],
    "sourceDigest": "93ce63eb03a118784aa4f2635eafa416641871139cd30adb7e0c533d0ea75708"
  },
  {
    "upstreamId": "custom_card_washer",
    "sourcePath": "custom_cards/custom_card_washer",
    "publicId": "custom_card_washer",
    "rendererId": "custom_card_washer",
    "layoutProfile": "card:button-card+chart",
    "primitives": [
      "button-card",
      "chart"
    ],
    "customFields": [
      "icon",
      "item1",
      "item2",
      "item3",
      "item4",
      "item5",
      "state",
      "state1",
      "state2",
      "state3",
      "state4",
      "state5",
      "ulm_custom_card_washer_job_state",
      "ulm_custom_card_washer_job_states",
      "ulm_custom_card_washer_machine_state"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [
      "hold_action",
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_custom_card_washer_delayed_start",
        "defaultValue": "<null>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_washer_delayed_starttime",
        "defaultValue": "<null>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_washer_job_progress",
        "defaultValue": "<null>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_washer_job_state",
        "defaultValue": "<null>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_washer_job_states",
        "defaultValue": "{\"state1\":{\"name\":null,\"icon\":null},\"state2\":{\"name\":null,\"icon\":null},\"state3\":{\"name\":null,\"icon\":null},\"state4\":{\"name\":null,\"icon\":null},\"state5\":{\"name\":null,\"icon\":null}}",
        "selector": "object"
      },
      {
        "name": "ulm_custom_card_washer_label_configuring",
        "defaultValue": "\"configure\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_washer_label_idle",
        "defaultValue": "\"idle\"",
        "selector": "boolean"
      },
      {
        "name": "ulm_custom_card_washer_label_running",
        "defaultValue": "\"run\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_washer_machine_state",
        "defaultValue": "<null>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_washer_machine_stop_state",
        "defaultValue": "\"stop\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_washer_pause_action",
        "defaultValue": "{\"action\":\"none\"}",
        "selector": "action"
      },
      {
        "name": "ulm_custom_card_washer_power",
        "defaultValue": "<null>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_washer_remote_control",
        "defaultValue": "<null>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_washer_start_action",
        "defaultValue": "{\"action\":\"none\"}",
        "selector": "action"
      },
      {
        "name": "ulm_custom_card_washer_stop_action",
        "defaultValue": "{\"action\":\"none\"}",
        "selector": "action"
      },
      {
        "name": "ulm_language_variables",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_translation_engine",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_translation_state",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "bar-card",
      "button-card"
    ],
    "backendRequirements": [],
    "deviations": [
      "Upstream embeds custom:bar-card; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    "sourceDigest": "04947fa4908ab93e6b7d876a855a33c7a698a4ea2eb6b037c433473d35ecf55f"
  },
  {
    "upstreamId": "custom_card_sun",
    "sourcePath": "custom_cards/custom_card_sun",
    "publicId": "custom_card_sun",
    "rendererId": "custom_card_sun",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [
      "item1"
    ],
    "stateDriven": false,
    "animated": false,
    "actions": [],
    "variables": [],
    "dependencies": [
      "button-card",
      "sun-card"
    ],
    "backendRequirements": [],
    "deviations": [
      "Upstream embeds custom:sun-card; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    "sourceDigest": "074c33e0590eba8959925a6a4a03dddf73472fea73d7ed59cb43bdf209cb1aca"
  },
  {
    "upstreamId": "custom_card_input_datetime",
    "sourcePath": "custom_cards/custom_card_input_datetime",
    "publicId": "custom_card_input_datetime",
    "rendererId": "custom_card_input_datetime",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [
      "item1",
      "item2",
      "item3",
      "state"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [
      "hold_action",
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_card_input_datetime_name",
        "defaultValue": "\"n/a\"",
        "selector": "text"
      },
      {
        "name": "ulm_translation_engine",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_translation_state",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "button-card"
    ],
    "backendRequirements": [],
    "deviations": [],
    "sourceDigest": "209eb00bb2ff7a561326bbb3377ae486d3959816f5916ffc63cbf3e70b4e1645"
  },
  {
    "upstreamId": "custom_card_weather_metrics",
    "sourcePath": "custom_cards/custom_card_weather_metrics",
    "publicId": "custom_card_weather_metrics",
    "rendererId": "custom_card_weather_metrics",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [
      "item1",
      "item2",
      "item3",
      "item4",
      "label"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [],
    "variables": [
      {
        "name": "ulm_custom_card_weather_metrics",
        "defaultValue": "<documented/inherited>",
        "selector": "entity"
      },
      {
        "name": "ulm_custom_card_weather_metrics_date",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_weather_metrics_entity_1",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_weather_metrics_entity_2",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_weather_metrics_entity_3",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_weather_metrics_entity_4",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_weather_metrics_name_1",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_weather_metrics_name_2",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_weather_metrics_name_3",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_weather_metrics_name_4",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_weather_metrics_temperature_outside",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "button-card"
    ],
    "backendRequirements": [
      "weather entity/forecast API"
    ],
    "deviations": [],
    "sourceDigest": "5dd798c6cf0f8cb996bb3b522079d1c52aadbb523e217f35e2c35a66459b5956"
  },
  {
    "upstreamId": "custom_card_media_player_sonos",
    "sourcePath": "custom_cards/custom_card_media_player_sonos",
    "publicId": "custom_card_media_player_sonos",
    "rendererId": "custom_card_media_player_sonos",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [
      "icon",
      "item1",
      "item2",
      "item3",
      "label",
      "state"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_card_media_player_with_controls_entity",
        "defaultValue": "<documented/inherited>",
        "selector": "entity"
      },
      {
        "name": "ulm_card_media_player_with_controls_name",
        "defaultValue": "\"No name set\"",
        "selector": "text"
      },
      {
        "name": "ulm_translation_engine",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_translation_state",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "button-card"
    ],
    "backendRequirements": [
      "media entity/services"
    ],
    "deviations": [],
    "sourceDigest": "43e2b1382095299759e872abb8a92f8ad9b56c60dfe018b83e2ad43b5adfcaef"
  },
  {
    "upstreamId": "custom_card_printer",
    "sourcePath": "custom_cards/custom_card_printer",
    "publicId": "custom_card_printer",
    "rendererId": "custom_card_printer",
    "layoutProfile": "card:button-card+chart",
    "primitives": [
      "button-card",
      "chart"
    ],
    "customFields": [
      "icon",
      "item1",
      "item2",
      "item3",
      "item4",
      "item5",
      "label"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [],
    "variables": [
      {
        "name": "ulm_card_printer_black_name",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_printer_cyan_name",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_printer_magenta_name",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_printer_name",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_printer_yellow_name",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "bar-card",
      "button-card"
    ],
    "backendRequirements": [],
    "deviations": [
      "Upstream embeds custom:bar-card; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    "sourceDigest": "900ec6ff5ac98c1bc5e1ec6d5c751649c9b44681dd363daa67bd7a6450cf72e1"
  },
  {
    "upstreamId": "custom_card_nas_metrics",
    "sourcePath": "custom_cards/custom_card_nas_metrics",
    "publicId": "custom_card_nas_metrics",
    "rendererId": "custom_card_nas_metrics",
    "layoutProfile": "card:button-card+horizontal-stack+chart",
    "primitives": [
      "button-card",
      "horizontal-stack",
      "chart"
    ],
    "customFields": [
      "header",
      "icon",
      "item1",
      "item2",
      "item3",
      "item4",
      "item5"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_card_generic_swap_icon",
        "defaultValue": "\"[[[ return variables.entity_4.icon ]]]\"",
        "selector": "icon"
      },
      {
        "name": "ulm_card_generic_swap_name",
        "defaultValue": "\"[[[ return variables.entity_4.name ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_input_boolean_icon",
        "defaultValue": "\"mdi:nas\"",
        "selector": "icon"
      },
      {
        "name": "ulm_card_input_boolean_name",
        "defaultValue": "\"[[[ return variables.ulm_translation_status ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_translation_engine",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_translation_status",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "apexcharts-card",
      "button-card"
    ],
    "backendRequirements": [
      "history/statistics"
    ],
    "deviations": [
      "Upstream embeds custom:apexcharts-card; this plugin provides an original Lit equivalent without requiring that frontend dependency.",
      "Exact historical series requires Home Assistant recorder/statistics data; the fixture and preview use deterministic sample data when history is unavailable."
    ],
    "sourceDigest": "342ce893e03052a243cca28238250035167fc30a6df076783393c50b516dd968"
  },
  {
    "upstreamId": "custom_card_tablet",
    "sourcePath": "custom_cards/custom_card_tablet",
    "publicId": "custom_card_tablet",
    "rendererId": "custom_card_tablet",
    "layoutProfile": "card:button-card+chart",
    "primitives": [
      "button-card",
      "chart"
    ],
    "customFields": [
      "item1",
      "item2",
      "item3",
      "item4",
      "item5",
      "label"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_card_generic_name",
        "defaultValue": "\"[[[ return variables.ulm_custom_bar_card_tablet_card_name != '' ? variables.ulm_custom_bar_card_tablet_card_name : '' ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_input_boolean_icon",
        "defaultValue": "\"mdi:tablet\"",
        "selector": "icon"
      },
      {
        "name": "ulm_card_input_boolean_name",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_tablet_name ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_bar_card_tablet_card_entity",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_tablet_battery ]]]\"",
        "selector": "entity"
      },
      {
        "name": "ulm_custom_bar_card_tablet_card_indicator",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_custom_bar_card_tablet_card_name",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_tablet_battery_name ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_bar_card_tablet_card_value",
        "defaultValue": "true",
        "selector": "boolean"
      },
      {
        "name": "ulm_custom_card_tablet_battery",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_tablet_battery ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_tablet_battery_name",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_tablet_battery_name ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_tablet_button1",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_tablet_button1 ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_tablet_button2",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_tablet_button2 ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_tablet_button3",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_tablet_button3 ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_tablet_main",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_tablet_main ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_tablet_maintenance",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_tablet_maintenance ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_tablet_name",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_tablet_name ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_tablet_par1",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_tablet_par1 ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_tablet_par1_name",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_tablet_par1_name ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_tablet_par2",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_tablet_par2 ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_tablet_par2_name",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_tablet_par2_name ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_tablet_par3",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_tablet_par3 ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_tablet_par3_name",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_tablet_par3_name ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_tablet_reload",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_tablet_reload ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_tablet_restart",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_tablet_restart ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_language_variables",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "bar-card",
      "button-card"
    ],
    "backendRequirements": [],
    "deviations": [
      "Upstream embeds custom:bar-card; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    "sourceDigest": "14f3979bde156f30d644eb1240a24b96801d13af74929c521817fcb9f62a40aa"
  },
  {
    "upstreamId": "custom_card_playstation",
    "sourcePath": "custom_cards/custom_card_playstation",
    "publicId": "custom_card_playstation",
    "rendererId": "custom_card_playstation",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [
      "icon",
      "label"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [],
    "variables": [
      {
        "name": "ulm_translation_engine",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_translation_state",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "button-card"
    ],
    "backendRequirements": [
      "media entity/services"
    ],
    "deviations": [],
    "sourceDigest": "6a896e28456967bb271ab188f8006fdb87fd560f6a3749ead10719ebd51fdf06"
  },
  {
    "upstreamId": "custom_card_scenes",
    "sourcePath": "custom_cards/custom_card_scenes",
    "publicId": "card_scenes",
    "variant": "scene-grid",
    "rendererId": "card_scenes",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [
      "icon",
      "item1",
      "item2",
      "item3",
      "item4",
      "item5",
      "state"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [
      "tap_action"
    ],
    "variables": [],
    "dependencies": [
      "button-card"
    ],
    "backendRequirements": [],
    "deviations": [],
    "sourceDigest": "c2613ff61eb10100b101b380086774366b5ee38194a468becca5bcaf57d618e1"
  },
  {
    "upstreamId": "custom_card_plant",
    "sourcePath": "custom_cards/custom_card_plant",
    "publicId": "custom_card_plant",
    "rendererId": "custom_card_plant",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [
      "icon",
      "item1",
      "item2"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_card_flower_entity",
        "defaultValue": "<documented/inherited>",
        "selector": "entity"
      },
      {
        "name": "ulm_card_flower_name",
        "defaultValue": "\"No name set\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_flower_show_bars",
        "defaultValue": "<documented/inherited>",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_flower_species",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_plant_correct",
        "defaultValue": "\"Correto\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_plant_language_variables",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_plant_problem",
        "defaultValue": "\"Problema\"",
        "selector": "text"
      }
    ],
    "dependencies": [
      "button-card",
      "flower-card"
    ],
    "backendRequirements": [],
    "deviations": [
      "Upstream embeds custom:flower-card; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    "sourceDigest": "02ae73a2485419633c91da2a275442d8ef179bff1e0887eafe5ebbe155bd7622"
  },
  {
    "upstreamId": "custom_card_speedtest_gauges",
    "sourcePath": "custom_cards/custom_card_speedtest_gauges",
    "publicId": "custom_card_speedtest_gauges",
    "rendererId": "custom_card_speedtest_gauges",
    "layoutProfile": "card:button-card+chart",
    "primitives": [
      "button-card",
      "chart"
    ],
    "customFields": [
      "dataLabels",
      "icon",
      "item1",
      "item2",
      "item3",
      "label"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_custom_card_speedtest_download_speed_color",
        "defaultValue": "\"var(--google-yellow)\"",
        "selector": "color"
      },
      {
        "name": "ulm_custom_card_speedtest_download_speed_entity",
        "defaultValue": "<documented/inherited>",
        "selector": "entity"
      },
      {
        "name": "ulm_custom_card_speedtest_download_speed_max",
        "defaultValue": "100",
        "selector": "number"
      },
      {
        "name": "ulm_custom_card_speedtest_ping_color",
        "defaultValue": "\"var(--google-green)\"",
        "selector": "color"
      },
      {
        "name": "ulm_custom_card_speedtest_ping_entity",
        "defaultValue": "<documented/inherited>",
        "selector": "entity"
      },
      {
        "name": "ulm_custom_card_speedtest_ping_max",
        "defaultValue": "85",
        "selector": "number"
      },
      {
        "name": "ulm_custom_card_speedtest_round",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_custom_card_speedtest_upload_speed_color",
        "defaultValue": "\"var(--google-blue)\"",
        "selector": "color"
      },
      {
        "name": "ulm_custom_card_speedtest_upload_speed_entity",
        "defaultValue": "<documented/inherited>",
        "selector": "entity"
      },
      {
        "name": "ulm_custom_card_speedtest_upload_speed_max",
        "defaultValue": "40",
        "selector": "number"
      }
    ],
    "dependencies": [
      "apexcharts-card",
      "button-card"
    ],
    "backendRequirements": [
      "history/statistics"
    ],
    "deviations": [
      "Upstream embeds custom:apexcharts-card; this plugin provides an original Lit equivalent without requiring that frontend dependency.",
      "Exact historical series requires Home Assistant recorder/statistics data; the fixture and preview use deterministic sample data when history is unavailable."
    ],
    "sourceDigest": "70e47e2c8ce62a205c6c41e956435432292e5ff0322c638d92f529fc8083859d"
  },
  {
    "upstreamId": "custom_card_pollen",
    "sourcePath": "custom_cards/custom_card_pollen",
    "publicId": "custom_card_pollen",
    "rendererId": "custom_card_pollen",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [
      "icon",
      "item1",
      "item2",
      "item3"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [],
    "variables": [],
    "dependencies": [
      "button-card"
    ],
    "backendRequirements": [
      "provider-specific sensor attributes"
    ],
    "deviations": [],
    "sourceDigest": "e41b8c1f961cc37f153aa55b2401b0becc2ee49ac0b40ec19c36aaef09c8f98b"
  }
];

export const PARITY_BY_ID = new Map(PARITY_ENTRIES.map((entry) => [entry.upstreamId, entry]));
