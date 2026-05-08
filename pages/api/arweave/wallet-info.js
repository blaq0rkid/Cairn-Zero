import Arweave from 'arweave';
import { getArweaveJWK } from '../../../lib/arweave-storage';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  const logSafe = (message, data = {}) => {
    const safe = { ...data };
    delete safe.name;
    delete safe.email;
    delete safe.jwk;
    console.log(message, safe);
  };

  try {
    logSafe('Fetching Arweave wallet info...');

    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
      timeout: 20000,
      logging: false,
    });

    const jwk = await getArweaveJWK();
    const address = await arweave.wallets.jwkToAddress(jwk);
    const balanceWinston = await arweave.wallets.getBalance(address);
    const balanceAR = arweave.ar.winstonToAr(balanceWinston);
    const sufficientFunds = parseFloat(balanceAR) >= 0.001;

    const response = {
      success: true,
      walletConfigured: true,
      address,
      balance: `${balanceAR} AR`,
      balanceWinston,
      sufficientFunds,
      source: 'netlify-blobs',
      timestamp: new Date().toISOString(),
    };

    logSafe('Wallet info retrieved successfully', { 
      address: address.substring(0, 8) + '...', 
      sufficientFunds 
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error('Wallet info error:', error.message);
    
    return res.status(500).json({
      success: false,
      walletConfigured: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
