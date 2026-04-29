
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
    mainnet: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY || 'a5827f29bdd543cfb81f7c38f84726ec'}`,
    sepolia: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY || 'a5827f29bdd543cfb81f7c38f84726ec'}`,
    polygon: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY || 'a5827f29bdd543cfb81f7c38f84726ec'}`,
  }
}

export const SARCOPHAGUS_V2_CONFIG = {
  // Sarcophagus v2 Diamond Contract (Archaeologist & Embalmer logic)
  contracts: {
    mainnet: {
      diamond: '0x0576a174D229E3cFA37253523E645A78A0C91B57',
      archaeologist: '0x0576a174D229E3cFA37253523E645A78A0C91B57',
      embalmer: '0x0576a174D229E3cFA37253523E645A78A0C91B57',
    },
    sepolia: {
      diamond: '0x0576a174D229E3cFA37253523E645A78A0C91B57',
      archaeologist: '0x0576a174D229E3cFA37253523E645A78A0C91B57',
      embalmer: '0x0576a174D229E3cFA37253523E645A78A0C91B57',
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
    sarcophagusDiamond: SARCOPHAGUS_V2_CONFIG.contracts[network === 'mainnet' ? 'mainnet' : 'sepolia'].diamond
  }
}

/**
 * Verify Sarcophagus Diamond Contract
 * Tests connectivity to Sarcophagus v2 protocol
 */
export async function verifySarcophagusContract(network: 'mainnet' | 'sepolia' = 'sepolia'): Promise<boolean> {
  try {
    const provider = getEthereumProvider(network)
    const contractAddress = SARCOPHAGUS_V2_CONFIG.contracts[network].diamond
    
    // Check if contract exists at address
    const code = await provider.getCode(contractAddress)
    
    if (code === '0x') {
      console.error(`✗ No contract found at ${contractAddress} on ${network}`)
      return false
    }
    
    console.log(`✓ Sarcophagus Diamond contract verified at ${contractAddress} on ${network}`)
    return true
  } catch (error) {
    console.error(`✗ Failed to verify Sarcophagus contract:`, error)
    return false
  }
}
