import styles from "./UserProfile.module.scss";
import React from "react";
import Avatar from "../../components/Avatar";
import IconButton from "../../components/IconButton";
import chevronLeft from "../../assets/chevron-left.svg";

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
    return (
        <div className={styles.page}>
            <div className={styles.pageContent}>
                {!backButtonHidden && (
                    <div className={styles.backRow}>
                        <IconButton svgContent={chevronLeft} onClick={backButtonOnClick} ariaLabel={"Vissza"} />
                    </div>
                )}
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
