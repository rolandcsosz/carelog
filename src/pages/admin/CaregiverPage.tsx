import styles from "./CaregiverPage.module.scss";
import React, { useState } from "react";
import { Button } from "../../components/Button";
import useNavigation from "../../hooks/useNavigation";
import UserProfile from "../UserProfile";
import ButtonGroup from "../../components/ButtonGroup";
import TextInput from "../../components/TextInput";
import { useAdminModel } from "../../hooks/useAdminModel";
import PersonCard from "../../components/PersonCard";
import RecipientPage from "./RecipientPage";
import AdminSchedule from "./AdminSchedule";
import { Caregiver, PopupActionResult } from "../../types";
import usePopup from "../../hooks/usePopup";
import { getDefaultErrorModal, getDefaultSuccessModal } from "../../utils";

interface CaregiverPageProps {
    caregiver: Caregiver;
}

const CaregiverPage: React.FC<CaregiverPageProps> = ({ caregiver }) => {
    const [menu, setMenu] = useState<string>("Adatok");
    const { addPageToStack, removeLastPageFromStack } = useNavigation();
    const [name] = useState<string>(caregiver.name);
    const [phone, setPhone] = useState<string>(caregiver.phone);
    const [email, setEmail] = useState<string>(caregiver.email);
    const { relationships, recipients, caregivers } = useAdminModel();
    const { openPopup, closePopup } = usePopup();

    const recipientIds = recipients.list
        ?.filter((recipient) =>
            relationships.list?.some(
                (relationship) =>
                    relationship.recipientId === recipient.id && relationship.caregiverId === caregiver.id,
            ),
        )
        .map((recipient) => recipient.id);

    const handleDelete = (): Promise<PopupActionResult> => {
        return new Promise<PopupActionResult>((resolve) => {
            caregivers.delete(
                { id: Number(caregiver.id) },
                {
                    onSuccess: () => {
                        resolve({
                            ok: true,
                            message: "Gondozó sikeresen eltávolítva",
                            quitUpdate: false,
                        });
                        removeLastPageFromStack();
                    },
                    onError: (error: any) => {
                        resolve({
                            ok: false,
                            message: error.message || "Ismeretlen hiba történt.",
                            quitUpdate: false,
                        });
                    },
                },
            );
        });
    };

    const handleDeleteRequest = () => {
        openPopup({
            content: <div className={styles.label}>Biztosan eltávolítod ezt a gondozót?</div>,
            title: "Eltávolítás megerősítése",
            confirmButtonText: "Eltávolítás",
            cancelButtonText: "Mégsem",
            confirmOnly: false,
            onConfirm: handleDelete,
            onCancel: closePopup,
        });
    };

    const handleEdit = () => {
        if (!name || !phone || !email) {
            openPopup(getDefaultErrorModal("Sikertelen módosítás", "Kérjük, töltsd ki az összes mezőt.", closePopup));
            return;
        }

        caregivers.edit(
            {
                id: Number(caregiver.id),
                requestBody: {
                    name,
                    phone,
                    email,
                },
            },
            {
                onSuccess: () => {
                    openPopup(
                        getDefaultSuccessModal(
                            "Sikeres módosítás",
                            "A gondozó adatai sikeresen frissítve lettek.",
                            closePopup,
                        ),
                    );
                },
                onError: (error: any) => {
                    openPopup(getDefaultErrorModal("Sikertelen módosítás", error.message, closePopup));
                },
            },
        );
    };

    return (
        <UserProfile userName={name} backButtonOnClick={removeLastPageFromStack}>
            <ButtonGroup menus={["Adatok", "Gondozottak", "Beosztás"]} onChange={setMenu} />

            {menu === "Adatok" && (
                <div className={styles.dataContainer}>
                    <div className={styles.form}>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Telefon</div>
                            <TextInput text={phone} placeholder="Telefonszám" onChange={setPhone} fillWidth={true} />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Email</div>
                            <TextInput text={email} placeholder="Email" onChange={setEmail} fillWidth={true} />
                        </div>
                    </div>
                    <div className={styles.dataSpacer} />
                    <div className={styles.buttonContainer}>
                        <Button
                            primary={false}
                            size="large"
                            label="Adatok mentése"
                            onClick={handleEdit}
                            fillWidth={true}
                        />
                        <Button
                            primary
                            size="large"
                            label="Eltávolítás"
                            onClick={handleDeleteRequest}
                            fillWidth={true}
                        />
                    </div>
                </div>
            )}

            {menu === "Gondozottak" && (
                <div className={styles.caregiverContainer}>
                    {/*<div className={styles.title}>Helyettesített</div>*/}

                    {/*Array.from({ length: 2 }).map((_, i) => (
                        <PersonCard
                            key={i}
                            userName={`Gondozott ${i}`}
                            onClick={() => {
                                addPageToStack(<Recipient userName={`Gondozott ${i}`} />);
                            }}
                        />
                    ))
                    <div className={styles.spacer} />
                    */}

                    <div className={styles.title}>Állandó</div>

                    {recipients.list
                        ?.filter((recipient) => recipientIds.includes(recipient.id))
                        .map((recipient, i) => (
                            <PersonCard
                                key={i}
                                userName={recipient.name}
                                onClick={() => {
                                    addPageToStack(<RecipientPage recipient={recipient} />);
                                }}
                            />
                        ))}
                </div>
            )}

            {menu === "Beosztás" && <AdminSchedule userId={caregiver.id} recipientIds={recipientIds} />}
        </UserProfile>
    );
};

export default CaregiverPage;
