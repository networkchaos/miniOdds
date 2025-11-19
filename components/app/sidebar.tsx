'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Home, Zap, TrendingUp, Users, Settings, LogOut, Menu, X, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { label: 'Dashboard', icon: Home, href: '/app' },
    { label: 'Pools', icon: Zap, href: '/app' },
    { label: 'My Positions', icon: TrendingUp, href: '/app/positions' },
    { label: 'Governance', icon: Users, href: '/app/governance' },
    { label: 'Wallet', icon: Wallet, href: '/app/wallet' },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 hover:bg-muted rounded-lg transition"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`fixed lg:relative w-64 h-screen border-r border-border bg-card flex flex-col transition-all duration-300 z-40 ${
        isOpen ? 'left-0' : '-left-full lg:left-0'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-accent" />
            </div>
            <span className="font-bold text-lg">miniOdds</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition group"
              >
                <Icon size={20} className="group-hover:text-accent transition" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Wallet Info & Settings */}
        <div className="border-t border-border p-4 space-y-2">
          <div className="px-4 py-3 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground mb-1">Wallet</p>
            <p className="font-mono text-sm truncate">0x7a5c...1f2e</p>
            <p className="text-xs text-accent mt-2">BET: 1,250</p>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
            <Settings size={18} />
            Settings
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
            <LogOut size={18} />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
