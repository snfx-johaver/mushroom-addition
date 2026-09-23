import { PARITY_BY_ID } from "./parity.generated";
import type { AdditionConfig, CatalogItem, HassEntity, HomeAssistant } from "./types";
import { supportedUpstreamOption } from "./supported-options";
import { defaultWasteStreams } from "./waste-streams";

const defaultIcons: Array<[RegExp, string]> = [
  [/input_boolean/, "mdi:toggle-switch"],
  [/light/, "mdi:lightbulb"],
  [/fan/, "mdi:fan"],
  [/cover|garage|door/, "mdi:window-shutter"],
  [/vacuum/, "mdi:robot-vacuum"],
  [/thermostat|climate|heat_pump|aircondition/, "mdi:thermostat"],
  [/weather/, "mdi:weather-partly-cloudy"],
  [/battery/, "mdi:battery"],
  [/person|presence|tracker|tracer/, "mdi:account"],
  [/media|chromecast/, "mdi:play-circle"],
  [/playstation/, "mdi:sony-playstation"],
  [/scene/, "mdi:palette"],
  [/alarm|lock/, "mdi:shield-lock"],
  [/camera/, "mdi:camera"],
  [/printer/, "mdi:printer"],
  [/nas/, "mdi:nas"],
  [/washer/, "mdi:washing-machine"],
  [/pollen|flower/, "mdi:flower"],
  [/waste|afval/, "mdi:trash-can"],
  [/navigate|back/, "mdi:arrow-right"],
  [/power|outlet|energy/, "mdi:power-socket-eu"],
  [/graph|sensor|gauge|speedtest/, "mdi:chart-line"],
  [/clock|date|datetime/, "mdi:calendar-clock"],
  [/title|subtitle/, "mdi:format-title"],
];

export const defaultIconFor = (item: CatalogItem, entity?: HassEntity): string => {
  if (entity?.attributes.icon) return entity.attributes.icon;
  if (item.upstreamId === "custom_card_damix48_power_details") return "mdi:flash";
  if (item.upstreamId === "custom_card_playstation" && entity?.entity_id.toLowerCase().includes("xbox")) {
    return "mdi:microsoft-xbox";
  }
  return defaultIcons.find(([pattern]) => pattern.test(item.upstreamId))?.[1] ??
    "mdi:information-outline";
};

const parsedDefault = (value: string): unknown => {
  if (value === "<null>" || value === "<documented/inherited>") return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  try {
    const parsed = JSON.parse(value) as unknown;
    if (typeof parsed === "string" && (parsed.includes("[[[") || parsed.includes("var(--"))) return undefined;
    return parsed;
  } catch {
    return undefined;
  }
};

export const upstreamDefaultsFor = (item: CatalogItem): Record<string, unknown> => {
  const defaults: Record<string, unknown> = {};
  for (const sourceId of item.sourceIds ?? [item.upstreamId]) {
    for (const variable of PARITY_BY_ID.get(sourceId)?.variables ?? []) {
      if (!supportedUpstreamOption(item, variable.name)) continue;
      const value = parsedDefault(variable.defaultValue);
      if (value !== undefined) defaults[variable.name] = value;
    }
  }
  return defaults;
};

