import { describe, expect, it, vi } from "vitest";
import { CATALOG } from "../src/catalog";
import { createStubConfig } from "../src/stub";
import type { HassEntity, HomeAssistant } from "../src/types";
import * as sonos from "../src/sonos-controls";

const makeHass = (): HomeAssistant => ({
  states: Object.fromEntries([
    ...Array.from({ length: 10_800 }, (_, i): [string, HassEntity] => [
      `sensor.unrelated_${i}`,
      { entity_id: `sensor.unrelated_${i}`, state: "1", attributes: {} },
    ]),
    ...["first", "second", "third"].map((name): [string, HassEntity] => [
      `media_player.sonos_${name}`,
      { entity_id: `media_player.sonos_${name}`, state: "idle", attributes: {} },
    ]),
  ]),
  callService: async () => undefined,
});

describe("picker default discovery", () => {
  it("keeps healthy-first matching, exclusions and preferred entity ordering", () => {
    const item = CATALOG.find(item => item.upstreamId === "card_battery")!;
    const ids = ["sensor.battery_level_charging", "sensor.first_battery_level", "sensor.second_battery_level"];
    const hass: HomeAssistant = {
      states: Object.fromEntries(ids.map((entity_id, i) => [entity_id, {
        entity_id, state: i === 1 ? "unavailable" : "80", attributes: {},
      }])),
      callService: async () => undefined,
    };
    expect(createStubConfig(item, hass, ids).entity).toBe(ids[2]);
    hass.states[ids[1]] = { ...hass.states[ids[1]], state: "60" };
    expect(createStubConfig(item, hass, [ids[2], ids[1]]).entity).toBe(ids[2]);
    expect(createStubConfig(item, hass, [ids[1], ids[2]]).entity).toBe(ids[1]);
    hass.states[ids[1]] = { ...hass.states[ids[1]], state: "unknown" };
    hass.states[ids[2]] = { ...hass.states[ids[2]], state: "unavailable" };
    expect(createStubConfig(item, hass, [ids[2], ids[1]]).entity).toBe(ids[2]);
  });

  it("does not rank Sonos players when building unrelated card defaults", () => {
    const rank = vi.spyOn(sonos, "sonosControlCount");
    try {
      const hass = makeHass();
      for (const item of CATALOG) {
        if (item.upstreamId === "custom_card_media_player_sonos") continue;
        createStubConfig(item, hass);
      }
      expect(rank).not.toHaveBeenCalled();
    } finally {
      rank.mockRestore();
    }
  });

  it("scores each Sonos candidate once, preserving the best choice and first-match ties", () => {
    const rank = vi.spyOn(sonos, "sonosControlCount").mockImplementation((_hass, entityId) =>
      entityId.endsWith("first") ? 1 : 3);
    try {
      const item = CATALOG.find(item => item.upstreamId === "custom_card_media_player_sonos")!;
      const hass = makeHass();
      const stub = createStubConfig(item, hass);
      expect(rank).toHaveBeenCalledTimes(3);
      expect(stub.entity).toBe("media_player.sonos_second");
      rank.mockClear();
      delete hass.states["media_player.sonos_second"];
      expect(createStubConfig(item, hass).entity).toBe("media_player.sonos_third");
      expect(rank).toHaveBeenCalledTimes(2);
    } finally {
      rank.mockRestore();
    }
  });
});
