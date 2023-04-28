import { useDeferredValue, useMemo, useState } from "react";

import { SavedVacationType } from "../../types/VacationTypes";

interface VacationDaysInputProps {
    savedVacations: SavedVacationType[];
}

const VacationDaysInput = ({ savedVacations }: VacationDaysInputProps) => {
    const [vacationDays, setVacationDays] = useState<number>(0);
    const vacationsDaysDeffered = useDeferredValue(vacationDays);

    const vacationDaysLeft = useMemo(() => {
        return savedVacations.reduce((acc, current) => acc - current.bussinessDays, vacationDays);
    }, [savedVacations?.length, vacationsDaysDeffered]);

    return (
        <>
            <input
                type="number"
                placeholder="Ilość dni urlopu"
                value={vacationDays}
                onChange={(e) => setVacationDays(Number(e.target.value))}
            />
            <div>Days left = {vacationDaysLeft}</div>
        </>
    );
};

export default VacationDaysInput;
