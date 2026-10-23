# Pendências e estimativa de avaliação

23/10/2026. Leitura do [README](../README.md), [enunciado](CHALLENGE.md), documentação e evidências locais. A distribuição de pontos vem da seção 11 do enunciado; os descontos abaixo são estimativa do executor, sem nota oficial ou garantia de aprovação.

## Estimativa técnica: 88/100

Faixa plausível: **84–92**, dependendo do rigor da comparação visual e da avaliação manual. Esta é uma estimativa do código e das evidências locais. A entrega obrigatória está incompleta sem repositório acessível e URL pública; não se deve apresentar 88 como nota de uma entrega já aceita.

| Critério                           |  Máximo | Estimativa | Fundamentação                                                                                                                                   |
| ---------------------------------- | ------: | ---------: | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Fidelidade visual e responsividade |      20 |         16 | Assets originais, medidas e testes nos tamanhos exigidos; adaptações documentadas e ausência de comprovação de igualdade pixel a pixel.         |
| Fluxos e experiência               |      20 |         19 | Fluxos de compra/conta, falhas, recuperação e revisão de carteira testados. Avaliação manual ainda pode encontrar detalhes.                     |
| Integração e estado                |      15 |         14 | URL, Query/Axios/Zod, isolamento, cancelamento e respostas/eventos concorrentes exercitados.                                                    |
| Tempo real                         |      10 |          9 | Socket.IO efetivo, versões, reconexão e reconciliação; execução pública ainda não validada.                                                     |
| Mocking                            |      10 |         10 | MSW persistente, reset, cenários reproduzíveis e estado coerente. Console atende à configuração; painel gráfico não é obrigatório no enunciado. |
| Testes                             |      10 |          9 | Cenários exigidos em desktop/mobile, baselines e clone anterior validado; há limites de cobertura e nova correção posterior ao clone.           |
| Acessibilidade                     |       5 |          4 | Teclado/foco/labels/axe/reflow; não houve certificação com tecnologias assistivas nem teste real de zoom 200%.                                  |
| Performance                        |       5 |          3 | Última medição: desktop 99/99, mobile 89/88; demais categorias 100. Metas mobile não atingidas.                                                 |
| Arquitetura e documentação         |       5 |          4 | Contratos, cenários, cache, segurança e limitações documentados; URL/entrega pública pendentes e warnings de tamanho de funções.                |
| **Total**                          | **100** |     **88** | Estimativa condicionada às evidências descritas, não rubrica oficial de descontos.                                                              |

## O que falta

1. **Publicação obrigatória:** autorização para criar/push do GitHub e login/importação no Vercel conforme `CLAUDE.md`. Registrar links no README e confirmar que o commit publicado corresponde ao entregue.
2. **Verificação pública:** acesso direto/refresh de rotas, redirect de checkout, cenários, service worker, Socket.IO, console e headers. Lighthouse público é informativo e ainda está pendente.
3. **Performance mobile ≥90:** a última coleta ficou em 89 na Home e 88 no detalhe. Os resultados foram justificados como permite a seção 10, mas a meta continua aberta. Nova medição será necessária para atribuir notas ao build posterior à correção de carteira.
4. **Fechamento visual:** conferir diferenças remanescentes diretamente contra o Figma. Baselines internas aprovadas não demonstram ausência absoluta de diferenças; preservar adaptações de acessibilidade e controles exigidos pelo enunciado.
5. **Cadeia de desenvolvimento:** resolver ou substituir a dependência com os dois advisories altos de `extract-zip` registrados na auditoria. Não há nova consulta ao registro nesta atualização; a consulta anterior não encontrava versão corrigida publicada. Não são alertas do bundle de produção.

## Eliminatórios

Há evidências locais para uso efetivo da stack, fluxos funcionais, confirmação autoritativa, isolamento entre contas, eventos via Socket.IO e E2E executável. O clone limpo anterior (`52bdb86`) passou instalação/check/build/E2E. A correção de carteira é posterior; seus gates estão em [BEHAVIOR-REVIEW.md](BEHAVIOR-REVIEW.md). A validação no ambiente publicado permanece aberta.

O enunciado pede APIs, autenticação, carteiras e pagamento **simulados**. A ausência de backend financeiro real está de acordo com esse escopo. Ela limita as garantias de produção descritas em [SECURITY-REVIEW.md](SECURITY-REVIEW.md); não representa, por si só, item faltante do desafio. Páginas editoriais, suporte, ofertas, blockchain e login social real também estão fora do escopo.
