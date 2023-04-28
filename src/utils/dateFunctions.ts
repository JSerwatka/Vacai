import eachDayOfInterval from "date-fns/eachDayOfInterval";
import isSameDay from "date-fns/isSameDay";
import isWeekend from "date-fns/isWeekend";

import { HolidayType } from "../types/HolidayType";

export const isWeekendOrHoliday = (date: Date, holidays: HolidayType[] | null) => {
    const isWeekendDay = isWeekend(date);

    const isHoliday = holidays?.some((holiday) => isSameDay(holiday.date, date)) ?? false;
    return isWeekendDay || isHoliday;
};

export const differenceInBusinessDays = (
    endDate: Date,
    startDate: Date,
    holidays: HolidayType[] | null
): number => {
    return eachDayOfInterval({ start: startDate, end: endDate }).filter(
        (day) => !isWeekendOrHoliday(day, holidays)
    ).length;
};
