# Lighthouse e desempenho

Medição: 2026-10-23T05:20:23.806Z. Build de produção local, cenário default, perfil limpo por execução, três execuções por página/perfil e mediana por métrica. Sem outros testes ou builds simultâneos. Não representa medição em celular físico nem produção publicada.

## Resultados

| Perfil  | Página | Performance | Acessibilidade | Boas práticas | SEO |     LCP |    CLS |  TBT |
| ------- | ------ | ----------: | -------------: | ------------: | --: | ------: | -----: | ---: |
| desktop | home   |          99 |            100 |           100 | 100 |  919 ms | 0.0122 | 0 ms |
| desktop | detail |          99 |            100 |           100 | 100 |  839 ms | 0.0623 | 0 ms |
| mobile  | home   |          91 |            100 |           100 | 100 | 3518 ms | 0.0000 | 0 ms |
| mobile  | detail |          88 |            100 |           100 | 100 | 3803 ms | 0.0000 | 4 ms |

Metas: Performance ≥90, Acessibilidade ≥95, Boas práticas ≥95, SEO ≥90. **Performance do detalhe mobile não atingiu a meta (88).** Home mobile atingiu 91. O comando mantém as assertions e termina com código 1 para o detalhe; nenhum limite foi reduzido. As demais categorias passaram.

## O que foi feito

- Arte original em AVIF/WebP com candidatos de 400/800px e sizes por contexto; imagem principal abaixo de 60KB, dimensões reservadas e lazy loading fora do conteúdo inicial.
- Preload da fonte local 400 e arte principal desktop; SVG original do hero mobile com prioridade alta. Fontes locais mantêm a licença OFL em public/ROBOTO-MONO-LICENSE.txt.
- Rotas divididas pelo TanStack Router, target ES2022, menu de conta e transporte Socket.IO carregados sob demanda. Renderer/providers e mocks carregam em paralelo; a montagem aguarda o worker e o transporte é importado após montar. Testes confirmam interceptação e isolamento de sessão.
- Cabeçalho de seção semântico e campo de quantidade com alvo mobile de 44px. As quatro medições de acessibilidade chegaram a 100.
- Feedback de carregamento presente no HTML antes do JavaScript, com fonte do sistema e primeiro frame reservado antes da inicialização. Não antecipa dados, autenticação ou confirmação. Teste pausa scripts e verifica mensagem visível, depois libera e confirma a interface.
- Configuração jitless do Zod para compatibilidade com CSP sem unsafe-eval; fluxo completo com headers testado.

## Pendência mobile e tentativas rejeitadas

O baseline anterior mediu Performance 89 nas duas páginas mobile, LCP de aproximadamente 3358/3488ms e TBT 0. A versão atual mede 91 na Home e 88 no detalhe: o feedback inicial melhorou a pontuação da Home, mas **não há melhora comprovada do detalhe mobile em relação ao baseline**. As melhorias de imagem, acessibilidade e CSP têm evidências independentes. O resultado não foi descrito como aprovação completa de performance.

A inicialização inclui React, Query/Router, contratos e um backend MSW inteiro no navegador, registro do service worker e primeira resposta simulada. Os relatórios mostram LCP acima da meta com TBT praticamente zero e CLS zero no mobile; o caminho de carga e renderização inicial continua sendo a pendência. Esse desenho é exigido pela demonstração, mas isso não elimina o requisito de desempenho.

Antecipar amplamente os módulos, carregar o renderer estaticamente e separar abas/recomendações do detalhe pioraram as sondagens, por isso essas variações foram removidas. O renderer atual carrega em paralelo aos providers/mocks; isso exige o transporte Socket.IO isolado após a montagem. Não foram desligados throttling, mocks, Socket.IO, validação ou medidas de segurança para melhorar a pontuação. Uma próxima intervenção deve comparar o caminho crítico e a distribuição dos chunks com a mesma coleta de três execuções. O resultado publicado ainda precisa ser medido; CDN, compressão e HTTP/2 podem alterar os tempos, sem garantia de aprovação.

## Reproduzir e inspecionar

Execute pnpm build e depois pnpm lighthouse, com a porta 4173 livre. O script inicia e encerra o próprio preview. Usa CHROME_PATH ou o Chromium já instalado pelo Playwright, sem baixar navegador pelo Puppeteer. Configurações em lighthouse/lighthouserc.desktop.json e lighthouse/lighthouserc.mobile.json. KURIO_LH_BASE_URL permite informar a futura URL pública; KURIO_LH_REPORT_DIR permite outro destino de artefatos.

[Resumo JSON](../reports/lighthouse/summary.json) contém versões, ambiente, URL, hash do HTML do build e resultados. Os doze relatórios HTML/JSON estão nas pastas [desktop/home](../reports/lighthouse/desktop/home/), [desktop/detail](../reports/lighthouse/desktop/detail/), [mobile/home](../reports/lighthouse/mobile/home/) e [mobile/detail](../reports/lighthouse/mobile/detail/), numerados run-1 a run-3.

Ambiente: Node v24.12.0, Lighthouse 12.6.1, LHCI 0.15.1, Chrome 156, darwin/arm64. Mobile usa o perfil padrão simulado do Lighthouse; desktop usa preset desktop. Métricas são medianas independentes e não precisam pertencer ao mesmo run.

[Consultas e persistência](DATA-PERFORMANCE.md) e [segurança](SECURITY-REVIEW.md) têm resultados separados. Os dois advisories dev de extract-zip continuam registrados, sem esconder a falha do audit completo.
