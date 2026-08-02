# Relatório de Segurança — cidades.cirgrafica.com.br (projeto `cir`)

Baseado em `auditoria.md` e verificado diretamente no código-fonte em `/Users/brunostersa/Documents/projetos-bs/cidadescir`, mais consultas ao projeto Supabase `cirgrafica-cidades-leads` e ao projeto Vercel `cir`, em 2026-07-24.

Metodologia: cada afirmação abaixo aponta o arquivo e a linha onde foi verificada. Onde não foi possível confirmar diretamente no código ou em configuração acessível, está marcado **NÃO VERIFICÁVEL**. Nenhum segredo é reproduzido neste documento — valores sensíveis são mascarados ou apenas localizados por nome de variável.

---

## Achados por severidade

### 🔴 ALTO

#### A1. Autenticação do painel administrativo sem proteção contra força bruta
**Onde**: `middleware.js`, linhas 13–47.

O middleware compara `user`/`pass` recebidos via HTTP Basic Auth diretamente contra `process.env.ADMIN_USER` / `process.env.ADMIN_PASSWORD` (linha 31), sem qualquer contador de tentativas, atraso incremental (backoff) ou bloqueio temporário por IP. Não há uso de nenhuma biblioteca de rate limiting no projeto (confirmado por busca por `rate-limit|upstash|express-rate` em todo o código — nenhuma ocorrência). Isso significa que um atacante pode tentar credenciais indefinidamente, sem qualquer barreira automática, contra o endpoint que protege `/admin/leads` e `/api/admin/leads` — que expõem nome, telefone, e-mail e respostas de qualificação de 771+ leads.

#### A2. Token de sessão do admin derivado de hash fraco e sem expiração validada no servidor
**Onde**: `middleware.js`, linhas 3–11 (`makeToken`) e linhas 17–21.

`makeToken` gera o valor do cookie `cir_session` a partir de um hash bit a bit (`hash << 5 - hash + charCode`) da string `senha + 'cir_admin_v1'` — não é HMAC, não usa uma chave secreta dedicada, e não incorpora um timestamp de expiração. A validação da sessão (linha 19) apenas compara `session.value === expectedToken`, onde `expectedToken` é recalculado a partir da senha atual. Consequência verificada no código: o cookie tem `maxAge: 60 * 60 * 8` (linha 37, 8 horas) — mas esse é um atributo do cookie, interpretado pelo *navegador*; o servidor não guarda nem valida nenhuma informação de tempo de emissão. Se o valor do cookie for capturado por qualquer meio antes de o navegador descartá-lo (ou se o atacante simplesmente definir o mesmo cookie manualmente, já que ele é 100% determinístico a partir da senha), ele continua válido para sempre, sem possibilidade de revogação a não ser trocando `ADMIN_PASSWORD`.

### 🟠 MÉDIO

#### M1. Nenhum CAPTCHA/Turnstile/hCaptcha nos formulários públicos
**Onde**: busca em todo o repositório por `captcha|turnstile|hcaptcha` — nenhuma ocorrência. `package.json` não lista nenhuma dependência de captcha.

Confirmado nos três pontos de captura de lead expostos publicamente:
- `pages/orcamento.js` (etapa `contato`, formulário em torno da linha 270–304)
- `components/LeadPopup.js` (formulário, linhas 90–135)
- `pages/portfolio.js` (formulário, a partir da linha 124)

Nenhum deles inclui verificação de desafio anti-bot antes de enviar para `/api/lead`.

#### M2. Nenhum rate limiting no endpoint público `POST /api/lead`
**Onde**: `pages/api/lead.js`, arquivo inteiro (50 linhas) — não há nenhuma verificação de taxa de requisições, IP ou origem antes do `insert`.

Combinado com M1 e com a política RLS `"Allow public insert"` (`with_check: true`, sem nenhuma restrição — verificado via `pg_policies` no Supabase, tabela `leads`), o endpoint aceita volume ilimitado de inserções vindas de qualquer origem, sem exigir que os dados venham de fato do formulário do site.

#### M3. Falta de validação de formato no lado servidor em `/api/lead`
**Onde**: `pages/api/lead.js`, linhas 20–22.

A única validação é `if (!phone || !message || !source) return res.status(400)...` — checa apenas presença, não formato. As regras existentes em `lib/leadValidation.js` (`getNameError`, `getPhoneError`) rodam **somente no navegador** (importadas em `pages/orcamento.js` e `components/LeadPopup.js`, nunca em `pages/api/lead.js`). Uma requisição enviada diretamente ao endpoint (sem passar pela UI) pode gravar `customer_name`, `customer_phone`, `phone` (número de destino) e os campos `quiz_*` com qualquer conteúdo.

