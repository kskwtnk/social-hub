import { useState } from 'react';
import { PlatformCredentials } from '../lib/types';
import { saveCredentials } from '../lib/api';

interface CredentialsFormProps {
  onSave: () => void;
}

export default function CredentialsForm({ onSave }: CredentialsFormProps) {
  const [credentials, setCredentials] = useState<PlatformCredentials>({
    bluesky_identifier: '',
    bluesky_app_password: '',
    x_consumer_key: '',
    x_consumer_secret: '',
    x_access_token: '',
    x_access_token_secret: '',
    threads_user_id: '',
    threads_access_token: '',
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
      setError(err instanceof Error ? err.message : 'Failed to save credentials');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>Setup Credentials</h1>
      <p>Enter your social media credentials. They will be securely stored in your system keychain.</p>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h2>Bluesky</h2>
        <div>
          <label>
            Identifier (handle or email):
            <input
              type="text"
              value={credentials.bluesky_identifier}
              onChange={(e) => setCredentials({ ...credentials, bluesky_identifier: e.target.value })}
              placeholder="username.bsky.social"
            />
          </label>
        </div>
        <div>
          <label>
            App Password:
            <input
              type="password"
              value={credentials.bluesky_app_password}
              onChange={(e) => setCredentials({ ...credentials, bluesky_app_password: e.target.value })}
            />
          </label>
        </div>

        <h2>X (Twitter)</h2>
        <div>
          <label>
            Consumer Key:
            <input
              type="text"
              value={credentials.x_consumer_key}
              onChange={(e) => setCredentials({ ...credentials, x_consumer_key: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Consumer Secret:
            <input
              type="password"
              value={credentials.x_consumer_secret}
              onChange={(e) => setCredentials({ ...credentials, x_consumer_secret: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Access Token:
            <input
              type="text"
              value={credentials.x_access_token}
              onChange={(e) => setCredentials({ ...credentials, x_access_token: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Access Token Secret:
            <input
              type="password"
              value={credentials.x_access_token_secret}
              onChange={(e) => setCredentials({ ...credentials, x_access_token_secret: e.target.value })}
            />
          </label>
        </div>

        <h2>Threads</h2>
        <div>
          <label>
            User ID:
            <input
              type="text"
              value={credentials.threads_user_id}
              onChange={(e) => setCredentials({ ...credentials, threads_user_id: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            Access Token:
            <input
              type="password"
              value={credentials.threads_access_token}
              onChange={(e) => setCredentials({ ...credentials, threads_access_token: e.target.value })}
            />
          </label>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Credentials'}
        </button>
      </form>
    </div>
  );
}
