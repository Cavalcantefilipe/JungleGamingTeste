# Pendências e estimativa de avaliação

23/10/2026. Critérios da seção 11 do [enunciado](CHALLENGE.md), confrontados com o [relatório vigente](QUALITY-REVIEW.md). A estimativa é do executor; os descontos não são uma rubrica oficial nem garantia de aprovação.

## Estimativa técnica: 94/100

Faixa plausível: **90–96**, conforme rigor estético e avaliação manual. A estimativa anterior de 89 ficou desatualizada: referia-se a performance pública antiga, ausência de zoom real e avisos de tamanho ainda abertos. Esses pontos receberam medição, correções e evidências novas.

| Critério                           |  Máximo | Estimativa | Evidência e limite                                                                                                                     |
| ---------------------------------- | ------: | ---------: | -------------------------------------------------------------------------------------------------------------------------------------- |
| Fidelidade visual e responsividade |      20 |         18 | 15 frames originais, 30 capturas, matriz mobile e correção em 640–767 px; sem alegar igualdade absoluta de pixels.                     |
| Fluxos e experiência               |      20 |         19 | Compra, conta, erros e recuperação testados localmente e na URL pública.                                                               |
| Integração e estado                |      15 |         14 | URL/Query/Axios/Zod, sessão e reconciliação; limitações do mock documentadas.                                                          |
| Tempo real                         |      10 |          9 | Socket.IO efetivo, reconexão, ordenação e recuperação de pedidos.                                                                      |
| Mocking                            |      10 |         10 | Cenários, reset, persistência, autoridade de compra e reserva de estoque testados.                                                     |
| Testes                             |      10 |         10 | 115 unitários, 6 de ferramentas, Chromium completo e revalidações; Firefox/WebKit e 8 E2E públicos. Falhas intermediárias preservadas. |
| Acessibilidade                     |       5 |          4 | Axe, teclado/foco e zoom nativo 200% em nove estados; VoiceOver inconclusivo.                                                          |
| Performance                        |       5 |          5 | Quatro combinações públicas dentro das metas, 12 runs e dados brutos versionados.                                                      |
| Arquitetura e documentação         |       5 |          5 | Componentes/hooks separados, lint sem avisos, relatório vigente único e histórico preservado.                                          |
| **Total**                          | **100** |     **94** | Estimativa sujeita ao avaliador.                                                                                                       |

## O que ainda depende de validação

1. **Leitor de tela:** VoiceOver não se manteve ativo; a fala não foi validada. Deve ser conferido em uma sessão funcional de tecnologia assistiva.
2. **Dispositivos reais:** WebKit automatizado amplia a cobertura, mas não substitui Safari em iPhone físico e teclado virtual real.
3. **Aprovação estética:** adaptações estão em [DESIGN-REVIEW.md](DESIGN-REVIEW.md). Testes e medidas não garantem concordância estética do avaliador.

O LCP mobile medido continua acima de 2,5 s, embora a pontuação exigida tenha sido alcançada. A consulta de dependências está zerada no checkpoint; futuros advisories exigem nova consulta.

## Escopo e eliminatórios

Há evidência de uso efetivo da stack, fluxos funcionais, confirmação autoritativa da simulação, isolamento entre contas, Socket.IO e E2E executável. Repositório público e Railway estão acessíveis; o código publicado foi identificado e verificado. O teste de 5 + 7 para estoque 10 cobre ambas as ordens de commit e liberação após recusa no mesmo runtime.

O desafio exige APIs, carteiras e pagamentos simulados. Backend financeiro, banco compartilhado, blockchain, login social real e páginas editoriais completas permanecem fora desse escopo; sua ausência não é tratada como item faltante do desafio. A simulação não é indicada para transações ou dados reais.
