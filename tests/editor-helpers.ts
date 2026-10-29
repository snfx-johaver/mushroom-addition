export async function openEditorSections(editor: {
  shadowRoot: ShadowRoot | null;
  updateComplete: Promise<unknown>;
}): Promise<void> {
  await editor.updateComplete;
  for (const panel of editor.shadowRoot?.querySelectorAll<HTMLElement & { expanded?: boolean }>("ha-expansion-panel") ?? []) {
    if (panel.expanded) continue;
    panel.dispatchEvent(new CustomEvent("expanded-will-change", { detail: { expanded: true } }));
  }
  await editor.updateComplete;
}
