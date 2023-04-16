import { useEffect, useState } from "react";
import Calendar from "./components/Calendar/Calendar";
import { CountryCodesUnion } from "./types/CountryCodes";

function App() {
  const [vacationDays, setVacationDays] = useState<number>(0);

  return (
    <>
      <input
        type="number"
        placeholder="Ilość dni urlopu"
        value={vacationDays}
        onChange={(e) => setVacationDays(Number(e.target.value))}
      />
      <Calendar />
    </>
  );
}

export default App;
