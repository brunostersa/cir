# Plano de Ação — cidades.cirgrafica.com.br (projeto `cir`)

Correções para os achados de `relatorio-seguranca.md`, ordenadas do mais crítico ao mais leve. Cada item é dividido em passos pequenos, cada um com um teste objetivo de verificação — nenhum passo depende de terminar todos os outros do mesmo item para ser testável isoladamente.

---

## 1. (ALTO — A1) Proteger o login do admin contra força bruta ✅ Concluído

- [x] **1.1** Implementado com um contador em memória por instância (`lib/rateLimit.js`) — a alternativa mais simples citada no plano original, sem depender de conta nova em Vercel KV/Upstash. **Ressalva**: em produção na Vercel, esse contador não é garantido entre invocações frias ou múltiplas regiões; é uma proteção real, mas não tão forte quanto um armazenamento externo compartilhado.
  **Teste realizado**: `curl` com credenciais erradas repetidas contra `/admin/leads` local.
- [x] **1.2** `middleware.js` incrementa um contador de falhas por IP a cada tentativa malsucedida (`recordAttempt`).
  **Teste realizado**: 5 tentativas com senha errada retornaram `401`.
- [x] **1.3** A 6ª tentativa (mesmo IP, dentro da janela) retorna `429`.
  **Teste realizado**: confirmado via `curl` — 6ª tentativa errada = `429`; tentativa subsequente com a senha *correta*, ainda dentro do lockout, também retornou `429` (bloqueio vale para qualquer tentativa, certa ou errada).
- [x] **1.4** Login bem-sucedido reseta o contador daquele IP (`resetLimit`); a janela de bloqueio expira sozinha após 15 minutos (implementado em `peekLimit`/`recordAttempt`).
  **Teste realizado**: reiniciar o processo (equivalente a expirar a janela) e confirmar que a senha correta volta a autenticar normalmente.

## 2. (ALTO — A2) Substituir o token de sessão do admin por um esquema com expiração validada no servidor ✅ Concluído

- [x] **2.1** Nova variável `ADMIN_SESSION_SECRET` gerada (32 bytes aleatórios) e adicionada em `.env.local`, `.env.example` (placeholder) e no Vercel (Preview + Production) via API, sem nunca aparecer em texto no chat ou em comandos.
  **Teste realizado**: `git status` confirma que só `.env.example` (sem valor) está rastreado; `vercel env ls` confirma a variável presente nos dois ambientes.
- [x] **2.2** `makeToken()` substituída por assinatura HMAC-SHA256 via Web Crypto API (`crypto.subtle`, compatível com Edge Runtime), payload inclui `exp` (timestamp de expiração).
  **Teste realizado**: cookie emitido no login tem formato `<payload base64url>.<assinatura base64url>` e contém um `exp` codificado.
- [x] **2.3** Validação do cookie agora verifica a assinatura (comparação a tempo constante) e se `exp` já passou; cookie adulterado (`tampered.value`) foi rejeitado com `401`.
  **Teste realizado**: `curl` com `Cookie: cir_session=tampered.value` retornou `401`.
- [x] **2.4** Cookie válido reutilizado sem enviar Basic Auth novamente retornou `200`.
  **Teste realizado**: login uma vez, depois requisição só com o cookie salvo — `200 OK`.

## 3. (MÉDIO — M1) Adicionar CAPTCHA/Turnstile nos formulários públicos ⏸️ Pendente — depende do usuário

Bloqueado no passo 3.1: precisa de uma conta/site criado pelo usuário no Cloudflare Turnstile ou hCaptcha (não pode ser feito por mim). Os passos 3.2–3.4 seguem sem alteração, aguardando essa chave.

- [ ] **3.1** Criar uma conta/site no Cloudflare Turnstile (ou hCaptcha) e obter as chaves de site e secret.
  **Teste**: chaves de teste funcionando localmente num HTML isolado antes de integrar ao projeto.
- [ ] **3.2** Adicionar o widget do Turnstile ao formulário de contato de `pages/orcamento.js` (etapa `contato`).
  **Teste**: o widget renderiza visualmente na página em `/orcamento` e gera um token ao ser resolvido.
