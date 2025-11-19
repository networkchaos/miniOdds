# miniOdds - Backend API

Backend API server for miniOdds platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in values:
```bash
cp .env.example .env
```

3. Run development server:
```bash
npm run dev
```

## API Endpoints

### Pools
- `GET /api/pools` - Get all pools
- `GET /api/pools/:address` - Get pool details
- `POST /api/pools/create` - Create pool proposal
- `GET /api/pools/:address/odds` - Get current odds

### Governance
- `GET /api/governance/proposals` - Get all proposals
- `GET /api/governance/proposals/:id` - Get proposal details
- `GET /api/governance/proposals/:id/vote/:user` - Get user vote

### Oracle
- `POST /api/oracle/resolve` - Resolve a pool
- `GET /api/oracle/data/:poolId` - Get oracle data

### MPesa
- `POST /api/mpesa/deposit` - Initiate deposit
- `POST /api/mpesa/withdraw` - Initiate withdrawal
- `GET /api/mpesa/status/:transactionId` - Check transaction status

### Users
- `GET /api/users/:address/positions` - Get user positions
- `GET /api/users/:address/balance` - Get user balances

