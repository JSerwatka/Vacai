import "react-day-picker/dist/style.css";

import isBefore from "date-fns/isBefore";
import isSameDay from "date-fns/isSameDay";
import { DayModifiers, DayPicker, ModifiersStyles } from "react-day-picker";

import {
    useVacationSelectedContext,
    useVacationSelectedDispatch
} from "../../contexts/VacationSelectedProvider";
import { HolidayType } from "../../types/HolidayType";
import { DateRangeRequired, DaysHoveredType, SavedVacationType } from "../../types/VacationTypes";
import { isWeekendOrHoliday } from "../../utils/dateFunctions";
import { isRangeSelected } from "../../utils/rangeSelectedTypeGuard";
import styles from "./Calendar.module.css";

interface CalendarProps {
    setDaysHovered: ({ calendar, bussiness }: DaysHoveredType) => void;
    holidays: HolidayType[];
    savedVacations: SavedVacationType[];
}

const Calendar = ({ holidays, savedVacations }: CalendarProps) => {
    const vacationSelected = useVacationSelectedContext();
    const vacationSelectedDispatch = useVacationSelectedDispatch();

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
        // start new range?
        if (
            vacationSelected?.range.from === undefined ||
            vacationSelected.range.to ||
            isBefore(day, vacationSelected?.range.from)
        ) {
            vacationSelectedDispatch({ type: "SET_RANGE_START", value: day });
            return;
        }

        vacationSelectedDispatch({
            type: "SET_RANGE_END",
            value: {
                to: day,
                holidays: holidays
            }
        });
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
        ...getSavedTripsModifiers(savedVacations)
    } as DayModifiers;

    const modifiersClassNames = {
        weekendDays: styles.weekendDays
    };

    const rangesStyles = {
        startEndRangeDays: getMainRangeStyles(vacationSelected.color),
        betweenRangeDays: getSecondaryRangeStyles(vacationSelected.color),
        ...getSavedTripsStyles(savedVacations)
    } as ModifiersStyles;

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
                    months: styles.calendar_months
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
    position?: "end" | "middle" | "start"
): React.CSSProperties | { "&:hover": React.CSSProperties } => {
    const getBorderRadius = (): string | undefined => {
        switch (position) {
            case "start":
                return "100% 0 0 100%";
            case "end":
                return "0 100% 100% 0";
            case "middle":
                return "0";
            default:
                return undefined;
        }
    };

    return {
        backgroundColor: color,
        "&:hover": {
            backgroundColor: color
        },
        borderRadius: getBorderRadius()
    };
};

type CSSProperites = React.CSSProperties | { "&:hover": React.CSSProperties };

const getSecondaryRangeStyles = (color: string, colorOpacity = "5f"): CSSProperites => {
    return {
        color: color,
        backgroundColor: color + colorOpacity,
        "&:hover": {
            color: color,
            backgroundColor: color + colorOpacity
        }
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

const getSavedTripsModifiers = (savedVacations: SavedVacationType[]): DayModifiers => {
    const savedTripsModifiers = new Map<string, (date: Date) => boolean>();

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

const getSavedTripsStyles = (savedVacations: SavedVacationType[]): ModifiersStyles => {
    const savedTripsModifiersStyles = new Map<string, CSSProperites>();

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
