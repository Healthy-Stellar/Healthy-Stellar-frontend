/**
 * Client-side AES-256-GCM encryption using the Web Crypto API.
 * Raw file bytes are encrypted before upload; only the content hash
 * and an encrypted metadata pointer are stored on-chain.
 *
 * ## Algorithm
 * AES-256-GCM (authenticated encryption): a single `crypto.subtle.encrypt` call
 * produces ciphertext with an integrity tag, so tampering with the encrypted
 * blob is detectable on decryption rather than silently accepted.
 *
 * ## Key management
 * - No password-based key derivation (e.g. PBKDF2/Argon2) is used. Each call to
 *   {@link encryptFile} generates a fresh random 256-bit `CryptoKey` via
 *   `crypto.subtle.generateKey`, scoped to a single file.
 * - The key is generated as `extractable: true` so it can be exported and sent
 *   to the backend (see {@link exportKey}). As currently wired up in
 *   `MedicalRecordUpload.tsx`, the exported key is uploaded to the server in the
 *   same request as the encrypted file — i.e. the server receives both the
 *   ciphertext and the key needed to decrypt it. This scheme protects the file
 *   in transit/at rest against anyone who does *not* have server access, but it
 *   does **not** protect confidentiality from the backend/storage layer itself.
 *   Any redesign to keep the server from ever seeing plaintext-equivalent
 *   access would need out-of-band key custody (e.g. per-user/per-share keys
 *   not transmitted alongside the ciphertext).
 *
 * ## IV handling
 * A new 96-bit (12-byte) IV is generated per encryption via
 * `crypto.getRandomValues`. 96 bits is the size recommended for AES-GCM.
 * Reusing an IV with the same key would break GCM's confidentiality/integrity
 * guarantees, but since {@link encryptFile} always pairs a fresh IV with a
 * freshly generated key, reuse cannot occur here.
 *
 * ## Integrity hash
 * {@link hashBuffer} computes a SHA-256 hex digest of the *ciphertext*, used as
 * a content hash (e.g. for on-chain reference/dedup), not as a substitute for
 * GCM's built-in authentication tag.
 */

/**
 * Encrypt a file's contents with a freshly generated AES-256-GCM key.
 * @param file - File to encrypt.
 * @returns The ciphertext (`encryptedBuffer`), the random 96-bit IV used, and
 *   the extractable `CryptoKey` (export via {@link exportKey} if it needs to
 *   leave the Web Crypto API, e.g. for upload).
 */
export async function encryptFile(file: File): Promise<{
  encryptedBuffer: ArrayBuffer;
  iv: Uint8Array;
  key: CryptoKey;
}> {
  // extractable: true — required so the key can be exported/uploaded (see module docs above)
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
    'encrypt',
    'decrypt',
  ]);

  // 96-bit IV, the size recommended for AES-GCM; safe to reuse only because a new key
  // is generated per call, so no (key, iv) pair is ever repeated.
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const fileBuffer = await file.arrayBuffer();

  const encryptedBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, fileBuffer);

  return { encryptedBuffer, iv, key };
}

/**
 * Export a `CryptoKey` to a raw byte buffer so it can be transmitted or stored
 * outside the Web Crypto API.
 * @param key - An extractable AES-GCM `CryptoKey`, e.g. from {@link encryptFile}.
 * @returns Raw key bytes.
 */
export async function exportKey(key: CryptoKey): Promise<ArrayBuffer> {
  return crypto.subtle.exportKey('raw', key);
}

/**
 * Compute a SHA-256 hex digest of a buffer, used as a content-integrity hash
 * (e.g. for the on-chain record pointer). This is independent of AES-GCM's own
 * authentication tag, which already guards ciphertext integrity on decrypt.
 * @param buffer - Bytes to hash (typically the encrypted file buffer).
 * @returns Lowercase hex-encoded SHA-256 digest.
 */
export async function hashBuffer(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
