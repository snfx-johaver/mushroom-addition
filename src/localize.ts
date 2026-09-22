import type { HomeAssistant } from "./types";

const translations: Record<string, Record<string, string>> = {
  en: {
    entity: "Entity", name: "Name", secondary: "Secondary information", icon: "Icon",
    icon_color: "Icon color", variant: "Variant", layout: "Layout",
    show_icon: "Show icon", show_state: "Show state", tap_action: "Tap action",
    hold_action: "Hold action", double_tap_action: "Double-tap action", chips: "Chip configurations",
  },
  de: {
    entity: "Entität", name: "Name", secondary: "Sekundärinformation", icon: "Symbol",
    icon_color: "Symbolfarbe", variant: "Variante", layout: "Layout",
    show_icon: "Symbol anzeigen", show_state: "Status anzeigen", tap_action: "Tippaktion",
    hold_action: "Halteaktion", double_tap_action: "Doppeltippaktion", chips: "Chip-Konfigurationen",
  },
  es: {
    entity: "Entidad", name: "Nombre", secondary: "Información secundaria", icon: "Icono",
    icon_color: "Color del icono", variant: "Variante", layout: "Diseño",
    show_icon: "Mostrar icono", show_state: "Mostrar estado", tap_action: "Acción al tocar",
    hold_action: "Acción al mantener", double_tap_action: "Acción de doble toque", chips: "Configuraciones de chips",
  },
  fr: {
    entity: "Entité", name: "Nom", secondary: "Information secondaire", icon: "Icône",
    icon_color: "Couleur de l’icône", variant: "Variante", layout: "Disposition",
    show_icon: "Afficher l’icône", show_state: "Afficher l’état", tap_action: "Action au toucher",
    hold_action: "Action au maintien", double_tap_action: "Action au double toucher", chips: "Configuration des chips",
  },
  nl: {
    entity: "Entiteit", name: "Naam", secondary: "Secundaire informatie", icon: "Pictogram",
    icon_color: "Pictogramkleur", variant: "Variant", layout: "Indeling",
    show_icon: "Pictogram tonen", show_state: "Status tonen", tap_action: "Tikactie",
    hold_action: "Vasthoudactie", double_tap_action: "Dubbeltikactie", chips: "Chipconfiguraties",
  },
};

export const localize = (hass: HomeAssistant | undefined, key: string): string => {
  const language = hass?.language?.split("-")[0] ?? "en";
  return translations[language]?.[key] ?? translations.en[key] ??
    key.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
};
