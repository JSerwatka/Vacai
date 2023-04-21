import { useState } from "react";
import { DaysHoveredType } from "../../App";

interface ControlPanelProps {
  daysHovered: DaysHoveredType;
}

const ControlPanel = ({ daysHovered }: ControlPanelProps) => {
  const [vacationDays, setVacationDays] = useState<number>(0);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <input
        type="number"
        placeholder="Ilość dni urlopu"
        value={vacationDays}
        onChange={(e) => setVacationDays(Number(e.target.value))}
      />
      <div>Calendar days to be selected: {daysHovered.calendar}</div>
      <div>Bussiness days to be selected: {daysHovered.bussiness}</div>
    </div>
  );
};

export default ControlPanel;
