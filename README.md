# CIR Gráfica — Site SEO Local (cidades.cirgrafica.com.br)

Site de SEO local da CIR Gráfica: gera uma página por cidade/estado atendido (ex: "gráfica em Goiânia"), captura leads via WhatsApp e salva tudo no Supabase.

## Funcionalidades

- **478 páginas de cidade** + **27 páginas de estado**, geradas estaticamente (`getStaticPaths`/`getStaticProps`) a partir de `cidades.json`
- **Captura de lead unificada**: todo botão de WhatsApp do site (header, footer, CTAs, FAB, popup de saída, barra sticky mobile) abre um modal pedindo nome + WhatsApp (com máscara e validação) antes de redirecionar — tudo salvo no Supabase, incluindo UTM de origem
- **`/portfolio`**: página própria de captura de lead (nome/e-mail/WhatsApp/empresa) que substitui o antigo link externo de download de portfólio
- **`/admin/leads`**: dashboard protegido por senha (Basic Auth via `middleware.js`) com gráfico de leads por dia/semana/mês, ranking por origem/estado/UTM e tabela de leads recentes
- **Popup de saída (exit-intent)** e **barra sticky mobile** nas páginas de cidade, com captura de lead embutida
- **Sitemap.xml dinâmico** e `robots.txt`, com meta tags completas (OpenGraph, Twitter Card, geo tags, Schema.org LocalBusiness/FAQPage) em todas as páginas

## Stack

- **Next.js 14** (Pages Router), sem TypeScript
- **Design system próprio** em `styles/cir-ds.css` (CSS custom properties + classes `cir-`/`cp-`, sem Tailwind apesar de instalado) — fontes Josefin Sans (sans) e Courier Prime (serif), paleta escura com acento laranja
- **Supabase** (Postgres) para a tabela `leads`
- `/consultoria` é uma landing page à parte com estilos próprios (alias das variáveis do design system global — ver comentário no topo do arquivo)

## Estrutura do projeto

```
cidadescir/
├── pages/
│   ├── index.js                        # Home
│   ├── consultoria.js                  # LP separada (consultoria gráfica)
│   ├── portfolio.js / portfolio/obrigado.js
│   ├── admin/leads.js                  # Dashboard de leads (protegido)
│   ├── api/lead.js                     # Recebe e grava leads no Supabase
│   ├── sitemap.xml.js
│   └── grafica/
│       ├── [estado]/[cidade].js        # Página de cidade
│       └── estado/[estado].js          # Página de estado
├── components/
│   ├── WhatsAppLink.js                 # Botão que abre o modal de captura
│   ├── WhatsAppModalProvider.js        # Modal global (nome/WhatsApp) + envio
│   ├── LeadPopup.js                    # Popup de saída (exit-intent)
│   ├── StickyMobileCTA.js
│   └── ...
├── lib/
│   ├── supabaseClient.js / supabaseAdmin.js
│   ├── logLead.js, leadValidation.js, leadStats.js
│   ├── phone.js (máscara), utm.js (captura/persistência de UTM)
├── middleware.js                       # Basic Auth para /admin
├── cidades.json                        # Dados de cidade/estado (fonte única)
└── local-docs/                         # Docs internos/soltos, fora do git
```

## Rodando localmente

```bash
npm install
npm run dev
```

Copie `.env.example` para `.env.local` e preencha:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_USER=
ADMIN_PASSWORD=
```

- `SUPABASE_URL` + `SUPABASE_ANON_KEY`: usados por `pages/api/lead.js` para gravar leads (RLS permite só `INSERT` público).
- `SUPABASE_SERVICE_ROLE_KEY`: usado só no servidor, por `pages/admin/leads.js`, pra ler os leads (ignora RLS).
- `ADMIN_USER` / `ADMIN_PASSWORD`: credenciais do `/admin/leads`.

Essas mesmas variáveis precisam estar configuradas no provedor de deploy (Vercel etc.) para **Production** — sem elas o build ainda passa (os clients degradam para `null` em vez de quebrar), mas a captura de lead e o dashboard não funcionam.

## Adicionar novas cidades

Edite `cidades.json`, adicionando `{ "cidade": "Nome", "estado": "UF" }`. As rotas usam `utils/normalize.js` (remove acentos/espaços) para gerar o slug — o mesmo normalizador é usado pelo `sitemap.xml.js`, então as URLs do sitemap sempre batem com as rotas reais.

## Deploy

Vercel é o alvo padrão (domínio `cidades.cirgrafica.com.br`). Lembre de configurar as variáveis de ambiente (acima) antes do primeiro deploy, e rodar um novo deploy sempre que elas mudarem.
