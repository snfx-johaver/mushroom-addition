import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { afterEach, describe, expect, it } from "vitest";
import "../src/index";
import { localizeText, SUPPORTED_LOCALES, translationCatalogs } from "../src/localize";
import { localizeEditorSchema } from "../src/localized-schema";
import { translations } from "../src/weather-advanced/internationalization/complete";
import { resolveLanguage } from "../src/weather-advanced/internationalization/resolveLanguage";
import { workflowStub, WORKFLOW_EDITOR_TAG } from "../src/energy-cards/workflow-config";
import type { MushroomWorkflowEditor } from "../src/energy-cards/workflow-editor";
import type { SmartSavingPlanCard } from "../src/energy-cards/card";
import type { BaseSynologyCard } from "../src/nas/dashboard-cards-base";
import type { SynologyCardEditor } from "../src/nas/dashboard-cards-editor";
import { formatBytes, formatRate, formatValue } from "../src/nas/data";
import { createFixture } from "./nas/fixture";
import type { HomeAssistant } from "../src/types";

afterEach(() => document.body.replaceChildren());

describe("release translation integration", () => {
  it.each(SUPPORTED_LOCALES)("renders NAS cards, its editor, and Smart Saving in %s", async language => {
    const hass = { ...createFixture(), language };
    const server = document.createElement("mushroom-addition-nas-server-card") as BaseSynologyCard;
    server.setConfig({ type: "custom:mushroom-addition-nas-server-card", server: "nas", title: "My storage" });
    server.hass = hass;
    const editor = document.createElement("mushroom-addition-nas-server-card-editor") as SynologyCardEditor;
    editor.setConfig(server.config);
    editor.hass = hass;
    const plan = document.createElement("mushroom-addition-smart-saving") as SmartSavingPlanCard;
    plan.setConfig({ type: "custom:mushroom-addition-smart-saving", name: "My energy", visibleHours: 36,
      price: { entity: "sensor.prices" } });
    plan.hass = { language, states: hass.states, callService: hass.callService };
    document.body.append(server, editor, plan);
    await server.updateComplete;
    await server.updateComplete;
    await editor.updateComplete;
    await editor.updateComplete;
    await plan.updateComplete;
    const periods = plan.shadowRoot!.querySelector<HTMLDetailsElement>(".period-details")!;
    periods.open = true;
    periods.dispatchEvent(new Event("toggle"));
    await plan.updateComplete;
    expect(server.shadowRoot!.textContent).toContain(localizeText(hass, "CPU usage"));
    expect(server.shadowRoot!.textContent).toContain("My storage");
    expect(editor.shadowRoot!.textContent).toContain(localizeText(hass, "Entity mappings"));
    expect(plan.shadowRoot!.textContent).toContain(localizeText(hass, "Published electricity prices"));
    expect(plan.shadowRoot!.textContent).toContain(localizeText(hass, "Morning"));
    expect(plan.shadowRoot!.textContent).not.toContain("Price source missing");
    expect(translations[language].editor.show_wind).toBeTruthy();
    expect(formatBytes(undefined, "GB", hass)).toBe(localizeText(hass, "Unavailable"));
    expect(formatRate(undefined, hass)).toBe(localizeText(hass, "Unavailable"));
    expect(formatValue(undefined, hass)).toBe(localizeText(hass, "Unavailable"));
    for (const [kind, label] of [["storage", "Storage volumes"], ["docker", "Running"], ["dashboard", "Overview"]]) {
      const card = document.createElement(`mushroom-addition-nas-${kind}-card`) as BaseSynologyCard;
      card.setConfig({ type: `custom:mushroom-addition-nas-${kind}-card`, server: "nas", portainer_endpoint: "synEndpoint" });
      card.hass = hass;
      document.body.append(card);
      await card.updateComplete;
      await card.updateComplete;
      expect(card.shadowRoot!.textContent).toContain(localizeText(hass, label));
    }
  });

  it("rerenders optimized NAS cards and editors on a language-only change", async () => {
    const hass = { ...createFixture(), language: "en" };
    const card = document.createElement("mushroom-addition-nas-server-card") as BaseSynologyCard;
    card.setConfig({ type: "custom:mushroom-addition-nas-server-card", server: "nas" });
    card.hass = hass;
    const editor = document.createElement("mushroom-addition-nas-server-card-editor") as SynologyCardEditor;
    editor.setConfig(card.config);
    editor.hass = hass;
    document.body.append(card, editor);
    await card.updateComplete;
    await card.updateComplete;
    await editor.updateComplete;
    const english = card.shadowRoot!.textContent;
    const translated = { ...hass, language: "de" };
    card.hass = translated;
    editor.hass = translated;
    await card.updateComplete;
    await editor.updateComplete;
    expect(card.shadowRoot!.textContent).not.toBe(english);
    expect(card.shadowRoot!.textContent).toContain(localizeText(translated, "CPU usage"));
    expect(editor.shadowRoot!.textContent).toContain(localizeText(translated, "Entity mappings"));
    expect(card.hass.states).toBe(hass.states);
  });

  it("preserves user-owned workflow names and selector values while translating built-in options", async () => {
    const hass: HomeAssistant = { states: {}, language: "de", callService: async () => undefined };
    const editor = document.createElement(WORKFLOW_EDITOR_TAG) as MushroomWorkflowEditor;
    const config = workflowStub(hass);
    config.groups = [{ id: "input", label: "Plan" }];
    config.nodes[0].label = "Source";
    editor.setConfig(config);
    editor.hass = hass;
    document.body.append(editor);
    await editor.updateComplete;
    const forms = [...editor.shadowRoot!.querySelectorAll("ha-form")] as Array<HTMLElement & {
      schema: Array<{ name: string; selector?: { select?: { options: Array<{ value: string; label: string }> } } }>;
    }>;
    const group = forms.flatMap(form => form.schema).find(field => field.name === "group")!;
    expect(group.selector!.select!.options).toContainEqual({ value: "input", label: "Plan" });
    expect(group.selector!.select!.options[0]).toEqual({ value: "", label: localizeText(hass, "Ungrouped") });
    expect(editor.shadowRoot!.textContent).toContain("Source");
    expect(config.groups![0].label).toBe("Plan");
  });

  it("localizes language names without rewriting schema option values", () => {
    const options = [{ value: "en", label: "English" }, { value: "de", label: "German" }];
    const [field] = localizeEditorSchema({ language: "nl", states: {}, callService: async () => undefined }, [
      { name: "language", selector: { select: { options } } },
    ]);
    expect(field.selector!.select).toEqual({ options: [
      { value: "en", label: "Engels" }, { value: "de", label: "Duits" },
    ] });
    expect(options[0].label).toBe("English");
  });

  it.each([
    ["SR_latn", "sr-Latn"], ["sr-Latn-RS", "sr-Latn"], ["sr-Cyrl-RS", "sr"],
    ["zh-TW", "zh-Hant"], ["zh-Hant-CN", "zh-Hant"], ["zh-Hans-TW", "zh-Hans"],
    ["pt_BR", "pt-BR"], ["pt-AO", "pt-PT"], ["ko", "ko-KR"], ["no-NO", "nb"],
    [" sv-SE ", "sv"], ["et", "et"], ["pt", "pt"], ["zh", "zh"],
  ])("resolves Weather Advanced %s as %s", (hassLang, expected) => {
    expect(resolveLanguage({ hassLang })).toBe(expected);
    expect(resolveLanguage({ configLang: hassLang, hassLang: "en" })).toBe(expected);
  });
});

