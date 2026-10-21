import { afterEach, describe, expect, it } from "vitest";
import "../../src/index";
import { CATALOG, getCatalogItem } from "../../src/catalog";
import { NAS_CATALOG } from "../../src/nas-catalog";
import { NAS_CARD_ALIASES, type CardConfig } from "../../src/nas/config";
import { BaseSynologyCard } from "../../src/nas/dashboard-cards-base";
import { SynologyCardEditor } from "../../src/nas/dashboard-cards-editor";
import { registerDockerCard } from "../../src/nas/docker-card";
import { createFixture } from "./fixture";

afterEach(() => document.body.replaceChildren());

const registrations = [
  ...NAS_CATALOG.map((item) => ({ ...item, targetTag: item.tag })),
  ...NAS_CARD_ALIASES,
];

describe("integrated NAS registration and configuration continuation", () => {
  it("adds four distinct picker entries without replacing the original NAS card", () => {
    expect(CATALOG).toHaveLength(31);
    expect(CATALOG.find((item) => item.upstreamId === "custom_card_nas_metrics")?.name).toBe("NAS");
    for (const item of NAS_CATALOG) {
      const entries = window.customCards!.filter((entry) => entry.type === item.tag);
      expect(entries).toHaveLength(1);
      expect(entries[0].name).toBe(`Mushroom Addition: ${item.name}`);
      expect(entries[0].documentationURL).toContain("mushroom-addition");
    }
    for (const alias of NAS_CARD_ALIASES) {
      expect(window.customCards!.some((entry) => entry.type === alias.tag)).toBe(false);
      expect(getCatalogItem(alias.tag)?.tag).toBe(alias.targetTag);
    }
  });

  it.each(registrations)("preserves $tag, its editor, stub type and saved settings", async ({ tag, editorTag }) => {
    const constructor = customElements.get(tag) as unknown as typeof BaseSynologyCard;
    expect(constructor).toBeDefined();
    expect(await constructor.getStubConfig()).toEqual({ type: `custom:${tag}` });
    const editor = await constructor.getConfigElement() as SynologyCardEditor;
    expect(editor.localName).toBe(editorTag);
    expect(customElements.get(editor.localName)).toBeDefined();
    const config: CardConfig = {
      type: `custom:${tag}`, name: "User NAS", title: "Saved title",
      nas_source: "manual", server: "saved-registry-id",
      management_url: "https://example.invalid/", network_interface: "saved-interface",
      view_mode: "list", show_system_info: false, show_motherboard: false,
      hide_header: true, tabs: ["docker", "storage", "overview"],
      entities: { cpu_usage: "sensor.saved_cpu", uptime: "sensor.saved_uptime" },
      volumes: [{ name: "Saved volume", usage_entity: "sensor.saved_volume" }],
      drives: [{ name: "Saved disk", smart_entity: "sensor.saved_smart" }],
      container_source: "manual", portainer_endpoint: "saved-endpoint",
      containers: [{
        name: "Saved service", status_entity: "sensor.saved_status",
        running_state: "RUNNING", stopped_state: "STOPPED",
        cpu_entity: "sensor.saved_container_cpu", memory_entity: "sensor.saved_container_memory",
        power_entity: "switch.saved_service", restart_entity: "button.saved_restart",
        start_entity: "script.saved_start", stop_entity: "input_button.saved_stop",
      }],
      future_user_option: { retained: true },
    };
    const snapshot = structuredClone(config);
    const card = document.createElement(tag) as BaseSynologyCard;
    card.setConfig(config);
    expect(card.config).toEqual(snapshot);
    editor.hass = createFixture();
    editor.setConfig(config);
    document.body.append(editor);
    await editor.updateComplete;
    expect(editor._config).toEqual(snapshot);

    const title = [...editor.shadowRoot!.querySelectorAll<HTMLInputElement>('input[type="text"]')]
      .find((input) => input.parentElement?.textContent?.startsWith("Custom title"))!;
    expect(title).not.toBeNull();
    const changes: CardConfig[] = [];
    editor.addEventListener("config-changed", (event) =>
      changes.push((event as CustomEvent<{ config: CardConfig }>).detail.config));
    title.value = "Edited title";
    title.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    title.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    expect(changes.length).toBeGreaterThan(0);
    expect(changes.at(-1)).toMatchObject({
      type: snapshot.type, title: "Edited title", name: snapshot.name, nas_source: snapshot.nas_source,
      entities: snapshot.entities, volumes: snapshot.volumes, drives: snapshot.drives,
      containers: snapshot.containers, future_user_option: snapshot.future_user_option,
      tabs: snapshot.tabs, view_mode: snapshot.view_mode,
      portainer_endpoint: snapshot.portainer_endpoint, server: snapshot.server,
      network_interface: snapshot.network_interface, management_url: snapshot.management_url,
      show_system_info: false, show_motherboard: false, hide_header: true,
    });
    expect(config).toEqual(snapshot);
  });

  it("registers idempotently without reusing constructors or duplicating picker entries", () => {
    const before = registrations.map(({ tag, editorTag }) => [
      customElements.get(tag), customElements.get(editorTag!),
    ]);
    const picker = [...window.customCards!];
    registerDockerCard();
    registerDockerCard();
    expect(registrations.map(({ tag, editorTag }) => [
      customElements.get(tag), customElements.get(editorTag!),
    ])).toEqual(before);
    expect(window.customCards).toEqual(picker);
  });

  it.each(["synology-dashboard-card", "snfx-dashboard-card", "mushroom-addition-nas-dashboard-card"])(
    "composes canonical cards for %s without needing a standalone resource", async (tag) => {
      const card = document.createElement(tag) as BaseSynologyCard;
      card.setConfig({
        type: `custom:${tag}`, nas_source: "manual", tabs: ["docker"],
        container_source: "manual", containers: [{ status_entity: "switch.plex" }],
        view_mode: "list",
      });
      card.hass = createFixture();
      document.body.append(card);
      await card.updateComplete;
      const child = card.shadowRoot!.querySelector("mushroom-addition-nas-docker-card") as BaseSynologyCard;
      expect(child).not.toBeNull();
      await child.updateComplete;
      expect(child.config).toMatchObject({
        type: "custom:mushroom-addition-nas-docker-card",
        embedded: true, view_mode: "list", container_source: "manual",
        containers: [{ status_entity: "switch.plex" }],
      });
    },
  );
});
