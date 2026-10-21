import { describe, expect, it } from "vitest";
import { localizeNativeDiagnostic, nativeDiagnosticCatalogs } from "../src/native-diagnostics";
import { SUPPORTED_LOCALES } from "../src/localize";
import { placeholders, translationCoverage } from "../src/translation-coverage";
import type { HomeAssistant } from "../src/types";

const hass = (language: string): HomeAssistant => ({ language, states: {}, callService: async () => undefined });

describe("native Area diagnostics", () => {
  it("fully translates every diagnostic and preserves placeholders in all Mushroom locales", () => {
    expect(Object.keys(nativeDiagnosticCatalogs).sort()).toEqual([...SUPPORTED_LOCALES].sort());
    for (const locale of SUPPORTED_LOCALES) {
      expect(Object.keys(nativeDiagnosticCatalogs[locale]).sort()).toEqual(Object.keys(nativeDiagnosticCatalogs.en).sort());
      for (const [key, original] of Object.entries(nativeDiagnosticCatalogs.en)) {
        const value = nativeDiagnosticCatalogs[locale][key];
        expect(value.trim(), `${locale}/${key}`).toBeTruthy();
        expect(placeholders(value), `${locale}/${key}`).toEqual(placeholders(original));
        if (locale !== "en") expect(value, `${locale}/${key}`).not.toBe(original);
      }
    }
  });

  it("includes the diagnostic namespace in the strict coverage gate", () => {
    nativeDiagnosticCatalogs.nl.test_unknown_key = "Test";
    try {
      expect(translationCoverage().find(row => row.locale === "nl")?.invalid)
        .toContain("diagnostics.test_unknown_key (unknown key)");
    } finally {
      delete nativeDiagnosticCatalogs.nl.test_unknown_key;
    }
    const original = nativeDiagnosticCatalogs.nl.timeout;
    delete nativeDiagnosticCatalogs.nl.timeout;
    try {
      expect(translationCoverage().find(row => row.locale === "nl")?.missing).toContain("diagnostics.timeout");
    } finally {
      nativeDiagnosticCatalogs.nl.timeout = original;
    }
  });

  it("localizes known errors with stable component IDs, including Error.toString output", () => {
    const message = "Native condition editor timed out.";
    const expected = "Het laden van de ingebouwde component (hui-conditions-editor) duurde te lang. Probeer het opnieuw.";
    expect(localizeNativeDiagnostic(hass("nl"), message)).toBe(expected);
    expect(localizeNativeDiagnostic(hass("nl"), `Error: ${message}`)).toBe(expected);
    expect(localizeNativeDiagnostic(hass("de"), message)).toContain("hui-conditions-editor");
    expect(localizeNativeDiagnostic(hass("nl-NL"), message)).toBe(expected);
  });

  it("preserves arbitrary external errors and substitutes template details only once", () => {
    const detail = "backend: {component}, {error}, $entity, <b>error</b>";
    expect(localizeNativeDiagnostic(hass("nl"), detail)).toBe(detail);
    expect(localizeNativeDiagnostic(hass("nl"), `Error: ${detail}`)).toBe(`Error: ${detail}`);
    expect(localizeNativeDiagnostic(hass("nl"), `Template error: ${detail}`)).toBe(`Sjabloonfout: ${detail}`);
    expect(localizeNativeDiagnostic(hass("xx"), "Native condition editor timed out."))
      .toBe("The native component (hui-conditions-editor) took too long to load. Retry.");
  });
});
