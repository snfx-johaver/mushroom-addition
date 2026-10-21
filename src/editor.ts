import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { mdiDelete, mdiDragHorizontalVariant, mdiPencil } from "@mdi/js";
import type {
  ActionConfig,
  AdditionConfig,
  AdditionItemConfig,
  HomeAssistant,
  RoomStatusConfig,
  RoomSecondaryPart,
  SonosShortcutConfig,
  WasteStreamConfig,
  RemoteButtonConfig,
  RemoteSection,
  PiHoleMetric,
  PiHoleSection,
} from "./types";
import { CATALOG, getCatalogItem, LEGACY_ALIASES } from "./catalog";
import { clearCardIcon, fireEvent, migrateRoomLightConfig } from "./helpers";
import { carouselControlEnabled } from "./entity-carousel";
import { REMOTE_DEFAULTS, REMOTE_KEYS, REMOTE_SECTIONS, resolveRemoteEntities } from "./remote-card";
import { PIHOLE_DEFAULTS, PIHOLE_METRICS, PIHOLE_SECTIONS, piHoleMetricEntities } from "./pi-hole";
import { SONOS_CONTROLS } from "./sonos-controls";
import { CONSOLE_ENTITIES } from "./console";
import { editorHelper, localize, localizeText } from "./localize";
import { localizeEditorSchema } from "./localized-schema";
import { additionalEditorSchemaFor, editorSchemaFor, type EditorField } from "./editor-schema";
import { populatedDefaultsFor } from "./defaults";
import { wasteStreamsForConfig } from "./waste-streams";
import { sceneItemDefaultsFor } from "./scene-item-defaults";
import { ROOM_STATUS_KINDS, ROOM_STATUS_LIMIT, roomItemDefaultsFor, roomStatusKind, roomStatusIcon, roomStatusActive } from "./room";
import type {
  MiniGraphEntityConfig,
  MiniGraphShowConfig,
  MiniGraphStateMap,
  MiniGraphThreshold,
} from "./mini-graph";

type EditorSectionId = "context" | "content" | "layout" | "interactions" | "features";

const editorSections: Array<{ id: EditorSectionId; title: string; icon: string }> = [
  { id: "context", title: "Context", icon: "mdi:shape-outline" },
  { id: "content", title: "Content", icon: "mdi:format-align-left" },
  { id: "layout", title: "Layout", icon: "mdi:view-dashboard-outline" },
  { id: "interactions", title: "Interactions", icon: "mdi:gesture-tap" },
  { id: "features", title: "Features", icon: "mdi:view-list" },
];

const contentFields = new Set([
  "name", "secondary", "primary_info", "secondary_info", "icon", "icon_type", "icon_color",
  "show_icon", "show_name", "show_state", "unit", "icon_image",
  "mini_graph_show_state", "mini_graph_name_adaptive_color", "mini_graph_icon_adaptive_color",
]);
const layoutFields = new Set([
  "layout", "fill_container", "variant", "features_position", "multiline_secondary", "height", "line_width",
  "bar_spacing", "font_size", "font_size_header", "align_header", "align_icon", "align_state",
  "group", "mini_graph_show_fill", "mini_graph_show_points", "mini_graph_show_labels",
  "mini_graph_show_labels_secondary", "carousel_visible_items", "carousel_initial_index",
  "carousel_button_width", "carousel_button_height", "carousel_icon_size",
  "carousel_effect", "carousel_grab_cursor", "carousel_centered_slides",
  "carousel_slides_per_view", "carousel_coverflow_rotate", "carousel_coverflow_stretch",
  "carousel_coverflow_depth", "carousel_coverflow_modifier", "carousel_coverflow_slide_shadows",
  "carousel_navigation", "carousel_pagination", "carousel_pagination_type", "carousel_scrollbar",
]);
const interactionFields = new Set([
  "tap_action", "hold_action", "double_tap_action", "navigation_path", "settings_path",
]);
const welcomeWeatherLabels: Record<string, string> = {
  welcome_weather_icon: "icon",
  welcome_weather_icon_type: "icon_type",
  welcome_weather_primary_info: "primary_info",
  welcome_weather_secondary_info: "secondary_info",
  welcome_weather_date_format: "upcoming_date_format",
  welcome_weather_tap_action: "tap_action",
};

const sectionForField = (field: EditorField): EditorSectionId => {
  if (field.name === "pihole_device_ids") return "context";
  if (field.name === "pihole_show_header") return "content";
  if (/^pihole_(columns|accent_color|chart_height|chart_hours)$/.test(field.name)) return "layout";
  if (/^pihole_(pause_service|pause_action|duration_field|duration_format|metric_.*_action)$/.test(field.name)) return "interactions";
  if (["remote_entity", "remote_media_entity", "remote_device", "remote_transport", "remote_preset"].includes(field.name)) return "context";
  if (/^remote_(navigation|volume|button_size|touchpad_height|accent_color)$/.test(field.name)) return "layout";
  if (/^remote_(haptics|double_tap|double_tap_command|swipe_distance)$/.test(field.name)) return "interactions";
  if (field.name === "upcoming_data_attribute") return "context";
  if (/^upcoming_(title_text|line[1-4]_(text|color)|title_color|date_format|clock)$/.test(field.name)) return "content";
  if (/^upcoming_(image_style|item_height|corner_radius|max_columns|overflow|title_size|line_size|box_shadows|text_shadows|transparency)$/.test(field.name)) return "layout";
  if (/^upcoming_(item_behavior|item_action|url|trailers|links)$/.test(field.name)) return "interactions";
  if (field.name === "entity") return "context";
  if (field.name === "ulm_weather") return "context";
  if (field.name.startsWith("welcome_weather_") && !field.name.endsWith("_action")) return "content";
  if (interactionFields.has(field.name) || field.name.endsWith("_action")) return "interactions";
  if (
    layoutFields.has(field.name) ||
    field.name.endsWith("_horizontal") ||
    field.name.endsWith("_narrow_buttons")
  ) return "layout";
  if (contentFields.has(field.name)) return "content";
  return "features";
};

const groupEditorFields = (fields: EditorField[]): Record<EditorSectionId, EditorField[]> => {
  const grouped: Record<EditorSectionId, EditorField[]> = {
    context: [],
    content: [],
    layout: [],
    interactions: [],
    features: [],
  };
  for (const field of fields) {
    if (!field.schema?.length) {
      grouped[sectionForField(field)].push(field);
      continue;
    }
    const nestedGroups = new Map<EditorSectionId, EditorField[]>();
    for (const nested of field.schema) {
      const section = sectionForField(nested);
      nestedGroups.set(section, [...(nestedGroups.get(section) ?? []), nested]);
    }
    for (const [section, schema] of nestedGroups) grouped[section].push({ ...field, schema });
  }
  return grouped;
};

@customElement("mushroom-addition-editor")
export class MushroomAdditionEditor extends LitElement {
  public static styles = css`
    :host { display: block; }
    .editor-sections { display: grid; gap: 12px; }
    .editor-section { border-radius: 12px; overflow: hidden; }
    .section-header { display: inline-flex; align-items: center; gap: 10px; font-weight: 650; }
    .section-header ha-icon { --mdc-icon-size: 20px; color: var(--secondary-text-color); }
    .section-body { padding: 4px 16px 16px; }
    .item-editor { margin-top: 8px; }
    .item-editor h3 { margin: 0 0 8px; font-size: 15px; }
    .item-editor p { margin: 0 0 12px; color: var(--secondary-text-color); font-size: 12px; }
    .item-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-bottom: 10px; padding: 12px; border: 1px solid var(--divider-color); border-radius: 12px; }
    .item-row ha-selector, .item-row ha-textfield { min-width: 0; }
    .item-row .wide { grid-column: 1 / -1; }
    .item-row h4 { grid-column: 1 / -1; margin: 0; font-size: 13px; }
    .field { display: grid; gap: 5px; }
    .field > span { color: var(--secondary-text-color); font-size: 11px; }
    .field > small { color: var(--secondary-text-color); font-size: 11px; line-height: 1.35; }
    .item-actions { display: flex; justify-content: flex-end; gap: 8px; }
    button { border: 0; border-radius: 10px; padding: 8px 12px; background: var(--secondary-background-color); color: var(--primary-text-color); cursor: pointer; }
    button.add { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    .compact-controls { display: grid; gap: 8px; }
    .compact-control { display: flex; align-items: center; gap: 8px; padding: 5px 8px; border: 1px solid var(--divider-color); border-radius: 10px; min-width: 0; }
    .compact-control .row-label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; }
    .compact-control .handle { display: grid; place-items: center; cursor: grab; color: var(--secondary-text-color); }
    .compact-control ha-icon-button { --ha-icon-button-size: 32px; color: var(--secondary-text-color); }
    .compact-control ha-svg-icon { width: 24px; height: 24px; }
    .remote-detail { padding: 12px; border: 1px solid var(--divider-color); border-radius: 12px; }
  `;
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config?: AdditionConfig;
  @state() private remoteEditing?: number;
  @state() private piHoleMapping: PiHoleMetric = "queries";

  public setConfig(config: AdditionConfig): void {
    const tag = config.type.replace(/^custom:/, "");
    const alias = LEGACY_ALIASES.find((item) => item.tag === tag);
    this.config = {
      ...migrateRoomLightConfig(config),
      ...(tag === "mushroom-addition-upcoming-media-card" && config.upcoming_data_attribute === "friendly_name"
        ? { upcoming_data_attribute: "data" } : {}),
      variant: config.variant ?? alias?.variant,
    };
  }

