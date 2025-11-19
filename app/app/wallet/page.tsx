'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Sidebar from '@/components/app/sidebar'
import { Wallet, Send, ArrowDownLeft, ArrowUpRight, Copy, ExternalLink, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useStore } from '@/lib/store'

const WALLET_ADDRESS = '0x7a5c...1f2e'
const BALANCES = [
  { symbol: 'USDT', balance: 5240.50, usdValue: 5240.50, network: 'Polygon' },
  { symbol: 'USDC', balance: 2100.00, usdValue: 2100.00, network: 'Polygon' },
  { symbol: 'BET', balance: 1250.00, usdValue: 3750.00, network: 'Polygon' },
  { symbol: 'KES', balance: 500000.00, usdValue: 3859.23, network: 'Polygon' },
]

const TRANSACTIONS = [
  {
    id: '1',
    type: 'deposit',
    asset: 'USDT',
    amount: 5000,
    status: 'completed',
    timestamp: '2024-11-18 14:30',
    hash: '0x123abc...',
  },
  {
    id: '2',
    type: 'withdraw',
    asset: 'USDT',
    amount: 2000,
    status: 'completed',
    timestamp: '2024-11-17 09:15',
    hash: '0x456def...',
  },
  {
    id: '3',
    type: 'deposit',
    asset: 'KES',
    amount: 500000,
    status: 'completed',
    timestamp: '2024-11-16 16:45',
    hash: '0x789ghi...',
  },
  {
    id: '4',
    type: 'withdraw',
    asset: 'BET',
    amount: 500,
    status: 'pending',
    timestamp: '2024-11-15 11:20',
    hash: '0xabc123...',
  },
]

export default function WalletPage() {
  const { assets, walletBalance, updateAsset } = useStore()
  const [activeTab, setActiveTab] = useState<'assets' | 'transactions'>('assets')
  const [showDeposit, setShowDeposit] = useState(false)
  const [depositAsset, setDepositAsset] = useState('USDT')
  const [depositAmount, setDepositAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const displayAssets = assets.length > 0 ? assets : BALANCES
  const totalUSDValue = displayAssets.reduce((sum, b) => sum + (b.value || 0), 0)

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return

    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      const amount = parseFloat(depositAmount)
      updateAsset(depositAsset, (assets.find(a => a.symbol === depositAsset)?.balance || 0) + amount)
      setDepositAmount('')
      setShowDeposit(false)
      alert(`Deposit of ${amount} ${depositAsset} initiated successfully!`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Wallet size={32} className="text-accent" />
              Wallet
            </h1>
            <p className="text-muted-foreground mt-1">Manage your assets and transactions</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Wallet Overview */}
          <Card className="bg-gradient-to-br from-accent/20 to-primary/20 border-accent/30 p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <p className="text-sm text-muted-foreground font-semibold mb-2">Total Portfolio Value</p>
                <h2 className="text-4xl font-bold mb-4">${totalUSDValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-black/20 rounded-lg px-3 py-2 w-fit">
                  <span className="font-mono">{WALLET_ADDRESS}</span>
                  <button className="hover:text-foreground transition">
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <Button
                  onClick={() => setShowDeposit(!showDeposit)}
                  className="flex-1 md:flex-none bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
                >
                  <ArrowDownLeft size={18} />
                  Deposit
                </Button>
                <Button variant="outline" className="flex-1 md:flex-none border-border text-muted-foreground hover:text-foreground hover:bg-muted gap-2">
                  <ArrowUpRight size={18} />
                  Withdraw
                </Button>
                <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground hover:bg-muted">
                  <RefreshCw size={18} />
                </Button>
              </div>
            </div>
          </Card>

          {/* Deposit Modal */}
          {showDeposit && (
            <Card className="bg-card border-border p-6 border-accent/30">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Deposit Funds</h3>
                <button
                  onClick={() => setShowDeposit(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Asset</label>
                  <select
                    value={depositAsset}
                    onChange={(e) => setDepositAsset(e.target.value)}
                    className="w-full bg-muted border border-border rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {displayAssets.map(b => (
                      <option key={b.symbol} value={b.symbol} className="bg-card">
                        {b.symbol}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Amount</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="bg-muted border-border"
                    disabled={isProcessing}
                  />
                </div>

                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Deposit Methods Available:</p>
                  <ul className="space-y-1 text-sm">
                    <li className="text-accent">✓ MPesa (KES only)</li>
                    <li className="text-accent">✓ Bank Transfer (USDT/USDC)</li>
                    <li className="text-accent">✓ Crypto Wallet (Polygon)</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowDeposit(false)}
                    variant="outline"
                    className="flex-1 border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                    disabled={isProcessing}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeposit}
                    disabled={isProcessing || !depositAmount}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    {isProcessing ? 'Processing...' : 'Continue Deposit'}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('assets')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'assets'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Assets
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'transactions'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Transactions
            </button>
          </div>

          {/* Assets Tab */}
          {activeTab === 'assets' && (
            <Card className="bg-card border-border divide-y divide-border/50">
              {displayAssets.map((asset, idx) => (
                <div key={idx} className="p-6 hover:bg-muted/30 transition flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent text-sm">
                      {asset.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{asset.symbol}</p>
                      <p className="text-sm text-muted-foreground">{asset.network}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{asset.balance.toLocaleString('en-US', { maximumFractionDigits: 2 })} {asset.symbol}</p>
                    <p className="text-sm text-accent">${asset.usdValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                  </div>
                </div>
              ))}
            </Card>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <Card className="bg-card border-border overflow-hidden">
              <div className="divide-y divide-border/50">
                {TRANSACTIONS.map((tx, idx) => (
                  <div key={tx.id} className="p-6 hover:bg-muted/30 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-3 rounded-lg ${
                          tx.type === 'deposit'
                            ? 'bg-green-500/20'
                            : 'bg-red-500/20'
                        }`}>
                          {tx.type === 'deposit' ? (
                            <ArrowDownLeft className="text-green-400" size={24} />
                          ) : (
                            <ArrowUpRight className="text-red-400" size={24} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold capitalize">{tx.type}</p>
                          <p className="text-sm text-muted-foreground">{tx.timestamp}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${
                          tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {tx.type === 'deposit' ? '+' : '-'}{tx.amount.toLocaleString()} {tx.asset}
                        </p>
                        <div className="flex items-center gap-2 justify-end mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            tx.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {tx.status === 'completed' ? 'Completed' : 'Pending'}
                          </span>
                          <button className="text-muted-foreground hover:text-foreground transition">
                            <ExternalLink size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {TRANSACTIONS.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-muted-foreground text-lg">No transactions yet</p>
                </div>
              )}
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
