import { PARITY_BY_ID } from "./parity.generated";
import type { AdditionConfig, CatalogItem, HassEntity, HomeAssistant } from "./types";
import { supportedUpstreamOption } from "./supported-options";
import { defaultWasteStreams } from "./waste-streams";
import { resolveSonosControlEntities } from "./sonos-controls";
import { resolveConsoleEntities } from "./console";
import { cardIconKeys } from "./entity-icon";
import { UPCOMING_MEDIA_DEFAULTS } from "./upcoming-media";
import { REMOTE_DEFAULTS } from "./remote-card";
import { PIHOLE_DEFAULTS } from "./pi-hole";

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
  if (item.upstreamId === "stock_card") return "mdi:chart-line";
  if (entity?.attributes.icon) return entity.attributes.icon;
  if (item.upstreamId === "custom_card_trash") return "mdi:trash-can-outline";
  if (item.upstreamId === "custom_card_entity_carousel") return "mdi:view-carousel";
  if (item.upstreamId === "custom_card_light") return "mdi:lightbulb";
  if (item.upstreamId === "custom_card_sun") return "mdi:weather-sunny";
  if (item.upstreamId === "custom_card_speedtest_gauges") return "mdi:speedometer";
  if (item.upstreamId === "advanced_home_energy_management") return "mdi:home-lightning-bolt-outline";
  if (item.upstreamId === "advanced_energy_buy_sell") return "mdi:chart-timeline-variant";
  if (item.upstreamId === "advanced_energy_panel_health") return "mdi:solar-power-variant";
  if (item.upstreamId === "upcoming_media") return "mdi:movie-open-outline";
  if (item.upstreamId === "remote_card") return "mdi:remote-tv";
  if (item.upstreamId === "pi_hole_card") return "mdi:pi-hole";
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
  const iconKeys = new Set(cardIconKeys(item));
  for (const sourceId of item.sourceIds ?? [item.upstreamId]) {
    for (const variable of PARITY_BY_ID.get(sourceId)?.variables ?? []) {
      if (!supportedUpstreamOption(item, variable.name)) continue;
      if (iconKeys.has(variable.name)) continue;
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
  const sourceDefaults: Partial<AdditionConfig> =
    item.upstreamId === "stock_card"
      ? { stock_source: "entity", stock_shares: 0, stock_interval: 300, stock_range: "1D",
        stock_show_position: true, stock_show_statistics: true, stock_show_volume: true, stock_show_trends: true }
      : item.upstreamId === "pi_hole_card"
      ? PIHOLE_DEFAULTS
      : item.upstreamId === "remote_card"
      ? REMOTE_DEFAULTS
      : item.upstreamId === "upcoming_media"
      ? UPCOMING_MEDIA_DEFAULTS
      : item.upstreamId === "mini_graph_card"
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
        align_icon: "left",
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
      : item.upstreamId === "advanced_home_energy_management"
      ? {
        energy_grid_label: "GRID",
        energy_grid_import_label: "GRID · Import",
        energy_grid_export_label: "GRID · Export",
        energy_solar_label: "Solar Panels",
        energy_battery_label: "Battery",
        energy_home_label: "HOME",
        energy_forecast_label: "Expected",
        energy_ev_label: "EV charger",
        energy_charge_label: "Charging",
        energy_discharge_label: "Discharging",
        energy_idle_label: "Idle",
        energy_auto_label: "Auto",
        energy_manual_label: "Manual",
        mode_solar_first_label: "Solar first",
        mode_smart_saving_label: "Smart saving",
        mode_smart_trading_label: "Smart trading",
        grid_phase_scale_max: 3000,
        solar_scale_max: 6000,
        battery_unit_scale_max: 2400,
        home_scale_max: 4000,
        price_low_threshold: 0.18,
        price_medium_threshold: 0.26,
        price_high_threshold: 0.34,
        price_critical_threshold: 0.42,
        show_grid_phases: true,
        show_battery_units: true,
        show_tariff_timeline: true,
        import_color: "#ff9f43",
        export_color: "#4cd98b",
        solar_color: "#f6c744",
        battery_color: "#3b82f6",
        home_color: "#3478f6",
        price_negative_color: "#0288d1",
        price_low_color: "#2e7d32",
        price_medium_color: "#9ccc65",
        price_high_color: "#fdd835",
        price_critical_color: "#e53935",
      }
      : item.upstreamId === "advanced_energy_buy_sell"
      ? {
        buy_sell_title: "Buy and sell moments (all-in €/kWh)",
        buy_sell_show_result: true,
        buy_sell_trade_energy: 10,
        buy_sell_trade_power: 7.2,
        buy_sell_trade_efficiency: 86,
        buy_sell_feed_in_fee: 0,
        buy_sell_slot_minutes: 15,
        buy_sell_graph_span: 36,
        buy_sell_span_start: "day",
        buy_sell_update_interval: 5,
        buy_sell_chart_height: 300,
        buy_sell_show_now: true,
        buy_sell_now_label: "Now",
        buy_sell_now_color: "var(--primary-text-color)",
        buy_sell_show_legend: true,
        buy_sell_show_grid: true,
        buy_sell_axis_label: "€/kWh",
        buy_sell_price_decimals: 3,
        buy_sell_axis_decimals: 2,
        buy_sell_bar_radius: 2,
        buy_sell_price_label: "Price",
        buy_sell_charge_label: "Planned grid charge",
        buy_sell_planned_sell_label: "Planned sell",
        buy_sell_possible_sell_label: "Possible sell",
        buy_sell_price_color: "#78909c",
        buy_sell_charge_color: "#43a047",
        buy_sell_planned_sell_color: "#fb8c00",
        buy_sell_possible_sell_color: "#ffcc80",
      }
      : item.upstreamId === "advanced_energy_panel_health"
      ? {
        panel_health_title: "Panel health",
        panel_gauge_max: 350,
        panel_warning_average_min: 30,
        panel_low_output_percent: 60,
        panel_segment_1: 80,
        panel_segment_2: 150,
        panel_segment_3: 230,
        panel_segment_4: 300,
        panel_color_0: "#b0bec5",
        panel_color_1: "#ffa726",
        panel_color_2: "#d4e157",
        panel_color_3: "#66bb6a",
        panel_color_4: "#2e7d32",
        panel_color_5: "#2e7d32",
        panel_show_summary: true,
        panel_show_gauges: true,
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
            label_use_temperature: true,
            label_use_brightness: false,
            ulm_card_dynamic_color: false,
            room_status: [],
            room_secondary_parts: [],
            room_temperature_entity: entityId && /^(sensor|climate)\./.test(entityId) ? entityId : undefined,
            room_light_entity: entityId?.startsWith("light.") ? entityId : undefined,
          }
          : item.upstreamId === "custom_card_media_player_sonos"
        ? {
          ulm_card_media_player_enable_art: false,
          use_media_info: false,
          volume_controls: ["volume_buttons"],
          media_controls: ["play_pause_stop"],
          collapsible_controls: false,
          sonos_details_always_visible: false,
          ...resolveSonosControlEntities(hass, entityId),
        }
          : item.upstreamId === "custom_card_welcome"
            ? {
              welcome_weather_icon_type: "automatic",
              welcome_weather_primary_info: "temperature",
              welcome_weather_secondary_info: "date",
              welcome_weather_date_format: "month_day",
              welcome_weather_tap_action: { action: "more-info" },
              scene_items: [
                { entity: "", navigation_path: "house", icon: "mdi:home", name: "House", color: "blue" },
                { entity: "", navigation_path: "lights", icon: "mdi:lightbulb", name: "Lights", color: "yellow" },
                { entity: "", navigation_path: "security", icon: "mdi:shield", name: "Secure", color: "green" },
                { entity: "", navigation_path: "climate", icon: "mdi:radiator", name: "Climate", color: "purple" },
                { entity: "", navigation_path: "network", icon: "mdi:flask", name: "Lab", color: "red" },
              ],
            }
            : item.upstreamId === "custom_card_plant"
                  ? {
                    ulm_card_flower_name: "No name set",
                    ulm_custom_card_plant_correct: "Correto",
                    ulm_custom_card_plant_problem: "Problema",
                  }
            : item.upstreamId === "custom_card_light"
                  ? {
                    light_show_brightness: true,
                    light_show_members: true,
                    light_show_scenes: true,
                    light_members_expanded: false,
                    light_members_per_row: 4,
                  }
            : item.upstreamId === "custom_card_entity_carousel"
                  ? {
                    carousel_loop: true,
                    carousel_show_header: true,
                    carousel_show_labels: true,
                    carousel_visible_items: 7,
                    carousel_initial_index: 0,
                    carousel_button_width: 58,
                    carousel_button_height: 58,
                    carousel_icon_size: 28,
                    carousel_effect: "coverflow",
                    carousel_navigation: false,
                    carousel_pagination: false,
                    carousel_pagination_type: "bullets",
                    carousel_scrollbar: false,
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
    icon: undefined,
    show_icon: true,
    show_state: item.upstreamId === "custom_card_pollen"
      ? false
      : true,
    layout: "default",
  };
};
