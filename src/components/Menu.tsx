import React, { ReactNode, useEffect } from "react";
import styles from "./Menu.module.scss";
import IconButton from "./IconButton";
import { MenuConfig } from "../types";

type MenuProps = {
    config: MenuConfig;
    onMenuItemClick?: (item: string) => void;
    additionalComponent?: ReactNode;
};

const Menu: React.FC<MenuProps> = ({ config, onMenuItemClick = () => {}, additionalComponent = null }) => {
    const [selectedMenu, setSelectedMenu] = React.useState<string>("");

    const handleMenuItemClick = (item: string) => {
        setSelectedMenu(item);
        onMenuItemClick(item);
    };

    useEffect(() => {
        if (Object.keys(config) && Object.keys(config).length > 0) {
            handleMenuItemClick(Object.keys(config)[0]);
        }
    }, [config]);

    return (
        <div className={styles.container}>
            {additionalComponent}
            <nav className={styles.navigationContainer}>
                <div className={styles.navigationBar}>
                    {Object.keys(config).map((menu) => (
                        <IconButton
                            key={menu}
                            svgContent={selectedMenu === menu ? config[menu].selectedIcon : config[menu].unselectedIcon}
                            ariaLabel={config[menu].alt}
                            onClick={() => handleMenuItemClick(menu)}
                        />
                    ))}
                </div>
                <div className={styles.bottomSpacing} aria-hidden="true" />
            </nav>
        </div>
    );
};

export default Menu;
