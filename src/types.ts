export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown> & {
    friendly_name?: string;
    icon?: string;
    unit_of_measurement?: string;
  };
  last_changed?: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language?: string;
  user?: { name?: string };
  localize?: (key: string) => string;
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
  color?: string;
  active_state?: string;
  state?: string;
  nav_path?: string;
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

export interface AdditionConfig {
  type: string;
  entity?: string;
  primary_entity?: string;
  entities?: string[];
  scene_items?: AdditionItemConfig[];
  room_sensors?: AdditionItemConfig[];
  waste_streams?: WasteStreamConfig[];
  today_entity?: string;
  tomorrow_entity?: string;
  show_today?: boolean;
  show_tomorrow?: boolean;
  collapse_entity?: string;
  collapsed?: boolean;
  temperature_entity?: string;
  humidity_entity?: string;
  battery_entity?: string;
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
  download_entity?: string;
  upload_entity?: string;
  ping_entity?: string;
  wifi_tracker_entity?: string;
  gps_tracker_entity?: string;
  findmy_script_entity?: string;
  lock_entity?: string;
  tablet_button_usb_entity?: string;
  tablet_button_motion_entity?: string;
  tablet_button_display_entity?: string;
  tablet_restart_entity?: string;
  tablet_maintenance_entity?: string;
  tablet_reload_entity?: string;
  tablet_ram_entity?: string;
  tablet_disk_entity?: string;
  tablet_power_entity?: string;
  name?: string;
  name_mode?: "entity" | "custom" | "none";
  secondary?: string;
  icon?: string;
  icon_type?: "icon" | "entity-picture" | "none";
  icon_color?: string;
  variant?: string;
  show_state?: boolean;
  show_icon?: boolean;
  layout?: "default" | "horizontal" | "vertical";
  fill_container?: boolean;
  primary_info?: "name" | "state" | "none";
  secondary_info?: "default" | "state" | "name" | "last-changed" | "none";
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
  graph_hours?: number;
  console_platform?: "ps5" | "xbox";
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
