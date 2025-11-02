import { GoogleAuth } from "google-auth-library";

async function getAccessToken() {
    const auth = new GoogleAuth({
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
        keyFile: "./google.json",
    });
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    return tokenResponse.token;
}

console.log(await getAccessToken());
