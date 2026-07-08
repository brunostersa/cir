import { NextResponse } from 'next/server'

export function middleware(req) {
  const auth = req.headers.get('authorization')

  if (auth?.startsWith('Basic ')) {
    const decoded = atob(auth.split(' ')[1])
    const separatorIndex = decoded.indexOf(':')
    const user = decoded.slice(0, separatorIndex)
    const pass = decoded.slice(separatorIndex + 1)

    if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASSWORD) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Autenticação necessária', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Dashboard CIR"' },
  })
}

export const config = {
  matcher: ['/admin/:path*'],
}
