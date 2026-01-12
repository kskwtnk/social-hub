import { useState } from "react";
import { saveCredentials } from "../lib/api";
import type { PlatformCredentials } from "../lib/types";

interface CredentialsFormProps {
  onSave: () => void;
}

export default function CredentialsForm({ onSave }: CredentialsFormProps) {
  const [credentials, setCredentials] = useState<PlatformCredentials>({
    bluesky_app_password: "",
    bluesky_identifier: "",
    threads_access_token: "",
    threads_user_id: "",
    x_access_token: "",
    x_access_token_secret: "",
    x_consumer_key: "",
    x_consumer_secret: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await saveCredentials(credentials);
      onSave();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save credentials",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>Setup Credentials</h1>
      <p>
        Enter your social media credentials. They will be securely stored in
        your system keychain.
      </p>

      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>Error: {error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <h2>Bluesky</h2>
        <div>
          <label>
            Identifier (handle or email):
            <input
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  bluesky_identifier: e.target.value,
                })
              }
              placeholder="username.bsky.social"
              type="text"
              value={credentials.bluesky_identifier}
            />
          </label>
        </div>
        <div>
          <label>
            App Password:
            <input
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  bluesky_app_password: e.target.value,
                })
              }
              type="password"
              value={credentials.bluesky_app_password}
            />
          </label>
        </div>

        <h2>X (Twitter)</h2>
        <div>
          <label>
            Consumer Key:
            <input
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  x_consumer_key: e.target.value,
                })
              }
              type="text"
              value={credentials.x_consumer_key}
            />
          </label>
        </div>
        <div>
          <label>
            Consumer Secret:
            <input
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  x_consumer_secret: e.target.value,
                })
              }
              type="password"
              value={credentials.x_consumer_secret}
            />
          </label>
        </div>
        <div>
          <label>
            Access Token:
            <input
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  x_access_token: e.target.value,
                })
              }
              type="text"
              value={credentials.x_access_token}
            />
          </label>
        </div>
        <div>
          <label>
            Access Token Secret:
            <input
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  x_access_token_secret: e.target.value,
                })
              }
              type="password"
              value={credentials.x_access_token_secret}
            />
          </label>
        </div>

        <h2>Threads</h2>
        <div>
          <label>
            User ID:
            <input
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  threads_user_id: e.target.value,
                })
              }
              type="text"
              value={credentials.threads_user_id}
            />
          </label>
        </div>
        <div>
          <label>
            Access Token:
            <input
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  threads_access_token: e.target.value,
                })
              }
              type="password"
              value={credentials.threads_access_token}
            />
          </label>
        </div>

        <button disabled={saving} type="submit">
          {saving ? "Saving..." : "Save Credentials"}
        </button>
      </form>
    </div>
  );
}
