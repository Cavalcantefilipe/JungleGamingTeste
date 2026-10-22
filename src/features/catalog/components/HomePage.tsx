import { BlogSection } from './BlogSection';
import { CatalogSection } from './CatalogSection';
import { HeroSection } from './HeroSection';
import { PromoBanners } from './PromoBanners';

export function HomePage() {
  return (
    <div className="flex flex-col gap-16 pb-8 md:gap-24">
      <HeroSection />
      <CatalogSection />
      <PromoBanners />
      <BlogSection />
    </div>
  );
}
