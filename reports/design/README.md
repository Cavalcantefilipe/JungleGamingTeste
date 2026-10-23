# Evidências da conferência visual

23/10/2026. [Revisão tela por tela](../../docs/SCREEN-REVIEW.md) e [nova exportação SVG com medidas](source-manifest.json). Referências PNG exportadas diretamente do Figma e capturas reais da aplicação em desktop 1440 × 900 e mobile 414 × 896 e 320 × 844. PNGs preservados sem redimensionamento ou compressão com perda. [Manifesto e hashes](manifest.json).

As páginas desktop são capturas completas; login/cadastro desktop começam em y=160 conforme o Figma; o recibo se centraliza na viewport e possui rolagem quando necessário. As capturas mobile mostram o viewport do frame original. Não inferir igualdade de altura entre artboard e página dinâmica. Foco transitório e rolagem foram neutralizados, fontes/imagens carregadas. Usuário, carteiras, edições e pedidos vêm da API MSW; nomes e quantidades da amostra estão no manifesto.

São 15 referências originais e 30 estados da aplicação. Não há referência mobile de perfil, carteiras ou recibo no arquivo. O carrinho desktop soma 26,846 ETH com taxa; o mobile soma 8,156 ETH, corrigindo a soma inconsistente do Figma. [Ajustes e diferenças documentadas](../../docs/SCREEN-REVIEW.md).

| Perfil | Tela | Referência | Implementação |
| --- | --- | --- | --- |
| desktop | Início | [Figma](desktop/reference/home.png) | [Aplicação](desktop/actual/home.png) |
| desktop | Detalhes do NFT | [Figma](desktop/reference/detail.png) | [Aplicação](desktop/actual/detail.png) |
| desktop | Carrinho de NFTs | [Figma](desktop/reference/cart.png) | [Aplicação](desktop/actual/cart.png) |
| desktop | Pagamento | [Figma](desktop/reference/payment.png) | [Aplicação](desktop/actual/payment.png) |
| desktop | Login | [Figma](desktop/reference/login.png) | [Aplicação](desktop/actual/login.png) |
| desktop | Cadastro | [Figma](desktop/reference/register.png) | [Aplicação](desktop/actual/register.png) |
| desktop | Perfil do Colecionador | [Figma](desktop/reference/profile.png) | [Aplicação](desktop/actual/profile.png) |
| desktop | Carteiras | [Figma](desktop/reference/wallets.png) | [Aplicação](desktop/actual/wallets.png) |
| desktop | Confirmação de Pedido | [Figma](desktop/reference/receipt.png) | [Aplicação](desktop/actual/receipt.png) |
| mobile | Início | [Figma](mobile/reference/home.png) | [Aplicação](mobile/actual/home.png) |
| mobile | Detalhes do NFT | [Figma](mobile/reference/detail.png) | [Aplicação](mobile/actual/detail.png) |
| mobile | Carrinho de NFTs | [Figma](mobile/reference/cart.png) | [Aplicação](mobile/actual/cart.png) |
| mobile | Pagamento | [Figma](mobile/reference/payment.png) | [Aplicação](mobile/actual/payment.png) |
| mobile | Login | [Figma](mobile/reference/login.png) | [Aplicação](mobile/actual/login.png) |
| mobile | Cadastro | [Figma](mobile/reference/register.png) | [Aplicação](mobile/actual/register.png) |
| mobile | Perfil do Colecionador | Sem frame equivalente | [Aplicação](mobile/actual/profile.png) |
| mobile | Carteiras | Sem frame equivalente | [Aplicação](mobile/actual/wallets.png) |
| mobile | Confirmação de Pedido | Sem frame equivalente | [Aplicação](mobile/actual/receipt.png) |


## Telas estreitas — 320 × 844

Capturas atualizadas após a revisão tela por tela, incluindo estrelas/favorito, galeria, abas, formulários, navegação, rodapé e checkout. O commit e o hash do build estão no manifesto. A matriz automatizada também percorreu 360, 375 e 390 px. O Figma fornece o frame mobile de 414 px; as adaptações menores preservam o conteúdo com quebra de linha e crescimento vertical.

| Tela | Implementação em 320 px |
| --- | --- |
| Início | [Captura](mobile-320/actual/home.png) |
| Detalhe | [Captura](mobile-320/actual/detail.png) |
| Carrinho | [Captura](mobile-320/actual/cart.png) |
| Login | [Captura](mobile-320/actual/login.png) |
| Cadastro | [Captura](mobile-320/actual/register.png) |
| Perfil | [Captura](mobile-320/actual/profile.png) |
| Carteiras | [Captura](mobile-320/actual/wallets.png) |
| Pagamento | [Captura](mobile-320/actual/payment.png) |
| Recibo | [Captura](mobile-320/actual/receipt.png) |

[Camadas e hashes dos ícones originais](icons.json). O manifesto registra os resultados da suíte completa sobre o código atual e da verificação pública. As medições Lighthouse anteriores não foram atribuídas a este build.


## Rota apontada na revisão — `/nfts/nft-002`

- [Desktop](desktop/actual/detail-002.png)
- [Mobile 414 px](mobile/actual/detail-002.png)
- [Mobile 320 px](mobile-320/actual/detail-002.png)

[Erros corrigidos e diferenças explícitas](../../docs/DETAIL-REVIEW.md). Os dados de Sage Nomad permanecem próprios desse NFT; a referência do componente usa Emerald Ape.

## Verificação da publicação

As capturas abaixo vêm diretamente da Railway, no deployment `d211ea55-5de4-4287-bd7e-401768073679`, com o código `242294b`. Foram confirmados o carregamento dos SVGs, a ausência de overflow e a correspondência do HTML com o build local. São duas capturas adicionais aos 30 estados locais.

- [Detalhe desktop publicado](public/detail-002-desktop.png)
- [Detalhe mobile publicado](public/detail-002-mobile.png)
