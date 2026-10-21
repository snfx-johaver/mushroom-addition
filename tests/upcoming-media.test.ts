import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import { CATALOG } from "../src/catalog";
import { createStubConfig } from "../src/stub";
import { MushroomAdditionCard } from "../src/card";
import { MushroomAdditionEditor } from "../src/editor";
import { MushroomUpcomingMedia, readUpcomingData, upcomingDataAttributes, upcomingItems, upcomingMediaUrl, upcomingText } from "../src/upcoming-media";
import { editorSchemaFor } from "../src/editor-schema";
import type { AdditionConfig, HassEntity, HomeAssistant } from "../src/types";

const type = "custom:mushroom-addition-upcoming-media-card";
const items = [
  { title: "Orbit", episode: "A new beginning", number: "S01E02", airdate: "2026-10-21T18:00:00Z", rating: "8.5", runtime: "95", flag: true, deep_link: "https://example.test/watch/1", summary: "An original space adventure." },
  { title: "Quiet Planet", number: "S02E10", airdate: "2026-10-23T18:00:00Z", rating: "9.1", runtime: "45", flag: false, tmdb_id: 42 },
  { title: "Home Again", number: "S02E2", airdate: "2026-10-22T18:00:00Z", rating: "", runtime: "50", flag: "false" },
];
const sensor = (data: unknown = [{ title_default: "$title", line1_default: "$number $episode" }, ...items]): HassEntity =>
  ({ entity_id: "sensor.upcoming", state: "3", attributes: { friendly_name: "Upcoming", data } });
const makeHass = (data?: unknown): HomeAssistant => ({ states: { "sensor.upcoming": sensor(data) }, callService: vi.fn(), language: "en", config: { time_zone: "UTC" } });
async function create(config: Partial<AdditionConfig> = {}) {
  const card = document.createElement("mushroom-addition-upcoming-media") as MushroomUpcomingMedia;
  card.hass = makeHass();
  card.config = { type, entity: "sensor.upcoming", ...config };
  document.body.append(card);
  await card.updateComplete;
  return card;
}
afterEach(() => { document.body.replaceChildren(); vi.useRealTimers(); vi.restoreAllMocks(); });

