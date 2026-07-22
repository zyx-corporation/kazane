# Kazane v0.9 — Product Candidate Overview

**Kazane / 風音 — Chronicle Work OS**
バージョン: 0.9.0 Product Candidate draft
開発: ZYX Corporation
対象プラットフォーム: macOS 13.0以降（Apple Silicon・Intel 両対応）

> 現在は配布前のドラフトです。ソース実装は v0.9.0 ですが、署名・notarization・
> clean-machine rehearsal は未完了で、公開用 v0.9 DMG はまだありません。

---

## これは何か

Kazane は、AI エージェントと人間が協働する業務を管理するローカルデスクトップアプリケーションです。

Work Item・Context Card・Handoff Note・Evidence Log の4つのデータ構造で、「誰が・何を・なぜ・どう判断したか」を一貫して記録します。AI に任せた作業も、人間が戻って判断した作業も、同じ文脈の中に残ります。

---

## 現在できること（v0.9 実装済み）

### 業務管理
- **Work Board**: Work Item を inbox / AI Working / Human / Gate / Done で管理
- **Context Card**: 汎用カードおよび顧客情報カード
- **Handoff Note**: エージェント→人間、人間→エージェントの引き継ぎ記録
- **Evidence Log**: 実行根拠・テスト結果・外部リンクの記録
- **Gate Rule**: 人間の最終判断が必要な条件を定義

### AI エージェント連携
- **MCP サーバー** (`scripts/kazane-mcp`): Claude Code などの AI エージェントが MCP 経由で WI を読み書き
- **CLI** (`scripts/kazane-agent`): pickup/submit/watch/lock などのエージェント操作
- **Push 通知** (`scripts/kazane-agentd`): WI 割当を Unix ソケット経由でリアルタイム通知
- **ロールベース認可**: owner/operator/reviewer/agent の4ロールで操作を制御
- **認可操作ログ**: すべての状態変更を actor・判定・理由付きで記録

### データ管理
- **バックアップ/復元**: `kazane-agent backup/restore` による完全な SQLite コピー
- **整合性検証**: バックアップ時に自動で `PRAGMA integrity_check` を実行
- **診断エクスポート**: サポート情報を JSON バンドルで出力（メールアドレス自動伏字）

### Chronicle Replay
- Work Item に紐づく Context・Events・Handoff・Evidence の時系列再生
- AI モデルの内部推論は含まない（記録されたデータのみ）

### インポート
- Gmail スレッド → Work Item (`kazane-agent mail-import`)
- カレンダーイベント → Work Item/Evidence (`kazane-agent calendar-import`)
- GitHub Issue/PR → Evidence リンク

---

## できないこと（v0.9 非実装・非約束）

以下は v0.9 に含まれません。将来の実装を約束するものではありません：

| 機能 | 状態 |
|------|------|
| クラウド同期・バックアップ | 未実装 |
| リモートアクセス・リモート GUI | 境界定義済み（ADR-0014）、実装は v0.9 以降 |
| マルチマシン協働 | 未実装 |
| データ暗号化（保存時） | 未実装 |
| iOS/Android アプリ | 未実装 |
| 組み込み AI モデル | なし（外部エージェントと接続） |
| 自動テレメトリー | なし |
| SLA・サポート保証 | Product Candidate のため設定なし |

---

## 対象ユーザー

**初期対象**: AI エージェントを業務に使い始めた小規模組織・個人
具体的には、次のような状況に直面しているチーム：

- AI に任せた作業の文脈が後から追えない
- Handoff の記録がチャットやメモに散在している
- AI アウトプットのどこに人間の判断が入ったか分からない
- エージェントと人間の責任境界が曖昧になってきた

**ドッグフーディング対象**: ZYX Corp 内部業務（Kazane 開発・顧客対応・コンテンツ作成）

---

## システム要件

- macOS 13.0 (Ventura) 以降
- Apple Silicon または Intel Mac
- ディスク空き容量: 50MB 以上（データは別途）
- インターネット接続: GitHub Issue 同期時のみ必要（任意機能）

---

## インストール

候補ビルドの署名・notarization完了後、次の手順で検証します。

1. `Kazane_0.9.0_aarch64.dmg`（Apple Silicon）または `Kazane_0.9.0_x64.dmg`（Intel）を開く
2. `Kazane.app` を `/Applications` にドラッグ
3. アプリを起動（初回は macOS の Gatekeeper 確認が表示される場合があります）
4. 起動後、Start Guide（? ボタン）でオンボーディングを完了

---

## Product Candidate の位置付け

このバージョンは **製品候補（Product Candidate）** です：

- 機能は動作しますが、一般向けリリースの品質保証はありません
- 試用者からのフィードバックを実装と文書に反映させます
- データ損失は自己責任です（定期バックアップを強く推奨します）
- ZYX Corp への問い合わせ先: tomyuk@zyxcorp.jp

---

## 証跡（Evidence of Stated Capabilities）

| 機能 | Evidence |
|------|---------|
| backup/restore の完全性 | WI-901: round-trip 5テスト通過（`tests/test_backup_restore.py`） |
| ロール認可の動作 | WI-903: 8テスト通過（`tests/test_control_plane.py::RoleAuthorizationTest`） |
| MCP サーバー疎通 | WI-BAO-001: 9ツール全疎通・Handoff 永続化 E2E 確認済み |
| Gmail→WI 自律実行 | WI-BAO-002: 講座申込メール WI-911 実運用 E2E 確認済み |
| diagnostics 出力 | WI-905: `kazane-agent diagnostics` 実装、メールアドレス伏字確認済み |
