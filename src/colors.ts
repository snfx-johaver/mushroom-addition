const themeColorFallbacks: Record<string, string> = {
  red: "244, 67, 54",
  pink: "233, 30, 99",
  purple: "146, 107, 199",
  "deep-purple": "110, 65, 171",
  indigo: "63, 81, 181",
  blue: "33, 150, 243",
  "light-blue": "3, 169, 244",
  cyan: "0, 188, 212",
  teal: "0, 150, 136",
  green: "76, 175, 80",
  "light-green": "139, 195, 74",
  lime: "205, 220, 57",
  yellow: "255, 235, 59",
  amber: "255, 193, 7",
  orange: "255, 152, 0",
  "deep-orange": "255, 111, 34",
  brown: "121, 85, 72",
  "light-grey": "189, 189, 189",
  grey: "158, 158, 158",
  "dark-grey": "96, 96, 96",
  "blue-grey": "96, 125, 139",
  black: "0, 0, 0",
  white: "255, 255, 255",
  disabled: "189, 189, 189",
};

export const resolveColor = (value: string | undefined, fallback: string): string => {
  const candidate = value?.trim() || fallback.trim();
  if (candidate === "primary") {
    return value ? `var(--primary-color, ${fallback})` : "var(--primary-color)";
  }
  if (candidate === "accent") {
    return value ? `var(--accent-color, ${fallback})` : "var(--accent-color)";
  }
  const rgb = themeColorFallbacks[candidate];
  return rgb ? `rgb(var(--rgb-${candidate}, ${rgb}))` : candidate;
};
