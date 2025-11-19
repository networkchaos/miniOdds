'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Header from '@/components/header'
import Link from 'next/link'
import { Mail, Lock, Wallet } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'email' | 'wallet'>('email')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    window.location.href = '/app'
    setIsLoading(false)
  }

  const handleWalletLogin = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    window.location.href = '/app'
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your miniOdds account</p>
          </div>

          <Card className="bg-card border-border p-8 space-y-6">
            {/* Login Method Tabs */}
            <div className="flex gap-2 bg-muted/50 p-1 rounded-lg">
              <button
                onClick={() => setLoginMethod('email')}
                className={`flex-1 px-3 py-2 rounded-md font-medium transition text-sm ${
                  loginMethod === 'email'
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Email
              </button>
              <button
                onClick={() => setLoginMethod('wallet')}
                className={`flex-1 px-3 py-2 rounded-md font-medium transition text-sm ${
                  loginMethod === 'wallet'
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Wallet
              </button>
            </div>

            {/* Email Login */}
            {loginMethod === 'email' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 bg-muted border-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 bg-muted border-border"
                    />
                  </div>
                </div>

                <div className="text-right">
                  <Link href="#" className="text-sm text-accent hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            )}

            {/* Wallet Login */}
            {loginMethod === 'wallet' && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Connect your Web3 wallet to access your account
                </p>
                <Button
                  onClick={handleWalletLogin}
                  disabled={isLoading}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground gap-2 disabled:opacity-50 py-6"
                >
                  <Wallet size={20} />
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Supports MetaMask, Coinbase Wallet, WalletConnect and more
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Don't have an account?</span>
              </div>
            </div>

            <Link href="#signup">
              <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted">
                Create Account
              </Button>
            </Link>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </main>
    </div>
  )
}
