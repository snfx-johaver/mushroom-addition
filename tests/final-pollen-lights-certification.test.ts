import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CATALOG } from "../src/catalog";
import { editorSchemaFor } from "../src/editor-schema";
import { normalizeConfig } from "../src/helpers";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import "../src/index";

const states: HomeAssistant["states"] = {
  "sensor.kleenex_pollen_radar_home_trees": {
    entity_id: "sensor.kleenex_pollen_radar_home_trees",
    state: "very_low",
    attributes: { friendly_name: "Tree pollen", icon: "mdi:tree" },
  },
  "sensor.kleenex_pollen_radar_home_grass": {
    entity_id: "sensor.kleenex_pollen_radar_home_grass",
    state: "medium",
    attributes: { friendly_name: "Grass pollen", icon: "mdi:grass" },
  },
  "sensor.kleenex_pollen_radar_home_weeds": {
    entity_id: "sensor.kleenex_pollen_radar_home_weeds",
    state: "very_high",
    attributes: { friendly_name: "Weed pollen", icon: "mdi:flower-pollen" },
  },
  "sensor.number_of_lights_on": {
    entity_id: "sensor.number_of_lights_on",
    state: "4",
    attributes: { friendly_name: "Lights on", icon: "mdi:lightbulb-on-outline" },
  },
};

const hass = (callService = vi.fn(async () => undefined)): HomeAssistant => ({
  states,
  language: "en",
  localize: (key) => key === "state.default.unavailable" ? "Unavailable" : key,
  callService,
});

interface TestCard extends HTMLElement {
  hass: HomeAssistant;
  setConfig(config: AdditionConfig): void;
  updateComplete: Promise<boolean>;
  shadowRoot: ShadowRoot;
}

const descriptor = (sourceId: string) => CATALOG.find((item) => item.upstreamId === sourceId)!;

const render = async (sourceId: string, config: Omit<AdditionConfig, "type">): Promise<TestCard> => {
  const item = descriptor(sourceId);
  const card = document.createElement(item.tag) as TestCard;
  card.hass = hass();
  card.setConfig({ type: `custom:${item.tag}`, ...config });
  document.body.append(card);
  await card.updateComplete;
  return card;
};

afterEach(() => document.body.replaceChildren());

