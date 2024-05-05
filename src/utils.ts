import type { Deltas, IWheelEvent, WheelEventLike } from "./types.js";

/** Converts default WheelEvent to our custom IWheelEvent */
export const getWheelEvent = (e: WheelEventLike): IWheelEvent => {
  const event = "nativeEvent" in e ? e.nativeEvent : e;
  return {
    deltaX: event.deltaX || 0,
    deltaY: event.deltaY || 0,
    deltaZ: event.deltaZ || 0,
    timeStamp: event.timeStamp,
  };
};

/** Returns array of deltas of the wheel event */
export const getDeltas = (e: IWheelEvent): Deltas => [e.deltaX, e.deltaY, e.deltaZ];

/** Returns module of the biggest delta of the WheelEvent */
export const getBiggestDeltaModule = (e: IWheelEvent): number => {
  const deltaModules = getDeltas(e).map(Math.abs);
  const biggestDeltaModule = Math.max(...deltaModules);
  return biggestDeltaModule;
};

/** Values below treshhold are considered 0 */
export const getSign = (num: number, treshhold = 10) => {
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

/** If e2 event is inertia, it's delta will be no more than threshold slower */
export const isAnomalyInertia = (e1: IWheelEvent, e2: IWheelEvent, threshold = 10) => {
  const v1 = getDeltas(e1).map(Math.abs);
  const v2 = getDeltas(e2).map(Math.abs);

  return v2.some((delta, i) => {
    const actualDiff = v1[i] - delta;
    const believableDiff = Math.max(10, v1[i] * (threshold / 100));
    return actualDiff > believableDiff;
  });
};
