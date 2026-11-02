import { translationCatalogs as currentCatalogs } from "../../src/localize";

export { englishHelpers, helperCatalogs, localeDirection, normalizeLocale, SUPPORTED_LOCALES } from "../../src/localize";

// These migration snapshots protect the translations installed before 0.7.
// Current inventories and later additions are checked by localization.test.ts.
export const translationCatalogs: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(currentCatalogs).map(([locale, catalog]) => [
    locale,
    Object.fromEntries(Object.entries(catalog).filter(([key]) => key !== "washer_details_entities")),
  ]),
);
