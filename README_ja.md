# Kazane / 風音 — Chronicle Work OS

[English README](README.md)

**Kazane / 風音** は、人間とAIエージェントが行う仕事を、文脈、引き継ぎ、証跡、レビュー、責任境界とともに管理するための初期段階の Chronicle Work OS です。

> 仕事の気配を聴き、判断の来歴を綴る。

Kazane は開発専用ツールではありません。開発は最初の dogfooding 対象として最適ですが、プロダクトの射程はより広く、AIエージェントが実行・補助・調査・下書き・レビュー・監視できる業務フロー全般を扱います。

## Kazane とは

Kazane は、人間とAIの協働のための業務OSです。小規模チームや組織が、以下を管理できるようにすることを目指します。

- 開発、営業、顧客対応、資料作成、調査、会議、経理メモ、運用、AI番頭ワークフローを横断する Work Item。
- なぜその仕事が生まれ、どの価値へ向かうのかを保存する Context Card。
- AIエージェントの役割、マニュアル、権限、机、モデルルーティング、レビュー連鎖。
- AIエージェントと人間の間の Handoff Note。
- AIが止まり、人間に判断を戻す Escalation Gate。
- 出力を情報源、ファイル、会話、Issue、判断へ結び直す Evidence Log。
- 元の意図から意味がどう変化したかを検査する RDE Audit。
- 静かな故障、古いタスク、証跡欠落、壊れた引き継ぎを検知する Operations Health。

## Kazane ではないもの

Kazane は、完全自律AI企業ではありません。人間の責任を置き換えるものでも、汎用チャットボットのラッパーでもありません。AIエージェントは作業主体にはなれますが、法的・組織的な責任主体ではありません。

また、初期段階から大企業向けの巨大ワークフロー基盤を目指すものでもありません。最初の実装は、小さく、ローカルファーストで、ZYX内部での自己利用を通じて育てます。

## 初期実行環境

Kazane はプロトタイプ段階から Tauri first で進めます。

初期ターゲットは以下です。

- macOS
- Linux

視野に入れる対象は以下です。

- iOS

従来の「Web UI first → 将来デスクトップ共通化」という方針は撤回します。プロトタイプ段階から、可能な限り Tauri アプリとして作り、Web技術をTauri内部で使いつつ、Tauri runtime、ローカルアプリシェル、権限、クロスプラットフォーム配布を初期学習対象に含めます。

## 開発方法論

Kazane は、Prototype First、TDD / Test First、T-RDE、GitHub Issue と紐づく Agile 準用の Kanban によって開発します。

- Prototype First により、耐久実装の前に業務フローとUI仮説を検証します。
- TDD / Test First により、データモデルと振る舞いをテストから固定します。
- T-RDE、Test-based Resonant Deviation Evaluator により、変更が元の文脈・意図・設計思想を保存しているかを確認します。
- Kanban は運用上の見え方として使い、GitHub Issues を永続的な作業記録として扱います。

詳細は [docs/development-methodology.md](docs/development-methodology.md)、[docs/testing-strategy.md](docs/testing-strategy.md)、[docs/t-rde-policy.md](docs/t-rde-policy.md)、[docs/issue-kanban-workflow.md](docs/issue-kanban-workflow.md) を参照してください。

## Chronicle-native work extensions

Kazane は、AI Native Development の有用なインタラクション設計を取り込みつつ、AI IDE には還元されない Chronicle Work OS として発展させます。Living PRD、AI Activity Timeline、Micro Change Workflow、Chronicle Diff、Intent Graph などの追加仕様は [docs/chronicle-native-work-extensions.md](docs/chronicle-native-work-extensions.md) を参照してください。

## 設計原則

1. 自動化より文脈主権を優先する。
2. 盲目的な完了より、責任ある差し戻しを優先する。
3. 揮発的なチャットより、書き物による引き継ぎを優先する。
4. 根拠から切り離された要約より、証跡に接続された要約を優先する。
5. UIだけに閉じた状態より、人間とAIが読める構造化データを優先する。
6. 機微な文脈では、クラウド利便性よりローカルファーストを優先する。
7. 汎用的な大企業対応より、小規模組織への深い適合を優先する。
8. 単一AIの権威より、レビュー連鎖を優先する。
9. AIの自己申告より、運用ヘルスチェックを優先する。
10. 可能な限り、再審可能な判断を優先する。

詳細は [docs/design-principles.md](docs/design-principles.md) を参照してください。

## 現在の状態

Kazane は `v0.8 hibiki / 響き` の開発段階です。現在のmacOSアプリには、
SQLite永続化、Work Item・Context Card・Handoff・Evidence・RDE、GitHub
Issue同期、Agent CLI、MCP Server、エージェント間ルーティング、同時処理
ロック、ローカルPush通知ブローカーが実装されています。

Phase Aの`kazaned`・`kazane-privd`・`kazane-agentd`分離は実装済みです。
v0.8の残務は、パートナー向けオンボーディング・フィードバック記録・
Chronicle Replay検証です。

詳細は [docs/roadmap.md](docs/roadmap.md) を参照してください。

ローカルビルドとインストールは
[docs/local-deployment.md](docs/local-deployment.md) を参照してください。

## リポジトリとブランチ方針

このリポジトリは公開リポジトリです。`main` ブランチは保護対象として扱い、直接作業ブランチとしては使いません。変更は feature branch に作成し、Pull Request を通じてレビュー後に取り込みます。

詳細は [docs/adr/0009-branch-management.md](docs/adr/0009-branch-management.md) を参照してください。

## ライセンス

この公開リポジトリは AGPL-3.0-or-later を前提としつつ、将来的な商用ライセンスオプションを検討中です。

詳細は [LICENSE](LICENSE)、[NOTICE.md](NOTICE.md)、[LICENSE-POLICY.md](LICENSE-POLICY.md)、[docs/adr/0007-license-strategy-provisional.md](docs/adr/0007-license-strategy-provisional.md) を参照してください。

## 外部向け短縮説明

> Kazane / 風音 は、人間とAIエージェントが構成する業務組織のための Chronicle Work OS です。仕事、文脈、引き継ぎ、証跡、レビュー、責任境界を接続し、AIに仕事を任せても意味と来歴を失わない状態をつくります。
