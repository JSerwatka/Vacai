import { useEffect, useState } from "react";
import Calendar from "./components/Calendar/Calendar";
import { CountryCodesUnion } from "./types/CountryCodes";
import usePublicHolidays from "./hooks/usePublicHolidays";
import ControlPanel from "./components/ControlPanel/ControlPanel";
import "./App.css";
import { HolidayType } from "./types/HolidayType";
import { DateRange } from "react-day-picker";

interface SavedVacationsType {
  color: string;
  name: string;
  range: Required<DateRange>;
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
      />
      <ControlPanel
        daysHovered={daysHovered}
        tripRange={tripRange}
        tripColor={tripColor}
        setTripColor={setTripColor}
      />
    </div>
  );
}

export default App;
