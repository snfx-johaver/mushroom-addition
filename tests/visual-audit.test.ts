import { describe, expect, it } from "vitest";
import { VISUAL_AUDIT, visualAuditProgress } from "../src/visual-audit";

const removedSources = new Set([
  "card_graph",
  "custom_card_internet_speed",
  "custom_card_entity_overview",
  "custom_card_more_power_outlet",
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
  "custom_card_chromecast",
  "custom_card_camera",
  "custom_card_better_thermostat",
  "custom_card_vehicle_status",
  "custom_card_pollen_forecast",
  "custom_card_welcome_dashboard",
  "custom_card_gauge",
  "custom_card_bar_card",
  "custom_card_weather_metrics",
]);

describe("visual audit manifest", () => {
  it("contains one audit record for every retained source", () => {
    expect(VISUAL_AUDIT).toHaveLength(21);
    expect(new Set(VISUAL_AUDIT.map((entry) => entry.sourceId)).size).toBe(21);
    expect(visualAuditProgress()).toMatchObject({ total: 21 });
  });

  it("does not expose audit records for deleted sources", () => {
    expect(VISUAL_AUDIT.some((entry) => removedSources.has(entry.sourceId))).toBe(false);
  });
});
