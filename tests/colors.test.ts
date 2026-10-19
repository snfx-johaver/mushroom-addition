import { describe, expect, it } from "vitest";
import { resolveColor } from "../src/colors";

describe("color resolution", () => {
  it("resolves Home Assistant theme color names through rgb variables", () => {
    expect(resolveColor("deep-purple", "red"))
      .toBe("rgb(var(--rgb-deep-purple, 110, 65, 171))");
    expect(resolveColor("light-blue", "red"))
      .toBe("rgb(var(--rgb-light-blue, 3, 169, 244))");
  });

  it("preserves custom CSS colors and resolves semantic theme colors", () => {
    expect(resolveColor("#123456", "red")).toBe("#123456");
    expect(resolveColor("var(--custom-room-color)", "red")).toBe("var(--custom-room-color)");
    expect(resolveColor("primary", "red")).toBe("var(--primary-color, red)");
    expect(resolveColor(undefined, "deep-purple"))
      .toBe("rgb(var(--rgb-deep-purple, 110, 65, 171))");
  });
});
