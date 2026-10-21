import { css } from "lit";
import { MushroomAreaAdvancedCard, type AreaAdvancedConfig } from "./area-advanced";
import type { HomeAssistant } from "./types";

export const MUSHROOM_AREA_TAG = "mushroom-addition-area-card-mushroom";

const presentation = {
  "hui-area-card": `
    :host {
      --ha-card-border-radius: var(--mush-card-border-radius, 12px);
      --feature-height: var(--mush-control-height, 42px);
      --addition-neutral-background: rgba(var(--rgb-primary-text-color, 33, 33, 33), .05);
    }
    ha-card { border-radius: var(--mush-card-border-radius, 12px); }
    .picture .icon-container { --mdc-icon-size: var(--mush-icon-size, 36px); }
    .addition-sensors { font-size: var(--mush-card-secondary-font-size, 12px);
      line-height: var(--mush-card-secondary-line-height, 16px);
      color: var(--mush-card-secondary-color, var(--secondary-text-color)); }
  `,
  "ha-tile-container": `
    .content { gap: 12px; padding: 12px; min-height: 60px; }
    .content.vertical { padding: 12px; }
    ::slotted([slot="features"]) { padding: 0 12px 12px; }
  `,
  "ha-tile-info": `
    .primary { font-size: var(--mush-card-primary-font-size, 14px);
      font-weight: var(--mush-card-primary-font-weight, 500);
      line-height: var(--mush-card-primary-line-height, 20px);
      letter-spacing: var(--mush-card-primary-letter-spacing, .1px);
      color: var(--mush-card-primary-color, var(--primary-text-color)); }
    .secondary { font-size: var(--mush-card-secondary-font-size, 12px);
      font-weight: var(--mush-card-secondary-font-weight, 400);
      line-height: var(--mush-card-secondary-line-height, 16px);
      letter-spacing: var(--mush-card-secondary-letter-spacing, .4px);
      color: var(--mush-card-secondary-color, var(--secondary-text-color)); }
  `,
  "ha-tile-icon": `
    :host { --tile-icon-size: var(--mush-icon-size, 36px);
      --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
    .container { border-radius: 50%; background: color-mix(in srgb, var(--tile-color) 20%, transparent); }
    .container ha-icon, .container ha-svg-icon { color: var(--tile-color); }
  `,
  "hui-card-features": `
    :host { --feature-height: var(--mush-control-height, 42px); }
  `,
  "hui-area-controls-card-feature": `
    ha-control-button { --control-button-border-radius: var(--mush-control-border-radius, 12px);
      --control-button-height: var(--mush-control-height, 42px);
      --control-button-background-opacity: .05;
      --control-button-background-color: var(--primary-text-color); }
    ha-control-button.active { --control-button-background-color: var(--feature-color);
      --control-button-background-opacity: .2; }
  `,
  "mushroom-addition-area-controls-advanced": `
    .entity { border-radius: var(--mush-control-border-radius, 12px); }
    .button-label { font-size: var(--mush-card-secondary-font-size, 12px);
      line-height: var(--mush-card-secondary-line-height, 16px);
      font-weight: var(--mush-card-secondary-font-weight, 400); }
  `,
} satisfies Record<string, string>;

// Each native component owns a shadow root; keep overrides scoped to this copy.
export async function applyMushroomAreaPresentation(element: HTMLElement, observer?: MutationObserver): Promise<void> {
  await (element as HTMLElement & { updateComplete?: Promise<boolean> }).updateComplete;
  const root = element.shadowRoot;
  if (!root || !element.isConnected) return;
  observer?.observe(root, { childList: true, subtree: true });
  const rules = presentation[element.localName as keyof typeof presentation];
  if (rules && !root.querySelector("style[data-area-mushroom]")) {
    const style = document.createElement("style");
    style.dataset.areaMushroom = "";
    style.textContent = rules;
    root.append(style);
  }
  await Promise.all([...root.querySelectorAll<HTMLElement>(
    "ha-tile-container, ha-tile-info, ha-tile-icon, hui-card-features, hui-area-controls-card-feature, mushroom-addition-area-controls-advanced, hui-conditional-card",
  )].map(child => applyMushroomAreaPresentation(child, observer)));
}

export class MushroomAreaCard extends MushroomAreaAdvancedCard {
  private presentationObserver?: MutationObserver;
  public static override getStubConfig(hass?: HomeAssistant): AreaAdvancedConfig {
    return { ...super.getStubConfig(hass), type: `custom:${MUSHROOM_AREA_TAG}`, display_type: "compact" };
  }
  public override setConfig(config: AreaAdvancedConfig): void {
    super.setConfig({ display_type: "compact", ...config });
  }
  protected override applyPresentation(card: HTMLElement): Promise<void> {
    this.presentationObserver ??= new MutationObserver(() => this.requestUpdate());
    return applyMushroomAreaPresentation(card, this.presentationObserver);
  }
  public override connectedCallback(): void { super.connectedCallback(); this.requestUpdate(); }
  public override disconnectedCallback(): void { this.presentationObserver?.disconnect(); super.disconnectedCallback(); }
  static override styles = css`
    ${MushroomAreaAdvancedCard.styles}
    :host { --ha-card-border-radius: var(--mush-card-border-radius, 12px); }
  `;
}
