import React from "react";
import styles from "./TodoItem.module.scss";
import IconButton from "./IconButton";
import deleteIcon from "../assets/delete.svg";
import Dropdown from "./Dropdown";

interface TodoItemProps {
    // name: string;
    selectedItem: string;
    options: string[];
    index: number;
    onSelectedChanged?: (selected: string) => void;
    onDelete?: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
    //name,
    selectedItem,
    options,
    index,
    onSelectedChanged = (item: string) => {
        void item;
    }, // TODO

    onDelete = () => {},
}) => {
    void onSelectedChanged; //TODO
    void index; //TODO
    return (
        <div className={styles.container}>
            <div className={styles.contentRow}>
                {/* TODO: add name for todo later, <div className={styles.text}>{name}</div>*/}
                <Dropdown selected={selectedItem} options={options} onChange={onSelectedChanged} />{" "}
                {/* TODO: remove disabled*/}
                <IconButton svgContent={deleteIcon} isSmall onClick={onDelete} />
            </div>
        </div>
    );
};

export default TodoItem;
