mod commands;
mod credentials;
mod platforms;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::post_to_bluesky,
            commands::post_to_x,
            commands::post_to_threads,
            commands::post_to_all,
            commands::save_credentials,
            commands::load_credentials,
            commands::check_credentials_exist,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