  protected render() {
    if (!this.hass || !this.config) return nothing;
    const item = getCatalogItem(this.config.type.replace(/^custom:/, ""));
    if (!item) return nothing;
    const schema = editorSchemaFor(item, this.config, this.hass);
    const upstreamSchema = additionalEditorSchemaFor(item, this.config).filter((field) =>
      item.upstreamId !== "custom_card_trash" ||
      (!field.name.startsWith("ulm_card_datum_") && !field.name.includes("ophaling")));
    const groupedSchema = groupEditorFields([...schema, ...upstreamSchema]);
    const populatedDefaults = populatedDefaultsFor(item, this.hass, this.config.entity);
    const miniGraphShow = this.config.show as MiniGraphShowConfig | undefined;
    const formData = {
      ...populatedDefaults,
      ...this.config,
      ...(item.upstreamId === "pi_hole_card" ? {
        pihole_pause_durations: (this.config.pihole_pause_durations ?? PIHOLE_DEFAULTS.pihole_pause_durations).map(String),
      } : {}),
      ...(item.upstreamId === "custom_card_media_player_sonos" ? {
        ulm_card_media_player_power_button: this.config.ulm_card_media_player_power_button ??
          this.config.media_controls?.includes("on_off") ?? false,
        media_controls: (this.config.media_controls ?? populatedDefaults.media_controls)?.filter(control => control !== "on_off"),
      } : {}),
      ...(item.upstreamId === "mini_graph_card" ? {
        mini_graph_show_state: miniGraphShow?.state === "last"
          ? "last"
          : miniGraphShow?.state === false
            ? "hidden"
            : "current",
        mini_graph_show_fill: miniGraphShow?.fill === "fade"
          ? "fade"
          : miniGraphShow?.fill === false
            ? "hidden"
            : "solid",
        mini_graph_show_points: miniGraphShow?.points === true
          ? "always"
          : miniGraphShow?.points === false
            ? "hidden"
            : "hover",
        mini_graph_show_labels: miniGraphShow?.labels === true
          ? "always"
          : miniGraphShow?.labels === false
            ? "hidden"
            : "hover",
        mini_graph_show_labels_secondary: miniGraphShow?.labels_secondary === true
          ? "always"
          : miniGraphShow?.labels_secondary === false
            ? "hidden"
            : "hover",
        mini_graph_show_legend: miniGraphShow?.legend ?? true,
        mini_graph_show_average: miniGraphShow?.average ?? false,
        mini_graph_show_extrema: miniGraphShow?.extrema ?? false,
        mini_graph_name_adaptive_color: miniGraphShow?.name_adaptive_color ?? false,
        mini_graph_icon_adaptive_color: miniGraphShow?.icon_adaptive_color ?? false,
        mini_graph_loading_indicator: miniGraphShow?.loading_indicator ?? true,
      } : {}),
      ...(item.upstreamId === "custom_card_entity_carousel" ? {
        carousel_navigation: carouselControlEnabled(this.config, "navigation"),
        carousel_pagination: carouselControlEnabled(this.config, "pagination"),
        carousel_scrollbar: carouselControlEnabled(this.config, "scrollbar"),
        carousel_pagination_type: this.config.carousel_pagination_type ??
          (this.config.parameters?.pagination && typeof this.config.parameters.pagination === "object" ? this.config.parameters.pagination.type : undefined) ?? "bullets",
        carousel_effect: this.config.carousel_effect ??
          this.config.parameters?.effect ??
          "coverflow",
        carousel_grab_cursor: this.config.carousel_grab_cursor ??
          this.config.parameters?.grabCursor ??
          true,
        carousel_centered_slides: this.config.carousel_centered_slides ??
          this.config.parameters?.centeredSlides ??
          true,
        carousel_slides_per_view: String(
          this.config.carousel_slides_per_view ??
          this.config.parameters?.slidesPerView ??
          "auto",
        ),
        carousel_coverflow_rotate: this.config.carousel_coverflow_rotate ??
          this.config.parameters?.coverflowEffect?.rotate ??
          0,
        carousel_coverflow_stretch: this.config.carousel_coverflow_stretch ??
          this.config.parameters?.coverflowEffect?.stretch ??
          0,
        carousel_coverflow_depth: this.config.carousel_coverflow_depth ??
          this.config.parameters?.coverflowEffect?.depth ??
          400,
        carousel_coverflow_modifier: this.config.carousel_coverflow_modifier ??
          this.config.parameters?.coverflowEffect?.modifier ??
          1,
        carousel_coverflow_slide_shadows: this.config.carousel_coverflow_slide_shadows ??
          this.config.parameters?.coverflowEffect?.slideShadows ??
          true,
      } : {}),
      layout: (this.config.layout ?? populatedDefaults.layout) === "default"
        ? "horizontal"
        : this.config.layout ?? populatedDefaults.layout,
    };
    const customFeatures = item.upstreamId === "mini_graph_card"
      ? this.renderMiniGraphEditors()
      : item.upstreamId === "remote_card"
      ? this.renderRemoteEditor()
      : item.upstreamId === "pi_hole_card"
      ? this.renderPiHoleEditor()
      : item.upstreamId === "custom_card_trash"
      ? this.renderWasteStreamEditor()
      : item.upstreamId === "custom_card_media_player_sonos"
        ? this.renderSonosShortcutEditor()
      : item.upstreamId === "custom_card_entity_carousel"
        ? this.renderCarouselItemEditor()
      : item.family === "scene"
        ? this.renderItemEditor(
          "scene_items",
          localizeText(this.hass, "Scene buttons"),
          item.upstreamId === "card_welcome_scenes" ? undefined : ["scene"],
        )
        : item.upstreamId === "card_room"
          ? html`${this.renderItemEditor("room_sensors", localize(this.hass, "room_buttons"))}${this.renderRoomStatusEditor()}`
          : nothing;
    const hasCustomFeatures = item.upstreamId === "mini_graph_card" ||
      item.upstreamId === "remote_card" ||
      item.upstreamId === "pi_hole_card" ||
      item.upstreamId === "custom_card_trash" ||
      item.upstreamId === "custom_card_media_player_sonos" ||
      item.upstreamId === "custom_card_entity_carousel" ||
      item.family === "scene" ||
      item.upstreamId === "card_room";
    return html`
      <div class="editor-sections">
        ${editorSections.map((section) => this.renderEditorSection(
          section,
          groupedSchema[section.id],
          formData,
          section.id === "features" && hasCustomFeatures ? customFeatures
            : section.id === "content" && item.upstreamId === "custom_card_entity_carousel" ? html`
              <button @click=${() => {
                const next = clearCardIcon(this.config!);
                this.config = next;
                fireEvent(this, "config-changed", { config: next });
              }}>${localizeText(this.hass, "Use entity icon")}</button>
            `
            : section.id === "content" && item.upstreamId === "card_room" ? this.renderRoomSecondaryEditor() : nothing,
          section.id === "features" && hasCustomFeatures ||
            section.id === "content" && item.upstreamId === "card_room" && this.config?.secondary_info === "composed",
        ))}
      </div>
    `;
  }

  private renderEditorSection(
    section: { id: string; title: string; icon: string },
    schema: EditorField[],
    formData: AdditionConfig,
    customContent: TemplateResult | typeof nothing,
    hasCustomContent: boolean,
  ): TemplateResult | typeof nothing {
    if (!schema.length && !hasCustomContent) return nothing;
    return html`
      <ha-expansion-panel class="editor-section" outlined .expanded=${section.id === "primary"}>
        <span slot="header" class="section-header">
          <ha-icon .icon=${section.icon}></ha-icon>
          <span>${localizeText(this.hass, section.title)}</span>
        </span>
        <div class="section-body">
          ${schema.length ? html`
            <ha-form
              .hass=${this.hass}
              .data=${formData}
              .schema=${localizeEditorSchema(this.hass, schema)}
              .computeLabel=${this.computeLabel}
              .computeHelper=${this.computeHelper}
              @value-changed=${this.valueChanged}
            ></ha-form>
          ` : nothing}
          ${customContent}
        </div>
      </ha-expansion-panel>
    `;
  }

  private readonly computeLabel = (schema: { name: string }): string =>
    welcomeWeatherLabels[schema.name]
      ? `${localize(this.hass, "ulm_weather")}: ${localize(this.hass, welcomeWeatherLabels[schema.name]!)}`
      : this.config?.type.endsWith("pi-hole-card") && schema.name === "entity"
      ? localize(this.hass, "editor.pihole_entity")
      : this.config?.type.endsWith("upcoming-media-card") && schema.name === "entity"
      ? localize(this.hass, "editor.media_entity")
      : this.config?.type.endsWith("remote-card") && schema.name === "entity"
      ? localize(this.hass, "editor.remote_entity")
      : this.config?.type.includes("custom-card-trash") && schema.name === "entity"
      ? "Optional card entity"
      : this.config?.type.includes("custom-card-washer") && schema.name === "entity"
        ? localize(this.hass, "machine_state_entity")
      : localize(this.hass, schema.name);

