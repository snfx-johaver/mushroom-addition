import { describe, expect, it, vi } from "vitest";
import { displayName, handleAction, normalizeConfig, stateLabel } from "../src/helpers";
import type { AdditionConfig, HassEntity } from "../src/types";

const entity: HassEntity = {
  entity_id: "sensor.power",
  state: "42",
  attributes: { friendly_name: "Power", unit_of_measurement: "W" },
};

describe("shared card behavior", () => {
  it("formats state and friendly names", () => {
    expect(stateLabel(entity)).toBe("42 W");
    expect(displayName({ type: "x" }, entity)).toBe("Power");
  });

  it("normalizes safe defaults", () => {
    expect(normalizeConfig({ type: "x", entity: "light.kitchen" })).toMatchObject({
      show_icon: true,
      show_state: true,
      tap_action: { action: "more-info" },
    });
  });

  it("dispatches native Home Assistant actions without dropping modern fields", () => {
    const node = document.createElement("div");
    const listener = vi.fn();
    node.addEventListener("hass-action", listener);
    const config: AdditionConfig = {
      type: "x",
      entity: "light.kitchen",
      tap_action: {
        action: "perform-action",
        perform_action: "light.turn_on",
        target: { entity_id: "light.kitchen" },
        data: { brightness_pct: 50 },
        confirmation: { text: "Continue?" },
      },
    };
    handleAction(node, config, "tap");
    expect(listener).toHaveBeenCalledOnce();
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({ config, action: "tap" });
  });

  it.each(["more-info", "toggle", "navigate", "url", "perform-action", "assist", "none"] as const)(
    "supports the %s action",
    (action) => expect(action satisfies NonNullable<AdditionConfig["tap_action"]>["action"]).toBe(action),
  );
});
