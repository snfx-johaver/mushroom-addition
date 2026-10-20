import { PARITY_BY_ID } from "./parity.generated";
import type { AdditionConfig, CatalogItem, HassEntity, HomeAssistant } from "./types";
import { supportedUpstreamOption } from "./supported-options";
import { defaultWasteStreams } from "./waste-streams";
import { resolveSonosControlEntities } from "./sonos-controls";
import { resolveConsoleEntities } from "./console";

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
  [/media/, "mdi:play-circle"],
  [/playstation/, "mdi:controller-classic"],
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
  if (item.upstreamId === "custom_card_trash") return "mdi:trash-can-outline";
  if (item.upstreamId === "custom_card_room_overview") return "mdi:sofa";
  if (item.upstreamId === "custom_card_roomview") return "mdi:home-variant-outline";
  if (item.upstreamId === "custom_card_entity_carousel") return "mdi:view-carousel";
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
    item.upstreamId === "mini_graph_card"
      ? {
        variant: "line",
        hours_to_show: 24,
        points_per_hour: 0.5,
        aggregate_func: "avg",
        group_by: "interval",
        cache: true,
        smoothing: true,
        animate: false,
        height: 150,
        line_width: 5,
        bar_spacing: 4,
        color_thresholds_transition: "smooth",
        align_header: "default",
        align_icon: "right",
        align_state: "left",
        show: {
          name: true,
          icon: true,
          state: true,
          graph: "line",
          fill: true,
          points: "hover",
          legend: true,
          average: false,
          extrema: false,
          labels: "hover",
          labels_secondary: "hover",
          loading_indicator: true,
        },
      }
      : item.upstreamId === "card_scenes"
      ? {
        scene_buttons_only: false,
      }
      : item.upstreamId === "card_battery"
      ? {
        battery_warning_threshold: 50,
        battery_low_threshold: 20,
        battery_critical_threshold: 10,
        battery_healthy_color: "green",
        battery_warning_color: "yellow",
        battery_low_color: "orange",
        battery_critical_color: "red",
      }
      : item.upstreamId === "card_room"
          ? {
            icon: "mdi:sofa-single",
            label_use_temperature: true,
            label_use_brightness: false,
          }
          : item.upstreamId === "custom_card_pollen_forecast"
              ? {
                pollen_language: "en",
              }
              : item.upstreamId === "custom_card_better_thermostat"
        ? {
          variant: "normal",
          show_controls: true,
          show_temperature_control: true,
          show_humidity: true,
          show_hvac_modes: true,
          show_presets: true,
          show_status: true,
          collapsible_controls: false,
          thermostat_temp_step: 0.5,
          low_battery_threshold: 20,
        }
      : item.upstreamId === "custom_card_media_player_sonos"
        ? {
          ulm_card_media_player_enable_art: false,
          sonos_details_always_visible: false,
          ...resolveSonosControlEntities(hass, entityId),
        }
      : item.upstreamId === "custom_card_room_overview"
          ? {
            ulm_card_room_overview_light_icon_on: "mdi:lightbulb",
            ulm_card_room_overview_light_icon_off: "mdi:lightbulb-off",
            ulm_card_room_overview_cover_icon_open: "mdi:blinds-open",
            ulm_card_room_overview_cover_icon_closed: "mdi:roller-shade-closed",
            ulm_card_dynamic_color: false,
          }
          : item.upstreamId === "custom_card_welcome"
            ? {
              nav_1: "house", icon_1: "mdi:home", name_1: "House", color_1: "blue",
              nav_2: "lights", icon_2: "mdi:lightbulb", name_2: "Lights", color_2: "yellow",
              nav_3: "security", icon_3: "mdi:shield", name_3: "Secure", color_3: "green",
              nav_4: "climate", icon_4: "mdi:radiator", name_4: "Climate", color_4: "purple",
              nav_5: "network", icon_5: "mdi:flask", name_5: "Lab", color_5: "red",
            }
            : item.upstreamId === "custom_card_vehicle_status"
                ? {
                  ulm_custom_card_vehicle_status_default_name: "O meu carro",
                  ulm_custom_card_vehicle_status_energy_level: "Nível de energia",
                  ulm_custom_card_vehicle_status_range: "Alcance",
                }
                : item.upstreamId === "custom_card_plant"
                  ? {
                    ulm_card_flower_name: "No name set",
                    ulm_custom_card_plant_correct: "Correto",
                    ulm_custom_card_plant_problem: "Problema",
                  }
            : item.upstreamId === "custom_card_entity_carousel"
                  ? {
                    carousel_loop: true,
                    carousel_show_labels: true,
                    carousel_visible_items: 7,
                    carousel_initial_index: 0,
                    carousel_effect: "coverflow",
                    carousel_grab_cursor: true,
                    carousel_centered_slides: true,
                    carousel_slides_per_view: "auto",
                    carousel_coverflow_rotate: 0,
                    carousel_coverflow_stretch: 0,
                    carousel_coverflow_depth: 400,
                    carousel_coverflow_modifier: 1,
                    carousel_coverflow_slide_shadows: true,
                  }
            : item.upstreamId === "custom_card_playstation"
                  ? {
                    icon: "mdi:controller-classic",
                    console_platform: "auto",
                    console_show_artwork: true,
                    console_show_controls: true,
                    ...resolveConsoleEntities(hass, entityId),
                  }
                  : item.upstreamId === "custom_card_pollen"
                        ? {
                          icon: undefined,
                          show_state: false,
                        }
                        : item.upstreamId === "custom_card_speedtest_gauges"
                            ? {
                              ulm_custom_card_speedtest_download_speed_color: "yellow",
                              ulm_custom_card_speedtest_download_speed_max: 100,
                              ulm_custom_card_speedtest_upload_speed_color: "blue",
                              ulm_custom_card_speedtest_upload_speed_max: 40,
                              ulm_custom_card_speedtest_ping_color: "green",
                              ulm_custom_card_speedtest_ping_max: 85,
                              ulm_custom_card_speedtest_round: false,
                            }
                            : {};
  const sourceDrivenIcon = new Set([
    "card_battery",
    "custom_card_pollen",
  ]).has(item.upstreamId);
  return {
    type: `custom:${item.tag}`,
    ...upstreamDefaultsFor(item),
    ...sourceDefaults,
    entity: entityId,
    entities: item.upstreamId === "mini_graph_card" && entityId ? [entityId] : undefined,
    waste_streams: item.upstreamId === "custom_card_trash" ? defaultWasteStreams() : undefined,
    show_today: item.upstreamId === "custom_card_trash" ? false : undefined,
    show_tomorrow: item.upstreamId === "custom_card_trash" ? false : undefined,
    name: undefined,
    icon: sourceDrivenIcon ? undefined : sourceDefaults.icon ?? defaultIconFor(item, entity),
    show_icon: true,
    show_state: item.upstreamId === "custom_card_pollen"
      ? false
      : true,
    layout: "default",
  };
};
