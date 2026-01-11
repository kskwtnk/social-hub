use anyhow::Result;
use serde::{Deserialize, Serialize};

const SERVICE_NAME: &str = "com.social-hub.credentials";

// Create an entry using explicit target for macOS
#[cfg(target_os = "macos")]
fn create_entry(account: &str) -> Result<keyring::Entry> {
    // Use "User" target which maps to Login Keychain on macOS
    keyring::Entry::new_with_target("User", SERVICE_NAME, account)
        .map_err(|e| anyhow::anyhow!("Failed to create entry: {:?}", e))
}

#[cfg(not(target_os = "macos"))]
fn create_entry(account: &str) -> Result<keyring::Entry> {
    Ok(keyring::Entry::new(SERVICE_NAME, account)?)
}

/// Platform credentials structure
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PlatformCredentials {
    pub bluesky_identifier: String,
    pub bluesky_app_password: String,
    pub x_consumer_key: String,
    pub x_consumer_secret: String,
    pub x_access_token: String,
    pub x_access_token_secret: String,
    pub threads_user_id: String,
    pub threads_access_token: String,
}

impl PlatformCredentials {
    /// Load credentials from system keychain
    pub fn load() -> Result<Self> {
        Ok(Self {
            bluesky_identifier: get_credential("bluesky_identifier")?,
            bluesky_app_password: get_credential("bluesky_app_password")?,
            x_consumer_key: get_credential("x_consumer_key")?,
            x_consumer_secret: get_credential("x_consumer_secret")?,
            x_access_token: get_credential("x_access_token")?,
            x_access_token_secret: get_credential("x_access_token_secret")?,
            threads_user_id: get_credential("threads_user_id")?,
            threads_access_token: get_credential("threads_access_token")?,
        })
    }

    /// Save credentials to system keychain
    pub fn save(&self) -> Result<()> {
        set_credential("bluesky_identifier", &self.bluesky_identifier)?;
        set_credential("bluesky_app_password", &self.bluesky_app_password)?;
        set_credential("x_consumer_key", &self.x_consumer_key)?;
        set_credential("x_consumer_secret", &self.x_consumer_secret)?;
        set_credential("x_access_token", &self.x_access_token)?;
        set_credential("x_access_token_secret", &self.x_access_token_secret)?;
        set_credential("threads_user_id", &self.threads_user_id)?;
        set_credential("threads_access_token", &self.threads_access_token)?;
        Ok(())
    }

    /// Check if credentials exist in keychain
    pub fn exist() -> bool {
        // Check if at least one platform's credentials exist
        get_credential("bluesky_identifier").is_ok()
            || get_credential("x_consumer_key").is_ok()
            || get_credential("threads_user_id").is_ok()
    }
}

/// Get a credential from system keychain
fn get_credential(key: &str) -> Result<String> {
    let entry = create_entry(key)?;
    entry
        .get_password()
        .map_err(|e| anyhow::anyhow!("Failed to retrieve {} from keychain: {:?}", key, e))
}

/// Set a credential in system keychain
fn set_credential(key: &str, value: &str) -> Result<()> {
    let entry = create_entry(key)?;
    entry
        .set_password(value)
        .map_err(|e| anyhow::anyhow!("Failed to save {} to keychain: {:?}", key, e))
}
