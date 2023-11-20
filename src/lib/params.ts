import chroma from "chroma-js";
import { DEFAULT } from "./constants";
import type { Configuration } from "./types";

export const PARAMS: Record<keyof Configuration, string> = {
  colors: 'c',
  scales: 's',
  chromaStepType: 'cst',
  chromaStep: 'cs',
  chromaMinimum: 'cm',
  overrides: 'o',
  curve: 'cv',
}

const isValidNumber = (v: number | undefined) => typeof v === 'number' && !isNaN(v);

const hasValue = <T>(v: T | undefined): v is T => !!v || v === 0;

export function serializeOverrides(overrides: Configuration['overrides']): string {
  return overrides.map((o) => {
    const s = Number(o.scale || o.scale === 0 ? o.scale : undefined);
    const c = Number(o.chroma || o.chroma === 0 ? o.chroma : undefined);
    const l = Number(o.lightness || o.lightness === 0 ? o.lightness : undefined);

    const scale = isValidNumber(s) ? `s${s}` : '';
    const chroma = isValidNumber(c) ? `c${c}` : '';
    const lightness = isValidNumber(l) ? `l${l}` : '';

    return `${scale}${chroma}${lightness}`;
  }).join(',');
}

export function serializeCurve(curve: Configuration['curve']): string {
  return curve.map((n) => Number(n)).filter((n) => !isNaN(n)).join(',');
}

export function serializer({
  colors,
  scales,
  chromaStepType,
  chromaStep,
  chromaMinimum,
  curve,
  overrides,
}: Partial<Configuration>): URLSearchParams {
  const params = new URLSearchParams();
  
  if (colors && colors?.length) {
    params.set(PARAMS.colors, colors.join(','))
  };

  if (hasValue(scales) && scales !== DEFAULT.scales) {
    params.set(PARAMS.scales, scales.toString());
  }

  if (chromaStepType && chromaStepType !== DEFAULT.chromaStepType) {
    params.set(PARAMS.chromaStepType, chromaStepType);
  }

  if (hasValue(chromaStep) && chromaStep !== DEFAULT.chromaStep) {
    params.set(PARAMS.chromaStep, chromaStep.toString());
  }

  if (hasValue(chromaMinimum) && chromaMinimum !== DEFAULT.chromaMinimum) {
    params.set(PARAMS.chromaMinimum, chromaMinimum.toString());
  }

  if (curve && curve.length && (curve.length !== DEFAULT.curve.length || curve.some((n, i) => Number(n) !== DEFAULT.curve[i]))) {
    params.set(PARAMS.curve, serializeCurve(curve))
  }

  if (overrides && overrides.length) {
    params.set(PARAMS.overrides, serializeOverrides(overrides));
  }

  return params;
}


export function parseColor(params: URLSearchParams): Configuration['colors'] {
  return params.get(PARAMS.colors)?.split(',').filter((v) => chroma.valid(v)) ?? [...DEFAULT.colors];
}

export function parseOverrides(params: URLSearchParams): Configuration['overrides'] {
  return params.get(PARAMS.overrides)?.split(',').map((v) => {
    const scale = Number(v.match(/s(\d+\.?\d*)/)?.[1]);
    const chroma = Number(v.match(/c(\d+\.?\d*)/)?.[1]);
    const lightness = Number(v.match(/l(\d+\.?\d*)/)?.[1]);

    return {
      scale: isValidNumber(scale) ? scale : undefined,
      chroma: isValidNumber(chroma) ? chroma : undefined,
      lightness: isValidNumber(lightness) ? lightness : undefined,
    }
  }) ?? [...DEFAULT.overrides]
}

export function parseCurve(params: URLSearchParams): Configuration['curve'] {
  return params.get(PARAMS.curve)?.split(',').map((v) => Number(v)).filter((n) => !isNaN(n)) ?? [...DEFAULT.curve]
}

export function parseChromaStepType(params: URLSearchParams): Configuration['chromaStepType'] {
  return params.get(PARAMS.chromaStepType) === 'value' ? 'value' : 'percentage';
}

export function parser(params: URLSearchParams): Configuration {
  const colors = parseColor(params);
  const scales = Number(params.get(PARAMS.scales)) || DEFAULT.scales;
  const chromaStepType = parseChromaStepType(params);
  const chromaStep = Number(params.get(PARAMS.chromaStep)) ?? DEFAULT.chromaStep;
  const chromaMinimum = Number(params.get(PARAMS.chromaMinimum)) ?? DEFAULT.chromaMinimum;
  const overrides = parseOverrides(params);
  const curve = parseCurve(params);

  return { colors, scales, chromaStepType, chromaStep, chromaMinimum, overrides, curve };
}