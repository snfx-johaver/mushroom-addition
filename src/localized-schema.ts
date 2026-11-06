import type { HomeAssistant } from "./types";
import type { EditorField } from "./editor-schema";
import { localizeText, normalizeLocale } from "./localize";
import type { NativeFields } from "./energy-editor-schema";

const defaultTextFields = new Set(["name", "label", "overview", "timelineTitle", "positiveLabel", "negativeLabel", "zeroLabel"]);
function localizeDefault(hass: HomeAssistant | undefined, key: string, value: unknown): unknown {
  if (typeof value === "string") return defaultTextFields.has(key) ? localizeText(hass, value) : value;
  if (Array.isArray(value)) return value.map(item => localizeDefault(hass, key, item));
  if (value && typeof value === "object") return Object.fromEntries(
    Object.entries(value).map(([name, item]) => [name, localizeDefault(hass, name, item)]),
  );
  return value;
}

function localizeObject(hass: HomeAssistant | undefined, fields: NativeFields): NativeFields {
  return Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, {
    ...field,
    label: localizeText(hass, field.label),
    ...("default" in field ? { default: localizeDefault(hass, key, field.default) } : {}),
    ...(field.description ? { description: localizeText(hass, field.description) } : {}),
    selector: localizeEditorSchema(hass, [{ name: key, selector: field.selector }])[0].selector!,
  }]));
}

/** Only schema-owned display labels are translated; selector values and HA selectors are untouched. */
export const localizeEditorSchema = (hass: HomeAssistant | undefined, fields: EditorField[]): EditorField[] =>
  fields.map(field => {
    const select = field.selector?.select as { options?: unknown[] } | undefined;
    const color = field.selector?.ui_color as { extra_options?: Array<{ label: string }> } | undefined;
    const object = field.selector?.object as { fields?: NativeFields } | undefined;
    return {
      ...field,
      ...(field.schema ? { schema: localizeEditorSchema(hass, field.schema) } : {}),
      ...(object?.fields ? {
        selector: { ...field.selector, object: { ...object, fields: localizeObject(hass, object.fields) } },
      } : {}),
      ...(Array.isArray(select?.options) ? {
        selector: {
          ...field.selector,
          select: {
            ...select,
            options: select.options.map(option =>
              typeof option === "object" && option !== null && "label" in option && typeof option.label === "string"
                ? { ...option, label: ["locale", "language"].includes(field.name) && "value" in option && typeof option.value === "string" && option.value !== "auto"
                  ? new Intl.DisplayNames([normalizeLocale(hass?.language)], { type: "language" }).of(option.value) ?? option.label
                  : localizeText(hass, option.label) }
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
