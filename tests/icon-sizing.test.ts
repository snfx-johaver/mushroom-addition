import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(join(process.cwd(), "src", "styles.ts"), "utf8");

const ruleFor = (selector: string): string => {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return styles.match(new RegExp(`(?:^|\\n)\\s*${escaped}\\s*\\{([^}]+)\\}`))?.[1] ?? "";
};

describe("default Mushroom icon sizing", () => {
  it("uses Mushroom typography and icon sizes throughout NAS metrics without narrow-screen downscaling", () => {
    for (const selector of [".nas-metrics-tile-icon", ".nas-metrics-metrics i"]) {
      expect(ruleFor(selector)).toContain("width: var(--mush-icon-size, 40px)");
      expect(ruleFor(selector)).toContain("height: var(--mush-icon-size, 40px)");
      expect(ruleFor(`${selector} ha-icon`)).toContain("--mdc-icon-size: var(--mush-icon-symbol-size, 24px)");
    }
    expect(styles).toContain("font-size: var(--mush-card-primary-font-size, 14px)");
    expect(styles).toContain("font-size: var(--mush-card-secondary-font-size, 12px)");
    expect(styles).not.toContain(".nas-metrics-tile b, .nas-metrics-metrics b { font-size: 16px");
  });
  it("matches scene and welcome button surfaces without changing their shapes and keeps weather/date transparent", () => {
    for (const selector of [".scene-button", ".welcome-items > button"]) {
      expect(ruleFor(selector)).toContain("border: 0");
      expect(ruleFor(selector)).toContain("box-shadow: 0 2px 7px rgba(0,0,0,.12)");
    }
    expect(ruleFor(".scene-button")).toContain("border-radius: 32px");
    expect(ruleFor(".welcome-items > button")).toContain("border-radius: 25px");
    expect(ruleFor(".welcome-date")).toContain("background: transparent");
    expect(ruleFor(".welcome-date")).toContain("border: 0");
  });
  it("reserves bottom shadow space inside Welcome navigation and scrolls narrow rows instead of clipping", () => {
    expect(ruleFor(".welcome-items")).toContain("padding: 4px 4px 10px");
    expect(ruleFor(".welcome-items")).toContain("overflow-x: auto");
    expect(ruleFor(".welcome-items")).not.toContain("overflow: hidden");
  });
  it("uses theme-controlled Mushroom-style borders for standalone cards", () => {
    const border = "border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0))";
    expect(ruleFor(".mushroom-addition-card")).toContain(border);
    const miniGraph = readFileSync(join(process.cwd(), "src", "mini-graph.ts"), "utf8");
    expect(miniGraph).toContain(border);
    expect(miniGraph).toContain("ha-card.group { border: 0;");
  });
  it("uses the Mushroom defaults for shared icon shapes and symbols", () => {
    expect(ruleFor(".ulm-icon")).toContain("width: var(--mush-icon-size, 40px)");
    expect(ruleFor(".ulm-icon")).toContain("height: var(--mush-icon-size, 40px)");
    expect(styles).toContain(".ulm-icon > ha-icon, .ulm-icon > ha-state-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }");
  });

  it.each([
    ".scene-button i",
    ".room-view-icon",
    ".welcome-items i",
    ".tablet-icon",
    ".tablet-battery-icon",
    ".pollen-item-icon",
    ".console-logo",
  ])("keeps %s aligned with the shared icon shape", (selector) => {
    expect(ruleFor(selector)).toContain("width: var(--mush-icon-size, 40px)");
    expect(ruleFor(selector)).toContain("height: var(--mush-icon-size, 40px)");
  });

});
