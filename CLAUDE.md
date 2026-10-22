# Kurio NFT Marketplace — instruções para o agente executor

- Enunciado do desafio: `README.md` (na Tarefa 1 ele é movido para `docs/CHALLENGE.md` e o `README.md` passa a ser o da solução).
- Plano de implementação aprovado: `docs/superpowers/plans/2026-10-22-kurio-nft-marketplace.md`. Execute tarefa por tarefa, na ordem, com a skill `superpowers:subagent-driven-development` (ou `superpowers:executing-plans`), marcando os checkboxes.
- Regras de código obrigatórias: `.claude/rules/kurio.md` (carregadas automaticamente). Código autoexplicativo, poucos comentários, padrão único no front e na camada MSW.
- Prazo: 24/10/2026. Prioridade: eliminatórios do enunciado → fidelidade ao Figma → fluxos → integração/estado → tempo real → mocks → testes → a11y → performance → docs.
- Nunca: dados fictícios fora de `src/mocks`; eventos de tempo real sem passar pelo `socket.io-client`; confirmação de compra sem resposta da simulação; vazamento de dados entre usuários; `msw` 3.x (o binding Socket.IO exige 2.x).
- Ações que dependem do usuário: download de assets do Figma, criação do repositório GitHub e login no Vercel. Pergunte antes.
