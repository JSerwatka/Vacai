import { useEffect, useState } from "react";

import { CountryCodesUnion } from "../types/CountryCodes";
import { HolidayType } from "../types/HolidayType";

interface HolidayFetchResponsSuccess {
    date: string;
    localName: string;
    name: string;
    countryCode: CountryCodesUnion;
    fixed: boolean;
    global: boolean;
    counties: string | null;
    launchYear: number | null;
    types: ("Authorities" | "Bank" | "Observance" | "Optional" | "Public" | "School")[];
}

// https://date.nager.at/swagger/index.html
// /api/v3/LongWeekend/{year}/{countryCode} Get long weekends for a given country

interface HolidayFetchResponsError {
    type: string;
    title: string;
    status: number;
    traceId: string;
    errors?: { year: string[] };
}

interface UsePublicHolidaysProps {
    year: number;
    countryCode: CountryCodesUnion;
}

const usePublicHolidays = ({ year, countryCode }: UsePublicHolidaysProps) => {
    const [publicHolidays, setPublicHolidays] = useState<HolidayType[]>([]);
    const [fetchError, setFetchError] = useState<string>("");

    useEffect(() => {
        const fetchPublicHolidays = async () => {
            const datesResposne = await fetch(
                `https://date.nager.at/api/v3/publicholidays/${year}/${countryCode}`
            );

            if (!datesResposne.ok) {
                const errorValue = (await datesResposne.json()) as HolidayFetchResponsError;

                const errorText = errorValue.errors?.year[0] || "Unknown error";

                setFetchError(errorText);
                return;
            }

            const datesJson = (await datesResposne.json()) as HolidayFetchResponsSuccess[];

            if (datesJson) {
                const datesMapped = datesJson.map((holidayDates) => ({
                    date: new Date(holidayDates.date),
                    name: holidayDates.localName
                }));

                setPublicHolidays(datesMapped);
            }
        };

        fetchPublicHolidays();
    }, []);

    return {
        holidays: publicHolidays,
        error: fetchError
    };
};

export default usePublicHolidays;
