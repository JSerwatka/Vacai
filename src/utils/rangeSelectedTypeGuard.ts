import { DeepRequired } from "../types/DeepRequired";
import { SelectedVacationType } from "../types/VacationTypes";

export const isRangeSelected = (
    vacationSelected: SelectedVacationType
): vacationSelected is DeepRequired<SelectedVacationType> =>
    !!vacationSelected?.range.from && !!vacationSelected?.range.to;
