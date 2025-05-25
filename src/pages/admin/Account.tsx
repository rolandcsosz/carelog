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
import { Admin, Caregiver, FetchResponse, NewPasswordData, PopupActionResult } from "../../types";
import {
    getDefaultErrorModal,
    getDefaultSuccessModal,
    getErrorMessageFromAny,
    isErrorMessageInResponse,
} from "../../utils";

const Account: React.FC = () => {
    const { request } = useApi();
    const { logout, user } = useAuth();
    const { openPopup, closePopup } = usePopup();
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

    const handleDataUpdate = () => {
        if (!logedInUser || email === "" || (user?.role === "caregiver" && phone === "")) {
            openPopup(
                getDefaultErrorModal("Sikertelen módosítás", "Töltse ki az összes mezőt megfelelően.", closePopup),
            );
        }

        const options = {
            onSuccess: () => {
                openPopup(
                    getDefaultSuccessModal(
                        "Sikeres módosítás",
                        "A felhasználói adatok sikeresen frissítve.",
                        closePopup,
                    ),
                );
            },
            onError: (error: any) => {
                openPopup(getDefaultErrorModal("Sikertelen módosítás", error.message, closePopup));
            },
        };

        if (user?.role === "admin") {
            const updatedUser: PutAdminsByIdData = {
                id: Number(logedInUser?.id) ?? -1,
                requestBody: {
                    name: logedInUser?.name ?? "",
                    email,
                },
            };
            adminUser.update(updatedUser, options);
        } else if (user?.role === "caregiver") {
            const updatedUser: PutCaregiversByIdData = {
                id: Number(logedInUser?.id) ?? -1,
                requestBody: {
                    name: logedInUser?.name ?? "",
                    email,
                    phone: phone ?? "",
                },
            };
            caregiverUser.update(updatedUser, options);
        }
    };

    useEffect(() => {
        setEmail(user?.role === "admin" ? (adminUser.info?.email ?? "") : (caregiverUser.info?.email ?? ""));
        setPhone(caregiverUser.info?.phone ?? "");
    }, [logedInUser, user?.role]);

    const handlePasswordSet = async (): Promise<PopupActionResult> => {
        if (
            !latestPasswords.current ||
            !logedInUser ||
            !user ||
            latestPasswords.current.old === "" ||
            latestPasswords.current.new === ""
        ) {
            return { ok: false, message: "", quitUpdate: true };
        }

        let result: FetchResponse<null> | undefined;
        if (user?.role === "admin") {
            result = await adminUser.setPassword(request, {
                id: Number(logedInUser?.id) ?? -1,
                requestBody: {
                    currentPassword: latestPasswords.current.old ?? "",
                    newPassword: latestPasswords.current.new ?? "",
                },
            });
        } else if (user?.role === "caregiver") {
            result = await caregiverUser.setPassword(request, {
                id: Number(logedInUser?.id) ?? -1,
                requestBody: {
                    currentPassword: latestPasswords.current.old ?? "",
                    newPassword: latestPasswords.current.new ?? "",
                },
            });
        }

        if (!result || !result.ok) {
            return { ok: false, message: result?.error || "Ismeretlen hiba történt.", quitUpdate: false };
        }

        return { ok: true, message: "Jelszó sikeresen frissítve.", quitUpdate: false };
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
                        label="Adatok mentése"
                        onClick={handleDataUpdate}
                        fillWidth={true}
                    />
                    <Button
                        primary={false}
                        size="large"
                        label="Új jelszó beállítása"
                        onClick={() => {
                            openPopup({
                                title: "Új Jelszó megadása",
                                confirmButtonText: "Mentés",
                                content: <NewPasswordForm onChange={setLatestPasswords} />,
                                onConfirm: handlePasswordSet,
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
