# Pendências e estimativa de avaliação

23/10/2026. Leitura do [README](../README.md), [enunciado](CHALLENGE.md), documentação e evidências locais. A distribuição de pontos vem da seção 11 do enunciado; os descontos abaixo são estimativa do executor, sem nota oficial ou garantia de aprovação.

## Estimativa técnica: 89/100

Faixa plausível: **85–93**, dependendo do rigor da comparação visual, da performance pública e da avaliação manual. O [repositório público](https://github.com/Cavalcantefilipe/JungleGamingTeste) e a [aplicação Railway](https://kurio-production-8274.up.railway.app) estão acessíveis e foram verificados. A estimativa anterior de 90 foi reduzida em um ponto após a mediana pública de detalhe mobile ficar em 88; esta não é nota oficial nem garantia de aceitação.

| Critério                           |  Máximo | Estimativa | Fundamentação                                                                                                                                                   |
| ---------------------------------- | ------: | ---------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fidelidade visual e responsividade |      20 |         16 | 15 frames originais exportados e 18 capturas conferidas; ajustes de tipografia/medidas e adaptações documentadas. Sem alegação de igualdade absoluta de pixels. |
| Fluxos e experiência               |      20 |         19 | Fluxos de compra/conta, falhas, recuperação e revisão de carteira testados. Avaliação manual ainda pode encontrar detalhes.                                     |
| Integração e estado                |      15 |         14 | URL, Query/Axios/Zod, isolamento, cancelamento e respostas/eventos concorrentes exercitados.                                                                    |
| Tempo real                         |      10 |          9 | Socket.IO efetivo, versões, reconexão e reconciliação; atualização de preço sem REST validada também no domínio público.                                        |
| Mocking                            |      10 |         10 | MSW persistente, reset, cenários reproduzíveis e estado coerente. Console atende à configuração; painel gráfico não é obrigatório no enunciado.                 |
| Testes                             |      10 |          9 | Cenários exigidos, baselines e clone atual 87e20f0 validados com 210 E2E/10 skips; cobertura automática tem limites.                                            |
| Acessibilidade                     |       5 |          4 | Teclado/foco/labels/axe/reflow; não houve certificação com tecnologias assistivas nem teste real de zoom 200%.                                                  |
| Performance                        |       5 |          4 | Local: 99/99 desktop, 91/92 mobile. Railway: 97/99 e 94/88; detalhe mobile abaixo da meta. Demais categorias 100; runs e limites preservados.                   |
| Arquitetura e documentação         |       5 |          4 | Contratos, cenários, cache, segurança, limites e publicação documentados; permanecem warnings de tamanho de funções.                                            |
| **Total**                          | **100** |     **89** | Estimativa condicionada às evidências descritas, não rubrica oficial de descontos.                                                                              |

## O que falta

1. **Performance pública do detalhe mobile:** mediana 88/100, abaixo de 90; runs 92/88/86 e saída 1 preservados. O Speed Index variou, enquanto LCP ficou próximo de 2,72 s. Exige investigação para prometer a meta também no domínio público; [medição](LIGHTHOUSE.md).
2. **Avaliação manual:** acessibilidade com tecnologias assistivas, zoom real e comparação estética final não são certificadas pelos testes automáticos.
3. **Diferenças do desenho:** estão identificadas em [DESIGN-REVIEW.md](DESIGN-REVIEW.md): áreas de toque, catálogo/dados canônicos, controles funcionais de compra e textos/ícones. A conferência de todas as telas está documentada; aprovação estética final continua dependendo do avaliador.

## Itens encerrados nesta rodada

- Repositório público criado com autorização do usuário e histórico de commits preservado na branch `main`; aplicação publicada na Railway e links registrados no README. Headers/rotas/cache/worker/healthcheck, 16 E2E públicos e smoke desktop/mobile passaram; [evidências](DEPLOYMENT.md).
- Meta de performance local alcançada: 99/99 desktop e 91/92 mobile, com as outras categorias em 100. [Coleta e limites](LIGHTHOUSE.md).
- Dois advisories altos de desenvolvimento resolvidos, sem ignores: Lighthouse 13.5.0 nativo removeu a cadeia de `extract-zip`. Audits completo/de produção: zero.
- Suíte atual: 109 unitários + 6 testes Node, 210 E2E/10 skips explícitos e build válido. [Gates](TESTING.md).
- Assets originais preservados e evidência de cada uma das nove telas desktop/seis mobile exportadas. [Referências e capturas](../reports/design/README.md).

## Eliminatórios

Há evidências locais para uso efetivo da stack, fluxos funcionais, confirmação autoritativa, isolamento entre contas, eventos via Socket.IO e E2E executável. O clone limpo atual (`87e20f0`) passou instalação frozen/check (109 + 6)/build, 210 E2E/10 skips e 12 auditorias Lighthouse com saída 0. Os gates da correção de carteira estão em [BEHAVIOR-REVIEW.md](BEHAVIOR-REVIEW.md). A URL Railway passou pelos checks HTTP e pelos fluxos públicos descritos em [DEPLOYMENT.md](DEPLOYMENT.md). A limitação quantitativa de performance pública está registrada acima.

O enunciado pede APIs, autenticação, carteiras e pagamento **simulados**. A ausência de backend financeiro real está de acordo com esse escopo. Ela limita as garantias de produção descritas em [SECURITY-REVIEW.md](SECURITY-REVIEW.md); não representa, por si só, item faltante do desafio. Páginas editoriais, suporte, ofertas, blockchain e login social real também estão fora do escopo.
