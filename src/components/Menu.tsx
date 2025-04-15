import React, { useEffect } from "react";
import styles from "./Menu.module.scss";
import IconButton from "./IconButton";

type MenuProps = {
    config: MenuConfig;
    onMenuItemClick?: (item: string) => void;
};

const Menu: React.FC<MenuProps> = ({ config, onMenuItemClick = () => {} }) => {
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
    );
};

export default Menu;
