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

export interface AdditionConfig {
  type: string;
  entity?: string;
  primary_entity?: string;
  entities?: string[];
  temperature_entity?: string;
  humidity_entity?: string;
  battery_entity?: string;
  graph_entity?: string;
  eta_entity?: string;
  address_entity?: string;
  min_entity?: string;
  max_entity?: string;
  datetime_entity?: string;
  lock_entity?: string;
  name?: string;
  secondary?: string;
  icon?: string;
  icon_color?: string;
  variant?: string;
  show_state?: boolean;
  show_icon?: boolean;
  layout?: "horizontal" | "vertical";
  navigation_path?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  chips?: AdditionConfig[];
  show_forecast?: boolean;
  show_controls?: boolean;
  show_graph?: boolean;
  use_entity_picture?: boolean;
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
  kind: "card" | "chip" | "container";
  family: string;
  tag: string;
  name: string;
  description: string;
  variants?: string[];
  preferredDomains?: string[];
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
