import chroma from 'chroma-js';
import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DEFAULT } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PARAMS = {
  colors: 'c',
  scales: 's',
  chromaStep: 'cs',
  chromaMinimum: 'cm',
}

export function getParamsFromConfig({
  colors,
  scales,
  chromaStep,
  chromaMinimum,
}: {
  colors: string[];
  scales: number;
  chromaStep: number;
  chromaMinimum: number;
}): URLSearchParams {
  const params = new URLSearchParams();
  
  if (colors.length) params.set(PARAMS.colors, colors.join(','));
  if (scales !== DEFAULT.scales) params.set(PARAMS.scales, scales.toString());
  if (chromaStep !== DEFAULT.chromaStep) params.set(PARAMS.chromaStep, chromaStep.toString());
  if (chromaMinimum !== DEFAULT.chromaMinimum) params.set(PARAMS.chromaMinimum, chromaMinimum.toString());

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

  return { colors, scales, chromaStep, chromaMinimum };
}