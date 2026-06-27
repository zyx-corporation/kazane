use serde::{Deserialize, Serialize};
use tauri::Manager;
use tauri_plugin_sql::{Migration, MigrationKind};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WorkItemRow {
    pub id: String,
    pub title: String,
    pub domain: String,
    pub assignee: String,
    pub col: String,
    pub status: String,
    pub risk: String,
    pub context_id: String,
    pub next_action: String,
    pub gate: String,
    pub rde: bool,
    pub morning: bool,
    pub bounced: bool,
    pub gate_perm: String,
    pub gate_stops: String,
    pub ctx_json: String,
    pub ho_json: String,
    pub ev_json: String,
    pub rde_audit_json: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ContextCardRow {
    pub id: String,
    pub title: String,
    pub question: String,
    pub purpose: String,
    pub context: String,
    pub constraint: String,
    pub past: String,
    pub related_wi_json: String,
    pub related_ev_json: String,
    pub unresolved_json: String,
    pub next_policy: String,
    pub created_at: String,
    pub updated_at: String,
}

fn migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "create_work_items",
            sql: "
                CREATE TABLE IF NOT EXISTS work_items (
                    id TEXT PRIMARY KEY NOT NULL,
                    title TEXT NOT NULL DEFAULT '',
                    domain TEXT NOT NULL DEFAULT '',
                    assignee TEXT NOT NULL DEFAULT '',
                    col TEXT NOT NULL DEFAULT 'inbox',
                    status TEXT NOT NULL DEFAULT '',
                    risk TEXT NOT NULL DEFAULT '低',
                    context_id TEXT NOT NULL DEFAULT '',
                    next_action TEXT NOT NULL DEFAULT '',
                    gate TEXT NOT NULL DEFAULT '',
                    rde INTEGER NOT NULL DEFAULT 0,
                    morning INTEGER NOT NULL DEFAULT 0,
                    bounced INTEGER NOT NULL DEFAULT 0,
                    gate_perm TEXT NOT NULL DEFAULT '',
                    gate_stops TEXT NOT NULL DEFAULT '',
                    ctx_json TEXT NOT NULL DEFAULT '{}',
                    ho_json TEXT NOT NULL DEFAULT '{}',
                    ev_json TEXT NOT NULL DEFAULT '[]',
                    rde_audit_json TEXT,
                    created_at TEXT NOT NULL DEFAULT (datetime('now')),
                    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
                );
                CREATE TABLE IF NOT EXISTS context_cards (
                    id TEXT PRIMARY KEY NOT NULL,
                    title TEXT NOT NULL DEFAULT '',
                    question TEXT NOT NULL DEFAULT '',
                    purpose TEXT NOT NULL DEFAULT '',
                    context TEXT NOT NULL DEFAULT '',
                    constraint_text TEXT NOT NULL DEFAULT '',
                    past TEXT NOT NULL DEFAULT '',
                    related_wi_json TEXT NOT NULL DEFAULT '[]',
                    related_ev_json TEXT NOT NULL DEFAULT '[]',
                    unresolved_json TEXT NOT NULL DEFAULT '[]',
                    next_policy TEXT NOT NULL DEFAULT '',
                    created_at TEXT NOT NULL DEFAULT (datetime('now')),
                    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
                );
            ",
            kind: MigrationKind::Up,
        },
    ]
}

#[tauri::command]
fn app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:kazane.db", migrations())
                .build(),
        )
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![app_version])
        .run(tauri::generate_context!())
        .expect("error while running kazane");
}
