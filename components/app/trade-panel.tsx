'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowRightLeft, Zap, Info, AlertCircle } from 'lucide-react'
import { useStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

interface TradePanelProps {
  outcome: {
    id: string
    label: string
    odds: number
    pool: number
  }
  poolTitle: string
  poolId: string
}

export default function TradePanel({ outcome, poolTitle, poolId }: TradePanelProps) {
  const router = useRouter()
  const { walletBalance, addTrade, addPosition, updateAsset } = useStore()
  const [amount, setAmount] = useState('')
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const amountNum = parseFloat(amount) || 0
  const potentialReturn = amountNum * outcome.odds
  const profit = potentialReturn - amountNum
  const protocolFee = amountNum * 0.01

  const handleExecuteTrade = async () => {
    setError('')

    if (amountNum <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (amountNum + protocolFee > walletBalance) {
      setError('Insufficient balance')
      return
    }

    setIsLoading(true)

    try {
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Create trade record
      const trade = {
        id: Date.now().toString(),
        type: tradeType,
        poolId,
        pool: poolTitle,
        outcome: outcome.label,
        amount: amountNum,
        odds: outcome.odds,
        timestamp: new Date().toISOString(),
      }

      // Add position
      const position = {
        id: Date.now().toString(),
        poolId,
        pool: poolTitle,
        outcome: outcome.label,
        amount: amountNum,
        odds: outcome.odds,
        potential: potentialReturn,
        unrealizedPL: 0,
        unrealizedPLPercent: 0,
        status: 'active' as const,
        createdAt: new Date().toLocaleDateString(),
      }

      addTrade(trade)
      if (tradeType === 'buy') {
        addPosition(position)
      }

      // Update wallet balance
      updateAsset('USDT', walletBalance - amountNum - protocolFee)

      // Clear form and show success
      setAmount('')
      alert(`${tradeType === 'buy' ? 'Position opened' : 'Position closed'} successfully!`)

      // Redirect to positions after successful trade
      setTimeout(() => {
        router.push('/app/dashboard')
      }, 500)
    } catch (err) {
      setError('Trade failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMaxClick = () => {
    setAmount(Math.max(0, walletBalance - protocolFee).toString())
  }

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-accent/30 sticky top-24 overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-accent" />

      <div className="relative space-y-6 p-6">
        {/* Trade Type Selector */}
        <div className="flex gap-2 bg-muted/50 p-1 rounded-lg">
          <button
            onClick={() => setTradeType('buy')}
            className={`flex-1 px-3 py-2 rounded-md font-medium transition text-sm ${
              tradeType === 'buy'
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Buy Position
          </button>
          <button
            onClick={() => setTradeType('sell')}
            className={`flex-1 px-3 py-2 rounded-md font-medium transition text-sm ${
              tradeType === 'sell'
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sell Position
          </button>
        </div>

        {/* Selected Outcome */}
        <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
          <p className="text-xs text-muted-foreground mb-1">SELECTED OUTCOME</p>
          <h3 className="text-lg font-bold mb-2">{outcome.label}</h3>
          <p className="text-2xl font-bold text-accent">{outcome.odds.toFixed(2)}x</p>
        </div>

        {/* Amount Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Amount</label>
            <button onClick={handleMaxClick} className="text-xs text-accent hover:underline">Max</button>
          </div>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-muted border-border pr-12"
              disabled={isLoading}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              USDT
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Balance: ${walletBalance.toFixed(2)}</p>
        </div>

        {/* Calculation Display */}
        {amountNum > 0 && (
          <div className="space-y-2 p-4 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Risk Amount</span>
              <span className="font-medium">${amountNum.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Protocol Fee (1%)</span>
              <span className="font-medium">${protocolFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Odds</span>
              <span className="font-medium">{outcome.odds.toFixed(2)}x</span>
            </div>
            <div className="h-px bg-border/50 my-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Potential Return</span>
              <span className={`font-bold ${profit > 0 ? 'text-green-400' : 'text-foreground'}`}>
                ${potentialReturn.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Profit if Correct</span>
              <span className={`font-bold ${profit > 0 ? 'text-green-400' : 'text-foreground'}`}>
                +${profit.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex gap-2">
            <AlertCircle size={16} className="text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}

        {/* Fee Info */}
        <div className="p-3 rounded-lg bg-accent/5 border border-accent/20 flex gap-2">
          <Info size={16} className="text-accent flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            1% protocol fee applies to all trades. Slippage may occur with large trades.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            disabled={amountNum <= 0 || isLoading}
            onClick={handleExecuteTrade}
            className={`w-full gap-2 font-bold py-6 transition ${
              tradeType === 'buy'
                ? 'bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            <Zap size={18} />
            {isLoading ? 'Processing...' : (tradeType === 'buy' ? 'Buy Position' : 'Sell Position')}
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2 border-border text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <ArrowRightLeft size={18} />
            Preview Trade
          </Button>
        </div>

        {/* Warning */}
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <p className="text-xs text-destructive font-semibold mb-1">Risk Warning</p>
          <p className="text-xs text-muted-foreground">
            Prediction markets carry risk. You can lose your entire position.
          </p>
        </div>
      </div>
    </Card>
  )
}
