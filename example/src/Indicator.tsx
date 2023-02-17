import React from "react";

export const states = ["initial", "intentional", "inertial"] as const;

export type State = (typeof states)[number];

const getTitle = (state: State) => {
  switch (state) {
    case "intentional":
      return "Intent";
    case "inertial":
      return "Inertial";
    default:
      return "Initialized";
  }
};

interface IndicatorProps {
  state?: State;
  showTitle?: boolean;
}

const Indicator: React.FC<IndicatorProps> = ({ state = "initial", showTitle = true }) => (
  <div data-state={state} className="scroll-indicator">
    <i />
    {showTitle && <span>{getTitle(state)}</span>}
  </div>
);

export default Indicator;
