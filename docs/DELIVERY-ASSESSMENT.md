# Pendências e estimativa de avaliação

23/10/2026. Leitura do [README](../README.md), [enunciado](CHALLENGE.md), documentação e evidências locais. A distribuição de pontos vem da seção 11 do enunciado; os descontos abaixo são estimativa do executor, sem nota oficial ou garantia de aprovação.

## Estimativa técnica: 90/100

Faixa plausível: **86–94**, dependendo do rigor da comparação visual e da avaliação manual. Esta é uma estimativa do código e das evidências locais. A entrega obrigatória está incompleta sem repositório acessível e URL pública; não se deve apresentar 90 como nota de uma entrega já aceita.

| Critério                           |  Máximo | Estimativa | Fundamentação                                                                                                                                                   |
| ---------------------------------- | ------: | ---------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fidelidade visual e responsividade |      20 |         16 | 15 frames originais exportados e 18 capturas conferidas; ajustes de tipografia/medidas e adaptações documentadas. Sem alegação de igualdade absoluta de pixels. |
| Fluxos e experiência               |      20 |         19 | Fluxos de compra/conta, falhas, recuperação e revisão de carteira testados. Avaliação manual ainda pode encontrar detalhes.                                     |
| Integração e estado                |      15 |         14 | URL, Query/Axios/Zod, isolamento, cancelamento e respostas/eventos concorrentes exercitados.                                                                    |
| Tempo real                         |      10 |          9 | Socket.IO efetivo, versões, reconexão e reconciliação; execução pública ainda não validada.                                                                     |
| Mocking                            |      10 |         10 | MSW persistente, reset, cenários reproduzíveis e estado coerente. Console atende à configuração; painel gráfico não é obrigatório no enunciado.                 |
| Testes                             |      10 |          9 | Cenários exigidos, baselines e clone atual 87e20f0 validados com 210 E2E/10 skips; cobertura automática tem limites.                                            |
| Acessibilidade                     |       5 |          4 | Teclado/foco/labels/axe/reflow; não houve certificação com tecnologias assistivas nem teste real de zoom 200%.                                                  |
| Performance                        |       5 |          5 | Coleta atual: desktop 99/99, mobile 91/92; demais categorias 100. Doze runs, medianas e limites preservados.                                                    |
| Arquitetura e documentação         |       5 |          4 | Contratos, cenários, cache, segurança e limitações documentados; URL/entrega pública pendentes e warnings de tamanho de funções.                                |
| **Total**                          | **100** |     **90** | Estimativa condicionada às evidências descritas, não rubrica oficial de descontos.                                                                              |

## O que falta

1. **Publicação obrigatória:** autorização para criar/push do GitHub e login/importação no Vercel conforme `CLAUDE.md`. Registrar links no README e confirmar que o commit publicado corresponde ao entregue.
2. **Verificação pública:** acesso direto/refresh de rotas, redirect de checkout, cenários, service worker, Socket.IO, console e headers. Lighthouse público é informativo e ainda está pendente.
3. **Diferenças do desenho:** estão identificadas em [DESIGN-REVIEW.md](DESIGN-REVIEW.md): áreas de toque, catálogo/dados canônicos, controles funcionais de compra e textos/ícones. A conferência de todas as telas está documentada; aprovação estética final continua dependendo do avaliador.

## Itens encerrados nesta rodada

- Meta de performance local alcançada: 99/99 desktop e 91/92 mobile, com as outras categorias em 100. [Coleta e limites](LIGHTHOUSE.md).
- Dois advisories altos de desenvolvimento resolvidos, sem ignores: Lighthouse 13.5.0 nativo removeu a cadeia de `extract-zip`. Audits completo/de produção: zero.
- Suíte atual: 109 unitários + 6 testes Node, 210 E2E/10 skips explícitos e build válido. [Gates](TESTING.md).
- Assets originais preservados e evidência de cada uma das nove telas desktop/seis mobile exportadas. [Referências e capturas](../reports/design/README.md).

## Eliminatórios

Há evidências locais para uso efetivo da stack, fluxos funcionais, confirmação autoritativa, isolamento entre contas, eventos via Socket.IO e E2E executável. O clone limpo atual (`87e20f0`) passou instalação frozen/check (109 + 6)/build, 210 E2E/10 skips e 12 auditorias Lighthouse com saída 0. Os gates da correção de carteira estão em [BEHAVIOR-REVIEW.md](BEHAVIOR-REVIEW.md). A validação no ambiente publicado permanece aberta.

O enunciado pede APIs, autenticação, carteiras e pagamento **simulados**. A ausência de backend financeiro real está de acordo com esse escopo. Ela limita as garantias de produção descritas em [SECURITY-REVIEW.md](SECURITY-REVIEW.md); não representa, por si só, item faltante do desafio. Páginas editoriais, suporte, ofertas, blockchain e login social real também estão fora do escopo.
