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
      process.cwd(), "docs", "assets", "visual-audit", "final-pollen-lights-live-certification.json",
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
    for (const sourceId of ["custom_card_wsly_pollen", "custom_card_yagrasdemonde_lights_count"]) {
      expect(evidence.sources[sourceId]).toMatchObject({
        geometry: { width: 330, clientWidth: 330, scrollWidth: 330 },
        pickerRegistered: true,
        serviceCalls: [],
        liveAccepted: true,
      });
      expect(evidence.sources[sourceId].editorFields).toContain("entity");
    }
    expect(evidence.result).toEqual({
      accepted: 2,
      overflowFailures: 0,
      pickerFailures: 0,
      editorFailures: 0,
      interactionFailures: 0,
    });
  });

  it("records matched-width local geometry and exact payloads separately from live evidence", () => {
    const evidence = JSON.parse(readFileSync(join(
      process.cwd(), "docs", "assets", "visual-audit", "final-pollen-lights-local-certification.json",
    ), "utf8")) as {
      liveAccepted: boolean;
      geometry: Record<string, { referenceWidth: number; implementationWidth: number; regions: Record<string, number> }>;
      interactions: Record<string, { serviceCalls: unknown[]; cardActions: unknown[] }>;
    };
    expect(evidence.liveAccepted).toBe(false);
    expect(evidence.geometry.custom_card_wsly_pollen).toMatchObject({
      referenceWidth: 368,
      implementationWidth: 368,
      regions: { ".pollen-item": 3, ".pollen-extreme": 1 },
    });
    expect(evidence.geometry.custom_card_yagrasdemonde_lights_count).toMatchObject({
      referenceWidth: 486,
      implementationWidth: 486,
      regions: { ".lights-count-icon": 1, ".lights-count-name": 1 },
    });
    expect(evidence.interactions.custom_card_wsly_pollen.serviceCalls).toEqual([]);
    expect(evidence.interactions.custom_card_wsly_pollen.cardActions).toHaveLength(3);
    expect(evidence.interactions.custom_card_yagrasdemonde_lights_count).toMatchObject({
      serviceCalls: [],
      cardActions: [{
        action: "tap",
        config: {
          type: "custom:mushroom-addition-custom-card-yagrasdemonde-lights-count",
          entity: "sensor.number_of_lights_on",
          tap_action: { action: "none" },
        },
      }],
    });
  });

  it("uses the prepared live mappings in picker defaults without touching unrelated sources", () => {
    const entityIds = Object.keys(states);
    const pollenItem = descriptor("custom_card_wsly_pollen");
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

    const lightsItem = descriptor("custom_card_yagrasdemonde_lights_count");
    const lightsConstructor = customElements.get(lightsItem.tag) as typeof HTMLElement & {
      getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
    };
    expect(lightsConstructor.getStubConfig(hass(), entityIds, [])).toMatchObject({
      type: `custom:${lightsItem.tag}`,
      entity: "sensor.number_of_lights_on",
      ulm_custom_card_yagrasdemonde_lights_count_type: "light",
      ulm_custom_card_yagrasdemonde_lights_count_icon_off: "mdi:lightbulb-outline",
      ulm_custom_card_yagrasdemonde_lights_count_color: "yellow",
      ulm_custom_card_yagrasdemonde_lights_count_force_background_color: false,
      tap_action: { action: "none" },
      show_state: false,
    });
  });

  it("exposes dedicated semantic editor fields and round-trips each config", async () => {
    expect(editorSchemaFor(descriptor("custom_card_wsly_pollen")).map(({ name }) => name))
      .toEqual(expect.arrayContaining([
        "entity",
        "trees_entity",
        "custom_card_wsly_pollen_tree_name",
        "custom_card_wsly_pollen_tree_icon",
        "grass_entity",
        "custom_card_wsly_pollen_grass_name",
        "custom_card_wsly_pollen_grass_icon",
        "weeds_entity",
        "custom_card_wsly_pollen_weed_name",
        "custom_card_wsly_pollen_weed_icon",
      ]));
    expect(editorSchemaFor(descriptor("custom_card_yagrasdemonde_lights_count")).map(({ name }) => name))
      .toEqual(expect.arrayContaining([
        "entity",
        "ulm_custom_card_yagrasdemonde_lights_count_type",
        "ulm_custom_card_yagrasdemonde_lights_count_icon_on",
        "ulm_custom_card_yagrasdemonde_lights_count_icon_off",
        "ulm_custom_card_yagrasdemonde_lights_count_color",
        "ulm_custom_card_yagrasdemonde_lights_count_force_background_color",
      ]));

    for (const sourceId of ["custom_card_wsly_pollen", "custom_card_yagrasdemonde_lights_count"]) {
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
      type: "custom:mushroom-addition-custom-card-wsly-pollen",
      custom_card_wsly_pollen_tree: "sensor.kleenex_pollen_radar_home_trees",
      custom_card_wsly_pollen_grass: { entity_id: "sensor.kleenex_pollen_radar_home_grass" },
      custom_card_wsly_pollen_weed: "sensor.kleenex_pollen_radar_home_weeds",
    })).toMatchObject({
      trees_entity: "sensor.kleenex_pollen_radar_home_trees",
      grass_entity: "sensor.kleenex_pollen_radar_home_grass",
      weeds_entity: "sensor.kleenex_pollen_radar_home_weeds",
      tap_action: { action: "none" },
    });
  });

  it("renders all upstream pollen states, overrides, and exact per-item more-info payloads", async () => {
    const card = await render("custom_card_wsly_pollen", {
      trees_entity: "sensor.kleenex_pollen_radar_home_trees",
      grass_entity: "sensor.kleenex_pollen_radar_home_grass",
      weeds_entity: "sensor.kleenex_pollen_radar_home_weeds",
      custom_card_wsly_pollen_tree_name: "Trees",
      custom_card_wsly_pollen_grass_icon: "mdi:sprout",
    });
    expect([...card.shadowRoot.querySelectorAll(".pollen-item b")].map((node) => node.textContent))
      .toEqual(["Trees", "Grass pollen", "Weed pollen"]);
    expect([...card.shadowRoot.querySelectorAll(".pollen-item small")].map((node) => node.textContent))
      .toEqual(["Very low", "Medium", "Very high"]);
    expect(card.shadowRoot.querySelector(".pollen-extreme")).not.toBeNull();
    expect((card.shadowRoot.querySelectorAll(".pollen-item ha-icon")[1] as HTMLElement & { icon: string }).icon)
      .toBe("mdi:sprout");

    const actions = vi.fn();
    card.addEventListener("hass-action", actions);
    [...card.shadowRoot.querySelectorAll<HTMLButtonElement>(".pollen-item")].forEach((button) => button.click());
    expect(actions.mock.calls.map(([event]) => (event as CustomEvent).detail)).toEqual([
      {
        config: {
          type: "custom:mushroom-addition-custom-card-wsly-pollen",
          entity: "sensor.kleenex_pollen_radar_home_trees",
          tap_action: { action: "more-info" },
        },
        action: "tap",
      },
      {
        config: {
          type: "custom:mushroom-addition-custom-card-wsly-pollen",
          entity: "sensor.kleenex_pollen_radar_home_grass",
          tap_action: { action: "more-info" },
        },
        action: "tap",
      },
      {
        config: {
          type: "custom:mushroom-addition-custom-card-wsly-pollen",
          entity: "sensor.kleenex_pollen_radar_home_weeds",
          tap_action: { action: "more-info" },
        },
        action: "tap",
      },
    ]);
  });

  it("matches zero, one, many, cover, unavailable, icon, color, and no-action count semantics", async () => {
    const sourceId = "custom_card_yagrasdemonde_lights_count";
    const zero = await render(sourceId, { entity: "sensor.number_of_lights_on" });
    zero.hass = {
      ...hass(),
      states: {
        ...states,
        "sensor.number_of_lights_on": { ...states["sensor.number_of_lights_on"], state: "0" },
      },
    };
    await zero.updateComplete;
    expect(zero.shadowRoot.textContent).toContain("No lights on");
    expect((zero.shadowRoot.querySelector(".lights-count-icon ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:lightbulb-outline");
    zero.remove();

    const one = await render(sourceId, {
      entity: "sensor.number_of_lights_on",
      ulm_custom_card_yagrasdemonde_lights_count_light_1: "Exactly one light",
    });
    one.hass = {
      ...hass(),
      states: {
        ...states,
        "sensor.number_of_lights_on": { ...states["sensor.number_of_lights_on"], state: "1" },
      },
    };
    await one.updateComplete;
    expect(one.shadowRoot.textContent).toContain("Exactly one light");
    one.remove();

    const many = await render(sourceId, {
      entity: "sensor.number_of_lights_on",
      ulm_custom_card_yagrasdemonde_lights_count_color: "red",
      ulm_custom_card_yagrasdemonde_lights_count_force_background_color: true,
    });
    expect(many.shadowRoot.textContent).toContain("4 lights on");
    expect(many.shadowRoot.querySelector(".custom-lights-count.force-background")).not.toBeNull();
    expect(many.shadowRoot.querySelector(".lights-count-content")?.getAttribute("style")).toContain("--ulm-red");
    const actions = vi.fn();
    many.addEventListener("hass-action", actions);
    many.shadowRoot.querySelector<HTMLElement>(".action-surface")!.click();
    expect((actions.mock.calls[0][0] as CustomEvent).detail).toEqual({
      config: expect.objectContaining({
        entity: "sensor.number_of_lights_on",
        tap_action: { action: "none" },
      }),
      action: "tap",
    });
    many.remove();

    const cover = await render(sourceId, {
      entity: "sensor.number_of_lights_on",
      ulm_custom_card_yagrasdemonde_lights_count_type: "cover",
      ulm_custom_card_yagrasdemonde_lights_count_cover_many: "shutters open",
      ulm_custom_card_yagrasdemonde_lights_count_icon_on: "mdi:window-shutter-open",
    });
    expect(cover.shadowRoot.textContent).toContain("4 shutters open");
    expect((cover.shadowRoot.querySelector(".lights-count-icon ha-icon") as HTMLElement & { icon: string }).icon)
      .toBe("mdi:window-shutter-open");
    cover.remove();

    const unavailable = await render(sourceId, { entity: "sensor.number_of_lights_on" });
    unavailable.hass = {
      ...hass(),
      states: {
        ...states,
        "sensor.number_of_lights_on": { ...states["sensor.number_of_lights_on"], state: "unavailable" },
      },
    };
    await unavailable.updateComplete;
    expect(unavailable.shadowRoot.textContent).toContain("Unavailable");
  });
});
