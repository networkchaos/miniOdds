import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/30 rounded-2xl p-12 text-center space-y-6">
          <h2 className="text-4xl sm:text-5xl font-bold text-balance">
            Ready to try miniOdds?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of prediction market participants earning returns through smart risk management.
          </p>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 group mx-auto">
            <Link href="/app" className="flex items-center gap-2">
              Launch App Today
              <ArrowRight className="group-hover:translate-x-1 transition" size={20} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
