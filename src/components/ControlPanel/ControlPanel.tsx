import { useState } from "react";

interface ControlPanelProps {}

const ControlPanel = ({}: ControlPanelProps) => {
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
    </div>
  );
};

export default ControlPanel;
