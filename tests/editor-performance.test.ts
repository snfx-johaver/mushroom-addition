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

async function createEditor(config: AdditionConfig, hass = makeHass()) {
  const editor = document.createElement("mushroom-addition-editor") as MushroomAdditionEditor;
  editor.hass = hass;
  editor.setConfig(config);
  document.body.append(editor);
  await editor.updateComplete;
  return editor;
}

const forms = (editor: MushroomAdditionEditor) =>
  [...editor.shadowRoot!.querySelectorAll<EditorForm>("ha-form")];

const flatten = (schema: EditorField[]): EditorField[] =>
  schema.flatMap(field => [field, ...flatten(field.schema ?? [])]);

afterEach(() => document.body.replaceChildren());

describe("editor schema caching", () => {
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
