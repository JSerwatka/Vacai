import { useState, Dispatch, SetStateAction } from "react";
import {
  DaysHoveredType,
  SavedVacationType,
  SelectedVacationType,
} from "../../App";
import { DateRange } from "react-day-picker";
import format from "date-fns/format";
import { CirclePicker, ColorResult } from "react-color";
import styles from "./ControlPanel.module.css";
import { isRangeSelected } from "../../utils/rangeSelectedTypeGuard";

interface ControlPanelProps {
  vacationSelected: SelectedVacationType;
  setVacationSelected: Dispatch<SetStateAction<SelectedVacationType>>;
  savedVacations: SavedVacationType[];
  addSavedVacation: Dispatch<SetStateAction<SavedVacationType>>;
}

const dateFormat = "d MMM y";

const ControlPanel = ({
  vacationSelected,
  setVacationSelected,
  savedVacations,
  addSavedVacation,
}: ControlPanelProps) => {
  const [vacationDays, setVacationDays] = useState<number>(0);
  const [tripName, setTripName] = useState<string>("");
  const [colorModalOpened, setColorModalOpened] = useState<boolean>();

  const selectedRangeString = (): string => {
    if (!isRangeSelected(vacationSelected.range)) {
      return "";
    }
    return `${format(vacationSelected.range.from, dateFormat)} - ${format(
      vacationSelected.range.to,
      dateFormat
    )}`;
  };

  const handleTripSave = () => {
    if (!vacationSelected?.range.from || !vacationSelected?.range.to) return;

    addSavedVacation(vacationSelected); // TODO should conform to DeeplyRequired type of saved vacation
  };

  return (
    <aside className={styles.control_panel_wrapper}>
      <input
        type="number"
        placeholder="Ilość dni urlopu"
        value={vacationDays}
        onChange={(e) => setVacationDays(Number(e.target.value))}
      />

      <h1>Trips:</h1>

      {savedVacations.map((savedTrip) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
          key={savedTrip.name}
        >
          <div>{savedTrip.name}</div>
          <div>{savedTrip.color}</div>
          <div>
            {format(savedTrip.range.from, dateFormat)} -{" "}
            {format(savedTrip.range.to, dateFormat)}
          </div>
          <div>Calendar days: {savedTrip.calendarDays}</div>
          <div>Bussiness days: {savedTrip.bussinessDays}</div>
        </div>
      ))}

      <div className={styles.trip_input_wrapper}>
        <input
          type="text"
          placeholder="trip name"
          value={vacationSelected.name}
          onChange={(e) =>
            setVacationSelected((prevState) => ({
              ...prevState,
              name: e.target.value,
            }))
          }
        ></input>
        <div className={styles.color_btn_wrapper}>
          <button
            type="button"
            onClick={() => setColorModalOpened((prevValue) => !prevValue)}
            style={{
              backgroundColor: vacationSelected.color,
            }}
          >
            select color
          </button>
          {colorModalOpened ? (
            <div className={styles.color_picker_container}>
              <CirclePicker
                color={vacationSelected.color}
                onChangeComplete={(color) => {
                  setVacationSelected((prevState) => ({
                    ...prevState,
                    color: color.hex,
                  }));
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
          disabled={
            !isRangeSelected(vacationSelected.range) || !vacationSelected.name
          }
          onClick={handleTripSave}
        >
          save trip
        </button>
      </div>
    </aside>
  );
};

export default ControlPanel;
