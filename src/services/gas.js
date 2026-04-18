export async function getGasPrice() {
  try {
    const response = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle')
    const data = await response.json()
    if (data.status === '1') {
      return {
        low: data.result.SafeGasPrice,
        standard: data.result.ProposeGasPrice,
        fast: data.result.FastGasPrice,
      }
    }
    return null
  } catch {
    return null
  }
}