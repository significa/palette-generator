import chroma from "chroma-js";
import type { OKLCH } from "./color";

// receives a palette and returns an SVG string with a row of squares (200x200 each) with the correct colors (in rgb for better compatibility)
export const paletteToSvg = (palette: OKLCH[]) => {
  const squares = palette.map(([l, c, h], i) => {
    const [r, g, b] = chroma.oklch(l, c, h).rgb();
    return `<rect x="${i * 200}" y="0" width="200" height="200" fill="rgb(${r}, ${g}, ${b})" />`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${palette.length * 200}" height="200">${squares}</svg>`;
}