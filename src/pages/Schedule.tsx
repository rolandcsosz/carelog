import React, { useEffect, useState } from "react";
import styles from "./Schedule.module.scss";
import { Button } from "../components/Button";
import Calendar from "../components/Calendar";
import ScheduleCard from "../components/ScheduleCard";
import { useAdminModel } from "../hooks/useAdminModel";
import { useApi } from "../hooks/useApi";
import { compareTime, convertToGlobalUTC, getDateString } from "../utils";
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

    const firstRelationshipForUser = relationships.list?.find((relationship) => {
        if (userMode === "caregiver") {
            return (
                relationship.caregiverId === userId &&
                (!recipientIds || recipientIds.includes(relationship.recipientId))
            );
        } else if (userMode === "recipient") {
            return (
                relationship.recipientId === userId &&
                (!caregiverIds || caregiverIds.includes(relationship.caregiverId))
            );
        }
        return false;
    });

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
    }, [userMode, userId]);

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
            const selectedRecipient = recipients.list?.find((r) => r.name === schedule.selectedOption);
            if (!selectedRecipient) {
                console.error("Selected recipient not found");
                return;
            }
            connection = relationships.list?.find(
                (rel) => rel.recipientId === selectedRecipient.id && rel.caregiverId === userId,
            );
        } else if (userMode === "recipient") {
            const selectedCaregiver = caregivers.list?.find((c) => c.name === schedule.selectedOption);
            if (!selectedCaregiver) {
                console.error("Selected caregiver not found");
                return;
            }
            connection = relationships.list?.find(
                (rel) => rel.recipientId === userId && rel.caregiverId === selectedCaregiver.id,
            );
        }

        if (!connection) {
            console.error("Connection not found");
            return;
        }

        console.log("EDIT SCHEDULE", schedule.id, {
            relationship_id: Number(connection.id),
            start_time: schedule.start,
            end_time: schedule.end,
            date: selectedDate.toDateString(), //TODO check if this is correct
        });
        const response = await schedules.edit(request, {
            id: schedule.id,
            requestBody: {
                relationship_id: connection.id,
                start_time: schedule.start,
                end_time: schedule.end,
                date: selectedDate.toDateString(), //TODO check if this is correct
            },
        });

        if (response) {
            setFetchedSchedules((prev) =>
                prev.map((s) =>
                    s.id === schedule.id ?
                        {
                            ...s,
                            start: schedule.start,
                            end: schedule.end,
                            date: selectedDate,
                            relationshipId: connection!.id,
                        }
                    :   s,
                ),
            );
        }
    };

    const filteredSchedules = fetchedSchedules
        .filter((schedule) => selectedDate && convertToGlobalUTC(schedule.date) === convertToGlobalUTC(selectedDate))
        .sort((a, b) => compareTime(a.start, b.start));

    const dropdownOptions =
        userMode === "caregiver" ?
            recipients.list?.filter((r) => filteredIds?.includes(r.id)).map((r) => r.name)
        :   caregivers.list?.filter((c) => filteredIds?.includes(c.id)).map((c) => c.name);

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
                        title={userMode === "caregiver" ? "Gondozott" : "Gondozó"}
                        options={dropdownOptions}
                        dropDownDisabled={userMode === "recipient"}
                        onChange={handleModifySchedule}
                        id={schedule.id}
                        startTime={schedule.start}
                        endTime={schedule.end}
                    />
                ))}
            </div>

            <Button
                noText
                primary
                icon={addButtonIconPrimary}
                size="large"
                onClick={() =>
                    handleAddSchedule({
                        id: -1,
                        relationshipId: Number(firstRelationshipForUser?.id) || -1,
                        start: filteredSchedules.at(-1)?.end || "00:00:00",
                        end: filteredSchedules.at(-1)?.end || "00:00:00",
                        date: selectedDate,
                    })
                }
                fillWidth
            />
        </div>
    );
};

export default Schedule;
