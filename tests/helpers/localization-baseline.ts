import {
  translationCatalogs as currentCatalogs,
  englishHelpers as currentEnglishHelpers,
  helperCatalogs as currentHelperCatalogs,
} from "../../src/localize";

export { localeDirection, normalizeLocale, SUPPORTED_LOCALES } from "../../src/localize";

// These migration snapshots protect the translations installed before 0.7.
// Current inventories and later additions are checked by localization.test.ts.
export const translationCatalogs: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(currentCatalogs).map(([locale, catalog]) => [
    locale,
    Object.fromEntries(Object.entries(catalog).filter(([key]) =>
      key !== "washer_details_entities" && key !== "room_camera_entity" && !key.startsWith("ui.release."))),
  ]),
);
const withoutRoomCamera = (catalog: Record<string, string>) =>
  Object.fromEntries(Object.entries(catalog).filter(([key]) => key !== "room_camera_entity"));
export const englishHelpers = withoutRoomCamera(currentEnglishHelpers);
export const helperCatalogs: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(currentHelperCatalogs).map(([locale, catalog]) => [locale, withoutRoomCamera(catalog)]),
);
