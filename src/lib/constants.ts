import type { Configuration } from "./types";

export const DEFAULT: Configuration = Object.freeze({
  colors: [],
  scales: 18,
  chromaStepType: 'percentage',
  chromaStep: 0.02,
  chromaMinimum: 0.05,
  curve: [0,0.2,0.4,0.6,0.8,1],
  overrides: [],
})