import { useState } from 'react';
import { PostResult } from '../lib/types';
import { postToBluesky, postToX, postToThreads, postToAll } from '../lib/api';

export default function PostForm() {
  const [message, setMessage] = useState('');
  const [posting, setPosting] = useState(false);
  const [results, setResults] = useState<PostResult[]>([]);

  const handlePost = async (platform: 'bluesky' | 'x' | 'threads' | 'all') => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    setPosting(true);
    setResults([]);

    try {
      let postResults: PostResult[] = [];

      switch (platform) {
        case 'bluesky':
          postResults = [await postToBluesky(message)];
          break;
        case 'x':
          postResults = [await postToX(message)];
          break;
        case 'threads':
          postResults = [await postToThreads(message)];
          break;
        case 'all':
          postResults = await postToAll(message);
          break;
      }

      setResults(postResults);
    } catch (err) {
      setResults([
        {
          platform: platform === 'all' ? 'All' : platform,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        },
      ]);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div>
      <h1>Post to Social Media</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          Message:
          <br />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            style={{ width: '100%', maxWidth: '600px' }}
            placeholder="What's on your mind?"
            disabled={posting}
          />
        </label>
        <div style={{ marginTop: '0.5rem', color: '#666' }}>
          {message.length} characters
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => handlePost('all')} disabled={posting}>
          Post to All Platforms
        </button>
        <button onClick={() => handlePost('bluesky')} disabled={posting}>
          Post to Bluesky
        </button>
        <button onClick={() => handlePost('x')} disabled={posting}>
          Post to X
        </button>
        <button onClick={() => handlePost('threads')} disabled={posting}>
          Post to Threads
        </button>
      </div>

      {posting && <div>Posting...</div>}

      {results.length > 0 && (
        <div>
          <h2>Results</h2>
          {results.map((result, index) => (
            <div
              key={index}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: result.success ? '#e8f5e9' : '#ffebee',
              }}
            >
              <h3>{result.platform}</h3>
              {result.success ? (
                <div>
                  <div style={{ color: 'green' }}>✓ Success</div>
                  {result.url && (
                    <div>
                      <a href={result.url} target="_blank" rel="noopener noreferrer">
                        View Post
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div style={{ color: 'red' }}>✗ Failed</div>
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
