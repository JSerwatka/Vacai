import { createContext, useReducer } from "react";
import {
  ReducerAction,
  initState,
  vacationSelectedReducer,
} from "../reducers/VacationSelectedReducer";
import { SelectedVacationType } from "../../App";

interface VacationSelectedProviderProps {
  children: React.ReactNode;
}

export const VacationSelectedContext =
  createContext<SelectedVacationType | null>(null);
export const VacationSelectedDispatchContext =
  createContext<React.Dispatch<ReducerAction> | null>(null);

const VacationSelectedProvider = ({
  children,
}: VacationSelectedProviderProps) => {
  const [vacationSelected, dispatch] = useReducer(
    vacationSelectedReducer,
    initState
  );
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

export default VacationSelectedProvider;
