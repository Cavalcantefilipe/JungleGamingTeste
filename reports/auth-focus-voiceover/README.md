# Retorno do foco entre login e cadastro

Verificação focal de 24/10/2026, com navegador headless isolado em `http://127.0.0.1:4192`. A sessão de Chrome/VoiceOver do usuário não foi operada por estes testes.

## Falha e correção

- O build preservado de `11f0820` perdeu o foco do gatilho ao percorrer **Entrar → Criar conta → Entrar → Escape**, em desktop e mobile Chromium.
- Login direto e fechamento após uma única troca passaram. A etapa red teve **2 falhas e 4 aprovações**: [log](red.txt), [artefatos e traces](red/).
- `/login` e `/register` remontam o diálogo. O hook agora mantém a referência ao gatilho durante as trocas, evita restaurar o foco nos fechamentos intermediários e limpa a referência ao sair da autenticação.

## Verificação da alteração

Os mesmos três percursos passaram em todas as configurações abaixo, usando o código alterado no servidor Vite da porta 4192:

- **6/6 Chromium**, desktop e mobile: [log](green.txt).
- **6/6 de compatibilidade**, Firefox desktop e WebKit mobile: [log](compatibility.txt).
- ESLint focal dos dois arquivos alterados passou; revisão independente de código sem bloqueadores.

## Integração

- `pnpm check`: tipos, lint e formatação aprovados; **138 testes unitários e 17 testes de ferramentas**. [Log](check.txt).
- `pnpm build`: aprovado. [Log](build.txt).
- Suíte completa Chromium sobre esse build no preview dedicado 4192: **341 aprovados, 37 exclusões explícitas, nenhuma falha**, em 6,8 minutos. [Log](integration.txt). Os artefatos temporários dessa suíte ficam fora do versionamento; as falhas da etapa red acima foram preservadas.
- A falha também foi observada pela interface no Railway antes da publicação: [estado do foco](railway-before.json).

Comando focal, usando `--config playwright.compat.config.ts` para a matriz de compatibilidade:

```sh
E2E_BASE_URL=http://127.0.0.1:4192 pnpm exec playwright test e2e/11-a11y-keyboard.spec.ts --grep 'diálogo de login|troca entre login' --workers=1 --reporter=line --output=reports/auth-focus-voiceover/green
```

Os caminhos `.superpowers/auth-focus-regression/red` impressos no log original correspondem à execução inicial; os artefatos foram preservados na pasta `red/` deste relatório.

## Publicação e conferência pública

O commit `4716d46` foi publicado na `main`; o deployment `31fa792f-3447-417f-85df-ad0e95452e4d` terminou como `SUCCESS`. O HTML público é idêntico ao build local testado. [Identificação e hashes](deployment.json), [verificação HTTP](deployment-http.txt).

O percurso **Entrar → Criar conta → Entrar → Escape** foi repetido pela interface pública: o foco voltou ao link “Entrar” do cabeçalho. [Observação](railway-after.json), [captura](focus-after.png).

Esta evidência comprova navegação e foco no DOM. Não mede a fala do VoiceOver. A mudança não altera campos, mensagens de erro ou atributos ARIA de senha.
