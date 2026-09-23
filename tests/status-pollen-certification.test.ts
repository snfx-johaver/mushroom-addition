import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CATALOG } from "../src/catalog";
import { editorSchemaFor } from "../src/editor-schema";
import { normalizeConfig } from "../src/helpers";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import "../src/index";

const states: HomeAssistant["states"] = {
  "sensor.yvette_mobile_signal_strength_sim_1": {
    entity_id: "sensor.yvette_mobile_signal_strength_sim_1",
    state: "-58",
    attributes: { friendly_name: "Yvette signal", unit_of_measurement: "dBm" },
  },
  "sensor.all_nas_disks_status": {
    entity_id: "sensor.all_nas_disks_status",
    state: "OK",
    attributes: { friendly_name: "All NAS disks status" },
  },
  "update.home_assistant_core_update": {
    entity_id: "update.home_assistant_core_update",
    state: "on",
    attributes: { friendly_name: "Home Assistant Core", installed_version: "2026.8", latest_version: "2026.9" },
  },
  "sensor.time": { entity_id: "sensor.time", state: "22:50", attributes: { friendly_name: "Time" } },
  "sensor.date_time": {
    entity_id: "sensor.date_time",
    state: "Wednesday, September 23, 2026",
    attributes: { friendly_name: "Date and time" },
  },
  "input_boolean.clock_mode": {
    entity_id: "input_boolean.clock_mode",
    state: "off",
    attributes: { friendly_name: "Clock mode" },
  },
  "binary_sensor.all_doors": {
    entity_id: "binary_sensor.all_doors",
    state: "Closed & Locked",
    attributes: { friendly_name: "All doors" },
  },
  "lock.front_door": {
    entity_id: "lock.front_door",
    state: "locked",
    attributes: { friendly_name: "Front door lock" },
  },
  "sensor.front_door_battery": {
    entity_id: "sensor.front_door_battery",
    state: "82",
    attributes: { friendly_name: "Front door battery", unit_of_measurement: "%" },
  },
  "sensor.kleenex_pollen_radar_home_grass": {
    entity_id: "sensor.kleenex_pollen_radar_home_grass",
    state: "high",
    attributes: { friendly_name: "Grass pollen", icon: "mdi:grass" },
  },
  "sensor.kleenex_pollen_radar_home_grass_level": {
    entity_id: "sensor.kleenex_pollen_radar_home_grass_level",
    state: "5",
    attributes: { friendly_name: "Grass pollen level", icon: "mdi:grass" },
  },
};

interface TestCard extends HTMLElement {
  hass: HomeAssistant;
  setConfig(config: AdditionConfig): void;
  updateComplete: Promise<boolean>;
  shadowRoot: ShadowRoot;
}

const item = (sourceId: string) => CATALOG.find((entry) => entry.upstreamId === sourceId)!;
const createHass = (callService = vi.fn(async () => undefined), overrides = states): HomeAssistant => ({
  language: "en",
  states: overrides,
  callService,
});
const renderCard = async (
  sourceId: string,
  config: Omit<AdditionConfig, "type">,
  overrides = states,
  callService = vi.fn(async () => undefined),
): Promise<TestCard> => {
  const descriptor = item(sourceId);
  const card = document.createElement(descriptor.tag) as TestCard;
  card.hass = createHass(callService, overrides);
  card.setConfig({ type: `custom:${descriptor.tag}`, ...config });
  document.body.append(card);
  await card.updateComplete;
  return card;
};

afterEach(() => {
  vi.useRealTimers();
  document.body.replaceChildren();
});

