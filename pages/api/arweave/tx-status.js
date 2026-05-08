import Arweave from 'arweave';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  const { txId } = req.query;

  if (!txId) {
    return res.status(400).json({
      success: false,
      error: 'Transaction ID is required',
    });
  }

  try {
    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
      timeout: 20000,
      logging: false,
    });

    const status = await arweave.transactions.getStatus(txId);
    const confirmed = status.confirmed;
    const confirmations = confirmed?.number_of_confirmations || 0;
    const blockHeight = confirmed?.block_height || null;

    return res.status(200).json({
      success: true,
      txId,
      status: confirmations > 0 ? 'confirmed' : 'pending',
      confirmations,
      blockHeight,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('TX status error:', error.message);
    
    return res.status(500).json({
      success: false,
      txId,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
