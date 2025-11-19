'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'

interface ConfirmTradeModalProps {
  isOpen: boolean
  tradeType: 'buy' | 'sell'
  amount: number
  odds: number
  outcome: string
  pool: string
  potentialReturn: number
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export default function ConfirmTradeModal({
  isOpen,
  tradeType,
  amount,
  odds,
  outcome,
  pool,
  potentialReturn,
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmTradeModalProps) {
  if (!isOpen) return null

  const profit = potentialReturn - amount

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-card border-border max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              tradeType === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              <CheckCircle2 className={tradeType === 'buy' ? 'text-green-400' : 'text-red-400'} size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Confirm {tradeType === 'buy' ? 'Purchase' : 'Sale'}</h2>
              <p className="text-sm text-muted-foreground">{pool}</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        {/* Trade Details */}
        <div className="space-y-3 mb-6 p-4 rounded-lg bg-muted/50 border border-border/50">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Outcome</span>
            <span className="font-semibold">{outcome}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-semibold">${amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Odds</span>
            <span className="font-semibold text-accent">{odds.toFixed(2)}x</span>
          </div>
          <div className="border-t border-border/50 pt-3 mt-3 flex justify-between">
            <span className="text-muted-foreground">Potential Return</span>
            <span className="font-bold text-green-400">${potentialReturn.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Profit if Correct</span>
            <span className="font-bold text-green-400">+${profit.toFixed(2)}</span>
          </div>
        </div>

        {/* Warning */}
        <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 mb-6 flex gap-2">
          <AlertCircle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-600">You can lose your entire position if the outcome is incorrect.</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className={`flex-1 text-white ${
              tradeType === 'buy'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : `Confirm ${tradeType === 'buy' ? 'Purchase' : 'Sale'}`}
          </Button>
        </div>
      </Card>
    </div>
  )
}
