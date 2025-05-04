import styles from "./NewPasswordForm.module.scss";
import React, { useEffect } from "react";
import TextInput from "./TextInput";

interface NewPasswordFormProps {
    onChange: (info: NewPasswordData) => void;
}

const NewPasswordForm: React.FC<NewPasswordFormProps> = ({ onChange }) => {
    const [oldPassword, setOldPassword] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");

    useEffect(() => {
        onChange({ old: oldPassword, new: password });
    }, [oldPassword, password, onChange]);

    return (
        <>
            <div className={styles.formRow}>
                <div className={styles.formLabel}>Régi Jelszó</div>
                <TextInput
                    text={oldPassword}
                    type="password"
                    placeholder="Régi Jelszó"
                    onChange={setOldPassword}
                    fillWidth={true}
                />
            </div>
            <div className={styles.formRow}>
                <div className={styles.formLabel}>Új jelszó</div>
                <TextInput
                    text={password}
                    type="password"
                    placeholder="Új jelszó"
                    onChange={setPassword}
                    fillWidth={true}
                />
            </div>
        </>
    );
};

export default NewPasswordForm;
