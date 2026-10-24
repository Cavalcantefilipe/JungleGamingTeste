import { artImage } from './fixtures/images';

import type { MockDb } from './schema';
import type { NftImage } from '@/contracts';

function migrateImage(image: NftImage): NftImage {
  const match = /^\/images\/nfts\/art-(\d+)\.svg$/.exec(image.src);
  return match?.[1] ? artImage(Number(match[1]) - 1, image.alt) : image;
}

export function migrateArtwork(db: MockDb): MockDb {
  return {
    ...db,
    nfts: db.nfts.map((nft) => ({
      ...nft,
      images: nft.images.map((image) => {
        const original = nft.images[0];
        return original && /^\/images\/nfts\/art-\d+\.svg$/.test(image.src)
          ? { ...migrateImage(original), alt: image.alt }
          : image;
      }),
    })),
    carts: db.carts.map((cart) => ({
      ...cart,
      items: cart.items.map((item) => ({
        ...item,
        snapshot: { ...item.snapshot, image: migrateImage(item.snapshot.image) },
      })),
    })),
    quotes: db.quotes.map((quote) => ({
      ...quote,
      items: quote.items.map((item) => ({
        ...item,
        image: migrateImage(item.image),
      })),
    })),
    orders: db.orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        image: migrateImage(item.image),
      })),
    })),
  };
}
