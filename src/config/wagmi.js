import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { walletConnect, injected } from 'wagmi/connectors'

export const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [
    injected(),
    walletConnect({ projectId: import.meta.env.VITE_WALLETCONNECT_ID }),
  ],
  transports: {
    [mainnet.id]: http(import.meta.env.VITE_ALCHEMY_RPC),
  },
})