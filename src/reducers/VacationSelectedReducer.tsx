import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { differenceInBusinessDays } from "../utils/dateFunctions";
import { HolidayType } from "../types/HolidayType";
import { SelectedVacationType } from "../types/VacationTypes";

export type ReducerAction =
  | { type: "RESET" }
  | { type: "RENAME"; value: SelectedVacationType["name"] }
  | { type: "CHANGE_COLOR"; value: SelectedVacationType["color"] }
  | {
      type: "SET_RANGE_START";
      value: NonNullable<SelectedVacationType["range"]["from"]>;
    }
  | {
      type: "SET_RANGE_END";
      value: {
        to: NonNullable<SelectedVacationType["range"]["to"]>;
        holidays: HolidayType[];
      };
    };

export const initState = {
  range: {
    from: undefined,
    to: undefined,
  },
  bussinessDays: 0,
  calendarDays: 0,
  color: "#4caf50",
  name: "",
};

export const vacationSelectedReducer = (
  state: SelectedVacationType,
  action: ReducerAction
): SelectedVacationType => {
  switch (action.type) {
    case "RESET":
      return initState;
    case "RENAME":
      return {
        ...state,
        name: action.value,
      };
    case "CHANGE_COLOR":
      return {
        ...state,
        color: action.value,
      };
    case "SET_RANGE_START":
      return {
        ...state,
        range: {
          from: action.value,
          to: undefined,
        },
        calendarDays: 0,
        bussinessDays: 0,
      };
    case "SET_RANGE_END":
      if (!state.range.from) {
        return state;
      } // TODO make safer

      return {
        ...state,
        range: {
          ...state.range,
          to: action.value.to,
        },
        calendarDays:
          differenceInCalendarDays(action.value.to, state.range.from) + 1,
        bussinessDays: differenceInBusinessDays(
          action.value.to,
          state.range.from,
          action.value.holidays
        ),
      };
    default:
      throw new Error("Unknown action type");
  }
};
