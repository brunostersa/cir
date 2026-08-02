import { NextResponse } from 'next/server'
import { peekLimit, recordAttempt, resetLimit } from './lib/rateLimit'

const COOKIE = 'cir_session'
const SESSION_TTL_MS = 8 * 60 * 60 * 1000 // 8 horas
const LOGIN_ATTEMPT_LIMIT = 5
const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000 // 15 minutos

const encoder = new TextEncoder()

function toBase64Url(bytes) {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + ((4 - (str.length % 4)) % 4), '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function getKey(secret) {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
}

async function signSessionToken(exp, secret) {
  const payload = toBase64Url(encoder.encode(JSON.stringify({ exp })))
  const key = await getKey(secret)
  const sigBytes = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)))
  return `${payload}.${toBase64Url(sigBytes)}`
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

async function verifySessionToken(token, secret) {
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [payload, sig] = parts
  const key = await getKey(secret)
  const expectedSigBytes = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)))
  const expectedSig = toBase64Url(expectedSigBytes)
  if (!constantTimeEqual(sig, expectedSig)) return false

  try {
    const { exp } = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)))
    return typeof exp === 'number' && exp > Date.now()
  } catch {
    return false
  }
}

function getClientIp(req) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.ip || 'unknown'
}

export async function middleware(req) {
  const secret = process.env.ADMIN_SESSION_SECRET

  // sessão já autenticada (cookie assinado) — não passa pelo bloqueio de tentativas,
  // pois o token não é adivinhável por força bruta como uma senha.
  const session = req.cookies.get(COOKIE)
  if (secret && session?.value && (await verifySessionToken(session.value, secret))) {
    return NextResponse.next()
  }

  const ip = getClientIp(req)
  const lockKey = `admin-auth:${ip}`

  const { blocked, retryAfterMs } = peekLimit(lockKey, { limit: LOGIN_ATTEMPT_LIMIT, windowMs: LOGIN_ATTEMPT_WINDOW_MS })
  if (blocked) {
    return new NextResponse('Muitas tentativas. Tente novamente mais tarde.', {
      status: 429,
      headers: { 'Retry-After': Math.ceil(retryAfterMs / 1000).toString() },
    })
  }

  const auth = req.headers.get('authorization')
  if (auth?.startsWith('Basic ')) {
    const decoded = atob(auth.split(' ')[1])
    const sep = decoded.indexOf(':')
    const user = decoded.slice(0, sep)
    const pass = decoded.slice(sep + 1)

    if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASSWORD) {
      resetLimit(lockKey)

      if (!secret) {
        // sem ADMIN_SESSION_SECRET configurado, não há como emitir um cookie assinado —
        // segue sem cookie de sessão, exigindo Basic Auth a cada requisição.
        return NextResponse.next()
      }

      const res = NextResponse.next()
      const token = await signSessionToken(Date.now() + SESSION_TTL_MS, secret)
      res.cookies.set(COOKIE, token, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: SESSION_TTL_MS / 1000,
      })
      return res
    }

    // credencial incorreta: conta como tentativa falha
    const { allowed, retryAfterMs: nextRetry } = recordAttempt(lockKey, { limit: LOGIN_ATTEMPT_LIMIT, windowMs: LOGIN_ATTEMPT_WINDOW_MS })
    if (!allowed) {
      return new NextResponse('Muitas tentativas. Tente novamente mais tarde.', {
        status: 429,
        headers: { 'Retry-After': Math.ceil(nextRetry / 1000).toString() },
      })
    }
  }

  return new NextResponse('Autenticação necessária', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Dashboard CIR"' },
  })
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
