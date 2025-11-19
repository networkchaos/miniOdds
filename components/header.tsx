'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed w-full top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-accent" />
            </div>
            <span className="font-bold text-lg text-balance">miniOdds</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition">
              How It Works
            </Link>
            <Link href="#stats" className="text-muted-foreground hover:text-foreground transition">
              Pools
            </Link>
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost">
              <Link href="/login">Log In</Link>
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/app">Launch App</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden py-4 border-t border-border space-y-4 pb-4">
            <Link href="#features" className="block text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <Link href="#how-it-works" className="block text-muted-foreground hover:text-foreground transition">
              How It Works
            </Link>
            <Link href="#stats" className="block text-muted-foreground hover:text-foreground transition">
              Pools
            </Link>
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="ghost" className="w-full">
                <Link href="/login">Log In</Link>
              </Button>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/app">Launch App</Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
