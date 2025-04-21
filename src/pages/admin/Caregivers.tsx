import styles from "./Caregivers.module.scss";
import React from "react";
import SearchTextInput from "../../components/SearchTextInput";
import PersonCard from "../../components/PersonCard";
import { Button } from "../../components/Button";
import { usePopup } from "../../context/popupContext";
import NameFormRow from "./NameFormRow";
import { useNavigation } from "../../context/navigationContext";
import UserProfile from "../shared/UserProfile";

const Caregivers: React.FC = () => {
    const [searchText, setSearchText] = React.useState<string>("");
    const [, setNewName] = React.useState<string>("");
    const { openPopup } = usePopup();
    const { addPageToStack, removeLastPageFromStack } = useNavigation();

    return (
        <div className={styles.page}>
            <div className={styles.title}>Gondozók</div>
            <SearchTextInput
                text={searchText}
                fillWidth={true}
                placeholder="Keresés név alapján"
                onChange={setSearchText}
            />
            <div className={styles.caregiversContainer}>
                {Array.from({ length: 10 }).map((_, i) => (
                    <PersonCard
                        key={i}
                        userName={`Gondozó Gondozó ${i}`}
                        onClick={() => {
                            addPageToStack(
                                <UserProfile
                                    userName={`Gondozó Gondozó ${i}`}
                                    backButtonOnClick={removeLastPageFromStack}
                                />,
                            );
                        }}
                    />
                ))}
            </div>

            <Button
                primary={true}
                size="large"
                label="Új gondozó hozzáadása"
                onClick={() => {
                    openPopup(<NameFormRow onNameChange={setNewName} />);
                }}
                fillWidth={true}
            />
        </div>
    );
};

export default Caregivers;
