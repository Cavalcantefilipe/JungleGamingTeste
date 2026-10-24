import { isValidImage } from '@/lib/avatar';
import { MockError } from '@/mocks/shared/respond';

export function validateAvatar(dataUrl: string): void {
  const [prefix, base64 = ''] = dataUrl.split(',');
  const mime = prefix?.split(':')[1]?.split(';')[0] ?? '';
  let bytes: Uint8Array;
  try {
    bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
  } catch {
    throw new MockError(422, 'INVALID_IMAGE');
  }
  if (!isValidImage(bytes, mime)) throw new MockError(422, 'INVALID_IMAGE');
}
