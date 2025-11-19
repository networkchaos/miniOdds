'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Sidebar from '@/components/app/sidebar'
import { ArrowLeft, Plus, X, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const RESOLUTION_TYPES = ['Date', 'Manual', 'Oracle']
const POOL_CATEGORIES = ['Politics', 'Crypto', 'Economics', 'Tech', 'Sports', 'Entertainment', 'Other']

interface Outcome {
  id: string
  label: string
  weight: number
}

export default function CreatePoolPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const [poolData, setPoolData] = useState({
    title: '',
    description: '',
    category: 'Politics',
    liquidity: '',
    outcomes: [{ id: '1', label: 'Yes', weight: 1 }, { id: '2', label: 'No', weight: 1 }],
    resolutionType: 'Date',
    resolutionDate: '',
    currency: 'USDT',
  })

  const handleAddOutcome = () => {
    const newOutcome: Outcome = {
      id: Date.now().toString(),
      label: `Option ${poolData.outcomes.length + 1}`,
      weight: 1,
    }
    setPoolData({
      ...poolData,
      outcomes: [...poolData.outcomes, newOutcome],
    })
  }

  const handleRemoveOutcome = (id: string) => {
    if (poolData.outcomes.length > 2) {
      setPoolData({
        ...poolData,
        outcomes: poolData.outcomes.filter(o => o.id !== id),
      })
    }
  }

  const handleOutcomeChange = (id: string, field: 'label' | 'weight', value: string | number) => {
    setPoolData({
      ...poolData,
      outcomes: poolData.outcomes.map(o =>
        o.id === id ? { ...o, [field]: value } : o
      ),
    })
  }

  const handleSubmitPool = async () => {
    setIsSubmitting(true)
    try {
      console.log('[v0] Deploying pool with data:', poolData)
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('[v0] Pool deployed successfully')
      router.push('/app')
    } catch (error) {
      console.error('[v0] Error deploying pool:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-6 py-6 flex items-center gap-4">
            <Link href="/app">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft size={18} />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Create Prediction Pool</h1>
              <p className="text-muted-foreground text-sm">Step {step} of 3</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-4xl mx-auto px-6 pb-6">
            <div className="flex gap-2">
              {[1, 2, 3].map(s => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition ${
                    s <= step ? 'bg-accent' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Step 1: Pool Details */}
          {step === 1 && (
            <div className="space-y-6 fade-in">
              <Card className="bg-card border-border p-6">
                <h2 className="text-xl font-bold mb-6">Pool Details</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Pool Title</label>
                    <Input
                      placeholder="e.g., Kenya Election 2027"
                      value={poolData.title}
                      onChange={(e) => setPoolData({ ...poolData, title: e.target.value })}
                      className="bg-muted border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      placeholder="Describe what this prediction pool is about..."
                      value={poolData.description}
                      onChange={(e) => setPoolData({ ...poolData, description: e.target.value })}
                      className="w-full bg-muted border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={poolData.category}
                      onChange={(e) => setPoolData({ ...poolData, category: e.target.value })}
                      className="w-full bg-muted border border-border rounded-lg p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      {POOL_CATEGORIES.map(cat => (
                        <option key={cat} value={cat} className="bg-card">{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>

              {/* Outcomes */}
              <Card className="bg-card border-border p-6">
                <h2 className="text-xl font-bold mb-6">Outcomes</h2>

                <div className="space-y-4">
                  {poolData.outcomes.map((outcome, idx) => (
                    <div key={outcome.id} className="flex items-end gap-3">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Option {idx + 1}</label>
                        <Input
                          placeholder="e.g., Yes"
                          value={outcome.label}
                          onChange={(e) => handleOutcomeChange(outcome.id, 'label', e.target.value)}
                          className="bg-muted border-border"
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-sm font-medium mb-2">Weight</label>
                        <Input
                          type="number"
                          min="1"
                          value={outcome.weight}
                          onChange={(e) => handleOutcomeChange(outcome.id, 'weight', parseInt(e.target.value) || 1)}
                          className="bg-muted border-border"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveOutcome(outcome.id)}
                        disabled={poolData.outcomes.length <= 2}
                        className="p-2 hover:bg-muted rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X size={20} className="text-muted-foreground" />
                      </button>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={handleAddOutcome}
                    className="w-full gap-2 border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Plus size={18} />
                    Add Outcome
                  </Button>
                </div>

                {/* Initial Odds Preview */}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <p className="text-sm font-medium mb-3">Initial Odds Preview</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {poolData.outcomes.map((o, i) => {
                      const totalWeight = poolData.outcomes.reduce((sum, oc) => sum + oc.weight, 0)
                      const odds = totalWeight / o.weight
                      const pool = o.weight / totalWeight
                      return (
                        <div key={i} className="bg-muted/50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground truncate">{o.label}</p>
                          <p className="font-bold text-accent">{odds.toFixed(2)}x</p>
                          <p className="text-xs text-muted-foreground">{(pool * 100).toFixed(0)}%</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </Card>

              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!poolData.title || !poolData.description || poolData.outcomes.some(o => !o.label)}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Resolution & Liquidity */}
          {step === 2 && (
            <div className="space-y-6 fade-in">
              <Card className="bg-card border-border p-6">
                <h2 className="text-xl font-bold mb-6">Resolution Settings</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Initial Liquidity</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="100000"
                        value={poolData.liquidity}
                        onChange={(e) => setPoolData({ ...poolData, liquidity: e.target.value })}
                        className="flex-1 bg-muted border-border"
                      />
                      <select
                        value={poolData.currency}
                        onChange={(e) => setPoolData({ ...poolData, currency: e.target.value })}
                        className="bg-muted border border-border rounded-lg px-3 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <option value="USDT">USDT</option>
                        <option value="USDC">USDC</option>
                        <option value="KES">KES</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Resolution Method</label>
                    <div className="grid grid-cols-3 gap-3">
                      {RESOLUTION_TYPES.map(type => (
                        <button
                          key={type}
                          onClick={() => setPoolData({ ...poolData, resolutionType: type })}
                          className={`p-4 rounded-lg border-2 transition font-medium ${
                            poolData.resolutionType === type
                              ? 'border-accent bg-accent/10'
                              : 'border-border hover:border-accent/50'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {poolData.resolutionType === 'Date' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Resolution Date</label>
                      <Input
                        type="date"
                        value={poolData.resolutionDate}
                        onChange={(e) => setPoolData({ ...poolData, resolutionDate: e.target.value })}
                        className="bg-muted border-border"
                      />
                    </div>
                  )}

                  {poolData.resolutionType === 'Oracle' && (
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/30 flex gap-3">
                      <AlertCircle size={20} className="text-accent flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">Oracle Resolution</p>
                        <p className="text-muted-foreground">This pool will use Chainlink or custom oracle for automatic resolution.</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="bg-card border-border p-6 bg-accent/5 border-accent/30">
                <h3 className="font-semibold mb-3">Pool Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pool Title:</span>
                    <span className="font-medium">{poolData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Outcomes:</span>
                    <span className="font-medium">{poolData.outcomes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Initial Liquidity:</span>
                    <span className="font-medium">{poolData.liquidity || '0'} {poolData.currency}</span>
                  </div>
                </div>
              </Card>

              <div className="flex justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!poolData.liquidity || !poolData.resolutionType || (poolData.resolutionType === 'Date' && !poolData.resolutionDate)}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Deploy */}
          {step === 3 && (
            <div className="space-y-6 fade-in">
              <Card className="bg-card border-border p-6">
                <h2 className="text-xl font-bold mb-6">Review Your Pool</h2>

                <div className="space-y-6">
                  {/* Pool Info */}
                  <div className="pb-6 border-b border-border/50">
                    <p className="text-xs text-muted-foreground font-semibold mb-3">POOL INFORMATION</p>
                    <h3 className="text-2xl font-bold mb-2">{poolData.title}</h3>
                    <p className="text-muted-foreground">{poolData.description}</p>
                    <div className="flex gap-4 mt-4">
                      <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-semibold">
                        {poolData.category}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-semibold">
                        {poolData.resolutionType}
                      </span>
                    </div>
                  </div>

                  {/* Outcomes */}
                  <div className="pb-6 border-b border-border/50">
                    <p className="text-xs text-muted-foreground font-semibold mb-3">OUTCOMES & INITIAL ODDS</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {poolData.outcomes.map((o, i) => {
                        const totalWeight = poolData.outcomes.reduce((sum, oc) => sum + oc.weight, 0)
                        const odds = totalWeight / o.weight
                        const pool = o.weight / totalWeight
                        return (
                          <div key={i} className="bg-muted/50 rounded-lg p-4">
                            <p className="text-sm font-medium mb-2">{o.label}</p>
                            <div className="space-y-1">
                              <div>
                                <p className="text-xs text-muted-foreground">Odds</p>
                                <p className="text-xl font-bold text-accent">{odds.toFixed(2)}x</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Pool</p>
                                <p className="text-sm font-semibold">{(pool * 100).toFixed(1)}%</p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Liquidity */}
                  <div>
                    <p className="text-xs text-muted-foreground font-semibold mb-3">DEPLOYMENT</p>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Initial Liquidity</p>
                          <p className="text-2xl font-bold">{poolData.liquidity} {poolData.currency}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Network</p>
                          <p className="text-lg font-bold">Polygon</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-accent/10 border-accent/30 p-6">
                <div className="flex gap-3">
                  <AlertCircle size={20} className="text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Pool Creation Fee</p>
                    <p className="text-sm text-muted-foreground">A 1% liquidity fee will be charged upon pool creation. This supports DAO operations.</p>
                  </div>
                </div>
              </Card>

              <div className="flex justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmitPool}
                  disabled={isSubmitting}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Deploying...' : 'Deploy Pool to Blockchain'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
