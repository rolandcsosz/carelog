import styles from "./Account.module.scss";
import React, { useState } from "react";
import { Button } from "../../components/Button";
import TextInput from "../../components/TextInput";
import UserProfile from "../shared/UserProfile";

const Account: React.FC = () => {
    const [phone, setPhone] = useState<string>("+36301234567");
    const [email, setEmail] = useState<string>("hello@vmi.com");
    const [password, setPassword] = useState<string>("jelszó");

    return (
        <UserProfile
            userName="Varga Mihály"
            backButtonHidden
            additionalComponent={
                <Button primary={true} size="large" label="Kijelentkezés" onClick={() => {}} fillWidth={true} />
            }
        >
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
        </UserProfile>
    );
};

export default Account;
