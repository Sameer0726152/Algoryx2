import { useEffect, useState } from 'react'
import { getGasPrice } from '../services/gas.js'

export default function GasDisplay() {
  const [gas, setGas] = useState(null)
  const [tick, setTick] = useState(true)

  useEffect(() => {
    getGasPrice().then(setGas)
    const id = setInterval(() => {
      getGasPrice().then(setGas)
      setTick(t => !t)
    }, 30000)
    return () => clearInterval(id)
  }, [])

  if (!gas) return null

  return (
    <div style={styles.row}>
      <span style={{ ...styles.pulse, background: tick ? '#ffe600' : '#cc9900' }} />
      <span style={styles.label}>GAS</span>
      <span style={styles.value}>{gas.standard}</span>
      <span style={styles.unit}>GWEI</span>
      <span style={styles.sep}>|</span>
      <span style={styles.fastLabel}>FAST</span>
      <span style={styles.fastValue}>{gas.fast}</span>
    </div>
  )
}

const styles = {
  row: { display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'Share Tech Mono', monospace", fontSize: 11 },
  pulse: {
    width: 5, height: 5, borderRadius: '50%',
    transition: 'background 0.5s',
    boxShadow: '0 0 5px #ffe600',
  },
  label: { color: '#3d2560', letterSpacing: 2 },
  value: { color: '#ffe600', fontWeight: 700, textShadow: '0 0 6px rgba(255,230,0,0.5)' },
  unit: { color: '#3d2560', letterSpacing: 1 },
  sep: { color: '#2a0050', margin: '0 3px' },
  fastLabel: { color: '#3d2560', letterSpacing: 1 },
  fastValue: { color: '#bf00ff', textShadow: '0 0 6px rgba(191,0,255,0.4)' },
}