import { describe, it, expect } from "vitest";

import { newWheelEvent } from "./helpers.js";
import { getWheelEvent, getDeltas, getBiggestDeltaModule, getSign } from "../utils.js";
import type { IWheelEvent } from "../types.js";

describe("newWheelEvent", () => {
  it("accepts number", () => {
    const e = newWheelEvent(100);
    expect(e).toMatchObject({ deltaX: 0, deltaY: 100, deltaZ: 0 });
  });

  it("accepts object", () => {
    const e = newWheelEvent({ deltaX: 10, deltaY: 20, deltaZ: -30 });
    expect(e).toMatchObject({ deltaX: 10, deltaY: 20, deltaZ: -30 });
  });
});

describe("getWheelEvent", () => {
  it("should convert a WheelEvent to an IWheelEvent", () => {
    const e = newWheelEvent({
      deltaX: 10,
      deltaY: 20,
      deltaZ: 30,
    });

    const iWheelEvent = getWheelEvent(e);

    expect(iWheelEvent).toEqual({
      deltaX: e.deltaX,
      deltaY: e.deltaY,
      deltaZ: e.deltaZ,
      timeStamp: e.timeStamp,
    });
  });
});

describe("getDeltas", () => {
  it("should return an array of deltas", () => {
    const e: IWheelEvent = {
      deltaX: 10,
      deltaY: 20,
      deltaZ: 30,
      timeStamp: 1000,
    };

    const deltas = getDeltas(e);

    expect(deltas).toEqual([e.deltaX, e.deltaY, e.deltaZ]);
  });
});

describe("getBiggestDeltaModule", () => {
  it("should return the module of the biggest delta", () => {
    const e: IWheelEvent = {
      deltaX: 10,
      deltaY: -20,
      deltaZ: 30,
      timeStamp: 1000,
    };

    const biggestDeltaModule = getBiggestDeltaModule(e);

    expect(biggestDeltaModule).toEqual(30);
  });
});

describe("getSign", () => {
  it("returns +1 for positive numbers", () => {
    const sign = getSign(100);
    expect(sign).toEqual(1);
  });
  it("returns -1 for negative numbers", () => {
    const sign = getSign(-100);
    expect(sign).toEqual(-1);
  });
  it("returns 0 for zero", () => {
    const sign = getSign(0);
    expect(sign).toEqual(0);
  });
  it("returns 0 for numbers below the treshhold", () => {
    const sign = getSign(10, 100);
    expect(sign).toEqual(0);
  });
});
