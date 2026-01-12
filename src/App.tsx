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
    <div className="grid grow grid-rows-[1fr_auto]">
      <div className="p-8">
        <PostForm />
      </div>
      <div className="border-stone-300 border-t px-8 py-4">
        <button
          className="rounded text-sm text-stone-600 underline hover:outline-offset-2!"
          onClick={handleShowSettings}
          type="button"
        >
          Edit Credentials
        </button>
      </div>
    </div>
  );
}

export default App;
