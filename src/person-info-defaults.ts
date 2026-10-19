import type { AdditionConfig, HassEntity, HomeAssistant } from "./types";

export const PERSON_INFO_RELATED_FIELDS = [
  "ulm_card_person_zone1",
  "ulm_card_person_zone2",
  "ulm_address",
  "ulm_address_locality",
  "ulm_card_person_driving_entity",
  "ulm_card_person_battery_entity",
  "ulm_card_person_battery_state_entity",
  "ulm_card_person_commute_entity",
  "hold_action",
] as const;

const normalized = (value: unknown): string =>
  String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const tokens = (value: unknown): string[] =>
  normalized(value).split(" ").filter((token) => token.length >= 3);

const healthy = (entity?: HassEntity): boolean =>
  Boolean(entity) && !["unavailable", "unknown"].includes(entity?.state.toLowerCase() ?? "");

export const personInfoDefaultsFor = (
  hass?: HomeAssistant,
  personEntityId?: string,
): Partial<AdditionConfig> => {
  if (!hass || !personEntityId) return {};
  const person = hass.states[personEntityId];
  if (!person) return {};

  const trackerIds = [
    typeof person.attributes.source === "string" ? person.attributes.source : undefined,
    ...(Array.isArray(person.attributes.device_trackers)
      ? person.attributes.device_trackers.filter((value): value is string => typeof value === "string")
      : []),
  ].filter((value): value is string => Boolean(value));
  const identityTokens = [...new Set([
    ...tokens(personEntityId.split(".", 2)[1]),
    ...tokens(person.attributes.friendly_name),
    ...trackerIds.flatMap((entityId) => tokens(entityId.split(".", 2)[1])),
  ])].filter((token) => !["person", "device", "tracker", "sensor", "binary"].includes(token));
  const trackerNames = trackerIds.map((entityId) => normalized(entityId.split(".", 2)[1]));

  const candidates = Object.values(hass.states).filter(healthy);
  const relatedScore = (entity: HassEntity): number => {
    const text = normalized(`${entity.entity_id} ${entity.attributes.friendly_name ?? ""}`);
    const trackerScore = trackerNames.some((tracker) => tracker && text.includes(tracker)) ? 100 : 0;
    return trackerScore + identityTokens.reduce(
      (score, token) => score + (text.split(" ").includes(token) ? 10 : 0),
      0,
    );
  };
  const findRelated = (
    domains: string[],
    matches: (entity: HassEntity, text: string) => boolean,
    preference: (entity: HassEntity, text: string) => number = () => 0,
  ): string | undefined =>
    candidates
      .filter((entity) => domains.includes(entity.entity_id.split(".", 1)[0]))
      .map((entity) => ({
        entity,
        text: normalized(`${entity.entity_id} ${entity.attributes.friendly_name ?? ""}`),
        relation: relatedScore(entity),
      }))
      .filter(({ entity, text, relation }) => relation > 0 && matches(entity, text))
      .sort((left, right) =>
        (right.relation + preference(right.entity, right.text)) -
        (left.relation + preference(left.entity, left.text)))[0]?.entity.entity_id;

  const battery = findRelated(
    ["sensor"],
    (entity, text) =>
      (entity.attributes.device_class === "battery" || (text.includes("battery") && text.includes("level"))) &&
      !/(state|health|temperature|power|voltage|cycle|charger)/.test(text),
    (entity, text) => (entity.attributes.device_class === "battery" ? 30 : 0) + (text.includes("level") ? 20 : 0),
  );
  const batteryState = findRelated(
    ["sensor", "binary_sensor"],
    (_entity, text) =>
      /(battery state|charging state|is charging|charger type|wireless charging|android auto)/.test(text),
    (_entity, text) =>
      text.includes("battery state") ? 30 :
        text.includes("charging state") || text.includes("is charging") ? 25 :
          text.includes("charger type") ? 20 : 10,
  );
  const geocodedLocation = findRelated(
    ["sensor"],
    (entity, text) =>
      /(geocoded location|current address|home address|street address)/.test(text) ||
      typeof entity.attributes.Locality === "string",
    (entity, text) => (text.includes("geocoded location") ? 30 : 0) +
      (typeof entity.attributes.Locality === "string" ? 20 : 0),
  );
  const locality = findRelated(
    ["sensor"],
    (entity, text) =>
      typeof entity.attributes.Locality === "string" || /(locality|city|municipality)/.test(text),
    (entity) => typeof entity.attributes.Locality === "string" ? 30 : 0,
  ) ?? geocodedLocation;
  const driving = findRelated(
    ["binary_sensor"],
    (_entity, text) => /(driving|android auto|automotive)/.test(text),
  );
  const commute = findRelated(
    ["sensor"],
    (_entity, text) => /(commute|travel time|time to work|time to home)/.test(text),
  );
  const zones = candidates
    .filter((entity) => entity.entity_id.startsWith("zone.") && entity.entity_id !== "zone.home")
    .slice(0, 2)
    .map((entity) => entity.entity_id);

  return {
    ulm_card_person_zone1: zones[0],
    ulm_card_person_zone2: zones[1],
    ulm_address: geocodedLocation,
    ulm_address_locality: locality,
    ulm_card_person_driving_entity: driving,
    ulm_card_person_battery_entity: battery,
    ulm_card_person_battery_state_entity: batteryState,
    ulm_card_person_commute_entity: commute,
    icon_type: person.attributes.entity_picture ? "entity-picture" : "icon",
    hold_action: battery ? { action: "more-info", entity: battery } : undefined,
  };
};
