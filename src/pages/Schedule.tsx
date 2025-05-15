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
    userId: number;
    caregiverIds?: number[];
    recipientIds?: number[];
}

type ScheduleMode = "caregiver" | "recipient" | null;

const Schedule: React.FC<ScheduleProps> = ({ userId, caregiverIds, recipientIds }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [fetchedSchedules, setFetchedSchedules] = useState<Schedule[]>([]);

    const { request } = useApi();
    const { caregivers, relationships, recipients, schedules } = useAdminModel();

    const userMode: ScheduleMode =
        caregiverIds ? "recipient"
        : recipientIds ? "caregiver"
        : null;

    const filteredIds =
        userMode === "caregiver" ?
            recipients.list
                ?.filter((recipient) =>
                    relationships.list?.some(
                        (relationship) =>
                            relationship.recipientId === recipient.id && relationship.caregiverId === userId,
                    ),
                )
                .map((recipient) => recipient.id)
        : userMode === "recipient" ?
            caregivers.list
                ?.filter((caregiver) =>
                    relationships.list?.some(
                        (relationship) =>
                            relationship.recipientId === userId && relationship.caregiverId === caregiver.id,
                    ),
                )
                .map((caregiver) => caregiver.id)
        :   undefined;

    const refetchSchedules = async () => {
        const fetchSchedules = async () => {
            if (userMode === "caregiver") {
                const response = await schedules.fetchForCaregiver(request, userId);
                setFetchedSchedules(response);
            } else if (userMode === "recipient") {
                const response = await schedules.fetchForRecipient(request, userId);
                setFetchedSchedules(response);
            }
        };

        fetchSchedules();
    };

    useEffect(() => {
        refetchSchedules();
    }, [userMode, userId, schedules, request]);

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    const handleAddSchedule = async (schedule: Schedule) => {
        const response = await schedules.add(request, {
            requestBody: {
                relationship_id: schedule.relationshipId,
                start_time: schedule.start,
                end_time: schedule.end,
                date: schedule.date.toDateString(), //TODO check if this is correct
            },
        });

        if (response) {
            refetchSchedules();
        }
    };

    const handleDeleteSchedule = async (id: number) => {
        const response = await schedules.delete(request, {
            id: id,
        });

        if (response) {
            refetchSchedules();
        }
    };

    const handleModifySchedule = async (schedule: NewScheduleData) => {
        let connection: Relationship | undefined = undefined;

        if (userMode === "caregiver") {
            connection = relationships.list?.find(
                (rel) => rel.recipientId === schedule.selectedId && rel.caregiverId === userId,
            );
        } else if (userMode === "recipient") {
            connection = relationships.list?.find(
                (rel) => rel.recipientId === userId && rel.caregiverId === schedule.selectedId,
            );
        }

        if (!connection) {
            handleAddSchedule({
                relationshipId: schedule.selectedId,
                start: schedule.start,
                end: schedule.end,
                date: selectedDate,
            });
            return;
        }

        const response = await schedules.edit(request, {
            id: connection.recipientId,
            requestBody: {
                relationship_id: schedule.selectedId,
                start_time: schedule.start,
                end_time: schedule.end,
                date: selectedDate.toDateString(), //TODO check if this is correct
            },
        });

        if (response) {
            refetchSchedules();
        }
    };

    const filteredSchedules = fetchedSchedules.filter(
        (schedule) => selectedDate && convertToGlobalUTC(schedule.date) === convertToGlobalUTC(selectedDate),
    );

    const dropdownOptions =
        userMode === "caregiver" ?
            new Map(recipients.list?.filter((r) => filteredIds?.includes(r.id)).map((r) => [r.id, r.name]))
        :   new Map(caregivers.list?.filter((c) => filteredIds?.includes(c.id)).map((c) => [c.id, c.name]));

    return (
        <div className={styles.calendarContainer}>
            <Calendar
                onDateChange={handleDateChange}
                highlightedDates={fetchedSchedules.map((schedule) => new Date(schedule.date))}
            />

            <div className={styles.title}>{selectedDate ? getDateString(selectedDate) : getDateString(new Date())}</div>

            <div className={styles.scheduleContainer}>
                {filteredSchedules.map((schedule, index) => (
                    <ScheduleCard
                        key={index}
                        title={userMode === "caregiver" ? "Gondozott" : "Gondozó"}
                        options={dropdownOptions}
                        dropDownDisabled={userMode === "recipient"}
                        onChange={handleModifySchedule}
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
