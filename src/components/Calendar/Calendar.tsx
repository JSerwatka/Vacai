import { useState, Dispatch, SetStateAction } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import styles from "./Calendar.module.css";
import isSameDay from "date-fns/isSameDay";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import {
  DateRangeRequired,
  DaysHoveredType,
  SavedVacationType,
  SelectedVacationType,
} from "../../App";
import { HolidayType } from "../../types/HolidayType";
import isBefore from "date-fns/isBefore";
import {
  differenceInBusinessDays,
  isWeekendOrHoliday,
} from "../../utils/dateFunctions";
import isWithinInterval from "date-fns/isWithinInterval";
import { Interval } from "date-fns";
import { isRangeSelected } from "../../utils/rangeSelectedTypeGuard";

interface CalendarProps {
  vacationSelected: SelectedVacationType;
  setVacationSelected: Dispatch<SetStateAction<SelectedVacationType>>;
  setDaysHovered: ({ calendar, bussiness }: DaysHoveredType) => void;
  holidays: HolidayType[] | null;
  savedVacations: SavedVacationType[];
}

const Calendar = ({
  vacationSelected,
  setVacationSelected,
  holidays,
  savedVacations,
}: CalendarProps) => {
  // const handleDayMouseEnter = (date: Date) => {
  //   if (!vacationSelected?.from || vacationSelected.to) return;

  //   if (isBefore(date, vacationSelected.from)) {
  //     setDaysHovered({
  //       calendar: 0,
  //       bussiness: 0,
  //     });
  //     return;
  //   }

  //   setDaysHovered({
  //     calendar: differenceInCalendarDays(date, vacationSelected.from) + 1,
  //     bussiness: differenceInBusinessDays(
  //       date,
  //       vacationSelected.from,
  //       holidays
  //     ),
  //   });
  // };

  const handleDayClick = (day: Date) => {
    const startNewRange =
      !vacationSelected?.range.from ||
      vacationSelected.range.to ||
      isBefore(day, vacationSelected?.range.from);

    if (startNewRange) {
      setVacationSelected((prevState) => ({
        ...prevState,
        range: {
          from: day,
          to: undefined,
        },
        calendarDays: 0,
        bussinessDays: 0,
      }));
      return;
    }

    setVacationSelected((prevState) => ({
      ...prevState,
      range: {
        ...prevState.range,
        to: day,
      },
      calendarDays: differenceInCalendarDays(day, prevState.range.from) + 1,
      bussiness: differenceInBusinessDays(day, prevState.range.from, holidays),
    }));
  };

  const modifiers = {
    weekendDays: (date: Date) => isWeekendOrHoliday(date, holidays),
    betweenRangeDays: (date: Date) => {
      if (isRangeSelected(vacationSelected)) {
        return isRangeMiddle(date, vacationSelected.range);
      }
      return false;
    },
    startEndRangeDays: (date: Date) => {
      const isStartDay = vacationSelected.range?.from
        ? isRangeStart(date, vacationSelected.range.from)
        : false;
      const isEndDay = vacationSelected.range?.to
        ? isRangeEnd(date, vacationSelected.range.to)
        : false;
      return isStartDay || isEndDay;
    },
    ...getSavedTripsModifiers(savedVacations),
  };

  const modifiersClassNames = {
    weekendDays: styles.weekendDays,
  };

  const rangesStyles = {
    startEndRangeDays: getMainRangeStyles(vacationSelected.color),
    betweenRangeDays: getSecondaryRangeStyles(vacationSelected.color),
    ...getSavedTripsStyles(savedVacations),
  };

  return (
    <div className={styles.calendar_wrapper}>
      <DayPicker
        mode="range"
        disableNavigation
        defaultMonth={new Date(2023, 0)} // TODO use relative years
        numberOfMonths={12}
        selected={vacationSelected.range}
        weekStartsOn={1}
        classNames={{
          months: styles.calendar_months,
        }}
        modifiers={modifiers}
        modifiersStyles={rangesStyles}
        modifiersClassNames={modifiersClassNames}
        onDayClick={handleDayClick}
      />
    </div>
  );
};

export default Calendar;

const getMainRangeStyles = (
  color: string,
  position?: "start" | "end" | "middle"
) => {
  const getBorderRadius = () => {
    switch (position) {
      case "start":
        return "100% 0 0 100%";
      case "end":
        return "0 100% 100% 0";
      case "middle":
        return "0";
      default:
        return null;
    }
  };

  return {
    backgroundColor: color,
    "&:hover": {
      backgroundColor: color,
    },
    borderRadius: getBorderRadius(),
  };
};

const getSecondaryRangeStyles = (
  color: string,
  colorOpacity: string = "5f"
) => {
  return {
    color: color,
    backgroundColor: color + colorOpacity,
    "&:hover": {
      color: color,
      backgroundColor: color + colorOpacity,
    },
  };
};

const isRangeStart = (date: Date, fromDate: DateRangeRequired["from"]) => {
  return isSameDay(date, fromDate);
};

const isRangeEnd = (date: Date, toDate: DateRangeRequired["to"]) => {
  return isSameDay(date, toDate);
};

const isRangeMiddle = (date: Date, range: DateRangeRequired) => {
  return date > range.from && date < range.to;
};

const getSavedTripsModifiers = (savedVacations: SavedVacationType[]) => {
  const savedTripsModifiers = new Map();

  savedVacations.forEach((savedTrip) => {
    savedTripsModifiers.set(savedTrip.name + "_start", (date: Date) =>
      isRangeStart(date, savedTrip.range.from)
    );
    savedTripsModifiers.set(savedTrip.name + "_end", (date: Date) =>
      isRangeEnd(date, savedTrip.range.to)
    );
    savedTripsModifiers.set(savedTrip.name + "_middle", (date: Date) =>
      isRangeMiddle(date, savedTrip.range)
    );
  });

  return Object.fromEntries(savedTripsModifiers);
};

const getSavedTripsStyles = (savedVacations: SavedVacationType[]) => {
  const savedTripsModifiersStyles = new Map();

  savedVacations.forEach((savedTrip) => {
    savedTripsModifiersStyles.set(
      savedTrip.name + "_start",
      getMainRangeStyles(savedTrip.color, "start")
    );
    savedTripsModifiersStyles.set(
      savedTrip.name + "_end",
      getMainRangeStyles(savedTrip.color, "end")
    );
    savedTripsModifiersStyles.set(
      savedTrip.name + "_middle",
      getMainRangeStyles(savedTrip.color, "middle")
    );
  });

  return Object.fromEntries(savedTripsModifiersStyles);
};
