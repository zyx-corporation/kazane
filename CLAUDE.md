# Kazane — Claude Code 引き継ぎ

## プロジェクト概要

**Kazane / 風音** — AI時代の業務OS（Chronicle Work OS）。ZYX Corp開発。  
Tauri v2（Rust + WebView）、SQLite（tauri-plugin-sql）、React + TypeScript。  
bundle ID: `jp.zyxcorp.kazane`

dogfooding原則: **KazaneをKazaneで管理する**。開発タスクはKazane自身に記録する。

---

## 現在地（2026-06-29）

**ブランチ:** `main`  
**最新コミット:** `2e6f654` feat: WI-404/405 test evidence + dev gate conditions

### ロードマップ進捗

| バージョン | 名前 | 状態 |
|-----------|------|------|
| v0.0–v0.3 | kiri / shirushi / nagare / tsuzuri | ✅ 完了（PR #12 mainマージ済み） |
| **v0.4** | **michi / 道** | **実装完了、exit criteria 検証待ち** |
| v0.5 | ayumi / 歩み | 未着手 |

### v0.4 exit criteria（残タスク）

機能実装は全て完了。以下を実施すると exit criteria 達成：

1. `npm run tauri dev` を起動（migration v7 を DB に適用）
2. アプリを閉じて `scripts/kazane-import-dev` を実行
3. Kazane UI でいずれかの WI に実際の GitHub PR URL をリンク（Evidence として記録）

---

## SQLite マイグレーション履歴

| version | 内容 |
|---------|------|
| v1 | work_items + context_cards |
| v2 | agent fields（agent_picked_up_at / agent_escalated / escalation_reason） |
| v3 | handoff_notes |
| v4 | events |
| v5 | evidence_log |
| v6 | gate_rules + agent_profiles |
| v7 | github_links_json（work_items） |

DB パス: `~/Library/Application Support/jp.zyxcorp.kazane/kazane.db`

新しいカラムを追加するときは `src-tauri/src/lib.rs` の `migrations()` に昇順で追加すること。

---

## 主要ファイルマップ

```
src/
  App.tsx               — ルートコンポーネント、全state管理、DB読み書き
  types/index.ts        — 全型定義（WorkItem / GitHubLink / AgentProfile 等）
  db/index.ts           — SQLite CRUD関数（dbUpsertItem / dbListItems 等）
  components/
    WorkItemDrawer.tsx  — Work Item詳細ドロワー（evidenceタブにGitHub連携UI）
    NewWorkItemModal.tsx
    Sidebar.tsx / Toast.tsx
  screens/
    FlowDashboard.tsx
    WorkBoard.tsx
    ContextCards.tsx
    HandoffNotes.tsx
    EscalationGate.tsx
    RdeEvidenceAudit.tsx
  i18n/index.ts         — ja/en/zh翻訳

src-tauri/
  src/lib.rs            — Rustバックエンド、migrations()、Tauriコマンド

scripts/
  kazane-agent          — Agent CLI（list/pickup/status/read/create/update/report-test/submit/auto）
  kazane-import-dev     — 開発タスク状態をSQLiteに一括投入（冪等、app CLOSEして実行）

docs/
  roadmap.md            — v0.0〜v1.0 全マイルストーン
  adr/                  — 0001〜0015 アーキテクチャ決定記録
```

---

## 重要な設計ルール

### Tauri判定
```typescript
const IS_TAURI = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
```
- Tauri環境: DB が単一ソース、localStorage は使わない
- Web環境（dev preview）: localStorage fallback

### DB書き込みパターン
```typescript
// state更新 → persist（→ dbUpsertItem）の順で常にセット
const updated = items.map(i => i.id === id ? changed : i);
setItems(updated);
persist(updated, changed);  // IS_TAURIかつdbReadyのときのみDB書き込み
```

### マイグレーション追加時
1. `src-tauri/src/lib.rs` の `migrations()` ベクタ末尾に追加（昇順厳守）
2. `src/db/index.ts` の対象関数（INSERT/SELECT/rowTo*）を更新
3. `scripts/kazane-import-dev` の INSERT文も合わせて更新

### kazane-agent CLI
```bash
kazane-agent status                             # プロジェクト全体状況
kazane-agent read <WI-ID>                       # WI詳細をJSON出力
kazane-agent create --title "..." --domain 開発 # 新規WI作成
kazane-agent update <WI-ID> --col ai           # フィールド更新
kazane-agent report-test --tool tsc --result pass --wi WI-401  # テスト結果をEV記録
kazane-agent submit <WI-ID>                     # Handoff提出（10秒でアプリが自動取込）
```
※ DB操作系（create/update/report-test/status/read）はアプリを開いたままでも使用可。  
※ `kazane-import-dev` だけはアプリを閉じて実行すること。

---

## v0.4 実装済み機能（このセッション）

### WI-401: GitHub Issue/PR 連携
- `GitHubLink` 型（`src/types/index.ts`）
- migration v7: `github_links_json` カラム
- `linkGitHub(wiId, url)` — URL パース + GitHub public API fetch（認証不要）
- WorkItemDrawer evidence タブに `GitHubLinksSection`（URL入力→Enter でリンク）

### WI-402: kazane-agent CLI 拡張
- `read`・`update`・`status`・`create` サブコマンド追加
- Claude Code → Kazane DB への読み書きがCLI完結

### WI-403: 開発エージェントロール定義
- ADR 0015（`docs/adr/0015-development-agent-roles.md`）
- Agent Profile 4ロール: Tech Lead / QA / Reviewer / RDE Auditor（`AGT-DEV-*`）

### WI-404: テスト結果エビデンス
- `kazane-agent report-test` — tsc/cargo-check/cargo-test/vite-build 結果をEV記録
- git SHA を store フィールドに自動記録

### WI-405: 開発 Gate 条件
- 開発ドメイン GateRule を 7 停止条件に拡充（ADR確定・PRマージ等）

---

## 起動方法

```bash
npm run tauri dev          # 開発サーバー起動（Vite + Tauri）
scripts/kazane-import-dev  # 開発タスク状態投入（アプリ終了後に実行）
```

---

## 次のマイルストーン: v0.5 ayumi / 歩み

**目的:** ZYX社内全業務beta — 開発以外の業務（営業・顧客対応・経理・執筆）をKazaneで管理。

主な WI 候補（未作成）:
- 業務ドメイン別 WorkItem テンプレート
- スタンドアップ／今日やること ダッシュボード強化
- Context Card 検索・フィルタ
- 停滞 WI の検出（stale work detection）

---

## 参照すべきドキュメント

- `docs/roadmap.md` — 全マイルストーン定義
- `docs/adr/` — ADR 0001〜0015（主要: 0003 Context Card, 0004 Agent Model, 0012 Tauri-first, 0013 権限境界, 0015 開発ロール）
- `scripts/kazane-import-dev` — 現在の開発状態の完全な記録（Context Cards・WI・Handoff・Evidence・Gate Rules・Agent Profiles）
