import { useState } from 'react'
import { useSwap } from './hooks/useSwap.js'
import WalletButton from './components/WalletButton.jsx'
import GasDisplay from './components/GasDisplay.jsx'
import SlippageSelector from './components/SlippageSelector.jsx'
import SwapInput from './components/SwapInput.jsx'
import PriceChart from './components/PriceChart.jsx'
import QuotePanel from './components/QuotePanel.jsx'
import SwapHistory from './components/SwapHistory.jsx'

export default function App() {
  const {
    status, parsed, quotes, txHash, error,
    slippage, setSlippage,
    prices, history,
    handleInput, simulateSwap, executeSwap, reset,
  } = useSwap()

  const isLoading = status === 'parsing' || status === 'fetching'
  const etherscanUrl = txHash && !txHash.startsWith('SIMULATED')
    ? 'https://etherscan.io/tx/' + txHash : null

  return (
    <div style={styles.root}>
      <div style={styles.gridFloor} />

      {/* TOP BAR */}
      <header style={styles.topBar}>
        <div style={styles.logoGroup}>
          <div style={styles.logoDiamond} />
          <span style={styles.logoText}>SWAP<span style={styles.logoAccent}>WAVE</span></span>
          <span style={styles.logoSub}>// INTENT-BASED DEX AGGREGATOR //</span>
        </div>
        <div style={styles.headerRight}>
          <GasDisplay />
          <WalletButton />
        </div>
      </header>

      <div style={styles.topDivider} />

      {/* MAIN GRID */}
      <main style={styles.mainGrid}>

        {/* LEFT COLUMN — Input + Chart + History */}
        <div style={styles.leftCol}>

          {/* Input box */}
          <section style={styles.panel}>
            <div style={styles.panelLabel}>SWAP INTENT</div>
            <SwapInput onSubmit={(t) => handleInput(t, null, null)} disabled={isLoading} />
            <div style={styles.controlsRow}>
              <SlippageSelector value={slippage} onChange={setSlippage} />
            </div>
          </section>

          {/* Status */}
          {isLoading && (
            <section style={styles.panel}>
              <div style={styles.statusRow}>
                <div style={styles.spinner} />
                <span style={styles.statusText}>
                  {status === 'parsing' ? 'PARSING INTENT' : 'QUERYING 4 DEX AGGREGATORS'}
                </span>
              </div>
            </section>
          )}

          {/* Parsed confirmation */}
          {parsed && !isLoading && (
            <section style={{ ...styles.panel, ...styles.parsedPanel }} className="animate-in">
              <span style={styles.parsedLabel}>UNDERSTOOD</span>
              <span style={styles.parsedAmount}>{parsed.amount}</span>
              <span style={styles.parsedFrom}>{parsed.fromToken}</span>
              <span style={styles.parsedArrow}>--------</span>
              <span style={styles.parsedTo}>{parsed.toToken}</span>
              <span style={styles.parsedSlip}>SLIP {slippage}%</span>
            </section>
          )}

          {/* Price chart */}
          {parsed && (
            <section style={styles.panel}>
              <div style={styles.panelLabel}>PRICE CHART — {parsed.fromToken}</div>
              <PriceChart token={parsed.fromToken} />
            </section>
          )}

          {/* Error */}
          {error && (
            <section style={{ ...styles.panel, ...styles.errorPanel }} className="animate-in">
              <span style={styles.errorIcon}>!</span>
              <span style={styles.errorText}>{error}</span>
              <button onClick={reset} style={styles.retryBtn}>RETRY</button>
            </section>
          )}

          {/* TX result */}
          {txHash && (
            <section style={{ ...styles.panel, ...styles.txPanel }} className="animate-in">
              <span style={styles.txCheck}>OK</span>
              <div style={styles.txContent}>
                <span style={styles.txTitle}>
                  {txHash.startsWith('SIMULATED') ? 'SIMULATION SUCCESSFUL' : 'TRANSACTION SUBMITTED'}
                </span>
                <span style={styles.txSub}>
                  {txHash.startsWith('SIMULATED')
                    ? 'Swap would execute successfully with current liquidity'
                    : 'Transaction broadcast to Ethereum mainnet'
                  }
                </span>
                {etherscanUrl && (
                  <a href={etherscanUrl} target="_blank" rel="noreferrer" style={styles.etherscanLink}>
                    VIEW ON ETHERSCAN
                  </a>
                )}
              </div>
            </section>
          )}

          {/* History */}
          {history.length > 0 && (
            <section style={styles.panel}>
              <div style={styles.panelLabel}>SESSION LOG</div>
              <SwapHistory history={history} />
            </section>
          )}

        </div>

        {/* RIGHT COLUMN — Quotes + Route */}
        <div style={styles.rightCol}>
          {!quotes && !isLoading && (
            <section style={{ ...styles.panel, ...styles.emptyPanel }}>
              <div style={styles.emptyDiamond} />
              <span style={styles.emptyTitle}>AWAITING SWAP INTENT</span>
              <span style={styles.emptySub}>Type a swap in plain English to begin</span>
              <div style={styles.emptyExamples}>
                {['Convert 1 ETH to USDC', 'Swap 0.5 ETH to DAI', 'Get WBTC with 2 ETH'].map(ex => (
                  <span key={ex} style={styles.emptyEx}>{ex}</span>
                ))}
              </div>
            </section>
          )}

          {isLoading && (
            <section style={{ ...styles.panel, ...styles.emptyPanel }}>
              <div style={styles.loadingGrid}>
                {['0x', 'Paraswap', 'KyberSwap', 'OpenOcean'].map(s => (
                  <div key={s} style={styles.loadingSource}>
                    <div style={styles.loadingDot} />
                    <span style={styles.loadingName}>{s}</span>
                  </div>
                ))}
              </div>
              <span style={styles.emptySub}>Fetching quotes from all sources...</span>
            </section>
          )}

          {quotes && (
            <QuotePanel
              quotes={quotes}
              parsed={parsed}
              prices={prices}
              status={status}
              onSimulate={simulateSwap}
              onExecute={executeSwap}
              onReset={reset}
            />
          )}
        </div>

      </main>
    </div>
  )
}

