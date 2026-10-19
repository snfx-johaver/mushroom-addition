import type { AdditionItemConfig, HomeAssistant } from "./types";

const domainIcons: Record<string, string> = {
  automation: "mdi:robot",
  button: "mdi:gesture-tap-button",
  cover: "mdi:window-shutter",
  fan: "mdi:fan",
  input_boolean: "mdi:toggle-switch",
  light: "mdi:lightbulb",
  lock: "mdi:lock",
  media_player: "mdi:play-circle",
  scene: "mdi:palette",
  script: "mdi:script-text",
  switch: "mdi:toggle-switch",
};

export const sceneItemDefaultsFor = (
  hass?: HomeAssistant,
  entityId = "",
): AdditionItemConfig => {
  const entity = entityId ? hass?.states[entityId] : undefined;
  const domain = entityId.split(".", 1)[0];
  return {
    entity: entityId,
    name: entity?.attributes.friendly_name,
    icon: entity?.attributes.icon ?? domainIcons[domain] ?? "mdi:gesture-tap-button",
    icon_type: entity?.attributes.entity_picture ? "entity-picture" : "icon",
    color: "purple",
    active_state: domain === "media_player" ? "playing" :
      ["automation", "binary_sensor", "fan", "input_boolean", "light", "lock", "switch"].includes(domain)
        ? "on"
        : undefined,
    tap_action: { action: "toggle" },
  };
};