#### M4. Entrada de usuário interpolada em filtro PostgREST sem sanitização completa
**Onde**: `pages/api/admin/leads.js`, linhas 37–39:
```js
if (search) {
  const s = search.replace(/'/g, "''")
  query = query.or(`customer_name.ilike.%${s}%,customer_phone.ilike.%${s}%,customer_email.ilike.%${s}%`)
}
```
O parâmetro `search` (vindo de `req.query.search`) é inserido diretamente numa string de filtro do PostgREST (sintaxe usada pelo método `.or()` do `supabase-js`), com apenas o caractere `'` escapado. A sintaxe de filtro do PostgREST usa vírgula para separar condições e parênteses/pontos para operadores — nenhum desses caracteres é escapado ou removido. Isso é uma classe de vulnerabilidade verificada no código-fonte (interpolação de entrada não confiável numa string de query estruturada). **Ressalva sobre impacto**: este endpoint já exige autenticação válida via `middleware.js` e, mesmo sem qualquer manipulação de filtro, já retorna todos os leads sem qualquer restrição por usuário — ou seja, o impacto confirmado hoje se limita a um administrador já autenticado conseguir alterar o comportamento da própria consulta (por exemplo, gerar erros de query), não a escalonamento de privilégio ou vazamento cross-tenant, pois não existe segregação por tenant/usuário nesta tabela.

### 🟡 BAIXO

#### B1. Painel administrativo duplicado, publicamente acessível como arquivo estático
**Onde**: `public/cir-leads-dashboard.html` (669 linhas).

Por estar em `public/`, este arquivo é servido pelo Next.js/Vercel em `/cir-leads-dashboard.html` **sem passar pelo `middleware.js`**, cujo `matcher` (linha 50 do `middleware.js`) cobre apenas `/admin/:path*` e `/api/admin/:path*` — um arquivo estático fora dessas rotas não é interceptado. O HTML em si não contém nenhuma chave ou segredo embutido (verificado: nenhuma ocorrência de `SUPABASE`, `apikey` com valor, ou `service_role` no arquivo); ele apenas envia um header `Authorization` para `GET /api/admin/leads`, endpoint que continua protegido pelo middleware. Portanto, sem credenciais válidas de admin, o formulário de login desta página não retorna dados. O arquivo não é referenciado por nenhum link, import ou componente em `pages/` ou `components/` (confirmado por busca) — é código órfão, adicionado no mesmo commit que criou `pages/admin/leads.js` (`8ddb10b`, ver `git log`).

#### B2. Vercel Deployment Protection (SSO) desativada globalmente no projeto
**Onde**: configuração do projeto Vercel `cir` (`prj_LjEb5FICiKPh6rNyrI3aLbAguIh7`) — campo `ssoProtection: null`, confirmado via API do Vercel nesta mesma sessão.

Esta configuração foi alterada intencionalmente, a pedido explícito do usuário nesta sessão, para permitir que um cliente testasse a branch `homolog` sem precisar de login no Vercel. Efeito verificado: qualquer deployment do projeto (incluindo Previews de qualquer branch) fica acessível a quem tiver a URL, sem exigir autenticação do Vercel. As rotas `/admin/*` e `/api/admin/*` continuam protegidas pelo `middleware.js` da própria aplicação (item independente da proteção do Vercel).

---

## Verificado — sem achado

| Item verificado | Resultado | Evidência |
|---|---|---|
| Segredos escritos diretamente no código | Nenhum encontrado | Busca por padrões de chave (`sk-`, `service_role` com valor, `AIza…`, `AKIA…`) em todo `.js`/`.json` do projeto (exceto `node_modules`) — todas as ocorrências de variáveis sensíveis usam `process.env.*` |
| `.gitignore` cobre arquivos de ambiente | Correto | `.gitignore` linha `.env*.local`; confirmado via `git log --all -- .env.local` que o arquivo nunca foi commitado; apenas `.env.example` (sem valores) está versionado |
| Injeção de SQL clássica (concatenação de string em query SQL bruta) | Não encontrada | Todo acesso a dados usa métodos do `supabase-js` (`.select`, `.insert`, `.eq`, `.gte`, `.lt`, `.range`, `.order`) — não localizada nenhuma query SQL montada por concatenação de string. Exceção relevante já reportada em **M4** (filtro PostgREST via `.or()`, categoria de injeção distinta de SQL bruto) |
| IDOR (troca de ID na URL expõe dado de outra conta) | Não aplicável neste desenho de sistema | Não existe conceito de conta de usuário final nem endpoint que aceite um `id` de registro para retornar um único lead (`/api/admin/leads` é uma listagem com filtros, não uma busca por ID). Não há, portanto, uma superfície de teste para o padrão clássico de IDOR entre contas |
| Uso do `service_role` (chave admin do Supabase) fora do servidor | Não encontrado | Busca por `supabaseAdmin` no projeto — só aparece em `lib/supabaseAdmin.js` (definição) e `pages/api/admin/leads.js` (uso), ambos server-side; nunca importado em `components/` ou em código enviado ao navegador |

---

*Este relatório reflete o estado do código e das configurações no momento da leitura. Ver `plano-de-acao.md` para as correções sugeridas.*
