import React from "react";
import styles from "./LogClosedSheet.module.scss";
import { Button } from "./Button";

interface LogClosedSheetProps {
    name: string;
    date: string;
    onOpen?: () => void;
}

const LogClosedSheet: React.FC<LogClosedSheetProps> = ({ name, date, onOpen = () => {} }) => {
    return (
        <div className={styles.container}>
            <div className={styles.text}>
                {name} - {date}
            </div>
            <Button primary size="small" label="Folytatás" onClick={onOpen} />
        </div>
    );
};

export default LogClosedSheet;
