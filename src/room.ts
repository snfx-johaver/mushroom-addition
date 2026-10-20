import type { AdditionItemConfig, HassEntity, HomeAssistant, RoomStatusKind } from "./types";

export const ROOM_STATUS_LIMIT = 4;
export const ROOM_STATUS_KINDS: RoomStatusKind[] = ["window", "door", "motion", "water", "smoke"];

export const roomStatusKind = (entity?: HassEntity): RoomStatusKind => {
  const deviceClass = entity?.attributes.device_class;
  if (deviceClass === "window") return "window";
  if (deviceClass === "door" || deviceClass === "garage_door" || deviceClass === "opening") return "door";
  if (deviceClass === "moisture") return "water";
  if (deviceClass === "smoke" || deviceClass === "fire") return "smoke";
  return "motion";
};

export const roomEntityUnavailable = (entity?: HassEntity): boolean =>
  !entity || ["unknown", "unavailable"].includes(entity.state);

export const roomStatusActive = (entity: HassEntity | undefined, kind: RoomStatusKind): boolean => {
  if (roomEntityUnavailable(entity)) return false;
  const states: Record<RoomStatusKind, string[]> = {
    window: ["on", "open", "opening"],
    door: ["on", "open", "opening"],
    motion: ["on", "motion", "detected", "occupied", "home", "active"],
    water: ["on", "wet", "moisture", "detected", "water", "leak"],
    smoke: ["on", "smoke", "fire", "detected", "alarm"],
  };
  return states[kind].includes(entity!.state.toLowerCase());
};

export const roomStatusIcon = (kind: RoomStatusKind, active: boolean): string => ({
  window: active ? "mdi:window-open-variant" : "mdi:window-closed-variant",
  door: active ? "mdi:door-open" : "mdi:door-closed",
  motion: active ? "mdi:motion-sensor" : "mdi:motion-sensor-off",
  water: active ? "mdi:water-alert" : "mdi:water-check",
  smoke: active ? "mdi:smoke-detector-alert" : "mdi:smoke-detector",
})[kind];

export const roomEntityIcon = (entity?: HassEntity, entityId = ""): string => {
  if (entity?.attributes.icon) return entity.attributes.icon;
  const deviceClass = String(entity?.attributes.device_class ?? "");
  if (["window", "door", "garage_door", "opening", "motion", "occupancy", "presence", "moisture", "smoke", "fire"].includes(deviceClass)) {
    const kind = roomStatusKind(entity);
    return roomStatusIcon(kind, roomStatusActive(entity, kind));
  }
  const classIcons: Record<string, string> = {
    temperature: "mdi:thermometer", humidity: "mdi:water-percent", illuminance: "mdi:brightness-5",
    battery: "mdi:battery", power: "mdi:flash", energy: "mdi:lightning-bolt",
    carbon_monoxide: "mdi:molecule-co", gas: "mdi:gas-cylinder", safety: "mdi:shield-check",
    connectivity: "mdi:wifi", problem: "mdi:alert-circle", vibration: "mdi:vibrate",
  };
  const domainIcons: Record<string, string> = {
    light: "mdi:lightbulb", switch: "mdi:toggle-switch", input_boolean: "mdi:toggle-switch",
    sensor: "mdi:eye", binary_sensor: "mdi:radiobox-marked", cover: "mdi:window-shutter",
    climate: "mdi:thermostat", fan: "mdi:fan", media_player: "mdi:play-circle",
    person: "mdi:account", device_tracker: "mdi:account", lock: "mdi:lock",
    scene: "mdi:palette", script: "mdi:script-text", button: "mdi:gesture-tap-button",
    input_button: "mdi:gesture-tap-button", group: "mdi:lightbulb-group",
    automation: "mdi:robot", input_select: "mdi:form-dropdown",
  };
  return classIcons[deviceClass] ?? domainIcons[(entity?.entity_id ?? entityId).split(".")[0]] ?? "mdi:information-outline";
};

export const roomItemDefaultsFor = (hass?: HomeAssistant, entityId = ""): AdditionItemConfig => {
  const entity = hass?.states[entityId];
  const domain = entityId.split(".")[0];
  const readOnly = ["sensor", "binary_sensor", "person", "device_tracker"].includes(domain);
  return {
    entity: entityId,
    icon: roomEntityIcon(entity, entityId),
    icon_type: entity?.attributes.entity_picture ? "entity-picture" : "icon",
    active_state: domain === "media_player" ? "playing" : domain === "cover" ? "open" :
      domain === "person" || domain === "device_tracker" ? "home" : domain === "lock" ? "unlocked" : "on",
    color: "blue",
    tap_action: { action: readOnly ? "more-info" : "toggle" },
    hold_action: { action: "more-info" },
    double_tap_action: { action: "none" },
  };
};

// Light groups may expose RGB on the group or only on an active member.
export const roomLightRgb = (
  hass: HomeAssistant,
  light?: HassEntity,
  visited = new Set<string>(),
): number[] | undefined => {
  if (!light || light.state !== "on" || visited.has(light.entity_id)) return undefined;
  visited.add(light.entity_id);
  const rgb = light.attributes.rgb_color;
  if (Array.isArray(rgb) && rgb.length === 3 &&
    rgb.every((value) => typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 255)) {
    return rgb;
  }
  const members = light.attributes.entity_id;
  if (!Array.isArray(members)) return undefined;
  for (const id of members) {
    if (typeof id !== "string") continue;
    const color = roomLightRgb(hass, hass.states[id], visited);
    if (color) return color;
  }
  return undefined;
};
