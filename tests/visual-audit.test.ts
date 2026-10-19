import { describe, expect, it } from "vitest";
import { VISUAL_AUDIT, visualAuditProgress } from "../src/visual-audit";

const removedSources = new Set([
  "card_binary_sensor",
  "card_binary_sensor_alert",
  "card_generic",
  "card_generic_swap",
  "card_navigate",
  "card_title",
  "custom_card_divider_subtitle",
  "custom_card_divider_title",
  "custom_card_door",
  "custom_card_elapsed_time",
  "custom_card_qubino",
  "custom_card_waste_collection",
  "custom_card_window",
  "card_input_boolean",
  "custom_card_lock",
  "custom_card_clock",
  "custom_card_nas",
  "custom_card_input_number",
  "custom_card_wifi_signal",
  "card_light",
  "card_vacuum",
  "card_vertical_button",
]);

describe("visual audit manifest", () => {
  it("contains one audit record for every retained source", () => {
    expect(VISUAL_AUDIT).toHaveLength(44);
    expect(new Set(VISUAL_AUDIT.map((entry) => entry.sourceId)).size).toBe(44);
    expect(visualAuditProgress()).toMatchObject({ total: 44 });
  });

  it("does not expose audit records for deleted sources", () => {
    expect(VISUAL_AUDIT.some((entry) => removedSources.has(entry.sourceId))).toBe(false);
  });
});
