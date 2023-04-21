import { DateRange } from "react-day-picker";

export const isRangeSelected = (
  vacationSelected: DateRange | undefined
): vacationSelected is { from: Date; to: Date } =>
  !!vacationSelected?.from && !!vacationSelected?.to;
