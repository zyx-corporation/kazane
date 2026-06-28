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

#[derive(Debug, Serialize)]
pub struct AgentDirs {
    pub tasks_dir: String,
    pub handoffs_dir: String,
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
        Migration {
            version: 2,
            description: "add_agent_fields",
            sql: "
                ALTER TABLE work_items ADD COLUMN agent_picked_up_at TEXT DEFAULT NULL;
                ALTER TABLE work_items ADD COLUMN agent_escalated INTEGER DEFAULT 0;
                ALTER TABLE work_items ADD COLUMN escalation_reason TEXT DEFAULT '';
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create_handoff_notes",
            sql: "
                CREATE TABLE IF NOT EXISTS handoff_notes (
                    id TEXT PRIMARY KEY NOT NULL,
                    wi TEXT NOT NULL DEFAULT '',
                    assignee TEXT NOT NULL DEFAULT '',
                    domain TEXT NOT NULL DEFAULT '',
                    did TEXT NOT NULL DEFAULT '',
                    judged TEXT NOT NULL DEFAULT '',
                    couldnt TEXT NOT NULL DEFAULT '',
                    uncertain TEXT NOT NULL DEFAULT '',
                    bounce TEXT NOT NULL DEFAULT '',
                    next TEXT NOT NULL DEFAULT '',
                    upd_ctx TEXT NOT NULL DEFAULT '',
                    ev_json TEXT NOT NULL DEFAULT '[]',
                    gate TEXT NOT NULL DEFAULT '',
                    ask TEXT NOT NULL DEFAULT '',
                    escalated INTEGER DEFAULT 0,
                    escalation_reason TEXT DEFAULT '',
                    created_at TEXT NOT NULL DEFAULT (datetime('now'))
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "create_events",
            sql: "
                CREATE TABLE IF NOT EXISTS events (
                    id TEXT PRIMARY KEY NOT NULL,
                    wi_id TEXT NOT NULL,
                    event_type TEXT NOT NULL,
                    from_col TEXT NOT NULL DEFAULT '',
                    to_col TEXT NOT NULL DEFAULT '',
                    actor TEXT NOT NULL DEFAULT '',
                    note TEXT NOT NULL DEFAULT '',
                    created_at TEXT NOT NULL DEFAULT (datetime('now'))
                );
                CREATE INDEX IF NOT EXISTS idx_events_wi_id ON events(wi_id, created_at);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "create_evidence_log",
            sql: "
                CREATE TABLE IF NOT EXISTS evidence_log (
                    id TEXT PRIMARY KEY NOT NULL,
                    type TEXT NOT NULL DEFAULT '',
                    label TEXT NOT NULL DEFAULT '',
                    trust TEXT NOT NULL DEFAULT '中',
                    store TEXT NOT NULL DEFAULT '',
                    wi_id TEXT NOT NULL DEFAULT '',
                    ho_id TEXT NOT NULL DEFAULT '',
                    ctx_id TEXT NOT NULL DEFAULT '',
                    note TEXT NOT NULL DEFAULT '',
                    created_at TEXT NOT NULL DEFAULT (datetime('now'))
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

#[tauri::command]
async fn get_agent_dirs(app: tauri::AppHandle) -> Result<AgentDirs, String> {
    let base = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let tasks_dir = base.join("tasks");
    let handoffs_dir = base.join("handoffs");
    std::fs::create_dir_all(&tasks_dir).map_err(|e| e.to_string())?;
    std::fs::create_dir_all(&handoffs_dir).map_err(|e| e.to_string())?;
    Ok(AgentDirs {
        tasks_dir: tasks_dir.to_string_lossy().into_owned(),
        handoffs_dir: handoffs_dir.to_string_lossy().into_owned(),
    })
}

#[tauri::command]
async fn write_agent_task(app: tauri::AppHandle, id: String, payload: String) -> Result<(), String> {
    let tasks_dir = app.path().app_data_dir()
        .map_err(|e| e.to_string())?
        .join("tasks");
    std::fs::create_dir_all(&tasks_dir).map_err(|e| e.to_string())?;
    let path = tasks_dir.join(format!("{id}.json"));
    std::fs::write(path, payload).map_err(|e| e.to_string())
}

#[tauri::command]
async fn poll_agent_handoffs(app: tauri::AppHandle) -> Result<Vec<String>, String> {
    let handoffs_dir = app.path().app_data_dir()
        .map_err(|e| e.to_string())?
        .join("handoffs");
    if !handoffs_dir.exists() {
        return Ok(vec![]);
    }
    let ids = std::fs::read_dir(&handoffs_dir)
        .map_err(|e| e.to_string())?
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let name = entry.file_name().into_string().ok()?;
            if name.ends_with(".json") {
                Some(name.trim_end_matches(".json").to_string())
            } else {
                None
            }
        })
        .collect();
    Ok(ids)
}

#[tauri::command]
async fn read_agent_handoff(app: tauri::AppHandle, id: String) -> Result<String, String> {
    let path = app.path().app_data_dir()
        .map_err(|e| e.to_string())?
        .join("handoffs")
        .join(format!("{id}.json"));
    let content = std::fs::read_to_string(&path).map_err(|e| e.to_string())?;
    std::fs::remove_file(&path).map_err(|e| e.to_string())?;
    Ok(content)
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
        .invoke_handler(tauri::generate_handler![
            app_version,
            get_agent_dirs,
            write_agent_task,
            poll_agent_handoffs,
            read_agent_handoff,
        ])
        .run(tauri::generate_context!())
        .expect("error while running kazane");
}
