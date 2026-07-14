# Kazane サポートランブック（v0.9）

## 診断情報の収集

ユーザーから問題報告があった場合、まず診断バンドルを収集します：

```bash
scripts/kazane-agent diagnostics
```

出力される JSON ファイルには以下が含まれます（メールアドレスは自動伏字）：
- アプリバージョン・DBマイグレーション番号
- テーブル別行数
- エージェントプロフィール一覧
- ユーザーロール一覧（メールなし）
- 直近20件のイベント履歴

## よくある問題

### アプリが起動しない

1. `~/Library/Application Support/jp.zyxcorp.kazane/kazane.db` が存在するか確認。
2. DBファイルが破損している場合は backup-list でバックアップを確認し restore。
3. 診断ログ: `~/Library/Logs/jp.zyxcorp.kazane/` を確認。

### Work Item が表示されない

1. アプリを再起動する。
2. DB整合性チェック：
   ```bash
   sqlite3 ~/Library/Application\ Support/jp.zyxcorp.kazane/kazane.db "PRAGMA integrity_check;"
   ```
3. 正常でなければ最新バックアップから restore。

### エージェントがWIを取得できない

1. `scripts/kazane-agent status` でWIのcolumn状態を確認。
2. ロック確認：
   ```bash
   ls ~/Library/Application\ Support/jp.zyxcorp.kazane/tasks/*.lock 2>/dev/null
   ```
   古いロック（30分以上前）は自動解除されますが、手動解除も可能：
   ```bash
   scripts/kazane-agent unlock <WI-ID>
   ```

### 権限エラー（allowed: false）

1. `scripts/kazane-agent user-list` でユーザーのロールを確認。
2. DBの `privileged_operation_requests` テーブルで拒否理由を確認：
   ```bash
   sqlite3 ~/Library/Application\ Support/jp.zyxcorp.kazane/kazane.db \
     "SELECT agent_id, operation, decision, reason, created_at FROM privileged_operation_requests ORDER BY created_at DESC LIMIT 10;"
   ```

## データ復旧エスカレーション

1. バックアップから restore を試みる（`docs/setup-and-recovery.md` 参照）。
2. restore 後もデータが不正な場合、`.pre-restore` ファイルを元のDBに戻す：
   ```bash
   cp ~/Library/Application\ Support/jp.zyxcorp.kazane/kazane.db.pre-restore \
      ~/Library/Application\ Support/jp.zyxcorp.kazane/kazane.db
   ```
3. SQLite の ``.dump`` で最低限のデータをエクスポートして新規DBに移行。

## バージョン情報の確認

```bash
# アプリバージョン
scripts/kazane-agent diagnostics | python3 -c "import json,sys; d=json.load(sys.stdin); print('v'+str(d.get('migration_version','?')))"

# DBマイグレーション一覧
sqlite3 ~/Library/Application\ Support/jp.zyxcorp.kazane/kazane.db \
  "SELECT version, description FROM _sqlx_migrations ORDER BY version;"
```

## 責任境界

このバージョンはローカルデスクトップ製品候補です。
- データ損失: ユーザー自身がバックアップを管理する責任を負います。
- アクセス制御: macOS ユーザーアカウントのセキュリティに依存します。
- AI アウトプット: すべての AI 生成コンテンツは人間がレビューした上で使用してください。

詳細は `docs/trust-and-privacy.md` を参照してください。
