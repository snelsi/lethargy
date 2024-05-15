import { describe, it, expect, beforeEach } from "vitest";

import { newSyntheticWheelEvent, newWheelEvent, sleep } from "./helpers.js";
import { Lethargy } from "../lethargy.js";
import type { LethargyConfig } from "../types.js";

const lethargyConfig: LethargyConfig = {};

describe("Lethargy", () => {
  describe("check", () => {
    let lethargy: Lethargy;

    beforeEach(() => {
      lethargy = new Lethargy(lethargyConfig);
    });

    it("should throw an error if no event is provided", () => {
      // @ts-expect-error: Test for nullish input
      expect(() => lethargy.check(null)).toThrowError();
      // @ts-expect-error: Test for non-event input
      expect(() => lethargy.check({})).toThrowError();
    });

    it.concurrent("handles React's SyntheticWheelEvent", async ({ expect }) => {
      const syntheticEvent = newSyntheticWheelEvent(80);
      const r0 = lethargy.check(syntheticEvent);
      expect(r0).toBe(true);
    });

    it.concurrent("handles pause between events", async ({ expect }) => {
      const e0 = newWheelEvent(80);
      const r0 = lethargy.check(e0);
      expect(r0).toBe(true);

      // Wait for at least 100ms before next event
      await sleep(101);

      const e1 = newWheelEvent(72);
      const r1 = lethargy.check(e1);
      expect(r1).toBe(true);
    });

    it("handles non-decreasing deltas", () => {
      const e0 = newWheelEvent(80);
      const r0 = lethargy.check(e0);
      expect(r0).toBe(true);

      const e1 = newWheelEvent(80);
      const r1 = lethargy.check(e1);
      expect(r1).toBe(true);
    });

    it.concurrent("handles incoherent events", async ({ expect }) => {
      const e0 = newWheelEvent(72);
      await sleep(20);
      const e1 = newWheelEvent(80);

      // Test "future" event first
      const r1 = lethargy.check(e1);
      expect(r1).toBe(true);

      // Test "past" event second
      const r0 = lethargy.check(e0);
      expect(r0).toBe(false);
    });

    it("sample scenario", () => {
      // DeltaModule is too small
      const e0 = newWheelEvent(0);
      const r0 = lethargy.check(e0);
      expect(r0).toBe(false);

      // No previous event to compare
      const e1 = newWheelEvent(80);
      const r1 = lethargy.check(e1);
      expect(r1).toBe(true);

      // Vector changed
      const e2 = newWheelEvent(-100);
      let r2 = lethargy.check(e2);
      expect(r2).toBe(true);

      // Same event second time
      r2 = lethargy.check(e2);
      expect(r2).toBe(true);

      // Delta dropped
      const e3 = newWheelEvent(-98);
      let r3 = lethargy.check(e3);
      expect(r3).toBe(false);

      // Same event second time
      r3 = lethargy.check(e3);
      expect(r3).toBe(false);

      // Delta dropped again
      const e4 = newWheelEvent(-96);
      const r4 = lethargy.check(e4);
      expect(r4).toBe(false);

      // Delta dropped significantly
      const e5 = newWheelEvent(-30);
      const r5 = lethargy.check(e5);
      expect(r5).toBe(false);

      // Delta dropped again
      const e6 = newWheelEvent(-26);
      const r6 = lethargy.check(e6);
      expect(r6).toBe(false);

      // Delta increased 4 consecutive times
      const e7 = newWheelEvent(40);
      const r7 = lethargy.check(e7);
      expect(r7).toBe(false);

      const e8 = newWheelEvent(50);
      const r8 = lethargy.check(e8);
      expect(r8).toBe(false);

      const e9 = newWheelEvent(60);
      const r9 = lethargy.check(e9);
      expect(r9).toBe(false);

      const e10 = newWheelEvent(70);
      const r10 = lethargy.check(e10);
      expect(r10).toBe(true);

      // Non-decreasing after known human
      const e11 = newWheelEvent(120);
      const r11 = lethargy.check(e11);
      expect(r11).toBe(true);
    });
  });
});
