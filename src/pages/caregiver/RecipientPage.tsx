import styles from "./RecipientPage.module.scss";
import React, { useState } from "react";
import useNavigation from "../../hooks/useNavigation";
import UserProfile from "../UserProfile";
import ButtonGroup from "../../components/ButtonGroup";
import DateCard from "../../components/DateCard";
import { useCaregiverModel } from "../../hooks/useCaregiverModel";
import TodoList from "./TodoList";
import useQueryData from "../../hooks/useQueryData";
import { PopupActionResult, Recipient, Todo } from "../../types";
import { Button } from "../../components/Button";
import plusButton from "../../assets/add-button-icon-secondary.svg";
import usePopup from "../../hooks/usePopup";
import { getDefaultErrorModal, getDefaultSuccessModal } from "../../utils";
import TextArea from "../../components/TextArea";
import LogEdit from "./LogEdit";

interface RecipientPageProps {
    recipient: Recipient;
}

const moveItem = (arr: Todo[], fromIndex: number, toIndex: number): Todo[] => {
    const newArr = [...arr];
    const [item] = newArr.splice(fromIndex, 1); // remove the item at fromIndex
    newArr.splice(toIndex, 0, item); // insert the item at toIndex
    return newArr;
};

const RecipientPage: React.FC<RecipientPageProps> = ({ recipient }) => {
    const [menu, setMenu] = useState<string>("Adatok");
    const { removeLastPageFromStack, addPageToStack } = useNavigation();
    const { user, recipients, todos, subTasks, relationships } = useCaregiverModel();
    const [note, setNote] = useState<string>(recipient.caregiverNote);
    const { getLogsForRecipient } = useQueryData();
    const logsForRecipient =
        getLogsForRecipient(recipient)?.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }) || [];
    const { openPopup, closePopup } = usePopup();
    const connection = relationships.list?.find(
        (relationship) => relationship.recipientId === recipient.id && relationship.caregiverId === user.list?.id,
    );
    const localTodos =
        todos?.list
            ?.filter((todo) => !todo.relationshipId || todo.relationshipId === connection?.id)
            .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0)) || [];

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

    const handleAddTodo = () => {
        if (!connection || !subTasks.list || subTasks.list.length === 0) {
            openPopup(
                getDefaultErrorModal(
                    "Teendő hozzáadás sikertelen",
                    "Nem sikerült teendőt hozzáadni, mert nincs elérhető kapcsolat a gondozó és gondozott között vagy teendő típusok nem elérhetőek.",
                    closePopup,
                ),
            );
            return;
        }

        const maxSequenceNumber =
            localTodos && localTodos.length > 0 ? Math.max(...localTodos.map((todo) => todo.sequence ?? 0)) : 0;

        todos.add({
            requestBody: {
                done: false,
                sequenceNumber: Math.max(maxSequenceNumber + 1, 0),
                subtaskId: subTasks.list[0].id, // Default to the first subtask type
                relationshipId: connection.id,
            },
        });

        //TODO: Use this implementation when name can be added to the todo
        /*let localTask: NewSubTypeData | null = null;

        openPopup({
            title: "Új Teendő hozzáadása",
            confirmButtonText: "Hozzáadás",
            content: (
                <NewSubTaskFormRow
                    onChange={(task) => {
                        localTask = task;
                    }}
                    taskOptions={subTasks.list ? subTasks.list.map((task) => task.name || "") : []}
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
            onCancel: () => { },
        });*/
    };

    const handleReorder = async (from: number, to: number) => {
        if (localTodos && localTodos.length > 0) {
            const updatedTodos = moveItem(localTodos, from, to);

            await Promise.all(
                updatedTodos.map((todo, index) => {
                    return todos.edit(
                        {
                            id: todo.id,
                            requestBody: {
                                ...todo,
                                sequenceNumber: index + 1,
                            },
                        },
                        { onSuccess: () => {} },
                    );
                }),
            );

            todos.refetch();
        }
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
                                addPageToStack(<LogEdit log={log} />);
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
                        dropdownOptions={subTasks?.list?.map((type) => type.name) || []}
                        items={localTodos || []}
                        onEdit={(todo) => {
                            const subTask = subTasks?.list?.find((option) => option.id === todo.subtaskId);
                            if (subTask) {
                                todos.edit({
                                    id: todo.id,
                                    requestBody: {
                                        ...todo,
                                        sequenceNumber: todo.sequence ?? 0,
                                        subtaskId: subTask.id,
                                    },
                                });
                            }
                        }}
                        onDelete={(todoId) => {
                            openPopup({
                                title: "Teendő törlése",
                                confirmButtonText: "Törlés",
                                cancelButtonText: "Mégsem",
                                content: "Biztosan törölni szeretnéd ezt a teendőt?",
                                onConfirm: async (): Promise<PopupActionResult> => {
                                    await todos.delete({ id: todoId });
                                    localTodos.filter((todo) => todo.id !== todoId);
                                    return {
                                        ok: true,
                                        message: "Teendő sikeresen törölve.",
                                        quitUpdate: false,
                                    };
                                },
                                onCancel: () => {},
                            });
                        }}
                        onReorder={handleReorder}
                    />
                    <Button
                        primary={false}
                        size="large"
                        noText
                        icon={plusButton}
                        onClick={handleAddTodo}
                        fillWidth={true}
                    />
                </div>
            )}
        </UserProfile>
    );
};

export default RecipientPage;
