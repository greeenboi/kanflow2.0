#[cfg_attr(mobile, tauri::mobile_entry_point)]
use tauri_plugin_sql::{Migration, MigrationKind};
mod commands;

pub fn run() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "Create boards table",
            sql: "
                CREATE TABLE boards (
                    id INTEGER PRIMARY KEY,
                    user_id INTEGER NOT NULL,
                    name TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
                    description TEXT,
                    owner_id INTEGER NOT NULL,
                    is_archived BOOLEAN DEFAULT FALSE,
                    visibility TEXT DEFAULT 'private',
                    background_color TEXT DEFAULT '#FFFFFF',
                    board_type TEXT DEFAULT 'kanban',
                    due_date DATE,
                    labels_enabled BOOLEAN DEFAULT TRUE,
                    default_user_roles TEXT,
                    CHECK (board_type IN ('kanban', 'scrum', 'scrumban')),
                    CHECK (visibility IN ('private', 'public', 'team'))
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "Create tasks table",
            sql: "
                CREATE TABLE tasks (
                    id INTEGER PRIMARY KEY,
                    board_id INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    description TEXT,
                    assigned_to INTEGER,
                    markdown_content TEXT,
                    time_to_complete TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
                    due_date DATE,
                    priority TEXT DEFAULT 'medium',
                    status TEXT DEFAULT 'todo',
                    labels TEXT,
                    comments_enabled BOOLEAN DEFAULT TRUE,
                    attachments TEXT,
                    checklist TEXT,
                    parent_task_id INTEGER,
                    estimated_time INTEGER,
                    actual_time INTEGER,
                    order_num INTEGER,
                    column_id INTEGER,
                    CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
                    CHECK (status IN ('todo', 'in_progress', 'done', 'blocked', 'archived'))
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "Create users table",
            sql: "
                CREATE TABLE users (
                    id INTEGER PRIMARY KEY,
                    username TEXT NOT NULL,
                    password TEXT NOT NULL,
                    name TEXT NOT NULL,
                    first_name TEXT,
                    last_name TEXT,
                    email TEXT
                );
            ",
            kind: MigrationKind::Up,
        },
    ];

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
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_sql::Builder::new().add_migrations("sqlite:kanflow.db", migrations).build())
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
