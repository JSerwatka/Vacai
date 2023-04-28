import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { differenceInBusinessDays } from "../../utils/dateFunctions";
import { SelectedVacationType } from "../../App";

type REDUCER_ACTION_TYPE =
  | "RENAME"
  | "RESET"
  | "CHANGE_COLOR"
  | "SET_RANGE_START"
  | "SET_RANGE_END";

export type ReducerAction = {
  type: REDUCER_ACTION_TYPE;
  value?: #TODO;
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
    case "RENAME":
      return {
        ...state,
        name: action.value,
      };
    case "RESET":
      return initState;
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
      return {
        ...state,
        range: {
          ...state.range,
          to: action.value.to,
        },
        calendarDays:
          differenceInCalendarDays(action.value, state.range.from) + 1,
        bussinessDays: differenceInBusinessDays(
          action.value.to,
          state.range.from,
          action.value.holidays
        ),
      };
    default:
      throw new Error("Unknown action type " + action.type);
  }
};
