# Auditoria Técnica — cidades.cirgrafica.com.br (projeto `cir`)

Documento gerado por leitura direta do código-fonte no diretório `/Users/brunostersa/Documents/projetos-bs/cidadescir`, em 2026-07-24. Descreve o estado atual do sistema — sem avaliação de qualidade nem sugestões de correção.

---

## 1. Stack

**Framework**: Next.js `14.2.3` (Pages Router), React `18.2.0` / React DOM `18.2.0`.

**Dependências de produção** (`package.json`):
- `@supabase/supabase-js` `^2.110.1`
- `chart.js` `^4.5.1`
- `next` `14.2.3`
- `react` `18.2.0`
- `react-dom` `18.2.0`

**Dependências de desenvolvimento**:
- `@anthropic-ai/sdk` `^0.110.0`
- `autoprefixer` `^10.4.0`
- `dotenv` `^17.4.2`
- `postcss` `^8.4.0`
- `tailwindcss` `^3.4.0`

**Estilo**: CSS customizado via `styled-jsx` (nativo do Next.js) em cada componente/página, mais um design system compartilhado em `styles/cir-ds.css` e `styles/globals.css`. Tailwind está instalado e configurado (`tailwind.config.js` aponta para `pages/**` e `components/**`), mas as páginas revisadas usam majoritariamente classes `cir-*`/`cp-*` do design system, não classes utilitárias Tailwind.

**Banco de dados / Backend as a Service**: Supabase (Postgres gerenciado), projeto `cirgrafica-cidades-leads` (ref `cuorqtrhrvnpyqzocidf`, região `sa-east-1`). Acesso via `@supabase/supabase-js`, sem camada de API própria além das rotas Next.js.

**IA generativa**: `@anthropic-ai/sdk`, usado apenas em `scripts/generate-city-content.js` (script offline, não roda em produção) para gerar variações de texto por cidade via Batches API (modelo `claude-haiku-4-5`).

**Hospedagem**: Vercel (projeto `cir`, org `brunostersas-projects`). Não há `next.config.js` no repositório — o build usa a configuração padrão do Next.js.

**Gráficos**: `chart.js` (importado dinamicamente no client) usado em `pages/admin/leads.js` e em `components/BarChart.js`.

---

## 2. Arquitetura

Aplicação Next.js Pages Router monolítica, sem camada de autenticação de usuário final (não há login de cliente/consumidor — apenas um painel administrativo único).

**Estrutura de diretórios**:
- `pages/` — rotas (páginas + API routes)
- `components/` — componentes React reutilizáveis
- `lib/` — utilitários e clientes (Supabase, validação, formatação, roteamento de leads, estatísticas)
- `data/` — JSON estático (conteúdo variável por cidade, depoimentos, galeria de imagens)
- `styles/` — CSS global e design system
- `scripts/` — script Node standalone (geração de conteúdo via IA), não faz parte do runtime da aplicação
- `utils/` — funções puras (normalização de texto para slugs)
- `middleware.js` — middleware Next.js na raiz do projeto
- `public/` — assets estáticos servidos diretamente, incluindo um arquivo HTML autônomo (`cir-leads-dashboard.html`, ver seção 4)

**Padrão de geração de página**: as páginas de cidade (`pages/grafica/[estado]/[cidade].js`) e de estado (`pages/grafica/estado/[estado].js`) usam `getStaticProps`/`getStaticPaths` (Static Site Generation) — 478 páginas de cidade pré-renderizadas em build a partir de `cidades.json`, com conteúdo textual vindo de `data/cityContent.json` (gerado previamente pelo script de IA) ou de um fallback padrão definido inline (`defaultContent()`).

