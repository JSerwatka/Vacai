import { useCallback, useEffect, useState } from "react";
import Calendar from "./components/Calendar/Calendar";
import { CountryCodesUnion } from "./types/CountryCodes";
import usePublicHolidays from "./hooks/usePublicHolidays";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import "./App.css";
import { HolidayType } from "./types/HolidayType";
import { DateRange } from "react-day-picker";
import { DeepRequired } from "./types/DeepRequired";

export type DateRangeRequired = DeepRequired<DateRange>;

export interface SavedVacationType {
  color: string;
  name: string;
  range: DateRangeRequired;
}

export interface DaysHoveredType {
  calendar: number;
  bussiness: number;
}

function App() {
  const { holidays, error } = usePublicHolidays({
    year: 2023,
    countryCode: "PL",
  });

  const [vacationSelected, setVacationSelected] = useState<
    DateRange | undefined
  >(undefined);
  const [vacationColor, setVacationColor] = useState<string>("#4caf50");

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
      <Calendar
        setDaysHovered={setDaysHovered}
        holidays={holidays}
        vacationSelected={vacationSelected}
        setVacationSelected={setVacationSelected}
        vacationColor={vacationColor}
        savedVacations={savedVacations}
      />
      <ControlPanel
        daysHovered={daysHovered}
        vacationSelected={vacationSelected}
        vacationColor={vacationColor}
        setVacationColor={setVacationColor}
        savedVacations={savedVacations}
        addSavedVacation={addSavedVacation}
      />
    </div>
  );
}

export default App;
