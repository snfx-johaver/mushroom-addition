import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { mediaControlStyles, rangeProgress, updateRangeProgress } from "../src/control-styles";
import { sharedStyles } from "../src/styles";

describe("Mushroom media controls and selected presentation alignment", () => {
  it.each([
    [50, 0, 100, "50%"], [-5, -10, 10, "25%"], [200, 0, 100, "100%"],
    [-50, 0, 100, "0%"], [1, 1, 1, "0%"],
  ])("normalizes %s over %s..%s without exceeding the track", (value, min, max, expected) => {
    expect(rangeProgress(value, min, max)).toBe(expected);
  });

  it("updates slider feedback without sending device commands", () => {
    const properties = new Map<string, string>();
    const input = { valueAsNumber: 5, min: "-10", max: "10", style: { setProperty: (key: string, value: string) => properties.set(key, value) } };
    const event = new Event("input");
    Object.defineProperty(event, "currentTarget", { value: input });
    updateRangeProgress(event);
    expect(properties.get("--range-progress")).toBe("75%");
  });

  it("shares native keyboard-accessible range styling between Sonos and Remote", () => {
    const css = mediaControlStyles.cssText;
    expect(css).toContain("height: var(--mush-control-height, 42px)");
    expect(css).toContain("border-radius: var(--mush-control-border-radius, 12px)");
    expect(css).toContain("::-webkit-slider-thumb");
    expect(css).toContain("::-moz-range-thumb");
    expect(css).toContain("input.mushroom-range:disabled");
    expect(css).toContain("input.mushroom-range:focus-visible");
    for (const file of ["renderers.ts", "remote-card.ts"]) {
      const source = readFileSync(join(process.cwd(), "src", file), "utf8");
      expect(source).toContain('@input=${updateRangeProgress}');
      expect(source).toContain('class="mushroom-range"');
      expect(source).toContain("@change=");
    }
  });

  it("uses theme sizing for Alarm Time, Washer and Input Datetime without resizing Trash/Printer rows", () => {
    const css = sharedStyles.cssText;
    for (const selector of [".alarm-time-controls .ulm-control", ".washer-controls .ulm-control", ".input-datetime-controls .ulm-control"]) {
      const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rule = css.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`))?.[1];
      expect(rule).toContain("height: var(--mush-control-height, 42px)");
      expect(rule).toContain("border-radius: var(--mush-control-border-radius, 12px)");
    }
    expect(css).toMatch(/\.waste-row\s*\{[^}]*min-height: 30px/);
    expect(css).toMatch(/\.toner-bars i\s*\{[^}]*height: 30px/);
    expect(css).toMatch(/\.waste-row b\s*\{[^}]*--mush-card-primary-font-size/);
    expect(css).toMatch(/\.toner-bars b\s*\{[^}]*--mush-card-primary-font-weight/);
    expect(css).toContain("grid-template-columns: 26px minmax(0, .8fr) minmax(0, 1fr) 34px");
  });

  it("aligns astronomy labels and Mini Graph supporting text without replacing their visualizations", () => {
    const css = sharedStyles.cssText;
    expect(css).toMatch(/\.astronomy-times b, \.sun-footer b\s*\{[^}]*--mush-card-primary-font-size/);
    expect(css).toMatch(/\.moon-metric small\s*\{[^}]*--mush-card-secondary-font-size/);
    expect(css).toContain(".sun-arc svg");
    expect(css).toContain(".moon-marker ha-icon");
    const graph = readFileSync(join(process.cwd(), "src", "mini-graph.ts"), "utf8");
    expect(graph).toContain("font-size: calc(var(--mini-graph-font-size, 100) * .01 * 32px)");
    expect(graph).toContain("font_size_header === undefined");
    expect(graph).toMatch(/\.legend\s*\{[^}]*--mush-card-secondary-font-size/);
    expect(graph).toMatch(/\.statistics\s*\{[^}]*--mush-card-secondary-font-size/);
  });
});
