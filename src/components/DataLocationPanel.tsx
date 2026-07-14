import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { Lang } from '../types';

interface Props {
  lang: Lang;
  onClose: () => void;
}

const COPY = {
  ja: {
    title: 'データの保存場所',
    subtitle: 'すべてのデータはあなたの Mac に保存されます。クラウドには同期されません。',
    dbLabel: 'データベース',
    backupLabel: 'バックアップ',
    recoverLabel: '復元',
    diagLabel: '診断情報',
    backupNote: 'バックアップを作成:',
    restoreNote: 'バックアップから復元:',
    diagNote: '診断バンドルを出力（メールは伏字）:',
    docsLabel: '詳細ドキュメント',
    docsPath: 'docs/setup-and-recovery.md',
    tip: 'ヒント: 重要な作業の前後にバックアップを取ることをお勧めします。',
    close: '閉じる',
    copied: 'コピーしました',
  },
  en: {
    title: 'Where your data lives',
    subtitle: 'All data is stored locally on your Mac. Nothing is synced to the cloud.',
    dbLabel: 'Database',
    backupLabel: 'Backup',
    recoverLabel: 'Restore',
    diagLabel: 'Diagnostics',
    backupNote: 'Create a backup:',
    restoreNote: 'Restore from backup:',
    diagNote: 'Export a support bundle (emails redacted):',
    docsLabel: 'Full documentation',
    docsPath: 'docs/setup-and-recovery.md',
    tip: 'Tip: Back up before and after important work sessions.',
    close: 'Close',
    copied: 'Copied',
  },
  zh: {
    title: '数据存储位置',
    subtitle: '所有数据存储在您的 Mac 本地，不会同步到云端。',
    dbLabel: '数据库',
    backupLabel: '备份',
    recoverLabel: '恢复',
    diagLabel: '诊断信息',
    backupNote: '创建备份：',
    restoreNote: '从备份恢复：',
    diagNote: '导出支持包（邮件已脱敏）：',
    docsLabel: '详细文档',
    docsPath: 'docs/setup-and-recovery.md',
    tip: '提示：建议在重要工作前后创建备份。',
    close: '关闭',
    copied: '已复制',
  },
};

function CodeLine({ text, onCopy }: { text: string; onCopy: (t: string) => void }) {
  return (
    <div
      style={{ background: '#0d0f14', border: '1px solid #2a3038', borderRadius: 6, padding: '7px 10px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#c8d0db', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, cursor: 'pointer', userSelect: 'none' }}
      onClick={() => onCopy(text)}
      title="クリックでコピー / Click to copy"
    >
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
      <span style={{ color: '#5b8def', fontSize: 10, flexShrink: 0 }}>⌘C</span>
    </div>
  );
}

export function DataLocationPanel({ lang, onClose }: Props) {
  const c = COPY[lang];
  const [dataDir, setDataDir] = useState<string | null>(null);
  const [copiedMsg, setCopiedMsg] = useState('');

  useEffect(() => {
    const IS_TAURI = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
    if (IS_TAURI) {
      invoke<string>('get_app_data_dir')
        .then(d => setDataDir(d))
        .catch(() => setDataDir('~/Library/Application Support/jp.zyxcorp.kazane'));
    } else {
      setDataDir('~/Library/Application Support/jp.zyxcorp.kazane');
    }
  }, []);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMsg(c.copied);
      setTimeout(() => setCopiedMsg(''), 1500);
    });
  }

  const dbPath = dataDir ? `${dataDir}/kazane.db` : '読み込み中…';
  const backupDir = dataDir ? `${dataDir}/backups/` : '';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#161a22', border: '1px solid #2a3038', borderRadius: 14, width: 560, maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', padding: '32px 32px 28px', boxShadow: '0 24px 60px #000a' }}>
        <button onClick={onClose} aria-label={c.close} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#5b6370', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>

        {/* header */}
        <div style={{ fontSize: 10, color: '#5b8def', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', marginBottom: 8 }}>DATA LOCATION</div>
        <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: '#e0e3e8' }}>{c.title}</h2>
        <p style={{ margin: '0 0 24px', fontSize: 13, color: '#8a9ab0', lineHeight: 1.6 }}>{c.subtitle}</p>

        {/* DB path */}
        <Section label={c.dbLabel} color="#5b8def">
          <CodeLine text={dbPath} onCopy={copyToClipboard} />
          {backupDir && <div style={{ marginTop: 4, fontSize: 11, color: '#5b6370' }}>backups/ → {backupDir}</div>}
        </Section>

        {/* Backup */}
        <Section label={c.backupLabel} color="#5fb89f">
          <div style={{ fontSize: 12, color: '#8a9ab0', marginBottom: 4 }}>{c.backupNote}</div>
          <CodeLine text="scripts/kazane-agent backup" onCopy={copyToClipboard} />
        </Section>

        {/* Restore */}
        <Section label={c.recoverLabel} color="#d9a93f">
          <div style={{ fontSize: 12, color: '#8a9ab0', marginBottom: 4 }}>{c.restoreNote}</div>
          <CodeLine text="scripts/kazane-agent backup-list" onCopy={copyToClipboard} />
          <div style={{ marginTop: 4 }}>
            <CodeLine text="scripts/kazane-agent restore backups/<filename>.db" onCopy={copyToClipboard} />
          </div>
        </Section>

        {/* Diagnostics */}
        <Section label={c.diagLabel} color="#a07fe0">
          <div style={{ fontSize: 12, color: '#8a9ab0', marginBottom: 4 }}>{c.diagNote}</div>
          <CodeLine text="scripts/kazane-agent diagnostics" onCopy={copyToClipboard} />
        </Section>

        {/* docs */}
        <div style={{ marginTop: 20, padding: '10px 14px', background: '#1b1e25', borderRadius: 8, fontSize: 12, color: '#8a9ab0', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#5b6370' }}>📄</span>
          <span>{c.docsLabel}: <span style={{ color: '#5b8def', fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{c.docsPath}</span></span>
        </div>

        {/* tip */}
        <div style={{ marginTop: 12, fontSize: 12, color: '#5b6370', fontStyle: 'italic' }}>{c.tip}</div>

        {/* footer */}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#5fb89f', minHeight: 16 }}>{copiedMsg}</span>
          <button onClick={onClose} style={{ background: '#5b8def', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, padding: '8px 20px', cursor: 'pointer' }}>{c.close}</button>
        </div>
      </div>
    </div>
  );
}

function Section({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 10, color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 8 }}>{label.toUpperCase()}</div>
      {children}
    </div>
  );
}
