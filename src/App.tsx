import styles from "./App.module.scss";
import React, { useEffect, useRef } from "react";
import Menu from "./components/Menu";
import accountFilled from "./assets/account-filled.svg";
import accountOutline from "./assets/account-outline.svg";
import caregiverFilled from "./assets/caregiver-filled.svg";
import caregiverOutline from "./assets/caregiver-outline.svg";
import recipientFilled from "./assets/recipient-filled.svg";
import recipientOutline from "./assets/recipient-outline.svg";
import homeFilled from "./assets/home-filled.svg";
import homeOutline from "./assets/home-outline.svg";
import calendarFilled from "./assets/calendar-filled.svg";
import calendarOutline from "./assets/calendar-outline.svg";
import listFilled from "./assets/list-filled.svg";
import listOutline from "./assets/list-outline.svg";
import Caregivers from "./pages/admin/Caregivers";
import AdminRecipients from "./pages/admin/Recipients";
import Recipients from "./pages/caregiver/Recipients";
import Account from "./pages/admin/Account";
import Popup from "./components/Popup";
import { usePopup } from "./context/popupContext";
import { setupIonicReact } from "@ionic/react";
import { useNavigation } from "./context/navigationContext";
import { useScroll } from "./context/scrollContext";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import DailySchedule from "./pages/caregiver/DailySchedule";
import CalendarSchedule from "./pages/caregiver/CalendarSchedule";
import { BottomSheet } from "./components/BottomSheet";
import { useBottomSheet } from "./context/BottomSheetContext";
import LogClosedSheet from "./components/LogClosedSheet";
import { useCaregiverModel } from "./hooks/useCaregiverModel";
import { getDateString } from "./utils";

setupIonicReact();

const adminMenuConfig: MenuConfig = {
    caregivers: {
        selectedIcon: caregiverFilled,
        unselectedIcon: caregiverOutline,
        alt: "Caregivers",
        component: Caregivers,
    },
    recipients: {
        selectedIcon: recipientFilled,
        unselectedIcon: recipientOutline,
        alt: "Recipients",
        component: AdminRecipients,
    },
    account: {
        selectedIcon: accountFilled,
        unselectedIcon: accountOutline,
        alt: "Account",
        component: Account,
    },
};

const caregiverMenuConfig: MenuConfig = {
    home: {
        selectedIcon: homeFilled,
        unselectedIcon: homeOutline,
        alt: "Home",
        component: DailySchedule,
    },
    calendar: {
        selectedIcon: calendarFilled,
        unselectedIcon: calendarOutline,
        alt: "Calendar",
        component: CalendarSchedule,
    },
    list: {
        selectedIcon: listFilled,
        unselectedIcon: listOutline,
        alt: "List view",
        component: Recipients,
    },
    account: {
        selectedIcon: accountFilled,
        unselectedIcon: accountOutline,
        alt: "Account",
        component: Account,
    },
};

const App: React.FC = () => {
    const [selectedMenu, setSelectedMenu] = React.useState<string>("");
    const {
        isOpen,
        content,
        closePopup,
        onConfirm,
        onCancel,
        title,
        confirmButtonText,
        cancelButtonText,
        confirmOnly,
    } = usePopup();
    const screenStackRef = useRef<HTMLDivElement>(null);
    const { pages, activeIndex, reset } = useNavigation();
    const containerRef = useRef<HTMLDivElement>(null);
    const { setScrollPosition } = useScroll();
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const prevActiveIndex = useRef<number>(-1);
    const { isAuthenticated, user } = useAuth();
    const usedConfig = user?.role === "admin" ? adminMenuConfig : caregiverMenuConfig;
    const { isOpen: isSheetOpen, openSheet } = useBottomSheet();
    const { recipients, relationships, logs } = useCaregiverModel();
    const openLog = logs.info?.find(
        (log) => !log.closed && relationships.info?.some((relationship) => relationship.id === log.relationshipId),
    );

    const getRecipientForLog = (log: Log): Recipient | undefined => {
        const relationship = relationships.info?.find((relationship) => relationship.id === log.relationshipId);
        if (relationship) {
            const recipient = recipients.info?.find((recipient) => recipient.id === relationship.recipientId);
            if (recipient) {
                return recipient;
            }
        }
        return undefined;
    };

    const recipient = openLog ? getRecipientForLog(openLog) : undefined;

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

    return !isAuthenticated ?
            <Login />
        :   <div className={styles.appContainer}>
                <div className={styles.screenStack} ref={screenStackRef}>
                    <div ref={containerRef} className={styles.screenContainer}>
                        {Object.keys(usedConfig).map((menu) => {
                            if (menu !== selectedMenu) {
                                return null;
                            }

                            const Component = usedConfig[menu].component;

                            if (!Component) {
                                return null;
                            }

                            return <Component key={menu} />;
                        })}
                    </div>

                    {pages.map((page, index) => (
                        <div ref={(el) => setPageRef(index + 1, el)} key={index + 1} className={styles.screenContainer}>
                            {page}
                        </div>
                    ))}
                </div>

                <div className={styles.navigationContainer}>
                    <Menu
                        config={usedConfig}
                        onMenuItemClick={setSelectedMenu}
                        additionalComponent={
                            openLog &&
                            recipient && (
                                <LogClosedSheet
                                    name={recipient.name}
                                    date={getDateString(new Date(openLog.date))}
                                    onOpen={openSheet}
                                />
                            )
                        }
                    />
                </div>

                {isOpen && (
                    <Popup
                        confirmButtonText={confirmButtonText}
                        cancelButtonText={cancelButtonText}
                        onClose={closePopup}
                        onConfirm={onConfirm}
                        onCancel={onCancel}
                        confirmOnly={confirmOnly}
                        title={title}
                        children={content}
                    />
                )}

                {isSheetOpen && <div className={styles.darkOverlay} />}
                <BottomSheet />
            </div>;
};

export default App;
