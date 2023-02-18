import type { Deltas, IWheelEvent } from "./types";

/** Converts default WheelEvent to our custom IWheelEvent */
export const getWheelEvent = (e: WheelEvent): IWheelEvent => ({
  deltaX: e.deltaX,
  deltaY: e.deltaY,
  deltaZ: e.deltaZ,
  timeStamp: e.timeStamp,
});

/** Returns array of deltas of the wheel event */
export const getDeltas = (e: IWheelEvent): Deltas => [e.deltaX, e.deltaY, e.deltaZ];

/** Returns module of the biggest delta of the WheelEvent */
export const getBiggestDeltaModule = (e: IWheelEvent): number => {
  const deltaModules = getDeltas(e).map(Math.abs);
  const biggestDeltaModule = Math.max(...deltaModules);
  return biggestDeltaModule;
};

/** Values below treshhold are considered 0 */
const getSign = (num: number, treshhold = 10) => {
  if (Math.abs(num) < treshhold) return 0;
  return Math.sign(num);
};

/** Returns true if two vectors are equal */
export const compareVectors = (e1: IWheelEvent, e2: IWheelEvent, treshhold = 20): boolean => {
  const v1 = getDeltas(e1);
  const v2 = getDeltas(e2);
  return v1.every((vector1, index) => {
    const vector = v2[index];
    if (vector1 < treshhold && vector < treshhold) return true;
    const sign1 = getSign(vector1);
    const sign2 = getSign(vector);
    return sign1 === sign2;
  });
};

/** If e2 event is inertia, it's delta will be no more than treshold slower */
export const isAnomalyInertia = (e1: IWheelEvent, e2: IWheelEvent, treshold = 10) => {
  const v1 = getDeltas(e1);
  const v2 = getDeltas(e2);

  return v1.some((delta, i) => {
    const diff = delta - v2[i];
    const maxDiff = Math.max(10, (delta * treshold) / 100);
    return diff > maxDiff;
  });
};
