import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { getTokenChart } from '../services/coingecko.js'

const TOKEN_COLORS = {
  ETH: '#00f5ff', WBTC: '#ff9900', USDC: '#2775ca',
  DAI: '#ffe600', LINK: '#2a5ada', UNI: '#ff2d78',
  AAVE: '#b6509e', MATIC: '#8247e5', SHIB: '#ff6900', USDT: '#26a17b',
}

export default function PriceChart({ token }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setData([])
    getTokenChart(token).then(d => { setData(d); setLoading(false) })
  }, [token])

  const color = TOKEN_COLORS[token] || '#00f5ff'

  if (loading) return (
    <div style={styles.loading}>
      <span style={{ color, textShadow: '0 0 8px ' + color, animation: 'neon-flicker 2s infinite' }}>◎</span>
      <span>LOADING {token} CHART</span>
      <span style={{ opacity: 0.4, animation: 'flicker 1.5s infinite' }}>▮</span>
    </div>
  )

  if (!data.length) return null

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{
        background: '#0a0010', border: '1px solid ' + color + '55',
        borderRadius: 6, padding: '8px 12px',
        boxShadow: '0 0 15px ' + color + '33',
        fontFamily: "'Share Tech Mono', monospace", fontSize: 11,
      }}>
        <div style={{ color: '#3d2560', marginBottom: 2 }}>{label}</div>
        <div style={{ color, textShadow: '0 0 6px ' + color }}>
          ${payload[0].value?.toLocaleString()}
        </div>
      </div>
    )
  }

  return (
    <div style={{ ...styles.container, borderColor: color + '33' }} className="animate-in">
      <div style={styles.header}>
        <span style={{ ...styles.tokenLabel, color, textShadow: '0 0 8px ' + color }}>
          {token}
        </span>
        <span style={styles.chartLabel}>7D PRICE CHART</span>
      </div>
      <ResponsiveContainer width="100%" height={110}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={'grad-' + token} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tick={{ fontSize: 9, fill: '#3d2560', fontFamily: "'Share Tech Mono', monospace" }}
            interval={Math.floor(data.length / 4)}
            axisLine={false} tickLine={false}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 9, fill: '#3d2560', fontFamily: "'Share Tech Mono', monospace" }}
            width={60} axisLine={false} tickLine={false}
            tickFormatter={v => '$' + v.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone" dataKey="price"
            stroke={color} strokeWidth={1.5}
            fill={'url(#grad-' + token + ')'}
            dot={false} activeDot={{ r: 3, fill: color, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

const styles = {
  container: {
    background: 'rgba(10,0,20,0.8)',
    border: '1px solid',
    borderRadius: 12, padding: '14px 16px',
    backdropFilter: 'blur(10px)',
  },
  header: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 },
  tokenLabel: { fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 2 },
  chartLabel: { fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#3d2560', letterSpacing: 3 },
  loading: {
    display: 'flex', alignItems: 'center', gap: 8,
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: 11, color: '#3d2560', letterSpacing: 3,
    padding: '8px 0',
  },
}