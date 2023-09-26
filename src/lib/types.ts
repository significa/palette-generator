export type OKLCH = [number, number, number];

export type Override = { scale?: number; chroma?: number; lightness?: number; };

export type Configuration = {
  colors: string[],
  scales: number,
  chromaStepType: 'value' | 'percentage',
  chromaStep: number,
  chromaMinimum: number,
  overrides: Override[],
  curve: number[],
}