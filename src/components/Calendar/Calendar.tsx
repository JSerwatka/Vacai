import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import styles from "./Calendar.module.css";
import isSameDay from "date-fns/isSameDay";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { DaysHoveredType, SavedTripType } from "../../App";
import { HolidayType } from "../../types/HolidayType";
import isBefore from "date-fns/isBefore";
import {
  differenceInBusinessDays,
  isWeekendOrHoliday,
} from "../../utils/dateFunctions";
import isWithinInterval from "date-fns/isWithinInterval";

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
      return tripRange?.from && tripRange?.to
        ? date > tripRange.from && date < tripRange.to
        : false;
    },
    startEndRangeDays: (date: Date) => {
      const isStartDay = tripRange?.from
        ? isSameDay(date, tripRange.from)
        : false;
      const isEndDay = tripRange?.to ? isSameDay(date, tripRange.to) : false;
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

const getMainRangeStyles = (color: string, betweenStyles: boolean = false) => ({
  backgroundColor: color,
  "&:hover": {
    backgroundColor: color,
  },
});

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

const getSavedTripsModifiers = (savedTrips: SavedTripType[]) => {
  const savedTripsModifiers = new Map();

  savedTrips.forEach((savedTrip) => {
    savedTripsModifiers.set(savedTrip.name, (date: Date) =>
      isWithinInterval(date, {
        start: savedTrip.range.from,
        end: savedTrip.range.to,
      })
    );
  });

  return Object.fromEntries(savedTripsModifiers);
};

const getSavedTripsStyles = (savedTrips: SavedTripType[]) => {
  const savedTripsModifiersStyles = new Map();

  savedTrips.forEach((savedTrip) => {
    savedTripsModifiersStyles.set(
      savedTrip.name,
      getMainRangeStyles(savedTrip.color)
    );
  });

  return Object.fromEntries(savedTripsModifiersStyles);
};