describe("status and pollen custom source certification", () => {
  it("records exact live configs, interactions, artifacts, and live=false", () => {
    const evidence = JSON.parse(readFileSync(
      join(process.cwd(), "docs", "assets", "visual-audit", "status-pollen-local-certification.json"),
      "utf8",
    )) as {
      liveAccepted: boolean;
      sources: Record<string, { liveConfig: Record<string, unknown>; visibleInteractions: unknown[]; artifact: string }>;
    };
    expect(evidence.liveAccepted).toBe(false);
    expect(Object.keys(evidence.sources)).toEqual([
      "custom_card_mpse_wifisignal",
      "custom_card_nas",
      "custom_card_neekster_update",
      "custom_card_nik_clock",
      "custom_card_nik_door",
      "custom_card_paddy_dwd_pollen",
    ]);
    expect(evidence.sources.custom_card_nik_clock.liveConfig).toEqual({
      entity: "sensor.time",
      date_entity: "sensor.date_time",
    });
    expect(evidence.sources.custom_card_paddy_dwd_pollen.liveConfig).toEqual({
      entity: "sensor.kleenex_pollen_radar_home_grass_level",
      level_entity: "sensor.kleenex_pollen_radar_home_grass_level",
    });
    for (const source of Object.values(evidence.sources)) {
      expect(source.visibleInteractions.length).toBeGreaterThan(0);
      expect(source.artifact).toMatch(/-comparison\.png$/);
    }
  });

  it("creates source-specific picker defaults from the requested live mappings", () => {
    const expected = {
      custom_card_mpse_wifisignal: { entity: "sensor.yvette_mobile_signal_strength_sim_1" },
      custom_card_nas: {
        entity: "sensor.all_nas_disks_status",
        ulm_custom_card_nas_sensor: "sensor.all_nas_disks_status",
      },
      custom_card_neekster_update: {
        entity: "update.home_assistant_core_update",
        ulm_card_neekster_update_enable_controls: true,
      },
      custom_card_nik_clock: {
        entity: "sensor.time",
        date_entity: "sensor.date_time",
      },
      custom_card_nik_door: {
        entity: "binary_sensor.all_doors",
      },
      custom_card_paddy_dwd_pollen: {
        entity: "sensor.kleenex_pollen_radar_home_grass_level",
        level_entity: "sensor.kleenex_pollen_radar_home_grass_level",
      },
    };
    for (const [sourceId, config] of Object.entries(expected)) {
      const descriptor = item(sourceId);
      const constructor = customElements.get(descriptor.tag) as typeof HTMLElement & {
        getStubConfig(hass: HomeAssistant, entities: string[], fallback: string[]): AdditionConfig;
      };
      expect(constructor.getStubConfig(createHass(), Object.keys(states), [])).toMatchObject({
        type: `custom:${descriptor.tag}`,
        ...config,
      });
    }
  });

  it.each([
    ["custom_card_mpse_wifisignal", ["entity", "name_mode", "icon"]],
    ["custom_card_nas", ["entity", "ulm_custom_card_nas_text", "ulm_custom_card_nas_unit"]],
    ["custom_card_neekster_update", [
      "entity", "ulm_card_neekster_update_enable_controls", "ulm_card_neekster_update_collapsible",
      "ulm_card_neekster_update_horizontal", "ulm_card_neekster_update_narrow_buttons",
    ]],
    ["custom_card_nik_clock", ["entity", "date_entity", "clock_switch_entity", "ulm_custom_card_nik_clock_switch_enable"]],
    ["custom_card_nik_door", ["entity", "ulm_custom_card_entity_1_name", "lock_entity", "battery_entity"]],
    ["custom_card_paddy_dwd_pollen", [
      "entity", "level_entity", "ulm_custom_card_paddy_dwd_pollen_name",
      "ulm_custom_card_paddy_dwd_pollen_icon", "pollen_language",
    ]],
  ])("exposes a dedicated %s graphical editor", (sourceId, fields) => {
    expect(editorSchemaFor(item(sourceId)).map((field) => field.name))
      .toEqual(expect.arrayContaining(fields));
  });

  it("migrates documented upstream variables to semantic fields and actions", () => {
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-nas",
      ulm_custom_card_nas_sensor: "sensor.all_nas_disks_status",
      ulm_custom_cad_nas_unit: "%",
    })).toMatchObject({
      entity: "sensor.all_nas_disks_status",
    });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-nik-clock",
      entity: "sensor.time",
      ulm_custom_card_nik_clock_switch: "input_boolean.clock_mode",
      ulm_custom_card_nik_clock_switch_enable: true,
    })).toMatchObject({
      clock_switch_entity: "input_boolean.clock_mode",
      tap_action: {
        action: "perform-action",
        perform_action: "input_boolean.toggle",
        target: { entity_id: "input_boolean.clock_mode" },
      },
    });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-nik-door",
      entity: "binary_sensor.all_doors",
      ulm_custom_card_entity_1_name: "Doors",
      ulm_custom_card_entity_1_lock: "lock.front_door",
      ulm_custom_card_entity_1_lock_battery: "sensor.front_door_battery",
    })).toMatchObject({
      name: "Doors",
      lock_entity: "lock.front_door",
      battery_entity: "sensor.front_door_battery",
    });
    expect(normalizeConfig({
      type: "custom:mushroom-addition-custom-card-paddy-dwd-pollen",
      entity: "sensor.kleenex_pollen_radar_home_grass_level",
      ulm_custom_card_paddy_dwd_pollen_name: "Grass",
      ulm_custom_card_paddy_dwd_pollen_icon: "mdi:grass",
    })).toMatchObject({
      name: "Grass",
      icon: "mdi:grass",
    });
  });

  it.each([
    [-49, "mdi:wifi-strength-4"],
    [-55, "mdi:wifi-strength-3"],
    [-65, "mdi:wifi-strength-2"],
    [-75, "mdi:wifi-strength-1"],
    [-85, "mdi:wifi-strength-off"],
  ])("renders Wi-Fi threshold %s with %s", async (signal, icon) => {
    const card = await renderCard("custom_card_mpse_wifisignal", {
      entity: "sensor.yvette_mobile_signal_strength_sim_1",
    }, {
      ...states,
      "sensor.yvette_mobile_signal_strength_sim_1": {
        ...states["sensor.yvette_mobile_signal_strength_sim_1"],
        state: String(signal),
      },
    });
    expect((card.shadowRoot.querySelector(".ulm-icon ha-icon") as HTMLElement & { icon: string }).icon).toBe(icon);
    expect(card.shadowRoot.textContent).toContain(`${signal} dBm`);
  });

  it("renders NAS, update, clock, door, and all pollen source states", async () => {
    const nas = await renderCard("custom_card_nas", {
      entity: "sensor.all_nas_disks_status",
      ulm_custom_card_nas_text: "NAS status",
      ulm_custom_card_nas_unit: "",
    });
    expect(nas.shadowRoot.textContent).toContain("Nas");
    expect(nas.shadowRoot.textContent).toContain("NAS status OK");
    nas.remove();

    const update = await renderCard("custom_card_neekster_update", {
      entity: "update.home_assistant_core_update",
      ulm_card_neekster_update_enable_controls: true,
      ulm_card_neekster_update_collapsible: true,
    });
    expect(update.shadowRoot.textContent).toContain("Update Available!");
    expect(update.shadowRoot.querySelectorAll(".update-controls button")).toHaveLength(2);
    update.remove();
    const current = await renderCard("custom_card_neekster_update", {
      entity: "update.home_assistant_core_update",
      ulm_card_neekster_update_enable_controls: true,
      ulm_card_neekster_update_collapsible: true,
    }, {
      ...states,
      "update.home_assistant_core_update": { ...states["update.home_assistant_core_update"], state: "off" },
    });
    expect(current.shadowRoot.textContent).toContain("Up to Date.");
    expect(current.shadowRoot.querySelector(".update-controls")).toBeNull();
    current.remove();

    const clock = await renderCard("custom_card_nik_clock", {
      entity: "sensor.time",
      date_entity: "sensor.date_time",
    });
    expect(clock.shadowRoot.textContent).toContain("22:50");
    expect(clock.shadowRoot.textContent).toContain("Wednesday, September 23, 2026");
    clock.remove();

    for (const [state, tone] of [
      ["Open", "is-open"],
      ["Closed & Unlocked", "is-unlocked"],
      ["Closed & Locked", "is-locked"],
    ]) {
      const door = await renderCard("custom_card_nik_door", {
        entity: "binary_sensor.all_doors",
        lock_entity: "lock.front_door",
        battery_entity: "sensor.front_door_battery",
      }, {
        ...states,
        "binary_sensor.all_doors": { ...states["binary_sensor.all_doors"], state },
      });
      expect(door.shadowRoot.querySelector(`.nik-door-state-tones .${tone}`)).not.toBeNull();
      door.remove();
    }

    const expected = ["none", "none to low", "low", "low to medium", "medium", "medium to high", "high"];
    for (let level = 0; level <= 6; level += 1) {
      const pollen = await renderCard("custom_card_paddy_dwd_pollen", {
        entity: "sensor.kleenex_pollen_radar_home_grass_level",
        level_entity: "sensor.kleenex_pollen_radar_home_grass_level",
        pollen_language: "en",
      }, {
        ...states,
        "sensor.kleenex_pollen_radar_home_grass_level": {
          ...states["sensor.kleenex_pollen_radar_home_grass_level"],
          state: String(level),
        },
      });
      expect(pollen.shadowRoot.textContent).toContain(expected[level]);
      pollen.remove();
    }
  });

  it("dispatches every visible interaction with exact Home Assistant payloads", async () => {
    const surfaceSources = [
      ["custom_card_mpse_wifisignal", "sensor.yvette_mobile_signal_strength_sim_1"],
      ["custom_card_nas", "sensor.all_nas_disks_status"],
      ["custom_card_neekster_update", "update.home_assistant_core_update"],
      ["custom_card_nik_door", "binary_sensor.all_doors"],
      ["custom_card_paddy_dwd_pollen", "sensor.kleenex_pollen_radar_home_grass_level"],
    ] as const;
    for (const [sourceId, entity] of surfaceSources) {
      const card = await renderCard(sourceId, { entity });
      const action = vi.fn();
      card.addEventListener("hass-action", action);
      (card.shadowRoot.querySelector(".action-surface") as HTMLElement).click();
      expect(action).toHaveBeenCalledWith(expect.objectContaining({
        detail: {
          action: "tap",
          config: expect.objectContaining({ entity, tap_action: { action: "more-info" } }),
        },
      }));
      card.remove();
    }

    const updateService = vi.fn(async () => undefined);
    const update = await renderCard("custom_card_neekster_update", {
      entity: "update.home_assistant_core_update",
      ulm_card_neekster_update_enable_controls: true,
    }, states, updateService);
    update.shadowRoot.querySelectorAll<HTMLButtonElement>(".update-controls button").forEach((control) => control.click());
    expect(updateService.mock.calls).toEqual([
      ["update", "install", { entity_id: "update.home_assistant_core_update" }],
      ["update", "skip", { entity_id: "update.home_assistant_core_update" }],
    ]);
    update.remove();

    vi.useFakeTimers();
    const heldUpdate = await renderCard("custom_card_neekster_update", {
      entity: "update.home_assistant_core_update",
      ulm_card_neekster_update_enable_controls: true,
    });
    const heldAction = vi.fn();
    heldUpdate.addEventListener("hass-action", heldAction);
    const install = heldUpdate.shadowRoot.querySelector<HTMLButtonElement>(".update-controls button")!;
    install.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    vi.advanceTimersByTime(500);
    install.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
    expect(heldAction).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        action: "tap",
        config: expect.objectContaining({
          entity: "update.home_assistant_core_update",
          tap_action: { action: "more-info" },
        }),
      },
    }));
    heldUpdate.remove();
    vi.useRealTimers();

    const doorService = vi.fn(async () => undefined);
    const door = await renderCard("custom_card_nik_door", {
      entity: "binary_sensor.all_doors",
      lock_entity: "lock.front_door",
      battery_entity: "sensor.front_door_battery",
    }, states, doorService);
    door.shadowRoot.querySelectorAll<HTMLButtonElement>(".nik-door-controls button").forEach((control) => control.click());
    expect(doorService.mock.calls).toEqual([
      ["lock", "open", { entity_id: "lock.front_door" }],
      ["lock", "lock", { entity_id: "lock.front_door" }],
    ]);
    door.shadowRoot.querySelector<HTMLButtonElement>(".nik-door-lock-status")!
      .dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    expect(doorService.mock.calls[2]).toEqual([
      "lock", "unlock", { entity_id: "lock.front_door" },
    ]);
    door.remove();

    const clock = await renderCard("custom_card_nik_clock", {
      entity: "sensor.time",
      clock_switch_entity: "input_boolean.clock_mode",
      ulm_custom_card_nik_clock_switch_enable: true,
    });
    const action = vi.fn();
    clock.addEventListener("hass-action", action);
    (clock.shadowRoot.querySelector(".action-surface") as HTMLElement).click();
    expect(action).toHaveBeenCalledWith(expect.objectContaining({
      detail: {
        action: "tap",
        config: expect.objectContaining({
          tap_action: {
            action: "perform-action",
            perform_action: "input_boolean.toggle",
            target: { entity_id: "input_boolean.clock_mode" },
          },
        }),
      },
    }));
  });
});
