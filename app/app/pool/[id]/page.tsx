'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Sidebar from '@/components/app/sidebar'
import { ArrowLeft, TrendingUp, Users, Activity, Info } from 'lucide-react'
import Link from 'next/link'
import PoolChart from '@/components/app/pool-chart'
import TradePanel from '@/components/app/trade-panel'

const POOL_DETAILS = {
  id: '1',
  title: 'Kenya Election 2027',
  description: 'Who will win the 2027 Kenyan presidential election?',
  category: 'Politics',
  liquidity: 2500000,
  volume24h: 8900000,
  participants: 3421,
  status: 'active',
  outcomes: [
    { id: 'a', label: 'Candidate A', odds: 2.5, pool: 0.4, volume: 3560000, participants: 1200 },
    { id: 'b', label: 'Candidate B', odds: 1.8, pool: 0.35, volume: 3150000, participants: 1100 },
    { id: 'c', label: 'Candidate C', odds: 3.2, pool: 0.25, volume: 2190000, participants: 1121 },
  ],
  resolutionDate: '2027-08-15',
  creator: '0x7a5c...1f2e',
  createdAt: '2024-11-15',
  historicalOdds: [
    { time: '00:00', odds: [2.4, 1.7, 3.3] },
    { time: '04:00', odds: [2.45, 1.75, 3.25] },
    { time: '08:00', odds: [2.5, 1.8, 3.2] },
    { time: '12:00', odds: [2.48, 1.82, 3.22] },
    { time: '16:00', odds: [2.5, 1.8, 3.2] },
  ]
}

export default function PoolDetailPage({ params }: { params: { id: string } }) {
  const [selectedOutcome, setSelectedOutcome] = useState(POOL_DETAILS.outcomes[0])
  const [activeTab, setActiveTab] = useState<'trade' | 'info' | 'activity'>('trade')

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/app">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft size={18} />
                  Back
                </Button>
              </Link>
              <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-semibold">
                {POOL_DETAILS.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold">
                Active
              </span>
            </div>
            <h1 className="text-3xl font-bold text-balance">{POOL_DETAILS.title}</h1>
            <p className="text-muted-foreground mt-2">{POOL_DETAILS.description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Chart & Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="bg-card border-border p-4">
                  <p className="text-xs text-muted-foreground mb-2">Liquidity</p>
                  <p className="text-2xl font-bold">${(POOL_DETAILS.liquidity / 1000000).toFixed(1)}M</p>
                </Card>
                <Card className="bg-card border-border p-4">
                  <p className="text-xs text-muted-foreground mb-2">24h Volume</p>
                  <p className="text-2xl font-bold">${(POOL_DETAILS.volume24h / 1000000).toFixed(1)}M</p>
                </Card>
                <Card className="bg-card border-border p-4">
                  <p className="text-xs text-muted-foreground mb-2">Participants</p>
                  <p className="text-2xl font-bold">{POOL_DETAILS.participants.toLocaleString()}</p>
                </Card>
              </div>

              {/* Chart */}
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-4">Odds Movement (24h)</h3>
                <PoolChart data={POOL_DETAILS.historicalOdds} outcomes={POOL_DETAILS.outcomes} />
              </Card>

              {/* Outcomes */}
              <Card className="bg-card border-border p-6">
                <h3 className="font-bold mb-4">Pool Outcomes</h3>
                <div className="space-y-3">
                  {POOL_DETAILS.outcomes.map(outcome => (
                    <button
                      key={outcome.id}
                      onClick={() => setSelectedOutcome(outcome)}
                      className={`w-full p-4 rounded-lg border-2 transition text-left ${
                        selectedOutcome.id === outcome.id
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold">{outcome.label}</h4>
                        <span className="text-accent font-bold text-lg">{outcome.odds.toFixed(2)}x</span>
                      </div>

                      <div className="w-full bg-muted rounded-full h-2 mb-3">
                        <div
                          className="bg-accent h-2 rounded-full transition-all"
                          style={{ width: `${outcome.pool * 100}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${(outcome.volume / 1000000).toFixed(1)}M volume</span>
                        <span>{outcome.participants.toLocaleString()} participants</span>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Pool Info Tabs */}
              <Card className="bg-card border-border">
                <div className="flex border-b border-border">
                  <button
                    onClick={() => setActiveTab('trade')}
                    className={`flex-1 px-6 py-4 font-medium transition border-b-2 ${
                      activeTab === 'trade'
                        ? 'border-accent text-accent'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <TrendingUp size={18} />
                      Trade
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`flex-1 px-6 py-4 font-medium transition border-b-2 ${
                      activeTab === 'info'
                        ? 'border-accent text-accent'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <Info size={18} />
                      Info
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`flex-1 px-6 py-4 font-medium transition border-b-2 ${
                      activeTab === 'activity'
                        ? 'border-accent text-accent'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <Activity size={18} />
                      Activity
                    </div>
                  </button>
                </div>

                <div className="p-6">
                  {activeTab === 'trade' && (
                    <div className="space-y-3">
                      <p className="text-muted-foreground text-sm">Select an outcome on the left to trade</p>
                    </div>
                  )}

                  {activeTab === 'info' && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Resolution Date</p>
                        <p className="font-semibold">{new Date(POOL_DETAILS.resolutionDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Pool Creator</p>
                        <p className="font-semibold font-mono text-accent">{POOL_DETAILS.creator}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Created</p>
                        <p className="font-semibold">{new Date(POOL_DETAILS.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'activity' && (
                    <div className="space-y-3">
                      <div className="text-center py-8">
                        <Activity className="mx-auto text-muted-foreground mb-2" size={24} />
                        <p className="text-muted-foreground">Recent activity will appear here</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right: Trade Panel */}
            <div className="lg:col-span-1">
              <TradePanel outcome={selectedOutcome} poolTitle={POOL_DETAILS.title} poolId={POOL_DETAILS.id} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
