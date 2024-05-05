import { Table, Dot } from "@geist-ui/core";
import type { TableColumnRender } from "@geist-ui/core/esm/table";
import { useState } from "react";
import type { Event } from "./utils";

const MouseIcon = () => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M6 3m0 4a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-4a4 4 0 0 1 -4 -4z" />
    <path d="M12 7l0 4" />
  </svg>
);

const renderDot: TableColumnRender<Event> = (isIntentional) => (
  <div>
    <Dot
      type={isIntentional ? "success" : "warning"}
      title={isIntentional ? "Intentional" : "Inertia"}
    />
  </div>
);

const renderValue: TableColumnRender<Event> = (value) => (
  <div>{String(Math.round(Number(value)))}</div>
);

const maxItems = 5;

interface EventsTableProps {
  events: Event[];
}

const EventsTable: React.FC<EventsTableProps> = ({ events }) => {
  const [showMore, setShowMore] = useState(false);

  if (events.length === 0) {
    return (
      <div className="placeholder">
        <MouseIcon />
        <p>Your wheel events will pop up here. Try to use your mouse or a trackpad.</p>
      </div>
    );
  }

  return (
    <div className="events-table">
      <Table data={events.slice(0, showMore ? 100 : maxItems)}>
        <Table.Column<Event> prop="isIntentional" label="Intentional" render={renderDot} />
        <Table.Column<Event> prop="deltaX" label="deltaX" render={renderValue} />
        <Table.Column<Event> prop="deltaY" label="deltaY" render={renderValue} />
        <Table.Column<Event> prop="deltaZ" label="deltaZ" render={renderValue} />
        <Table.Column<Event> prop="timeStamp" label="timeStamp" render={renderValue} />
      </Table>

      {events.length > maxItems && (
        <button type="button" onClick={() => setShowMore((prev) => !prev)}>
          {showMore ? "Hide" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default EventsTable;
