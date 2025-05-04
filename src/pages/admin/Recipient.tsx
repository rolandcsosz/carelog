import styles from "./Recipient.module.scss";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { useNavigation } from "../../context/navigationContext";
import UserProfile from "../UserProfile";
import ButtonGroup from "../../components/ButtonGroup";
import TextInput from "../../components/TextInput";
import Dropdown from "../../components/Dropdown";
import Switch from "../../components/Switch";
import Calendar from "../../components/Calendar";
import { useAdminModel } from "../../hooks/useAdminModel";

interface RecipientsProps {
    recipient: Recipient;
}

const Recipients: React.FC<RecipientsProps> = ({ recipient }) => {
    const [menu, setMenu] = useState<string>("Adatok");
    const { removeLastPageFromStack } = useNavigation();
    const [name] = useState<string>(recipient.name);
    const [phone, setPhone] = useState<string>(recipient.phone);
    const [email, setEmail] = useState<string>(recipient.email);
    const [address, setAddress] = useState<string>(recipient.address);
    const [replacement, setReplacement] = useState<boolean>(false);
    const { editRecipient, deleteRecipient } = useAdminModel();

    useEffect(() => {
        editRecipient({
            id: recipient.id,
            requestBody: {
                name,
                email,
                phone,
                address,
                four_hand_care_needed: recipient.four_hand_care_needed,
                caregiver_note: recipient.caregiver_note,
            },
        });
    }, [name, phone, email, address]);

    const handleDeleteRecipient = () => {
        deleteRecipient({ id: recipient.id });
        removeLastPageFromStack();
    };

    return (
        <UserProfile userName={name} backButtonOnClick={removeLastPageFromStack}>
            <ButtonGroup menus={["Adatok", "Beosztás"]} onChange={setMenu} />

            {menu === "Adatok" && (
                <div className={styles.dataContainer}>
                    <div className={styles.form}>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Gondozó</div>
                            <Dropdown
                                selected={"Gondozó 1"}
                                options={["Gondozó 1", "Gondozó 2", "Gondozó 3"]}
                                onChange={() => {}}
                                fillWidth={true}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Helyettesítés</div>
                            <Switch initialState={replacement} onToggle={setReplacement} />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Helyettes gondozó</div>
                            <Dropdown
                                selected={"Gondozó 2"}
                                disabled={!replacement}
                                options={["Gondozó 1", "Gondozó 2", "Gondozó 3"]}
                                onChange={() => {}}
                                fillWidth={true}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Telefon</div>
                            <TextInput text={phone} placeholder="Telefonszám" onChange={setPhone} fillWidth={true} />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Cím</div>
                            <TextInput text={address} placeholder="Cím" onChange={setAddress} fillWidth={true} />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Email</div>
                            <TextInput text={email} placeholder="Email" onChange={setEmail} fillWidth={true} />
                        </div>
                    </div>
                    <Button
                        primary={true}
                        size="large"
                        label="Eltávolítás"
                        onClick={handleDeleteRecipient}
                        fillWidth={true}
                    />
                </div>
            )}

            {menu === "Beosztás" && (
                <div className={styles.calendarContainer}>
                    <Calendar />
                </div>
            )}
        </UserProfile>
    );
};

export default Recipients;
