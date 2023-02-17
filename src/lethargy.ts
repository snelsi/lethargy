import {
  generateDeltas,
  getArrayOfNulls,
  getAverage,
  getBiggestDeltaModule,
  getScrollDirection,
} from "./utils";
import type { ScrollDirection } from "./types";

export class Lethargy {
  /** Stability is how many records to use to calculate the average */
  public stability: number;
  /** The wheelDelta threshold. If an event has a wheelDelta below this value, it will not register */
  public sensitivity: number;
  /** How much the old rolling average have to differ from the new rolling average for it to be deemed significant */
  public tolerance: number;
  /** Threshold for the amount of time between mousewheel events for them to be deemed separate */
  public delay: number;

  // Internall data
  private lastDeltas: Record<ScrollDirection, number[]>;
  private deltasTimestamp: (number | null)[];

  constructor({ stability = 8, sensitivity = 100, tolerance = 1.1, delay = 150 } = {}) {
    this.stability = stability;
    this.sensitivity = sensitivity;
    this.tolerance = tolerance;
    this.delay = delay;

    // Reset inner state
    this.lastDeltas = generateDeltas(this.stability * 2);
    this.deltasTimestamp = getArrayOfNulls(this.stability * 2);
  }

  /** Checks whether the mousewheel event is an intent */
  public check(e: WheelEvent): boolean | null {
    const isEvent = e instanceof Event;

    // No event provided
    if (!isEvent) return null;

    const scrollDirection = getScrollDirection(e);
    const deltaModule = getBiggestDeltaModule(e);

    // Somehow
    if (deltaModule === 0) return null;

    // Add the new event timestamp to deltasTimestamp array, and remove the oldest entry
    this.deltasTimestamp.push(Date.now());
    this.deltasTimestamp.shift();

    const deltas = this.lastDeltas[scrollDirection];

    deltas.push(deltaModule);
    deltas.shift();
    return this.isIntentional(scrollDirection);
  }

  private isIntentional(scrollDirection: ScrollDirection): boolean | null {
    // Get the relevant deltas array
    const deltas = this.lastDeltas[scrollDirection];

    // If the array is not filled up yet, we cannot compare averages, so assume the scroll event to be intentional
    if (deltas[0] == null) return true;

    const prevTimestamp = this.deltasTimestamp.at(-2) as number;

    // If the last mousewheel occurred within the specified delay of the penultimate one, and their values are the same.
    // We will assume that this is a trackpad with a constant profile
    if (prevTimestamp + this.delay > Date.now() && deltas[0] === deltas.at(-1)) {
      return false;
    }

    // Check if the new rolling average (based on the last half of the lastDeltas array) is significantly higher than the old rolling average
    const oldDeltas = deltas.slice(0, this.stability);
    const newDeltas = deltas.slice(this.stability, this.stability * 2);

    const oldAverage = getAverage(oldDeltas);
    const newAverage = getAverage(newDeltas);

    const newAverageIsHigher = Math.abs(newAverage * this.tolerance) > Math.abs(oldAverage);
    const matchesSensitivity = Math.abs(newAverage) > this.sensitivity;

    if (newAverageIsHigher && matchesSensitivity) {
      return true;
    }

    // Add more checks here
    // ...

    return false;
  }
}
