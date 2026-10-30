import { openEditorSections } from "./editor-helpers";
import { afterEach, describe, expect, it } from "vitest";
import "../src/editor";
import type { MushroomAdditionEditor } from "../src/editor";
import type { AdditionConfig, HomeAssistant } from "../src/types";
import type { EditorField } from "../src/editor-schema";

type EditorForm = HTMLElement & { schema: EditorField[]; hass: HomeAssistant };

const makeHass = (): HomeAssistant => ({
  language: "en",
  states: {},
  callService: async () => undefined,
});

async function createEditor(config: AdditionConfig, hass = makeHass(), open = true) {
  const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
  editor.hass = hass;
  editor.setConfig(config);
  document.body.append(editor);
  await editor.updateComplete;
  if (open) await openEditorSections(editor);
  return editor;
}

const forms = (editor: MushroomAdditionEditor) =>
  [...editor.shadowRoot!.querySelectorAll<EditorForm>("ha-form")];

const flatten = (schema: EditorField[]): EditorField[] =>
  schema.flatMap(field => [field, ...flatten(field.schema ?? [])]);

afterEach(() => document.body.replaceChildren());

describe("editor schema caching", () => {
  it("only mounts controls for open sections and releases them when collapsed", async () => {
    const config: AdditionConfig = {
      type: "custom:mushroom-addition-custom-card-light",
      carousel_items: Array.from({ length: 15 }, (_, i) => ({ entity: `scene.example_${i}` })),
    };
    const editor = await createEditor(config, makeHass(), false);
    const changes: AdditionConfig[] = [];
    editor.addEventListener("config-changed", event => changes.push((event as CustomEvent<{ config: AdditionConfig }>).detail.config));
    expect(forms(editor)).toHaveLength(0);
    expect(editor.shadowRoot!.querySelectorAll("ha-selector")).toHaveLength(0);
    const panel = [...editor.shadowRoot!.querySelectorAll("ha-expansion-panel")]
      .find(element => element.textContent?.includes("Features"))!;
    const expand = async (expanded: boolean) => {
      panel.dispatchEvent(new CustomEvent("expanded-will-change", { detail: { expanded } }));
      await editor.updateComplete;
      panel.dispatchEvent(new CustomEvent("expanded-changed", { detail: { expanded } }));
      await editor.updateComplete;
    };
    await expand(true);
    expect(editor.shadowRoot!.querySelectorAll(".carousel-item-row")).toHaveLength(15);
    expect(forms(editor)).toHaveLength(1);
    const form = forms(editor)[0];
    form.dispatchEvent(new CustomEvent("expanded-will-change", { bubbles: true, detail: { expanded: false } }));
    await editor.updateComplete;
    expect(forms(editor)).toHaveLength(1);
    await expand(false);
    for (let i = 0; i < 5; i++) {
      editor.hass = { ...makeHass() };
      await editor.updateComplete;
      expect(forms(editor)).toHaveLength(0);
      expect(editor.shadowRoot!.querySelectorAll("ha-selector")).toHaveLength(0);
    }
    await expand(true);
    expect(editor.shadowRoot!.querySelectorAll(".carousel-item-row")).toHaveLength(15);
    expect(forms(editor)[0].hass).toBe(editor.hass);
    expect(changes).toHaveLength(0);
    forms(editor)[0].dispatchEvent(new CustomEvent("value-changed", {
      bubbles: true, composed: true, detail: { value: { ...config, light_show_members: false } },
    }));
    await editor.updateComplete;
    await expand(false);
    await expand(true);
    expect(changes.at(-1)).toMatchObject({ carousel_items: config.carousel_items, light_show_members: false });
    expect(editor.shadowRoot!.querySelectorAll(".carousel-item-row")).toHaveLength(15);
  });

  it("retains schema references during unrelated HA updates while forwarding fresh hass", async () => {
    const editor = await createEditor({ type: "custom:mushroom-addition-card-battery" });
    const original = forms(editor).map(form => form.schema);
    expect(original.length).toBeGreaterThan(0);
    for (let i = 0; i < 5; i++) {
      const hass = { ...makeHass(), states: {
        "sensor.unrelated": { entity_id: "sensor.unrelated", state: String(i), attributes: {} },
      } };
      editor.hass = hass;
      await editor.updateComplete;
      forms(editor).forEach((form, index) => {
        expect(form.schema).toBe(original[index]);
        expect(form.hass).toBe(hass);
      });
    }
  });

  it("rebuilds schemas when configuration or language changes", async () => {
    const config = { type: "custom:mushroom-addition-remote-card" };
    const editor = await createEditor(config);
    const original = forms(editor).map(form => form.schema);
    editor.setConfig({ ...config, remote_double_tap: "custom" });
    await editor.updateComplete;
    expect(forms(editor).flatMap(form => flatten(form.schema)).map(field => field.name))
      .toContain("remote_double_tap_command");
    const changed = forms(editor).map(form => form.schema);
    expect(changed.some((schema, i) => schema !== original[i])).toBe(true);
    editor.hass = { ...makeHass(), language: "nl" };
    await editor.updateComplete;
    forms(editor).forEach((form, i) => expect(form.schema).not.toBe(changed[i]));
  });

  it("refreshes Upcoming Media options when attribute values change without changing keys", async () => {
    const entity = "sensor.upcoming";
    const hass = makeHass();
    hass.states[entity] = { entity_id: entity, state: "1", attributes: { data: "invalid" } };
    const editor = await createEditor({
      type: "custom:mushroom-addition-upcoming-media-card", entity,
    }, hass);
    const original = forms(editor).map(form => form.schema);
    const nextHass = { ...hass, states: { ...hass.states, [entity]: {
      ...hass.states[entity], attributes: { data: "invalid", movies: [{ title: "Example" }] },
    } } };
    editor.hass = nextHass;
    await editor.updateComplete;
    const schemaWithMovies = forms(editor).map(form => form.schema);
    expect(schemaWithMovies.some((schema, i) => schema !== original[i])).toBe(true);
    const options = () => forms(editor).flatMap(form => flatten(form.schema))
      .find(field => field.name === "upcoming_data_attribute")?.selector;
    expect(options()).toMatchObject({ select: { options: expect.arrayContaining([
      { value: "movies", label: "movies" },
    ]) } });
    editor.hass = { ...nextHass, states: { ...nextHass.states, [entity]: {
      ...nextHass.states[entity], attributes: { data: "invalid", movies: "invalid" },
    } } };
    await editor.updateComplete;
    expect(options()).not.toMatchObject({ select: { options: expect.arrayContaining([
      { value: "movies", label: "movies" },
    ]) } });
  });
});
