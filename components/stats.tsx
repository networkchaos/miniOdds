import { Card } from '@/components/ui/card'

const stats = [
  { label: 'Active Pools', value: '2,847' },
  { label: 'Total Volume', value: '$45.2M' },
  { label: 'Community Members', value: '156K' },
  { label: 'Avg. Pool Liquidity', value: '$185K' },
]

export default function Stats() {
  return (
    <section id="stats" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="bg-card border-border p-6 text-center hover:border-accent/50 transition cursor-pointer">
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-accent">{stat.value}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