describe("final pollen and lights certification", () => {
  it("records authenticated live rendering, picker, editor, and interaction evidence", () => {
    const evidence = JSON.parse(readFileSync(join(
      process.cwd(), "tests", "fixtures", "visual", "final-pollen-lights-live-certification.json",
    ), "utf8")) as {
      candidate: { commit: string; sha256: string; resource: string };
      sources: Record<string, {
        geometry: { width: number; clientWidth: number; scrollWidth: number };
        pickerRegistered: boolean;
        editorFields: string[];
        serviceCalls: unknown[];
        liveAccepted: boolean;
      }>;
      result: Record<string, number>;
    };
    expect(evidence.candidate).toMatchObject({
      commit: "6a42f7b4d87525cdc7464f6117cc4c03b2d990d2",
      resource: "/local/community/mushroom-cards-addition/mushroom-cards-addition.js?v=1.6.0-pollen-1d18e109",
      sha256: "1D18E10912363DD3FD172353A3868CCAA1DD46FDC5CBDD02F0CB565154CAFCB7",
    });
    for (const sourceId of ["custom_card_pollen"]) {
      expect(evidence.sources[sourceId]).toMatchObject({
        geometry: { width: 330, clientWidth: 330, scrollWidth: 330 },
        pickerRegistered: true,
        serviceCalls: [],
        liveAccepted: true,
      });
      expect(evidence.sources[sourceId].editorFields).toContain("entity");
    }
    expect(evidence.result).toEqual({
      accepted: 1,
      overflowFailures: 0,
      pickerFailures: 0,
      editorFailures: 0,
      interactionFailures: 0,
    });
  });

  it("records matched-width local geometry and exact payloads separately from live evidence", () => {
    const evidence = JSON.parse(readFileSync(join(
      process.cwd(), "tests", "fixtures", "visual", "final-pollen-lights-local-certification.json",
    ), "utf8")) as {
      liveAccepted: boolean;
      geometry: Record<string, { referenceWidth: number; implementationWidth: number; regions: Record<string, number> }>;
      interactions: Record<string, { serviceCalls: unknown[]; cardActions: unknown[] }>;
    };
    expect(evidence.liveAccepted).toBe(false);
    expect(evidence.geometry.custom_card_pollen).toMatchObject({
      referenceWidth: 368,
      implementationWidth: 368,
      regions: { ".pollen-item": 3, ".pollen-extreme": 1 },
    });
    expect(evidence.interactions.custom_card_pollen.serviceCalls).toEqual([]);
    expect(evidence.interactions.custom_card_pollen.cardActions).toHaveLength(3);
  });

  it("uses the prepared live mappings in picker defaults without touching unrelated sources", () => {
    const entityIds = Object.keys(states);
    const pollenItem = descriptor("custom_card_pollen");
    const pollenConstructor = customElements.get(pollenItem.tag) as typeof HTMLElement & {
      getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
    };
    expect(pollenConstructor.getStubConfig(hass(), entityIds, [])).toMatchObject({
      type: `custom:${pollenItem.tag}`,
      entity: "sensor.kleenex_pollen_radar_home_grass",
      trees_entity: "sensor.kleenex_pollen_radar_home_trees",
      grass_entity: "sensor.kleenex_pollen_radar_home_grass",
      weeds_entity: "sensor.kleenex_pollen_radar_home_weeds",
      tap_action: { action: "none" },
      show_state: false,
    });

  });

  it("exposes dedicated semantic editor fields and round-trips each config", async () => {
    expect(editorSchemaFor(descriptor("custom_card_pollen")).map(({ name }) => name))
      .toEqual(expect.arrayContaining([
        "entity",
        "trees_entity",
        "custom_card_pollen_tree_name",
        "custom_card_pollen_tree_icon",
        "grass_entity",
        "custom_card_pollen_grass_name",
        "custom_card_pollen_grass_icon",
        "weeds_entity",
        "custom_card_pollen_weed_name",
        "custom_card_pollen_weed_icon",
      ]));
    for (const sourceId of ["custom_card_pollen"]) {
      const item = descriptor(sourceId);
      const editor = document.createElement("mushroom-addition-editor") as HTMLElement & {
        hass: HomeAssistant;
        setConfig(config: AdditionConfig): void;
        updateComplete: Promise<boolean>;
        shadowRoot: ShadowRoot;
      };
      editor.hass = hass();
      editor.setConfig({ type: `custom:${item.tag}` });
      document.body.append(editor);
      await editor.updateComplete;
      const form = editor.shadowRoot.querySelector<HTMLElement & { data: AdditionConfig }>("ha-form")!;
      const changed = vi.fn();
      editor.addEventListener("config-changed", changed);
      form.dispatchEvent(new CustomEvent("value-changed", {
        bubbles: true,
        composed: true,
        detail: { value: { ...form.data, name: "Round trip" } },
      }));
      expect(changed).toHaveBeenCalledWith(expect.objectContaining({
        detail: { config: expect.objectContaining({ name: "Round trip" }) },
      }));
      editor.remove();
    }
  });

  it("migrates upstream pollen variables into semantic entity fields", () => {
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-pollen",
      custom_card_pollen_tree: "sensor.kleenex_pollen_radar_home_trees",
      custom_card_pollen_grass: { entity_id: "sensor.kleenex_pollen_radar_home_grass" },
      custom_card_pollen_weed: "sensor.kleenex_pollen_radar_home_weeds",
    })).toMatchObject({
      trees_entity: "sensor.kleenex_pollen_radar_home_trees",
      grass_entity: "sensor.kleenex_pollen_radar_home_grass",
      weeds_entity: "sensor.kleenex_pollen_radar_home_weeds",
      tap_action: { action: "none" },
    });
  });

  it("renders all upstream pollen states, overrides, and exact per-item more-info payloads", async () => {
    const card = await render("custom_card_pollen", {
      trees_entity: "sensor.kleenex_pollen_radar_home_trees",
      grass_entity: "sensor.kleenex_pollen_radar_home_grass",
      weeds_entity: "sensor.kleenex_pollen_radar_home_weeds",
      custom_card_pollen_tree_name: "Trees",
      custom_card_pollen_grass_icon: "mdi:sprout",
    });
    expect([...card.shadowRoot.querySelectorAll(".pollen-item b")].map((node) => node.textContent))
      .toEqual(["Trees", "Grass pollen", "Weed pollen"]);
    expect([...card.shadowRoot.querySelectorAll(".pollen-item small")].map((node) => node.textContent))
      .toEqual(["Very low", "Medium", "Very high"]);
    expect(card.shadowRoot.querySelector(".pollen-extreme")).not.toBeNull();
    expect((card.shadowRoot.querySelectorAll(".pollen-item ha-icon")[1] as HTMLElement & { icon: string }).icon)
      .toBe("mdi:sprout");
    expect(card.shadowRoot.querySelector(".custom-pollen > .pollen-heading")).not.toBeNull();
    expect(card.shadowRoot.querySelectorAll(".custom-pollen > .pollen-item")).toHaveLength(3);

    const actions = vi.fn();
    card.addEventListener("hass-action", actions);
    [...card.shadowRoot.querySelectorAll<HTMLButtonElement>(".pollen-item")].forEach((button) => button.click());
    expect(actions.mock.calls.map(([event]) => (event as CustomEvent).detail)).toEqual([
      {
        config: {
          type: "custom:mushroom-addition-custom-card-pollen",
          entity: "sensor.kleenex_pollen_radar_home_trees",
          tap_action: { action: "more-info" },
        },
        action: "tap",
      },
      {
        config: {
          type: "custom:mushroom-addition-custom-card-pollen",
          entity: "sensor.kleenex_pollen_radar_home_grass",
          tap_action: { action: "more-info" },
        },
        action: "tap",
      },
      {
        config: {
          type: "custom:mushroom-addition-custom-card-pollen",
          entity: "sensor.kleenex_pollen_radar_home_weeds",
          tap_action: { action: "more-info" },
        },
        action: "tap",
      },
    ]);
  });

});