  private renderPiHoleEditor() {
    const sections = this.config?.pihole_sections ?? PIHOLE_DEFAULTS.pihole_sections;
    const metric = this.piHoleMapping;
    const found = piHoleMetricEntities(this.hass, this.config!)[metric];
    const order = this.config?.pihole_entity_order ?? [];
    return html`<section class="item-editor pi-hole-features">
      <h3>${localize(this.hass, "ui.sections")}</h3><p>${localize(this.hass, "editor.sections_help")}</p>
      <ha-sortable handle-selector=".handle" @item-moved=${(event: CustomEvent<{ oldIndex: number; newIndex: number }>) => {
        event.stopPropagation(); this.movePiHoleSection(event.detail.oldIndex, event.detail.newIndex);
      }}><div class="compact-controls">${repeat(sections, section => section, (section, index) => html`<div class="compact-control">
        <span class="handle" role="button" tabindex="0" aria-label=${localize(this.hass, "editor.reorder", { name: localizeText(this.hass, PIHOLE_SECTIONS[section]) })} @keydown=${(event: KeyboardEvent) => {
          if (event.altKey && ["ArrowUp", "ArrowDown"].includes(event.key)) {
            event.preventDefault(); this.movePiHoleSection(index, index + (event.key === "ArrowUp" ? -1 : 1));
          }
        }}><ha-svg-icon .path=${mdiDragHorizontalVariant}></ha-svg-icon></span>
        <span class="row-label">${localizeText(this.hass, PIHOLE_SECTIONS[section])}</span>
        <ha-icon-button .path=${mdiDelete} .label=${localize(this.hass, "editor.remove", { name: localizeText(this.hass, PIHOLE_SECTIONS[section]) })} @click=${() => this.saveRemote({ pihole_sections: sections.filter((_, row) => row !== index) })}></ha-icon-button>
      </div>`)}</div></ha-sortable>
      <ha-selector aria-label=${localize(this.hass, "editor.add_section", { name: "Pi-hole" })} .hass=${this.hass} .value=${""}
        .selector=${{ select: { mode: "dropdown", options: Object.entries(PIHOLE_SECTIONS).filter(([key]) => !sections.includes(key as PiHoleSection)).map(([value, label]) => ({ value, label: localizeText(this.hass, label) })) } }}
        @value-changed=${(event: CustomEvent<{ value: PiHoleSection }>) => {
          event.stopPropagation();
          if (event.detail.value && !sections.includes(event.detail.value)) this.saveRemote({ pihole_sections: [...sections, event.detail.value] });
        }}></ha-selector>
      <details><summary>${localize(this.hass, "editor.mapping")}</summary><div class="section-body">
        <p>${localize(this.hass, "editor.mapping_help")}</p>
        <ha-selector aria-label=${localize(this.hass, "editor.metric")} .hass=${this.hass} .value=${metric}
          .selector=${{ select: { mode: "dropdown", options: Object.entries(PIHOLE_METRICS).map(([value, definition]) => ({ value, label: localizeText(this.hass, definition.name) })) } }}
          @value-changed=${(event: CustomEvent<{ value: PiHoleMetric }>) => {
            event.stopPropagation(); this.piHoleMapping = event.detail.value;
          }}></ha-selector>
        <p>${found.length ? localize(this.hass, "editor.mapped", { entities: found.map(entity => entity.attributes.friendly_name || entity.entity_id).join(", ") }) : localize(this.hass, "editor.no_sensor")}</p>
        <ha-selector aria-label=${localize(this.hass, "editor.sensor_override", { name: localizeText(this.hass, PIHOLE_METRICS[metric].name) })} .hass=${this.hass}
          .selector=${{ entity: { domain: "sensor", multiple: true } }} .value=${this.config?.pihole_metric_entities?.[metric] ?? []}
          @value-changed=${(event: CustomEvent<{ value: string[] }>) => {
            event.stopPropagation();
            const next = { ...this.config?.pihole_metric_entities };
            if (event.detail.value?.length) next[metric] = event.detail.value; else delete next[metric];
            this.saveRemote({ pihole_metric_entities: next });
          }}></ha-selector>
        <p>${localize(this.hass, "editor.order_help")}</p>
        <ha-selector aria-label=${localize(this.hass, "editor.priority_entities")} .hass=${this.hass}
          .selector=${{ entity: { multiple: true } }} .value=${order} @value-changed=${(event: CustomEvent<{ value: string[] }>) => {
            event.stopPropagation(); this.saveRemote({ pihole_entity_order: event.detail.value || [] });
          }}></ha-selector>
        <ha-sortable handle-selector=".handle" @item-moved=${(event: CustomEvent<{ oldIndex: number; newIndex: number }>) => {
          event.stopPropagation();
          const items = [...order], { oldIndex, newIndex } = event.detail;
          if (oldIndex < 0 || newIndex < 0 || oldIndex >= items.length || newIndex >= items.length) return;
          items.splice(newIndex, 0, items.splice(oldIndex, 1)[0]); this.saveRemote({ pihole_entity_order: items });
        }}><div class="compact-controls">${repeat(order, id => id, id => html`<div class="compact-control">
          <span class="handle"><ha-svg-icon .path=${mdiDragHorizontalVariant}></ha-svg-icon></span>
          <span class="row-label">${this.hass?.states[id]?.attributes.friendly_name || id}</span>
          <ha-icon-button .path=${mdiDelete} .label=${localize(this.hass, "editor.restore_order")} @click=${() => this.saveRemote({ pihole_entity_order: order.filter(entity => entity !== id) })}></ha-icon-button>
        </div>`)}</div></ha-sortable>
      </div></details>
    </section>`;
  }
  private movePiHoleSection(from: number, to: number): void {
    const sections = [...(this.config?.pihole_sections ?? PIHOLE_DEFAULTS.pihole_sections)];
    if (to < 0 || to >= sections.length || from < 0 || from >= sections.length || from === to) return;
    sections.splice(to, 0, sections.splice(from, 1)[0]);
    this.saveRemote({ pihole_sections: sections });
  }

  private renderRemoteEditor() {
    const sections = this.config?.remote_sections ?? REMOTE_DEFAULTS.remote_sections;
    const buttons = this.config?.remote_buttons ?? [];
    const selected = this.remoteEditing === undefined ? undefined : buttons[this.remoteEditing];
    const sourceList = resolveRemoteEntities(this.hass, this.config!).media?.attributes.source_list;
    const sources = Array.isArray(sourceList) ? sourceList.filter((value): value is string => typeof value === "string") : [];
    const mappings = Object.entries(this.config?.remote_commands ?? {});
    return html`<section class="item-editor remote-features">
      <h3>${localize(this.hass, "editor.remote_sections")}</h3><p>${localize(this.hass, "editor.remote_sections_help")}</p>
      <ha-sortable handle-selector=".handle" @item-moved=${(event: CustomEvent<{ oldIndex: number; newIndex: number }>) => {
        event.stopPropagation(); this.moveRemoteSection(event.detail.oldIndex, event.detail.newIndex);
      }}><div class="compact-controls">${repeat(sections, section => section, (section, index) => html`
        <div class="compact-control">
          <span class="handle" role="button" tabindex="0" aria-label=${localize(this.hass, "editor.reorder", { name: localizeText(this.hass, REMOTE_SECTIONS[section]) })}
            @keydown=${(event: KeyboardEvent) => {
              if (event.altKey && ["ArrowUp", "ArrowDown"].includes(event.key)) {
                event.preventDefault(); this.moveRemoteSection(index, index + (event.key === "ArrowUp" ? -1 : 1));
              }
            }}><ha-svg-icon .path=${mdiDragHorizontalVariant}></ha-svg-icon></span>
          <span class="row-label">${localizeText(this.hass, REMOTE_SECTIONS[section])}</span>
          <ha-icon-button .path=${mdiDelete} .label=${localize(this.hass, "editor.remove", { name: localizeText(this.hass, REMOTE_SECTIONS[section]) })} @click=${() => this.saveRemote({ remote_sections: sections.filter((_, row) => row !== index) })}></ha-icon-button>
        </div>`)}
      </div></ha-sortable>
      <ha-selector aria-label=${localize(this.hass, "editor.add_remote_section")} .hass=${this.hass} .value=${""}
        .selector=${{ select: { mode: "dropdown", options: Object.entries(REMOTE_SECTIONS).filter(([key]) => !sections.includes(key as RemoteSection)).map(([value, label]) => ({ value, label: localizeText(this.hass, label) })) } }}
        @value-changed=${(event: CustomEvent<{ value: RemoteSection }>) => {
          event.stopPropagation();
          if (event.detail.value && !sections.includes(event.detail.value)) this.saveRemote({ remote_sections: [...sections, event.detail.value] });
        }}></ha-selector>
      <h3>${localize(this.hass, "ui.custom_buttons")}</h3><p>${localize(this.hass, "editor.buttons_help")}</p>
      ${selected ? html`<div class="remote-detail"><ha-form .hass=${this.hass} .data=${selected}
        .computeLabel=${this.remoteButtonLabel} .schema=${localizeEditorSchema(this.hass, [
          { name: "type", selector: { select: { mode: "dropdown", options: [{ value: "command", label: "Remote command" }, { value: "source", label: "TV source" }, { value: "action", label: "Home Assistant action" }] } } },
          { type: "grid", name: "", schema: [{ name: "name", selector: { text: {} } }, { name: "icon", selector: { icon: {} } }] },
          { name: "color", selector: { ui_color: {} } },
          ...(selected.type === "action" ? [{ name: "action", selector: { ui_action: {} } }]
            : selected.type === "source" ? [{ name: "source", selector: { select: { mode: "dropdown", custom_value: true, options: sources } } }]
              : [{ name: "command", selector: { text: {} } }]),
        ])} @value-changed=${(event: CustomEvent<{ value: RemoteButtonConfig }>) => {
          event.stopPropagation();
          const next = [...buttons]; next[this.remoteEditing!] = { ...selected, ...event.detail.value };
          this.saveRemote({ remote_buttons: next });
        }}></ha-form><button @click=${() => { this.remoteEditing = undefined; }}>${localize(this.hass, "ui.done")}</button></div>` : nothing}
      <ha-sortable handle-selector=".handle" @item-moved=${(event: CustomEvent<{ oldIndex: number; newIndex: number }>) => {
        event.stopPropagation(); this.moveRemoteButton(event.detail.oldIndex, event.detail.newIndex);
      }}><div class="compact-controls">${buttons.map((button, index) => html`
        <div class="compact-control">
          <span class="handle" role="button" tabindex="0" aria-label=${localize(this.hass, "editor.reorder_button")}
            @keydown=${(event: KeyboardEvent) => {
              if (event.altKey && ["ArrowUp", "ArrowDown"].includes(event.key)) {
                event.preventDefault(); this.moveRemoteButton(index, index + (event.key === "ArrowUp" ? -1 : 1));
              }
            }}><ha-svg-icon .path=${mdiDragHorizontalVariant}></ha-svg-icon></span>
          <span class="row-label">${button.name || button.source || button.command || localize(this.hass, "editor.button_number", { number: index + 1 })}</span>
          <ha-icon-button .path=${mdiPencil} .label=${localize(this.hass, "editor.edit_button")} @click=${() => { this.remoteEditing = index; }}></ha-icon-button>
          <ha-icon-button .path=${mdiDelete} .label=${localize(this.hass, "editor.remove_button")} @click=${() => {
            this.remoteEditing = undefined;
            this.saveRemote({ remote_buttons: buttons.filter((_, row) => row !== index) });
          }}></ha-icon-button>
        </div>`)}
      </div></ha-sortable>
      <button class="add" @click=${() => {
        this.remoteEditing = buttons.length;
        this.saveRemote({ remote_buttons: [...buttons, { type: "command", name: "", icon: "mdi:remote", command: "" }],
          remote_sections: sections.includes("shortcuts") ? sections : [...sections, "shortcuts"] });
      }}>${localize(this.hass, "editor.add_button")}</button>
      <h3>${localize(this.hass, "editor.key_mappings")}</h3><p>${localize(this.hass, "editor.commands_help")}</p>
      ${mappings.map(([key, command]) => html`<div class="compact-control">
        <span class="row-label">${localizeText(this.hass, REMOTE_KEYS.find(item => item.value === key)?.label || key)}</span>
        <ha-selector .hass=${this.hass} .selector=${{ text: {} }} .value=${command} @value-changed=${(event: CustomEvent<{ value: string }>) => {
          event.stopPropagation(); this.saveRemote({ remote_commands: { ...this.config?.remote_commands, [key]: event.detail.value } });
        }}></ha-selector>
        <ha-icon-button .path=${mdiDelete} .label=${localize(this.hass, "editor.restore_command")} @click=${() => {
          const next = { ...this.config?.remote_commands }; delete next[key]; this.saveRemote({ remote_commands: next });
        }}></ha-icon-button>
      </div>`)}
      <ha-selector aria-label=${localize(this.hass, "editor.override_command")} .hass=${this.hass} .value=${""}
        .selector=${{ select: { mode: "dropdown", options: [...REMOTE_KEYS, ...Array.from({ length: 10 }, (_, value) => ({ value: String(value), label: String(value) }))].filter(item => !Object.hasOwn(this.config?.remote_commands ?? {}, item.value)).map(item => ({ ...item, label: localizeText(this.hass, item.label) })) } }}
        @value-changed=${(event: CustomEvent<{ value: string }>) => {
          event.stopPropagation();
          if (event.detail.value) this.saveRemote({ remote_commands: { ...this.config?.remote_commands, [event.detail.value]: "" } });
        }}></ha-selector>
    </section>`;
  }
  private readonly remoteButtonLabel = (schema: { name: string }): string =>
    localizeText(this.hass, ({ type: "Button type", name: "Label", icon: "Icon", color: "Icon color", command: "Command code", source: "TV source", action: "Action" })[schema.name] || schema.name);
  private saveRemote(value: Partial<AdditionConfig>): void {
    if (!this.config) return;
    this.config = { ...this.config, ...value };
    fireEvent(this, "config-changed", { config: this.config });
  }
  private moveRemoteSection(from: number, to: number): void {
    const sections = [...(this.config?.remote_sections ?? REMOTE_DEFAULTS.remote_sections)];
    if (to < 0 || to >= sections.length || from < 0 || from >= sections.length || from === to) return;
    sections.splice(to, 0, sections.splice(from, 1)[0]);
    this.saveRemote({ remote_sections: sections });
  }
  private moveRemoteButton(from: number, to: number): void {
    const buttons = [...(this.config?.remote_buttons ?? [])];
    if (to < 0 || to >= buttons.length || from < 0 || from >= buttons.length || from === to) return;
    const selected = this.remoteEditing === undefined ? undefined : buttons[this.remoteEditing];
    buttons.splice(to, 0, buttons.splice(from, 1)[0]);
    this.remoteEditing = selected ? buttons.indexOf(selected) : undefined;
    this.saveRemote({ remote_buttons: buttons });
  }

