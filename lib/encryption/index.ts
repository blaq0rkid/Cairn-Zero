**
 * Encrypt data using Web Crypto API (local encryption only)
 * No server-side encryption per Manifesto §2
 */
export async function encryptData(
  plaintext: string,
  publicKey: CryptoKey
): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(plaintext)

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP'
    },
    publicKey,
    data
  )

  return arrayBufferToBase64(encrypted)
}

/**
 * Decrypt data using Web Crypto API
 */
export async function decryptData(
  ciphertext: string,
  privateKey: CryptoKey
): Promise<string> {
  const data = base64ToArrayBuffer(ciphertext)

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'RSA-OAEP'
    },
    privateKey,
    data
  )

  const decoder = new TextDecoder()
  return decoder.decode(decrypted)
}

/**
 * Generate encryption key pair for Successor
 */
export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['encrypt', 'decrypt']
  )
}

/**
 * Export public key for storage
 */
export async function exportPublicKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey('spki', key)
  return arrayBufferToBase64(exported)
}

/**
 * Import public key from storage
 */
export async function importPublicKey(keyData: string): Promise<CryptoKey> {
  const buffer = base64ToArrayBuffer(keyData)
  return await crypto.subtle.importKey(
    'spki',
    buffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    true,
    ['encrypt']
  )
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}
