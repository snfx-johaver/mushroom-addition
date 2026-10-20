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

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities?: Record<string, {
    device_id?: string | null;
    platform?: string;
  }>;
  language?: string;
  user?: { name?: string };
  localize?: (key: string) => string;
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

export interface CarouselParametersConfig {
  effect?: "slide" | "coverflow";
  grabCursor?: boolean;
  centeredSlides?: boolean;
  slidesPerView?: "auto" | number;
  coverflowEffect?: CarouselCoverflowEffectConfig;
}

export interface AdditionConfig {
  type: string;
  entity?: string;
  primary_entity?: string;
  entities?: string[];
  scene_items?: AdditionItemConfig[];
  scene_buttons_only?: boolean;
  room_sensors?: AdditionItemConfig[];
  carousel_items?: AdditionItemConfig[];
  carousel_loop?: boolean;
  carousel_show_labels?: boolean;
  carousel_visible_items?: number;
  carousel_initial_index?: number;
  carousel_effect?: "slide" | "coverflow";
  carousel_grab_cursor?: boolean;
  carousel_centered_slides?: boolean;
  carousel_slides_per_view?: "auto" | number | string;
  carousel_coverflow_rotate?: number;
  carousel_coverflow_stretch?: number;
  carousel_coverflow_depth?: number;
  carousel_coverflow_modifier?: number;
  carousel_coverflow_slide_shadows?: boolean;
  parameters?: CarouselParametersConfig;
  cartridges?: PrinterCartridgeConfig[];
  waste_streams?: WasteStreamConfig[];
  shortcuts?: SonosShortcutsConfig;
  today_entity?: string;
  tomorrow_entity?: string;
  show_today?: boolean;
  show_tomorrow?: boolean;
  showMoon?: boolean;
  moon_entity?: string;
  moon_altitude_entity?: string;
  moon_azimuth_entity?: string;
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
  minimum?: number;
  maximum?: number;
  eta_entity?: string;
  address_entity?: string;
  min_entity?: string;
  max_entity?: string;
  datetime_entity?: string;
  date_entity?: string;
  level_entity?: string;
  download_entity?: string;
  upload_entity?: string;
  ping_entity?: string;
  wifi_tracker_entity?: string;
  gps_tracker_entity?: string;
  findmy_script_entity?: string;
  weather_entity?: string;
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
  secondary_info?: "default" | "name" | "state" | "last-changed" | "last-updated" | "none";
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
  thermostat_minimum_temp_spread?: number;
  thermostat_temp_step?: number;
  show_temperature_control?: boolean;
  show_humidity?: boolean;
  show_hvac_modes?: boolean;
  show_presets?: boolean;
  show_status?: boolean;
  collapsible_controls?: boolean;
  low_battery_threshold?: number;
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
