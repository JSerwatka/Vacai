import { useState } from "react";
import { DaysHoveredType, SavedVacationType } from "../../App";
import { DateRange } from "react-day-picker";
import format from "date-fns/format";
import { CirclePicker, ColorResult } from "react-color";
import styles from "./ControlPanel.module.css";
import { isRangeSelected } from "../../utils/rangeSelectedTypeGuard";

interface ControlPanelProps {
  daysHovered: DaysHoveredType;
  vacationSelected: DateRange | undefined;
  vacationColor: string;
  setVacationColor: (color: string) => void;
  savedVacations: SavedVacationType[];
  addSavedVacation: (newSavedTrip: SavedVacationType) => void;
}

const dateFormat = "d MMM y";

const ControlPanel = ({
  daysHovered,
  vacationSelected,
  vacationColor,
  setVacationColor,
  savedVacations,
  addSavedVacation,
}: ControlPanelProps) => {
  const [vacationDays, setVacationDays] = useState<number>(0);
  const [tripName, setTripName] = useState<string>("");
  const [colorModalOpened, setColorModalOpened] = useState<boolean>();

  const selectedRangeString = (): string => {
    if (!isRangeSelected(vacationSelected)) {
      return "";
    }
    return `${format(vacationSelected.from, dateFormat)} - ${format(
      vacationSelected.to,
      dateFormat
    )}`;
  };

  const handleTripSave = () => {
    if (!vacationSelected?.from || !vacationSelected?.to) return;

    addSavedVacation({
      name: tripName,
      color: vacationColor,
      range: {
        from: vacationSelected.from,
        to: vacationSelected.to,
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

      {savedVacations.map((savedTrip) => (
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
              backgroundColor: vacationColor,
            }}
          >
            select color
          </button>
          {colorModalOpened ? (
            <div className={styles.color_picker_container}>
              <CirclePicker
                color={vacationColor}
                onChangeComplete={(color) => {
                  setVacationColor(color.hex);
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
          disabled={!isRangeSelected(vacationSelected) || !tripName}
          onClick={handleTripSave}
        >
          save trip
        </button>
      </div>
    </aside>
  );
};

export default ControlPanel;
