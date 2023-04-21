import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import styles from "./Calendar.module.css";
import isSameDay from "date-fns/isSameDay";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { DateRangeRequired, DaysHoveredType, SavedTripType } from "../../App";
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
  tripRange: DateRange | undefined;
  setTripRange: (dateRange: DateRange) => void;
  setDaysHovered: ({ calendar, bussiness }: DaysHoveredType) => void;
  holidays: HolidayType[] | null;
  tripColor: string;
  savedTrips: SavedTripType[];
}

const Calendar = ({
  tripRange,
  setTripRange,
  setDaysHovered,
  holidays,
  tripColor,
  savedTrips,
}: CalendarProps) => {
  const handleDayMouseEnter = (date: Date) => {
    if (!tripRange?.from || tripRange.to) return;

    if (isBefore(date, tripRange.from)) {
      setDaysHovered({
        calendar: 0,
        bussiness: 0,
      });
      return;
    }

    setDaysHovered({
      calendar: differenceInCalendarDays(date, tripRange.from) + 1,
      bussiness: differenceInBusinessDays(date, tripRange.from, holidays),
    });
  };

  const handleDayClick = (day: Date) => {
    const startNewRange =
      !tripRange?.from || tripRange.to || isBefore(day, tripRange?.from);

    if (startNewRange) {
      setTripRange({ from: day, to: undefined });
    } else {
      setTripRange({ ...tripRange, to: day });
    }
  };

  const modifiers = {
    weekendDays: (date: Date) => isWeekendOrHoliday(date, holidays),
    betweenRangeDays: (date: Date) => {
      if (isRangeSelected(tripRange)) {
        return isRangeMiddle(date, tripRange);
      }
      return false;
    },
    startEndRangeDays: (date: Date) => {
      const isStartDay = tripRange?.from
        ? isRangeStart(date, tripRange.from)
        : false;
      const isEndDay = tripRange?.to ? isRangeEnd(date, tripRange.to) : false;
      return isStartDay || isEndDay;
    },
    ...getSavedTripsModifiers(savedTrips),
  };

  const modifiersClassNames = {
    weekendDays: styles.weekendDays,
  };

  const rangesStyles = {
    startEndRangeDays: getMainRangeStyles(tripColor),
    betweenRangeDays: getSecondaryRangeStyles(tripColor),
    ...getSavedTripsStyles(savedTrips),
  };

  return (
    <div className={styles.calendar_wrapper}>
      <DayPicker
        mode="range"
        disableNavigation
        defaultMonth={new Date(2023, 0)} // TODO use relative years
        numberOfMonths={12}
        selected={tripRange}
        weekStartsOn={1}
        onDayMouseEnter={handleDayMouseEnter}
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

const getSavedTripsModifiers = (savedTrips: SavedTripType[]) => {
  const savedTripsModifiers = new Map();

  savedTrips.forEach((savedTrip) => {
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

const getSavedTripsStyles = (savedTrips: SavedTripType[]) => {
  const savedTripsModifiersStyles = new Map();

  savedTrips.forEach((savedTrip) => {
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
