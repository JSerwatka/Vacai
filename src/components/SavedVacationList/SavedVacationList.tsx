import format from "date-fns/format";
import { dateFormat } from "../../utils/dateFormat";
import styles from "./SavedVacationList.module.css";
import { SavedVacationType } from "../../types/VacationTypes";

interface SavedVacationListProps {
  savedVacations: SavedVacationType[];
}

const SavedVacationList = ({ savedVacations }: SavedVacationListProps) => {
  return (
    <>
      <h1>Trips:</h1>

      {savedVacations.map((savedTrip) => (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
          key={savedTrip.name}
        >
          <div
            className={styles.trip_color}
            style={{ backgroundColor: savedTrip.color }}
          ></div>
          <div>{savedTrip.name}</div>
          <div>
            {format(savedTrip.range.from, dateFormat)} -{" "}
            {format(savedTrip.range.to, dateFormat)}
          </div>
          <div>Calendar days: {savedTrip.calendarDays}</div>
          <div>Bussiness days: {savedTrip.bussinessDays}</div>
        </div>
      ))}
    </>
  );
};

export default SavedVacationList;
