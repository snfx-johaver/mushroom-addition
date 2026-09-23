import type { AdditionConfig, CatalogItem, HomeAssistant } from "./types";
import { populatedDefaultsFor } from "./defaults";

const firstMatchingEntity = (
  descriptor: CatalogItem,
  hass?: HomeAssistant,
  entities: string[] = [],
  entitiesFallback: string[] = [],
): string | undefined => {
  const available = [...entities, ...entitiesFallback, ...Object.keys(hass?.states ?? {})];
  const unique = [...new Set(available)].filter((entityId) => hass?.states?.[entityId] !== undefined);
  for (const domain of descriptor.preferredDomains ?? []) {
    const found = unique.find((entityId) => entityId.startsWith(`${domain}.`));
    if (found) return found;
  }
  return unique[0];
};

const sampleName = (descriptor: CatalogItem): string =>
  descriptor.name.replace(/ (Card|Chip)$/, "");

export const createStubConfig = (
  descriptor: CatalogItem,
  hass?: HomeAssistant,
  entities: string[] = [],
  entitiesFallback: string[] = [],
): AdditionConfig => {
  const available = [...new Set([...entities, ...entitiesFallback, ...Object.keys(hass?.states ?? {})])]
    .filter((entityId) => hass?.states?.[entityId] !== undefined);
  const findEntity = (domains: string[], terms: string[]): string | undefined =>
    available.find((entityId) =>
      domains.some((domain) => entityId.startsWith(`${domain}.`)) &&
      terms.every((term) => entityId.toLowerCase().includes(term)));
  const findEntityExcluding = (domains: string[], terms: string[], excludedTerms: string[]): string | undefined =>
    available.find((entityId) =>
      domains.some((domain) => entityId.startsWith(`${domain}.`)) &&
      terms.every((term) => entityId.toLowerCase().includes(term)) &&
      excludedTerms.every((term) => !entityId.toLowerCase().includes(term)));
  const semanticPrimary =
    descriptor.upstreamId === "custom_card_nik_tablet"
      ? findEntity(["binary_sensor", "sensor", "switch"], ["tablet"])
      : descriptor.upstreamId === "custom_card_homeassistant_updates"
        ? findEntity(["update", "sensor", "binary_sensor"], ["core"])
        : undefined;
  const entity = semanticPrimary ?? firstMatchingEntity(descriptor, hass, entities, entitiesFallback);
  const isText = ["text", "navigation"].includes(descriptor.family);
  const gameConsole = descriptor.upstreamId === "custom_card_playstation";
  const defaultVariant = gameConsole && entity?.toLowerCase().includes("xbox")
    ? "xbox"
    : descriptor.variants?.[0];
  const entityDomain = entity?.split(".", 1)[0];
  const tapAction = ["light", "switch", "input_boolean", "fan"].includes(entityDomain ?? "")
    ? { action: "toggle" }
    : { action: entity ? "more-info" : "none" };
  return {
    ...populatedDefaultsFor(descriptor, hass, entity),
    name: entity ? hass?.states[entity]?.attributes.friendly_name : sampleName(descriptor),
    secondary: entity ? undefined : isText ? "Example" : "Preview",
    variant: defaultVariant,
    tap_action: tapAction,
    show_controls: ["climate", "media", "cover", "vacuum", "control"].includes(descriptor.family)
      ? true
      : undefined,
    show_forecast: descriptor.family === "weather",
    show_graph: ["battery", "energy", "sensor"].includes(descriptor.family),
    ulm_card_light_enable_slider: descriptor.family === "light" ? true : undefined,
    ulm_card_light_enable_color: descriptor.family === "light" ? true : undefined,
    ulm_custom_card_bar_card_value: descriptor.family === "bar" ? true : undefined,
    entities: descriptor.variants?.includes("with-sensors")
      ? entitiesFallback.slice(0, 2)
      : undefined,
    ...(descriptor.upstreamId === "custom_card_homeassistant_updates"
      ? {
        ulm_card_homeassistant_core: findEntity(["update", "sensor", "binary_sensor"], ["core"]) ?? entity,
        ulm_card_homeassistant_supervisor: findEntity(["update", "sensor", "binary_sensor"], ["supervisor"]),
        ulm_card_homeassistant_os: findEntity(["update", "sensor", "binary_sensor"], ["operating", "system"]) ??
          findEntity(["update", "sensor", "binary_sensor"], ["os"]),
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_nik_tablet"
      ? {
        tablet_button_usb_entity: findEntity(["switch", "input_boolean"], ["tablet", "usb"]),
        tablet_button_motion_entity: findEntity(["switch", "input_boolean"], ["tablet", "motion"]),
        tablet_button_display_entity: findEntity(["light", "switch", "input_boolean"], ["tablet", "display"]),
        tablet_restart_entity: findEntity(["button"], ["tablet", "restart"]),
        tablet_maintenance_entity: findEntity(["switch", "input_boolean"], ["tablet", "maintenance"]),
        tablet_reload_entity: findEntity(["button"], ["tablet", "reload"]),
        tablet_ram_entity: findEntity(["sensor"], ["tablet", "ram"]),
        tablet_disk_entity: findEntity(["sensor"], ["tablet", "disk"]),
        tablet_power_entity: findEntity(["sensor", "binary_sensor", "switch"], ["tablet", "power"]),
        battery_entity: findEntity(["sensor"], ["tablet", "battery"]),
      }
      : {}),
    ...(descriptor.upstreamId === "custom_card_person_info"
      ? {
        ulm_card_person_driving_entity: findEntity(["binary_sensor"], ["person", "driving"]),
        ulm_card_person_battery_entity: findEntityExcluding(["sensor"], ["person", "battery"], ["state"]),
        ulm_card_person_battery_state_entity: findEntity(["sensor", "binary_sensor"], ["person", "battery", "state"]),
      }
      : {}),
  };
};
