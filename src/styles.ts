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
  .ulm-light { grid-template-columns: auto minmax(0, 1fr); }
  .ulm-light .ulm-slider { grid-column: 1 / -1; width: 100%; accent-color: rgb(var(--ulm-yellow)); }
  .ulm-light.is-active { background: rgba(var(--ulm-yellow), .08); }
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
  .battery-ring, .battery-value { color: rgb(var(--ulm-green)); font-weight: 700; }
  .ulm-battery { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 12px; padding: 12px; }
  .battery-value { font-size: 24px; }
  .battery-value small { font-size: 12px; }
  .battery-track { grid-column: 2 / -1; height: 5px; overflow: hidden; border-radius: 5px; background: rgba(var(--ulm-grey), .12); }
  .battery-track i { display: block; height: 100%; border-radius: inherit; background: rgb(var(--ulm-green)); }
  .ulm-metric { padding: 0 12px 12px; }
  .metric-heading { padding-left: 0; padding-right: 0; }
  .metric-value { color: rgb(var(--ulm-blue)); font-size: 20px; font-weight: 650; }
  .sparkline { width: 100%; height: 48px; overflow: visible; }
  .sparkline polyline { fill: none; stroke: rgb(var(--ulm-blue)); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
  .metric-extremes { display: flex; justify-content: space-between; color: var(--secondary-text-color); font-size: 11px; }
  .ulm-scenes { padding: 12px; }
  .scene-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 10px; }
  .scene-button { display: flex; min-width: 0; flex-direction: column; align-items: center; gap: 5px; padding: 9px 5px; border-radius: 12px; }
  .scene-button span { width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; }
  .scene-button ha-icon { --mdc-icon-size: 19px; color: rgb(var(--ulm-purple)); }
  .ulm-media { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: 12px; padding: 12px; }
  .media-art { width: 54px; height: 54px; border-radius: 12px; background-position: center; background-size: cover; }
  .ulm-media .ulm-controls { grid-column: 1 / -1; justify-content: center; }
  .ulm-vacuum, .ulm-security { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 12px; }
  .ulm-vacuum .ulm-controls { grid-column: 1 / -1; justify-content: center; }
  .security-status { padding: 5px 9px; border-radius: 10px; background: rgba(var(--ulm-green), .12); color: rgb(var(--ulm-green)); font-size: 11px; font-weight: 700; }
  .ulm-navigation { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 12px; }
  .ulm-chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 34px;
    padding: 0 11px;
    border-radius: 17px;
    background: var(--ha-card-background, var(--card-background-color));
    box-shadow: var(--ha-card-box-shadow, 0 2px 7px rgba(0,0,0,.07));
    font-size: 12px;
  }
  .ulm-chip .ulm-icon { width: 25px; height: 25px; margin-left: -7px; }
  .ulm-chip .ulm-icon ha-icon { --mdc-icon-size: 16px; }
  .ulm-chip b { color: var(--secondary-text-color); font-weight: 500; }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; padding: 8px; }
  .preview { padding: 16px; color: var(--secondary-text-color); text-align: center; }
`;
