import styles from "./App.module.scss";
import React, { use, useEffect, useRef } from "react";
import Menu from "./components/Menu";
import accountFilled from "./assets/account-filled.svg";
import accountOutline from "./assets/account-outline.svg";
import caregiverFilled from "./assets/caregiver-filled.svg";
import caregiverOutline from "./assets/caregiver-outline.svg";
import recipientFilled from "./assets/recipient-filled.svg";
import recipientOutline from "./assets/recipient-outline.svg";
import Caregivers from "./pages/admin/Caregivers";
import Recipients from "./pages/admin/Recipients";
import Account from "./pages/admin/Account";
import Popup from "./components/Popup";
import { usePopup } from "./context/popupContext";
import { setupIonicReact } from "@ionic/react";
import { useNavigation } from "./context/navigationContext";
import { useWindowSize } from "./hooks/useWindowSize";

setupIonicReact();

const recipientMenuConfig: MenuConfig = {
    caregivers: {
        selectedIcon: caregiverFilled,
        unselectedIcon: caregiverOutline,
        alt: "Caregivers",
    },
    recipients: {
        selectedIcon: recipientFilled,
        unselectedIcon: recipientOutline,
        alt: "Recipients",
    },
    account: {
        selectedIcon: accountFilled,
        unselectedIcon: accountOutline,
        alt: "Account",
    },
};

const App: React.FC = () => {
    const [selectedMenu, setSelectedMenu] = React.useState<string>("");
    const { isOpen, content, closePopup } = usePopup();
    const screenStackRef = useRef<HTMLDivElement>(null);
    const { pages, activeIndex, reset } = useNavigation();

    const scrollToIndex = (index: number) => {
        if (screenStackRef.current) {
            const child = screenStackRef.current.children[index] as HTMLElement;
            if (child) {
                screenStackRef.current.scrollTo({
                    left: child.offsetLeft,
                    behavior: "smooth",
                });
            }
        }
    };

    useEffect(() => {
        scrollToIndex(activeIndex);
    }, [activeIndex]);

    useEffect(() => {
        if (selectedMenu) {
            reset();
        }
    }, [selectedMenu, reset]);

    return (
        <div className={styles.appContainer}>
            <div className={styles.screenStack} ref={screenStackRef}>
                <div className={styles.screenContainer}>
                    {selectedMenu === "caregivers" && <Caregivers />}
                    {selectedMenu === "recipients" && <Recipients />}
                    {selectedMenu === "account" && <Account />}
                </div>
                {pages.map((page, index) => (
                    <div key={index} className={styles.screenContainer}>
                        {page}
                    </div>
                ))}
            </div>
            <div className={styles.navigationContainer}>
                <Menu config={recipientMenuConfig} onMenuItemClick={setSelectedMenu} />
            </div>
            {isOpen ?
                <Popup
                    confirmButtonText={"Hozzáad"}
                    onClose={closePopup}
                    onConfirm={() => {
                        console.log("Confirmed");
                        closePopup();
                    }}
                    onlyConfirm={true}
                    title={selectedMenu === "caregivers" ? "Új gondozó hozzáadása" : "Új gondozott hozzáadása"}
                    children={content}
                />
            :   null}
        </div>
    );
};

export default App;
