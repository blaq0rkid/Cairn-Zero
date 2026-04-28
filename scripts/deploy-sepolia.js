const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying CairnZeroForwarder to Sepolia testnet...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy Forwarder contract
  console.log("Deploying CairnZeroForwarder...");
  const CairnZeroForwarder = await hre.ethers.getContractFactory("CairnZeroForwarder");
  const forwarder = await CairnZeroForwarder.deploy();
  await forwarder.waitForDeployment();
  
  const forwarderAddress = await forwarder.getAddress();
  console.log("✅ CairnZeroForwarder deployed to:", forwarderAddress);

  // Wait for confirmations
  console.log("\nWaiting for 5 confirmations...");
  await forwarder.deploymentTransaction().wait(5);
  console.log("✅ Confirmed!\n");

  // Save deployment info
  const deploymentInfo = {
    network: "sepolia",
    chainId: 11155111,
    forwarderAddress: forwarderAddress,
    deployerAddress: deployer.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
    transactionHash: forwarder.deploymentTransaction().hash
  };

  const outputPath = path.join(__dirname, "../deployments/sepolia.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("📝 Deployment info saved to:", outputPath);

  // Output environment variables
  console.log("\n📋 Add these to your .env.local:\n");
  console.log(`NEXT_PUBLIC_FORWARDER_ADDRESS_SEPOLIA=${forwarderAddress}`);
  console.log(`NEXT_PUBLIC_FORWARDER_DEPLOYMENT_BLOCK_SEPOLIA=${deploymentInfo.blockNumber}`);

  console.log("\n✅ Deployment complete!");
  console.log("\n⚠️  Next steps:");
  console.log("1. Verify contract on Etherscan: npm run verify:sepolia");
  console.log("2. Fund the relayer wallet with ETH");
  console.log("3. Update environment variables in Netlify/Vercel");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
