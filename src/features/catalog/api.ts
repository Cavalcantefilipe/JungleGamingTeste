import { nftListResponseSchema, nftSchema, type NftListQuery } from '@/contracts/nft';
import { apiRequest } from '@/lib/http';

export function fetchNfts(search: NftListQuery, signal: AbortSignal) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) for (const item of value) params.append(key, item);
    else params.set(key, String(value));
  }
  return apiRequest(nftListResponseSchema, { url: `/nfts?${params.toString()}`, signal });
}
export function fetchNft(id: string, signal: AbortSignal) {
  return apiRequest(nftSchema, { url: `/nfts/${encodeURIComponent(id)}`, signal });
}
