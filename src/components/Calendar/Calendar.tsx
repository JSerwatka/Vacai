import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import styles from "./Calendar.module.css"; // Import your CSS file for the calendar
import isWeekend from "date-fns/isWeekend";
import isSameDay from "date-fns/isSameDay";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { DaysHoveredType } from "../../App";
import { HolidayType } from "../../types/HolidayType";
import isBefore from "date-fns/isBefore";
import eachDayOfInterval from "date-fns/eachDayOfInterval";

interface CalendarProps {
  setDaysHovered: ({ calendar, bussiness }: DaysHoveredType) => void;
  holidays: HolidayType[] | null;
}

const Calendar = ({ setDaysHovered, holidays }: CalendarProps) => {
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  // const [highlightedRange, setHighlightedRange] = useState<
  //   { start: Date; end: Date } | undefined
  // >(undefined);

  const isWeekendOrHoliday = (date: Date) => {
    const isWeekendDay = isWeekend(date);

    const isHoliday = holidays?.some((holiday) =>
      isSameDay(holiday.date, date)
    );
    return isWeekendDay || isHoliday;
  };

  const differenceInBusinessDays = (endDate: Date, startDate: Date) => {
    return eachDayOfInterval({ start: startDate, end: endDate }).filter(
      (day) => !isWeekendOrHoliday(day)
    ).length;
  };

  const handleDayMouseEnter = (date: Date) => {
    if (!range?.from || range.to) return;

    if (isBefore(date, range.from)) {
      setDaysHovered({
        calendar: 0,
        bussiness: 0,
      });
      return;
    }

    setDaysHovered({
      calendar: differenceInCalendarDays(date, range.from) + 1,
      bussiness: differenceInBusinessDays(date, range.from),
    });
  };

  const handleDayClick = (day: Date) => {
    const startNewRange =
      !range?.from || range.to || isBefore(day, range?.from);

    if (startNewRange) {
      setRange({ from: day, to: undefined });
    } else {
      setRange({ ...range, to: day });
    }
  };

  const modifiers = {
    weekendDays: isWeekendOrHoliday,
    betweenDates: (date: Date) => {
      return range?.from && range?.to
        ? date > range.from && date < range.to
        : false;
    },
    startRange: (date: Date) =>
      range?.from ? isSameDay(date, range.from) : false,
    endRange: (date: Date) => (range?.to ? isSameDay(date, range.to) : false),
    // highlighted: (date: Date) =>
    //   highlightedRange && isWithinInterval(date, highlightedRange),
  };

  const modifiersStyles = {
    weekendDays: styles.weekendDays,
    betweenDates: styles.betweenDates,
    startRange: styles.startEndRange,
    endRange: styles.startEndRange,
    // highlighted: "highlighted",
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
        selected={range}
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
