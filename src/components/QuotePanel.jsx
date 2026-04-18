import { useAccount } from 'wagmi'

export default function QuotePanel({ quotes, parsed, prices, status, onSimulate, onExecute, onReset }) {
  const { isConnected } = useAccount()
  if (!quotes) return null

  const { best, all, reason, savingVsSecond } = quotes

  const fromUSD = prices?.[parsed.fromToken]
    ? (parseFloat(parsed.amount) * prices[parsed.fromToken]).toFixed(2)
    : null

  const toUSD = prices?.[parsed.toToken]
    ? (parseFloat(best.toAmountHuman) * prices[parsed.toToken]).toFixed(2)
    : null

  const priceImpact = best.estimatedPriceImpact || best.raw?.estimatedPriceImpact
    || best.raw?.priceRoute?.percentChange || null
  const impactHigh = priceImpact && Math.abs(parseFloat(priceImpact)) > 1

  const route = best.raw?.priceRoute?.bestRoute?.[0]?.swaps
    ?.map(s => s.swapExchanges?.[0]?.exchange).filter(Boolean) || []

  return (
    <div style={styles.wrapper}>

      {/* SWAP SUMMARY */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>SWAP SUMMARY</div>
        <div style={styles.summaryGrid}>
          <div style={styles.summaryBox}>
            <div style={styles.summaryMeta}>SENDING</div>
            <div style={styles.summaryBig}>{parsed.amount}</div>
            <div style={styles.summaryToken}>{parsed.fromToken}</div>
            {fromUSD && <div style={styles.summaryUsd}>${fromUSD} USD</div>}
          </div>
          <div style={styles.summaryArrowBox}>
            <div style={styles.summaryArrow}>--&gt;</div>
            <div style={styles.arrowLabel}>VIA {best.source.toUpperCase()}</div>
          </div>
          <div style={{ ...styles.summaryBox, ...styles.summaryBoxRight }}>
            <div style={styles.summaryMeta}>RECEIVING</div>
            <div style={{ ...styles.summaryBig, color: 'var(--cyan)', textShadow: '0 0 12px rgba(0,232,240,0.4)' }}>
              {best.toAmountHuman}
            </div>
            <div style={{ ...styles.summaryToken, color: 'var(--pink)' }}>{parsed.toToken}</div>
            {toUSD && <div style={styles.summaryUsd}>${toUSD} USD</div>}
          </div>
        </div>
      </div>

      {/* BEST ROUTE EXPLANATION */}
      <div style={{ ...styles.section, background: 'rgba(192,64,255,0.04)', borderBottom: '1px solid rgba(192,64,255,0.15)' }}>
        <div style={styles.sectionLabel}>WHY THIS ROUTE</div>
        <div style={styles.routeExplainText}>{reason}</div>
        {savingVsSecond && parseFloat(savingVsSecond) > 0 && (
          <div style={styles.savingsBadge}>
            SAVES {savingVsSecond} {parsed.toToken} VS NEXT BEST
          </div>
        )}
        {route.length > 0 && (
          <div style={styles.routePathBox}>
            <div style={styles.routePathLabel}>EXECUTION PATH</div>
            <div style={styles.routePathRow}>
              <span style={styles.routeToken}>{parsed.fromToken}</span>
              {route.map((r, i) => (
                <span key={i} style={styles.routeStep}>
                  <span style={styles.routeArrow}>---&gt;</span>
                  <span style={styles.routeDex}>{r}</span>
                </span>
              ))}
              <span style={styles.routeArrow}>---&gt;</span>
              <span style={{ ...styles.routeToken, color: 'var(--pink)', textShadow: '0 0 8px rgba(255,77,143,0.4)' }}>
                {parsed.toToken}
              </span>
            </div>
          </div>
        )}
        {priceImpact && (
          <div style={{ ...styles.impactRow, color: impactHigh ? '#ff6b9d' : '#60d0a0' }}>
            {impactHigh ? 'HIGH ' : ''}PRICE IMPACT: {parseFloat(priceImpact).toFixed(2)}%
            {impactHigh && ' — consider swapping a smaller amount'}
          </div>
        )}
        <div style={styles.gasRow}>
          <span style={styles.gasLabel}>ESTIMATED GAS</span>
          <span style={styles.gasValue}>{Number(best.gas || 0).toLocaleString()} units</span>
        </div>
      </div>

      {/* ALL QUOTES TABLE */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>ALL DEX QUOTES</div>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>RANK</th>
              <th style={styles.th}>SOURCE</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>OUTPUT</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>GAS</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {all.map((q, i) => (
              <tr key={q.source} style={{ ...styles.tr, ...(i === 0 ? styles.trBest : {}) }}>
                <td style={{ ...styles.td, ...styles.rankCell }}>
                  <span style={{ ...styles.rankNum, color: i === 0 ? 'var(--cyan)' : 'var(--dimmed)' }}>
                    {i === 0 ? '01' : '0' + (i + 1)}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={{ ...styles.sourceCell, color: i === 0 ? '#d0c0f0' : 'var(--muted)' }}>
                    {q.source}
                  </span>
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <span style={{ ...styles.outputCell, color: i === 0 ? 'var(--cyan)' : 'var(--muted)' }}>
                    {q.toAmountHuman}
                    <span style={styles.outputToken}> {parsed.toToken}</span>
                  </span>
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <span style={styles.gasCell}>
                    {q.gas ? Number(q.gas).toLocaleString() : 'N/A'}
                  </span>
                </td>
                <td style={{ ...styles.td, textAlign: 'center' }}>
                  {i === 0
                    ? <span style={styles.bestTag}>BEST</span>
                    : <span style={styles.otherTag}>{i + 1}ST</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ ...styles.section, borderBottom: 'none' }}>
        <div style={styles.sectionLabel}>EXECUTE SWAP</div>
        {status === 'executing' && (
          <div style={styles.executingRow}>
            <div style={styles.execSpinner} />
            <span style={styles.execText}>PROCESSING SWAP ON CHAIN</span>
          </div>
        )}
        {status === 'done' && (
          <div style={styles.doneRow}>
            <span style={styles.doneCheck}>OK</span>
            <span style={styles.doneText}>SWAP COMPLETE</span>
            <button onClick={onReset} style={styles.newSwapBtn}>NEW SWAP</button>
          </div>
        )}
        {(status === 'ready') && (
          <div style={styles.actionRow}>
            <button onClick={onSimulate} style={styles.simBtn}>SIMULATE</button>
            {isConnected
              ? <button onClick={onExecute} style={styles.execBtn}>EXECUTE REAL SWAP</button>
              : <span style={styles.noWalletNote}>CONNECT WALLET TO EXECUTE REAL SWAP</span>
            }
          </div>
        )}
      </div>

    </div>
  )
}

const styles = {
  wrapper: { display: 'flex', flexDirection: 'column', height: '100%' },
  section: {
    padding: '20px 24px',
    borderBottom: '1px solid #1e0038',
    background: 'rgba(13,0,24,0.6)',
  },
  sectionLabel: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 9, color: 'var(--dimmed)', letterSpacing: 4,
    marginBottom: 14,
  },
  summaryGrid: {
    display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'center',
  },
  summaryBox: { display: 'flex', flexDirection: 'column', gap: 4 },
  summaryBoxRight: { alignItems: 'flex-end' },
  summaryMeta: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 8, color: 'var(--dimmed)', letterSpacing: 4,
  },
  summaryBig: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1,
  },
  summaryToken: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 15, color: 'var(--muted)', letterSpacing: 3,
  },
  summaryUsd: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11, color: 'var(--dimmed)',
  },
  summaryArrowBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  summaryArrow: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 20, color: 'var(--purple)',
    textShadow: '0 0 10px rgba(192,64,255,0.5)',
  },
  arrowLabel: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 9, color: 'var(--dimmed)', letterSpacing: 1,
  },
  routeExplainText: {
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 15, color: '#c0b0e0', lineHeight: 1.7,
    marginBottom: 12,
    fontWeight: 400,
  },
  savingsBadge: {
    display: 'inline-block',
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 9, color: 'var(--cyan)',
    border: '1px solid rgba(0,232,240,0.3)',
    padding: '4px 12px', borderRadius: 4,
    letterSpacing: 2, marginBottom: 14,
    boxShadow: '0 0 10px rgba(0,232,240,0.1)',
  },
  routePathBox: {
    background: 'rgba(192,64,255,0.06)',
    border: '1px solid rgba(192,64,255,0.2)',
    borderRadius: 8, padding: '14px 16px', marginBottom: 12,
  },
  routePathLabel: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 8, color: 'var(--dimmed)', letterSpacing: 4, marginBottom: 10,
  },
  routePathRow: {
    display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
  },
  routeToken: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 14, fontWeight: 700,
    color: 'var(--cyan)',
    textShadow: '0 0 8px rgba(0,232,240,0.4)',
    letterSpacing: 1,
  },
  routeStep: { display: 'flex', alignItems: 'center', gap: 6 },
  routeArrow: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 12, color: 'var(--dimmed)', letterSpacing: -2,
  },
  routeDex: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11, color: 'var(--purple)',
    border: '1px solid rgba(192,64,255,0.3)',
    padding: '2px 8px', borderRadius: 4,
    textShadow: '0 0 6px rgba(192,64,255,0.3)',
  },
  impactRow: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11, letterSpacing: 1, marginBottom: 10,
  },
  gasRow: { display: 'flex', gap: 10, alignItems: 'center' },
  gasLabel: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 8, color: 'var(--dimmed)', letterSpacing: 3,
  },
  gasValue: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 12, color: 'var(--yellow)',
    textShadow: '0 0 6px rgba(240,208,96,0.3)',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 8, color: 'var(--dimmed)', letterSpacing: 3,
    padding: '8px 10px', textAlign: 'left',
    borderBottom: '1px solid #1e0038',
  },
  tr: { borderBottom: '1px solid #150028' },
  trBest: { background: 'rgba(0,232,240,0.04)' },
  td: { padding: '11px 10px', verticalAlign: 'middle' },
  rankCell: {},
  rankNum: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 11, fontWeight: 700, letterSpacing: 2,
  },
  sourceCell: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 11, letterSpacing: 1,
  },
  outputCell: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 14, fontWeight: 700,
  },
  outputToken: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11, color: 'var(--dimmed)',
  },
  gasCell: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11, color: 'var(--dimmed)',
  },
  bestTag: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 8, color: 'var(--cyan)',
    border: '1px solid rgba(0,232,240,0.3)',
    padding: '3px 8px', borderRadius: 3, letterSpacing: 2,
    boxShadow: '0 0 8px rgba(0,232,240,0.15)',
  },
  otherTag: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 8, color: 'var(--dimmed)',
    border: '1px solid #1e0038',
    padding: '3px 8px', borderRadius: 3, letterSpacing: 1,
  },
  actionRow: { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' },
  simBtn: {
    padding: '12px 24px', borderRadius: 8,
    border: '1px solid #2e1050',
    background: 'rgba(192,64,255,0.08)',
    color: 'var(--muted)',
    fontFamily: "'Orbitron', sans-serif", fontSize: 10, letterSpacing: 3,
    cursor: 'pointer', transition: 'all 0.2s',
  },
  execBtn: {
    padding: '12px 28px', borderRadius: 8, border: 'none',
    background: 'linear-gradient(135deg, #ff4d8f, #c040ff)',
    color: '#fff',
    fontFamily: "'Orbitron', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 3,
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(255,77,143,0.35), 0 0 40px rgba(192,64,255,0.2)',
    transition: 'all 0.2s',
  },
  noWalletNote: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 10, color: '#2e1050', letterSpacing: 2,
  },
  executingRow: { display: 'flex', alignItems: 'center', gap: 12 },
  execSpinner: {
    width: 14, height: 14,
    border: '2px solid #2e1050',
    borderTop: '2px solid var(--cyan)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  execText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 12, color: 'var(--cyan)', letterSpacing: 3,
  },
  doneRow: { display: 'flex', alignItems: 'center', gap: 12 },
  doneCheck: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 11, color: 'var(--cyan)',
    border: '1px solid rgba(0,232,240,0.4)',
    padding: '4px 8px', borderRadius: 4, letterSpacing: 2,
  },
  doneText: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 12, color: 'var(--cyan)', letterSpacing: 3,
    textShadow: '0 0 8px rgba(0,232,240,0.4)',
    flex: 1,
  },
  newSwapBtn: {
    padding: '7px 16px', borderRadius: 6,
    border: '1px solid rgba(0,232,240,0.3)',
    background: 'rgba(0,232,240,0.06)',
    color: 'var(--cyan)',
    fontFamily: "'Orbitron', sans-serif", fontSize: 9, letterSpacing: 2, cursor: 'pointer',
  },
}