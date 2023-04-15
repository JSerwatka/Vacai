import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "./Calendar.css"; // Import your CSS file for the calendar
import isWeekend from "date-fns/isWeekend";
import isWithinInterval from "date-fns/isWithinInterval";
import isSameDay from "date-fns/isSameDay";

const Calendar = () => {
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  // const [highlightedRange, setHighlightedRange] = useState<
  //   { start: Date; end: Date } | undefined
  // >(undefined);

  // const handleDayMouseEnter = (date: Date) => {
  //   if (!range?.from || range.to) return;
  //   const newRange = { start: range.from, end: date };
  //   setHighlightedRange(newRange);
  // };

  const modifiers = {
    weekendDays: (date: Date) => isWeekend(date),
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
    weekendDays: "weekendDays",
    betweenDates: "betweenDates",
    startRange: "startEndRange",
    endRange: "startEndRange",
    // highlighted: "highlighted",
  };

  return (
    <DayPicker
      mode="range"
      disableNavigation
      numberOfMonths={12}
      selected={range}
      weekStartsOn={1}
      onSelect={setRange}
      // onDayMouseEnter={handleDayMouseEnter}
      styles={{
        months: {
          flexWrap: "wrap",
        },
      }}
      modifiers={modifiers}
      modifiersClassNames={modifiersStyles}
    />
  );
};

export default Calendar;
