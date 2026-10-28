import type { AdditionItemConfig, HomeAssistant } from "./types";

const SCENE_COLORS = [
  "yellow", "light-blue", "red", "cyan", "green", "pink", "light-green", "accent",
  "indigo", "amber", "deep-orange", "orange", "blue", "light-grey",
];

export const lightGroupMembers = (hass: HomeAssistant, lightId?: string): string[] => {
  const members = lightId ? hass.states[lightId]?.attributes.entity_id : undefined;
  return Array.isArray(members) ? members.filter((id): id is string => typeof id === "string") : [];
};

const areaOf = (hass: HomeAssistant, entityId: string): string | undefined => {
  const registry = hass.entities?.[entityId];
  return registry?.area_id ?? (registry?.device_id ? hass.devices?.[registry.device_id]?.area_id : undefined) ?? undefined;
};

const lightAreaId = (hass: HomeAssistant, lightId: string): string | undefined => {
  const own = areaOf(hass, lightId);
  if (own) return own;
  const counts = new Map<string, number>();
  for (const member of lightGroupMembers(hass, lightId)) {
    const area = areaOf(hass, member);
    if (area) counts.set(area, (counts.get(area) ?? 0) + 1);
  }
  return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0];
};

/** Scenes that belong to the area of a light: same area, controlling only the group's lights, or sharing its name prefix. */
export const areaSceneIds = (hass: HomeAssistant, lightId?: string): string[] => {
  if (!lightId) return [];
  const area = lightAreaId(hass, lightId);
  const allowed = new Set([lightId, ...lightGroupMembers(hass, lightId)]);
  const prefix = lightId.split(".")[1] ?? "";
  return Object.keys(hass.states)
    .filter((id) => id.startsWith("scene."))
    .filter((id) => {
      if (area && areaOf(hass, id) === area) return true;
      const targets = hass.states[id].attributes.entity_id;
      if (Array.isArray(targets) && targets.length > 0 && allowed.size > 1 &&
        targets.every((target) => typeof target === "string" && allowed.has(target))) return true;
      return prefix.length > 2 && id.slice("scene.".length).startsWith(`${prefix}_`);
    })
    .sort((a, b) => a.localeCompare(b));
};

const titleCase = (value: string): string =>
  value.replace(/[_-]+/g, " ").trim().replace(/\b\w/g, (letter) => letter.toUpperCase());

export const areaSceneItems = (hass: HomeAssistant, lightId?: string): AdditionItemConfig[] => {
  const lightName = String(hass.states[lightId ?? ""]?.attributes.friendly_name ?? "").trim().toLowerCase();
  const prefix = (lightId?.split(".")[1] ?? "").toLowerCase();
  return areaSceneIds(hass, lightId).map((id, index) => {
    const friendly = String(hass.states[id].attributes.friendly_name ?? titleCase(id.split(".")[1]));
    let name = friendly;
    if (lightName && friendly.toLowerCase().startsWith(`${lightName} `)) name = friendly.slice(lightName.length + 1);
    else if (prefix && id.slice("scene.".length).startsWith(`${prefix}_`)) {
      name = titleCase(id.slice("scene.".length + prefix.length + 1));
    }
    return { entity: id, name: name.trim() || friendly, color: SCENE_COLORS[index % SCENE_COLORS.length] };
  });
};
