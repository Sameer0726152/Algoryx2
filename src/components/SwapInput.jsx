import { useState } from 'react'

const EXAMPLES = [
  'Convert 1 ETH to USDC',
  'Swap 0.5 ETH to DAI',
  'Get LINK with 1 ETH',
  'Convert 2 ETH to bitcoin',
  'Swap 50 DAI to USDT',
]

export default function SwapInput({ onSubmit, disabled }) {
  const [text, setText] = useState('')
  const [focused, setFocused] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit(text.trim())
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={{
          ...styles.inputWrapper,
          borderColor: focused ? 'rgba(0,245,255,0.5)' : '#2a0050',
          boxShadow: focused
            ? '0 0 0 1px rgba(0,245,255,0.2), 0 0 20px rgba(0,245,255,0.1), inset 0 0 20px rgba(0,245,255,0.03)'
            : '0 0 15px rgba(191,0,255,0.08)',
        }}>
          <span style={styles.prompt}>{'>'}</span>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder='e.g. "swap 1 eth to usdc at best rate"'
            disabled={disabled}
            style={styles.input}
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          style={{
            ...styles.button,
            opacity: (disabled || !text.trim()) ? 0.4 : 1,
          }}
        >
          <span style={styles.btnIcon}>◈</span>
          EXECUTE
        </button>
      </form>

      <div style={styles.examples}>
        {EXAMPLES.map(ex => (
          <button
            key={ex}
            onClick={() => setText(ex)}
            style={styles.chip}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: { width: '100%' },
  form: { display: 'flex', gap: 10, width: '100%' },
  inputWrapper: {
    flex: 1,
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '0 16px',
    borderRadius: 10,
    border: '1px solid',
    background: 'rgba(10,0,20,0.9)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.2s',
  },
  prompt: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 18, color: '#00f5ff',
    textShadow: '0 0 8px #00f5ff',
    userSelect: 'none',
  },
  input: {
    flex: 1,
    padding: '14px 0',
    background: 'transparent', border: 'none', outline: 'none',
    color: '#e8d5ff',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 14, letterSpacing: 0.5,
  },
  button: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '0 24px', borderRadius: 10, border: 'none',
    background: 'linear-gradient(135deg, #ff2d78, #bf00ff)',
    color: '#fff', fontSize: 12,
    fontFamily: "'Orbitron', sans-serif", fontWeight: 700, letterSpacing: 2,
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(255,45,120,0.4), 0 0 40px rgba(191,0,255,0.2)',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  btnIcon: { fontSize: 14 },
  examples: { display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' },
  chip: {
    padding: '5px 12px', borderRadius: 20,
    border: '1px solid #1a0030',
    background: 'transparent', color: '#3d2560',
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11, cursor: 'pointer',
    transition: 'all 0.2s',
    letterSpacing: 0.5,
  },
}