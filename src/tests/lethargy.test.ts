import { describe, it, expect, beforeEach } from "vitest";

import { newWheelEvent, sleep } from "./helpers";
import { Lethargy } from "../lethargy";
import type { LethargyConfig } from "../types";

const lethargyConfig: LethargyConfig = {};

describe("Lethargy", () => {
  describe("check", () => {
    let lethargy: Lethargy;

    beforeEach(() => {
      lethargy = new Lethargy(lethargyConfig);
    });

    it("should return null if no event is provided", () => {
      const result = lethargy.check(null as unknown as WheelEvent);
      expect(result).toBeNull();
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

    it("handles the change of the vector", () => {
      const e0 = newWheelEvent(80);
      const r0 = lethargy.check(e0);
      expect(r0).toBe(true);

      const e1 = newWheelEvent(-80);
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
      expect(r0).toBe(true);
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
      expect(r5).toBe(true);

      // Delta dropped again
      const e6 = newWheelEvent(-26);
      const r6 = lethargy.check(e6);
      expect(r6).toBe(false);

      // Delta increased
      const e7 = newWheelEvent(100);
      const r7 = lethargy.check(e7);
      expect(r7).toBe(true);

      // Non-decreasing delta above 100
      const e8 = newWheelEvent(100);
      const r8 = lethargy.check(e8);
      expect(r8).toBe(true);
    });
  });
});
