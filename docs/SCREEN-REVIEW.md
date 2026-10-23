# Revisão tela por tela — 23/10/2026

Esta é a conferência visual do checkpoint `242294b`, com assets/capturas originais preservados. A refatoração posterior manteve os baselines; os ajustes adicionais de zoom/foco e os gates atuais estão em [QUALITY-REVIEW.md](QUALITY-REVIEW.md).

Revisão posterior às correções do detalhe (`544acda`). Foram encontrados e corrigidos outros desvios reais; os relatórios anteriores não significavam igualdade visual completa.

## Referência e método

- Exportação nova dos **15 frames originais**: nove desktop e seis mobile. SVG com texto e IDs preservados, consultado para cores, raios, fontes, espaçamento e vetores. [Proveniência e hashes](../reports/design/source-manifest.json).
- Comparação visual das páginas renderizadas, incluindo `/nfts/nft-001` e `/nfts/nft-002`. **30 capturas** em 1440, 414 e 320 px, com fontes e imagens carregadas. [Índice](../reports/design/README.md).
- Testes de texto e ações também em 360, 375 e 390 px. As capturas mobile mostram o viewport; os testes percorrem conteúdo e controles fora da dobra.
- Estados: visitante, carrinho com vários itens, autenticação, conta autenticada, carteiras salvas, cotação revisada, carteira conectada e compra confirmada na simulação.

## Correções por tela

| Tela               | Diferenças corrigidas                                                                                                                                                                                                                                                                                     | Conferência                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Início             | Busca mobile de 45 px e fonte 14; posição dos ícones inferiores; sublinhado das abas; fundo/borda dos favoritos; tipografia de raridade; slider laranja; filtros; banner em destaque; paginação com borda e página ativa; cartões editoriais e arcos decorativos.                                         | Desktop, 414 e 320 px; busca, filtro e paginação.                               |
| Detalhe de NFT     | Reconferidos estrela, coração, edição, quantidade, lupa e compra nos dois NFTs após a mudança dos componentes compartilhados.                                                                                                                                                                             | Desktop e mobile; variantes de avaliação, esgotamento, ampliação e favoritos.   |
| Carrinho           | Margem mobile 28 px e primeiro item em y=88; espaço entre itens; cupom desktop com borda Primary e fundo transparente; cabeçalhos/divisória; texto do resumo; CTA sólido desktop e gradiente mobile. Valor alto ajustado para não encostar na quantidade; skeleton desktop acompanha os 136 px do resumo. | Carrinho com vários itens, quantidade 99, atualização e remoção.                |
| Login              | Raios mobile/desktop 10/5 px; ícone de senha 20 px; botão mobile em y=492; botões sociais 13 px; divisor, fechamento original, posição desktop e fundo do modal.                                                                                                                                          | Credenciais inválidas/válidas, mostrar senha, teclado, Escape, retorno de foco. |
| Cadastro           | Mesmos componentes de campos, botões sociais e fechamento; hierarquia de texto e posição desktop.                                                                                                                                                                                                         | Validação, confirmação de senha, conta existente e criação de conta.            |
| Perfil             | Labels 15 px, campos com raio 3, indicadores de obrigatoriedade, avatar 50 px, botões 14 px, navegação lateral e peso de “Sair”.                                                                                                                                                                          | Edição de perfil/senha e avatar; adaptação mobile.                              |
| Carteiras          | Seletores com seta original, obrigatoriedade coerente com o contrato, controle circular para copiar carteira principal, labels/botões e navegação.                                                                                                                                                        | Carteira principal/secundária, seleção e persistência; adaptação mobile.        |
| Pagamento          | Cartões de carteira mobile 93 px; provedores 65 px mobile/45 px desktop; círculos/ícone original, posição do indicador, bordas, títulos, valor total e botão com safe area.                                                                                                                               | Seleção de carteira/provedor, cotação, conexão e confirmação.                   |
| Confirmação        | Cabeçalhos da tabela, quantidade, metadados, bordas, taxa de rede, tipografia, padding e botão do explorador; fechamento original.                                                                                                                                                                        | Pedido confirmado, dados do snapshot e leitura em 320 px.                       |
| Cabeçalho e rodapé | Alinhamento vertical do header, divisória conforme tela, fontes 17/18 px do rodapé, colunas, links e identificação das carteiras.                                                                                                                                                                         | Componentes compartilhados verificados nas páginas que os usam.                 |

## Causa compartilhada corrigida

`cn()` usava o `tailwind-merge` sem conhecer os tokens próprios de fonte e raio. Por exemplo, `text-caption` era tratado como cor e podia remover `text-primary`, deixando o tamanho padrão; `rounded-auth` coexistia com `rounded-field`. O merge agora conhece esses tokens. Dois testes unitários reproduzem os conflitos antes da correção.

A paginação também usava `aria-current:*`, que correspondia ao valor `true`, embora o estado real fosse `aria-current="page"`. Foi corrigida a variante e acrescentada uma asserção do destaque ativo.

O SVG de ícones recebeu os vetores originais de carteira e fechamento. As partes editoriais, o select e os indicadores de seleção foram separados em componentes reutilizáveis. Os formulários mantêm associação entre rótulo, controle e erro.

## Diferenças intencionais e limites

- Dados, preços, quantidades, edições, disponibilidade, avaliações e imagens pertencem aos dados canônicos da simulação. Os frames do Figma apresentam exemplos inconsistentes entre telas; eles não substituem o contrato nem o cálculo da compra.
- A aplicação mantém revisão da cotação, conexão da carteira, estados de erro/esgotamento, recuperação e identificação de transação simulada. Esses estados acrescentam conteúdo e alteram a altura das telas.
- Campos opcionais continuam opcionais; os asteriscos seguem a validação real. Perfil e senha conservam ações de salvar independentes.
- Alvos de toque têm pelo menos 44 px. Favoritos ficam visíveis em dispositivos de toque. Ações de remover e quantidade não se sobrepõem. Texto alto e conteúdo em 320 px podem quebrar linhas.
- Contraste legível do texto de “Aplicar” e do ícone de senha é preservado, apesar de cores menos legíveis em alguns frames. O carrossel mantém navegação funcional acessível, com espaçamento maior que os pontos ilustrativos.
- O arquivo original não contém frames mobile de perfil, carteiras e recibo. Neles foi validada adaptação responsiva, sem inventar uma referência original.
- A conferência cobre Chromium e os estados descritos. Não é uma certificação de igualdade absoluta de todos os pixels, navegadores ou combinações possíveis de dados.

## Validação

Os resultados finais, commit, hashes das capturas e publicação estão no [manifesto de evidências](../reports/design/manifest.json). Os testes novos foram executados inicialmente com falhas, antes das correções. A revisão independente de código confirmou os ajustes e o funcionamento de seleção, teclado e fechamento do diálogo.
