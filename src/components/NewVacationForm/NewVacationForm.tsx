import format from "date-fns/format";
import { useState } from "react";
import CirclePicker from "react-color/lib/components/circle/Circle";

import {
    useVacationSelectedContext,
    useVacationSelectedDispatch
} from "../../contexts/VacationSelectedProvider";
import { SavedVacationType } from "../../types/VacationTypes";
import { dateFormat } from "../../utils/dateFormat";
import { isRangeSelected } from "../../utils/rangeSelectedTypeGuard";
import styles from "./NewVacationForm.module.css";

interface NewVacationFormProps {
    addSavedVacation: (newSavedVacation: SavedVacationType) => void;
}

const NewVacationForm = ({ addSavedVacation }: NewVacationFormProps) => {
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

    return (
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
                        backgroundColor: vacationSelected.color
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
                                    value: color.hex
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
                disabled={!isRangeSelected(vacationSelected) || !vacationSelected.name}
                onClick={handleTripSave}
            >
                save trip
            </button>
        </div>
    );
};

export default NewVacationForm;
