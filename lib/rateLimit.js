// Limitador em memória, por processo. Funciona bem numa instância única/quente,
// mas não é garantido entre invocações frias ou múltiplas regiões (ver plano-de-acao.md, itens 1 e 4).
const buckets = new Map()

function getBucket(key, windowMs) {
  const now = Date.now()
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) {
      if (now - b.windowStart > b.windowMs) buckets.delete(k)
    }
  }
  let bucket = buckets.get(key)
  if (!bucket || now - bucket.windowStart > windowMs) {
    bucket = { count: 0, windowStart: now, windowMs }
    buckets.set(key, bucket)
  }
  return bucket
}

// Consulta se a chave já está bloqueada, sem contar uma nova tentativa.
export function peekLimit(key, { limit, windowMs }) {
  const bucket = buckets.get(key)
  const now = Date.now()
  if (!bucket || now - bucket.windowStart > windowMs) {
    return { blocked: false, retryAfterMs: 0 }
  }
  return { blocked: bucket.count >= limit, retryAfterMs: Math.max(0, bucket.windowStart + windowMs - now) }
}

// Conta uma tentativa (sucesso ou falha) e diz se ainda está dentro do limite.
export function recordAttempt(key, { limit, windowMs }) {
  const bucket = getBucket(key, windowMs)
  bucket.count += 1
  const now = Date.now()
  return {
    allowed: bucket.count <= limit,
    retryAfterMs: Math.max(0, bucket.windowStart + windowMs - now),
  }
}

export function resetLimit(key) {
  buckets.delete(key)
}
