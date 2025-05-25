import styles from "./TodoList.module.scss";
import React from "react";
import { IonItem, IonList, IonReorder, IonReorderGroup, ItemReorderEventDetail } from "@ionic/react";
import TodoItem from "../../components/TodoItem.tsx";
import IconButton from "../../components/IconButton.tsx";
import dragIndicator from "..//../assets/drag-indicator.svg";
import { SubTask } from "../../types";
import useQueryData from "../../hooks/useQueryData.ts";

type TodoListProps = {
    dropdownOptions: string[];
    items: SubTask[];
    //onReorder?: (from: number, to: number) => void;
    //onDelete?: (index: number) => void;
    //onEdit?: (index: number, type: string) => void;
};

const TodoList: React.FC<TodoListProps> = ({
    dropdownOptions,
    items,
    //onReorder = () => {},
    //onDelete = () => {},
    //onEdit = () => {},
}) => {
    const { getTaskNameById } = useQueryData();
    function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
        //onReorder(event.detail.from, event.detail.to);
        //event.detail.complete();
    }

    return (
        <IonList
            style={{
                backgroundColor: "transparent", // Make the background transparent
                width: "100%", // Ensure the list fills the entire width
            }}
        >
            {/* The reorder gesture is disabled by default, enable it to drag and drop items */}
            <IonReorderGroup style={{ gap: "10px" }} disabled={false} onIonItemReorder={handleReorder}>
                {items.map((item) => (
                    <IonItem
                        className="no-shadow-drag"
                        style={{
                            "background-color": "transparent",
                            "box-shadow": "none",
                            opacity: "1",
                            borderRadius: "10px",
                            "--inner-padding-end": "0",
                            padding: "0",
                            margin: "0 0 10px 0",
                            border: "none",
                        }}
                    >
                        <TodoItem
                            name={item.name}
                            selectedItem={getTaskNameById(item.taskTypeId)}
                            options={dropdownOptions}
                            index={0}
                        />
                        <IonReorder
                            style={{ "background-color": "transparent", height: "50px", padding: "0", margin: "0" }}
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
