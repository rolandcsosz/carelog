import styles from "./Account.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../components/Button";
import TextInput from "../../components/TextInput";
import UserProfile from "../UserProfile";
import { useAuth } from "../../hooks/useAuth";
import { useAdminModel } from "../../hooks/useAdminModel";
import usePopup from "../../hooks/usePopup";
import NewPasswordForm from "../../components/NewPasswordForm";
import { useApi } from "../../hooks/useApi";
import { putAdminsByIdPassword, putCaregiversByIdPassword } from "../../../api/sdk.gen";
import {
    PutAdminsByIdData,
    PutAdminsByIdPasswordData,
    PutAdminsByIdPasswordResponse,
    PutCaregiversByIdData,
    PutCaregiversByIdPasswordData,
    PutCaregiversByIdPasswordResponse,
} from "../../../api/types.gen";
import { useCaregiverModel } from "../../hooks/useCaregiverModel";

const Account: React.FC = () => {
    const { request } = useApi();
    const { logout, user } = useAuth();
    const { openPopup } = usePopup();
    const { user: adminUser } = useAdminModel();
    const { user: caregiverUser } = useCaregiverModel();
    const logedInUser: Admin | Caregiver | null =
        user?.role === "admin" ? (adminUser.info ?? null) : (caregiverUser.info ?? null);
    const [email, setEmail] = useState<string>(
        user?.role === "admin" ? (adminUser.info?.email ?? "") : (caregiverUser.info?.email ?? ""),
    );
    const [phone, setPhone] = useState<string>(caregiverUser.info?.phone ?? "");
    const latestPasswords = useRef<NewPasswordData | null>(null);

    const setLatestPasswords = (passwords: NewPasswordData) => {
        latestPasswords.current = passwords;
    };

    const handleLogout = () => {
        setEmail("");
        setPhone("");
        latestPasswords.current = null;
        logout();
    };

    useEffect(() => {
        if (!logedInUser || email === "" || (user?.role === "caregiver" && phone === "")) return;

        if (user?.role === "admin") {
            const updatedUser: PutAdminsByIdData = {
                id: Number(logedInUser.id) ?? -1,
                requestBody: {
                    name: logedInUser.name ?? "",
                    email,
                },
            };
            adminUser.update(updatedUser);
        } else if (user?.role === "caregiver") {
            const updatedUser: PutCaregiversByIdData = {
                id: Number(logedInUser.id) ?? -1,
                requestBody: {
                    name: logedInUser.name ?? "",
                    email,
                    phone: phone ?? "",
                },
            };
            caregiverUser.update(updatedUser);
        }
    }, [email, logedInUser, phone]);

    useEffect(() => {
        setEmail(user?.role === "admin" ? (adminUser.info?.email ?? "") : (caregiverUser.info?.email ?? ""));
        setPhone(caregiverUser.info?.phone ?? "");
    }, [logedInUser, user?.role]);

    const handleSave = async () => {
        if (!latestPasswords.current || !logedInUser || !user) return;
        if (user?.role === "admin") {
            await request<PutAdminsByIdPasswordData, PutAdminsByIdPasswordResponse>(putAdminsByIdPassword, {
                id: Number(logedInUser?.id) ?? -1,
                requestBody: {
                    currentPassword: latestPasswords.current?.old ?? "",
                    newPassword: latestPasswords.current?.new ?? "",
                },
            });
        } else if (user?.role === "caregiver") {
            await request<PutCaregiversByIdPasswordData, PutCaregiversByIdPasswordResponse>(putCaregiversByIdPassword, {
                id: Number(logedInUser?.id) ?? -1,
                requestBody: {
                    currentPassword: latestPasswords.current?.old ?? "",
                    newPassword: latestPasswords.current?.new ?? "",
                },
            });
        }
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
                    <Button primary={true} size="large" label="Kijelentkezés" onClick={handleLogout} fillWidth={true} />
                </div>
            }
        >
            <div className={styles.form}>
                <div className={styles.formRow}>
                    <div className={styles.formLabel}>Email</div>
                    <TextInput text={email} placeholder="Email" onChange={setEmail} fillWidth={true} />
                </div>
                {user?.role === "caregiver" && (
                    <div className={styles.formRow}>
                        <div className={styles.formLabel}>Telefon</div>
                        <TextInput text={phone} placeholder="Telefon" onChange={setPhone} fillWidth={true} />
                    </div>
                )}
            </div>
        </UserProfile>
    );
};

export default Account;
