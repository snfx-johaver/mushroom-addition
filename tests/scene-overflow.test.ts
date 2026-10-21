import { describe, expect, it } from "vitest";
import { sharedStyles } from "../src/styles";

describe("single-row scene picker containment", () => {
  it("shrinks pills like Welcome buttons and scrolls only below their minimum usable width", () => {
    const rule = sharedStyles.cssText.match(/(?:^|\n)\s*\.scene-grid\s*\{([^}]+)\}/)?.[1];
    expect(rule).not.toContain("flex-wrap: wrap");
    expect(rule).toContain("min-width: 0");
    expect(rule).toContain("overflow-x: auto");
    const button = sharedStyles.cssText.match(/(?:^|\n)\s*\.scene-button\s*\{([^}]+)\}/)?.[1];
    expect(button).toContain("flex: 1");
    expect(button).toContain("min-width: 52px");
    expect(button).toContain("border-radius: 25px");
  });
});
