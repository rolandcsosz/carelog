import styles from "./Caregiver.module.scss";
import React, { useState } from "react";
import SearchTextInput from "../../components/SearchTextInput";
import PersonCard from "../../components/PersonCard";
import { Button } from "../../components/Button";
import { usePopup } from "../../context/popupContext";
import NameFormRow from "./NameFormRow";
import { useNavigation } from "../../context/navigationContext";
import UserProfile from "../shared/UserProfile";
import ButtonGroup from "../../components/ButtonGroup";
import TextInput from "../../components/TextInput";
import Recipients from "./Recipients";
import Recipient from "./Recipient";
import Calendar from "../../components/Calendar";

interface CaregiverProps {
    userName: string;
}

const Caregiver: React.FC<CaregiverProps> = ({ userName }) => {
    const [menu, setMenu] = useState<string>("Adatok");
    const { addPageToStack, removeLastPageFromStack } = useNavigation();
    const [phone, setPhone] = useState<string>("+36301234567");
    const [email, setEmail] = useState<string>("hello@vmi.com");
    const [password, setPassword] = useState<string>("jelszó");

    return (
        <UserProfile userName={userName} backButtonOnClick={removeLastPageFromStack}>
            <ButtonGroup menus={["Adatok", "Gondozottak", "Beosztás"]} onChange={setMenu} />

            {menu === "Adatok" && (
                <div className={styles.dataContainer}>
                    <div className={styles.form}>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Telefon</div>
                            <TextInput text={phone} placeholder="+36301234567" onChange={setPhone} fillWidth={true} />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Email</div>
                            <TextInput text={email} placeholder="hello@vmi.com" onChange={setEmail} fillWidth={true} />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Jelszó</div>
                            <TextInput text={password} placeholder="jelszó" onChange={setPassword} fillWidth={true} />
                        </div>
                    </div>
                </div>
            )}

            {menu === "Gondozottak" && (
                <div className={styles.dataContainer}>
                    <div className={styles.title}>Helyettesített</div>

                    {Array.from({ length: 2 }).map((_, i) => (
                        <PersonCard
                            key={i}
                            userName={`Gondozott ${i}`}
                            onClick={() => {
                                addPageToStack(<Recipient userName={`Gondozott ${i}`} />);
                            }}
                        />
                    ))}
                    <div className={styles.spacer} />

                    <div className={styles.title}>Állandó</div>

                    {Array.from({ length: 10 }).map((_, i) => (
                        <PersonCard
                            key={i}
                            userName={`Gondozott ${i}`}
                            onClick={() => {
                                addPageToStack(<Recipient userName={`Gondozott ${i}`} />);
                            }}
                        />
                    ))}
                </div>
            )}

            {menu === "Beosztás" && (
                <div className={styles.dataContainer}>
                    <Calendar />
                </div>
            )}
        </UserProfile>
    );
};

export default Caregiver;
