import { css } from "lit";

export const sharedStyles = css`
  :host {
    --ulm-blue: 3, 169, 244;
    --ulm-yellow: 255, 193, 7;
    --ulm-red: 244, 67, 54;
    --ulm-green: 76, 175, 80;
    --ulm-orange: 255, 152, 0;
    --ulm-purple: 156, 39, 176;
    --ulm-grey: 120, 120, 120;
    container-type: inline-size;
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
  .tone-orange { --tone: var(--ulm-orange); }
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
  .custom-card-heading {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
  }
  .custom-waste-card, .custom-alarm-time, .custom-washer,
  .custom-compact-thermostat, .custom-input-datetime {
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
    background: rgba(var(--ulm-grey), .07);
  }
  .waste-row ha-icon { --mdc-icon-size: 17px; color: var(--waste-color, rgb(var(--ulm-green))); }
  .waste-row b, .waste-row small { font-size: 11px; }
  .waste-row small { color: var(--secondary-text-color); }
  .alarm-time-controls, .compact-thermostat-controls {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: center;
    gap: 10px;
  }
  .alarm-time-controls .ulm-control, .compact-thermostat-controls .ulm-control {
    width: 100%;
    height: 56px;
    border-radius: 18px;
  }
  .alarm-time-controls > b, .compact-thermostat-controls > b { text-align: center; font-size: 18px; }
  .custom-apexcharts {
    display: grid;
    min-height: 190px;
    grid-template-columns: minmax(110px, .8fr) minmax(0, 1.6fr);
    align-items: stretch;
    gap: 14px;
    padding: 12px;
  }
  .apex-legend { display: grid; align-content: space-around; gap: 6px; }
  .apex-series { display: grid; grid-template-columns: 42px 1fr; align-items: center; column-gap: 9px; }
  .apex-series i { display: grid; width: 42px; height: 42px; grid-row: 1 / 3; place-items: center; border-radius: 50%; background: rgba(var(--tone), .18); color: rgb(var(--tone)); }
  .apex-series b, .apex-series small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .apex-series b { font-size: 13px; }
  .apex-series small { color: var(--secondary-text-color); font-size: 12px; font-weight: 700; }
  .apex-chart { position: relative; display: flex; align-items: center; overflow: hidden; }
  .apex-chart .sparkline { position: relative; z-index: 2; height: 120px; }
  .apex-grid-line { position: absolute; right: 0; left: 0; border-top: 1px dashed rgba(var(--ulm-grey), .18); }
  .apex-grid-line.line-1 { top: 25%; }
  .apex-grid-line.line-2 { top: 50%; }
  .apex-grid-line.line-3 { top: 75%; }
  .custom-chromecast { display: grid; gap: 16px; padding: 12px; }
  .chromecast-controls { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .chromecast-controls .ulm-control { width: 100%; height: 48px; border-radius: 16px; }
  .custom-power-details { position: relative; min-height: 190px; overflow: hidden; padding: 12px; }
  .power-details-heading { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 10px; }
  .power-details-value { position: relative; z-index: 2; display: block; margin-top: 18px; text-align: center; font-size: 28px; }
  .power-details-chart { position: absolute; right: 0; bottom: -2px; left: 0; height: 100px; }
  .power-details-chart .sparkline { height: 100%; }
  .power-details-chart .sparkline polygon { fill: color-mix(in srgb, rgb(var(--ulm-yellow)) 22%, transparent); }
  .power-details-chart .sparkline polyline { stroke: rgb(var(--ulm-yellow)); }
  .custom-device-tracker {
    display: grid;
    min-height: 64px;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 24px;
    background: #1f1f1f;
    color: #fff;
  }
  .custom-device-tracker .ulm-label { color: rgba(255,255,255,.55); }
  .device-tracker-icon { position: relative; display: grid; width: 42px; height: 42px; place-items: center; border-radius: 50%; background: rgba(255,255,255,.06); color: #70d67a; }
  .tracker-badge { position: absolute; display: grid; width: 18px; height: 18px; place-items: center; border-radius: 50%; background: #90caf9; color: #17233b; }
  .tracker-badge ha-icon { --mdc-icon-size: 11px; }
  .tracker-one { top: -3px; right: -6px; }
  .tracker-two { right: -6px; bottom: -3px; }
  .custom-room-view { display: grid; min-height: 150px; grid-template-columns: 1fr 60px; gap: 10px; padding: 12px; }
  .room-view-summary { display: flex; align-items: center; gap: 10px; }
  .room-view-summary > span:last-child { display: flex; flex-direction: column; gap: 6px; color: var(--secondary-text-color); }
  .room-view-summary small { display: flex; align-items: center; gap: 3px; }
  .room-view-icon { position: relative; display: grid; width: 44px; height: 44px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-grey), .1); color: rgba(var(--ulm-grey), .45); }
  .room-view-icon i, .room-view-status i, .room-view-actions i { position: absolute; display: grid; min-width: 16px; height: 16px; place-items: center; border-radius: 9px; background: rgb(var(--ulm-blue)); color: #fff; font-size: 10px; font-style: normal; }
  .room-view-icon i { top: -3px; right: -3px; background: rgb(var(--ulm-red)); }
  .room-view-status { position: relative; display: grid; place-items: center; }
  .room-view-status i { top: 28px; right: 8px; }
  .room-view-actions { display: grid; grid-column: 1 / -1; grid-template-columns: repeat(3, 1fr); gap: 7px; }
  .room-view-actions span { position: relative; display: grid; height: 52px; place-items: center; border-radius: 16px; background: rgba(var(--ulm-grey), .08); color: rgba(var(--ulm-grey), .45); }
  .room-view-actions span.is-active { background: rgba(var(--ulm-yellow), .25); color: rgb(var(--ulm-yellow)); }
  .room-view-actions i { top: 5px; right: 30%; }
  .custom-elapsed-time { display: grid; min-height: 72px; grid-template-columns: auto 1fr; align-items: center; gap: 16px; padding: 12px 20px; border-radius: 28px; }
  .custom-elapsed-time .ulm-icon { width: 56px; height: 56px; }
  .custom-elapsed-time .ulm-name { font-size: 19px; }
  .custom-elapsed-time .ulm-label { font-size: 17px; font-weight: 700; }
  .custom-eray-lock { display: grid; min-height: 66px; grid-template-columns: auto 1fr; align-items: center; gap: 14px; padding: 10px 14px; border-radius: 24px; }
  .eray-lock-icon { position: relative; display: grid; width: 44px; height: 44px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-green), .18); color: rgb(var(--ulm-green)); }
  .custom-eray-lock.is-unlocked .eray-lock-icon { background: rgba(var(--ulm-yellow), .22); color: rgb(var(--ulm-yellow)); }
  .door-badge, .battery-badge { position: absolute; display: grid; width: 19px; height: 19px; place-items: center; border: 2px solid var(--card-background-color); border-radius: 50%; background: rgb(var(--ulm-red)); color: #fff; }
  .door-badge { top: -4px; right: -5px; }
  .battery-badge { top: -4px; left: -5px; background: rgb(var(--ulm-yellow)); color: #222; }
  .door-badge ha-icon, .battery-badge ha-icon { --mdc-icon-size: 11px; }
  .custom-esh-welcome { display: grid; gap: 18px; padding: 14px; }
  .esh-welcome-toolbar { display: flex; justify-content: space-between; }
  .esh-welcome-toolbar span { display: grid; width: 38px; height: 38px; place-items: center; border-radius: 50%; box-shadow: 0 2px 7px rgba(0,0,0,.12); }
  .esh-greeting { font-size: 23px; line-height: 1.08; }
  .esh-welcome-items { display: flex; gap: 8px; overflow: hidden; }
  .esh-welcome-items > span { display: flex; min-width: 52px; flex-direction: column; align-items: center; gap: 6px; padding: 7px 4px 10px; border-radius: 25px; box-shadow: 0 2px 7px rgba(0,0,0,.12); }
  .esh-welcome-items i { display: grid; width: 38px; height: 38px; place-items: center; border-radius: 50%; background: rgba(var(--tone), .18); color: rgb(var(--tone)); font-style: normal; }
  .esh-welcome-items small { max-width: 48px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 9px; font-weight: 700; }
  .washer-stages { display: grid; grid-template-columns: repeat(4, 1fr); border-radius: 22px; background: rgba(var(--ulm-grey), .08); }
  .washer-stages span { display: grid; height: 42px; place-items: center; color: rgba(var(--ulm-grey), .35); }
  .washer-stages span.is-active { color: var(--primary-text-color); }
  .washer-stages span.is-active ha-icon { padding: 9px; border-radius: 50%; background: var(--card-background-color); }
  .washer-controls { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
  .washer-controls .ulm-control { width: 100%; height: 42px; border-radius: 16px; }
  .washer-remote { color: var(--secondary-text-color); font-size: 11px; text-align: center; }
  .custom-heat-pump { display: grid; gap: 12px; padding: 12px; }
  .heat-pump-header { display: grid; grid-template-columns: 42px minmax(0, 1fr); align-items: center; gap: 12px; }
  .heat-pump-icon { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 50%; background: rgba(var(--tone), .2); color: rgb(var(--tone)); }
  .heat-pump-icon ha-icon { --mdc-icon-size: 22px; }
  .heat-pump-target { display: grid; grid-template-columns: minmax(0, 1fr) minmax(74px, auto) minmax(0, 1fr); align-items: center; gap: 10px; }
  .heat-pump-target .ulm-control { width: 100%; height: 44px; border-radius: 14px; background: rgba(var(--ulm-grey), .07); }
  .heat-pump-target .ulm-control ha-icon { --mdc-icon-size: 22px; }
  .heat-pump-target > b { text-align: center; font-size: 16px; font-weight: 500; }
  .heat-pump-modes { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; }
  .heat-pump-modes button { display: grid; min-width: 0; height: 42px; place-items: center; border: 0; border-radius: 14px; background: rgba(var(--ulm-grey), .07); color: rgba(var(--ulm-grey), .9); cursor: pointer; }
  .heat-pump-modes button ha-icon { --mdc-icon-size: 22px; }
  .heat-pump-modes button.is-active { background: rgba(var(--tone), .2); color: rgb(var(--tone)); }
  .heat-pump-modes button:disabled { cursor: not-allowed; opacity: .28; }
  .custom-ha-updates { display: grid; gap: 18px; padding: 18px; }
  .ha-updates-summary { display: grid; grid-template-columns: 56px minmax(0, 1fr); align-items: center; gap: 18px; }
  .ha-updates-icon { position: relative; display: grid; width: 56px; height: 56px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-grey), .08); color: rgba(var(--ulm-grey), .25); }
  .ha-updates-icon.has-update { background: rgba(var(--ulm-blue), .2); color: rgb(var(--ulm-blue)); }
  .ha-updates-icon > ha-icon { --mdc-icon-size: 28px; }
  .ha-updates-badge { position: absolute; top: -2px; right: -5px; display: grid; width: 20px; height: 20px; place-items: center; border: 2px solid var(--card-background-color); border-radius: 50%; background: rgb(var(--ulm-blue)); color: #fff; }
  .ha-updates-badge ha-icon { --mdc-icon-size: 12px; }
  .ha-updates-summary .ulm-name { font-size: 18px; font-weight: 700; }
  .ha-update-list { display: grid; gap: 1px; color: rgba(var(--ulm-grey), .55); font-size: 15px; font-weight: 700; }
  .ha-update-list span { display: block; }
  .ha-update-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .ha-update-actions button { display: grid; height: 55px; place-items: center; border: 0; border-radius: 18px; background: rgba(var(--ulm-grey), .07); color: rgba(var(--ulm-grey), .8); cursor: pointer; }
  .ha-update-actions button ha-icon { --mdc-icon-size: 24px; }
  .ha-update-actions button:disabled { cursor: not-allowed; opacity: .28; }
  .custom-sun-card { display: grid; min-height: 210px; gap: 8px; padding: 18px; }
  .sun-times, .sun-footer { display: flex; justify-content: space-between; }
  .sun-times span, .sun-footer span { display: flex; flex-direction: column; gap: 3px; }
  .sun-times span:last-child, .sun-footer span:last-child { align-items: flex-end; }
  .sun-times small, .sun-footer small { color: var(--secondary-text-color); }
  .sun-times b { font-size: 21px; font-weight: 500; }
  .sun-footer b { font-size: 13px; }
  .sun-arc svg { width: 100%; height: 90px; overflow: visible; }
  .sun-arc line { stroke: rgba(var(--ulm-grey), .18); }
  .sun-arc .sun-day { fill: rgba(var(--ulm-blue), .48); stroke: none; }
  .sun-arc .sun-night { fill: #343579; stroke: none; }
  .sun-arc circle { fill: #ffd45c; }
  .custom-compact-thermostat.is-heating { background: #ff8100; }
  .custom-compact-thermostat.is-heating .ulm-label { color: rgba(255,255,255,.78); }
  .custom-battery-chip { display: grid; width: 42px; min-height: 42px; place-items: center; margin: 8px; border-radius: 21px; background: rgba(var(--tone), .18); color: rgb(var(--tone)); }
  .custom-media-library { position: relative; min-height: 170px; overflow: hidden; background: #222; color: #fff; }
  .media-library-art { position: absolute; inset: 0; display: grid; place-items: center; background-position: center; background-size: cover; color: rgba(255,255,255,.7); }
  .media-library-art::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,.88)); }
  .media-library-overlay { position: absolute; right: 12px; bottom: 12px; left: 12px; z-index: 1; display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 10px; }
  .custom-media-library .ulm-label { color: rgba(255,255,255,.72); }
  .media-platform { display: grid; width: 36px; height: 36px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-purple), .75); color: #fff; }
  .custom-imswel-person { display: grid; gap: 9px; padding: 10px; }
  .imswel-person-main { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 10px; }
  .imswel-person-main .person-picture { width: 44px; height: 44px; border-radius: 50%; background-position: center; background-size: cover; }
  .imswel-person-trackers { display: grid; grid-template-columns: 1fr 1fr 38px; gap: 6px; }
  .imswel-person-trackers span, .imswel-person-trackers button { display: flex; min-width: 0; height: 34px; align-items: center; justify-content: center; gap: 4px; overflow: hidden; border: 0; border-radius: 12px; background: rgba(var(--ulm-grey), .08); color: var(--primary-text-color); font-size: 10px; }
  .input-datetime-controls { display: grid; grid-template-columns: repeat(3, 1fr); align-items: center; gap: 7px; }
  .input-datetime-controls .ulm-control { width: 100%; height: 42px; border-radius: 14px; }
  .input-datetime-controls > b { padding: 12px 4px; border-radius: 14px; background: rgba(var(--ulm-grey), .08); text-align: center; }
  .custom-input-number, .custom-sonos, .custom-mpse-printer, .custom-neekster-update,
  .custom-irmajavi-entities, .custom-irmajavi-weather, .custom-irmajavi-speedtest,
  .custom-light-colorpick, .custom-nik-nas, .custom-nik-tablet { display: grid; gap: 10px; padding: 12px; }
  .input-number-controls, .sonos-controls, .nik-door-controls, .update-controls {
    display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: center; gap: 7px;
  }
  .input-number-controls > b { text-align: center; font-size: 16px; }
  .input-number-controls button, .sonos-controls button, .nik-door-controls button, .update-controls button {
    min-height: 42px; border: 0; border-radius: 13px; background: rgba(var(--ulm-grey), .08); color: var(--primary-text-color);
  }
  .irmajavi-header, .irmajavi-weather-header, .speedtest-router, .nik-nas-header {
    display: flex; min-width: 0; align-items: center; gap: 10px;
  }
  .irmajavi-weather-header > b { margin-left: auto; font-size: 18px; }
  .weather-emoji { display: grid; width: 46px; height: 46px; place-items: center; border-radius: 14px; background: rgba(var(--ulm-blue), .12); color: rgb(var(--ulm-blue)); }
  .irmajavi-four { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; }
  .irmajavi-four > span { display: grid; min-width: 0; min-height: 54px; place-items: center; padding: 6px 3px; border-radius: 12px; background: rgba(var(--ulm-grey), .07); text-align: center; }
  .irmajavi-four b, .irmajavi-four small { overflow: hidden; max-width: 100%; text-overflow: ellipsis; white-space: nowrap; }
  .irmajavi-four b { font-size: 10px; } .irmajavi-four small { color: var(--secondary-text-color); font-size: 11px; }
  .speedtest-action { display: flex; min-height: 40px; align-items: center; gap: 10px; padding: 0 12px; border: 0; border-radius: 12px; background: rgba(var(--ulm-blue), .1); color: var(--primary-text-color); }
  .speedtest-metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
  .speedtest-metrics > span { display: grid; gap: 2px; padding: 8px; border-radius: 10px; background: rgba(var(--ulm-grey), .07); }
  .speedtest-metrics small { color: var(--secondary-text-color); font-size: 10px; }
  .speedtest-metrics b { overflow: hidden; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
  .light-colorpick-top { display: grid; gap: 10px; }
  .light-color-swatches { display: grid; grid-template-columns: repeat(6, 1fr); gap: 7px; }
  .light-color-swatches button { aspect-ratio: 1; border: 3px solid var(--card-background-color); border-radius: 50%; background: var(--swatch); box-shadow: 0 0 0 1px rgba(var(--ulm-grey), .15); }
  .custom-more-power-outlet, .custom-wifi-signal, .custom-nas-info, .custom-paddy-pollen, .custom-paddy-waste {
    display: grid; min-height: 62px; grid-template-columns: 46px minmax(0, 1fr); align-items: center; gap: 10px; padding: 10px 14px;
  }
  .custom-dual-gauge { display: grid; min-height: 210px; gap: 10px; padding: 12px; }
  .dual-gauge { position: relative; align-self: end; justify-self: center; width: min(86%, 240px); height: 108px; overflow: hidden; }
  .dual-gauge > i { position: absolute; top: 0; left: 50%; width: 210px; height: 210px; transform: translateX(-50%); border-radius: 50%; background: conic-gradient(from 270deg, rgb(var(--ulm-blue)) var(--gauge), rgba(var(--ulm-grey), .1) 0 180deg, transparent 180deg); }
  .dual-gauge > i::after { content: ""; position: absolute; inset: 48px; border-radius: 50%; background: var(--card-background-color); }
  .dual-gauge > span { position: absolute; right: 0; bottom: 8px; left: 0; z-index: 1; display: grid; text-align: center; }
  .dual-gauge > span b { font-size: 18px; } .dual-gauge small { color: var(--secondary-text-color); font-size: 11px; }
  .toner-bars { display: grid; gap: 9px; }
  .toner-bars span { display: block; height: 32px; }
  .toner-bars i { position: relative; display: block; height: 100%; overflow: hidden; border: 1px solid rgba(var(--ulm-grey), .3); border-radius: 7px; background: rgba(var(--ulm-grey), .08); font-style: normal; }
  .toner-bars em { position: absolute; inset: 0 auto 0 0; width: var(--level); background: var(--toner); }
  .toner-bars b { position: relative; z-index: 1; display: grid; height: 100%; place-items: center; color: color-mix(in srgb, var(--toner) 20%, white); font-size: 17px; font-weight: 500; }
  .update-controls { grid-template-columns: repeat(2, 1fr); }
  .custom-nik-clock { display: grid; min-height: 86px; place-items: center; padding: 12px; text-align: center; }
  .custom-nik-clock b { font-size: 34px; line-height: 1; } .custom-nik-clock span { color: var(--secondary-text-color); font-size: 12px; }
  .custom-nik-door { display: grid; grid-template-columns: minmax(0, 1fr) 96px; align-items: center; gap: 10px; padding: 12px; }
  .nik-door-heading { display: flex; min-width: 0; align-items: center; gap: 10px; }
  .nik-door-icon { position: relative; display: grid; width: 46px; height: 46px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-blue), .12); color: rgb(var(--ulm-blue)); }
  .nik-door-icon i { position: absolute; right: -3px; bottom: -3px; display: grid; width: 20px; height: 20px; place-items: center; border: 2px solid var(--card-background-color); border-radius: 50%; background: rgb(var(--ulm-green)); color: #fff; }
  .nik-door-icon i.is-low { background: rgb(var(--ulm-red)); } .nik-door-icon i ha-icon { --mdc-icon-size: 13px; } .nik-door-controls { grid-template-columns: repeat(2, 1fr); }
  .custom-nik-nas { gap: 12px; padding: 18px; }
  .nik-nas-top { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .nik-nas-tile { box-sizing: border-box; display: grid; min-height: 102px; grid-template-columns: 64px minmax(0, 1fr); align-items: center; gap: 16px; padding: 12px 18px; border: 3px solid rgba(var(--ulm-grey), .45); border-radius: 30px; background: transparent; color: var(--primary-text-color); text-align: left; }
  button.nik-nas-tile { cursor: pointer; }
  .nik-nas-tile-icon { display: grid; width: 62px; height: 62px; place-items: center; border-radius: 50%; background: rgba(var(--tone), .2); color: rgb(var(--tone)); }
  .nik-nas-tile-icon ha-icon { --mdc-icon-size: 24px; }
  .nik-nas-tile > span:last-child, .nik-nas-metrics > span > span { display: grid; }
  .nik-nas-tile b, .nik-nas-metrics b { font-size: 21px; line-height: 1.1; }
  .nik-nas-tile small, .nik-nas-metrics small { color: rgba(var(--ulm-grey), .65); font-size: 17px; font-weight: 600; }
  .nik-nas-body { display: grid; grid-template-columns: minmax(150px, .9fr) minmax(180px, 1.2fr); align-items: center; gap: 18px; }
  .nik-nas-metrics { display: grid; gap: 12px; }
  .nik-nas-metrics > span { display: grid; min-height: 62px; grid-template-columns: 56px minmax(0, 1fr); align-items: center; gap: 14px; }
  .nik-nas-metrics i { display: grid; width: 56px; height: 56px; place-items: center; border-radius: 50%; background: rgba(var(--tone), .2); color: rgb(var(--tone)); font-style: normal; }
  .nik-nas-metrics i ha-icon { --mdc-icon-size: 24px; }
  .nik-nas-rings { width: 100%; max-width: 190px; justify-self: center; overflow: visible; transform: rotate(-90deg); }
  .nik-nas-ring-track, .nik-nas-ring-value { fill: none; stroke-width: 6; }
  .nik-nas-ring-track { stroke: rgba(var(--ulm-grey), .16); }
  .nik-nas-ring-value { stroke-linecap: round; }
  @container (max-width: 380px) {
    .custom-nik-nas { gap: 10px; padding: 12px; }
    .nik-nas-top { gap: 8px; }
    .nik-nas-tile {
      min-width: 0;
      min-height: 82px;
      grid-template-columns: 44px minmax(0, 1fr);
      gap: 9px;
      padding: 9px 10px;
      border-width: 2px;
      border-radius: 24px;
    }
    .nik-nas-tile-icon { width: 44px; height: 44px; }
    .nik-nas-tile b, .nik-nas-metrics b { font-size: 16px; }
    .nik-nas-tile small, .nik-nas-metrics small { font-size: 13px; }
    .nik-nas-tile > span:last-child { min-width: 0; overflow: hidden; }
    .nik-nas-tile b, .nik-nas-tile small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .nik-nas-body { grid-template-columns: minmax(112px, 1fr) minmax(120px, 132px); gap: 8px; }
    .nik-nas-metrics { gap: 6px; }
    .nik-nas-metrics > span {
      min-height: 46px;
      grid-template-columns: 38px minmax(0, 1fr);
      gap: 8px;
    }
    .nik-nas-metrics i { width: 38px; height: 38px; }
    .nik-nas-metrics i ha-icon, .nik-nas-tile-icon ha-icon { --mdc-icon-size: 20px; }
    .nik-nas-rings { width: 132px; max-width: 100%; }
  }
  .custom-nik-tablet { gap: 14px; padding: 18px; }
  .nik-tablet-header { display: grid; grid-template-columns: 42px minmax(0, 1fr); align-items: center; gap: 12px; }
  .nik-tablet-icon { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-blue), .2); color: rgb(var(--ulm-blue)); }
  .nik-tablet-icon ha-icon { --mdc-icon-size: 22px; }
  .nik-tablet-header .ulm-name { font-size: 14px; }
  .nik-tablet-header .ulm-label { font-size: 12px; }
  .nik-tablet-controls { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .nik-tablet-controls button { display: grid; height: 42px; place-items: center; border: 0; border-radius: 14px; background: rgba(var(--tone), .2); color: rgb(var(--tone)); cursor: pointer; }
  .nik-tablet-controls button ha-icon { --mdc-icon-size: 22px; }
  .nik-tablet-controls button.is-active { background: rgba(var(--tone), .3); box-shadow: inset 0 0 0 2px rgba(var(--tone), .35); }
  .nik-tablet-controls button:disabled { opacity: .3; cursor: not-allowed; }
  .nik-tablet-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(72px, 1fr)); gap: 8px; text-align: center; }
  .nik-tablet-metrics span { display: grid; gap: 2px; }
  .nik-tablet-metrics span.is-unavailable { opacity: .55; }
  .nik-tablet-metrics b { overflow: hidden; font-size: 14px; text-overflow: ellipsis; white-space: nowrap; }
  .nik-tablet-metrics small { color: rgba(var(--ulm-grey), .65); font-size: 12px; font-weight: 600; }
  .nik-tablet-battery-row { display: grid; grid-template-columns: 42px minmax(0, 1fr); align-items: center; gap: 12px; }
  .nik-tablet-battery-icon { display: grid; width: 42px; height: 42px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-grey), .08); color: rgba(var(--ulm-grey), .8); }
  .nik-tablet-battery-icon ha-icon { --mdc-icon-size: 22px; }
  .nik-tablet-battery-row > span:last-child { display: grid; }
  .nik-tablet-battery-row b { font-size: 14px; } .nik-tablet-battery-row small { color: rgba(var(--ulm-grey), .65); font-size: 12px; font-weight: 600; }
  .nik-tablet-battery-bar { position: relative; height: 35px; overflow: hidden; border-radius: 18px; background: rgba(var(--ulm-grey), .16); }
  .nik-tablet-battery-bar i { position: absolute; inset: 0 auto 0 0; border-radius: inherit 0 0 inherit; background: #00c853; }
  .nik-tablet-battery-bar b { position: relative; z-index: 1; display: flex; height: 100%; align-items: center; justify-content: flex-end; padding-right: 14px; font-size: 16px; }
  .pollen-icon { display: grid; width: 46px; height: 46px; place-items: center; border-radius: 50%; background: color-mix(in srgb, var(--pollen) 20%, transparent); color: var(--pollen); }
  .paddy-waste-icon { position: relative; } .paddy-waste-icon > i { position: absolute; top: -3px; right: -3px; display: grid; width: 20px; height: 20px; place-items: center; border-radius: 50%; background: rgb(var(--ulm-red)); color: #fff; }
  .paddy-waste-icon > i ha-icon { --mdc-icon-size: 13px; }
  .custom-paddy-welcome { display: grid; min-height: 76px; gap: 8px; padding: 14px; } .custom-paddy-welcome > b { font-size: 22px; }
  .custom-paddy-welcome > span { display: flex; align-items: center; gap: 7px; color: var(--secondary-text-color); font-size: 12px; text-transform: capitalize; }
  .custom-person-chip { display: inline-grid; width: max-content; min-height: 42px; grid-template-columns: 34px auto; align-items: center; gap: 8px; padding: 4px 12px 4px 4px; border-radius: 24px; }
  .custom-person-chip > span { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-blue), .12); background-position: center; background-size: cover; color: rgb(var(--ulm-blue)); }
  .custom-person-chip > b { font-size: 12px; }
  .custom-person-info, .custom-ristou-person, .custom-saxel-fan, .custom-schumijo-car,
  .custom-schumijo-flower, .custom-sisimomo-printer, .custom-speedtest-shogun,
  .custom-tpx-aircondition, .custom-water-heater { display: grid; gap: 10px; padding: 12px; }
  .custom-person-info-small { display: grid; min-height: 118px; gap: 8px; padding: 12px; }
  .person-info-main, .ristou-person-main, .car-hero, .flower-heading, .printer-summary,
  .aircondition-main, .water-heater-top { display: flex; min-width: 0; align-items: center; gap: 10px; }
  .person-info-avatar { position: relative; display: grid; width: 42px; height: 42px; flex: 0 0 auto; place-items: center; border-radius: 50%; background: rgba(var(--ulm-blue), .12) center/cover; color: rgb(var(--ulm-blue)); }
  .person-info-avatar.has-picture > ha-icon { display: none; }
  .person-info-badge { position: absolute; top: -3px; right: -3px; display: grid; width: 16px; height: 16px; place-items: center; border: 2px solid var(--card-background-color); border-radius: 50%; background: rgb(var(--tone)); color: #fff; }
  .person-info-badge ha-icon { --mdc-icon-size: 10px; }
  .person-info-small-top { display: flex; align-items: flex-start; justify-content: space-between; }
  .person-info-small-battery { display: grid; width: 30px; height: 30px; place-items: center; border: 2px solid var(--card-background-color); border-radius: 50%; background: rgba(var(--ulm-grey), .05); color: rgb(var(--tone)); }
  .person-info-small-battery ha-icon { --mdc-icon-size: 25px; }
  .person-info-small-copy { display: grid; text-align: center; }
  .person-info-small-copy b { font-size: 14px; }
  .person-info-small-copy small { color: var(--secondary-text-color); font-size: 12px; text-transform: capitalize; }
  .custom-person-info { min-height: 68px; grid-template-columns: minmax(0, 1fr) auto; align-items: center; }
  .custom-person-info.is-multiline { min-height: 105px; grid-template-columns: minmax(0, 1fr); gap: 12px; }
  .custom-person-info.is-multiline .person-info-details { padding-left: 4px; }
  .person-info-details { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .person-info-detail { display: flex; align-items: center; gap: 4px; font-size: 12px; }
  .person-info-detail ha-icon { --mdc-icon-size: 16px; color: rgb(var(--tone, var(--ulm-green))); }
  .commute-detail ha-icon { color: rgb(var(--ulm-yellow)); }
  .car-metrics, .flower-metrics, .device-tracer-meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; }
  .car-metrics > span, .flower-metrics > span, .device-tracer-meta > span { display: grid; min-width: 0; min-height: 52px; place-items: center; padding: 6px; border-radius: 12px; background: rgba(var(--ulm-grey), .07); text-align: center; }
  .car-metrics ha-icon, .flower-metrics ha-icon, .device-tracer-meta ha-icon { --mdc-icon-size: 17px; color: rgb(var(--ulm-blue)); }
  .car-metrics b, .flower-metrics b { overflow: hidden; max-width: 100%; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
  .custom-console-card { position: relative; min-height: 112px; overflow: hidden; background: #17191d; color: #fff; }
  .console-backdrop { position: absolute; inset: 0; background-position: center; background-size: cover; opacity: .35; }
  .console-content { position: relative; z-index: 1; display: grid; min-height: 88px; grid-template-columns: 52px minmax(0, 1fr) 42px; align-items: center; gap: 10px; padding: 12px; background: linear-gradient(90deg, rgba(0,0,0,.8), rgba(0,0,0,.18)); }
  .console-logo { display: grid; width: 52px; height: 52px; place-items: center; border-radius: 50%; background: rgba(255,255,255,.1); }
  .console-logo ha-icon { --mdc-icon-size: 32px; } .platform-xbox .console-logo { color: #6cc24a; } .platform-playstation .console-logo { color: #4b8fff; }
  .console-content .ulm-label { color: rgba(255,255,255,.7); } .console-content button { display: grid; width: 42px; height: 42px; place-items: center; border: 0; border-radius: 50%; background: rgba(255,255,255,.12); color: #fff; }
  .custom-qubino, .custom-senoro-window, .custom-lights-count { display: grid; min-height: 64px; grid-template-columns: 46px minmax(0, 1fr) auto; align-items: center; gap: 10px; padding: 10px 14px; }
  .custom-qubino button { display: grid; width: 40px; height: 40px; place-items: center; border: 0; border-radius: 50%; background: rgba(var(--ulm-grey), .08); color: var(--primary-text-color); }
  .ristou-camera { min-height: 130px; border-radius: 15px; background: rgba(var(--ulm-grey), .08) center/cover; }
  .ristou-map { display: flex; min-height: 42px; align-items: center; justify-content: center; gap: 7px; border-radius: 13px; background: rgba(var(--ulm-blue), .1); color: rgb(var(--ulm-blue)); font-size: 11px; font-weight: 700; }
  .fan-speed-row, .fan-preset-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
  .fan-preset-row { grid-template-columns: repeat(4, 1fr); }
  .fan-speed-row button, .fan-preset-row button { min-height: 38px; border: 0; border-radius: 12px; background: rgba(var(--ulm-grey), .08); color: var(--primary-text-color); font-size: 10px; }
  .fan-speed-row button.is-active, .fan-preset-row button.is-active { background: rgba(var(--ulm-blue), .18); color: rgb(var(--ulm-blue)); }
  .custom-scenes-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 7px; padding: 12px; }
  .custom-scenes-grid button { display: grid; min-width: 0; gap: 6px; place-items: center; padding: 0; border: 0; background: transparent; color: var(--primary-text-color); }
  .custom-scenes-grid button > span { display: grid; width: 44px; height: 44px; place-items: center; border-radius: 50%; background: rgba(var(--tone), .18); color: rgb(var(--tone)); }
  .custom-scenes-grid small { overflow: hidden; width: 100%; font-size: 9px; text-overflow: ellipsis; white-space: nowrap; }
  .car-hero > ha-icon { margin-left: auto; } .car-metrics { grid-template-columns: repeat(2, 1fr); }
  .flower-metrics { grid-template-columns: repeat(4, 1fr); } .flower-metrics > span { min-height: 44px; }
  .window-battery { display: flex; align-items: center; gap: 4px; color: var(--secondary-text-color); font-size: 11px; }
  .window-battery ha-icon { --mdc-icon-size: 16px; }
  .printer-cartridges { display: grid; gap: 5px; }
  .printer-cartridges span { display: grid; grid-template-columns: 18px minmax(0, 1fr) 42px; align-items: center; gap: 7px; }
  .printer-cartridges i { position: relative; display: block; height: 13px; overflow: hidden; border: 1px solid rgba(var(--ulm-grey), .2); border-radius: 3px; background: rgba(var(--ulm-grey), .05); }
  .printer-cartridges em { position: absolute; inset: 0 auto 0 0; width: var(--level); background: var(--cartridge); }
  .printer-cartridges small, .printer-cartridges b { color: var(--secondary-text-color); font-size: 9px; font-weight: 500; }
  .speedtest-three { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; }
  .speedtest-three span { display: grid; min-width: 0; place-items: center; gap: 3px; padding: 8px; border-radius: 12px; background: rgba(var(--ulm-grey), .07); text-align: center; }
  .speedtest-three ha-icon { color: rgb(var(--ulm-blue)); } .speedtest-three b { font-size: 12px; } .speedtest-three small { overflow: hidden; max-width: 100%; color: var(--secondary-text-color); font-size: 9px; text-overflow: ellipsis; white-space: nowrap; }
  .speedtest-chart { height: 58px; overflow: hidden; } .speedtest-chart .sparkline { height: 60px; }
  .aircondition-main > b, .water-heater-top > b { margin-left: auto; font-size: 20px; }
  .aircondition-controls { display: grid; grid-template-columns: 42px 1fr 1fr 42px; align-items: center; gap: 7px; }
  .aircondition-controls button, .water-heater-controls button { min-height: 42px; border: 0; border-radius: 13px; background: rgba(var(--ulm-grey), .08); color: var(--primary-text-color); }
  .aircondition-controls span { display: flex; min-height: 42px; align-items: center; justify-content: center; gap: 4px; border-radius: 13px; background: rgba(var(--ulm-grey), .06); font-size: 10px; }
  .aircondition-controls span ha-icon { --mdc-icon-size: 16px; }
  .custom-device-tracer { display: grid; min-height: 88px; grid-template-columns: 48px minmax(0, 1fr); align-items: center; gap: 10px; padding: 12px; }
  .device-tracer-icon { display: grid; width: 48px; height: 48px; place-items: center; border-radius: 50%; background: rgba(var(--ulm-blue), .15); color: rgb(var(--ulm-blue)); }
  .device-tracer-meta { grid-column: 1 / -1; grid-template-columns: repeat(2, 1fr); } .device-tracer-meta > span { min-height: 36px; display: flex; gap: 6px; font-size: 10px; }
  .water-heater-controls { display: grid; grid-template-columns: 48px 1fr 48px; align-items: center; gap: 8px; } .water-heater-controls span { text-align: center; font-size: 11px; text-transform: capitalize; }
  .custom-wilbiev-title { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px; padding: 8px 0; }
  .custom-wilbiev-title span { height: 1px; background: var(--divider-color); } .custom-wilbiev-title b { font-size: 16px; } .custom-wilbiev-title.is-subtitle b { color: var(--secondary-text-color); font-size: 12px; }
  .custom-wsly-pollen { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 12px; }
  .custom-wsly-pollen > span { display: grid; min-height: 70px; place-items: center; padding: 7px; border-radius: 15px; background: color-mix(in srgb, var(--pollen) 12%, transparent); color: var(--pollen); text-align: center; }
  .custom-wsly-pollen b { font-size: 13px; } .custom-wsly-pollen small { font-size: 9px; }
  .preview { padding: 16px; color: var(--secondary-text-color); text-align: center; }
`;
