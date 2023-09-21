import chroma from "chroma-js";
import { DEFAULT } from "./constants";
import type { Override } from "./color";

export const PARAMS = {
  colors: 'c',
  scales: 's',
  chromaStep: 'cs',
  chromaMinimum: 'cm',
  overrides: 'o',
}

const isValidNumber = (v: number | undefined) => typeof v === 'number' && !isNaN(v);

export function getParamsFromConfig({
  colors,
  scales,
  chromaStep,
  chromaMinimum,
  overrides,
}: {
  colors: string[];
  scales: number;
  chromaStep: number;
  chromaMinimum: number;
  overrides: Override[];
}): URLSearchParams {
  const params = new URLSearchParams();
  
  if (colors.length) params.set(PARAMS.colors, colors.join(','));
  if (scales !== DEFAULT.scales) params.set(PARAMS.scales, scales.toString());
  if (chromaStep !== DEFAULT.chromaStep) params.set(PARAMS.chromaStep, chromaStep.toString());
  if (chromaMinimum !== DEFAULT.chromaMinimum) params.set(PARAMS.chromaMinimum, chromaMinimum.toString());
  if (overrides.length) params.set(PARAMS.overrides, overrides.map((o) => {
    const s = o.scale || o.scale === 0 ? o.scale : undefined;
    const c = o.chroma || o.chroma === 0 ? o.chroma : undefined;
    const l = o.lightness || o.lightness === 0 ? o.lightness : undefined;

    const scale = isValidNumber(Number(s)) ? `s${Number(s)}` : '';
    const chroma = isValidNumber(Number(c)) ? `c${Number(c)}` : '';
    const lightness = isValidNumber(Number(l)) ? `l${Number(l)}` : '';

    return `${scale}${chroma}${lightness}`;
  }).join(','));

  return params;
}


export function getColorsFromParams(params: URLSearchParams) {
  return params.get(PARAMS.colors)?.split(',').filter((v) => chroma.valid(v)) ?? [];
}

export function getConfigFromParams(params: URLSearchParams) {
  const colors = getColorsFromParams(params);
  const scales = Number(params.get(PARAMS.scales)) || DEFAULT.scales;
  const chromaStep = Number(params.get(PARAMS.chromaStep)) || DEFAULT.chromaStep;
  const chromaMinimum = Number(params.get(PARAMS.chromaMinimum)) || DEFAULT.chromaMinimum;
  const overrides = params.get(PARAMS.overrides)?.split(',').map((v) => {
    const scale = Number(v.match(/s(\d+\.?\d*)/)?.[1]);
    const chroma = Number(v.match(/c(\d+\.?\d*)/)?.[1]);
    const lightness = Number(v.match(/l(\d+\.?\d*)/)?.[1]);

    return {
      scale: isValidNumber(scale) ? scale : undefined,
      chroma: isValidNumber(chroma) ? chroma : undefined,
      lightness: isValidNumber(lightness) ? lightness : undefined,
    }
  }) ?? [];

  return { colors, scales, chromaStep, chromaMinimum, overrides };
}