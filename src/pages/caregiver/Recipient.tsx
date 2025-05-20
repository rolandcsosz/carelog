import styles from "./Recipient.module.scss";
import React, { useEffect, useState } from "react";
import { useNavigation } from "../../context/navigationContext";
import UserProfile from "../UserProfile";
import ButtonGroup from "../../components/ButtonGroup";
import TextInput from "../../components/TextInput";
import DateCard from "../../components/DateCard";
import { useCaregiverModel } from "../../hooks/useCaregiverModel";
import DragAndDrop from "./DragAndDrop";

interface RecipientsProps {
    recipient: Recipient;
}

const Recipients: React.FC<RecipientsProps> = ({ recipient }) => {
    const [menu, setMenu] = useState<string>("Adatok");
    const { removeLastPageFromStack } = useNavigation();
    const { relationships, logs, recipients } = useCaregiverModel();
    const [note, setNote] = useState<string>(recipient.caregiver_note);
    const logsForRecipient = logs.info?.filter((log) =>
        relationships.info?.some(
            (relationship) => relationship.id === log.relationshipId && relationship.recipientId === recipient.id,
        ),
    );

    useEffect(() => {
        if (!note) {
            return;
        }

        recipients.edit({
            id: recipient.id,
            requestBody: {
                ...recipient,
                caregiver_note: note,
            },
        });
    }, [note]);

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
                            {recipient.four_hand_care_needed ? "Igen" : "Nem"}
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
                    <TextInput text={recipient.caregiver_note} onChange={setNote} fillWidth={true} height={100} />
                    <div className={styles.spacer} />
                    <div className={styles.title}>Teendők</div>
                    <DragAndDrop />
                </div>
            )}
        </UserProfile>
    );
};

export default Recipients;
