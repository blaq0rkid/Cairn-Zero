const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🔍 Verifying CairnZeroForwarder on Etherscan (Mainnet)...\n");

  // Load deployment info
  const deploymentPath = path.join(__dirname, "../deployments/mainnet.json");
  if (!fs.existsSync(deploymentPath)) {
    console.error("❌ Deployment file not found. Run deployment first.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  console.log("Contract address:", deployment.forwarderAddress);

  try {
    await hre.run("verify:verify", {
      address: deployment.forwarderAddress,
      constructorArguments: []
    });
    
    console.log("✅ Contract verified successfully!");
    console.log(`View on Etherscan: https://etherscan.io/address/${deployment.forwarderAddress}`);
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract already verified!");
    } else {
      console.error("❌ Verification failed:", error.message);
      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
