'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Plus, Minus } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function RecentActivity() {
  const { trades } = useStore()

  const displayTrades = trades.length > 0 ? trades.slice(0, 10) : [
    {
      id: '1',
      type: 'buy',
      pool: 'Kenya Election 2027',
      outcome: 'Candidate A',
      amount: 2500,
      odds: 2.5,
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      type: 'buy',
      pool: 'BTC Price Above $100k',
      outcome: 'Yes',
      amount: 1500,
      odds: 1.6,
      timestamp: '5 hours ago',
    },
  ]

  return (
    <Card className="bg-card border-border">
      <div className="divide-y divide-border/50">
        {displayTrades.map((activity) => (
          <div key={activity.id} className="p-6 hover:bg-muted/30 transition">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'buy'
                    ? 'bg-green-500/20'
                    : 'bg-red-500/20'
                }`}>
                  {activity.type === 'buy' ? (
                    <Plus className={activity.type === 'buy' ? 'text-green-400' : 'text-red-400'} size={20} />
                  ) : (
                    <Minus className={activity.type === 'buy' ? 'text-green-400' : 'text-red-400'} size={20} />
                  )}
                </div>
                <div>
                  <p className="font-semibold capitalize">{activity.type === 'buy' ? 'Bought' : 'Sold'} Position</p>
                  <p className="text-sm text-muted-foreground">{activity.pool}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${activity.amount.toLocaleString()}</p>
                <p className="text-sm text-accent">{activity.odds.toFixed(2)}x</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">{activity.outcome}</span>
              <span className="text-muted-foreground">{activity.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {displayTrades.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-muted-foreground text-lg">No activity yet</p>
        </div>
      )}
    </Card>
  )
}
