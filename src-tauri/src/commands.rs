use crate::credentials::PlatformCredentials;
use crate::platforms::{bluesky, threads, x};
use serde::Serialize;

/// Result of posting to a platform
#[derive(Debug, Serialize, Clone)]
pub struct PostResult {
    pub platform: String,
    pub success: bool,
    pub url: Option<String>,
    pub error: Option<String>,
}

/// Post to Bluesky
#[tauri::command]
pub async fn post_to_bluesky(message: String) -> Result<PostResult, String> {
    let creds = PlatformCredentials::load().map_err(|e| e.to_string())?;

    match bluesky::post(
        &message,
        &creds.bluesky_identifier,
        &creds.bluesky_app_password,
    )
    .await
    {
        Ok(url) => Ok(PostResult {
            platform: "Bluesky".to_string(),
            success: true,
            url: Some(url),
            error: None,
        }),
        Err(e) => Ok(PostResult {
            platform: "Bluesky".to_string(),
            success: false,
            url: None,
            error: Some(e.to_string()),
        }),
    }
}

/// Post to X (Twitter)
#[tauri::command]
pub async fn post_to_x(message: String) -> Result<PostResult, String> {
    let creds = PlatformCredentials::load().map_err(|e| e.to_string())?;

    match x::post(
        &message,
        &creds.x_consumer_key,
        &creds.x_consumer_secret,
        &creds.x_access_token,
        &creds.x_access_token_secret,
    )
    .await
    {
        Ok(url) => Ok(PostResult {
            platform: "X".to_string(),
            success: true,
            url: Some(url),
            error: None,
        }),
        Err(e) => Ok(PostResult {
            platform: "X".to_string(),
            success: false,
            url: None,
            error: Some(e.to_string()),
        }),
    }
}

/// Post to Threads
#[tauri::command]
pub async fn post_to_threads(message: String) -> Result<PostResult, String> {
    let creds = PlatformCredentials::load().map_err(|e| e.to_string())?;

    match threads::post(
        &message,
        &creds.threads_user_id,
        &creds.threads_access_token,
    )
    .await
    {
        Ok(url) => Ok(PostResult {
            platform: "Threads".to_string(),
            success: true,
            url: Some(url),
            error: None,
        }),
        Err(e) => Ok(PostResult {
            platform: "Threads".to_string(),
            success: false,
            url: None,
            error: Some(e.to_string()),
        }),
    }
}

/// Post to all platforms simultaneously
#[tauri::command]
pub async fn post_to_all(message: String) -> Vec<PostResult> {
    let creds = match PlatformCredentials::load() {
        Ok(c) => c,
        Err(e) => {
            return vec![PostResult {
                platform: "All".to_string(),
                success: false,
                url: None,
                error: Some(format!("Failed to load credentials: {}", e)),
            }]
        }
    };

    let message_clone = message.clone();
    let bluesky_creds = (
        creds.bluesky_identifier.clone(),
        creds.bluesky_app_password.clone(),
    );
    let bluesky_handle = tokio::spawn(async move {
        match bluesky::post(&message_clone, &bluesky_creds.0, &bluesky_creds.1).await {
            Ok(url) => PostResult {
                platform: "Bluesky".to_string(),
                success: true,
                url: Some(url),
                error: None,
            },
            Err(e) => PostResult {
                platform: "Bluesky".to_string(),
                success: false,
                url: None,
                error: Some(e.to_string()),
            },
        }
    });

    let message_clone = message.clone();
    let x_creds = (
        creds.x_consumer_key.clone(),
        creds.x_consumer_secret.clone(),
        creds.x_access_token.clone(),
        creds.x_access_token_secret.clone(),
    );
    let x_handle = tokio::spawn(async move {
        match x::post(
            &message_clone,
            &x_creds.0,
            &x_creds.1,
            &x_creds.2,
            &x_creds.3,
        )
        .await
        {
            Ok(url) => PostResult {
                platform: "X".to_string(),
                success: true,
                url: Some(url),
                error: None,
            },
            Err(e) => PostResult {
                platform: "X".to_string(),
                success: false,
                url: None,
                error: Some(e.to_string()),
            },
        }
    });

    let threads_creds = (
        creds.threads_user_id.clone(),
        creds.threads_access_token.clone(),
    );
    let threads_handle = tokio::spawn(async move {
        match threads::post(&message, &threads_creds.0, &threads_creds.1).await {
            Ok(url) => PostResult {
                platform: "Threads".to_string(),
                success: true,
                url: Some(url),
                error: None,
            },
            Err(e) => PostResult {
                platform: "Threads".to_string(),
                success: false,
                url: None,
                error: Some(e.to_string()),
            },
        }
    });

    // Wait for all platforms to complete
    let bluesky_result = bluesky_handle.await.unwrap_or_else(|_| PostResult {
        platform: "Bluesky".to_string(),
        success: false,
        url: None,
        error: Some("Task panicked".to_string()),
    });

    let x_result = x_handle.await.unwrap_or_else(|_| PostResult {
        platform: "X".to_string(),
        success: false,
        url: None,
        error: Some("Task panicked".to_string()),
    });

    let threads_result = threads_handle.await.unwrap_or_else(|_| PostResult {
        platform: "Threads".to_string(),
        success: false,
        url: None,
        error: Some("Task panicked".to_string()),
    });

    vec![bluesky_result, x_result, threads_result]
}

/// Save credentials to keychain
#[tauri::command]
pub async fn save_credentials(creds: PlatformCredentials) -> Result<(), String> {
    creds.save().map_err(|e| e.to_string())
}

/// Load credentials from keychain
#[tauri::command]
pub async fn load_credentials() -> Result<PlatformCredentials, String> {
    PlatformCredentials::load().map_err(|e| e.to_string())
}

/// Check if credentials exist in keychain
#[tauri::command]
pub async fn check_credentials_exist() -> bool {
    PlatformCredentials::exist()
}
