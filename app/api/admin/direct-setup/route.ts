import { getStore } from '@netlify/blobs';

export async function POST(request: Request) {
  try {
    // Get the JWK from request body
    const { jwk, setupToken } = await request.json();
    
    // Verify setup token
    if (setupToken !== process.env.SETUP_TOKEN) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if JWK already exists
    const store = getStore('secure-keys');
    const existing = await store.get('arweave-jwk');
    
    if (existing) {
      return Response.json({ 
        error: 'JWK already stored. Delete from Netlify Blobs dashboard first.' 
      }, { status: 400 });
    }
    
    // Store the JWK
    await store.set('arweave-jwk', JSON.stringify(jwk));
    
    return Response.json({ 
      success: true,
      message: 'JWK stored successfully in Netlify Blobs'
    });
    
  } catch (error) {
    return Response.json({ 
      error: 'Setup failed',
      details: error.message 
    }, { status: 500 });
  }
}
