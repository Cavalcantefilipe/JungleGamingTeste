import { Link } from '@tanstack/react-router';

import { NFT_CATEGORY_LABELS } from '@/contracts/nft';

const categories = ['arte-digital', 'fotografia', 'musica', 'arte-3d', 'utilidade'] as const;

export function FooterCollectionLinks() {
  return (
    <div className="footer-links">
      <h2>Coleções</h2>
      {categories.map((category) => (
        <Link key={category} to="/" search={{ category: [category] }} hash="catalogo">
          {NFT_CATEGORY_LABELS[category]}
        </Link>
      ))}
    </div>
  );
}
