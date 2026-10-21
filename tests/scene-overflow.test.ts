import { describe, expect, it } from "vitest";
import { sharedStyles } from "../src/styles";

describe("single-row scene picker containment", () => {
  it("keeps fixed-width pills in one row with an internal horizontal scroll container", () => {
    const rule = sharedStyles.cssText.match(/\.ulm-source-scenes \.scene-grid\s*\{([^}]+)\}/)?.[1];
    expect(rule).toContain("flex-wrap: nowrap");
    expect(rule).toContain("min-width: 0");
    expect(rule).toContain("overflow-x: auto");
    const button = sharedStyles.cssText.match(/(?:^|\n)\s*\.scene-button\s*\{([^}]+)\}/)?.[1];
    expect(button).toContain("width: 64px");
    expect(button).toContain("min-width: 64px");
    expect(button).toContain("border-radius: 32px");
  });
});
