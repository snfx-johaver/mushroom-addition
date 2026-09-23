import "../src/index";
import * as mdiPaths from "@mdi/js";
import type { AdditionConfig, HomeAssistant } from "../src/types";

class HaCard extends HTMLElement {}
if (!customElements.get("ha-card")) customElements.define("ha-card", HaCard);
class HaIcon extends HTMLElement {
  public static get observedAttributes() { return ["icon"]; }

  public constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  public set icon(value: string) {
    const exportName = value.startsWith("mdi:")
      ? `mdi${value.slice(4).split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("")}`
      : "";
    const path = (mdiPaths as Record<string, unknown>)[exportName];
    this.shadowRoot!.innerHTML = typeof path === "string"
      ? `<style>:host{display:inline-flex;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px);color:inherit}svg{display:block;width:100%;height:100%;fill:currentColor}</style><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"></path></svg>`
      : `<style>:host{display:inline-flex;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px)}</style>`;
  }

  public attributeChangedCallback(_name: string, _oldValue: string | null, value: string | null) {
    if (value) this.icon = value;
  }
}
if (!customElements.get("ha-icon")) customElements.define("ha-icon", HaIcon);

const states: HomeAssistant["states"] = {
  "sensor.rest": { entity_id: "sensor.rest", state: "Tomorrow", attributes: { friendly_name: "Residual waste" } },
  "sensor.gft": { entity_id: "sensor.gft", state: "Friday", attributes: { friendly_name: "Organic waste" } },
  "sensor.paper": { entity_id: "sensor.paper", state: "Oct 4", attributes: { friendly_name: "Paper" } },
  "sensor.pmd": { entity_id: "sensor.pmd", state: "Oct 10", attributes: { friendly_name: "PMD" } },
  "sensor.glass": { entity_id: "sensor.glass", state: "Oct 18", attributes: { friendly_name: "Glass" } },
  "sensor.afvalinfo_home_gft": { entity_id: "sensor.afvalinfo_home_gft", state: "02-10-2026", attributes: { friendly_name: "Biodegradable waste" } },
  "sensor.afvalinfo_home_papier": { entity_id: "sensor.afvalinfo_home_papier", state: "29-09-2026", attributes: { friendly_name: "Paper" } },
  "sensor.afvalinfo_home_pbd": { entity_id: "sensor.afvalinfo_home_pbd", state: "25-09-2026", attributes: { friendly_name: "Plastic cans and drink cartons" } },
  "sensor.afvalinfo_home_restafval": { entity_id: "sensor.afvalinfo_home_restafval", state: "25-09-2026", attributes: { friendly_name: "Residual waste" } },
  "sensor.afvalinfo_home_grofvuil": { entity_id: "sensor.afvalinfo_home_grofvuil", state: "unknown", attributes: { friendly_name: "Bulky waste" } },
  "sensor.afvalinfo_home_trash_type_today": { entity_id: "sensor.afvalinfo_home_trash_type_today", state: "geen", attributes: { friendly_name: "Trash type today" } },
  "sensor.afvalinfo_home_trash_type_tomorrow": { entity_id: "sensor.afvalinfo_home_trash_type_tomorrow", state: "geen", attributes: { friendly_name: "Trash type tomorrow" } },
  "input_boolean.alarm": { entity_id: "input_boolean.alarm", state: "on", attributes: { friendly_name: "Alarm" } },
  "input_datetime.alarm": { entity_id: "input_datetime.alarm", state: "08:30:00", attributes: { friendly_name: "Alarm time", has_time: true } },
  "sensor.download": { entity_id: "sensor.download", state: "273.07", attributes: { friendly_name: "Download", unit_of_measurement: "Mbit/s", history: [190, 220, 280, 260, 245, 272, 270, 276] } },
  "sensor.ping": { entity_id: "sensor.ping", state: "24", attributes: { friendly_name: "Ping", unit_of_measurement: "ms", history: [35, 31, 28, 27, 24, 24, 23, 24] } },
  "sensor.upload": { entity_id: "sensor.upload", state: "17.19", attributes: { friendly_name: "Upload", unit_of_measurement: "Mbit/s", history: [19, 17, 17.5, 16, 15, 16, 17, 17.19] } },
  "media_player.chromecast": { entity_id: "media_player.chromecast", state: "off", attributes: { friendly_name: "Chromecast" } },
  "camera.driveway": { entity_id: "camera.driveway", state: "streaming", attributes: {
    friendly_name: "Driveway",
    entity_picture: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Crect width='640' height='360' fill='%233b5266'/%3E%3Cpath d='M0 280L180 150L320 245L470 100L640 250V360H0Z' fill='%236b8798'/%3E%3Ccircle cx='520' cy='72' r='34' fill='%23f3d27a'/%3E%3C/svg%3E",
  } },
  "sensor.power": { entity_id: "sensor.power", state: "2577.8", attributes: { friendly_name: "Power", unit_of_measurement: "W", history: [120, 100, 95, 110, 1800, 1900, 130, 2500, 160, 2500, 1850] } },
  "device_tracker.phone": { entity_id: "device_tracker.phone", state: "home", attributes: { friendly_name: "OP8" } },
  "device_tracker.phone_ble": { entity_id: "device_tracker.phone_ble", state: "home", attributes: { friendly_name: "OP8 Bluetooth" } },
  "sensor.room_temperature": { entity_id: "sensor.room_temperature", state: "23", attributes: { friendly_name: "Living room", unit_of_measurement: "°C" } },
  "sensor.room_humidity": { entity_id: "sensor.room_humidity", state: "67", attributes: { friendly_name: "Humidity", unit_of_measurement: "%" } },
  "light.room": { entity_id: "light.room", state: "on", attributes: { friendly_name: "Room lights" } },
  "binary_sensor.room_motion": { entity_id: "binary_sensor.room_motion", state: "on", attributes: { friendly_name: "Motion" } },
  "input_datetime.cat_litter": { entity_id: "input_datetime.cat_litter", state: "2026-09-21 12:00:00", attributes: { friendly_name: "Cat Litter", has_date: true, has_time: true, year: 2026, month: 9, day: 21, hour: 12, minute: 0, second: 0 } },
  "lock.front_door": { entity_id: "lock.front_door", state: "locked", attributes: { friendly_name: "Front Door" } },
  "binary_sensor.front_door": { entity_id: "binary_sensor.front_door", state: "on", attributes: { friendly_name: "Front Door" } },
  "sensor.lock_battery": { entity_id: "sensor.lock_battery", state: "18", attributes: { friendly_name: "Lock battery", unit_of_measurement: "%" } },
  "person.lewis": { entity_id: "person.lewis", state: "home", attributes: { friendly_name: "Lewis" } },
  "input_boolean.welcome_toggle": { entity_id: "input_boolean.welcome_toggle", state: "off", attributes: { friendly_name: "Welcome toggle" } },
  "group.room_lights": { entity_id: "group.room_lights", state: "on", attributes: { friendly_name: "Room lights", entity_id: ["light.room", "light.lamp"] } },
  "group.room_motions": { entity_id: "group.room_motions", state: "on", attributes: { friendly_name: "Room motions", entity_id: ["binary_sensor.room_motion"] } },
  "group.room_doors": { entity_id: "group.room_doors", state: "off", attributes: { friendly_name: "Room doors", entity_id: ["binary_sensor.front_door"] } },
  "group.room_outlets": { entity_id: "group.room_outlets", state: "on", attributes: { friendly_name: "Room outlets", entity_id: ["switch.outlet"] } },
  "group.room_tv": { entity_id: "group.room_tv", state: "off", attributes: { friendly_name: "Room TV", entity_id: ["media_player.chromecast"] } },
  "group.room_shutters": { entity_id: "group.room_shutters", state: "closed", attributes: { friendly_name: "Room shutters", entity_id: ["cover.room"] } },
  "cover.room": { entity_id: "cover.room", state: "closed", attributes: { friendly_name: "Room cover" } },
  "switch.washer": { entity_id: "switch.washer", state: "on", attributes: { friendly_name: "Washing machine" } },
  "sensor.washer_job": { entity_id: "sensor.washer_job", state: "Washing", attributes: { friendly_name: "Washer job" } },
  "sensor.washer_progress": { entity_id: "sensor.washer_progress", state: "52", attributes: { friendly_name: "Progress", unit_of_measurement: "%" } },
  "climate.living": { entity_id: "climate.living", state: "heat", attributes: { friendly_name: "Living room", current_temperature: 19, temperature: 21, target_temp_step: .5, hvac_action: "heating" } },
  "climate.heat_pump": { entity_id: "climate.heat_pump", state: "off", attributes: { friendly_name: "Air conditioner", current_temperature: null, temperature: 20, target_temp_step: 1, hvac_action: "off", hvac_modes: ["off", "heat", "cool", "heat_cool", "dry", "fan_only"] } },
  "update.core": { entity_id: "update.core", state: "on", attributes: { friendly_name: "Home Assistant Core", installed_version: "2026.8", latest_version: "2026.9" } },
  "update.supervisor": { entity_id: "update.supervisor", state: "off", attributes: { friendly_name: "Supervisor", installed_version: "2026.9" } },
  "update.operating_system": { entity_id: "update.operating_system", state: "off", attributes: { friendly_name: "OS", installed_version: "17.0" } },
  "sun.sun": { entity_id: "sun.sun", state: "above_horizon", attributes: { friendly_name: "Sun", next_rising: "2026-09-24T05:17:00Z", next_setting: "2026-09-23T16:45:00Z" } },
  "sensor.battery": { entity_id: "sensor.battery", state: "18", attributes: { friendly_name: "Battery", unit_of_measurement: "%" } },
  "media_player.plex": { entity_id: "media_player.plex", state: "playing", attributes: {
    friendly_name: "Plex",
    media_title: "The Expanse",
    data: [{}, {
      title: "Ted Lasso",
      episode: "Follow the Anger",
      fanart: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='360'%3E%3Crect width='800' height='360' fill='%23d88b39'/%3E%3Ccircle cx='500' cy='120' r='100' fill='%23f5d195'/%3E%3C/svg%3E",
    }],
  } },
  "person.joris": { entity_id: "person.joris", state: "home", attributes: {
    friendly_name: "Joris",
    entity_picture: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Crect width='128' height='128' rx='64' fill='%23d6aa8d'/%3E%3Ccircle cx='64' cy='46' r='24' fill='%2345342d'/%3E%3Cpath d='M24 128c4-38 22-54 40-54s36 16 40 54' fill='%233c78a8'/%3E%3C/svg%3E",
  } },
  "sensor.phone_battery": { entity_id: "sensor.phone_battery", state: "72", attributes: { friendly_name: "Phone battery", unit_of_measurement: "%" } },
  "sensor.phone_battery_state": { entity_id: "sensor.phone_battery_state", state: "discharging", attributes: { friendly_name: "Phone battery state" } },
  "sensor.person_full_battery": { entity_id: "sensor.person_full_battery", state: "99", attributes: { friendly_name: "Phone battery", unit_of_measurement: "%" } },
  "sensor.person_full_commute": { entity_id: "sensor.person_full_commute", state: "30", attributes: { friendly_name: "Commute", unit_of_measurement: "min" } },
  "sensor.person_small_battery": { entity_id: "sensor.person_small_battery", state: "100", attributes: { friendly_name: "Phone battery", unit_of_measurement: "%" } },
  "sensor.person_small_battery_state": { entity_id: "sensor.person_small_battery_state", state: "charging", attributes: { friendly_name: "Phone battery state" } },
  "sensor.joris_address": { entity_id: "sensor.joris_address", state: "Home", attributes: { friendly_name: "Joris address" } },
  "sensor.joris_locality": { entity_id: "sensor.joris_locality", state: "Amsterdam", attributes: { friendly_name: "Joris locality", Locality: "Amsterdam" } },
  "sensor.joris_commute": { entity_id: "sensor.joris_commute", state: "24", attributes: { friendly_name: "Commute", unit_of_measurement: "min" } },
  "binary_sensor.joris_driving": { entity_id: "binary_sensor.joris_driving", state: "off", attributes: { friendly_name: "Joris driving" } },
  "binary_sensor.joris_driving_full": { entity_id: "binary_sensor.joris_driving_full", state: "on", attributes: { friendly_name: "Joris driving" } },
  "zone.work": { entity_id: "zone.work", state: "0", attributes: { friendly_name: "Work", icon: "mdi:briefcase" } },
  "zone.school": { entity_id: "zone.school", state: "0", attributes: { friendly_name: "School", icon: "mdi:school" } },
  "device_tracker.gps": { entity_id: "device_tracker.gps", state: "home", attributes: { friendly_name: "GPS" } },
  "device_tracker.wifi": { entity_id: "device_tracker.wifi", state: "Office Wi-Fi", attributes: { friendly_name: "Wi-Fi" } },
  "input_number.target": { entity_id: "input_number.target", state: "21", attributes: { friendly_name: "Target temperature", unit_of_measurement: "°C" } },
  "sensor.humidity": { entity_id: "sensor.humidity", state: "47", attributes: { friendly_name: "Humidity", unit_of_measurement: "%", icon: "mdi:thermometer" } },
  "sensor.date_long": { entity_id: "sensor.date_long", state: "Sep.23th. Wednesday", attributes: { friendly_name: "Long date" } },
  "sensor.wind": { entity_id: "sensor.wind", state: "12", attributes: { friendly_name: "Wind", unit_of_measurement: "km/h" } },
  "sensor.precipitation": { entity_id: "sensor.precipitation", state: "0", attributes: { friendly_name: "Precipitation", unit_of_measurement: "mm" } },
  "sensor.uv": { entity_id: "sensor.uv", state: "3", attributes: { friendly_name: "UV index" } },
  "sensor.entities": { entity_id: "sensor.entities", state: "214", attributes: { friendly_name: "Entities" } },
  "weather.home": { entity_id: "weather.home", state: "partlycloudy", attributes: { friendly_name: "Home", temperature: 18, humidity: 58 } },
  "light.lamp": { entity_id: "light.lamp", state: "on", attributes: { friendly_name: "Desk lamp", brightness: 180 } },
  "media_player.sonos": { entity_id: "media_player.sonos", state: "playing", attributes: { friendly_name: "Sonos", source: "Spotify", volume_level: .42 } },
  "switch.outlet": { entity_id: "switch.outlet", state: "on", attributes: { friendly_name: "Coffee outlet" } },
  "sensor.energy": { entity_id: "sensor.energy", state: "2.8", attributes: { friendly_name: "Energy", unit_of_measurement: "kWh" } },
  "sensor.signal": { entity_id: "sensor.signal", state: "-58", attributes: { friendly_name: "Wi-Fi signal", unit_of_measurement: "dBm" } },
  "sensor.nas": { entity_id: "sensor.nas", state: "37", attributes: { friendly_name: "NAS CPU", unit_of_measurement: "%" } },
  "binary_sensor.hn_nas_status": { entity_id: "binary_sensor.hn_nas_status", state: "on", attributes: { friendly_name: "HN-NAS" } },
  "sensor.hn_nas_disk": { entity_id: "sensor.hn_nas_disk", state: "25.5", attributes: { friendly_name: "Volume used", unit_of_measurement: "%" } },
  "sensor.hn_nas_temperature": { entity_id: "sensor.hn_nas_temperature", state: "46", attributes: { friendly_name: "Average disk temperature", unit_of_measurement: "°C" } },
  "sensor.hn_nas_memory": { entity_id: "sensor.hn_nas_memory", state: "15", attributes: { friendly_name: "Memory usage", unit_of_measurement: "%" } },
  "sensor.hn_nas_cpu": { entity_id: "sensor.hn_nas_cpu", state: "19.3", attributes: { friendly_name: "CPU utilization total", unit_of_measurement: "%" } },
  "update.addon": { entity_id: "update.addon", state: "on", attributes: { friendly_name: "Studio Code Server", installed_version: "1.0", latest_version: "1.1" } },
  "sensor.time": { entity_id: "sensor.time", state: "18:48", attributes: { friendly_name: "Time" } },
  "sensor.tablet": { entity_id: "sensor.tablet", state: "76", attributes: { friendly_name: "Wall tablet", unit_of_measurement: "%" } },
  "binary_sensor.bram_tablet_status": { entity_id: "binary_sensor.bram_tablet_status", state: "on", attributes: { friendly_name: "Bram Tablet" } },
  "switch.bram_tablet_usb": { entity_id: "switch.bram_tablet_usb", state: "on", attributes: { friendly_name: "Tablet USB" } },
  "switch.bram_tablet_motion": { entity_id: "switch.bram_tablet_motion", state: "on", attributes: { friendly_name: "Tablet motion" } },
  "switch.bram_tablet_display": { entity_id: "switch.bram_tablet_display", state: "on", attributes: { friendly_name: "Tablet display" } },
  "button.bram_tablet_restart": { entity_id: "button.bram_tablet_restart", state: "unknown", attributes: { friendly_name: "Restart tablet" } },
  "switch.bram_tablet_maintenance": { entity_id: "switch.bram_tablet_maintenance", state: "off", attributes: { friendly_name: "Maintenance mode" } },
  "button.bram_tablet_reload": { entity_id: "button.bram_tablet_reload", state: "unknown", attributes: { friendly_name: "Reload tablet" } },
  "sensor.bram_tablet_ram": { entity_id: "sensor.bram_tablet_ram", state: "747.7", attributes: { friendly_name: "RAM", unit_of_measurement: "MB" } },
  "sensor.bram_tablet_disk": { entity_id: "sensor.bram_tablet_disk", state: "17829.9", attributes: { friendly_name: "Disk", unit_of_measurement: "MB" } },
  "binary_sensor.bram_tablet_power": { entity_id: "binary_sensor.bram_tablet_power", state: "off", attributes: { friendly_name: "Power" } },
  "sensor.bram_tablet_battery": { entity_id: "sensor.bram_tablet_battery", state: "91", attributes: { friendly_name: "Battery", unit_of_measurement: "%" } },
  "sensor.pollen": { entity_id: "sensor.pollen", state: "4", attributes: { friendly_name: "Grass pollen" } },
  "sensor.waste": { entity_id: "sensor.waste", state: "Tomorrow", attributes: { friendly_name: "Residual waste", daysTo: 1 } },
  "media_player.console": { entity_id: "media_player.console", state: "playing", attributes: { friendly_name: "Game console", source: "Forza Horizon" } },
  "switch.heater": { entity_id: "switch.heater", state: "on", attributes: { friendly_name: "Bathroom heater" } },
  "fan.bedroom": { entity_id: "fan.bedroom", state: "on", attributes: { friendly_name: "Bedroom fan", percentage: 66, preset_modes: ["Auto", "Sleep", "Boost"], preset_mode: "Auto" } },
  "binary_sensor.window": { entity_id: "binary_sensor.window", state: "on", attributes: { friendly_name: "Kitchen window" } },
  "sensor.fuel": { entity_id: "sensor.fuel", state: "68", attributes: { friendly_name: "Fuel", unit_of_measurement: "%" } },
  "sensor.range": { entity_id: "sensor.range", state: "486", attributes: { friendly_name: "Range", unit_of_measurement: "km" } },
  "sensor.moisture": { entity_id: "sensor.moisture", state: "41", attributes: { friendly_name: "Moisture", unit_of_measurement: "%" } },
  "sensor.toner_black": { entity_id: "sensor.toner_black", state: "84", attributes: { friendly_name: "Black toner", unit_of_measurement: "%" } },
  "sensor.toner_cyan": { entity_id: "sensor.toner_cyan", state: "51", attributes: { friendly_name: "Cyan toner", unit_of_measurement: "%" } },
  "sensor.toner_magenta": { entity_id: "sensor.toner_magenta", state: "63", attributes: { friendly_name: "Magenta toner", unit_of_measurement: "%" } },
  "sensor.toner_yellow": { entity_id: "sensor.toner_yellow", state: "37", attributes: { friendly_name: "Yellow toner", unit_of_measurement: "%" } },
  "water_heater.boiler": { entity_id: "water_heater.boiler", state: "eco", attributes: { friendly_name: "Boiler", current_temperature: 48, temperature: 55 } },
};

