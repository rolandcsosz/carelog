import * as React from "react";
import styles from "./TimeTableRow.module.scss";
import chevronRight from "../assets/chevron-right.svg";
import doneTick from "../assets/done-tick.svg";
import error from "../assets/error.svg";
import newLog from "../assets/new-log.svg";
import Avatar from "./Avatar";
import IconButton from "./IconButton";

interface RecipientCardProps {
    start: string;
    end: string;
    userName: string;
    address: string;
    type: "done" | "notEditable" | "new" | "error";
    onOpen?: () => void;
    onNewLog?: () => void;
}
const getTypeIcon = (type: string) => {
    switch (type) {
        case "done":
            return doneTick;
        case "notEditable":
            return null;
        case "new":
            return newLog;
        case "error":
            return error;
        default:
            return doneTick;
    }
};

const trimTime = (time: string) => {
    if (time.length > 5) {
        return time.slice(0, 5);
    }
    return time;
};

const TimeTableRow: React.FC<RecipientCardProps> = ({
    start,
    end,
    userName,
    address,
    type,
    onOpen = () => {},
    onNewLog = () => {},
}) => {
    return (
        <div className={styles.row}>
            <div className={styles.timeColumn}>
                <div className={styles.startTime}>{trimTime(start)}</div>
                <div className={styles.endTime}>{trimTime(end)}</div>
            </div>
            <div className={styles.divider} />
            <div className={styles.homecard}>
                <div className={styles.homecardcontainer}>
                    <div className={styles.iconrow}>
                        <Avatar userName={userName} size="small" />
                        <div className={styles.name} onClick={onOpen}>
                            {userName}
                        </div>
                        <IconButton svgContent={chevronRight} ariaLabel="Select user" onClick={onOpen} isSmall={true} />
                        <div className={styles.spacer} />
                        <IconButton
                            svgContent={getTypeIcon(type)}
                            ariaLabel="Select user"
                            onClick={() => {
                                if (type === "new") {
                                    onNewLog();
                                }
                            }}
                            isSmall={true}
                        />
                    </div>
                    <div className={styles.detailsrow}>{address}</div>
                </div>
            </div>
        </div>
    );
};

export default TimeTableRow;
