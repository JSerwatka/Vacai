import { useState } from "react";
import { DaysHoveredType } from "../../App";
import { DateRange } from "react-day-picker";
import format from "date-fns/format";
import { CirclePicker, ColorResult } from "react-color";
import styles from "./ControlPanel.module.css";

interface ControlPanelProps {
  daysHovered: DaysHoveredType;
  tripRange: DateRange | undefined;
  tripColor: string;
  setTripColor: (color: string) => void;
}

const dateFormat = "d MMM y";

const ControlPanel = ({
  daysHovered,
  tripRange,
  tripColor,
  setTripColor,
}: ControlPanelProps) => {
  const [vacationDays, setVacationDays] = useState<number>(0);
  const [tripName, setTripName] = useState<string>("");
  const [colorModalOpened, setColorModalOpened] = useState<boolean>();

  const isRangeSelected = (
    tripRange: DateRange | undefined
  ): tripRange is { from: Date; to: Date } =>
    !!tripRange?.from && !!tripRange?.to;

  const selectedRangeString = (): string => {
    if (!isRangeSelected(tripRange)) {
      return "";
    }
    return `${format(tripRange.from, dateFormat)} - ${format(
      tripRange.to,
      dateFormat
    )}`;
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
      </div>
    </aside>
  );
};

export default ControlPanel;
