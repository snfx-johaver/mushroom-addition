import { html, type TemplateResult } from "lit";
import type { CatalogItem, HassEntity, HomeAssistant } from "./types";

export const cardIconKeys = (item?: CatalogItem): string[] => [
  "icon",
  ...(item?.sourceIds ?? (item ? [item.upstreamId] : []))
    .flatMap(id => [`ulm_${id}_icon`, `${id}_icon`]),
];

export const renderEntityIcon = (
  hass: HomeAssistant | undefined,
  entity: HassEntity | undefined,
  override?: string,
  fallback = "mdi:information-outline",
): TemplateResult => {
  const explicit = override || entity?.attributes.icon;
  if (explicit || !entity) return html`<ha-icon .icon=${explicit || fallback}></ha-icon>`;
  return html`<ha-state-icon .hass=${hass} .stateObj=${entity}
    ._config=${hass?.config} ._connection=${hass?.connection} ._entities=${hass?.entities}></ha-state-icon>`;
};
