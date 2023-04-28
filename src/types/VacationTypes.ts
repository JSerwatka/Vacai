import { DateRange } from "react-day-picker";
import { DeepRequired } from "./DeepRequired";

export type DateRangeRequired = DeepRequired<DateRange>;

export type SavedVacationType = DeepRequired<SelectedVacationType>;

export interface DaysHoveredType {
  calendar: number;
  bussiness: number;
}

export interface SelectedVacationType {
  range: DateRange;
  bussinessDays: number;
  calendarDays: number;
  color: string;
  name: string;
}
