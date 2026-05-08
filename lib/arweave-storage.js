import { getStore } from '@netlify/blobs';

const STORE_NAME = 'secure-keys';
const JWK_KEY = 'arweave-jwk';

export async function storeArweaveJWK(jwk) {
  try {
    const store = getStore(STORE_NAME);
    await store.set(JWK_KEY, JSON.stringify(jwk));
    console.log('✓ Arweave JWK stored successfully in Netlify Blobs');
    return { success: true };
  } catch (error) {
    console.error('✗ Failed to store Arweave JWK:', error.message);
    throw error;
  }
}

export async function getArweaveJWK() {
  try {
    const store = getStore(STORE_NAME);
    const jwkString = await store.get(JWK_KEY);
    
    if (!jwkString) {
      throw new Error('Arweave JWK not found in Netlify Blobs. Run setup first.');
    }
    
    return JSON.parse(jwkString);
  } catch (error) {
    console.error('✗ Failed to retrieve Arweave JWK:', error.message);
    throw error;
  }
}

export async function hasArweaveJWK() {
  try {
    const store = getStore(STORE_NAME);
    const jwkString = await store.get(JWK_KEY);
    return !!jwkString;
  } catch (error) {
    return false;
  }
}
