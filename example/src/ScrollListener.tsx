import Graph from "./Graph";
import EventsTable from "./EventsTable";
import { useWheelEvents } from "./utils";

const ScrollListener = () => {
  const { events, clear } = useWheelEvents();

  return (
    <>
      <Graph events={events} clear={clear} />
      <EventsTable events={events} />
    </>
  );
};

export default ScrollListener;
