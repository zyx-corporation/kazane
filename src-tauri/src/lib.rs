use serde::{Deserialize, Serialize};
use sqlx::sqlite::{SqliteConnectOptions, SqliteConnection};
use sqlx::Connection;
use std::io::Write;
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

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LocalFileResult {
    pub path: String,
    pub size_bytes: u64,
    pub integrity: String,
}

fn sqlite_string(value: &str) -> String {
    value.replace('\'', "''")
}

async fn open_sqlite(path: &std::path::Path, read_only: bool) -> Result<SqliteConnection, String> {
    let options = SqliteConnectOptions::new()
        .filename(path)
        .read_only(read_only)
        .create_if_missing(false);
    SqliteConnection::connect_with(&options)
        .await
        .map_err(|e| e.to_string())
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
        Migration {
            version: 6,
            description: "create_gate_rules_and_agent_profiles",
            sql: "
                CREATE TABLE IF NOT EXISTS gate_rules (
                    domain TEXT PRIMARY KEY NOT NULL,
                    perm_json TEXT NOT NULL DEFAULT '[]',
                    stops_json TEXT NOT NULL DEFAULT '[]'
                );
                CREATE TABLE IF NOT EXISTS agent_profiles (
                    id TEXT PRIMARY KEY NOT NULL,
                    name TEXT NOT NULL DEFAULT '',
                    model TEXT NOT NULL DEFAULT '',
                    trust_level TEXT NOT NULL DEFAULT '中',
                    capabilities_json TEXT NOT NULL DEFAULT '[]',
                    gate_perm TEXT NOT NULL DEFAULT '',
                    gate_stops TEXT NOT NULL DEFAULT ''
                );
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 7,
            description: "add_github_links_to_work_items",
            sql: "
                ALTER TABLE work_items ADD COLUMN github_links_json TEXT NOT NULL DEFAULT '[]';
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 8,
            description: "add_audit_fields_to_work_items",
            sql: "
                ALTER TABLE work_items ADD COLUMN audit_required INTEGER NOT NULL DEFAULT 0;
                ALTER TABLE work_items ADD COLUMN reviewer TEXT NOT NULL DEFAULT '';
                ALTER TABLE work_items ADD COLUMN deviation_risk TEXT NOT NULL DEFAULT 'low';
                ALTER TABLE work_items ADD COLUMN drift_note TEXT NOT NULL DEFAULT '';
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 9,
            description: "add_customer_fields_to_context_cards",
            sql: "
                ALTER TABLE context_cards ADD COLUMN card_type TEXT NOT NULL DEFAULT 'general';
                ALTER TABLE context_cards ADD COLUMN customer_company TEXT NOT NULL DEFAULT '';
                ALTER TABLE context_cards ADD COLUMN customer_contact TEXT NOT NULL DEFAULT '';
                ALTER TABLE context_cards ADD COLUMN customer_email TEXT NOT NULL DEFAULT '';
                ALTER TABLE context_cards ADD COLUMN customer_phone TEXT NOT NULL DEFAULT '';
                ALTER TABLE context_cards ADD COLUMN customer_relationship TEXT NOT NULL DEFAULT '';
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 10,
            description: "add_source_to_work_items",
            sql: "
                ALTER TABLE work_items ADD COLUMN source TEXT NOT NULL DEFAULT 'manual';
                ALTER TABLE work_items ADD COLUMN source_ref TEXT NOT NULL DEFAULT '';
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 11,
            description: "add_project_to_work_items",
            sql: "ALTER TABLE work_items ADD COLUMN project TEXT NOT NULL DEFAULT '';",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 12,
            description: "create_privileged_operation_requests",
            sql: "
                CREATE TABLE IF NOT EXISTS privileged_operation_requests (
                    id TEXT PRIMARY KEY NOT NULL,
                    agent_id TEXT NOT NULL DEFAULT '',
                    operation TEXT NOT NULL DEFAULT '',
                    args_json TEXT NOT NULL DEFAULT '{}',
                    decision TEXT NOT NULL DEFAULT 'deny',
                    reason TEXT NOT NULL DEFAULT '',
                    created_at TEXT NOT NULL DEFAULT (datetime('now'))
                );
                CREATE INDEX IF NOT EXISTS idx_privileged_operation_created
                    ON privileged_operation_requests(created_at);
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 13,
            description: "create_users_table",
            sql: "
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY NOT NULL,
                    name TEXT NOT NULL DEFAULT '',
                    email TEXT NOT NULL DEFAULT '',
                    role TEXT NOT NULL DEFAULT 'operator',
                    enabled INTEGER NOT NULL DEFAULT 1,
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
async fn get_app_data_dir(app: tauri::AppHandle) -> Result<String, String> {
    app.path().app_data_dir()
        .map(|p| p.to_string_lossy().into_owned())
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn create_local_backup(app: tauri::AppHandle) -> Result<LocalFileResult, String> {
    let base = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let db_path = base.join("kazane.db");
    if !db_path.is_file() {
        return Err(format!("database not found: {}", db_path.display()));
    }

    let backup_dir = base.join("backups");
    std::fs::create_dir_all(&backup_dir).map_err(|e| e.to_string())?;
    let stamp = chrono::Local::now().format("%Y%m%d_%H%M%S_%3f");
    let backup_path = backup_dir.join(format!("kazane_{stamp}.db"));

    let mut source = open_sqlite(&db_path, false).await?;
    let backup_sql = format!(
        "VACUUM INTO '{}'",
        sqlite_string(&backup_path.to_string_lossy())
    );
    if let Err(error) = sqlx::query(&backup_sql).execute(&mut source).await {
        let _ = std::fs::remove_file(&backup_path);
        return Err(error.to_string());
    }
    source.close().await.map_err(|e| e.to_string())?;

    let mut backup = open_sqlite(&backup_path, true).await?;
    let integrity: String = sqlx::query_scalar("PRAGMA integrity_check")
        .fetch_one(&mut backup)
        .await
        .map_err(|e| e.to_string())?;
    backup.close().await.map_err(|e| e.to_string())?;
    if integrity != "ok" {
        let _ = std::fs::remove_file(&backup_path);
        return Err(format!("backup integrity check failed: {integrity}"));
    }

    let size_bytes = std::fs::metadata(&backup_path)
        .map_err(|e| e.to_string())?
        .len();
    Ok(LocalFileResult {
        path: backup_path.to_string_lossy().into_owned(),
        size_bytes,
        integrity,
    })
}

#[tauri::command]
async fn export_local_diagnostics(app: tauri::AppHandle) -> Result<LocalFileResult, String> {
    let base = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let db_path = base.join("kazane.db");
    if !db_path.is_file() {
        return Err(format!("database not found: {}", db_path.display()));
    }

    let mut connection = open_sqlite(&db_path, true).await?;
    let integrity: String = sqlx::query_scalar("PRAGMA integrity_check")
        .fetch_one(&mut connection)
        .await
        .map_err(|e| e.to_string())?;
    let migration_version: i64 = sqlx::query_scalar(
        "SELECT COALESCE(MAX(version), 0) FROM _sqlx_migrations"
    )
    .fetch_one(&mut connection)
    .await
    .unwrap_or(0);

    let table_names: Vec<String> = sqlx::query_scalar(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '\\_%' ESCAPE '\\' ORDER BY name"
    )
    .fetch_all(&mut connection)
    .await
    .map_err(|e| e.to_string())?;
    let mut table_counts = serde_json::Map::new();
    for table in table_names {
        let safe_table = table.replace('"', "\"\"");
        let count: i64 = sqlx::query_scalar(&format!("SELECT COUNT(*) FROM \"{safe_table}\""))
            .fetch_one(&mut connection)
            .await
            .map_err(|e| e.to_string())?;
        table_counts.insert(table, serde_json::json!(count));
    }

    let role_rows: Vec<(String, i64)> = sqlx::query_as(
        "SELECT role, COUNT(*) FROM users WHERE enabled=1 GROUP BY role ORDER BY role"
    )
    .fetch_all(&mut connection)
    .await
    .unwrap_or_default();
    connection.close().await.map_err(|e| e.to_string())?;

    let backup_count = std::fs::read_dir(base.join("backups"))
        .ok()
        .into_iter()
        .flatten()
        .filter_map(Result::ok)
        .filter(|entry| entry.path().extension().is_some_and(|ext| ext == "db"))
        .count();
    let db_size_bytes = std::fs::metadata(&db_path)
        .map_err(|e| e.to_string())?
        .len();
    let roles = role_rows
        .into_iter()
        .map(|(role, count)| serde_json::json!({ "role": role, "count": count }))
        .collect::<Vec<_>>();
    let generated_at = chrono::Local::now();
    let payload = serde_json::json!({
        "generated_at": generated_at.to_rfc3339(),
        "app_version": env!("CARGO_PKG_VERSION"),
        "platform": std::env::consts::OS,
        "architecture": std::env::consts::ARCH,
        "db_size_bytes": db_size_bytes,
        "db_integrity": integrity,
        "migration_version": migration_version,
        "backup_count": backup_count,
        "table_row_counts": table_counts,
        "enabled_user_roles": roles,
        "privacy": "No email addresses, names, record bodies, or local absolute paths are included."
    });
    let output_path = base.join(format!(
        "kazane_diagnostics_{}.json",
        generated_at.format("%Y%m%d_%H%M%S_%3f")
    ));
    let bytes = serde_json::to_vec_pretty(&payload).map_err(|e| e.to_string())?;
    std::fs::write(&output_path, &bytes).map_err(|e| e.to_string())?;
    Ok(LocalFileResult {
        path: output_path.to_string_lossy().into_owned(),
        size_bytes: bytes.len() as u64,
        integrity,
    })
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
    let base_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let tasks_dir = base_dir.join("tasks");
    std::fs::create_dir_all(&tasks_dir).map_err(|e| e.to_string())?;
    let path = tasks_dir.join(format!("{id}.json"));
    std::fs::write(path, &payload).map_err(|e| e.to_string())?;
    notify_agentd(&base_dir, &id, &payload);
    Ok(())
}

#[cfg(unix)]
fn notify_agentd(base_dir: &std::path::Path, id: &str, payload: &str) {
    use std::os::unix::net::UnixStream;
    let Ok(mut stream) = UnixStream::connect(base_dir.join("kazane-agentd.sock")) else {
        return;
    };
    let event = serde_json::json!({
        "type": "notify",
        "event": { "type": "task_assigned", "id": id, "payload": payload }
    });
    let _ = writeln!(stream, "{event}");
}

#[cfg(not(unix))]
fn notify_agentd(_base_dir: &std::path::Path, _id: &str, _payload: &str) {}

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
    std::fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn acknowledge_agent_handoff(app: tauri::AppHandle, id: String) -> Result<(), String> {
    let path = app.path().app_data_dir()
        .map_err(|e| e.to_string())?
        .join("handoffs")
        .join(format!("{id}.json"));
    if path.exists() {
        std::fs::remove_file(path).map_err(|e| e.to_string())?;
    }
    Ok(())
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
        .setup(|_app| {
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            app_version,
            get_app_data_dir,
            create_local_backup,
            export_local_diagnostics,
            get_agent_dirs,
            write_agent_task,
            poll_agent_handoffs,
            read_agent_handoff,
            acknowledge_agent_handoff,
        ])
        .run(tauri::generate_context!())
        .expect("error while running kazane");
}
