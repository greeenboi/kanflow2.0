#[cfg_attr(mobile, tauri::mobile_entry_point)]

mod commands;

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
        .plugin(tauri_plugin_single_instance::init(|_app, argv, _cwd| {
            println!("a new app instance was opened with {argv:?} and the deep link event was already triggered");
            
            // when defining deep link schemes at runtime, you must also check `argv` here
          }))
        .plugin(tauri_plugin_deep_link::init())
        .setup(|app| {
            #[cfg(any(windows, target_os = "windows"))]
            {
                use tauri_plugin_deep_link::DeepLinkExt;
                app.deep_link().register_all()?;
            }
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(log_plugin)
        .invoke_handler(tauri::generate_handler![commands::open_link_on_click])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