export const populatedDefaultsFor = (
  item: CatalogItem,
  hass?: HomeAssistant,
  entityId?: string,
): AdditionConfig => {
  const entity = entityId ? hass?.states[entityId] : undefined;
  const sourceDefaults: Partial<AdditionConfig> =
    item.upstreamId === "card_person"
      ? {
        icon: "mdi:face-man",
        use_entity_picture: false,
      }
      : item.upstreamId === "card_power_outlet"
        ? {
          icon: "mdi:power-socket-eu",
        }
        : item.upstreamId === "card_room"
          ? {
            icon: "mdi:sofa-single",
            label_use_temperature: true,
            label_use_brightness: false,
          }
          : item.upstreamId === "card_script"
            ? {
              icon: "mdi:script-text",
            }
            : item.upstreamId === "card_thermostat"
              ? {
                icon: "mdi:thermometer",
                thermostat_minimum_temp_spread: 1,
              }
              : item.upstreamId === "custom_card_device_tracker"
      ? {
        ulm_custom_card_device_tracker_icon: "mdi:cellphone",
        ulm_custom_card_device_tracker_tracker_1_type: "lan",
        ulm_custom_card_device_tracker_tracker_2_type: "bluetooth",
      }
      : item.upstreamId === "custom_card_eraycetinay_lock"
        ? {
          ulm_custom_card_eraycetinay_lock_tap_control: false,
          ulm_custom_card_eraycetinay_lock_only_open: false,
          ulm_custom_card_eraycetinay_lock_battery_warning: 20,
          ulm_custom_card_eraycetinay_lock_battery_warning_low: 5,
          ulm_custom_card_eraycetinay_lock_battery_sensor_binary: false,
          ulm_custom_card_eraycetinay_lock_battery_sensor_binary_low_state: "on",
        }
        : item.upstreamId === "custom_card_esh_room"
          ? {
            ulm_card_esh_room_light_icon_on: "mdi:lightbulb",
            ulm_card_esh_room_light_icon_off: "mdi:lightbulb-off",
            ulm_card_esh_room_cover_icon_open: "mdi:blinds-open",
            ulm_card_esh_room_cover_icon_closed: "mdi:roller-shade-closed",
            ulm_card_dynamic_color: false,
          }
          : item.upstreamId === "custom_card_esh_welcome"
            ? {
              nav_1: "house", icon_1: "mdi:home", name_1: "House", color_1: "blue",
              nav_2: "lights", icon_2: "mdi:lightbulb", name_2: "Lights", color_2: "yellow",
              nav_3: "security", icon_3: "mdi:shield", name_3: "Secure", color_3: "green",
              nav_4: "climate", icon_4: "mdi:radiator", name_4: "Climate", color_4: "purple",
              nav_5: "network", icon_5: "mdi:flask", name_5: "Lab", color_5: "red",
            }
            : item.upstreamId === "custom_card_paddy_welcome"
              ? {
                variant: Object.keys(hass?.states ?? {}).some((id) => id.startsWith("weather.")) ? "weather" : "message",
                time_entity: Object.keys(hass?.states ?? {}).find((id) => id === "sensor.time"),
                weather_entity: Object.keys(hass?.states ?? {}).find((id) => id.startsWith("weather.")),
              }
              : item.upstreamId === "custom_card_person_chip"
                ? {
                  use_entity_picture: true,
                  icon: "mdi:face-man",
                }
                : item.upstreamId === "custom_card_playstation"
                  ? {
                    icon: "mdi:sony-playstation",
                    show_controls: false,
                  }
                  : item.upstreamId === "custom_card_qubino"
                    ? {
                      icon: "mdi:memory",
                    }
                    : item.upstreamId === "custom_card_ristou_person"
                      ? {
                        ulm_custom_card_ristou_use_entity_picture: false,
                        ulm_custom_card_ristou_use_badge: true,
                        ulm_custom_card_ristou_map_enable: false,
                        ulm_custom_card_ristou_map_aspect_ratio: "466:200",
                        ulm_custom_card_ristou_map_hours_to_show: 0,
                        ulm_custom_card_ristou_map_default_zoom: 11,
                      }
            : {};
  const sourceDrivenIcon = new Set([
    "card_battery",
    "card_binary_sensor",
    "card_cover",
    "card_fan",
    "card_input_boolean",
  ]).has(item.upstreamId);
  return {
    type: `custom:${item.tag}`,
    ...upstreamDefaultsFor(item),
    ...sourceDefaults,
    entity: entityId,
    waste_streams: item.upstreamId === "custom_card_afvalophaling" ? defaultWasteStreams() : undefined,
    show_today: item.upstreamId === "custom_card_afvalophaling" ? false : undefined,
    show_tomorrow: item.upstreamId === "custom_card_afvalophaling" ? false : undefined,
    name: entity?.attributes.friendly_name,
    icon: sourceDrivenIcon ? undefined : sourceDefaults.icon ?? defaultIconFor(item, entity),
    show_icon: true,
    show_state: true,
    layout: "horizontal",
  };
};
