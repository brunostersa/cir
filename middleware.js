import { NextResponse } from 'next/server'

function makeToken(pass) {
  // simple deterministic token from the password — edge-runtime safe (no crypto module)
  let hash = 0
  const s = pass + 'cir_admin_v1'
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0
  }
  return Math.abs(hash).toString(36) + s.length.toString(36)
}

export function middleware(req) {
  const COOKIE = 'cir_session'

  // check existing session cookie first (for client-side API calls)
  const session = req.cookies.get(COOKIE)
  const expectedToken = makeToken(process.env.ADMIN_PASSWORD || '')
  if (session?.value === expectedToken) {
    return NextResponse.next()
  }

  // check Basic Auth
  const auth = req.headers.get('authorization')
  if (auth?.startsWith('Basic ')) {
    const decoded = atob(auth.split(' ')[1])
    const sep = decoded.indexOf(':')
    const user = decoded.slice(0, sep)
    const pass = decoded.slice(sep + 1)

    if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASSWORD) {
      const res = NextResponse.next()
      res.cookies.set(COOKIE, makeToken(pass), {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 8, // 8 horas
      })
      return res
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
