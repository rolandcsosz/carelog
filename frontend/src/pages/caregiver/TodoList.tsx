import styles from "./TodoList.module.scss";
import React from "react";
import { IonItem, IonList, IonReorder, IonReorderGroup, ItemReorderEventDetail } from "@ionic/react";
import TodoItem from "../../components/TodoItem.tsx";
import IconButton from "../../components/IconButton.tsx";
import dragIndicator from "..//../assets/drag-indicator.svg";
import { Id, Todo } from "../../types";
import useQueryData from "../../hooks/useQueryData.ts";
import { useCaregiverModel } from "../../hooks/useCaregiverModel.ts";

type TodoListProps = {
    dropdownOptions: string[];
    items: Todo[];
    onReorder: (from: number, to: number) => void;
    onDelete: (id: Id) => void;
    onEdit: (edited: Todo) => void;
};

const TodoList: React.FC<TodoListProps> = ({ dropdownOptions, items, onReorder, onDelete, onEdit }) => {
    const { getTaskNameById } = useQueryData();
    const { subTasks } = useCaregiverModel();

    const handleReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
        onReorder(event.detail.from, event.detail.to);
        event.detail.complete();
    };

    return (
        <IonList
            style={{
                backgroundColor: "transparent",
                width: "100%",
            }}
        >
            <IonReorderGroup style={{ gap: "10px" }} disabled={false} onIonItemReorder={handleReorder}>
                {items.map((item) => (
                    <IonItem
                        key={"todo-item-" + item.id}
                        className="no-shadow-drag"
                        style={{
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            opacity: "1",
                            borderRadius: "10px",
                            "--inner-padding-end": "0",
                            padding: "0",
                            margin: "0 0 10px 0",
                            border: "none",
                        }}
                    >
                        <TodoItem
                            //name={item.name} //TODO: add name for todo later
                            selectedItem={getTaskNameById(item.subtaskId)}
                            options={dropdownOptions}
                            index={0}
                            onSelectedChanged={(selected) => {
                                const subTask = subTasks?.list?.find((option) => option.name === selected);

                                if (subTask) {
                                    onEdit({
                                        ...item,
                                        subtaskId: subTask.id,
                                    });
                                }
                            }}
                            onDelete={() => onDelete(item.id)}
                        />
                        <IonReorder
                            style={{ backgroundColor: "transparent", height: "50px", padding: "0", margin: "0" }}
                            slot="start"
                        >
                            <div className={styles.drag}>
                                <IconButton svgContent={dragIndicator} isSmall />
                            </div>
                        </IonReorder>
                    </IonItem>
                ))}
            </IonReorderGroup>
        </IonList>
    );
};

export default TodoList;
