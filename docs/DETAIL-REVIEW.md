# Revisão após o apontamento em `/nfts/nft-002`

> Registro de uma etapa anterior. A [revisão tela por tela](SCREEN-REVIEW.md) documenta as correções posteriores e a nova conferência; medidas conflitantes deste registro foram substituídas.
> 23/10/2026. A revisão anterior deixou passar as estrelas de texto e reutilizou o estilo dos favoritos dos cards na página de detalhes. Os testes existentes não verificavam esses elementos contra o desenho. Esta rodada compara os vetores, cores e medidas do Figma, além de verificar o comportamento.

## Referência e escopo

- Figma: arquivo `Ff0SksUi7UFtPWUO8kyNtw`, desktop `10:244` e mobile `15:5536`.
- Exportação SVG desktop com texto e IDs de camada preservados; PNGs originais em `reports/design/desktop/reference/detail.png` e `reports/design/mobile/reference/detail.png`.
- Detalhes de `nft-001` e `nft-002`, componentes compartilhados de Início, carrinho, pagamento, login, cadastro, perfil, carteiras e recibo.
- Capturas em 1440 × 900, 414 × 896 e 320 × 844. Testes de textos também em 360/375/390 px; ações do detalhe em 768/1024/1080/1280/1440 px.
- [Proveniência dos 29 símbolos SVG](../reports/design/icons.json) e [capturas](../reports/design/README.md).

## Erros encontrados e corrigidos

| Elemento                     | Antes                                                                       | Correção baseada no original                                                                                                                                             |
| ---------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Estrelas desktop             | Cinco caracteres Unicode, sempre laranja, pequenos e sem relação com a nota | Paths originais de 15 px, intervalos de 4 px, Primary e Text Secondary. A referência de 4,8 mostra quatro estrelas completas; o valor exato permanece no nome acessível. |
| Avaliação mobile             | Estrela de fonte e badge pequeno                                            | SVG de 12 px Amber, nota Foreground, contagem Text Secondary, contorno Primary e altura 27 px.                                                                           |
| Favoritar desktop            | Cor do contorno, fonte e tamanho do ícone divergentes                       | Botão 130 × 40, borda Primary, ícone original 20 px Primary, texto 14 px Accent. Seleção, espera e persistência mantidas.                                                |
| Favoritar mobile             | Círculo interno de card 28 px dentro de borda 44 px                         | Um único círculo visível 35 px Raised/Border e coração 16 px Accent dentro de alvo 44 px.                                                                                |
| Tablet                       | Favorito ausente entre 768 e 1023 px                                        | Navegação de detalhe disponível até o início da composição desktop; alvo 44 px.                                                                                          |
| Galeria                      | Ausência da lupa                                                            | Lupa original 24 px sobre círculo 30 px. Ampliação da imagem selecionada em diálogo com fechamento por Esc e restauração de foco.                                        |
| Imagem mobile                | Começava 10 px abaixo e tinha proporção diferente                           | Em 414 px: x 28, y 66, 361 × 356, raio 24 px; painel sobreposto em y 392. Skeleton acompanha a proporção.                                                                |
| Tipografia do resumo         | Preço 24 px, avaliação/metadados 12 px, cor incorreta                       | Preço 22 px, avaliação e metadados 15 px; metadados Secondary, rótulo e valor na mesma linha.                                                                            |
| Quantidade do detalhe        | Discos pequenos no lugar das cápsulas                                       | Forma 20 × 30 mobile e 33 × 50 desktop, com área interativa maior e estados de limite/espera.                                                                            |
| Edições                      | Contorno ocupava toda a área 44 px no celular                               | Elipse visual 28 px de altura dentro da área de toque, fonte 14 px, estado selecionado e esgotado explícitos.                                                            |
| Barra de compra              | Deslocamento vertical e preço quebrando em 320 px                           | Espaçamento revisto e moeda/preço juntos, preservando safe area e alvos 44 px.                                                                                           |
| Abas                         | Aparência de pill, falta de sublinhado, sobreposição após quebra em 320 px  | Texto/linha Accent/Primary e altura automática. Teste compara a borda inferior da última aba com o início do painel.                                                     |
| Compartilhamento             | Um ícone genérico                                                           | Vetores originais LinkedIn, mensagem e Twitter, links para os respectivos compositores; copiar link continua como ação adicional.                                        |
| Coleção relacionada          | Título branco e ausência da divisória                                       | Título 17 px Accent e divisória Border. Dados e navegação seguem funcionais.                                                                                             |
| Cabeçalho compartilhado      | Linha transversal indevida, sublinhado fino e Entrar grande                 | Linha removida, marcador ativo 3 px, fonte ativa em negrito e Entrar 100 × 35 desktop.                                                                                   |
| Carrinho desktop             | Quantidade com o círculo escuro do mobile                                   | Cápsulas 20 × 30 Primary com glifo Ink, confirmadas no SVG desktop. Mobile conserva círculo escuro 24 px.                                                                |
| Voltar no carrinho/pagamento | Borda 44 px e fundo transparente                                            | Mesma variante visual 35 px Raised/Border do original, dentro de alvo 44 px.                                                                                             |
| Conta                        | Ícones Atividade/Ofertas invertidos                                         | Atividade usa carrinho; Ofertas usa Activity, conforme o frame de perfil.                                                                                                |
| Desktop estreito             | Fileira de compra passava 65 px da viewport 1024 px                         | Quebra dos controles conforme espaço disponível, sem reduzir alvos ou cortar texto.                                                                                      |

