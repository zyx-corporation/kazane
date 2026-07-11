# Kazane — Claude Code 引き継ぎ

## プロジェクト概要

**Kazane / 風音** — AI時代の業務OS（Chronicle Work OS）。ZYX Corp開発。  
Tauri v2（Rust + WebView）、SQLite（tauri-plugin-sql）、React + TypeScript。  
bundle ID: `jp.zyxcorp.kazane`

dogfooding原則: **KazaneをKazaneで管理する**。開発タスクはKazane自身に記録する。

---

## 現在地（2026-07-11）

**ブランチ:** `main`（作業時は `codex/*` ブランチを使用）
**アプリバージョン:** `0.8.0`

### ロードマップ進捗

| バージョン | 名前 | 状態 |
|-----------|------|------|
| v0.0–v0.3 | kiri / shirushi / nagare / tsuzuri | ✅ 完了（PR #12 mainマージ済み） |
| v0.4 | michi / 道 | ✅ 完了（WI-401〜405 Done） |
| v0.5 | ayumi / 歩み | ✅ 完了（WI-702〜705 + WI-501 Done） |
| v0.6 | akashi / 証し | ✅ 完了（WI-706〜709 + WI-601 Done） |
| v0.7 | musubi / 結び | ✅ 完了（WI-710〜713 実装済み、バージョン 0.7.0） |
| **v0.8** | **hibiki / 響き** | **🔄 インフラ・Start Guide完了、外部検証残** |

### ローカルデプロイ状態

- **バージョン:** `0.8.0`
- **インストール先:** `/Applications/Kazane.app`
- **ローカル配布物:** `src-tauri/target/release/bundle/dmg/Kazane_0.8.0_aarch64.dmg`
- DB は `~/Library/Application Support/jp.zyxcorp.kazane/kazane.db` を引き継ぎ（migration v12）

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
| v8 | audit_required / reviewer / deviation_risk / drift_note（work_items） |
| v9 | card_type / customer_* フィールド（context_cards） |
| v10 | source / source_ref（work_items） |
| v11 | project（work_items） |
| v12 | privileged_operation_requests（認可監査） |

DB パス: `~/Library/Application Support/jp.zyxcorp.kazane/kazane.db`

新しいカラムを追加するときは `src-tauri/src/lib.rs` の `migrations()` に昇順で追加すること。

---

## 主要ファイルマップ

```
src/
  App.tsx               — ルートコンポーネント、全state管理、DB読み書き
  components/
    OnboardingWizard.tsx — 任意起動の3段階Start Guide
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
  kazane-agentd         — Unix socket Push通知ブローカー（start/stop/status/serve）
  kazaned               — 状態変更を所有するローカル制御面
  kazane-privd          — typed operation認可・default-deny・監査
  kazane_control.py     — Phase A IPC・認可・状態変更の共有実装
  kazane-mcp            — 外部エージェント向けMCP stdio server
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
kazane-agent sync-github-issues --repo zyx-corporation/kazane  # Open/Closed Issueを同期
kazane-agent report-test --tool tsc --result pass --wi WI-401  # テスト結果をEV記録
kazane-agent submit <WI-ID>                     # Handoff提出（10秒でアプリが自動取込）
```
※ DB操作系（create/update/sync-github-issues/report-test/status/read）はアプリを開いたままでも使用可。  
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

## v0.5 実装済み機能（commit dfca7b7）

### WI-702: ドメイン別テンプレート
- `DOMAIN_TEMPLATES` 定数 — 6ドメイン（顧客対応/営業/執筆/経理/開発/AI番頭）の初期ctx/ho/gate
- `addItem()` でドメイン選択時に自動適用（partial引数が優先）

### WI-703: 停滞WI検出
- `updatedAt?: string` フィールド追加（types + db + migration v7の`updated_at`カラム利用）
- WorkBoard: `isStale()` + 「停滞 7d+」チップ（amber boxShadow）
- FlowDashboard: 5枚目 statsカード「停滞」（amber/gray）

### WI-704: Context Card検索
- 既存の `useMemo` 検索が実装済みであることを確認（追加実装不要）

### WI-705: Morningフラグ
- `toggleMorning(id)` in App.tsx
- WorkItemDrawer: 「今日やることに追加」ボタン（green accent）
- FlowDashboard の「今日やること」セクションと連携済み

---

## v0.6 実装済み機能（commit fcbb295）

### WI-706: Evidence Log 正式化
- WorkItemDrawer evidence タブ: ev_json（埋め込み）と evidence_log テーブルを証跡チェーンとして統合表示

### WI-707: RDE Audit フロー強化
- RdeEvidenceAudit 画面: deviation risk サマリカード（低/中/高件数）
- 監査対象 WI リスト（`auditRequired || rde || deviation_risk != 'low'`）

### WI-708: レビューチェーン + 監査フラグ
- migration v8: `audit_required`, `reviewer` 追加
- WorkItemDrawer RDE タブ: 監査必須トグル + レビュー担当者入力
- EscalationGate: 「監査必須」パネル（未完了 WI のみ）

### WI-709: 意味的ドリフト記録
- migration v8: `deviation_risk` (low/medium/high), `drift_note` 追加
- WorkItemDrawer RDE タブ: deviation risk セレクタ + drift note テキストエリア

## v0.7 実装済み機能（WI-710〜713）

### WI-710: 顧客 Context Card
- migration v9: `card_type`, `customer_company`, `customer_contact`, `customer_email`, `customer_phone`, `customer_relationship` を context_cards に追加
- `ContextCard` 型・DB・UI 更新
- ContextCards.tsx: 顧客バッジ、typeフィルタ（全て/汎用/顧客）、顧客情報セクション
- NewContextCardModal: card_type セレクタ（汎用/顧客）、顧客名入力

