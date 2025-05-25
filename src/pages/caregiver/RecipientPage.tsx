import styles from "./RecipientPage.module.scss";
import React, { useState } from "react";
import useNavigation from "../../hooks/useNavigation";
import UserProfile from "../UserProfile";
import ButtonGroup from "../../components/ButtonGroup";
import DateCard from "../../components/DateCard";
import { useCaregiverModel } from "../../hooks/useCaregiverModel";
import TodoList from "./TodoList";
import useQueryData from "../../hooks/useQueryData";
import { NewSubTypeData, PopupActionResult, Recipient } from "../../types";
import { Button } from "../../components/Button";
import plusButton from "../../assets/add-button-icon-secondary.svg";
import usePopup from "../../hooks/usePopup";
import { getDefaultErrorModal, getDefaultSuccessModal } from "../../utils";
import TextArea from "../../components/TextArea";
import NewSubTaskFormRow from "../../components/popup-contents/NewSubTaskFormRow";

interface RecipientPageProps {
    recipient: Recipient;
}

const RecipientPage: React.FC<RecipientPageProps> = ({ recipient }) => {
    const [menu, setMenu] = useState<string>("Adatok");
    const { removeLastPageFromStack } = useNavigation();
    const { recipients, taskTypes, subTasks } = useCaregiverModel();
    const [note, setNote] = useState<string>(recipient.caregiverNote);
    const { getLogsForRecipient, getTaskIdByName } = useQueryData();
    const logsForRecipient = getLogsForRecipient(recipient);
    const { openPopup, closePopup } = usePopup();
    const [newTask, setNewTask] = useState<NewSubTypeData | null>(null);

    const handleNoteSave = (): string | null => {
        let errorMessage = null;

        const options = {
            onError: (error: any) => {
                errorMessage = error.message;
            },
        };

        recipients.edit(
            {
                id: recipient.id,
                requestBody: {
                    ...recipient,
                    four_hand_care_needed: recipient.fourHandCareNeeded,
                    caregiver_note: note,
                },
            },
            options,
        );

        return errorMessage;
    };

    const handleAddSubTask = () => {
        let localTask: NewSubTypeData | null = null;

        openPopup({
            title: "Új Teendő hozzáadása",
            confirmButtonText: "Hozzáadás",
            content: (
                <NewSubTaskFormRow
                    onChange={(task) => {
                        localTask = task;
                    }}
                    taskOptions={taskTypes.info ? taskTypes.info.map((task) => task.name || "") : []}
                />
            ),
            onConfirm: (): Promise<PopupActionResult> => {
                if (!localTask || !localTask.name || !localTask.task) {
                    return Promise.resolve({
                        ok: false,
                        message: "",
                        quitUpdate: true,
                    });
                }

                return new Promise<PopupActionResult>((resolve) => {
                    subTasks.add(
                        {
                            requestBody: {
                                title: localTask!.name,
                                taskTypeId: getTaskIdByName(localTask!.task) ?? -1,
                            },
                        },
                        {
                            onSuccess: () => {
                                resolve({
                                    ok: true,
                                    message: "Teendő sikeresen hozzáadva.",
                                    quitUpdate: false,
                                });
                            },
                            onError: (error: any) => {
                                resolve({
                                    ok: false,
                                    message: error?.message || "Sikertelen teendő hozzáadás.",
                                    quitUpdate: false,
                                });
                            },
                        },
                    );
                });
            },
            onCancel: () => {},
        });
    };

    return (
        <UserProfile userName={recipient.name} backButtonOnClick={removeLastPageFromStack}>
            <ButtonGroup menus={["Adatok", "Naplók", "Jegyzetek"]} onChange={setMenu} />

            {menu === "Adatok" && (
                <div className={styles.dataContainer}>
                    <div className={styles.form}>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Cím</div>
                            {recipient.address}
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Telefon</div>
                            {recipient.phone}
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Email</div>
                            {recipient.email}
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Négykezes gondozás</div>
                            {recipient.fourHandCareNeeded ? "Igen" : "Nem"}
                        </div>
                    </div>
                </div>
            )}

            {menu === "Naplók" && (
                <div className={styles.logContainer}>
                    {logsForRecipient?.map((log, index) => (
                        <DateCard
                            key={index}
                            date={log.date}
                            onClick={() => {
                                // Handle date card click
                            }}
                        />
                    ))}
                </div>
            )}

            {menu === "Jegyzetek" && (
                <div className={styles.infoContainer}>
                    <div className={styles.title}>Általános Jegyzet</div>
                    <TextArea text={note} onChange={setNote} fillWidth={true} />
                    <div />
                    <Button
                        primary
                        size="large"
                        label="Jegyzet mentése"
                        onClick={() => {
                            const error = handleNoteSave();
                            if (error) {
                                openPopup(
                                    getDefaultErrorModal(
                                        "Sikertelen módosítás",
                                        "A jegyzet módosítása sikertelen volt. A teendők mentésére ezért nem került sor.",
                                        closePopup,
                                    ),
                                );
                            }

                            openPopup(
                                getDefaultSuccessModal(
                                    "Sikeres módosítás",
                                    "A jegyzet módosítása sikertelen volt.",
                                    closePopup,
                                ),
                            );
                            /* openPopup({
                                 title: "Új Jelszó megadása",
                                 confirmButtonText: "Mentés",
                                 content: <NewPasswordForm onChange={setLatestPasswords} />,
                                 onConfirm: handlePasswordSet,
                                 onCancel: () => {},
                             });*/
                        }}
                        fillWidth={true}
                    />
                    <div className={styles.spacer} />
                    <div className={styles.title}>Teendők</div>
                    <TodoList
                        dropdownOptions={taskTypes?.info?.map((type) => type.name) || []}
                        items={subTasks.info || []}
                    />
                    <Button
                        primary={false}
                        size="large"
                        noText
                        icon={plusButton}
                        onClick={handleAddSubTask}
                        fillWidth={true}
                    />
                </div>
            )}
        </UserProfile>
    );
};

export default RecipientPage;
