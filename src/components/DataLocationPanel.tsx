import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { revealItemInDir } from '@tauri-apps/plugin-opener';
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
    diagNote: '個人情報を含まない診断情報を出力:',
    restoreGuide: '復元するときはKazaneを終了し、現在のkazane.dbを退避してから、backupsフォルダ内のバックアップで置き換えます。',
    createBackup: 'バックアップを作成', exportDiagnostics: '診断情報を出力', showInFinder: 'Finderで表示',
    backupSuccess: '整合性確認済みのバックアップを作成しました。', diagSuccess: '個人情報を含まない診断情報を出力しました。',
    failed: '処理に失敗しました', loading: '処理中…', loadingPath: '読み込み中…', appOnly: 'この操作はKazaneアプリで利用できます。',
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
    diagNote: 'Export diagnostics without personal data:',
    restoreGuide: 'To restore, quit Kazane, preserve the current kazane.db, then replace it with a database from the backups folder.',
    createBackup: 'Create backup', exportDiagnostics: 'Export diagnostics', showInFinder: 'Show in Finder',
    backupSuccess: 'Created an integrity-checked backup.', diagSuccess: 'Exported diagnostics without personal data.',
    failed: 'Operation failed', loading: 'Working…', loadingPath: 'Loading…', appOnly: 'This operation is available in the Kazane app.',
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
    diagNote: '导出不含个人信息的诊断数据：',
    restoreGuide: '恢复时请退出 Kazane，先保留当前 kazane.db，再用 backups 文件夹中的备份替换它。',
    createBackup: '创建备份', exportDiagnostics: '导出诊断信息', showInFinder: '在访达中显示',
    backupSuccess: '已创建并通过完整性检查的备份。', diagSuccess: '已导出不含个人信息的诊断信息。',
    failed: '操作失败', loading: '处理中…', loadingPath: '读取中…', appOnly: '此操作只能在 Kazane 应用中使用。',
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
  const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
  const [dataDir, setDataDir] = useState<string | null>(null);
  const [copiedMsg, setCopiedMsg] = useState('');
  const [busy, setBusy] = useState<'backup' | 'diagnostics' | null>(null);
  const [result, setResult] = useState<{ message: string; path: string } | null>(null);

  useEffect(() => {
    if (isTauri) {
      invoke<string>('get_app_data_dir')
        .then(d => setDataDir(d))
        .catch(() => setDataDir('~/Library/Application Support/jp.zyxcorp.kazane'));
    } else {
      setDataDir('~/Library/Application Support/jp.zyxcorp.kazane');
    }
  }, [isTauri]);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedMsg(c.copied);
      setTimeout(() => setCopiedMsg(''), 1500);
    });
  }

  async function runLocalOperation(kind: 'backup' | 'diagnostics') {
    setBusy(kind);
    setResult(null);
    try {
      const command = kind === 'backup' ? 'create_local_backup' : 'export_local_diagnostics';
      const output = await invoke<{ path: string; sizeBytes: number; integrity: string }>(command);
      setResult({ message: kind === 'backup' ? c.backupSuccess : c.diagSuccess, path: output.path });
    } catch (error) {
      setResult({ message: `${c.failed}: ${String(error)}`, path: '' });
    } finally {
      setBusy(null);
    }
  }

  const dbPath = dataDir ? `${dataDir}/kazane.db` : c.loadingPath;
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
          <ActionButton disabled={!isTauri || busy !== null} onClick={() => runLocalOperation('backup')}>
            {busy === 'backup' ? c.loading : c.createBackup}
          </ActionButton>
          {!isTauri && <div style={{ marginTop: 6, fontSize: 11, color: '#5b6370' }}>{c.appOnly}</div>}
        </Section>

        {/* Restore */}
        <Section label={c.recoverLabel} color="#d9a93f">
          <div style={{ fontSize: 12, color: '#8a9ab0', marginBottom: 4 }}>{c.restoreNote}</div>
          <div style={{ fontSize: 12, color: '#8a9ab0', lineHeight: 1.65 }}>{c.restoreGuide}</div>
        </Section>

        {/* Diagnostics */}
        <Section label={c.diagLabel} color="#a07fe0">
          <div style={{ fontSize: 12, color: '#8a9ab0', marginBottom: 4 }}>{c.diagNote}</div>
          <ActionButton disabled={!isTauri || busy !== null} onClick={() => runLocalOperation('diagnostics')}>
            {busy === 'diagnostics' ? c.loading : c.exportDiagnostics}
          </ActionButton>
        </Section>

        {result && <div style={{ marginTop: 20, padding: '10px 14px', background: '#1b1e25', borderRadius: 8, fontSize: 12, color: result.path ? '#8fcdb8' : '#e18989', lineHeight: 1.55 }}>
          <div>{result.message}</div>
          {result.path && <button onClick={() => revealItemInDir(result.path)} style={{ marginTop: 8, border: '1px solid #3b5d52', background: '#17231f', color: '#8fcdb8', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>{c.showInFinder}</button>}
        </div>}

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

function ActionButton({ disabled, onClick, children }: { disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button disabled={disabled} onClick={onClick} style={{ width: '100%', border: '1px solid #3b5d52', background: '#17231f', color: disabled ? '#607069' : '#8fcdb8', borderRadius: 7, padding: '9px 12px', cursor: disabled ? 'default' : 'pointer', fontSize: 12, fontWeight: 600 }}>{children}</button>;
}

function Section({ label, color, children }: { label: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 10, color, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', marginBottom: 8 }}>{label.toUpperCase()}</div>
      {children}
    </div>
  );
}
