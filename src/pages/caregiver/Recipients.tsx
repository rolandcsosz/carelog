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
import { useAuth } from "../../hooks/useAuth";
import { useCaregiverModel } from "../../hooks/useCaregiverModel";

const Recipients: React.FC = () => {
    const [searchText, setSearchText] = React.useState<string>("");
    const { openPopup } = usePopup();
    const { addPageToStack } = useNavigation();
    const { recipients } = useCaregiverModel();
    const { user } = useAuth();

    return (
        <div className={styles.page}>
            <div className={styles.title}>Gondozottak</div>
            <SearchTextInput text={searchText} fillWidth={true} placeholder="Keresés..." onChange={setSearchText} />
            <div />
            <div className={styles.caregiversContainer}>
                {recipients.info
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
        </div>
    );
};

export default Recipients;
