'use client'

import Link from 'next/link'
import { Twitter, Github, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Footer() {
  const router = useRouter()

  const handleNavigation = (href: string) => {
    if (href.startsWith('/')) {
      router.push(href)
    } else {
      // For external links
      window.open(href, '_blank')
    }
  }

  return (
    <footer className="border-t border-border bg-card/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => router.push('/app')} className="hover:text-foreground transition">Pools</button></li>
              <li><button onClick={() => router.push('/app')} className="hover:text-foreground transition">Trading</button></li>
              <li><button onClick={() => router.push('/app/governance')} className="hover:text-foreground transition">Governance</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => handleNavigation('https://docs.onyourodds.io')} className="hover:text-foreground transition">Docs</button></li>
              <li><button onClick={() => handleNavigation('https://blog.onyourodds.io')} className="hover:text-foreground transition">Blog</button></li>
              <li><button onClick={() => handleNavigation('https://onyourodds.io/faq')} className="hover:text-foreground transition">FAQ</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => handleNavigation('https://discord.gg/onyourodds')} className="hover:text-foreground transition">Discord</button></li>
              <li><button onClick={() => handleNavigation('https://twitter.com/onyourodds')} className="hover:text-foreground transition">Twitter</button></li>
              <li><button onClick={() => handleNavigation('https://t.me/onyourodds')} className="hover:text-foreground transition">Telegram</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => router.push('#privacy')} className="hover:text-foreground transition">Privacy</button></li>
              <li><button onClick={() => router.push('#terms')} className="hover:text-foreground transition">Terms</button></li>
              <li><button onClick={() => router.push('#contact')} className="hover:text-foreground transition">Contact</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 miniOdds. Built for African markets.
          </p>
          <div className="flex gap-4">
            <button onClick={() => handleNavigation('https://twitter.com/onyourodds')} className="text-muted-foreground hover:text-foreground transition">
              <Twitter size={20} />
            </button>
            <button onClick={() => handleNavigation('https://github.com/onyourodds')} className="text-muted-foreground hover:text-foreground transition">
              <Github size={20} />
            </button>
            <button onClick={() => handleNavigation('https://discord.gg/onyourodds')} className="text-muted-foreground hover:text-foreground transition">
              <MessageCircle size={20} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