**Captura de leads**: dois pontos de entrada client-side gravam na mesma tabela `leads` via `POST /api/lead`:
1. `components/WhatsAppLink.js` — botão que redireciona (via `next/router`) para a página `/orcamento`, passando `message`, `source`, `cidade`, `estado` como query string.
2. `pages/orcamento.js` — página dedicada com um formulário em etapas (quiz) que, ao final, decide um destino (`cirgrafica` ou `carbono`) via `lib/leadRouting.js`, grava o lead com `fetch('/api/lead')`/`sendBeacon` (função `logLead` em `lib/logLead.js`) e abre um link `wa.me`/`api.whatsapp.com` para o número correspondente.
3. `components/LeadPopup.js` — popup próprio de saída (exit-intent / scroll / timeout), com seu próprio formulário nome+telefone, também grava via `logLead`.
4. `pages/portfolio.js` — formulário próprio (nome, e-mail, telefone, empresa) que chama `fetch('/api/lead', …)` diretamente, redirecionando para `pages/portfolio/obrigado.js` após sucesso.

**Painel administrativo**: `pages/admin/leads.js` (React, Pages Router) consome `pages/api/admin/leads.js`, que usa o cliente `supabaseAdmin` (chave `service_role`) para consultar a tabela `leads` com filtros, paginação e ordenação. Existe também um painel estático duplicado em `public/cir-leads-dashboard.html` (ver seção 4), que consome o mesmo endpoint `/api/admin/leads` de forma independente.

**Proteção de rotas**: `middleware.js` na raiz intercepta `/admin/:path*` e `/api/admin/:path*`, exigindo HTTP Basic Auth (`ADMIN_USER`/`ADMIN_PASSWORD`) ou um cookie de sessão (`cir_session`) derivado deterministicamente da senha.

---

## 3. Rotas

### Páginas (`pages/`)

| Rota | Arquivo | Renderização | Observação |
|---|---|---|---|
| `/` | `pages/index.js` | SSG (estática) | Home institucional |
| `/portfolio` | `pages/portfolio.js` | SSG | Formulário próprio de captação (nome/e-mail/telefone/empresa) |
| `/portfolio/obrigado` | `pages/portfolio/obrigado.js` | SSG | Página de agradecimento, link de download do Google Drive |
| `/consultoria` | `pages/consultoria.js` | SSG | Landing page de consultoria |
| `/orcamento` | `pages/orcamento.js` | CSR (client-side, usa `useRouter().query`) | Quiz de qualificação de lead em 7 etapas |
| `/grafica/estado/[estado]` | `pages/grafica/estado/[estado].js` | SSG (`getStaticPaths`/`getStaticProps`, `fallback: false`) | Uma página por estado presente em `cidades.json` |
| `/grafica/[estado]/[cidade]` | `pages/grafica/[estado]/[cidade].js` | SSG (`getStaticPaths`/`getStaticProps`, `fallback: false`) | 478 páginas de cidade |
| `/admin/leads` | `pages/admin/leads.js` | CSR | Protegida por `middleware.js` |
| `/sitemap.xml` | `pages/sitemap.xml.js` | SSR (`getServerSideProps`) | Gera XML com todas as URLs estáticas + estados + cidades |
| `/404` | `pages/404.js` | SSG | Página customizada de não encontrado |

### API Routes (`pages/api/`)

| Rota | Arquivo | Método | Autenticação | Cliente Supabase usado |
|---|---|---|---|---|
| `/api/lead` | `pages/api/lead.js` | `POST` | Nenhuma | `supabase` (chave anônima, `lib/supabaseClient.js`) |
| `/api/admin/leads` | `pages/api/admin/leads.js` | `GET` | Via `middleware.js` (Basic Auth / cookie) | `supabaseAdmin` (chave `service_role`, `lib/supabaseAdmin.js`) |

`/api/lead.js` aceita e insere os campos: `phone`, `message`, `source`, `cidade`, `estado`, `page_url`, `referrer` (de `req.headers.referer`), `user_agent` (de `req.headers['user-agent']`), `customer_name`, `customer_phone`, `customer_email`, `customer_company`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `quiz_tipo_produto`, `quiz_quantidade`, `quiz_arte_pronta`, `quiz_acabamento`, `quiz_prazo`, `quiz_investimento`, `destino`. Só recusa a requisição (`400`) se `phone`, `message` ou `source` estiverem ausentes.

