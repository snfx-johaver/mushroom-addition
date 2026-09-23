import "./editor";
import { CATALOG } from "./catalog";
import { MushroomAdditionCard } from "./card";
import type { AdditionConfig, CatalogItem, HomeAssistant } from "./types";
import { createStubConfig } from "./stub";

const VERSION = "1.1.0";

for (const item of CATALOG) {
  if (!customElements.get(item.tag)) {
    const descriptor = item;
    class RegisteredAdditionCard extends MushroomAdditionCard {
      protected descriptor: CatalogItem = descriptor;

      public static getStubConfig(
        hass?: HomeAssistant,
        entities: string[] = [],
        entitiesFallback: string[] = [],
      ): AdditionConfig {
        return createStubConfig(descriptor, hass, entities, entitiesFallback);
      }
    }
    customElements.define(item.tag, RegisteredAdditionCard);
  }
}

window.customCards = window.customCards || [];
const existing = new Set(window.customCards.map((card) => card.type));
for (const item of CATALOG) {
  if (existing.has(item.tag)) continue;
  window.customCards.push({
    type: item.tag,
    name: `Mushroom Addition: ${item.name}`,
    description: item.description,
    preview: true,
    documentationURL: "https://github.com/snfx-johaver/mushroom-cards-addition",
  });
}

console.info(
  `%c MUSHROOM-CARDS-ADDITION %c ${VERSION} · ${CATALOG.length} components `,
  "color: white; background: #03a9f4; font-weight: 700;",
  "color: #03a9f4; background: white; font-weight: 700;",
);

export { CATALOG } from "./catalog";
export type { AdditionConfig } from "./types";
