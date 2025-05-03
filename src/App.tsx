import styles from "./App.module.scss";
import React, { useEffect, useRef, useState } from "react";
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
import { useScroll } from "./context/scrollContext";

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
    const containerRef = useRef<HTMLDivElement>(null); // Shared ref for scrollable content
    const { setScrollPosition } = useScroll();
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const prevActiveIndex = useRef<number>(-1); // Initialize to -1 or another invalid index

    const scrollToIndex = (index: number) => {
        if (screenStackRef.current) {
            const child = screenStackRef.current.children[index] as HTMLElement;
            if (child) {
                screenStackRef.current.scrollTo({
                    left: child.offsetLeft,
                    behavior: "smooth",
                });
                child.style.transition = "all 0.3s ease-in-out";
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

    useEffect(() => {
        const activePage = activeIndex === 0 ? containerRef.current : pageRefs.current[activeIndex];

        if (!activePage) {
            return;
        }

        if (prevActiveIndex && activeIndex > prevActiveIndex.current) {
            activePage.scrollTo({
                top: 0,
                behavior: "auto",
            });
        }

        const handleScroll = () => {
            setScrollPosition(activePage.scrollTop);
        };

        activePage.addEventListener("scroll", handleScroll);
        prevActiveIndex.current = activeIndex;

        return () => {
            activePage.removeEventListener("scroll", handleScroll);
            if (activePage) {
                setScrollPosition(0);
            }
        };
    }, [activeIndex, setScrollPosition]);

    const setPageRef = (index: number, ref: HTMLDivElement | null) => {
        pageRefs.current[index] = ref;
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.screenStack} ref={screenStackRef}>
                {/* Main scrollable container */}
                <div ref={containerRef} className={styles.screenContainer}>
                    {selectedMenu === "caregivers" && <Caregivers />}
                    {selectedMenu === "recipients" && <Recipients />}
                    {selectedMenu === "account" && <Account />}
                </div>

                {/* Render pages dynamically with individual refs */}
                {pages.map((page, index) => (
                    <div
                        ref={(el) => setPageRef(index + 1, el)} // Set unique ref for each page
                        key={index + 1}
                        className={styles.screenContainer}
                    >
                        {page}
                    </div>
                ))}
            </div>

            <div className={styles.navigationContainer}>
                <Menu config={recipientMenuConfig} onMenuItemClick={setSelectedMenu} />
            </div>

            {isOpen && (
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
            )}
        </div>
    );
};

export default App;
