/** Shorthand for `new WheelEvent("wheel", ...)` */
export const newWheelEvent = (params: number | WheelEventInit): WheelEvent => {
  let eventInit: WheelEventInit | undefined;
  if (typeof params === "number") {
    eventInit = { deltaY: params };
  } else if (typeof params === "object") {
    eventInit = params;
  }
  return new WheelEvent("wheel", eventInit);
};

export const newSyntheticWheelEvent = (
  params: number | WheelEventInit,
): {
  deltaX: number;
  deltaY: number;
  deltaZ: number;
  timeStamp: number;
  nativeEvent: WheelEvent;
} => {
  const event = newWheelEvent(params);
  return {
    deltaX: event.deltaX,
    deltaY: event.deltaY,
    deltaZ: event.deltaZ,
    timeStamp: event.timeStamp,
    nativeEvent: event,
  };
};

export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
