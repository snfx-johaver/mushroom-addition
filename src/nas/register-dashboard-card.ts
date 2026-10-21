// Adapted from SNFX Synology Cards (Apache-2.0); picker registration is centralized.
import { defineOnce } from "./define";
import { NAS_CARD_ALIASES } from "./config";

interface DashboardCardRegistration {
  tag: string;
  editorTag: string;
  card: CustomElementConstructor;
  editor: CustomElementConstructor;
  name: string;
  description: string;
}

export function registerDashboardCard(
  registration: DashboardCardRegistration
): void {
  defineOnce(registration.tag, registration.card);
  defineOnce(registration.editorTag, registration.editor);

  for (const alias of NAS_CARD_ALIASES.filter((item) => item.targetTag === registration.tag)) {
    class LegacyNasCard extends registration.card {
      static editorTag = alias.editorTag;
    }
    class LegacyNasEditor extends registration.editor {}
    defineOnce(alias.tag, LegacyNasCard);
    defineOnce(alias.editorTag, LegacyNasEditor);
  }
}
