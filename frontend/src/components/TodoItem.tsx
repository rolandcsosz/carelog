import React from "react";
import styles from "./TodoItem.module.scss";
import IconButton from "./IconButton";
import deleteIcon from "../assets/delete.svg";
import Dropdown from "./Dropdown";

interface TodoItemProps {
    selectedItem: string;
    options: string[];
    index: number;
    onSelectedChanged: (selected: string) => void;
    onDelete: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ selectedItem, options, onSelectedChanged, onDelete }) => {
    return (
        <div className={styles.container}>
            <div className={styles.contentRow}>
                <Dropdown selected={selectedItem} options={options} onChange={onSelectedChanged} />{" "}
                <IconButton svgContent={deleteIcon} isSmall onClick={onDelete} />
            </div>
        </div>
    );
};

export default TodoItem;
