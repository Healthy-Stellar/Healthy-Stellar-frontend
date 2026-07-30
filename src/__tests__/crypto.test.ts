import { encryptFile, exportKey, hashBuffer } from '@/lib/crypto';

describe('crypto', () => {
  it('round-trips: encrypts then decrypts back to the original file contents', async () => {
    const original = 'sensitive medical record contents';
    const file = new File([original], 'record.txt', { type: 'text/plain' });

    const { encryptedBuffer, iv, key } = await encryptFile(file);
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedBuffer,
    );

    expect(new TextDecoder().decode(decryptedBuffer)).toBe(original);
  });

  it('exportKey returns a 32-byte raw AES-256 key', async () => {
    const file = new File(['data'], 'a.txt');
    const { key } = await encryptFile(file);

    const raw = await exportKey(key);

    expect(raw.byteLength).toBe(32);
  });

  it('hashBuffer produces a stable 64-char hex SHA-256 digest', async () => {
    const buffer = new TextEncoder().encode('hello world').buffer;

    const hash1 = await hashBuffer(buffer);
    const hash2 = await hashBuffer(buffer);

    expect(hash1).toBe(hash2);
    expect(hash1).toMatch(/^[0-9a-f]{64}$/);
  });

  it('hashBuffer produces different hashes for different content', async () => {
    const bufferA = new TextEncoder().encode('alpha').buffer;
    const bufferB = new TextEncoder().encode('beta').buffer;

    expect(await hashBuffer(bufferA)).not.toBe(await hashBuffer(bufferB));
  });

  it('fails to decrypt with an invalid (mismatched) key', async () => {
    const file = new File(['top secret'], 'record.txt');
    const { encryptedBuffer, iv } = await encryptFile(file);

    const wrongKey = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
      'encrypt',
      'decrypt',
    ]);

    await expect(
      crypto.subtle.decrypt({ name: 'AES-GCM', iv }, wrongKey, encryptedBuffer),
    ).rejects.toThrow();
  });

  it('fails to decrypt corrupted ciphertext', async () => {
    const file = new File(['top secret'], 'record.txt');
    const { encryptedBuffer, iv, key } = await encryptFile(file);

    const corrupted = new Uint8Array(encryptedBuffer.slice(0));
    corrupted[0] = (corrupted[0] ?? 0) ^ 0xff;

    await expect(
      crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, corrupted.buffer),
    ).rejects.toThrow();
  });
});
