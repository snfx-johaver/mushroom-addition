import type { AdditionConfig, CatalogItem, HomeAssistant } from "./types";

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
  if (descriptor.kind === "container") {
    const temperature = firstMatchingEntity(
      { ...descriptor, preferredDomains: ["sensor"] },
      hass,
      entities,
      entitiesFallback,
    );
    const person = firstMatchingEntity(
      { ...descriptor, preferredDomains: ["person", "device_tracker"] },
      hass,
      entities,
      entitiesFallback,
    );
    return {
      type: `custom:${descriptor.tag}`,
      chips: [
        {
          type: "custom:mushroom-addition-chip-temperature",
          entity: temperature,
          name: temperature ? undefined : "Temperature",
          secondary: temperature ? undefined : "21 °C",
        },
        {
          type: "custom:mushroom-addition-chip-presence-detection",
          entity: person,
          name: person ? undefined : "Presence",
          secondary: person ? undefined : "Home",
        },
      ],
    };
  }

  const entity = firstMatchingEntity(descriptor, hass, entities, entitiesFallback);
  const isText = ["text", "navigation"].includes(descriptor.family);
  const gameConsole = descriptor.upstreamId === "custom_card_playstation";
  const defaultVariant = gameConsole && entity?.toLowerCase().includes("xbox")
    ? "xbox"
    : descriptor.variants?.[0];
  return {
    type: `custom:${descriptor.tag}`,
    entity,
    name: entity ? undefined : sampleName(descriptor),
    secondary: entity ? undefined : isText ? "Example" : "Preview",
    icon: descriptor.kind === "chip" ? "mdi:circle-small" : undefined,
    variant: defaultVariant,
    show_icon: true,
    show_state: true,
    entities: descriptor.variants?.includes("with-sensors")
      ? entitiesFallback.slice(0, 2)
      : undefined,
  };
};
