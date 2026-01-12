import { useState } from "react";
import { postToAll, postToBluesky, postToThreads, postToX } from "../lib/api";
import type { PostResult } from "../lib/types";

export default function PostForm() {
  const [message, setMessage] = useState("");
  const [posting, setPosting] = useState(false);
  const [results, setResults] = useState<PostResult[]>([]);

  const handlePost = async (platform: "bluesky" | "x" | "threads" | "all") => {
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    setPosting(true);
    setResults([]);

    try {
      let postResults: PostResult[] = [];

      switch (platform) {
        case "bluesky":
          postResults = [await postToBluesky(message)];
          break;
        case "x":
          postResults = [await postToX(message)];
          break;
        case "threads":
          postResults = [await postToThreads(message)];
          break;
        case "all":
          postResults = await postToAll(message);
          break;
      }

      setResults(postResults);
    } catch (err) {
      setResults([
        {
          error: err instanceof Error ? err.message : "Unknown error",
          platform: platform === "all" ? "All" : platform,
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
        <button
          disabled={posting}
          onClick={() => handlePost("all")}
          type="button"
        >
          Post to All Platforms
        </button>
        <button
          disabled={posting}
          onClick={() => handlePost("bluesky")}
          type="button"
        >
          Post to Bluesky
        </button>
        <button
          disabled={posting}
          onClick={() => handlePost("x")}
          type="button"
        >
          Post to X
        </button>
        <button
          disabled={posting}
          onClick={() => handlePost("threads")}
          type="button"
        >
          Post to Threads
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
