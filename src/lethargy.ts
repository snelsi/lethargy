import { getBiggestDeltaModule, getWheelEvent } from "./utils.js";
import type { IWheelEvent, LethargyConfig, WheelEventLike } from "./types.js";
import { CHECK_RESULT_CODES } from "./codes.js";

export class Lethargy {
  /** The minimum `wheelDelta` value for an event to be registered. Events with a `wheelDelta` below this value are ignored. */
  public sensitivity: number;
  /** If this time in milliseconds has passed since the last event, the current event is assumed to be user-triggered. */
  public delay: number;
  /** Events with high `wheelDelta` usually decay quickly. If `wheelDelta` is above this threshold and doesn't decrease, it's assumed to be user-triggered. */
  public highVelocity: number;
  /** If delta has been increasing for this amount of consecutive events, the event is considered to be user-triggered. */
  public increasingDeltasThreshold: number;

  /** `[lastKnownHumanEvent, ...inertiaEvents]` */
  private previousEvents: IWheelEvent[];

  constructor({
    sensitivity = 2,
    delay = 100,
    highVelocity = 100,
    increasingDeltasThreshold = 3,
  }: LethargyConfig = {}) {
    this.sensitivity = Math.max(1, sensitivity);
    this.delay = Math.max(1, delay);
    this.highVelocity = Math.max(1, highVelocity);
    this.increasingDeltasThreshold = Math.max(2, increasingDeltasThreshold);

    // Reset inner state
    this.previousEvents = [];
  }

  /** Checks whether the wheel event is an intent.
   * Remembers a passed event to compare future events with it */
  public check(e: WheelEventLike): boolean {
    const isValidEvent = ("nativeEvent" in e ? e.nativeEvent : e) instanceof Event;

    // Not a valid event
    if (!isValidEvent) throw new Error(`"${e}" is not a valid event`);

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
    const isEventFromThePast = event.timeStamp < previousEvent.timeStamp;
    if (isEventFromThePast) {
      return {
        isHuman: true,
        reason: CHECK_RESULT_CODES.PAST_TIMESTAMP_EVENT,
      };
    }

    // Enough time has passed since the last event
    const isEnoughTimePassed = event.timeStamp > previousEvent.timeStamp + this.delay;
    if (isEnoughTimePassed) {
      return {
        isHuman: true,
        reason: CHECK_RESULT_CODES.ENOUGH_TIME_PASSED,
      };
    }

    const biggestDeltaModule = getBiggestDeltaModule(event);
    const previousBiggestDeltaModule = getBiggestDeltaModule(previousEvent);

    const isDeltaModuleNonDecreasing = biggestDeltaModule >= previousBiggestDeltaModule;

    if (isDeltaModuleNonDecreasing) {
      const isPreviousEventHuman = this.previousEvents.length === 1;

      // Previous event is human and the delta is non-decreasing
      if (isPreviousEventHuman) {
        return {
          isHuman: true,
          reason: CHECK_RESULT_CODES.NON_DECREASING_DELTAS_OF_KNOWN_HUMAN,
        };
      }

      // High velocity non-decreasing deltas are likely human
      const isHighVelocity = biggestDeltaModule >= this.highVelocity;
      const isPreviousEventHighVelocity = previousBiggestDeltaModule >= this.highVelocity;
      if (isHighVelocity && isPreviousEventHighVelocity) {
        return {
          isHuman: true,
          reason: CHECK_RESULT_CODES.HIGH_VELOCITY_NON_DECREASING_DELTAS,
        };
      }

      // Delta has been increasing for the last `increasingDeltasThreshold` consecutive events
      const deltaHasBeenIncreasing =
        this.increasingDeltasThreshold <= 2 ||
        (this.previousEvents.length >= this.increasingDeltasThreshold &&
          this.previousEvents
            .slice(-this.increasingDeltasThreshold)
            .map(getBiggestDeltaModule)
            .every((delta, i, arr) => i === 0 || delta > arr[i - 1]));

      if (deltaHasBeenIncreasing) {
        return {
          isHuman: true,
          reason: CHECK_RESULT_CODES.DELTA_MODULE_HAS_BEEN_INCREASING,
        };
      }
    }

    // No human checks passed. It's probably inertia
    return {
      isHuman: false,
      reason: CHECK_RESULT_CODES.ALL_OTHER_CHECKS_FAILED,
    };
  }
}
