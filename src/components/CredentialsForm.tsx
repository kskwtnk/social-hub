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
    <div className="grid gap-y-8">
      <div className="grid gap-y-1">
        <h1 className="font-bold text-2xl">Setup Credentials</h1>
        <p className="text-stone-600">
          Enter your social media credentials. They will be securely stored in
          your system keychain.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/20 p-3 text-red-600">
          Error: {error}
        </div>
      )}

      <form className="grid gap-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-[--spacing(56)_1fr] gap-y-3">
          <h2 className="font-bold text-lg">Bluesky</h2>
          <label className="col-span-2 grid grid-cols-subgrid items-center">
            <span className="text-sm">Identifier (handle or email):</span>
            <input
              className="rounded-lg bg-white px-2 py-1"
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
          <label className="col-span-2 grid grid-cols-subgrid items-center">
            <span className="text-sm">App Password:</span>
            <input
              className="rounded-lg bg-white px-2 py-1"
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

        <div className="grid grid-cols-[--spacing(56)_1fr] gap-y-3">
          <h2 className="font-bold text-lg">Threads</h2>
          <label className="col-span-2 grid grid-cols-subgrid items-center">
            <span className="text-sm">User ID:</span>
            <input
              className="rounded-lg bg-white px-2 py-1"
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
          <label className="col-span-2 grid grid-cols-subgrid items-center">
            <span className="text-sm">Access Token:</span>
            <input
              className="rounded-lg bg-white px-2 py-1"
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

        <div className="grid grid-cols-[--spacing(56)_1fr] gap-y-3">
          <h2 className="font-bold text-lg">X (Twitter)</h2>
          <label className="col-span-2 grid grid-cols-subgrid items-center">
            <span className="text-sm">Consumer Key:</span>
            <input
              className="rounded-lg bg-white px-2 py-1"
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
          <label className="col-span-2 grid grid-cols-subgrid items-center">
            <span className="text-sm">Consumer Secret:</span>
            <input
              className="rounded-lg bg-white px-2 py-1"
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
          <label className="col-span-2 grid grid-cols-subgrid items-center">
            <span className="text-sm">Access Token:</span>
            <input
              className="rounded-lg bg-white px-2 py-1"
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
          <label className="col-span-2 grid grid-cols-subgrid items-center">
            <span className="text-sm">Access Token Secret:</span>
            <input
              className="rounded-lg bg-white px-2 py-1"
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

        <button
          className="justify-self-start rounded-full bg-linear-to-b from-orange-400 to-red-600 px-5 py-1.5 font-bold text-lg text-white transition-colors [box-shadow:inset_0_0_0_1px_var(--color-orange-500),inset_0_0_--spacing(4)_var(--color-orange-200),0_0_--spacing(6)_--alpha(var(--color-orange-500)/50%)] not-disabled:hover:bg-orange-700"
          disabled={saving}
          type="submit"
        >
          {saving ? "Saving..." : "Save Credentials"}
        </button>
      </form>
    </div>
  );
}
