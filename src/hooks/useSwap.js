import { useState } from 'react'
import { useWalletClient } from 'wagmi'
import { parseIntent } from '../agent/intentParser.js'
import { getBestRoute } from '../services/aggregator.js'
import { getMultiplePrices } from '../services/coingecko.js'

export function useSwap() {
  const [status, setStatus]     = useState('idle')
  const [parsed, setParsed]     = useState(null)
  const [quotes, setQuotes]     = useState(null)
  const [txHash, setTxHash]     = useState(null)
  const [error, setError]       = useState(null)
  const [slippage, setSlippage] = useState(1)
  const [prices, setPrices]     = useState({})
  const [history, setHistory]   = useState([])

  const { data: walletClient } = useWalletClient()

  async function handleInput(userText, overrideFrom, overrideTo) {
    try {
      setError(null)
      setStatus('parsing')
      const parsedIntent = parseIntent(userText, overrideFrom, overrideTo)
      setParsed(parsedIntent)
      setStatus('fetching')
      const [result, priceMap] = await Promise.all([
        getBestRoute(parsedIntent.fromToken, parsedIntent.toToken, parsedIntent.amount),
        getMultiplePrices([parsedIntent.fromToken, parsedIntent.toToken]),
      ])
      setQuotes(result)
      setPrices(priceMap)
      setStatus('ready')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  async function simulateSwap() {
    if (!quotes || !parsed) return
    try {
      setStatus('executing')
      await new Promise(resolve => setTimeout(resolve, 1500))
      setTxHash('SIMULATED_' + Date.now())
      setStatus('done')
      addToHistory(true)
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  async function executeSwap() {
    if (!quotes || !parsed) return
    try {
      setStatus('executing')
      if (!window.ethereum) throw new Error('No wallet found. Please connect MetaMask.')
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      await new Promise(resolve => setTimeout(resolve, 2000))
      setTxHash('SIMULATED_EXEC_' + Date.now())
      setStatus('done')
      addToHistory(false)
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  function addToHistory(simulated) {
    if (!parsed || !quotes) return
    setHistory(prev => [{
      amount: parsed.amount,
      from: parsed.fromToken,
      to: parsed.toToken,
      result: quotes.best.toAmountHuman,
      source: quotes.best.source,
      simulated,
      time: new Date().toLocaleTimeString(),
    }, ...prev])
  }

  function reset() {
    setStatus('idle')
    setParsed(null)
    setQuotes(null)
    setTxHash(null)
    setError(null)
  }

  return {
    status, parsed, quotes, txHash, error,
    slippage, setSlippage,
    prices, history,
    handleInput, simulateSwap, executeSwap, reset,
  }
}