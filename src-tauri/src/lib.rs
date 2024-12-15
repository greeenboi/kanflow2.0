#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let log_plugin = if cfg!(debug_assertions) {
        tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build()
    } else {
        tauri_plugin_log::Builder::new()
            .target(tauri_plugin_log::Target::new(
                tauri_plugin_log::TargetKind::Stdout,
            ))
            .build()
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(log_plugin)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
