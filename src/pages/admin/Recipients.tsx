import styles from "./Recipients.module.scss";
import React, { useEffect } from "react";
import SearchTextInput from "../../components/SearchTextInput";
import PersonCard from "../../components/PersonCard";
import { Button } from "../../components/Button";
import { usePopup } from "../../context/popupContext";
import NameFormRow from "./NameFormRow";
import { useNavigation } from "../../context/navigationContext";
import UserProfile from "../shared/UserProfile";
import Recipient from "./Recipient";

const Recipients: React.FC = () => {
    const [searchText, setSearchText] = React.useState<string>("");
    const [, setNewName] = React.useState<string>("");
    const { openPopup } = usePopup();
    const { addPageToStack, removeLastPageFromStack } = useNavigation();

    useEffect(() => {
        console.log(searchText);
    }, [searchText]);

    return (
        <div className={styles.page}>
            <div className={styles.title}>Gondozottak</div>
            <SearchTextInput
                text={searchText}
                fillWidth={true}
                placeholder="Keresés név alapján"
                onChange={setSearchText}
            />
            <div className={styles.caregiversContainer}>
                {Array.from({ length: 10 })
                    .map((_, i) => i.toString())
                    .filter((i) => {
                        if (searchText === "") return true;
                        return `Gondozott Gondozott ${i}`.toLowerCase().includes(searchText.toLowerCase());
                    })
                    .map((i) => (
                        <PersonCard
                            key={i}
                            userName={`Gondozott Gondozott ${i}`}
                            onClick={() => {
                                addPageToStack(<Recipient userName={`Gondozott Gondozott ${i}`} />);
                            }}
                        />
                    ))}
            </div>

            <Button
                primary={true}
                size="large"
                label="Új gondozott hozzáadása"
                onClick={() => {
                    openPopup(<NameFormRow onNameChange={setNewName} />);
                }}
                fillWidth={true}
            />
        </div>
    );
};

export default Recipients;
