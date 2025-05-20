import styles from "./Recipients.module.scss";
import React from "react";
import SearchTextInput from "../../components/SearchTextInput";
import PersonCard from "../../components/PersonCard";
import { useNavigation } from "../../context/navigationContext";
import Recipient from "./Recipient";
import { useCaregiverModel } from "../../hooks/useCaregiverModel";

const Recipients: React.FC = () => {
    const [searchText, setSearchText] = React.useState<string>("");
    const { addPageToStack } = useNavigation();
    const { recipients } = useCaregiverModel();

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
