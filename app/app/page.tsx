'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Sidebar from '@/components/app/sidebar'
import PoolCard from '@/components/app/pool-card'
import { Search, Plus, Filter } from 'lucide-react'
import Link from 'next/link'

const MOCK_POOLS = [
  {
    id: '1',
    title: 'Kenya Election 2027',
    description: 'Who will win the 2027 Kenyan presidential election?',
    category: 'Politics',
    liquidity: 2500000,
    volume: 8900000,
    participants: 3421,
    status: 'active',
    odds: [
      { option: 'Candidate A', odds: 2.5, pool: 0.4 },
      { option: 'Candidate B', odds: 1.8, pool: 0.35 },
      { option: 'Candidate C', odds: 3.2, pool: 0.25 },
    ],
    resolutionDate: '2027-08-15',
    creator: '0x7a5c...1f2e',
  },
  {
    id: '2',
    title: 'BTC Price Above $100k',
    description: 'Will Bitcoin reach $100,000 by end of Q1 2025?',
    category: 'Crypto',
    liquidity: 5200000,
    volume: 18500000,
    participants: 7821,
    status: 'active',
    odds: [
      { option: 'Yes', odds: 1.6, pool: 0.62 },
      { option: 'No', odds: 2.4, pool: 0.38 },
    ],
    resolutionDate: '2025-03-31',
    creator: '0x2b8c...3a4f',
  },
  {
    id: '3',
    title: 'AfCFTA Trade Volume',
    description: 'Will intra-African trade exceed $100B in 2025?',
    category: 'Economics',
    liquidity: 1800000,
    volume: 4200000,
    participants: 1245,
    status: 'active',
    odds: [
      { option: 'Yes', odds: 2.1, pool: 0.55 },
      { option: 'No', odds: 1.9, pool: 0.45 },
    ],
    resolutionDate: '2025-12-31',
    creator: '0x9f1d...5e8a',
  },
  {
    id: '4',
    title: 'Nigeria Tech Startups',
    description: 'Will 5+ Nigerian startups reach unicorn status in 2025?',
    category: 'Tech',
    liquidity: 950000,
    volume: 2100000,
    participants: 645,
    status: 'active',
    odds: [
      { option: 'Yes', odds: 3.8, pool: 0.35 },
      { option: 'No', odds: 1.3, pool: 0.65 },
    ],
    resolutionDate: '2025-12-31',
    creator: '0x4e7b...2c9d',
  },
  {
    id: '5',
    title: 'African Soccer Cup Final',
    description: 'Who will win AFCON 2025?',
    category: 'Sports',
    liquidity: 3100000,
    volume: 11200000,
    participants: 5430,
    status: 'active',
    odds: [
      { option: 'Egypt', odds: 3.2, pool: 0.28 },
      { option: 'Cameroon', odds: 4.1, pool: 0.22 },
      { option: 'Senegal', odds: 2.8, pool: 0.32 },
      { option: 'Others', odds: 5.5, pool: 0.18 },
    ],
    resolutionDate: '2025-02-09',
    creator: '0x3d6a...7f1b',
  },
  {
    id: '6',
    title: 'Nairobi Tech Hub IPO',
    description: 'Will a major Nairobi tech company IPO in 2025?',
    category: 'Tech',
    liquidity: 620000,
    volume: 1450000,
    participants: 234,
    status: 'active',
    odds: [
      { option: 'Yes', odds: 2.7, pool: 0.48 },
      { option: 'No', odds: 1.5, pool: 0.52 },
    ],
    resolutionDate: '2025-12-31',
    creator: '0x5c8e...9a2b',
  },
]

const CATEGORIES = ['All', 'Politics', 'Crypto', 'Economics', 'Tech', 'Sports']

export default function PoolsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('liquidity')

  const filteredPools = useMemo(() => {
    let pools = MOCK_POOLS

    if (selectedCategory !== 'All') {
      pools = pools.filter(p => p.category === selectedCategory)
    }

    if (searchQuery) {
      pools = pools.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (sortBy === 'liquidity') {
      pools = [...pools].sort((a, b) => b.liquidity - a.liquidity)
    } else if (sortBy === 'volume') {
      pools = [...pools].sort((a, b) => b.volume - a.volume)
    } else if (sortBy === 'participants') {
      pools = [...pools].sort((a, b) => b.participants - a.participants)
    }

    return pools
  }, [searchQuery, selectedCategory, sortBy])

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold">Prediction Pools</h1>
                <p className="text-muted-foreground mt-1">Discover and trade prediction markets</p>
              </div>
              <Link href="/app/create">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                  <Plus size={20} />
                  Create Pool
                </Button>
              </Link>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
                <Input
                  placeholder="Search pools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted border-border"
                />
              </div>

              {/* Category Pills */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition font-medium text-sm ${
                      selectedCategory === category
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('liquidity')}
                  className={`px-3 py-1 rounded text-sm transition ${
                    sortBy === 'liquidity'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Liquidity
                </button>
                <button
                  onClick={() => setSortBy('volume')}
                  className={`px-3 py-1 rounded text-sm transition ${
                    sortBy === 'volume'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Volume
                </button>
                <button
                  onClick={() => setSortBy('participants')}
                  className={`px-3 py-1 rounded text-sm transition ${
                    sortBy === 'participants'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Participants
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pools Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {filteredPools.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPools.map(pool => (
                <PoolCard key={pool.id} pool={pool} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No pools found</p>
              <p className="text-muted-foreground text-sm mt-2">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
