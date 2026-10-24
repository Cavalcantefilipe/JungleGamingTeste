import { FooterFeatures } from '@/features/layout/FooterFeatures';
import { FooterLinks } from '@/features/layout/FooterLinks';

export function Footer() {
  return (
    <footer className="page-container mt-24 pb-28 lg:pb-6">
      <FooterFeatures />
      <div
        data-testid="footer-brand"
        className="grid gap-4 bg-surface-dark px-8 py-6 text-sm text-foreground md:grid-cols-4 xl:h-[88px] xl:grid-cols-[repeat(4,228px)] xl:items-center xl:justify-between xl:gap-0"
      >
        <strong className="tracking-[0.1em]">KURIO</strong>
        <p>
          Feito para colecionadores,
          <br />
          criadores e cultura
        </p>
        <span>contato@email.com</span>
        <span>+55 11 4002 8922</span>
      </div>
      <FooterLinks />
      <p className="py-2 text-center text-sm leading-5 text-foreground">
        © 2026 Kurio. Propriedade digital para todos.
      </p>
    </footer>
  );
}
