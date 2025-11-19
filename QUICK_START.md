# Quick Start Guide - miniOdds

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Install Dependencies

```bash
# Frontend
pnpm install

# Contracts
cd contracts && npm install && cd ..

# Backend
cd backend && npm install && cd ..
```

### Step 2: Set Up Environment

1. Copy `.env.example` to `.env`
2. Get WalletConnect Project ID from https://cloud.walletconnect.com
3. Add to `.env`:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

### Step 3: Deploy Contracts (Testnet)

```bash
cd contracts

# For Mumbai testnet
npm run deploy:mumbai

# Save the addresses:
# - BetToken address
# - PoolFactory address
```

### Step 4: Update Environment with Contract Addresses

Add to `.env`:
```
NEXT_PUBLIC_BET_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_POOL_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_USDT_ADDRESS=0x3813e82e6f7098b9583FC0F33a962D02018B6803
```

### Step 5: Start Development Servers

**Terminal 1 - Frontend:**
```bash
pnpm dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

### Step 6: Test the Platform

1. Open http://localhost:3000
2. Connect your MetaMask wallet (Mumbai testnet)
3. Get test tokens:
   - MATIC for gas: https://faucet.polygon.technology/
   - Test USDT: Use existing testnet USDT or deploy mock
4. Navigate to Governance → Pool Proposals
5. Create a pool proposal (requires 50 BET tokens)

## 🎯 What's Working

✅ Wallet connection  
✅ Governance page with pool proposals  
✅ Voting system (with BetToken staking)  
✅ Smart contracts deployed  
✅ Backend API structure  

## 🔧 What Needs Integration

⚠️ Pool creation form → Contract calls  
⚠️ Trading interface → Buy/sell shares  
⚠️ MPesa on/off ramp  
⚠️ Oracle resolution  

## 📚 Next Steps

1. **Test Pool Creation**: Create a proposal and vote on it
2. **Deploy to Testnet**: Use Mumbai for testing
3. **Integrate Trading**: Connect trade panel to contracts
4. **Add MPesa**: Integrate KotaniPay or similar
5. **Oracle Setup**: Chainlink or custom oracle

## 🆘 Troubleshooting

**Wallet won't connect?**
- Check WalletConnect Project ID
- Ensure MetaMask is installed
- Switch to Mumbai testnet

**Contracts not found?**
- Verify contract addresses in `.env`
- Check network (should be Mumbai for testnet)
- Redeploy contracts if needed

**Transaction fails?**
- Check gas fees
- Ensure sufficient token balance
- Verify contract addresses

## 📞 Need Help?

Check `IMPLEMENTATION_SUMMARY.md` for detailed architecture and `README.md` for full documentation.

