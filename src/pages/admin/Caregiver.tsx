import styles from "./Caregiver.module.scss";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { useNavigation } from "../../context/navigationContext";
import UserProfile from "../UserProfile";
import ButtonGroup from "../../components/ButtonGroup";
import TextInput from "../../components/TextInput";
import { useAdminModel } from "../../hooks/useAdminModel";
import PersonCard from "../../components/PersonCard";
import Recipient from "./Recipient";
import Schedule from "../Schedule";

interface CaregiverProps {
    caregiver: Caregiver;
}

const Caregiver: React.FC<CaregiverProps> = ({ caregiver }) => {
    const [menu, setMenu] = useState<string>("Adatok");
    const { addPageToStack, removeLastPageFromStack } = useNavigation();
    const [name] = useState<string>(caregiver.name);
    const [phone, setPhone] = useState<string>(caregiver.phone);
    const [email, setEmail] = useState<string>(caregiver.email);
    const { relationships, recipients, caregivers } = useAdminModel();

    const recipientIds = recipients.list
        ?.filter((recipient) =>
            relationships.list?.some(
                (relationship) =>
                    relationship.recipientId === recipient.id && relationship.caregiverId === caregiver.id,
            ),
        )
        .map((recipient) => recipient.id);

    useEffect(() => {
        caregivers.edit({
            id: Number(caregiver.id),
            requestBody: {
                name,
                phone,
                email,
            },
        });
    }, [name, phone, email]);

    const handleDeleteRecipient = () => {
        caregivers.delete({ id: Number(caregiver.id) });
        removeLastPageFromStack();
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
                    <Button
                        primary={true}
                        size="large"
                        label="Eltávolítás"
                        onClick={handleDeleteRecipient}
                        fillWidth={true}
                    />
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
                                    addPageToStack(<Recipient recipient={recipient} />);
                                }}
                            />
                        ))}
                </div>
            )}

            {menu === "Beosztás" && <Schedule userId={caregiver.id} recipientIds={recipientIds} />}
        </UserProfile>
    );
};

export default Caregiver;
