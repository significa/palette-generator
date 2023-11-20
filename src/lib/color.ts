import chroma from "chroma-js";
import { findClosestNumber, resizeNumberArray } from "./utils";
import type { Configuration, OKLCH } from "./types";

export const generatePalette = (color: string, config: Configuration): { base: { oklch: OKLCH; index: number }; palette: OKLCH[] } => {
  if (!chroma.valid(color)) throw new Error('Invalid color');

  const { scales, chromaStepType, chromaStep, chromaMinimum, curve, overrides } = config

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
    const cStep = chromaStepType === 'value' ? chromaStep : chromaStep * c;
    let newC = Math.max(Math.min(c, chromaMinimum), c - cStep * Math.abs(i - index));

    // overrides
    const override = overrides?.find((o) => Number(o.scale) === i + 1);
    
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

  return { base: { oklch: [l, c, h], index: index }, palette }
}

export const getL = (l: number) => +(l * 100).toFixed(2) + '%';
export const getC = (c: number) => +c.toFixed(3);
export const getH = (h: number) => +(h || 0).toFixed(2);
export const getOklch = (l: number, c: number, h: number) => {
  return `oklch(${getL(l)} ${getC(c)} ${getH(h)})`;
};