import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { OKLCH } from './types';
import chroma from 'chroma-js';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// given an array of numbers, generate a new array with a given length.
// the new numbers will be interpolated from the original array.
// so the curve is linear between any points in the original array.
export function resizeNumberArray(arr: number[], newSize: number) {
  const originalSize = arr.length;
  const step = (originalSize - 1) / (newSize - 1);
  
  return Array.from({ length: newSize }, (_, index) => {
    const leftIndex = Math.floor(index * step);
    const rightIndex = Math.ceil(index * step);
    const weight = index * step - leftIndex;
    
    if (leftIndex === rightIndex) {
      return arr[leftIndex];
    } else {
      return (1 - weight) * arr[leftIndex] + weight * arr[rightIndex];
    }
  });
}

// function that finds the closest number in an array of numbers
export function findClosestNumber(arr: number[], target: number) {
  return arr.reduce((prev, curr) => {
    return Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev;
  });
}

/**
 * 
 * {
  "{color} Palette": {
    "1": {
      "name": "1",
      "description": "",
      "value": "HEX_COLOR",
      "type": "color"
    },
    "2": {
      "name": "2",
      "description": "",
      "value": "HEX_COLOR",
      "type": "color"
    },
    "name": "{color} Palette"
  }
}
 */

type PaletteJSON = Record<string, Record<string, {
  name: string;
  description: string;
  value: string;
  type: string;
}>>

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export function paletteToJSON(name: string, palette: OKLCH[]): { [key: string]: PaletteJSON } {
  return {
    [capitalize(name)]: palette.reduce((obj, [l, c, h], i) => {
      const name = i + 1;
      const value = chroma.oklch(l, c, h).hex();
      const description = '';
      const type = 'color';
      
      return {
        ...obj,
        [name]: {
          name,
          description,
          value,
          type,
        },
      };
    }, {})
  }
}

export function downloadFile(data: string, fileName = 'palette.json') {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}