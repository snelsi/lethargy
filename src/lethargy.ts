import { compareVectors, getBiggestDeltaModule, getWheelEvent, isAnomalyInertia } from "./utils";
import type { IWheelEvent, LethargyConfig } from "./types";

export class Lethargy {
  /** The wheelDelta threshold. If an event has a wheelDelta below this value, it will not register */
  public sensitivity: number;
  /** Threshold for the amount of time between wheel events for them to be deemed separate */
  public delay: number;
  /** Max percentage decay speed of an Inertia event */
  public inertiaDecay: number;

  /** [lastKnownHumanEvent, ...inertiaEvents] */
  private previousEvents: IWheelEvent[];

  constructor({ sensitivity = 2, inertiaDecay = 20, delay = 100 }: LethargyConfig = {}) {
    this.sensitivity = Math.max(1, sensitivity);
    this.inertiaDecay = Math.max(1, inertiaDecay);
    this.delay = Math.max(1, delay);

    // Reset inner state
    this.previousEvents = [];
  }

  /** Checks whether the mousewheel event is an intent */
  public check(e: WheelEvent): boolean {
    const isEvent = e instanceof Event;

    // No event provided
    if (!isEvent) throw new Error("No event provided");

    const event = getWheelEvent(e);

    // DeltaModule is too small
    if (getBiggestDeltaModule(event) < this.sensitivity) {
      return false;
    }

    const isHuman = this.isHuman(event);

    // If event is human, reset previousEvents
    if (isHuman) {
      this.previousEvents = [event];
    }
    // Don't push event to the previousEvents if it's timestamp is less than last seen event's timestamp
    else if (event.timeStamp > (this.previousEvents.at(-1)?.timeStamp || 0)) {
      this.previousEvents.push(event);
    }

    return isHuman;
  }

  private isHuman(event: IWheelEvent): boolean {
    const previousEvent = this.previousEvents.at(-1);

    // No previous event to compare
    if (!previousEvent) {
      return true;
    }

    // Wtf, event from the past? o_O
    // Skip all checks
    if (event.timeStamp < previousEvent.timeStamp) {
      return true;
    }

    // Enough of time passed from the last event
    if (event.timeStamp > previousEvent.timeStamp + this.delay) {
      return true;
    }

    const biggestDeltaModule = getBiggestDeltaModule(event);
    const previousBiggestDeltaModule = getBiggestDeltaModule(previousEvent);

    // Biggest delta module is bigger than previous delta module
    if (biggestDeltaModule > previousBiggestDeltaModule) {
      return true;
    }

    // Vectors don't match
    if (!compareVectors(event, previousEvent)) {
      return true;
    }

    // Non-decreasing deltas above 100 are likely human
    if (biggestDeltaModule >= 100 && biggestDeltaModule === previousBiggestDeltaModule) {
      return true;
    }

    const lastKnownHumanEvent = this.previousEvents[0];

    // Non-decreasing deltas of known human event are likely human
    if (biggestDeltaModule === getBiggestDeltaModule(lastKnownHumanEvent)) {
      return true;
    }

    // If speed of delta's change suddenly jumped, it's likely human
    if (isAnomalyInertia(previousEvent, event, this.inertiaDecay)) {
      return true;
    }

    // No human checks passed. It's probably inertia
    return false;
  }
}
