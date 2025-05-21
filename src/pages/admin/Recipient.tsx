import styles from "./Recipient.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../components/Button";
import useNavigation from "../../hooks/useNavigation";
import UserProfile from "../UserProfile";
import ButtonGroup from "../../components/ButtonGroup";
import TextInput from "../../components/TextInput";
import Dropdown from "../../components/Dropdown";
import { useAdminModel } from "../../hooks/useAdminModel";
import AdminSchedule from "./AdminSchedule";

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
    const { relationships, caregivers, recipients } = useAdminModel();
    const connection = relationships.list?.find((relationship) => relationship.recipientId === recipient.id);
    const caregiver = caregivers.list?.find((caregiver) => caregiver.id === connection?.caregiverId);
    const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(caregiver || null);

    const connectionCount = relationships.list?.filter(
        (relationship) => relationship.recipientId === recipient.id,
    ).length;
    const hasMounted = useRef(false);

    const caregiverIds = caregivers.list
        ?.filter((caregiver) =>
            relationships.list?.some(
                (relationship) =>
                    relationship.recipientId === recipient.id && relationship.caregiverId === caregiver.id,
            ),
        )
        .map((caregiver) => caregiver.id);

    useEffect(() => {
        if (!connectionCount || connectionCount <= 1) {
            return;
        }

        const recipientConnections = relationships.list?.filter((rel) => rel.recipientId === recipient.id) || [];

        const idsToKeep = new Set([caregiverIds[0]]);

        recipientConnections.forEach((rel) => {
            if (!idsToKeep.has(rel.caregiverId)) {
                relationships.delete({ id: rel.recipientId });
            }
        });
    }, [connectionCount, recipient]);

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }

        recipients.edit({
            id: Number(recipient.id),
            requestBody: {
                name,
                email,
                phone,
                address,
                fourHandCareNeeded: recipient.four_hand_care_needed,
                caregiverNote: recipient.caregiver_note,
            },
        });
    }, [name, phone, email, address]);

    const handleDeleteRecipient = () => {
        recipients.delete({ id: Number(recipient.id) });
        removeLastPageFromStack();
    };

    const handleSelectionChange = (nameSelected: string) => {
        const selectedCaregiver = caregivers.list?.find((c) => c.name === nameSelected);
        if (!selectedCaregiver) {
            setSelectedCaregiver(null);
            return;
        }

        const isRemove = nameSelected === "<<Üres>>";
        const connection = relationships.list?.find(
            (rel) => rel.recipientId === recipient.id && rel.caregiverId === selectedCaregiver.id,
        );

        if (connection) {
            if (isRemove) {
                relationships.delete({ id: connection.recipientId });
                setSelectedCaregiver(null);
            } else {
                relationships.edit({
                    id: connection.recipientId,
                    requestBody: {
                        recipientId: recipient.id,
                        caregiverId: selectedCaregiver.id,
                    },
                });
                setSelectedCaregiver(caregivers.list?.find((c) => c.id === selectedCaregiver.id) || null);
            }
            return;
        }

        if (isRemove) {
            setSelectedCaregiver(null);
            return;
        }

        relationships.add({
            requestBody: {
                recipientId: recipient.id,
                caregiverId: selectedCaregiver.id,
            },
        });
        setSelectedCaregiver(caregivers.list?.find((c) => c.id === selectedCaregiver.id) || null);
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
                                selected={selectedCaregiver?.name || ""}
                                options={
                                    connectionCount === 0 ?
                                        ["<<Üres>>", ...(caregivers.list?.map((caregiver) => caregiver.name) || [])]
                                    :   [...(caregivers.list?.map((caregiver) => caregiver.name) || [])]
                                }
                                onChange={handleSelectionChange}
                                fillWidth={true}
                            />
                        </div>
                        {/*<div className={styles.formRow}>
                            <div className={styles.formLabel}>Helyettesítés</div>
                            <Switch initialState={replacement} onToggle={setReplacement} />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Helyettes gondozó</div>
                            <Dropdown
                                selected={selectedCaregiver?.name || ""}
                                disabled={!replacement}
                                options={["<<Üres>>", ...caregivers.list?.map((caregiver) => caregiver.name)]}
                                onChange={() => {}}
                                fillWidth={true}
                            />
                        </div>*/}
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

            {menu === "Beosztás" && <AdminSchedule userId={recipient.id} caregiverIds={caregiverIds} />}
        </UserProfile>
    );
};

export default Recipients;
