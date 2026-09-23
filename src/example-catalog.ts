import { CATALOG } from "./catalog";

export const EXAMPLE_CATALOG_IDS = CATALOG
  .filter((item) => item.kind !== "chip")
  .map((item) => item.upstreamId);

export const EXAMPLE_CHIP_IDS = CATALOG
  .filter((item) => item.kind === "chip")
  .map((item) => item.upstreamId);

export const EXAMPLE_REGISTRATION_IDS = [...EXAMPLE_CATALOG_IDS, ...EXAMPLE_CHIP_IDS];
