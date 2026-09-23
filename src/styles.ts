import { css } from "lit";

export const sharedStyles = css`
  :host {
    --ulm-blue: 3, 169, 244;
    --ulm-yellow: 255, 193, 7;
    --ulm-red: 244, 67, 54;
    --ulm-green: 76, 175, 80;
    --ulm-purple: 156, 39, 176;
    --ulm-grey: 120, 120, 120;
    display: block;
    min-width: 0;
  }
  .minimalist-card {
    display: block;
    overflow: hidden;
    border: 0;
    border-radius: var(--mush-card-primary-border-radius, 14px);
    background: var(--ha-card-background, var(--card-background-color, #fff));
    box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,.08));
  }
  .minimalist-card:has(.fill-container), .fill-container { height: 100%; }
  .fill-container { min-height: 100%; }
  .action-surface {
    box-sizing: border-box;
    color: var(--primary-text-color);
    cursor: pointer;
    outline: none;
  }
  .action-surface:focus-visible { box-shadow: inset 0 0 0 2px rgb(var(--ulm-blue)); }
  .ulm-row, .metric-heading, .climate-top {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    min-height: 66px;
    padding: 12px;
  }
  .ulm-icon {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    color: rgb(var(--tone, var(--ulm-blue)));
    background: rgba(var(--tone, var(--ulm-blue)), .16);
    flex: 0 0 auto;
  }
  .ulm-icon ha-icon { --mdc-icon-size: 21px; }
  .ulm-icon.entity-picture { background-position: center; background-size: cover; }
  .action-surface.layout-vertical {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .action-surface.layout-vertical .ulm-copy { align-items: center; }
  .tone-blue { --tone: var(--ulm-blue); }
  .tone-yellow { --tone: var(--ulm-yellow); }
  .tone-red { --tone: var(--ulm-red); }
  .tone-green { --tone: var(--ulm-green); }
  .tone-purple { --tone: var(--ulm-purple); }
  .tone-grey { --tone: var(--ulm-grey); }
  .ulm-copy { display: flex; min-width: 0; flex-direction: column; gap: 3px; }
  .ulm-name, .ulm-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ulm-name { font-size: 14px; font-weight: 600; }
  .ulm-label { color: var(--secondary-text-color); font-size: 12px; text-transform: capitalize; }
  .ulm-controls { display: flex; align-items: center; gap: 7px; }
  .ulm-control, .scene-button {
    border: 0;
    background: rgba(var(--ulm-grey), .10);
    color: var(--primary-text-color);
    cursor: pointer;
  }
  .ulm-control {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 12px;
  }
  .ulm-control ha-icon { --mdc-icon-size: 18px; }
  .metric-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-height: 34px;
    padding: 0 12px;
    border-radius: 14px;
    background: rgba(var(--ulm-grey), .08);
    color: var(--primary-text-color);
    font-size: 13px;
  }
  .metric-pill ha-icon { --mdc-icon-size: 18px; color: rgba(var(--ulm-grey), .9); }
  .ulm-weather { padding: 12px; }
  .legacy-weather {
    display: grid;
    min-height: 86px;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 18px;
    padding: 16px 22px;
    border-radius: 20px;
    background: #4aa8e8;
    color: #fff;
  }
  .legacy-weather-current { display: flex; align-items: center; gap: 14px; }
  .legacy-weather-current > ha-icon { --mdc-icon-size: 36px; }
  .legacy-weather-current span, .legacy-weather-details { display: flex; flex-direction: column; gap: 3px; }
  .legacy-weather-current b, .legacy-weather-details b { font-size: 16px; }
  .legacy-weather-current small, .legacy-weather-details span { font-size: 14px; font-weight: 700; text-transform: capitalize; }
  .legacy-weather-details { align-items: flex-end; }
  .legacy-weather-details span { display: flex; flex-direction: row; align-items: center; gap: 5px; }
  .legacy-weather-details ha-icon { --mdc-icon-size: 18px; }
  .ulm-weather.has-backdrop {
    background: linear-gradient(135deg, rgba(var(--ulm-blue), .15), rgba(var(--ulm-yellow), .12));
  }
  .weather-main { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 14px; }
  .weather-icon { width: 56px; height: 56px; }
  .weather-icon ha-icon { --mdc-icon-size: 30px; }
  .weather-summary { display: grid; grid-template-columns: auto 1fr; align-items: baseline; column-gap: 10px; }
  .weather-temp { grid-row: 1 / 3; font-size: 30px; font-weight: 300; letter-spacing: -1px; }
  .weather-condition { margin-top: 2px; }
  .weather-extrema { color: var(--secondary-text-color); font-size: 11px; }
  .weather-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
  .weather-metrics .metric-pill { justify-content: center; }
  .weather-forecast { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 10px; }
  .weather-forecast span { display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 12px; }
  .weather-forecast ha-icon { --mdc-icon-size: 17px; color: rgb(var(--ulm-blue)); }
  .ulm-light-card { display: grid; gap: 12px; padding: 12px; }
  .ulm-light-card.is-horizontal { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: center; }
  .ulm-light-card.is-horizontal .brightness-presets { display: none; }
  .light-header { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 12px; min-height: 42px; border-radius: 14px; }
  .light-header.is-active .light-icon {
    background: rgba(var(--light-rgb), .2);
    color: rgb(var(--light-rgb));
  }
  .light-header:not(.is-active) .light-icon {
    background: rgba(var(--ulm-grey), .06);
    color: rgba(var(--ulm-grey), .35);
  }
  .ulm-light-slider {
    position: relative;
    height: 42px;
    overflow: hidden;
    border-radius: 14px;
    background: rgba(var(--light-rgb), .2);
  }
  .ulm-light-slider i {
    position: absolute;
    inset: 0 auto 0 0;
    width: var(--light-level);
    border-radius: inherit;
    background: rgb(var(--light-rgb));
    pointer-events: none;
  }
  .ulm-light-slider input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    cursor: pointer;
    opacity: 0;
  }
  .ulm-light-card.is-collapsed .ulm-light-slider,
  .ulm-light-card.is-collapsed .brightness-presets { display: none; }
  .brightness-presets { justify-content: center; }
  .ulm-climate { padding-bottom: 12px; }
  .climate-top { padding-bottom: 8px; }
  .climate-target { color: rgb(var(--ulm-red)); font-size: 23px; font-weight: 600; }
  .ulm-climate > .metric-pill { margin-left: 66px; }
  .ulm-climate > .ulm-controls { float: right; margin: -36px 12px 0 0; }
  .ulm-person .person-picture {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background-position: center;
    background-size: cover;
  }
  .presence-dot { width: 12px; height: 12px; border: 3px solid var(--card-background-color); border-radius: 50%; }
  .presence-dot.home { background: rgb(var(--ulm-blue)); }
  .presence-dot.away { background: rgb(var(--ulm-green)); }
  .ulm-person.is-compact { min-height: 52px; padding-top: 7px; padding-bottom: 7px; }
  .battery-ring, .battery-value { color: rgb(var(--ulm-green)); font-weight: 700; }
  .ulm-battery { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 12px; padding: 12px; }
  .battery-value { font-size: 24px; }
  .battery-value small { font-size: 12px; }
  .battery-track { grid-column: 2 / -1; height: 5px; overflow: hidden; border-radius: 5px; background: rgba(var(--ulm-grey), .12); }
  .battery-track i { display: block; height: 100%; border-radius: inherit; background: rgb(var(--ulm-green)); }
  .ulm-battery.is-charging .ulm-icon { animation: ulm-charge 1.1s ease-in-out infinite alternate; }
  .ulm-default-battery { grid-template-columns: auto minmax(0, 1fr); }
  @keyframes ulm-charge { from { transform: scale(.92); } to { transform: scale(1.06); } }
  .minimalist-bar-card {
    display: grid;
    min-height: 96px;
    grid-template-rows: minmax(60px, 1fr) 35px;
    overflow: hidden;
    border-radius: 20px;
    background: var(--ha-card-background, var(--card-background-color, #fff));
  }
  .minimalist-bar-card.bar-only {
    min-height: 35px;
    grid-template-rows: 35px;
  }
  .bar-card-header {
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
  }
  .bar-card-icon {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    color: var(--bar-icon-color);
    background: color-mix(in srgb, var(--bar-icon-color) 12%, transparent);
  }
  .bar-card-icon ha-icon { --mdc-icon-size: 21px; }
  .bar-card-copy { display: flex; min-width: 0; flex-direction: column; line-height: 1.15; }
  .bar-card-primary-value {
    overflow: hidden;
    color: var(--primary-text-color);
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bar-card-name {
    overflow: hidden;
    margin-top: 2px;
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bar-card-track {
    position: relative;
    height: 35px;
    overflow: hidden;
    background: color-mix(in srgb, var(--bar-fill) 16%, var(--ha-card-background, #202124));
  }
  .bar-card-fill {
    position: absolute;
    inset: 0 auto 0 0;
    background: var(--bar-fill);
  }
  .bar-card-inside-value {
    position: absolute;
    top: 50%;
    right: 8px;
    z-index: 1;
    color: var(--primary-text-color);
    font-size: 12px;
    transform: translateY(-50%);
  }
  .bar-card-indicator {
    position: absolute;
    top: 50%;
    z-index: 2;
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-left: 6px solid var(--primary-text-color);
    transform: translate(-1px, -50%);
  }
  .ulm-metric { padding: 0 12px 12px; }
  .metric-heading { padding-left: 0; padding-right: 0; }
  .metric-value { color: rgb(var(--ulm-blue)); font-size: 20px; font-weight: 650; }
  .sparkline { width: 100%; height: 48px; overflow: visible; }
  .sparkline polyline { fill: none; stroke: rgb(var(--ulm-blue)); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
  .sparkline.is-filled polyline { stroke: rgb(var(--ulm-red)); }
  .sparkline.is-filled polygon { fill: rgba(var(--ulm-red), .18); }
  .ulm-default-graph { padding: 0 12px 8px; }
  .ulm-default-graph .metric-heading { padding-right: 0; padding-left: 0; }
  .metric-extremes { display: flex; justify-content: space-between; color: var(--secondary-text-color); font-size: 11px; }
  .ulm-scenes { padding: 12px; }
  .scene-grid { display: flex; flex-wrap: wrap; gap: 10px; }
  .scene-button { display: flex; width: 64px; min-width: 64px; min-height: 88px; flex-direction: column; align-items: center; justify-content: space-between; gap: 5px; padding: 7px 5px 10px; border-radius: 32px; background: var(--ha-card-background, #fff); box-shadow: 0 2px 6px rgba(0,0,0,.12); }
  .scene-button span { width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; }
  .scene-button i { display: grid; width: 46px; height: 46px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-purple), .14); font-style: normal; }
  .scene-button i { background: color-mix(in srgb, var(--item-color) 16%, transparent); }
  .scene-button ha-icon { --mdc-icon-size: 22px; color: var(--item-color); }
  .scene-button.is-active { background: color-mix(in srgb, var(--item-color) 12%, var(--ha-card-background, #fff)); }
  .welcome-scenes { padding: 18px; }
  .welcome-toolbar { display: grid; grid-template-columns: 42px 1fr 42px; align-items: center; gap: 10px; margin-bottom: 24px; }
  .welcome-toolbar-button, .welcome-date { display: inline-flex; min-height: 42px; align-items: center; justify-content: center; border: 0; border-radius: 22px; background: var(--ha-card-background, #fff); color: var(--primary-text-color); box-shadow: 0 2px 6px rgba(0,0,0,.12); }
  .welcome-date { justify-self: center; gap: 6px; padding: 0 14px; font-weight: 700; }
  .welcome-heading { display: flex; flex-direction: column; gap: 18px; margin-bottom: 14px; }
  .welcome-heading b { max-width: 260px; font-size: 28px; line-height: 1.08; }
  .welcome-heading span { color: var(--primary-text-color); font-size: 18px; font-weight: 700; }
  .ulm-media { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 12px; padding: 12px; }
  .media-art { width: 54px; height: 54px; border-radius: 12px; background-position: center; background-size: cover; }
  .ulm-media .ulm-controls { grid-column: 1 / -1; justify-content: center; }
  .ulm-vacuum, .ulm-security { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 12px; }
  .ulm-vacuum .ulm-controls { grid-column: 1 / -1; justify-content: center; }
  .ulm-default-vacuum { display: grid; min-height: 220px; gap: 22px; padding: 24px; background: #1d222a; color: #fff; }
  .vacuum-summary { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; }
  .vacuum-summary .ulm-icon { width: 72px; height: 72px; }
  .vacuum-summary .ulm-icon ha-icon { --mdc-icon-size: 36px; }
  .vacuum-summary .ulm-name { font-size: 22px; }
  .vacuum-summary .ulm-label { font-size: 18px; }
  .ulm-default-vacuum .ulm-label { color: rgba(255,255,255,.7); }
  .vacuum-battery { padding: 6px 9px; border-radius: 12px; background: rgba(255,255,255,.1); font-size: 11px; }
  .vacuum-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .vacuum-actions .ulm-control { width: 100%; height: 68px; border-radius: 18px; background: rgba(255,255,255,.1); color: #fff; }
  .vacuum-actions .ulm-control ha-icon { --mdc-icon-size: 28px; }
  .security-status { padding: 5px 9px; border-radius: 10px; background: rgba(var(--ulm-green), .12); color: rgb(var(--ulm-green)); font-size: 11px; font-weight: 700; }
  .ulm-navigation { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 12px; }
  .ulm-cover { display: grid; gap: 8px; padding: 0 12px 12px; }
  .ulm-cover > .ulm-row { padding-right: 0; padding-left: 0; }
  .cover-controls { display: grid; grid-template-columns: repeat(3, 1fr); }
  .cover-controls .ulm-control { width: 100%; height: 32px; border-radius: 12px; }
  .ulm-cover > .ulm-slider { width: 100%; }
  .ulm-fan { display: grid; gap: 10px; padding: 0 12px 12px; }
  .ulm-fan > .ulm-row { padding-left: 0; padding-right: 0; }
  .ulm-fan > .ulm-slider { width: 100%; accent-color: rgb(var(--ulm-blue)); }
  .ulm-fan-slider { position: relative; height: 42px; overflow: hidden; border-radius: 14px; background: rgba(var(--ulm-grey), .14); }
  .ulm-fan-slider i { position: absolute; inset: 0 auto 0 0; width: var(--fan-level); background: rgb(var(--ulm-yellow)); }
  .ulm-fan-slider input { position: absolute; inset: 0; width: 100%; height: 100%; margin: 0; opacity: 0; }
  .ulm-room { display: grid; min-height: 210px; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; padding: 14px; }
  .room-main { display: flex; min-width: 0; flex-direction: column; justify-content: space-between; gap: 12px; }
  .room-main .ulm-icon { width: 116px; height: 116px; margin: 0 0 -14px -14px; border-radius: 0 58px 0 14px; }
  .room-main .ulm-icon ha-icon { --mdc-icon-size: 56px; }
  .room-entities { display: flex; flex-direction: column; justify-content: flex-end; gap: 7px; }
  .room-entities .metric-pill { width: 46px; min-height: 46px; justify-content: center; overflow: hidden; padding: 0; color: transparent; }
  .room-sensor { border: 0; cursor: pointer; }
  .room-sensor ha-icon { color: var(--item-color); }
  .room-sensor.is-active { background: color-mix(in srgb, var(--item-color) 18%, transparent); }
  .room-sensor span { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .ulm-camera { position: relative; min-height: 150px; overflow: hidden; background: rgba(var(--ulm-grey), .08); }
  .ulm-camera img { display: block; width: 100%; height: 180px; object-fit: cover; }
  .camera-placeholder { display: grid; min-height: 150px; place-items: center; }
  .camera-caption { position: absolute; right: 10px; bottom: 10px; left: 10px; padding: 9px; border-radius: 10px; background: rgba(255,255,255,.88); backdrop-filter: blur(8px); }
  .ulm-generic-swap { grid-template-columns: minmax(0, 1fr) auto; }
  .ulm-detail-card, .ulm-schedule-card, .ulm-device-status, .ulm-helper-card {
    display: grid;
    gap: 10px;
    padding: 0 12px 12px;
  }
  .ulm-detail-card > .ulm-row, .ulm-schedule-card > .ulm-row,
  .ulm-device-status > .ulm-row, .ulm-helper-card > .ulm-row {
    padding-right: 0;
    padding-left: 0;
  }
  .detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; }
  .detail-grid .metric-pill { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .schedule-list { display: grid; gap: 6px; }
  .schedule-list span { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 7px 9px; border-radius: 10px; background: rgba(var(--ulm-grey), .07); font-size: 11px; }
  .schedule-list small { color: var(--secondary-text-color); }
  .device-value { color: rgb(var(--ulm-blue)); font-size: 18px; }
  .device-progress { height: 6px; overflow: hidden; border-radius: 6px; background: rgba(var(--ulm-grey), .12); }
  .device-progress i { display: block; height: 100%; border-radius: inherit; background: rgb(var(--ulm-blue)); }
  .ulm-helper-card .ulm-slider { width: 100%; accent-color: rgb(var(--ulm-blue)); }
  .ulm-gauge-card { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 12px; padding: 12px; }
  .gauge-ring { position: relative; display: grid; width: 64px; height: 64px; place-items: center; border-radius: 50%; background: conic-gradient(rgb(var(--ulm-blue)) var(--gauge), rgba(var(--ulm-grey), .12) 0); }
  .gauge-ring::before { content: ""; position: absolute; width: 48px; height: 48px; border-radius: 50%; background: var(--card-background-color); }
  .gauge-ring b { position: relative; z-index: 1; font-size: 11px; }
  .ulm-title { display: flex; align-items: center; gap: 10px; padding: 8px 2px; box-shadow: none; background: transparent; }
  .ulm-title .ulm-name { font-size: 18px; }
  .ulm-title.variant-divider-title { padding-bottom: 10px; border-bottom: 2px solid var(--divider-color); }
  .ulm-title.variant-divider-subtitle { padding-bottom: 7px; border-bottom: 1px solid var(--divider-color); }
  .ulm-title.variant-divider-subtitle .ulm-name { color: var(--secondary-text-color); font-size: 14px; }
  .ulm-vertical-button { display: flex; min-height: 96px; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 12px; text-align: center; }
  .ulm-vertical-button .ulm-copy { align-items: center; }
  .ulm-binary.is-alert { background: rgba(var(--ulm-red), .1); }
  .ulm-simple-default, .ulm-default-navigation { grid-template-columns: auto minmax(0, 1fr); }
  .preview { padding: 16px; color: var(--secondary-text-color); text-align: center; }
`;
