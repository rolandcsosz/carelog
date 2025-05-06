import styles from "./Recipient.module.scss";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { useNavigation } from "../../context/navigationContext";
import UserProfile from "../UserProfile";
import ButtonGroup from "../../components/ButtonGroup";
import TextInput from "../../components/TextInput";
import Dropdown from "../../components/Dropdown";
import Switch from "../../components/Switch";
import { useAdminModel } from "../../hooks/useAdminModel";
import { useApi } from "../../hooks/useApi";
import { PostCaregiversRecipientsData, PostCaregiversRecipientsResponse } from "../../../api/types.gen";
import { postCaregiversRecipients } from "../../../api/sdk.gen";
import Schedule from "../Schedule";

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
    const [replacement, setReplacement] = useState<boolean>(false);
    const { relationships, caregivers, editRecipient, deleteRecipient } = useAdminModel();
    const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(null);
    const { request } = useApi();
    const connectionForRecipient =
        relationships?.filter((relationship) => relationship.recipientId === recipient.id)?.[0] || null;
    const selectedCaregiverName =
        connectionForRecipient ?
            caregivers.find((caregiver) => caregiver.id === connectionForRecipient.caregiverId)?.name || "<<Üres>>"
        :   "<<Üres>>";

    const caregiverIds = caregivers
        .filter((caregiver) =>
            relationships?.some(
                (relationship) =>
                    relationship.recipientId === recipient.id && relationship.caregiverId === caregiver.id,
            ),
        )
        .map((caregiver) => caregiver.id);

    useEffect(() => {
        editRecipient({
            id: Number(recipient.id),
            requestBody: {
                name,
                email,
                phone,
                address,
                four_hand_care_needed: recipient.four_hand_care_needed,
                caregiver_note: recipient.caregiver_note,
            },
        });
    }, [name, phone, email, address]);

    const deleteConnectionForRecipient = async () => {
        const response = await request<PostCaregiversRecipientsData, PostCaregiversRecipientsResponse>(
            postCaregiversRecipients,
            {
                requestBody: {
                    recipientId: Number(recipient.id),
                    caregiverId: Number(selectedCaregiver?.id) ?? -1,
                },
            },
        );
        if (response) {
            setSelectedCaregiver(null);
        }
    };

    useEffect(() => {
        const fetchCaregiverData = async () => {
            const response = await request<PostCaregiversRecipientsData, PostCaregiversRecipientsResponse>(
                postCaregiversRecipients,
                {
                    requestBody: {
                        recipientId: Number(recipient.id),
                        caregiverId: Number(selectedCaregiver?.id) ?? -1,
                    },
                },
            );
        };
        fetchCaregiverData();
    }, [selectedCaregiver]);

    const handleDeleteRecipient = () => {
        deleteRecipient({ id: Number(recipient.id) });
        removeLastPageFromStack();
    };

    const handleSelectionChange = (selected: string) => {
        if (selected === "<<Üres>>") {
            setSelectedCaregiver(null);
            return;
        }

        const selectedCaregiver = caregivers.find((caregiver) => caregiver.name === selected);
        if (selectedCaregiver) {
            setSelectedCaregiver(selectedCaregiver);
        } else {
            setSelectedCaregiver(null);
        }
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
                                selected={selectedCaregiverName}
                                options={["<<Üres>>", ...caregivers.map((caregiver) => caregiver.name)]}
                                onChange={handleSelectionChange}
                                fillWidth={true}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Helyettesítés</div>
                            <Switch initialState={replacement} onToggle={setReplacement} />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Helyettes gondozó</div>
                            <Dropdown
                                selected={selectedCaregiver?.name || ""}
                                disabled={!replacement}
                                options={["<<Üres>>", ...caregivers.map((caregiver) => caregiver.name)]}
                                onChange={() => {}}
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
                    <Button
                        primary={true}
                        size="large"
                        label="Eltávolítás"
                        onClick={handleDeleteRecipient}
                        fillWidth={true}
                    />
                </div>
            )}

            {menu === "Beosztás" && <Schedule userId={recipient.id} caregiverIds={caregiverIds} />}
        </UserProfile>
    );
};

export default Recipients;
