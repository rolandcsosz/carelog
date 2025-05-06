import React, { useEffect, useState } from "react";
import styles from "./Schedule.module.scss";
import { Button } from "../components/Button";
import Calendar from "../components/Calendar";
import ScheduleCard from "../components/ScheduleCard";
import { useAdminModel } from "../hooks/useAdminModel";
import { useApi } from "../hooks/useApi";
import { convertToGlobalUTC, getDateString } from "../utils";
import addButtonIconPrimary from "../assets/add-button-icon-primary.svg";

interface ScheduleProps {
    userId: string;
    caregiverIds?: string[];
    recipientIds?: string[];
}

type ScheduleMode = "caregiver" | "recipient" | null;

const Schedule: React.FC<ScheduleProps> = ({ userId, caregiverIds, recipientIds }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [schedules, setSchedules] = useState<Schedule[]>([]);

    const { request } = useApi();
    const { caregivers, relationships, recipients, fetchSchedulesForCaregiver, fetchSchedulesForRecipient } =
        useAdminModel();

    const userMode: ScheduleMode =
        caregiverIds ? "recipient"
        : recipientIds ? "caregiver"
        : null;

    const filteredIds =
        userMode === "caregiver" ?
            recipients
                .filter((recipient) =>
                    relationships?.some(
                        (relationship) =>
                            relationship.recipientId === recipient.id && relationship.caregiverId === userId,
                    ),
                )
                .map((recipient) => recipient.id)
        : userMode === "recipient" ?
            caregivers
                .filter((caregiver) =>
                    relationships?.some(
                        (relationship) =>
                            relationship.recipientId === userId && relationship.caregiverId === caregiver.id,
                    ),
                )
                .map((caregiver) => caregiver.id)
        :   undefined;

    useEffect(() => {
        const fetchSchedules = async () => {
            if (userMode === "caregiver") {
                const response = await fetchSchedulesForCaregiver(request, userId);
                setSchedules(response);
            } else if (userMode === "recipient") {
                const response = await fetchSchedulesForRecipient(request, userId);
                setSchedules(response);
            }
        };

        fetchSchedules();
    }, [userMode, userId, fetchSchedulesForCaregiver, fetchSchedulesForRecipient, request]);

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    const handleEdit = (editedSchedule: Schedule) => {
        // TODO: implement edit logic
    };

    const handleAddSchedule = (schedule: Schedule) => {
        // TODO: implement add logic
    };

    const handleDeleteRecipient = () => {
        // TODO: implement delete logic
    };

    const filteredSchedules = schedules.filter(
        (schedule) => selectedDate && convertToGlobalUTC(schedule.date) === convertToGlobalUTC(selectedDate),
    );

    const dropdownOptions =
        userMode === "caregiver" ?
            recipients.filter((r) => filteredIds?.includes(r.id)).map((r) => r.name)
        :   caregivers.filter((c) => filteredIds?.includes(c.id)).map((c) => c.name);

    return (
        <div className={styles.calendarContainer}>
            <Calendar
                onDateChange={handleDateChange}
                highlightedDates={schedules.map((schedule) => new Date(schedule.date))}
            />

            <div className={styles.title}>{selectedDate ? getDateString(selectedDate) : getDateString(new Date())}</div>

            <div className={styles.scheduleContainer}>
                {filteredSchedules.map((schedule, index) => (
                    <ScheduleCard
                        key={index}
                        title={userMode === "caregiver" ? "Gondozott" : "Gondozó"}
                        options={dropdownOptions}
                        dropDownDisabled={userMode === "recipient"}
                        onChange={() => {}}
                        startTime={schedule.start}
                        endTime={schedule.end}
                    />
                ))}
            </div>

            <Button noText primary icon={addButtonIconPrimary} size="large" onClick={() => {}} fillWidth />
        </div>
    );
};

export default Schedule;
