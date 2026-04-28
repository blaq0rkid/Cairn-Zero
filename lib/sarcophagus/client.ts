import { ethers } from 'ethers'

// Sarcophagus v2 contract addresses (Mainnet)
const SARCOPHAGUS_CONTRACTS = {
  mainnet: {
    diamondDeployAddress: '0x9b9D6d9D11F4A0d8d5b1E3bF7E2bE8c5d9D6d9D9', // Replace with actual
    archaeologist: '0xArchaeologistRegistryAddress',
    viewStateFacet: '0xViewStateFacetAddress'
  },
  sepolia: {
    diamondDeployAddress: '0xSepoliaDiamondAddress',
    archaeologist: '0xSepoliaArchaeologistAddress',
    viewStateFacet: '0xSepoliaViewStateFacetAddress'
  }
}

// Sarcophagus ABI (simplified for core functions)
const SARCOPHAGUS_ABI = [
  'function createSarcophagus(bytes32 sarcoId, uint256 resurrectionTime, address recipient, uint256 creationFee, uint8[] archaeologists) external payable',
  'function updateSarcophagus(bytes32 sarcoId, uint256 newResurrectionTime) external',
  'function cleanSarcophagus(bytes32 sarcoId) external',
  'function rewrapSarcophagus(bytes32 sarcoId, uint256 newResurrectionTime) external',
  'function burySarcophagus(bytes32 sarcoId) external'
]

export interface SarcophagusConfig {
  resurrectionTime: number // Unix timestamp
  recipientAddress: string
  encryptedPayload: string
  archaeologistCount: number
}

export class SarcophagusClient {
  private provider: ethers.JsonRpcProvider
  private contract: ethers.Contract
  private network: 'mainnet' | 'sepolia'

  constructor(network: 'mainnet' | 'sepolia' = 'sepolia') {
    this.network = network
    
    // Use Infura or Alchemy as RPC provider
    const rpcUrl = network === 'mainnet' 
      ? `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
      : `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
    
    this.provider = new ethers.JsonRpcProvider(rpcUrl)
    
    const contractAddress = SARCOPHAGUS_CONTRACTS[network].diamondDeployAddress
    this.contract = new ethers.Contract(contractAddress, SARCOPHAGUS_ABI, this.provider)
  }

  /**
   * Create a new Sarcophagus (Dead Man's Switch)
   * Called when Founder completes onboarding
   */
  async createSarcophagus(
    founderAddress: string,
    config: SarcophagusConfig
  ): Promise<string> {
    try {
      // Generate unique sarcophagus ID
      const sarcoId = ethers.keccak256(
        ethers.toUtf8Bytes(`${founderAddress}-${Date.now()}`)
      )

      // Prepare transaction data
      const tx = await this.contract.createSarcophagus(
        sarcoId,
        config.resurrectionTime,
        config.recipientAddress,
        ethers.parseEther('0.01'), // Creation fee (adjust based on network)
        Array(config.archaeologistCount).fill(0).map((_, i) => i) // Archaeologist indices
      )

      await tx.wait()

      return sarcoId
    } catch (error) {
      console.error('Sarcophagus creation error:', error)
      throw new Error('Failed to create Sarcophagus')
    }
  }

  /**
   * Update resurrection time (re-wrap)
   * Called when Founder performs check-in
   */
  async rewrapSarcophagus(
    sarcoId: string,
    newResurrectionTime: number
  ): Promise<void> {
    try {
      const tx = await this.contract.rewrapSarcophagus(sarcoId, newResurrectionTime)
      await tx.wait()
    } catch (error) {
      console.error('Rewrap error:', error)
      throw new Error('Failed to rewrap Sarcophagus')
    }
  }

  /**
   * Clean (cancel) a Sarcophagus before resurrection
   */
  async cleanSarcophagus(sarcoId: string): Promise<void> {
    try {
      const tx = await this.contract.cleanSarcophagus(sarcoId)
      await tx.wait()
    } catch (error) {
      console.error('Clean error:', error)
      throw new Error('Failed to clean Sarcophagus')
    }
  }
}
