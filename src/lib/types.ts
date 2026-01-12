// Result of posting to a platform
export interface PostResult {
  platform: string;
  success: boolean;
  url?: string;
  error?: string;
}

// Platform credentials
export interface PlatformCredentials {
  bluesky_identifier: string;
  bluesky_app_password: string;
  x_consumer_key: string;
  x_consumer_secret: string;
  x_access_token: string;
  x_access_token_secret: string;
  threads_user_id: string;
  threads_access_token: string;
}

// Screen type for app state management
export type Screen = "loading" | "setup" | "main";
