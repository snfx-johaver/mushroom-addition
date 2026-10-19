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
    "person-info",
    "person-info-small",
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

  it("matches the source Person Info badge and battery/detail icon hierarchy", () => {
    expect(sizes("person-info", "icons", ".person-info-badge ha-icon"))
      .toEqual([{ width: 10, height: 10 }]);
    expect(sizes("person-info", "icons", ".person-info-detail ha-icon"))
      .toEqual([{ width: 16, height: 16 }, { width: 16, height: 16 }]);
    expect(sizes("person-info-small", "icons", ".person-info-small-battery ha-icon"))
      .toEqual([{ width: 25, height: 25 }]);
  });
});
