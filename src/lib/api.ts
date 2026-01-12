import { invoke } from "@tauri-apps/api/core";
import type { PlatformCredentials, PostResult } from "./types";

// Post to Bluesky
export async function postToBluesky(message: string): Promise<PostResult> {
  return await invoke("post_to_bluesky", { message });
}

// Post to X (Twitter)
export async function postToX(message: string): Promise<PostResult> {
  return await invoke("post_to_x", { message });
}

// Post to Threads
export async function postToThreads(message: string): Promise<PostResult> {
  return await invoke("post_to_threads", { message });
}

// Post to all platforms
export async function postToAll(message: string): Promise<PostResult[]> {
  return await invoke("post_to_all", { message });
}

// Save credentials to keychain
export async function saveCredentials(
  creds: PlatformCredentials,
): Promise<void> {
  await invoke("save_credentials", { creds });
}

// Load credentials from keychain
export async function loadCredentials(): Promise<PlatformCredentials> {
  return await invoke("load_credentials");
}

// Check if credentials exist in keychain
export async function checkCredentials(): Promise<boolean> {
  return await invoke("check_credentials_exist");
}
