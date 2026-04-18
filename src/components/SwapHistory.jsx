export default function SwapHistory({ history }) {
  if (!history.length) return null

  return (
    <div style={styles.container}>
      <div style={styles.title}>◈ SESSION LOG</div>
      <div style={styles.list}>
        {history.map((h, i) => (
          <div key={i} style={styles.row}>
            <span style={styles.index}>{String(history.length - i).padStart(2, '0')}</span>
            <span style={styles.pair}>
              <span style={styles.from}>{h.amount} {h.from}</span>
              <span style={styles.arrow}> → </span>
              <span style={styles.to}>{h.to}</span>
            </span>
            <span style={styles.result}>{h.result} via {h.source}</span>
            <span style={styles.tag}>
              {h.simulated ? 'SIM' : 'EXEC'}
            </span>
            <span style={styles.time}>{h.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    borderTop: '1px solid #1a0030',
    paddingTop: 16,
  },
  title: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 9, color: '#3d2560', letterSpacing: 3, marginBottom: 10,
  },
  list: { display: 'flex', flexDirection: 'column', gap: 4 },
  row: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 12px', borderRadius: 6,
    border: '1px solid #0f001a',
    background: 'rgba(10,0,20,0.5)',
    flexWrap: 'wrap',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11,
  },
  index: { color: '#2a0050', width: 20 },
  pair: { flex: 1, display: 'flex', gap: 0, flexWrap: 'wrap', minWidth: 120 },
  from: { color: '#7a5a99' },
  arrow: { color: '#2a0050' },
  to: { color: '#bf00ff' },
  result: { color: '#3d2560', flex: 1, minWidth: 80 },
  tag: {
    fontSize: 9, color: '#3d2560',
    border: '1px solid #1a0030',
    padding: '1px 6px', borderRadius: 3, letterSpacing: 1,
  },
  time: { color: '#2a0050', fontSize: 10 },
}