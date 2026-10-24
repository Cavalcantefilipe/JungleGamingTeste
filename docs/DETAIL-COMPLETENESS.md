# Complemento da página de detalhes — 24/10/2026

A revisão anterior deixou passar dois comportamentos apontados pelo usuário em `/nfts/nft-004`: o carrossel não avançava sozinho nem tinha pontos, e a aba de avaliações mostrava apenas a média. O teste anterior verificava a existência da aba, mas não comentários ou navegação. Este complemento corrige essas lacunas e amplia as verificações.

## Conferência e correções

Referências: Figma `Ff0SksUi7UFtPWUO8kyNtw`, desktop `10:244` e mobile `15:5536`, exportações em `reports/design/`. O frame desktop foi reconferido no Figma. A imagem original mostra cinco cartões, indicadores contornados e as informações detalhadas. O avanço automático foi especificado pelo usuário; a aba aberta de avaliações não possui conteúdo no frame exportado.

- **Carrossel compartilhado:** `NftCarousel` atende detalhe e carrinho. Avança a cada cinco segundos, volta ao início, possui pontos/setas e ampliação no hover/foco. O detalhe agora consulta até 15 relacionados da mesma coleção, excluindo o NFT atual; antes só renderizava cinco.
- **Interação acessível:** pausa manual, em hover/foco, fora da tela e com aba oculta; movimento reduzido impede avanço automático. Pontos têm contorno e áreas de toque de 44 px. Em larguras pequenas podem quebrar linha para preservar as áreas de toque.
- **Avaliações:** comentários, autor, nota, edição e data vêm de REST/MSW, com quatro por página, carregamento, erro/retry e vazio. Contagem e média são coerentes com o resumo. São dados fictícios, identificados na interface.
- **Navegação:** aba e página de avaliações persistem na URL (`tab=reviews&reviewPage=2`). Refresh e histórico preservam a seleção. Consultas de avaliações usam um namespace separado do catálogo para não serem canceladas por atualizações de preço.
- **Metadados:** descrição extensa, procedência/IPFS, contrato/padrão e direitos autorais passam a vir do contrato. Resumo, rede e coleção agora são coerentes para cada NFT; `nft-004` é Polygon/Kurio Apes. A demonstração não declara verificação real de blockchain. Os rótulos de contrato e direitos autorais têm a semântica correta, embora apareçam invertidos na referência.
- **Dados já salvos:** migração editorial 3 aceita registros antigos sem `details` e preserva contas, carrinhos, pedidos, preços/versões e estoque. A atualização anterior de imagens continua compatível.
- **Recuperação:** a consulta de relacionados mostra skeleton e erro com nova tentativa, em vez de desaparecer durante carregamento/falha.

## Revisão e testes

O agente `code-reviewer` apontou as lacunas de metadados e os riscos de cancelamento de avaliações e perda de paginação. Todos foram corrigidos; a revisão final do delta não encontrou novos bloqueadores.

Os testes iniciais reproduziram quatro falhas no navegador e duas na migração antes da implementação. Resultados finais locais sobre o build desta correção:

| Verificação                                                    | Resultado                                                                          |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `pnpm check`                                                   | Tipos, lint sem avisos, formato, 124 testes unitários e 6 de ferramentas aprovados |
| `pnpm build`                                                   | Aprovado                                                                           |
| Chromium completo (1440×900 e 390×844, mais matriz 320–414 px) | 279 aprovados, 33 não aplicáveis ao viewport                                       |
| Firefox desktop/WebKit mobile — novos cenários `27`            | 17 aprovados, 1 não aplicável (carrossel do carrinho no mobile)                    |
| Revisão de código e `git diff --check`                         | Sem bloqueadores pendentes                                                         |

[Log Chromium](../reports/detail-completeness/chromium.txt), [compatibilidade](../reports/detail-completeness/compatibility.txt) e [check](../reports/detail-completeness/check.txt). O preview usa a porta dedicada 4189.

A primeira execução integral expôs expectativas antigas de cinco cartões, parâmetros padrão acrescentados ao retorno do login e conflito entre diretórios de traces de execuções simultâneas. A cobertura mobile passou a percorrer todos os pontos; parâmetros padrão são removidos da URL; compatibilidade grava artefatos em diretório próprio. A execução final completa acima passou sem atualizar imagens.

As baselines do detalhe foram atualizadas após inspeção da composição com o Figma. As novas capturas do painel de avaliações foram inspecionadas em desktop e mobile; as baselines de início, carrinho e pagamento continuaram passando.

A publicação automática acompanha `main`. A confirmação do commit/deployment e os testes na URL pública são realizados após o push; os números acima descrevem a validação local, não uma publicação ainda não verificada.

Capturas de regressão revisadas visualmente:

- [Detalhe desktop](../e2e/__screenshots__/13-visual.spec.ts/detail-desktop-chromium.png)
- [Detalhe mobile](../e2e/__screenshots__/13-visual.spec.ts/detail-mobile-chromium.png)
- [Avaliações desktop](../e2e/__screenshots__/13-visual.spec.ts/reviews-desktop-chromium.png)
- [Avaliações mobile](../e2e/__screenshots__/13-visual.spec.ts/reviews-mobile-chromium.png)

Não se atribuem as medições Lighthouse da reconciliação anterior a este complemento.
