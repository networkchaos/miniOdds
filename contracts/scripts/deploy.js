const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy BetToken
  console.log("\nDeploying BetToken...");
  const BetToken = await ethers.getContractFactory("BetToken");
  const betToken = await BetToken.deploy(deployer.address);
  await betToken.waitForDeployment();
  const betTokenAddress = await betToken.getAddress();
  console.log("BetToken deployed to:", betTokenAddress);

  // USDT address (use existing or deploy mock for testing)
  // For Polygon mainnet: 0xc2132D05D31c914a87C6611C10748AEb04B58e8F
  // For Mumbai testnet: 0x3813e82e6f7098b9583FC0F33a962D02018B6803
  const USDT_ADDRESS = process.env.USDT_ADDRESS || "0x3813e82e6f7098b9583FC0F33a962D02018B6803";
  console.log("Using USDT address:", USDT_ADDRESS);

  // Deploy PoolFactory
  console.log("\nDeploying PoolFactory...");
  const PoolFactory = await ethers.getContractFactory("PoolFactory");
  const poolFactory = await PoolFactory.deploy(betTokenAddress, USDT_ADDRESS, deployer.address);
  await poolFactory.waitForDeployment();
  const poolFactoryAddress = await poolFactory.getAddress();
  console.log("PoolFactory deployed to:", poolFactoryAddress);

  // Authorize PoolFactory to mint BetToken (for rewards)
  console.log("\nAuthorizing PoolFactory to mint BetToken...");
  await betToken.setAuthorizedMinter(poolFactoryAddress, true);
  console.log("PoolFactory authorized to mint BetToken");

  console.log("\n=== Deployment Summary ===");
  console.log("BetToken:", betTokenAddress);
  console.log("PoolFactory:", poolFactoryAddress);
  console.log("USDT:", USDT_ADDRESS);
  console.log("\nSave these addresses for frontend integration!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

