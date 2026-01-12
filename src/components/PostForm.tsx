import { useState } from "react";
import { postToBluesky, postToThreads, postToX } from "../lib/api";
import type { PostResult } from "../lib/types";

type PlatformKey = "bluesky" | "x" | "threads";
type SelectedPlatforms = Record<PlatformKey, boolean>;

export default function PostForm() {
  const [message, setMessage] = useState("");
  const [posting, setPosting] = useState(false);
  const [results, setResults] = useState<PostResult[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SelectedPlatforms>(
    {
      bluesky: true,
      threads: true,
      x: true,
    },
  );

  // Select All の状態を計算
  const allSelected =
    selectedPlatforms.bluesky &&
    selectedPlatforms.threads &&
    selectedPlatforms.x;

  const someSelected =
    selectedPlatforms.bluesky ||
    selectedPlatforms.threads ||
    selectedPlatforms.x;

  // Select All ハンドラー
  const handleSelectAll = () => {
    const newValue = !allSelected;
    setSelectedPlatforms({
      bluesky: newValue,
      threads: newValue,
      x: newValue,
    });
  };

  // 個別チェックボックスハンドラー
  const handlePlatformToggle = (platform: PlatformKey) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  const handlePost = async () => {
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    // 選択されたプラットフォームを抽出
    const selectedKeys = (
      Object.keys(selectedPlatforms) as PlatformKey[]
    ).filter((key) => selectedPlatforms[key]);

    if (selectedKeys.length === 0) {
      alert("Please select at least one platform");
      return;
    }

    setPosting(true);
    setResults([]);

    try {
      // プラットフォームごとのAPI関数マッピング
      const platformApis: Record<
        PlatformKey,
        (msg: string) => Promise<PostResult>
      > = {
        bluesky: postToBluesky,
        threads: postToThreads,
        x: postToX,
      };

      // 選択されたプラットフォームに並行投稿
      const postPromises = selectedKeys.map((platform) =>
        platformApis[platform](message),
      );

      const postResults = await Promise.all(postPromises);
      setResults(postResults);
    } catch (err) {
      setResults([
        {
          error: err instanceof Error ? err.message : "Unknown error",
          platform: "Multiple",
          success: false,
        },
      ]);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div>
      <h1>Post to Social Media</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Message:
          <br />
          <textarea
            disabled={posting}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's on your mind?"
            rows={6}
            style={{ maxWidth: "600px", width: "100%" }}
            value={message}
          />
        </label>
        <div style={{ color: "#666", marginTop: "0.5rem" }}>
          {message.length} characters
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        {/* Platform Selection */}
        <div
          style={{
            margin: "0 auto 1rem auto",
            maxWidth: "600px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontWeight: "600",
              marginBottom: "0.5rem",
            }}
          >
            Select Platforms:
          </div>

          {/* Select All Checkbox */}
          <div style={{ marginBottom: "0.5rem" }}>
            <label
              style={{
                alignItems: "center",
                cursor: posting ? "not-allowed" : "pointer",
                display: "flex",
                opacity: posting ? 0.5 : 1,
              }}
            >
              <input
                checked={allSelected}
                disabled={posting}
                onChange={handleSelectAll}
                style={{
                  cursor: posting ? "not-allowed" : "pointer",
                  marginRight: "0.5rem",
                }}
                type="checkbox"
              />
              <span style={{ fontWeight: "500" }}>Select All Platforms</span>
            </label>
          </div>

          {/* Individual Platform Checkboxes */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              marginLeft: "1.5rem",
            }}
          >
            <label
              style={{
                alignItems: "center",
                cursor: posting ? "not-allowed" : "pointer",
                display: "flex",
                opacity: posting ? 0.5 : 1,
              }}
            >
              <input
                checked={selectedPlatforms.bluesky}
                disabled={posting}
                onChange={() => handlePlatformToggle("bluesky")}
                style={{
                  cursor: posting ? "not-allowed" : "pointer",
                  marginRight: "0.5rem",
                }}
                type="checkbox"
              />
              <span>Bluesky</span>
            </label>

            <label
              style={{
                alignItems: "center",
                cursor: posting ? "not-allowed" : "pointer",
                display: "flex",
                opacity: posting ? 0.5 : 1,
              }}
            >
              <input
                checked={selectedPlatforms.threads}
                disabled={posting}
                onChange={() => handlePlatformToggle("threads")}
                style={{
                  cursor: posting ? "not-allowed" : "pointer",
                  marginRight: "0.5rem",
                }}
                type="checkbox"
              />
              <span>Threads</span>
            </label>

            <label
              style={{
                alignItems: "center",
                cursor: posting ? "not-allowed" : "pointer",
                display: "flex",
                opacity: posting ? 0.5 : 1,
              }}
            >
              <input
                checked={selectedPlatforms.x}
                disabled={posting}
                onChange={() => handlePlatformToggle("x")}
                style={{
                  cursor: posting ? "not-allowed" : "pointer",
                  marginRight: "0.5rem",
                }}
                type="checkbox"
              />
              <span>X (Twitter)</span>
            </label>
          </div>
        </div>

        {/* Post Button */}
        <button
          disabled={posting || !someSelected}
          onClick={handlePost}
          style={{
            cursor: !someSelected || posting ? "not-allowed" : "pointer",
            opacity: !someSelected && !posting ? 0.5 : 1,
          }}
          type="button"
        >
          Post to Selected Platforms
        </button>
      </div>

      {posting && <div>Posting...</div>}

      {results.length > 0 && (
        <div>
          <h2>Results</h2>
          {results.map((result, index) => (
            <div
              key={`${result.platform}-${index}`}
              style={{
                backgroundColor: result.success ? "#e8f5e9" : "#ffebee",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginBottom: "1rem",
                padding: "1rem",
              }}
            >
              <h3>{result.platform}</h3>
              {result.success ? (
                <div>
                  <div style={{ color: "green" }}>✓ Success</div>
                  {result.url && (
                    <div>
                      <a
                        href={result.url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        View Post
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div style={{ color: "red" }}>✗ Failed</div>
                  {result.error && <div>Error: {result.error}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
