'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const steps = [
  {
    number: 1,
    title: 'Create a Pool',
    description: 'Define your prediction market with custom outcomes and odds. Submit for DAO approval.',
    details: [
      'Set prediction question and outcomes',
      'Configure odds and weights',
      'Define resolution method (date/oracle/manual)',
      'Set liquidity and fee structure'
    ]
  },
  {
    number: 2,
    title: 'Fund the Pool',
    description: 'Add initial liquidity as the pool creator. Others can join to deepen the market.',
    details: [
      'Deposit USDT, USDC, or KES',
      'Receive LP tokens for your share',
      'Earn fees from all pool trades',
      'Liquidity stays until resolution'
    ]
  },
  {
    number: 3,
    title: 'Trade Positions',
    description: 'Buy outcomes at current odds or sell to lock in profits before the pool resolves.',
    details: [
      'Buy positions at current odds',
      'Sell before resolution for profit',
      'Dynamic odds update in real-time',
      'Slippage protection built-in'
    ]
  },
  {
    number: 4,
    title: 'Pool Resolution',
    description: 'When the event occurs, the pool resolves and winning positions pay out automatically.',
    details: [
      'Oracle determines true outcome',
      'Winning tickets settle instantly',
      'Losers forfeit their positions',
      'Fees distributed to LP providers'
    ]
  },
]

const features = [
  {
    title: 'Custom Odds',
    description: 'Set weighted odds for each outcome. Odds shift dynamically based on trading volume.'
  },
  {
    title: 'DAO Voting',
    description: 'BetToken holders vote on new pools, fee changes, and protocol upgrades.'
  },
  {
    title: 'Multi-Currency',
    description: 'Bet in USDT, USDC, BET, or KES with instant on/off ramps including MPesa.'
  },
  {
    title: 'Transparent Settlement',
    description: 'All outcomes resolved on-chain via smart contracts or trusted oracles.'
  },
]

export default function HowItWorks() {
  const [expandedStep, setExpandedStep] = useState(0)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-accent" />
              </div>
              <span className="font-bold text-lg">miniOdds</span>
            </div>
            <Link href="/">
              <Button variant="ghost" className="cursor-pointer">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-20 fade-in">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 text-balance">
              How It Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              miniOdds makes prediction markets accessible to everyone. Here's how to get started.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4 mb-20">
            {steps.map((step, idx) => (
              <Card
                key={idx}
                className="bg-card border-border p-6 overflow-hidden cursor-pointer hover:border-accent/50 transition"
                onClick={() => setExpandedStep(expandedStep === idx ? -1 : idx)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-accent">{step.number}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  <ArrowRight
                    size={20}
                    className={`flex-shrink-0 mt-1 transition-transform ${
                      expandedStep === idx ? 'rotate-90' : ''
                    }`}
                  />
                </div>

                {/* Expanded Content */}
                {expandedStep === idx && (
                  <div className="mt-6 pl-14 space-y-3 border-t border-border pt-6">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                        <p className="text-muted-foreground">{detail}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Key Features */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, i) => (
                <Card key={i} className="bg-card border-border p-6">
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join the prediction market revolution today.
            </p>
            <Link href="/app">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground cursor-pointer gap-2 group">
                Launch App
                <ArrowRight className="group-hover:translate-x-1 transition" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
