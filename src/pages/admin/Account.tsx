import styles from "./Account.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../components/Button";
import TextInput from "../../components/TextInput";
import UserProfile from "../UserProfile";
import { useAuth } from "../../hooks/useAuth";
import { useAdminModel } from "../../hooks/useAdminModel";
import { usePopup } from "../../context/popupContext";
import NewPasswordForm from "../../components/NewPasswordForm";
import { useApi } from "../../hooks/useApi";
import { putAdminsByIdPassword } from "../../../api/sdk.gen";
import { PutAdminsByIdPasswordData, PutAdminsByIdPasswordResponse } from "../../../api/types.gen";

const Account: React.FC = () => {
    const { request } = useApi();
    const { logout } = useAuth();
    const { openPopup } = usePopup();
    const { logedInUser, updateLogedInUser } = useAdminModel();
    const [email, setEmail] = useState<string>(logedInUser?.email ?? "");
    const latestPasswords = useRef<NewPasswordData | null>(null);

    const setLatestPasswords = (passwords: NewPasswordData) => {
        latestPasswords.current = passwords;
    };

    useEffect(() => {
        updateLogedInUser({
            id: logedInUser?.id ?? -1,
            requestBody: {
                name: logedInUser?.name ?? "",
                email: email,
            },
        });
    }, [email]);

    const handleSave = async () => {
        await request<PutAdminsByIdPasswordData, PutAdminsByIdPasswordResponse>(putAdminsByIdPassword, {
            id: logedInUser?.id ?? -1,
            requestBody: {
                currentPassword: latestPasswords.current?.old ?? "",
                newPassword: latestPasswords.current?.new ?? "",
            },
        });
    };

    return (
        <UserProfile
            userName={logedInUser?.name ?? ""}
            backButtonHidden
            additionalComponent={
                <div className={styles.buttonContainer}>
                    <Button
                        primary={false}
                        size="large"
                        label="Új jelszó"
                        onClick={() => {
                            openPopup({
                                title: "Új Jelszó megadása",
                                confirmButtonText: "Mentés",
                                content: <NewPasswordForm onChange={setLatestPasswords} />,
                                onConfirm: handleSave,
                                onCancel: () => {},
                            });
                        }}
                        fillWidth={true}
                    />
                    <Button primary={true} size="large" label="Kijelentkezés" onClick={logout} fillWidth={true} />
                </div>
            }
        >
            <div className={styles.form}>
                <div className={styles.formRow}>
                    <div className={styles.formLabel}>Email</div>
                    <TextInput text={email} placeholder="Email" onChange={setEmail} fillWidth={true} />
                </div>
            </div>
        </UserProfile>
    );
};

export default Account;
