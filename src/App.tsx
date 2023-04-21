import { useCallback, useEffect, useState } from "react";
import Calendar from "./components/Calendar/Calendar";
import { CountryCodesUnion } from "./types/CountryCodes";
import usePublicHolidays from "./hooks/usePublicHolidays";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import "./App.css";
import { HolidayType } from "./types/HolidayType";
import { DateRange } from "react-day-picker";
import { DeepRequired } from "./types/DeepRequired";

export interface SavedTripType {
  color: string;
  name: string;
  range: DeepRequired<DateRange>;
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

  const [tripRange, setTripRange] = useState<DateRange | undefined>(undefined);
  const [tripColor, setTripColor] = useState<string>("#4caf50");

  const [daysHovered, setDaysHovered] = useState<DaysHoveredType>({
    calendar: 0,
    bussiness: 0,
  });

  const [savedTrips, setSavedTrips] = useState<SavedTripType[]>([]);

  const addSavedTrip = useCallback(
    (newSavedTrip: SavedTripType) => {
      setSavedTrips((prevValue) => [...prevValue, newSavedTrip]);
    },
    [setSavedTrips]
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
        tripRange={tripRange}
        setTripRange={setTripRange}
        tripColor={tripColor}
        savedTrips={savedTrips}
      />
      <ControlPanel
        daysHovered={daysHovered}
        tripRange={tripRange}
        tripColor={tripColor}
        setTripColor={setTripColor}
        savedTrips={savedTrips}
        addSavedTrip={addSavedTrip}
      />
    </div>
  );
}

export default App;
