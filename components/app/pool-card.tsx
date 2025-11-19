'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Users, Zap } from 'lucide-react'
import Link from 'next/link'

interface PoolCardProps {
  pool: {
    id: string
    title: string
    description: string
    category: string
    liquidity: number
    volume: number
    participants: number
    status: string
    odds: Array<{ option: string; odds: number; pool: number }>
    resolutionDate: string
    creator: string
  }
}

export default function PoolCard({ pool }: PoolCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`
    }
    return `$${num}`
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Card className="bg-card border-border hover:border-accent/50 transition overflow-hidden group cursor-pointer">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-br from-accent/5 to-primary/5">
        <div className="flex justify-between items-start mb-3">
          <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold">
            {pool.category}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            pool.status === 'active'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {pool.status === 'active' ? 'Active' : 'Closed'}
          </span>
        </div>
        <h3 className="text-lg font-bold text-balance">{pool.title}</h3>
        <p className="text-sm text-muted-foreground mt-2">{pool.description}</p>
      </div>

      {/* Odds */}
      <div className="p-6 border-b border-border/50">
        <p className="text-xs text-muted-foreground font-semibold mb-3">OUTCOMES</p>
        <div className="space-y-2">
          {pool.odds.map((odd, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className="flex-1">
                  <p className="text-sm font-medium">{odd.option}</p>
                  <div className="w-full bg-muted rounded-full h-1 mt-1">
                    <div
                      className="bg-accent h-1 rounded-full transition-all"
                      style={{ width: `${odd.pool * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="text-sm font-bold text-accent">{odd.odds.toFixed(2)}x</p>
                <p className="text-xs text-muted-foreground">{(odd.pool * 100).toFixed(0)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 bg-muted/30 border-b border-border/50">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Liquidity</p>
            <p className="font-bold text-sm">{formatNumber(pool.liquidity)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">24h Volume</p>
            <p className="font-bold text-sm">{formatNumber(pool.volume)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Participants</p>
            <p className="font-bold text-sm">{pool.participants.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Resolves</p>
          <p className="text-sm font-medium">{formatDate(pool.resolutionDate)}</p>
        </div>
        <Link href={`/app/pool/${pool.id}`}>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 group">
            <Zap size={16} className="group-hover:translate-y-0.5 transition" />
            Trade
          </Button>
        </Link>
      </div>
    </Card>
  )
}
