import { createContext, useContext, useReducer } from "react";

import {
    initState,
    ReducerAction,
    vacationSelectedReducer
} from "../reducers/VacationSelectedReducer";
import { SelectedVacationType } from "../types/VacationTypes";

interface VacationSelectedProviderProps {
    children: React.ReactNode;
}

const VacationSelectedContext = createContext<SelectedVacationType | null>(null);
const VacationSelectedDispatchContext = createContext<React.Dispatch<ReducerAction> | null>(null);

const VacationSelectedProvider = ({ children }: VacationSelectedProviderProps) => {
    const [vacationSelected, dispatch] = useReducer(vacationSelectedReducer, initState);
    return (
        <>
            <VacationSelectedContext.Provider value={vacationSelected}>
                <VacationSelectedDispatchContext.Provider value={dispatch}>
                    {children}
                </VacationSelectedDispatchContext.Provider>
            </VacationSelectedContext.Provider>
        </>
    );
};

export const useVacationSelectedContext = () => {
    const context = useContext(VacationSelectedContext);

    if (context === null) {
        throw new Error(
            "useVacationSelectedContext must be used within a VacationSelectedProvider"
        );
    }

    return context;
};
export const useVacationSelectedDispatch = () => {
    const context = useContext(VacationSelectedDispatchContext);

    if (context === null) {
        throw new Error(
            "useVacationSelectedContext must be used within a VacationSelectedDispatchProvider"
        );
    }
    return context;
};

export default VacationSelectedProvider;
