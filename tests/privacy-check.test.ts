import { describe, expect, it } from "vitest";
import { privacyViolation } from "../scripts/check-privacy";

describe("tracked-file privacy guard", () => {
  it("rejects private addresses, deployment hostnames, user paths and audit exports", () => {
    for (const address of [[192, 168, 9, 23], [10, 4, 5, 6], [172, 16, 5, 6], [172, 31, 5, 6]]) {
      expect(privacyViolation("example.txt", address.join("."))).toBe(true);
    }
    expect(privacyViolation("example.txt", ["https://private-instance", "ui", "nabu", "casa"].join("."))).toBe(true);
    expect(privacyViolation("example.txt", ["C:", "Users", "private-user", "file"].join("\\"))).toBe(true);
    expect(privacyViolation("example.txt", ["", "home", "private-user", "file"].join("/"))).toBe(true);
    expect(privacyViolation("docs/assets/example-live-certification.json", "{}")).toBe(true);
  });

  it("accepts public examples and known synthetic build paths", () => {
    for (const text of ["http://localhost:8123", "/home/web_user", "/home/runner/work", "sensor.example", "8.8.8.8", "172.32.0.1"]) {
      expect(privacyViolation("example.txt", text)).toBe(false);
    }
  });
});
