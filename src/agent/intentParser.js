const TOKEN_MAP = {
  'eth': 'ETH', 'ethereum': 'ETH', 'ether': 'ETH',
  'usdc': 'USDC', 'usd coin': 'USDC',
  'usdt': 'USDT', 'tether': 'USDT',
  'dai': 'DAI',
  'wbtc': 'WBTC', 'bitcoin': 'WBTC', 'btc': 'WBTC', 'wrapped bitcoin': 'WBTC',
  'link': 'LINK', 'chainlink': 'LINK',
  'uni': 'UNI', 'uniswap': 'UNI',
  'aave': 'AAVE',
  'matic': 'MATIC', 'polygon': 'MATIC',
  'shib': 'SHIB', 'shiba': 'SHIB', 'shiba inu': 'SHIB',
}

export function parseIntent(text, overrideFrom, overrideTo) {
  const input = text.toLowerCase().trim()
  const amountMatch = input.match(/(\d+\.?\d*)/)
  const amount = amountMatch ? amountMatch[1] : '1'

  let foundTokens = []
  for (const word of Object.keys(TOKEN_MAP)) {
    const idx = input.indexOf(word)
    if (idx !== -1) foundTokens.push({ token: TOKEN_MAP[word], idx })
  }
  foundTokens.sort((a, b) => a.idx - b.idx)

  const fromToken = overrideFrom || foundTokens[0]?.token || 'ETH'
  const rawTo = foundTokens[foundTokens.length - 1]?.token || 'USDC'
  const toToken = overrideTo || (rawTo === fromToken ? (fromToken === 'ETH' ? 'USDC' : 'ETH') : rawTo)

  return { fromToken, toToken, amount, raw: text }
}