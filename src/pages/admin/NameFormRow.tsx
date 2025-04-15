import styles from "./NameFormRow.module.scss";
import React from "react";
import TextInput from "../../components/TextInput";

interface NameFormRowProps {
    onNameChange: (name: string) => void;
}

const NameFormRow: React.FC<NameFormRowProps> = ({ onNameChange }) => {
    const [name, setName] = React.useState<string>("");

    const handleNameChange = (value: string) => {
        setName(value);
        onNameChange(value);
    };

    return (
        <div className={styles.formRow}>
            <div className={styles.formLabel}>Név</div>
            <TextInput text={name} placeholder="Név" onChange={handleNameChange} fillWidth={true} />
        </div>
    );
};

export default NameFormRow;
