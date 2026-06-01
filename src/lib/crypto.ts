/**
 * Client-side AES-256-GCM encryption using the Web Crypto API.
 * Raw file bytes are encrypted before upload; only the content hash
 * and an encrypted metadata pointer are stored on-chain.
 */

export async function encryptFile(file: File): Promise<{
  encryptedBuffer: ArrayBuffer;
  iv: Uint8Array;
  key: CryptoKey;
}> {
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const fileBuffer = await file.arrayBuffer();

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    fileBuffer,
  );

  return { encryptedBuffer, iv, key };
}

export async function exportKey(key: CryptoKey): Promise<ArrayBuffer> {
  return crypto.subtle.exportKey('raw', key);
}

export async function hashBuffer(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
