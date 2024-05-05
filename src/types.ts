/** [deltaX, deltaY, deltaZ] */
export type Deltas = [number, number, number];

export type IWheelEvent = Pick<WheelEvent, "deltaX" | "deltaY" | "deltaZ" | "timeStamp">;

/** Native WheelEvent or React's SyntheticWheelEvent */
export type WheelEventLike = WheelEvent | { nativeEvent: WheelEvent };

export interface LethargyConfig {
  sensitivity?: number;
  inertiaDecay?: number;
  delay?: number;
  highVelocity?: number;
}
