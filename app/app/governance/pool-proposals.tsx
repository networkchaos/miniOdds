'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAccount } from 'wagmi'
import { useProposalCount, useProposal, useVoteOnProposal, useBetTokenBalance, useApproveBetToken } from '@/lib/web3/hooks'
import { formatEther } from 'viem'
import { ThumbsUp, ThumbsDown, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const MIN_VOTE_STAKE = '1' // 1 BET token minimum

export default function PoolProposals() {
  const { address } = useAccount()
  const { toast } = useToast()
  const [selectedProposal, setSelectedProposal] = useState<bigint | undefined>()
  const [voteAmount, setVoteAmount] = useState('1')
  const [voteType, setVoteType] = useState<boolean | null>(null)

  // Get proposal count
  const { data: proposalCount, refetch: refetchCount } = useProposalCount()
  const count = proposalCount ? Number(proposalCount) : 0

  // Get selected proposal details
  const { data: proposal, refetch: refetchProposal } = useProposal(selectedProposal)

  // Get user's BET token balance
  const { data: betBalance } = useBetTokenBalance(address)
  const balance = betBalance ? parseFloat(formatEther(betBalance)) : 0

  // Vote hook
  const { vote, isPending, isSuccess, error } = useVoteOnProposal()
  const { approve, isPending: isApproving } = useApproveBetToken()

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Vote submitted',
        description: 'Your vote has been recorded successfully.',
      })
      refetchProposal()
      refetchCount()
      setVoteType(null)
      setVoteAmount('1')
    }
  }, [isSuccess, toast, refetchProposal, refetchCount])

  useEffect(() => {
    if (error) {
      toast({
        title: 'Vote failed',
        description: error.message || 'Failed to submit vote',
        variant: 'destructive',
      })
    }
  }, [error, toast])

  const handleVote = async (proposalId: bigint, support: boolean) => {
    if (!address) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to vote',
        variant: 'destructive',
      })
      return
    }

    if (parseFloat(voteAmount) < parseFloat(MIN_VOTE_STAKE)) {
      toast({
        title: 'Invalid stake amount',
        description: `Minimum stake is ${MIN_VOTE_STAKE} BET tokens`,
        variant: 'destructive',
      })
      return
    }

    if (parseFloat(voteAmount) > balance) {
      toast({
        title: 'Insufficient balance',
        description: `You need ${voteAmount} BET tokens to vote`,
        variant: 'destructive',
      })
      return
    }

    setSelectedProposal(proposalId)
    setVoteType(support)
    
    // First approve if needed, then vote
    // For simplicity, we'll assume approval is handled separately
    await vote(proposalId, support, voteAmount)
  }

  const calculatePercentage = (votes: bigint, total: bigint) => {
    if (total === 0n) return 0
    return Number((votes * 100n) / total)
  }

  if (count === 0) {
    return (
      <Card className="bg-card border-border p-12 text-center">
        <p className="text-muted-foreground text-lg mb-4">No pool proposals yet</p>
        <p className="text-muted-foreground text-sm">Be the first to create a prediction pool!</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => {
        const proposalId = BigInt(index)
        const { data: proposalData } = useProposal(proposalId)
        
        if (!proposalData) return null

        const [creator, title, description, yesVotes, noVotes, approved, rejected, poolAddress] = proposalData
        const totalVotes = yesVotes + noVotes
        const forPercentage = calculatePercentage(yesVotes, totalVotes)
        const againstPercentage = calculatePercentage(noVotes, totalVotes)
        const isResolved = approved || rejected

        return (
          <Card key={index} className="bg-card border-border p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold">
                    Pool Proposal
                  </span>
                  {approved && (
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                      Approved
                    </span>
                  )}
                  {rejected && (
                    <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold">
                      Rejected
                    </span>
                  )}
                  {!isResolved && (
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold">
                      Active
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold mb-1">{title}</h3>
                <p className="text-muted-foreground text-sm mb-2">{description}</p>
                <p className="text-xs text-muted-foreground font-mono">Creator: {creator}</p>
                {poolAddress && poolAddress !== '0x0000000000000000000000000000000000000000' && (
                  <p className="text-xs text-accent font-mono mt-1">Pool: {poolAddress}</p>
                )}
              </div>
            </div>

            {/* Voting Bar */}
            {!isResolved && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Voting Progress</span>
                  <span className="font-semibold">{formatEther(totalVotes)} BET staked</span>
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
                  <span className="text-green-400">
                    For: {formatEther(yesVotes)} BET ({forPercentage.toFixed(1)}%)
                  </span>
                  <span className="text-red-400">
                    Against: {formatEther(noVotes)} BET ({againstPercentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            )}

            {/* Vote Input */}
            {!isResolved && address && (
              <div className="pt-4 border-t border-border/50 space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="BET amount"
                    value={voteAmount}
                    onChange={(e) => setVoteAmount(e.target.value)}
                    min={MIN_VOTE_STAKE}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleVote(proposalId, true)}
                    disabled={isPending || parseFloat(voteAmount) < parseFloat(MIN_VOTE_STAKE) || parseFloat(voteAmount) > balance}
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    {isPending && selectedProposal === proposalId && voteType === true ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <ThumbsUp size={16} />
                    )}
                    Vote For
                  </Button>
                  <Button
                    onClick={() => handleVote(proposalId, false)}
                    disabled={isPending || parseFloat(voteAmount) < parseFloat(MIN_VOTE_STAKE) || parseFloat(voteAmount) > balance}
                    className="gap-2 bg-red-600 hover:bg-red-700"
                  >
                    {isPending && selectedProposal === proposalId && voteType === false ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <ThumbsDown size={16} />
                    )}
                    Vote Against
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your balance: {balance.toFixed(2)} BET | Minimum: {MIN_VOTE_STAKE} BET
                </p>
              </div>
            )}

            {isResolved && (
              <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                {approved ? (
                  <>
                    <CheckCircle size={20} className="text-green-400" />
                    <span className="font-semibold text-green-400">Proposal Approved - Pool Deployed</span>
                  </>
                ) : (
                  <>
                    <XCircle size={20} className="text-red-400" />
                    <span className="font-semibold text-red-400">Proposal Rejected</span>
                  </>
                )}
              </div>
            )}

            {!address && !isResolved && (
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground text-center">
                  Connect your wallet to vote on this proposal
                </p>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}

