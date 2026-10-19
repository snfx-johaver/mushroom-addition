import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

interface Size {
  width: number;
  height: number;
}

interface GeometryEntry {
  implementation: Size;
  reference: Size;
  icons: Record<string, Size[]>;
  buttons: Record<string, Size[]>;
}

const geometry = JSON.parse(readFileSync(
  join(process.cwd(), "docs", "assets", "visual-audit", "priority-card-geometry.json"),
  "utf8",
)) as Record<string, GeometryEntry>;

const sizes = (source: string, group: "icons" | "buttons", selector: string): Size[] =>
  geometry[source][group][selector];

describe("priority visual geometry evidence", () => {
  it.each([
    "nas-metrics",
    "tablet",
  ])("captures %s at the matched reference width", (source) => {
    expect(Math.abs(geometry[source].implementation.width - geometry[source].reference.width))
      .toBeLessThanOrEqual(14);
    expect(Math.abs(geometry[source].implementation.height - geometry[source].reference.height))
      .toBeLessThanOrEqual(25);
  });

  it("keeps NAS and Tablet semantic controls recognizable", () => {
    expect(Object.values(geometry["nas-metrics"].icons).flat()
      .every(({ width, height }) => width === 24 && height === 24)).toBe(true);
    expect(sizes("tablet", "icons", ".tablet-controls ha-icon"))
      .toEqual(Array.from({ length: 6 }, () => ({ width: 22, height: 22 })));
    expect(sizes("tablet", "buttons", ".tablet-controls button")
      .every(({ height }) => height === 42)).toBe(true);
  });

});
