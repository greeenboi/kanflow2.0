#[tauri::command]
pub fn open_link_on_click(url: &str) -> Result<(), String> {
    log::info!("Opening link: {}", url);
    webbrowser::open(url).map_err(|e| e.to_string())
}
