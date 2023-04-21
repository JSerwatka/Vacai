import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import styles from "./Calendar.module.css";
import isSameDay from "date-fns/isSameDay";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { DaysHoveredType } from "../../App";
import { HolidayType } from "../../types/HolidayType";
import isBefore from "date-fns/isBefore";
import {
  differenceInBusinessDays,
  isWeekendOrHoliday,
} from "../../utils/dateFunctions";
import addDays from "date-fns/addDays";

interface CalendarProps {
  tripRange: DateRange | undefined;
  setTripRange: (dateRange: DateRange) => void;
  setDaysHovered: ({ calendar, bussiness }: DaysHoveredType) => void;
  holidays: HolidayType[] | null;
  tripColor: string;
}

const Calendar = ({
  tripRange,
  setTripRange,
  setDaysHovered,
  holidays,
  tripColor,
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
    betweenRangeDates: (date: Date) => {
      return tripRange?.from && tripRange?.to
        ? date > tripRange.from && date < tripRange.to
        : false;
    },
    startRange: (date: Date) =>
      tripRange?.from ? isSameDay(date, tripRange.from) : false,
    endRange: (date: Date) =>
      tripRange?.to ? isSameDay(date, tripRange.to) : false,
  };

  const modifiersClassNames = {
    weekendDays: styles.weekendDays,
  };

  const rangesStyles = {
    startEndRange: {
      backgroundColor: tripColor,
      "&:hover": {
        backgroundColor: tripColor,
      },
    },
    betweenRangeDates: {
      color: tripColor,
      backgroundColor: tripColor + "5F",
      "&:hover": {
        color: tripColor,
        backgroundColor: tripColor + "5F",
      },
    },
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
        modifiersStyles={{
          startRange: rangesStyles.startEndRange,
          endRange: rangesStyles.startEndRange,
          betweenRangeDates: rangesStyles.betweenRangeDates,
        }}
        modifiersClassNames={modifiersClassNames}
        onDayClick={handleDayClick}
      />
    </div>
  );
};

export default Calendar;
