import type { CatalogItem } from "./types";

export const isRemovedPopupOption = (name: string): boolean =>
  /popup|browser_mod/i.test(name);

const supportedByFamily: Record<string, readonly string[]> = {
  weather: [
    "ulm_card_weather_backdrop",
    "ulm_card_weather_primary_info",
    "ulm_card_weather_secondary_info",
  ],
  light: [
    "ulm_card_light_enable_slider",
    "ulm_card_light_enable_slider_minSet",
    "ulm_card_light_enable_slider_maxSet",
    "ulm_card_light_enable_collapse",
    "ulm_card_light_enable_horizontal",
    "ulm_card_light_enable_color",
    "ulm_card_light_force_background_color",
    "ulm_card_light_enable_buttons",
    "ulm_card_light_brightness_low",
    "ulm_card_light_brightness_medium",
    "ulm_card_light_brightness_high",
  ],
  battery: [
    "ulm_card_battery_battery_level_danger",
    "ulm_card_battery_battery_level_warning",
    "ulm_card_battery_charging_animation",
  ],
  media: [
    "ulm_card_media_player_enable_art",
    "ulm_card_media_player_enable_controls",
    "ulm_card_media_player_enable_volume_slider",
  ],
  cover: [
    "ulm_card_cover_enable_slider",
    "ulm_card_cover_slider_min",
    "ulm_card_cover_slider_max",
  ],
  control: [
    "ulm_card_fan_enable_slider",
    "ulm_card_fan_slider_min",
    "ulm_card_fan_slider_max",
    "ulm_card_fan_enable_button",
    "ulm_card_fan_button_icon",
  ],
};

const supportedByItem: Record<string, readonly string[]> = {
  card_binary_sensor: ["ulm_card_binary_sensor_show_last_changed"],
  card_binary_sensor_alert: ["ulm_card_binary_sensor_alert_show_last_changed"],
  custom_card_haven_washer: ["ulm_custom_card_washer_power"],
};

export const supportedUpstreamOption = (item: CatalogItem, name: string): boolean =>
  !isRemovedPopupOption(name) && (
    supportedByItem[item.upstreamId]?.includes(name) === true ||
    supportedByFamily[item.family]?.includes(name) === true
  );
