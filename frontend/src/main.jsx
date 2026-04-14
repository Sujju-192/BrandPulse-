import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { IdeaProvider } from "./context/IdeaContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <IdeaProvider>
        <App />
      </IdeaProvider>
    </AuthProvider>
  </StrictMode>
);
