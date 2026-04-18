const OPTIONS = [0.5, 1, 2, 3]

export default function SlippageSelector({ value, onChange }) {
  return (
    <div style={styles.row}>
      <span style={styles.label}>SLIPPAGE</span>
      <div style={styles.options}>
        {OPTIONS.map(opt => {
          const active = value === opt
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              style={{
                ...styles.btn,
                ...(active ? styles.active : {}),
              }}
            >
              {opt}%
            </button>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  row: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  label: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 9, color: '#3d2560', letterSpacing: 3,
  },
  options: { display: 'flex', gap: 6 },
  btn: {
    padding: '6px 13px', borderRadius: 6,
    border: '1px solid #2a0050',
    background: 'transparent',
    color: '#3d2560',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 12, cursor: 'pointer',
    transition: 'all 0.2s',
    letterSpacing: 1,
  },
  active: {
    border: '1px solid #bf00ff',
    background: 'rgba(191,0,255,0.15)',
    color: '#bf00ff',
    boxShadow: '0 0 10px rgba(191,0,255,0.3), inset 0 0 8px rgba(191,0,255,0.1)',
    textShadow: '0 0 6px rgba(191,0,255,0.6)',
  },
}