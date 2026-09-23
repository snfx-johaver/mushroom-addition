import type { HomeAssistant } from "./types";

const translations: Record<string, Record<string, string>> = {
  en: {
    entity: "Entity", name: "Name", secondary: "Secondary information", icon: "Icon",
    icon_color: "Icon color", variant: "Variant", layout: "Layout",
    show_icon: "Show icon", show_state: "Show state", tap_action: "Tap action",
    hold_action: "Hold action", double_tap_action: "Double-tap action", chips: "Chip configurations",
    temperature_entity: "Temperature sensor", humidity_entity: "Humidity sensor",
    battery_entity: "Battery sensor", graph_entity: "Graph sensor", eta_entity: "ETA sensor",
    address_entity: "Address sensor", min_entity: "Minimum sensor", max_entity: "Maximum sensor",
    show_forecast: "Show forecast", show_controls: "Show controls", show_graph: "Show graph",
    use_entity_picture: "Use entity picture", graph_hours: "Graph hours", console_platform: "Console platform",
  },
  de: {
    entity: "Entität", name: "Name", secondary: "Sekundärinformation", icon: "Symbol",
    icon_color: "Symbolfarbe", variant: "Variante", layout: "Layout",
    show_icon: "Symbol anzeigen", show_state: "Status anzeigen", tap_action: "Tippaktion",
    hold_action: "Halteaktion", double_tap_action: "Doppeltippaktion", chips: "Chip-Konfigurationen",
    temperature_entity: "Temperatursensor", humidity_entity: "Feuchtigkeitssensor",
    battery_entity: "Batteriesensor", show_forecast: "Vorhersage anzeigen", show_controls: "Steuerung anzeigen",
  },
  es: {
    entity: "Entidad", name: "Nombre", secondary: "Información secundaria", icon: "Icono",
    icon_color: "Color del icono", variant: "Variante", layout: "Diseño",
    show_icon: "Mostrar icono", show_state: "Mostrar estado", tap_action: "Acción al tocar",
    hold_action: "Acción al mantener", double_tap_action: "Acción de doble toque", chips: "Configuraciones de chips",
    temperature_entity: "Sensor de temperatura", humidity_entity: "Sensor de humedad",
    battery_entity: "Sensor de batería", show_forecast: "Mostrar pronóstico", show_controls: "Mostrar controles",
  },
  fr: {
    entity: "Entité", name: "Nom", secondary: "Information secondaire", icon: "Icône",
    icon_color: "Couleur de l’icône", variant: "Variante", layout: "Disposition",
    show_icon: "Afficher l’icône", show_state: "Afficher l’état", tap_action: "Action au toucher",
    hold_action: "Action au maintien", double_tap_action: "Action au double toucher", chips: "Configuration des chips",
    temperature_entity: "Capteur de température", humidity_entity: "Capteur d’humidité",
    battery_entity: "Capteur de batterie", show_forecast: "Afficher les prévisions", show_controls: "Afficher les commandes",
  },
  nl: {
    entity: "Entiteit", name: "Naam", secondary: "Secundaire informatie", icon: "Pictogram",
    icon_color: "Pictogramkleur", variant: "Variant", layout: "Indeling",
    show_icon: "Pictogram tonen", show_state: "Status tonen", tap_action: "Tikactie",
    hold_action: "Vasthoudactie", double_tap_action: "Dubbeltikactie", chips: "Chipconfiguraties",
    temperature_entity: "Temperatuursensor", humidity_entity: "Vochtigheidssensor",
    battery_entity: "Batterijsensor", show_forecast: "Voorspelling tonen", show_controls: "Bediening tonen",
  },
};

export const localize = (hass: HomeAssistant | undefined, key: string): string => {
  const language = hass?.language?.split("-")[0] ?? "en";
  return translations[language]?.[key] ?? translations.en[key] ??
    key.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
};
