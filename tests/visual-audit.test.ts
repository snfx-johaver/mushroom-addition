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
      status: "accepted",
      compositionId: "bar-card:compact-header-progress",
      artifactPath: "docs/assets/visual-audit/custom-card-bar-card-comparison.png",
      widths: [237],
      themes: ["dark"],
    });
    expect(bar?.requiredRegions).toContain("bar-card-track");
    expect(bar?.forbiddenRegions).toContain("sparkline");
  });

  it("reports exact accepted progress without inferring parity from family mappings", () => {
    expect(visualAuditProgress()).toEqual({ accepted: 22, total: 86 });
    for (const pending of ["card_room", "card_scenes", "card_welcome_scenes"]) {
      expect(VISUAL_AUDIT.find((entry) => entry.sourceId === pending)?.status).toBe("pending");
    }
  });
});
