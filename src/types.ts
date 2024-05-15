/** [deltaX, deltaY, deltaZ] */
export type Deltas = [number, number, number];

export type IWheelEvent = Pick<WheelEvent, "deltaX" | "deltaY" | "deltaZ" | "timeStamp">;

/** Native WheelEvent or React's SyntheticWheelEvent */
export type WheelEventLike = WheelEvent | { nativeEvent: WheelEvent };

export interface LethargyConfig {
  /** The minimum `wheelDelta` value for an event to be registered. Events with a `wheelDelta` below this value are ignored. */
  sensitivity?: number;
  /** If this time in milliseconds has passed since the last event, the current event is assumed to be user-triggered. */
  delay?: number;
  /** If `wheelDelta` has been increasing for this amount of consecutive events, the current event is assumed to be user-triggered. */
  increasingDeltasThreshold?: number;
}
