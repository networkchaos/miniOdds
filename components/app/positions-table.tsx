'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface Position {
  id: string
  pool: string
  poolId: string
  outcome: string
  amount: number
  odds: number
  potential: number
  unrealizedPL: number
  unrealizedPLPercent: number
  status: string
  createdAt: string
}

export default function PositionsTable({ positions }: { positions: Position[] }) {
  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-muted/30">
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Pool</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Outcome</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Odds</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Potential</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Unrealized P&L</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, idx) => (
              <tr key={position.id} className={`border-b border-border/50 hover:bg-muted/30 transition ${
                idx === positions.length - 1 ? 'border-b-0' : ''
              }`}>
                <td className="px-6 py-4">
                  <Link href={`/app/pool/${position.poolId}`} className="text-accent hover:underline font-medium">
                    {position.pool}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm">{position.outcome}</td>
                <td className="px-6 py-4 font-semibold">${position.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-accent font-semibold">{position.odds.toFixed(2)}x</td>
                <td className="px-6 py-4 font-semibold">${position.potential.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className={`flex items-center gap-1 font-semibold ${
                    position.unrealizedPL >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {position.unrealizedPL >= 0 ? (
                      <TrendingUp size={18} />
                    ) : (
                      <TrendingDown size={18} />
                    )}
                    <span>
                      {position.unrealizedPL >= 0 ? '+' : '-'}${Math.abs(position.unrealizedPL).toLocaleString()}
                    </span>
                    <span className="text-xs">({position.unrealizedPLPercent > 0 ? '+' : ''}{position.unrealizedPLPercent.toFixed(1)}%)</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/app/pool/${position.poolId}`}>
                    <Button size="sm" variant="ghost" className="gap-2 text-accent hover:text-accent/80">
                      View
                      <ExternalLink size={16} />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {positions.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-muted-foreground text-lg">No positions yet</p>
          <p className="text-muted-foreground text-sm mt-2">Start trading to see your positions here</p>
        </div>
      )}
    </Card>
  )
}
