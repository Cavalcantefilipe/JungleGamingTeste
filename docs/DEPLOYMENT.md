# Publicação na Railway

O deployment e o commit vigentes, com as verificações finais, estão em [QUALITY-REVIEW.md](QUALITY-REVIEW.md). Os IDs abaixo preservam o histórico da publicação e as instruções de reprodução.

Railway foi escolhida pelo usuário em 23/10/2026. O GitHub público usa a branch `main`. A aplicação continua sendo a demonstração MSW descrita no README: não exige banco, volume nem servidor Socket.IO remoto.

## Aplicação publicada

- URL: [kurio-production-8274.up.railway.app](https://kurio-production-8274.up.railway.app).
- Origem: [Cavalcantefilipe/JungleGamingTeste](https://github.com/Cavalcantefilipe/JungleGamingTeste), branch `main`, deploy automático habilitado.
- Projeto `JungleGamingTeste`, serviço `kurio`, ambiente `production`, na conta original do usuário. Nenhum projeto existente foi alterado.
- Primeiro deploy aprovado: `f1112c9a-74d6-46c7-b84b-393f6cd50c51`, commit `45cd7e178912f0f28a63941913340a2b161ac465`, status `SUCCESS` em `2026-10-23T16:14:00.911Z`.
- Build remoto: Node 24.21.0, pnpm 11.18.0, Railpack 0.43.0, Caddy 2.11.7, Linux/amd64. Healthcheck `/healthz` aprovado.
- SHA-256 do HTML público: `796971dcd3da4adad8f24023e926d39069a799aae993b34143ea3a2e6e2b5717`. O build local tem outro hash; a diferença no HTML está nos nomes dos chunks JS/CSS. Não se alega identidade binária entre builds de ambientes diferentes.

## Configuração

- Builder: Railpack, com detecção automática de Vite.
- Instalação padrão do Railpack: `pnpm install --frozen-lockfile --prefer-offline`; pnpm fixado pelo `packageManager`.
- Build: `pnpm build`; Node 24 configurado em `railpack.json`.
- Runtime: Caddy 2.11.7, servindo somente `dist/` com o `Caddyfile` versionado.
- Start command: deixar vazio para preservar o runtime estático do Railpack.
- Porta: `PORT` fornecida pela Railway, com fallback local 3000.
- Healthcheck: `/healthz`, configurado nas opções de deploy do serviço.
- Rede pública: gerar domínio HTTPS apontando para a porta do serviço.

Os defaults públicos `VITE_ENABLE_MOCKS=true`, `VITE_MOCK_SCENARIO=default`, `VITE_SOCKET_URL=wss://realtime.kurio.app` e `VITE_API_BASE_URL=/api` já estão no código. Sobrescrevê-los exige novo build. Nunca colocar segredos em `VITE_`.

O Caddy mantém CSP e os demais headers da configuração Vercel. HTML e arquivos públicos são revalidados; arquivos com hash em `/assets/` têm cache de um ano. O service worker e respostas de erro usam `no-store`. Brotli usa os arquivos preparados pelo build, com gzip como alternativa. Rotas da SPA carregam `index.html`; arquivos ausentes e chamadas REST/Socket.IO que escapem da simulação respondem 404, sem retornar HTML como se fosse uma API.

`.railwayignore` limita uploads pela CLI. O serviço deve apontar para este repositório e sua branch `main`; cada deploy precisa registrar o commit efetivamente usado. `vercel.json` permanece como alternativa de hospedagem.

## Verificar

Após `pnpm build`, é possível testar o mesmo Caddy localmente:

```sh
docker run --rm --name kurio-railway-preview -p 127.0.0.1:4186:3000 -w /app \
  -v "$PWD/Caddyfile:/app/Caddyfile:ro" -v "$PWD/dist:/app/dist:ro" \
  caddy:2.11.7-alpine caddy run --config /app/Caddyfile
```

Em outro terminal:

```sh
pnpm verify:deployment http://127.0.0.1:4186
E2E_BASE_URL=http://127.0.0.1:4186 pnpm e2e
```

`verify:deployment` verifica respostas reais: headers, refresh de rotas, integridade Brotli/sem compressão, cache, worker, healthcheck e 404. Aceita a URL pública para repetir os mesmos checks. `E2E_BASE_URL` faz o Playwright usar o servidor informado sem iniciar o preview; os testes continuam em contextos de navegador isolados.

Resultados: **210 E2E/10 skips** no Caddy local e **16 E2E aprovados** na URL pública (desktop/mobile), cobrindo cadastro, login/refresh, carrinho/compra/recibo, recuperação por usuário, rede lenta, Socket.IO e CSP. O verificador HTTP também passou no domínio público. [Detalhes dos testes](TESTING.md). Uma verificação adicional em desktop/mobile confirmou redirecionamento de `/checkout` para login com `returnTo`, refresh, worker ativado/controlando a página, conexão do socket e ausência de erros de console, sem interceptar as respostas do servidor. [Manifesto e evidências](../reports/deployment/railway.json).

Lighthouse público usa `KURIO_LH_BASE_URL` e `KURIO_LH_REPORT_DIR=reports/lighthouse-railway`; os relatórios locais aprovados permanecem em `reports/lighthouse`. [Resultados e limites](LIGHTHOUSE.md): 97/99 desktop, 94/88 mobile e demais categorias 100. A mediana do detalhe mobile não atingiu 90; o comando conservou saída 1.

## Correções durante a publicação

O primeiro build remoto falhou porque `steps.install.commands` substituía comandos gerados de preparação/cópia dos manifests. O commit `45cd7e1` removeu esse override; o Railpack voltou a preparar os arquivos e instalar com lockfile congelado. A segunda tentativa publicou com sucesso.

Na preparação local, Caddy 2.10.2 respondeu 206 a GET Brotli comum; a versão fixada 2.11.7 respondeu 200, com bytes decodificados idênticos à resposta identity. Também foi corrigido o cache de erros para impedir que um asset ausente herdasse cache imutável. O verificador exige `no-store` e os headers de segurança nos 404. Nenhuma dessas mudanças desativa autenticação, validação ou mocks.

## Fontes

- [Railpack: sites estáticos e Caddyfile próprio](https://railpack.com/languages/node/#static-sites).
- [Railpack: configuração do build](https://railpack.com/config/file/).
- [Railway: healthchecks](https://docs.railway.com/deployments/healthchecks).
- [Caddy: arquivos pré-comprimidos](https://caddyserver.com/docs/caddyfile/directives/file_server#syntax).

Não há `railway.json`: a documentação atual reserva esse formato aos serviços antigos. A configuração de build fica em `railpack.json`; opções do serviço ficam na Railway. [Configuração da Railway](https://docs.railway.com/config-as-code/reference).

## Revisão visual mobile — 23/10/2026

Código da interface: `cf36ac1`. Deploy `529ec4be-9b97-48c4-86a9-0be6f31fbbe6`, commit de publicação `c1ce70fb2aecbc1c60c0d57400d491402e3f4818`, concluído com SUCCESS. Foram conferidos os novos SVGs e o HTML, além de 10 testes de imagens/ícones e 5 fluxos de nove telas nas larguras 320–414 px na URL pública. [Detalhes da validação](TESTING.md#verificação-pública-da-revisão-mobile).

Hash SHA-256 do HTML: `c5b143ff1fe56df24752c25eca18fc5758f1eb80fcd6d171125b86e49e58aaa8`. Publicações posteriores somente de testes/documentação preservam o código da interface; o [manifesto visual](../reports/design/manifest.json) referencia o commit de aplicação. As notas Lighthouse anteriores não foram reaproveitadas como medição deste build.

## Publicação dos tokens e refatoração — 23/10/2026

Aplicação publicada no deploy `58314c49-9814-4583-ba43-7edc73fd7324`, estado `SUCCESS`, commit `1b4551c06cd05edcaa50678132e1d93d7dbecdef`. Inclui os commits `e7b453d` (gradientes/favorito), `59a121a` (checkout) e `1b4551c` (composição das demais páginas).

- Verificação HTTP de headers, Brotli, cache, fallback SPA e worker: aprovada.
- HTML público e local com o mesmo SHA-256: `26226f082e10760b9c0dc59614f9f446ac6d8bc6c3d18e03fa0869d9ea6e2525`.
- E2E público: 18 aprovados / 6 ignorados por viewport. Cobertura de gradientes, favorito por mouse/foco/toque, imagens/ícones e nove telas nas larguras de 320 a 414 px.
- A aba existente foi recarregada após o deploy e conservou os dois itens do carrinho. Testes usaram contextos isolados.

Capturas, hashes e resultados estão em `reports/design/manifest.json`; a análise estrutural e os avisos remanescentes estão em `docs/FRONTEND-REVIEW.md`. O commit posterior de documentação não altera o código da aplicação validado acima.
