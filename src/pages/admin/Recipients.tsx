import styles from "./Recipients.module.scss";
import React, { useCallback, useEffect, useRef } from "react";
import SearchTextInput from "../../components/SearchTextInput";
import PersonCard from "../../components/PersonCard";
import { Button } from "../../components/Button";
import { usePopup } from "../../context/popupContext";
import NewPersonFormRow from "../../components/admin/NewPersonFormRow";
import { useNavigation } from "../../context/navigationContext";
import Recipient from "./Recipient";
import { useAdminModel } from "../../hooks/useAdminModel";
import addButtonIconPrimary from "../../assets/add-button-icon-primary.svg";

const Recipients: React.FC = () => {
    const [searchText, setSearchText] = React.useState<string>("");
    const { openPopup } = usePopup();
    const { addPageToStack } = useNavigation();
    const { recipients } = useAdminModel();
    const [newPerson, setNewPerson] = React.useState<NewPersonData | null>(null);
    const newPersonRef = useRef<NewPersonData | null>(null);

    const handleNewRecipient = useCallback(() => {
        if (!newPersonRef || !newPersonRef.current || newPersonRef.current.name.length === 0) {
            console.log("Inalid data for new caregiver");
            return;
        }

        recipients.add({
            requestBody: {
                name: newPersonRef.current.name,
                email: newPersonRef.current.email,
                phone: newPersonRef.current.phone,
                password: newPersonRef.current.password,
                four_hand_care_needed: false,
                caregiver_note: "",
                address: newPersonRef.current?.address || "",
            },
        });
    }, [newPerson, recipients]);

    useEffect(() => {
        newPersonRef.current = newPerson;
    }, [newPerson]);

    return (
        <div className={styles.page}>
            <div className={styles.title}>Gondozottak</div>
            <SearchTextInput text={searchText} fillWidth={true} placeholder="Keresés..." onChange={setSearchText} />
            <div />
            <div className={styles.caregiversContainer}>
                {recipients.list
                    ?.filter((recipient) => {
                        return recipient.name.toLowerCase().includes(searchText.toLowerCase());
                    })
                    .map((recipient, index) => (
                        <PersonCard
                            key={index}
                            userName={recipient.name}
                            onClick={() => {
                                addPageToStack(<Recipient recipient={recipient} />);
                            }}
                        />
                    ))}
            </div>

            <Button
                noText={true}
                primary={true}
                icon={addButtonIconPrimary}
                size="large"
                onClick={() => {
                    openPopup({
                        title: "Új gondozott hozzáadása",
                        confirmButtonText: "Hozzáadás",
                        content: <NewPersonFormRow onChange={setNewPerson} AddressVisible={true} />,
                        onConfirm: handleNewRecipient,
                        onCancel: () => {},
                        confirmOnly: true,
                    });
                }}
                fillWidth={true}
            />
        </div>
    );
};

export default Recipients;
