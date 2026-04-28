export class ZeroKnowledgeEncryption {
  
  /**
   * Generate AES-GCM encryption key (symmetric)
   * Used for encrypting the actual Cairn data
   */
  static async generateDataKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true, // extractable
      ['encrypt', 'decrypt']
    )
  }

  /**
   * Generate RSA-OAEP key pair for key wrapping
   * Public key shared with successors, private key stays with founder
   */
  static async generateKeyPair(): Promise<CryptoKeyPair> {
    return await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['wrapKey', 'unwrapKey']
    )
  }

  /**
   * Encrypt data (Cairn content) - CLIENT-SIDE ONLY
   * @param plaintext - The secret data to encrypt
   * @param dataKey - AES key for encryption
   * @returns Base64-encoded ciphertext with IV
   */
  static async encryptData(
    plaintext: string,
    dataKey: CryptoKey
  ): Promise<{ ciphertext: string; iv: string }> {
    const encoder = new TextEncoder()
    const data = encoder.encode(plaintext)

    // Generate random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(12))

    // Encrypt with AES-GCM
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      dataKey,
      data
    )

    return {
      ciphertext: this.arrayBufferToBase64(encrypted),
      iv: this.arrayBufferToBase64(iv)
    }
  }

  /**
   * Decrypt data (Successor unwraps the Cairn)
   * @param ciphertext - Base64-encoded encrypted data
   * @param iv - Base64-encoded initialization vector
   * @param dataKey - AES key for decryption
   * @returns Decrypted plaintext
   */
  static async decryptData(
    ciphertext: string,
    iv: string,
    dataKey: CryptoKey
  ): Promise<string> {
    const encryptedData = this.base64ToArrayBuffer(ciphertext)
    const ivBuffer = this.base64ToArrayBuffer(iv)

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBuffer
      },
      dataKey,
      encryptedData
    )

    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
  }

  /**
   * Wrap (encrypt) the data key with successor's public key
   * This allows the successor to unwrap it later
   */
  static async wrapDataKey(
    dataKey: CryptoKey,
    successorPublicKey: CryptoKey
  ): Promise<string> {
    const wrappedKey = await crypto.subtle.wrapKey(
      'raw',
      dataKey,
      successorPublicKey,
      {
        name: 'RSA-OAEP'
      }
    )

    return this.arrayBufferToBase64(wrappedKey)
  }

  /**
   * Unwrap (decrypt) the data key with successor's private key
   * Called when succession trigger activates
   */
  static async unwrapDataKey(
    wrappedKey: string,
    successorPrivateKey: CryptoKey
  ): Promise<CryptoKey> {
    const wrappedKeyBuffer = this.base64ToArrayBuffer(wrappedKey)

    return await crypto.subtle.unwrapKey(
      'raw',
      wrappedKeyBuffer,
      successorPrivateKey,
      {
        name: 'RSA-OAEP'
      },
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    )
  }

  /**
   * Export public key for storage (successor registration)
   */
  static async exportPublicKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('spki', key)
    return this.arrayBufferToBase64(exported)
  }

  /**
   * Import public key from storage
   */
  static async importPublicKey(keyData: string): Promise<CryptoKey> {
    const buffer = this.base64ToArrayBuffer(keyData)
    return await crypto.subtle.importKey(
      'spki',
      buffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
      },
      true,
      ['wrapKey']
    )
  }

  /**
   * Export private key for secure storage (encrypted in device)
   */
  static async exportPrivateKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('pkcs8', key)
    return this.arrayBufferToBase64(exported)
  }

  /**
   * Import private key from secure storage
   */
  static async importPrivateKey(keyData: string): Promise<CryptoKey> {
    const buffer = this.base64ToArrayBuffer(keyData)
    return await crypto.subtle.importKey(
      'pkcs8',
      buffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
      },
      true,
      ['unwrapKey']
    )
  }

  /**
   * Export AES data key for storage (will be wrapped)
   */
  static async exportDataKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('raw', key)
    return this.arrayBufferToBase64(exported)
  }

  // Utility functions
  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  private static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }
}