const hass: HomeAssistant = {
  states,
  callService: async () => undefined,
  connection: {
    sendMessagePromise: async <T>() => undefined as T,
    subscribeMessage: async () => () => undefined,
  },
};

interface Fixture {
  id: string;
  key?: string;
  title?: string;
  entity: string;
  reference?: string;
  config?: Partial<AdditionConfig>;
  width?: number;
  referenceCrop?: { width: number; height: number };
  theme?: "light" | "dark";
}

const fixtures: Fixture[] = [
  {
    id: "afvalophaling",
    key: "afvalophaling-full",
    title: "custom_card_afvalophaling — full configured streams",
    entity: "sensor.afvalinfo_home_restafval",
    reference: "ulm_cards/custom_card_afvalophaling_1.png",
    width: 320,
    config: {
      show_today: true,
      today_entity: "sensor.afvalinfo_home_trash_type_today",
      show_tomorrow: true,
      tomorrow_entity: "sensor.afvalinfo_home_trash_type_tomorrow",
      waste_streams: [
        { enabled: true, entity: "sensor.afvalinfo_home_restafval", label: "Residual waste", icon: "mdi:trash-can", color: "#43a047" },
        { enabled: true, entity: "sensor.afvalinfo_home_papier", label: "Paper", icon: "mdi:newspaper-variant", color: "#1e88e5" },
        { enabled: true, entity: "sensor.afvalinfo_home_pbd", label: "Packaging / PBD", icon: "mdi:recycle", color: "#f9a825" },
        { enabled: true, entity: "sensor.afvalinfo_home_gft", label: "Organic / GFT", icon: "mdi:leaf", color: "#7cb342" },
        { enabled: false, entity: "", label: "Glass", icon: "mdi:bottle-soda", color: "#00897b" },
        { enabled: true, entity: "sensor.afvalinfo_home_grofvuil", label: "Bulky waste", icon: "mdi:sofa", color: "#8d6e63" },
      ],
    },
  },
  {
    id: "afvalophaling",
    key: "afvalophaling-partial",
    title: "custom_card_afvalophaling — partial configured streams",
    entity: "sensor.afvalinfo_home_restafval",
    reference: "ulm_cards/custom_card_afvalophaling_2.png",
    config: {
      show_today: true,
      today_entity: "sensor.afvalinfo_home_trash_type_today",
      show_tomorrow: true,
      tomorrow_entity: "sensor.afvalinfo_home_trash_type_tomorrow",
      waste_streams: [
        { enabled: true, entity: "sensor.afvalinfo_home_restafval", label: "Residual waste", icon: "mdi:trash-can", color: "#43a047" },
        { enabled: false, entity: "sensor.afvalinfo_home_papier", label: "Paper", icon: "mdi:newspaper-variant", color: "#1e88e5" },
        { enabled: false, entity: "sensor.afvalinfo_home_pbd", label: "Packaging / PBD", icon: "mdi:recycle", color: "#f9a825" },
        { enabled: true, entity: "sensor.afvalinfo_home_gft", label: "Organic / GFT", icon: "mdi:leaf", color: "#7cb342" },
        { enabled: false, entity: "", label: "Glass", icon: "mdi:bottle-soda", color: "#00897b" },
      ],
    },
  },
  { id: "alarm-time", entity: "input_boolean.alarm", config: { datetime_entity: "input_datetime.alarm", ulm_card_alarm_time_step: 15 } },
  { id: "apexcharts", entity: "sensor.download", reference: "custom_card_apexcharts_line.png", width: 640, config: { entities: ["sensor.ping", "sensor.upload"] } },
  { id: "camera", entity: "camera.driveway", reference: "screenshot_custom_camera1.png", width: 250, config: { ulm_custom_card_camera_title: true, ulm_custom_card_camera_name: "Driveway", ulm_custom_card_camera_label: "Live camera", ulm_custom_card_camera_aspect_ratio: "16 / 9" } },
  { id: "chromecast", entity: "media_player.chromecast", reference: "chromecast.png", width: 608 },
  { id: "damix48-power-details", entity: "sensor.power", reference: "custom_power_details.png", width: 385, config: { icon: "mdi:flash", ulm_card_power_details_hours: 2, ulm_card_power_details_height: 180 } },
  { id: "device-tracker", entity: "device_tracker.phone", reference: "custom_card_device_tracker.png", width: 320, theme: "dark", config: { ulm_custom_card_device_tracker_tracker_1_entity: "device_tracker.phone", ulm_custom_card_device_tracker_tracker_1_type: "wifi", ulm_custom_card_device_tracker_tracker_2_entity: "device_tracker.phone_ble", ulm_custom_card_device_tracker_tracker_2_type: "bluetooth" } },
  { id: "drealine-roomview", entity: "", reference: "custom_card_drealine_roomview_1.png", width: 320, config: {
    icon: "mdi:home-variant-outline",
    group_lights: "group.room_lights",
    group_motions: "group.room_motions",
    group_doors: "group.room_doors",
    group_outlets: "group.room_outlets",
    group_tv: "group.room_tv",
    group_windows_shutters: "group.room_shutters",
    temperature: "sensor.room_temperature",
    humidity: "sensor.room_humidity",
  } },
  { id: "eraycetinay-elapsed-time", entity: "input_datetime.cat_litter", reference: "custom_card_eraycetinay_elapsed_time.png", width: 320, config: { icon: "mdi:toilet" } },
  { id: "eraycetinay-lock", entity: "lock.front_door", reference: "custom_card_eraycetinay_lock.png", width: 320, config: { ulm_custom_card_eraycetinay_lock_door_open: "binary_sensor.front_door", ulm_custom_card_eraycetinay_lock_battery_level: "sensor.lock_battery" } },
  { id: "esh-room", entity: "light.room", reference: "custom_card_esh_room_light.png", width: 320, config: {
    name: "Living room",
    icon: "mdi:sofa",
    ulm_custom_card_esh_room_light_entity: "light.room",
    ulm_custom_card_esh_room_climate_entity: "climate.living",
    ulm_custom_card_esh_room_cover_entity: "cover.room",
    secondary: "🌡️ 23 °C  💧 67%",
  } },
  { id: "esh-welcome", entity: "person.lewis", reference: "custom_card_esh_welcome_light.png", width: 420, config: {
    name: "Lewis",
    ulm_card_esh_welcome_collapse: "input_boolean.welcome_toggle",
    ulm_weather: "weather.home",
    nav_1: "house", icon_1: "mdi:home", name_1: "House", color_1: "blue",
    nav_2: "lights", icon_2: "mdi:lightbulb", name_2: "Lights", color_2: "yellow",
    nav_3: "security", icon_3: "mdi:shield", name_3: "Secure", color_3: "green",
    nav_4: "climate", icon_4: "mdi:radiator", name_4: "Climate", color_4: "purple",
    nav_5: "network", icon_5: "mdi:flask", name_5: "Lab", color_5: "red",
  } },
  { id: "haven-washer", entity: "switch.washer", reference: "custom_card_haven_washer_running.png", width: 375, config: {
    door_entity: "sensor.washer_door",
    finished_entity: "sensor.washer_finished",
    ulm_custom_card_washer_machine_state: "sensor.washer_job",
    ulm_custom_card_washer_job_state: "sensor.washer_job",
    ulm_custom_card_washer_job_progress: "sensor.washer_progress",
    ulm_custom_card_washer_remote_control: "sensor.washer_remote",
    ulm_custom_card_washer_delayed_start: "input_boolean.washer_delayed",
    ulm_custom_card_washer_delayed_starttime: "input_datetime.washer_delayed",
    ulm_custom_card_washer_job_states: {
      state1: { name: "WeightSensing", icon: "mdi:scale" },
      state2: { name: "Washing", icon: "mdi:waves" },
      state3: { name: "Rinsing", icon: "mdi:water" },
      state4: { name: "Spinning", icon: "mdi:fan" },
    },
    ulm_custom_card_washer_pause_action: { action: "call-service", service: "switch.turn_on", service_data: { entity_id: "switch.washer_pause" } },
    ulm_custom_card_washer_stop_action: { action: "call-service", service: "switch.turn_on", service_data: { entity_id: "switch.washer_stop" } },
  } },
  { id: "heat-pump", entity: "climate.heat_pump", reference: "Heat_pump.PNG", width: 475 },
  { id: "homeassistant-updates", entity: "update.core", reference: "ulm_cards/card_homeassistant_updates.png", width: 650, config: { ulm_card_homeassistant_core: "update.core", ulm_card_homeassistant_supervisor: "update.supervisor", ulm_card_homeassistant_os: "update.operating_system" } },
  { id: "httpedo13-sun", entity: "sun.sun", reference: "sun-card.png", width: 500, config: { timeFormat: "24h" } },
  { id: "httpedo13-thermostat", entity: "climate.living", reference: "thermostat_white_with_heating_ui.png", width: 360, config: { variant: "buttons" } },
  { id: "iabadia-battery-chip", entity: "sensor.battery", reference: "custom_card_iAbadia_battery_chip.png", width: 42, config: { ulm_custom_card_iAbadia_battery_chip_warning: 20, ulm_custom_card_iAbadia_battery_chip_danger: 10 } },
  { id: "imswel-medias", entity: "media_player.plex", reference: "custom_card_imswel_medias/medias_library_plex.png", width: 488, config: { variant: "library", ulm_custom_card_imswel_medias_platform: "plex" } },
  { id: "imswel-person", entity: "person.joris", reference: "custom_card_imswel_person.gif", width: 320, config: { use_entity_picture: false, gps_tracker_entity: "device_tracker.gps", wifi_tracker_entity: "device_tracker.wifi" } },
  { id: "input-datetime", entity: "input_datetime.alarm", reference: "card_input_datetime.png", width: 320 },
  { id: "input-number", entity: "input_number.missing", reference: "card_input_number.png", width: 320 },
  { id: "irmajavi-entities", entity: "light.lamp", reference: "screenshot_irmajavi_entities_card.jpg", width: 320, config: { entities: ["light.lamp", "sensor.room_temperature", "switch.outlet", "sensor.battery"], ulm_custom_card_irmajavi_entities_name: "System Status" } },
  { id: "irmajavi-speedtest", entity: "sensor.download", reference: "screenshot_irmajavi_speedtest_card.jpg", width: 320, config: { download_entity: "sensor.download", upload_entity: "sensor.upload", ping_entity: "sensor.ping", ulm_custom_card_irmajavi_speedtest_router_name: "Linksys", ulm_custom_card_irmajavi_speedtest_router_model: "EA8549" } },
  { id: "irmajavi-weather", entity: "weather.home", reference: "screenshot_irmajavi_weather_card.jpg", width: 320, config: { temperature_entity: "sensor.room_temperature", date_entity: "sensor.date_long", entities: ["sensor.wind", "sensor.precipitation", "sensor.uv", "sensor.humidity"], ulm_custom_card_irmajavi_weather_name_1: "Wind", ulm_custom_card_irmajavi_weather_name_2: "Precipitation", ulm_custom_card_irmajavi_weather_name_3: "UV", ulm_custom_card_irmajavi_weather_name_4: "Humidity" } },
  {
    id: "light-colorpick",
    entity: "light.lamp",
    width: 320,
    config: { ulm_card_light_colorpick_name: "Desk lamp", ulm_card_light_colorpick_transition: 1 },
  },
  {
    id: "media-player-sonos",
    entity: "media_player.sonos",
    reference: "media_player_sonos.png",
    referenceWidth: 507,
    width: 507,
    config: { ulm_card_media_player_with_controls_name: "Sonos" },
  },
  {
    id: "more-power-outlet",
    entity: "switch.outlet",
    width: 248,
    config: {
      power_entity: "sensor.power",
      energy_entity: "sensor.energy",
      time_entity: "sensor.outlet_time",
    },
  },
  {
    id: "mpse-gauge",
    entity: "sensor.humidity",
    reference: "custom_gauge.png",
    referenceCrop: { width: 197, height: 145, scale: 0.5 },
    width: 197,
    config: { minimum: 0, maximum: 100 },
  },
  {
    id: "mpse-printer",
    entity: "sensor.printer_status",
    reference: "custom_printer.png",
    referenceWidth: 256,
    width: 256,
    theme: "dark",
    config: {
      ulm_card_printer_name: "HP Color Laser MFP 178nw",
      black_entity: "sensor.toner_black",
      yellow_entity: "sensor.toner_yellow",
      magenta_entity: "sensor.toner_magenta",
      cyan_entity: "sensor.toner_cyan",
    },
  },
  {
    id: "mpse-thermostat",
    entity: "climate.office_cool",
    reference: "custom_thermostat.png",
    referenceWidth: 246,
    width: 246,
  },
  { id: "mpse-wifisignal", entity: "sensor.signal", reference: "custom_wifisignal.png" },
  { id: "nas", entity: "sensor.nas", reference: "custom_card_nas.png" },
  { id: "neekster-update", entity: "update.addon", reference: "custom_card_neekster_update.png", config: { ulm_custom_card_neekster_update_enable_controls: true } },
  { id: "nik-clock", entity: "sensor.time", reference: "custom_card_nik_clock.png" },
  { id: "nik-door", entity: "binary_sensor.front_door", reference: "custom_card_nik_door.png", config: { lock_entity: "lock.front_door", battery_entity: "sensor.lock_battery" } },
  { id: "nik-nas", entity: "binary_sensor.hn_nas_status", reference: "custom_card_nik_nas_on.png", width: 510, config: { disk_entity: "sensor.hn_nas_disk", temperature_entity: "sensor.hn_nas_temperature", memory_entity: "sensor.hn_nas_memory", cpu_entity: "sensor.hn_nas_cpu" } },
  { id: "nik-nas", key: "nik-nas-responsive", title: "custom_card_nik_nas — 330px responsive", entity: "binary_sensor.hn_nas_status", width: 330, config: { disk_entity: "sensor.hn_nas_disk", temperature_entity: "sensor.hn_nas_temperature", memory_entity: "sensor.hn_nas_memory", cpu_entity: "sensor.hn_nas_cpu" } },
  { id: "nik-tablet", entity: "binary_sensor.bram_tablet_status", reference: "custom_card_nik_tablet_1.png", width: 390, config: {
    tablet_button_usb_entity: "switch.bram_tablet_usb",
    tablet_button_motion_entity: "switch.bram_tablet_motion",
    tablet_button_display_entity: "switch.bram_tablet_display",
    tablet_restart_entity: "button.bram_tablet_restart",
    tablet_maintenance_entity: "switch.bram_tablet_maintenance",
    tablet_reload_entity: "button.bram_tablet_reload",
    tablet_ram_entity: "sensor.bram_tablet_ram",
    tablet_disk_entity: "sensor.bram_tablet_disk",
    tablet_power_entity: "binary_sensor.bram_tablet_power",
    battery_entity: "sensor.bram_tablet_battery",
  } },
  { id: "nik-tablet", key: "nik-tablet-partial", title: "custom_card_nik_tablet — Power and Battery only", entity: "binary_sensor.bram_tablet_status", width: 330, config: {
    tablet_power_entity: "binary_sensor.bram_tablet_power",
    battery_entity: "sensor.bram_tablet_battery",
  } },
  { id: "paddy-dwd-pollen", entity: "sensor.pollen" },
  { id: "paddy-waste-collection", entity: "sensor.waste" },
  { id: "paddy-welcome", entity: "person.joris", config: { name: "Joris", ulm_weather: "weather.home" } },
  { id: "person-chip", entity: "person.joris", config: { use_entity_picture: true } },
  { id: "person-info", entity: "person.joris", reference: "custom_card_person_info.png", width: 165, referenceCrop: { width: 165, height: 105 }, theme: "dark", config: {
    ulm_card_person_use_entity_picture: true,
    ulm_card_person_battery_entity: "sensor.person_full_battery",
    ulm_card_person_battery_state_entity: "sensor.phone_battery_state",
    ulm_card_person_commute_entity: "sensor.person_full_commute",
    ulm_card_person_driving_entity: "binary_sensor.joris_driving_full",
    ulm_multiline: true,
    hold_action: { action: "more-info", entity: "sensor.person_full_battery" },
  } },
  { id: "person-info-small", entity: "person.joris", reference: "custom_card_person_info_small_light.png", width: 155, referenceCrop: { width: 155, height: 112 }, config: {
    ulm_card_person_use_entity_picture: true,
    ulm_card_person_battery_entity: "sensor.person_small_battery",
    ulm_card_person_battery_state_entity: "sensor.person_small_battery_state",
    ulm_card_person_driving_entity: "binary_sensor.joris_driving",
    ulm_card_person_zone1: "zone.work",
    ulm_card_person_zone2: "zone.school",
    ulm_address: "sensor.joris_address",
    hold_action: { action: "more-info", entity: "sensor.phone_battery" },
  } },
  { id: "playstation", entity: "media_player.console", config: { console_platform: "xbox" } },
  { id: "qubino", entity: "switch.heater", config: { entities: ["sensor.power"] } },
  { id: "ristou-person", entity: "person.joris", reference: "custom_card_ristou_person/custom_card_ristou_person_light.png" },
  { id: "saxel-fan", entity: "fan.bedroom", reference: "custom_fan_light_theme.png" },
  { id: "scenes", entity: "scene.relax", reference: "card_scenes.png", config: { entities: ["scene.relax", "light.lamp", "switch.outlet", "fan.bedroom"] } },
  { id: "schumijo-car", entity: "sensor.range", reference: "car.png", config: { entities: ["sensor.fuel", "sensor.range", "lock.front_door"] } },
  { id: "schumijo-flower", entity: "sensor.moisture", reference: "flower.png", config: { entities: ["sensor.moisture", "sensor.signal", "sensor.room_temperature", "sensor.power"] } },
  { id: "senoro-win", entity: "binary_sensor.window", reference: "senoro_win_card.png", config: { entities: ["sensor.battery"] } },
  { id: "sisimomo-printer", entity: "sensor.toner_black", reference: "custom_card_sisimomo_printer.png", config: { entities: ["sensor.toner_black", "sensor.toner_cyan", "sensor.toner_magenta", "sensor.toner_yellow"] } },
  { id: "speedtest-shogun160", entity: "sensor.download", config: { entities: ["sensor.upload", "sensor.ping"] } },
  { id: "tpx01-aircondition", entity: "climate.living" },
  { id: "vncntdev-device-tracer", entity: "device_tracker.phone", reference: "custom_device_tracer.jpg", config: { entities: ["sensor.phone_battery", "device_tracker.gps"] } },
  { id: "water-heater", entity: "water_heater.boiler" },
  { id: "wilbiev-title", entity: "sensor.power", reference: "custom_card_wilbiev_title.png", config: { name: "Living room" } },
  { id: "wilbiev-subtitle", entity: "sensor.power", reference: "custom_card_wilbiev_subtitle.png", config: { name: "Lights" } },
  { id: "wsly-pollen", entity: "sensor.pollen", reference: "custom_card_wsly_pollen_light.png", config: { entities: ["sensor.pollen", "sensor.humidity"] } },
  { id: "yagrasdemonde-lights-count", entity: "sensor.entities", reference: "screenshot_light_count_lights.png", config: { ulm_custom_card_yagrasdemonde_lights_count_type: "light" } },
];

