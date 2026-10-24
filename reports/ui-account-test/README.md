# Teste pela interface com uma conta nova

Executado em 24/10/2026 no Chrome, na [aplicação Railway](https://kurio-production-8274.up.railway.app), usando cliques, digitação e o seletor de arquivos do navegador. O percurso começou em `369f9ee`; a busca foi repetida após a publicação de `9fd3739` e a concordância de Favoritos foi conferida em `4185cbb`. Nenhuma conta foi inserida diretamente no armazenamento e nenhuma chamada de API substituiu os passos do usuário.

## Conta de demonstração

- E-mail: `qa.interface.2410@kurio.test`.
- Senha fictícia de teste: `KurioTela!2026`.
- Usuário: `qa_interface2410`.
- Nome de exibição: `Conta Teste Interface`.
- Conta criada pelo formulário, com dados fictícios. O perfil permanece aberto na aba de teste.
- Autenticação, carteiras e pedidos são simulados pelo MSW. Os dados persistem neste navegador/origin; esta conta não é um cadastro global nem realiza transações financeiras reais.

## Percursos concluídos

| Percurso | Resultado observado |
| --- | --- |
| Cadastro vazio | Validação e foco nos campos obrigatórios. |
| Senhas diferentes | Mensagem de confirmação divergente; cadastro bloqueado. |
| Cadastro válido | Conta criada, sessão autenticada e menu identificado. |
| Perfil | Nome, ENS e apelido da carteira salvos e preservados após recarregar. |
| Avatar | Upload de `public/images/nfts/emerald-800.webp` pelo seletor de arquivos; imagem preservada após recarregar; remoção também funcionou. |
| Carteira principal | Endereço inválido rejeitado; endereço fictício válido salvo. |
| Carteira secundária | Cópia da principal, edição com outro endereço e persistência das duas carteiras após recarregar. |
| Logout e login | Saída encerrou a sessão; senha incorreta rejeitada; login correto restaurou a conta. |
| Cadastro duplicado | E-mail já cadastrado rejeitado. |
| Home | Troca de destaque preservou a imagem e alterou a arte. |
| Busca | Encontrada falha ao digitar “Cosmic Bloom”; após a correção, espaço preservado, cinco resultados e nenhum anúncio falso de falha. |
| Favoritos | Cosmic Bloom favoritado no catálogo, selecionado no detalhe e preservado após recarregar; menu Favoritos mostrou somente esse produto. |
| Galeria | Ampliação abriu a imagem; fechamento retornou ao detalhe. |
| Avaliações | Comentários carregados e paginação mudou para a página 2 com outros compradores. |
| Carrinho | Duas unidades adicionadas; redução para uma; botão “−” removeu a última e mostrou carrinho vazio; produto adicionado novamente. |
| Cupom inválido | Erro explícito e finalização desabilitada até corrigir o cupom. |
| Cupom válido | `KURIO5` aplicou desconto de 0,0645 ETH sobre 1,29 ETH; total com taxa: 1,2415 ETH. |
| Checkout | Dados do perfil carregados; troca principal/secundária alterou o endereço; carteira fictícia conectada e cotação revisada. |
| Compra simulada | Confirmada; recibo exibiu produto, edição, desconto, taxa, total e carteira esperados. |
| Recibo e carrinho | Recibo preservado após recarregar; fechar retornou à Home com carrinho vazio. |

Pedido fictício: `f29d77d9-546f-43c6-9cae-ff3dab307f9c`. Carteiras de teste: endereços Ethereum compostos por quarenta dígitos `4` e `5`, respectivamente.

## Falhas encontradas neste percurso

1. O schema da URL removia o espaço recém-digitado, transformando “Cosmic Bloom” em “CosmicBloom”. Corrigido em `9fd3739`; a API continua normalizando a consulta.
2. A substituição de consultas anunciava `CancelledError` como falha no leitor de tela. Corrigido no mesmo commit; erros reais continuam sendo anunciados. A repetição manual e 32 regressões públicas em Chromium/Firefox/WebKit passaram. [Evidências](../search-typing/).
3. O anúncio acessível de favoritos usava “1 NFTs encontrados”. A mensagem compartilhada foi ajustada para singular/plural e centralizada no catálogo em `4185cbb`; a árvore de acessibilidade confirmou “1 NFT encontrado” na publicação. [Registro](favorites-singular.txt).

## Evidências visuais

- [Perfil salvo](profile-saved.png), [avatar enviado](avatar-uploaded.png), [carteiras salvas](wallets-saved.png).
- [Cadastro duplicado](duplicate-registration.png), [zoom da galeria](gallery-zoom.png).
- [Busca antes](search-space-failure.png) e [busca corrigida](search-space-fixed.png).
- [Carrinho com uma unidade](cart-one-item.png) e [cupom aplicado](cart-coupon.png).
- [Compra confirmada](purchase-confirmed.png) e [perfil final da conta](account-final.png).

## Limites

Este percurso manual cobre os fluxos descritos na tabela; as demais combinações e falhas de rede têm cobertura automatizada documentada em [TESTING.md](../../docs/TESTING.md). Não equivale a testar todas as combinações possíveis. A troca de senha foi verificada pelos testes automatizados; a política da ferramenta de interação exige que o usuário execute alterações de credenciais, portanto ela não foi repetida neste percurso manual. Não foram enviados e-mails, publicações sociais ou transações reais. Não foi reproduzido um standby físico do computador: o caso das imagens foi exercitado com retorno à aba e transições offline/online nos testes automatizados.
