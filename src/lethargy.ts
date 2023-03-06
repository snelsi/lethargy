import { compareVectors, getBiggestDeltaModule, getWheelEvent, isAnomalyInertia } from "./utils";
import type { IWheelEvent, LethargyConfig } from "./types";
import { CHECK_RESULT_CODES } from "./codes";

export class Lethargy {
  /** The wheelDelta threshold. If an event has a wheelDelta below this value, it will not register */
  public sensitivity: number;
  /** Threshold for the amount of time between wheel events for them to be deemed separate */
  public delay: number;
  /** Max percentage decay speed of an Inertia event */
  public inertiaDecay: number;

  /** `[lastKnownHumanEvent, ...inertiaEvents]` */
  private previousEvents: IWheelEvent[];

  /** Deltas above this are considered high velocity */
  private highVelocity: number;

  constructor({
    sensitivity = 2,
    inertiaDecay = 20,
    delay = 100,
    highVelocity = 100,
  }: LethargyConfig = {}) {
    this.sensitivity = Math.max(1, sensitivity);
    this.inertiaDecay = Math.max(1, inertiaDecay);
    this.delay = Math.max(1, delay);
    this.highVelocity = Math.max(1, highVelocity);

    // Reset inner state
    this.previousEvents = [];
  }

  /** Checks whether the wheel event is an intent.
   * Remembers a passed event to compare future events with it */
  public check(e: WheelEvent): boolean {
    const isEvent = e instanceof Event;

    // No event provided
    if (!isEvent) throw new Error("No event provided");

    const event = getWheelEvent(e);

    // DeltaModule is too small
    if (getBiggestDeltaModule(event) < this.sensitivity) {
      return false;
    }

    const { isHuman } = this.isHuman(event);

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

  /** Checks whether the wheel event is an intent */
  private isHuman(event: IWheelEvent): { isHuman: boolean; reason: CHECK_RESULT_CODES } {
    const previousEvent = this.previousEvents.at(-1);

    // No previous event to compare
    if (!previousEvent) {
      return {
        isHuman: true,
        reason: CHECK_RESULT_CODES.NO_PREVIOUS_EVENT_TO_COMPARE,
      };
    }

    // Wtf, event from the past? o_O
    // Skip all checks
    if (event.timeStamp < previousEvent.timeStamp) {
      return {
        isHuman: true,
        reason: CHECK_RESULT_CODES.PAST_TIMESTAMP_EVENT,
      };
    }

    // Enough of time passed from the last event
    if (event.timeStamp > previousEvent.timeStamp + this.delay) {
      return {
        isHuman: true,
        reason: CHECK_RESULT_CODES.ENOUGH_TIME_PASSED,
      };
    }

    const biggestDeltaModule = getBiggestDeltaModule(event);
    const previousBiggestDeltaModule = getBiggestDeltaModule(previousEvent);

    // Biggest delta module is bigger than previous delta module
    if (biggestDeltaModule > previousBiggestDeltaModule) {
      return {
        isHuman: true,
        reason: CHECK_RESULT_CODES.DELTA_MODULE_IS_BIGGER,
      };
    }

    // Vectors don't match
    if (!compareVectors(event, previousEvent)) {
      return {
        isHuman: true,
        reason: CHECK_RESULT_CODES.VECTORS_DONT_MATCH,
      };
    }

    // High velocity non-decreasing deltas are likely human
    if (
      biggestDeltaModule >= this.highVelocity &&
      biggestDeltaModule === previousBiggestDeltaModule
    ) {
      return {
        isHuman: true,
        reason: CHECK_RESULT_CODES.HIGH_VELOCITY_NON_DECREASING_DELTAS,
      };
    }

    const lastKnownHumanEvent = this.previousEvents[0];

    // Non-decreasing deltas of known human event are likely human
    if (
      this.previousEvents.length === 1 &&
      biggestDeltaModule === getBiggestDeltaModule(lastKnownHumanEvent)
    ) {
      return {
        isHuman: true,
        reason: CHECK_RESULT_CODES.NON_DECREASING_DELTAS_OF_KNOWN_HUMAN,
      };
    }

    // If speed of delta's change suddenly jumped, it's likely human
    if (isAnomalyInertia(previousEvent, event, this.inertiaDecay)) {
      return {
        isHuman: true,
        reason: CHECK_RESULT_CODES.ANOMALY_INERTIA_JUMP,
      };
    }

    // No human checks passed. It's probably inertia
    return {
      isHuman: false,
      reason: CHECK_RESULT_CODES.ALL_OTHER_CHECKS_FAILED,
    };
  }
}