const styles = {
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  gridFloor: {
    position: 'fixed',
    bottom: 0, left: 0, right: 0,
    height: '40vh',
    background: `
      linear-gradient(transparent, rgba(192,64,255,0.05) 60%, rgba(255,77,143,0.06)),
      repeating-linear-gradient(90deg, rgba(0,232,240,0.05) 0px, rgba(0,232,240,0.05) 1px, transparent 1px, transparent 60px),
      repeating-linear-gradient(0deg, rgba(0,232,240,0.05) 0px, rgba(0,232,240,0.05) 1px, transparent 1px, transparent 60px)
    `,
    backgroundSize: '60px 60px',
    animation: 'grid-move 5s linear infinite',
    pointerEvents: 'none',
    zIndex: 0,
    maskImage: 'linear-gradient(to bottom, transparent, black)',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 28px',
    position: 'relative',
    zIndex: 2,
  },
  logoGroup: { display: 'flex', alignItems: 'center', gap: 14 },
  logoDiamond: {
    width: 18, height: 18,
    background: 'var(--cyan)',
    transform: 'rotate(45deg)',
    boxShadow: '0 0 10px var(--cyan), 0 0 22px rgba(0,232,240,0.4)',
    flexShrink: 0,
  },
  logoText: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 26, fontWeight: 900,
    color: '#fff', letterSpacing: 5,
    textShadow: '0 0 18px rgba(255,255,255,0.25)',
  },
  logoAccent: {
    color: 'var(--pink)',
    textShadow: '0 0 12px var(--pink), 0 0 28px rgba(255,77,143,0.5)',
  },
  logoSub: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 10, color: 'var(--dimmed)', letterSpacing: 3,
    display: 'none',
  },
  headerRight: { display: 'flex', alignItems: 'center', gap: 20 },
  topDivider: {
    height: 1,
    background: 'linear-gradient(90deg, transparent 0%, var(--purple) 20%, var(--cyan) 50%, var(--pink) 80%, transparent 100%)',
    opacity: 0.6,
    position: 'relative', zIndex: 2,
  },
  mainGrid: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 0,
    padding: '0',
    position: 'relative',
    zIndex: 1,
    minHeight: 0,
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    borderRight: '1px solid #1e0038',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 80px)',
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 80px)',
  },
  panel: {
    padding: '20px 24px',
    borderBottom: '1px solid #1e0038',
    position: 'relative',
    background: 'rgba(13,0,24,0.6)',
    backdropFilter: 'blur(8px)',
  },
  panelLabel: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 9, color: 'var(--dimmed)', letterSpacing: 4,
    marginBottom: 14,
  },
  controlsRow: { marginTop: 16 },
  statusRow: { display: 'flex', alignItems: 'center', gap: 12 },
  spinner: {
    width: 16, height: 16,
    border: '2px solid #2e1050',
    borderTop: '2px solid var(--cyan)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    flexShrink: 0,
  },
  statusText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 12, color: 'var(--cyan)', letterSpacing: 3,
    animation: 'flicker 2s infinite',
  },
  parsedPanel: {
    display: 'flex', alignItems: 'center', gap: 10,
    flexWrap: 'wrap',
    background: 'rgba(0,232,240,0.04)',
    borderBottom: '1px solid rgba(0,232,240,0.15)',
  },
  parsedLabel: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 8, color: 'var(--dimmed)', letterSpacing: 4,
    width: '100%', marginBottom: 4,
  },
  parsedAmount: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 22, fontWeight: 800, color: '#fff',
  },
  parsedFrom: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 15, color: 'var(--cyan)',
    textShadow: '0 0 8px rgba(0,232,240,0.5)',
    letterSpacing: 2,
  },
  parsedArrow: {
    fontFamily: "'Share Tech Mono', monospace",
    color: 'var(--dimmed)', fontSize: 13, letterSpacing: -1,
  },
  parsedTo: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 15, color: 'var(--pink)',
    textShadow: '0 0 8px rgba(255,77,143,0.5)',
    letterSpacing: 2,
  },
  parsedSlip: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 10, color: 'var(--dimmed)',
    border: '1px solid #2e1050',
    padding: '2px 8px', borderRadius: 4, letterSpacing: 1,
  },
  errorPanel: {
    display: 'flex', alignItems: 'center', gap: 12,
    background: 'rgba(255,77,143,0.06)',
    borderBottom: '1px solid rgba(255,77,143,0.25)',
  },
  errorIcon: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 16, color: 'var(--pink)',
    textShadow: '0 0 8px var(--pink)',
    fontWeight: 700,
  },
  errorText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 12, color: '#cc7799', flex: 1, letterSpacing: 0.5,
  },
  retryBtn: {
    padding: '5px 14px', borderRadius: 5,
    border: '1px solid var(--pink)',
    background: 'transparent', color: 'var(--pink)',
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 9, letterSpacing: 2, cursor: 'pointer',
  },
  txPanel: {
    display: 'flex', alignItems: 'flex-start', gap: 14,
    background: 'rgba(0,232,240,0.04)',
    borderBottom: '1px solid rgba(0,232,240,0.2)',
  },
  txCheck: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 11, color: 'var(--cyan)',
    border: '1px solid rgba(0,232,240,0.4)',
    padding: '4px 8px', borderRadius: 4, letterSpacing: 2,
    boxShadow: '0 0 10px rgba(0,232,240,0.2)',
    flexShrink: 0,
  },
  txContent: { display: 'flex', flexDirection: 'column', gap: 4 },
  txTitle: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 12, color: 'var(--cyan)', letterSpacing: 2,
  },
  txSub: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11, color: 'var(--muted)',
  },
  etherscanLink: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11, color: 'var(--purple)',
    textDecoration: 'none', letterSpacing: 1,
    textShadow: '0 0 6px rgba(192,64,255,0.4)',
  },
  emptyPanel: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    minHeight: 'calc(100vh - 100px)',
    gap: 16, textAlign: 'center',
  },
  emptyDiamond: {
    width: 40, height: 40,
    border: '2px solid #2e1050',
    transform: 'rotate(45deg)',
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 14, color: 'var(--dimmed)', letterSpacing: 4,
  },
  emptySub: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11, color: '#3a2550', letterSpacing: 1,
  },
  emptyExamples: { display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 },
  emptyEx: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11, color: '#2e1050',
    border: '1px solid #1a0030',
    padding: '5px 14px', borderRadius: 20,
  },
  loadingGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%', maxWidth: 280,
  },
  loadingSource: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '10px 14px',
    border: '1px solid #2e1050', borderRadius: 8,
    background: 'rgba(13,0,24,0.5)',
  },
  loadingDot: {
    width: 6, height: 6, borderRadius: '50%',
    background: 'var(--cyan)',
    boxShadow: '0 0 6px var(--cyan)',
    animation: 'pulse-glow 1.2s infinite',
  },
  loadingName: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 9, color: 'var(--muted)', letterSpacing: 2,
  },
}