import styles from "./Caregivers.module.scss";
import React, { useCallback, useEffect, useRef } from "react";
import SearchTextInput from "../../components/SearchTextInput";
import PersonCard from "../../components/PersonCard";
import { Button } from "../../components/Button";
import { usePopup } from "../../context/popupContext";
import NewPersonFormRow from "../../components/admin/NewPersonFormRow";
import { useNavigation } from "../../context/navigationContext";
import { useAdminModel } from "../../hooks/useAdminModel";
import Caregiver from "./Caregiver";
import addButtonIconPrimary from "../../assets/add-button-icon-primary.svg";

const Caregivers: React.FC = () => {
    const [searchText, setSearchText] = React.useState<string>("");
    const [newPerson, setNewPerson] = React.useState<NewPersonData | null>(null);
    const newPersonRef = useRef<NewPersonData | null>(null);
    const { openPopup } = usePopup();
    const { addPageToStack } = useNavigation();
    const { caregivers } = useAdminModel();

    const handleNewCaregiver = useCallback(() => {
        if (!newPersonRef || !newPersonRef.current || newPersonRef.current.name.length === 0) {
            console.log("Inalid data for new caregiver");
            return;
        }

        caregivers.add({
            requestBody: {
                name: newPersonRef.current.name,
                email: newPersonRef.current.email,
                phone: newPersonRef.current.phone,
                password: newPersonRef.current.password,
            },
        });
    }, [newPerson, caregivers]);

    useEffect(() => {
        newPersonRef.current = newPerson;
    }, [newPerson]);

    return (
        <div className={styles.page}>
            <div className={styles.title}>Gondozók</div>
            <SearchTextInput text={searchText} fillWidth={true} placeholder="Keresés..." onChange={setSearchText} />
            <div />
            <div className={styles.caregiversContainer}>
                {caregivers.list
                    ?.filter((caregiver) => {
                        return caregiver.name.toLowerCase().includes(searchText.toLowerCase());
                    })
                    .map((caregiver, index) => (
                        <PersonCard
                            key={index}
                            userName={caregiver.name}
                            onClick={() => {
                                addPageToStack(<Caregiver caregiver={caregiver} />);
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
                        title: "Új gondozó hozzáadása",
                        confirmButtonText: "Hozzáadás",
                        content: <NewPersonFormRow onChange={setNewPerson} />,
                        onConfirm: handleNewCaregiver,
                        onCancel: () => {},
                        confirmOnly: true,
                    });
                }}
                fillWidth={true}
            />
        </div>
    );
};

export default Caregivers;
