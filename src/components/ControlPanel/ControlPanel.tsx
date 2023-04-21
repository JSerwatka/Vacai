import { useState } from "react";
import { DaysHoveredType } from "../../App";
import { DateRange } from "react-day-picker";
import format from "date-fns/format";

interface ControlPanelProps {
  daysHovered: DaysHoveredType;
  selectedRange: DateRange | undefined;
}

const dateFormat = "d MMM y";

const ControlPanel = ({ daysHovered, selectedRange }: ControlPanelProps) => {
  const [vacationDays, setVacationDays] = useState<number>(0);
  const [tripName, setTripName] = useState<string>("");
  const isRangeSelected = (
    selectedRange: DateRange | undefined
  ): selectedRange is { from: Date; to: Date } =>
    !!selectedRange?.from && !!selectedRange?.to;

  const selectedRangeString = (): string => {
    if (!isRangeSelected(selectedRange)) {
      return "";
    }
    return `${format(selectedRange.from, dateFormat)} - ${format(
      selectedRange.to,
      dateFormat
    )}`;
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <input
        type="number"
        placeholder="Ilość dni urlopu"
        value={vacationDays}
        onChange={(e) => setVacationDays(Number(e.target.value))}
      />
      <div>Calendar days to be selected: {daysHovered.calendar}</div>
      <div>Bussiness days to be selected: {daysHovered.bussiness}</div>
      <div
        style={{
          display: "flex",
        }}
      >
        <input
          type="text"
          placeholder="trip name"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
        ></input>

        <input type="text" disabled value={selectedRangeString()} />
      </div>
    </div>
  );
};

export default ControlPanel;
