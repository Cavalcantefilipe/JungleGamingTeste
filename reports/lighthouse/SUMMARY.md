# Auditoria Lighthouse

Data UTC: 2026-10-24T03:11:39.910Z. Medições por página e perfil: 3. Valores são medianas.
Ambiente: darwin 27.0.0 arm64; CPU: Apple M4 Pro.
Build de produção local com MSW e cenário padrão. Perfil mobile usa a simulação padrão do Lighthouse; desktop usa preset desktop. Assets e fontes completos, cache limpo por medição, sem serviços externos de aplicação.
Node: v24.12.0; Lighthouse: 12.6.1; Chrome: /Users/filipecavalcante/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing.

| Perfil | Página | Performance | Acessibilidade | Boas práticas | SEO | LCP (ms) | CLS | TBT (ms) |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| mobile | / | 91 | 100 | 100 | 100 | 3049 | 0 | 9 |
| mobile | /nfts/nft_001 | 91 | 100 | 100 | 100 | 2971 | 0 | 86 |
| desktop | / | 100 | 100 | 100 | 100 | 726 | 0 | 0 |
| desktop | /nfts/nft_001 | 100 | 100 | 100 | 100 | 682 | 0 | 0 |

Relatórios HTML e JSON estão nas pastas `mobile/` e `desktop/`.
