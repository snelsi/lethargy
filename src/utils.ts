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
