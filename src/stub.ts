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
  const entity = firstMatchingEntity(descriptor, hass, entities, entitiesFallback);
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
  };
};
