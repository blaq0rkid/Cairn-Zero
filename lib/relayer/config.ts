export const RELAYER_CONFIG = {
  sepolia: {
    rpcUrl: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
    paymasterAddress: '0xYourSepoliaPaymasterAddress',
    forwarderAddress: '0xYourSepoliaForwarderAddress',
    chainId: 11155111
  },
  mainnet: {
    rpcUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    paymasterAddress: '0xYourMainnetPaymasterAddress',
    forwarderAddress: '0xYourMainnetForwarderAddress',
    chainId: 1
  }
}

export function getRelayerConfig() {
  const network = process.env.NEXT_PUBLIC_ENVIRONMENT_MODE === 'production' 
    ? 'mainnet' 
    : 'sepolia'
  return RELAYER_CONFIG[network]
}
