import chroma from "chroma-js";
import { DEFAULT } from "./constants";
import { findClosestNumber, resizeNumberArray } from "./utils";

export type OKLCH = [number, number, number];
export type Override = { scale?: number; chroma?: number; lightness?: number; };

export const generatePalette = (color: string, config: {
  scales?: number;
  chromaStep?: number;
  chromaMinimum?: number;
  overrides?: Override[];
  curve?: number[];
} = {}): { palette?: OKLCH[]; index?: number } => {
  if (!chroma.valid(color)) return {};

  const scales = Number(config.scales) ?? DEFAULT.scales;
  const chromaStep = Number(config.chromaStep) ?? DEFAULT.chromaStep;
  const chromaMinimum = Number(config.chromaMinimum) ?? DEFAULT.chromaMinimum;
  const curve = config.curve?.map(Number) ?? DEFAULT.curve;

  const [l, c, h] = chroma(color).oklch();

  const curveArr = resizeNumberArray(curve, scales);

  const closest = findClosestNumber(curveArr, l); // find the closest number in the curve to the base color's lightness
  const shift = closest - l; // how much to shift the curve to match the base color's lightness
  const index = curveArr.indexOf(closest); // index of the closest number in the curve

  const palette: OKLCH[] = Array.from(Array(scales)).map((_, i) => {
    // shift the curve to match the base color's lightness
    // don't go below 0 or above 100
    let newL = Math.min(Math.max(curveArr[i] - shift, 0), 1);

    // reduce chroma as we get further from the base color
    // don't go below the minimum (the lowest between minChroma or the base color's chroma)
    let newC = Math.max(Math.min(c, chromaMinimum), c - chromaStep * Math.abs(i - index));

    // overrides
    const override = config.overrides?.find((o) => Number(o.scale) === i + 1);
    
    // don't override if the step is the base color
    if (override && i !== index) {
      const c = override.chroma || override.chroma === 0 ? Number(override.chroma) : undefined
      const l = override.lightness || override.lightness === 0 ? Number(override.lightness) : undefined

      // chroma overrides can't be higher than what it already was
      if (c !== undefined && !isNaN(c)) newC = Math.min(newC, c)

      if (l !== undefined && !isNaN(l)) newL = l
    }

    return [newL, newC, h];
  });

  return { palette, index }
}

export const getL = (l: number) => +(l * 100).toFixed(2) + '%';
export const getC = (c: number) => +c.toFixed(3);
export const getH = (h: number) => +(h || 0).toFixed(2);
export const getOklch = (l: number, c: number, h: number) => {
  return `oklch(${getL(l)} ${getC(c)} ${getH(h)})`;
};