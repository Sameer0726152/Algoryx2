import { get0xQuote } from './zerox.js'
import { getParaswapQuote } from './paraswap.js'
import { getKyberQuote } from './kyber.js'
import { getOpenOceanQuote } from './openocean.js'

export async function getBestRoute(fromToken, toToken, amount) {
  const results = await Promise.allSettled([
    get0xQuote(fromToken, toToken, amount),
    getParaswapQuote(fromToken, toToken, amount),
    getKyberQuote(fromToken, toToken, amount),
    getOpenOceanQuote(fromToken, toToken, amount),
  ])

  const successful = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value)

  if (successful.length === 0) {
    throw new Error('All DEX quotes failed. Check API connectivity.')
  }

  const sorted = successful.sort((a, b) => {
    try { return Number(BigInt(b.toAmount) - BigInt(a.toAmount)) }
    catch { return parseFloat(b.toAmountHuman) - parseFloat(a.toAmountHuman) }
  })

  const best = sorted[0]
  const secondBest = sorted[1]
  const savingVsWorst = sorted.length > 1
    ? (parseFloat(best.toAmountHuman) - parseFloat(sorted[sorted.length - 1].toAmountHuman)).toFixed(4)
    : null
  const savingVsSecond = secondBest
    ? (parseFloat(best.toAmountHuman) - parseFloat(secondBest.toAmountHuman)).toFixed(4)
    : null

  return {
    best,
    all: sorted,
    savingVsWorst,
    savingVsSecond,
    reason: buildReason(best, sorted, toToken),
  }
}

function buildReason(best, all, toToken) {
  const lines = []
  lines.push(`${best.source} returns the highest output of ${best.toAmountHuman} ${toToken}.`)
  if (all.length > 1) {
    const second = all[1]
    const diff = (parseFloat(best.toAmountHuman) - parseFloat(second.toAmountHuman)).toFixed(4)
    lines.push(`This is ${diff} ${toToken} more than ${second.source} (${second.toAmountHuman}).`)
  }
  if (best.gas) {
    lines.push(`Estimated gas cost is ${Number(best.gas).toLocaleString()} units.`)
  }
  return lines.join(' ')
}