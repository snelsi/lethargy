import { describe, it, expect } from "vitest";

import { newWheelEvent } from "./helpers.js";
import {
  getWheelEvent,
  getDeltas,
  getBiggestDeltaModule,
  getSign,
  compareVectors,
  isAnomalyInertia,
} from "../utils.js";
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

describe("compareVectors", () => {
  it("should return true for identical vectors", () => {
    const e1: IWheelEvent = {
      deltaX: 10,
      deltaY: 20,
      deltaZ: 30,
      timeStamp: 1000,
    };

    const e2: IWheelEvent = {
      deltaX: 10,
      deltaY: 20,
      deltaZ: 30,
      timeStamp: 2000,
    };

    const areEqual = compareVectors(e1, e2);

    expect(areEqual).toBe(true);
  });

  it("should return true for vectors that are equal up to a threshold", () => {
    const e1: IWheelEvent = {
      deltaX: 10,
      deltaY: 20,
      deltaZ: 30,
      timeStamp: 1000,
    };
    const e2: IWheelEvent = {
      deltaX: 8,
      deltaY: 22,
      deltaZ: 28,
      timeStamp: 2000,
    };
    const treshhold = 20;

    const areEqual = compareVectors(e1, e2, treshhold);

    expect(areEqual).toBe(true);
  });

  it("should return false for different vectors", () => {
    const e1: IWheelEvent = {
      deltaX: 10,
      deltaY: 20,
      deltaZ: 30,
      timeStamp: 1000,
    };
    const e2: IWheelEvent = {
      deltaX: -10,
      deltaY: -20,
      deltaZ: 30,
      timeStamp: 2000,
    };

    const areEqual = compareVectors(e1, e2);

    expect(areEqual).toBe(false);
  });
});

describe("isAnomalyInertia", () => {
  it("should return false when e2's delta is no more than `threshold` slower", () => {
    const e1: IWheelEvent = { deltaX: 0, deltaY: 40, deltaZ: 0, timeStamp: 0 };
    const e2: IWheelEvent = { deltaX: 0, deltaY: 36, deltaZ: 0, timeStamp: 20 };
    const result = isAnomalyInertia(e1, e2);
    expect(result).toBe(false);
  });

  it("should return true when e2's delta is more than `threshold` slower", () => {
    const e1: IWheelEvent = { deltaX: 0, deltaY: 200, deltaZ: 0, timeStamp: 0 };
    const e2: IWheelEvent = { deltaX: 0, deltaY: 100, deltaZ: 0, timeStamp: 20 };
    const result = isAnomalyInertia(e1, e2);
    expect(result).toBe(true);
  });

  it("should return false when e2's delta is bigger", () => {
    const e1: IWheelEvent = { deltaX: 0, deltaY: 200, deltaZ: 0, timeStamp: 0 };
    const e2: IWheelEvent = { deltaX: 0, deltaY: 300, deltaZ: 0, timeStamp: 20 };
    const result = isAnomalyInertia(e1, e2);
    expect(result).toBe(false);
  });

  it("should return false when e2's delta is bigger", () => {
    const e1: IWheelEvent = { deltaX: 0, deltaY: -200, deltaZ: 0, timeStamp: 0 };
    const e2: IWheelEvent = { deltaX: 0, deltaY: -100, deltaZ: 0, timeStamp: 20 };
    const result = isAnomalyInertia(e1, e2);
    expect(result).toBe(true);
  });

  it("handles small values", () => {
    const e1: IWheelEvent = { deltaX: 0, deltaY: 10, deltaZ: 0, timeStamp: 0 };
    const e2: IWheelEvent = { deltaX: 0, deltaY: 2, deltaZ: 0, timeStamp: 20 };
    const result = isAnomalyInertia(e1, e2);
    expect(result).toBe(false);
  });
});
