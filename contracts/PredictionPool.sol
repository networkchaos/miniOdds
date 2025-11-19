// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PredictionPool
 * @dev Individual prediction pool contract with dynamic odds and AMM-style pricing
 */
contract PredictionPool is ReentrancyGuard, Ownable {
    IERC20 public immutable paymentToken; // USDT
    address public immutable factory;
    address public immutable creator;
    
    struct Outcome {
        string label;
        uint256 liquidity; // Total liquidity in this outcome
        uint256 totalShares; // Total shares minted for this outcome
        bool resolved;
    }
    
    struct PoolConfig {
        string title;
        string description;
        uint256 minLiquidity;
        uint256 creatorTakeoutRate; // Basis points (e.g., 200 = 2%)
        uint256 platformFeeRate; // Basis points (e.g., 300 = 3%)
        uint256 resolutionDate;
        bool isResolved;
        address oracle; // Oracle address for resolution
    }
    
    PoolConfig public config;
    Outcome[] public outcomes;
    
    // User positions: user => outcomeIndex => shares
    mapping(address => mapping(uint256 => uint256)) public userShares;
    
    // Total liquidity across all outcomes
    uint256 public totalLiquidity;
    
    // Resolution
    uint256 public winningOutcome;
    bool public isResolved;
    
    event PoolCreated(
        string title,
        uint256 minLiquidity,
        uint256 creatorTakeoutRate,
        uint256 platformFeeRate
    );
    
    event OutcomeAdded(uint256 indexed outcomeIndex, string label);
    
    event PositionBought(
        address indexed user,
        uint256 indexed outcomeIndex,
        uint256 shares,
        uint256 cost
    );
    
    event PositionSold(
        address indexed user,
        uint256 indexed outcomeIndex,
        uint256 shares,
        uint256 proceeds
    );
    
    event PoolResolved(uint256 indexed winningOutcome);
    
    event PayoutDistributed(
        address indexed user,
        uint256 amount
    );
    
    modifier onlyFactory() {
        require(msg.sender == factory, "PredictionPool: Only factory");
        _;
    }
    
    modifier onlyOracle() {
        require(msg.sender == config.oracle || msg.sender == owner(), "PredictionPool: Only oracle");
        _;
    }
    
    constructor(
        address _factory,
        address _creator,
        address _paymentToken,
        string memory _title,
        string memory _description,
        uint256 _minLiquidity,
        uint256 _creatorTakeoutRate,
        uint256 _platformFeeRate,
        uint256 _resolutionDate,
        address _oracle
    ) Ownable(_creator) {
        factory = _factory;
        creator = _creator;
        paymentToken = IERC20(_paymentToken);
        
        config = PoolConfig({
            title: _title,
            description: _description,
            minLiquidity: _minLiquidity,
            creatorTakeoutRate: _creatorTakeoutRate,
            platformFeeRate: _platformFeeRate,
            resolutionDate: _resolutionDate,
            isResolved: false,
            oracle: _oracle
        });
    }
    
    /**
     * @dev Add an outcome to the pool (only during initialization)
     */
    function addOutcome(string memory label) external onlyFactory {
        outcomes.push(Outcome({
            label: label,
            liquidity: 0,
            totalShares: 0,
            resolved: false
        }));
        emit OutcomeAdded(outcomes.length - 1, label);
    }
    
    /**
     * @dev Buy shares in an outcome (AMM-style pricing)
     * Uses constant product formula: x * y = k
     */
    function buyShares(uint256 outcomeIndex, uint256 amountIn) external nonReentrant {
        require(!isResolved, "PredictionPool: Pool already resolved");
        require(outcomeIndex < outcomes.length, "PredictionPool: Invalid outcome");
        require(amountIn > 0, "PredictionPool: Amount must be > 0");
        require(block.timestamp < config.resolutionDate, "PredictionPool: Pool closed");
        
        Outcome storage outcome = outcomes[outcomeIndex];
        
        // Calculate shares using AMM formula
        uint256 shares = calculateSharesOut(outcomeIndex, amountIn);
        require(shares > 0, "PredictionPool: Insufficient shares");
        
        // Transfer payment token from user
        require(
            paymentToken.transferFrom(msg.sender, address(this), amountIn),
            "PredictionPool: Transfer failed"
        );
        
        // Update liquidity and shares
        outcome.liquidity += amountIn;
        outcome.totalShares += shares;
        userShares[msg.sender][outcomeIndex] += shares;
        totalLiquidity += amountIn;
        
        emit PositionBought(msg.sender, outcomeIndex, shares, amountIn);
    }
    
    /**
     * @dev Sell shares back to the pool
     */
    function sellShares(uint256 outcomeIndex, uint256 shares) external nonReentrant {
        require(!isResolved, "PredictionPool: Pool already resolved");
        require(outcomeIndex < outcomes.length, "PredictionPool: Invalid outcome");
        require(shares > 0, "PredictionPool: Shares must be > 0");
        require(
            userShares[msg.sender][outcomeIndex] >= shares,
            "PredictionPool: Insufficient shares"
        );
        
        Outcome storage outcome = outcomes[outcomeIndex];
        
        // Calculate proceeds using AMM formula
        uint256 proceeds = calculateProceedsOut(outcomeIndex, shares);
        require(proceeds > 0, "PredictionPool: Insufficient liquidity");
        
        // Update liquidity and shares
        outcome.liquidity -= proceeds;
        outcome.totalShares -= shares;
        userShares[msg.sender][outcomeIndex] -= shares;
        totalLiquidity -= proceeds;
        
        // Transfer proceeds to user
        require(
            paymentToken.transfer(msg.sender, proceeds),
            "PredictionPool: Transfer failed"
        );
        
        emit PositionSold(msg.sender, outcomeIndex, shares, proceeds);
    }
    
    /**
     * @dev Calculate shares received for amountIn (AMM formula)
     * Simplified constant product: shares = (amountIn * totalShares) / (liquidity + amountIn)
     */
    function calculateSharesOut(uint256 outcomeIndex, uint256 amountIn) public view returns (uint256) {
        Outcome memory outcome = outcomes[outcomeIndex];
        
        if (outcome.totalShares == 0) {
            // First liquidity provider gets 1:1 shares
            return amountIn;
        }
        
        // Constant product formula: (amountIn * totalShares) / (liquidity + amountIn)
        uint256 numerator = amountIn * outcome.totalShares;
        uint256 denominator = outcome.liquidity + amountIn;
        return numerator / denominator;
    }
    
    /**
     * @dev Calculate proceeds from selling shares
     */
    function calculateProceedsOut(uint256 outcomeIndex, uint256 shares) public view returns (uint256) {
        Outcome memory outcome = outcomes[outcomeIndex];
        
        if (outcome.totalShares == 0) {
            return 0;
        }
        
        // (shares * liquidity) / totalShares
        uint256 numerator = shares * outcome.liquidity;
        return numerator / outcome.totalShares;
    }
    
    /**
     * @dev Get current odds for an outcome
     * Odds = totalLiquidity / outcomeLiquidity
     */
    function getOdds(uint256 outcomeIndex) external view returns (uint256) {
        require(outcomeIndex < outcomes.length, "PredictionPool: Invalid outcome");
        Outcome memory outcome = outcomes[outcomeIndex];
        
        if (outcome.liquidity == 0) {
            return 0;
        }
        
        // Odds as multiplier (e.g., 2.5x = 2500)
        return (totalLiquidity * 1000) / outcome.liquidity;
    }
    
    /**
     * @dev Resolve the pool (only oracle or owner)
     */
    function resolvePool(uint256 _winningOutcome) external onlyOracle {
        require(!isResolved, "PredictionPool: Already resolved");
        require(_winningOutcome < outcomes.length, "PredictionPool: Invalid outcome");
        require(
            block.timestamp >= config.resolutionDate || msg.sender == owner(),
            "PredictionPool: Too early to resolve"
        );
        
        isResolved = true;
        winningOutcome = _winningOutcome;
        outcomes[_winningOutcome].resolved = true;
        config.isResolved = true;
        
        emit PoolResolved(_winningOutcome);
    }
    
    /**
     * @dev Claim winnings for resolved pool
     */
    function claimWinnings() external nonReentrant {
        require(isResolved, "PredictionPool: Not resolved");
        
        uint256 shares = userShares[msg.sender][winningOutcome];
        require(shares > 0, "PredictionPool: No winning shares");
        
        Outcome storage outcome = outcomes[winningOutcome];
        
        // Calculate payout
        uint256 payout = (shares * outcome.liquidity) / outcome.totalShares;
        
        // Apply fees
        uint256 creatorFee = (payout * config.creatorTakeoutRate) / 10000;
        uint256 platformFee = (payout * config.platformFeeRate) / 10000;
        uint256 userPayout = payout - creatorFee - platformFee;
        
        // Clear user shares
        userShares[msg.sender][winningOutcome] = 0;
        
        // Transfer payout
        if (userPayout > 0) {
            require(
                paymentToken.transfer(msg.sender, userPayout),
                "PredictionPool: Transfer failed"
            );
        }
        
        // Transfer fees (creator and platform)
        if (creatorFee > 0) {
            paymentToken.transfer(creator, creatorFee);
        }
        if (platformFee > 0) {
            // Platform fee goes to factory/treasury
            paymentToken.transfer(factory, platformFee);
        }
        
        emit PayoutDistributed(msg.sender, userPayout);
    }
    
    /**
     * @dev Get pool information
     */
    function getPoolInfo() external view returns (
        string memory title,
        string memory description,
        uint256 outcomeCount,
        uint256 _totalLiquidity,
        bool _isResolved,
        uint256 _winningOutcome
    ) {
        return (
            config.title,
            config.description,
            outcomes.length,
            totalLiquidity,
            isResolved,
            winningOutcome
        );
    }
    
    /**
     * @dev Get outcome information
     */
    function getOutcomeInfo(uint256 outcomeIndex) external view returns (
        string memory label,
        uint256 liquidity,
        uint256 totalShares,
        uint256 odds
    ) {
        require(outcomeIndex < outcomes.length, "PredictionPool: Invalid outcome");
        Outcome memory outcome = outcomes[outcomeIndex];
        
        uint256 _odds = 0;
        if (outcome.liquidity > 0) {
            _odds = (totalLiquidity * 1000) / outcome.liquidity;
        }
        
        return (
            outcome.label,
            outcome.liquidity,
            outcome.totalShares,
            _odds
        );
    }
}

