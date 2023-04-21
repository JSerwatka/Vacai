import { DateRange } from "react-day-picker";

export const isRangeSelected = (
  tripRange: DateRange | undefined
): tripRange is { from: Date; to: Date } =>
  !!tripRange?.from && !!tripRange?.to;
