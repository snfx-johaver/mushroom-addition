import { css } from "lit";

export const rangeProgress = (value: number, min: number, max: number): string =>
  `${max > min ? Math.max(0, Math.min(100, (value - min) / (max - min) * 100)) : 0}%`;

export const updateRangeProgress = (event: Event): void => {
  const input = event.currentTarget as HTMLInputElement;
  input.style.setProperty("--range-progress", rangeProgress(input.valueAsNumber, Number(input.min), Number(input.max)));
};

export const mediaControlStyles = css`
  input.mushroom-range {
    appearance: none;
    -webkit-appearance: none;
    box-sizing: border-box;
    height: var(--mush-control-height, 42px);
    min-width: 0;
    margin: 0;
    padding: 0 5px;
    border: 0;
    border-radius: var(--mush-control-border-radius, 12px);
    background: linear-gradient(to right, var(--range-color, var(--primary-color)) 0 var(--range-progress, 0%), transparent var(--range-progress, 0%) 100%),
      var(--addition-track-background, rgba(var(--rgb-secondary-text-color, 114, 114, 114), .2));
    cursor: pointer;
    touch-action: pan-y;
  }
  input.mushroom-range::-webkit-slider-runnable-track { height: 100%; background: transparent; }
  input.mushroom-range::-moz-range-track { height: 100%; background: transparent; }
  input.mushroom-range::-moz-range-progress { background: transparent; }
  input.mushroom-range::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: 4px;
    height: calc(var(--mush-control-height, 42px) - 14px);
    margin-top: 7px;
    border: 0;
    border-radius: 2px;
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,.12);
  }
  input.mushroom-range::-moz-range-thumb {
    width: 4px;
    height: calc(var(--mush-control-height, 42px) - 14px);
    border: 0;
    border-radius: 2px;
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,.12);
  }
  input.mushroom-range:disabled {
    background: var(--addition-disabled-background, rgba(var(--mush-rgb-disabled, var(--rgb-disabled, 189, 189, 189)), .2));
    cursor: not-allowed;
    opacity: 1;
  }
  input.mushroom-range:disabled::-webkit-slider-thumb { background: var(--disabled-text-color); box-shadow: none; }
  input.mushroom-range:disabled::-moz-range-thumb { background: var(--disabled-text-color); box-shadow: none; }
  input.mushroom-range:focus-visible, select.mushroom-select:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
  select.mushroom-select {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    height: var(--mush-control-height, 42px);
    padding: 0 12px;
    border: 0;
    border-radius: var(--mush-control-border-radius, 12px);
    color: var(--mush-card-primary-color, var(--primary-text-color));
    background: var(--addition-neutral-background, rgba(var(--rgb-primary-text-color, 33, 33, 33), .05));
    font: inherit;
    font-size: var(--mush-card-primary-font-size, 14px);
    font-weight: var(--mush-card-primary-font-weight, 500);
    line-height: var(--mush-card-primary-line-height, 20px);
  }
  select.mushroom-select option { color: var(--primary-text-color); background: var(--ha-card-background, var(--card-background-color)); }
  select.mushroom-select:disabled { color: var(--disabled-text-color); background: var(--addition-disabled-background); }
`;
