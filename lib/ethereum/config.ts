
// lib/ethereum/config.ts
import { ethers } from 'ethers'

/**
 * Ethereum Network Configuration
 * Infura API Key: a5827f29bdd543cfb81f7c38f84726ec
 * Purpose: Bridge Succession Rehearsal protocol to real-world blockchain signals
 */

export const INFURA_CONFIG = {
  apiKey: process.env.INFURA_API_KEY || 'a5827f29bdd543cfb81f7c38f84726ec',
  networks: {
    mainnet: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    sepolia: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
    polygon: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
  }
}

export const SARCOPHAGUS_V2_CONFIG = {
  // Sarcophagus v2 contract addresses (update with actual deployed addresses)
  contracts: {
    mainnet: {
      archaeologist: '0x...', // Replace with actual mainnet address
      embalmer: '0x...',      // Replace with actual mainnet address
    },
    sepolia: {
      archaeologist: '0x...', // Replace with actual testnet address
      embalmer: '0x...',      // Replace with actual testnet address
    }
  },
  // Heartbeat monitoring interval (in seconds)
  heartbeatInterval: 86400, // 24 hours
  // Grace period before succession trigger (in seconds)
  gracePeriod: 259200, // 3 days
}

/**
 * Initialize Ethereum Provider
 * Creates connection to Ethereum network via Infura
 */
export function getEthereumProvider(network: 'mainnet' | 'sepolia' | 'polygon' = 'sepolia') {
  const rpcUrl = INFURA_CONFIG.networks[network]
  return new ethers.JsonRpcProvider(rpcUrl)
}

/**
 * Initialize Signer
 * Creates a wallet instance for signing transactions
 */
export function getEthereumSigner(privateKey: string, network: 'mainnet' | 'sepolia' | 'polygon' = 'sepolia') {
  const provider = getEthereumProvider(network)
  return new ethers.Wallet(privateKey, provider)
}

/**
 * Verify Infura Connection
 * Tests connectivity to Ethereum network
 */
export async function verifyInfuraConnection(network: 'mainnet' | 'sepolia' | 'polygon' = 'sepolia'): Promise<boolean> {
  try {
    const provider = getEthereumProvider(network)
    const blockNumber = await provider.getBlockNumber()
    console.log(`✓ Connected to ${network} - Current block: ${blockNumber}`)
    return true
  } catch (error) {
    console.error(`✗ Failed to connect to ${network}:`, error)
    return false
  }
}

/**
 * Get Network Status
 * Returns current blockchain state information
 */
export async function getNetworkStatus(network: 'mainnet' | 'sepolia' | 'polygon' = 'sepolia') {
  const provider = getEthereumProvider(network)
  
  const [blockNumber, gasPrice, network_info] = await Promise.all([
    provider.getBlockNumber(),
    provider.getFeeData(),
    provider.getNetwork()
  ])

  return {
    network: network_info.name,
    chainId: Number(network_info.chainId),
    blockNumber,
    gasPrice: gasPrice.gasPrice ? ethers.formatUnits(gasPrice.gasPrice, 'gwei') : null,
    maxFeePerGas: gasPrice.maxFeePerGas ? ethers.formatUnits(gasPrice.maxFeePerGas, 'gwei') : null,
  }
}
