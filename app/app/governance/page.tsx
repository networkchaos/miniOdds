'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Sidebar from '@/components/app/sidebar'
import { Users, ThumbsUp, ThumbsDown, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { useBetTokenBalance } from '@/lib/web3/hooks'
import { formatEther } from 'viem'
import PoolProposals from './pool-proposals'

const PROPOSALS = [
  {
    id: '1',
    title: 'Reduce Protocol Fee from 2% to 1%',
    description: 'Proposal to lower the protocol fee to increase trading volume and user retention.',
    category: 'Protocol',
    votesFor: 1250,
    votesAgainst: 230,
    status: 'active',
    endsAt: '2024-11-22',
    yourVote: 'for',
  },
  {
    id: '2',
    title: 'Add Celo Network Support',
    description: 'Extend miniOdds to Celo blockchain for better African market reach.',
    category: 'Expansion',
    votesFor: 890,
    votesAgainst: 120,
    status: 'active',
    endsAt: '2024-11-24',
    yourVote: null,
  },
  {
    id: '3',
    title: 'Launch BET Token Staking',
    description: 'Enable users to stake BET tokens for governance power and rewards.',
    category: 'Features',
    votesFor: 2100,
    votesAgainst: 150,
    status: 'passed',
    endsAt: '2024-11-20',
    yourVote: 'for',
  },
  {
    id: '4',
    title: 'Implement Anti-Manipulation Rules',
    description: 'Add circuit breakers and trading limits to prevent market manipulation.',
    category: 'Security',
    votesFor: 1800,
    votesAgainst: 300,
    status: 'active',
    endsAt: '2024-11-23',
    yourVote: 'for',
  },
]

export default function GovernancePage() {
  const { address } = useAccount()
  const { data: betBalance } = useBetTokenBalance(address)
  const balance = betBalance ? parseFloat(formatEther(betBalance)) : 0
  
  const [proposals, setProposals] = useState(PROPOSALS)
  const [filter, setFilter] = useState<'all' | 'active' | 'passed'>('all')
  const [activeTab, setActiveTab] = useState<'protocol' | 'pools'>('pools')

  const filteredProposals = proposals.filter(p => {
    if (filter === 'active') return p.status === 'active'
    if (filter === 'passed') return p.status === 'passed'
    return true
  })

  const handleVote = (proposalId: string, voteType: 'for' | 'against') => {
    setProposals(proposals.map(p =>
      p.id === proposalId
        ? { ...p, yourVote: voteType }
        : p
    ))
  }

  const calculatePercentage = (votes: number, total: number) => {
    return total === 0 ? 0 : (votes / total) * 100
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users size={32} className="text-accent" />
              DAO Governance
            </h1>
            <p className="text-muted-foreground mt-1">Vote on protocol proposals and shape miniOdds</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Voting Power</p>
              <p className="text-3xl font-bold">{balance.toFixed(2)} BET</p>
              <p className="text-xs text-muted-foreground mt-2">
                {address ? 'Connected' : 'Connect wallet to see balance'}
              </p>
            </Card>
            <Card className="bg-card border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Votes Cast</p>
              <p className="text-3xl font-bold">8</p>
              <p className="text-xs text-accent mt-2">100% participation rate</p>
            </Card>
            <Card className="bg-card border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Delegated To</p>
              <p className="text-lg font-semibold">None</p>
              <Link href="#delegate">
                <Button size="sm" variant="ghost" className="text-accent hover:bg-accent/10 mt-2">
                  Delegate
                </Button>
              </Link>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border">
            <button
              onClick={() => setActiveTab('pools')}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                activeTab === 'pools'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Pool Proposals
            </button>
            <button
              onClick={() => setActiveTab('protocol')}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                activeTab === 'protocol'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Protocol Governance
            </button>
          </div>

          {/* Pool Proposals Tab */}
          {activeTab === 'pools' && <PoolProposals />}

          {/* Protocol Governance Tab */}
          {activeTab === 'protocol' && (
            <>
              {/* Filters */}
              <div className="flex gap-2">
                {['all', 'active', 'passed'].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f as typeof filter)}
                    className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                      filter === f
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Proposals */}
          <div className="space-y-4">
            {filteredProposals.map(proposal => {
              const totalVotes = proposal.votesFor + proposal.votesAgainst
              const forPercentage = calculatePercentage(proposal.votesFor, totalVotes)
              const againstPercentage = calculatePercentage(proposal.votesAgainst, totalVotes)

              return (
                <Card key={proposal.id} className="bg-card border-border p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold">
                          {proposal.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          proposal.status === 'active'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {proposal.status === 'active' ? 'Active' : 'Passed'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-1">{proposal.title}</h3>
                      <p className="text-muted-foreground text-sm">{proposal.description}</p>
                    </div>
                  </div>

                  {/* Voting Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Voting Progress</span>
                      <span className="font-semibold">{totalVotes.toLocaleString()} votes</span>
                    </div>
                    <div className="flex gap-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="bg-green-500 transition-all"
                        style={{ width: `${forPercentage}%` }}
                      />
                      <div
                        className="bg-red-500 transition-all"
                        style={{ width: `${againstPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="text-green-400">For: {forPercentage.toFixed(1)}%</span>
                      <span className="text-red-400">Against: {againstPercentage.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={16} />
                      Ends {new Date(proposal.endsAt).toLocaleDateString()}
                    </div>

                    {proposal.status === 'active' && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleVote(proposal.id, 'for')}
                          className={`gap-2 ${
                            proposal.yourVote === 'for'
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          <ThumbsUp size={16} />
                          {proposal.yourVote === 'for' ? 'Voted For' : 'Vote For'}
                        </Button>
                        <Button
                          onClick={() => handleVote(proposal.id, 'against')}
                          className={`gap-2 ${
                            proposal.yourVote === 'against'
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          <ThumbsDown size={16} />
                          {proposal.yourVote === 'against' ? 'Voted Against' : 'Vote Against'}
                        </Button>
                      </div>
                    )}

                    {proposal.status === 'passed' && (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle size={20} />
                        <span className="font-semibold">Passed</span>
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
