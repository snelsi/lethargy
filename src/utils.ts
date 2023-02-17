import { scrollDirections } from "./types";
import type { ScrollDirection } from "./types";

/** Returns Scroll direction of the WheelEvent */
export const getScrollDirection = (e: WheelEvent): ScrollDirection => {
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    return e.deltaX < 0 ? "left" : "right";
  }
  return e.deltaY < 0 ? "up" : "down";
};

/** Returns module of the biggest delta of the WheelEvent */
export const getBiggestDeltaModule = (e: WheelEvent) => {
  const deltaModules = [e.deltaX, e.deltaY].map(Math.abs);
  const biggestDeltaModule = Math.max(...deltaModules);
  return biggestDeltaModule;
};

export const getArrayOfNulls = (n: number) => new Array(n).fill(null);

export const generateDeltas = (n: number): Record<ScrollDirection, number[]> =>
  scrollDirections.reduce((acc, direction) => {
    acc[direction] = getArrayOfNulls(n);
    return acc;
  }, {} as Record<ScrollDirection, number[]>);

/** Returns average of numbers in the array */
export const getAverage = (arr: number[]) => {
  const sum = arr.reduce((acc, num) => acc + num, 0);
  const average = sum / arr.length;
  return average;
};
