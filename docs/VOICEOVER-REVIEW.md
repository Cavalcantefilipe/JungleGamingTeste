# Verificação parcial com VoiceOver — 24/10/2026

Sessão realizada no Chrome sobre o Railway, com o VoiceOver ativado pelo usuário no macOS. Esta sessão complementa a tentativa histórica registrada em [QUALITY-REVIEW.md](QUALITY-REVIEW.md).

## O que foi confirmado

- O usuário confirmou que o VoiceOver estava lendo o site e anunciava o nome do campo “Senha”.
- O usuário esclareceu que os caracteres digitados na senha não eram falados. O campo permaneceu protegido, com `type="password"`; nenhuma alteração foi feita para expor seu conteúdo.
- Ao enviar o login vazio pela interface, o foco ficou no primeiro campo inválido. E-mail e senha tinham `aria-invalid="true"` e `aria-describedby` apontando, respectivamente, para “Informe um e-mail válido” e “Informe a senha”.
- Abrir o login diretamente pelo cabeçalho e fechar com Escape devolveu o foco a “Entrar”.

## Falha encontrada e corrigida

O percurso **Entrar → Criar conta → Entrar → Escape** devolvia o foco ao `body`, sem selecionar o controle que abriu a autenticação. A falha foi observada pela interface pública em `fb6ac6a` e reproduzida em testes no build de `11f0820`, cujo código de aplicação era o mesmo.

As rotas remontavam o diálogo e perdiam a referência inicial. O hook agora preserva o gatilho durante as trocas, restaura o foco somente ao sair da autenticação e então limpa a referência. Um gatilho removido da página não recebe foco.

A regressão teve duas falhas antes da alteração. Depois, os três percursos — login direto, uma troca e duas trocas — passaram em Chromium desktop/mobile, Firefox desktop e WebKit mobile: **12 verificações focais**. A revisão independente não encontrou bloqueadores. [Logs, traces e reprodução pública anterior](../reports/auth-focus-voiceover/README.md).

Na integração, `pnpm check` passou com 138 testes unitários e 17 de ferramentas; o build passou. A suíte completa Chromium sobre esse build teve **341 aprovações e 37 exclusões explícitas**, sem falhas.

## Relato sobre o início da leitura

O usuário relatou que a leitura começava pelo conteúdo ao abrir ou recarregar a página. Na inspeção da Home pública, o foco do DOM permaneceu no `body`; a ordem observada foi o link “Pular para o conteúdo”, o cabeçalho e depois o conteúdo principal. As duas primeiras teclas Tab alcançaram o link de salto e o logo “Kurio — Início”. Não foi encontrado código que direcione o foco inicial para o conteúdo.

O catálogo atualiza uma região `aria-live` de “0 NFTs encontrados” para a contagem retornada pela consulta, o que pode gerar um anúncio sem mudar o foco. Essa é uma hipótese para o relato, ainda sem confirmação da primeira frase ouvida. A ordem de foco observada não comprova a posição do cursor virtual do VoiceOver. Nenhum foco automático foi adicionado ao cabeçalho.

## Limites

A ferramenta observou foco, atributos e interface, mas não capturou a saída de voz nem o rotor. A leitura geral e o nome do campo foram confirmados pelo usuário; a pronúncia das mensagens de erro não foi confirmada. Os resultados automatizados comprovam navegação e foco, não a fala do VoiceOver.

Não houve teste em iPhone físico. Esta rodada não equivale a uma aprovação completa de leitor de tela. A medição Lighthouse permanece vinculada ao código `11f0820`, conforme [LIGHTHOUSE.md](LIGHTHOUSE.md).
