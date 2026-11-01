export { localizeText } from "../localize";

export const localeDirection = (language?: string): "rtl" | "ltr" =>
  ["ar", "he", "fa", "ur"].includes((language ?? "en").replaceAll("_", "-").split("-")[0].toLowerCase())
    ? "rtl" : "ltr";
