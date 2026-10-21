export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown> & {
    friendly_name?: string;
    icon?: string;
    unit_of_measurement?: string;
  };
  last_changed?: string;
  last_updated?: string;
}

export interface EntityNameItem {
  type: "entity" | "device" | "area" | "floor" | "text";
  text?: string;
}

export type RoomSecondaryPart =
  | { type: "text"; text?: string }
  | { type: "state" | "brightness" | "temperature" | "name" }
  | { type: "attribute"; attribute?: string };

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  themes?: { darkMode?: boolean };
  services?: Record<string, Record<string, unknown>>;
  areas?: Record<string, { area_id: string; name: string; [key: string]: unknown }>;
  config?: { unit_system?: { temperature?: string }; time_zone?: string };
  entities?: Record<string, {
    device_id?: string | null;
    area_id?: string | null;
    platform?: string;
    translation_key?: string;
    original_name?: string;
  }>;
  devices?: Record<string, { area_id?: string | null; name?: string; name_by_user?: string }>;
  language?: string;
  user?: { name?: string };
  localize?: (key: string) => string;
  formatEntityState?: (entity: HassEntity) => string;
  formatEntityName?: (
    entity: HassEntity,
    name?: string | EntityNameItem | EntityNameItem[],
  ) => string;
  callService: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
  ) => Promise<unknown>;
  connection?: {
    sendMessagePromise: <T>(message: Record<string, unknown>) => Promise<T>;
    subscribeMessage: <T>(
      callback: (message: T) => void,
      message: Record<string, unknown>,
    ) => Promise<() => void>;
  };
}

export interface WeatherForecast {
  condition?: string;
  datetime?: string;
  temperature?: number;
  templow?: number;
  temperature_low?: number;
  precipitation?: number;
  precipitation_probability?: number;
}

