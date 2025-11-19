# miniOdds - Smart Contracts

Smart contracts for the miniOdds prediction and betting platform.

## Contracts

- **BetToken.sol**: ERC20 governance token for voting, staking, and fee reduction
- **PredictionPool.sol**: Individual prediction pool with dynamic odds and AMM-style pricing
- **PoolFactory.sol**: Factory contract for creating pools and managing DAO voting

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
PRIVATE_KEY=your_private_key_here
POLYGON_RPC_URL=https://rpc.ankr.com/polygon
MUMBAI_RPC_URL=https://rpc.ankr.com/polygon_mumbai
USDT_ADDRESS=0x3813e82e6f7098b9583FC0F33a962D02018B6803
```

3. Compile contracts:
```bash
npm run compile
```

4. Deploy to testnet:
```bash
npm run deploy:mumbai
```

## Contract Addresses

After deployment, save the contract addresses for frontend integration.

