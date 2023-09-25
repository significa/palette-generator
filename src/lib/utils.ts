import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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