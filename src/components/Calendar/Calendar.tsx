import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import styles from "./Calendar.module.css"; // Import your CSS file for the calendar
import isSameDay from "date-fns/isSameDay";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { DaysHoveredType } from "../../App";
import { HolidayType } from "../../types/HolidayType";
import isBefore from "date-fns/isBefore";
import {
  differenceInBusinessDays,
  isWeekendOrHoliday,
} from "../../utils/dateFunctions";

interface CalendarProps {
  selectedRange: DateRange | undefined;
  setSelectedRange: (dateRange: DateRange) => void;
  setDaysHovered: ({ calendar, bussiness }: DaysHoveredType) => void;
  holidays: HolidayType[] | null;
}

const Calendar = ({
  selectedRange,
  setSelectedRange,
  setDaysHovered,
  holidays,
}: CalendarProps) => {
  const handleDayMouseEnter = (date: Date) => {
    if (!selectedRange?.from || selectedRange.to) return;

    if (isBefore(date, selectedRange.from)) {
      setDaysHovered({
        calendar: 0,
        bussiness: 0,
      });
      return;
    }

    setDaysHovered({
      calendar: differenceInCalendarDays(date, selectedRange.from) + 1,
      bussiness: differenceInBusinessDays(date, selectedRange.from, holidays),
    });
  };

  const handleDayClick = (day: Date) => {
    const startNewRange =
      !selectedRange?.from ||
      selectedRange.to ||
      isBefore(day, selectedRange?.from);

    if (startNewRange) {
      setSelectedRange({ from: day, to: undefined });
    } else {
      setSelectedRange({ ...selectedRange, to: day });
    }
  };

  const modifiers = {
    weekendDays: (date: Date) => isWeekendOrHoliday(date, holidays),
    betweenDates: (date: Date) => {
      return selectedRange?.from && selectedRange?.to
        ? date > selectedRange.from && date < selectedRange.to
        : false;
    },
    startRange: (date: Date) =>
      selectedRange?.from ? isSameDay(date, selectedRange.from) : false,
    endRange: (date: Date) =>
      selectedRange?.to ? isSameDay(date, selectedRange.to) : false,
  };

  const modifiersStyles = {
    weekendDays: styles.weekendDays,
    betweenDates: styles.betweenDates,
    startRange: styles.startEndRange,
    endRange: styles.startEndRange,
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        border: "1px solid black",
      }}
    >
      <DayPicker
        mode="range"
        disableNavigation
        defaultMonth={new Date(2023, 0)} // TODO use relative years
        numberOfMonths={12}
        selected={selectedRange}
        weekStartsOn={1}
        onDayMouseEnter={handleDayMouseEnter}
        styles={{
          months: {
            flexWrap: "wrap",
            justifyContent: "center",
            rowGap: "30px",
          },
        }}
        modifiers={modifiers}
        modifiersClassNames={modifiersStyles}
        onDayClick={handleDayClick}
      />
    </div>
  );
};

export default Calendar;
