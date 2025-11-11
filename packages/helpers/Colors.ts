/**
 * @public
 * @author Marc Stöckli - Codemize GmbH 
 * @description Shades a color by a given percentage
 * @since 0.0.1
 * @version 0.0.1
 * @param {string} hex - The hex color to shade
 * @param {number} percent - The percentage to shade the color by
 * @returns {string} The shaded color */
export const shadeColor = (
  hex: string, 
  percent: number
): string => {
  /** @description Convert the hex color to RGB */
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  /** @description Apply the percentage to the color */
  if (percent > 0) {
    /** @description Lighten the color */
    r = Math.round(r + (255 - r) * percent);
    g = Math.round(g + (255 - g) * percent);
    b = Math.round(b + (255 - b) * percent);
  } else {
    /** @description Darken the color */
    r = Math.round(r * (1 + percent));
    g = Math.round(g * (1 + percent));
    b = Math.round(b * (1 + percent));
  }

  /** @description Convert the RGB color to hex */
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}