`/api/admin/leads.js` aceita os query params `page`, `per_page` (máx. 100), `source`, `estado`, `utm_source`, `date_from`, `date_to`, `search`, `order_by` (restrito à lista `ALLOWED_COLUMNS`), `order_dir`, `mode` (`chart` retorna até 5000 linhas sem paginação). O parâmetro `search` é interpolado diretamente numa string de filtro PostgREST (`query.or(...)`), com apenas o caractere `'` escapado (linha 38 de `pages/api/admin/leads.js`).

### Arquivo estático não roteado pelo Next.js

`public/cir-leads-dashboard.html` — arquivo HTML autocontido (669 linhas), servido diretamente pelo Vercel em `/cir-leads-dashboard.html` (fora do matcher de `middleware.js`, que só cobre `/admin/:path*` e `/api/admin/:path*`). Contém uma tela de login própria que envia um header `Authorization` (Basic Auth) para `GET /api/admin/leads`, armazena o header validado em `localStorage` (`cir_auth`) e consome o mesmo endpoint `/api/admin/leads` que o painel React. Não está referenciado por nenhum link ou import em `pages/` ou `components/`. Adicionado no mesmo commit que `pages/admin/leads.js` (`8ddb10b`).

---

## 4. Banco de dados (Supabase — projeto `cirgrafica-cidades-leads`)

### Tabela `public.leads`

RLS (Row Level Security) **habilitado**. 771 linhas no momento da leitura.

| Coluna | Tipo | Nulável |
|---|---|---|
| `id` | `uuid` (PK, default `gen_random_uuid()`) | não |
| `created_at` | `timestamptz` (default `now()`) | não |
| `phone` | `text` | não |
| `message` | `text` | não |
| `source` | `text` | não |
| `cidade` | `text` | sim |
| `estado` | `text` | sim |
| `page_url` | `text` | sim |
| `referrer` | `text` | sim |
| `user_agent` | `text` | sim |
| `customer_name` | `text` | sim |
| `customer_phone` | `text` | sim |
| `utm_source` | `text` | sim |
| `utm_medium` | `text` | sim |
| `utm_campaign` | `text` | sim |
| `utm_term` | `text` | sim |
| `utm_content` | `text` | sim |
| `customer_email` | `text` | sim |
| `customer_company` | `text` | sim |
| `quiz_tipo_produto` | `text` | sim |
| `quiz_quantidade` | `text` | sim |
| `quiz_arte_pronta` | `text` | sim |
| `quiz_acabamento` | `text` | sim |
| `quiz_prazo` | `text` | sim |
| `quiz_investimento` | `text` | sim |
| `destino` | `text` | sim |

**Política RLS**: `"Allow public insert"` — `PERMISSIVE`, role `anon`, comando `INSERT`, `qual = null`, `with_check = true`. É a única política registrada para esta tabela. Não há política de `SELECT`, `UPDATE` ou `DELETE` para o role `anon`.

### Tabela `public.neuroclinica_leads`

Presente no mesmo projeto Supabase. RLS habilitado, 1 linha. Política `"neuroclinica_leads_public_insert"` — `PERMISSIVE`, role `anon`, comando `INSERT`, `with_check = true`. Pertence a outra aplicação (`brasilianeuroclinica`), que compartilha este mesmo projeto Supabase; não faz parte do código-fonte deste repositório.

### Clientes Supabase no código

- `lib/supabaseClient.js` — instancia `createClient(SUPABASE_URL, SUPABASE_ANON_KEY)`, exporta `null` se as variáveis não estiverem definidas. Usado em `pages/api/lead.js`.
- `lib/supabaseAdmin.js` — instancia `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })`, exporta `null` se as variáveis não estiverem definidas. Usado exclusivamente em `pages/api/admin/leads.js`.

---

## 5. Configurações

### Variáveis de ambiente

Referenciadas via `process.env` no código (arquivo `.env.example` na raiz lista os nomes, sem valores):

