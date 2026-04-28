import { useGaslessTransaction } from '@/hooks/useGaslessTransaction'
import { ethers } from 'ethers'

export default function CreateSarcophagusButton({ 
  userAddress, 
  encryptedData 
}: { 
  userAddress: string
  encryptedData: string 
}) {
  const { executeGasless, loading } = useGaslessTransaction()

  const handleCreate = async () => {
    // Encode Sarcophagus creation call
    const sarcophagusInterface = new ethers.Interface([
      'function createSarcophagus(bytes32 sarcoId, uint256 resurrectionTime, address recipient, uint256 creationFee, uint8[] archaeologists) external payable'
    ])

    const sarcoId = ethers.keccak256(ethers.toUtf8Bytes(`${userAddress}-${Date.now()}`))
    const resurrectionTime = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days

    const callData = sarcophagusInterface.encodeFunctionData('createSarcophagus', [
      sarcoId,
      resurrectionTime,
      userAddress,
      ethers.parseEther('0.01'),
      [0, 1, 2] // Archaeologist indices
    ])

    // Execute gasless (Paymaster pays gas fees)
    const txHash = await executeGasless(
      userAddress,
      '0xSarcophagusContractAddress',
      callData
    )

    console.log('Sarcophagus created:', txHash)
  }

  return (
    <button
      onClick={handleCreate}
      disabled={loading}
      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
    >
      {loading ? 'Creating Cairn...' : 'Create Cairn'}
    </button>
  )
}