### WI-711: Gmail → WI インポート
- migration v10: `source` (manual/gmail/calendar), `source_ref` を work_items に追加
- `kazane-agent mail-import` コマンド（--from/--subject/--snippet/--thread-id/--domain/--ctx/--risk）
- WorkBoard / WorkItemDrawer: 「メール」バッジ表示
- 統合フロー: Claude Code が Gmail MCP で読み → `kazane-agent mail-import` で WI 化

### WI-712: Calendar → WI/Context
- `kazane-agent calendar-import` コマンド（--title/--date/--attendees/--event-id/--domain/--ctx/--wi）
- `--wi` 指定時は既存 WI に Evidence を追記、省略時は新規 WI 作成
- WorkBoard / WorkItemDrawer: 「予定」バッジ表示

### WI-713: AI番頭デモフロー
- `kazane-agent banto-demo` — 5ステップ統合デモシナリオを出力
- CTX-010（顧客対応 Context Card サンプル、card_type=customer）追加

## SQLite マイグレーション追加分

| version | 内容 |
|---------|------|
| v9 | card_type / customer_* フィールド（context_cards） |
| v10 | source / source_ref（work_items） |

---

## v0.8 実装済み機能（WI-801・803〜805）

### WI-803: Kazane MCP Server
- `scripts/kazane-mcp` — PEP 723 inline deps（`uv run --script`）で自己解決
- 9 MCP ツール: `list_work_items`, `read_work_item`, `create_work_item`, `update_work_item`, `submit_handoff`, `add_evidence`, `list_context_cards`, `mail_import`, `calendar_import`
- gate check（agent_profiles.gate_stops 照合）、lock取得/解放、nextAgent ルーティング対応
- 使い方: `.mcp.json` に `{ "kazane": { "command": "scripts/kazane-mcp" } }` を追加

### WI-804: エージェント間ルーティング
- `HandoffNote.nextAgent?: string` 型追加（`src/types/index.ts`）
- `importAgentHandoff`: nextAgent があれば WI を 'ai' カラムに留め、assignee を次エージェントに変更、新タスクファイルを書き出す
- `kazane-agent submit --next-agent <id>` — handoff JSON に nextAgent フィールドを追加

### WI-805: 並列処理制御（ロック機構）
- `kazane-agent`: `_is_locked / _acquire_lock / _release_lock` + LOCK_TTL=1800
- `pickup`: ロック済みWIをスキップ、取得時にロック確保
- `submit`: 提出時にロック解放
- `lock <WI-ID>` / `unlock <WI-ID>` 手動サブコマンド追加
- `watch [--timeout <secs>]` — 新タスク到着を待つサブコマンド追加

### WI-801: Agent Push通知
- `scripts/kazane-agentd` — Unix domain socket通知ブローカー
- Tauri `write_agent_task` と `kazane-mcp` が `task_assigned` を即時通知
- `kazane-agent watch` はPush購読し、daemon停止時のみファイルポーリングへフォールバック
- task JSONは耐障害用のdurable queueとして維持

### kazane-agent v0.8 追加コマンド
```bash
kazane-agent watch [--timeout <secs>]      # 新タスク到着まで待機（exit 0 で検知）
kazane-agent lock <WI-ID> [agent-id]       # 手動ロック取得
kazane-agent unlock <WI-ID>                # 手動ロック解放
kazane-agent pickup --agent-id <id>        # エージェントID付きpickup + ロック自動取得
kazane-agent submit <WI-ID> --next-agent <id> --agent-id <id>  # ルーティング付きsubmit
kazane-agent create --agent-id <id>        # gate check付きWI作成
kazane-agent update <WI-ID> --agent-id <id>  # gate check付き更新
```

---

## 次のマイルストーン: v0.8 hibiki / 響き（スコープ再定義済み）

**確定スコープ（2026-06-30）:** 元ロードマップの「外部ベータ・テンプレート」より**外部エージェント協働インフラを優先**する。  
**完了条件:** KazaneがオーケストレーターとしてAI番頭などの外部エージェントを指揮できる状態になること。

### v0.8 WI 進捗

| WI | 内容 | 状態 |
|----|------|------|
| WI-801 | Agent Push通知 — kazane-agentd Unix socket | done（Push E2E済み） |
| WI-802 | ADR-0013 Phase A — プロセス分離・権限境界の実装 | done（制御面・認可面E2E済み） |
| WI-803 | Kazane MCP Server — scripts/kazane-mcp | done（Handoff永続化E2E済み） |
| WI-804 | エージェント間ルーティング — nextAgent フィールド | done（Agent A→B E2E済み） |
| WI-805 | 並列処理制御 — ロック機構 | done（二重ロック拒否確認済み） |
| WI-808 | パートナー向けオンボーディング・診断テンプレート | done（blank-state browser E2E済み） |
| WI-809 | 外部フィードバックをContextとして記録 | inbox |
| WI-810 | 非エンジニア向けラベル・プライバシー説明 | inbox |
| WI-811 | Chronicle Progress・Replay prototype | inbox |

---

## 参照すべきドキュメント

- `docs/roadmap.md` — 全マイルストーン定義
- `docs/adr/` — ADR 0001〜0015（主要: 0003 Context Card, 0004 Agent Model, 0012 Tauri-first, 0013 権限境界, 0015 開発ロール）
- `scripts/kazane-import-dev` — 現在の開発状態の完全な記録（Context Cards・WI・Handoff・Evidence・Gate Rules・Agent Profiles）
