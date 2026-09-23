import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}

interface NasGeometry {
  implementation: Rect;
  card: Rect;
  surface: Rect;
  surfaceClientWidth: number;
  surfaceScrollWidth: number;
  horizontalOverflow: number;
  tiles: Rect[];
  rings: Rect;
  computedColumns: string;
}

interface TabletGeometry {
  implementation: Rect;
  card: Rect;
  surface: Rect;
  controlsPresent: boolean;
  metrics: Array<{ rect: Rect; text: string }>;
  batteryPresent: boolean;
  text: string;
}

const evidence = JSON.parse(readFileSync(
  join(process.cwd(), "docs", "assets", "visual-audit", "priority-responsive-geometry.json"),
  "utf8",
)) as {
  nas510: NasGeometry;
  nas330: NasGeometry;
  tabletPowerBattery330: TabletGeometry;
};

const expectInside = (child: Rect, parent: Rect): void => {
  expect(child.x).toBeGreaterThanOrEqual(parent.x);
  expect(child.right).toBeLessThanOrEqual(parent.right);
};

describe("priority live regression evidence", () => {
  it.each([
    ["510px", evidence.nas510, 510],
    ["330px", evidence.nas330, 330],
  ] as const)("keeps Nik NAS inside its %s card surface", (_label, geometry, expectedWidth) => {
    expect(geometry.card.width).toBe(expectedWidth);
    expect(geometry.surface.width).toBe(expectedWidth);
    expect(geometry.surfaceClientWidth).toBe(expectedWidth);
    expect(geometry.surfaceScrollWidth).toBe(expectedWidth);
    expect(geometry.horizontalOverflow).toBe(0);
    geometry.tiles.forEach((tile) => expectInside(tile, geometry.surface));
    expectInside(geometry.rings, geometry.surface);
  });

  it("preserves the accepted 510px Nik NAS composition while compacting at 330px", () => {
    expect(evidence.nas510.card.height).toBe(360);
    expect(evidence.nas510.tiles.map(({ width }) => width)).toEqual([231, 231]);
    expect(evidence.nas510.rings.width).toBe(190);
    expect(evidence.nas330.card.height).toBeLessThan(evidence.nas510.card.height);
    expect(evidence.nas330.tiles.map(({ width }) => width)).toEqual([149, 149]);
    expect(evidence.nas330.rings.width).toBe(132);
  });

  it("captures only the 330px Tablet element and collapses omitted optional slots", () => {
    const geometry = evidence.tabletPowerBattery330;
    expect(geometry.implementation).toEqual(geometry.card);
    expect(geometry.card).toEqual(geometry.surface);
    expect(geometry.card.width).toBe(330);
    expect(geometry.controlsPresent).toBe(false);
    expect(geometry.metrics).toHaveLength(1);
    expect(geometry.metrics[0].text).toBe("offPower");
    expect(geometry.batteryPresent).toBe(true);
    expect(geometry.text).not.toMatch(/\bRAM\b|\bDisk\b|Entity unavailable/i);
  });
});