describe("source-owned UI inventory", () => {
  it("registers literal translation calls and does not leave raw English HTML/SVG captions", () => {
    const english = new Set(Object.values(translationCatalogs.en));
    const invariantText = new Set(["NAS:", "Portainer (", "Portainer:", "Home Assistant Portainer", "SMART:", "kWh"]);
    const failures: string[] = [];
    const scan = (directory: string) => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) {
          if (!["translations", "internationalization", "icons", "animations"].includes(entry.name)) scan(path);
          continue;
        }
        if (!entry.name.endsWith(".ts")) continue;
        const source = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true);
        const record = (text: string, node: ts.Node) => {
          if (/[A-Za-z]{3}/.test(text) && !english.has(text) && !invariantText.has(text)) {
            failures.push(`${path}:${source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1}: ${text}`);
          }
        };
        const visit = (node: ts.Node) => {
          if (ts.isCallExpression(node)) {
            const name = node.expression.getText(source);
            const argument = name === "localizeText" ? node.arguments[1] : name === "this.t" ? node.arguments[0] : undefined;
            if (argument && ts.isStringLiteral(argument)) record(argument.text, node);
          }
          if (ts.isTaggedTemplateExpression(node) && ["html", "svg"].includes(node.tag.getText(source))) {
            const fragments = ts.isTemplateExpression(node.template)
              ? [node.template.head.text, ...node.template.templateSpans.map(span => span.literal.text)]
              : [node.template.text];
            for (const fragment of fragments) {
              for (const match of fragment.matchAll(/>[ \t]*([A-Za-z][A-Za-z ,.:;()-]{2,})(?=<|$)/g)) {
                record(match[1].trim(), node);
              }
            }
          }
          ts.forEachChild(node, visit);
        };
        visit(source);
      }
    };
    scan(join(process.cwd(), "src"));
    expect(failures).toEqual([]);
  });
});
