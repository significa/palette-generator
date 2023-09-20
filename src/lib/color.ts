import chroma from "chroma-js";

export type OKLCH = [number, number, number];

export const generatePalette = (color: string, config: {
  scales?: number;
  chromaStep?: number;
  chromaMinimum?: number;
} = {}): OKLCH[] => {
  if (!chroma.valid(color)) return [];

  const scales = Number(config.scales) || 12;
  const chromaStep = Number(config.chromaStep) || 0.02;
  const chromaMinimum = Number(config.chromaMinimum) || 0.05;

  const [l, c, h] = chroma(color).oklch();
  const step = 1 / scales; // how much to increment l by on each step
  const index = Math.floor(l / step); // index of the current color

  // a shift to make sure we hit the exact color at the base color step
  const lShift = l - step * index;

  return Array.from(Array(scales)).map((_, i) => {
    // increment l by the step
    const newL = lShift + step * i;
    // reduce chroma as we get further from the base color
    // don't go below the minimum (the lowest between minChroma or the base color's chroma)
    const newC = Math.max(Math.min(c, chromaMinimum), c - chromaStep * Math.abs(i - index));

    return [newL, newC, h];
  });
}

export const getL = (l: number) => +(l * 100).toFixed(2) + '%';
export const getC = (c: number) => +c.toFixed(3);
export const getH = (h: number) => +(h || 0).toFixed(2);
export const getOklch = (l: number, c: number, h: number) => {
  return `oklch(${getL(l)} ${getC(c)} ${getH(h)})`;
};