  private readonly computeHelper = (schema: { name: string }): string | undefined =>
    editorHelper(
      this.config?.type.includes("custom-card-washer") && schema.name === "entity"
        ? "machine_state_entity"
        : schema.name,
      this.hass,
    );

  private readonly valueChanged = (event: CustomEvent): void => {
    if (!this.config || !event.detail.value) return;
    const value = event.detail.value as Record<string, unknown>;
    const changed = { ...this.config, ...value } as AdditionConfig;
    const next = Object.prototype.hasOwnProperty.call(value, "icon") && !value.icon
      ? clearCardIcon(changed) : changed;
    if (this.config.type.includes("mini-graph-card")) {
      const show = { ...(this.config.show as MiniGraphShowConfig | undefined) };
      const showMappings: Record<string, keyof MiniGraphShowConfig> = {
        mini_graph_show_legend: "legend",
        mini_graph_show_average: "average",
        mini_graph_show_extrema: "extrema",
        mini_graph_name_adaptive_color: "name_adaptive_color",
        mini_graph_icon_adaptive_color: "icon_adaptive_color",
        mini_graph_loading_indicator: "loading_indicator",
      };
      for (const [formKey, showKey] of Object.entries(showMappings)) {
        if (Object.prototype.hasOwnProperty.call(value, formKey)) {
          Object.assign(show, { [showKey]: value[formKey] });
          delete next[formKey];
        }
      }
      if (typeof value.mini_graph_show_state === "string") {
        show.state = value.mini_graph_show_state === "last"
          ? "last"
          : value.mini_graph_show_state === "hidden"
            ? false
            : true;
        delete next.mini_graph_show_state;
      }
      for (const [formKey, showKey] of [
        ["mini_graph_show_fill", "fill"],
        ["mini_graph_show_points", "points"],
        ["mini_graph_show_labels", "labels"],
        ["mini_graph_show_labels_secondary", "labels_secondary"],
      ] as const) {
        const selected = value[formKey];
        if (typeof selected !== "string") continue;
        Object.assign(show, {
          [showKey]: selected === "fade"
            ? "fade"
            : selected === "hover"
              ? "hover"
              : selected === "hidden"
                ? false
                : true,
        });
        delete next[formKey];
      }
      if (value.variant === "line" || value.variant === "bar") {
        show.graph = value.variant;
      }
      next.show = show;
      if (typeof value.entity === "string" && value.entity !== this.config.entity) {
        const entries = this.miniGraphEntities();
        if (entries.length) entries[0] = { ...entries[0], entity: value.entity };
        else entries.push({ entity: value.entity });
        next.entities = entries as unknown as string[];
      }
    }
    if (
      Object.prototype.hasOwnProperty.call(value, "name") &&
      JSON.stringify(value.name) !== JSON.stringify(this.config.name)
    ) {
      delete next.name_mode;
    }
    if (
      this.config.type.includes("media-player-sonos") &&
      typeof value.entity === "string" &&
      value.entity !== this.config.entity
    ) {
      for (const { configKey } of SONOS_CONTROLS) {
        if (this.config[configKey] === undefined) delete next[configKey];
      }
    }
    if (
      this.config.type.includes("custom-card-playstation") &&
      typeof value.entity === "string" &&
      value.entity !== this.config.entity
    ) {
      for (const { configKey } of CONSOLE_ENTITIES) {
        if (this.config[configKey] === undefined) delete next[configKey];
      }
    }
    this.config = next;
    fireEvent(this, "config-changed", { config: next });
  };

