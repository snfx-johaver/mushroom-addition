import { css } from "lit";

export const sharedStyles = css`
  :host {
    --ulm-blue: 3, 169, 244;
    --ulm-yellow: 255, 193, 7;
    --ulm-red: 244, 67, 54;
    --ulm-green: 76, 175, 80;
    --ulm-orange: 255, 152, 0;
    --ulm-purple: 156, 39, 176;
    --ulm-grey: var(--mush-rgb-grey, var(--rgb-grey, 158, 158, 158));
    --addition-neutral-background: rgba(var(--rgb-primary-text-color, 33, 33, 33), .05);
    --addition-track-background: rgba(var(--rgb-secondary-text-color, 114, 114, 114), .2);
    --addition-disabled-rgb: var(--mush-rgb-disabled, var(--rgb-disabled, 189, 189, 189));
    --addition-disabled-background: rgba(var(--addition-disabled-rgb), .2);
    --addition-raised-background: var(--card-background-color, var(--ha-card-background, var(--secondary-background-color)));
    --addition-raised-shadow: 0 2px 7px rgba(0,0,0,.12);
    container-type: inline-size;
    display: block;
    min-width: 0;
  }
  :host([dark]) {
    --addition-neutral-background: rgba(var(--rgb-primary-text-color, 225, 225, 225), .05);
    --addition-track-background: rgba(var(--rgb-secondary-text-color, 155, 155, 155), .2);
    --addition-disabled-rgb: var(--mush-rgb-disabled, var(--rgb-disabled, 111, 111, 111));
    --addition-raised-background: color-mix(in srgb, var(--primary-text-color, #fff) 7%, var(--ha-card-background, var(--card-background-color, #1c1c1c)));
    --addition-raised-shadow: 0 3px 8px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.09), 0 0 0 1px rgba(255,255,255,.04);
  }
  .mushroom-addition-card {
    display: block;
    overflow: hidden;
    box-sizing: border-box;
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0));
    border-radius: var(--mush-card-primary-border-radius, 14px);
    background: var(--ha-card-background, var(--card-background-color, #fff));
    box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,.08));
  }
  .mushroom-addition-card:has(.fill-container), .fill-container { height: 100%; }
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
    width: var(--mush-icon-size, 40px);
    height: var(--mush-icon-size, 40px);
    border-radius: 50%;
    color: rgb(var(--tone, var(--ulm-blue)));
    background: rgba(var(--tone, var(--ulm-blue)), .16);
    flex: 0 0 auto;
  }
  .ulm-icon > ha-icon, .ulm-icon > ha-state-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .ulm-icon.entity-picture { background-position: center; background-size: cover; }
  .source-icon {
    color: color-mix(in srgb, var(--source-color) 20%, rgba(var(--ulm-grey), .35));
    background: color-mix(in srgb, var(--source-color) 5%, transparent);
  }
  .source-icon.is-source-active {
    color: var(--source-color);
    background: color-mix(in srgb, var(--source-color) 20%, transparent);
  }
  .is-source-background { background: color-mix(in srgb, var(--source-color, rgb(var(--ulm-blue))) 14%, transparent); }
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
  .tone-orange { --tone: var(--ulm-orange); }
  .tone-purple { --tone: var(--ulm-purple); }
  .tone-grey { --tone: var(--ulm-grey); }
  .ulm-copy { display: flex; min-width: 0; flex-direction: column; gap: 3px; }
  .ulm-name, .ulm-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .multiline-secondary .ulm-label {
    overflow: visible; text-overflow: clip; white-space: normal;
  }
  .card-heading {
    display: flex;
    min-width: 0;
    min-height: var(--mush-icon-size, 40px);
    align-items: center;
    gap: 12px;
  }
  .card-heading > .ulm-copy { flex: 1; }
  .automatic-presentation { min-width: 0; }
  .upcoming-card, .remote-card, .pi-hole-card { padding: 12px; }
  .upcoming-card > .card-heading, .remote-card > .card-heading, .pi-hole-card > .card-heading { margin-bottom: 12px; }
  .upcoming-card > .automatic-presentation, .remote-card > .automatic-presentation { margin-bottom: 12px; }
  .ulm-name { font-size: 14px; font-weight: 600; }
  .ulm-label { color: var(--secondary-text-color); font-size: 12px; text-transform: capitalize; }
  .ulm-controls { display: flex; align-items: center; gap: 7px; }
  .ulm-control, .scene-button {
    border: 0;
    background: var(--addition-neutral-background);
    color: var(--primary-text-color);
    cursor: pointer;
  }
  .ulm-control {
    box-shadow: var(--addition-raised-shadow);
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
    background: var(--addition-neutral-background);
    color: var(--primary-text-color);
    font-size: 13px;
  }
  .metric-pill ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color); }
  .climate-top { padding-bottom: 8px; }
  .climate-target { color: rgb(var(--ulm-red)); font-size: 23px; font-weight: 600; }
  .climate-current { font-size: 18px; font-weight: 700; }
  .battery-ring, .battery-value { color: rgb(var(--ulm-green)); font-weight: 700; }
  .ulm-battery { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 12px; padding: 12px; }
  .battery-value { font-size: 24px; }
  .battery-value small { font-size: 12px; }
  .battery-track { grid-column: 2 / -1; height: 5px; overflow: hidden; border-radius: 5px; background: var(--addition-track-background); }
  .battery-track i { display: block; height: 100%; border-radius: inherit; background: rgb(var(--ulm-green)); }
  .ulm-battery.is-charging .ulm-icon { animation: ulm-charge 1.1s ease-in-out infinite alternate; }
  .ulm-default-battery { grid-template-columns: auto minmax(0, 1fr); }
  .ulm-default-battery.is-charging .source-icon { animation: ulm-charge 3s linear infinite; }
  @keyframes ulm-charge { from { transform: scale(.92); } to { transform: scale(1.06); } }
  .ulm-metric { padding: 0 12px 12px; }
  .metric-heading { padding-left: 0; padding-right: 0; }
  .entity-carousel-presentation { padding: 12px; }
  .entity-carousel-presentation .ulm-icon > ha-state-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .entity-carousel-presentation .ulm-copy { justify-content: center; }
  .metric-value { color: rgb(var(--ulm-blue)); font-size: 20px; font-weight: 650; }
  .sparkline { width: 100%; height: 48px; overflow: visible; }
  .sparkline polyline { fill: none; stroke: var(--sparkline-color, rgb(var(--ulm-blue))); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
  .sparkline.is-filled polyline { stroke: var(--sparkline-color, rgb(var(--ulm-red))); }
  .sparkline.is-filled polygon { fill: color-mix(in srgb, var(--sparkline-fill-color, rgb(var(--ulm-red))) 18%, transparent); }
  .metric-extremes { display: flex; justify-content: space-between; color: var(--secondary-text-color); font-size: 11px; }
  .ulm-scenes { padding: 12px; }
  .scene-grid { display: flex; min-width: 0; gap: 8px; overflow-x: auto; padding: 4px 4px 10px; margin: -4px -4px -10px; }
  .scene-button { display: flex; min-width: 52px; flex: 1; flex-direction: column; align-items: center; gap: 6px; padding: 7px 4px 10px; border: 0; border-radius: 25px; background: var(--addition-raised-background); color: var(--primary-text-color); box-shadow: var(--addition-raised-shadow); }
  .scene-button > span { max-width: 48px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 9px; font-weight: 700; }
  .scene-button i { display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: rgba(var(--ulm-purple), .14); font-style: normal; }
  .scene-button i > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .scene-button i { background: color-mix(in srgb, var(--item-color) 18%, transparent); }
  .scene-entity-picture { display: block; width: 100%; height: 100%; border-radius: inherit; background-position: center; background-size: cover; }
  .scene-button ha-icon { --mdc-icon-size: 22px; color: var(--item-color); }
  .scene-button.is-active { background: var(--addition-raised-background); }
  .welcome-scenes {
    --welcome-surface: var(--addition-neutral-background);
    padding: 10px;
  }
  .welcome-toolbar { display: grid; grid-template-columns: 42px 1fr 42px; align-items: center; gap: 10px; padding: 4px; margin-bottom: 8px; }
  .welcome-toolbar-button, .welcome-date {
    display: inline-flex;
    min-height: 42px;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--divider-color, rgba(var(--ulm-grey), .2));
    border-radius: 22px;
    background: var(--welcome-surface);
    color: var(--primary-text-color);
    box-shadow: none;
  }
  .welcome-toolbar-button { cursor: pointer; }
  .welcome-toolbar-button:hover, .welcome-scenes .scene-button:hover {
    background: color-mix(in srgb, var(--primary-text-color) 13%, transparent);
  }
  .welcome-toolbar-button:focus-visible, .welcome-scenes .scene-button:focus-visible {
    outline: 2px solid var(--primary-color, rgb(var(--ulm-blue)));
    outline-offset: 2px;
  }
  .welcome-date { justify-self: center; gap: 6px; padding: 0 14px; font-weight: 700; border: 0; background: transparent; }
  .welcome-date ha-icon, .welcome-toolbar-button ha-icon { color: var(--secondary-text-color); }
  .welcome-heading { margin: 0 16px 14px; }
  .welcome-heading b { max-width: 260px; font-size: 24px; line-height: 1.15; }
  .welcome-scenes-heading { display: flex; align-items: center; justify-content: space-between; margin: 0 16px 10px; font-size: 18px; }
  .welcome-scenes-more {
    display: inline-grid;
    width: 36px;
    height: 36px;
    place-items: center;
    border-radius: 50%;
    background: transparent;
    color: var(--secondary-text-color);
    cursor: pointer;
  }
  .welcome-scenes-more:hover { background: color-mix(in srgb, var(--primary-text-color) 10%, transparent); }
  .welcome-scenes-more:focus-visible {
    outline: 2px solid var(--primary-color, rgb(var(--ulm-blue)));
    outline-offset: 2px;
  }
  .welcome-scenes-more ha-icon { --mdc-icon-size: 20px; }
  .media-art { position: absolute; inset: 0; z-index: 0; background-position: center; background-size: cover; }
  .media-art::after { position: absolute; inset: 0; background: rgba(0,0,0,.25); content: ""; }
  .ulm-security { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 12px; }
  .security-status { padding: 5px 9px; border-radius: 10px; background: rgba(var(--ulm-green), .12); color: rgb(var(--ulm-green)); font-size: 11px; font-weight: 700; }
  .ulm-navigation { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 12px; }
  .ulm-room { display: grid; min-height: 210px; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; padding: 14px; }
  .ulm-source-room { position: relative; aspect-ratio: 1; min-height: 0; padding: 5px; border-radius: 20px; }
  .room-main { display: flex; min-width: 0; flex-direction: column; justify-content: space-between; gap: 12px; }
  .room-copy { z-index: 1; display: flex; min-width: 0; flex-direction: column; gap: 5px; padding: 12px 0 0 12px; }
  .room-copy b { overflow: hidden; font-size: 18px; text-overflow: ellipsis; white-space: nowrap; }
  .room-copy span { overflow: hidden; color: var(--secondary-text-color); font-size: 14px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
  .room-main .ulm-icon { width: 116px; height: 116px; margin: 0 0 -14px -14px; border-radius: 0 58px 0 14px; }
  .ulm-source-room .room-main .ulm-icon { position: absolute; bottom: 0; left: 0; width: 75%; height: 75%; margin: 0; border-radius: 50%; transform: translate(-25%, 25%); }
  .room-main .ulm-icon ha-icon, .room-main .ulm-icon ha-state-icon { --mdc-icon-size: 56px; }
  .room-entities { display: flex; flex-direction: column; justify-content: flex-end; gap: 7px; }
  .room-entities .metric-pill { width: 46px; min-height: 46px; justify-content: center; overflow: hidden; padding: 0; color: transparent; }
  .room-sensor { border: 0; cursor: pointer; }
  .room-sensor > ha-icon { flex: 0 0 24px; width: 24px; height: 24px; --mdc-icon-size: 24px; color: var(--item-color); }
  .room-sensor-picture { display: block; flex: 0 0 38px; width: 38px; height: 38px; border-radius: 50%; background-position: center; background-size: cover; }
  .room-sensor.is-active { background: color-mix(in srgb, var(--item-color) 18%, transparent); }
  .room-sensor .room-sensor-label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .room-sensor:disabled { cursor: default; opacity: .45; }
  .ulm-source-room.dynamic-color { background: rgba(var(--room-rgb), .2); }
  .ulm-source-room.dynamic-color .room-main > .ulm-icon { color: rgb(var(--room-rgb)); background: rgba(var(--room-rgb), .3); }
  .room-status { display: flex; flex: 0 0 25px; max-width: 100%; overflow: hidden; gap: 5px; }
  .room-status-indicator { display: grid; flex: 0 0 25px; place-items: center; width: 25px; height: 25px; padding: 0; border: 0; border-radius: 50%; color: var(--secondary-text-color); background: var(--addition-neutral-background); cursor: pointer; }
  .room-status-indicator > ha-icon { flex: 0 0 18px; width: 18px; height: 18px; --mdc-icon-size: 18px; }
  .room-status-indicator.is-active { color: rgb(var(--ulm-yellow)); }
  .room-status-indicator.is-unavailable { opacity: .45; cursor: default; }
  .room-status-indicator.kind-water.is-active { color: rgb(var(--ulm-blue)); animation: room-status-pulse 1.6s ease-in-out infinite; }
  .room-status-indicator.kind-smoke.is-active { color: rgb(var(--ulm-red)); animation: room-status-pulse 1.6s ease-in-out infinite; }
  .room-status-indicator:focus-visible, .room-sensor:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
  @keyframes room-status-pulse { 50% { opacity: .4; } }
  @media (prefers-reduced-motion: reduce) {
    .room-status-indicator.kind-water.is-active, .room-status-indicator.kind-smoke.is-active { animation: none; }
  }
  .room-unavailable {
    position: absolute;
    bottom: 22%;
    left: 22%;
    z-index: 2;
    display: grid;
    width: 24px;
    height: 24px;
    place-items: center;
    border: 2px solid var(--card-background-color, #fff);
    border-radius: 50%;
    background: rgb(var(--ulm-red));
    color: var(--primary-background-color, #fff);
  }
  .room-unavailable ha-icon { --mdc-icon-size: 13px; }
  .ulm-generic-swap { grid-template-columns: minmax(0, 1fr) auto; }
  .ulm-generic.force-background, .ulm-generic-swap.force-background {
    background: color-mix(in srgb, var(--source-color, rgb(var(--ulm-blue))) 16%, transparent);
  }
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
  .schedule-list span { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 7px 9px; border-radius: 10px; background: var(--addition-neutral-background); font-size: 11px; }
  .schedule-list small { color: var(--secondary-text-color); }
  .device-value { color: rgb(var(--ulm-blue)); font-size: 18px; }
  .device-progress { height: 6px; overflow: hidden; border-radius: 6px; background: var(--addition-track-background); }
  .device-progress i { display: block; height: 100%; border-radius: inherit; background: rgb(var(--ulm-blue)); }
  .ulm-helper-card .ulm-slider { width: 100%; accent-color: rgb(var(--ulm-blue)); }
  .ulm-simple-default { grid-template-columns: auto minmax(0, 1fr); }
  .script-title { font-size: 14px; font-weight: 600; white-space: nowrap; }
  .custom-card-heading {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
  }
  .custom-waste-card, .custom-alarm-time, .custom-washer, .custom-input-datetime {
    display: grid;
    gap: 12px;
    padding: 12px;
  }
  .waste-grid { display: grid; gap: 5px; }
  .waste-summary { display: flex; flex-wrap: wrap; gap: 2px 10px; text-transform: none; }
  .waste-row {
    display: grid;
    grid-template-columns: 24px 1fr auto;
    align-items: center;
    gap: 8px;
    min-height: 30px;
    padding: 0 9px;
    border-radius: 10px;
    background: var(--addition-neutral-background);
  }
  .waste-row ha-icon { --mdc-icon-size: 17px; color: var(--waste-color, rgb(var(--ulm-green))); }
  .waste-row b, .waste-row small { font-size: 11px; }
  .waste-row small { color: var(--secondary-text-color); }
  .alarm-time-controls {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: center;
    gap: 10px;
  }
  .alarm-time-controls .ulm-control {
    width: 100%;
    height: 56px;
    border-radius: 18px;
  }
  .alarm-time-controls > b { text-align: center; font-size: 18px; }
  .custom-alarm-time.is-horizontal { grid-template-columns: minmax(0, 1fr) minmax(180px, 1fr); align-items: center; }
  .custom-room-view { display: grid; min-width: 0; min-height: 150px; gap: 8px; padding: 12px; }
  .room-view-summary { display: flex; width: 100%; min-width: 0; align-items: center; gap: 10px; padding: 0; border: 0; background: transparent; color: var(--primary-text-color); font: inherit; text-align: start; cursor: pointer; }
  .room-view-summary .ulm-copy { min-width: 0; }
  .room-view-icon { position: relative; display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: var(--addition-disabled-background); color: rgb(var(--addition-disabled-rgb)); }
  .room-view-icon > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .room-view-status { display: flex; min-height: 28px; align-items: center; justify-content: center; gap: 2px; }
  .room-view-status button, .room-view-clear, .room-view-warning { position: relative; display: grid; width: 35px; height: 28px; padding: 0; place-items: center; border: 0; background: transparent; color: var(--secondary-text-color); }
  .room-view-status button > ha-icon { --mdc-icon-size: 20px; }
  .room-view-status .is-unavailable, .room-view-warning { color: var(--error-color, #db4437); }
  .room-view-warning ha-icon { --mdc-icon-size: 18px; }
  .room-view-actions { display: flex; gap: 7px; }
  .room-view-actions button { position: relative; display: grid; min-width: 40px; height: 44px; flex: 1; padding: 0; place-items: center; border: 0; border-radius: 14px; background: var(--addition-neutral-background); color: var(--secondary-text-color); cursor: pointer; box-shadow: var(--addition-raised-shadow); }
  .room-view-actions button.is-active { background: rgba(var(--ulm-yellow), .25); color: rgb(var(--ulm-yellow)); }
  .room-view-actions button:disabled { opacity: .45; cursor: not-allowed; }
  .room-view-actions i, .room-view-status i { position: absolute; top: 5px; right: 30%; display: grid; min-width: 16px; height: 16px; place-items: center; border-radius: 9px; background: rgb(var(--ulm-blue)); color: #fff; font-size: 10px; font-style: normal; }
  .custom-room-view button:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
  .custom-welcome { display: grid; gap: 18px; padding: 14px; }
  .welcome-toolbar { display: flex; justify-content: space-between; }
  .welcome-toolbar button { display: grid; width: 38px; height: 38px; padding: 0; place-items: center; border: 0; border-radius: 50%; background: var(--addition-raised-background); color: inherit; box-shadow: var(--addition-raised-shadow); }
  .welcome-toolbar button:disabled { visibility: hidden; }
  .welcome-greeting { font-size: 23px; line-height: 1.08; }
  .welcome-items { display: flex; gap: 8px; overflow-x: auto; padding: 4px 4px 10px; margin: -4px -4px -10px; }
  .welcome-items > button { display: flex; min-width: 52px; flex: 1; flex-direction: column; align-items: center; gap: 6px; padding: 7px 4px 10px; border: 0; border-radius: 25px; background: var(--addition-raised-background); color: inherit; box-shadow: var(--addition-raised-shadow); }
  .welcome-items i { display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: rgba(var(--tone), .18); color: rgb(var(--tone)); font-style: normal; }
  .welcome-items i > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .welcome-items small { max-width: 48px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 9px; font-weight: 700; }
  .washer-heading .washer-power { font-size: 12px; font-weight: 700; }
  .washer-stages { display: grid; grid-template-columns: repeat(var(--washer-stage-count, 4), 1fr); border-radius: 22px; background: var(--addition-neutral-background); }
  .washer-stages span { display: grid; height: 42px; place-items: center; color: rgb(var(--addition-disabled-rgb)); }
  .washer-stages span.is-active { color: var(--primary-text-color); }
  .washer-stages span.is-active ha-icon { padding: 9px; border-radius: 50%; background: var(--card-background-color); }
  .washer-controls { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .washer-controls .ulm-control { width: 100%; height: 42px; border-radius: 16px; }
  .washer-remote { color: var(--secondary-text-color); font-size: 11px; text-align: center; }
  .custom-sun-card { display: grid; min-height: 210px; gap: 8px; padding: 18px; }
  .astronomy-times { display: grid; min-width: 0; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
  .astronomy-times span, .sun-footer span { display: flex; min-width: 0; flex-direction: column; gap: 3px; }
  .astronomy-times span:nth-child(2), .astronomy-times span:nth-child(3) { align-items: center; }
  .astronomy-times span:last-child, .sun-footer span:last-child { align-items: flex-end; }
  .astronomy-times small, .sun-footer small { color: var(--secondary-text-color); overflow-wrap: anywhere; }
  .astronomy-times b { font-size: 16px; font-weight: 500; font-variant-numeric: tabular-nums; }
  .sun-footer { display: flex; justify-content: space-between; }
  .sun-footer b { font-size: 13px; }
  .sun-arc { position: relative; height: 90px; }
  .sun-arc svg { display: block; width: 100%; height: 90px; overflow: visible; }
  .sun-arc line { stroke: rgba(var(--ulm-grey), .18); }
  .sun-arc .sun-day { fill: rgba(var(--ulm-blue), .48); stroke: none; }
  .sun-arc .sun-night { fill: #343579; stroke: none; }
  .sun-marker, .moon-marker {
    box-sizing: border-box;
    width: 20px;
    height: 20px;
  }
  .sun-marker {
    position: absolute;
    left: var(--sun-x);
    top: var(--sun-y);
    border-radius: 50%;
    background: #ffd45c;
    transform: translate(-50%, -50%);
  }
  .astronomy-position-rows { display: grid; gap: 4px; font-size: 12px; }
  .astronomy-position-rows > div {
    display: grid;
    grid-template-columns: 44px minmax(0, auto) minmax(0, auto);
    justify-content: start;
    gap: 14px;
  }
  .astronomy-position-rows strong { font-variant-numeric: tabular-nums; }
  .moon-section {
    display: grid;
    gap: 10px;
    margin-top: 6px;
    padding-top: 14px;
    border-top: 1px solid var(--divider-color, rgba(var(--ulm-grey), .18));
  }
  .moon-heading {
    display: grid;
    min-width: 0;
    grid-template-columns: 40px minmax(0, 1fr);
    align-items: center;
    gap: 12px;
  }
  .moon-symbol {
    display: grid;
    width: 40px;
    height: 40px;
    place-items: center;
    border-radius: 50%;
    background: var(--addition-neutral-background);
    color: var(--primary-text-color);
  }
  .moon-symbol ha-icon { --mdc-icon-size: 25px; }
  .moon-copy { display: grid; min-width: 0; gap: 2px; }
  .moon-copy b, .moon-copy small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .moon-copy b { font-size: 14px; }
  .moon-copy small { color: var(--secondary-text-color); font-size: 12px; text-transform: capitalize; }
  .moon-marker {
    position: absolute;
    left: var(--moon-x);
    top: var(--moon-y);
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 50%;
    background: var(--card-background-color, var(--ha-card-background));
    color: var(--primary-text-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .4);
    transform: translate(-50%, -50%);
  }
  .moon-marker.is-below { opacity: .62; }
  .astronomy-moon-marker { z-index: 2; }
  .moon-marker ha-icon {
    --mdc-icon-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    line-height: 0;
  }
  .moon-metrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px; }
  .moon-metric {
    display: grid;
    min-width: 0;
    min-height: 46px;
    grid-template-columns: 26px minmax(0, 1fr);
    align-items: center;
    gap: 8px;
    padding: 7px 9px;
    border-radius: 12px;
    background: var(--addition-neutral-background);
  }
  .moon-metric > ha-icon { --mdc-icon-size: 19px; color: var(--secondary-text-color); }
  .moon-metric > span { display: grid; min-width: 0; gap: 1px; }
  .moon-metric small, .moon-metric b { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .moon-metric small { color: var(--secondary-text-color); font-size: 10px; }
  .moon-metric b { font-size: 12px; font-variant-numeric: tabular-nums; }
  .media-platform { display: grid; width: 36px; height: 36px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-purple), .75); color: #fff; }
  .input-datetime-controls { display: grid; grid-template-columns: repeat(3, 1fr); align-items: center; gap: 7px; }
  .input-datetime-controls .ulm-control { width: 100%; height: 42px; border-radius: 14px; }
  .input-datetime-controls .hold-control { font-size: 16px; font-weight: 700; }
  .custom-sonos, .custom-printer,
  .custom-nas-metrics, .custom-tablet { display: grid; gap: 10px; padding: 12px; }
  .custom-sonos { position: relative; overflow: hidden; }
  .custom-sonos > :not(.media-art) { position: relative; z-index: 1; }
  .custom-sonos.has-art { color: #fff; }
  .custom-sonos.has-art .ulm-name, .custom-sonos.has-art .ulm-label,
  .custom-sonos.has-art .sonos-details summary, .custom-sonos.has-art .sonos-sliders label,
  .custom-sonos.has-art .sonos-sliders output { color: #fff; }
  .custom-sonos.has-art .ulm-label { color: rgba(255,255,255,.78); }
  .custom-sonos.has-art .ulm-icon, .custom-sonos.has-art .sonos-controls button,
  .custom-sonos.has-art .sonos-switches button, .custom-sonos.has-art .sonos-shortcuts button {
    border-color: rgba(255,255,255,.22); background: rgba(0,0,0,.32); color: #fff;
  }
  .sonos-controls {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(42px, 1fr)); align-items: center; gap: 7px;
  }
  .sonos-controls:empty { display: none; }
  .sonos-volume { grid-column: 1 / -1; display: flex; align-items: center; gap: 8px; min-width: 0; }
  .sonos-volume input { flex: 1; min-width: 0; accent-color: rgb(var(--rgb-blue, 3, 169, 244)); }
  .sonos-volume output { font-variant-numeric: tabular-nums; }
  .sonos-controls button[aria-pressed="true"] { color: rgb(var(--rgb-blue, 3, 169, 244)); }
  .sonos-controls button:disabled, .sonos-volume input:disabled { cursor: not-allowed; opacity: .45; }
  .sonos-controls button {
    box-shadow: var(--addition-raised-shadow);
    min-height: 42px; border: 0; border-radius: 13px; background: var(--addition-neutral-background); color: var(--primary-text-color);
  }
  .sonos-details { min-width: 0; }
  .sonos-details summary {
    display: flex; min-height: 40px; align-items: center; justify-content: space-between; padding: 0 4px;
    color: var(--primary-text-color); cursor: pointer; font-size: 14px; font-weight: 700; list-style: none;
  }
  .sonos-details summary::-webkit-details-marker { display: none; }
  .sonos-details summary ha-icon { --mdc-icon-size: 20px; transition: transform .2s ease; }
  .sonos-details[open] summary ha-icon { transform: rotate(180deg); }
  .sonos-details-always-visible { padding-top: 4px; }
  .sonos-switches { display: flex; flex-wrap: wrap; gap: 8px; padding: 4px 0 10px; }
  .sonos-switches button {
    box-shadow: var(--addition-raised-shadow);
    display: inline-flex; min-height: 40px; align-items: center; gap: 6px; padding: 0 12px;
    border: 0; border-radius: 20px; background: var(--card-background-color, var(--ha-card-background, #fff));
    color: var(--primary-text-color); font: inherit; font-size: 12px; font-weight: 700;
  }
  .sonos-switches button.is-active {
    background: rgba(var(--rgb-blue, 3, 169, 244), .12);
  }
  .sonos-switches button:disabled, .sonos-sliders input:disabled { cursor: not-allowed; opacity: .45; }
  .sonos-switches ha-icon { --mdc-icon-size: 18px; color: rgb(var(--rgb-blue, 3, 169, 244)); }
  .sonos-sliders { display: grid; gap: 8px; padding-top: 4px; }
  .sonos-sliders label {
    display: grid; grid-template-columns: 26px minmax(112px, .8fr) minmax(120px, 1fr) 34px;
    min-height: 40px; align-items: center; gap: 8px; color: var(--primary-text-color); font-size: 13px;
  }
  .sonos-sliders label > ha-icon { --mdc-icon-size: 18px; color: rgb(var(--rgb-blue, 3, 169, 244)); }
  .sonos-sliders input { width: 100%; accent-color: rgb(var(--rgb-blue, 3, 169, 244)); }
  .sonos-sliders output { color: var(--primary-text-color); text-align: right; font-variant-numeric: tabular-nums; }
  .sonos-shortcuts {
    display: grid; grid-template-columns: repeat(var(--sonos-shortcut-columns, 4), minmax(0, 1fr)); gap: 8px;
  }
  .sonos-shortcuts button {
    box-shadow: var(--addition-raised-shadow);
    display: grid; min-width: 0; min-height: 56px; place-items: center; gap: 4px; padding: 8px 4px;
    border: 0; border-radius: 14px;
    background: var(--card-background-color, var(--ha-card-background, #fff));
    color: var(--primary-text-color); cursor: pointer;
  }
  .sonos-shortcuts button:disabled { cursor: not-allowed; opacity: .45; }
  .sonos-shortcuts ha-icon { --mdc-icon-size: 22px; color: rgb(var(--rgb-blue, 3, 169, 244)); }
  .sonos-shortcuts span {
    min-width: 0; max-width: 100%; overflow: hidden; font-size: 11px; font-weight: 700;
    text-overflow: ellipsis; white-space: nowrap;
  }
  .nas-metrics-header {
    display: flex; min-width: 0; align-items: center; gap: 10px;
  }
  .toner-bars { display: grid; gap: 5px; }
  .toner-bars span { display: block; min-height: 30px; }
  .toner-bars i { position: relative; display: grid; box-sizing: border-box; height: 30px; overflow: hidden; place-items: center; border: 1px solid var(--divider-color); border-radius: 10px; background: var(--addition-track-background); font-style: normal; }
  .toner-bars em { position: absolute; inset: 0 auto 0 0; width: var(--level); background: var(--toner); }
  .toner-bars b { position: relative; z-index: 1; padding: 2px 7px; border-radius: 999px; background: color-mix(in srgb, var(--card-background-color, #fff) 88%, transparent); color: var(--primary-text-color); font-size: 12px; font-variant-numeric: tabular-nums; font-weight: 600; }
  .custom-nas-metrics { gap: 12px; padding: 12px; }
  .nas-metrics-top { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .nas-metrics-tile { box-sizing: border-box; display: grid; min-height: 66px; grid-template-columns: var(--mush-icon-size, 40px) minmax(0, 1fr); align-items: center; gap: 12px; padding: 12px; border: 0; border-radius: 30px; background: transparent; color: var(--primary-text-color); text-align: left; }
  button.nas-metrics-tile { cursor: pointer; }
  .nas-metrics-tile-icon { display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: rgba(var(--tone), .2); color: rgb(var(--tone)); }
  .nas-metrics-tile-icon ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .nas-metrics-tile > span:last-child, .nas-metrics-metrics > span > span { display: grid; }
  .nas-metrics-tile b, .nas-metrics-metrics b { font-size: var(--mush-card-primary-font-size, 14px); line-height: 20px; font-weight: 600; }
  .nas-metrics-tile small, .nas-metrics-metrics small { color: var(--secondary-text-color); font-size: var(--mush-card-secondary-font-size, 12px); line-height: 20px; font-weight: 400; }
  .nas-metrics-body { display: grid; grid-template-columns: minmax(150px, .9fr) minmax(180px, 1.2fr); align-items: center; gap: 18px; }
  .nas-metrics-metrics { display: grid; gap: 12px; }
  .nas-metrics-metrics > span { display: grid; min-height: 48px; grid-template-columns: var(--mush-icon-size, 40px) minmax(0, 1fr); align-items: center; gap: 12px; }
  .nas-metrics-metrics i { display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: rgba(var(--tone), .2); color: rgb(var(--tone)); font-style: normal; }
  .nas-metrics-metrics i ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .nas-metrics-rings { width: 100%; max-width: 190px; justify-self: center; overflow: visible; transform: rotate(-90deg); }
  .nas-metrics-ring-track, .nas-metrics-ring-value { fill: none; stroke-width: 6; }
  .nas-metrics-ring-track { stroke: var(--addition-track-background); }
  .nas-metrics-ring-value { stroke-linecap: round; }
  @container (max-width: 380px) {
    .custom-nas-metrics { gap: 10px; padding: 12px; }
    .nas-metrics-top { gap: 8px; }
    .nas-metrics-tile {
      min-width: 0;
      min-height: 66px;
      grid-template-columns: var(--mush-icon-size, 40px) minmax(0, 1fr);
      gap: 9px;
      padding: 9px 10px;
      border-radius: 24px;
    }
    .nas-metrics-tile > span:last-child { min-width: 0; overflow: hidden; }
    .nas-metrics-tile b, .nas-metrics-tile small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .nas-metrics-body { grid-template-columns: minmax(0, 1fr) minmax(0, min(132px, 45%)); gap: 8px; }
    .nas-metrics-metrics { gap: 6px; }
    .nas-metrics-metrics > span {
      min-height: 46px;
      grid-template-columns: var(--mush-icon-size, 40px) minmax(0, 1fr);
      gap: 8px;
    }
    .nas-metrics-rings { width: 132px; max-width: 100%; }
  }
  .custom-tablet { gap: 14px; padding: 18px; }
  .tablet-header { display: grid; grid-template-columns: var(--mush-icon-size, 40px) minmax(0, 1fr); align-items: center; gap: 12px; }
  .tablet-icon { display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: rgba(var(--ulm-blue), .2); color: rgb(var(--ulm-blue)); }
  .tablet-icon > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .tablet-header .ulm-name { font-size: 14px; }
  .tablet-header .ulm-label { font-size: 12px; }
  .tablet-controls { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .tablet-controls button { display: grid; height: 42px; place-items: center; border: 0; border-radius: 14px; background: rgba(var(--tone), .2); color: rgb(var(--tone)); cursor: pointer; box-shadow: var(--addition-raised-shadow); }
  .tablet-controls button ha-icon { --mdc-icon-size: 22px; }
  .tablet-controls button.is-active { background: rgba(var(--tone), .3); }
  .tablet-controls button:disabled { opacity: .3; cursor: not-allowed; }
  .tablet-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(72px, 1fr)); gap: 8px; text-align: center; }
  .tablet-metrics span { display: grid; gap: 2px; }
  .tablet-metrics span.is-unavailable { opacity: .55; }
  .tablet-metrics b { overflow: hidden; font-size: 14px; text-overflow: ellipsis; white-space: nowrap; }
  .tablet-metrics small { color: var(--secondary-text-color); font-size: 12px; font-weight: 600; }
  .tablet-battery-row { display: grid; grid-template-columns: var(--mush-icon-size, 40px) minmax(0, 1fr); align-items: center; gap: 12px; }
  .tablet-battery-icon { display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: var(--addition-neutral-background); color: var(--secondary-text-color); }
  .tablet-battery-icon > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .tablet-battery-row > span:last-child { display: grid; }
  .tablet-battery-row b { font-size: 14px; } .tablet-battery-row small { color: var(--secondary-text-color); font-size: 12px; font-weight: 600; }
  .tablet-battery-bar { position: relative; height: 35px; overflow: hidden; border-radius: 18px; background: var(--addition-track-background); }
  .tablet-battery-bar i { position: absolute; inset: 0 auto 0 0; border-radius: inherit 0 0 inherit; background: #00c853; }
  .tablet-battery-bar b { position: relative; z-index: 1; display: flex; height: 100%; align-items: center; justify-content: flex-end; padding-right: 14px; font-size: 16px; }
  .waste-collection-icon { position: relative; } .waste-collection-icon > i { position: absolute; top: -3px; right: -3px; display: grid; width: 20px; height: 20px; place-items: center; border-radius: 50%; background: rgb(var(--ulm-red)); color: #fff; }
  .waste-collection-icon > i ha-icon { --mdc-icon-size: 13px; }
  .custom-plant { display: grid; gap: 10px; padding: 12px; }
  .flower-heading {
    display: flex; min-width: 0; align-items: center; gap: 10px;
  }
  .flower-metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; }
  .flower-metrics > span { display: grid; min-width: 0; min-height: 52px; place-items: center; padding: 6px; border-radius: 12px; background: var(--addition-neutral-background); text-align: center; }
  .flower-metrics ha-icon { --mdc-icon-size: 17px; color: rgb(var(--ulm-blue)); }
  .flower-metrics b { overflow: hidden; max-width: 100%; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
  .custom-console-card { position: relative; min-height: 72px; overflow: hidden; }
  .custom-console-card.has-artwork { background: #17191d; color: #fff; }
  .platform-xbox { --console-tone: 16, 124, 16; }
  .platform-playstation { --console-tone: 0, 112, 209; }
  .platform-nintendo { --console-tone: 230, 0, 18; }
  .platform-generic { --console-tone: var(--ulm-purple); }
  .console-backdrop {
    position: absolute; inset: 0; background-position: center; background-size: cover; opacity: .42;
  }
  .console-content {
    position: relative; z-index: 1; display: grid; min-height: 72px; gap: 10px; padding: 12px;
  }
  .has-artwork .console-content { background: linear-gradient(90deg, rgba(0,0,0,.84), rgba(0,0,0,.24)); }
  .console-header {
    min-width: 0;
  }
  .console-logo {
    display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%;
    flex: 0 0 auto;
    background: rgba(var(--console-tone), .18); color: rgb(var(--console-tone));
  }
  .console-logo.has-picture { background-position: center; background-size: cover; }
  .console-logo ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .state-unavailable .console-logo, .state-unknown .console-logo {
    color: var(--secondary-text-color); background: var(--addition-neutral-background);
  }
  .has-artwork .console-header .ulm-label { color: rgba(255,255,255,.75); }
  .console-top-stats { display: grid; justify-items: end; gap: 4px; margin-left: auto; }
  .console-top-stats > span {
    display: inline-flex; min-height: 24px; align-items: center; gap: 5px; padding: 0 8px;
    border-radius: 12px; background: rgba(var(--console-tone), .14); color: var(--primary-text-color);
  }
  .has-artwork .console-top-stats > span { background: rgba(0,0,0,.38); color: #fff; }
  .console-top-stats ha-icon { --mdc-icon-size: 13px; color: rgb(var(--console-tone)); }
  .console-top-stats b { font-size: 11px; font-variant-numeric: tabular-nums; }
  .console-social { display: flex; min-width: 0; align-items: center; gap: 14px; }
  .console-social > span { display: inline-flex; min-width: 0; align-items: center; gap: 4px; }
  .console-social ha-icon { width: 40px; height: 40px; --mdc-icon-size: 40px; color: rgb(var(--console-tone)); }
  .console-social b { font-size: 10px; font-variant-numeric: tabular-nums; }
  .console-controls { display: flex; justify-content: flex-end; }
  .console-controls button {
    box-shadow: var(--addition-raised-shadow);
    display: inline-flex; min-height: 32px; align-items: center; gap: 6px; padding: 0 10px;
    border: 0; border-radius: 12px; background: rgba(var(--console-tone), .16);
    color: rgb(var(--console-tone)); font: inherit; font-size: 11px; font-weight: 700; cursor: pointer;
  }
  .has-artwork .console-controls button { background: rgba(0,0,0,.38); color: #fff; }
  .console-controls ha-icon { --mdc-icon-size: 16px; }
  .flower-heading { width: 100%; padding: 0; border: 0; background: transparent; color: inherit; text-align: left; }
  .flower-bars { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px 12px; }
  .flower-bars > span {
    display: grid; min-width: 0; grid-template-columns: 18px minmax(0, 1fr) auto; align-items: center; gap: 5px;
  }
  .flower-bars ha-icon { --mdc-icon-size: 15px; }
  .flower-bars i { display: block; height: 7px; overflow: hidden; border-radius: 2px; background: var(--addition-track-background); }
  .flower-bars em { display: block; height: 100%; background: rgb(var(--ulm-green)); }
  .flower-bars output {
    overflow: hidden; max-width: 54px; color: var(--secondary-text-color); font-size: 10px;
    font-variant-numeric: tabular-nums; text-overflow: ellipsis; white-space: nowrap;
  }
  .speedtest-three { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
  .speedtest-three ha-icon { color: rgb(var(--ulm-blue)); } .speedtest-three b { font-size: 12px; } .speedtest-three small { overflow: hidden; max-width: 100%; color: var(--secondary-text-color); font-size: 9px; text-overflow: ellipsis; white-space: nowrap; }
  .speedtest-chart { height: 58px; overflow: hidden; } .speedtest-chart .sparkline { height: 60px; }
  .custom-speedtest-gauges { display: grid; gap: 12px; padding: 12px; }
  .speedtest-three { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 2px; }
  .speedtest-metric { position: relative; display: grid; min-width: 0; min-height: 112px; place-items: center; color: var(--speedtest-color); }
  .speedtest-ring { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .speedtest-ring path { fill: none; stroke-linecap: round; stroke-width: 8; }
  .speedtest-track { stroke: var(--addition-track-background); }
  .speedtest-value { stroke: var(--speedtest-color); stroke-dasharray: var(--speedtest-value) 100; }
  .speedtest-value-copy { position: relative; display: grid; place-items: center; text-align: center; }
  .speedtest-value-copy ha-icon, .speedtest-value-copy b { position: relative; top: 9px; }
  .speedtest-value-copy ha-icon { --mdc-icon-size: 20px; }
  .speedtest-value-copy b { margin-top: 2px; color: var(--primary-text-color); font-size: 13px; }
  .speedtest-value-copy small { margin-top: 4px; color: var(--secondary-text-color); font-size: 11px; font-weight: 700; }
  .custom-pollen { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 12px; }
  .pollen-heading { grid-column: 1 / -1; min-width: 0; }
  .pollen-item { display: grid; min-width: 0; min-height: 92px; place-items: center; gap: 3px; padding: 6px 3px; border: 0; border-radius: var(--border-radius, 12px); background: transparent; color: var(--primary-text-color); text-align: center; cursor: pointer; }
  .pollen-item:disabled { cursor: default; opacity: .55; }
  .pollen-item-icon { position: relative; display: grid; width: var(--mush-icon-size, 40px); height: var(--mush-icon-size, 40px); place-items: center; border-radius: 50%; background: color-mix(in srgb, var(--pollen) 20%, transparent); color: var(--pollen); }
  .pollen-item-icon > ha-icon { --mdc-icon-size: var(--mush-icon-symbol-size, 24px); }
  .pollen-extreme { position: absolute; top: -3px; right: -4px; display: grid; width: 18px; height: 18px; place-items: center; border: 2px solid var(--card-background-color); border-radius: 50%; background: rgba(var(--color-red, 244, 67, 54), 1); color: white; }
  .pollen-extreme ha-icon { --mdc-icon-size: 11px; }
  .custom-pollen b { overflow: hidden; max-width: 100%; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
  .custom-pollen small { color: var(--secondary-text-color); font-size: 10px; }
  .advanced-energy-management {
    box-sizing: border-box;
    padding: 12px;
    border-radius: 20px;
    background: var(--ha-card-background, var(--card-background-color, #fff));
  }
  .hems-flow {
    display: block;
    width: 100%;
    min-width: 0;
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
  }
  .hems-track {
    fill: none;
    stroke: var(--addition-track-background);
    stroke-width: 9;
    stroke-linecap: round;
  }
  .hems-battery-track { stroke-width: 13; }
  .hems-bar { fill: none; stroke-width: 9; stroke-linecap: round; }
  .hems-battery-value { fill: var(--primary-text-color); font-size: 52px; font-weight: 500; }
  .hems-muted { fill: var(--secondary-text-color); font-size: 15px; font-weight: 400; }
  .hems-time { font-size: 22px; }
  .hems-main-value { fill: var(--primary-text-color); font-size: 36px; font-weight: 500; }
  .hems-detail { font-size: 16px; }
  .hems-mode { font-size: 18px; }
  .hems-price { font-size: 17px; font-weight: 600; }
  .hems-hour { font-size: 13px; }
  .hems-center { text-anchor: middle; }
  .hems-end { text-anchor: end; }
  .hems-now { fill: var(--primary-text-color); }
  .energy-buy-sell-card,
  .panel-health-card {
    box-sizing: border-box;
    min-width: 0;
    padding: 12px;
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--ha-card-background, var(--card-background-color));
    color: var(--primary-text-color);
  }
  .hems-presentation, .advanced-energy-management > .automatic-presentation { margin-bottom: 12px; }
  .energy-buy-sell-chart { width: 100%; min-width: 0; margin-top: 8px; }
  .energy-buy-sell-chart svg { display: block; width: 100%; height: 100%; overflow: visible; }
  .energy-chart-grid { stroke: var(--divider-color); stroke-width: 1; stroke-dasharray: 3 4; }
  .energy-chart-axis { stroke: var(--divider-color); stroke-width: 1; }
  .energy-chart-tick { fill: var(--secondary-text-color); font-size: 11px; }
  .energy-chart-axis-title { fill: var(--secondary-text-color); font-size: 11px; }
  .energy-chart-empty { fill: var(--secondary-text-color); font-size: 14px; }
  .energy-chart-now { stroke: var(--primary-text-color); stroke-width: 1.5; stroke-dasharray: 3 3; }
  .energy-chart-now-label { font-size: 11px; font-weight: 600; }
  .energy-chart-legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 16px; padding: 8px 0 2px; }
  .energy-chart-legend-item { display: inline-flex; align-items: center; gap: 6px; color: var(--secondary-text-color); font-size: 12px; }
  .energy-chart-legend-swatch { width: 10px; height: 10px; border-radius: 3px; background: var(--energy-series-color); }
  .panel-health-summary { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px 16px; margin-top: 14px; }
  .panel-health-summary-row { display: flex; justify-content: space-between; gap: 8px; padding: 7px 2px; border-bottom: 1px solid var(--divider-color); font-size: 13px; }
  .panel-health-summary-row span { color: var(--secondary-text-color); }
  .panel-health-summary-row strong { color: var(--primary-text-color); text-align: right; }
  .panel-health-status { display: flex; align-items: flex-start; gap: 8px; margin-top: 12px; padding: 10px 12px; border-radius: 10px; background: var(--addition-neutral-background); font-size: 13px; line-height: 1.45; }
  .panel-health-status ha-icon { flex: 0 0 auto; --mdc-icon-size: 18px; }
  .panel-health-status-warning { color: var(--error-color); }
  .panel-health-status-success { color: var(--success-color, var(--primary-color)); }
  .panel-health-status-muted { color: var(--secondary-text-color); }
  .panel-health-gauges { display: grid; grid-template-columns: repeat(auto-fit, minmax(78px, 1fr)); gap: 4px; margin-top: 12px; }
  .panel-health-gauge { display: grid; min-width: 0; justify-items: center; gap: 2px; padding: 4px; border: 0; border-radius: 10px; background: transparent; color: var(--primary-text-color); cursor: pointer; }
  .panel-health-gauge:hover { background: var(--addition-neutral-background); }
  .panel-health-gauge svg { width: min(100%, 84px); overflow: visible; }
  .panel-health-gauge-track,
  .panel-health-gauge-value { fill: none; stroke-width: 7; }
  .panel-health-gauge-track { stroke: var(--addition-track-background); }
  .panel-health-gauge-value { stroke: var(--panel-gauge-color); stroke-linecap: round; transform: rotate(-90deg); transform-origin: 50px 46px; }
  .panel-health-gauge-value-label { fill: var(--primary-text-color); font-size: 19px; font-weight: 600; }
  .panel-health-gauge-name { overflow: hidden; max-width: 100%; color: var(--secondary-text-color); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
  .energy-card-empty { margin-top: 12px; padding: 12px; border-radius: 10px; background: var(--addition-neutral-background); color: var(--secondary-text-color); font-size: 13px; line-height: 1.45; }
  .energy-buy-sell-result { margin-top: 12px; border-top: 1px solid var(--divider-color); }
  .energy-buy-sell-result summary { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 12px 0; list-style: none; font-size: 14px; font-weight: 600; cursor: pointer; }
  .energy-buy-sell-result summary::-webkit-details-marker { display: none; }
  .energy-buy-sell-result summary ha-icon { --mdc-icon-size: 20px; color: var(--secondary-text-color); }
  .energy-buy-sell-result[open] summary ha-icon { transform: rotate(180deg); }
  .energy-buy-sell-result summary:focus-visible, .energy-result-table-scroll:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
  .energy-result-table-scroll { max-width: 100%; overflow-x: auto; }
  .energy-result-table { width: 100%; border-collapse: collapse; font-size: 12px; font-variant-numeric: tabular-nums; }
  .energy-result-table th, .energy-result-table td { padding: 8px 6px; border-bottom: 1px solid var(--divider-color); text-align: right; }
  .energy-result-table th:first-child, .energy-result-table td:nth-child(2), .energy-result-table th:nth-child(2) { text-align: left; }
  .energy-result-table thead { color: var(--secondary-text-color); }
  .energy-result-kind { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
  .energy-result-kind i { width: 10px; height: 10px; border-radius: 50%; background: var(--energy-result-color); }
  .energy-result-net { margin: 14px 0; font-size: 15px; font-weight: 600; }
  .energy-result-note { margin: 0; color: var(--secondary-text-color); font-size: 12px; line-height: 1.6; cursor: text; }
  @container (max-width: 420px) {
    .panel-health-summary { grid-template-columns: 1fr; }
    .energy-chart-legend { justify-content: flex-start; gap: 6px 12px; }
  }
  .preview { padding: 16px; color: var(--secondary-text-color); text-align: center; }
`;
