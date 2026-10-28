import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { Window } from "happy-dom";
import { createFixture } from "../tests/nas/fixture";
import { createQnapFixture } from "../tests/nas/qnap-fixture";
import type { BaseSynologyCard } from "../src/nas/dashboard-cards-base";
import type { SynologyCardEditor } from "../src/nas/dashboard-cards-editor";
import type { CardConfig } from "../src/nas/config";
import type { HomeAssistant } from "../src/nas/ha-types";

const bundleUrl = new URL("../dist/mushroom-cards-addition.js", import.meta.url);
const code = readFileSync(bundleUrl, "utf8");
assert.deepEqual(readdirSync(new URL("../dist/", import.meta.url)).filter((name) => name.endsWith(".js")), [
  "mushroom-cards-addition.js",
]);
for (const notice of [
  "Copyright 2025 Domalab", "SNFX Synology Cards", "Apache License",
  "c816d9fd113df51c66ffde050a8dba52c799b2e1", "Pictogrammers Free License",
  "Copyright (c) 2017 Google LLC",
]) assert.ok(code.includes(notice), `Missing distributed attribution: ${notice}`);
assert.ok(!/\bimport\s*\(/.test(code), "NAS integration must not require another script fetch");

const browser = new Window({ url: "https://example.invalid/" });
for (const key of [
  "window", "document", "customElements", "HTMLElement", "Element", "Document",
  "DocumentFragment", "Node", "ShadowRoot", "CSSStyleSheet", "CustomEvent", "Event",
  "MouseEvent", "ResizeObserver", "MutationObserver",
] as const) {
  Object.defineProperty(globalThis, key, { configurable: true, value: key === "window" ? browser : browser[key] });
}
const { CATALOG } = await import(bundleUrl.href);
assert.equal(CATALOG.length, 32);
assert.equal(window.customCards!.length, 32);
const originals = new Map(window.customCards!.map(({ type }) => [type, customElements.get(type)]));
await import(bundleUrl.href);
assert.equal(window.customCards!.length, 32);
for (const [tag, constructor] of originals) assert.equal(customElements.get(tag), constructor);

let registrations = 0;
for (const kind of ["server", "storage", "docker", "dashboard"]) {
  const canonical = `mushroom-addition-nas-${kind}-card`;
  assert.equal(window.customCards!.filter(({ type }) => type === canonical).length, 1);
  for (const prefix of ["mushroom-addition-nas", "synology", "snfx"]) {
    const tag = `${prefix}-${kind}-card`;
    const constructor = customElements.get(tag) as unknown as typeof BaseSynologyCard;
    assert.ok(constructor, tag);
    assert.deepEqual(await constructor.getStubConfig(), { type: `custom:${tag}` });
    const editor = await constructor.getConfigElement() as SynologyCardEditor;
    assert.equal(editor.localName, `${tag}-editor`);
    const config: CardConfig = {
      type: `custom:${tag}`, nas_source: "manual", title: "Saved title",
      view_mode: "list", show_system_info: false, hide_header: true,
      tabs: ["docker", "storage", "overview"], container_source: "manual",
      entities: { cpu_usage: "sensor.cpu" }, portainer_endpoint: "saved-endpoint",
      volumes: [{ name: "Saved volume", usage_entity: "sensor.volume" }],
      drives: [{ name: "Saved drive", smart_entity: "sensor.smart" }],
      containers: [{ status_entity: "switch.plex", restart_entity: "button.plex_restart" }],
      future_setting: { preserved: true },
    };
    const card = document.createElement(tag) as BaseSynologyCard;
    card.setConfig(config);
    assert.deepEqual(card.config, config);
    editor.hass = createFixture();
    editor.setConfig(config);
    document.body.append(editor);
    await editor.updateComplete;
    assert.deepEqual(editor._config, config);
    const title = [...editor.shadowRoot!.querySelectorAll<HTMLInputElement>('input[type="text"]')]
      .find((input) => input.parentElement?.textContent?.startsWith("Custom title"))!;
    let edited: CardConfig | undefined;
    editor.addEventListener("config-changed", (event) => {
      edited = (event as CustomEvent<{ config: CardConfig }>).detail.config;
    });
    title.value = "Edited title";
    title.dispatchEvent(new Event("input", { bubbles: true }));
    assert.deepEqual(edited, { ...config, title: "Edited title" });
    editor.remove();
    registrations++;
  }
}

async function mount(tag: string, hass: HomeAssistant, config: Partial<CardConfig> = {}) {
  const card = document.createElement(tag) as BaseSynologyCard;
  card.setConfig({ type: `custom:${tag}`, server: "nas", ...config });
  card.hass = hass;
  document.body.append(card);
  await card.updateComplete;
  await card.updateComplete;
  return card;
}

const synology = await mount("synology-server-card", createFixture());
assert.ok(synology.shadowRoot!.textContent!.includes("18.00%"));
const storage = await mount("snfx-storage-card", createFixture());
assert.ok(storage.shadowRoot!.textContent!.includes("34"));
const qnap = await mount("mushroom-addition-nas-server-card", createQnapFixture(), {
  nas_source: "qnap", server: "qnap",
});
assert.ok(qnap.shadowRoot!.textContent!.includes("QNAP"));
const hass = createFixture();
const calls: unknown[][] = [];
hass.callService = async (...args) => { calls.push(args); };
const docker = await mount("mushroom-addition-nas-docker-card", hass, {
  portainer_endpoint: "synEndpoint",
});
assert.ok(!docker.shadowRoot!.textContent!.includes("Unraid Plex"));
const restart = docker.shadowRoot!.querySelector<HTMLButtonElement>('[title="Restart Plex"]')!;
assert.ok(restart && !restart.disabled);
restart.click();
await Promise.resolve();
assert.deepEqual(calls.at(-1), ["button", "press", { entity_id: "button.plex_restart" }]);

for (const prefix of ["mushroom-addition-nas", "synology", "snfx"]) {
  const card = await mount(`${prefix}-dashboard-card`, createFixture(), {
    container_source: "manual", containers: [{ status_entity: "switch.plex" }],
    nas_source: "manual", tabs: ["docker"], view_mode: "list",
  });
  const child = card.shadowRoot!.querySelector("mushroom-addition-nas-docker-card") as BaseSynologyCard;
  assert.ok(child);
  await child.updateComplete;
  assert.equal(child.config.type, "custom:mushroom-addition-nas-docker-card");
  assert.equal(child.config.view_mode, "list");
  assert.deepEqual(child.config.containers, [{ status_entity: "switch.plex" }]);
}

document.body.replaceChildren();
await browser.happyDOM.close();
console.log(`NAS bundle verified: 32 picker entries, ${registrations} card/editor/stub configurations, idempotent registration, Synology/QNAP/storage/Portainer controls, 3 embedded dashboards, single script and license banner.`);
