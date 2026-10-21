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
    tap_action: { action: "toggle" },
  };
};

export const roomLightingSceneExample = (
hass?: HomeAssistant, preferredEntity?: string,
): { entity?: string; name?: string; items: AdditionItemConfig[] } => {
if (!hass) return { items: [] };
const normalize = (text: string): string => text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
const areaFor = (id: string): string | undefined => {
  const entry = hass.entities?.[id];
  return entry?.area_id ?? (entry?.device_id ? hass.devices?.[entry.device_id]?.area_id : undefined) ?? undefined;
};
const healthy = Object.values(hass.states).filter(entity => !["unknown", "unavailable"].includes(entity.state.toLowerCase()));
const rooms = new Map<string, { area?: string; name?: string; scenes: string[] }>();
for (const scene of healthy.filter(entity => entity.entity_id.startsWith("scene."))) {
  const group = scene.attributes.group_name;
  const hue = hass.entities?.[scene.entity_id]?.platform === "hue";
  if (hue && scene.attributes.group_type === "zone") continue;
  const rawMembers = scene.attributes.entity_id ?? scene.attributes.entities;
  const members = Array.isArray(rawMembers) ? rawMembers.filter((id): id is string => typeof id === "string")
    : typeof rawMembers === "string" ? rawMembers.split(",").map(id => id.trim())
    : rawMembers && typeof rawMembers === "object" ? Object.keys(rawMembers) : [];
  if (members.some(id => !id.startsWith("light."))) continue;
  const memberAreas = new Set(members.map(areaFor));
  const groupArea = typeof group === "string" ? Object.values(hass.areas ?? {})
    .find(area => normalize(area.name) === normalize(group)) : undefined;
  const area = (members.length && memberAreas.size === 1 ? areaFor(members[0]) : undefined) ?? groupArea?.area_id ??
    (hue && typeof group !== "string" ? areaFor(scene.entity_id) : undefined);
  if (members.length && (memberAreas.size > 1 || memberAreas.has(undefined))) continue;
  if (!members.length && !hue) continue;
  const name = (area ? hass.areas?.[area]?.name : undefined) ?? (hue && typeof group === "string" ? group : undefined);
  const key = area ? `area:${area}` : name ? `group:${normalize(name)}` : undefined;
  if (!key) continue;
  const room = rooms.get(key) ?? { area, name, scenes: [] };
  room.scenes.push(scene.entity_id);
  rooms.set(key, room);
}
const preferredArea = preferredEntity ? areaFor(preferredEntity) : undefined;
const room = [...rooms.values()].sort((a, b) =>
  Number(Boolean(preferredArea && b.area === preferredArea)) - Number(Boolean(preferredArea && a.area === preferredArea)) ||
  Math.min(7, b.scenes.length) - Math.min(7, a.scenes.length))[0];
if (!room) return { items: [] };
const light = healthy.find(entity => entity.entity_id.startsWith("light.") &&
  (room.area ? areaFor(entity.entity_id) === room.area
    : room.name && normalize(entity.attributes.friendly_name ?? "") === normalize(room.name)));
return {
  entity: light?.entity_id ?? room.scenes[0],
  name: room.name,
  items: room.scenes.slice(0, 7).map(entityId => ({
    entity: entityId, name: hass.states[entityId].attributes.friendly_name, color: "primary",
    tap_action: { action: "perform-action", perform_action: "scene.turn_on", target: { entity_id: entityId } },
  })),
};
};
