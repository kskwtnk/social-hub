use anyhow::{Context, Result};
use reqwest::Client;
use reqwest_oauth1::{OAuthClientProvider, Secrets};
use serde_json::json;

/// Post a message to X (Twitter)
/// Returns the URL of the created tweet
pub async fn post(
    message: &str,
    consumer_key: &str,
    consumer_secret: &str,
    access_token: &str,
    access_token_secret: &str,
) -> Result<String> {
    // Create OAuth1 secrets
    let secrets = Secrets::new(consumer_key, consumer_secret)
        .token(access_token, access_token_secret);

    // Create HTTP client
    let client = Client::new();

    // Create tweet payload
    let payload = json!({
        "text": message
    });
    let payload_str = serde_json::to_string(&payload)?;

    // X API v2 endpoint for creating tweets
    let url = "https://api.twitter.com/2/tweets";

    // Send POST request with OAuth1 signature
    let response = client
        .oauth1(secrets)
        .post(url)
        .header("Content-Type", "application/json")
        .body(payload_str)
        .send()
        .await
        .context("Failed to send request to X API")?;

    // Check response status
    let status = response.status();
    if !status.is_success() {
        let error_text = response
            .text()
            .await
            .unwrap_or_else(|_| "Unknown error".to_string());
        return Err(anyhow::anyhow!(
            "X API returned error {}: {}",
            status,
            error_text
        ));
    }

    // Parse response
    let response_json: serde_json::Value = response
        .json()
        .await
        .context("Failed to parse X API response")?;

    // Extract tweet ID
    let tweet_id = response_json
        .get("data")
        .and_then(|data| data.get("id"))
        .and_then(|id| id.as_str())
        .context("Failed to extract tweet ID from response")?;

    // Construct tweet URL
    let tweet_url = format!("https://x.com/i/web/status/{}", tweet_id);

    Ok(tweet_url)
}
