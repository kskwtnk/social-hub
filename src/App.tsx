import { useEffect, useState } from "react";
import "./App.css";
import CredentialsForm from "./components/CredentialsForm";
import PostForm from "./components/PostForm";
import { checkCredentials } from "./lib/api";
import type { Screen } from "./lib/types";

function App() {
  const [screen, setScreen] = useState<Screen>("loading");

  // Check credentials on mount
  useEffect(() => {
    checkCredentials().then((hasCredentials) => {
      setScreen(hasCredentials ? "main" : "setup");
    });
  }, []);

  const handleCredentialsSaved = () => {
    setScreen("main");
  };

  const handleShowSettings = () => {
    setScreen("setup");
  };

  if (screen === "loading") {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (screen === "setup") {
    return (
      <div style={{ padding: "2rem" }}>
        <CredentialsForm onSave={handleCredentialsSaved} />
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <PostForm />
      <div style={{ marginTop: "2rem" }}>
        <button onClick={handleShowSettings} type="button">
          Edit Credentials
        </button>
      </div>
    </div>
  );
}

export default App;
