import styles from "./Recipients.module.scss";
import React, { useCallback, useEffect, useRef } from "react";
import SearchTextInput from "../../components/SearchTextInput";
import PersonCard from "../../components/PersonCard";
import { Button } from "../../components/Button";
import usePopup from "../../hooks/usePopup";
import NewPersonFormRow from "../../components/popup-contents/NewPersonFormRow";
import useNavigation from "../../hooks/useNavigation";
import RecipientPage from "./RecipientPage";
import { useAdminModel } from "../../hooks/useAdminModel";
import addButtonIconPrimary from "../../assets/add-button-icon-primary.svg";
import { useAuth } from "../../hooks/useAuth";
import { NewPersonData, PopupActionResult } from "../../types";
import ErrorModal from "../../components/popup-contents/ErrorModal";
import Success from "../../components/popup-contents/Success";

const Recipients: React.FC = () => {
    const [searchText, setSearchText] = React.useState<string>("");
    const { openPopup, closePopup } = usePopup();
    const { addPageToStack } = useNavigation();
    const { recipients } = useAdminModel();
    const [newPerson, setNewPerson] = React.useState<NewPersonData | null>(null);
    const newPersonRef = useRef<NewPersonData | null>(null);
    const { user } = useAuth();

    const handleNewRecipient = useCallback((): Promise<PopupActionResult> => {
        const emptyResponse: PopupActionResult = {
            ok: false,
            message: "",
            quitUpdate: true,
        };

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
            recipients.add(
                {
                    requestBody: {
                        name: newPersonRef.current?.name || "",
                        email: newPersonRef.current?.email || "",
                        phone: newPersonRef.current?.phone || "",
                        password: newPersonRef.current?.password || "",
                        four_hand_care_needed: false,
                        caregiver_note: "",
                        address: newPersonRef.current?.address || "",
                    },
                },
                {
                    onSuccess: () => {
                        openPopup({
                            content: <Success title="Gondozott sikeresen hozzáaadva" message="" />,
                            title: "",
                            confirmButtonText: "Rendben",
                            cancelButtonText: "",
                            confirmOnly: true,
                            onConfirm: closePopup,
                            onCancel: closePopup,
                        });

                        resolve({
                            ok: true,
                            message: "Gondozott sikeresen hozzáaadva",
                            quitUpdate: false,
                        });
                    },
                    onError: (error: any) => {
                        openPopup({
                            content: (
                                <ErrorModal title="Sikertelen művelet" message={error.message || "Ismeretlen hiba"} />
                            ),
                            title: "",
                            confirmButtonText: "Rendben",
                            cancelButtonText: "",
                            confirmOnly: true,
                            onConfirm: closePopup,
                            onCancel: closePopup,
                        });

                        resolve({
                            ok: false,
                            message: error.message || "Ismeretlen hiba",
                            quitUpdate: false,
                        });
                    },
                },
            );
        });
    }, [newPersonRef, recipients, openPopup, closePopup]);

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
                                addPageToStack(<RecipientPage recipient={recipient} />);
                            }}
                        />
                    ))}
            </div>

            {user?.role === "admin" && (
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
            )}
        </div>
    );
};

export default Recipients;
