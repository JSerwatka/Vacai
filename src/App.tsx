import "./App.css";

import { useCallback, useState } from "react";

import Calendar from "./components/Calendar/Calendar";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import NewVacationForm from "./components/NewVacationForm/NewVacationForm";
import SavedVacationList from "./components/SavedVacationList/SavedVacationList";
import VacationDaysInput from "./components/VacationDaysInput/VacationDaysInput";
import VacationSelectedProvider from "./contexts/VacationSelectedProvider";
import usePublicHolidays from "./hooks/usePublicHolidays";
import { DaysHoveredType, SavedVacationType } from "./types/VacationTypes";

// TODO: hover on trip or calendar trip should mark coresponding trip in calender/trip
// TODO: trip name should be unique
// TODO: trips cannot overlap

function App() {
    const { holidays, error } = usePublicHolidays({
        year: 2023,
        countryCode: "PL"
    });

    const [daysHovered, setDaysHovered] = useState<DaysHoveredType>({
        calendar: 0,
        bussiness: 0
    });

    const [savedVacations, setSavedVacations] = useState<SavedVacationType[]>([]);

    const addSavedVacation = useCallback(
        (newSavedTrip: SavedVacationType) => {
            setSavedVacations((prevValue) => [...prevValue, newSavedTrip]);
        },
        [setSavedVacations]
    );

    return (
        <div
            style={{
                display: "flex"
            }}
        >
            <VacationSelectedProvider>
                <Calendar
                    setDaysHovered={setDaysHovered}
                    holidays={holidays}
                    savedVacations={savedVacations}
                />
                <ControlPanel>
                    <VacationDaysInput savedVacations={savedVacations} />
                    <SavedVacationList savedVacations={savedVacations} />
                    <NewVacationForm addSavedVacation={addSavedVacation} />
                </ControlPanel>
            </VacationSelectedProvider>
        </div>
    );
}

export default App;
