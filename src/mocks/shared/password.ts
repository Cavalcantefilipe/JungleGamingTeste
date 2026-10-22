import { z } from 'zod';

export const passwordHashSchema = z.object({ salt: z.string(), hash: z.string() });
type PasswordHash = z.infer<typeof passwordHashSchema>;

function encodeHex(bytes: ArrayBuffer | Uint8Array): string {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function deriveHash(password: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bytes = new Uint8Array(salt.match(/.{2}/g)?.map((pair) => parseInt(pair, 16)) ?? []);
  return encodeHex(
    await crypto.subtle.deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt: bytes, iterations: 100_000 },
      key,
      256,
    ),
  );
}

export async function hashPassword(password: string): Promise<PasswordHash> {
  const salt = encodeHex(crypto.getRandomValues(new Uint8Array(16)));
  return { salt, hash: await deriveHash(password, salt) };
}

export async function verifyPassword(password: string, saved: PasswordHash): Promise<boolean> {
  const derived = await deriveHash(password, saved.salt);
  if (derived.length !== saved.hash.length) return false;
  return (
    Array.from(derived).reduce(
      (difference, character, index) =>
        difference | (character.charCodeAt(0) ^ saved.hash.charCodeAt(index)),
      0,
    ) === 0
  );
}
