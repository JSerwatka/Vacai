import { DateRange } from "react-day-picker";
import { SelectedVacationType } from "../App";
import { DeepRequired } from "../types/DeepRequired";

export const isRangeSelected = (
  vacationSelected: SelectedVacationType
): vacationSelected is DeepRequired<SelectedVacationType> =>
  !!vacationSelected?.range.from && !!vacationSelected?.range.to;
