import styles from "./Login.module.scss";
import TextInput from "../components/TextInput";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/Button";
import { useApi } from "../hooks/useApi";
import { postLogin } from "../../api/sdk.gen";
import { PostLoginData, PostLoginResponse } from "../../api/types.gen";

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

        if (!response) {
            return;
        }

        login({
            id: response.user?.id ?? -1,
            role: (response?.role as UserRole) ?? "invalid",
            token: response.token ?? "",
        });
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
