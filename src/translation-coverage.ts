import { englishHelpers, helperCatalogs, SUPPORTED_LOCALES, translationCatalogs } from "./localize";
import { nativeDiagnosticCatalogs } from "./native-diagnostics";

export const placeholders = (message: string): string[] =>
  [...message.matchAll(/\{\w+\}|\$[a-zA-Z_]\w*/g)].map(match => match[0]).sort();

export const translationCoverage = () => SUPPORTED_LOCALES.map(locale => {
  const missing: string[] = [];
  const invalid: string[] = [];
  const unchanged: string[] = [];
  let translated = 0;
  for (const [namespace, english, catalog] of [
    ["labels", translationCatalogs.en, translationCatalogs[locale]],
    ["helpers", englishHelpers, helperCatalogs[locale]],
    ["diagnostics", nativeDiagnosticCatalogs.en, nativeDiagnosticCatalogs[locale]],
  ] as const) {
    for (const [key, original] of Object.entries(english)) {
      const path = `${namespace}.${key}`;
      const message = catalog?.[key];
      if (!message?.trim()) {
        missing.push(path);
        continue;
      }
      translated++;
      if (message === original && locale !== "en") unchanged.push(path);
      if (JSON.stringify(placeholders(original)) !== JSON.stringify(placeholders(message))) invalid.push(path);
    }
    for (const key of Object.keys(catalog ?? {})) {
      if (!(key in english)) invalid.push(`${namespace}.${key} (unknown key)`);
    }
  }
  return {
    locale,
    total: Object.keys(translationCatalogs.en).length + Object.keys(englishHelpers).length + Object.keys(nativeDiagnosticCatalogs.en).length,
    translated,
    missing,
    invalid,
    unchanged,
  };
});
