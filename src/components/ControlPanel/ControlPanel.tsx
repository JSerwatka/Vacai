import { useState } from "react";
import { DaysHoveredType, SavedTripType } from "../../App";
import { DateRange } from "react-day-picker";
import format from "date-fns/format";
import { CirclePicker, ColorResult } from "react-color";
import styles from "./ControlPanel.module.css";
import { isRangeSelected } from "../../utils/rangeSelectedTypeGuard";

interface ControlPanelProps {
  daysHovered: DaysHoveredType;
  tripRange: DateRange | undefined;
  tripColor: string;
  setTripColor: (color: string) => void;
  savedTrips: SavedTripType[];
  addSavedTrip: (newSavedTrip: SavedTripType) => void;
}

const dateFormat = "d MMM y";

const ControlPanel = ({
  daysHovered,
  tripRange,
  tripColor,
  setTripColor,
  savedTrips,
  addSavedTrip,
}: ControlPanelProps) => {
  const [vacationDays, setVacationDays] = useState<number>(0);
  const [tripName, setTripName] = useState<string>("");
  const [colorModalOpened, setColorModalOpened] = useState<boolean>();

  const selectedRangeString = (): string => {
    if (!isRangeSelected(tripRange)) {
      return "";
    }
    return `${format(tripRange.from, dateFormat)} - ${format(
      tripRange.to,
      dateFormat
    )}`;
  };

  const handleTripSave = () => {
    if (!tripRange?.from || !tripRange?.to) return;

    addSavedTrip({
      name: tripName,
      color: tripColor,
      range: {
        from: tripRange.from,
        to: tripRange.to,
      },
    });
  };

  return (
    <aside className={styles.control_panel_wrapper}>
      <input
        type="number"
        placeholder="Ilość dni urlopu"
        value={vacationDays}
        onChange={(e) => setVacationDays(Number(e.target.value))}
      />
      <div>Calendar days to be selected: {daysHovered.calendar}</div>
      <div>Bussiness days to be selected: {daysHovered.bussiness}</div>
      <h1>Trips:</h1>

      {savedTrips.map((savedTrip) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div>{savedTrip.name}</div>
          <div>{savedTrip.color}</div>
          <div>
            {format(savedTrip.range.from, dateFormat)} -{" "}
            {format(savedTrip.range.to, dateFormat)}
          </div>
        </div>
      ))}

      <div className={styles.trip_input_wrapper}>
        <input
          type="text"
          placeholder="trip name"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
        ></input>
        <div className={styles.color_btn_wrapper}>
          <button
            type="button"
            onClick={() => setColorModalOpened((prevValue) => !prevValue)}
            style={{
              backgroundColor: tripColor,
            }}
          >
            select color
          </button>
          {colorModalOpened ? (
            <div className={styles.color_picker_container}>
              <CirclePicker
                color={tripColor}
                onChangeComplete={(color) => {
                  setTripColor(color.hex);
                  setColorModalOpened(false);
                }}
                circleSpacing={5}
              />
            </div>
          ) : null}
        </div>
        <input type="text" disabled value={selectedRangeString()} />
        <button
          type="button"
          disabled={!isRangeSelected(tripRange) || !tripName}
          onClick={handleTripSave}
        >
          save trip
        </button>
      </div>
    </aside>
  );
};

export default ControlPanel;