describe("Upcoming Media", () => {
  it("offers only media-list attributes, not display metadata, and recovers the old friendly-name selection", async () => {
    const entity = sensor();
    entity.attributes = {
      ...entity.attributes, icon: "mdi:film", count: 3,
      alternate: JSON.stringify(items), empty: [], invalid: "[broken", numbers: [1, 2],
    };
    expect(upcomingDataAttributes(entity)).toEqual(["data", "alternate", "empty"]);
    expect(readUpcomingData(entity, "friendly_name").items).toHaveLength(3);
    expect(readUpcomingData(entity, "invalid").error).toBeTruthy();
    const hass = { ...makeHass(), states: { [entity.entity_id]: entity } };
    const descriptor = CATALOG.find(item => item.upstreamId === "upcoming_media")!;
    const schema = editorSchemaFor(descriptor, { type, entity: entity.entity_id }, hass);
    expect(schema.find(field => field.name === "upcoming_data_attribute")?.selector).toEqual({
      select: { mode: "dropdown", options: ["data", "alternate", "empty"].map(value => ({ value, label: value })) },
    });
    const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
    editor.hass = hass;
    editor.setConfig({ type, entity: entity.entity_id, upcoming_data_attribute: "friendly_name" });
    document.body.append(editor);
    await editor.updateComplete;
    const form = editor.shadowRoot!.querySelector("ha-form") as HTMLElement & { data: AdditionConfig };
    expect(form.data.upcoming_data_attribute).toBe("data");
  });
  it("reads list and JSON data, uses formatting metadata, and never drops the first real item", () => {
    const result = readUpcomingData(sensor());
    expect(result.items).toHaveLength(3);
    expect(result.defaults.line1_default).toBe("$number $episode");
    expect(readUpcomingData(sensor(JSON.stringify(items))).items[0].title).toBe("Orbit");
    expect(readUpcomingData(sensor(items)).items).toHaveLength(3);
  });
  it.each(["not json", {}, [null], [5]])("surfaces malformed data rather than an empty success: %j", data => {
    expect(readUpcomingData(sensor(data)).error).toBeTruthy();
  });
  it("filters, sorts naturally/numerically and groups matches before limiting", () => {
    const data = readUpcomingData(sensor());
    expect(upcomingItems(data, { type, upcoming_sort_by: "number" }).map(item => item.title)).toEqual(["Orbit", "Home Again", "Quiet Planet"]);
    expect(upcomingItems(data, { type, upcoming_sort_by: "rating", upcoming_sort_ascending: false }).map(item => item.title)).toEqual(["Quiet Planet", "Orbit", "Home Again"]);
    expect(upcomingItems(data, { type, upcoming_flag_filter: "unflagged" })).toHaveLength(2);
    expect(upcomingItems(data, { type, upcoming_filter_attribute: "title", upcoming_filter_value: "planet" })[0].title).toBe("Quiet Planet");
    expect(upcomingItems(data, { type, upcoming_collapse_mode: "matching", upcoming_group_attribute: "title", upcoming_group_value: "Quiet Planet", upcoming_max_items: 1 })[0].title).toBe("Quiet Planet");
  });
  it("formats tokens in the HA time zone without moving date-only releases or executing templates", () => {
    expect(upcomingText("$date $time $runtime", items[0], { type, upcoming_date_format: "yyyy-mm-dd", upcoming_clock: "24" }, makeHass())).toBe("2026-10-21 18:00 1h 35m");
    expect(upcomingText("$date", { airdate: "2026-10-21" }, { type, upcoming_date_format: "dd/mm/yyyy" }, { ...makeHass(), config: { time_zone: "America/Los_Angeles" } })).toBe("21/10/2026");
    expect(upcomingText("$release", { title: "Soon" }, { type })).toBe("");
    expect(upcomingText("$empty", items[0], { type })).toBe("");
    expect(upcomingMediaUrl("javascript:alert(1)")).toBeUndefined();
    expect(upcomingMediaUrl("data:text/html,evil", true)).toBeUndefined();
  });
  it("renders artwork layouts, source templates, collapsed items and expandable summaries", async () => {
    const card = await create({ upcoming_collapse_mode: "count", upcoming_collapse_count: 1, upcoming_tooltips: true });
    expect(card.shadowRoot!.querySelectorAll(".item")).toHaveLength(1);
    expect(card.shadowRoot!.textContent).toContain("S01E02 A new beginning");
    (card.shadowRoot!.querySelector(".more") as HTMLButtonElement).click();
    await card.updateComplete;
    expect(card.shadowRoot!.querySelectorAll(".item")).toHaveLength(3);
    card.config = { ...card.config!, upcoming_image_style: "fanart", upcoming_item_height: 200, upcoming_corner_radius: 20 };
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector(".fanart")).not.toBeNull();
    expect(card.shadowRoot!.querySelector<HTMLElement>(".items")!.style.getPropertyValue("--item-height")).toBe("200px");
    expect(card.shadowRoot!.querySelectorAll(".item")).toHaveLength(1);
  });
  it("uses safe item actions, encodes URL values and never bubbles a second card action", async () => {
    const card = await create({ upcoming_url: "https://example.test/search?q=$title" });
    const action = vi.fn();
    card.addEventListener("hass-action", action);
    (card.shadowRoot!.querySelectorAll(".item")[1] as HTMLButtonElement).click();
    expect(action).toHaveBeenCalledOnce();
    expect(action.mock.calls[0][0].detail.config.tap_action.url_path).toBe("https://example.test/search?q=Quiet%20Planet");
    expect(card.hass!.callService).not.toHaveBeenCalled();
  });
  it("opens YouTube trailers only after a tap and supports closing the dialog", async () => {
    const setAttribute = HTMLIFrameElement.prototype.setAttribute;
    vi.spyOn(HTMLIFrameElement.prototype, "setAttribute").mockImplementation(function (this: HTMLIFrameElement, name, value) {
      if (name === "src") setAttribute.call(this, "srcdoc", "<title>Local trailer fixture</title>");
      setAttribute.call(this, name, value);
    });
    const card = await create();
    card.hass = makeHass([{ title: "Preview", trailer: "https://www.youtube.com/watch?v=abcdefghijk" }]);
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector("iframe")).toBeNull();
    (card.shadowRoot!.querySelector(".item") as HTMLButtonElement).click();
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector("iframe")?.src).toContain("youtube-nocookie.com/embed/abcdefghijk");
    expect(card.shadowRoot!.querySelector("iframe")?.srcdoc).toContain("Local trailer fixture");
    (card.shadowRoot!.querySelector(".close") as HTMLButtonElement).click();
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector("dialog")).toBeNull();
  });
  it("reports invalid explicit URLs without falling back to a different action", async () => {
    const card = await create({ upcoming_url: "javascript:alert(1)" });
    const action = vi.fn();
    card.addEventListener("hass-action", action);
    (card.shadowRoot!.querySelector(".item") as HTMLButtonElement).click();
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector('[role="alert"]')?.textContent).toContain("custom media URL is invalid");
    expect(action).not.toHaveBeenCalled();
  });
  it("hides only valid empty data and selects compatible sensors for picker examples", async () => {
    const descriptor = CATALOG.find(item => item.upstreamId === "upcoming_media")!;
    expect(createStubConfig(descriptor, makeHass()).entity).toBe("sensor.upcoming");
    expect(createStubConfig(descriptor, { states: { "sensor.other": { entity_id: "sensor.other", state: "25", attributes: {} } }, callService: vi.fn() }).entity).toBeUndefined();
    const card = document.createElement(descriptor.tag) as MushroomAdditionCard;
    card.hass = makeHass([]);
    card.setConfig({ type, entity: "sensor.upcoming", upcoming_hide_empty: true });
    document.body.append(card);
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector("ha-card")).toBeNull();
    card.hass = makeHass("invalid");
    await card.updateComplete;
    expect(card.shadowRoot!.querySelector("mushroom-addition-upcoming-media")).not.toBeNull();
  });
  it("exposes every conditional feature through the grouped native editor", async () => {
    const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
    editor.hass = makeHass();
    editor.setConfig({ type, entity: "sensor.upcoming", upcoming_item_behavior: "action", upcoming_filter_attribute: "title", upcoming_collapse_mode: "matching", upcoming_tooltips: true });
    document.body.append(editor); await editor.updateComplete;
    const forms = [...editor.shadowRoot!.querySelectorAll("ha-form")] as Array<HTMLElement & { schema: { name: string; schema?: { name: string }[] }[]; data: AdditionConfig }>;
    const names = forms.flatMap(form => form.schema.flatMap(field => field.schema ?? [field])).map(field => field.name);
    expect(names).toEqual(expect.arrayContaining(["upcoming_item_action", "upcoming_filter_value", "upcoming_group_value", "upcoming_tooltip_delay", "upcoming_title_text"]));
    const changed = vi.fn(); editor.addEventListener("config-changed", changed);
    forms[0].dispatchEvent(new CustomEvent("value-changed", { detail: { value: { ...forms[0].data, upcoming_max_items: 12 } }, bubbles: true }));
    expect(changed.mock.calls[0][0].detail.config).toMatchObject({ upcoming_max_items: 12, upcoming_collapse_mode: "matching" });
  });
});
