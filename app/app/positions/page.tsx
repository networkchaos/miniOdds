'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Sidebar from '@/components/app/sidebar'
import { ArrowLeft, TrendingUp, TrendingDown, X } from 'lucide-react'
import Link from 'next/link'

const POSITIONS = [
  {
    id: '1',
    pool: 'Kenya Election 2027',
    poolId: '1',
    outcome: 'Candidate A',
    amount: 2500,
    odds: 2.5,
    potential: 6250,
    unrealizedPL: 3750,
    unrealizedPLPercent: 150,
    status: 'active',
    createdAt: '2024-11-10',
  },
  {
    id: '2',
    pool: 'BTC Price Above $100k',
    poolId: '2',
    outcome: 'Yes',
    amount: 1500,
    odds: 1.6,
    potential: 2400,
    unrealizedPL: 900,
    unrealizedPLPercent: 60,
    status: 'active',
    createdAt: '2024-11-12',
  },
  {
    id: '3',
    pool: 'AfCFTA Trade Volume',
    poolId: '3',
    outcome: 'No',
    amount: 1000,
    odds: 1.9,
    potential: 1900,
    unrealizedPL: 900,
    unrealizedPLPercent: 90,
    status: 'active',
    createdAt: '2024-11-14',
  },
]

export default function PositionsPage() {
  const [positions, setPositions] = useState(POSITIONS)
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)

  const handleClosePosition = (id: string) => {
    setPositions(positions.filter(p => p.id !== id))
    setSelectedPosition(null)
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/app/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft size={18} />
                  Back
                </Button>
              </Link>
              <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-semibold">
                {positions.length} Active
              </span>
            </div>
            <h1 className="text-3xl font-bold">My Positions</h1>
            <p className="text-muted-foreground mt-1">Manage your open prediction positions</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {positions.length > 0 ? (
            <div className="space-y-4">
              {positions.map(position => (
                <Card
                  key={position.id}
                  className="bg-card border-border p-6 hover:border-accent/50 transition cursor-pointer"
                  onClick={() => setSelectedPosition(position.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Link href={`/app/pool/${position.poolId}`}>
                          <h3 className="text-lg font-bold hover:text-accent transition">{position.pool}</h3>
                        </Link>
                        <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
                          {position.outcome}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Amount</p>
                          <p className="font-semibold">${position.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Odds</p>
                          <p className="font-semibold">{position.odds.toFixed(2)}x</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Potential Return</p>
                          <p className="font-semibold">${position.potential.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Unrealized P&L</p>
                          <p className={`font-semibold ${position.unrealizedPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {position.unrealizedPL >= 0 ? '+' : '-'}${Math.abs(position.unrealizedPL).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Link href={`/app/pool/${position.poolId}`}>
                        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleClosePosition(position.id)
                        }}
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive/10"
                      >
                        <X size={18} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border p-12 text-center">
              <p className="text-muted-foreground text-lg mb-4">No open positions</p>
              <Link href="/app">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Browse Pools
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
