import type { AdditionConfig, HomeAssistant } from "./types";

export type ConsolePlatform = "auto" | "xbox" | "playstation" | "nintendo";

interface ConsoleEntityDefinition {
  configKey: string;
  domains: string[];
  terms: string[];
}

export const CONSOLE_ENTITIES: readonly ConsoleEntityDefinition[] = [
  { configKey: "followers_entity", domains: ["sensor"], terms: ["follower", "followers"] },
  { configKey: "following_entity", domains: ["sensor"], terms: ["following"] },
  { configKey: "friends_entity", domains: ["sensor"], terms: ["friends"] },
  { configKey: "primary_stat_entity", domains: ["sensor"], terms: ["gamer_score", "gamerscore", "score"] },
  { configKey: "secondary_stat_entity", domains: ["sensor"], terms: ["ranking", "rank"] },
  { configKey: "now_playing_entity", domains: ["sensor"], terms: ["now_playing", "current_game"] },
  { configKey: "gamerpic_entity", domains: ["image"], terms: ["gamerpic", "avatar", "profile"] },
  {
    configKey: "artwork_entity",
    domains: ["image"],
    terms: ["now_playing", "titled_hero_art", "superhero_art", "branded_key_art", "poster", "box_art"],
  },
  { configKey: "console_power_entity", domains: ["remote", "media_player", "switch"], terms: ["console", "xbox", "playstation", "ps4", "ps5", "nintendo"] },
] as const;

const objectId = (entityId: string): string => entityId.split(".", 2)[1] ?? entityId;
const normalized = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]+/g, "_");

const matchesDefinition = (
  hass: HomeAssistant | undefined,
  entityId: string,
  definition: ConsoleEntityDefinition,
): boolean => {
  const domain = entityId.split(".", 1)[0];
  if (!definition.domains.includes(domain)) return false;
  const state = hass?.states[entityId];
  const text = normalized([
    objectId(entityId),
    state?.attributes.friendly_name,
  ].filter(Boolean).join(" "));
  return definition.terms.some((term) => text.includes(term));
};

export const resolveConsoleEntities = (
  hass: HomeAssistant | undefined,
  primaryEntityId: string | undefined,
  config?: AdditionConfig,
): Record<string, string> => {
  if (!hass || !primaryEntityId) return {};
  const primaryDeviceId = hass.entities?.[primaryEntityId]?.device_id;
  const primaryObjectId = objectId(primaryEntityId);
  const prefix = primaryObjectId.split(/_(?:console|status|online|power)$/)[0];
  const candidates = Object.keys(hass.states).filter((entityId) => {
    const sameDevice = primaryDeviceId && hass.entities?.[entityId]?.device_id === primaryDeviceId;
    const id = objectId(entityId);
    return sameDevice || id === prefix || id.startsWith(`${prefix}_`);
  });

  return Object.fromEntries(CONSOLE_ENTITIES.flatMap((definition) => {
    const configured = config?.[definition.configKey];
    if (typeof configured === "string" && configured.length > 0) {
      return [[definition.configKey, configured]];
    }
    const discovered = candidates.find((entityId) => matchesDefinition(hass, entityId, definition));
    return discovered ? [[definition.configKey, discovered]] : [];
  }));
};

export const inferConsolePlatform = (
  hass: HomeAssistant | undefined,
  primaryEntityId: string | undefined,
  config?: AdditionConfig,
): Exclude<ConsolePlatform, "auto"> | "generic" => {
  const configured = config?.console_platform;
  if (configured === "xbox" || configured === "playstation" || configured === "nintendo") return configured;
  const primary = primaryEntityId ? hass?.states[primaryEntityId] : undefined;
  const text = normalized([
    primaryEntityId,
    primary?.attributes.friendly_name,
    primaryEntityId ? hass?.entities?.[primaryEntityId]?.platform : undefined,
  ].filter(Boolean).join(" "));
  if (text.includes("xbox") || text.includes("gamer")) return "xbox";
  if (text.includes("playstation") || /(?:^|_)ps[345](?:_|$)/.test(text)) return "playstation";
  if (text.includes("nintendo") || text.includes("switch")) return "nintendo";
  return "generic";
};

export const consolePlatformPresentation = (
  platform: ReturnType<typeof inferConsolePlatform>,
): { icon: string; tone: string } => {
  switch (platform) {
    case "xbox": return { icon: "mdi:microsoft-xbox", tone: "green" };
    case "playstation": return { icon: "mdi:sony-playstation", tone: "blue" };
    case "nintendo": return { icon: "mdi:nintendo-switch", tone: "red" };
    default: return { icon: "mdi:controller-classic", tone: "purple" };
  }
};
