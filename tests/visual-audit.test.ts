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
      accepted: 0,
      pickerAccepted: 4,
      editorAccepted: 4,
      visualAccepted: 5,
      statesAccepted: 4,
      interactionsAccepted: 4,
      liveAccepted: 0,
      total: 86,
    });
    expect(VISUAL_AUDIT.filter((entry) => entry.status === "accepted").map((entry) => entry.sourceId))
      .toEqual([]);
  });

  it("certifies local stages only for the four parent-approved priority visuals", () => {
    for (const sourceId of [
      "custom_card_heat_pump",
      "custom_card_homeassistant_updates",
      "custom_card_nik_tablet",
      "custom_card_person_info_small",
    ]) {
      expect(VISUAL_AUDIT.find((entry) => entry.sourceId === sourceId)).toMatchObject({
        pickerAccepted: true,
        editorAccepted: true,
        visualAccepted: true,
        statesAccepted: true,
        interactionsAccepted: true,
        liveAccepted: false,
      });
    }
    for (const sourceId of ["custom_card_nik_nas", "custom_card_person_info"]) {
      expect(VISUAL_AUDIT.find((entry) => entry.sourceId === sourceId)).toMatchObject({
        visualAccepted: false,
        liveAccepted: false,
      });
    }
  });
});
