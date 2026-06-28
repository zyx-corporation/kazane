interface ToastProps {
  message: string;
}

export function Toast({ message }: ToastProps) {
  return (
    <div style={{
      position: 'fixed', bottom: 22, left: '50%', transform: 'translateX(-50%)',
      zIndex: 70, background: '#1f2937', border: '1px solid #3a4656',
      color: '#e6e8ec', padding: '10px 18px', borderRadius: 10, fontSize: 12.5,
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 9,
      whiteSpace: 'nowrap', animation: 'fadeIn 0.18s ease',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#5fb89f', flexShrink: 0 }} />
      {message}
    </div>
  );
}