| Variável | Onde é lida |
|---|---|
| `SUPABASE_URL` | `lib/supabaseClient.js`, `lib/supabaseAdmin.js` |
| `SUPABASE_ANON_KEY` | `lib/supabaseClient.js` |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabaseAdmin.js` |
| `ADMIN_USER` | `middleware.js` |
| `ADMIN_PASSWORD` | `middleware.js` |
| `ANTHROPIC_API_KEY` | `scripts/generate-city-content.js` (script offline) |
| `CITY_LIMIT` | `scripts/generate-city-content.js` (opcional, limita quantas cidades processar) |

No ambiente Vercel (`brunostersas-projects/cir`), as variáveis `ADMIN_PASSWORD`, `ADMIN_USER`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY` e `SUPABASE_URL` estão configuradas com escopo `Preview` e `Production`.

### `.gitignore`

Ignora `/node_modules`, `/.pnp`, `.pnp.js`, `/coverage`, `/.next/`, `/out/`, `/build`, `.DS_Store`, `*.pem`, logs de debug (`npm-debug.log*`, `yarn-debug.log*`, `yarn-error.log*`), `.env*.local`, `.vercel`, `/local-docs/`, `*.tsbuildinfo`, `next-env.d.ts`. O arquivo `.env.local` nunca foi commitado no histórico do git (confirmado via `git log --all -- .env.local`); apenas `.env.example` (sem valores reais) está versionado.

### `middleware.js`

Matcher: `['/admin/:path*', '/api/admin/:path*']`. Implementa Basic Auth comparando diretamente `user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASSWORD`. Em caso de sucesso, define um cookie `cir_session` (`httpOnly`, `sameSite: strict`, `maxAge` de 8 horas) cujo valor é gerado por uma função hash determinística (`makeToken`) aplicada à senha concatenada com uma string fixa (`'cir_admin_v1'`). Não há limite de tentativas nem atraso entre tentativas de autenticação.

### `next.config.js`

Não existe no repositório — Next.js roda com todas as configurações padrão (sem headers customizados, sem redirects/rewrites, sem CSP definida a nível de framework).

### `vercel.json`

Não existe no repositório.

### `tailwind.config.js` / `postcss.config.js`

Tailwind configurado com `content` apontando para `./pages/**/*.{js,ts,jsx,tsx}` e `./components/**/*.{js,ts,jsx,tsx}`, sem tema customizado nem plugins. PostCSS usa `tailwindcss` e `autoprefixer`.

### `public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://cidades.cirgrafica.com.br/sitemap.xml
Crawl-delay: 1
```

### Deployment Protection (Vercel)

Projeto `cir` (ID `prj_LjEb5FICiKPh6rNyrI3aLbAguIh7`, org `team_bIn6T3YMovn4WZfz4zIOcbjt`): `ssoProtection` configurado como `null` (nenhuma autenticação Vercel exigida para acessar deployments, incluindo Preview) no momento da leitura desta auditoria.

### Domínio de produção

`https://cidades.cirgrafica.com.br` (mencionado em metatags `canonical`/`og:url` nas páginas e em `pages/sitemap.xml.js`).

---

## 6. Validação de dados (client-side)

`lib/leadValidation.js` define `getNameError` (rejeita nome vazio ou com menos de 2 caracteres) e `getPhoneError` (rejeita telefone com menos de 10 dígitos após remover não-dígitos). Ambas as funções rodam no navegador, antes do `fetch`/`sendBeacon` para `/api/lead`. Não há validação equivalente no lado servidor (`pages/api/lead.js` só verifica presença de `phone`, `message` e `source`, sem checar formato).

`lib/phone.js` formata a digitação do campo de telefone no padrão `(XX) 99999-9999`, mas apenas para exibição — não afeta o valor enviado a `customer_phone` (que é o resultado de `phone.replace(/\D/g, '')`).

---

*Fim do documento. Gerado por leitura estática do código — nenhuma opinião, classificação de risco ou recomendação foi incluída neste arquivo.*
