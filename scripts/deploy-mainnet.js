const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

async function promptConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

async function main() {
  console.log("⚠️  MAINNET DEPLOYMENT - USE WITH CAUTION\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  const balanceETH = hre.ethers.formatEther(balance);
  console.log("Account balance:", balanceETH, "ETH\n");

  // Safety checks
  if (parseFloat(balanceETH) < 0.1) {
    console.error("❌ Insufficient balance for mainnet deployment (minimum 0.1 ETH recommended)");
    process.exit(1);
  }

  // Get gas estimate
  const CairnZeroForwarder = await hre.ethers.getContractFactory("CairnZeroForwarder");
  const deploymentData = CairnZeroForwarder.getDeployTransaction();
  const gasEstimate = await hre.ethers.provider.estimateGas(deploymentData);
  const gasPrice = await hre.ethers.provider.getFeeData();
  const estimatedCost = gasEstimate * gasPrice.gasPrice;
  
  console.log("Estimated deployment cost:", hre.ethers.formatEther(estimatedCost), "ETH");
  console.log("Gas estimate:", gasEstimate.toString());
  console.log("Gas price:", hre.ethers.formatUnits(gasPrice.gasPrice, "gwei"), "gwei\n");

  // Confirmation prompts
  const confirmNetwork = await promptConfirmation("Are you sure you want to deploy to MAINNET? (yes/no): ");
  if (!confirmNetwork) {
    console.log("Deployment cancelled.");
    process.exit(0);
  }

  const confirmCost = await promptConfirmation(
    `Deployment will cost approximately ${hre.ethers.formatEther(estimatedCost)} ETH. Continue? (yes/no): `
  );
  if (!confirmCost) {
    console.log("Deployment cancelled.");
    process.exit(0);
  }

  // Deploy
  console.log("\n🚀 Deploying CairnZeroForwarder to Mainnet...\n");
  const forwarder = await CairnZeroForwarder.deploy();
  await forwarder.waitForDeployment();
  
  const forwarderAddress = await forwarder.getAddress();
  console.log("✅ CairnZeroForwarder deployed to:", forwarderAddress);

  // Wait for confirmations
  console.log("\nWaiting for 10 confirmations...");
  await forwarder.deploymentTransaction().wait(10);
  console.log("✅ Confirmed!\n");

  // Save deployment info
  const deploymentInfo = {
    network: "mainnet",
    chainId: 1,
    forwarderAddress: forwarderAddress,
    deployerAddress: deployer.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
    transactionHash: forwarder.deploymentTransaction().hash,
    estimatedCost: hre.ethers.formatEther(estimatedCost)
  };

  const outputPath = path.join(__dirname, "../deployments/mainnet.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("📝 Deployment info saved to:", outputPath);

  // Output environment variables
  console.log("\n📋 Add these to your production .env:\n");
  console.log(`NEXT_PUBLIC_FORWARDER_ADDRESS_MAINNET=${forwarderAddress}`);
  console.log(`NEXT_PUBLIC_FORWARDER_DEPLOYMENT_BLOCK_MAINNET=${deploymentInfo.blockNumber}`);

  console.log("\n✅ Deployment complete!");
  console.log("\n⚠️  CRITICAL NEXT STEPS:");
  console.log("1. Verify contract on Etherscan: npm run verify:mainnet");
  console.log("2. Transfer ownership if needed");
  console.log("3. Fund the relayer wallet with mainnet ETH");
  console.log("4. Update production environment variables");
  console.log("5. Test with small transactions first");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