export interface ActionConfig {
  action: string;
  entity?: string;
  navigation_path?: string;
  url_path?: string;
  service?: string;
  perform_action?: string;
  target?: Record<string, unknown>;
  data?: Record<string, unknown>;
  service_data?: Record<string, unknown>;
  confirmation?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface AdditionItemConfig {
  entity: string;
  name?: string;
  label?: string;
  icon?: string;
  icon_type?: "icon" | "entity-picture";
  color?: string;
  active_state?: string;
  state?: string;
  nav_path?: string;
  navigation_path?: string;
  service_data?: Record<string, unknown>;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

export type RoomStatusKind = "window" | "door" | "motion" | "water" | "smoke";
export interface RoomStatusConfig {
  entity: string;
  kind?: RoomStatusKind;
}

export interface WasteStreamConfig {
  enabled?: boolean;
  entity?: string;
  label?: string;
  icon?: string;
  color?: string;
  preset?: string;
}

export interface PrinterCartridgeConfig {
  label?: string;
  entity_id?: string;
  type?: "unicolor" | "tricolor";
  color?: string | string[];
}

export interface SonosShortcutConfig {
  icon?: string;
  name?: string;
  type?: string;
  id?: string;
}

export interface SonosShortcutsConfig {
  columns?: number;
  buttons?: SonosShortcutConfig[];
}

export interface CarouselCoverflowEffectConfig {
  rotate?: number;
  stretch?: number;
  depth?: number;
  modifier?: number;
  slideShadows?: boolean;
}

export type CarouselEffect = "slide" | "coverflow" | "fade" | "cube" | "flip";
export type CarouselPagination = "bullets" | "fraction" | "progressbar";

export interface CarouselParametersConfig {
  effect?: CarouselEffect;
  pagination?: boolean | { enabled?: boolean; type?: CarouselPagination };
  navigation?: boolean | { enabled?: boolean };
  scrollbar?: boolean | { enabled?: boolean };
  grabCursor?: boolean;
  centeredSlides?: boolean;
  slidesPerView?: "auto" | number;
  coverflowEffect?: CarouselCoverflowEffectConfig;
}


export interface UpcomingMediaConfig {
  upcoming_data_attribute?: string;
  upcoming_max_items?: number;
  upcoming_image_style?: "poster" | "fanart";
  upcoming_item_height?: number;
  upcoming_corner_radius?: number;
  upcoming_max_columns?: number;
  upcoming_overflow?: boolean;
  upcoming_collapse_mode?: "none" | "count" | "matching";
  upcoming_collapse_count?: number;
  upcoming_group_attribute?: string;
  upcoming_group_value?: string;
  upcoming_sort_by?: string;
  upcoming_sort_ascending?: boolean;
  upcoming_filter_attribute?: string;
  upcoming_filter_value?: string;
  upcoming_filter_match?: "contains" | "exact";
  upcoming_flag_filter?: "all" | "flagged" | "unflagged";
  upcoming_show_flag?: boolean;
  upcoming_flag_icon?: string;
  upcoming_flag_label?: string;
  upcoming_flag_color?: string;
  upcoming_date_format?: string;
  upcoming_clock?: "locale" | "12" | "24";
  upcoming_title_text?: string;
  upcoming_line1_text?: string;
  upcoming_line2_text?: string;
  upcoming_line3_text?: string;
  upcoming_line4_text?: string;
  upcoming_title_color?: string;
  upcoming_line1_color?: string;
  upcoming_line2_color?: string;
  upcoming_line3_color?: string;
  upcoming_line4_color?: string;
  upcoming_title_size?: number;
  upcoming_line_size?: number;
  upcoming_box_shadows?: boolean;
  upcoming_text_shadows?: boolean;
  upcoming_transparency?: boolean;
  upcoming_tooltips?: boolean;
  upcoming_tooltip_delay?: number;
  upcoming_trailers?: boolean;
  upcoming_links?: boolean;
  upcoming_url?: string;
  upcoming_item_behavior?: "automatic" | "more-info" | "action" | "none";
  upcoming_item_action?: ActionConfig;
  upcoming_hide_empty?: boolean;
}

export type RemoteSection = "power" | "navigation" | "source" | "volume" | "channels" | "playback" | "keypad" | "shortcuts";
export interface RemoteButtonConfig {
  name?: string;
  icon?: string;
  color?: string;
  type?: "command" | "source" | "action";
  command?: string;
  source?: string;
  action?: ActionConfig;
}
export interface RemoteCardConfig {
  remote_entity?: string;
  remote_media_entity?: string;
  remote_device?: string;
  remote_transport?: "auto" | "remote" | "samsung";
  remote_preset?: "auto" | "generic" | "android_tv" | "apple_tv" | "roku" | "samsung";
  remote_sections?: RemoteSection[];
  remote_navigation?: "touchpad" | "buttons" | "both";
  remote_volume?: "slider" | "buttons" | "both";
  remote_volume_step?: number;
  remote_playback_controls?: string[];
  remote_power_controls?: string[];
  remote_haptics?: "all" | "buttons" | "slider" | "none";
  remote_double_tap?: "back" | "home" | "menu" | "custom" | "disabled";
  remote_double_tap_command?: string;
  remote_swipe_distance?: number;
  remote_touchpad_height?: number;
  remote_button_size?: number;
  remote_accent_color?: string;
  remote_commands?: Record<string, string>;
  remote_buttons?: RemoteButtonConfig[];
}

export type PiHoleMetric = "queries" | "blocked" | "percentage" | "domains" | "clients" | "cached" | "forwarded" | "cpu" | "memory" | "temperature";
export type PiHoleSection = "statistics" | "blocking" | "pause" | "controls" | "sensors" | "chart" | "versions";
export interface PiHoleConfig {
  pihole_device_ids?: string[];
  pihole_metrics?: PiHoleMetric[];
  pihole_sections?: PiHoleSection[];
  pihole_collapsed_sections?: PiHoleSection[];
  pihole_metric_entities?: Partial<Record<PiHoleMetric, string[]>>;
  pihole_entity_order?: string[];
  pihole_hidden_entities?: string[];
  pihole_pause_durations?: Array<number | string>;
  pihole_pause_service?: "auto" | "pi_hole.disable" | "pi_hole_v6.disable" | "custom";
  pihole_pause_action?: ActionConfig;
  pihole_duration_field?: string;
  pihole_duration_format?: "seconds" | "duration";
  pihole_columns?: number;
  pihole_accent_color?: string;
  pihole_chart_hours?: number;
  pihole_chart_height?: number;
  pihole_chart_metrics?: Array<"cpu" | "memory">;
  pihole_show_header?: boolean;
  pihole_metric_tap_action?: ActionConfig;
  pihole_metric_hold_action?: ActionConfig;
  pihole_metric_double_tap_action?: ActionConfig;
}

export interface AdditionConfig extends UpcomingMediaConfig, RemoteCardConfig, PiHoleConfig {
  type: string;
  entity?: string;
  primary_entity?: string;
  entities?: string[];
  scene_items?: AdditionItemConfig[];
  scene_buttons_only?: boolean;
  room_sensors?: AdditionItemConfig[];
  room_status?: RoomStatusConfig[];
  room_light_entity?: string;
  room_temperature_entity?: string;
  room_brightness_entity?: string;
  room_secondary_parts?: RoomSecondaryPart[];
  ulm_card_dynamic_color?: boolean;
  carousel_items?: AdditionItemConfig[];
  carousel_loop?: boolean;
  carousel_show_header?: boolean;
  carousel_show_labels?: boolean;
  carousel_visible_items?: number;
  carousel_initial_index?: number;
  carousel_button_width?: number;
  carousel_button_height?: number;
  carousel_icon_size?: number;
  carousel_effect?: CarouselEffect;
  carousel_pagination?: boolean;
  carousel_pagination_type?: CarouselPagination;
  carousel_navigation?: boolean;
  carousel_scrollbar?: boolean;
  carousel_grab_cursor?: boolean;
  carousel_centered_slides?: boolean;
  carousel_slides_per_view?: "auto" | number | string;
  carousel_coverflow_rotate?: number;
  carousel_coverflow_stretch?: number;
  carousel_coverflow_depth?: number;
  carousel_coverflow_modifier?: number;
  carousel_coverflow_slide_shadows?: boolean;
  grid_power_entity?: string;
  grid_phase_1_entity?: string;
  grid_phase_2_entity?: string;
  grid_phase_3_entity?: string;
  solar_power_entity?: string;
  solar_forecast_entity?: string;
  battery_level_entity?: string;
  battery_power_entity?: string;
  battery_1_level_entity?: string;
  battery_1_power_entity?: string;
  battery_2_level_entity?: string;
  battery_2_power_entity?: string;
  battery_3_level_entity?: string;
  battery_3_power_entity?: string;
  ev_charger_power_entity?: string;
  energy_mode_entity?: string;
  energy_auto_control_entity?: string;
  electricity_price_entity?: string;
  tariff_markup_entity?: string;
  tariff_vat_entity?: string;
  energy_grid_label?: string;
  energy_grid_import_label?: string;
  energy_grid_export_label?: string;
  energy_solar_label?: string;
  energy_battery_label?: string;
  energy_home_label?: string;
  energy_forecast_label?: string;
  energy_ev_label?: string;
  energy_charge_label?: string;
  energy_discharge_label?: string;
  energy_idle_label?: string;
  energy_auto_label?: string;
  energy_manual_label?: string;
  mode_solar_first_label?: string;
  mode_smart_saving_label?: string;
  mode_smart_trading_label?: string;
  grid_phase_scale_max?: number;
  solar_scale_max?: number;
  battery_unit_scale_max?: number;
  home_scale_max?: number;
  price_low_threshold?: number;
  price_medium_threshold?: number;
  price_high_threshold?: number;
  price_critical_threshold?: number;
  show_grid_phases?: boolean;
  show_battery_units?: boolean;
  show_tariff_timeline?: boolean;
  import_color?: string;
  export_color?: string;
  grid_color?: string;
  solar_color?: string;
  battery_color?: string;
  home_color?: string;
  price_negative_color?: string;
  price_low_color?: string;
  price_medium_color?: string;
  price_high_color?: string;
  price_critical_color?: string;
  buy_sell_title?: string;
  buy_sell_show_result?: boolean;
  buy_sell_trade_energy?: number;
  buy_sell_trade_energy_entity?: string;
  buy_sell_trade_power?: number;
  buy_sell_trade_efficiency?: number;
  buy_sell_feed_in_fee?: number;
  buy_sell_slot_minutes?: number;
  buy_sell_graph_span?: number;
  buy_sell_span_start?: "day" | "now";
  buy_sell_update_interval?: number;
  buy_sell_chart_height?: number;
  buy_sell_show_now?: boolean;
  buy_sell_now_label?: string;
  buy_sell_now_color?: string;
  buy_sell_show_legend?: boolean;
  buy_sell_show_grid?: boolean;
  buy_sell_axis_label?: string;
  buy_sell_min_value?: number;
  buy_sell_max_value?: number;
  buy_sell_price_decimals?: number;
  buy_sell_axis_decimals?: number;
  buy_sell_bar_radius?: number;
  buy_sell_price_label?: string;
  buy_sell_charge_label?: string;
  buy_sell_planned_sell_label?: string;
  buy_sell_possible_sell_label?: string;
  buy_sell_price_color?: string;
  buy_sell_charge_color?: string;
  buy_sell_planned_sell_color?: string;
  buy_sell_possible_sell_color?: string;
  panel_health_title?: string;
  panel_entities?: string[];
  panel_gauge_max?: number;
  panel_warning_average_min?: number;
  panel_low_output_percent?: number;
  panel_segment_1?: number;
  panel_segment_2?: number;
  panel_segment_3?: number;
  panel_segment_4?: number;
  panel_color_0?: string;
  panel_color_1?: string;
  panel_color_2?: string;
  panel_color_3?: string;
  panel_color_4?: string;
  panel_color_5?: string;
  panel_show_summary?: boolean;
  panel_show_gauges?: boolean;
  parameters?: CarouselParametersConfig;
  cartridges?: PrinterCartridgeConfig[];
  waste_streams?: WasteStreamConfig[];
  hide_unknown_dates?: boolean;
  shortcuts?: SonosShortcutsConfig;
  use_media_info?: boolean;
  show_volume_level?: boolean;
  volume_controls?: ("volume_mute" | "volume_set" | "volume_buttons")[];
  media_controls?: ("on_off" | "shuffle" | "previous" | "play_pause_stop" | "next" | "repeat" | "sources")[];
  collapsible_controls?: boolean;
  ulm_card_media_player_power_button?: boolean;
  ulm_card_media_player_idle_off?: boolean;
  ulm_card_media_player_more_info?: boolean;
  ulm_card_media_player_player_controls_entity?: string;
  ulm_card_media_player_enable_volume_adjust?: number;
  today_entity?: string;
  tomorrow_entity?: string;
  show_today?: boolean;
  show_tomorrow?: boolean;
  showMoon?: boolean;
  moon_entity?: string;
  moon_altitude_entity?: string;
  moon_azimuth_entity?: string;
  moon_rising_entity?: string;
  moon_setting_entity?: string;
  moon_right_ascension_entity?: string;
  moon_declination_entity?: string;
  moon_distance_entity?: string;
  moon_angular_diameter_entity?: string;
  moon_phase_angle_entity?: string;
  moon_illumination_entity?: string;
  moon_next_full_moon_entity?: string;
  moon_next_new_moon_entity?: string;
  moon_above_horizon_entity?: string;
  collapse_entity?: string;
  collapsed?: boolean;
  temperature_entity?: string;
  humidity_entity?: string;
  moisture_entity?: string;
  conductivity_entity?: string;
  illuminance_entity?: string;
  dli_entity?: string;
  followers_entity?: string;
  following_entity?: string;
  friends_entity?: string;
  primary_stat_entity?: string;
  secondary_stat_entity?: string;
  now_playing_entity?: string;
  gamerpic_entity?: string;
  artwork_entity?: string;
  console_power_entity?: string;
  console_platform?: "auto" | "xbox" | "playstation" | "nintendo";
  console_show_artwork?: boolean;
  console_show_controls?: boolean;
  primary_stat_icon?: string;
  secondary_stat_icon?: string;
  window_sensor?: string;
  trees_entity?: string;
  grass_entity?: string;
  weeds_entity?: string;
  battery_entity?: string;
  battery_warning_threshold?: number;
  battery_low_threshold?: number;
  battery_critical_threshold?: number;
  battery_healthy_color?: string;
  battery_warning_color?: string;
  battery_low_color?: string;
  battery_critical_color?: string;
  consumption_entity?: string;
  fan_entity?: string;
  battery_state_entity?: string;
  charger_type_entity?: string;
  power_entity?: string;
  program_stage_entity?: string;
  washer_power_entity?: string;
  door_entity?: string;
  finished_entity?: string;
  secondary_entity?: string;
  disk_entity?: string;
  memory_entity?: string;
  cpu_entity?: string;
  graph_entity?: string;
  energy_entity?: string;
  time_entity?: string;
  crossfade_entity?: string;
  night_sound_entity?: string;
  speech_enhancement_entity?: string;
  subwoofer_entity?: string;
  surrounds_entity?: string;
  loudness_entity?: string;
  surround_full_entity?: string;
  audio_delay_entity?: string;
  balance_entity?: string;
  bass_entity?: string;
  treble_entity?: string;
  sub_gain_entity?: string;
  surround_level_entity?: string;
  music_surround_level_entity?: string;
  black_entity?: string;
  yellow_entity?: string;
  magenta_entity?: string;
  cyan_entity?: string;
  eta_entity?: string;
  address_entity?: string;
  min_entity?: string;
  max_entity?: string;
  datetime_entity?: string;
  level_entity?: string;
  download_entity?: string;
  upload_entity?: string;
  ping_entity?: string;
  wifi_tracker_entity?: string;
  gps_tracker_entity?: string;
  findmy_script_entity?: string;
  weather_entity?: string;
  welcome_weather_icon?: string;
  welcome_weather_icon_type?: "automatic" | "icon" | "none";
  welcome_weather_primary_info?: "temperature" | "state" | "name" | "date" | "none";
  welcome_weather_secondary_info?: "temperature" | "state" | "name" | "date" | "none";
  welcome_weather_date_format?: "month_day" | "short" | "medium" | "long" | "full";
  welcome_weather_tap_action?: ActionConfig;
  qubino_more_info_entity?: string;
  lock_entity?: string;
  clock_switch_entity?: string;
  tablet_button_usb_entity?: string;
  tablet_button_motion_entity?: string;
  tablet_button_display_entity?: string;
  tablet_restart_entity?: string;
  tablet_maintenance_entity?: string;
  tablet_reload_entity?: string;
  tablet_ram_entity?: string;
  tablet_disk_entity?: string;
  tablet_power_entity?: string;
  name?: string | EntityNameItem | EntityNameItem[];
  name_mode?: "entity" | "custom" | "none";
  secondary?: string;
  icon?: string;
  icon_type?: "icon" | "entity-picture" | "none";
  icon_color?: string;
  variant?: string;
  show_state?: boolean;
  show_name?: boolean;
  show_icon?: boolean;
  layout?: "default" | "horizontal" | "vertical";
  multiline_secondary?: boolean;
  fill_container?: boolean;
  primary_info?: "name" | "state" | "last-changed" | "last-updated" | "none";
  secondary_info?: "default" | "name" | "state" | "last-changed" | "last-updated" | "none" | "custom" | "composed";
  navigation_path?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  show_forecast?: boolean;
  show_controls?: boolean;
  show_graph?: boolean;
  use_entity_picture?: boolean;
  label_use_temperature?: boolean;
  label_use_brightness?: boolean;
  input_select_entity?: string;
  input_select_option?: string;
  graph_hours?: number;
  [key: string]: unknown;
}

export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: AdditionConfig): void;
  getCardSize?(): number;
}

export interface CatalogItem {
  upstreamId: string;
  sourcePath: string;
  kind: "card";
  category?: "default-card" | "custom-card";
  family: string;
  tag: string;
  name: string;
  description: string;
  variants?: string[];
  variantLabels?: Record<string, string>;
  sourceIds?: string[];
  preferredDomains?: string[];
}

export interface ParityVariable {
  name: string;
  defaultValue: string;
  selector: "entity" | "entity-multiple" | "action" | "icon" | "color" | "boolean" | "number" | "object" | "text";
}

export interface ParityEntry {
  upstreamId: string;
  sourcePath: string;
  publicId: string;
  variant?: string;
  rendererId: string;
  layoutProfile: string;
  primitives: readonly string[];
  customFields: readonly string[];
  stateDriven: boolean;
  animated: boolean;
  actions: readonly string[];
  variables: readonly ParityVariable[];
  dependencies: readonly string[];
  backendRequirements: readonly string[];
  deviations: readonly string[];
  sourceDigest: string;
}

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}
