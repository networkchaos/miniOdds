const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const PoolFactoryABI = require('../../abis/PoolFactory.json');

const RPC_URL = process.env.RPC_URL || 'https://rpc.ankr.com/polygon_mumbai';
const POOL_FACTORY_ADDRESS = process.env.POOL_FACTORY_ADDRESS;
const provider = new ethers.JsonRpcProvider(RPC_URL);

/**
 * GET /api/governance/proposals
 * Get all pool proposals
 */
router.get('/proposals', async (req, res) => {
  try {
    if (!POOL_FACTORY_ADDRESS) {
      return res.json({ proposals: [], total: 0 });
    }
    
    const factoryContract = new ethers.Contract(POOL_FACTORY_ADDRESS, PoolFactoryABI, provider);
    const proposalCount = await factoryContract.getProposalCount();
    
    const proposals = [];
    for (let i = 0; i < proposalCount; i++) {
      const proposal = await factoryContract.getProposal(i);
      proposals.push({
        id: i,
        creator: proposal.creator,
        title: proposal.title,
        description: proposal.description,
        yesVotes: proposal.yesVotes.toString(),
        noVotes: proposal.noVotes.toString(),
        approved: proposal.approved,
        rejected: proposal.rejected,
        poolAddress: proposal.poolAddress
      });
    }
    
    res.json({ proposals, total: proposals.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/governance/proposals/:id
 * Get proposal details
 */
router.get('/proposals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const factoryContract = new ethers.Contract(POOL_FACTORY_ADDRESS, PoolFactoryABI, provider);
    const proposal = await factoryContract.getProposal(id);
    
    res.json({
      id: parseInt(id),
      creator: proposal.creator,
      title: proposal.title,
      description: proposal.description,
      yesVotes: proposal.yesVotes.toString(),
      noVotes: proposal.noVotes.toString(),
      approved: proposal.approved,
      rejected: proposal.rejected,
      poolAddress: proposal.poolAddress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/governance/proposals/:id/vote/:user
 * Get user's vote on a proposal
 */
router.get('/proposals/:id/vote/:user', async (req, res) => {
  try {
    const { id, user } = req.params;
    const factoryContract = new ethers.Contract(POOL_FACTORY_ADDRESS, PoolFactoryABI, provider);
    const vote = await factoryContract.getUserVote(id, user);
    
    res.json({
      hasVoted: vote.hasVoted_,
      stake: vote.stake.toString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

