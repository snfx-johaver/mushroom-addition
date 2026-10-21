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
  it("lets narrow NAS chart columns shrink without reducing the icon or text sizes", () => {
    expect(styles).toContain("grid-template-columns: minmax(0, 1fr) minmax(0, min(132px, 45%))");
    expect(styles).not.toContain("grid-template-columns: minmax(112px, 1fr) minmax(120px, 132px)");
  });
  it("wraps long astronomy translations within the existing four-column layout", () => {
    expect(ruleFor(".astronomy-times")).toContain("min-width: 0");
    expect(ruleFor(".astronomy-times")).toContain("repeat(4, minmax(0, 1fr))");
    expect(ruleFor(".astronomy-times small, .sun-footer small")).toContain("overflow-wrap: anywhere");
  });
  it("centers the moon icon inside its orbit marker without an inline baseline offset", () => {
    const icon = ruleFor(".moon-marker ha-icon");
    expect(icon).toContain("display: flex");
    expect(icon).toContain("align-items: center");
    expect(icon).toContain("justify-content: center");
    expect(icon).toContain("width: 20px");
    expect(icon).toContain("height: 20px");
    expect(icon).toContain("line-height: 0");
    expect(icon).toContain("--mdc-icon-size: 20px");
  });
  it("matches scene and welcome button surfaces without changing their shapes and keeps weather/date transparent", () => {
    for (const selector of [".scene-button", ".welcome-items > button", ".welcome-toolbar button"]) {
      expect(ruleFor(selector)).toContain("border: 0");
      expect(ruleFor(selector)).toContain("box-shadow: var(--addition-raised-shadow)");
      expect(ruleFor(selector)).toContain("background: var(--addition-raised-background)");
    }
    expect(ruleFor(":host")).toContain("--addition-raised-shadow: 0 2px 7px rgba(0,0,0,.12)");
    expect(ruleFor(":host([dark])")).toContain("var(--primary-text-color, #fff) 7%");
    expect(ruleFor(":host([dark])")).toContain("0 3px 8px rgba(0,0,0,.45)");
    expect(ruleFor(":host([dark])")).toContain("inset 0 1px 0 rgba(255,255,255,.09)");
    expect(ruleFor(".scene-button")).toContain("border-radius: 25px");
    expect(ruleFor(".welcome-items > button")).toContain("border-radius: 25px");
    expect(ruleFor(".welcome-date")).toContain("background: transparent");
    expect(ruleFor(".welcome-date")).toContain("border: 0");
  });
  it.each([
    ".ulm-control",
    ".room-view-actions button",
    ".sonos-controls button",
    ".sonos-switches button",
    ".sonos-shortcuts button",
    ".tablet-controls button",
    ".console-controls button",
  ])("gives %s the shared remote-style button shadow without changing state colors", selector => {
    expect(ruleFor(selector)).toContain("box-shadow: var(--addition-raised-shadow)");
  });
  it("uses color rather than an inset border for active tablet controls", () => {
    expect(ruleFor(".tablet-controls button")).toContain("border: 0");
    expect(ruleFor(".tablet-controls button.is-active")).toContain("background: rgba(var(--tone), .3)");
    expect(ruleFor(".tablet-controls button.is-active")).not.toMatch(/inset|border|box-shadow/);
  });
  it.each([".sonos-controls button", ".sonos-switches button", ".sonos-shortcuts button"])(
    "keeps %s borderless while retaining the subtle raised shadow", selector => {
      expect(ruleFor(selector)).toContain("border: 0");
      expect(ruleFor(selector)).toContain("box-shadow: var(--addition-raised-shadow)");
    },
  );
  it("does not add a border to active Sonos switches", () => {
    expect(ruleFor(".sonos-switches button.is-active")).not.toContain("border");
  });
  it.each([
    ["entity-carousel.ts", ".navigation"],
    ["pi-hole.ts", "button.metric, button.entity, button.duration"],
    ["upcoming-media.ts", ".more, .close"],
    ["area-advanced.ts", ".entity"],
  ])("shares subtle button elevation in %s", (file, selector) => {
    const source = readFileSync(join(process.cwd(), "src", file), "utf8");
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rule = source.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`))?.[1];
    expect(rule).toContain("box-shadow: var(--addition-raised-shadow, 0 2px 7px rgba(0,0,0,.12))");
  });
  it("reserves bottom shadow space inside Welcome navigation and scrolls narrow rows instead of clipping", () => {
    expect(ruleFor(".welcome-items")).toContain("padding: 4px 4px 10px");
    expect(ruleFor(".welcome-items")).toContain("overflow-x: auto");
    expect(ruleFor(".welcome-items")).not.toContain("overflow: hidden");
  });
  it("keeps scene pill bottoms and shadows inside the horizontal scrolling area", () => {
    expect(ruleFor(".scene-grid")).toContain("padding: 4px 4px 10px");
    expect(ruleFor(".scene-grid")).toContain("overflow-x: auto");
    expect(ruleFor(".scene-button")).not.toContain("min-height: 88px");
  });
  it("matches scene and welcome pill geometry, spacing and labels at every card width", () => {
    for (const property of [
      "display: flex", "gap: 8px", "overflow-x: auto",
      "padding: 4px 4px 10px", "margin: -4px -4px -10px",
    ]) {
      expect(ruleFor(".scene-grid")).toContain(property);
      expect(ruleFor(".welcome-items")).toContain(property);
    }
    for (const property of [
      "min-width: 52px", "flex: 1", "gap: 6px", "padding: 7px 4px 10px",
      "border-radius: 25px", "box-shadow: var(--addition-raised-shadow)",
    ]) {
      expect(ruleFor(".scene-button")).toContain(property);
      expect(ruleFor(".welcome-items > button")).toContain(property);
    }
    for (const property of ["max-width: 48px", "font-size: 9px", "font-weight: 700"]) {
      expect(ruleFor(".scene-button > span")).toContain(property);
      expect(ruleFor(".welcome-items small")).toContain(property);
    }
    expect(styles).not.toContain(".source-scene-grid .scene-grid");
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
