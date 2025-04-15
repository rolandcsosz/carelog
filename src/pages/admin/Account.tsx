import styles from "./Account.module.scss";
import React, { useState } from "react";
import { Button } from "../../components/Button";
import Avatar from "../../components/Avatar";
import TextInput from "../../components/TextInput";

const Account: React.FC = () => {
    const [phone, setPhone] = useState<string>("+36301234567");
    const [email, setEmail] = useState<string>("hello@vmi.com");
    const [password, setPassword] = useState<string>("jelszó");

    return (
        <div className={styles.page}>
            <div className={styles.pageContent}>
                <div className={styles.profileHeader}>
                    <Avatar userName="Saját Oldal" size="large" />
                    <div className={styles.profileHeaderText}>Saját Oldal</div>
                </div>
                <div className={styles.spacer} />
                <div className={styles.form}>
                    <div className={styles.formRow}>
                        <div className={styles.formLabel}>Telefon</div>
                        <TextInput text={phone} placeholder="+36301234567" onChange={setPhone} fillWidth={true} />
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formLabel}>Email</div>
                        <TextInput text={email} placeholder="hello@vmi.com" onChange={setEmail} fillWidth={true} />
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formLabel}>Jelszó</div>
                        <TextInput text={password} placeholder="jelszó" onChange={setPassword} fillWidth={true} />
                    </div>
                </div>
            </div>

            <Button primary={true} size="large" label="Kijelentkezés" onClick={() => {}} fillWidth={true} />
        </div>
    );
};

export default Account;