const container = document.querySelector("#comparisons")!;
for (const fixture of fixtures) {
  const tag = `mushroom-addition-custom-card-${fixture.id}`;
  const section = document.createElement("section");
  section.className = "comparison";
  section.dataset.source = fixture.key ?? fixture.id;
  const referenceStyle = fixture.referenceCrop
    ? ` style="width:${fixture.referenceCrop.width}px;height:${fixture.referenceCrop.height}px"`
    : "";
  const reference = fixture.reference
    ? fixture.referenceCrop
      ? `<div class="reference-crop"${referenceStyle}><img class="reference reference-natural" src="/.tmp-ui-minimalist/docs/assets/img/${fixture.reference}" alt=""></div>`
      : `<img class="reference" src="/.tmp-ui-minimalist/docs/assets/img/${fixture.reference}" alt="">`
    : `<div class="no-reference">No dedicated upstream screenshot</div>`;
  section.innerHTML = `<h2>${fixture.title ?? `custom_card_${fixture.id.replaceAll("-", "_")}`}</h2><div class="columns"><div><div class="column-label">Upstream reference</div>${reference}</div><div><div class="column-label">Rendered implementation</div><div class="implementation ${fixture.theme === "dark" ? "dark-theme" : ""}"${fixture.width ? ` style="width:${fixture.width}px;max-width:${fixture.width}px"` : ""}></div></div></div>`;
  const element = document.createElement(tag) as HTMLElement & { hass: HomeAssistant; setConfig(config: AdditionConfig): void };
  element.hass = hass;
  element.setConfig({
    type: `custom:${tag}`,
    entity: fixture.entity,
    show_icon: true,
    show_state: true,
    show_controls: true,
    primary_info: "name",
    secondary_info: "default",
    ...fixture.config,
  });
  section.querySelector(".implementation")!.append(element);
  container.append(section);
}
