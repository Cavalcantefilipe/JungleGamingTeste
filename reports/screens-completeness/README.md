# Revisão de completude das telas

Índice de 45 capturas da [aplicação pública](https://kurio-production-8274.up.railway.app): nove telas em cinco larguras. O código das capturas é `0063435`, que inclui o ajuste do cadastro em 320 px. O ajuste posterior `d77c09a` completa os placeholders durante o carregamento do detalhe; preserva a composição das telas carregadas registrada aqui.

O [manifesto das capturas finais](public-after.json) registra o endereço, a data, a identificação do deploy e do commit, as observações por tela, as dimensões e os hashes dos arquivos. A [análise da revisão](../../docs/SCREENS-COMPLETENESS.md) reúne as falhas, correções e resultados.

## Estado das verificações

- **Railway `369f9ee`:** suíte Chromium completa com 333 aprovações, 37 exclusões explícitas e nenhuma falha. O [deployment dessa suíte](full-suite-deployment.json) e o [log público](public-chromium.txt) identificam essa rodada.
- **Delta de busca `9fd3739`, enviado à `main`:** `pnpm check` e build aprovados, com 138 unitários e 16 testes de ferramentas. Corrige espaços apagados em “Cosmic Bloom” e anúncio indevido de `CancelledError`; quatro falhas públicas reproduzidas, 16 E2E locais, 32 E2E públicos e quatro unitários aprovados. O check consolidado inclui ainda o ajuste de concordância `4185cbb`, com três testes de mensagem. [Evidências da busca](../search-typing/).
- **Histórico das capturas `0063435`:** 45 imagens preservadas; a etapa correspondente registrou 126 unitários, seis testes de ferramentas e 314 testes públicos aprovados, com 34 exclusões por viewport. As imagens não foram recapturadas para os commits posteriores.
- **Limite de imagens em Firefox/WebKit:** 18 casos de falha injetada via `context.route` foram excluídos por intermediação do MSW; dois casos verificaram a preservação de foto saudável offline/online. No Chromium, a rodada focal de recuperação teve 18 aprovações e duas exclusões por viewport. [Logs](image-resilience/).
- **Conferência manual concluída:** conta criada, validações, perfil/avatar, carteiras, favoritos, avaliações, login/logout, carrinho, cupons, checkout e recibo persistente. [Percurso, screenshots e limites](../ui-account-test/README.md).

- **Lighthouse final `4185cbb`:** 99/100 desktop e 93/92 mobile; demais categorias 100. Doze execuções válidas no Headless Shell 156.0.8078.4, após tentativas interrompidas por crashes do Chrome for Testing. [Método e limites](../../docs/LIGHTHOUSE.md).

A suíte pública completa de `369f9ee` antecede o delta de busca. Os resultados e as capturas devem ser lidos com seus respectivos commits.

## Capturas públicas

As larguras estão em pixels. Login e cadastro mostram o viewport; as demais imagens mostram a página completa.

| Tela | 1440 | 768 | 414 | 390 | 320 |
| --- | --- | --- | --- | --- | --- |
| Início | [Abrir](public/1440/home.webp) | [Abrir](public/768/home.webp) | [Abrir](public/414/home.webp) | [Abrir](public/390/home.webp) | [Abrir](public/320/home.webp) |
| Detalhe do NFT | [Abrir](public/1440/detail.webp) | [Abrir](public/768/detail.webp) | [Abrir](public/414/detail.webp) | [Abrir](public/390/detail.webp) | [Abrir](public/320/detail.webp) |
| Carrinho | [Abrir](public/1440/cart.webp) | [Abrir](public/768/cart.webp) | [Abrir](public/414/cart.webp) | [Abrir](public/390/cart.webp) | [Abrir](public/320/cart.webp) |
| Login | [Abrir](public/1440/login.webp) | [Abrir](public/768/login.webp) | [Abrir](public/414/login.webp) | [Abrir](public/390/login.webp) | [Abrir](public/320/login.webp) |
| Cadastro | [Abrir](public/1440/register.webp) | [Abrir](public/768/register.webp) | [Abrir](public/414/register.webp) | [Abrir](public/390/register.webp) | [Abrir](public/320/register.webp) |
| Perfil | [Abrir](public/1440/profile.webp) | [Abrir](public/768/profile.webp) | [Abrir](public/414/profile.webp) | [Abrir](public/390/profile.webp) | [Abrir](public/320/profile.webp) |
| Carteiras | [Abrir](public/1440/wallets.webp) | [Abrir](public/768/wallets.webp) | [Abrir](public/414/wallets.webp) | [Abrir](public/390/wallets.webp) | [Abrir](public/320/wallets.webp) |
| Pagamento | [Abrir](public/1440/payment.webp) | [Abrir](public/768/payment.webp) | [Abrir](public/414/payment.webp) | [Abrir](public/390/payment.webp) | [Abrir](public/320/payment.webp) |
| Recibo | [Abrir](public/1440/receipt.webp) | [Abrir](public/768/receipt.webp) | [Abrir](public/414/receipt.webp) | [Abrir](public/390/receipt.webp) | [Abrir](public/320/receipt.webp) |

## Referências do Figma

Foram usadas as nove [referências desktop](../design/desktop/reference/) e as seis [referências mobile](../design/mobile/reference/), junto às [especificações extraídas](../design/specifications/). As referências mobile cobrem início, detalhe, carrinho, login, cadastro e pagamento. Perfil, carteiras e recibo em mobile são adaptações responsivas dos respectivos layouts desktop; não possuem um frame mobile original para comparação direta. A largura de 768 px também exige adaptação entre os layouts fornecidos.

## Condições de captura

- Chromium com contexto isolado por largura, sem compartilhar sessão ou armazenamento entre larguras. As nove telas de cada contexto percorrem o mesmo fluxo, preservando seu carrinho e sessão.
- Cenário padrão do MSW, relógio real e preferência por movimento reduzido. Fontes, imagens e rede são aguardadas antes da captura; animações são desativadas no screenshot.
- Viewports: 1440 × 900, 768 × 900, 414 × 896, 390 × 844 e 320 × 844.
- Detalhe de `nft-004`; a compra parte desse NFT. Perfil e carteiras usam a conta fictícia Ana. O pagamento é capturado após revisão da cotação e conexão simulada da carteira; o recibo, após a confirmação simulada do pedido.
- Os PNGs são convertidos para WebP sem perdas, nas dimensões originais, para reduzir o tamanho dos arquivos versionados.
- Login e cadastro usam captura de viewport para avaliar se o conteúdo cabe na tela. As demais telas usam `fullPage` para registrar também as seções abaixo da dobra.

Elementos com posição fixa, como a navegação mobile, aparecem ancorados ao viewport durante uma captura `fullPage`. Sua posição dentro da imagem longa não representa uma rolagem real por toda a página; a captura estática deve ser complementada pelos testes de navegação, foco e acesso aos controles.

## Logs e verificações

Cada log corresponde à sua execução. A auditoria inicial e parte das validações locais antecedem o ajuste compacto de `0063435`; o manifesto final identifica o deploy efetivamente capturado.

| Evidência | Arquivo |
| --- | --- |
| Observações públicas anteriores às correções | [public-before.json](public-before.json) |
| Manifesto e observações das capturas finais | [public-after.json](public-after.json) |
| Check após o delta de busca: 138 unitários e 16 testes de ferramentas | [check.txt](check.txt) |
| Build após o delta de busca | [build.txt](../code-standards/build.txt) |
| Falhas reproduzidas e regressões da busca | [search-typing](../search-typing/) |
| Diagnóstico, comparação e limites de startup | [startup-analysis.md](startup-analysis.md) |
| Recuperação de imagens e limites de compatibilidade | [image-resilience](image-resilience/) |
| Suíte Chromium local | [chromium.txt](chromium.txt) |
| Compatibilidade dos novos fluxos | [compatibility.txt](compatibility.txt) |
| Validação pública anterior ao ajuste compacto | [public-before-compact-fix.txt](public-before-compact-fix.txt) |
| Regressão de 320 px antes da correção | [compact-red.txt](compact-red.txt) |
| Validação local do ajuste de 320 px | [compact-local.txt](compact-local.txt) |
| Compatibilidade do ajuste de 320 px | [compact-compatibility.txt](compact-compatibility.txt) |
| Suíte Chromium pública de `369f9ee`: 333 aprovados, 37 exclusões | [public-chromium.txt](public-chromium.txt) |
| Suíte pública anterior ao ajuste de loading | [public-chromium-before-loading-fix.txt](public-chromium-before-loading-fix.txt) |
| Testes locais do loading | [loading-local.txt](loading-local.txt) |
| Observação local de layout durante carregamento | [loading-observation.json](loading-observation.json) |
| Loading no Railway: captura durante/depois e medição | [loading-public](loading-public/) |
| Screenshot, contexto e trace da falha de loading | [loading-red](loading-red/) |
| Verificação HTTP do deploy | [deployment-http.txt](deployment-http.txt) |
| Deployment, commit e hash do HTML | [deployment.json](deployment.json) |
| Deployment das 45 capturas | [captured-deployment.json](captured-deployment.json) |
| Resumo Lighthouse final — 12 válidas, metas atendidas | [lighthouse/summary.json](lighthouse/summary.json) |
| Lighthouse anterior à correção do loading | [lighthouse-before-loading-fix/summary.json](lighthouse-before-loading-fix/summary.json) |
