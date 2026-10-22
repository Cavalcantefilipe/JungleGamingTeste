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
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Falha ao ler imagem'));
    };
    reader.onerror = () => {
      reject(new Error('Falha ao ler imagem'));
    };
    reader.readAsDataURL(file);
  });
}
