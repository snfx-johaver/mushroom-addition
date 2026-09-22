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
  entities?: string[];
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
