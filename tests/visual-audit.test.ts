import { describe, expect, it } from "vitest";
import { UPSTREAM_CATALOG } from "../src/catalog";
import { VISUAL_AUDIT, visualAuditProgress } from "../src/visual-audit";

describe("visual audit manifest", () => {
  it("tracks every upstream card source exactly once", () => {
    expect(VISUAL_AUDIT).toHaveLength(UPSTREAM_CATALOG.length);
    expect(new Set(VISUAL_AUDIT.map((entry) => entry.sourceId))).toEqual(
      new Set(UPSTREAM_CATALOG.map((entry) => entry.upstreamId)),
    );
  });

  it("records the inspected Bar Card acceptance contract", () => {
    const bar = VISUAL_AUDIT.find((entry) => entry.sourceId === "custom_card_bar_card");
    expect(bar).toMatchObject({
      status: "pending",
      pickerAccepted: false,
      editorAccepted: false,
      visualAccepted: true,
      statesAccepted: false,
      interactionsAccepted: false,
      liveAccepted: false,
      compositionId: "bar-card:compact-header-progress",
      artifactPath: "docs/assets/visual-audit/custom-card-bar-card-comparison.png",
      widths: [237],
      themes: ["dark"],
    });
    expect(bar?.requiredRegions).toContain("bar-card-track");
    expect(bar?.forbiddenRegions).toContain("sparkline");
  });

  it("reports exact accepted progress without inferring parity from family mappings", () => {
    expect(visualAuditProgress()).toEqual({
      accepted: 6,
      pickerAccepted: 30,
      editorAccepted: 30,
      visualAccepted: 31,
      statesAccepted: 30,
      interactionsAccepted: 30,
      liveAccepted: 6,
      total: 86,
    });

    expect(VISUAL_AUDIT.filter((entry) => entry.status === "accepted").map((entry) => entry.sourceId))
      .toEqual([
        "custom_card_heat_pump",
        "custom_card_homeassistant_updates",
        "custom_card_nik_nas",
        "custom_card_nik_tablet",
        "custom_card_person_info",
        "custom_card_person_info_small",
      ]);
  });

  it("certifies only local stages for the six default rich sources", () => {
    for (const sourceId of [
      "card_generic",
      "card_generic_swap",
      "card_graph",
      "card_light",
      "card_media_player",
      "card_navigate",
    ]) {
      expect(VISUAL_AUDIT.find((entry) => entry.sourceId === sourceId)).toMatchObject({
        status: "pending",
        pickerAccepted: true,
        editorAccepted: true,
        visualAccepted: true,
        statesAccepted: true,
        interactionsAccepted: true,
        liveAccepted: false,
        fixturePath: "demo/default-rich-comparison.html",
        widths: [320],
      });
    }
  });

  it("certifies local stages for the six parent-approved priority visuals", () => {
    for (const sourceId of [
      "custom_card_heat_pump",
      "custom_card_homeassistant_updates",
      "custom_card_nik_nas",
      "custom_card_nik_tablet",
      "custom_card_person_info",
      "custom_card_person_info_small",
    ]) {
      expect(VISUAL_AUDIT.find((entry) => entry.sourceId === sourceId)).toMatchObject({
        pickerAccepted: true,
        editorAccepted: true,
        visualAccepted: true,
        statesAccepted: true,
        interactionsAccepted: true,
        liveAccepted: true,
      });
    }
  });

  it("certifies all five local stages for the first pending custom batch", () => {
    for (const sourceId of [
      "custom_card_afvalophaling",
      "custom_card_alarm_time",
      "custom_card_apexcharts",
      "custom_card_camera",
      "custom_card_chromecast",
      "custom_card_damix48_power_details",
    ]) {
      expect(VISUAL_AUDIT.find((entry) => entry.sourceId === sourceId)).toMatchObject({
        status: "pending",
        pickerAccepted: true,
        editorAccepted: true,
        visualAccepted: true,
        statesAccepted: true,
        interactionsAccepted: true,
        liveAccepted: false,
      });
    }
  });

  it("certifies all five local stages for the six requested source designs", () => {
    for (const sourceId of [
      "custom_card_device_tracker",
      "custom_card_drealine_roomview",
      "custom_card_eraycetinay_elapsed_time",
      "custom_card_eraycetinay_lock",
      "custom_card_esh_room",
      "custom_card_esh_welcome",
    ]) {
      expect(VISUAL_AUDIT.find((entry) => entry.sourceId === sourceId)).toMatchObject({
        status: "pending",
        pickerAccepted: true,
        editorAccepted: true,
        visualAccepted: true,
        statesAccepted: true,
        interactionsAccepted: true,
        liveAccepted: false,
      });
    }
  });
});
