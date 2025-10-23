import styles from "./Login.module.scss";
import TextInput from "../components/TextInput";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/Button";
import { useApi } from "../hooks/useApi";
import { postLogin } from "../../api/sdk.gen";
import { PostLoginData, PostLoginResponse } from "../../api/types.gen";
import { UserRole } from "../types";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let { login } = useAuth();
    const { request } = useApi();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await request<PostLoginData, PostLoginResponse>(postLogin, {
            requestBody: { email, password },
        });

        if (!response || !response.ok || !response.data) {
            return;
        }

        login({
            id: response.data.user?.id ?? -1,
            role: (response.data?.role as UserRole) ?? "invalid",
            token: response.data?.token ?? "",
        });
    };

    return (
        <div className={styles.panel}>
            <h1 className={styles.title}>Bejelentkezés</h1>
            <p className={styles.subtitle}>Írd be az email címed és a jelszavad.</p>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                <TextInput text={email} placeholder="Email" onChange={setEmail} fillWidth={true} />
                <TextInput
                    text={password}
                    type="password"
                    placeholder="Jelszó"
                    onChange={setPassword}
                    fillWidth={true}
                />
                <div />
                <Button primary={true} type="submit" size="large" label="Belépés" fillWidth={true} />
            </form>
            <div className={styles.spacer} />
        </div>
    );
};

export default Login;
