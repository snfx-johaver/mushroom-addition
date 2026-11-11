import type { AdditionConfig, HomeAssistant } from "../types";

export const CAR_TAG = "mushroom-addition-car-advanced";
export type CarSection = "indicators" | "range_info" | "images" | "mini_map" | "buttons" | "layout_config";
export interface CarOptions {
  layout_config?: Record<string, unknown> & { section_order?: string[]; hide_card_name?: boolean };
  indicator_rows?: Record<string, unknown>[];
  indicators?: Record<string, unknown>;
  range_info?: Record<string, unknown>[];
  images?: (string | Record<string, unknown>)[];
  button_cards?: Record<string, unknown>[];
  mini_map?: Record<string, unknown>;
  [key: string]: unknown;
}
export interface CarConfig extends AdditionConfig { car?: CarOptions; }

export function validateCar(config: AdditionConfig): CarConfig {
  if (config.car_show_header !== undefined && typeof config.car_show_header !== "boolean") throw new Error("car_show_header must be a boolean.");
  const car = config.car;
  if (car !== undefined) {
    if (!car || typeof car !== "object" || Array.isArray(car)) throw new Error("Car settings must be an object.");
    for (const key of ["indicator_rows", "range_info", "images", "button_cards"] as const) {
      if (car[key] !== undefined && !Array.isArray(car[key])) throw new Error(`${key} must be a list.`);
    }
    for (const key of ["layout_config", "indicators", "mini_map"] as const) {
      if (car[key] !== undefined && (!car[key] || typeof car[key] !== "object" || Array.isArray(car[key]))) {
        throw new Error(`${key} must be an object.`);
      }
    }
  }
  return config;
}

export function engineConfig(config: CarConfig): Record<string, unknown> {
  return {
    ...config.car,
    type: "custom:addition-car-engine",
    name: "",
    layout_config: {
      section_order: ["indicators", "range_info", "images", "mini_map", "buttons"],
      ...config.car?.layout_config,
      hide_card_name: true,
    },
  };
}

export function carStub(hass?: HomeAssistant, entities: string[] = []): CarConfig {
  const states = Object.values(hass?.states ?? {}).filter(state => !["unknown", "unavailable"].includes(state.state));
  const tracker = states.find(state => state.entity_id.startsWith("device_tracker.") && entities.includes(state.entity_id))
    ?? states.find(state => state.entity_id.startsWith("device_tracker."));
  return {
    type: `custom:${CAR_TAG}`, icon: "mdi:car", ...(tracker ? { entity: tracker.entity_id } : {}),
    car: {
      layout_config: { section_order: ["indicators", "range_info", "images", "mini_map", "buttons"] },
      ...(tracker ? {
        indicator_rows: [{ row_items: [{ type: "entity", entity: tracker.entity_id, show_name: true, show_state: true }] }],
        mini_map: { device_tracker: tracker.entity_id, map_height: 180, map_zoom: 14, enable_popup: true },
      } : {}),
    },
  };
}
