import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { BET_TOKEN_ABI, POOL_FACTORY_ABI, PREDICTION_POOL_ABI, USDT_ABI, getBetTokenAddress, getPoolFactoryAddress, getUSDTAddress } from './contracts'

/**
 * Hook to get BetToken balance
 */
export function useBetTokenBalance(address?: `0x${string}`) {
  return useReadContract({
    address: getBetTokenAddress(),
    abi: BET_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })
}

/**
 * Hook to get USDT balance
 */
export function useUSDTBalance(address?: `0x${string}`) {
  return useReadContract({
    address: getUSDTAddress(),
    abi: USDT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })
}

/**
 * Hook to get pool creation stake requirement
 */
export function usePoolCreationStake() {
  return useReadContract({
    address: getBetTokenAddress(),
    abi: BET_TOKEN_ABI,
    functionName: 'getPoolCreationStake',
  })
}

/**
 * Hook to get proposal count
 */
export function useProposalCount() {
  return useReadContract({
    address: getPoolFactoryAddress(),
    abi: POOL_FACTORY_ABI,
    functionName: 'getProposalCount',
  })
}

/**
 * Hook to get a proposal
 */
export function useProposal(proposalId: bigint | undefined) {
  return useReadContract({
    address: getPoolFactoryAddress(),
    abi: POOL_FACTORY_ABI,
    functionName: 'getProposal',
    args: proposalId !== undefined ? [proposalId] : undefined,
    query: {
      enabled: proposalId !== undefined,
    },
  })
}

/**
 * Hook to vote on a proposal
 */
export function useVoteOnProposal() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const vote = async (proposalId: bigint, support: boolean, stakeAmount: string) => {
    writeContract({
      address: getPoolFactoryAddress(),
      abi: POOL_FACTORY_ABI,
      functionName: 'voteOnProposal',
      args: [proposalId, support, parseEther(stakeAmount)],
    })
  }

  return {
    vote,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

/**
 * Hook to create a pool proposal
 */
export function useCreatePoolProposal() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const createProposal = async (
    title: string,
    description: string,
    minLiquidity: string,
    creatorTakeoutRate: number,
    platformFeeRate: number,
    resolutionDate: bigint,
    oracle: `0x${string}`,
    outcomes: string[]
  ) => {
    writeContract({
      address: getPoolFactoryAddress(),
      abi: POOL_FACTORY_ABI,
      functionName: 'createPoolProposal',
      args: [
        title,
        description,
        parseEther(minLiquidity),
        BigInt(creatorTakeoutRate), // Basis points
        BigInt(platformFeeRate), // Basis points
        resolutionDate,
        oracle,
        outcomes,
      ],
    })
  }

  return {
    createProposal,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

/**
 * Hook to buy shares in a pool
 */
export function useBuyShares(poolAddress?: `0x${string}`) {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const buy = async (outcomeIndex: number, amountIn: string) => {
    if (!poolAddress) return
    
    writeContract({
      address: poolAddress,
      abi: PREDICTION_POOL_ABI,
      functionName: 'buyShares',
      args: [BigInt(outcomeIndex), parseEther(amountIn)],
    })
  }

  return {
    buy,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

/**
 * Hook to sell shares in a pool
 */
export function useSellShares(poolAddress?: `0x${string}`) {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const sell = async (outcomeIndex: number, shares: string) => {
    if (!poolAddress) return
    
    writeContract({
      address: poolAddress,
      abi: PREDICTION_POOL_ABI,
      functionName: 'sellShares',
      args: [BigInt(outcomeIndex), parseEther(shares)],
    })
  }

  return {
    sell,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

/**
 * Hook to get pool info
 */
export function usePoolInfo(poolAddress?: `0x${string}`) {
  return useReadContract({
    address: poolAddress,
    abi: PREDICTION_POOL_ABI,
    functionName: 'getPoolInfo',
    query: {
      enabled: !!poolAddress,
    },
  })
}

/**
 * Hook to get outcome info
 */
export function useOutcomeInfo(poolAddress?: `0x${string}`, outcomeIndex?: number) {
  return useReadContract({
    address: poolAddress,
    abi: PREDICTION_POOL_ABI,
    functionName: 'getOutcomeInfo',
    args: outcomeIndex !== undefined ? [BigInt(outcomeIndex)] : undefined,
    query: {
      enabled: !!poolAddress && outcomeIndex !== undefined,
    },
  })
}

/**
 * Hook to calculate shares for an amount
 */
export function useCalculateShares(poolAddress?: `0x${string}`, outcomeIndex?: number, amountIn?: string) {
  return useReadContract({
    address: poolAddress,
    abi: PREDICTION_POOL_ABI,
    functionName: 'calculateSharesOut',
    args: outcomeIndex !== undefined && amountIn ? [BigInt(outcomeIndex), parseEther(amountIn)] : undefined,
    query: {
      enabled: !!poolAddress && outcomeIndex !== undefined && !!amountIn,
    },
  })
}

/**
 * Hook to approve USDT spending
 */
export function useApproveUSDT() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const approve = async (spender: `0x${string}`, amount: string) => {
    writeContract({
      address: getUSDTAddress(),
      abi: USDT_ABI,
      functionName: 'approve',
      args: [spender, parseEther(amount)],
    })
  }

  return {
    approve,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

/**
 * Hook to approve BetToken spending
 */
export function useApproveBetToken() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const approve = async (spender: `0x${string}`, amount: string) => {
    writeContract({
      address: getBetTokenAddress(),
      abi: BET_TOKEN_ABI,
      functionName: 'approve',
      args: [spender, parseEther(amount)],
    })
  }

  return {
    approve,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

