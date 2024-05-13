export enum CHECK_RESULT_CODES {
  ALL_OTHER_CHECKS_FAILED = "ALL_OTHER_CHECKS_FAILED",
  NO_PREVIOUS_EVENT_TO_COMPARE = "NO_PREVIOUS_EVENT_TO_COMPARE",
  PAST_TIMESTAMP_EVENT = "PAST_TIMESTAMP_EVENT",
  ENOUGH_TIME_PASSED = "ENOUGH_TIME_PASSED",
  NON_DECREASING_DELTAS_OF_KNOWN_HUMAN = "NON_DECREASING_DELTAS_OF_KNOWN_HUMAN",
  HIGH_VELOCITY_NON_DECREASING_DELTAS = "HIGH_VELOCITY_NON_DECREASING_DELTAS",
  DELTA_MODULE_HAS_BEEN_INCREASING = "DELTA_MODULE_HAS_BEEN_INCREASING",
}
