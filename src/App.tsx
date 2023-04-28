import { useCallback, useEffect, useState } from "react";
import Calendar from "./components/Calendar/Calendar";
import { CountryCodesUnion } from "./types/CountryCodes";
import usePublicHolidays from "./hooks/usePublicHolidays";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import "./App.css";
import { HolidayType } from "./types/HolidayType";
import { DateRange } from "react-day-picker";
import { DeepRequired } from "./types/DeepRequired";
import VacationSelectedProvider from "./contexts/VacationSelectedProvider";
import { DaysHoveredType, SavedVacationType } from "./types/VacationTypes";
import VacationDaysInput from "./components/VacationDaysInput/VacationDaysInput";
import SavedVacationList from "./components/SavedVacationList/SavedVacationList";
import NewVacationForm from "./components/NewVacationForm/NewVacationForm";

// TODO: hover on trip or calendar trip should mark coresponding trip in calender/trip
// TODO: trip name should be unique
// TODO: trips cannot overlap

function App() {
  const { holidays, error } = usePublicHolidays({
    year: 2023,
    countryCode: "PL",
  });

  const [daysHovered, setDaysHovered] = useState<DaysHoveredType>({
    calendar: 0,
    bussiness: 0,
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
        display: "flex",
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
