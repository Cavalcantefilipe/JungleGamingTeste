# Lighthouse e desempenho

Coleta de **2026-10-23T14:26:29.502Z**, build de produção em clone limpo de `87e20f0` (aplicação de `8b314b1`). Cenário default, perfil limpo por execução, três execuções por página/perfil e mediana independente por categoria/métrica. Sem testes, builds ou uso de navegador simultâneos. Não representa medição em celular físico nem produção publicada.

## Resultados atuais

| Perfil  | Página | Performance | Acessibilidade | Boas práticas | SEO |     LCP |    CLS |   TBT |
| ------- | ------ | ----------: | -------------: | ------------: | --: | ------: | -----: | ----: |
| desktop | home   |          99 |            100 |           100 | 100 |  896 ms | 0.0122 |  0 ms |
| desktop | detail |          99 |            100 |           100 | 100 |  852 ms | 0.0623 |  0 ms |
| mobile  | home   |          91 |            100 |           100 | 100 | 3363 ms | 0.0000 | 58 ms |
| mobile  | detail |          92 |            100 |           100 | 100 | 3415 ms | 0.0000 | 50 ms |

Metas preservadas: **Performance ≥90, Acessibilidade ≥95, Boas práticas ≥95, SEO ≥90. Todas as quatro combinações passaram; `pnpm lighthouse` terminou com código 0.** Mobile teve Home 91/91/91 e detalhe 92/92/91, sem escolher a melhor execução para o resumo.

## O que mudou

- CLI nativa **Lighthouse 13.5.0** substitui LHCI 0.15.1/Lighthouse 12.6.1. A migração removeu o downloader com os dois advisories altos de `extract-zip`; audit completo e de produção retornaram zero. As configurações mantêm as mesmas URLs, três execuções, perfis e limites.
- O build gera variantes Brotli de HTML, JS, CSS e SVG. O preview negocia `Accept-Encoding`, conserva o conteúdo original para clientes sem Brotli, revalida HTML/worker e reconhece arquivos de um novo build. Isso é comportamento normal do preview, não uma opção exclusiva da auditoria.
- O chunk MSW de 330.832 bytes permaneceu com o mesmo hash. Nos relatórios de rede do Lighthouse 13, sua transferência passou de **108.723 para 90.216 bytes**, cerca de **17% menos**, incluindo headers. O arquivo Brotli mede 89.860 bytes. O backend simulado, contratos, autenticação e Socket.IO continuam ativos.
- As otimizações anteriores permanecem: AVIF/WebP 400/800 px, sizes e dimensões reservadas; fonte local; divisão de rotas; renderer/providers/mocks em paralelo; importação do transporte após o worker; feedback HTML antes do JavaScript; Zod jitless compatível com CSP.
- Testes Node verificam mediana, limites, coleta incompleta/runtime error e integridade/negociação da compressão. Erro técnico interrompe a coleta; pontuação baixa conserva saída 1. Os arquivos gerados de runs anteriores e o resumo são removidos antes da coleta. Arquivos que não pertencem à auditoria são preservados; o sexto teste Node reproduziu e corrigiu a remoção indevida de um arquivo auxiliar.

## Comparação e tentativas descartadas

O checkpoint histórico `52bdb86`, medido com Lighthouse 12.6.1, registrou desktop 99/99 e mobile 89/88. **Trocar a versão da ferramenta pode alterar pontuações**; essa diferença inteira não deve ser atribuída à compressão.

O baseline com Lighthouse 13.5.0 antes do Brotli mediu mobile **90/89**, LCP de aproximadamente **3548/3764 ms**. A coleta atual ficou em 91/92, com os LCPs da tabela. O ganho demonstrado em bytes é direto; a contribuição exata de cada ajuste visual para o tempo não foi isolada. O LCP mobile continua acima de 2,5 s, embora a meta de pontuação do desafio tenha sido atingida.

Montar a interface antes de concluir a inicialização dos mocks e antecipar os imports da rota pioraram as sondagens (Home 88 e depois 87; detalhe 86 na segunda variação). Essas alterações foram removidas. Uma tentativa inicial de Brotli não estava ativa no preview por causa do filtro de comando do plugin; foi interrompida e corrigida. Três sondagens com Puppeteer 25.16.0, incluindo a primeira coleta no clone, tiveram erro técnico `ConnectionClosedError` no cleanup e não produziram resumo aprovado. O driver foi fixado em 25.9.0, versão base da faixa `^25.9.0` declarada pelo Lighthouse. A coleta final no clone completou as doze execuções, sem esse erro, sem retry automático e sem excluir runs por pontuação. Isso comprova esta coleta; erros técnicos continuam derrubando o comando em outros ambientes. O [histórico dos checkpoints](../reports/lighthouse/checkpoints/history.json) preserva os resumos anteriores e os 11 runs completados antes da falha do clone.

Não foram desligados throttling, mocks, validação, sessão, Socket.IO ou verificações de compra para alcançar a meta.

## Reproduzir e inspecionar

```sh
pnpm build
pnpm lighthouse
```

A porta 4173 deve estar livre; o script inicia e encerra seu próprio preview. Usa `CHROME_PATH` ou o Chromium instalado pelo Playwright, sem downloader do Puppeteer. `KURIO_LH_BASE_URL` permite medir a futura URL pública; `KURIO_LH_REPORT_DIR` escolhe um diretório dedicado de relatórios. Somente `run-1` a `run-3` (HTML/JSON e temporários da CLI) e `summary.json` são regenerados a cada coleta.

[Resumo JSON](../reports/lighthouse/summary.json): ambiente, metas, URL, versões e hash do HTML. Doze pares HTML/JSON: [desktop/Home](../reports/lighthouse/desktop/home/), [desktop/detalhe](../reports/lighthouse/desktop/detail/), [mobile/Home](../reports/lighthouse/mobile/home/) e [mobile/detalhe](../reports/lighthouse/mobile/detail/), `run-1` a `run-3`.

Ambiente: Node v24.12.0, Lighthouse 13.5.0, Puppeteer Core 25.9.0, Chrome 156, darwin/arm64. Node mínimo da ferramenta: 22.19; projeto usa Node 24. Mobile usa o perfil simulado padrão; desktop usa preset desktop. As medianas de métricas diferentes podem pertencer a runs diferentes.

A publicação Vercel utiliza a compressão da própria CDN. Encoding, cache, headers, rotas, Socket.IO e Lighthouse públicos precisam ser verificados depois do deploy; nenhuma URL pública foi validada.

## Checkout limpo

Clone novo com `--no-local`, atualizado para `87e20f0`: instalação `--frozen-lockfile`, `pnpm check` (109 unitários + 6 testes Node), build e Lighthouse de 12 runs passaram. O hash do HTML é idêntico ao worktree: `dfaef3ebb60919711b779375d266655e8f08e720e62178f947735190f7d11d85`. Nenhum arquivo de código mudou pelos comandos; somente relatórios gerados. A rodada `CI=true pnpm e2e` no próprio clone final passou com **210 aprovados/10 skips explícitos em 4,7 minutos**. O preview foi iniciado pelo teste nesse diretório, sem reutilizar o servidor do worktree. O preview do usuário na porta 4175 foi restaurado ao terminar.

[Consultas/persistência](DATA-PERFORMANCE.md), [segurança](SECURITY-REVIEW.md), [testes](TESTING.md) e [Figma](DESIGN-REVIEW.md) têm evidências separadas.