  private renderItemEditor(
    key: "scene_items" | "room_sensors",
    title: string,
    domains?: string[],
  ) {
    if (!this.config) return nothing;
    const configuredItems = this.config[key];
    const selectedItems = key === "scene_items"
      ? configuredItems?.length ? configuredItems : undefined
      : configuredItems;
    const items: AdditionItemConfig[] = (selectedItems ??
      (this.config.entities ?? []).map((entity) => ({ entity })))
      .map((item) => key === "scene_items"
        ? { ...sceneItemDefaultsFor(this.hass, item.entity), ...item }
        : { ...roomItemDefaultsFor(this.hass, item.entity), ...item });
    return html`
      <section class="item-editor">
        <h3>${title}</h3>
        <p>${key === "scene_items"
          ? localizeText(this.hass, "Each button starts with sensible values from its entity. You can override every value, including its name.")
          : localize(this.hass, "room_buttons_help")}</p>
        ${items.map((item, index) => html`
          <div class="item-row">
            <label class="field wide">
              <span>${localizeText(this.hass, "Button entity")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ entity: domains?.length ? { domain: domains } : {} }}
                .value=${item.entity}
                @value-changed=${(event: CustomEvent) => this.updateItem(key, index, "entity", event.detail.value)}
              ></ha-selector>
              <small>${key === "scene_items"
                ? localizeText(this.hass, "Select the entity this button controls. Welcome Scenes supports every Home Assistant domain.")
                : localizeText(this.hass, "Select the entity represented by this room sensor button.")}</small>
            </label>
            ${key === "scene_items" ? html`<label class="field">
              <span>${localizeText(this.hass, "Custom name")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${item.name ?? item.label ?? ""}
                @value-changed=${(event: CustomEvent) =>
                  this.updateItem(key, index, "name", event.detail.value)}
              ></ha-selector>
              <small>${localizeText(this.hass, "Text shown below the button. Change it independently for every button.")}</small>
            </label>` : nothing}
            <label class="field">
              <span>${localizeText(this.hass, "Icon")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ icon: {} }}
                .value=${item.icon}
                @value-changed=${(event: CustomEvent) => this.updateItem(key, index, "icon", event.detail.value)}
              ></ha-selector>
              <small>${localizeText(this.hass, "Defaults to the entity icon or a suitable icon for its domain.")}</small>
            </label>
            ${key === "room_sensors" || key === "scene_items" ? html`
              <label class="field item-icon-type">
                <span>${localizeText(this.hass, "Icon type")}</span>
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{ select: {
                    mode: "dropdown",
                    options: [
                      { value: "icon", label: localizeText(this.hass, "Icon") },
                      { value: "entity-picture", label: localizeText(this.hass, "Entity picture") },
                    ],
                  } }}
                  .value=${item.icon_type ?? "icon"}
                  @value-changed=${(event: CustomEvent) =>
                    this.updateItem(key, index, "icon_type", event.detail.value)}
                ></ha-selector>
                <small>${localizeText(this.hass, "Show the selected icon or the entity picture when one is available.")}</small>
              </label>
            ` : nothing}
            <label class="field">
              <span>${localizeText(this.hass, "Color")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_color: { default_color: key === "room_sensors" ? "blue" : "purple" } }}
                .value=${item.color}
                @value-changed=${(event: CustomEvent) => this.updateItem(key, index, "color", event.detail.value)}
              ></ha-selector>
              <small>${localizeText(this.hass, "Accent color used by the button and its active state.")}</small>
            </label>
            ${key === "scene_items" ? html`
              <label class="field">
                <span>${localizeText(this.hass, "Navigation path")}</span>
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{ navigation: {} }}
                  .value=${item.navigation_path ?? item.nav_path ?? ""}
                  @value-changed=${(event: CustomEvent) =>
                    this.updateItem(key, index, "navigation_path", event.detail.value)}
                ></ha-selector>
                <small>${localizeText(this.hass, "Optional destination selected from your Home Assistant dashboards. It overrides the tap action.")}</small>
              </label>
            ` : nothing}
            ${key === "room_sensors" ? html`
              <label class="field">
                <span>${localize(this.hass, "active_state")}</span>
                <ha-selector .hass=${this.hass} .selector=${{ text: {} }} .value=${item.active_state}
                  @value-changed=${(event: CustomEvent) => this.updateItem(key, index, "active_state", event.detail.value)}></ha-selector>
                <small>${localize(this.hass, "room_active_state_help")}</small>
              </label>
              ${(["hold_action", "double_tap_action"] as const).map((field) => html`
                <label class="field">
                  <span>${localize(this.hass, field)}</span>
                  <ha-selector .hass=${this.hass} .selector=${{ ui_action: {} }} .value=${item[field]}
                    @value-changed=${(event: CustomEvent) => this.updateItem(key, index, field, event.detail.value)}></ha-selector>
                </label>
              `)}
            ` : nothing}
            <label class="field">
              <span>${localizeText(this.hass, "Tap action")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_action: {} }}
                .value=${item.tap_action}
                @value-changed=${(event: CustomEvent) => this.updateItem(key, index, "tap_action", event.detail.value)}
              ></ha-selector>
              <small>${key === "scene_items" ? "Defaults to activating scenes and toggling other supported entities." : localize(this.hass, "room_button_action_help")}</small>
            </label>
            <div class="item-actions wide">
              ${key === "room_sensors" ? html`
                <button class="move-up" ?disabled=${index === 0}
                  @click=${() => this.moveRoomSensor(index, -1)}>${localize(this.hass, "room_move_up")}</button>
                <button class="move-down" ?disabled=${index === items.length - 1}
                  @click=${() => this.moveRoomSensor(index, 1)}>${localize(this.hass, "room_move_down")}</button>
              ` : nothing}
              <button @click=${() => this.removeItem(key, index)}>${localizeText(this.hass, "Remove")}</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${() => this.addItem(key)}>${localizeText(this.hass, "Add button")}</button>
      </section>
    `;
  }

  private renderRoomSecondaryEditor() {
    if (this.config?.secondary_info !== "composed") return nothing;
    const parts = this.config.room_secondary_parts ?? [];
    const types: RoomSecondaryPart["type"][] = ["text", "name", "state", "brightness", "temperature", "attribute"];
    return html`<section class="item-editor room-secondary-editor">
      <p>${localize(this.hass, "room_secondary_help")}</p>
      ${parts.map((part, index) => html`<div class="item-row">
        <label class="field">
          <span>${localize(this.hass, "room_secondary_value")}</span>
          <ha-selector .hass=${this.hass} .selector=${{ select: { mode: "dropdown", options: types.map((value) => ({
            value, label: localize(this.hass, `room_part_${value}`),
          })) } }} .value=${part.type}
            @value-changed=${(event: CustomEvent) => {
              if (!types.includes(event.detail.value)) return;
              this.updateRoomSecondaryPart(index, { type: event.detail.value } as RoomSecondaryPart);
            }}></ha-selector>
        </label>
        ${part.type === "text" || part.type === "attribute" ? html`<label class="field">
          <span>${localize(this.hass, `room_part_${part.type}`)}</span>
          <ha-selector .hass=${this.hass}
            .selector=${part.type === "attribute" ? { attribute: { entity_id: this.config?.entity } } : { text: {} }}
            .value=${part.type === "text" ? part.text ?? "" : part.attribute ?? ""}
            @value-changed=${(event: CustomEvent) => {
              this.updateRoomSecondaryPart(index, part.type === "text" ? { type: "text", text: event.detail.value }
                : { type: "attribute", attribute: event.detail.value });
            }}></ha-selector>
        </label>` : nothing}
        <div class="item-actions wide">
          <button class="move-up" ?disabled=${index === 0}
            @click=${() => this.moveRoomSecondary(index, -1)}>${localize(this.hass, "room_move_up")}</button>
          <button class="move-down" ?disabled=${index === parts.length - 1}
            @click=${() => this.moveRoomSecondary(index, 1)}>${localize(this.hass, "room_move_down")}</button>
          <button class="remove" @click=${() => this.saveRoomSecondary((this.config?.room_secondary_parts ?? []).filter((_, row) => row !== index))}>${localize(this.hass, "room_part_remove")}</button>
        </div>
      </div>`)}
      <button class="add" @click=${() => this.saveRoomSecondary([...(this.config?.room_secondary_parts ?? []), { type: "state" }])}>${localize(this.hass, "room_part_add")}</button>
    </section>`;
  }

  private saveRoomSecondary(parts: RoomSecondaryPart[]): void {
    if (!this.config) return;
    this.config = { ...this.config, room_secondary_parts: parts };
    fireEvent(this, "config-changed", { config: this.config });
  }

  private updateRoomSecondaryPart(index: number, part: RoomSecondaryPart): void {
    const parts = [...(this.config?.room_secondary_parts ?? [])];
    parts[index] = part;
    this.saveRoomSecondary(parts);
  }

  private moveRoomSecondary(index: number, offset: number): void {
    const parts = [...(this.config?.room_secondary_parts ?? [])];
    const target = index + offset;
    if (target < 0 || target >= parts.length) return;
    [parts[index], parts[target]] = [parts[target], parts[index]];
    this.saveRoomSecondary(parts);
  }

  private moveRoomSensor(index: number, offset: number): void {
    if (!this.config) return;
    const items = [...(this.config.room_sensors ?? (this.config.entities ?? []).map((entity) => ({ entity })))];
    const target = index + offset;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    this.updateItems("room_sensors", items);
  }

  private renderRoomStatusEditor() {
    const items = (this.config?.room_status ?? []).slice(0, ROOM_STATUS_LIMIT);
    return html`<section class="item-editor room-status-editor">
      <h3>${localize(this.hass, "room_status")}</h3>
      <p>${localize(this.hass, "room_status_help")}</p>
      ${items.map((item, index) => {
        const entity = this.hass?.states[item.entity];
        const kind = item.kind ?? roomStatusKind(entity);
        return html`<div class="item-row">
          <label class="field">
            <span>${localize(this.hass, "entity")}</span>
            <ha-selector .hass=${this.hass} .selector=${{ entity: {} }} .value=${item.entity}
              @value-changed=${(event: CustomEvent) => this.updateRoomStatus(index, "entity", event.detail.value)}></ha-selector>
          </label>
          <label class="field">
            <span>${localize(this.hass, "room_status_kind")}</span>
            <ha-selector .hass=${this.hass} .selector=${{ select: { mode: "dropdown", options: ROOM_STATUS_KINDS.map((value) => ({
              value, label: localize(this.hass, `room_status_${value}`),
            })) } }} .value=${kind}
              @value-changed=${(event: CustomEvent) => this.updateRoomStatus(index, "kind", event.detail.value)}></ha-selector>
          </label>
          <span class="room-status-preview wide" aria-label=${localize(this.hass, "room_status_preview")}>
            <ha-icon .icon=${entity?.attributes.icon || roomStatusIcon(kind, roomStatusActive(entity, kind))}></ha-icon>
            ${entity?.attributes.friendly_name || item.entity || localize(this.hass, "room_status_choose_entity")}
          </span>
          <div class="item-actions wide"><button @click=${() => this.removeRoomStatus(index)}>${localize(this.hass, "room_status_remove")}</button></div>
        </div>`;
      })}
      <button class="add" ?disabled=${items.length >= ROOM_STATUS_LIMIT}
        @click=${() => this.saveRoomStatus([...items, { entity: "", kind: "window" }])}>${localize(this.hass, "room_status_add")}</button>
    </section>`;
  }

  private updateRoomStatus(index: number, field: keyof RoomStatusConfig, value: string): void {
    const items = [...(this.config?.room_status ?? [])].slice(0, ROOM_STATUS_LIMIT);
    const current = items[index];
    if (!current) return;
    const next = { ...current, [field]: value };
    if (field === "entity") {
      const oldKind = roomStatusKind(this.hass?.states[current.entity]);
      if (!current.entity || current.kind === undefined || current.kind === oldKind) {
        next.kind = roomStatusKind(this.hass?.states[value]);
      }
    }
    items[index] = next;
    this.saveRoomStatus(items);
  }

  private removeRoomStatus(index: number): void {
    this.saveRoomStatus((this.config?.room_status ?? []).filter((_, row) => row !== index));
  }

  private saveRoomStatus(items: RoomStatusConfig[]): void {
    if (!this.config) return;
    this.config = { ...this.config, room_status: items.slice(0, ROOM_STATUS_LIMIT) };
    fireEvent(this, "config-changed", { config: this.config });
  }

  private miniGraphEntities(): MiniGraphEntityConfig[] {
    const raw = this.config?.entities as unknown;
    const entries = Array.isArray(raw) ? raw : [];
    const normalized = entries.flatMap((entry) => {
      if (typeof entry === "string") return [{ entity: entry }];
      if (entry && typeof entry === "object" && typeof (entry as MiniGraphEntityConfig).entity === "string") {
        return [{ ...(entry as MiniGraphEntityConfig) }];
      }
      return [];
    });
    if (!normalized.length && this.config?.entity) normalized.push({ entity: this.config.entity });
    return normalized;
  }

  private miniGraphThresholds(): MiniGraphThreshold[] {
    const raw = this.config?.color_thresholds as unknown;
    return Array.isArray(raw)
      ? raw.flatMap((entry) =>
        typeof entry === "string"
          ? [{ color: entry }]
          : entry && typeof entry === "object" && typeof (entry as MiniGraphThreshold).color === "string"
            ? [{ ...(entry as MiniGraphThreshold) }]
            : [])
      : [];
  }

  private miniGraphStateMap(): MiniGraphStateMap[] {
    const raw = this.config?.state_map as unknown;
    return Array.isArray(raw)
      ? raw.flatMap((entry) =>
        entry && typeof entry === "object" && typeof (entry as MiniGraphStateMap).value === "string"
          ? [{ ...(entry as MiniGraphStateMap) }]
          : [])
      : [];
  }

  private renderMiniGraphEditors(): TemplateResult {
    const entities = this.miniGraphEntities();
    const thresholds = this.miniGraphThresholds();
    const stateMap = this.miniGraphStateMap();
    const aggregateOptions = [
      { value: "avg", label: "Average" },
      { value: "median", label: "Median" },
      { value: "min", label: "Minimum" },
      { value: "max", label: "Maximum" },
      { value: "first", label: "First" },
      { value: "last", label: "Last" },
      { value: "sum", label: "Sum" },
      { value: "delta", label: "Range" },
      { value: "diff", label: "Difference" },
    ].map(option => ({ ...option, label: localizeText(this.hass, option.label) }));
    const booleanFields: Array<[keyof MiniGraphEntityConfig, string]> = [
      ["show_state", "Show state"],
      ["show_legend_state", "State in legend"],
      ["show_indicator", "Color indicator"],
      ["show_graph", "Include in graph"],
      ["show_line", "Show line"],
      ["show_fill", "Show fill"],
      ["show_points", "Show points"],
      ["show_legend", "Show in legend"],
      ["state_adaptive_color", "Adaptive state color"],
      ["fixed_value", "Use fixed current value"],
      ["smoothing", "Smooth this line"],
    ];
    return html`
      <section class="item-editor mini-graph-entities">
        <h3>${localizeText(this.hass, "Graph entities")}</h3>
        <p>${localizeText(this.hass, "Entities are rendered in this order. Every series can override aggregation, axis, color, visibility, attributes, and smoothing.")}</p>
        ${entities.map((entry, index) => html`
          <div class="item-row mini-graph-entity-row" data-entity-index=${index}>
            <h4>${entry.name || entry.entity || localize(this.hass, "ui.renderer.entity_number", { number: index + 1 })}</h4>
            <label class="field wide">
              <span>${localizeText(this.hass, "Entity")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ entity: { domain: ["sensor", "binary_sensor", "input_number"] } }}
                .value=${entry.entity}
                @value-changed=${(event: CustomEvent) =>
                  this.updateMiniGraphEntity(index, "entity", event.detail.value)}
              ></ha-selector>
              <small>${localizeText(this.hass, "Recorder history is loaded for this entity. The first entity is also the primary card entity.")}</small>
            </label>
            <label class="field">
              <span>${localizeText(this.hass, "Name")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${entry.name ?? ""}
                @value-changed=${(event: CustomEvent) =>
                  this.updateMiniGraphEntity(index, "name", event.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>${localizeText(this.hass, "Attribute path")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${entry.attribute ?? ""}
                @value-changed=${(event: CustomEvent) =>
                  this.updateMiniGraphEntity(index, "attribute", event.detail.value)}
              ></ha-selector>
              <small>${localizeText(this.hass, "Optional nested path such as battery.level.")}</small>
            </label>
            <label class="field">
              <span>${localizeText(this.hass, "Color")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_color: { default_color: "blue" } }}
                .value=${entry.color}
                @value-changed=${(event: CustomEvent) =>
                  this.updateMiniGraphEntity(index, "color", event.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>${localizeText(this.hass, "Unit override")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${entry.unit ?? ""}
                @value-changed=${(event: CustomEvent) =>
                  this.updateMiniGraphEntity(index, "unit", event.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>${localizeText(this.hass, "Aggregation")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ select: { mode: "dropdown", options: aggregateOptions } }}
                .value=${entry.aggregate_func ?? this.config?.aggregate_func ?? "avg"}
                @value-changed=${(event: CustomEvent) =>
                  this.updateMiniGraphEntity(index, "aggregate_func", event.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>${localizeText(this.hass, "Y-axis")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ select: {
                  mode: "dropdown",
                  options: [
                    { value: "primary", label: localizeText(this.hass, "Primary (left)") },
                    { value: "secondary", label: localizeText(this.hass, "Secondary (right)") },
                  ],
                } }}
                .value=${entry.y_axis ?? "primary"}
                @value-changed=${(event: CustomEvent) =>
                  this.updateMiniGraphEntity(index, "y_axis", event.detail.value)}
              ></ha-selector>
            </label>
            ${booleanFields.map(([field, label]) => html`
              <label class="field">
                <span>${localizeText(this.hass, label)}</span>
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{ boolean: {} }}
                  .value=${entry[field] ?? (
                    ["show_graph", "show_line", "show_fill", "show_points", "show_legend"].includes(field)
                  )}
                  @value-changed=${(event: CustomEvent) =>
                    this.updateMiniGraphEntity(index, field, event.detail.value)}
                ></ha-selector>
              </label>
            `)}
            <div class="item-actions wide">
              <button ?disabled=${index === 0} @click=${() => this.moveMiniGraphEntity(index, -1)}>${localizeText(this.hass, "Move up")}</button>
              <button ?disabled=${index === entities.length - 1}
                @click=${() => this.moveMiniGraphEntity(index, 1)}>${localizeText(this.hass, "Move down")}</button>
              <button @click=${() => this.removeMiniGraphEntity(index)}>${localizeText(this.hass, "Remove")}</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${this.addMiniGraphEntity}>${localizeText(this.hass, "Add graph entity")}</button>
      </section>
      <section class="item-editor mini-graph-thresholds">
        <h3>${localizeText(this.hass, "Color thresholds")}</h3>
        <p>${localizeText(this.hass, "Ordered value stops color the graph. Leave intermediate values empty to interpolate them between surrounding stops.")}</p>
        ${thresholds.map((entry, index) => html`
          <div class="item-row mini-graph-threshold-row" data-threshold-index=${index}>
            <h4>${localize(this.hass, "ui.renderer.threshold_number", { number: index + 1 })}</h4>
            <label class="field">
              <span>${localizeText(this.hass, "Value")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ number: { mode: "box", step: "any" } }}
                .value=${entry.value}
                @value-changed=${(event: CustomEvent) =>
                  this.updateMiniGraphThreshold(index, "value", event.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>${localizeText(this.hass, "Color")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_color: { default_color: "blue" } }}
                .value=${entry.color}
                @value-changed=${(event: CustomEvent) =>
                  this.updateMiniGraphThreshold(index, "color", event.detail.value)}
              ></ha-selector>
            </label>
            <div class="item-actions wide">
              <button ?disabled=${index === 0} @click=${() => this.moveMiniGraphThreshold(index, -1)}>${localizeText(this.hass, "Move up")}</button>
              <button ?disabled=${index === thresholds.length - 1}
                @click=${() => this.moveMiniGraphThreshold(index, 1)}>${localizeText(this.hass, "Move down")}</button>
              <button @click=${() => this.removeMiniGraphThreshold(index)}>${localizeText(this.hass, "Remove")}</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${this.addMiniGraphThreshold}>${localizeText(this.hass, "Add color threshold")}</button>
      </section>
      <section class="item-editor mini-graph-state-map">
        <h3>${localizeText(this.hass, "State map")}</h3>
        <p>${localizeText(this.hass, "Map non-numeric states to ordered graph levels. Row order defines each state's numeric position.")}</p>
        ${stateMap.map((entry, index) => html`
          <div class="item-row mini-graph-state-row" data-state-index=${index}>
            <h4>${localize(this.hass, "ui.renderer.state_number", { number: index + 1 })}</h4>
            <label class="field">
              <span>${localizeText(this.hass, "Entity state")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${entry.value}
                @value-changed=${(event: CustomEvent) =>
                  this.updateMiniGraphState(index, "value", event.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>${localizeText(this.hass, "Display label")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${entry.label ?? ""}
                @value-changed=${(event: CustomEvent) =>
                  this.updateMiniGraphState(index, "label", event.detail.value)}
              ></ha-selector>
            </label>
            <div class="item-actions wide">
              <button ?disabled=${index === 0} @click=${() => this.moveMiniGraphState(index, -1)}>${localizeText(this.hass, "Move up")}</button>
              <button ?disabled=${index === stateMap.length - 1}
                @click=${() => this.moveMiniGraphState(index, 1)}>${localizeText(this.hass, "Move down")}</button>
              <button @click=${() => this.removeMiniGraphState(index)}>${localizeText(this.hass, "Remove")}</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${this.addMiniGraphState}>${localizeText(this.hass, "Add state mapping")}</button>
      </section>
    `;
  }

  private updateMiniGraphEntity(
    index: number,
    field: keyof MiniGraphEntityConfig,
    value: unknown,
  ): void {
    const entities = this.miniGraphEntities();
    entities[index] = { ...entities[index], [field]: value === "" ? undefined : value };
    this.updateMiniGraphConfig({
      entities: entities as unknown as string[],
      entity: entities[0]?.entity,
    });
  }

  private readonly addMiniGraphEntity = (): void => {
    const entities = this.miniGraphEntities();
    const selected = new Set(entities.map((entry) => entry.entity));
    const entity = Object.keys(this.hass?.states ?? {}).find((entityId) =>
      !selected.has(entityId) &&
      ["sensor", "binary_sensor", "input_number"].includes(entityId.split(".", 1)[0])) ?? "";
    entities.push({ entity, show_graph: true, show_line: true, show_fill: true, show_points: true, show_legend: true });
    this.updateMiniGraphConfig({ entities: entities as unknown as string[] });
  };

  private removeMiniGraphEntity(index: number): void {
    const entities = this.miniGraphEntities().filter((_, entityIndex) => entityIndex !== index);
    this.updateMiniGraphConfig({
      entities: entities as unknown as string[],
      entity: entities[0]?.entity,
    });
  }

  private moveMiniGraphEntity(index: number, direction: -1 | 1): void {
    const entities = this.miniGraphEntities();
    const target = index + direction;
    if (target < 0 || target >= entities.length) return;
    [entities[index], entities[target]] = [entities[target], entities[index]];
    this.updateMiniGraphConfig({
      entities: entities as unknown as string[],
      entity: entities[0]?.entity,
    });
  }

  private updateMiniGraphThreshold(
    index: number,
    field: keyof MiniGraphThreshold,
    value: unknown,
  ): void {
    const thresholds = this.miniGraphThresholds();
    thresholds[index] = {
      ...thresholds[index],
      [field]: value === "" || value === undefined ? undefined : value,
    } as MiniGraphThreshold;
    this.updateMiniGraphConfig({ color_thresholds: thresholds });
  }

  private readonly addMiniGraphThreshold = (): void => {
    this.updateMiniGraphConfig({
      color_thresholds: [...this.miniGraphThresholds(), { color: "#03a9f4" }],
    });
  };

  private removeMiniGraphThreshold(index: number): void {
    this.updateMiniGraphConfig({
      color_thresholds: this.miniGraphThresholds().filter((_, thresholdIndex) => thresholdIndex !== index),
    });
  }

  private moveMiniGraphThreshold(index: number, direction: -1 | 1): void {
    const thresholds = this.miniGraphThresholds();
    const target = index + direction;
    if (target < 0 || target >= thresholds.length) return;
    [thresholds[index], thresholds[target]] = [thresholds[target], thresholds[index]];
    this.updateMiniGraphConfig({ color_thresholds: thresholds });
  }

  private updateMiniGraphState(
    index: number,
    field: keyof MiniGraphStateMap,
    value: unknown,
  ): void {
    const stateMap = this.miniGraphStateMap();
    stateMap[index] = { ...stateMap[index], [field]: value === "" ? undefined : value } as MiniGraphStateMap;
    this.updateMiniGraphConfig({ state_map: stateMap });
  }

  private readonly addMiniGraphState = (): void => {
    this.updateMiniGraphConfig({
      state_map: [...this.miniGraphStateMap(), { value: "", label: "" }],
    });
  };

  private removeMiniGraphState(index: number): void {
    this.updateMiniGraphConfig({
      state_map: this.miniGraphStateMap().filter((_, stateIndex) => stateIndex !== index),
    });
  }

  private moveMiniGraphState(index: number, direction: -1 | 1): void {
    const stateMap = this.miniGraphStateMap();
    const target = index + direction;
    if (target < 0 || target >= stateMap.length) return;
    [stateMap[index], stateMap[target]] = [stateMap[target], stateMap[index]];
    this.updateMiniGraphConfig({ state_map: stateMap });
  }

  private updateMiniGraphConfig(update: Record<string, unknown>): void {
    if (!this.config) return;
    const next = { ...this.config, ...update } as AdditionConfig;
    this.config = next;
    fireEvent(this, "config-changed", { config: next });
  }

  private renderWasteStreamEditor() {
    if (!this.config) return nothing;
    const streams = wasteStreamsForConfig(this.config);
    return html`
      <section class="item-editor waste-stream-editor">
        <h3>${localizeText(this.hass, "Waste streams")}</h3>
        <p>${localizeText(this.hass, "Each enabled row uses its own sensor or calendar entity. Empty or disabled rows are omitted from the card.")}</p>
        ${streams.map((stream, index) => html`
          <div class="item-row waste-stream-row" data-stream-index=${index}>
            <h4>${stream.label || localize(this.hass, "ui.renderer.waste_number", { number: index + 1 })}</h4>
            <label class="field">
              <span>${localizeText(this.hass, "Show this waste stream")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ boolean: {} }}
                .value=${stream.enabled !== false}
                @value-changed=${(event: CustomEvent) => this.updateWasteStream(index, "enabled", event.detail.value)}
              ></ha-selector>
            </label>
            <label class="field wide">
              <span>${localizeText(this.hass, "Collection date entity")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ entity: { domain: ["sensor", "calendar"] } }}
                .value=${stream.entity}
                @value-changed=${(event: CustomEvent) => this.updateWasteStream(index, "entity", event.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>${localizeText(this.hass, "Label")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${stream.label ?? ""}
                @value-changed=${(event: CustomEvent) =>
                  this.updateWasteStream(index, "label", event.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>${localizeText(this.hass, "Icon")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ icon: {} }}
                .value=${stream.icon}
                @value-changed=${(event: CustomEvent) => this.updateWasteStream(index, "icon", event.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>${localizeText(this.hass, "Color")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_color: { default_color: "green" } }}
                .value=${stream.color}
                @value-changed=${(event: CustomEvent) => this.updateWasteStream(index, "color", event.detail.value)}
              ></ha-selector>
            </label>
            <div class="item-actions wide">
              <button ?disabled=${index === 0} @click=${() => this.moveWasteStream(index, -1)}>${localizeText(this.hass, "Move up")}</button>
              <button ?disabled=${index === streams.length - 1} @click=${() => this.moveWasteStream(index, 1)}>${localizeText(this.hass, "Move down")}</button>
              <button @click=${() => this.removeWasteStream(index)}>${localizeText(this.hass, "Remove")}</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${this.addWasteStream}>${localizeText(this.hass, "Add waste stream")}</button>
      </section>
    `;
  }

  private renderSonosShortcutEditor() {
    if (!this.config) return nothing;
    const shortcuts = this.config.shortcuts?.buttons ?? [];
    const columns = Math.min(8, Math.max(1, Math.round(this.config.shortcuts?.columns ?? 4)));
    return html`
      <section class="item-editor sonos-shortcut-editor">
        <h3>${localizeText(this.hass, "Playlist shortcuts")}</h3>
        <p>${localizeText(this.hass, "Add Sonos playlists or other media IDs. Each shortcut starts playback on the card's primary Sonos entity.")}</p>
        <div class="item-row">
          <label class="field">
            <span>${localizeText(this.hass, "Columns")}</span>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ number: { min: 1, max: 8, step: 1, mode: "box" } }}
              .value=${columns}
              @value-changed=${(event: CustomEvent) => this.updateSonosColumns(event.detail.value)}
            ></ha-selector>
            <small>${localizeText(this.hass, "Number of shortcut buttons shown on each row.")}</small>
          </label>
        </div>
        ${shortcuts.map((shortcut, index) => html`
          <div class="item-row sonos-shortcut-row" data-shortcut-index=${index}>
            <h4>${shortcut.name || localize(this.hass, "ui.renderer.shortcut_number", { number: index + 1 })}</h4>
            <label class="field">
              <span>${localizeText(this.hass, "Label")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${shortcut.name ?? ""}
                @value-changed=${(event: CustomEvent) =>
                  this.updateSonosShortcut(index, "name", event.detail.value)}
              ></ha-selector>
              <small>${localizeText(this.hass, "Optional text shown below the icon.")}</small>
            </label>
            <label class="field">
              <span>${localizeText(this.hass, "Icon")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ icon: {} }}
                .value=${shortcut.icon ?? "mdi:playlist-music"}
                @value-changed=${(event: CustomEvent) =>
                  this.updateSonosShortcut(index, "icon", event.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>${localizeText(this.hass, "Media type")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${shortcut.type ?? "playlist"}
                @value-changed=${(event: CustomEvent) =>
                  this.updateSonosShortcut(index, "type", event.detail.value)}
              ></ha-selector>
              <small>${localizeText(this.hass, "Use playlist for Spotify playlist IDs, or another media type supported by your player.")}</small>
            </label>
            <label class="field wide">
              <span>${localizeText(this.hass, "Playlist or media ID")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${shortcut.id ?? ""}
                @value-changed=${(event: CustomEvent) =>
                  this.updateSonosShortcut(index, "id", event.detail.value)}
              ></ha-selector>
              <small>${localize(this.hass, "ui.renderer.example", { value: "spotify:playlist:PLAYLIST_ID" })}</small>
            </label>
            <div class="item-actions wide">
              <button ?disabled=${index === 0} @click=${() => this.moveSonosShortcut(index, -1)}>${localizeText(this.hass, "Move up")}</button>
              <button ?disabled=${index === shortcuts.length - 1}
                @click=${() => this.moveSonosShortcut(index, 1)}>${localizeText(this.hass, "Move down")}</button>
              <button @click=${() => this.removeSonosShortcut(index)}>${localizeText(this.hass, "Remove")}</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${this.addSonosShortcut}>${localizeText(this.hass, "Add playlist shortcut")}</button>
      </section>
    `;
  }

  private renderCarouselItemEditor() {
    if (!this.config) return nothing;
    const items = this.config.carousel_items ?? [];
    return html`
      <section class="item-editor carousel-item-editor">
        <h3>${localizeText(this.hass, "Carousel items")}</h3>
        <p>${localizeText(this.hass, "Add entity-aware icon buttons. Swipe or scroll to move through them; tap the centered item to run its action.")}</p>
        ${items.map((item, index) => html`
          <div class="item-row carousel-item-row" data-carousel-index=${index}>
            <h4>${item.name || item.entity || localize(this.hass, "ui.renderer.item", { number: index + 1 })}</h4>
            <label class="field wide">
              <span>${localizeText(this.hass, "Entity")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ entity: {} }}
                .value=${item.entity ?? ""}
                @value-changed=${(event: CustomEvent) =>
                  this.updateCarouselItem(index, "entity", event.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>${localizeText(this.hass, "Label")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ text: {} }}
                .value=${item.name ?? ""}
                @value-changed=${(event: CustomEvent) =>
                  this.updateCarouselItem(index, "name", event.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>${localizeText(this.hass, "Icon")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ icon: {} }}
                .value=${item.icon ?? ""}
                @value-changed=${(event: CustomEvent) =>
                  this.updateCarouselItem(index, "icon", event.detail.value)}
              ></ha-selector>
              <button @click=${() => this.updateCarouselItem(index, "icon", undefined)}>${localizeText(this.hass, "Use entity icon")}</button>
            </label>
            <label class="field">
              <span>${localizeText(this.hass, "Color")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ ui_color: {} }}
                .value=${item.color ?? "primary"}
                @value-changed=${(event: CustomEvent) =>
                  this.updateCarouselItem(index, "color", event.detail.value)}
              ></ha-selector>
            </label>
            <label class="field">
              <span>${localizeText(this.hass, "Visual")}</span>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ select: { mode: "dropdown", options: [
                  { value: "icon", label: localizeText(this.hass, "Icon") },
                  { value: "entity-picture", label: localizeText(this.hass, "Entity picture") },
                ] } }}
                .value=${item.icon_type ?? "icon"}
                @value-changed=${(event: CustomEvent) =>
                  this.updateCarouselItem(index, "icon_type", event.detail.value)}
              ></ha-selector>
            </label>
            <label class="field wide">
              <span>${localizeText(this.hass, "Tap action")}</span>
              <ha-selector
                .hass=${this.hass}
                .required=${false}
                .selector=${{ ui_action: { default_action: "more-info" } }}
                .value=${item.tap_action}
                @value-changed=${(event: CustomEvent) =>
                  this.updateCarouselItem(index, "tap_action", event.detail.value)}
              ></ha-selector>
            </label>
            <label class="field wide">
              <span>${localizeText(this.hass, "Hold action")}</span>
              <ha-selector
                .hass=${this.hass}
                .required=${false}
                .selector=${{ ui_action: { default_action: "none" } }}
                .value=${item.hold_action}
                @value-changed=${(event: CustomEvent) =>
                  this.updateCarouselItem(index, "hold_action", event.detail.value)}
              ></ha-selector>
            </label>
            <label class="field wide">
              <span>${localizeText(this.hass, "Double-tap action")}</span>
              <ha-selector
                .hass=${this.hass}
                .required=${false}
                .selector=${{ ui_action: { default_action: "none" } }}
                .value=${item.double_tap_action}
                @value-changed=${(event: CustomEvent) =>
                  this.updateCarouselItem(index, "double_tap_action", event.detail.value)}
              ></ha-selector>
            </label>
            <div class="item-actions wide">
              <button ?disabled=${index === 0} @click=${() => this.moveCarouselItem(index, -1)}>${localizeText(this.hass, "Move up")}</button>
              <button ?disabled=${index === items.length - 1}
                @click=${() => this.moveCarouselItem(index, 1)}>${localizeText(this.hass, "Move down")}</button>
              <button @click=${() => this.removeCarouselItem(index)}>${localizeText(this.hass, "Remove")}</button>
            </div>
          </div>
        `)}
        <button class="add" @click=${this.addCarouselItem}>${localizeText(this.hass, "Add carousel item")}</button>
      </section>
    `;
  }

  private updateItem(
    key: "scene_items" | "room_sensors",
    index: number,
    field: keyof AdditionItemConfig,
    value: unknown,
  ): void {
    if (!this.config) return;
    const items: AdditionItemConfig[] = [...(this.config[key] ?? (this.config.entities ?? []).map((entity) => ({ entity })))];
    if (field === "entity" && typeof value === "string") {
      const current = items[index];
      const defaultsFor = key === "scene_items" ? sceneItemDefaultsFor : roomItemDefaultsFor;
      const oldDefaults = defaultsFor(this.hass, current.entity);
      const newDefaults = defaultsFor(this.hass, value);
      const next = { ...current, entity: value };
      const fields = key === "scene_items"
        ? ["name", "icon", "icon_type", "color", "tap_action"] as const
        : ["icon", "icon_type", "color", "active_state", "tap_action", "hold_action", "double_tap_action"] as const;
      for (const defaultField of fields) {
        if (
          current[defaultField] === undefined ||
          JSON.stringify(current[defaultField]) === JSON.stringify(oldDefaults[defaultField])
        ) {
          Object.assign(next, { [defaultField]: newDefaults[defaultField] });
        }
      }
      items[index] = next;
    } else {
      items[index] = { ...items[index], [field]: value || undefined };
    }
    this.updateItems(key, items);
  }

  private addItem(key: "scene_items" | "room_sensors"): void {
    if (!this.config) return;
    const items: AdditionItemConfig[] = [...(this.config[key] ?? (this.config.entities ?? []).map((entity) => ({ entity })))];
    const defaultEntity = key === "scene_items"
      ? Object.keys(this.hass?.states ?? {}).find((entityId) => entityId.startsWith("scene.")) ?? ""
      : "";
    items.push(key === "scene_items"
      ? sceneItemDefaultsFor(this.hass, defaultEntity)
      : roomItemDefaultsFor(this.hass));
    this.updateItems(key, items);
  }

  private removeItem(key: "scene_items" | "room_sensors", index: number): void {
    if (!this.config) return;
    const items: AdditionItemConfig[] = [...(this.config[key] ?? (this.config.entities ?? []).map((entity) => ({ entity })))]
      .filter((_, itemIndex) => itemIndex !== index);
    this.updateItems(key, items);
  }

  private updateItems(key: "scene_items" | "room_sensors", items: AdditionItemConfig[]): void {
    if (!this.config) return;
    const next = { ...this.config, [key]: items, entities: undefined };
    this.config = next;
    fireEvent(this, "config-changed", { config: next });
  }

  private updateWasteStream(index: number, field: keyof WasteStreamConfig, value: unknown): void {
    if (!this.config) return;
    const streams = wasteStreamsForConfig(this.config);
    streams[index] = {
      ...streams[index],
      [field]: field === "enabled" ? value !== false : value || undefined,
    };
    this.updateWasteStreams(streams);
  }

  private readonly addWasteStream = (): void => {
    if (!this.config) return;
    this.updateWasteStreams([
      ...wasteStreamsForConfig(this.config),
      { enabled: true, entity: "", label: "Custom waste", icon: "mdi:trash-can", color: "#43a047" },
    ]);
  };

  private removeWasteStream(index: number): void {
    if (!this.config) return;
    this.updateWasteStreams(wasteStreamsForConfig(this.config).filter((_, streamIndex) => streamIndex !== index));
  }

  private moveWasteStream(index: number, direction: -1 | 1): void {
    if (!this.config) return;
    const streams = wasteStreamsForConfig(this.config);
    const target = index + direction;
    if (target < 0 || target >= streams.length) return;
    [streams[index], streams[target]] = [streams[target], streams[index]];
    this.updateWasteStreams(streams);
  }

  private updateWasteStreams(streams: WasteStreamConfig[]): void {
    if (!this.config) return;
    const next = { ...this.config, waste_streams: streams };
    this.config = next;
    fireEvent(this, "config-changed", { config: next });
  }

  private updateSonosColumns(value: unknown): void {
    if (!this.config) return;
    const columns = Math.min(8, Math.max(1, Math.round(Number(value) || 4)));
    this.updateSonosShortcuts(this.config.shortcuts?.buttons ?? [], columns);
  }

  private updateCarouselItem(
    index: number,
    field: keyof AdditionItemConfig,
    value: unknown,
  ): void {
    if (!this.config) return;
    const items = [...(this.config.carousel_items ?? [])];
    const item = { ...items[index] };
    if (!value || (field.endsWith("_action") && (value as ActionConfig).action === "default")) {
      delete item[field];
    } else {
      Object.assign(item, { [field]: value });
    }
    items[index] = item;
    this.updateCarouselItems(items);
  }

  private readonly addCarouselItem = (): void => {
    if (!this.config) return;
    this.updateCarouselItems([
      ...(this.config.carousel_items ?? []),
      {
        entity: "",
        color: "primary",
      },
    ]);
  };

  private removeCarouselItem(index: number): void {
    if (!this.config) return;
    this.updateCarouselItems(
      (this.config.carousel_items ?? []).filter((_, itemIndex) => itemIndex !== index),
    );
  }

  private moveCarouselItem(index: number, direction: -1 | 1): void {
    if (!this.config) return;
    const items = [...(this.config.carousel_items ?? [])];
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    [items[index], items[target]] = [items[target], items[index]];
    this.updateCarouselItems(items);
  }

  private updateCarouselItems(items: AdditionItemConfig[]): void {
    if (!this.config) return;
    const next = { ...this.config, carousel_items: items };
    this.config = next;
    fireEvent(this, "config-changed", { config: next });
  }

  private updateSonosShortcut(
    index: number,
    field: keyof SonosShortcutConfig,
    value: unknown,
  ): void {
    if (!this.config) return;
    const shortcuts = [...(this.config.shortcuts?.buttons ?? [])];
    shortcuts[index] = { ...shortcuts[index], [field]: value || undefined };
    this.updateSonosShortcuts(shortcuts);
  }

  private readonly addSonosShortcut = (): void => {
    if (!this.config) return;
    this.updateSonosShortcuts([
      ...(this.config.shortcuts?.buttons ?? []),
      { icon: "mdi:playlist-music", type: "playlist", id: "" },
    ]);
  };

  private removeSonosShortcut(index: number): void {
    if (!this.config) return;
    this.updateSonosShortcuts(
      (this.config.shortcuts?.buttons ?? []).filter((_, shortcutIndex) => shortcutIndex !== index),
    );
  }

  private moveSonosShortcut(index: number, direction: -1 | 1): void {
    if (!this.config) return;
    const shortcuts = [...(this.config.shortcuts?.buttons ?? [])];
    const target = index + direction;
    if (target < 0 || target >= shortcuts.length) return;
    [shortcuts[index], shortcuts[target]] = [shortcuts[target], shortcuts[index]];
    this.updateSonosShortcuts(shortcuts);
  }

  private updateSonosShortcuts(
    buttons: SonosShortcutConfig[],
    columns = this.config?.shortcuts?.columns ?? 4,
  ): void {
    if (!this.config) return;
    const next = { ...this.config, shortcuts: { columns, buttons } };
    this.config = next;
    fireEvent(this, "config-changed", { config: next });
  }

}

export const assertEditorCoverage = (): boolean =>
  CATALOG.every(() => customElements.get("mushroom-addition-editor") !== undefined);
