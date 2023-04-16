import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import styles from "./Calendar.module.css"; // Import your CSS file for the calendar
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

  // const handleDayClick = (day: Date) => {
  //   if (!range?.from || range.to) {
  //     setRange({ from: day, to: undefined });
  //   } else if (day < range.from) {
  //     setRange({ from: day, to: range.from });
  //   } else if (isSameDay(day, range.from)) {
  //     setRange({ from: day, to: day });
  //   } else {
  //     setRange({ ...range, to: day });
  //   }
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
        onSelect={setRange}
        // onDayMouseEnter={handleDayMouseEnter}
        styles={{
          months: {
            flexWrap: "wrap",
            justifyContent: "center",
            rowGap: "30px",
          },
        }}
        modifiers={modifiers}
        modifiersClassNames={modifiersStyles}
        // onDayClick={handleDayClick}
      />
    </div>
  );
};

export default Calendar;
