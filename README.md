# miniOdds - Decentralized Betting & Risk Pool Protocol

A revolutionary Web3-powered prediction and micro-betting platform designed for Kenya and emerging markets, combining the excitement of betting with the transparency and security of decentralized finance.

## 🎯 Features

- **Custom Prediction Pools**: Anyone can create a bet "pool" with custom odds and takeout rates
- **Dynamic Odds**: Based on liquidity & number of stakers per result (AMM-style pricing)
- **DAO-style Approval**: Community votes using governance tokens to approve new bet markets
- **Tradeable Risk Positions**: Bets become tokenized ("Outcome Tokens"), tradable before event resolution
- **MPesa Integration**: Seamless KES ↔ USDT on/off ramps
- **Social Pools / Syndicates**: Groups can pool funds & manage custom betting strategies
- **AI Odds Advisor**: Optional auto-odds predictor (coming soon)
- **Loyalty & Rank System**: Top bettors/bet creators earn NFT badges (coming soon)

## 🏗️ Architecture

```
Frontend (Next.js) <—> Backend API (Node.js/Express)
              │                   │
      Wallet Provider (wagmi)     │
              │                   │
     Smart Contracts (Solidity)  │
              │                   │
    Pool Contracts + AMM          │
              │                   │
   Oracle (Chainlink/custom)      │
              │                   │
       DAO Layer (Voting)         │
```

## 📦 Project Structure

```
├── app/                    # Next.js app directory
│   ├── app/               # Main application pages
│   │   ├── create/        # Pool creation
│   │   ├── dashboard/    # User dashboard
│   │   ├── governance/    # DAO governance & pool proposals
│   │   ├── pool/          # Pool details & trading
│   │   └── wallet/        # Wallet management
│   └── ...
├── components/             # React components
│   ├── app/               # App-specific components
│   └── ui/                # shadcn/ui components
├── contracts/             # Smart contracts (Solidity)
│   ├── BetToken.sol       # Governance token
│   ├── PoolFactory.sol    # Pool factory & DAO voting
│   ├── PredictionPool.sol # Individual pool contract
│   └── scripts/           # Deployment scripts
├── backend/               # Backend API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   └── index.js       # Express server
│   └── abis/              # Contract ABIs
└── lib/                   # Utilities
    └── web3/              # Web3 hooks & config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Hardhat (for smart contracts)
- MetaMask or compatible Web3 wallet

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd miniOdds
```

2. **Install frontend dependencies**
```bash
pnpm install
```

3. **Install contract dependencies**
```bash
cd contracts
npm install
```

4. **Install backend dependencies**
```bash
cd ../backend
npm install
```

5. **Set up environment variables**

Copy `.env.example` to `.env` and fill in:
```bash
cp .env.example .env
```

Required variables:
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - Get from [WalletConnect Cloud](https://cloud.walletconnect.com)
- `NEXT_PUBLIC_BET_TOKEN_ADDRESS` - Deploy contracts first
- `NEXT_PUBLIC_POOL_FACTORY_ADDRESS` - Deploy contracts first

### Deploy Smart Contracts

1. **Compile contracts**
```bash
cd contracts
npm run compile
```

2. **Deploy to testnet (Mumbai)**
```bash
npm run deploy:mumbai
```

3. **Save contract addresses** to `.env` file

### Run Development Servers

1. **Start frontend**
```bash
pnpm dev
```

2. **Start backend** (in another terminal)
```bash
cd backend
npm run dev
```

3. **Open browser**
```
http://localhost:3000
```

## 📝 Smart Contracts

### BetToken (ERC20)
- Governance token for voting and staking
- 100M initial supply
- 50 BET required to create a pool

### PoolFactory
- Creates and manages prediction pools
- Handles DAO voting for pool approval
- Minimum 10 votes, 60% approval threshold

### PredictionPool
- Individual pool contract with AMM-style pricing
- Dynamic odds based on liquidity
- Tradeable outcome shares

## 🔧 Development

### Frontend
- Next.js 16 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- wagmi + viem for Web3

### Backend
- Node.js + Express
- RESTful API
- Contract interaction via ethers.js

### Smart Contracts
- Solidity 0.8.20
- OpenZeppelin contracts
- Hardhat for development

## 📚 API Endpoints

### Pools
- `GET /api/pools` - Get all pools
- `GET /api/pools/:address` - Get pool details
- `POST /api/pools/create` - Create pool proposal
- `GET /api/pools/:address/odds` - Get current odds

### Governance
- `GET /api/governance/proposals` - Get all proposals
- `GET /api/governance/proposals/:id` - Get proposal details

### MPesa
- `POST /api/mpesa/deposit` - Initiate deposit
- `POST /api/mpesa/withdraw` - Initiate withdrawal

## 🎯 MVP Roadmap

- [x] Smart contracts (BetToken, PoolFactory, PredictionPool)
- [x] Web3 integration (wagmi, wallet connection)
- [x] Backend API structure
- [x] DAO voting system
- [ ] MPesa on/off ramp integration
- [ ] Pool creation flow with contract integration
- [ ] Trading interface with real-time odds
- [ ] Oracle integration for resolution
- [ ] Mobile-responsive UI

## 💰 Business Model

- **Platform Fee**: 3-5% on every bet/token trade
- **Pool Creator Fee**: Custom (0-3%), platform takes 20-30% of creator fee
- **Premium Analytics**: $10-30/month subscription
- **Token Swap Fees**: 0.3-0.5% per trade
- **B2B Licensing**: White-label protocol

## ⚠️ Regulatory Note

For MVP launch, marketed as "prediction and forecasting tool" to comply with local regulations. Full betting capabilities planned after platform validation and licensing.

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 📧 Contact

For questions or partnerships, please reach out through the platform.

---

Built with ❤️ for emerging markets

