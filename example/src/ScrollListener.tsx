import { useEffect, useState } from "react";
import Indicator, { State } from "./Indicator";

const ScrollListener = () => {
  const [state, setState] = useState<State>("initial");

  useEffect(() => {
    // Add listener
  }, []);

  return (
    <div className="indicators">
      <Indicator state={state} showTitle={false} />
    </div>
  );
};

export default ScrollListener;
