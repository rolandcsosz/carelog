import styles from "./Back.module.scss";
import React from "react";
import { Button } from "../../components/Button";
import { useNavigation } from "../../context/navigationContext";

const Back: React.FC = () => {
    const { addPageToStack, removeLastPageFromStack } = useNavigation();

    return (
        <div className={styles.page}>
            <Button
                primary={true}
                size="large"
                label="Vissza"
                onClick={() => {
                    removeLastPageFromStack();
                }}
                fillWidth={true}
            />
            <Button
                primary={true}
                size="large"
                label="Új"
                onClick={() => {
                    addPageToStack(<Back />);
                }}
                fillWidth={true}
            />
        </div>
    );
};

export default Back;
