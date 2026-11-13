import { afterEach, describe, expect, it, vi } from "vitest";
import { areaSceneIds, areaSceneItems } from "../src/light-area";
import type { HomeAssistant } from "../src/types";

const makeHass = (): HomeAssistant => ({
  states: {
    "light.office": {
      entity_id: "light.office",
      state: "on",
      attributes: {
        friendly_name: "Office",
        entity_id: ["light.office_desk"],
      },
    },
    "light.office_desk": {
      entity_id: "light.office_desk",
      state: "on",
      attributes: { friendly_name: "Office desk" },
    },
    "scene.office_focus": {
      entity_id: "scene.office_focus",
      state: "scening",
      attributes: { friendly_name: "Office Focus" },
    },
    "sensor.unrelated": {
      entity_id: "sensor.unrelated",
      state: "1",
      attributes: {},
    },
  },
  entities: {
    "light.office": { area_id: "office" },
    "light.office_desk": { area_id: "office" },
    "scene.office_focus": { area_id: "office" },
  },
  devices: {},
  callService: async () => undefined,
});

afterEach(() => vi.restoreAllMocks());

describe("Light Area scene discovery cache", () => {
  it("indexes a states snapshot once across lights and alternating Home Assistant instances", () => {
    const first = makeHass(), second = makeHass();
    const keys = vi.spyOn(Object, "keys");
    const items = areaSceneItems(first, "light.office");
    areaSceneItems(first, "light.office_desk");
    areaSceneItems(second, "light.office");
    expect(areaSceneItems(first, "light.office")).toBe(items);
    expect(keys.mock.calls.filter(([value]) => value === first.states)).toHaveLength(1);
    expect(keys.mock.calls.filter(([value]) => value === second.states)).toHaveLength(1);
  });

  it("isolates registry identities and reuses their previous results without rescanning states", () => {
    const hass = makeHass();
    hass.states["scene.other"] = { entity_id: "scene.other", state: "unknown", attributes: {} };
    const first = areaSceneItems(hass, "light.office");
    const entities = { ...hass.entities, "scene.other": { device_id: "scene-device" } };
    const changed = { ...hass, entities, devices: { "scene-device": { area_id: "office" } } };
    const keys = vi.spyOn(Object, "keys");
    const second = areaSceneItems(changed, "light.office");
    expect(second.map(item => item.entity)).toContain("scene.other");
    expect(first.map(item => item.entity)).not.toContain("scene.other");
    expect(areaSceneItems(hass, "light.office")).toBe(first);
    expect(areaSceneItems(changed, "light.office")).toBe(second);
    expect(areaSceneItems({ ...changed, devices: {} }, "light.office").map(item => item.entity)).not.toContain("scene.other");
    expect(keys.mock.calls.filter(([value]) => value === hass.states)).toHaveLength(0);
  });

  it("reuses discovered scene IDs and rendered items for stable registry identities", () => {
    const hass = makeHass();
    const keys = vi.spyOn(Object, "keys");
    const firstIds = areaSceneIds(hass, "light.office");
    const firstItems = areaSceneItems(hass, "light.office");
    const scans = keys.mock.calls.filter(([value]) => value === hass.states).length;

    expect(areaSceneIds({ ...hass }, "light.office")).toBe(firstIds);
    expect(areaSceneItems({ ...hass }, "light.office")).toBe(firstItems);
    expect(keys.mock.calls.filter(([value]) => value === hass.states)).toHaveLength(scans);
    expect(firstItems).toEqual([
      { entity: "scene.office_focus", name: "Focus", color: "yellow" },
    ]);
  });

  it("caches empty results and invalidates when state or registry identities change", () => {
    const hass = makeHass();
    delete hass.states["scene.office_focus"];
    delete hass.entities!["scene.office_focus"];
    const empty = areaSceneItems(hass, "light.office");
    expect(empty).toEqual([]);
    expect(areaSceneItems({ ...hass }, "light.office")).toBe(empty);

    const changedStates = {
      ...hass.states,
      "scene.office_relax": {
        entity_id: "scene.office_relax",
        state: "scening",
        attributes: { friendly_name: "Office Relax" },
      },
    };
    const changedEntities = {
      ...hass.entities,
      "scene.office_relax": { area_id: "office" },
    };
    expect(areaSceneItems({
      ...hass,
      states: changedStates,
      entities: changedEntities,
    }, "light.office")).toEqual([
      { entity: "scene.office_relax", name: "Relax", color: "yellow" },
    ]);
  });
});
