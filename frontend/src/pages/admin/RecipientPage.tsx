import styles from "./RecipientPage.module.scss";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import useNavigation from "../../hooks/useNavigation";
import UserProfile from "../UserProfile";
import ButtonGroup from "../../components/ButtonGroup";
import TextInput from "../../components/TextInput";
import Dropdown from "../../components/Dropdown";
import { useAdminModel } from "../../hooks/useAdminModel";
import AdminSchedule from "./AdminSchedule";
import { Caregiver, PopupActionResult, Recipient } from "../../types";
import usePopup from "../../hooks/usePopup";
import { getDefaultErrorModal, getDefaultSuccessModal } from "../../utils";
import Switch from "../../components/Switch";

interface RecipientPageProps {
    recipient: Recipient;
}

const RecipientPage: React.FC<RecipientPageProps> = ({ recipient }) => {
    const [menu, setMenu] = useState<string>("Adatok");
    const { removeLastPageFromStack } = useNavigation();
    const [name] = useState<string>(recipient.name);
    const [phone, setPhone] = useState<string>(recipient.phone);
    const [email, setEmail] = useState<string>(recipient.email);
    const [address, setAddress] = useState<string>(recipient.address);
    const { relationships, caregivers, recipients } = useAdminModel();
    const connections = relationships.list?.filter((relationship) => relationship.recipientId === recipient.id);
    const caregiver = caregivers.list?.find((caregiver) => caregiver.id === connections?.[0]?.caregiverId);
    const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(caregiver || null);
    const [replacement, setReplacement] = useState<boolean>(false);
    const { openPopup, closePopup } = usePopup();

    const caregiverIds = caregivers.list
        ?.filter((caregiver) =>
            relationships.list?.some(
                (relationship) =>
                    relationship.recipientId === recipient.id && relationship.caregiverId === caregiver.id,
            ),
        )
        .map((caregiver) => caregiver.id);

    useEffect(() => {
        if (!connections?.length || connections?.length <= 1) {
            return;
        }

        const recipientConnections = relationships.list?.filter((rel) => rel.recipientId === recipient.id) || [];

        const idsToKeep = new Set([caregiverIds?.[0]]);

        recipientConnections.forEach((rel) => {
            if (!idsToKeep.has(rel.caregiverId)) {
                relationships.delete({ id: rel.id });
            }
        });
    }, [connections, recipient]);

    const handleDelete = (): Promise<PopupActionResult> => {
        return new Promise<PopupActionResult>((resolve) => {
            recipients.delete(
                { id: Number(recipient.id) },
                {
                    onSuccess: () => {
                        resolve({
                            ok: true,
                            message: "Gondozott sikeresen eltávolítva",
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
            content: <div className={styles.label}>Biztosan eltávolítod ezt a gondozottat?</div>,
            title: "Eltávolítás megerősítése",
            confirmButtonText: "Eltávolítás",
            cancelButtonText: "Mégsem",
            confirmOnly: false,
            onConfirm: handleDelete,
            onCancel: closePopup,
        });
    };

    const handleEdit = () => {
        if (!name || !phone || !email || !address) {
            openPopup(getDefaultErrorModal("Sikertelen módosítás", "Kérjük, töltsd ki az összes mezőt.", closePopup));
            return;
        }

        recipients.edit(
            {
                id: Number(recipient.id),
                requestBody: {
                    name,
                    email,
                    phone,
                    address,
                    four_hand_care_needed: recipient.fourHandCareNeeded,
                    caregiver_note: recipient.caregiverNote,
                },
            },
            {
                onSuccess: () => {
                    openPopup(
                        getDefaultSuccessModal(
                            "Sikeres módosítás",
                            "A gondozott adatai sikeresen frissítve lettek.",
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

    const handleSelectionChange = (nameSelected: string) => {
        const selectedCaregiver = caregivers.list?.find((c) => c.name === nameSelected);
        if (!selectedCaregiver) {
            setSelectedCaregiver(null);
            return;
        }

        const isRemove = nameSelected === "<<Üres>>";
        const connection = relationships.list?.find(
            (rel) =>
                Number(rel.recipientId) === Number(recipient.id) &&
                Number(rel.caregiverId) === Number(selectedCaregiver.id),
        );

        if (connection) {
            if (isRemove) {
                relationships.delete({ id: Number(connection.id) });
                setSelectedCaregiver(null);
            } else {
                relationships.edit({
                    id: Number(connection.recipientId),
                    requestBody: {
                        recipientId: Number(recipient.id),
                        caregiverId: Number(selectedCaregiver.id),
                    },
                });
                setSelectedCaregiver(
                    caregivers.list?.find((c) => Number(c.id) === Number(selectedCaregiver.id)) || null,
                );
            }
            return;
        }

        if (isRemove) {
            setSelectedCaregiver(null);
            return;
        }

        if ((connections?.length ?? 0) > 0) {
            relationships.delete({ id: Number(connections?.[0]?.id) });
        }

        relationships.add({
            requestBody: {
                recipientId: Number(recipient.id),
                caregiverId: Number(selectedCaregiver.id),
            },
        });
        setSelectedCaregiver(caregivers.list?.find((c) => Number(c.id) === Number(selectedCaregiver.id)) || null);
    };

    const showMissingFeatureModal = () => {
        openPopup(
            getDefaultErrorModal(
                "Hiányzó funkció",
                "A helyettesítés funkció jelenleg nem elérhető. Szerkesztés jelenleg nincs hatással semmire.",
                closePopup,
            ),
        );
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
                                selected={selectedCaregiver?.name || "<<Üres>>"}
                                options={
                                    !connections || connections?.length === 0 ?
                                        ["<<Üres>>", ...(caregivers.list?.map((caregiver) => caregiver.name) || [])]
                                    :   [...(caregivers.list?.map((caregiver) => caregiver.name) || [])]
                                }
                                onChange={handleSelectionChange}
                                fillWidth={true}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Helyettesítés</div>
                            <Switch
                                initialState={replacement}
                                onToggle={(isOn) => {
                                    setReplacement(isOn);
                                    showMissingFeatureModal();
                                }}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Helyettes gondozó</div>
                            <Dropdown
                                selected={selectedCaregiver?.name || "<<Üres>>"}
                                disabled={!replacement}
                                options={[selectedCaregiver?.name || "<<Üres>>"]}
                                onChange={showMissingFeatureModal}
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

            {menu === "Beosztás" && <AdminSchedule userId={recipient.id} caregiverIds={caregiverIds} />}
        </UserProfile>
    );
};

export default RecipientPage;