As variantes permanecem centralizadas em `button.tsx`, utilizando tokens de cor. Avaliação, miniaturas, ampliação, fatos e acionadores das abas foram separados em componentes. O agrupamento manual de mídia no build foi ajustado para incluir `NftCardMedia`, eliminando a dependência circular de chunks detectada durante esta revisão.

## Conferência das demais telas

| Tela             | Itens conferidos nesta rodada                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| Início           | Cabeçalho, ícones de busca/carrinho, estados do favorito nos cards, gradientes, imagens e textos em telas estreitas. |
| Carrinho         | Voltar, quantidade nos dois breakpoints, lixeira, taxa estimada, cupom, totais e botão de continuar.                 |
| Pagamento        | Voltar, cabeçalho, cards de carteira, resumo, botão fixo e fluxo de revisão/confirmação.                             |
| Login/cadastro   | Ícones sociais, campos, controle de senha, cabeçalho ao fundo, abertura/fechamento e foco do modal.                  |
| Perfil/carteiras | Ícones da navegação, campos, seleção de carteira, textos/endereço e ações de salvar.                                 |
| Recibo           | Layout dos itens/metadados, identidade do pedido, valores e responsividade.                                          |
| Rodapé           | Ícones exportados, faixas, textos e ausência de recorte horizontal.                                                  |

## Diferenças que continuam explícitas

Não há igualdade absoluta de pixels. O Figma contém uma composição de exemplo; a aplicação mostra os dados e estados da API simulada:

- Nome, preço, token, quantidade de avaliações, rede, edições e estoque pertencem ao NFT aberto. Não se aplica o conteúdo de Emerald Ape ao Sage Nomad. Edição esgotada permanece desabilitada.
- Parágrafos editoriais longos, contrato e royalties do frame não existem no contrato de dados atual. A aba mostra descrição, rede e atributos disponíveis. Não apresenta como verificados um contrato ou percentual inexistentes.
- A coleção relacionada respeita os resultados da consulta; setas funcionais substituem os três pontos ilustrativos do frame.
- Ações adicionais de adicionar ao carrinho, copiar link, revisão de cotação e sinalização de simulação continuam presentes.
- O texto de “Aplicar” permanece Ink no mobile. Foreground sobre o gradiente medido daria contraste entre 2,50:1 e 3,49:1; Ink fica entre 4,90:1 e 6,85:1. A cor clara do desenho não atende AA para esse tamanho de texto.
- Alvos interativos são maiores que algumas formas desenhadas; quebra de linha, altura de conteúdo e estados disabled/foco/pending se adaptam ao uso.
- Perfil, carteiras e recibo não têm frame mobile equivalente; as versões menores são adaptações verificadas.

## Evidências de validação

`e2e/23-detail-design.spec.ts` cobre vetores/cores, favorito selecionado e persistido, lupa/foco, abas sem sobreposição, favorito e overflow nos pontos de quebra, cabeçalho e mapeamento dos ícones da conta. A primeira execução, antes das correções, apresentou 7 falhas e 1 caso não aplicável. A persistência aguarda o término da mutação antes de recarregar, distinguindo estado otimista de gravação concluída.

`e2e/15-figma-geometry.spec.ts` foi corrigido onde suas expectativas reproduziam o erro anterior: preço de 24 px e controle escuro no carrinho desktop. O teste de navegação ativa também passa a verificar Accent, confirmado no SVG, mantendo a checagem de `aria-current`. Os PNGs internos de regressão foram atualizados após a comparação com as referências originais; não são usados como prova isolada de fidelidade.

Os resultados finais de check, suíte completa, capturas e publicação estão vinculados ao commit no [manifesto de evidências](../reports/design/manifest.json). A revisão por agente encontrou e levou à correção das colisões de abas, overflow e divergências compartilhadas acima. Navegador verificado: Chromium. Não se atribuem medições Lighthouse antigas a este build.
