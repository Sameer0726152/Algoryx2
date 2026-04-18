export const TOKEN_ADDRESSES = {
  ETH:  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  DAI:  '0x6b175474e89094c44da98b954eedeac495271d0f',
  WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  LINK: '0x514910771af9ca656af840dff83e8264ecf986ca',
  UNI:  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  AAVE: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
  MATIC:'0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
  SHIB: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
}

export const TOKEN_DECIMALS = {
  ETH: 18, USDC: 6, USDT: 6, DAI: 18, WBTC: 8,
  LINK: 18, UNI: 18, AAVE: 18, MATIC: 18, SHIB: 18,
}

export function toSmallestUnit(amount, tokenSymbol) {
  const decimals = TOKEN_DECIMALS[tokenSymbol] || 18
  return BigInt(Math.floor(parseFloat(amount) * 10 ** decimals)).toString()
}