import { NewsletterForm } from '@/features/layout/NewsletterForm';

const features = [
  {
    letter: 'W',
    title: 'Segurança da carteira',
    description: 'Proteja sua carteira e colecione arte digital verificada com confiança.',
  },
  {
    letter: 'C',
    title: 'Criadores em destaque',
    description: 'Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.',
  },
  {
    letter: 'D',
    title: 'Alertas de lançamentos',
    description:
      'Receba calendários de cunhagem, novidades de listas de acesso e análises de mercado.',
  },
];

export function FooterFeatures() {
  return (
    <div
      data-testid="footer-features"
      className="grid gap-8 bg-surface-card p-8 md:grid-cols-2 xl:h-[250px] xl:grid-cols-[repeat(3,minmax(0,1fr))_340px] xl:gap-0"
    >
      {features.map((feature) => (
        <div key={feature.letter} className="space-y-3 xl:border-r xl:border-primary/60 xl:px-4">
          <span
            data-testid="footer-medallion"
            aria-hidden="true"
            className="flex size-[74px] items-center justify-center rounded-full bg-primary text-2xl font-bold text-ink"
          >
            {feature.letter}
          </span>
          <h2 className="text-section leading-4 font-bold">{feature.title}</h2>
          <p className="text-sm leading-[22px] text-text-secondary">{feature.description}</p>
        </div>
      ))}
      <NewsletterForm />
    </div>
  );
}
