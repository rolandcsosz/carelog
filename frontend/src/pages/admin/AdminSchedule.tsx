import React, { useEffect, useState } from "react";
import styles from "./AdminSchedule.module.scss";
import { Button } from "../../components/Button";
import Calendar from "../../components/Calendar";
import ScheduleCard from "../../components/ScheduleCard";
import { useAdminModel } from "../../hooks/useAdminModel";
import { useApi } from "../../hooks/useApi";
import { compareTime, convertToGlobalUTC, getDateString } from "../../utils";
import addButtonIconPrimary from "../../assets/add-button-icon-primary.svg";
import { NewScheduleData } from "../../types";
import { RecipientCaregiverRelationship, Schedule } from "../../../api/types.gen";

interface AdminScheduleProps {
    userId: string;
    caregiverIds?: string[];
    recipientIds?: string[];
}

type AdminScheduleMode = "caregiver" | "recipient" | null;

const AdminSchedule: React.FC<AdminScheduleProps> = ({ userId, caregiverIds, recipientIds }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [fetchedSchedules, setFetchedSchedules] = useState<Schedule[]>([]);
    const { request } = useApi();
    const { caregivers, relationships, recipients, schedules } = useAdminModel();

    const userMode: AdminScheduleMode =
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
                setFetchedSchedules(response.sort((a, b) => compareTime(a.startTime, b.startTime)));
            } else if (userMode === "recipient") {
                const response = await schedules.fetchForRecipient(request, userId);
                setFetchedSchedules(response.sort((a, b) => compareTime(a.startTime, b.startTime)));
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
                relationshipId: schedule.relationshipId,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                date: schedule.date,
            },
        });

        if (response) {
            refetchSchedules();
        }
    };

    /*const handleDeleteSchedule = async (id: number) => { //TODO: implement delete schedule
        const response = await schedules.delete(request, {
            id: id,
        });

        if (response) {
            refetchSchedules();
        }
    };*/

    const handleModifySchedule = async (schedule: NewScheduleData) => {
        if (!schedule.selectedOption) {
            return;
        }

        let connection: RecipientCaregiverRelationship | undefined = undefined;

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

        const response = await schedules.edit(request, {
            id: schedule.id,
            requestBody: {
                relationshipId: connection.id,
                startTime: schedule.start,
                endTime: schedule.end,
                date: selectedDate.toISOString(),
            },
        });

        if (response) {
            setFetchedSchedules((prev) =>
                prev.map((s) =>
                    s.id === schedule.id ?
                        {
                            ...s,
                            startTime: schedule.start,
                            endTime: schedule.end,
                            date: selectedDate.toISOString(),
                            relationshipId: connection.id,
                        }
                    :   s,
                ),
            );
        }
    };

    const filteredSchedules = fetchedSchedules.filter(
        (schedule) => selectedDate && convertToGlobalUTC(new Date(schedule.date)) === convertToGlobalUTC(selectedDate),
    );

    const dropdownOptions =
        userMode === "caregiver" ?
            recipients.list?.filter((r) => filteredIds?.includes(r.id)).map((r) => r.name)
        :   caregivers.list?.filter((c) => filteredIds?.includes(c.id)).map((c) => c.name);

    const getNameByIdRelationship = React.useCallback(
        (id: string): string => {
            const relationship = relationships.list?.find((r) => r.id === id);

            if (!relationship) {
                return "";
            }

            if (userMode === "caregiver") {
                return recipients.list?.find((r) => r.id === relationship?.recipientId)?.name || "";
            } else if (userMode === "recipient") {
                return caregivers.list?.find((c) => c.id === relationship?.caregiverId)?.name || "";
            }

            return "";
        },
        [relationships.list, recipients.list, caregivers.list, userMode],
    );

    return (
        <div className={styles.calendarContainer}>
            <Calendar
                onDateChange={handleDateChange}
                highlightedDates={fetchedSchedules.map((schedule) => new Date(schedule.date))}
            />

            <div className={styles.title}>{selectedDate ? getDateString(selectedDate) : getDateString(new Date())}</div>

            <div className={styles.scheduleContainer}>
                {filteredSchedules.map((schedule, idx, arr) => {
                    const prevEndTime = idx > 0 ? arr[idx - 1].endTime : undefined;
                    const startTimeInvalid = prevEndTime ? compareTime(schedule.startTime, prevEndTime) < 0 : false;
                    return (
                        <ScheduleCard
                            key={`schedule-card${schedule.id}`}
                            title={userMode === "caregiver" ? "Gondozott" : "Gondozó"}
                            selectedOption={getNameByIdRelationship(schedule.relationshipId)}
                            options={dropdownOptions}
                            dropDownDisabled={userMode === "recipient"}
                            onChange={handleModifySchedule}
                            id={schedule.id}
                            startTime={schedule.startTime}
                            endTime={schedule.endTime}
                            startTimeInvalid={startTimeInvalid}
                        />
                    );
                })}
            </div>

            <Button size="large" label="Újra rendezés" onClick={refetchSchedules} fillWidth />

            <Button
                noText
                primary
                icon={addButtonIconPrimary}
                size="large"
                onClick={() => {
                    if (!firstRelationshipForUser?.id) return;
                    handleAddSchedule({
                        id: "",
                        relationshipId: firstRelationshipForUser?.id || "",
                        startTime: filteredSchedules.at(-1)?.endTime || "00:00:00",
                        endTime: filteredSchedules.at(-1)?.endTime || "00:00:00",
                        date: selectedDate.toISOString(),
                    });
                }}
                fillWidth
            />
        </div>
    );
};

export default AdminSchedule;
