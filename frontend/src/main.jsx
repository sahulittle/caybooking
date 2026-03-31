import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";
import { connectSocket, joinRoom } from "./api/socket";

// Try to connect socket on app start if authenticated
const token = localStorage.getItem("token");
if (token) {
  const socket = connectSocket(token);
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.id) {
    // join user and role room
    joinRoom(`user_${user.id}`);
    if ((user.activeRole || user.role) === "vendor") {
      joinRoom(`vendor_${user.id}`);
    }
  }
  // Reconnect on auth changes
  window.addEventListener("authStateChange", () => {
    const newToken = localStorage.getItem("token");
    if (newToken) connectSocket(newToken);
  });
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);
