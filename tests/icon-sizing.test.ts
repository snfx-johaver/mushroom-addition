import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(join(process.cwd(), "src", "styles.ts"), "utf8");

const ruleFor = (selector: string): string => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return styles.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`))?.[1] ?? "";
};

describe("default Mushroom icon sizing", () => {
  it("uses the Mushroom defaults for shared icon shapes and symbols", () => {
    expect(ruleFor(".ulm-icon")).toContain("width: var(--mush-icon-size, 40px)");
    expect(ruleFor(".ulm-icon")).toContain("height: var(--mush-icon-size, 40px)");
    expect(ruleFor(".ulm-icon > ha-icon"))
      .toContain("--mdc-icon-size: var(--mush-icon-symbol-size, 24px)");
  });

  it.each([
    ".bar-card-icon",
    ".scene-button i",
    ".room-view-icon",
    ".welcome-items i",
    ".tablet-icon",
    ".tablet-battery-icon",
    ".pollen-item-icon",
  ])("keeps %s aligned with the shared icon shape", (selector) => {
    expect(ruleFor(selector)).toContain("width: var(--mush-icon-size, 40px)");
    expect(ruleFor(selector)).toContain("height: var(--mush-icon-size, 40px)");
  });

});
