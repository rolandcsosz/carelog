import styles from "./Caregivers.module.scss";
import React, { useCallback, useEffect, useRef, useState } from "react";
import SearchTextInput from "../../components/SearchTextInput";
import PersonCard from "../../components/PersonCard";
import { Button } from "../../components/Button";
import usePopup from "../../hooks/usePopup";
import NewPersonFormRow from "../../components/popup-contents/NewPersonFormRow";
import useNavigation from "../../hooks/useNavigation";
import { useAdminModel } from "../../hooks/useAdminModel";
import CaregiverPage from "./CaregiverPage";
import addButtonIconPrimary from "../../assets/add-button-icon-primary.svg";
import { NewPersonData, PopupActionResult } from "../../types";
import { getEmptyResponse } from "../../utils";

const Caregivers: React.FC = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [newPerson, setNewPerson] = useState<NewPersonData | null>(null);
    const newPersonRef = useRef<NewPersonData | null>(null);
    const { openPopup } = usePopup();
    const { addPageToStack } = useNavigation();
    const { caregivers } = useAdminModel();

    const handleNewCaregiver = useCallback((): Promise<PopupActionResult> => {
        const emptyResponse = getEmptyResponse();

        if (
            !newPersonRef ||
            !newPersonRef.current ||
            newPersonRef.current.name.length === 0 ||
            newPersonRef.current.email.length === 0 ||
            newPersonRef.current.phone.length === 0 ||
            newPersonRef.current.password.length === 0
        ) {
            return Promise.resolve(emptyResponse);
        }

        return new Promise<PopupActionResult>((resolve) => {
            caregivers.add(
                {
                    requestBody: {
                        name: newPersonRef.current!.name,
                        email: newPersonRef.current!.email,
                        phone: newPersonRef.current!.phone,
                        password: newPersonRef.current!.password,
                    },
                },
                {
                    onSuccess: () => {
                        resolve({
                            ok: true,
                            message: "Gondozó sikeresen hozzáadva",
                            quitUpdate: false,
                        });
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
    }, [caregivers, newPersonRef]);

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
                                addPageToStack(<CaregiverPage caregiver={caregiver} />);
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
