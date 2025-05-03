import styles from "./Login.module.scss";
import TextInput from "../../components/TextInput";
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/Button";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(import.meta.env.BASE_URL + "/loginn", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const result = await response.json();

                if ("token" in result) {
                    // login({ email, token: result.token });
                }
            }
        } catch (error) {}
    };

    return (
        <div className={styles.panel}>
            <h1 className={styles.title}>Hello újra :)</h1>
            <p className={styles.subtitle}>Írd be az email címed és a jelszavad</p>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                <TextInput text={email} placeholder="Email" onChange={setEmail} fillWidth={true} />
                <TextInput
                    text={password}
                    type="password"
                    placeholder="Jelszó"
                    onChange={setPassword}
                    fillWidth={true}
                />
                <Button primary={true} type="submit" size="large" label="Belépés" fillWidth={true} />
            </form>
            <div className={styles.spacer} />
        </div>
    );
};

export default Login;
