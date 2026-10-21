import type { HomeAssistant } from "./types";
import type { EditorField } from "./editor-schema";
import { localizeText } from "./localize";

/** Only schema-owned display labels are translated; selector values and HA selectors are untouched. */
export const localizeEditorSchema = (hass: HomeAssistant | undefined, fields: EditorField[]): EditorField[] =>
  fields.map(field => {
    const select = field.selector?.select as { options?: unknown[] } | undefined;
    const color = field.selector?.ui_color as { extra_options?: Array<{ label: string }> } | undefined;
    return {
      ...field,
      ...(field.schema ? { schema: localizeEditorSchema(hass, field.schema) } : {}),
      ...(Array.isArray(select?.options) ? {
        selector: {
          ...field.selector,
          select: {
            ...select,
            options: select.options.map(option =>
              typeof option === "object" && option !== null && "label" in option && typeof option.label === "string"
                ? { ...option, label: localizeText(hass, option.label) }
                : option),
          },
        },
      } : {}),
      ...(Array.isArray(color?.extra_options) ? {
        selector: {
          ...field.selector,
          ui_color: {
            ...color,
            extra_options: color.extra_options.map(option => ({
              ...option,
              label: localizeText(hass, option.label),
            })),
          },
        },
      } : {}),
    };
  });
