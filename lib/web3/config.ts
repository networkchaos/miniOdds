import { createConfig, http } from 'wagmi'
import { polygon, polygonMumbai, celo, base } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'
import { createWeb3Modal } from '@web3modal/wagmi/react'

// Get projectId from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id'

// Configure chains & providers
const chains = [polygonMumbai, polygon, celo, base] as const

export const config = createConfig({
  chains,
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId }),
  ],
  transports: {
    [polygonMumbai.id]: http(),
    [polygon.id]: http(),
    [celo.id]: http(),
    [base.id]: http(),
  },
})

// Create Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#6366f1',
  },
})

// Contract addresses (update after deployment)
export const CONTRACT_ADDRESSES = {
  BET_TOKEN: process.env.NEXT_PUBLIC_BET_TOKEN_ADDRESS || '',
  POOL_FACTORY: process.env.NEXT_PUBLIC_POOL_FACTORY_ADDRESS || '',
  USDT: process.env.NEXT_PUBLIC_USDT_ADDRESS || '0x3813e82e6f7098b9583FC0F33a962D02018B6803', // Mumbai testnet
}

export const RPC_URLS = {
  polygonMumbai: 'https://rpc.ankr.com/polygon_mumbai',
  polygon: 'https://rpc.ankr.com/polygon',
  celo: 'https://rpc.ankr.com/celo',
  base: 'https://mainnet.base.org',
}

