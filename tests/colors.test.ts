import { describe, expect, it } from "vitest";
import { resolveColor, resolveColorRgb } from "../src/colors";

describe("color resolution", () => {
  it("resolves Home Assistant theme color names through rgb variables", () => {
    expect(resolveColor("deep-purple", "red"))
      .toBe("rgb(var(--mush-rgb-deep-purple, var(--rgb-deep-purple, 110, 65, 171)))");
    expect(resolveColor("light-blue", "red"))
      .toBe("rgb(var(--mush-rgb-light-blue, var(--rgb-light-blue, 3, 169, 244)))");
  });

  it("preserves custom CSS colors and resolves semantic theme colors", () => {
    expect(resolveColor("#123456", "red")).toBe("#123456");
    expect(resolveColor("var(--custom-room-color)", "red")).toBe("var(--custom-room-color)");
    expect(resolveColor("primary", "red")).toBe("var(--primary-color, red)");
    expect(resolveColor(undefined, "deep-purple"))
      .toBe("rgb(var(--mush-rgb-deep-purple, var(--rgb-deep-purple, 110, 65, 171)))");
  });

  it.each([
    ["blue", "33, 150, 243"], ["yellow", "255, 235, 59"], ["purple", "146, 107, 199"],
    ["red", "244, 67, 54"], ["green", "76, 175, 80"], ["orange", "255, 152, 0"], ["grey", "158, 158, 158"],
  ])("shares Mushroom's %s RGB default and override precedence", (name, rgb) => {
    expect(resolveColorRgb(name)).toBe(`var(--mush-rgb-${name}, var(--rgb-${name}, ${rgb}))`);
    expect(resolveColor(name, "primary")).toBe(`rgb(${resolveColorRgb(name)})`);
  });
  it("does not treat arbitrary CSS as a named RGB palette entry", () => {
    expect(resolveColorRgb("#123456")).toBeUndefined();
    expect(resolveColor("rgb(1, 2, 3)", "blue")).toBe("rgb(1, 2, 3)");
  });
});
