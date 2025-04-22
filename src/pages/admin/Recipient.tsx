import styles from "./Recipient.module.scss";
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
import Dropdown from "../../components/Dropdown";
import Switch from "../../components/Switch";
import Calendar from "../../components/Calendar";

interface RecipientsProps {
    userName: string;
}

const Recipients: React.FC<RecipientsProps> = ({ userName }) => {
    const [menu, setMenu] = useState<string>("Adatok");
    const { addPageToStack, removeLastPageFromStack } = useNavigation();
    const [phone, setPhone] = useState<string>("+36301234567");
    const [email, setEmail] = useState<string>("hello@vmi.com");
    const [password, setPassword] = useState<string>("jelszó");
    const [address, setAddress] = useState<string>("Budapest, 1111 Csorba Hosszú utca 23. 3/12A");
    const [replacement, setReplacement] = useState<boolean>(false);
    return (
        <UserProfile userName={userName} backButtonOnClick={removeLastPageFromStack}>
            <ButtonGroup menus={["Adatok", "Beosztás"]} onChange={setMenu} />

            {menu === "Adatok" && (
                <div className={styles.dataContainer}>
                    <div className={styles.form}>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Gondozó</div>
                            <Dropdown
                                selected={"Gondozó 1"}
                                options={["Gondozó 1", "Gondozó 2", "Gondozó 3"]}
                                onChange={() => {}}
                                fillWidth={true}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Helyettesítés</div>
                            <Switch initialState={replacement} onToggle={setReplacement} />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Helyettes gondozó</div>
                            <Dropdown
                                selected={"Gondozó 2"}
                                disabled={!replacement}
                                options={["Gondozó 1", "Gondozó 2", "Gondozó 3"]}
                                onChange={() => {}}
                                fillWidth={true}
                            />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Telefon</div>
                            <TextInput text={phone} placeholder="+36301234567" onChange={setPhone} fillWidth={true} />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formLabel}>Cím</div>
                            <TextInput
                                text={address}
                                placeholder="hello@vmi.com"
                                onChange={setAddress}
                                fillWidth={true}
                            />
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

            {menu === "Beosztás" && (
                <div className={styles.dataContainer}>
                    <Calendar />
                </div>
            )}
        </UserProfile>
    );
};

export default Recipients;