- [ ] **3.3** Repetir a integração em `components/LeadPopup.js` e no formulário de `pages/portfolio.js`.
  **Teste**: os três formulários exibem o widget e cada um gera seu próprio token por submissão.
- [ ] **3.4** Em `pages/api/lead.js`, validar o token recebido contra a API do Turnstile antes de inserir no banco; rejeitar com `400`/`403` se inválido ou ausente.
  **Teste**: enviar uma requisição direta a `/api/lead` sem o campo do token e confirmar que é recusada; enviar com um token válido (gerado pela UI) e confirmar que é aceita.

## 4. (MÉDIO — M2) Rate limiting no endpoint público `POST /api/lead` ✅ Concluído

- [x] **4.1** Limite definido: 10 submissões por IP a cada 10 minutos (`pages/api/lead.js`), reaproveitando `lib/rateLimit.js` do item 1. Mesma ressalva de memória-por-instância do item 1.1 se aplica aqui.
- [x] **4.2** Limite aplicado antes do `insert`, retornando `429` (com header `Retry-After`) quando excedido.
  **Teste realizado**: 11 requisições válidas em sequência — as 10 primeiras retornaram `200`, a 11ª retornou `429`.
- [x] **4.3** Confirmado que o limite não atrapalha o uso normal (10 é bem acima de uma única submissão de quiz).
  **Teste realizado**: submissão isolada válida retornou `200` normalmente.

## 5. (MÉDIO — M3) Validação de formato no lado servidor em `/api/lead` ✅ Concluído

- [x] **5.1** `lib/leadValidation.js` já era isomórfico (funções puras, sem API de navegador) — reaproveitado diretamente, sem necessidade de extrair nada novo.
- [x] **5.2** `pages/api/lead.js` agora chama `getNameError`/`getPhoneError` antes do `insert`, retornando `400` com a mensagem quando `customer_name`/`customer_phone` estão presentes mas inválidos.
  **Teste realizado**: `customer_name: "a"` → `400 {"error":"Nome muito curto"}`; `customer_phone: "123"` → `400 {"error":"Telefone incompleto — inclua o DDD"}`; dados válidos → `200`.
- [x] **5.3** Confirmado que o caso válido continua funcionando (mesmo teste acima).

## 6. (MÉDIO — M4) Corrigir a interpolação do parâmetro `search` no filtro PostgREST ✅ Concluído

- [x] **6.1** Implementado envolvendo o valor em aspas duplas (com `\` e `"` escapados) — a forma documentada pelo PostgREST para tratar comas/parênteses como texto literal — em vez de reescrever com `.ilike()` encadeado.
- [x] **6.2** Testado com `search` contendo vírgula, parêntese e aspas dupla: todas as três chamadas retornaram `200` com resultado coerente (`{"data":[],"count":0}`), sem erro 500 e sem retornar todos os registros.

## 7. (BAIXO — B1) Remover o painel estático duplicado ✅ Concluído

- [x] **7.1** Confirmado por leitura do código que `pages/admin/leads.js` consome o mesmo endpoint (`/api/admin/leads`) e cobre as mesmas funcionalidades (filtros, paginação, exportação CSV) que o painel estático.
- [x] **7.2** `public/cir-leads-dashboard.html` removido do repositório (`git rm`).
  **Teste realizado**: `GET /cir-leads-dashboard.html` local retorna `404`.

## 8. (BAIXO/Informativo — B2) Revisar a desativação da proteção do Vercel ⏸️ Pendente — depende do usuário

- [ ] **8.1** Decidir, junto com o time, se a proteção deve ser reativada após a fase de testes do cliente na branch `homolog`.
  **Teste**: decisão registrada (ex: neste próprio plano ou em conversa) com uma data prevista para reavaliação.
- [ ] **8.2** Se reativar, configurar o escopo como "somente Preview" (não produção), para não recriar o problema de o cliente precisar de login para testar.
  **Teste**: acessar uma URL de Preview sem estar logado no Vercel e confirmar se o comportamento é o esperado pela decisão tomada em 8.1.

---

*Ordem sugerida de execução: itens 1 e 2 primeiro (protegem dados de 771+ leads via o painel admin), depois 3–6 (protegem o formulário público e a consulta administrativa), por fim 7–8 (redução de superfície e decisão operacional).*
