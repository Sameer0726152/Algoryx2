import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div style={styles.row}>
        <span style={styles.dot} />
        <span style={styles.address}>{address.slice(0, 6)}...{address.slice(-4)}</span>
        <button onClick={() => disconnect()} style={styles.disconnectBtn}>DISCONNECT</button>
      </div>
    )
  }

  return (
    <button onClick={() => connect({ connector: connectors[0] })} style={styles.connectBtn}>
      <span style={styles.connectIcon}>⬡</span> CONNECT WALLET
    </button>
  )
}

const styles = {
  row: { display: 'flex', alignItems: 'center', gap: 8 },
  dot: {
    width: 7, height: 7, borderRadius: '50%',
    background: '#00f5ff',
    boxShadow: '0 0 6px #00f5ff, 0 0 12px #00f5ff',
  },
  address: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 13, color: '#7a8a99', letterSpacing: 1,
  },
  disconnectBtn: {
    padding: '5px 12px', borderRadius: 6,
    border: '1px solid #2a0050', background: 'transparent',
    color: '#3d2560', fontSize: 10,
    fontFamily: "'Orbitron', sans-serif", letterSpacing: 2,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  connectBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '9px 20px', borderRadius: 8,
    border: '1px solid #ff2d78',
    background: 'linear-gradient(135deg, rgba(255,45,120,0.15), rgba(191,0,255,0.1))',
    color: '#ff2d78', fontSize: 12,
    fontFamily: "'Orbitron', sans-serif", letterSpacing: 2,
    cursor: 'pointer',
    boxShadow: '0 0 12px rgba(255,45,120,0.2), inset 0 0 12px rgba(255,45,120,0.05)',
    transition: 'all 0.2s',
  },
  connectIcon: { fontSize: 14 },
}