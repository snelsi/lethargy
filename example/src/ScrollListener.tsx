import { useEffect, useState } from "react";
import { Lethargy } from "lethargy-ts";
import Indicator, { State } from "./Indicator";

const ScrollListener = () => {
  const [state, setState] = useState<State>("initial");

  useEffect(() => {
    const lethargy = new Lethargy();

    const checkWheelEvent = (e: WheelEvent) => {
      const isIntentional = lethargy.check(e);
      console.log(isIntentional);
      setState(isIntentional ? "intentional" : "inertial");
    };

    window.addEventListener("wheel", checkWheelEvent, { passive: true });
    return () => {
      window.removeEventListener("wheel", checkWheelEvent);
    };
  }, []);

  return (
    <div className="indicators">
      <Indicator state={state} showTitle={false} />
    </div>
  );
};

export default ScrollListener;
