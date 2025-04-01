import React, { useEffect } from "react";
import styles from "./InputDesign.module.scss";
import IconButton from "./IconButton";

type MenuProps = {
    config: MenuConfig;
};

const Menu: React.FC<MenuProps> = ({ config }) => {
    const [selectedMenu, setSelectedMenu] = React.useState<string>("");

    useEffect(() => {
        if(Object.keys(config) && Object.keys(config).length > 0) {
            setSelectedMenu(Object.keys(config)[0]);
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
                onClick={() => setSelectedMenu(menu)}
            />
        ))}
      </div>
      <div className={styles.bottomSpacing} aria-hidden="true" />
    </nav>
  );
};

export default Menu;
