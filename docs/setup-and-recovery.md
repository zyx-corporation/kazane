# Kazane セットアップ・データ場所・復旧ガイド（v0.9）

## データの保存場所

Kazane のすべてのデータはローカルの macOS ユーザーディレクトリに保存されます。
クラウドには同期されません。

```
~/Library/Application Support/jp.zyxcorp.kazane/
├── kazane.db          — SQLiteデータベース（全Work Item・Context・Handoff・Evidence）
├── backups/           — kazane-agent backup で作成したバックアップ
├── tasks/             — エージェントへの未割り当てタスクキュー（JSON）
├── handoffs/          — エージェントが書き出したHandoff Note（JSON）
├── kazane-agentd.sock — Push通知ブローカーのUnixソケット（起動中のみ）
└── kazaned.sock       — 制御面デーモンのUnixソケット（起動中のみ）
```

## 初回セットアップ

1. `Kazane.app` を `/Applications` に配置してダブルクリックで起動。
2. 起動後、Start Guide（?ボタン）が表示されます。3ステップのオンボーディングを完了してください。
3. 管理者ユーザー（owner）を登録します：
   ```bash
   scripts/kazane-agent user-add \
     --id "USR-owner-yourname" \
     --name "あなたの名前" \
     --email "you@example.com" \
     --role owner
   ```

## バックアップ

```bash
# デフォルト場所（~/Library/Application Support/jp.zyxcorp.kazane/backups/）に保存
scripts/kazane-agent backup

# 任意の場所に保存
scripts/kazane-agent backup --dir ~/Desktop/kazane-backups

# バックアップ一覧を確認
scripts/kazane-agent backup-list
```

バックアップファイルは `kazane_YYYYMMDD_HHMMSS.db` 形式の完全な SQLite コピーです。
作成時に `PRAGMA integrity_check` で整合性を自動検証します。

## 復旧手順

1. **Kazane アプリを終了する**（重要: 起動中に restore すると破損します）
2. バックアップファイルのパスを確認する：
   ```bash
   scripts/kazane-agent backup-list
   ```
3. 復元を実行する：
   ```bash
   scripts/kazane-agent restore ~/Library/Application\ Support/jp.zyxcorp.kazane/backups/kazane_YYYYMMDD_HHMMSS.db
   ```
   実行すると復元前の DB が自動的に `.pre-restore` ファイルとして保存されます。
4. Kazane アプリを再起動して復旧を確認する。

## サポート情報の収集

問題が発生した場合、以下で診断情報をエクスポートできます（メールアドレスは自動的に伏字になります）：

```bash
scripts/kazane-agent diagnostics
# → ~/Library/Application Support/jp.zyxcorp.kazane/kazane_diagnostics_YYYYMMDD_HHMMSS.json
```

## データの削除

Kazane のデータをすべて削除する場合：

1. アプリを終了する
2. `~/Library/Application Support/jp.zyxcorp.kazane/` を削除する
3. `/Applications/Kazane.app` を削除する

## 注意事項

- このバージョン（v0.9 Product Candidate）は **シングルマシン・シングルユーザー** 向けです。
- クラウド同期・リモートアクセスは実装されていません。
- データは暗号化されていません。macOS ユーザーアカウントのアクセス制御に依存します。
- バックアップは定期的に実行することを推奨します（特に重要なHandoffの前後）。
