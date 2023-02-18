/** [deltaX, deltaY, deltaZ] */
export type Deltas = [number, number, number];

export type IWheelEvent = Pick<WheelEvent, "deltaX" | "deltaY" | "deltaZ" | "timeStamp">;
