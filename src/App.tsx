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

function App() {
  const { holidays, error } = usePublicHolidays({
    year: 2023,
    countryCode: "PL",
  });

  const [selectedRange, setSelectedRange] = useState<DateRange>();
  const [savedHolidays, setSavedHolidays] = useState<SavedVacationsType[]>();

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Calendar />
      <ControlPanel />
    </div>
  );
}

export default App;
