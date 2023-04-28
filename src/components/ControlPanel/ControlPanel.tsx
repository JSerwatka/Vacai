import {
  useState,
  Dispatch,
  SetStateAction,
  useMemo,
  useDeferredValue,
} from "react";
import {
  DaysHoveredType,
  SavedVacationType,
  SelectedVacationType,
} from "../../App";
import { DateRange } from "react-day-picker";
import format from "date-fns/format";
import { CirclePicker } from "react-color";
import styles from "./ControlPanel.module.css";
import { isRangeSelected } from "../../utils/rangeSelectedTypeGuard";
import {
  useVacationSelectedContext,
  useVacationSelectedDispatch,
} from "../contexts/VacationSelectedProvider";

interface ControlPanelProps {
  savedVacations: SavedVacationType[];
  addSavedVacation: (newSavedVacation: SavedVacationType) => void;
}

const dateFormat = "d MMM y";

const ControlPanel = ({
  savedVacations,
  addSavedVacation,
}: ControlPanelProps) => {
  const [vacationDays, setVacationDays] = useState<number>(0);
  const vacationsDaysDeffered = useDeferredValue(vacationDays);
  const [colorModalOpened, setColorModalOpened] = useState<boolean>();
  const vacationSelected = useVacationSelectedContext();
  const vacationSelectedDispatch = useVacationSelectedDispatch();

  const selectedRangeString = (): string => {
    if (!isRangeSelected(vacationSelected)) {
      return "";
    }
    return `${format(vacationSelected.range.from, dateFormat)} - ${format(
      vacationSelected.range.to,
      dateFormat
    )}`;
  };

  const handleTripSave = () => {
    if (!isRangeSelected(vacationSelected)) return;

    addSavedVacation(vacationSelected);
    vacationSelectedDispatch({ type: "RESET" });
  };

  const vacationDaysLeft = useMemo(() => {
    return savedVacations.reduce(
      (acc, current) => acc - current.bussinessDays,
      vacationDays
    );
  }, [savedVacations.length, vacationsDaysDeffered]);

  return (
    <aside className={styles.control_panel_wrapper}>
      <input
        type="number"
        placeholder="Ilość dni urlopu"
        value={vacationDays}
        onChange={(e) => setVacationDays(Number(e.target.value))}
      />
      <div>Days left = {vacationDaysLeft}</div>

      <h1>Trips:</h1>

      {savedVacations.map((savedTrip) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
          key={savedTrip.name}
        >
          <div
            className={styles.trip_color}
            style={{ backgroundColor: savedTrip.color }}
          ></div>
          <div>{savedTrip.name}</div>
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
            vacationSelectedDispatch({ type: "RENAME", value: e.target.value })
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
                  vacationSelectedDispatch({
                    type: "CHANGE_COLOR",
                    value: color.hex,
                  });
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
            !isRangeSelected(vacationSelected) || !vacationSelected.name
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
