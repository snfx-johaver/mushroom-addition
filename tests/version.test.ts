// @vitest-environment node
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { version } from "../package.json";

const check = (tag?: string) => spawnSync(process.execPath, [
  "--import", "tsx", fileURLToPath(new URL("../scripts/check-version.ts", import.meta.url)),
  ...(tag === undefined ? [] : [tag]),
], { encoding: "utf8" });

describe("release version validation", () => {
  it("accepts matching manifests and a matching release tag", () => {
    expect(check().status).toBe(0);
    expect(check(`v${version}`).status).toBe(0);
  });

  it("rejects a mismatched release tag", () => {
    const result = check("v999.0.0");
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("does not match package version");
  });
});
