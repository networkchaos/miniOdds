'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Sidebar from '@/components/app/sidebar'
import PortfolioOverview from '@/components/app/portfolio-overview'
import PositionsTable from '@/components/app/positions-table'
import RecentActivity from '@/components/app/recent-activity'
import { TrendingUp, TrendingDown, Zap, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useStore } from '@/lib/store'

export default function DashboardPage() {
  const { positions, walletBalance } = useStore()
  const [showBalance, setShowBalance] = useState(true)
  const [activeTab, setActiveTab] = useState<'positions' | 'activity'>('positions')

  // Calculate portfolio stats from real positions
  const totalInvested = positions.reduce((sum, p) => sum + p.amount, 0)
  const unrealizedPL = positions.reduce((sum, p) => sum + p.unrealizedPL, 0)
  const unrealizedPLPercent = totalInvested > 0 ? (unrealizedPL / totalInvested) * 100 : 0
  const portfolioValue = walletBalance + totalInvested + unrealizedPL

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold">Portfolio</h1>
            <p className="text-muted-foreground mt-1">Track your positions and earnings</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Portfolio Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Balance Card */}
            <Card className="bg-gradient-to-br from-accent/20 to-primary/20 border-accent/30 p-6">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm text-muted-foreground font-semibold">Portfolio Value</p>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <h3 className="text-3xl font-bold mb-2">
                {showBalance ? `$${portfolioValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}` : '••••••'}
              </h3>
            </Card>

            {/* Invested */}
            <Card className="bg-card border-border p-6">
              <p className="text-sm text-muted-foreground font-semibold mb-4">Total Invested</p>
              <h3 className="text-2xl font-bold">
                ${totalInvested.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </h3>
            </Card>

            {/* Unrealized P&L */}
            <Card className={`p-6 border ${
              unrealizedPL >= 0
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}>
              <p className="text-sm text-muted-foreground font-semibold mb-4">Unrealized P&L</p>
              <h3 className={`text-2xl font-bold ${
                unrealizedPL >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                ${Math.abs(unrealizedPL).toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </h3>
              <p className={`text-xs mt-2 ${
                unrealizedPL >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {unrealizedPL >= 0 ? '+' : '-'}{Math.abs(unrealizedPLPercent).toFixed(2)}%
              </p>
            </Card>

            {/* Active Positions */}
            <Card className="bg-card border-border p-6">
              <p className="text-sm text-muted-foreground font-semibold mb-4">Active Positions</p>
              <h3 className="text-2xl font-bold">{positions.length}</h3>
              <p className="text-xs text-muted-foreground mt-2">Currently open</p>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3">
            <Link href="/app">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                <Zap size={18} />
                Browse Pools
              </Button>
            </Link>
            <Link href="/app/create">
              <Button variant="outline" className="border-border text-muted-foreground hover:text-foreground hover:bg-muted gap-2">
                Create Pool
              </Button>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('positions')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'positions'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              My Positions ({positions.length})
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'activity'
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Activity
            </button>
          </div>

          {/* Positions Table or Empty State */}
          {activeTab === 'positions' && (
            positions.length > 0 ? (
              <PositionsTable positions={positions} />
            ) : (
              <Card className="bg-card border-border p-12 text-center">
                <p className="text-muted-foreground text-lg mb-4">No open positions</p>
                <Link href="/app">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Browse Pools
                  </Button>
                </Link>
              </Card>
            )
          )}

          {/* Recent Activity */}
          {activeTab === 'activity' && <RecentActivity />}
        </div>
      </main>
    </div>
  )
}
