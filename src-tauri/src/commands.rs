use tauri::Manager;

#[tauri::command]
pub fn open_link_on_click(url: &str) -> Result<(), String> {
    log::info!("Opening link: {}", url);
    webbrowser::open(url).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn open_app(app_handle: tauri::AppHandle) {
    // Logic to open the app window
    if let Some(window) = app_handle.get_webview_window("main") {
        window.show().unwrap();
        window.set_focus().unwrap();
    }
}

#[tauri::command]
pub fn create_new_board() {
    // Logic to create a new board
    // ...
}

#[tauri::command]
pub fn create_new_task() {
    // Logic to create a new task
    // ...
}
