import { AVATAR_MAX_BYTES, AVATAR_MIME_TYPES } from '@/contracts/profile';

export function isValidImage(bytes: Uint8Array, mime: string): boolean {
  if (bytes.length > AVATAR_MAX_BYTES) return false;
  if (mime === 'image/png')
    return [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte);
  if (mime === 'image/jpeg') return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (mime === 'image/webp')
    return (
      String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
      String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
    );
  return false;
}

export async function readAvatar(file: File): Promise<string> {
  if (!AVATAR_MIME_TYPES.some((type) => type === file.type) || file.size > AVATAR_MAX_BYTES)
    throw new Error('Escolha uma imagem PNG, JPEG ou WebP de até 2 MB.');
  if (!isValidImage(new Uint8Array(await file.arrayBuffer()), file.type))
    throw new Error('O conteúdo do arquivo não é uma imagem válida.');
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error('O conteúdo do arquivo não é uma imagem válida.');
  }
  try {
    const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Não foi possível preparar a imagem. Tente novamente.');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/webp', 0.85);
  } finally {
    bitmap.close();
  }
}
