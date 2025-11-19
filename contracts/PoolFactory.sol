// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PredictionPool.sol";
import "./BetToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PoolFactory
 * @dev Factory contract for creating prediction pools
 * Handles pool creation, DAO voting, and pool management
 */
contract PoolFactory is Ownable {
    BetToken public immutable betToken;
    address public immutable paymentToken; // USDT address
    
    struct PoolProposal {
        address creator;
        string title;
        string description;
        uint256 minLiquidity;
        uint256 creatorTakeoutRate;
        uint256 platformFeeRate;
        uint256 resolutionDate;
        address oracle;
        string[] outcomes;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 totalStaked;
        bool approved;
        bool rejected;
        uint256 createdAt;
        address poolAddress; // Set when pool is deployed
    }
    
    PoolProposal[] public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => uint256)) public voteStakes;
    
    uint256 public constant MIN_VOTES = 10; // Minimum votes required
    uint256 public constant MIN_VOTE_STAKE = 1 * 10**18; // 1 BET token minimum to vote
    uint256 public constant APPROVAL_THRESHOLD = 60; // 60% yes votes required
    
    event PoolProposalCreated(
        uint256 indexed proposalId,
        address indexed creator,
        string title
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 stake
    );
    
    event PoolApproved(uint256 indexed proposalId, address indexed poolAddress);
    event PoolRejected(uint256 indexed proposalId);
    
    constructor(address _betToken, address _paymentToken, address initialOwner) Ownable(initialOwner) {
        betToken = BetToken(_betToken);
        paymentToken = _paymentToken;
    }
    
    /**
     * @dev Create a new pool proposal
     * Requires staking BetToken
     */
    function createPoolProposal(
        string memory title,
        string memory description,
        uint256 minLiquidity,
        uint256 creatorTakeoutRate,
        uint256 platformFeeRate,
        uint256 resolutionDate,
        address oracle,
        string[] memory outcomes
    ) external returns (uint256) {
        require(outcomes.length >= 2, "PoolFactory: Need at least 2 outcomes");
        require(creatorTakeoutRate <= 500, "PoolFactory: Takeout rate too high (max 5%)");
        require(platformFeeRate <= 500, "PoolFactory: Platform fee too high (max 5%)");
        require(resolutionDate > block.timestamp, "PoolFactory: Invalid resolution date");
        
        // Stake BetToken for pool creation
        uint256 stakeAmount = betToken.getPoolCreationStake();
        require(
            betToken.transferFrom(msg.sender, address(this), stakeAmount),
            "PoolFactory: Stake transfer failed"
        );
        
        uint256 proposalId = proposals.length;
        
        proposals.push(PoolProposal({
            creator: msg.sender,
            title: title,
            description: description,
            minLiquidity: minLiquidity,
            creatorTakeoutRate: creatorTakeoutRate,
            platformFeeRate: platformFeeRate,
            resolutionDate: resolutionDate,
            oracle: oracle,
            outcomes: outcomes,
            yesVotes: 0,
            noVotes: 0,
            totalStaked: stakeAmount,
            approved: false,
            rejected: false,
            createdAt: block.timestamp,
            poolAddress: address(0)
        }));
        
        emit PoolProposalCreated(proposalId, msg.sender, title);
        
        return proposalId;
    }
    
    /**
     * @dev Vote on a pool proposal
     * @param proposalId The proposal ID
     * @param support true for yes, false for no
     * @param stakeAmount Amount of BET tokens to stake for voting
     */
    function voteOnProposal(
        uint256 proposalId,
        bool support,
        uint256 stakeAmount
    ) external {
        require(proposalId < proposals.length, "PoolFactory: Invalid proposal");
        PoolProposal storage proposal = proposals[proposalId];
        require(!proposal.approved && !proposal.rejected, "PoolFactory: Proposal already resolved");
        require(!hasVoted[proposalId][msg.sender], "PoolFactory: Already voted");
        require(stakeAmount >= MIN_VOTE_STAKE, "PoolFactory: Stake too low");
        
        // Transfer stake
        require(
            betToken.transferFrom(msg.sender, address(this), stakeAmount),
            "PoolFactory: Stake transfer failed"
        );
        
        hasVoted[proposalId][msg.sender] = true;
        voteStakes[proposalId][msg.sender] = stakeAmount;
        
        if (support) {
            proposal.yesVotes += stakeAmount;
        } else {
            proposal.noVotes += stakeAmount;
        }
        
        proposal.totalStaked += stakeAmount;
        
        emit VoteCast(proposalId, msg.sender, support, stakeAmount);
        
        // Check if proposal can be auto-approved/rejected
        _checkProposalStatus(proposalId);
    }
    
    /**
     * @dev Check and update proposal status
     */
    function _checkProposalStatus(uint256 proposalId) internal {
        PoolProposal storage proposal = proposals[proposalId];
        
        if (proposal.approved || proposal.rejected) {
            return;
        }
        
        uint256 totalVotes = proposal.yesVotes + proposal.noVotes;
        
        // Need minimum votes
        if (totalVotes < MIN_VOTES * MIN_VOTE_STAKE) {
            return;
        }
        
        // Calculate approval percentage
        uint256 approvalPercent = (proposal.yesVotes * 100) / totalVotes;
        
        if (approvalPercent >= APPROVAL_THRESHOLD) {
            // Approve and deploy pool
            _approveAndDeployPool(proposalId);
        } else if (approvalPercent < (100 - APPROVAL_THRESHOLD)) {
            // Reject
            proposal.rejected = true;
            emit PoolRejected(proposalId);
        }
    }
    
    /**
     * @dev Approve proposal and deploy the pool contract
     */
    function _approveAndDeployPool(uint256 proposalId) internal {
        PoolProposal storage proposal = proposals[proposalId];
        proposal.approved = true;
        
        // Deploy new PredictionPool
        PredictionPool newPool = new PredictionPool(
            address(this),
            proposal.creator,
            paymentToken,
            proposal.title,
            proposal.description,
            proposal.minLiquidity,
            proposal.creatorTakeoutRate,
            proposal.platformFeeRate,
            proposal.resolutionDate,
            proposal.oracle
        );
        
        // Add outcomes
        for (uint256 i = 0; i < proposal.outcomes.length; i++) {
            newPool.addOutcome(proposal.outcomes[i]);
        }
        
        proposal.poolAddress = address(newPool);
        
        emit PoolApproved(proposalId, address(newPool));
    }
    
    /**
     * @dev Manually check and update proposal status (for edge cases)
     */
    function checkProposalStatus(uint256 proposalId) external {
        require(proposalId < proposals.length, "PoolFactory: Invalid proposal");
        _checkProposalStatus(proposalId);
    }
    
    /**
     * @dev Get proposal count
     */
    function getProposalCount() external view returns (uint256) {
        return proposals.length;
    }
    
    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 proposalId) external view returns (
        address creator,
        string memory title,
        string memory description,
        uint256 yesVotes,
        uint256 noVotes,
        bool approved,
        bool rejected,
        address poolAddress
    ) {
        require(proposalId < proposals.length, "PoolFactory: Invalid proposal");
        PoolProposal memory proposal = proposals[proposalId];
        
        return (
            proposal.creator,
            proposal.title,
            proposal.description,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.approved,
            proposal.rejected,
            proposal.poolAddress
        );
    }
    
    /**
     * @dev Get user's vote on a proposal
     */
    function getUserVote(uint256 proposalId, address user) external view returns (
        bool hasVoted_,
        bool support,
        uint256 stake
    ) {
        hasVoted_ = hasVoted[proposalId][user];
        stake = voteStakes[proposalId][user];
        // Note: We don't store support separately, would need to track it
        support = false; // Placeholder
        return (hasVoted_, support, stake);
    }
}

