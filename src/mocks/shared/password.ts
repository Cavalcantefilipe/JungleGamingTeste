import type { PasswordRecord } from '../db/schema';

const PBKDF2_ITERATIONS = 100_000;
const KEY_LENGTH_BITS = 256;
const SALT_BYTES = 16;

function toHex(bytes: ArrayBuffer | Uint8Array): string {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function fromHex(hex: string): Uint8Array<ArrayBuffer> {
  const bytes = hex.match(/.{2}/g) ?? [];
  return new Uint8Array(bytes.map((byte) => Number.parseInt(byte, 16)));
}

async function derive(password: string, salt: Uint8Array<ArrayBuffer>): Promise<string> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: PBKDF2_ITERATIONS },
    keyMaterial,
    KEY_LENGTH_BITS,
  );
  return toHex(bits);
}

export async function hashPassword(password: string): Promise<PasswordRecord> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  return { salt: toHex(salt), hash: await derive(password, salt) };
}

export async function verifyPassword(password: string, stored: PasswordRecord): Promise<boolean> {
  const candidate = await derive(password, fromHex(stored.salt));
  if (candidate.length !== stored.hash.length) return false;
  let mismatch = 0;
  for (let index = 0; index < candidate.length; index += 1) {
    mismatch |= candidate.charCodeAt(index) ^ stored.hash.charCodeAt(index);
  }
  return mismatch === 0;
}
