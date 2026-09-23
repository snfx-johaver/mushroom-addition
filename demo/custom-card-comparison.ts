import "../src/index";
import type { AdditionConfig, HomeAssistant } from "../src/types";

class HaCard extends HTMLElement {}
if (!customElements.get("ha-card")) customElements.define("ha-card", HaCard);
class HaIcon extends HTMLElement {
  public set icon(value: string) {
    this.textContent = value.replace("mdi:", "").split("-").map((part) => part[0]).join("").slice(0, 3).toUpperCase();
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
  "input_boolean.alarm": { entity_id: "input_boolean.alarm", state: "on", attributes: { friendly_name: "Alarm" } },
  "input_datetime.alarm": { entity_id: "input_datetime.alarm", state: "08:30:00", attributes: { friendly_name: "Alarm time", has_time: true } },
  "sensor.download": { entity_id: "sensor.download", state: "273.07", attributes: { friendly_name: "Download", unit_of_measurement: "Mbit/s", history: [190, 220, 280, 260, 245, 272, 270, 276] } },
  "sensor.ping": { entity_id: "sensor.ping", state: "24", attributes: { friendly_name: "Ping", unit_of_measurement: "ms" } },
  "sensor.upload": { entity_id: "sensor.upload", state: "17.19", attributes: { friendly_name: "Upload", unit_of_measurement: "Mbit/s" } },
  "media_player.chromecast": { entity_id: "media_player.chromecast", state: "off", attributes: { friendly_name: "Chromecast" } },
  "sensor.power": { entity_id: "sensor.power", state: "2577.8", attributes: { friendly_name: "Power", unit_of_measurement: "W", history: [120, 100, 95, 110, 1800, 1900, 130, 2500, 160, 2500, 1850] } },
  "device_tracker.phone": { entity_id: "device_tracker.phone", state: "home", attributes: { friendly_name: "OP8" } },
  "device_tracker.phone_ble": { entity_id: "device_tracker.phone_ble", state: "home", attributes: { friendly_name: "OP8 Bluetooth" } },
  "sensor.room_temperature": { entity_id: "sensor.room_temperature", state: "23", attributes: { friendly_name: "Living room", unit_of_measurement: "°C" } },
  "sensor.room_humidity": { entity_id: "sensor.room_humidity", state: "67", attributes: { friendly_name: "Humidity", unit_of_measurement: "%" } },
  "light.room": { entity_id: "light.room", state: "on", attributes: { friendly_name: "Room lights" } },
  "binary_sensor.room_motion": { entity_id: "binary_sensor.room_motion", state: "on", attributes: { friendly_name: "Motion" } },
  "sensor.cat_litter": { entity_id: "sensor.cat_litter", state: "2026-09-21T12:00:00Z", attributes: { friendly_name: "Cat Litter" } },
  "lock.front_door": { entity_id: "lock.front_door", state: "locked", attributes: { friendly_name: "Front Door" } },
  "binary_sensor.front_door": { entity_id: "binary_sensor.front_door", state: "off", attributes: { friendly_name: "Front Door" } },
  "sensor.lock_battery": { entity_id: "sensor.lock_battery", state: "18", attributes: { friendly_name: "Lock battery", unit_of_measurement: "%" } },
  "person.lewis": { entity_id: "person.lewis", state: "home", attributes: { friendly_name: "Lewis" } },
  "switch.washer": { entity_id: "switch.washer", state: "on", attributes: { friendly_name: "Washing machine" } },
  "sensor.washer_job": { entity_id: "sensor.washer_job", state: "Washing", attributes: { friendly_name: "Washer job" } },
  "sensor.washer_progress": { entity_id: "sensor.washer_progress", state: "52", attributes: { friendly_name: "Progress", unit_of_measurement: "%" } },
  "climate.living": { entity_id: "climate.living", state: "heat", attributes: { friendly_name: "Living room", current_temperature: 19, temperature: 21, target_temp_step: .5, hvac_action: "heating" } },
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
  "person.joris": { entity_id: "person.joris", state: "home", attributes: { friendly_name: "Joris" } },
  "sensor.phone_battery": { entity_id: "sensor.phone_battery", state: "72", attributes: { friendly_name: "Phone battery", unit_of_measurement: "%" } },
  "device_tracker.gps": { entity_id: "device_tracker.gps", state: "home", attributes: { friendly_name: "GPS" } },
  "device_tracker.wifi": { entity_id: "device_tracker.wifi", state: "Office Wi-Fi", attributes: { friendly_name: "Wi-Fi" } },
  "input_number.target": { entity_id: "input_number.target", state: "21", attributes: { friendly_name: "Target temperature", unit_of_measurement: "°C" } },
  "sensor.humidity": { entity_id: "sensor.humidity", state: "47", attributes: { friendly_name: "Humidity", unit_of_measurement: "%" } },
  "sensor.entities": { entity_id: "sensor.entities", state: "214", attributes: { friendly_name: "Entities" } },
  "weather.home": { entity_id: "weather.home", state: "partlycloudy", attributes: { friendly_name: "Home", temperature: 18, humidity: 58 } },
  "light.lamp": { entity_id: "light.lamp", state: "on", attributes: { friendly_name: "Desk lamp", brightness: 180 } },
  "media_player.sonos": { entity_id: "media_player.sonos", state: "playing", attributes: { friendly_name: "Sonos", source: "Spotify", volume_level: .42 } },
  "switch.outlet": { entity_id: "switch.outlet", state: "on", attributes: { friendly_name: "Coffee outlet" } },
  "sensor.energy": { entity_id: "sensor.energy", state: "2.8", attributes: { friendly_name: "Energy", unit_of_measurement: "kWh" } },
  "sensor.signal": { entity_id: "sensor.signal", state: "-58", attributes: { friendly_name: "Wi-Fi signal", unit_of_measurement: "dBm" } },
  "sensor.nas": { entity_id: "sensor.nas", state: "37", attributes: { friendly_name: "NAS CPU", unit_of_measurement: "%" } },
  "update.addon": { entity_id: "update.addon", state: "on", attributes: { friendly_name: "Studio Code Server", installed_version: "1.0", latest_version: "1.1" } },
  "sensor.time": { entity_id: "sensor.time", state: "18:48", attributes: { friendly_name: "Time" } },
  "sensor.tablet": { entity_id: "sensor.tablet", state: "76", attributes: { friendly_name: "Wall tablet", unit_of_measurement: "%" } },
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

const fixtures: Array<{ id: string; key?: string; title?: string; entity: string; reference?: string; config?: Partial<AdditionConfig> }> = [
  {
    id: "afvalophaling",
    key: "afvalophaling-full",
    title: "custom_card_afvalophaling — full configured streams",
    entity: "sensor.afvalinfo_home_restafval",
    reference: "ulm_cards/custom_card_afvalophaling_1.png",
    config: {
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
  { id: "apexcharts", entity: "sensor.download", reference: "custom_card_apexcharts_line.png", config: { entities: ["sensor.ping", "sensor.upload"] } },
  { id: "chromecast", entity: "media_player.chromecast", reference: "chromecast.png" },
  { id: "damix48-power-details", entity: "sensor.power", reference: "custom_power_details.png", config: { ulm_card_power_details_hours: 2 } },
  { id: "device-tracker", entity: "device_tracker.phone", reference: "custom_card_device_tracker.png", config: { ulm_custom_card_device_tracker_tracker_1_entity: "device_tracker.phone", ulm_custom_card_device_tracker_tracker_1_type: "wifi", ulm_custom_card_device_tracker_tracker_2_entity: "device_tracker.phone_ble", ulm_custom_card_device_tracker_tracker_2_type: "bluetooth" } },
  { id: "drealine-roomview", entity: "sensor.room_temperature", reference: "custom_card_drealine_roomview_1.png", config: { entities: ["sensor.room_humidity", "light.room", "binary_sensor.room_motion"] } },
  { id: "eraycetinay-elapsed-time", entity: "sensor.cat_litter", reference: "custom_card_eraycetinay_elapsed_time.png" },
  { id: "eraycetinay-lock", entity: "lock.front_door", reference: "custom_card_eraycetinay_lock.png", config: { ulm_custom_card_eraycetinay_lock_door_open: "binary_sensor.front_door", ulm_custom_card_eraycetinay_lock_battery_level: "sensor.lock_battery" } },
  { id: "esh-welcome", entity: "person.lewis", reference: "custom_card_esh_welcome_light.png", config: { name: "Lewis" } },
  { id: "haven-washer", entity: "switch.washer", reference: "custom_card_haven_washer_running.png", config: { ulm_custom_card_washer_job_state: "sensor.washer_job", ulm_custom_card_washer_job_progress: "sensor.washer_progress" } },
  { id: "heat-pump", entity: "climate.living", reference: "Heat_pump.PNG" },
  { id: "homeassistant-updates", entity: "update.core", reference: "ulm_cards/card_homeassistant_updates.png", config: { ulm_card_homeassistant_core: "update.core", ulm_card_homeassistant_supervisor: "update.supervisor", ulm_card_homeassistant_os: "update.operating_system" } },
  { id: "httpedo13-sun", entity: "sun.sun", reference: "sun-card.png" },
  { id: "httpedo13-thermostat", entity: "climate.living", reference: "thermostat_white_with_heating_ui.png" },
  { id: "iabadia-battery-chip", entity: "sensor.battery", reference: "custom_card_iAbadia_battery_chip.png" },
  { id: "imswel-medias", entity: "media_player.plex", reference: "custom_card_imswel_medias/medias_library_plex.png", config: { ulm_custom_card_imswel_medias_platform: "plex" } },
  { id: "imswel-person", entity: "person.joris", reference: "custom_card_imswel_person.gif", config: { battery_entity: "sensor.phone_battery", ulm_card_imswel_person_gps_tracker: "device_tracker.gps", ulm_card_imswel_person_wifi_tracker: "device_tracker.wifi" } },
  { id: "input-datetime", entity: "input_datetime.alarm", reference: "card_input_datetime.png" },
  { id: "input-number", entity: "input_number.target", reference: "card_input_number.png" },
  { id: "irmajavi-entities", entity: "sensor.entities", reference: "screenshot_irmajavi_entities_card.jpg", config: { entities: ["sensor.power", "sensor.battery", "light.lamp", "binary_sensor.window"] } },
  { id: "irmajavi-speedtest", entity: "sensor.download", reference: "screenshot_irmajavi_speedtest_card.jpg", config: { entities: ["sensor.upload", "sensor.ping"] } },
  { id: "irmajavi-weather", entity: "weather.home", reference: "screenshot_irmajavi_weather_card.jpg", config: { temperature_entity: "sensor.room_temperature", entities: ["sensor.humidity", "sensor.signal", "sensor.power", "sensor.battery"] } },
  { id: "light-colorpick", entity: "light.lamp", config: { ulm_card_light_colorpick_transition: 1 } },
  { id: "media-player-sonos", entity: "media_player.sonos", reference: "media_player_sonos.png" },
  { id: "more-power-outlet", entity: "switch.outlet", config: { graph_entity: "sensor.power", entities: ["sensor.energy"] } },
  { id: "mpse-gauge", entity: "sensor.nas", reference: "custom_gauge.png" },
  { id: "mpse-printer", entity: "sensor.toner_black", reference: "custom_printer.png", config: { entities: ["sensor.toner_black", "sensor.toner_yellow", "sensor.toner_magenta", "sensor.toner_cyan"] } },
  { id: "mpse-thermostat", entity: "climate.living", reference: "custom_thermostat.png" },
  { id: "mpse-wifisignal", entity: "sensor.signal", reference: "custom_wifisignal.png" },
  { id: "nas", entity: "sensor.nas", reference: "custom_card_nas.png" },
  { id: "neekster-update", entity: "update.addon", reference: "custom_card_neekster_update.png", config: { ulm_custom_card_neekster_update_enable_controls: true } },
  { id: "nik-clock", entity: "sensor.time", reference: "custom_card_nik_clock.png" },
  { id: "nik-door", entity: "binary_sensor.front_door", reference: "custom_card_nik_door.png", config: { lock_entity: "lock.front_door", battery_entity: "sensor.lock_battery" } },
  { id: "nik-nas", entity: "sensor.nas", reference: "custom_card_nik_nas_on.png", config: { entities: ["sensor.nas", "sensor.power", "sensor.humidity"] } },
  { id: "nik-tablet", entity: "sensor.tablet", reference: "custom_card_nik_tablet_1.png", config: { entities: ["sensor.signal", "sensor.battery", "sensor.power", "sensor.humidity", "sensor.room_temperature", "sensor.entities"] } },
  { id: "paddy-dwd-pollen", entity: "sensor.pollen" },
  { id: "paddy-waste-collection", entity: "sensor.waste" },
  { id: "paddy-welcome", entity: "person.joris", config: { name: "Joris", ulm_weather: "weather.home" } },
  { id: "person-chip", entity: "person.joris", config: { use_entity_picture: true } },
  { id: "person-info", entity: "person.joris", reference: "custom_card_person_info.png", config: { entities: ["sensor.phone_battery", "sensor.range", "device_tracker.gps"] } },
  { id: "person-info-small", entity: "person.joris", reference: "custom_card_person_info_small_light.png" },
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
  section.innerHTML = `<h2>${fixture.title ?? `custom_card_${fixture.id.replaceAll("-", "_")}`}</h2><div class="columns"><div><div class="column-label">Upstream reference</div>${fixture.reference ? `<img class="reference" src="/.tmp-ui-minimalist/docs/assets/img/${fixture.reference}" alt="">` : `<div class="no-reference">No dedicated upstream screenshot</div>`}</div><div><div class="column-label">Rendered implementation</div><div class="implementation"></div></div></div>`;
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
