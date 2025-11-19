import { Address } from 'viem'
import { CONTRACT_ADDRESSES } from './config'

// Simplified ABIs (full ABIs should be imported from contract artifacts)
export const BET_TOKEN_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function getPoolCreationStake() view returns (uint256)',
] as const

export const POOL_FACTORY_ABI = [
  'function createPoolProposal(string title, string description, uint256 minLiquidity, uint256 creatorTakeoutRate, uint256 platformFeeRate, uint256 resolutionDate, address oracle, string[] outcomes) returns (uint256)',
  'function voteOnProposal(uint256 proposalId, bool support, uint256 stakeAmount)',
  'function getProposalCount() view returns (uint256)',
  'function getProposal(uint256 proposalId) view returns (address creator, string title, string description, uint256 yesVotes, uint256 noVotes, bool approved, bool rejected, address poolAddress)',
  'function getUserVote(uint256 proposalId, address user) view returns (bool hasVoted, bool support, uint256 stake)',
  'event PoolProposalCreated(uint256 indexed proposalId, address indexed creator, string title)',
  'event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 stake)',
  'event PoolApproved(uint256 indexed proposalId, address indexed poolAddress)',
] as const

export const PREDICTION_POOL_ABI = [
  'function buyShares(uint256 outcomeIndex, uint256 amountIn)',
  'function sellShares(uint256 outcomeIndex, uint256 shares)',
  'function calculateSharesOut(uint256 outcomeIndex, uint256 amountIn) view returns (uint256)',
  'function calculateProceedsOut(uint256 outcomeIndex, uint256 shares) view returns (uint256)',
  'function getOdds(uint256 outcomeIndex) view returns (uint256)',
  'function getPoolInfo() view returns (string title, string description, uint256 outcomeCount, uint256 totalLiquidity, bool isResolved, uint256 winningOutcome)',
  'function getOutcomeInfo(uint256 outcomeIndex) view returns (string label, uint256 liquidity, uint256 totalShares, uint256 odds)',
  'function resolvePool(uint256 winningOutcome)',
  'function claimWinnings()',
  'function userShares(address user, uint256 outcomeIndex) view returns (uint256)',
  'function outcomes(uint256) view returns (string label, uint256 liquidity, uint256 totalShares, bool resolved)',
  'event PositionBought(address indexed user, uint256 indexed outcomeIndex, uint256 shares, uint256 cost)',
  'event PositionSold(address indexed user, uint256 indexed outcomeIndex, uint256 shares, uint256 proceeds)',
  'event PoolResolved(uint256 indexed winningOutcome)',
] as const

export const USDT_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
] as const

// Contract addresses
export const getBetTokenAddress = (): Address => {
  return CONTRACT_ADDRESSES.BET_TOKEN as Address
}

export const getPoolFactoryAddress = (): Address => {
  return CONTRACT_ADDRESSES.POOL_FACTORY as Address
}

export const getUSDTAddress = (): Address => {
  return CONTRACT_ADDRESSES.USDT as Address
}

