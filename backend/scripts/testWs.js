import WebSocket from "ws";

const token = "token";
const ws = new WebSocket(`ws://localhost:8080?token=${token}`);

ws.on("open", () => {
    console.log("Connected to WS");
});

ws.on("message", (data) => {
    console.log("Received:", data.toString());
});

ws.on("close", () => console.log("Connection closed"));
ws.on("error", (err) => console.error("WS error:", err));
