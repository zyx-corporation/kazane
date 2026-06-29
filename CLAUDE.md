# Kazane — Claude Code 引き継ぎ

## プロジェクト概要

**Kazane / 風音** — AI時代の業務OS（Chronicle Work OS）。ZYX Corp開発。  
Tauri v2（Rust + WebView）、SQLite（tauri-plugin-sql）、React + TypeScript。  
bundle ID: `jp.zyxcorp.kazane`

dogfooding原則: **KazaneをKazaneで管理する**。開発タスクはKazane自身に記録する。

---

## 現在地（2026-06-29）

**ブランチ:** `main`  
**最新コミット:** `fcbb295` feat: v0.6 akashi/証し（v0.7実装中）

### ロードマップ進捗

| バージョン | 名前 | 状態 |
|-----------|------|------|
| v0.0–v0.3 | kiri / shirushi / nagare / tsuzuri | ✅ 完了（PR #12 mainマージ済み） |
| v0.4 | michi / 道 | ✅ 完了（WI-401〜405 Done） |
| v0.5 | ayumi / 歩み | ✅ 完了（WI-702〜705 + WI-501 Done） |
| v0.6 | akashi / 証し | ✅ 完了（WI-706〜709 + WI-601 Done） |
| **v0.7** | **musubi / 結び** | **🔄 実装中（WI-710〜713 コミット待ち）** |

### ローカルデプロイ状態

- **バージョン:** `0.6.0`
- **インストール先:** `/Applications/Kazane.app`
- **DMG:** `src-tauri/target/release/bundle/dmg/Kazane_0.6.0_aarch64.dmg` (2.7MB)
- DB は `~/Library/Application Support/jp.zyxcorp.kazane/kazane.db` を引き継ぎ（migration v8 自動適用）

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

## 参照すべきドキュメント

- `docs/roadmap.md` — 全マイルストーン定義
- `docs/adr/` — ADR 0001〜0015（主要: 0003 Context Card, 0004 Agent Model, 0012 Tauri-first, 0013 権限境界, 0015 開発ロール）
- `scripts/kazane-import-dev` — 現在の開発状態の完全な記録（Context Cards・WI・Handoff・Evidence・Gate Rules・Agent Profiles）
