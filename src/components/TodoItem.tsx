import React from "react";
import styles from "./TodoItem.module.scss";
import chevronRight from "../assets/chevron-right.svg";
import Avatar from "./Avatar";
import IconButton from "./IconButton";
import { IonButton } from "@ionic/react";
import dragIndicator from "../assets/drag-indicator.svg";
import deleteIcon from "../assets/delete.svg";
import Dropdown from "./Dropdown";

interface TodoItemProps {
    name: string;
    selectedItem: string;
    options: string[];
    index: number;
    onSelectedChanged?: (selected: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
    name,
    selectedItem,
    options,
    index,
    onSelectedChanged = (item: string) => {},
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.contentRow}>
                <div className={styles.text}>{name}</div>
                <Dropdown selected={selectedItem} options={options} onChange={onSelectedChanged} />
                <IconButton svgContent={deleteIcon} isSmall />
            </div>
        </div>
    );
};

export default TodoItem;
