import React, { useState } from "react";
import styles from "./CalendarSchedule.module.scss";
import Calendar from "../../components/Calendar";
import { getDateString } from "../../utils";
import { useCaregiverModel } from "../../hooks/useCaregiverModel";
import TimeTableRow from "../../components/TimeTableRow";
import useNavigation from "../../hooks/useNavigation";
import RecipientWithoutPassword from "./RecipientPage";
import useQueryData from "../../hooks/useQueryData";

const CalendarSchedule: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const { schedules } = useCaregiverModel();
    const { addPageToStack } = useNavigation();
    const { getFilteredSchedules, getRecipientForSchedule } = useQueryData();
    const filteredSchedules = getFilteredSchedules(selectedDate);

    return (
        <div className={styles.page}>
            <div className={styles.mainTitle}>Beosztás</div>
            <div />

            <div className={styles.calendarContainer}>
                <Calendar
                    onDateChange={setSelectedDate}
                    highlightedDates={schedules.list?.map((schedule) => new Date(schedule.date))}
                />
            </div>

            <div className={styles.title}>{selectedDate ? getDateString(selectedDate) : getDateString(new Date())}</div>

            <div className={styles.table}>
                {filteredSchedules?.map((schedule) => {
                    const recipient = getRecipientForSchedule(schedule);
                    if (!recipient) {
                        return null;
                    }
                    return (
                        <TimeTableRow
                            key={"calendar-table-row" + schedule.id}
                            start={schedule.startTime}
                            end={schedule.endTime}
                            userName={recipient.name}
                            address={recipient.address}
                            type="notEditable"
                            onOpen={() => {
                                addPageToStack(<RecipientWithoutPassword recipient={recipient} />);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarSchedule;
