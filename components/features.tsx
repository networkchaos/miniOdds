import { Card } from '@/components/ui/card'
import { Zap, Users, TrendingUp, Lock, Coins, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Custom Pools',
    description: 'Create prediction markets on any outcome with DAO-approved odds and liquidity.',
  },
  {
    icon: TrendingUp,
    title: 'Trade Odds',
    description: 'Buy and sell risk positions dynamically. Profit from odds movements before pool resolution.',
  },
  {
    icon: Users,
    title: 'DAO Governance',
    description: 'Vote on pool creation, resolution methods, and protocol upgrades with BetToken.',
  },
  {
    icon: Coins,
    title: 'Multi-Currency',
    description: 'Bet in USDT or MPesa. Instant on/off ramps for African markets.',
  },
  {
    icon: Lock,
    title: 'Secure Protocol',
    description: 'All bets secured by audited smart contracts with transparent settlement.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Track pool performance, odds movements, and your portfolio in real-time.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create, trade, and govern prediction markets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <Card key={i} className="bg-background border-border p-6 hover:border-accent/50 transition group cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition">
                  <Icon className="text-accent" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
