'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, X } from 'lucide-react'

interface ClosePositionModalProps {
  isOpen: boolean
  position?: {
    pool: string
    outcome: string
    amount: number
    unrealizedPL: number
    odds: number
  }
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export default function ClosePositionModal({
  isOpen,
  position,
  onConfirm,
  onCancel,
  isLoading,
}: ClosePositionModalProps) {
  if (!isOpen || !position) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-card border-border max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold">Close Position</h2>
            <p className="text-sm text-muted-foreground mt-1">{position.pool}</p>
          </div>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        {/* Position Details */}
        <div className="space-y-3 mb-6 p-4 rounded-lg bg-muted/50 border border-border/50">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Outcome</span>
            <span className="font-semibold">{position.outcome}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Investment</span>
            <span className="font-semibold">${position.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Current Value</span>
            <span className="font-semibold">${(position.amount + position.unrealizedPL).toFixed(2)}</span>
          </div>
          <div className="border-t border-border/50 pt-3 mt-3 flex justify-between">
            <span className={position.unrealizedPL >= 0 ? 'text-green-400' : 'text-red-400'}>
              Realized P&L
            </span>
            <span className={`font-bold ${position.unrealizedPL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {position.unrealizedPL >= 0 ? '+' : ''} ${position.unrealizedPL.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Warning if negative P&L */}
        {position.unrealizedPL < 0 && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 mb-6 flex gap-2">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-600">You are closing this position at a loss.</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            disabled={isLoading}
          >
            Keep Position
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Closing...' : 'Close Position'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
