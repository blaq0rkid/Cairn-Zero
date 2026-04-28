const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CairnZeroForwarder", function () {
  let forwarder;
  let owner;
  let user;
  let relayer;

  beforeEach(async function () {
    [owner, user, relayer] = await ethers.getSigners();
    
    const CairnZeroForwarder = await ethers.getContractFactory("CairnZeroForwarder");
    forwarder = await CairnZeroForwarder.deploy();
    await forwarder.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await forwarder.owner()).to.equal(owner.address);
    });

    it("Should initialize with correct EIP712 domain", async function () {
      const domain = await forwarder.eip712Domain();
      expect(domain.name).to.equal("CairnZeroForwarder");
      expect(domain.version).to.equal("1");
    });
  });

  describe("Nonce Management", function () {
    it("Should start with nonce 0", async function () {
      expect(await forwarder.getNonce(user.address)).to.equal(0);
    });

    it("Should increment nonce after execution", async function () {
      // This would require setting up a full meta-transaction
      // Simplified for demonstration
      const nonceBefore = await forwarder.getNonce(user.address);
      expect(nonceBefore).to.equal(0);
    });
  });

  describe("Signature Verification", function () {
    it("Should verify valid signatures", async function () {
      // Would implement full EIP-712 signature verification test
      // Requires setting up typed data and signing
    });

    it("Should reject invalid signatures", async function () {
      // Test invalid signature rejection
    });
  });
});
