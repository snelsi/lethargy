import { useCallback, useEffect, useState } from "react";
import { Lethargy } from "lethargy-ts";
import type { IWheelEvent } from "lethargy-ts";

export interface Event extends IWheelEvent {
  isIntentional: boolean;
}

export const useWheelEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const lethargy = new Lethargy();

    const checkWheelEvent = (e: WheelEvent) => {
      const isIntentional = lethargy.check(e);

      if (e.ctrlKey || e.altKey) return;

      setEvents((prev) => {
        const ev: Event = { deltaX: e.deltaX, deltaY: e.deltaY, deltaZ: e.deltaZ, timeStamp: e.timeStamp, isIntentional };
        const next = [ev, ...prev];
        while (next.length > 100) next.pop();
        return next;
      });
    };

    window.addEventListener("wheel", checkWheelEvent);
    return () => {
      window.removeEventListener("wheel", checkWheelEvent);
    };
  }, []);

  const clear = useCallback(() => setEvents([]), []);

  return { events, clear };
};
