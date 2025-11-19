import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 fade-in">
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight text-balance">
              Own Your
              <span className="text-accent"> Odds</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              Create custom prediction pools with DAO governance. Trade odds dynamically. Earn through risk positions. Bet your way across Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 group">
                <Link href="/app" className="flex items-center gap-2">
                  Start Betting
                  <ArrowRight className="group-hover:translate-x-1 transition" size={20} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-border hover:bg-muted">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div>
                <p className="text-sm text-muted-foreground">Secured by</p>
                <p className="font-semibold">Smart Contracts</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div>
                <p className="text-sm text-muted-foreground">Available on</p>
                <p className="font-semibold">15+ Chains</p>
              </div>
            </div>
          </div>

          {/* Right Visualization */}
          <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-accent/10 to-primary/10 border border-border/50 flex items-center justify-center fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-8">
              <div className="w-32 h-32 rounded-full border-2 border-accent/30 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
                  <div className="text-2xl font-bold text-accent">3.5x</div>
                </div>
              </div>
              <p className="text-muted-foreground text-center text-sm">Average Returns Across Pools</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
