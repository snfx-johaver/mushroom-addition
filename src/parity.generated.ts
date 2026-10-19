/* Generated parity metadata for the documented card catalog. */
import type { ParityEntry } from "./types";

export const PARITY_ENTRIES: readonly ParityEntry[] = [
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
    "upstreamId": "card_cover",
    "sourcePath": "reference_catalog/cards/card_cover.yaml",
    "publicId": "card_cover",
    "rendererId": "card_cover",
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
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_active_state",
        "defaultValue": "<documented/inherited>",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_cover_color",
        "defaultValue": "\"blue\"",
        "selector": "color"
      },
      {
        "name": "ulm_card_cover_display_left_right",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_cover_enable_controls",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_cover_enable_horizontal",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_cover_enable_popup",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_cover_enable_slider",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_cover_enable_tilt",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_cover_favorite_percentage",
        "defaultValue": "<null>",
        "selector": "text"
      },
      {
        "name": "ulm_card_cover_force_background_color",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_cover_garage_large",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_cover_gate",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_cover_icon",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_cover_invert_percent",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_cover_name",
        "defaultValue": "\"[[[ return entity.attributes.friendly_name ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_cover_show_last_changed",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_cover_slider_max",
        "defaultValue": "100",
        "selector": "number"
      },
      {
        "name": "ulm_card_cover_slider_min",
        "defaultValue": "0",
        "selector": "number"
      },
      {
        "name": "ulm_card_invert_percent",
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
        "name": "ulm_translation_state",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "button-card",
      "my-slider"
    ],
    "backendRequirements": [],
    "deviations": [
      "Upstream embeds custom:my-slider; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    "sourceDigest": "37b380f5d8445b95e68fa7c65fa296f3bd027a1bb9d6d82539f5d51bfeafc9c8"
  },
  {
    "upstreamId": "card_graph",
    "sourcePath": "reference_catalog/cards/card_graph.yaml",
    "publicId": "card_graph",
    "rendererId": "card_graph",
    "layoutProfile": "card:button-card+chart",
    "primitives": [
      "button-card",
      "chart"
    ],
    "customFields": [
      "icon",
      "item1",
      "item2"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [],
    "variables": [
      {
        "name": "ulm_card_generic_icon",
        "defaultValue": "\"[[[ return variables.ulm_card_graph_icon; ]]]\"",
        "selector": "icon"
      },
      {
        "name": "ulm_card_generic_name",
        "defaultValue": "\"[[[ return variables.ulm_card_graph_name; ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_graph_color",
        "defaultValue": "\"var(--info-color)\"",
        "selector": "color"
      },
      {
        "name": "ulm_card_graph_color2",
        "defaultValue": "\"var(--info-color)\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_graph_entity",
        "defaultValue": "<documented/inherited>",
        "selector": "entity"
      },
      {
        "name": "ulm_card_graph_entity2",
        "defaultValue": "\"\"",
        "selector": "entity"
      },
      {
        "name": "ulm_card_graph_group_by",
        "defaultValue": "\"interval\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_graph_hours",
        "defaultValue": "24",
        "selector": "number"
      },
      {
        "name": "ulm_card_graph_icon",
        "defaultValue": "\"[[[ return entity.attributes.icon ]]]\"",
        "selector": "icon"
      },
      {
        "name": "ulm_card_graph_icon_color",
        "defaultValue": "\"\"",
        "selector": "color"
      },
      {
        "name": "ulm_card_graph_line_width",
        "defaultValue": "5",
        "selector": "number"
      },
      {
        "name": "ulm_card_graph_name",
        "defaultValue": "\"[[[ return entity.attributes.friendly_name; ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_graph_points",
        "defaultValue": "\"0.5\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_graph_type",
        "defaultValue": "\"fill\"",
        "selector": "text"
      },
      {
        "name": "ulm_templates",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "button-card",
      "mini-graph-card"
    ],
    "backendRequirements": [
      "history/statistics"
    ],
    "deviations": [
      "Upstream embeds custom:mini-graph-card; this plugin provides an original Lit equivalent without requiring that frontend dependency.",
      "Exact historical series requires Home Assistant recorder/statistics data; the fixture and preview use deterministic sample data when history is unavailable."
    ],
    "sourceDigest": "01217c554ddca97d6527ab117629b7317348bbec922e858596dc61240ed594d0"
  },
  {
    "upstreamId": "card_light",
    "sourcePath": "reference_catalog/cards/card_light.yaml",
    "publicId": "card_light",
    "rendererId": "card_light",
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
        "name": "ulm_active_state",
        "defaultValue": "<documented/inherited>",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_light_brightness_high",
        "defaultValue": "100",
        "selector": "number"
      },
      {
        "name": "ulm_card_light_brightness_low",
        "defaultValue": "1",
        "selector": "number"
      },
      {
        "name": "ulm_card_light_brightness_medium",
        "defaultValue": "50",
        "selector": "number"
      },
      {
        "name": "ulm_card_light_color",
        "defaultValue": "\"yellow\"",
        "selector": "color"
      },
      {
        "name": "ulm_card_light_color_palette",
        "defaultValue": "\"\"",
        "selector": "color"
      },
      {
        "name": "ulm_card_light_enable_buttons",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_light_enable_collapse",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_light_enable_color",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_light_enable_horizontal",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_light_enable_horizontal_wide",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_light_enable_popup",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_light_enable_popup_tap",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_light_enable_slider",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_light_enable_slider_maxSet",
        "defaultValue": "100",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_light_enable_slider_minSet",
        "defaultValue": "0",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_light_force_background_color",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_light_icon",
        "defaultValue": "\"[[[ return entity.attributes.icon ]]]\"",
        "selector": "icon"
      },
      {
        "name": "ulm_card_light_name",
        "defaultValue": "\"[[[ return entity.attributes.friendly_name ]]]\"",
        "selector": "text"
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
        "name": "ulm_translation_state",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "button-card",
      "my-slider"
    ],
    "backendRequirements": [],
    "deviations": [
      "Upstream embeds custom:my-slider; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    "sourceDigest": "97d72851f730a3fe11d02cd3c463af7b31cfeba930bf5c36d6287a0399104f79"
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
    "upstreamId": "card_person",
    "sourcePath": "reference_catalog/cards/card_person.yaml",
    "publicId": "card_person",
    "rendererId": "card_person",
    "layoutProfile": "card:native-card",
    "primitives": [
      "native-card"
    ],
    "customFields": [
      "icon"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_address",
        "defaultValue": "\"\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_person_battery",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_person_entity",
        "defaultValue": "<documented/inherited>",
        "selector": "entity"
      },
      {
        "name": "ulm_card_person_eta",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_person_icon",
        "defaultValue": "\"mdi:face-man\"",
        "selector": "icon"
      },
      {
        "name": "ulm_card_person_use_entity_picture",
        "defaultValue": "false",
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
      }
    ],
    "dependencies": [],
    "backendRequirements": [
      "person/device-tracker entities"
    ],
    "deviations": [],
    "sourceDigest": "3b8e43f4ee9d9c8fcf18eaf06cd8e5aea7366eb04b3814f97dc25f9ddf4533ab"
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
    "animated": false,
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
    "deviations": [],
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
    "upstreamId": "card_vacuum",
    "sourcePath": "reference_catalog/cards/card_vacuum.yaml",
    "publicId": "card_vacuum",
    "rendererId": "card_vacuum",
    "layoutProfile": "card:button-card+popup",
    "primitives": [
      "button-card",
      "popup"
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
        "name": "ulm_active_state",
        "defaultValue": "<documented/inherited>",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_vacuum_camera",
        "defaultValue": "\"\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_vacuum_camera_toggle",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_vacuum_color",
        "defaultValue": "\"[[[\\n  var state = entity.state.toLowerCase();\\n  var colors = {\\n    \\\"cleaning\\\": \\\"blue\\\",\\n    \\\"mowing\\\": \\\"blue\\\",\\n    \\\"paused\\\": \\\"green\\\",\\n    \\\"mopping\\\": \\\"yellow\\\",\\n    \\\"returning\\\": \\\"purple\\\",\\n    \\\"error\\\": \\\"red\\\",\\n    \\\"default\\\": \\\"theme\\\"\\n  }\\n  return (colors[state] || colors[\\\"default\\\"]);\\n]]]\\n\"",
        "selector": "color"
      },
      {
        "name": "ulm_card_vacuum_enable_popup",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_vacuum_force_background_color",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_vacuum_icon",
        "defaultValue": "\"[[[ return entity.attributes.icon ]]]\"",
        "selector": "icon"
      },
      {
        "name": "ulm_card_vacuum_label",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_vacuum_name",
        "defaultValue": "\"[[[ return entity.attributes.friendly_name ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_vacuum_room",
        "defaultValue": "<null>",
        "selector": "text"
      },
      {
        "name": "ulm_card_vacuum_room_icon",
        "defaultValue": "\"[[[ return entity.attributes.icon ]]]\"",
        "selector": "icon"
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
    "sourceDigest": "208a00987823e08026310f9945461d59203106aa04b4e11c45caaae3c97df9e9"
  },
  {
    "upstreamId": "card_vertical_button",
    "sourcePath": "reference_catalog/cards/vertical_buttons.yaml",
    "publicId": "card_vertical_button",
    "rendererId": "card_vertical_button",
    "layoutProfile": "card:native-card",
    "primitives": [
      "native-card"
    ],
    "customFields": [
      "icon",
      "label"
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
    "dependencies": [],
    "backendRequirements": [],
    "deviations": [],
    "sourceDigest": "7b93758fc74faf4d4a8cdd8469adfa72f359fcc27ebfda16870581738ccf6935"
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
    "upstreamId": "custom_card_apexcharts",
    "sourcePath": "custom_cards/custom_card_apexcharts",
    "publicId": "custom_card_apexcharts",
    "rendererId": "custom_card_apexcharts",
    "layoutProfile": "card:button-card+chart",
    "primitives": [
      "button-card",
      "chart"
    ],
    "customFields": [
      "header",
      "icon",
      "item1",
      "item2",
      "item3"
    ],
    "stateDriven": false,
    "animated": false,
    "actions": [
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_card_generic_swap_icon",
        "defaultValue": "\"[[[ return variables.entity_3.icon ]]]\"",
        "selector": "icon"
      },
      {
        "name": "ulm_card_generic_swap_name",
        "defaultValue": "\"[[[ return variables.entity_3.name ]]]\"",
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
    "sourceDigest": "4fbc07ebb6280ff576ea3896e41f15f26b537929eb150352f1363a2f40b1f8b9"
  },
  {
    "upstreamId": "custom_card_bar_card",
    "sourcePath": "custom_cards/custom_card_bar_card",
    "publicId": "custom_card_bar_card",
    "rendererId": "custom_card_bar_card",
    "layoutProfile": "card:button-card+chart",
    "primitives": [
      "button-card",
      "chart"
    ],
    "customFields": [
      "icon",
      "item1",
      "item2"
    ],
    "stateDriven": false,
    "animated": false,
    "actions": [],
    "variables": [
      {
        "name": "ulm_card_generic_icon",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_bar_card_icon; ]]]\"",
        "selector": "icon"
      },
      {
        "name": "ulm_card_generic_name",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_bar_card_name; ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_bar_card_color",
        "defaultValue": "\"var(--google-blue)\"",
        "selector": "color"
      },
      {
        "name": "ulm_custom_card_bar_card_icon",
        "defaultValue": "\"[[[ return entity.attributes.icon ]]]\"",
        "selector": "icon"
      },
      {
        "name": "ulm_custom_card_bar_card_icon_color",
        "defaultValue": "\"\"",
        "selector": "color"
      },
      {
        "name": "ulm_custom_card_bar_card_indicator",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_bar_card_max",
        "defaultValue": "\"100\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_bar_card_min",
        "defaultValue": "\"0\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_bar_card_name",
        "defaultValue": "\"[[[ return entity.attributes.friendly_name; ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_bar_card_show_icon",
        "defaultValue": "true",
        "selector": "boolean"
      },
      {
        "name": "ulm_custom_card_bar_card_value",
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
    "sourceDigest": "7156ed70b9bc402ae01e76cd3c9b6b65efad7d84667bf59bdaea74b49cff6cd3"
  },
  {
    "upstreamId": "custom_card_camera",
    "sourcePath": "custom_cards/custom_card_camera",
    "publicId": "custom_card_camera",
    "rendererId": "custom_card_camera",
    "layoutProfile": "card:button-card+image",
    "primitives": [
      "button-card",
      "image"
    ],
    "customFields": [
      "item1",
      "item2",
      "label"
    ],
    "stateDriven": false,
    "animated": false,
    "actions": [
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_custom_card_camera_aspect_ratio",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_camera_label",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_camera_name",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_camera_title",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "button-card"
    ],
    "backendRequirements": [
      "camera entity/stream API"
    ],
    "deviations": [],
    "sourceDigest": "abf5b29b835da6e7501c6229a49c7dffa6a3e7e83a351398a04878d3b2b04334"
  },
  {
    "upstreamId": "custom_card_chromecast",
    "sourcePath": "custom_cards/custom_card_chromecast",
    "publicId": "custom_card_chromecast",
    "rendererId": "custom_card_chromecast",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [
      "icon",
      "item1",
      "item2",
      "item3",
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
    "sourceDigest": "bb8f062dbddf46ec1d4763c55e6ef7bf625790e1bce8630632ff2d3730ce3721"
  },
  {
    "upstreamId": "custom_card_power_details",
    "sourcePath": "custom_cards/custom_card_power_details",
    "publicId": "custom_card_power_details",
    "rendererId": "custom_card_power_details",
    "layoutProfile": "card:button-card+chart",
    "primitives": [
      "button-card",
      "chart"
    ],
    "customFields": [
      "item1",
      "item2"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [],
    "variables": [
      {
        "name": "ulm_card_generic_swap_name",
        "defaultValue": "\"[[[ return variables.ulm_card_power_details_name ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_power_details_24hour",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_power_details_entity",
        "defaultValue": "<documented/inherited>",
        "selector": "entity"
      },
      {
        "name": "ulm_card_power_details_height",
        "defaultValue": "180",
        "selector": "number"
      },
      {
        "name": "ulm_card_power_details_hours",
        "defaultValue": "2",
        "selector": "number"
      },
      {
        "name": "ulm_card_power_details_name",
        "defaultValue": "\"n/a\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_power_details_thresholds",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_power_details_hour",
        "defaultValue": "\"timmen\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_power_details_hours",
        "defaultValue": "\"timmarna\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_power_details_in_the_last",
        "defaultValue": "\"Den senaste\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_power_details_in_the_lasts",
        "defaultValue": "\"De senaste\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_power_details_language_variables",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "button-card",
      "mini-graph-card"
    ],
    "backendRequirements": [
      "history/statistics"
    ],
    "deviations": [
      "Upstream embeds custom:mini-graph-card; this plugin provides an original Lit equivalent without requiring that frontend dependency.",
      "Exact historical series requires Home Assistant recorder/statistics data; the fixture and preview use deterministic sample data when history is unavailable."
    ],
    "sourceDigest": "e2311eb17911bbeff8cfe60ec267d076d3b916d7b497124562bb88623a2fc3f9"
  },
  {
    "upstreamId": "custom_card_device_tracker",
    "sourcePath": "custom_cards/custom_card_device_tracker",
    "publicId": "custom_card_device_tracker",
    "rendererId": "custom_card_device_tracker",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [
      "icon"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_custom_card_device_tracker_icon",
        "defaultValue": "<documented/inherited>",
        "selector": "icon"
      },
      {
        "name": "ulm_custom_card_device_tracker_tracker_1_entity",
        "defaultValue": "<documented/inherited>",
        "selector": "entity"
      },
      {
        "name": "ulm_custom_card_device_tracker_tracker_1_type",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_device_tracker_tracker_2_entity",
        "defaultValue": "<documented/inherited>",
        "selector": "entity"
      },
      {
        "name": "ulm_custom_card_device_tracker_tracker_2_type",
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
    "backendRequirements": [
      "person/device-tracker entities"
    ],
    "deviations": [],
    "sourceDigest": "c9efd2a8ef99a5335e0d4dd510f6fb5679b4b0d42adad5268d1ed317aaedcb0d"
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
    "upstreamId": "custom_card_media_library",
    "sourcePath": "custom_cards/custom_card_media_library",
    "publicId": "custom_card_media_library",
    "rendererId": "custom_card_media_library",
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
        "name": "ulm_custom_card_media_library_in_theaters",
        "defaultValue": "\"au cinéma\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_media_library_locale",
        "defaultValue": "\"fr-FR\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_media_library_index",
        "defaultValue": "1",
        "selector": "number"
      },
      {
        "name": "ulm_custom_card_media_library_platform",
        "defaultValue": "\"[[[\\n  if (entity.entity_id.includes(\\\"sonarr\\\")){\\n    return \\\"sonarr\\\";\\n  } else if(entity.entity_id.includes(\\\"plex\\\")){\\n    return \\\"plex\\\";\\n  } else{\\n    return \\\"radarr\\\";\\n  }\\n]]]\\n\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_media_library_recentlyadded",
        "defaultValue": "\"Récemment ajouté\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_media_library_today",
        "defaultValue": "\"Aujourd'hui\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_media_library_tommorow",
        "defaultValue": "\"Demain\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_media_library_weekday",
        "defaultValue": "\"[[[\\n  return [\\\"Dimanche\\\",\\\"Lundi\\\",\\\"Mardi\\\",\\\"Mercredi\\\",\\\"Jeudi\\\",\\\"Vendredi\\\",\\\"Samedi\\\"];\\n]]]\\n\"",
        "selector": "text"
      },
      {
        "name": "ulm_translation_engine",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_translation_unavailable",
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
    "sourceDigest": "0c6ae5e28570083204008c10238f083d121130eea72c2f689439e77fc1c22239"
  },
  {
    "upstreamId": "custom_card_person_location",
    "sourcePath": "custom_cards/custom_card_person_location",
    "publicId": "custom_card_person_location",
    "rendererId": "custom_card_person_location",
    "layoutProfile": "card:button-card+vertical-stack+horizontal-stack+entities+popup",
    "primitives": [
      "button-card",
      "vertical-stack",
      "horizontal-stack",
      "entities",
      "popup"
    ],
    "customFields": [
      "icon"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_card_person_location_entity",
        "defaultValue": "<documented/inherited>",
        "selector": "entity"
      },
      {
        "name": "ulm_card_person_location_findmy_script",
        "defaultValue": "<documented/inherited>",
        "selector": "entity"
      },
      {
        "name": "ulm_card_person_location_gps_tracker",
        "defaultValue": "<documented/inherited>",
        "selector": "entity"
      },
      {
        "name": "ulm_card_person_location_use_entity_picture",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_person_location_wifi_tracker",
        "defaultValue": "<documented/inherited>",
        "selector": "entity"
      },
      {
        "name": "ulm_custom_card_person_location_findmy",
        "defaultValue": "\"Encontrar meu celular\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_person_location_home",
        "defaultValue": "\"Aqui\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_person_location_language_variables",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_person_location_not_home",
        "defaultValue": "\"Ausente\"",
        "selector": "text"
      },
      {
        "name": "ulm_translation_engine",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_translation_unavailable",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "button-card"
    ],
    "backendRequirements": [
      "history/statistics",
      "person/device-tracker entities"
    ],
    "deviations": [
      "Exact historical series requires Home Assistant recorder/statistics data; the fixture and preview use deterministic sample data when history is unavailable."
    ],
    "sourceDigest": "29564a2b6ae37672d380381f21709cc67927728fbc564779cf324da0898b2e4b"
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
    "upstreamId": "custom_card_entity_overview",
    "sourcePath": "custom_cards/custom_card_entity_overview",
    "publicId": "custom_card_entity_overview",
    "rendererId": "custom_card_entity_overview",
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
        "name": "ulm_custom_card_entity_overview",
        "defaultValue": "<documented/inherited>",
        "selector": "entity-multiple"
      },
      {
        "name": "ulm_custom_card_entity_overview_entity_1",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_entity_overview_entity_2",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_entity_overview_entity_3",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_entity_overview_entity_4",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_entity_overview_icon",
        "defaultValue": "<documented/inherited>",
        "selector": "icon"
      },
      {
        "name": "ulm_custom_card_entity_overview_name",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_entity_overview_name_1",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_entity_overview_name_2",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_entity_overview_name_3",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_entity_overview_name_4",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_metrics_entitites_name",
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
    "sourceDigest": "fc79ef9de6d5fdd2474f301594d8fe32433576b67ba1d9f01c0a049c1825fb21"
  },
  {
    "upstreamId": "custom_card_internet_speed",
    "sourcePath": "custom_cards/custom_card_internet_speed",
    "publicId": "custom_card_internet_speed",
    "rendererId": "custom_card_internet_speed",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [
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
        "name": "ulm_custom_card_internet_speed_color",
        "defaultValue": "\"blue\"",
        "selector": "color"
      },
      {
        "name": "ulm_custom_card_internet_speed_download",
        "defaultValue": "\"Prędkość pobierania\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_internet_speed_download_speed_entity",
        "defaultValue": "<documented/inherited>",
        "selector": "entity"
      },
      {
        "name": "ulm_custom_card_internet_speed_language_variables",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_internet_speed_ping_entity",
        "defaultValue": "<documented/inherited>",
        "selector": "entity"
      },
      {
        "name": "ulm_custom_card_internet_speed_router_model",
        "defaultValue": "\"router_model\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_internet_speed_router_name",
        "defaultValue": "\"router_name\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_internet_speed_speedtest",
        "defaultValue": "\"Test prędkości Internetu\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_internet_speed_upload",
        "defaultValue": "\"Prędkość wysyłania\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_internet_speed_upload_speed_entity",
        "defaultValue": "<documented/inherited>",
        "selector": "entity"
      }
    ],
    "dependencies": [
      "button-card"
    ],
    "backendRequirements": [],
    "deviations": [],
    "sourceDigest": "5188e9eb19a25cae7ff693051c0bc2c426af398bb12a9501e3cfee1ea715d40f"
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
    "upstreamId": "custom_card_more_power_outlet",
    "sourcePath": "custom_cards/custom_card_more_power_outlet",
    "publicId": "custom_card_more_power_outlet",
    "rendererId": "custom_card_more_power_outlet",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [],
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
      "history/statistics"
    ],
    "deviations": [
      "Exact historical series requires Home Assistant recorder/statistics data; the fixture and preview use deterministic sample data when history is unavailable."
    ],
    "sourceDigest": "997d3cb2e78fb34cfbb3bbaff72badc08d1a6d04c4cb5339e0762080fba3c553"
  },
  {
    "upstreamId": "custom_card_gauge",
    "sourcePath": "custom_cards/custom_card_gauge",
    "publicId": "custom_card_gauge",
    "rendererId": "custom_card_gauge",
    "layoutProfile": "card:button-card+chart",
    "primitives": [
      "button-card",
      "chart"
    ],
    "customFields": [
      "item1",
      "item2"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [],
    "variables": [
      {
        "name": "ulm_card_gauge_max",
        "defaultValue": "100",
        "selector": "number"
      },
      {
        "name": "ulm_card_gauge_min",
        "defaultValue": "0",
        "selector": "number"
      }
    ],
    "dependencies": [
      "button-card",
      "dual-gauge-card"
    ],
    "backendRequirements": [],
    "deviations": [
      "Upstream embeds custom:dual-gauge-card; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    "sourceDigest": "25d0a61887381d4ec2ecce9487c4cca767146bb35a093de79d047295e8ee2275"
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
    "upstreamId": "custom_card_wifi_signal",
    "sourcePath": "custom_cards/custom_card_wifi_signal",
    "publicId": "custom_card_wifi_signal",
    "rendererId": "custom_card_wifi_signal",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [],
    "stateDriven": true,
    "animated": false,
    "actions": [],
    "variables": [],
    "dependencies": [
      "button-card"
    ],
    "backendRequirements": [],
    "deviations": [],
    "sourceDigest": "f8c52bb16f5c28d2205d395a9a234d7c6a2c9328dcc863fe5a04f7229d40f1a8"
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
    "upstreamId": "custom_card_pollen_forecast",
    "sourcePath": "custom_cards/custom_card_pollen_forecast",
    "publicId": "custom_card_pollen_forecast",
    "rendererId": "custom_card_pollen_forecast",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [
      "icon",
      "item1",
      "item2",
      "state"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [],
    "variables": [
      {
        "name": "ulm_card_generic_swap_icon",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_pollen_forecast_icon; ]]]\"",
        "selector": "icon"
      },
      {
        "name": "ulm_card_generic_swap_name",
        "defaultValue": "\"[[[ return variables.ulm_custom_card_pollen_forecast_name; ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_pollen_forecast_1",
        "defaultValue": "\"bardzo słabe\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_pollen_forecast_2",
        "defaultValue": "\"słabe\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_pollen_forecast_3",
        "defaultValue": "\"umiarkowane\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_pollen_forecast_4",
        "defaultValue": "\"średnie\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_pollen_forecast_5",
        "defaultValue": "\"wysokie\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_pollen_forecast_6",
        "defaultValue": "\"bardzo wysokie\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_pollen_forecast_icon",
        "defaultValue": "<documented/inherited>",
        "selector": "icon"
      },
      {
        "name": "ulm_custom_card_pollen_forecast_language_variables",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_pollen_forecast_name",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_pollen_forecast_none",
        "defaultValue": "\"brak\"",
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
    "sourceDigest": "7d010b9fb174f912f80454cff866815a8485cd93ab71eccdbc62b5629fdb760d"
  },
  {
    "upstreamId": "custom_card_welcome_dashboard",
    "sourcePath": "custom_cards/custom_card_welcome_dashboard",
    "publicId": "custom_card_welcome_dashboard",
    "rendererId": "custom_card_welcome_dashboard",
    "layoutProfile": "card:button-card+horizontal-stack",
    "primitives": [
      "button-card",
      "horizontal-stack"
    ],
    "customFields": [
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
        "name": "ulm_afternoon",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_welcome_dashboard_news_entities",
        "defaultValue": "<documented/inherited>",
        "selector": "entity-multiple"
      },
      {
        "name": "ulm_custom_card_welcome_dashboard_time",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_welcome_dashboard_weather_provider",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
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
        "name": "ulm_variable",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      }
    ],
    "dependencies": [
      "button-card",
      "home-feed-card"
    ],
    "backendRequirements": [],
    "deviations": [
      "Upstream embeds custom:home-feed-card; this plugin provides an original Lit equivalent without requiring that frontend dependency."
    ],
    "sourceDigest": "8b6905f1f49207f8dcd66668e452775f49abaa9db16827c327bd7194a6c1c9d2"
  },
  {
    "upstreamId": "custom_card_person_info",
    "sourcePath": "custom_cards/custom_card_person_info",
    "publicId": "custom_card_person_info",
    "variant": "full",
    "rendererId": "custom_card_person_info",
    "layoutProfile": "card:button-card",
    "primitives": [
      "button-card"
    ],
    "customFields": [
      "icon"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_address",
        "defaultValue": "\"\"",
        "selector": "text"
      },
      {
        "name": "ulm_address_locality",
        "defaultValue": "\"\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_person_battery_entity",
        "defaultValue": "\"\"",
        "selector": "entity"
      },
      {
        "name": "ulm_card_person_battery_state_entity",
        "defaultValue": "\"\"",
        "selector": "entity"
      },
      {
        "name": "ulm_card_person_commute_entity",
        "defaultValue": "\"\"",
        "selector": "entity"
      },
      {
        "name": "ulm_card_person_commute_icon",
        "defaultValue": "<documented/inherited>",
        "selector": "icon"
      },
      {
        "name": "ulm_card_person_cummute_icon",
        "defaultValue": "\"mdi:car\"",
        "selector": "icon"
      },
      {
        "name": "ulm_card_person_driving_entity",
        "defaultValue": "\"\"",
        "selector": "entity"
      },
      {
        "name": "ulm_card_person_entity",
        "defaultValue": "<documented/inherited>",
        "selector": "entity"
      },
      {
        "name": "ulm_card_person_use_entity_picture",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_person_zone1",
        "defaultValue": "\"\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_person_zone2",
        "defaultValue": "\"\"",
        "selector": "text"
      },
      {
        "name": "ulm_multiline",
        "defaultValue": "true",
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
    "backendRequirements": [
      "person/device-tracker entities"
    ],
    "deviations": [],
    "sourceDigest": "c6bc147d1d79db6033182f178081fae52b69b6ec286d4f2ca88f93329ee99f5a"
  },
  {
    "upstreamId": "custom_card_person_info_small",
    "sourcePath": "custom_cards/custom_card_person_info_small",
    "publicId": "custom_card_person_info",
    "variant": "small",
    "rendererId": "custom_card_person_info",
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
    "actions": [
      "hold_action",
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_address",
        "defaultValue": "\"\"",
        "selector": "text"
      },
      {
        "name": "ulm_address_locality",
        "defaultValue": "\"\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_battery_battery_level_danger",
        "defaultValue": "15",
        "selector": "number"
      },
      {
        "name": "ulm_card_battery_battery_level_waring",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_battery_battery_level_warning",
        "defaultValue": "30",
        "selector": "number"
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
        "name": "ulm_card_person_battery_entity",
        "defaultValue": "\"\"",
        "selector": "entity"
      },
      {
        "name": "ulm_card_person_battery_state_entity",
        "defaultValue": "\"\"",
        "selector": "entity"
      },
      {
        "name": "ulm_card_person_driving_entity",
        "defaultValue": "\"\"",
        "selector": "entity"
      },
      {
        "name": "ulm_card_person_entity",
        "defaultValue": "<documented/inherited>",
        "selector": "entity"
      },
      {
        "name": "ulm_card_person_icon",
        "defaultValue": "\"mdi:face-man\"",
        "selector": "icon"
      },
      {
        "name": "ulm_card_person_use_entity_picture",
        "defaultValue": "true",
        "selector": "boolean"
      },
      {
        "name": "ulm_card_person_zone1",
        "defaultValue": "\"\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_person_zone2",
        "defaultValue": "\"\"",
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
      "person/device-tracker entities"
    ],
    "deviations": [],
    "sourceDigest": "6de745dafb69e18f1ac5bd9f535f1abd5fff27256922dec83a1858cb1087a528"
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
    "upstreamId": "custom_card_person_tracker",
    "sourcePath": "custom_cards/custom_card_person_tracker",
    "publicId": "custom_card_person_tracker",
    "rendererId": "custom_card_person_tracker",
    "layoutProfile": "card:button-card+image",
    "primitives": [
      "button-card",
      "image"
    ],
    "customFields": [
      "entity_picture",
      "icon",
      "item1",
      "item2",
      "item3"
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
        "name": "ulm_custom_card_person_tracker_camera_entity_dark",
        "defaultValue": "\"\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_person_tracker_camera_entity_light",
        "defaultValue": "\"\"",
        "selector": "entity"
      },
      {
        "name": "ulm_custom_card_person_tracker_find_device_script",
        "defaultValue": "\"\"",
        "selector": "entity"
      },
      {
        "name": "ulm_custom_card_person_tracker_icon",
        "defaultValue": "\"[[[ return entity.attributes.icon ]]]\"",
        "selector": "icon"
      },
      {
        "name": "ulm_custom_card_person_tracker_map_aspect_ratio",
        "defaultValue": "\"466:200\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_person_tracker_map_default_zoom",
        "defaultValue": "11",
        "selector": "number"
      },
      {
        "name": "ulm_custom_card_person_tracker_map_enable",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_custom_card_person_tracker_map_hours_to_show",
        "defaultValue": "0",
        "selector": "boolean"
      },
      {
        "name": "ulm_custom_card_person_tracker_name",
        "defaultValue": "\"[[[ return entity.attributes.friendly_name ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_person_tracker_driving",
        "defaultValue": "\"Porusza się\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_person_tracker_driving_entity",
        "defaultValue": "\"\"",
        "selector": "entity"
      },
      {
        "name": "ulm_custom_card_person_tracker_language_variables",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_person_tracker_language_variables1",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_person_tracker_use_badge",
        "defaultValue": "true",
        "selector": "boolean"
      },
      {
        "name": "ulm_custom_card_person_tracker_use_entity_picture",
        "defaultValue": "false",
        "selector": "boolean"
      },
      {
        "name": "ulm_custom_card_person_tracker_zones",
        "defaultValue": "<null>",
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
      "person/device-tracker entities"
    ],
    "deviations": [],
    "sourceDigest": "66d46f0235430e2d736028e70d54494a6a7a86657216eabcce15d4b75722946c"
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
    "upstreamId": "custom_card_vehicle_status",
    "sourcePath": "custom_cards/custom_card_vehicle_status",
    "publicId": "custom_card_vehicle_status",
    "rendererId": "custom_card_vehicle_status",
    "layoutProfile": "card:button-card+popup",
    "primitives": [
      "button-card",
      "popup"
    ],
    "customFields": [
      "icon",
      "item1",
      "item2",
      "state"
    ],
    "stateDriven": true,
    "animated": false,
    "actions": [
      "tap_action"
    ],
    "variables": [
      {
        "name": "ulm_card_vehicle_status_energy_level",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_vehicle_status_lock",
        "defaultValue": "\"[[[ return variables.ulm_card_vehicle_status_lock ]]]\"",
        "selector": "entity"
      },
      {
        "name": "ulm_card_vehicle_status_name",
        "defaultValue": "\"[[[ return variables.ulm_card_vehicle_status_name ]]]\"",
        "selector": "text"
      },
      {
        "name": "ulm_card_vehicle_status_range",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_card_vehicle_status_tracker",
        "defaultValue": "\"[[[ return variables.ulm_card_vehicle_status_tracker ]]]\"",
        "selector": "entity"
      },
      {
        "name": "ulm_custom_card_vehicle_status_popup",
        "defaultValue": "<documented/inherited>",
        "selector": "boolean"
      },
      {
        "name": "ulm_custom_card_vehicle_status_default_name",
        "defaultValue": "\"O meu carro\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_vehicle_status_energy_level",
        "defaultValue": "\"Nível de energia\"",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_vehicle_status_language_variables",
        "defaultValue": "<documented/inherited>",
        "selector": "text"
      },
      {
        "name": "ulm_custom_card_vehicle_status_range",
        "defaultValue": "\"Alcance\"",
        "selector": "text"
      }
    ],
    "dependencies": [
      "button-card"
    ],
    "backendRequirements": [
      "history/statistics"
    ],
    "deviations": [
      "Exact historical series requires Home Assistant recorder/statistics data; the fixture and preview use deterministic sample data when history is unavailable."
    ],
    "sourceDigest": "1932419ed4a9c15ed073b5bdb41ba76fe027ce25ad3b5dcfdc6b3717cb99e129"
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
