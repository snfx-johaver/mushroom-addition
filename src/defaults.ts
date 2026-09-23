import { PARITY_BY_ID } from "./parity.generated";
import type { AdditionConfig, CatalogItem, HassEntity, HomeAssistant } from "./types";
import { supportedUpstreamOption } from "./supported-options";
import { defaultWasteStreams } from "./waste-streams";

const defaultIcons: Array<[RegExp, string]> = [
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
  return {
    type: `custom:${item.tag}`,
    ...upstreamDefaultsFor(item),
    entity: entityId,
    waste_streams: item.upstreamId === "custom_card_afvalophaling" ? defaultWasteStreams() : undefined,
    name: entity?.attributes.friendly_name,
    icon: defaultIconFor(item, entity),
    show_icon: true,
    show_state: true,
    layout: "horizontal",
  };
};
