# Revisão da aplicação — 24/10/2026

Referências: `README.md`, `docs/CHALLENGE.md`, regras do projeto e frames desktop/mobile do Figma.

## Problemas corrigidos

| Área | Problema encontrado | Correção |
| --- | --- | --- |
| Imagens | Artes SVG provisórias diferentes das referências | Quatro artes originais exportadas do Figma, fontes PNG e WebP locais; migração dos dados já persistidos. |
| Carrinho | Controles apagados, remoção inconsistente e desconto sem parênteses | Botões coloridos, “−” com quantidade 1 remove o item, formato `(-)` no desconto. |
| Recomendações | Cards fixos e dados fora da sincronização | Carrossel com setas, indicadores, scroll e ampliação no hover/foco; cache integrado aos NFTs. |
| Mobile/tablet | Abas do detalhe alargavam a página e prejudicavam cliques; cabeçalho/hero/rodapé cortavam conteúdo | Larguras e quebras responsivas; compra fixa no detalhe, carrinho compacto e navegação dos frames mobile. |
| Autenticação | Diálogos com rolagem interna em telas baixas | Apresentação em página compacta quando não há altura suficiente para o diálogo. |
| Perfil/carteiras | Avatar/senha em composição diferente, labels e mensagens incompletas | Avatar ao lado dos campos, senha abaixo, carteiras sem painéis adicionais e erros associados aos controles. |
| Pagamento | Rede/provedor não refletidos corretamente no resumo; ausência de confirmação explícita de novos valores | Seleção integrada à cotação e ao pedido, resumo coerente e etapa “Revisei os novos valores”. |
| Sessão | Rascunho do pagamento se perdia após refresh ou expiração | Persistência por usuário, retomada após login e limpeza ao concluir/logout. |
| Recuperação | Erro 401 apagava a chave da tentativa; estoque reservado podia ocultar a recuperação | Chave preservada em falhas incertas; recuperação disponível mesmo sem uma cotação válida. |
| Carrinho no login | Soma podia exceder 99 unidades ou o estoque | Limite na mesclagem e aviso de ajuste; sessão expirada retorna 401 corretamente. |
| Tempo real | Evento antigo sobrescrevia REST; um cache atualizado bloqueava os outros; pedido terminal podia regredir | Comparação de versão por representação, gate preservado em reconexões e estados finais protegidos. |
| Favoritos/navegação | Remoção mantinha o card no catálogo filtrado; links existentes exibiam aviso de indisponibilidade | Invalidação das consultas dependentes e links de perfil/carteiras/favoritos conectados aos fluxos. |
| Validação/entrega | Erro de observação longa invisível; ausência de baselines e cobertura de cenários de falha | Erros visíveis/associados; capturas em 390, 768 e 1440 px e testes de resiliência. |

## Verificação

- `pnpm check`: passou; 77 testes unitários. ESLint sem erros, com 51 avisos (principalmente tamanho de funções).
- Playwright completo: 119 passaram, 3 ignorados por condições de viewport.
- Baselines de início, detalhe, carrinho e pagamento nos três tamanhos: incluídas em `e2e/__screenshots__` e verificadas sem atualizar referências na execução final.
- Testes automáticos de acessibilidade nos fluxos de carrinho, pagamento, perfil e carteiras.
- Revisão de código independente confirmou o fechamento dos achados finais de recuperação/cache/favoritos/recomendações.
- Lighthouse: consulte os resultados atualizados em [SUMMARY.md](lighthouse/SUMMARY.md).

## Limites e entrega

As capturas representam a implementação revisada. Não são uma certificação automática de equivalência pixel a pixel ao Figma. As quatro artes são reutilizadas no catálogo simulado; ícones decorativos/provedores mantêm representações simplificadas locais. No pagamento mobile, dados do colecionador e resumo são expansíveis para manter o fluxo compacto; erros abrem o formulário automaticamente.

A [demonstração pública](https://kurio-production-8274.up.railway.app/) consultada ainda usa a versão anterior. As correções desta revisão estão no workspace local e precisam ser publicadas. O checkout atual não possui remote Git configurado. Mocks, carteira e transações continuam simulados conforme o escopo do desafio.
