import styles from "./UserProfile.module.scss";
import React from "react";
import Avatar from "../components/Avatar";
import IconButton from "../components/IconButton";
import chevronLeft from "../assets/chevron-left.svg";
import { useScroll } from "../context/scrollContext";

interface UserProfileProps extends React.PropsWithChildren {
    userName: string;
    backButtonHidden?: boolean;
    backButtonOnClick?: () => void;
    additionalComponent?: React.ReactNode;
}

const UserProfile: React.FC<UserProfileProps> = ({
    children,
    userName,
    backButtonHidden = false,
    backButtonOnClick = () => {},
    additionalComponent = null,
}) => {
    const { scrollPosition } = useScroll();

    return (
        <div className={styles.page}>
            {!backButtonHidden && (
                <div className={`${styles.backRow} ${scrollPosition > 0 ? styles.sticky : ""}`}>
                    <IconButton svgContent={chevronLeft} onClick={backButtonOnClick} ariaLabel={"Vissza"} />
                </div>
            )}
            <div className={styles.pageContent}>
                <div className={styles.profileHeader}>
                    <Avatar userName={userName} size="large" />
                    <div className={styles.profileHeaderText}>{userName}</div>
                </div>
                <div className={styles.spacer} />
                {children}
            </div>

            {additionalComponent && additionalComponent}
        </div>
    );
};

export default UserProfile;
