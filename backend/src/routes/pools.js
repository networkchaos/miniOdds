const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const PoolFactoryABI = require('../../abis/PoolFactory.json');
const PredictionPoolABI = require('../../abis/PredictionPool.json');

const RPC_URL = process.env.RPC_URL || 'https://rpc.ankr.com/polygon_mumbai';
const POOL_FACTORY_ADDRESS = process.env.POOL_FACTORY_ADDRESS;
const provider = new ethers.JsonRpcProvider(RPC_URL);

/**
 * GET /api/pools
 * Get all active pools
 */
router.get('/', async (req, res) => {
  try {
    // TODO: Fetch from database or index events
    // For now, return mock data structure
    res.json({
      pools: [],
      total: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/pools/:address
 * Get pool details by contract address
 */
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const poolContract = new ethers.Contract(address, PredictionPoolABI, provider);
    
    const [poolInfo, outcomeCount] = await Promise.all([
      poolContract.getPoolInfo(),
      poolContract.outcomes.length
    ]);
    
    const outcomes = [];
    for (let i = 0; i < outcomeCount; i++) {
      const outcomeInfo = await poolContract.getOutcomeInfo(i);
      outcomes.push({
        index: i,
        label: outcomeInfo.label,
        liquidity: outcomeInfo.liquidity.toString(),
        totalShares: outcomeInfo.totalShares.toString(),
        odds: outcomeInfo.odds.toString()
      });
    }
    
    res.json({
      address,
      title: poolInfo.title,
      description: poolInfo.description,
      totalLiquidity: poolInfo._totalLiquidity.toString(),
      isResolved: poolInfo._isResolved,
      winningOutcome: poolInfo._winningOutcome.toString(),
      outcomes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/pools/create
 * Create a new pool proposal (frontend will handle contract interaction)
 */
router.post('/create', async (req, res) => {
  try {
    // This endpoint can be used for validation or storing pool metadata
    const { title, description, outcomes, minLiquidity, creatorTakeoutRate } = req.body;
    
    // Validate input
    if (!title || !description || !outcomes || outcomes.length < 2) {
      return res.status(400).json({ error: 'Invalid pool data' });
    }
    
    // Store in database (TODO: implement)
    res.json({
      message: 'Pool proposal validated',
      // Frontend will handle actual contract interaction
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/pools/:address/odds
 * Get current odds for a pool
 */
router.get('/:address/odds', async (req, res) => {
  try {
    const { address } = req.params;
    const poolContract = new ethers.Contract(address, PredictionPoolABI, provider);
    
    const outcomeCount = await poolContract.outcomes.length;
    const odds = [];
    
    for (let i = 0; i < outcomeCount; i++) {
      const outcomeInfo = await poolContract.getOutcomeInfo(i);
      odds.push({
        outcomeIndex: i,
        label: outcomeInfo.label,
        odds: parseFloat(outcomeInfo.odds.toString()) / 1000, // Convert from basis points
        liquidity: outcomeInfo.liquidity.toString()
      });
    }
    
    res.json({ odds });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

