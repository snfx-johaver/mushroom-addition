import { css } from "lit";

export const sharedStyles = css`
  :host {
    --mac-accent: var(--mush-rgb-blue, 33, 150, 243);
    display: block;
    min-width: 0;
  }
  ha-card {
    overflow: hidden;
    border-radius: var(--mush-card-primary-border-radius, 12px);
    background: var(--ha-card-background, var(--card-background-color));
    box-shadow: var(--ha-card-box-shadow, none);
  }
  .card {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    min-height: 66px;
    padding: 12px;
    color: var(--primary-text-color);
    cursor: pointer;
    outline: none;
  }
  .card.vertical {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }
  .card.compact { min-height: 48px; padding: 8px 10px; }
  .card.alert { --mac-accent: var(--rgb-red-color, 244, 67, 54); }
  .card.popup {
    min-height: 110px;
    border: 1px solid rgba(var(--mac-accent), 0.3);
  }
  .card:focus-visible, .chip:focus-visible {
    box-shadow: inset 0 0 0 2px rgb(var(--mac-accent));
  }
  .icon {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    color: rgb(var(--mac-accent));
    background: rgba(var(--mac-accent), 0.16);
  }
  .active .icon {
    color: var(--text-primary-color, white);
    background: rgb(var(--mac-accent));
  }
  ha-icon { --mdc-icon-size: 23px; }
  .copy { min-width: 0; }
  .primary, .secondary {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .primary { font-size: 14px; font-weight: 500; }
  .secondary {
    margin-top: 3px;
    color: var(--secondary-text-color);
    font-size: 12px;
    text-transform: capitalize;
  }
  .metric {
    color: rgb(var(--mac-accent));
    font-size: 18px;
    font-weight: 600;
  }
  .details {
    display: flex;
    grid-column: 1 / -1;
    flex-wrap: wrap;
    gap: 6px;
  }
  .variant-content {
    display: flex;
    grid-column: 1 / -1;
    align-items: center;
    gap: 8px;
    width: 100%;
  }
  .variant-content input[type="range"] { width: 100%; accent-color: rgb(var(--mac-accent)); }
  .control {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border: 0;
    border-radius: 50%;
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
    cursor: pointer;
  }
  .forecast { justify-content: space-around; color: var(--secondary-text-color); font-size: 12px; }
  .artwork {
    width: 58px;
    height: 58px;
    border-radius: 10px;
    background-position: center;
    background-size: cover;
  }
  .detail {
    padding: 4px 8px;
    border-radius: 10px;
    background: var(--secondary-background-color);
    color: var(--secondary-text-color);
    font-size: 11px;
  }
  .unavailable { opacity: 0.55; }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 32px;
    padding: 0 11px;
    border-radius: 18px;
    background: var(--ha-card-background, var(--card-background-color));
    color: var(--primary-text-color);
    box-shadow: var(--ha-card-box-shadow, none);
    cursor: pointer;
    outline: none;
  }
  .chip .icon {
    width: 26px;
    height: 26px;
    margin-left: -8px;
  }
  .chip ha-icon { --mdc-icon-size: 17px; }
  .chip-label { font-size: 12px; white-space: nowrap; }
  .chips {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 4px;
  }
  .preview {
    padding: 16px;
    color: var(--secondary-text-color);
    text-align: center;
  }
`;
