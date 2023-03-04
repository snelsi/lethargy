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

export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
