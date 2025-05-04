import styles from "./NewPersonFormRow.module.scss";
import React, { useEffect } from "react";
import TextInput from "../TextInput";

interface NewPersonFormRowProps {
    AddressVisible?: boolean;
    onChange: (info: NewPersonData) => void;
}

const NewPersonFormRow: React.FC<NewPersonFormRowProps> = ({ onChange, AddressVisible = false }) => {
    const [name, setName] = React.useState<string>("");
    const [email, setEmail] = React.useState<string>("");
    const [phone, setPhone] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [address, setAddress] = React.useState<string>("");

    useEffect(() => {
        onChange({ name, email, phone, password, address });
    }, [name, email, phone, password, address, onChange]);

    return (
        <>
            <div className={styles.formRow}>
                <div className={styles.formLabel}>Név</div>
                <TextInput text={name} placeholder="Név" onChange={setName} fillWidth={true} />
            </div>
            <div className={styles.formRow}>
                <div className={styles.formLabel}>Email</div>
                <TextInput text={email} placeholder="Email" onChange={setEmail} fillWidth={true} />
            </div>
            <div className={styles.formRow}>
                <div className={styles.formLabel}>Telefonszám</div>
                <TextInput text={phone} type="tel" placeholder="Telefonszám" onChange={setPhone} fillWidth={true} />
            </div>
            {AddressVisible && (
                <div className={styles.formRow}>
                    <div className={styles.formLabel}>Cím</div>
                    <TextInput text={address} placeholder="Cím" onChange={setAddress} fillWidth={true} />
                </div>
            )}
            <div className={styles.formRow}>
                <div className={styles.formLabel}>Jelszó</div>
                <TextInput
                    text={password}
                    type="password"
                    placeholder="Jelszó"
                    onChange={setPassword}
                    fillWidth={true}
                />
            </div>
        </>
    );
};

export default NewPersonFormRow;
