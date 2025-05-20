import React, { useState } from "react";
import styles from "./CalendarSchedule.module.scss";
import Calendar from "../../components/Calendar";
import { compareTime, convertToGlobalUTC, getDateString } from "../../utils";
import { useCaregiverModel } from "../../hooks/useCaregiverModel";
import TimeTableRow from "../../components/TimeTableRow";
import useNavigation from "../../hooks/useNavigation";
import Recipient from "./Recipient";

const CalendarSchedule: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const { relationships, recipients, schedules } = useCaregiverModel();
    const { addPageToStack } = useNavigation();

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    const filteredSchedules = schedules.info
        ?.filter((schedule) => selectedDate && convertToGlobalUTC(schedule.date) === convertToGlobalUTC(selectedDate))
        .sort((a, b) => compareTime(a.start, b.start));

    const getRecipientForSchedule = (schedule: Schedule): Recipient | undefined => {
        const relationship = relationships.info?.find((relationship) => relationship.id === schedule.relationshipId);
        if (relationship) {
            const recipient = recipients.info?.find((recipient) => recipient.id === relationship.recipientId);
            if (recipient) {
                return recipient;
            }
        }
        return undefined;
    };

    return (
        <div className={styles.page}>
            <div className={styles.mainTitle}>Beosztás</div>
            <div />

            <div className={styles.calendarContainer}>
                <Calendar
                    onDateChange={handleDateChange}
                    highlightedDates={schedules.info?.map((schedule) => new Date(schedule.date))}
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
                            start={schedule.start}
                            end={schedule.end}
                            userName={recipient.name}
                            address={recipient.address}
                            type="notEditable"
                            onOpen={() => {
                                addPageToStack(<Recipient recipient={recipient} />);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarSchedule;
