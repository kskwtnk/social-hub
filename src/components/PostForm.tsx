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

  const someSelected =
    selectedPlatforms.bluesky ||
    selectedPlatforms.threads ||
    selectedPlatforms.x;

  // Platform checkbox toggle handler
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

    // Extract selected platforms
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
      // Map platform keys to their API functions
      const platformApis: Record<
        PlatformKey,
        (msg: string) => Promise<PostResult>
      > = {
        bluesky: postToBluesky,
        threads: postToThreads,
        x: postToX,
      };

      // Post to all selected platforms in parallel
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
    <div className="grid gap-y-5">
      <h1 className="font-bold text-2xl">Post to Social Media</h1>

      <div className="grid gap-y-1">
        <div>
          <label className="leading-loose" htmlFor="message">
            Message:
          </label>
          <textarea
            className="w-full rounded-lg border border-stone-200 bg-white p-2"
            disabled={posting}
            id="message"
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's on your mind?"
            rows={5}
            value={message}
          />
        </div>
        <span className="text-sm text-stone-600">
          {message.length} characters
        </span>
      </div>

      <div className="flex items-center justify-between">
        {/* Platform Selection */}
        <div className="flex items-center gap-x-4">
          {/* Individual Platform Checkboxes */}
          <label
            className={`flex items-center gap-x-1 ${posting ? "cursor-not-allowed" : "cursor-pointer"}
                ${posting ? "opacity-50" : ""}`}
          >
            <div className="grid size-4 place-items-center">
              <input
                checked={selectedPlatforms.bluesky}
                className="peer col-start-1 col-end-2 row-start-1 row-end-2 size-4 appearance-none rounded border border-orange-400 bg-linear-to-b bg-white transition-colors checked:border-transparent checked:from-orange-400 checked:to-red-600 not-checked:hover:bg-orange-100 checked:hover:bg-orange-700 checked:[box-shadow:inset_0_0_0_1px_var(--color-orange-500),inset_0_0_--spacing(1)_var(--color-orange-200),0_0_--spacing(3)_--alpha(var(--color-orange-500)/50%)]"
                disabled={posting}
                onChange={() => handlePlatformToggle("bluesky")}
                type="checkbox"
              />
              <span className="pointer-events-none col-start-1 col-end-2 row-start-1 row-end-2 text-white opacity-0 peer-checked:opacity-100">
                <svg
                  aria-hidden="true"
                  className="size-3.5"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="1"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
              </span>
            </div>
            <span>Bluesky</span>
          </label>
          <label
            className={`flex items-center gap-x-1 ${posting ? "cursor-not-allowed" : "cursor-pointer"}
                ${posting ? "opacity-50" : ""}`}
          >
            <div className="grid size-4 place-items-center">
              <input
                checked={selectedPlatforms.threads}
                className="peer col-start-1 col-end-2 row-start-1 row-end-2 size-4 appearance-none rounded border border-orange-400 bg-linear-to-b bg-white transition-colors checked:border-transparent checked:from-orange-400 checked:to-red-600 not-checked:hover:bg-orange-100 checked:hover:bg-orange-700 checked:[box-shadow:inset_0_0_0_1px_var(--color-orange-500),inset_0_0_--spacing(1)_var(--color-orange-200),0_0_--spacing(3)_--alpha(var(--color-orange-500)/50%)]"
                disabled={posting}
                onChange={() => handlePlatformToggle("threads")}
                type="checkbox"
              />
              <span className="pointer-events-none col-start-1 col-end-2 row-start-1 row-end-2 text-white opacity-0 peer-checked:opacity-100">
                <svg
                  aria-hidden="true"
                  className="size-3.5"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="1"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
              </span>
            </div>
            <span>Threads</span>
          </label>
          <label
            className={`flex items-center gap-x-1 ${posting ? "cursor-not-allowed" : "cursor-pointer"}
                ${posting ? "opacity-50" : ""}`}
          >
            <div className="grid size-4 place-items-center">
              <input
                checked={selectedPlatforms.x}
                className="peer col-start-1 col-end-2 row-start-1 row-end-2 size-4 appearance-none rounded border border-orange-400 bg-linear-to-b bg-white transition-colors checked:border-transparent checked:from-orange-400 checked:to-red-600 not-checked:hover:bg-orange-100 checked:hover:bg-orange-700 checked:[box-shadow:inset_0_0_0_1px_var(--color-orange-500),inset_0_0_--spacing(1)_var(--color-orange-200),0_0_--spacing(3)_--alpha(var(--color-orange-500)/50%)]"
                disabled={posting}
                onChange={() => handlePlatformToggle("x")}
                type="checkbox"
              />
              <span className="pointer-events-none col-start-1 col-end-2 row-start-1 row-end-2 text-white opacity-0 peer-checked:opacity-100">
                <svg
                  aria-hidden="true"
                  className="size-3.5"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="1"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                </svg>
              </span>
            </div>
            <span>X</span>
          </label>
        </div>

        {/* Post Button */}
        <button
          className="rounded-full bg-linear-to-b from-orange-400 to-red-600 px-5 py-1.5 font-bold text-lg text-white transition-colors [box-shadow:inset_0_0_0_1px_var(--color-orange-500),inset_0_0_--spacing(4)_var(--color-orange-200),0_0_--spacing(6)_--alpha(var(--color-orange-500)/50%)] not-disabled:hover:bg-orange-700"
          disabled={posting || !someSelected}
          onClick={handlePost}
          type="button"
        >
          Post
        </button>
      </div>

      {posting && <p className="text-stone-600">Posting...</p>}

      {results.length > 0 && (
        <div className="grid gap-y-4">
          <h2 className="font-bold text-xl">Results</h2>
          <div className="grid grid-cols-3 gap-x-3">
            {results.map((result, index) => (
              <div
                className={`flex flex-col justify-between gap-y-3 rounded-lg p-3 ${result.success ? "bg-green-500/20" : "bg-red-500/20"}`}
                key={`${result.platform}-${index}`}
              >
                {result.success ? (
                  <div className="contents">
                    <h3>✅ {result.platform}</h3>
                    {result.url && (
                      <div>
                        <a
                          className="text-sm underline hover:text-green-900"
                          href={result.url}
                          target="_blank"
                        >
                          View Post
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="contents">
                    <h3>❌ {result.platform}</h3>
                    {result.error && (
                      <p className="text-sm">Error: {result.error}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
