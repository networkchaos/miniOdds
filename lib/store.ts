import { create } from 'zustand'

export interface UserPosition {
  id: string
  poolId: string
  pool: string
  outcome: string
  amount: number
  odds: number
  potential: number
  unrealizedPL: number
  unrealizedPLPercent: number
  status: string
  createdAt: string
}

export interface WalletAsset {
  symbol: string
  balance: number
  value: number
}

export interface TradeTransaction {
  id: string
  type: 'buy' | 'sell'
  poolId: string
  pool: string
  outcome: string
  amount: number
  odds: number
  timestamp: string
}

interface Store {
  // User wallet state
  walletBalance: number
  assets: WalletAsset[]
  setWalletBalance: (balance: number) => void
  addAsset: (asset: WalletAsset) => void
  updateAsset: (symbol: string, balance: number) => void

  // Positions state
  positions: UserPosition[]
  addPosition: (position: UserPosition) => void
  closePosition: (id: string) => void
  updatePosition: (id: string, updates: Partial<UserPosition>) => void

  // Trade history
  trades: TradeTransaction[]
  addTrade: (trade: TradeTransaction) => void

  // UI state
  selectedPool: string | null
  setSelectedPool: (poolId: string | null) => void
}

export const useStore = create<Store>((set) => ({
  walletBalance: 10000,
  assets: [
    { symbol: 'USDT', balance: 5000, value: 5000 },
    { symbol: 'USDC', balance: 3000, value: 3000 },
    { symbol: 'BET', balance: 2000, value: 2000 },
    { symbol: 'KES', balance: 100000, value: 1000 },
  ],
  setWalletBalance: (balance) => set({ walletBalance: balance }),
  addAsset: (asset) => set((state) => ({
    assets: [...state.assets, asset],
    walletBalance: state.walletBalance + asset.value,
  })),
  updateAsset: (symbol, balance) => set((state) => ({
    assets: state.assets.map((a) =>
      a.symbol === symbol ? { ...a, balance } : a
    ),
  })),

  positions: [],
  addPosition: (position) => set((state) => ({
    positions: [...state.positions, position],
  })),
  closePosition: (id) => set((state) => ({
    positions: state.positions.filter((p) => p.id !== id),
  })),
  updatePosition: (id, updates) => set((state) => ({
    positions: state.positions.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    ),
  })),

  trades: [],
  addTrade: (trade) => set((state) => ({
    trades: [trade, ...state.trades],
  })),

  selectedPool: null,
  setSelectedPool: (poolId) => set({ selectedPool: poolId }),
}))
