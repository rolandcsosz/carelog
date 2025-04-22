import React from "react";
import styles from "./ButtonGroup.module.scss";
interface ButtonGroupProps {
    menus: string[];
    onChange: (menu: string) => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ menus, onChange }) => {
    const [selectedMenu, setSelectedMenu] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (menus.length > 0 && selectedMenu === null) {
            handleMenuClick(menus[0]);
        }
    }, [menus, onChange, selectedMenu]);

    const handleMenuClick = (menu: string) => {
        console.log("Selected menu:", menu);
        setSelectedMenu(menu);
        onChange(menu);
    };

    return (
        <div className={styles.container}>
            {menus.map((menu, index) => (
                <button
                    key={index}
                    className={`${styles.button} ${selectedMenu === menu ? styles.selected : ""}`}
                    onClick={() => {
                        handleMenuClick(menu);
                    }}
                >
                    {menu}
                </button>
            ))}
        </div>
    );
};

export default ButtonGroup;
