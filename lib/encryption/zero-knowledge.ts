
/**
 * Zero-Knowledge Encryption Module
 * Provides client-side encryption for sensitive data
 */

export class ZeroKnowledgeEncryption {
  private algorithm = 'AES-GCM'
  private keyLength = 256

  /**
   * Generate a cryptographic key from a passphrase
   */
  async deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder()
    const passphraseKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(passphrase),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    )

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      passphraseKey,
      { name: this.algorithm, length: this.keyLength },
      false,
      ['encrypt', 'decrypt']
    )
  }

  /**
   * Encrypt data with zero-knowledge encryption
   */
  async encrypt(data: string, passphrase: string): Promise<{
    ciphertext: string
    iv: string
    salt: string
  }> {
    const encoder = new TextEncoder()
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const key = await this.deriveKey(passphrase, salt)

    const encrypted = await crypto.subtle.encrypt(
      {
        name: this.algorithm,
        iv
      },
      key,
      encoder.encode(data)
    )

    return {
      ciphertext: this.arrayBufferToBase64(encrypted),
      iv: this.uint8ArrayToBase64(iv),
      salt: this.uint8ArrayToBase64(salt)
    }
  }

  /**
   * Decrypt zero-knowledge encrypted data
   */
  async decrypt(
    ciphertext: string,
    iv: string,
    salt: string,
    passphrase: string
  ): Promise<string> {
    const key = await this.deriveKey(passphrase, this.base64ToUint8Array(salt))

    const decrypted = await crypto.subtle.decrypt(
      {
        name: this.algorithm,
        iv: this.base64ToUint8Array(iv)
      },
      key,
      this.base64ToArrayBuffer(ciphertext)
    )

    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
  }

  /**
   * Convert ArrayBuffer to base64 string
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  /**
   * Convert Uint8Array to base64 string
   */
  private uint8ArrayToBase64(array: Uint8Array): string {
    let binary = ''
    for (let i = 0; i < array.byteLength; i++) {
      binary += String.fromCharCode(array[i])
    }
    return btoa(binary)
  }

  /**
   * Convert base64 string to ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
  }

  /**
   * Convert base64 string to Uint8Array
   */
  private base64ToUint8Array(base64: string): Uint8Array {
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes
  }
}

export const zkEncryption = new ZeroKnowledgeEncryption()
