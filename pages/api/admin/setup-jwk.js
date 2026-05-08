import { storeArweaveJWK, hasArweaveJWK } from '../../../lib/arweave-storage';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const setupToken = req.headers['x-setup-token'];
  if (setupToken !== process.env.SETUP_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const exists = await hasArweaveJWK();
    if (exists) {
      return res.status(400).json({ 
        error: 'JWK already stored. Delete from Netlify Blobs if you need to update.' 
      });
    }

    const jwkString = process.env.ARWEAVE_JWK_TEMP;
    if (!jwkString) {
      return res.status(400).json({ 
        error: 'ARWEAVE_JWK_TEMP environment variable not set' 
      });
    }

    const jwk = JSON.parse(jwkString);
    await storeArweaveJWK(jwk);

    return res.status(200).json({ 
      success: true,
      message: 'Arweave JWK stored successfully. You can now remove ARWEAVE_JWK_TEMP from environment variables.'
    });
  } catch (error) {
    console.error('Setup error:', error);
    return res.status(500).json({ 
      error: 'Failed to store JWK',
      details: error.message 
    });
  }
}
